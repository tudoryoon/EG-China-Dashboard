import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
import validated_price_cache as cache


class ValidatedCacheTests(unittest.TestCase):
    def test_recalculation_rejects_stale_future_empty_and_corrupt_caches(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'quote.json'
            for text in ['{bad', '{}', '{"records": []}', *[
                    json.dumps({'records': [{'date': day}], 'priceSource': {'provider': 'Tencent'}})
                    for day in ('2026-10-09', '2026-10-13')]]:
                path.write_text(text, encoding='utf8')
                self.assertIsNone(cache.read_recalculation(path, '2026-10-12'))

    def test_recalculation_cache_does_not_bypass_daily_run_scope(self):
        with tempfile.TemporaryDirectory() as directory, patch.object(cache, 'scope', return_value='new-run'):
            path = Path(directory) / 'quote.json'
            data = {'records': [{'date': '2026-10-12'}], 'priceSource': {'provider': 'Tencent'}}
            path.write_text(json.dumps(data), encoding='utf8')
            self.assertEqual(cache.read_recalculation(path, '2026-10-12'), data)
            self.assertIsNone(cache.read_recalculation(path, '2026-10-12', 400))
            self.assertIsNone(cache.read_current(path, '2026-10-12', 1))

    def test_only_same_run_complete_session_is_reused(self):
        with tempfile.TemporaryDirectory() as directory, patch.object(cache, 'scope', return_value='run1'):
            path = Path(directory) / 'quote.json'
            payload = {'records': [{'date': '2026-09-14'}], 'priceSource': {'provider': 'Tencent'}}
            path.write_text(json.dumps(cache.mark(payload, '2026-09-14')), encoding='utf8')
            self.assertIsNotNone(cache.read_current(path, '2026-09-14', 1))
            self.assertIsNone(cache.read_current(path, '2026-09-15', 1))
            self.assertIsNone(cache.read_current(path, '2026-09-14', 30))
            with patch.object(cache, 'scope', return_value='run2'):
                self.assertIsNone(cache.read_current(path, '2026-09-14', 1))

    def test_legacy_unverified_and_corrupt_files_force_refetch(self):
        with tempfile.TemporaryDirectory() as directory, patch.object(cache, 'scope', return_value='run1'):
            path = Path(directory) / 'quote.json'
            for text in ['{bad', '{}', '{"records": []}']:
                path.write_text(text, encoding='utf8')
                self.assertIsNone(cache.read_current(path, '2026-09-14', 1))
