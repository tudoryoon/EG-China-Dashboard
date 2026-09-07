from __future__ import annotations

import argparse
import json
import math
import re
from pathlib import Path

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
RS_DATA_PATH = ROOT / "data" / "market-rs-data.js"
MARKET_PRICE_DATA_PATH = ROOT / "data" / "market-price-data.js"
OUTPUT_PATH = ROOT / "data" / "market-trend-score-data.js"
BRIEFING_DATA_PATH = ROOT / "data" / "market-briefing-data.js"
HISTORY_POINTS = 252
ATR_MIN_PERIODS = 2
# Newly listed names can be scored before a full 200-session history is
# available. Keep DRAM's established 50-session threshold, while SPCX only
# needs enough sessions for its 20-day trend inputs to be meaningful.
PROVISIONAL_LONG_TREND_MIN_PERIODS_BY_TICKER = {
    "DRAM": 50,
    "SPCX": 20,
}
PROVISIONAL_LONG_TREND_TICKERS = set(PROVISIONAL_LONG_TREND_MIN_PERIODS_BY_TICKER)

UNIVERSES = {
    "all": {
        "label": "ALL",
        "include_all": True,
        "history_key": "rsRatingAll",
        "benchmark_key": "sp500",
        "color": "#0f766e",
    },
    "nasdaq100": {
        "label": "NASDAQ 100",
        "membership": "nasdaq100",
        "history_key": "rsRatingNasdaq100",
        "benchmark_key": "nasdaq100",
        "color": "#16a34a",
    },
    "sp500": {
        "label": "S&P 500",
        "membership": "sp500",
        "history_key": "rsRatingSp500",
        "benchmark_key": "sp500",
        "color": "#15803d",
    },
    "russell2000": {
        "label": "Russell 2000",
        "membership": "russell2000",
        "history_key": "rsRatingRussell2000",
        "benchmark_key": "russell2000",
        "color": "#8b5cf6",
    },
}

POSITION_BY_SCORE = {
    10: 3.0,
    9: 3.0,
    8: 2.0,
    7: 2.0,
    6: 1.0,
    5: 0.5,
    4: -0.5,
    3: -1.0,
    2: -2.0,
    1: -2.5,
    0: -3.0,
}

ATR_EXTENSION_SIGMA = {
    "ema10_plus3": 2.69,
    "sma200_plus2": 10.72,
}


def load_market_rs_payload() -> dict:
    text = RS_DATA_PATH.read_text(encoding="utf-8").strip()
    text = re.sub(r"^window\.marketRsData\s*=\s*", "", text)
    text = re.sub(r";\s*$", "", text)
    return json.loads(text)


def load_market_price_payload() -> dict:
    text = MARKET_PRICE_DATA_PATH.read_text(encoding="utf-8").strip()
    text = re.sub(r"^window\.marketPriceData\s*=\s*", "", text)
    text = re.sub(r";\s*$", "", text)
    return json.loads(text)


def load_existing_payload() -> dict:
    if not OUTPUT_PATH.exists():
        return {}
    text = OUTPUT_PATH.read_text(encoding="utf-8").strip()
    text = re.sub(r"^window\.marketTrendScoreData\s*=\s*", "", text)
    text = re.sub(r";\s*$", "", text)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {}


def load_daily_briefing_tickers() -> set[str]:
    if not BRIEFING_DATA_PATH.exists():
        return set()
    text = BRIEFING_DATA_PATH.read_text(encoding="utf-8").strip()
    text = re.sub(r"^window\.marketBriefingData\s*=\s*", "", text)
    text = re.sub(r";\s*$", "", text)
    try:
        payload = json.loads(text)
    except json.JSONDecodeError:
        return set()
    tickers: set[str] = set()
    for sector in payload.get("sectorPanels", []):
        if not isinstance(sector, dict):
            continue
        for item in sector.get("items", []):
            if isinstance(item, dict) and item.get("ticker"):
                tickers.add(str(item["ticker"]).strip())
    return tickers


def number_or_none(value: object) -> float | None:
    try:
        numeric = float(value)
    except Exception:
        return None
    if not math.isfinite(numeric):
        return None
    return numeric


def nullable_round(value: object, digits: int = 2) -> float | None:
    numeric = number_or_none(value)
    if numeric is None:
        return None
    return round(numeric, digits)


def nullable_int(value: object) -> int | None:
    numeric = number_or_none(value)
    if numeric is None:
        return None
    return int(round(numeric))


def serialize_series(series: pd.Series, digits: int = 2) -> list[float | int | None]:
    values = []
    for value in series.tolist():
        numeric = number_or_none(value)
        values.append(None if numeric is None else round(numeric, digits))
    return values


def as_numeric_series(values: list[object], dates: list[str]) -> pd.Series:
    series = pd.Series(values, index=pd.Index(pd.to_datetime(dates), name="date"), dtype="float64")
    return series.replace([math.inf, -math.inf], pd.NA)


def as_tail_aligned_series(values: list[object], dates: list[str]) -> pd.Series:
    full_index = pd.Index(pd.to_datetime(dates), name="date")
    if not values or not dates:
        return pd.Series(index=full_index, dtype="float64")
    trimmed_values = values[-len(dates):]
    aligned_dates = dates[-len(trimmed_values):]
    return as_numeric_series(trimmed_values, aligned_dates).reindex(full_index)


def score_label(score: int | None) -> str:
    if score is None:
        return "-"
    if score >= 9:
        return "★ 초강세"
    if score >= 5:
        return "▲ 비중확대"
    if score >= 3:
        return "▼ 비중축소"
    return "✖ 리스크"


def trend_state(score: int | None, price: float | None, sma20: float | None, sma50: float | None) -> str:
    if score is None:
        return "-"
    if price is not None and sma50 is not None and price < sma50:
        return "50DMA 하회"
    if price is not None and sma20 is not None and price < sma20:
        return "20DMA 하회"
    if score >= 9:
        return "A. Normal Leader"
    if score >= 5:
        return "B. Constructive"
    if score >= 3:
        return "C. Weakening"
    return "D. Breakdown Risk"


def classify_trend_state(
    score: int | None,
    price: float | None,
    sma20: float | None,
    sma50: float | None,
    climax_score: int | None,
    extended_count: int,
) -> str:
    if climax_score is not None and climax_score >= 7:
        return "C. Climax Risk"
    if (climax_score is not None and climax_score >= 4) or extended_count >= 2:
        return "B. Extended (TRIM 20~30%)"
    return trend_state(score, price, sma20, sma50)


def position_for_score(score: int | None) -> float | None:
    if score is None:
        return None
    return POSITION_BY_SCORE.get(max(0, min(10, score)))


def build_score_frame(
    price: pd.Series,
    relative: pd.Series,
    *,
    provisional_long_trend_min_periods: int | None = None,
) -> pd.DataFrame:
    price = price.astype("float64")
    relative = relative.astype("float64")
    frame = pd.DataFrame({"price": price, "relative": relative})
    frame["ema10"] = frame["price"].ewm(span=10, adjust=False).mean()
    frame["ema21"] = frame["price"].ewm(span=21, adjust=False).mean()
    frame["sma20"] = frame["price"].rolling(20).mean()
    frame["sma50"] = frame["price"].rolling(50).mean()
    frame["sma200"] = frame["price"].rolling(200).mean()
    frame["rs20"] = frame["relative"].rolling(20).mean()
    frame["rs50"] = frame["relative"].rolling(50).mean()
    frame["rs200"] = frame["relative"].rolling(200).mean()

    price_long = frame["sma200"]
    rs_long = frame["rs200"]
    if provisional_long_trend_min_periods is not None:
        price_long = frame["price"].rolling(200, min_periods=provisional_long_trend_min_periods).mean()
        rs_long = frame["relative"].rolling(200, min_periods=provisional_long_trend_min_periods).mean()

    absolute_conditions = [
        frame["price"] > price_long,
        frame["sma50"] > price_long,
        frame["price"] > frame["sma50"],
        frame["sma50"] > frame["sma50"].shift(5),
    ]
    relative_conditions = [
        frame["relative"] > rs_long,
        frame["rs50"] > rs_long,
        frame["relative"] > frame["rs50"],
        frame["rs50"] > frame["rs50"].shift(5),
    ]
    momentum_conditions = [
        frame["price"] > frame["sma20"],
        frame["relative"] > frame["rs20"],
    ]

    frame["absoluteScore"] = sum(condition.astype("float64") for condition in absolute_conditions)
    frame["relativeScore"] = sum(condition.astype("float64") for condition in relative_conditions)
    frame["momentumScore"] = sum(condition.astype("float64") for condition in momentum_conditions)
    ready = pd.concat([price_long, rs_long], axis=1).notna().all(axis=1)
    frame["score"] = (frame["absoluteScore"] + frame["relativeScore"] + frame["momentumScore"]).where(ready)
    frame["deviation10EmaPct"] = ((frame["price"] / frame["ema10"]) - 1) * 100
    frame["deviation20Pct"] = ((frame["price"] / frame["sma20"]) - 1) * 100
    frame["deviation21EmaPct"] = ((frame["price"] / frame["ema21"]) - 1) * 100
    frame["deviation50Pct"] = ((frame["price"] / frame["sma50"]) - 1) * 100
    frame["deviation200Pct"] = ((frame["price"] / frame["sma200"]) - 1) * 100
    frame["rankScore"] = (
        frame["score"] * 10000
        + frame["relativeScore"] * 700
        + frame["absoluteScore"] * 500
        + frame["momentumScore"] * 250
        + frame["relative"].fillna(0) * 4
        + frame["deviation50Pct"].fillna(0)
    ).where(ready)
    return frame


def up_streak(series: pd.Series) -> int:
    values = series.dropna()
    if len(values) < 2:
        return 0
    streak = 0
    changes = values.diff().dropna()
    for value in reversed(changes.tolist()):
        if value > 0:
            streak += 1
        else:
            break
    return streak


def has_ohlcv(frame: pd.DataFrame) -> bool:
    required = ["open", "high", "low", "volume"]
    return all(column in frame.columns and frame[column].dropna().any() for column in required)


def compute_atr_pct(frame: pd.DataFrame, window: int = 21) -> pd.Series:
    price = frame["price"].astype("float64")
    high = frame["high"].astype("float64") if "high" in frame else price
    low = frame["low"].astype("float64") if "low" in frame else price
    previous_close = price.shift(1).fillna(price)
    true_range = pd.concat(
        [
            high - low,
            (high - previous_close).abs(),
            (low - previous_close).abs(),
        ],
        axis=1,
    ).max(axis=1)
    true_range_pct = (true_range / previous_close.where(previous_close > 0)) * 100
    min_periods = ATR_MIN_PERIODS if len(frame) < window + 1 else window
    return true_range_pct.rolling(window, min_periods=min_periods).mean()


def compute_climax_components(frame: pd.DataFrame) -> pd.DataFrame:
    price = frame["price"].astype("float64")
    output = pd.DataFrame(index=frame.index)
    output["return15dPct"] = ((price / price.shift(15)) - 1) * 100
    output["return10dPct"] = ((price / price.shift(10)) - 1) * 100
    output["threeWeekRule"] = output["return15dPct"] >= 25
    output["tenDaySurge"] = output["return10dPct"] >= 20
    output["ema21Extended20"] = frame["deviation21EmaPct"] >= 20
    output["ema21Extended15"] = frame["deviation21EmaPct"] >= 15
    output["upStreak8"] = price.diff().gt(0).rolling(8).sum() >= 8

    if has_ohlcv(frame):
        open_price = frame["open"].astype("float64")
        high = frame["high"].astype("float64")
        low = frame["low"].astype("float64")
        volume = frame["volume"].astype("float64")

        atr_pct = compute_atr_pct(frame, 21)
        output["atrPct"] = atr_pct
        output["atrAvg30Pct"] = atr_pct.rolling(30).mean()
        output["atrSpike"] = output["atrPct"] >= output["atrAvg30Pct"] * 1.5

        recent_5_volume = volume.rolling(5).mean()
        previous_20_volume = volume.shift(5).rolling(20).mean()
        output["volumeAccel"] = recent_5_volume >= previous_20_volume * 1.5

        output["gapPct"] = ((open_price / price.shift(1)) - 1) * 100
        output["gapUpExtended"] = output["gapPct"].ge(2) & output["ema21Extended15"]

        intraday_range = (high - low).replace(0, pd.NA)
        close_location = (price - low) / intraday_range
        output["intradayReversal"] = high.ge(high.rolling(10).max() - 1e-9) & close_location.le(0.3)

        body_to_range = (price - open_price).abs() / intraday_range
        volume_base = volume.shift(1).rolling(20).mean()
        stalling_day = volume.gt(volume_base * 1.3) & body_to_range.lt(0.3)
        output["stalling"] = stalling_day.rolling(5).sum() >= 2

        daily_return = ((price / price.shift(1)) - 1) * 100
        output["shellac"] = (
            volume.ge(volume.rolling(126, min_periods=60).max() * 0.95)
            & daily_return.le(-2)
            & price.lt(open_price)
        )
        output["source"] = "ohlcv"
    else:
        daily_range_proxy = price.pct_change().abs() * 100
        min_periods = ATR_MIN_PERIODS if len(frame) < 22 else 21
        atr_proxy = daily_range_proxy.rolling(21, min_periods=min_periods).mean()
        output["atrPct"] = atr_proxy
        output["atrAvg30Pct"] = atr_proxy.rolling(30).mean()
        output["atrSpike"] = output["atrPct"] >= output["atrAvg30Pct"] * 1.5
        output["volumeAccel"] = False
        output["gapUpExtended"] = False
        output["intradayReversal"] = False
        output["stalling"] = False
        output["shellac"] = False
        output["source"] = "close_proxy"

    output["atrExt10"] = frame["deviation10EmaPct"] / output["atrPct"]
    output["atrExt200"] = frame["deviation200Pct"] / output["atrPct"]
    output["extremeAtrExtension"] = (
        output["atrExt10"].gt(ATR_EXTENSION_SIGMA["ema10_plus3"])
        & output["atrExt200"].gt(ATR_EXTENSION_SIGMA["sma200_plus2"])
    )
    output["extensionExhaustion"] = output["ema21Extended20"] | output["extremeAtrExtension"]
    output["score"] = (
        output["threeWeekRule"].astype("float64") * 2
        + output["tenDaySurge"].astype("float64")
        + output["extensionExhaustion"].astype("float64") * 3
        + output["atrSpike"].astype("float64") * 2
        + output["volumeAccel"].astype("float64")
        + output["gapUpExtended"].astype("float64")
        + output["intradayReversal"].astype("float64") * 3
        + output["stalling"].astype("float64") * 2
        + output["shellac"].astype("float64") * 3
    )
    ready = price.notna().rolling(31).sum() >= 31
    output["score"] = output["score"].where(ready)
    return output


def compute_climax_row(frame: pd.DataFrame, atr_pct: float | None) -> dict[str, object]:
    price = frame["price"].dropna()
    if len(price) < 31:
        return {"score": None, "flags": [], "extendedFlags": [], "extendedCount": 0}

    components = compute_climax_components(frame).reindex(frame.index)
    latest = components.iloc[-1]
    score = nullable_int(latest.get("score")) or 0
    flags: list[str] = []
    extended_flags: list[str] = []
    source = str(latest.get("source") or "close_proxy")

    if bool(latest.get("threeWeekRule")):
        flags.append("3주 +25%")
    if bool(latest.get("tenDaySurge")):
        flags.append("10일 +20%")
    if bool(latest.get("atrSpike")):
        flags.append("ATR 확장")
        extended_flags.append("ATR 확장")
    if bool(latest.get("volumeAccel")):
        flags.append("거래량 가속")
        extended_flags.append("거래량 가속")
    if bool(latest.get("gapUpExtended")):
        flags.append("확장 갭상승")
    if bool(latest.get("intradayReversal")):
        flags.append("일중 반전")
    if bool(latest.get("stalling")):
        flags.append("Stalling")
    if bool(latest.get("shellac")):
        flags.append("Shellac")

    deviation21 = number_or_none(frame.iloc[-1].get("deviation21EmaPct"))
    if deviation21 is not None and deviation21 >= 20:
        flags.append(f"21EMA+{deviation21:.0f}%")
        extended_flags.append(f"21EMA+{deviation21:.0f}%")
    if bool(latest.get("extremeAtrExtension")):
        flags.append("ATR Ext +3sigma/+2sigma")
        extended_flags.append("ATR Ext +3sigma/+2sigma")
    if up_streak(price) >= 8:
        extended_flags.append("8일 연속상승")

    fresh_breakout = False
    if len(frame) >= 21:
        previous_gap = number_or_none(frame["deviation50Pct"].iloc[-21])
        current_gap = number_or_none(frame["deviation50Pct"].iloc[-1])
        fresh_breakout = (
            previous_gap is not None
            and current_gap is not None
            and previous_gap < 8
            and current_gap > 12
        )

    # 21EMA and ATR-extension exhaustion is scored so highly extended leaders are
    # pushed into the 4~6 caution band even before a reversal day appears.
    return {
        "score": min(score, 10),
        "flags": flags,
        "extendedFlags": extended_flags,
        "extendedCount": len(extended_flags),
        "freshBreakout": fresh_breakout,
        "return15dPct": nullable_round(latest.get("return15dPct")),
        "return10dPct": nullable_round(latest.get("return10dPct")),
        "atrPct": nullable_round(latest.get("atrPct")),
        "atrAvg30Pct": nullable_round(latest.get("atrAvg30Pct")),
        "atrExt10": nullable_round(latest.get("atrExt10")),
        "atrExt200": nullable_round(latest.get("atrExt200")),
        "source": source,
    }


def compute_climax_history(frame: pd.DataFrame) -> pd.Series:
    return compute_climax_components(frame)["score"].reindex(frame.index)


def rank_scores(score_frame: pd.DataFrame) -> pd.DataFrame:
    ranks = score_frame.rank(axis=1, method="min", ascending=False, na_option="bottom")
    valid = score_frame.notna()
    return ranks.where(valid)


def latest_valid_index(series: pd.Series) -> pd.Timestamp | None:
    valid = series.dropna()
    if valid.empty:
        return None
    return valid.index[-1]


def build_benchmark_series(market_price_payload: dict, benchmark_key: str) -> pd.Series:
    item = market_price_payload.get("items", {}).get(benchmark_key, {})
    return pd.Series(
        item.get("values", []),
        index=pd.Index(pd.to_datetime(item.get("dates", [])), name="date"),
        dtype="float64",
    ).replace([math.inf, -math.inf], pd.NA)


def align_benchmark_series(benchmark: pd.Series, price_index: pd.Index) -> pd.Series:
    aligned = benchmark.reindex(price_index)
    # A short internal gap in an otherwise continuous benchmark must not invalidate
    # the following 200 sessions of rolling relative-trend calculations.
    return aligned.interpolate(method="time", limit=3, limit_area="inside")


def build_universe_payload(
    universe_key: str,
    meta: dict,
    source: dict,
    market_price_payload: dict,
    frame_cache: dict[tuple[str, str], pd.DataFrame],
    climax_cache: dict[str, tuple[pd.Series, dict[str, object]]],
    ticker_filter: set[str] | None = None,
) -> tuple[list[dict], dict[str, dict]]:
    rows_by_ticker = {row.get("ticker"): row for row in source.get("rows", []) if row.get("ticker")}
    dates = source.get("historyDates", [])[-HISTORY_POINTS:]
    histories = source.get("histories", {})
    benchmark = build_benchmark_series(market_price_payload, str(meta["benchmark_key"]))
    members: list[tuple[str, dict, dict, pd.DataFrame]] = []

    for ticker, row in rows_by_ticker.items():
        if ticker_filter is not None and ticker not in ticker_filter:
            continue
        memberships = row.get("memberships", {})
        if meta.get("include_all"):
            pass
        else:
            membership_key = meta.get("membership")
            membership_keys = meta.get("memberships")
            if membership_keys:
                if not any(memberships.get(key) for key in membership_keys):
                    continue
            elif membership_key and not memberships.get(membership_key):
                continue
        history = histories.get(ticker)
        if not history:
            continue
        price_values = (history.get("price") or [])[-len(dates):]
        rating_values = (history.get(meta["history_key"]) or [])[-len(dates):]
        if not price_values or not rating_values:
            continue
        frame_cache_key = (ticker, str(meta["benchmark_key"]))
        cached_frame = frame_cache.get(frame_cache_key)
        if cached_frame is None:
            price = as_tail_aligned_series(price_values, dates)
            benchmark_window = align_benchmark_series(benchmark, price.index)
            relative = price.div(benchmark_window)
            if relative.dropna().empty:
                continue
            cached_frame = build_score_frame(
                price,
                relative,
                provisional_long_trend_min_periods=PROVISIONAL_LONG_TREND_MIN_PERIODS_BY_TICKER.get(ticker),
            )
            for history_key in ["open", "high", "low", "volume"]:
                values = (history.get(history_key) or [])[-len(dates):]
                if values:
                    cached_frame[history_key] = as_tail_aligned_series(values, dates)
            frame_cache[frame_cache_key] = cached_frame
        frame = cached_frame.copy()
        frame["rsRating"] = as_tail_aligned_series(rating_values, dates)
        if frame["price"].dropna().empty:
            continue
        members.append((ticker, row, history, frame))

    if not members:
        return [], {}

    score_matrix = pd.concat({ticker: frame["rankScore"] for ticker, _, _, frame in members}, axis=1)
    rank_matrix = rank_scores(score_matrix)

    rows = []
    output_histories: dict[str, dict] = {}
    for ticker, row, _, frame in members:
        valid_at = latest_valid_index(frame["score"]) or latest_valid_index(frame["price"])
        if valid_at is None:
            continue
        latest = frame.loc[valid_at]
        valid_scores = frame["score"].dropna()
        previous_score = valid_scores.iloc[-2] if len(valid_scores) >= 2 else None
        latest_rank = rank_matrix.at[valid_at, ticker] if ticker in rank_matrix.columns else None
        rank_series = rank_matrix[ticker].dropna() if ticker in rank_matrix.columns else pd.Series(dtype="float64")
        previous_rank = rank_series.iloc[-2] if len(rank_series) >= 2 else None
        score_value = nullable_int(latest.get("score"))
        climax_cache_key = f"{ticker}:{valid_at.date().isoformat()}"
        cached_climax = climax_cache.get(climax_cache_key)
        if cached_climax is None:
            climax_history = compute_climax_history(frame)
            climax = compute_climax_row(frame.loc[:valid_at], number_or_none(row.get("atr21Pct")))
            cached_climax = (climax_history, climax)
            climax_cache[climax_cache_key] = cached_climax
        else:
            climax_history, climax = cached_climax
        climax_score = nullable_int(climax.get("score"))
        state = classify_trend_state(
            score_value,
            number_or_none(latest.get("price")),
            number_or_none(latest.get("sma20")),
            number_or_none(latest.get("sma50")),
            climax_score,
            int(climax.get("extendedCount") or 0),
        )
        if climax.get("freshBreakout") and state.startswith("B."):
            state = "A. Normal Leader (8주 Hold)"
        rank_value = nullable_int(latest_rank)
        atr_pct = number_or_none(row.get("atr21Pct"))
        deviation10 = number_or_none(latest.get("deviation10EmaPct"))
        deviation20 = number_or_none(latest.get("deviation20Pct"))
        deviation50 = number_or_none(latest.get("deviation50Pct"))
        deviation200 = number_or_none(latest.get("deviation200Pct"))
        rows.append(
            {
                "ticker": ticker,
                "name": row.get("name") or ticker,
                "asOfDate": valid_at.date().isoformat(),
                "marketCap": row.get("marketCap"),
                "price": nullable_round(latest.get("price")),
                "rank": rank_value,
                "rankChange": None
                if rank_value is None or previous_rank is None
                else int(round(float(previous_rank) - float(rank_value))),
                "score": score_value,
                "scoreChange": None
                if score_value is None or previous_score is None
                else int(round(float(score_value) - float(previous_score))),
                "absoluteScore": nullable_int(latest.get("absoluteScore")),
                "relativeScore": nullable_int(latest.get("relativeScore")),
                "momentumScore": nullable_int(latest.get("momentumScore")),
                "rsRating": nullable_int(latest.get("rsRating")),
                "rsLine": nullable_round(latest.get("relative"), 6),
                "ema10": nullable_round(latest.get("ema10")),
                "sma20": nullable_round(latest.get("sma20")),
                "ema21": nullable_round(latest.get("ema21")),
                "sma50": nullable_round(latest.get("sma50")),
                "sma200": nullable_round(latest.get("sma200")),
                "deviation10EmaPct": nullable_round(deviation10),
                "deviation20Pct": nullable_round(deviation20),
                "deviation21EmaPct": nullable_round(latest.get("deviation21EmaPct")),
                "deviation50Pct": nullable_round(deviation50),
                "deviation200Pct": nullable_round(deviation200),
                "atr21Pct": nullable_round(atr_pct),
                "atrExt10": nullable_round(deviation10 / atr_pct) if atr_pct and deviation10 is not None else None,
                "atrExt20": nullable_round(deviation20 / atr_pct) if atr_pct and deviation20 is not None else None,
                "atrExt50": nullable_round(deviation50 / atr_pct) if atr_pct and deviation50 is not None else None,
                "atrExt200": nullable_round(deviation200 / atr_pct) if atr_pct and deviation200 is not None else None,
                "baseWeightPct": position_for_score(score_value),
                "climaxScore": climax_score,
                "climaxFlags": climax.get("flags") or [],
                "extendedFlags": climax.get("extendedFlags") or [],
                "climaxSource": climax.get("source"),
                "zone": score_label(score_value),
                "state": state,
                **(
                    {
                        "scoreBasis": "available-history-provisional",
                        "historySessions": int(len(frame["price"].dropna())),
                    }
                    if ticker in PROVISIONAL_LONG_TREND_TICKERS and len(frame["price"].dropna()) < 200
                    else {}
                ),
            }
        )
        output_histories[ticker] = {
            "score": serialize_series(frame["score"], 0),
            "rank": serialize_series(rank_matrix[ticker] if ticker in rank_matrix.columns else pd.Series(index=frame.index), 0),
            "climaxScore": serialize_series(climax_history, 0),
            "price": serialize_series(frame["price"], 2),
            "relative": serialize_series(frame["relative"], 6),
            "rsRating": serialize_series(frame["rsRating"], 0),
        }

    rows.sort(key=lambda item: (item["rank"] is None, item["rank"] or 9999, item["ticker"]))
    return rows, output_histories


def build_payload() -> dict:
    source = load_market_rs_payload()
    market_price_payload = load_market_price_payload()
    dates = source.get("historyDates", [])[-HISTORY_POINTS:]
    rows_by_universe = {}
    histories_by_universe = {}
    frame_cache: dict[tuple[str, str], pd.DataFrame] = {}
    climax_cache: dict[str, tuple[pd.Series, dict[str, object]]] = {}
    for universe_key, meta in UNIVERSES.items():
        rows, histories = build_universe_payload(
            universe_key,
            meta,
            source,
            market_price_payload,
            frame_cache,
            climax_cache,
        )
        rows_by_universe[universe_key] = rows
        histories_by_universe[universe_key] = histories

    return {
        "updatedAt": source.get("updatedAt", ""),
        "source": {
            "label": "Market RS price and universe RS rating history",
            "input": "data/market-rs-data.js",
            "benchmarkInput": "data/market-price-data.js",
        },
        "historyDates": dates,
        "ranges": [
            {"key": "1m", "label": "1M"},
            {"key": "3m", "label": "3M"},
            {"key": "6m", "label": "6M"},
            {"key": "ytd", "label": "YTD"},
            {"key": "1y", "label": "1Y"},
        ],
        "universes": UNIVERSES,
        "scoring": {
            "label": "Trend Score",
            "description": "Price trend 4 points, benchmark-relative RS line trend 4 points, and short-term momentum 2 points. NASDAQ100, S&P500, and Russell 2000 use their own index benchmarks; ALL uses the S&P500 benchmark.",
            "provisionalNote": "DRAM and newly listed SPCX use available-history long-term averages until a full 200-session history is available (DRAM: 50 sessions, SPCX: 20 sessions).",
            "absolute": [
                "Price > 200DMA",
                "50DMA > 200DMA",
                "Price > 50DMA",
                "50DMA rising versus 5 sessions ago",
            ],
            "relative": [
                "Universe RS rating > RS 200DMA",
                "RS 50DMA > RS 200DMA",
                "Universe RS rating > RS 50DMA",
                "RS 50DMA rising versus 5 sessions ago",
            ],
            "momentum": ["Price > 20DMA", "Universe RS rating > RS 20DMA"],
            "climax": [
                "15-session return >= +25% adds 2",
                "10-session return >= +20% adds 1",
                "21EMA >= +20% or MA10 ATR Ext > +3sigma with MA200 ATR Ext > +2sigma adds 3",
                "21D ATR >= 30-session average ATR x1.5 adds 2",
                "5D average volume >= previous 20D average volume x1.5 adds 1",
                "Gap-up while extended above 21EMA adds 1",
                "10D high with close in lower 30% of intraday range adds 3",
                "2+ stalling days in the last 5 sessions adds 2",
                "Shellac day adds 3",
            ],
            "positionByScore": POSITION_BY_SCORE,
        },
        "rows": rows_by_universe,
        "histories": histories_by_universe,
    }


def build_daily_briefing_priority_payload() -> dict:
    source = load_market_rs_payload()
    market_price_payload = load_market_price_payload()
    existing = load_existing_payload()
    tickers = load_daily_briefing_tickers()
    if not tickers:
        raise RuntimeError("No Daily Briefing tickers are available for the priority trend refresh.")

    source_tickers = {
        str(row.get("ticker"))
        for row in source.get("rows", [])
        if isinstance(row, dict) and row.get("ticker")
    }
    fresh_tickers = tickers & source_tickers
    dates = source.get("historyDates", [])[-HISTORY_POINTS:]
    rows_by_universe: dict[str, list[dict]] = {}
    histories_by_universe: dict[str, dict[str, dict]] = {}
    frame_cache: dict[tuple[str, str], pd.DataFrame] = {}
    climax_cache: dict[str, tuple[pd.Series, dict[str, object]]] = {}
    existing_rows = existing.get("rows", {}) if isinstance(existing.get("rows"), dict) else {}
    existing_histories = existing.get("histories", {}) if isinstance(existing.get("histories"), dict) else {}

    for universe_key, meta in UNIVERSES.items():
        priority_rows, priority_histories = build_universe_payload(
            universe_key,
            meta,
            source,
            market_price_payload,
            frame_cache,
            climax_cache,
            ticker_filter=tickers,
        )
        previous_rows = {
            row.get("ticker"): row
            for row in existing_rows.get(universe_key, [])
            if isinstance(row, dict) and row.get("ticker")
        }
        merged_rows = list(previous_rows.values())
        for row in priority_rows:
            previous = previous_rows.get(row["ticker"])
            # A global rank requires every universe member's fresh close.  Keep
            # the prior rank during the lightweight pass; the daily score,
            # Climax and history are recomputed from the fresh OHLCV instead.
            if previous:
                row["rank"] = previous.get("rank")
                row["rankChange"] = previous.get("rankChange")
            previous_rows[row["ticker"]] = row
        merged_rows = list(previous_rows.values())
        merged_rows.sort(key=lambda item: (item.get("rank") is None, item.get("rank") or 9999, item.get("ticker") or ""))
        rows_by_universe[universe_key] = merged_rows
        merged_histories = dict(existing_histories.get(universe_key, {}))
        merged_histories.update(priority_histories)
        histories_by_universe[universe_key] = merged_histories

    return {
        "updatedAt": source.get("updatedAt", ""),
        "source": {
            "label": "Market RS price and universe RS rating history",
            "input": "data/market-rs-data.js",
            "benchmarkInput": "data/market-price-data.js",
        },
        "historyDates": dates,
        "ranges": [
            {"key": "1m", "label": "1M"},
            {"key": "3m", "label": "3M"},
            {"key": "6m", "label": "6M"},
            {"key": "ytd", "label": "YTD"},
            {"key": "1y", "label": "1Y"},
        ],
        "universes": UNIVERSES,
        "scoring": {
            "label": "Trend Score",
            "description": "Price trend 4 points, benchmark-relative RS line trend 4 points, and short-term momentum 2 points. NASDAQ100, S&P500, and Russell 2000 use their own index benchmarks; ALL uses the S&P500 benchmark.",
            "provisionalNote": "DRAM and newly listed SPCX use available-history long-term averages until a full 200-session history is available (DRAM: 50 sessions, SPCX: 20 sessions).",
            "absolute": ["Price > 200DMA", "50DMA > 200DMA", "Price > 50DMA", "50DMA rising versus 5 sessions ago"],
            "relative": ["Universe RS rating > RS 200DMA", "RS 50DMA > RS 200DMA", "Universe RS rating > RS 50DMA", "RS 50DMA rising versus 5 sessions ago"],
            "momentum": ["Price > 20DMA", "Universe RS rating > RS 20DMA"],
            "climax": [
                "15-session return >= +25% adds 2", "10-session return >= +20% adds 1", "21EMA >= +20% or MA10 ATR Ext > +3sigma with MA200 ATR Ext > +2sigma adds 3", "21D ATR >= 30-session average ATR x1.5 adds 2", "5D average volume >= previous 20D average volume x1.5 adds 1", "Gap-up while extended above 21EMA adds 1", "10D high with close in lower 30% of intraday range adds 3", "2+ stalling days in the last 5 sessions adds 2", "Shellac day adds 3",
            ],
            "positionByScore": POSITION_BY_SCORE,
        },
        "refreshScope": {
            "mode": "daily-briefing-priority",
            "freshTickerCount": len(fresh_tickers),
            "label": "Daily Briefing score and Climax refresh; global ranks refresh during the weekly full run.",
        },
        "rows": rows_by_universe,
        "histories": histories_by_universe,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Refresh market trend score data.")
    parser.add_argument("--daily-briefing-priority", action="store_true")
    args = parser.parse_args()
    payload = build_daily_briefing_priority_payload() if args.daily_briefing_priority else build_payload()
    OUTPUT_PATH.write_text(
        "window.marketTrendScoreData = "
        + json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
        + ";\n",
        encoding="utf-8",
        newline="\n",
    )
    print(f"Wrote {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
