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
            if row["assetType"] == "ETF":
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
            if rows[row["ticker"]]["assetType"] == "ETF":
                assert row["score"] is not None and row["asOfDate"] == rs["updatedAt"], row["ticker"]
            if row.get("scoreBasis") == "available-history-provisional":
                assert row["ticker"] in ("6082.HK", "0100.HK")
                assert 60 <= row["historySessions"] < 200
        assert not data["meta"]["missing"], data["meta"]["missing"]
        assert set(data["meta"]["watchlist"]) <= set(rows)
        assert path.stat().st_size < 24 * 1024 * 1024
        print(f"PASS {region}: {len(rows)} tickers, {rs['updatedAt']}")


if __name__ == "__main__":
    main()
