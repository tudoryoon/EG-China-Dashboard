"""CSI 800 benchmark must come from a complete publisher-dated series."""

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
class OfficialCSI800BenchmarkTests(unittest.TestCase):
    def response(self, final_day="20261020", final_close=4610.19):
        rows = [{"tradeDate": (date(2024, 1, 1) + timedelta(days=i)).strftime("%Y%m%d"),
                 "indexCode": "000906", "close": 4500.0} for i in range(400)]
        rows.append({"tradeDate": final_day, "indexCode": "000906", "close": final_close})

        class Response:
            def json(self):
                return {"code": "200", "success": True, "data": rows}

        return Response()

    def test_accepts_target_session_with_long_official_history(self):
        with patch.object(screening, "get", return_value=self.response()) as get:
            result = screening.official_csi800_history("2026-10-20")
        self.assertEqual(result["records"][-1], {"date": "2026-10-20", "close": 4610.19})
        self.assertEqual(len(result["records"]), 401)
        self.assertEqual(result["priceSource"]["provider"], "China Securities Index")
        self.assertEqual(get.call_args.kwargs["params"]["endDate"], "20261020")

    def test_rejects_stale_or_wrong_index(self):
        with patch.object(screening, "get", return_value=self.response(final_day="20261019")):
            with self.assertRaises(ValueError):
                screening.official_csi800_history("2026-10-20")
        wrong = self.response()
        wrong.json()["data"][-1]["indexCode"] = "000300"
        with patch.object(screening, "get", return_value=wrong):
            with self.assertRaises(ValueError):
                screening.official_csi800_history("2026-10-20")


if __name__ == "__main__":
    unittest.main()
