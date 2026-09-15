from copy import deepcopy
import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from regional_failure_retention import retain_failed_securities, require_collection_coverage


OLD_DATE = "2026-09-11"
NEW_DATE = "2026-09-14"


def previous_snapshot(symbol="FAIL.HK"):
    return {
        "rs": {"updatedAt": OLD_DATE, "historyDates": ["2026-09-10", OLD_DATE],
               "rows": [{"ticker": symbol, "name": "Old label", "groups": ["Old group"],
                         "watchlist": False, "assetType": "Equity", "asOfDate": OLD_DATE,
                         "price": 20, "rsRatingAll": 81, "returns": {"1d": 5},
                         "sourceTicker": "OLD.HK", "aliases": ["OLD.HK"]}],
               "histories": {symbol: {"price": [19, 20], "open": [18, 19], "high": [20, 21],
                                       "low": [18, 19], "volume": [10, 20], "rsRatingAll": [80, 81]}}},
        "trend": {"updatedAt": OLD_DATE, "historyDates": ["2026-09-10", OLD_DATE],
                  "rows": {"all": [{"ticker": symbol, "name": "Old label", "asOfDate": OLD_DATE,
                                    "price": 20, "score": 8, "rank": 2, "scoreChange": 1}]},
                  "histories": {"all": {symbol: {"score": [7, 8], "rank": [3, 2], "climaxScore": [0, 0],
                                                   "price": [19, 20], "relative": [1.2, 1.3], "rsRating": [80, 81]}}}},
    }


def fresh_snapshot(errors=None):
    return {
        "meta": {"missing": errors if errors is not None else {"FAIL.HK": "No completed quote"}},
        "rs": {"updatedAt": NEW_DATE, "historyDates": ["2026-09-10", OLD_DATE, NEW_DATE],
               "rows": [{"ticker": "GOOD.HK", "price": 40, "asOfDate": NEW_DATE, "rsRatingAll": 90}],
               "histories": {"GOOD.HK": {"price": [38, 39, 40]}}},
        "trend": {"updatedAt": NEW_DATE, "historyDates": [OLD_DATE, NEW_DATE],
                  "rows": {"all": [{"ticker": "GOOD.HK", "price": 40, "asOfDate": NEW_DATE, "score": 9, "rank": 1}]},
                  "histories": {"all": {"GOOD.HK": {"price": [39, 40]}}}},
    }


def members(*symbols):
    return [{"ticker": symbol, "name": "Current " + symbol, "groups": ["HSCI"],
             "watchlist": True, "assetType": "Equity"} for symbol in symbols]


class RegionalFailureRetentionTests(unittest.TestCase):
    def test_failed_price_and_scores_retain_dates_without_affecting_fresh_rows(self):
        output, previous = fresh_snapshot(), previous_snapshot()
        original_previous = deepcopy(previous)
        original_good = deepcopy(output["rs"]["rows"][0])
        current = members("GOOD.HK", "FAIL.HK")
        current[1].update(sourceTicker="NEW.HK", aliases=["NEW.HK"], identitySource="official-notice")
        retain_failed_securities(output, previous, current)
        good, stale = output["rs"]["rows"]
        self.assertEqual(good, original_good)
        self.assertEqual(previous, original_previous)
        self.assertEqual((stale["price"], stale["rsRatingAll"], stale["returns"]), (20, 81, {"1d": 5}))
        self.assertEqual(stale["asOfDate"], OLD_DATE)
        self.assertEqual(stale["groups"], ["HSCI"])
        self.assertEqual(stale["aliases"], ["NEW.HK"])
        self.assertEqual(stale["dataStatus"], "stale")
        self.assertEqual(stale["collectionError"], "No completed quote")
        self.assertEqual(output["rs"]["histories"]["FAIL.HK"]["price"], [19, 20, None])
        trow = next(row for row in output["trend"]["rows"]["all"] if row["ticker"] == "FAIL.HK")
        self.assertEqual((trow["score"], trow["rank"], trow["asOfDate"]), (8, 2, OLD_DATE))
        self.assertEqual(output["trend"]["histories"]["all"]["FAIL.HK"]["score"], [8, None])
        self.assertEqual(output["meta"], {"missing": {"FAIL.HK": "No completed quote"},
                                         "fresh": 1, "covered": 2, "requested": 2,
                                         "retained": ["FAIL.HK"], "omitted": []})

    def test_unknown_failures_are_omitted_and_inactive_members_stay_removed(self):
        output = fresh_snapshot({"NEW.HK": "No history"})
        retain_failed_securities(output, previous_snapshot("REMOVED.HK"), members("GOOD.HK", "NEW.HK"))
        self.assertEqual([row["ticker"] for row in output["rs"]["rows"]], ["GOOD.HK"])
        self.assertEqual(output["meta"]["missing"], {"NEW.HK": "No history"})
        self.assertEqual(output["meta"]["omitted"], ["NEW.HK"])
        self.assertEqual(output["meta"]["covered"], 1)
        self.assertEqual(output["meta"]["requested"], 2)

    def test_second_failure_keeps_original_observation_and_clears_old_aliases(self):
        output = fresh_snapshot()
        retain_failed_securities(output, previous_snapshot(), members("GOOD.HK", "FAIL.HK"))
        tomorrow = fresh_snapshot({"FAIL.HK": "Still unavailable"})
        tomorrow["rs"]["updatedAt"] = tomorrow["trend"]["updatedAt"] = "2026-09-15"
        tomorrow["rs"]["historyDates"].append("2026-09-15")
        tomorrow["trend"]["historyDates"].append("2026-09-15")
        retain_failed_securities(tomorrow, output, members("GOOD.HK", "FAIL.HK"))
        row = next(row for row in tomorrow["rs"]["rows"] if row["ticker"] == "FAIL.HK")
        self.assertEqual(row["asOfDate"], OLD_DATE)
        self.assertNotIn("sourceTicker", row)
        self.assertNotIn("aliases", row)
        self.assertEqual(row["collectionError"], "Still unavailable")
        self.assertEqual(tomorrow["rs"]["histories"]["FAIL.HK"]["price"], [19, 20, None, None])
        self.assertEqual(tomorrow["trend"]["histories"]["all"]["FAIL.HK"]["score"], [8, None, None])

    def test_recovery_uses_only_new_output_and_removes_stale_state(self):
        previous = fresh_snapshot()
        retain_failed_securities(previous, previous_snapshot(), members("GOOD.HK", "FAIL.HK"))
        output = fresh_snapshot({})
        output["rs"]["rows"].append({"ticker": "FAIL.HK", "price": 22, "asOfDate": NEW_DATE, "rsRatingAll": 91})
        output["trend"]["rows"]["all"].append({"ticker": "FAIL.HK", "price": 22, "asOfDate": NEW_DATE, "score": 9, "rank": 2})
        retain_failed_securities(output, previous, members("GOOD.HK", "FAIL.HK"))
        row = next(row for row in output["rs"]["rows"] if row["ticker"] == "FAIL.HK")
        self.assertEqual(row["price"], 22)
        self.assertNotIn("dataStatus", row)
        self.assertNotIn("collectionError", row)
        self.assertEqual(output["meta"]["retained"], [])
        self.assertEqual(output["meta"]["fresh"], 2)

    def test_same_day_retry_retains_real_dates_and_internal_gaps(self):
        previous = previous_snapshot()
        previous["rs"]["histories"]["FAIL.HK"]["price"][0] = None
        output = fresh_snapshot()
        output["rs"]["updatedAt"] = output["trend"]["updatedAt"] = OLD_DATE
        output["rs"]["historyDates"] = ["2026-09-10", OLD_DATE]
        output["trend"]["historyDates"] = [OLD_DATE]
        retain_failed_securities(output, previous, members("GOOD.HK", "FAIL.HK"))
        self.assertEqual(output["meta"]["retained"], ["FAIL.HK"])
        self.assertEqual(output["rs"]["histories"]["FAIL.HK"]["price"], [None, 20])
        row = next(row for row in output["rs"]["rows"] if row["ticker"] == "FAIL.HK")
        self.assertEqual(row["asOfDate"], output["rs"]["updatedAt"])
        self.assertEqual(row["dataStatus"], "stale")

    def test_unusable_previous_pairs_are_explicitly_omitted(self):
        scenarios = []
        old = previous_snapshot()
        old["trend"]["rows"]["all"] = []
        scenarios.append(old)
        old = previous_snapshot()
        old["rs"]["histories"]["FAIL.HK"]["price"].append(21)
        scenarios.append(old)
        old = previous_snapshot()
        old["trend"]["rows"]["all"][0]["asOfDate"] = "2026-09-10"
        scenarios.append(old)
        old = previous_snapshot()
        old["rs"]["rows"][0]["price"] = float("nan")
        scenarios.append(old)
        for previous in scenarios:
            with self.subTest(previous=previous):
                output = fresh_snapshot()
                retain_failed_securities(output, previous, members("GOOD.HK", "FAIL.HK"))
                self.assertEqual(output["meta"]["retained"], [])
                self.assertEqual(output["meta"]["omitted"], ["FAIL.HK"])

    def test_ten_failures_allowed_but_eleven_and_systemic_empty_fail(self):
        require_collection_coverage(574, 584, {f"{i}.HK": "error" for i in range(10)})
        with self.assertRaisesRegex(RuntimeError, "11 > 10"):
            require_collection_coverage(573, 584, {f"{i}.HK": "error" for i in range(11)})
        with self.assertRaisesRegex(RuntimeError, "Insufficient coverage"):
            require_collection_coverage(0, 5, {f"{i}.HK": "error" for i in range(5)})


@unittest.skipUnless(importlib.util.find_spec("pandas") and importlib.util.find_spec("yfinance")
                     and importlib.util.find_spec("curl_cffi"), "Requires data dependencies")
class RegionalCollectorRetentionTests(unittest.TestCase):
    def collect_with_failure(self, error):
        import pandas as pd
        import update_asia_screening as collector
        dates = pd.bdate_range(end=NEW_DATE, periods=300)
        records = [{"date": day.strftime("%Y-%m-%d"), "open": 100 + index, "high": 102 + index,
                    "low": 99 + index, "close": 101 + index, "adjClose": 101 + index, "volume": 1000}
                   for index, day in enumerate(dates)]
        current = members("FAIL.HK", *(f"OK{i:02}.HK" for i in range(20)))

        def quote(symbol, *args):
            if symbol == "FAIL.HK":
                raise error
            return {"records": deepcopy(records), "name": symbol, "priceSource": {"provider": "Fixture"}}

        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "data").mkdir()
            snapshot = root / "data/asia-hk-screening.json"
            snapshot.write_text(json.dumps(previous_snapshot()), encoding="utf8")
            with patch.object(collector, "ROOT", root), patch.object(collector, "CACHE", root / "cache"), \
                 patch.object(collector, "constituents", return_value=(current, [])), \
                 patch.object(collector, "regional_benchmark", return_value={"records": records}), \
                 patch.object(collector, "chart", return_value={"records": [{"close": 7.8}]}), \
                 patch.object(collector, "equity_chart", side_effect=quote), \
                 patch.object(collector.yf, "Ticker") as ticker:
                ticker.return_value.get_info.return_value = {}
                collector.run("hk")
            output = json.loads(snapshot.read_text(encoding="utf8"))
        return output

    def test_real_engines_publish_successes_and_preserve_failed_prior_pair(self):
        output = self.collect_with_failure(ValueError("Fixture unavailable quote"))
        self.assertEqual(output["meta"]["fresh"], 20)
        self.assertEqual(output["meta"]["covered"], 21)
        self.assertEqual(output["meta"]["retained"], ["FAIL.HK"])
        stale = next(row for row in output["rs"]["rows"] if row["ticker"] == "FAIL.HK")
        self.assertEqual(stale["asOfDate"], OLD_DATE)
        self.assertEqual(stale["rsRatingAll"], 81)
        self.assertIsNone(output["rs"]["histories"]["FAIL.HK"]["price"][-1])
        self.assertIsNone(output["trend"]["histories"]["all"]["FAIL.HK"]["score"][-1])
        self.assertTrue(all(row["asOfDate"] == NEW_DATE for row in output["rs"]["rows"] if row["ticker"] != "FAIL.HK"))

    def test_empty_exception_message_remains_a_valid_tolerated_failure(self):
        from collection_policy import summarize_failures
        output = self.collect_with_failure(TimeoutError())
        self.assertEqual(output["meta"]["missing"], {"FAIL.HK": "TimeoutError"})
        self.assertEqual(output["meta"]["fresh"], 20)
        self.assertEqual(output["meta"]["retained"], ["FAIL.HK"])
        for row in output["rs"]["rows"] + output["trend"]["rows"]["all"]:
            if row["ticker"] == "FAIL.HK":
                self.assertEqual(row["collectionError"], "TimeoutError")
        self.assertEqual(summarize_failures({"hk": output})["failureCount"], 1)


if __name__ == "__main__":
    unittest.main()
