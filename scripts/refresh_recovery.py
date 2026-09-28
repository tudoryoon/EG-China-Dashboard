"""Queue one current recovery under the workflows' shared recovery lock.

Step outcomes opt in to this script; failed tests, setup and validators never do.
The lock serializes both regular failure recovery and GitHub timeout recovery.
The remote checks run *after* backoff so older failures cannot revive a chain
already replaced by a scheduled, manual or recovery publication run.
"""
from __future__ import annotations

from datetime import datetime
import os
import re
import time

REFRESH_WORKFLOWS = frozenset({
    "Update All Data - KST 21:03",
    "Update All Data - KST 21:10",
    "Update All Data - KST 21:17",
})
REFRESH_FILES = (
    "update-asia-screening.yml", "update-all-data-backup-1.yml", "update-all-data-backup-2.yml",
)
ACTIVE_STATUSES = frozenset({"queued", "in_progress", "waiting", "pending", "requested"})
RECOVERY_DELAY_SECONDS = 300


def publication_run(run, repository):
    return (run.get("name") in REFRESH_WORKFLOWS
            and not str(run.get("display_title", "")).endswith(" [check-only]")
            and run.get("head_branch") == "main"
            and run.get("head_repository", {}).get("full_name") == repository
            and isinstance(run.get("id"), int) and run["id"] > 0)


def run_order(run):
    created = datetime.fromisoformat(run["created_at"].replace("Z", "+00:00"))
    if created.tzinfo is None:
        raise ValueError("GitHub run timestamp must include a timezone")
    return created, run["id"]


def suppression_reason(source, candidates, repository, current_run_id, update_active):
    source_order = run_order(source)
    for run in candidates:
        if not publication_run(run, repository) or run["id"] in {source["id"], current_run_id}:
            continue
        # Even a newer failed/cancelled run supersedes this old recovery request.
        # Only the newest run may decide whether its own failure is retryable.
        if run_order(run) > source_order:
            return f"newer publication run {run['id']} already superseded this failure"
        if run.get("status") in ACTIVE_STATUSES and update_active(run):
            return f"publication run {run['id']} has an active update job"
    return None


def has_active_update(github, run):
    if run.get("status") != "in_progress":
        return True
    jobs = github.pages(f"/actions/runs/{run['id']}/jobs", key="jobs")
    updates = [job for job in jobs if job.get("name", "").split(" / ")[-1] == "update"]
    # Empty/unknown API results cannot prove the update has finished. An older
    # workflow with a completed update and only recovery pending does not block
    # the newest failure from owning the sole remaining recovery chain.
    return not updates or any(job.get("status") != "completed" for job in updates)


def recent_and_active_runs(github):
    candidates = {}
    for workflow in REFRESH_FILES:
        response = github.request(f"/actions/workflows/{workflow}/runs?branch=main&per_page=100")
        for run in response["workflow_runs"]:
            candidates[run["id"]] = run
    # An unusually old in-progress/queued run can fall outside the recent page.
    # Read all active pages separately instead of relying on that page's size.
    for status in sorted(ACTIVE_STATUSES):
        for run in github.pages(f"/actions/runs?branch=main&status={status}", key="workflow_runs"):
            candidates[run["id"]] = run
    return list(candidates.values())


def queue_recovery(github, repository, source_run_id, *, current_run_id=None,
                   expected_sha=None, source_attempt=None, sleep=time.sleep):
    if not isinstance(source_run_id, int) or source_run_id < 1:
        raise ValueError("Invalid recovery source run")
    print("Retryable refresh failure; checking recovery ownership after five minutes.", flush=True)
    sleep(RECOVERY_DELAY_SECONDS)
    source = github.request(f"/actions/runs/{source_run_id}")
    if not publication_run(source, repository):
        raise ValueError("Untrusted recovery source run")
    if source_attempt is not None and source.get("run_attempt") != source_attempt:
        print("Recovery skipped: the source has a newer run attempt.")
        return False
    if source.get("status") == "completed" and source.get("conclusion") not in {"failure", "cancelled", "timed_out"}:
        print("Recovery skipped: source is no longer a failed publication run.")
        return False
    expected_sha = expected_sha or source["head_sha"]
    if not isinstance(expected_sha, str) or not re.fullmatch(r"[0-9a-f]{40}", expected_sha):
        raise ValueError("Invalid recovery commit identity")
    current_sha = github.request("/commits/main")["sha"]
    if current_sha != expected_sha:
        print("Recovery skipped: main changed after the failing revision.")
        return False
    reason = suppression_reason(source, recent_and_active_runs(github), repository, current_run_id,
                                lambda run: has_active_update(github, run))
    if reason:
        print(f"Recovery skipped: {reason}.")
        return False
    github.request("/actions/workflows/update-all-data-backup-2.yml/dispatches", {"ref": "main"})
    print(f"Queued one recovery for publication run {source_run_id}.", flush=True)
    return True


def main():
    from recover_timed_out_refresh import GitHub

    repository = os.environ["GITHUB_REPOSITORY"]
    queue_recovery(
        GitHub(repository, os.environ["GH_TOKEN"]), repository,
        int(os.environ["GITHUB_RUN_ID"]),
        current_run_id=int(os.environ["GITHUB_RUN_ID"]),
        source_attempt=int(os.environ["GITHUB_RUN_ATTEMPT"]),
        expected_sha=os.environ["RECOVERY_SOURCE_SHA"],
    )


if __name__ == "__main__":
    main()
