"""Independent, freshness-checked sources for regional ETFs and benchmarks."""
from datetime import date
import math
from regional_supplements import ETF_SECIDS, parse_etf_history

TENCENT_URL = "https://web.ifzq.gtimg.cn/appstock/app/fqkline/get"


def tencent_symbol(symbol):
    if symbol == "^HSI":
        return "hkHSI"
    if symbol == "000906":
        return "sh000906"
    code, exchange = symbol.split(".")
    return {"HK": "hk", "SS": "sh", "SZ": "sz"}[exchange] + code.zfill(5 if exchange == "HK" else 6)


def parse_tencent(payload, symbol, adjustment, completed_through):
    code = tencent_symbol(symbol)
    item = payload.get("data", {}).get(code, {})
    quote = item.get("qt", {}).get(code, [])
    if payload.get("code") != 0 or len(quote) < 3 or quote[2] != code[2:]:
        raise ValueError(f"Wrong Tencent security: {symbol}")
    # Tencent returns `day` for a qfq request when no adjustment is needed.
    source = item.get("qfqday") if adjustment == "qfq" else None
    source = source if source is not None else item.get("day", [])
    records = {}
    for values in source:
        day = date.fromisoformat(values[0]).isoformat()
        if day > completed_through:
            continue
        opening, close, high, low, volume = map(float, values[1:6])
        if not all(math.isfinite(x) for x in (opening, close, high, low, volume)) or not 0 < low <= close <= high or opening <= 0 or volume < 0:
            raise ValueError(f"Invalid Tencent OHLCV: {symbol} {day}")
        if day in records:
            raise ValueError(f"Duplicate Tencent date: {symbol} {day}")
        records[day] = dict(date=day, open=opening, close=close, high=high, low=low, volume=volume)
    return {"name": quote[1], "records": [records[d] for d in sorted(records)]}


def require_current(payload, expected, minimum=400):
    records = payload["records"]
    if len(records) < minimum or records[-1]["date"] != expected:
        actual = records[-1]["date"] if records else "empty"
        raise ValueError(f"Incomplete/stale history: expected {expected}, received {actual} ({len(records)} sessions)")
    return payload


def current_source(symbol, expected, providers):
    errors = []
    for name, fetch in providers:
        try:
            payload = require_current(fetch(), expected)
            print(f"{symbol}: {name}, completed {expected}", flush=True)
            return payload
        except Exception as error:
            reason = f"{name}: {error}"
            errors.append(reason)
            print(f"{symbol}: source rejected; {reason}", flush=True)
    raise RuntimeError(f"No current source for {symbol}: {'; '.join(errors)}")


def tencent_history(symbol, expected, get):
    code = tencent_symbol(symbol)
    def fetch(adjustment):
        response = get(TENCENT_URL, params={"param": f"{code},day,2024-01-01,{expected},1000,{adjustment}"})
        return parse_tencent(response.json(), symbol, adjustment, expected)
    raw = fetch("")
    if symbol in ETF_SECIDS:
        adjusted = fetch("qfq")
        # Tencent caps adjusted history at 640 sessions. Retain the shared
        # history window, but never conceal an internal missing observation.
        if not raw["records"] or not adjusted["records"]:
            raise ValueError(f"Empty Tencent ETF history: {symbol}")
        start = max(raw["records"][0]["date"], adjusted["records"][0]["date"])
        raw["records"] = [r for r in raw["records"] if r["date"] >= start]
        adjusted["records"] = [r for r in adjusted["records"] if r["date"] >= start]
        def common(data):
            return {"name": data["name"], "code": ETF_SECIDS[symbol].split(".")[1],
                    "klines": [",".join(str(r[k]) for k in ("date", "open", "close", "high", "low", "volume")) for r in data["records"]]}
        result = parse_etf_history(symbol, common(raw), common(adjusted), expected)
    else:
        result = raw
    result["priceSource"] = {**result.get("priceSource", {}), "provider": "Tencent", "url": TENCENT_URL, "symbol": code,
                             "adjustment": "qfq adjusted OHLC; rawClose and raw volume retained" if symbol in ETF_SECIDS else "unadjusted index close",
                             "volumeUnit": "shares" if symbol in ETF_SECIDS else "provider index volume"}
    result["priceSource"].pop("secid", None)
    return require_current(result, expected)
