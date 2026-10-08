"""An intermittent OneDrive lock must not turn a valid quote into a stale row."""
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import update_asia_screening as collector


class AtomicCacheWriteTests(unittest.TestCase):
    def test_retries_transient_destination_lock_without_partial_json(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "005930.json"
            real_replace = Path.replace
            attempts = []

            def locked_once(source, destination):
                attempts.append(1)
                if len(attempts) == 1:
                    raise PermissionError("sync lock")
                return real_replace(source, destination)

            with patch.object(Path, "replace", locked_once), patch.object(collector.time, "sleep") as pause:
                collector.write_json(path, {"records": [{"date": "2026-10-08", "close": 262000}]})
            self.assertEqual(len(attempts), 2)
            pause.assert_called_once()
            self.assertIn('"close":262000', path.read_text(encoding="utf-8"))
            self.assertEqual(list(Path(directory).glob("*.tmp")), [])

    def test_persistent_lock_preserves_previous_cache_and_cleans_temp(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "005930.json"
            path.write_text('{"old":true}', encoding="utf-8")
            with patch.object(Path, "replace", side_effect=PermissionError("sync lock")), \
                    patch.object(collector.time, "sleep"):
                with self.assertRaises(PermissionError):
                    collector.write_json(path, {"new": True})
            self.assertEqual(path.read_text(encoding="utf-8"), '{"old":true}')
            self.assertEqual(list(Path(directory).glob("*.tmp")), [])


if __name__ == "__main__":
    unittest.main()
