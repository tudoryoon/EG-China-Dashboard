"""Validate fresh data and explicitly retained failures under one shared budget."""
import json
from pathlib import Path
from collection_policy import failure_map, summarize_failures

ROOT = Path(__file__).resolve().parents[1]


def validate_region(data, region, members):
    suffixes, minimum = ((".HK",), 400) if region == "hk" else ((".SS", ".SZ"), 800)
    rs, trend, meta = data["rs"], data["trend"], data["meta"]
    rows = {row["ticker"]: row for row in rs["rows"]}
    trend_rows = {row["ticker"]: row for row in trend["rows"]["all"]}
    expected = {member["ticker"] for member in members}
    missing = failure_map(meta["missing"], region)
    assert len(expected) == len(members) >= minimum, "Invalid constituent universe"
    assert len(rows) == len(rs["rows"]) and len(trend_rows) == len(trend["rows"]["all"])
    assert meta["requested"] == len(expected) and meta["covered"] == len(rows)
    assert set(rows) | set(missing) == expected, "Undeclared missing or foreign security"
    retained, omitted = set(rows) & set(missing), set(missing) - set(rows)
    assert set(meta.get("retained", [])) == retained
    assert set(meta.get("omitted", [])) == omitted
    assert meta.get("fresh", len(rows)) == len(rows) - len(retained)
    assert all(ticker.endswith(suffixes) for ticker in expected)
    assert rs["updatedAt"] == rs["historyDates"][-1] == trend["updatedAt"] == trend["historyDates"][-1]
    assert rs["historyDates"] == sorted(set(rs["historyDates"]))
    assert trend["historyDates"] == sorted(set(trend["historyDates"]))
    assert set(rows) == set(rs["histories"]) == set(trend_rows) == set(trend["histories"]["all"])
    for ticker, row in rows.items():
        history = rs["histories"][ticker]
        for key in ["price", "open", "high", "low", "volume", "rsRatingAll"]:
            assert len(history[key]) == len(rs["historyDates"]), (ticker, key)
        if ticker in retained:
            assert row.get("dataStatus") == "stale" and row.get("collectionError") == missing[ticker], ticker
            assert row["asOfDate"] <= rs["updatedAt"], ticker
            observations = [day for day, price in zip(rs["historyDates"], history["price"]) if price is not None]
            assert observations and observations[-1] == row["asOfDate"], ticker
            for values in history.values():
                assert len(values) == len(rs["historyDates"]), ticker
                assert all(value is None for day, value in zip(rs["historyDates"], values) if day > row["asOfDate"]), ticker
        else:
            assert row.get("dataStatus") != "stale" and not row.get("collectionError"), ticker
            assert row["asOfDate"] == rs["updatedAt"], (ticker, row["asOfDate"], rs["updatedAt"])
            assert history["price"][-1] is not None, ticker
        if row["assetType"] in ("ETF", "Index"):
            assert row["rsBasis"] == "equity-reference-percentile"
            assert row["priceSource"]["provider"] in ("Tencent", "Eastmoney")
            if ticker not in retained:
                assert row["returns"]["1d"] is not None and row["rsRatingAll"] is not None, ticker
        if row["assetType"] == "Index":
            assert ticker == "000688.SS" and row["name"] == "STAR 50 Index"
        if row["rsRatingAll"] is not None:
            assert 1 <= row["rsRatingAll"] <= 99
        assert row["currency"] == meta["currency"]
        tr = trend_rows[ticker]
        assert tr["score"] is None or 0 <= tr["score"] <= 10
        assert tr["asOfDate"] == row["asOfDate"], ticker
        th = trend["histories"]["all"][ticker]
        for values in th.values():
            assert len(values) == len(trend["historyDates"]), ticker
        if ticker in retained:
            assert tr.get("dataStatus") == "stale" and tr.get("collectionError") == missing[ticker], ticker
            for values in th.values():
                assert all(value is None for day, value in zip(trend["historyDates"], values) if day > tr["asOfDate"]), ticker
            continue
        assert tr.get("dataStatus") != "stale" and not tr.get("collectionError"), ticker
        if row["historySessions"] >= 50 or row["assetType"] in ("ETF", "Index"):
            assert tr["score"] is not None, ticker
        if tr.get("scoreBasis") == "available-history-provisional":
            minimum_history = 60 if ticker in ("6082.HK", "0100.HK") else 20
            assert tr["historySessions"] >= minimum_history
            assert not (
                all(value is not None for value in history["price"][-200:])
                and all(value is not None for value in history["rsRatingAll"][-200:])
            ), ticker
    assert set(meta["watchlist"]) <= set(rows) | set(missing)
    return missing


def main(root=ROOT):
    regional = {}
    for region in ("hk", "cn"):
        path = root / f"data/asia-{region}-screening.json"
        data = json.loads(path.read_text(encoding="utf8"))
        members = json.loads((root / f"data/asia-{region}-constituents.json").read_text(encoding="utf8"))["members"]
        missing = validate_region(data, region, members)
        assert path.stat().st_size < 24 * 1024 * 1024
        regional[region] = data
        print(f"PASS {region}: {data['meta']['covered']} tickers, {data['rs']['updatedAt']}; {len(missing)} collection failures")
    report_path = root / "data/taiwan-collection-status.json"
    report = json.loads(report_path.read_text(encoding="utf8")) if report_path.exists() else None
    result = summarize_failures(regional, report)
    print(f"PASS combined security failure budget: {result['failureCount']}/{result['failureLimit']}")


if __name__ == "__main__":
    main()
