"""A completed data checkpoint must not hide failed Pages delivery."""
from copy import deepcopy
from pathlib import Path
import sys
import unittest
from unittest.mock import Mock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import ensure_pages_deployment as pages
import recover_timed_out_refresh as recovery


class PagesDeliveryTests(unittest.TestCase):
    def setUp(self):
        self.sha = "a" * 40
        self.repository = "tudoryoon/EG-China-Dashboard"
        self.github = Mock()
        self.event = {
            "action": "completed", "repository": {"full_name": self.repository},
            "workflow_run": {
                "name": pages.DEPLOY_NAME, "head_branch": "main",
                "head_repository": {"full_name": self.repository},
                "status": "completed", "conclusion": "failure",
            },
        }

    def provide_runs(self, runs):
        self.github.request.side_effect = [{"sha": self.sha}, {"workflow_runs": runs}, None]

    def run_record(self, **changes):
        record = {"head_sha": self.sha, "head_branch": "main",
                  "status": "completed", "conclusion": "success"}
        record.update(changes)
        return record

    def test_push_succeeded_but_dispatch_failed_is_repaired_without_data_mutation(self):
        self.provide_runs([])
        self.assertTrue(pages.ensure_deployment(self.github))
        self.github.request.assert_any_call("/commits/main")
        self.github.request.assert_called_with(
            "/actions/workflows/deploy-pages.yml/dispatches", {"ref": "main"})

    def test_successful_current_deployment_is_not_dispatched_again(self):
        self.provide_runs([self.run_record()])
        self.assertFalse(pages.ensure_deployment(self.github))
        self.assertEqual(self.github.request.call_count, 2)

    def test_active_current_deployment_is_not_duplicated(self):
        for status in pages.ACTIVE_STATUSES:
            with self.subTest(status=status):
                self.github.reset_mock()
                self.provide_runs([self.run_record(status=status, conclusion=None)])
                self.assertFalse(pages.ensure_deployment(self.github))
                self.assertEqual(self.github.request.call_count, 2)

    def test_failed_current_deployment_is_dispatched_again(self):
        self.provide_runs([self.run_record(conclusion="failure")])
        self.assertTrue(pages.ensure_deployment(self.github))

    def test_older_success_and_foreign_branch_do_not_hide_undelivered_main(self):
        self.provide_runs([
            self.run_record(head_sha="b" * 40), self.run_record(head_branch="other")])
        self.assertTrue(pages.ensure_deployment(self.github))

    def test_deploy_recovery_waits_then_rechecks_current_main(self):
        self.provide_runs([])
        sleep = Mock()
        self.assertTrue(pages.recover_deployment(self.event, self.repository, self.github, sleep))
        sleep.assert_called_once_with(300)
        self.github.request.assert_called_with(
            "/actions/workflows/deploy-pages.yml/dispatches", {"ref": "main"})

    def test_another_success_during_recovery_wait_suppresses_retry(self):
        self.provide_runs([self.run_record()])
        self.assertFalse(pages.recover_deployment(self.event, self.repository, self.github, Mock()))
        self.assertEqual(self.github.request.call_count, 2)

    def test_manual_cancellation_and_success_are_never_restarted(self):
        for conclusion in ("cancelled", "success", "skipped"):
            event = deepcopy(self.event)
            event["workflow_run"]["conclusion"] = conclusion
            sleep = Mock()
            self.assertFalse(pages.recover_deployment(event, self.repository, self.github, sleep))
            sleep.assert_not_called()
        self.github.request.assert_not_called()

    def test_untrusted_completion_events_cannot_trigger_privileged_dispatch(self):
        for field, value in (("head_repository", {"full_name": "someone/fork"}),
                             ("head_branch", "other"), ("name", "unrelated")):
            event = deepcopy(self.event)
            event["workflow_run"][field] = value
            self.assertFalse(pages.recover_deployment(event, self.repository, self.github, Mock()))
        self.github.request.assert_not_called()

    def test_api_error_fails_the_publication_job_to_enable_existing_recovery(self):
        self.github.request.side_effect = RuntimeError("API unavailable")
        with self.assertRaisesRegex(RuntimeError, "API unavailable"):
            pages.ensure_deployment(self.github)

    def test_transient_dispatch_error_is_retried(self):
        response = Mock()
        response.__enter__ = Mock(return_value=response)
        response.__exit__ = Mock(return_value=False)
        response.read.return_value = b""
        github = recovery.GitHub(self.repository, "fixture-token")
        with patch.object(recovery, "urlopen", side_effect=[OSError("temporary"), response]) as request, \
             patch.object(recovery.time, "sleep") as sleep:
            github.request("/actions/workflows/deploy-pages.yml/dispatches", {"ref": "main"})
        self.assertEqual(request.call_count, 2)
        sleep.assert_called_once_with(30)


if __name__ == "__main__":
    unittest.main()
