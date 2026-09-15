"""Bound collection attempts so an unavailable provider cannot consume the runner."""
from __future__ import annotations

import argparse
import os
from pathlib import Path
import signal
import subprocess
import sys
import time

TIMEOUT_EXIT_CODE = 124
DEFAULT_ATTEMPTS = 6
DEFAULT_TIMEOUT_SECONDS = 45 * 60


def stop_process_tree(process):
    # Ubuntu collectors spawn their own subprocesses. Killing only the parent
    # leaves those collectors running and holding the workflow's log pipe open.
    if sys.platform == "win32":
        subprocess.run(
            ["taskkill", "/PID", str(process.pid), "/T", "/F"],
            check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
            timeout=15,
        )
    else:
        try:
            os.killpg(process.pid, signal.SIGKILL)
        except ProcessLookupError:
            pass
    process.wait(timeout=15)


def run_attempt(command, timeout_seconds):
    process = subprocess.Popen(command, start_new_session=sys.platform != "win32")
    try:
        return process.wait(timeout=timeout_seconds)
    except subprocess.TimeoutExpired:
        print(f"Refresh attempt exceeded {timeout_seconds}s; stopping its collectors.", flush=True)
        stop_process_tree(process)
        return TIMEOUT_EXIT_CODE


def retry_refresh(command, attempts=DEFAULT_ATTEMPTS, timeout_seconds=DEFAULT_TIMEOUT_SECONDS,
                  run=run_attempt, sleep=time.sleep):
    if attempts < 1 or timeout_seconds <= 0:
        raise ValueError("Attempts and timeout must be positive")
    for attempt in range(1, attempts + 1):
        print(f"Refresh attempt {attempt}/{attempts}", flush=True)
        status = run(command, timeout_seconds)
        if status == 0:
            return 0
        if attempt < attempts:
            delay = attempt * 60
            print(f"Attempt {attempt} failed ({status}); retrying collection and validation in {delay}s.", flush=True)
            sleep(delay)
    print(f"All {attempts} refresh attempts failed; no data may be published.", flush=True)
    return status if status > 0 else 1


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--attempts", type=int, default=DEFAULT_ATTEMPTS)
    parser.add_argument("--timeout-seconds", type=int, default=DEFAULT_TIMEOUT_SECONDS)
    args = parser.parse_args()
    script = Path(__file__).with_name("refresh_all_data.py")
    return retry_refresh([sys.executable, str(script), "refresh"], args.attempts, args.timeout_seconds)


if __name__ == "__main__":
    sys.exit(main())
