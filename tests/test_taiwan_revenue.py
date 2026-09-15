"""Collection retries retain verified progress without publishing partial data."""
from contextlib import redirect_stdout
from datetime import datetime, timedelta
import importlib.util
import io
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
HAS_DATA_DEPENDENCIES = all(importlib.util.find_spec(module) for module in ("pandas", "requests"))
if HAS_DATA_DEPENDENCIES:
    import update_taiwan_revenue as taiwan


@unittest.skipUnless(HAS_DATA_DEPENDENCIES, "Requires data dependencies")
class TaiwanRevenueRetryTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.cache_patch = patch.object(taiwan, "CACHE_PATH", self.root / "cache")
        self.cache_patch.start()
        self.addCleanup(self.cache_patch.stop)
        self.now = datetime(2026, 9, 14, 21, 5, tzinfo=taiwan.KST)
        self.rows = {"2026/08": {"revenue": 10.0, "yoy": None}}

    def test_cache_is_valid_only_for_same_run_and_recent_source_response(self):
        taiwan.cache_revenue("2330", "github:100:1", self.rows, self.now)
        self.assertEqual(taiwan.cached_revenue("2330", "github:100:1", self.now), self.rows)
        for scope, now in [
            ("github:101:1", self.now),
            ("github:100:2", self.now),
            (None, self.now),
            ("github:100:1", self.now + timedelta(hours=6, seconds=1)),
            ("github:100:1", self.now - timedelta(seconds=1)),
        ]:
            with self.subTest(scope=scope, now=now):
                self.assertIsNone(taiwan.cached_revenue("2330", scope, now))

    def test_malformed_or_unidentified_cached_source_is_not_reused(self):
        for field, value in [
            ("source", "https://unrelated.example"),
            ("code", "2303"),
            ("fetchedAt", "2026-09-14T21:05:00"),
            ("rows", {}),
            ("rows", {"2026/13": {"revenue": 10.0}}),
            ("rows", {"2026/08": {"revenue": "NaN"}}),
        ]:
            with self.subTest(field=field, value=value):
                taiwan.cache_revenue("2330", "run", self.rows, self.now)
                path = taiwan.CACHE_PATH / "2330.json"
                record = json.loads(path.read_text())
                record[field] = value
                path.write_text(json.dumps(record))
                self.assertIsNone(taiwan.cached_revenue("2330", "run", self.now))

    def test_local_collection_needs_explicit_scope_and_github_attempts_are_isolated(self):
        with patch.dict("os.environ", {}, clear=True):
            self.assertIsNone(taiwan.retry_cache_scope())
        with patch.dict("os.environ", {"EG_DATA_REFRESH_SCOPE": "manual-uuid"}, clear=True):
            self.assertEqual(taiwan.retry_cache_scope(), "local:manual-uuid")
        with patch.dict("os.environ", {"GITHUB_RUN_ID": "123", "GITHUB_RUN_ATTEMPT": "2"}, clear=True):
            self.assertEqual(taiwan.retry_cache_scope(), "github:123:2")

    def test_partial_failure_collects_remaining_companies_and_retry_only_fetches_failure(self):
        path = self.root / "dashboard-data.js"
        companies = [
            {"name": name, "month": "21/01", "bars": [1.0], "yoyLine": [None], "momLine": [None]}
            for name in ("A", "B", "C")
        ]
        path.write_text("window.dashboardCompanies = " + json.dumps(companies) + ";\n")
        original = path.read_bytes()
        rows = {"2021/01": {"revenue": 2.0, "yoy": None}}
        with patch.object(taiwan, "DATA_PATH", path), \
             patch.object(taiwan, "COMPANY_CODES", {"A": "1", "B": "2", "C": "3"}), \
             patch.object(taiwan, "AGGREGATES", {}), \
             patch.object(taiwan, "retry_cache_scope", return_value="same-run"), \
             patch.object(taiwan.time, "sleep"), redirect_stdout(io.StringIO()):
            with patch.object(taiwan, "fetch_recent_revenue", side_effect=[rows, ConnectionError("refused"), rows]) as fetch:
                with self.assertRaisesRegex(RuntimeError, r"incomplete \(1/3\)"):
                    taiwan.main(strict=True)
                self.assertEqual([call.args[0] for call in fetch.call_args_list], ["1", "2", "3"])
            self.assertEqual(path.read_bytes(), original)
            with patch.object(taiwan, "fetch_recent_revenue", return_value=rows) as fetch:
                taiwan.main(strict=True)
                self.assertEqual([call.args[0] for call in fetch.call_args_list], ["2"])
        updated = taiwan.parse_js_payload(path.read_text())
        self.assertEqual([company["bars"] for company in updated], [[2.0], [2.0], [2.0]])

    def test_empty_source_response_is_never_cached_or_published_in_strict_mode(self):
        path = self.root / "dashboard-data.js"
        path.write_text('window.dashboardCompanies = [{"name":"A","month":"21/01","bars":[1.0],"yoyLine":[null],"momLine":[null]}];\n')
        original = path.read_bytes()
        with patch.object(taiwan, "DATA_PATH", path), \
             patch.object(taiwan, "COMPANY_CODES", {"A": "1"}), \
             patch.object(taiwan, "AGGREGATES", {}), \
             patch.object(taiwan, "retry_cache_scope", return_value="run"), \
             patch.object(taiwan, "fetch_recent_revenue", return_value={}), \
             patch.object(taiwan.time, "sleep"), redirect_stdout(io.StringIO()):
            with self.assertRaisesRegex(RuntimeError, "no valid revenue rows"):
                taiwan.main(strict=True)
        self.assertEqual(path.read_bytes(), original)
        self.assertIsNone(taiwan.cached_revenue("1", "run"))


if __name__ == "__main__":
    unittest.main()
