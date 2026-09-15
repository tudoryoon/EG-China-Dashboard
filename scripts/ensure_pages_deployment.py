"""Repair Pages delivery independently of the data completion checkpoint.

GitHub-token pushes do not start push workflows. A current data checkpoint must
therefore still check whether the committed main SHA has a successful or active
Pages run, including after an earlier deployment dispatch failed.
"""
from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import re
import time

from recover_timed_out_refresh import GitHub

DEPLOY_WORKFLOW = "deploy-pages.yml"
DEPLOY_NAME = "Deploy Regional Dashboard"
ACTIVE_STATUSES = frozenset({"queued", "in_progress", "waiting", "pending", "requested"})


def ensure_deployment(github):
    # Read the remote commit, not the refresh event SHA or a local unpushed tree.
    sha = github.request("/commits/main")["sha"]
    if not isinstance(sha, str) or not re.fullmatch(r"[0-9a-f]{40}", sha):
        raise ValueError("Invalid main commit identity")
    response = github.request(
        f"/actions/workflows/{DEPLOY_WORKFLOW}/runs?branch=main&head_sha={sha}&per_page=100"
    )
    matching = [run for run in response["workflow_runs"]
                if run.get("head_sha") == sha and run.get("head_branch") == "main"]
    if any(run.get("status") == "completed" and run.get("conclusion") == "success"
           for run in matching):
        print(f"Pages already succeeded for main {sha}; no deployment dispatched.")
        return False
    if any(run.get("status") in ACTIVE_STATUSES for run in matching):
        print(f"Pages is already queued or running for main {sha}; no duplicate dispatch.")
        return False
    # GitHub.request retries transient API/dispatch failures three times.
    github.request(f"/actions/workflows/{DEPLOY_WORKFLOW}/dispatches", {"ref": "main"})
    print(f"Queued Pages deployment for committed main {sha}.")
    return True


def eligible_failed_deployment(event, repository):
    run = event.get("workflow_run") or {}
    return (
        event.get("action") == "completed"
        and event.get("repository", {}).get("full_name") == repository
        and run.get("head_repository", {}).get("full_name") == repository
        and run.get("head_branch") == "main"
        and run.get("name") == DEPLOY_NAME
        and run.get("status") == "completed"
        and run.get("conclusion") in {"failure", "timed_out"}
    )


def recover_deployment(event, repository, github, sleep=time.sleep):
    if not eligible_failed_deployment(event, repository):
        print("No deployment recovery: leave successful, cancelled and untrusted runs unchanged.")
        return False
    print("Pages deployment failed; checking committed main again in five minutes.", flush=True)
    sleep(300)
    return ensure_deployment(github)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--recover", action="store_true")
    args = parser.parse_args()
    repository = os.environ["GITHUB_REPOSITORY"]
    github = GitHub(repository, os.environ["GH_TOKEN"])
    if args.recover:
        event = json.loads(Path(os.environ["GITHUB_EVENT_PATH"]).read_text(encoding="utf-8"))
        recover_deployment(event, repository, github)
    else:
        ensure_deployment(github)


if __name__ == "__main__":
    main()
