"""Offline regression tests for retained failures, backup skipping and publication."""
from datetime import datetime, timedelta
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import Mock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
import refresh_all_data as refresh


class DailyRefreshTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        for name in set(refresh.DATA_FILES + refresh.PIPELINE_FILES):
            path = self.root / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text('fixture', encoding='utf-8')
        self.now = datetime(2026, 9, 7, 21, 5, tzinfo=refresh.KST)

    def successful_refresh(self, now=None, failure_count=0):
        runner = Mock()
        with patch.object(refresh, 'validate_freshness', return_value={'hk': '2026-09-07', 'cn': '2026-09-07'}), \
             patch.object(refresh, 'validate_taiwan', return_value={'TSMC': '26/08'}), \
             patch.object(refresh, 'validate_collection_policy', return_value={'failurePolicy': 'retain-and-publish', 'failureCount': failure_count, 'failures': {f'hk:{i}': 'offline' for i in range(failure_count)}, 'retry': 'next-refresh-cycle'}):
            self.assertTrue(refresh.refresh(self.root, now or self.now, runner))
        return runner

    def test_success_skips_both_backups_without_touching_files(self):
        runner = self.successful_refresh()
        commands = [call.args[0] for call in runner.call_args_list]
        self.assertIn('scripts/update_asia_screening.py', commands[0])
        self.assertIn('scripts/update_taiwan_revenue.py', commands[1])
        self.assertIn('--strict', commands[1])
        self.assertIn('--allow-partial', commands[1])
        before = (self.root / refresh.STATUS_PATH).read_bytes()
        for minute in (10, 17):
            forbidden = Mock(side_effect=AssertionError('A backup must not run a collector'))
            self.assertFalse(refresh.refresh(self.root, self.now.replace(minute=minute), forbidden))
            forbidden.assert_not_called()
            self.assertEqual(before, (self.root / refresh.STATUS_PATH).read_bytes())

    def test_next_kst_day_retries(self):
        self.successful_refresh()
        self.assertFalse(refresh.completed_today(self.root, self.now + timedelta(days=1)))

    def test_any_count_of_accepted_failures_skips_backups_but_retries_next_cycle(self):
        for count in (0, 10, 11, 100, 1000):
            with self.subTest(count=count):
                self.successful_refresh(failure_count=count)
                self.assertTrue(refresh.completed_today(self.root, self.now + timedelta(minutes=12)))
                self.assertFalse(refresh.completed_today(self.root, self.now + timedelta(days=1)))
                status_path = self.root / refresh.STATUS_PATH
                self.assertEqual(json.loads(status_path.read_text(encoding='utf8'))['collection']['failureCount'], count)
                status_path.unlink()

    def test_malformed_failure_report_never_records_success(self):
        with patch.object(refresh, 'validate_freshness', return_value={}), \
             patch.object(refresh, 'validate_taiwan', return_value={}), \
             patch.object(refresh, 'validate_collection_policy', side_effect=ValueError('malformed failure report')):
            with self.assertRaisesRegex(refresh.NonRetryableRefreshError, 'malformed failure report'):
                refresh.refresh(self.root, self.now, Mock())
        self.assertFalse((self.root / refresh.STATUS_PATH).exists())

    def test_explicit_force_rechecks_collectors_and_freshness(self):
        self.successful_refresh()
        runner = Mock()
        with patch.object(refresh, 'validate_freshness', side_effect=RuntimeError('stale session')):
            with self.assertRaisesRegex(RuntimeError, 'stale session'):
                refresh.refresh(self.root, self.now, runner, force=True)
        self.assertEqual(runner.call_count, 5)

    def test_delayed_run_after_midnight_skips_later_backups(self):
        delayed = self.now + timedelta(hours=5)
        self.successful_refresh(delayed)
        self.assertTrue(refresh.completed_today(self.root, delayed + timedelta(minutes=7)))
        self.assertTrue(refresh.completed_today(self.root, delayed + timedelta(minutes=14)))
        self.assertFalse(refresh.completed_today(self.root, self.now + timedelta(days=1)))

    def test_evening_success_skips_backup_delayed_past_midnight(self):
        self.successful_refresh()
        self.assertTrue(refresh.completed_today(self.root, self.now + timedelta(hours=5)))

    def test_early_manual_run_does_not_suppress_evening(self):
        self.successful_refresh(self.now.replace(hour=18))
        self.assertFalse(refresh.completed_today(self.root, self.now))

    def test_modified_data_or_pipeline_invalidates_checkpoint(self):
        for name in ('data/dashboard-data.js', 'scripts/update_market_rs.py'):
            self.successful_refresh()
            (self.root / name).write_text('modified', encoding='utf-8')
            self.assertFalse(refresh.completed_today(self.root, self.now))

    def test_checkpoint_survives_git_line_ending_normalization(self):
        for name in refresh.DATA_FILES + refresh.PIPELINE_FILES:
            (self.root / name).write_bytes(b'first\r\nsecond\r\n')
        self.successful_refresh()
        for name in refresh.DATA_FILES + refresh.PIPELINE_FILES:
            (self.root / name).write_bytes(b'first\nsecond\n')
        self.assertTrue(refresh.completed_today(self.root, self.now))

    def test_missing_or_corrupt_checkpoint_retries(self):
        self.assertFalse(refresh.completed_today(self.root, self.now))
        self.successful_refresh()
        (self.root / refresh.STATUS_PATH).write_text('{broken', encoding='utf-8')
        self.assertFalse(refresh.completed_today(self.root, self.now))

    def test_partial_collector_failure_never_records_success(self):
        runner = Mock(side_effect=[None, subprocess.CalledProcessError(1, 'taiwan')])
        with self.assertRaises(subprocess.CalledProcessError):
            refresh.refresh(self.root, self.now, runner)
        self.assertFalse((self.root / refresh.STATUS_PATH).exists())
        self.assertFalse(refresh.completed_today(self.root, self.now.replace(minute=10)))

    def test_validation_failure_never_records_success(self):
        with patch.object(refresh, 'validate_freshness', side_effect=RuntimeError('stale session')):
            with self.assertRaisesRegex(RuntimeError, 'stale session'):
                refresh.refresh(self.root, self.now, Mock())
        self.assertFalse((self.root / refresh.STATUS_PATH).exists())

    def test_validator_process_failure_is_nonretryable(self):
        runner = Mock(side_effect=[None, None, subprocess.CalledProcessError(1, 'schema')])
        with self.assertRaises(refresh.NonRetryableRefreshError):
            refresh.refresh(self.root, self.now, runner)
        self.assertFalse((self.root / refresh.STATUS_PATH).exists())

    def test_cli_reports_validation_failure_as_exit_65(self):
        with patch.object(refresh, 'refresh', side_effect=refresh.NonRetryableRefreshError('bad schema')), \
             patch.object(sys, 'argv', ['refresh_all_data.py', 'refresh']):
            with self.assertRaises(SystemExit) as result:
                refresh.main()
        self.assertEqual(result.exception.code, 65)

    def test_taiwan_validation_failure_never_records_success(self):
        with patch.object(refresh, 'validate_freshness', return_value={}), \
             patch.object(refresh, 'validate_taiwan', side_effect=RuntimeError('missing Taiwan')):
            with self.assertRaisesRegex(RuntimeError, 'missing Taiwan'):
                refresh.refresh(self.root, self.now, Mock())
        self.assertFalse((self.root / refresh.STATUS_PATH).exists())

    def write_regional_payloads(self, hk, cn):
        for region, date in [('hk', hk), ('cn', cn)]:
            (self.root / f'data/asia-{region}-screening.json').write_text(
                json.dumps({'rs': {'updatedAt': date}, 'trend': {'updatedAt': date}}), encoding='utf-8')

    def test_stale_but_structurally_valid_data_is_rejected(self):
        self.write_regional_payloads('2026-09-04', '2026-09-07')
        with patch.object(refresh, 'expected_session', return_value='2026-09-07'):
            with self.assertRaisesRegex(RuntimeError, 'expected completed session'):
                refresh.validate_freshness(self.root, self.now)

    def test_markets_can_have_different_holiday_sessions(self):
        self.write_regional_payloads('2026-09-07', '2026-09-04')
        with patch.object(refresh, 'expected_session', side_effect=['2026-09-07', '2026-09-04']):
            self.assertEqual(refresh.validate_freshness(self.root, self.now), {'hk': '2026-09-07', 'cn': '2026-09-04'})


if __name__ == '__main__':
    unittest.main()
