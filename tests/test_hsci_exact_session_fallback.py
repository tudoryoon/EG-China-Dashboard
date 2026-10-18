"""The old HSCI host may fail only after its target-session list was collected."""

import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import update_asia_screening as screening


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
        with patch.object(screening, "get", side_effect=ConnectionError("old host unavailable")):
            with self.assertRaisesRegex(RuntimeError, "not from target session"):
                screening.constituents("hk")
        self.snapshot["sources"][0]["asOf"] = "2026-10-16 01:08:56"
        self.write_snapshot()
        with patch.object(screening, "get", side_effect=[ConnectionError("old host unavailable"),
                                                         self.count_response(580)]):
            with self.assertRaisesRegex(RuntimeError, "official count does not validate"):
                screening.constituents("hk")


if __name__ == "__main__":
    unittest.main()
