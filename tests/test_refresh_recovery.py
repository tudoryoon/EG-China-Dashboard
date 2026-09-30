"""A failed run cannot multiply recovery chains or revive superseded failures."""
from copy import deepcopy
from pathlib import Path
import re
import sys
import unittest
from unittest.mock import Mock

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import refresh_recovery as recovery


class RecoveryOwnershipTests(unittest.TestCase):
    def setUp(self):
        self.repository = "tudoryoon/EG-China-Dashboard"
        self.sha = "a" * 40
        self.source = {
            "id": 100, "name": "Update All Data - KST 21:03",
            "head_repository": {"full_name": self.repository}, "head_branch": "main",
            "head_sha": self.sha, "run_attempt": 1,
            "created_at": "2026-09-28T12:03:00Z", "status": "in_progress", "conclusion": None,
        }
        self.runs = [self.source]
        self.posts = []
        self.jobs = {}
        self.github = Mock()
        self.github.request.side_effect = self.request
        self.github.pages.side_effect = self.pages
        self.sleep = Mock()

    def request(self, path, payload=None):
        if payload is not None:
            self.posts.append((path, payload))
            # Simulate GitHub accepting a dispatch under the shared lock.
            self.runs.append(self.record(id=101, status="queued", created_at="2026-09-28T12:20:00Z"))
            return None
        if path == "/actions/runs/100":
            return self.source
        if path == "/commits/main":
            return {"sha": self.sha}
        if path.startswith("/actions/workflows/"):
            return {"workflow_runs": self.runs}
        raise AssertionError(path)

    def pages(self, path, key):
        if key == "jobs":
            return self.jobs.get(path, [{"name": "refresh / update", "status": "in_progress"}])
        status = path.split("status=")[1]
        return [run for run in self.runs if run["status"] == status]

    def record(self, **changes):
        run = deepcopy(self.source)
        run.update(changes)
        return run

    def queue(self, **kwargs):
        return recovery.queue_recovery(self.github, self.repository, 100,
                                       current_run_id=100, sleep=self.sleep, **kwargs)

    def test_current_recovery_excludes_its_own_in_progress_parent(self):
        self.assertTrue(self.queue())
        self.sleep.assert_called_once_with(300)
        self.assertEqual(self.posts, [("/actions/workflows/update-all-data-backup-2.yml/dispatches", {"ref": "main"})])

    def test_repeated_recovery_cannot_dispatch_a_second_child(self):
        self.assertTrue(self.queue())
        self.assertFalse(self.queue())
        self.assertEqual(len(self.posts), 1)

    def test_any_other_active_publication_suppresses_another_dispatch(self):
        for status in recovery.ACTIVE_STATUSES:
            with self.subTest(status=status):
                self.runs = [self.source, self.record(id=99, status=status, created_at="2026-09-27T12:03:00Z")]
                self.assertFalse(self.queue())
        self.assertEqual(self.posts, [])

    def test_newer_completed_success_failure_or_cancel_supersedes_old_recovery(self):
        for conclusion in ("success", "failure", "cancelled"):
            with self.subTest(conclusion=conclusion):
                self.runs = [self.source, self.record(id=101, status="completed", conclusion=conclusion,
                                                    created_at="2026-09-28T12:10:00Z")]
                self.assertFalse(self.queue())
        self.assertEqual(self.posts, [])

    def test_older_completed_failures_do_not_prevent_current_retry(self):
        self.runs.append(self.record(id=99, status="completed", conclusion="failure", created_at="2026-09-27T12:03:00Z"))
        self.assertTrue(self.queue())

    def test_changed_main_suppresses_retired_code_recovery(self):
        self.assertFalse(self.queue(expected_sha="b" * 40))
        self.assertEqual(self.posts, [])

    def test_delivery_recovery_uses_published_repair_sha_not_event_sha(self):
        self.sha = "b" * 40  # The repair was pushed after this run's event SHA.
        self.assertNotEqual(self.source["head_sha"], self.sha)
        self.assertTrue(self.queue(expected_sha=self.sha))
        self.assertEqual(len(self.posts), 1)

    def test_newer_source_attempt_and_recovered_source_do_not_retry(self):
        self.assertFalse(self.queue(source_attempt=2))
        self.source.update(status="completed", conclusion="success")
        self.assertFalse(self.queue())
        self.assertEqual(self.posts, [])

    def test_unrelated_workflow_does_not_occupy_publication_guard(self):
        self.runs.append(self.record(id=101, name="Verify Full Data Refresh", created_at="2026-09-28T12:10:00Z"))
        self.assertTrue(self.queue())

    def test_check_only_run_does_not_retire_real_publication_recovery(self):
        self.runs.append(self.record(id=101, display_title="Update All Data - KST 21:03 [check-only]",
                                     created_at="2026-09-28T12:10:00Z"))
        self.assertTrue(self.queue())

    def test_only_older_recovery_jobs_do_not_deadlock_the_newest_owner(self):
        self.runs.append(self.record(id=99, created_at="2026-09-27T12:03:00Z"))
        self.jobs["/actions/runs/99/jobs"] = [
            {"name": "refresh / update", "status": "completed", "conclusion": "failure"},
            {"name": "refresh / recovery", "status": "in_progress"},
        ]
        self.assertTrue(self.queue())
        self.assertEqual(len(self.posts), 1)

    def test_untrusted_source_or_invalid_revision_fails_closed(self):
        with self.assertRaisesRegex(ValueError, "commit identity"):
            self.queue(expected_sha="main")
        self.source["head_repository"] = {"full_name": "someone/fork"}
        with self.assertRaisesRegex(ValueError, "Untrusted"):
            self.queue()
        self.assertEqual(self.posts, [])

    def test_remote_api_failure_cannot_dispatch_blindly(self):
        self.github.pages.side_effect = OSError("GitHub unavailable")
        with self.assertRaises(OSError):
            self.queue()
        self.assertEqual(self.posts, [])

    def test_old_active_run_outside_recent_page_is_still_detected(self):
        self.github.pages.side_effect = lambda path, key: [self.record(id=1, status="queued", created_at="2026-01-01T12:03:00Z")]
        self.assertFalse(self.queue())
        self.assertEqual(self.posts, [])


class WorkflowOutcomeContractTests(unittest.TestCase):
    def setUp(self):
        workflows = Path(__file__).resolve().parents[1] / ".github" / "workflows"
        self.refresh = (workflows / "refresh-all-data.yml").read_text(encoding="utf8")
        update = self.refresh.split("\n  recovery:", 1)[0]
        self.steps = {}
        for block in re.split(r"(?m)^      - ", update)[1:]:
            identifier = re.search(r"(?m)^        id: (\w+)$", block)
            if identifier:
                self.steps[identifier.group(1)] = block

    def condition(self, step):
        return re.search(r"(?m)^        if: (.+)$", self.steps[step]).group(1)

    def test_optional_repair_cannot_delay_initial_delivery_or_run_after_skip(self):
        order = list(self.steps)
        self.assertLess(order.index("publish"), order.index("delivery"))
        self.assertLess(order.index("delivery"), order.index("repair"))
        # Each gate is conjunctive: accepted same-cycle/check-only executions
        # must never enter the force-refresh helper.
        self.assertNotIn("||", self.condition("repair"))
        gates = {part.strip() for part in self.condition("repair").split("&&")}
        self.assertTrue({
            "success()", "steps.freshness.outputs.skip != 'true'", "!inputs.check_only",
            "steps.publish.outcome == 'success'", "steps.delivery.outcome == 'success'",
        }.issubset(gates))
        self.assertIn("continue-on-error: true", self.steps["repair"])

    def test_only_successful_improvement_can_push_and_only_a_push_can_deploy(self):
        order = list(self.steps)
        self.assertLess(order.index("repair"), order.index("repair_publish"))
        self.assertLess(order.index("repair_publish"), order.index("repair_delivery"))
        self.assertNotIn("||", self.condition("repair_publish"))
        self.assertNotIn("||", self.condition("repair_delivery"))
        gates = {part.strip() for part in self.condition("repair_publish").split("&&")}
        self.assertTrue({"steps.repair.outcome == 'success'",
                         "steps.repair.outputs.updated == 'true'"}.issubset(gates))
        self.assertIn("continue-on-error: true", self.steps["repair_publish"])
        self.assertIn("steps.repair_publish.outputs.pushed == 'true'",
                      {part.strip() for part in self.condition("repair_delivery").split("&&")})
        publication = self.steps["repair_publish"]
        self.assertLess(publication.index("verify-publication"), publication.index("git add "))
        self.assertLess(publication.index("git pull --rebase"), publication.rindex("verify-publication"))
        self.assertLess(publication.rindex("verify-publication"), publication.index("git push "))

    def test_optional_failures_do_not_chain_recovery_but_repaired_delivery_can(self):
        retry = re.search(r"(?m)^      recovery_retryable: (.+)$", self.refresh).group(1)
        self.assertIn("steps.repair_delivery.outcome == 'failure'", retry)
        self.assertNotIn("steps.repair.", retry)
        self.assertNotIn("steps.repair_publish.", retry)
        revision = re.search(r"(?m)^      recovery_sha: (.+)$", self.refresh).group(1)
        self.assertLess(revision.index("steps.repair_publish.outputs.recovery_sha"),
                        revision.index("steps.publish.outputs.recovery_sha"))
        self.assertLess(revision.index("steps.publish.outputs.recovery_sha"),
                        revision.index("steps.source.outputs.sha"))

    def test_failed_tests_cannot_enter_recovery_and_watchers_share_one_lock(self):
        workflows = Path(__file__).resolve().parents[1] / ".github" / "workflows"
        refresh = (workflows / "refresh-all-data.yml").read_text(encoding="utf8")
        timeout = (workflows / "recover-refresh-timeout.yml").read_text(encoding="utf8")
        self.assertIn("needs.update.outputs.recovery_retryable == 'true'", refresh)
        self.assertIn("steps.refresh.outputs.recovery_retryable == 'true'", refresh)
        self.assertIn("steps.publish.outputs.recovery_retryable == 'true'", refresh)
        self.assertIn("steps.delivery.outcome == 'failure'", refresh)
        self.assertIn("group: recover-regional-refresh", refresh)
        self.assertIn("group: recover-regional-refresh", timeout)
        self.assertNotIn("gh workflow run", refresh)


if __name__ == "__main__":
    unittest.main()
