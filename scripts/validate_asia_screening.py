"""Validate market boundaries, coverage and the shared-engine output contract."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main():
    for region, suffixes, minimum in [("hk", (".HK",), 400), ("cn", (".SS", ".SZ"), 800)]:
        path = ROOT / "data" / f"asia-{region}-screening.json"
        data = json.loads(path.read_text(encoding="utf8"))
        rs, trend = data["rs"], data["trend"]
        rows = {row["ticker"]: row for row in rs["rows"]}
        assert len(rows) == len(rs["rows"]) >= minimum
        assert all(ticker.endswith(suffixes) for ticker in rows)
        assert rs["updatedAt"] == rs["historyDates"][-1] == trend["updatedAt"]
        assert set(rows) == set(rs["histories"]) == {row["ticker"] for row in trend["rows"]["all"]}
        for ticker, row in rows.items():
            history = rs["histories"][ticker]
            for key in ["price", "open", "high", "low", "volume", "rsRatingAll"]:
                assert len(history[key]) == len(rs["historyDates"]), (ticker, key)
            assert row["asOfDate"] == rs["updatedAt"], (ticker, row["asOfDate"], rs["updatedAt"])
            assert history["price"][-1] is not None, ticker
            if row["assetType"] == "ETF":
                assert row["rsBasis"] == "equity-reference-percentile"
                assert row["priceSource"]["provider"] in ("Tencent", "Eastmoney")
                assert row["asOfDate"] == rs["updatedAt"]
                assert row["returns"]["1d"] is not None
                assert row["rsRatingAll"] is not None
            if row["assetType"] == "Index":
                assert ticker == "000688.SS"
                assert row["name"] == "STAR 50 Index"
                assert row["rsBasis"] == "equity-reference-percentile"
                assert row["priceSource"]["provider"] in ("Tencent", "Eastmoney")
                assert row["asOfDate"] == rs["updatedAt"]
                assert row["returns"]["1d"] is not None
                assert row["rsRatingAll"] is not None
            if row["rsRatingAll"] is not None:
                assert 1 <= row["rsRatingAll"] <= 99
            assert row["currency"] == data["meta"]["currency"]
        for row in trend["rows"]["all"]:
            assert row["score"] is None or 0 <= row["score"] <= 10
            ticker = row["ticker"]
            assert row["asOfDate"] == rs["updatedAt"], (ticker, row["asOfDate"], rs["updatedAt"])
            if rows[ticker]["historySessions"] >= 50:
                assert row["score"] is not None, ticker
            if rows[row["ticker"]]["assetType"] in ("ETF", "Index"):
                assert row["score"] is not None and row["asOfDate"] == rs["updatedAt"], row["ticker"]
            if row.get("scoreBasis") == "available-history-provisional":
                minimum = 60 if ticker in ("6082.HK", "0100.HK") else 20
                history = rs["histories"][ticker]
                assert row["historySessions"] >= minimum
                assert not (
                    all(value is not None for value in history["price"][-200:])
                    and all(value is not None for value in history["rsRatingAll"][-200:])
                ), ticker
        assert not data["meta"]["missing"], data["meta"]["missing"]
        assert set(data["meta"]["watchlist"]) <= set(rows)
        assert path.stat().st_size < 24 * 1024 * 1024
        print(f"PASS {region}: {len(rows)} tickers, {rs['updatedAt']}")


if __name__ == "__main__":
    main()
