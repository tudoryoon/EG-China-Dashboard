"""Rebase must not publish data certified against an earlier pipeline."""
from contextlib import redirect_stdout
from datetime import datetime, timedelta
import io
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
import refresh_all_data as refresh


class PublicationGuardTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        for name in refresh.DATA_FILES + refresh.PIPELINE_FILES:
            path = self.root / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text('certified fixture\n', encoding='utf8')
        self.now = datetime(2026, 9, 28, 14, 0, tzinfo=refresh.KST)
        self.checkpoint = {
            'schemaVersion': 4, 'completedAt': self.now.isoformat(),
            'refreshDate': refresh.refresh_date(self.now).isoformat(),
            'collection': {'failurePolicy': 'retain-and-publish', 'failureCount': 10,
                           'failures': {f'hk:{i}': 'offline' for i in range(10)}},
            'dataHashes': refresh.hashes(self.root, refresh.DATA_FILES),
            'pipelineHashes': refresh.hashes(self.root, refresh.PIPELINE_FILES),
        }
        self.save_checkpoint()

    def save_checkpoint(self):
        path = self.root / refresh.STATUS_PATH
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(self.checkpoint), encoding='utf8')

    def verify(self):
        with patch.object(refresh, 'ROOT', self.root), \
             patch.object(sys, 'argv', ['refresh_all_data.py', 'verify-publication']), \
             patch.object(refresh, 'datetime', wraps=datetime) as clock, \
             redirect_stdout(io.StringIO()):
            clock.now.return_value = self.now + timedelta(minutes=1)
            refresh.main()

    def test_certified_partial_success_is_publishable(self):
        self.verify()

    def test_pipeline_changed_by_rebase_blocks_push(self):
        (self.root / 'scripts/update_market_rs.py').write_text('new upstream formula', encoding='utf8')
        with self.assertRaisesRegex(RuntimeError, 'retry before pushing'):
            self.verify()

    def test_data_changed_by_rebase_blocks_push(self):
        (self.root / 'data/asia-hk-screening.json').write_text('different snapshot', encoding='utf8')
        with self.assertRaisesRegex(RuntimeError, 'retry before pushing'):
            self.verify()

    def test_previous_cycle_checkpoint_blocks_push(self):
        previous = self.now - timedelta(days=1)
        self.checkpoint.update(completedAt=previous.isoformat(),
                               refreshDate=refresh.refresh_date(previous).isoformat())
        self.save_checkpoint()
        with self.assertRaisesRegex(RuntimeError, 'retry before pushing'):
            self.verify()

    def test_large_reported_failure_count_does_not_block_push(self):
        self.checkpoint['collection'].update(failureCount=100, failures={f'hk:{i}': 'offline' for i in range(100)})
        self.save_checkpoint()
        self.verify()

    def test_inconsistent_failure_report_blocks_push(self):
        self.checkpoint['collection']['failureCount'] = 11
        self.save_checkpoint()
        with self.assertRaisesRegex(RuntimeError, 'retry before pushing'):
            self.verify()


if __name__ == '__main__':
    unittest.main()
