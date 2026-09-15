"""Recover GitHub job timeouts without restarting deliberately cancelled runs."""
from __future__ import annotations

import json
import os
from pathlib import Path
import re
import time
from urllib.request import Request, urlopen

REFRESH_WORKFLOWS = frozenset({
    "Update All Data - KST 21:03",
    "Update All Data - KST 21:10",
    "Update All Data - KST 21:17",
})
TIMEOUT_MESSAGE = "exceeded the maximum execution time"


def eligible_run(event, repository):
    run = event.get("workflow_run") or {}
    return (
        event.get("action") == "completed"
        and event.get("repository", {}).get("full_name") == repository
        and run.get("head_repository", {}).get("full_name") == repository
        and run.get("head_branch") == "main"
        and run.get("name") in REFRESH_WORKFLOWS
        and run.get("status") == "completed"
        and run.get("conclusion") == "cancelled"
        and isinstance(run.get("id"), int) and run["id"] > 0
    )


def is_update_job(job):
    return job.get("name", "").split(" / ")[-1] == "update" and job.get("conclusion") == "cancelled"


def is_timeout(job, annotations):
    return is_update_job(job) and any(
        TIMEOUT_MESSAGE in str(annotation.get("message", "")).lower()
        for annotation in annotations
    )


class GitHub:
    def __init__(self, repository, token):
        if not re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", repository):
            raise ValueError("Invalid repository identity")
        self.base = f"https://api.github.com/repos/{repository}"
        self.token = token

    def request(self, path, payload=None):
        body = None if payload is None else json.dumps(payload).encode("utf-8")
        for attempt in range(3):
            try:
                request = Request(self.base + path, data=body, headers={
                    "Authorization": f"Bearer {self.token}",
                    "Accept": "application/vnd.github+json",
                    "X-GitHub-Api-Version": "2022-11-28",
                })
                with urlopen(request, timeout=30) as response:
                    content = response.read()
                    return json.loads(content) if content else None
            except Exception:
                if attempt == 2:
                    raise
                time.sleep((attempt + 1) * 30)

    def pages(self, path, key=None):
        result = []
        for page in range(1, 21):
            response = self.request(f"{path}?per_page=100&page={page}")
            items = response[key] if key else response
            result.extend(items)
            if len(items) < 100:
                return result
        raise RuntimeError("Unexpectedly large GitHub response; refusing an uncertain recovery")

    def annotations(self, job):
        # Never fetch an arbitrary URL supplied by an API result.
        match = re.fullmatch(re.escape(self.base) + r"/check-runs/(\d+)", job.get("check_run_url", ""))
        if not match:
            raise ValueError("Unexpected check-run identity")
        return self.pages(f"/check-runs/{match[1]}/annotations")


def recover(event, repository, github, sleep=time.sleep):
    if not eligible_run(event, repository):
        print("No timeout recovery: this is not an eligible cancelled publication run.")
        return False
    run_id = event["workflow_run"]["id"]
    jobs = github.pages(f"/actions/runs/{run_id}/jobs", key="jobs")
    timed_out = any(is_timeout(job, github.annotations(job)) for job in jobs if is_update_job(job))
    if not timed_out:
        print("No GitHub timeout annotation; leave the cancelled run stopped.")
        return False
    print(f"Confirmed GitHub update-job timeout in run {run_id}; recovery will queue in five minutes.", flush=True)
    sleep(300)
    github.request("/actions/workflows/update-all-data-backup-2.yml/dispatches", {"ref": "main"})
    print("Queued guarded recovery after confirmed GitHub job timeout.", flush=True)
    return True


def main():
    repository = os.environ["GITHUB_REPOSITORY"]
    event = json.loads(Path(os.environ["GITHUB_EVENT_PATH"]).read_text(encoding="utf-8"))
    recover(event, repository, GitHub(repository, os.environ["GH_TOKEN"]))


if __name__ == "__main__":
    main()
