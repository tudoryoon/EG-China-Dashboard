"""Retain dated published observations when a small number of quotes fail."""
from copy import deepcopy
from datetime import date
import math
from collection_policy import MAX_SECURITY_FAILURES


RS_HISTORY_KEYS = {"price", "open", "high", "low", "volume", "rsRatingAll"}
TREND_HISTORY_KEYS = {"score", "rank", "climaxScore", "price", "relative", "rsRating"}
MEMBER_FIELDS = {"ticker", "name", "groups", "watchlist", "assetType", "sourceTicker", "aliases", "identitySource"}


def require_collection_coverage(collected, requested, errors):
    """A handful of failed securities cannot block an otherwise healthy feed."""
    if len(errors) > MAX_SECURITY_FAILURES:
        raise RuntimeError(
            f"Security collection failure limit exceeded: {len(errors)} > {MAX_SECURITY_FAILURES}; "
            f"collected {collected}/{requested}; failures={errors}"
        )
    if not collected or collected < requested * 0.95:
        raise RuntimeError(f"Insufficient coverage: {collected}/{requested}; refusing publication")


def _finite(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value)


def _align_history(history, previous_dates, next_dates, required, as_of):
    if not isinstance(history, dict) or not required.issubset(history):
        raise ValueError("Incomplete previous history")
    if not previous_dates or len(previous_dates) != len(set(previous_dates)) or previous_dates != sorted(previous_dates):
        raise ValueError("Invalid previous history dates")
    for day in previous_dates:
        if date.fromisoformat(day).isoformat() != day:
            raise ValueError("Noncanonical previous history date")
    if as_of not in previous_dates:
        raise ValueError("Previous asOfDate is absent from history")
    last_index = previous_dates.index(as_of)
    result = {}
    for key, values in history.items():
        if not isinstance(values, list) or len(values) != len(previous_dates):
            raise ValueError("Previous history length mismatch")
        if any(value is not None and not _finite(value) for value in values):
            raise ValueError("Invalid previous history value")
        if any(value is not None for value in values[last_index + 1:]):
            raise ValueError("Previous observations exceed asOfDate")
        dated = dict(zip(previous_dates, values))
        result[key] = [dated.get(day) for day in next_dates]
    price = history["price"][last_index]
    if not _finite(price) or price <= 0:
        raise ValueError("Previous asOfDate has no valid price")
    return result


def _retained_pair(previous, member, output, error):
    symbol = member["ticker"]
    old_rs = previous.get("rs", {})
    old_trend = previous.get("trend", {})
    rs_matches = [row for row in old_rs.get("rows", []) if row.get("ticker") == symbol]
    trend_matches = [row for row in old_trend.get("rows", {}).get("all", []) if row.get("ticker") == symbol]
    if len(rs_matches) != 1 or len(trend_matches) != 1:
        raise ValueError("Previous RS/trend row pair is unavailable")
    old_row, old_trow = rs_matches[0], trend_matches[0]
    as_of = old_row.get("asOfDate")
    if not isinstance(as_of, str) or date.fromisoformat(as_of).isoformat() != as_of:
        raise ValueError("Previous asOfDate is invalid")
    if as_of != old_trow.get("asOfDate") or as_of > output["rs"]["updatedAt"]:
        raise ValueError("Previous row dates disagree or would roll backward")
    if any(not _finite(row.get("price")) or row["price"] <= 0 for row in (old_row, old_trow)):
        raise ValueError("Previous row has no valid price")
    history = _align_history(old_rs.get("histories", {}).get(symbol), old_rs.get("historyDates", []),
                             output["rs"]["historyDates"], RS_HISTORY_KEYS, as_of)
    thistory = _align_history(old_trend.get("histories", {}).get("all", {}).get(symbol),
                              old_trend.get("historyDates", []), output["trend"]["historyDates"],
                              TREND_HISTORY_KEYS, as_of)
    row, trow = deepcopy(old_row), deepcopy(old_trow)
    for field in MEMBER_FIELDS:
        row.pop(field, None)
        trow.pop(field, None)
    # Current membership, source aliases and watchlist flags are not stale price data.
    row.update(deepcopy(member))
    trow.update(deepcopy(member))
    if member.get("name") == symbol:
        row["name"] = old_row.get("name", symbol)
        trow["name"] = old_trow.get("name", symbol)
    for item in (row, trow):
        item["dataStatus"] = "stale"
        item["collectionError"] = error
    return row, history, trow, thistory


def retain_failed_securities(output, previous, members):
    """Merge only failed current members after all fresh scoring has completed.

    Missing first-time securities remain explicitly listed in ``meta.missing``.
    Repeated failures retain their original observation dates and never forward
    fill a chart, recompute a stale score, or resurrect removed constituents.
    """
    errors = output["meta"]["missing"]
    fresh = len(output["rs"]["rows"])
    current = {member["ticker"]: member for member in members}
    if not set(errors).issubset(current):
        raise ValueError("Collection failures contain inactive securities")
    if set(errors) & {row["ticker"] for row in output["rs"]["rows"]}:
        raise ValueError("Failed security was included in fresh scoring")
    retained, omitted = [], []
    for symbol, error in errors.items():
        try:
            row, history, trow, thistory = _retained_pair(previous or {}, current[symbol], output, error)
        except (KeyError, TypeError, ValueError, AttributeError):
            omitted.append(symbol)
            continue
        output["rs"]["rows"].append(row)
        output["rs"]["histories"][symbol] = history
        output["trend"]["rows"]["all"].append(trow)
        output["trend"]["histories"]["all"][symbol] = thistory
        retained.append(symbol)
    output["rs"]["rows"].sort(key=lambda row: (-(row.get("rsRatingAll") or 0), row["ticker"]))
    output["trend"]["rows"]["all"].sort(key=lambda row: (row.get("rank") is None, row.get("rank") or 9999, row["ticker"]))
    output["meta"].update(requested=len(members), covered=len(output["rs"]["rows"]), fresh=fresh,
                           retained=sorted(retained), omitted=sorted(omitted))
    return output
