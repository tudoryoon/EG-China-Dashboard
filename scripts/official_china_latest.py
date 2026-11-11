"""Append contiguous official SZSE/SSE bars to a verified local history.

Only the four securities with recurring provider gaps use this last-resort source.
The exchange must confirm each prior close and volume before the next bar
can be used; a split or adjusted-history mismatch remains a collection failure.
"""

from __future__ import annotations

import json
import math
from pathlib import Path

import exchange_calendars as xcals


SZSE_URL = "https://www.szse.cn/api/market/ssjjhq/getHistoryData"
SSE_URL = "http://yunhq.sse.com.cn:32041/v1/sh1/dayk/"
SUPPORTED = {
    "159819.SZ": ("szse", "159819"),
    "302132.SZ": ("szse", "302132"),
    "562500.SS": ("sse", "562500"),
    "588200.SS": ("sse", "588200"),
}
MAX_BRIDGE_SESSIONS = 8


def _one(rows, day):
    found = [row for row in rows if str(row[0]).replace("-", "") == day.replace("-", "")]
    if len(found) != 1:
        raise ValueError(f"Official daily history has {len(found)} rows for {day}")
    return found[0]


def _bar(symbol, expected, previous, get):
    market, code = SUPPORTED[symbol]
    if market == "szse":
        url = SZSE_URL
        payload = get(url, params={"cycleType": 32, "marketId": 1, "code": code},
                      headers={"Referer": "https://www.szse.cn/", "User-Agent": "Mozilla/5.0"}).json()
        if payload.get("code") != "0" or payload.get("data", {}).get("code") != code:
            raise ValueError(f"SZSE response identity mismatch: {symbol}")
        rows = payload["data"]["picupdata"]
        def decode(row):
            return {"date": row[0], "open": float(row[1]), "close": float(row[2]),
                    "low": float(row[3]), "high": float(row[4]), "volume": int(row[7]) * 100}
    else:
        url = SSE_URL + code
        payload = get(url, params={"select": "date,open,high,low,close,volume", "begin": -20, "end": -1},
                      headers={"Referer": "https://www.sse.com.cn/", "User-Agent": "Mozilla/5.0"}).json()
        if payload.get("code") != code:
            raise ValueError(f"SSE response identity mismatch: {symbol}")
        rows = payload["kline"]
        def decode(row):
            return {"date": str(row[0]), "open": float(row[1]), "high": float(row[2]),
                    "low": float(row[3]), "close": float(row[4]), "volume": int(row[5])}
    prior = decode(_one(rows, previous))
    current = decode(_one(rows, expected))
    current["date"] = expected
    return prior, current, url


def latest_from_cache(symbol, expected, cache_path, get):
    """Bridge at most two completed sessions with contiguous official bars."""
    if symbol not in SUPPORTED:
        raise ValueError(f"No official daily fallback for {symbol}")
    cached = json.loads(Path(cache_path).read_text(encoding="utf-8"))
    records = cached["records"]
    previous = records[-1]["date"] if records else None
    calendar = xcals.get_calendar("XSHG")
    try:
        if not calendar.is_session(previous) or not calendar.is_session(expected):
            raise ValueError("Cached or target date is not an exchange session")
        missing = [session.date().isoformat() for session in
                   calendar.sessions_in_range(previous, expected)][1:]
    except (TypeError, ValueError, KeyError) as error:
        raise ValueError(f"Missing verified prior session: {symbol} {previous}") from error
    if not cached.get("priceSource") or not 1 <= len(missing) <= MAX_BRIDGE_SESSIONS or missing[-1] != expected:
        raise ValueError(f"Missing verified prior session: {symbol} {previous}")
    last = records[-1]
    # The 302132.SZ equity cache stores raw close as `close` without a separate
    # `rawClose` field. Its adjusted close must still equal that raw close.
    raw_close = last.get("rawClose", last.get("close") if symbol == "302132.SZ" else None)
    if not all(value is not None and math.isfinite(float(value)) and float(value) > 0
               for value in (last.get("close"), raw_close, last.get("adjClose"), last.get("volume"))):
        raise ValueError(f"Invalid cached prior bar: {symbol}")
    if abs(last["close"] - raw_close) > 0.000001 or abs(last["close"] - last["adjClose"]) > 0.000001:
        raise ValueError(f"Adjusted prior bar needs a full source refresh: {symbol}")
    for session in missing:
        prior, current, url = _bar(symbol, session, previous, get)
        # Eastmoney ETF volumes are rounded to 100 shares; the first SSE
        # official bar can differ by fewer than 100 shares from that cache.
        volume_tolerance = 99 if SUPPORTED[symbol][0] == "sse" else 1
        if abs(prior["close"] - last["close"]) > 0.00051 or abs(prior["volume"] - last["volume"]) > volume_tolerance:
            raise ValueError(f"Official prior close/volume mismatch: {symbol} {previous}")
        values = [current[key] for key in ("open", "high", "low", "close", "volume")]
        if (not all(math.isfinite(value) and value > 0 for value in values)
                or not current["low"] <= min(current["open"], current["close"])
                or not max(current["open"], current["close"]) <= current["high"]):
            raise ValueError(f"Invalid official OHLCV: {symbol} {session}")
        current.update(rawClose=current["close"], adjClose=current["close"])
        records.append(current)
        previous, last = session, current
    cached["records"] = records
    cached["priceSource"] = {**cached["priceSource"], "currentSessionSource": url,
                             "currentSessionBasis": "Official daily OHLCV; prior close and shares matched cached history; target raw equals adjusted"}
    return cached
