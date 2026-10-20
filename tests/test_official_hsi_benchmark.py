"""Official HSI benchmark must be complete and agree with its own close series."""

from datetime import date, timedelta
import importlib.util
from pathlib import Path
import sys
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
HAS_DEPS = all(importlib.util.find_spec(name) for name in ("pandas", "yfinance", "curl_cffi"))
if HAS_DEPS:
    import update_asia_screening as screening


@unittest.skipUnless(HAS_DEPS, "Requires collector dependencies")
class OfficialHSIBenchmarkTests(unittest.TestCase):
    def responses(self, *, current_date="2026-10-20", latest_close="23867.74", current_close="23867.74"):
        rows = [{"date": (date(2024, 1, 1) + timedelta(days=i)).isoformat(),
                 "close": "24000.00"} for i in range(400)]
        rows.append({"date": current_date, "close": latest_close})

        class Response:
            def __init__(self, payload):
                self.payload = payload

            def json(self):
                return self.payload

        return [Response({"code": "0", "data": [{"indexCode": "00001.00", "indexType": "PI",
                          "indexTime": current_date + " 16:08:42", "indexValue": current_close}]}),
                Response({"code": "0", "data": [{"indexCode": "00001.00", "valueHistory": rows}]})]

    def test_accepts_matching_completed_official_history(self):
        with patch.object(screening, "get", side_effect=self.responses()) as get:
            result = screening.official_hsi_history("2026-10-20")
        self.assertEqual(result["records"][-1], {"date": "2026-10-20", "close": 23867.74})
        self.assertEqual(len(result["records"]), 401)
        self.assertEqual(result["priceSource"]["provider"], "Hang Seng Indexes")
        self.assertEqual(get.call_count, 2)

    def test_rejects_stale_or_disagreeing_history(self):
        for responses in (self.responses(current_date="2026-10-16"),
                          self.responses(latest_close="23800.00")):
            with self.subTest(responses=responses), patch.object(screening, "get", side_effect=responses):
                with self.assertRaises(ValueError):
                    screening.official_hsi_history("2026-10-20")


if __name__ == "__main__":
    unittest.main()
