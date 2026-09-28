"""Attempt deadlines and retries must preserve failure until validation succeeds."""
from pathlib import Path
import os
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import Mock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import retry_data_refresh as retry


class RetryRefreshTests(unittest.TestCase):
    def test_retry_stops_at_first_complete_success(self):
        run, sleep = Mock(side_effect=[1, 0, 1]), Mock()
        self.assertEqual(retry.retry_refresh(["collector"], run=run, sleep=sleep), 0)
        self.assertEqual(run.call_count, 2)
        sleep.assert_called_once_with(60)

    def test_exhausted_failures_remain_a_failure_for_publication(self):
        run, sleep = Mock(return_value=7), Mock()
        self.assertEqual(retry.retry_refresh(["collector"], run=run, sleep=sleep), 7)
        self.assertEqual(run.call_count, 6)
        self.assertEqual([call.args[0] for call in sleep.call_args_list], [60, 120, 180, 240, 300])

    def test_timeout_is_retried_with_the_same_bounded_deadline(self):
        run, sleep = Mock(side_effect=[retry.TIMEOUT_EXIT_CODE, 0]), Mock()
        self.assertEqual(retry.retry_refresh(["collector"], timeout_seconds=10, run=run, sleep=sleep), 0)
        self.assertEqual([call.args for call in run.call_args_list], [(["collector"], 10)] * 2)

    def test_attempt_timeout_stops_collectors_before_retry(self):
        process = Mock()
        process.wait.side_effect = subprocess.TimeoutExpired("collector", 10)
        with patch.object(retry.subprocess, "Popen", return_value=process), \
             patch.object(retry, "stop_process_tree") as stop:
            self.assertEqual(retry.run_attempt(["collector"], 10), retry.TIMEOUT_EXIT_CODE)
        stop.assert_called_once_with(process)

    def test_timeout_cleanup_kills_the_whole_linux_process_group(self):
        process = Mock(pid=123)
        with patch.object(retry.sys, "platform", "linux"), \
             patch.object(retry.os, "killpg", create=True) as kill, \
             patch.object(retry.signal, "SIGKILL", 9, create=True):
            retry.stop_process_tree(process)
        kill.assert_called_once_with(123, 9)
        process.wait.assert_called_once_with(timeout=15)

    def test_signal_exit_is_reported_as_failure(self):
        self.assertEqual(retry.retry_refresh(["collector"], attempts=1, run=Mock(return_value=-9)), 1)

    def test_attempts_fit_inside_runner_with_publication_headroom(self):
        worst_case_seconds = retry.DEFAULT_ATTEMPTS * retry.DEFAULT_TIMEOUT_SECONDS + sum(range(1, retry.DEFAULT_ATTEMPTS)) * 60
        self.assertLessEqual(worst_case_seconds, (330 - 30) * 60)

    def test_deterministic_validation_failure_stops_without_chaining_recovery(self):
        run, sleep = Mock(side_effect=[retry.VALIDATION_EXIT_CODE, 0]), Mock()
        with patch.object(retry, "recovery_output") as output:
            self.assertEqual(retry.retry_refresh(["collector"], run=run, sleep=sleep), 65)
        run.assert_called_once()
        sleep.assert_not_called()
        output.assert_called_once_with(False)

    def test_validation_after_transient_error_still_prevents_recovery(self):
        with patch.object(retry, "recovery_output") as output:
            self.assertEqual(retry.retry_refresh(["collector"], run=Mock(side_effect=[1, 65]), sleep=Mock()), 65)
        output.assert_called_once_with(False)

    def test_only_exhausted_collection_errors_opt_in_to_followup(self):
        for code in (1, retry.TIMEOUT_EXIT_CODE):
            with self.subTest(code=code), patch.object(retry, "recovery_output") as output:
                self.assertEqual(retry.retry_refresh(["collector"], attempts=2, run=Mock(return_value=code), sleep=Mock()), code)
                self.assertEqual([call.args[0] for call in output.call_args_list], [False, True])

    def test_github_output_is_explicit_and_fail_closed(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "output"
            with patch.dict(os.environ, {"GITHUB_OUTPUT": str(output)}):
                retry.retry_refresh(["collector"], run=Mock(return_value=65), sleep=Mock())
            self.assertEqual(output.read_text(encoding="utf8"), "recovery_retryable=false\n")


if __name__ == "__main__":
    unittest.main()
