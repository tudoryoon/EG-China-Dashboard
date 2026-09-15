"""Individual failures retain old company data within the publication budget."""
from copy import deepcopy
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
        self.status_path = self.root / "taiwan-collection-status.json"
        self.status_patch = patch.object(taiwan, "COLLECTION_STATUS_PATH", self.status_path)
        self.status_patch.start()
        self.addCleanup(self.status_patch.stop)
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

    def run_partial_scenario(self, failed_count, company_count=12):
        path = self.root / "dashboard-data.js"
        companies = [
            {"name": f"Company {index}", "month": "21/01", "bars": [1.0], "yoyLine": [None], "momLine": [None]}
            for index in range(company_count)
        ]
        codes = {company["name"]: str(index) for index, company in enumerate(companies)}
        path.write_text("window.dashboardCompanies = " + json.dumps(companies) + ";\n")
        before = path.read_bytes()
        self.status_path.write_text('{"previous":"report"}')
        before_status = self.status_path.read_bytes()

        def fetch(code, _session):
            if int(code) < failed_count:
                raise ConnectionError("source offline")
            return {"2021/02": {"revenue": 2.0, "yoy": None}}

        with patch.object(taiwan, "DATA_PATH", path), \
             patch.object(taiwan, "COMPANY_CODES", codes), \
             patch.object(taiwan, "AGGREGATES", {}), \
             patch.object(taiwan, "retry_cache_scope", return_value="partial-run"), \
             patch.object(taiwan, "fetch_recent_revenue", side_effect=fetch), \
             patch.object(taiwan.time, "sleep"), redirect_stdout(io.StringIO()):
            if failed_count > 10:
                with self.assertRaisesRegex(RuntimeError, rf"incomplete \({failed_count}/{company_count}\)"):
                    taiwan.main(strict=True, allow_partial=True)
                self.assertEqual(path.read_bytes(), before)
                self.assertEqual(self.status_path.read_bytes(), before_status)
                return
            taiwan.main(strict=True, allow_partial=True)

        result = taiwan.parse_js_payload(path.read_text())
        report = json.loads(self.status_path.read_text())
        self.assertEqual(report["schemaVersion"], 1)
        self.assertEqual(report["scope"], "partial-run")
        self.assertEqual(datetime.fromisoformat(report["checkedAt"]).utcoffset(), timedelta(hours=9))
        self.assertEqual(set(report["failures"]), {str(index) for index in range(failed_count)})
        self.assertEqual(report["retained"], sorted(report["failures"]))
        self.assertEqual(set(report["successful"]), {str(index) for index in range(failed_count, company_count)})
        for index, company in enumerate(result):
            if index < failed_count:
                self.assertEqual(company["dataStatus"], "stale")
                self.assertEqual(company["collectionError"], "source offline")
                self.assertEqual(company["sourceCheckedAt"], report["checkedAt"])
                without_metadata = {key: value for key, value in company.items()
                                    if key not in ("dataStatus", "collectionError", "sourceCheckedAt")}
                self.assertEqual(without_metadata, companies[index])
            else:
                self.assertEqual(company["month"], "21/02")
                self.assertEqual(company["bars"], [1.0, 2.0])
                self.assertNotIn("dataStatus", company)

    def test_zero_failed_companies_produces_complete_report(self):
        self.run_partial_scenario(0)

    def test_ten_failed_companies_publish_successes_and_retain_old_periods(self):
        self.run_partial_scenario(10)

    def test_eleven_failed_companies_preserve_both_original_files(self):
        self.run_partial_scenario(11)

    def test_partial_sync_error_does_not_leak_mutated_values_and_recovery_clears_stale_metadata(self):
        path = self.root / "dashboard-data.js"
        original = {"name": "A", "month": "21/01", "bars": [1.0], "yoyLine": [None], "momLine": [None]}
        path.write_text("window.dashboardCompanies = " + json.dumps([original]) + ";\n")

        def broken_sync(company, rows):
            company["bars"][0] = 9999
            company["month"] = "21/02"
            raise ValueError("partial mutation")

        with patch.object(taiwan, "DATA_PATH", path), \
             patch.object(taiwan, "COMPANY_CODES", {"A": "1"}), \
             patch.object(taiwan, "AGGREGATES", {}), \
             patch.object(taiwan, "retry_cache_scope", return_value="run"), \
             patch.object(taiwan, "fetch_recent_revenue", return_value={"2021/02": {"revenue": 2.0, "yoy": None}}), \
             patch.object(taiwan.time, "sleep"), redirect_stdout(io.StringIO()):
            with patch.object(taiwan, "sync_company_months", side_effect=broken_sync):
                taiwan.main(strict=True, allow_partial=True)
            retained = taiwan.parse_js_payload(path.read_text())[0]
            self.assertEqual(retained["bars"], original["bars"])
            self.assertEqual(retained["month"], original["month"])
            self.assertEqual(retained["dataStatus"], "stale")
            taiwan.main(strict=True, allow_partial=True)
        recovered = taiwan.parse_js_payload(path.read_text())[0]
        self.assertEqual(recovered["bars"], [1.0, 2.0])
        self.assertEqual(recovered["month"], "21/02")
        for field in ("dataStatus", "collectionError", "sourceCheckedAt"):
            self.assertNotIn(field, recovered)
        report = json.loads(self.status_path.read_text())
        self.assertEqual(report["failures"], {})
        self.assertEqual(report["retained"], [])
        self.assertEqual(report["successful"], ["1"])

    def test_aggregate_uses_common_actual_period_with_retained_component(self):
        path = self.root / "dashboard-data.js"
        companies = [
            {"name": name, "month": "21/01", "bars": [value], "yoyLine": [None], "momLine": [None]}
            for name, value in (("A", 1.0), ("B", 3.0), ("Total", 4.0))
        ]
        path.write_text("window.dashboardCompanies = " + json.dumps(companies) + ";\n")
        with patch.object(taiwan, "DATA_PATH", path), \
             patch.object(taiwan, "COMPANY_CODES", {"A": "1", "B": "2"}), \
             patch.object(taiwan, "AGGREGATES", {"Total": ["A", "B"]}), \
             patch.object(taiwan, "retry_cache_scope", return_value=None), \
             patch.object(taiwan, "fetch_recent_revenue", side_effect=[ConnectionError("offline"), {"2021/02": {"revenue": 4.0, "yoy": None}}]), \
             patch.object(taiwan.time, "sleep"), redirect_stdout(io.StringIO()):
            taiwan.main(strict=True, allow_partial=True)
        result = {company["name"]: company for company in taiwan.parse_js_payload(path.read_text())}
        self.assertEqual(result["A"]["month"], "21/01")
        self.assertEqual(result["B"]["month"], "21/02")
        self.assertEqual(result["Total"]["month"], "21/01")
        self.assertEqual(result["Total"]["bars"], [4.0])

    def test_bad_existing_schema_or_missing_company_is_fatal_before_collection(self):
        path = self.root / "dashboard-data.js"
        valid = {"name": "A", "month": "21/01", "bars": [1.0], "yoyLine": [None], "momLine": [None]}
        corrupt = []
        for field, value in (("bars", [None]), ("month", "21/13"), ("yoyLine", []), ("momLine", ["broken"]), ("currency", []), ("yearly", [])):
            company = deepcopy(valid)
            company[field] = value
            corrupt.append([company])
        corrupt.extend(([], [valid, valid], [{**valid, "name": "Missing"}], {"A": valid}))
        with patch.object(taiwan, "DATA_PATH", path), \
             patch.object(taiwan, "COMPANY_CODES", {"A": "1"}), \
             patch.object(taiwan, "AGGREGATES", {}), \
             patch.object(taiwan, "fetch_recent_revenue") as fetch, redirect_stdout(io.StringIO()):
            for companies in corrupt:
                with self.subTest(companies=companies):
                    path.write_text("window.dashboardCompanies = " + json.dumps(companies) + ";\n")
                    original = path.read_bytes()
                    with self.assertRaises(RuntimeError):
                        taiwan.main(strict=True, allow_partial=True)
                    self.assertEqual(path.read_bytes(), original)
            fetch.assert_not_called()
        self.assertFalse(self.status_path.exists())


if __name__ == "__main__":
    unittest.main()
