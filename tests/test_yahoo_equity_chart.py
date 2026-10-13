"""A Yahoo quote without trades must not become a completed equity session."""
from datetime import datetime, timezone
import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import Mock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
@unittest.skipUnless(all(importlib.util.find_spec(name) for name in ("pandas", "yfinance", "curl_cffi")),
                     "Requires collector dependencies")
class YahooEquityChartTests(unittest.TestCase):
    def test_zero_volume_dates_are_dropped_from_saved_and_new_history(self):
        import update_asia_screening as collector
        with tempfile.TemporaryDirectory() as directory:
            cache = Path(directory)
            (cache / "601059.SS.json").write_text(json.dumps({
                "priceSource": {"provider": "Yahoo Finance"},
                "records": [
                    {"date": "2026-09-14", "open": 15.5, "high": 15.6, "low": 15.4,
                     "close": 15.56, "adjClose": 15.56, "volume": 1000},
                    {"date": "2026-09-15", "open": 15.56, "high": 15.56, "low": 15.56,
                     "close": 15.56, "adjClose": 15.56, "volume": 0},
                ],
            }), encoding="utf8")
            stamp = int(datetime(2026, 10, 12, 7, tzinfo=timezone.utc).timestamp())
            result = {"timestamp": [stamp], "meta": {"shortName": "Suspended"},
                      "indicators": {"quote": [{"open": [15.56], "high": [15.56],
                                                   "low": [15.56], "close": [15.56],
                                                   "volume": [0]}],
                                     "adjclose": [{"adjclose": [15.56]}]}}
            response = Mock()
            response.json.return_value = {"chart": {"result": [result]}}
            with patch.object(collector, "CACHE", cache), patch.object(collector, "get", return_value=response):
                payload = collector.chart("601059.SS")
            self.assertEqual([row["date"] for row in payload["records"]], ["2026-09-14"])
            self.assertEqual(json.loads((cache / "601059.SS.json").read_text(encoding="utf8"))["records"],
                             payload["records"])


if __name__ == "__main__":
    unittest.main()
