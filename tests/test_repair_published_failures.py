"""A second source attempt cannot delay or damage the first publication."""
import json
import os
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import Mock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
import repair_published_failures as repair


class PublishedFailureRepairTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        for name in repair.SNAPSHOT_FILES:
            path = self.root / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(('original ' + name + '\r\n').encode())
        self.valid = patch.object(repair.refresh, 'completed_today', return_value=True).start()
        self.addCleanup(patch.stopall)
        patch.dict(os.environ, {'GITHUB_OUTPUT': '', 'GITHUB_STEP_SUMMARY': ''}).start()
        self.save({'hk:A.HK', 'hk:B.HK'})
        self.original = self.bytes()
        self.sleep = Mock()

    def bytes(self):
        return {name: (self.root / name).read_bytes() for name in repair.SNAPSHOT_FILES}

    def write(self, name, value):
        (self.root / name).write_text(json.dumps(value) + '\n', encoding='utf8')

    def save(self, failures, mutate=None):
        regions = {}
        for region, tickers in [('hk', ['A.HK', 'B.HK', 'C.HK']), ('cn', ['X.SS'])]:
            rows = []
            for ticker in tickers:
                failed = f'{region}:{ticker}' in failures
                row = {'ticker': ticker, 'asOfDate': '2026-09-28' if failed else '2026-09-29'}
                if failed:
                    row['dataStatus'] = 'stale'
                rows.append(row)
            regions[region] = {'meta': {'missing': {key.split(':')[1]: 'offline' for key in failures if key.startswith(region + ':')}},
                               'rs': {'rows': rows}}
        tw_failed = {key.split(':')[1]: 'offline' for key in failures if key.startswith('tw:')}
        taiwan = {'schemaVersion': 1, 'checkedAt': '2026-09-29T21:09:00+09:00',
                  'failures': tw_failed, 'retained': list(tw_failed),
                  'successful': sorted({'2330', '2303'} - set(tw_failed))}
        record = {'collection': repair.summarize_failures(regions, taiwan),
                  'refreshDate': '2026-09-29', 'marketSessions': {'hk': '2026-09-29', 'cn': '2026-09-29'},
                  'taiwanRevenueMonths': {'TSMC': '26/08', 'UMC': '26/08'}}
        if mutate:
            mutate(record, regions, taiwan)
        for region, payload in regions.items():
            self.write(f'data/asia-{region}-screening.json', payload)
        self.write('data/taiwan-collection-status.json', taiwan)
        self.write(repair.refresh.STATUS_PATH, record)

    def run_repair(self, runner):
        return repair.repair(self.root, run=runner, sleep=self.sleep)

    def assert_restored(self):
        self.assertEqual(self.bytes(), self.original)

    def test_zero_failures_skips_wait_collection_and_output_changes(self):
        self.save(set())
        before = self.bytes()
        runner = Mock()
        self.assertFalse(self.run_repair(runner))
        runner.assert_not_called()
        self.sleep.assert_not_called()
        self.assertEqual(self.bytes(), before)

    def test_real_improvement_keeps_candidate_after_one_bounded_forced_attempt(self):
        def collect(command, timeout):
            self.assertEqual(command[-2:], ['refresh', '--force'])
            self.assertEqual(timeout, 1200)
            self.sleep.assert_called_once_with(300)
            self.save({'hk:B.HK'})
            return 0
        runner = Mock(side_effect=collect)
        self.assertTrue(self.run_repair(runner))
        runner.assert_called_once()
        self.assertNotEqual(self.bytes(), self.original)

    def test_invalid_initial_checkpoint_never_waits_or_mutates_published_data(self):
        self.valid.return_value = False
        runner = Mock()
        self.assertFalse(self.run_repair(runner))
        runner.assert_not_called()
        self.sleep.assert_not_called()
        self.assert_restored()

    def test_fresh_recollection_can_clear_failure_without_advancing_existing_date(self):
        def already_current(record, regions, taiwan):
            regions['hk']['rs']['rows'][0]['asOfDate'] = '2026-09-29'
        self.save({'hk:A.HK'}, already_current)
        def collect(*_):
            self.save(set())
            return 0
        self.assertTrue(self.run_repair(collect))

    def test_repair_has_no_numeric_missing_threshold(self):
        failures = {f'hk:{number:04d}.HK' for number in range(1000)} | {'hk:A.HK'}
        self.save(failures)
        def collect(*_):
            self.save(failures - {'hk:A.HK'})
            return 0
        self.assertTrue(self.run_repair(collect))
        self.assertEqual(repair.read_state(self.root)[0]['collection']['failureCount'], 1000)

    def test_no_improvement_restores_all_bytes_including_checkpoint(self):
        def collect(*_):
            self.save({'hk:A.HK', 'hk:B.HK'})
            (self.root / 'data/dashboard-data.js').write_text('changed-but-not-improved', encoding='utf8')
            return 0
        self.assertFalse(self.run_repair(collect))
        self.assert_restored()

    def test_new_failure_rejects_candidate_even_when_total_count_falls(self):
        self.save({'hk:A.HK', 'hk:B.HK', 'cn:X.SS'})
        self.original = self.bytes()
        def collect(*_):
            self.save({'hk:C.HK'})
            return 0
        self.assertFalse(self.run_repair(collect))
        self.assert_restored()

    def test_timeout_source_error_and_validation_error_never_retry_or_keep_partial_writes(self):
        for status in (124, 1, 65):
            with self.subTest(status=status):
                def collect(*_):
                    self.save(set())
                    (self.root / 'data/asia-cn-metadata.json').unlink()
                    return status
                runner = Mock(side_effect=collect)
                self.assertFalse(self.run_repair(runner))
                runner.assert_called_once()
                self.assert_restored()

    def test_runner_exception_after_write_restores_publication(self):
        def collect(*_):
            self.save(set())
            raise RuntimeError('process launch failed')
        self.assertFalse(self.run_repair(collect))
        self.assert_restored()

    def test_corrupt_or_noncurrent_repaired_checkpoint_restores_publication(self):
        self.valid.side_effect = [True, False]
        def collect(*_):
            self.save(set())
            return 0
        self.assertFalse(self.run_repair(collect))
        self.assert_restored()

    def test_removed_constituent_does_not_count_as_a_recovered_security(self):
        def mutate(record, regions, taiwan):
            regions['hk']['rs']['rows'] = [row for row in regions['hk']['rs']['rows'] if row['ticker'] != 'A.HK']
        def collect(*_):
            self.save({'hk:B.HK'}, mutate)
            return 0
        self.assertFalse(self.run_repair(collect))
        self.assert_restored()

    def test_security_date_regression_rejects_even_with_a_recovered_failure(self):
        def mutate(record, regions, taiwan):
            regions['hk']['rs']['rows'][2]['asOfDate'] = '2026-09-28'
        def collect(*_):
            self.save({'hk:B.HK'}, mutate)
            return 0
        self.assertFalse(self.run_repair(collect))
        self.assert_restored()

    def test_still_stale_row_cannot_be_reported_as_recovered(self):
        def mutate(record, regions, taiwan):
            regions['hk']['rs']['rows'][0]['dataStatus'] = 'stale'
        def collect(*_):
            self.save({'hk:B.HK'}, mutate)
            return 0
        self.assertFalse(self.run_repair(collect))
        self.assert_restored()

    def test_refresh_boundary_and_changed_benchmark_both_restore_publication(self):
        for mutate in (lambda record, *_: record.update(refreshDate='2026-09-30'),
                       lambda record, *_: record['marketSessions'].update(cn='2026-09-28')):
            with self.subTest(mutate=mutate):
                def collect(*_):
                    self.save({'hk:B.HK'}, mutate)
                    return 0
                self.assertFalse(self.run_repair(collect))
                self.assert_restored()

    def test_taiwan_month_regression_rejects_recovered_regional_data(self):
        def mutate(record, regions, taiwan):
            record['taiwanRevenueMonths']['UMC'] = '26/07'
        def collect(*_):
            self.save({'hk:B.HK'}, mutate)
            return 0
        self.assertFalse(self.run_repair(collect))
        self.assert_restored()

    def test_taiwan_recovery_is_accepted_with_real_successful_response(self):
        self.save({'tw:2330'})
        def collect(*_):
            self.save(set())
            return 0
        self.assertTrue(self.run_repair(collect))

    def test_inconsistent_report_does_not_replace_published_files(self):
        def mutate(record, regions, taiwan):
            record['collection']['failureCount'] = 99
        def collect(*_):
            self.save(set(), mutate)
            return 0
        self.assertFalse(self.run_repair(collect))
        self.assert_restored()

    def test_failed_restore_is_fatal_to_prevent_any_following_push(self):
        with patch.object(repair, 'restore', side_effect=OSError('disk unavailable')):
            with self.assertRaisesRegex(OSError, 'disk unavailable'):
                self.run_repair(Mock(return_value=124))

    def test_updated_output_only_true_for_verified_improvement(self):
        output = self.root / 'outputs.txt'
        with patch.dict(os.environ, {'GITHUB_OUTPUT': str(output)}):
            self.assertFalse(self.run_repair(Mock(return_value=124)))
            self.assertEqual(output.read_text(encoding='utf8'), 'updated=false\n')
            def collect(*_):
                self.save(set())
                return 0
            self.assertTrue(self.run_repair(collect))
            self.assertEqual(output.read_text(encoding='utf8').splitlines(),
                             ['updated=false', 'updated=false', 'updated=true'])


if __name__ == '__main__':
    unittest.main()
