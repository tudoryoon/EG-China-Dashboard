"""Timeout recovery requires GitHub evidence; ordinary cancellation stays stopped."""
from copy import deepcopy
from pathlib import Path
import sys
import unittest
from unittest.mock import Mock

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import recover_timed_out_refresh as recovery


class TimeoutRecoveryTests(unittest.TestCase):
    def setUp(self):
        self.repository = "tudoryoon/EG-China-Dashboard"
        self.event = {
            "action": "completed", "repository": {"full_name": self.repository},
            "workflow_run": {
                "id": 34878206776, "name": "Update All Data - KST 21:03",
                "head_repository": {"full_name": self.repository}, "head_branch": "main",
                "status": "completed", "conclusion": "cancelled",
            },
        }
        self.job = {"name": "refresh / update", "conclusion": "cancelled"}
        self.github = Mock()
        self.github.pages.return_value = [self.job]
        self.sleep = Mock()

    def test_observed_github_timeout_dispatches_one_guarded_recovery(self):
        self.github.annotations.return_value = [{"message": "The job running on runner GitHub Actions has exceeded the maximum execution time of 5h30m0s."}]
        self.assertTrue(recovery.recover(self.event, self.repository, self.github, self.sleep))
        self.sleep.assert_called_once_with(300)
        self.github.request.assert_called_once_with("/actions/workflows/update-all-data-backup-2.yml/dispatches", {"ref": "main"})

    def test_manual_cancel_does_not_restart_the_run(self):
        self.github.annotations.return_value = [{"message": "The operation was canceled."}]
        self.assertFalse(recovery.recover(self.event, self.repository, self.github, self.sleep))
        self.github.request.assert_not_called()
        self.sleep.assert_not_called()

    def test_failure_and_success_do_not_duplicate_existing_recovery(self):
        for conclusion in ("failure", "success"):
            event = deepcopy(self.event)
            event["workflow_run"]["conclusion"] = conclusion
            self.assertFalse(recovery.recover(event, self.repository, self.github, self.sleep))
        self.github.pages.assert_not_called()
        self.github.request.assert_not_called()

    def test_foreign_repository_branch_or_workflow_is_rejected(self):
        for field, value in (("head_repository", {"full_name": "someone/other"}), ("head_branch", "untrusted"), ("name", "Verify Full Data Refresh")):
            event = deepcopy(self.event)
            event["workflow_run"][field] = value
            self.assertFalse(recovery.recover(event, self.repository, self.github, self.sleep))
        self.github.pages.assert_not_called()

    def test_timeout_in_other_jobs_does_not_restart_collection(self):
        self.github.pages.return_value = [{"name": "refresh / recovery", "conclusion": "cancelled"}]
        self.assertFalse(recovery.recover(self.event, self.repository, self.github, self.sleep))
        self.github.annotations.assert_not_called()
        self.github.request.assert_not_called()

    def test_check_run_urls_cannot_redirect_authenticated_requests(self):
        github = recovery.GitHub(self.repository, "fixture")
        github.pages = Mock()
        with self.assertRaisesRegex(ValueError, "identity"):
            github.annotations({"check_run_url": "https://example.com/check-runs/123"})
        github.pages.assert_not_called()
        github.annotations({"check_run_url": github.base + "/check-runs/123"})
        github.pages.assert_called_once_with("/check-runs/123/annotations")


if __name__ == "__main__":
    unittest.main()
