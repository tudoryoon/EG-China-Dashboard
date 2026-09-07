"""Independent HK/A-share universes using the dashboard's RS and Trend engines."""
from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone, timedelta
from io import BytesIO
import json
from pathlib import Path
import time

from curl_cffi import requests
import pandas as pd
import yfinance as yf

import update_market_rs as rs
import update_market_trend_score as trend

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / ".asia-screening-cache"
HS_SOURCE = "https://origin-www.hsi.com.hk/data/eng/rt/index-series/hsci/constituents.do"
CSI_SOURCE = "https://oss-ch.csindex.com.cn/static/html/csindex/public/uploads/file/autofile/cons/{}cons.xls"
WATCH = {
    "hk": "9988.HK 0700.HK 0992.HK 3033.HK 1810.HK 0100.HK 1347.HK 0981.HK 3109.HK 6082.HK 9660.HK 2026.HK 9999.HK".split(),
    "cn": "588200.SS 002371.SZ 600183.SS 562500.SS 688072.SS 000977.SZ 688702.SS 159819.SZ 301377.SZ 601869.SS".split(),
}
ETFS = {"3033.HK", "3109.HK", "588200.SS", "562500.SS", "159819.SZ"}
META = {
    "hk": {"label": "Hong Kong", "currency": "HKD", "benchmark": "^HSI", "benchmarkLabel": "Hang Seng Index", "fx": "HKD=X"},
    "cn": {"label": "China A", "currency": "CNY", "benchmark": "000906", "benchmarkLabel": "CSI 800", "fx": "CNY=X"},
}


def get(url, **kwargs):
    for attempt in range(3):
        try:
            response = requests.get(url, impersonate="chrome", timeout=35, **kwargs)
            response.raise_for_status()
            return response
        except Exception:
            if attempt == 2:
                raise
            time.sleep(1 + attempt)


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_suffix(path.suffix + ".tmp")
    temp.write_text(json.dumps(value, ensure_ascii=False, separators=(",", ":"), allow_nan=False), encoding="utf-8")
    temp.replace(path)


def constituents(region):
    members = {}
    sources = []
    if region == "hk":
        data = get(HS_SOURCE).json()
        item = data["indexSeriesList"][0]["indexList"][0]
        content = item["constituentContent"]
        assert len(content) == int(item["constituentsCount"]) and len(content) >= 400
        for row in content:
            symbol = str(int(row["code"])).zfill(4) + ".HK"
            members[symbol] = {"ticker": symbol, "name": row["constituentName"], "groups": ["HSCI"]}
        sources.append({"label": "Hang Seng Composite", "url": HS_SOURCE, "asOf": data["requestDate"], "count": len(members)})
    else:
        for code, label, expected in [("000300", "CSI 300", 300), ("000905", "CSI 500", 500)]:
            url = CSI_SOURCE.format(code)
            table = pd.read_excel(BytesIO(get(url).content), dtype=str)
            assert len(table) == expected, f"{label}: incomplete constituents ({len(table)})"
            for row in table.itertuples(index=False, name=None):
                symbol = str(row[4]).zfill(6) + (".SS" if "Shanghai" in row[8] else ".SZ")
                member = members.setdefault(symbol, {"ticker": symbol, "name": row[6], "groups": []})
                member["groups"].append(label)
            sources.append({"label": label, "url": url, "asOf": str(table.iloc[0, 0]), "count": len(table)})
        assert len(members) == 800
    for symbol in WATCH[region]:
        members.setdefault(symbol, {"ticker": symbol, "name": symbol, "groups": []})
    for symbol, row in members.items():
        row.update({"watchlist": symbol in WATCH[region], "assetType": "ETF" if symbol in ETFS else "Equity"})
    return list(members.values()), sources


def chart(symbol, full=False):
    path = CACHE / (symbol.replace("^", "index-") + ".json")
    saved = json.loads(path.read_text(encoding="utf8")) if path.exists() else None
    params = {"interval": "1d", "events": "div,splits"}
    if saved and not full:
        params["range"] = "1mo"
    else:
        params.update({"period1": 1704067200, "period2": int(time.time())})
    result = get("https://query1.finance.yahoo.com/v8/finance/chart/" + symbol, params=params).json()["chart"]["result"][0]
    quote = result["indicators"]["quote"][0]
    adjusted = (result["indicators"].get("adjclose") or [{}])[0].get("adjclose", quote.get("close", []))
    records = {r["date"]: r for r in (saved or {}).get("records", [])}
    # Both exchanges are UTC+8. Only publish completed sessions, with a 30-minute buffer.
    now = datetime.now(timezone(timedelta(hours=8)))
    for i, timestamp in enumerate(result.get("timestamp") or []):
        date = datetime.fromtimestamp(timestamp, timezone(timedelta(hours=8))).date().isoformat()
        if date == now.date().isoformat() and now.hour * 60 + now.minute < 16 * 60 + 30:
            continue
        row = {k: quote.get(k, [None] * len(result["timestamp"]))[i] for k in ["open", "high", "low", "close", "volume"]}
        if row["close"] is None:
            continue
        previous = records.get(date)
        if previous and saved and not full:
            # Corporate actions revise historical OHLC/adjusted prices, not just the new session.
            changed = any(previous.get(key) and value and abs(value / previous[key] - 1) > 0.0001
                          for key, value in [("close", row["close"]), ("adjClose", adjusted[i])])
            if changed:
                return chart(symbol, full=True)
        row.update({"date": date, "adjClose": adjusted[i]})
        records[date] = row
    if not records:
        raise ValueError(f"No completed history: {symbol}")
    meta = result["meta"]
    payload = {"records": sorted(records.values(), key=lambda r: r["date"]), "name": meta.get("longName") or meta.get("shortName") or symbol}
    write_json(path, payload)
    return payload


def serial(series, digits=2):
    return [None if pd.isna(x) else round(float(x), digits) for x in series]


def regional_benchmark(region, full=False):
    if region == "hk":
        return chart(META[region]["benchmark"], full)
    url = "https://push2his.eastmoney.com/api/qt/stock/kline/get"
    data = get(url, params={"secid": "1.000906", "klt": "101", "fqt": "0", "beg": "20240101", "end": "20500101", "fields1": "f1,f2,f3,f4,f5,f6", "fields2": "f51,f52,f53,f54,f55,f56,f57"}).json()["data"]
    now = datetime.now(timezone(timedelta(hours=8)))
    records = []
    for line in data["klines"]:
        values = line.split(",")
        if values[0] == now.date().isoformat() and now.hour * 60 + now.minute < 16 * 60 + 30:
            continue
        records.append({"date": values[0], "close": float(values[2])})
    assert len(records) > 400 and (now.date() - datetime.fromisoformat(records[-1]["date"]).date()).days <= 12
    return {"records": records, "source": url}


def run(region, full=False, recalculate=False):
    members, sources = constituents(region)
    write_json(ROOT / "data" / f"asia-{region}-constituents.json", {"sources": sources, "members": members})
    meta = META[region]
    benchmark = regional_benchmark(region, full)
    benchmark_frame = pd.DataFrame(benchmark["records"]).set_index("date")
    dates = pd.DatetimeIndex(benchmark_frame.index)
    dates = dates[dates >= "2024-01-01"]
    latest = dates[-1]
    now = datetime.now(timezone(timedelta(hours=8)))
    assert (now.date() - latest.date()).days <= 12, "Stale benchmark; refusing date rollback"
    fx = chart(meta["fx"])["records"][-1]["close"]
    frames, errors = {}, {}
    info_path = ROOT / "data" / f"asia-{region}-metadata.json"
    infos = json.loads(info_path.read_text(encoding="utf8")) if info_path.exists() else {}

    def fetch(member):
        symbol = member["ticker"]
        cache_path = CACHE / (symbol + ".json")
        data = json.loads(cache_path.read_text(encoding="utf8")) if recalculate and cache_path.exists() else chart(symbol, full)
        info = infos.get(symbol, {})
        age = (latest.date() - datetime.fromisoformat(info.get("asOf", "2000-01-01")).date()).days
        if not info or full or (age >= 7 and not recalculate):
            try:
                item = yf.Ticker(symbol).get_info()
                cap = item.get("totalAssets") if member["assetType"] == "ETF" else item.get("marketCap")
                info = {"marketCapLocal": cap, "name": item.get("longName") or data["name"], "asOf": latest.date().isoformat()}
            except Exception:
                info = {"name": data["name"], "marketCapLocal": None}
        frame = pd.DataFrame(data["records"])
        frame.index = pd.to_datetime(frame.pop("date"))
        return symbol, frame.reindex(dates), info

    with ThreadPoolExecutor(max_workers=6) as pool:
        futures = {pool.submit(fetch, m): m["ticker"] for m in members}
        for i, future in enumerate(as_completed(futures), 1):
            symbol = futures[future]
            try:
                symbol, frame, info = future.result()
                frames[symbol] = frame
                infos[symbol] = info
            except Exception as error:
                errors[symbol] = str(error)[:180]
            if i % 50 == 0:
                print(f"{region}: fetched {i}/{len(members)}; errors {len(errors)}", flush=True)
    write_json(info_path, infos)
    if len(frames) < len(members) * 0.95:
        raise RuntimeError(f"Insufficient coverage: {len(frames)}/{len(members)}; refusing publication")
    equities = [m["ticker"] for m in members if m["assetType"] != "ETF" and m["ticker"] in frames]
    adjusted = pd.DataFrame({s: frames[s]["adjClose"] for s in equities})
    periods = rs.build_period_rs_ratings(adjusted)
    ratings = rs.weighted_rs_rating(periods)
    display_dates = dates[dates >= "2025-01-01"]
    rows, histories = [], {}
    for member in members:
        symbol = member["ticker"]
        frame = frames.get(symbol)
        if frame is None:
            continue
        valid = frame["close"].dropna()
        if valid.empty:
            continue
        last = valid.index[-1]
        price = float(valid.iloc[-1])
        rating = ratings[symbol] if symbol in ratings else pd.Series(float("nan"), index=dates)
        cap = infos.get(symbol, {}).get("marketCapLocal")
        if cap is not None and (not isinstance(cap, (int, float)) or not pd.notna(cap)):
            cap = None
        h = {k: serial(frame[v].reindex(display_dates), 0 if k == "volume" else 4) for k, v in {"price": "close", "open": "open", "high": "high", "low": "low", "volume": "volume"}.items()}
        h["rsRatingAll"] = serial(rating.reindex(display_dates), 0)
        histories[symbol] = h
        atr_pct = rs.compute_atr_pct_series(frame.high, frame.low, frame.close)
        atr = rs.compute_atr_series(frame.high, frame.low, frame.close)
        row = {**member, "name": infos.get(symbol, {}).get("name") or member["name"], "price": round(price, 4), "currency": meta["currency"], "marketCap": round(cap / fx) if cap else None, "marketCapLocal": cap, "asOfDate": last.date().isoformat(), "rsRatingAll": None if pd.isna(rating.loc[last]) else int(rating.loc[last]), "memberships": {}, "returns": {}, "rsPeriods": {}, "atr21Pct": rs.compute_atr_pct(frame.high, frame.low, frame.close), "extension": rs.compute_extension_metrics(frame.close, atr, atr_pct), "distanceTo52wHighPct": rs.compute_52w_gap(frame.adjClose.dropna()), "historySessions": len(valid), "provisional": len(valid) < 252}
        for key in periods:
            row["returns"][key] = rs.compute_return(frame.adjClose, rs.LOOKBACKS[key])
            value = periods[key].at[last, symbol] if symbol in periods[key] else None
            row["rsPeriods"][key] = None if value is None or pd.isna(value) else int(value)
        for label, n in [("1y", 252), ("3m", 63)]:
            row["rsNewHigh" + label + "All"] = rs.compute_rating_new_high(rating, n)
            row["priceNewHigh" + label] = rs.compute_price_new_high(frame.close, n)
        row["rsNewHighAll"] = row["rsNewHigh1yAll"]
        rows.append(row)
    rows.sort(key=lambda x: (-(x["rsRatingAll"] or 0), x["ticker"]))
    rs_payload = {"updatedAt": latest.date().isoformat(), "historyDates": display_dates.strftime("%Y-%m-%d").tolist(), "rows": rows, "histories": histories, "universes": {"all": {"label": meta["label"]}}, "historyRanges": [{"key": k, "label": v} for k, v in [("1m", "1M"), ("3m", "3M"), ("6m", "6M"), ("1y", "1Y"), ("3y", "2025~"), ("ytd", "YTD")]], "scoring": {"description": "RS: 1M 20% + 3M 40% + 6M 20% + 12M 20%. 현지통화 · 시장별 순위 · ETF 제외"}}
    bench_data = {"items": {"regional": {"dates": dates.strftime("%Y-%m-%d").tolist(), "values": serial(pd.Series(benchmark_frame.close.to_numpy(), index=pd.to_datetime(benchmark_frame.index)).reindex(dates), 4)}}}
    # The same trend/climax implementation is called with a regional benchmark.
    tmeta = {"label": meta["label"], "include_all": True, "history_key": "rsRatingAll", "benchmark_key": "regional", "color": "#0f766e"}
    trows, thistories = trend.build_universe_payload("all", tmeta, rs_payload, bench_data, {}, {})
    trend_payload = {"updatedAt": rs_payload["updatedAt"], "historyDates": rs_payload["historyDates"][-trend.HISTORY_POINTS:], "rows": {"all": trows}, "histories": {"all": thistories}, "universes": {"all": tmeta}, "scoring": {"description": f"가격 추세 4 + {meta['benchmarkLabel']} 대비 추세 4 + 모멘텀 2 · Market Cap: USD"}}
    benchmark_note = "HSCI 무료 장기 이력 부족으로 항셍지수를 상대추세 기준으로 사용" if region == "hk" else "CSI800 지수 일별 가격: Eastmoney 공개 시세"
    output = {"meta": {**meta, "sources": sources, "requested": len(members), "covered": len(rows), "missing": errors, "fxLocalPerUsd": fx, "benchmarkNote": benchmark_note, "watchlist": WATCH[region]}, "rs": rs_payload, "trend": trend_payload}
    assert len(trows) == len(rows), "Trend and RS coverage differ"
    path = ROOT / "data" / f"asia-{region}-screening.json"
    write_json(path, output)
    assert path.stat().st_size < 24 * 1024 * 1024, "Pages asset size limit"
    print(f"{region}: published {len(rows)}/{len(members)} at {rs_payload['updatedAt']}; missing {json.dumps(errors)}", flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--region", choices=["hk", "cn", "all"], default="all")
    parser.add_argument("--full", action="store_true")
    parser.add_argument("--recalculate", action="store_true", help="Rebuild scores from cached stock prices without downloading them again")
    args = parser.parse_args()
    for region in (["hk", "cn"] if args.region == "all" else [args.region]):
        run(region, args.full, args.recalculate)
