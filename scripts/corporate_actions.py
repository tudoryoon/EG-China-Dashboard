"""Explicit, source-backed security identity and corporate-action repairs."""
from copy import deepcopy
from datetime import date
import math


REALORD_SYMBOL = "1196.HK"
REALORD_TEMPORARY_SYMBOL = "2922.HK"
REALORD_NAME = "Realord Technology Company Limited"
REALORD_SPLIT_DATE = "2026-09-14"
REALORD_TEMPORARY_END = "2026-10-20"
REALORD_ACTION_ID = "1196.HK:2026-09-14:split-1-into-4"
REALORD_SOURCES = [
    "https://www.hkex.com.hk/eng/market/sec_tradinfo/tradarng/tradarng_news/currentmonth/e2922c_260910.htm",
    "https://www.hkex.com.hk/-/media/HKEX-Market/Services/Circulars-and-Notices/Participant-and-Members-Circulars/SEHK/2026/SMD2026139_e.pdf",
    "https://www1.hkexnews.hk/listedco/listconews/sehk/2026/0820/2026082000373.pdf",
    "https://www1.hkexnews.hk/listedco/listconews/sehk/2026/0910/2026091001001.pdf",
]


def is_realord_name(name):
    compact = "".join(c for c in str(name).casefold() if c.isalnum())
    return compact in {
        "realordtech", "realordtechnology", "realordtechnologycompanylimited",
        "偉祿科技股份", "伟禄科技股份", "偉祿科技股份有限公司", "伟禄科技股份有限公司",
    }


def canonical_hk_member(symbol, name, request_date):
    """Resolve a known temporary counter only during its announced lifetime."""
    result = {"ticker": symbol, "name": name}
    if symbol != REALORD_TEMPORARY_SYMBOL:
        return result
    try:
        day = date.fromisoformat(str(request_date)[:10]).isoformat()
    except ValueError as error:
        raise ValueError("HSCI: temporary counter 2922 requires a valid requestDate") from error
    if not REALORD_SPLIT_DATE <= day <= REALORD_TEMPORARY_END:
        return result
    if not is_realord_name(name):
        raise ValueError(f"HSCI: unexpected issuer for temporary counter 2922: {name}")
    return {
        "ticker": REALORD_SYMBOL,
        "name": REALORD_NAME,
        "sourceTicker": REALORD_TEMPORARY_SYMBOL,
        "aliases": [REALORD_TEMPORARY_SYMBOL],
        "identitySource": REALORD_SOURCES[0],
    }


def normalize_equity_history(symbol, payload, expected):
    """Repair Tencent's known missing Realord split without double adjustment.

    Tencent's permanent 1196 series includes the temporary counter's prices,
    but on 2026-09-15 its qfq history still omitted the 1-into-4 split. Keep
    this single-provider series and normalize pre-event OHLC/volume. The
    observed 2026-09-11 unadjusted close (10.85) is an explicit scale guard;
    HKEX's official formula fixes the new-unit reference close at 2.7125.
    Unknown provider scales fail rather than guessing a correction.
    """
    if symbol != REALORD_SYMBOL or expected < REALORD_SPLIT_DATE:
        return payload
    source = payload.get("priceSource", {})
    if source.get("provider") != "Tencent" or source.get("symbol") != "hk01196":
        raise ValueError("Realord split normalization requires Tencent's permanent 1196 series")
    if not is_realord_name(payload.get("name", "")):
        raise ValueError("Realord split normalization received an unexpected issuer name")
    applied = source.get("corporateActions", [])
    if any(item.get("id") == REALORD_ACTION_ID for item in applied):
        return payload
    records = payload.get("records", [])
    anchors = [row for row in records if row["date"] == "2026-09-11"]
    if len(anchors) != 1 or not math.isclose(anchors[0]["close"], 10.85, abs_tol=1e-8):
        raise ValueError("Realord split: unknown/missing raw 2026-09-11 anchor; expected 10.85")
    adjusted_anchor = anchors[0].get("adjClose", float("nan"))
    ratio = adjusted_anchor / anchors[0]["close"]
    # Tencent may round HK qfq values to three decimals (2.7125 -> 2.713).
    # The half-tick tolerance admits that rounding, not a different scale.
    if math.isclose(adjusted_anchor, 10.85, abs_tol=0.00051):
        adjust_qfq = True
    elif math.isclose(adjusted_anchor, 2.7125, abs_tol=0.00051):
        adjust_qfq = False
    else:
        raise ValueError(f"Realord split: ambiguous qfq/raw adjustment ratio {ratio}")
    if not any(row["date"] >= REALORD_SPLIT_DATE for row in records):
        raise ValueError("Realord split: permanent series has no post-split prices")
    result = deepcopy(payload)
    for row in result["records"]:
        if row["date"] >= REALORD_SPLIT_DATE:
            continue
        if "rawClose" in row or "rawVolume" in row:
            raise ValueError("Realord split: unexplained prior adjustment metadata")
        row["rawClose"], row["rawVolume"] = row["close"], row["volume"]
        for key in ("open", "high", "low", "close"):
            row[key] *= 0.25
        row["volume"] *= 4
        if adjust_qfq:
            row["adjClose"] *= 0.25
    result["name"] = REALORD_NAME
    result["priceSource"]["adjustment"] = (
        "pre-2026-09-14 OHLC and volume normalized for 1-into-4 split; "
        "rawClose/rawVolume retained; qfq adjusted close for RS"
    )
    result["priceSource"]["corporateActions"] = [*applied, {
        "id": REALORD_ACTION_ID,
        "type": "share-split",
        "effectiveDate": REALORD_SPLIT_DATE,
        "oldShares": 1,
        "newShares": 4,
        "temporaryTicker": REALORD_TEMPORARY_SYMBOL,
        "temporaryCounterEnd": REALORD_TEMPORARY_END,
        "permanentCounterReopens": "2026-09-28",
        "providerQfqAlreadyAdjusted": not adjust_qfq,
        "anchorDate": "2026-09-11",
        "anchorRawClose": 10.85,
        "anchorSplitAdjustedClose": 2.7125,
        "sources": REALORD_SOURCES,
    }]
    return result
