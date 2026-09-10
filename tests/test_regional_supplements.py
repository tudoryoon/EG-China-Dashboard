"""Quote validation runs without dependencies; engine regressions run after install."""
from copy import deepcopy
import importlib.util
from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from regional_supplements import parse_etf_history, build_regional_rs, build_regional_trend


class QuoteTests(unittest.TestCase):
    def setUp(self):
        self.raw = {"code": "588200", "klines": [
            "2026-09-04,1.146,1.105,1.155,1.093,25847700,2898136545",
            "2026-09-07,1.119,1.139,1.147,1.105,24362395,2744857969",
            "2026-09-08,1.137,1.121,1.149,1.115,20922404,2364195374"]}

    def parse(self, raw=None, adjusted=None):
        return parse_etf_history("588200.SS", raw or self.raw, adjusted or self.raw, "2026-09-07")

    def test_completed_session_adjustment_and_volume_units(self):
        adjusted = deepcopy(self.raw)
        adjusted["klines"][0] = "2026-09-04,1.046,1.005,1.055,0.993,25847700,2898136545"
        records = self.parse(adjusted=adjusted)["records"]
        self.assertEqual(len(records), 2)
        self.assertEqual(records[-1]["date"], "2026-09-07")
        self.assertEqual(records[0]["rawClose"], 1.105)
        self.assertEqual(records[0]["close"], 1.005)
        self.assertEqual(records[0]["adjClose"], 1.005)
        self.assertEqual(records[0]["volume"], 2584770000)
        hk = {**self.raw, "code": "03033"}
        self.assertEqual(parse_etf_history("3033.HK", hk, hk, "2026-09-07")["records"][0]["volume"], 25847700)

    def test_wrong_symbol_duplicate_invalid_and_missing_adjustments_fail(self):
        invalids = [{**self.raw, "code": "999999"},
                    {**self.raw, "klines": self.raw["klines"] + self.raw["klines"][:1]},
                    {**self.raw, "klines": ["2026-09-07,1,2,1,1,100,100"]},
                    {**self.raw, "klines": ["2026-09-07,1,nan,2,1,100,100"]}]
        for raw in invalids:
            with self.subTest(raw=raw), self.assertRaises(ValueError):
                self.parse(raw=raw)
        with self.assertRaises(ValueError):
            self.parse(adjusted={**self.raw, "klines": self.raw["klines"][1:]})

    def test_vendor_open_outside_range_is_preserved_and_disclosed(self):
        raw = {"code": "03109", "klines": ["2026-05-04,15.090,15.320,15.410,15.280,344400,5284951"]}
        data = parse_etf_history("3109.HK", raw, raw, "2026-09-07")
        self.assertEqual(data["records"][0]["open"], 15.09)
        self.assertEqual(data["priceSource"]["openOutsideSessionRangeDates"], ["2026-05-04"])

    def test_unit_split_is_normalized_for_trend_not_just_rs(self):
        raw = {"code": "588200", "klines": ["2026-07-20,3,3,3,3,100,300", "2026-07-21,1,1,1,1,300,300"]}
        adjusted = {"code": "588200", "klines": ["2026-07-20,1,1,1,1,100,300", "2026-07-21,1,1,1,1,300,300"]}
        records = self.parse(raw, adjusted)["records"]
        self.assertEqual([r["rawClose"] for r in records], [3, 1])
        for field in ("open", "high", "low", "close", "adjClose"):
            self.assertEqual([r[field] for r in records], [1, 1])


@unittest.skipUnless(importlib.util.find_spec("pandas") and importlib.util.find_spec("yfinance"), "Requires data dependencies")
class EngineTests(unittest.TestCase):
    def test_etfs_do_not_move_equity_ranks_or_each_other(self):
        import pandas as pd
        import update_market_rs as rs
        dates = pd.bdate_range("2024-01-01", periods=300)
        equities = pd.DataFrame({"A": [100 + i for i in range(300)], "B": [100 + i / 2 for i in range(300)]}, index=dates)
        etfs = pd.DataFrame({"E": [100 + i * 2 for i in range(300)], "F": [100 - i / 10 for i in range(300)]}, index=dates)
        baseline = rs.weighted_rs_rating(rs.build_period_rs_ratings(equities))
        _, together = build_regional_rs(equities, etfs, rs)
        _, alone = build_regional_rs(equities, etfs[["E"]], rs)
        pd.testing.assert_frame_equal(together[equities.columns], baseline)
        pd.testing.assert_series_equal(together["E"], alone["E"])
        expected = rs.weighted_rs_rating(rs.build_period_rs_ratings(pd.concat([equities, etfs[["E"]]], axis=1)))["E"]
        pd.testing.assert_series_equal(together["E"], expected)
        self.assertGreater(together["E"].iloc[-1], together["F"].iloc[-1])
        # The same independent reference rule is used for an index such as STAR 50.
        _, with_index = build_regional_rs(equities, pd.DataFrame({"000688.SS": etfs["E"]}), rs)
        pd.testing.assert_frame_equal(with_index[equities.columns], baseline)
        pd.testing.assert_series_equal(with_index["000688.SS"], together["E"], check_names=False)

    def test_provisional_has_minimum_and_converges_to_standard_at_200(self):
        import pandas as pd
        import update_market_trend_score as trend
        prices = pd.Series(range(100, 350), dtype=float)
        relative = prices / 100
        standard = trend.build_score_frame(prices, relative)
        provisional = trend.build_score_frame(prices, relative, provisional_long_trend_min_periods=60)
        self.assertTrue(provisional["score"].iloc[:59].isna().all())
        self.assertTrue(pd.notna(provisional["score"].iloc[59]))
        self.assertTrue(standard["score"].iloc[:199].isna().all())
        pd.testing.assert_series_equal(provisional["score"].iloc[199:], standard["score"].iloc[199:])

    def test_trend_configuration_restored_after_failure(self):
        from types import SimpleNamespace
        def fail(*args):
            self.assertEqual(engine.PROVISIONAL_LONG_TREND_MIN_PERIODS_BY_TICKER["6082.HK"], 60)
            self.assertEqual(engine.PROVISIONAL_LONG_TREND_MIN_PERIODS_BY_TICKER["NEW.HK"], 20)
            self.assertEqual(engine.PROVISIONAL_LONG_TREND_MIN_PERIODS_BY_TICKER["GAPPED.HK"], 20)
            raise RuntimeError("fixture")
        original = {"EXISTING": 50}
        original_set = set(original)
        engine = SimpleNamespace(PROVISIONAL_LONG_TREND_MIN_PERIODS_BY_TICKER=original,
                                 PROVISIONAL_LONG_TREND_TICKERS=original_set, build_universe_payload=fail)
        with self.assertRaises(RuntimeError):
            build_regional_trend(engine, "all", {}, {"histories": {
                "6082.HK": {"price": [1] * 167, "rsRatingAll": [1] * 167},
                "NEW.HK": {"price": [1] * 80, "rsRatingAll": [1] * 80},
                "GAPPED.HK": {"price": [1] * 249 + [None], "rsRatingAll": [1] * 250},
            }})
        self.assertIs(engine.PROVISIONAL_LONG_TREND_MIN_PERIODS_BY_TICKER, original)
        self.assertIs(engine.PROVISIONAL_LONG_TREND_TICKERS, original_set)

        def completed(*args):
            self.assertNotIn("6082.HK", engine.PROVISIONAL_LONG_TREND_TICKERS)
        engine.build_universe_payload = completed
        build_regional_trend(engine, "all", {}, {"histories": {"6082.HK": {"price": [1] * 200}}})
