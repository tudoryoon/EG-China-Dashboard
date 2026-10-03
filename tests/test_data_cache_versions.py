"""Published snapshots must remain detectable by the upstream refresh control."""
from datetime import datetime, timezone
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
import bump_data_cache_versions as versions


class DataCacheVersionTests(unittest.TestCase):
    def test_first_daily_and_same_day_repair_have_distinct_versions(self):
        with tempfile.TemporaryDirectory() as directory:
            index = Path(directory) / 'index.html'
            original = ('<script src="./data/dashboard-data.js?v=20261002-7"></script>'
                        '<script src="./dashboard.js?v=ui-release"></script>')
            index.write_text(original, encoding='utf8')
            with patch.object(versions, 'datetime') as clock:
                clock.now.return_value = datetime(2026, 10, 3, tzinfo=timezone.utc)
                self.assertEqual(versions.bump_index_versions(['data/dashboard-data.js'], index),
                                 ['data/dashboard-data.js'])
                self.assertIn('dashboard-data.js?v=20261003-1', index.read_text())
                versions.bump_index_versions(['data/dashboard-data.js'], index)
                self.assertIn('dashboard-data.js?v=20261003-2', index.read_text())
            self.assertIn('dashboard.js?v=ui-release', index.read_text())

    def test_isolated_root_never_writes_production_index(self):
        with tempfile.TemporaryDirectory() as directory:
            fixture = Path(directory) / 'index.html'
            fixture.write_text('<script src="./data/dashboard-data.js"></script>', encoding='utf8')
            production = versions.INDEX_PATH.read_bytes()
            versions.bump_index_versions(['./data/dashboard-data.js'], fixture)
            self.assertEqual(versions.INDEX_PATH.read_bytes(), production)
            self.assertIn('?v=', fixture.read_text())

    def test_no_matching_asset_does_not_rewrite_the_snapshot(self):
        with tempfile.TemporaryDirectory() as directory:
            index = Path(directory) / 'index.html'
            original = b'<script src="./dashboard.js?v=ui-release"></script>\r\n'
            index.write_bytes(original)
            self.assertEqual(versions.bump_index_versions(['data/dashboard-data.js'], index), [])
            self.assertEqual(index.read_bytes(), original)


if __name__ == '__main__':
    unittest.main()
