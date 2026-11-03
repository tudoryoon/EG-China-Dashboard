"""Official China fallback must join only a verified prior regular session."""

import json
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))

try:
    from official_china_latest import latest_from_cache
except ModuleNotFoundError as error:
    if error.name != "exchange_calendars":
        raise
    latest_from_cache = None


class Response:
    def __init__(self, value):
        self.value = value

    def json(self):
        return self.value


@unittest.skipIf(latest_from_cache is None, "Requires collector dependencies")
class OfficialChinaLatestTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.cache = Path(self.temp.name) / "cache.json"
        self.prior = {"date": "2026-10-29", "open": 1.2, "high": 1.4,
                      "low": 1.1, "close": 1.3, "rawClose": 1.3,
                      "adjClose": 1.3, "volume": 1000}
        self.cache.write_text(json.dumps({"records": [self.prior],
                                          "priceSource": {"provider": "Tencent"}}), encoding="utf-8")

    def szse(self, prior_volume=10, target_high=1.6):
        return lambda *_args, **_kwargs: Response({"code": "0", "data": {
            "code": "159819", "picupdata": [
                ["2026-10-29", "1.2", "1.3", "1.1", "1.4", "", "", str(prior_volume)],
                ["2026-10-30", "1.4", "1.5", "1.3", str(target_high), "", "", "20"],
            ]}})

    def test_verified_bar_is_appended_without_writing_cache(self):
        result = latest_from_cache("159819.SZ", "2026-10-30", self.cache, self.szse())
        self.assertEqual(result["records"][-1]["date"], "2026-10-30")
        self.assertEqual(result["records"][-1]["close"], 1.5)
        self.assertEqual(result["records"][-1]["volume"], 2000)
        self.assertEqual(result["records"][-1]["rawClose"], 1.5)
        self.assertEqual(len(json.loads(self.cache.read_text())["records"]), 1)

    def test_prior_volume_mismatch_fails(self):
        with self.assertRaisesRegex(ValueError, "prior close/volume mismatch"):
            latest_from_cache("159819.SZ", "2026-10-30", self.cache, self.szse(prior_volume=11))

    def test_stale_cache_fails(self):
        stale = json.loads(self.cache.read_text())
        stale["records"][-1]["date"] = "2026-10-28"
        self.cache.write_text(json.dumps(stale), encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "Official daily history has 0 rows"):
            latest_from_cache("159819.SZ", "2026-10-30", self.cache, self.szse())

    def test_two_sessions_require_each_official_prior_match(self):
        self.prior["date"] = "2026-10-30"
        self.cache.write_text(json.dumps({"records": [self.prior],
                                          "priceSource": {"provider": "Tencent"}}), encoding="utf-8")
        def get(*_args, **_kwargs):
            return Response({"code": "0", "data": {"code": "159819", "picupdata": [
                ["2026-10-30", "1.2", "1.3", "1.1", "1.4", "", "", "10"],
                ["2026-11-02", "1.4", "1.5", "1.3", "1.6", "", "", "20"],
                ["2026-11-03", "1.5", "1.6", "1.4", "1.7", "", "", "30"],
            ]}})
        result = latest_from_cache("159819.SZ", "2026-11-03", self.cache, get)
        self.assertEqual([row["date"] for row in result["records"]],
                         ["2026-10-30", "2026-11-02", "2026-11-03"])
        self.assertEqual(result["records"][-1]["volume"], 3000)

    def test_invalid_target_ohlc_fails(self):
        with self.assertRaisesRegex(ValueError, "Invalid official OHLCV"):
            latest_from_cache("159819.SZ", "2026-10-30", self.cache, self.szse(target_high=1.45))

    def test_sse_bar_is_decoded(self):
        def get(*_args, **_kwargs):
            return Response({"code": "562500", "kline": [
                ["20261029", 1.2, 1.4, 1.1, 1.3, 1000],
                ["20261030", 1.4, 1.6, 1.3, 1.5, 2000],
            ]})
        result = latest_from_cache("562500.SS", "2026-10-30", self.cache, get)
        self.assertEqual(result["records"][-1]["date"], "2026-10-30")
        self.assertEqual(result["records"][-1]["volume"], 2000)

    def test_adjusted_history_requires_full_refresh(self):
        adjusted = json.loads(self.cache.read_text())
        adjusted["records"][-1]["adjClose"] = 1.31
        self.cache.write_text(json.dumps(adjusted), encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "Adjusted prior bar"):
            latest_from_cache("159819.SZ", "2026-10-30", self.cache, self.szse())


if __name__ == "__main__":
    unittest.main()
