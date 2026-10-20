"""Independent HK/A-share universes using the dashboard's RS and Trend engines."""
from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone, timedelta
from io import BytesIO
import json
from pathlib import Path
import tempfile
import time

from curl_cffi import requests
import pandas as pd
import yfinance as yf

import update_market_rs as rs
import update_market_trend_score as trend
from hsci_constituents import parse_hsci
from regional_supplements import ETF_SECIDS, ETF_NAMES, ETF_SOURCE, parse_etf_history, build_regional_rs, build_regional_trend
from market_price_sources import (
    INDEX_SECIDS,
    TENCENT_URL,
    TENCENT_MIRROR_URL,
    current_source,
    eastmoney_equity_history,
    eastmoney_index_history,
    pace_tencent_request,
    require_current,
    tencent_equity_history,
    tencent_history,
)
from refresh_all_data import expected_session
import validated_price_cache as price_cache
from regional_failure_retention import require_collection_coverage, retain_failed_securities

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / ".asia-screening-cache"
HS_SOURCE = "https://origin-www.hsi.com.hk/data/eng/rt/index-series/hsci/constituents.do"
HS_COUNT_SOURCE = "https://www.hsi.com.hk/api/wsit-hsi-ddoc-ea-public-website-proxy/v1/product-data/pub/constituent/metadata/v2"
HS_CHANGE_HISTORY_SOURCE = "https://www.hsi.com.hk/api/wsit-hsi-ddoc-ea-public-website-proxy/v1/content/gcs/download"
HS_CHANGE_HISTORY_RESOURCE = "/public-website/webapp/contents/en/indexes/hisConstituent/hsci/hist_hsci.xlsx"
HS_SERIES_SOURCE = "https://www.hsi.com.hk/api/wsit-hsi-ddoc-ea-public-website-proxy/v1/product-data/pub/series/metadata/v2"
HS_HISTORY_SOURCE = "https://www.hsi.com.hk/api/wsit-hsi-ddoc-ea-public-website-proxy/v1/product-data/pub/indexes/metadata/v2"
CSI_SOURCE = "https://oss-ch.csindex.com.cn/static/html/csindex/public/uploads/file/autofile/cons/{}cons.xls"
WATCH = {
    "hk": "9988.HK 0700.HK 0992.HK 2820.HK 3033.HK 1810.HK 0100.HK 1347.HK 0981.HK 3109.HK 6082.HK 6083.HK 9660.HK 2026.HK 9999.HK".split(),
    "cn": "000688.SS 588200.SS 002371.SZ 600183.SS 562500.SS 688072.SS 000977.SZ 688702.SS 159819.SZ 301377.SZ 601869.SS".split(),
}
ETFS = set(ETF_SECIDS)
INDEXES = {"000688.SS"}
META = {
    "hk": {"label": "Hong Kong", "currency": "HKD", "benchmark": "^HSI", "benchmarkLabel": "Hang Seng Index", "fx": "HKD=X"},
    "cn": {"label": "China A", "currency": "CNY", "benchmark": "000906", "benchmarkLabel": "CSI 800", "fx": "CNY=X"},
}


def get(url, **kwargs):
    for attempt in range(3):
        if url in (TENCENT_URL, TENCENT_MIRROR_URL):
            pace_tencent_request()
        try:
            response = requests.get(url, impersonate="chrome", timeout=35, **kwargs)
            response.raise_for_status()
            return response
        except Exception:
            if attempt == 2:
                raise
            time.sleep(1 + attempt)


get.paces_tencent_attempts = True


def verify_hsci_unchanged(snapshot_day: str, target: str, expected_count: int) -> str:
    """Prove an older official list is still current using HSI's full change log."""
    response = get(HS_CHANGE_HISTORY_SOURCE,
                   params={"resource": HS_CHANGE_HISTORY_RESOURCE})
    table = pd.read_excel(BytesIO(response.content), sheet_name="HSCI", header=None)
    if table.shape[0] < 100 or table.shape[1] < 5 or "Effective Date" not in str(table.iat[4, 0]):
        raise RuntimeError("HSCI official change history has an unexpected format")
    rows = table.iloc[6:]
    changes = rows[rows.iloc[:, 2].astype(str).str.match(r"^(Add|Delete)\b")].copy()
    dates = pd.to_datetime(changes.iloc[:, 0], format="%Y-%m-%d", errors="coerce")
    if len(changes) < 100 or dates.isna().any():
        raise RuntimeError("HSCI official change history is incomplete")
    current = changes.loc[dates.dt.strftime("%Y-%m-%d") <= target]
    current_dates = dates.loc[current.index]
    if current.empty:
        raise RuntimeError("HSCI official change history has no effective constituents")
    latest = current_dates.max()
    latest_day = latest.strftime("%Y-%m-%d")
    counts = pd.to_numeric(current.loc[current_dates == latest].iloc[:, 1], errors="coerce")
    if latest_day > snapshot_day or counts.isna().any() or set(counts.astype(int)) != {expected_count}:
        raise RuntimeError("HSCI official change history does not validate the older snapshot")
    return latest_day


def official_hsi_history(expected: str) -> dict:
    """Get the price-index closing series published by Hang Seng Indexes."""
    values = get(HS_SERIES_SOURCE, params={"data": "values", "seriesCode": "hsi",
                                           "language": "en-hk"}).json()
    if values.get("code") != "0":
        raise ValueError("Official HSI values request failed")
    current = next((item for item in values.get("data", [])
                    if item.get("indexCode") == "00001.00" and item.get("indexType") == "PI"), None)
    if not current or str(current.get("indexTime", ""))[:10] != expected or str(current.get("indexTime", ""))[11:16] < "16:00":
        raise ValueError("Official HSI current value is not a completed target session")
    history = get(HS_HISTORY_SOURCE, params={"data": "valueHistoryPub",
                                             "indexCodes": "00001.00", "language": "en-hk"}).json()
    if history.get("code") != "0" or len(history.get("data", [])) != 1 or history["data"][0].get("indexCode") != "00001.00":
        raise ValueError("Official HSI history response is invalid")
    records = []
    for row in history["data"][0].get("valueHistory", []):
        day = str(row.get("date", ""))
        close = float(row["close"])
        if len(day) != 10 or datetime.fromisoformat(day).date().isoformat() != day or not 0 < close < 100000:
            raise ValueError("Official HSI history contains an invalid observation")
        if records and day <= records[-1]["date"]:
            raise ValueError("Official HSI history dates are not increasing")
        records.append({"date": day, "close": close})
    if len(records) < 400 or records[-1]["date"] != expected or records[-1]["close"] != float(current["indexValue"]):
        raise ValueError("Official HSI history does not match the completed target session")
    return {"records": records, "priceSource": {"provider": "Hang Seng Indexes",
            "url": HS_HISTORY_SOURCE, "indexCode": "00001.00",
            "adjustment": "official price index close", "volumeUnit": None}}


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    # OneDrive can briefly hold the destination open while syncing. Give each
    # writer its own temporary file and retry only that transient Windows lock.
    with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=path.parent,
                                     prefix=path.stem + ".", suffix=".tmp", delete=False) as stream:
        temp = Path(stream.name)
        json.dump(value, stream, ensure_ascii=False, separators=(",", ":"), allow_nan=False)
    try:
        for attempt in range(6):
            try:
                temp.replace(path)
                return
            except PermissionError:
                if attempt == 5:
                    raise
                time.sleep(min(2.0, 0.25 * 2 ** attempt))
    finally:
        temp.unlink(missing_ok=True)


def constituents(region, cached=False):
    members = {}
    sources = []
    snapshot_path = ROOT / "data" / f"asia-{region}-constituents.json"
    if cached and snapshot_path.exists():
        snapshot = json.loads(snapshot_path.read_text(encoding="utf8"))
        members = {row["ticker"]: row for row in snapshot["members"]}
        sources = snapshot["sources"]
    elif region == "hk":
        try:
            data = get(HS_SOURCE).json()
        except Exception as source_error:
            if not snapshot_path.exists():
                raise RuntimeError("HSCI source unavailable and no verified snapshot exists") from source_error
            snapshot = json.loads(snapshot_path.read_text(encoding="utf8"))
            previous = next((item for item in snapshot["sources"]
                             if item.get("label") == "Hang Seng Composite"), None)
            target = expected_session("XHKG", datetime.now(timezone.utc))
            snapshot_day = str((previous or {}).get("asOf", ""))[:10]
            if not previous or not snapshot_day or snapshot_day > target:
                raise RuntimeError(f"HSCI source unavailable; no usable snapshot for target session {target}") from source_error
            official = get(HS_COUNT_SOURCE, params={"data": "rt", "seriesCode": "hsci",
                                                    "language": "en-hk"}).json()
            counts = official.get("data", {}).get("numOfConsList", [])
            if (official.get("code") != "0" or len(counts) != 1
                    or counts[0].get("indexCode") != "00011.00"
                    or counts[0].get("count") != previous.get("count")):
                raise RuntimeError("HSCI official count does not validate the exact-session snapshot") from source_error
            members = {row["ticker"]: row for row in snapshot["members"]
                       if "HSCI" in row.get("groups", [])}
            if len(members) != previous["count"]:
                raise RuntimeError("HSCI snapshot member count is inconsistent") from source_error
            verification = {}
            if snapshot_day != target:
                try:
                    latest_change = verify_hsci_unchanged(snapshot_day, target, previous["count"])
                except Exception as history_error:
                    raise RuntimeError("HSCI official history does not verify the older snapshot") from history_error
                verification = {"changeHistoryUrl": HS_CHANGE_HISTORY_SOURCE,
                                "changeHistoryResource": HS_CHANGE_HISTORY_RESOURCE,
                                "changeHistoryLatestEffective": latest_change,
                                "unchangedVerifiedThrough": target}
            sources.append({**previous, **verification,
                            "countVerifiedAt": datetime.now(timezone.utc).isoformat(),
                            "countVerificationUrl": HS_COUNT_SOURCE})
            print(f'HSCI officially verified snapshot: {snapshot_day} through {target}, '
                  f'{len(members)} members', flush=True)
        else:
            members, diagnostics = parse_hsci(data)
            print(f'HSCI constituents: {json.dumps(diagnostics)}', flush=True)
            sources.append({"label": "Hang Seng Composite", "url": HS_SOURCE, "asOf": data["requestDate"], "count": len(members), **diagnostics})
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
        members.setdefault(symbol, {"ticker": symbol, "name": ETF_NAMES.get(symbol, symbol), "groups": []})
    for symbol, row in members.items():
        asset_type = "ETF" if symbol in ETFS else "Index" if symbol in INDEXES else "Equity"
        row.update({"watchlist": symbol in WATCH[region], "assetType": asset_type})
        if symbol in ETF_NAMES:
            row["name"] = ETF_NAMES[symbol]
    return list(members.values()), sources


def chart(symbol, full=False):
    if symbol in ETFS:
        return etf_chart(symbol)
    if symbol in INDEXES:
        return index_chart(symbol)
    path = CACHE / (symbol.replace("^", "index-") + ".json")
    saved = json.loads(path.read_text(encoding="utf8")) if path.exists() else None
    if saved and saved.get("priceSource", {}).get("provider") != "Yahoo Finance":
        saved = None
    params = {"interval": "1d", "events": "div,splits"}
    if saved and not full:
        params["range"] = "1mo"
    else:
        params.update({"period1": 1704067200, "period2": int(time.time())})
    result = get("https://query1.finance.yahoo.com/v8/finance/chart/" + symbol, params=params).json()["chart"]["result"][0]
    quote = result["indicators"]["quote"][0]
    adjusted = (result["indicators"].get("adjclose") or [{}])[0].get("adjclose", quote.get("close", []))
    equity = symbol.endswith((".HK", ".SS", ".SZ"))
    records = {r["date"]: r for r in (saved or {}).get("records", [])
               if not equity or (r.get("volume") is not None and float(r["volume"]) > 0)} if not full else {}
    # Both exchanges are UTC+8. Only publish completed sessions, with a 30-minute buffer.
    now = datetime.now(timezone(timedelta(hours=8)))
    for i, timestamp in enumerate(result.get("timestamp") or []):
        date = datetime.fromtimestamp(timestamp, timezone(timedelta(hours=8))).date().isoformat()
        if date == now.date().isoformat() and now.hour * 60 + now.minute < 16 * 60 + 30:
            continue
        row = {k: quote.get(k, [None] * len(result["timestamp"]))[i] for k in ["open", "high", "low", "close", "volume"]}
        if row["close"] is None or (equity and (row["volume"] is None or row["volume"] <= 0)):
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
    payload["priceSource"] = {"provider": "Yahoo Finance", "symbol": symbol}
    write_json(path, payload)
    return payload


def eastmoney_etf_chart(symbol):
    now = datetime.now(timezone(timedelta(hours=8)))
    cutoff = now.date() - timedelta(days=int(now.hour * 60 + now.minute < 16 * 60 + 30))
    params = {"secid": ETF_SECIDS[symbol], "klt": "101", "beg": "20240101", "end": "20500101",
              "fields1": "f1,f2,f3,f4,f5,f6", "fields2": "f51,f52,f53,f54,f55,f56,f57"}
    raw = get(ETF_SOURCE, params={**params, "fqt": "0"}).json()["data"]
    adjusted = get(ETF_SOURCE, params={**params, "fqt": "1"}).json()["data"]
    payload = parse_etf_history(symbol, raw, adjusted, cutoff.isoformat())
    if len(payload["records"]) < 252 or (cutoff - datetime.fromisoformat(payload["records"][-1]["date"]).date()).days > 12:
        raise ValueError(f"Incomplete ETF history: {symbol}")
    return payload


def completed_session(symbol):
    return expected_session("XHKG" if symbol.endswith(".HK") or symbol == "^HSI" else "XSHG", datetime.now(timezone.utc))


def etf_chart(symbol):
    expected = completed_session(symbol)
    payload = current_source(symbol, expected, [
        ("Tencent", lambda: tencent_history(symbol, expected, get)),
        ("Tencent Mirror", lambda: tencent_history(symbol, expected, get, TENCENT_MIRROR_URL)),
        ("Eastmoney", lambda: eastmoney_etf_chart(symbol)),
    ])
    write_json(CACHE / (symbol + ".json"), payload)
    return payload


def index_chart(symbol):
    expected = completed_session(symbol)
    payload = current_source(symbol, expected, [
        ("Tencent", lambda: tencent_history(symbol, expected, get)),
        ("Tencent Mirror", lambda: tencent_history(symbol, expected, get, TENCENT_MIRROR_URL)),
        ("Eastmoney", lambda: eastmoney_index_history(symbol, expected, get)),
    ])
    payload["name"] = "STAR 50 Index" if symbol == "000688.SS" else payload["name"]
    for row in payload["records"]:
        row.setdefault("adjClose", row["close"])
    write_json(CACHE / (symbol + ".json"), payload)
    return payload


def equity_chart(symbol, expected, full=False):
    from corporate_actions import REALORD_SYMBOL, REALORD_SPLIT_DATE
    def tencent():
        from corporate_actions import normalize_equity_history
        return normalize_equity_history(symbol, tencent_equity_history(symbol, expected, get), expected)
    def mirror():
        from corporate_actions import normalize_equity_history
        return normalize_equity_history(symbol, tencent_equity_history(symbol, expected, get, TENCENT_MIRROR_URL), expected)
    providers = [("Tencent", tencent), ("Tencent Mirror", mirror)]
    # Only the verified permanent-counter series has the explicit split repair.
    if symbol != REALORD_SYMBOL or expected < REALORD_SPLIT_DATE:
        def eastmoney():
            payload = eastmoney_equity_history(symbol, expected, get)
            cache_path = CACHE / (symbol + ".json")
            if cache_path.exists():
                previous = json.loads(cache_path.read_text(encoding="utf8"))
                old = {row["date"]: row["close"] for row in previous.get("records", [])}
                new = {row["date"]: row["close"] for row in payload["records"]}
                overlap = sorted(old.keys() & new.keys())[-5:]
                for day in overlap:
                    if abs(old[day] - new[day]) > max(0.0005, abs(old[day]) * 0.0002):
                        raise ValueError(f"Eastmoney/Tencent raw close conflict: {symbol} {day}")
            return payload
        providers.append(("Eastmoney Equity", eastmoney))
        providers.append(("Yahoo Finance", lambda: require_current(chart(symbol, full), expected, minimum=1)))
    # Newly listed official constituents can have fewer observations than the
    # scoring engine needs. Keep their current prices and explicit null scores.
    payload = current_source(symbol, expected, providers, minimum=1)
    write_json(CACHE / (symbol + ".json"), payload)
    return payload


def serial(series, digits=2):
    return [None if pd.isna(x) else round(float(x), digits) for x in series]


def legacy_benchmark(region, full=False):
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


def regional_benchmark(region, full=False, cached=False):
    cache_path = CACHE / f"benchmark-{region}.json"
    symbol = META[region]["benchmark"]
    expected = completed_session(symbol)
    previous = price_cache.read_recalculation(cache_path, expected, 400) if cached else None
    if previous is not None:
        return previous
    providers = [("Tencent", lambda: tencent_history(symbol, expected, get)),
                 ("Tencent Mirror", lambda: tencent_history(symbol, expected, get, TENCENT_MIRROR_URL))]
    if region == "hk":
        providers = [("Hang Seng Indexes", lambda: official_hsi_history(expected)), *providers]
        providers.extend([
            ("Eastmoney", lambda: eastmoney_index_history(symbol, expected, get)),
            ("Yahoo Finance", lambda: legacy_benchmark(region, full)),
        ])
    else:
        providers.append(("Eastmoney", lambda: legacy_benchmark(region, full)))
    payload = current_source(symbol, expected, providers)
    write_json(cache_path, payload)
    return payload


def run(region, full=False, recalculate=False):
    path = ROOT / "data" / f"asia-{region}-screening.json"
    # Read the last publication before producing a replacement. An unusable
    # prior snapshot only prevents retention, never fabrication of new values.
    try:
        previous = json.loads(path.read_text(encoding="utf8")) if path.exists() else {}
    except (OSError, ValueError):
        previous = {}
    members, sources = constituents(region, cached=recalculate)
    write_json(ROOT / "data" / f"asia-{region}-constituents.json", {"sources": sources, "members": members})
    meta = META[region]
    benchmark = regional_benchmark(region, full, recalculate)
    benchmark_frame = pd.DataFrame(benchmark["records"]).set_index("date")
    dates = pd.DatetimeIndex(benchmark_frame.index)
    dates = dates[dates >= "2024-01-01"]
    latest = dates[-1]
    now = datetime.now(timezone(timedelta(hours=8)))
    assert (now.date() - latest.date()).days <= 12, "Stale benchmark; refusing date rollback"
    fx_path = CACHE / (meta["fx"] + ".json")
    fx_data = json.loads(fx_path.read_text(encoding="utf8")) if recalculate and fx_path.exists() else chart(meta["fx"])
    fx = fx_data["records"][-1]["close"]
    frames, errors, price_sources = {}, {}, {}
    info_path = ROOT / "data" / f"asia-{region}-metadata.json"
    infos = json.loads(info_path.read_text(encoding="utf8")) if info_path.exists() else {}

    def fetch(member):
        symbol = member["ticker"]
        cache_path = CACHE / (symbol + ".json")
        expected = latest.date().isoformat()
        verified = None if full or recalculate else price_cache.read_current(cache_path, expected, 1 if member["assetType"] == "Equity" else 400)
        cached = price_cache.read_recalculation(cache_path, expected, 1 if member["assetType"] == "Equity" else 400) if recalculate else None
        if cached is not None:
            data = cached
        elif verified is not None:
            data = verified
        elif member["assetType"] == "Equity":
            data = equity_chart(symbol, latest.date().isoformat(), full)
        else:
            data = chart(symbol, full)
        if member["assetType"] == "Equity":
            # Some providers emit a flat zero-volume bar on a suspended stock
            # or a market holiday. It is not an actual price observation.
            data["records"] = [row for row in data["records"] if row.get("volume") is not None and row["volume"] > 0]
            if not data["records"]:
                raise ValueError(f"No traded equity history: {symbol}")
        if symbol in ETFS and ("rawClose" not in data["records"][-1] or data["records"][-1]["date"] < latest.date().isoformat()):
            data = etf_chart(symbol)
        if symbol in INDEXES and data["records"][-1]["date"] < latest.date().isoformat():
            data = index_chart(symbol)
        if symbol in ETFS | INDEXES and data["records"][-1]["date"] < latest.date().isoformat():
            raise ValueError(f"Supplemental quote behind benchmark: {symbol}; retry needed")
        if data["records"][-1]["date"] < latest.date().isoformat():
            raise ValueError(f"Quote behind benchmark: {symbol}; retry needed")
        info = infos.get(symbol, {})
        age = (latest.date() - datetime.fromisoformat(info.get("asOf", "2000-01-01")).date()).days
        if member["assetType"] == "Index":
            info = {"marketCapLocal": None, "name": data["name"], "asOf": latest.date().isoformat()}
        elif not info or full or (age >= 7 and not recalculate):
            try:
                item = yf.Ticker(symbol).get_info()
                cap = item.get("totalAssets") if member["assetType"] == "ETF" else item.get("marketCap")
                info = {"marketCapLocal": cap, "name": item.get("longName") or data["name"], "asOf": latest.date().isoformat()}
            except Exception:
                info = {"name": data["name"], "marketCapLocal": None}
        if symbol in ETF_NAMES:
            info = {**info, "name": ETF_NAMES[symbol]}
        frame = pd.DataFrame(data["records"])
        frame.index = pd.to_datetime(frame.pop("date"))
        frame = frame.reindex(dates)
        if frame["close"].empty or pd.isna(frame["close"].iloc[-1]) or pd.isna(frame["adjClose"].iloc[-1]):
            raise ValueError(f"Quote has no price on benchmark session: {symbol}; retry needed")
        if not recalculate and verified is None:
            write_json(cache_path, price_cache.mark(data, expected))
        return symbol, frame, info, data.get("priceSource", {"provider": "Yahoo Finance"})

    with ThreadPoolExecutor(max_workers=6) as pool:
        # Retry retained securities before a transient provider outage can
        # exhaust its circuit later in a large universe. Membership is unchanged.
        failed = previous.get("meta", {}).get("missing", {})
        fetch_order = sorted(members, key=lambda member: member["ticker"] not in failed)
        futures = {pool.submit(fetch, m): m["ticker"] for m in fetch_order}
        for i, future in enumerate(as_completed(futures), 1):
            symbol = futures[future]
            try:
                symbol, frame, info, price_source = future.result()
                frames[symbol] = frame
                infos[symbol] = info
                price_sources[symbol] = price_source
            except Exception as error:
                errors[symbol] = (str(error) or type(error).__name__)[:1000]
            if i % 50 == 0:
                print(f"{region}: fetched {i}/{len(members)}; errors {len(errors)}", flush=True)
    write_json(info_path, infos)
    require_collection_coverage(len(frames), len(members), errors)
    equities = [m["ticker"] for m in members if m["assetType"] == "Equity" and m["ticker"] in frames]
    adjusted = pd.DataFrame({s: frames[s]["adjClose"] for s in equities})
    supplemental_prices = pd.DataFrame({s: frames[s]["adjClose"] for s in sorted(ETFS | INDEXES) if s in frames}, index=dates)
    periods, ratings = build_regional_rs(adjusted, supplemental_prices, rs)
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
        row["returns"]["1d"] = rs.compute_return(frame["rawClose"] if symbol in ETFS else frame.close, 1)
        row["priceSource"] = price_sources[symbol]
        row["rsBasis"] = "equity-reference-percentile" if symbol in ETFS | INDEXES else "regional-equity-percentile"
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
    rs_payload = {"updatedAt": latest.date().isoformat(), "historyDates": display_dates.strftime("%Y-%m-%d").tolist(), "rows": rows, "histories": histories, "universes": {"all": {"label": meta["label"]}}, "historyRanges": [{"key": k, "label": v} for k, v in [("1m", "1M"), ("3m", "3M"), ("6m", "6M"), ("1y", "1Y"), ("3y", "2025~"), ("ytd", "YTD")]], "scoring": {"description": "RS: 1M 20% + 3M 40% + 6M 20% + 12M 20%. 현지통화 · 시장별 주식 순위 · ETF/지수는 주식 대비 별도 백분위(주식 순위 불변)"}}
    bench_data = {"items": {"regional": {"dates": dates.strftime("%Y-%m-%d").tolist(), "values": serial(pd.Series(benchmark_frame.close.to_numpy(), index=pd.to_datetime(benchmark_frame.index)).reindex(dates), 4)}}}
    # The same trend/climax implementation is called with a regional benchmark.
    tmeta = {"label": meta["label"], "include_all": True, "history_key": "rsRatingAll", "benchmark_key": "regional", "color": "#0f766e"}
    trows, thistories = build_regional_trend(trend, "all", tmeta, rs_payload, bench_data, {}, {})
    trend_payload = {"updatedAt": rs_payload["updatedAt"], "historyDates": rs_payload["historyDates"][-trend.HISTORY_POINTS:], "rows": {"all": trows}, "histories": {"all": thistories}, "universes": {"all": tmeta}, "scoring": {"description": f"가격 추세 4 + {meta['benchmarkLabel']} 대비 추세 4 + 모멘텀 2 · Market Cap: USD"}}
    benchmark_note = "HSCI 무료 장기 이력 부족으로 항셍지수를 상대추세 기준으로 사용" if region == "hk" else "CSI800 지수 일별 가격 · 검증된 최신 시세 원천 사용"
    output = {"meta": {**meta, "sources": sources, "requested": len(members), "covered": len(rows), "missing": errors, "fxLocalPerUsd": fx, "benchmarkNote": benchmark_note, "watchlist": WATCH[region]}, "rs": rs_payload, "trend": trend_payload}
    output["meta"]["benchmarkSource"] = benchmark.get("priceSource") or {"provider": "Yahoo Finance" if region == "hk" else "Eastmoney", "url": benchmark.get("source")}
    assert len(trows) == len(rows), "Trend and RS coverage differ"
    retain_failed_securities(output, previous, members)
    assert len(output["trend"]["rows"]["all"]) == len(output["rs"]["rows"]), "Retained trend and RS coverage differ"
    write_json(path, output)
    assert path.stat().st_size < 24 * 1024 * 1024, "Pages asset size limit"
    print(f"{region}: published {output['meta']['covered']}/{len(members)} at {rs_payload['updatedAt']}; "
          f"fresh {output['meta']['fresh']}; retained {output['meta']['retained']}; "
          f"omitted {output['meta']['omitted']}; missing {json.dumps(errors)}", flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--region", choices=["hk", "cn", "all"], default="all")
    parser.add_argument("--full", action="store_true")
    parser.add_argument("--recalculate", action="store_true", help="Reuse current-session cached prices; refetch stale or unusable histories")
    args = parser.parse_args()
    for region in (["hk", "cn"] if args.region == "all" else [args.region]):
        run(region, args.full, args.recalculate)
