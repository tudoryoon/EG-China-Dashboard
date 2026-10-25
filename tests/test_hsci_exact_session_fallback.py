"""The old HSCI host may fail only after its target-session list was collected."""

import json
import importlib.util
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
HAS_COLLECTOR_DEPENDENCIES = all(importlib.util.find_spec(name)
                                 for name in ("pandas", "yfinance", "curl_cffi"))
if HAS_COLLECTOR_DEPENDENCIES:
    import update_asia_screening as screening


@unittest.skipUnless(HAS_COLLECTOR_DEPENDENCIES, "Requires collector dependencies")
class HSCIExactSessionFallbackTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        root = Path(self.temp.name)
        (root / "data").mkdir()
        members = [{"ticker": f"{code:04d}.HK", "name": f"Member {code}",
                    "groups": ["HSCI"]} for code in range(1, 582)]
        self.snapshot = {"sources": [{"label": "Hang Seng Composite",
                                      "url": screening.HS_SOURCE,
                                      "asOf": "2026-10-16 01:08:56", "count": 581}],
                         "members": members}
        self.path = root / "data" / "asia-hk-constituents.json"
        self.write_snapshot()
        self.root_patch = patch.object(screening, "ROOT", root)
        self.date_patch = patch.object(screening, "expected_session", return_value="2026-10-16")
        self.root_patch.start()
        self.date_patch.start()
        self.addCleanup(self.root_patch.stop)
        self.addCleanup(self.date_patch.stop)

    def write_snapshot(self):
        self.path.write_text(json.dumps(self.snapshot), encoding="utf8")

    def count_response(self, count=581):
        class Response:
            def json(self):
                return {"code": "0", "data": {"numOfConsList": [
                    {"indexCode": "00011.00", "count": count}]}}
        return Response()

    def history_frame(self, latest="2026-09-15", count=581):
        rows = [[None] * 8 for _ in range(6)]
        rows[4][0] = "Effective Date 生效日期"
        rows += [[latest if index == 0 else "2026-09-01", count,
                  "Add 加入", "+1", index + 1, "Hong Kong", "Member", ""]
                 for index in range(105)]
        return screening.pd.DataFrame(rows)

    def test_matching_official_count_allows_exact_session_snapshot(self):
        def fetch(url, **kwargs):
            if url == screening.HS_SOURCE:
                raise ConnectionError("old host unavailable")
            self.assertEqual(kwargs["params"]["seriesCode"], "hsci")
            return self.count_response()

        with patch.object(screening, "get", side_effect=fetch):
            members, sources = screening.constituents("hk")
        self.assertEqual(len(members), 581 + len(set(screening.WATCH["hk"]) -
                                                 {row["ticker"] for row in self.snapshot["members"]}))
        self.assertEqual(sources[0]["asOf"], "2026-10-16 01:08:56")
        self.assertEqual(sources[0]["countVerificationUrl"], screening.HS_COUNT_SOURCE)

    def test_old_snapshot_or_changed_count_fails_closed(self):
        self.snapshot["sources"][0]["asOf"] = "2026-10-15 01:08:56"
        self.write_snapshot()
        with patch.object(screening, "get", side_effect=ConnectionError("official source unavailable")):
            with self.assertRaises(ConnectionError):
                screening.constituents("hk")
        self.snapshot["sources"][0]["asOf"] = "2026-10-16 01:08:56"
        self.write_snapshot()
        with patch.object(screening, "get", side_effect=[ConnectionError("old host unavailable"),
                                                         self.count_response(580)]):
            with self.assertRaisesRegex(RuntimeError, "snapshot count does not match official count"):
                screening.constituents("hk")

    def test_official_history_and_count_validate_unchanged_prior_session(self):
        class HistoryResponse:
            content = b"official workbook bytes"

        def fetch(url, **kwargs):
            if url == screening.HS_SOURCE:
                raise ConnectionError("old host unavailable")
            if url == screening.HS_COUNT_SOURCE:
                return self.count_response()
            self.assertEqual(url, screening.HS_CHANGE_HISTORY_SOURCE)
            self.assertEqual(kwargs["params"]["resource"], screening.HS_CHANGE_HISTORY_RESOURCE)
            return HistoryResponse()

        with patch.object(screening, "expected_session", return_value="2026-10-20"), \
             patch.object(screening, "get", side_effect=fetch), \
             patch.object(screening.pd, "read_excel", return_value=self.history_frame()):
            members, sources = screening.constituents("hk")
        self.assertEqual(len(members), 581 + len(set(screening.WATCH["hk"]) -
                                                 {row["ticker"] for row in self.snapshot["members"]}))
        self.assertEqual(sources[0]["asOf"], "2026-10-20")
        self.assertEqual(sources[0]["reconciledFrom"], "2026-10-16 01:08:56")
        self.assertEqual(sources[0]["verifiedThrough"], "2026-10-20")
        self.assertEqual(sources[0]["changeHistoryLatestEffective"], "2026-09-15")

    def test_same_count_constituent_swap_after_snapshot_fails_closed(self):
        class HistoryResponse:
            content = b"official workbook bytes"

        with patch.object(screening, "get", return_value=HistoryResponse()), \
             patch.object(screening.pd, "read_excel", return_value=self.history_frame(latest="2026-10-20")):
            with self.assertRaisesRegex(RuntimeError, "does not validate"):
                screening.verify_hsci_unchanged("2026-10-16", "2026-10-20", 581)


if __name__ == "__main__":
    unittest.main()
