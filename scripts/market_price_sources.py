"""Independent, freshness-checked sources for regional securities and benchmarks."""
from datetime import date
import math
from threading import Lock
import time
from regional_supplements import ETF_SECIDS, parse_etf_history

TENCENT_URL = "https://web.ifzq.gtimg.cn/appstock/app/fqkline/get"
EASTMONEY_URL = "https://push2his.eastmoney.com/api/qt/stock/kline/get"
INDEX_SECIDS = {"000688.SS": "1.000688", "^HSI": "100.HSI"}
TENCENT_REQUEST_INTERVAL_SECONDS = 0.25
_TENCENT_REQUEST_LOCK = Lock()
_tencent_last_started = 0.0


class ProviderCircuitBreaker:
    """Pause a failing provider, then allow one recovery probe across workers."""

    def __init__(self, failure_threshold=5, cooldown_seconds=300, clock=time.monotonic):
        self.failure_threshold = failure_threshold
        self.cooldown_seconds = cooldown_seconds
        self.clock = clock
        self._lock = Lock()
        self._failures = 0
        self._blocked_until = None
        self._probe_in_flight = False
        self._generation = 0

    def acquire(self):
        """Return a request ticket, or None while the provider is paused."""
        with self._lock:
            if self._blocked_until is not None:
                if self.clock() < self._blocked_until or self._probe_in_flight:
                    return None
                self._probe_in_flight = True
            return self._generation

    def success(self, ticket):
        with self._lock:
            if ticket != self._generation:
                return
            self._failures = 0
            self._blocked_until = None
            self._probe_in_flight = False

    def failure(self, ticket):
        with self._lock:
            if ticket != self._generation:
                return
            self._failures += 1
            if self._probe_in_flight or self._failures >= self.failure_threshold:
                self._blocked_until = self.clock() + self.cooldown_seconds
                self._probe_in_flight = False
                # An already-running success must not reopen a failed provider.
                self._generation += 1


# This state lasts only for this collector process. Other providers always keep
# their normal fallback order, and every accepted payload still passes freshness.
_TENCENT_CIRCUIT = ProviderCircuitBreaker()


def tencent_get(get, params):
    """Limit request starts to four/second without blocking other network responses."""
    global _tencent_last_started
    with _TENCENT_REQUEST_LOCK:
        wait = TENCENT_REQUEST_INTERVAL_SECONDS - (time.monotonic() - _tencent_last_started)
        if wait > 0:
            time.sleep(wait)
        _tencent_last_started = time.monotonic()
    return get(TENCENT_URL, params=params)


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


def current_source(symbol, expected, providers, minimum=400):
    errors = []
    for name, fetch in providers:
        circuit = _TENCENT_CIRCUIT if name == "Tencent" else None
        ticket = circuit.acquire() if circuit is not None else None
        if circuit is not None and ticket is None:
            reason = f"{name}: temporarily paused after repeated failures; recovery probe after cooldown"
            errors.append(reason)
            print(f"{symbol}: source skipped; {reason}", flush=True)
            continue
        try:
            payload = require_current(fetch(), expected, minimum)
            if circuit is not None:
                circuit.success(ticket)
            print(f"{symbol}: {name}, completed {expected}", flush=True)
            return payload
        except Exception as error:
            if circuit is not None:
                circuit.failure(ticket)
            reason = f"{name}: {error}"
            errors.append(reason)
            print(f"{symbol}: source rejected; {reason}", flush=True)
    raise RuntimeError(f"No current source for {symbol}: {'; '.join(errors)}")


def tencent_history(symbol, expected, get):
    code = tencent_symbol(symbol)
    def fetch(adjustment):
        response = tencent_get(get, {"param": f"{code},day,2024-01-01,{expected},1000,{adjustment}"})
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


def tencent_equity_history(symbol, expected, get):
    """Return raw OHLC with a coherent Tencent qfq close series for RS."""
    if symbol in ETF_SECIDS or symbol in INDEX_SECIDS or not symbol.endswith((".HK", ".SS", ".SZ")):
        raise ValueError(f"Not a regional equity: {symbol}")
    code = tencent_symbol(symbol)

    def fetch(adjustment):
        response = tencent_get(get, {"param": f"{code},day,2024-01-01,{expected},1000,{adjustment}"})
        return parse_tencent(response.json(), symbol, adjustment, expected)

    raw, adjusted = fetch(""), fetch("qfq")
    if not raw["records"] or not adjusted["records"]:
        raise ValueError(f"Empty Tencent equity history: {symbol}")
    start = max(raw["records"][0]["date"], adjusted["records"][0]["date"])
    prices = {row["date"]: row for row in raw["records"] if row["date"] >= start}
    adjusted_prices = {row["date"]: row for row in adjusted["records"] if row["date"] >= start}
    if prices.keys() != adjusted_prices.keys():
        raise ValueError(f"Tencent equity adjusted/raw dates differ: {symbol}")
    mainland = symbol.endswith((".SS", ".SZ"))
    records = []
    for day, row in prices.items():
        item = {**row, "adjClose": adjusted_prices[day]["close"]}
        if mainland:
            item["volume"] *= 100
        records.append(item)
    return {
        "name": raw["name"],
        "records": records,
        "priceSource": {
            "provider": "Tencent",
            "url": TENCENT_URL,
            "symbol": code,
            "adjustment": "raw OHLC; qfq adjusted close for RS",
            "volumeUnit": "shares",
        },
    }


def eastmoney_index_history(symbol, expected, get):
    secid = INDEX_SECIDS[symbol]
    response = get(EASTMONEY_URL, params={
        "secid": secid, "klt": "101", "fqt": "0", "beg": "20240101", "end": "20500101",
        "fields1": "f1,f2,f3,f4,f5,f6", "fields2": "f51,f52,f53,f54,f55,f56,f57",
    }).json()
    data = response.get("data") or {}
    expected_code = "HSI" if symbol == "^HSI" else symbol.split(".")[0]
    if str(data.get("code", "")).upper().zfill(6 if expected_code.isdigit() else 0) != expected_code:
        raise ValueError(f"Wrong Eastmoney index: {symbol}")
    records = []
    for line in data.get("klines", []):
        values = line.split(",")
        if values[0] > expected:
            continue
        opening, close, high, low, volume = map(float, values[1:6])
        if not all(math.isfinite(x) for x in (opening, close, high, low, volume)) or not 0 < low <= close <= high or opening <= 0 or volume < 0:
            raise ValueError(f"Invalid Eastmoney index OHLCV: {symbol} {values[0]}")
        records.append({"date": values[0], "open": opening, "close": close, "high": high,
                        "low": low, "volume": volume, "adjClose": close})
    result = {"name": data.get("name") or symbol, "records": records,
              "priceSource": {"provider": "Eastmoney", "url": EASTMONEY_URL,
                              "secid": secid, "adjustment": "unadjusted index OHLCV"}}
    return require_current(result, expected)
