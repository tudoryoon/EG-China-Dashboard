"""Validated ETF quotes and supplementary scores using the unchanged engines."""
from datetime import date
import math

ETF_SECIDS = {
    "3033.HK": "116.03033", "3109.HK": "116.03109",
    "588200.SS": "1.588200", "562500.SS": "1.562500", "159819.SZ": "0.159819",
}
ETF_SOURCE = "https://push2his.eastmoney.com/api/qt/stock/kline/get"
PROVISIONAL_TREND = {"6082.HK": 60, "0100.HK": 60}


def parse_etf_history(symbol, raw, adjusted, completed_through):
    """Use one provider for the whole history; never splice adjustment bases."""
    expected = ETF_SECIDS[symbol].split(".")[1]
    for payload in (raw, adjusted):
        if payload.get("code") != expected or not payload.get("klines"):
            raise ValueError(f"Wrong or empty ETF response: {symbol}")

    def parse(payload):
        records = {}
        for line in payload["klines"]:
            values = line.split(",")
            day = date.fromisoformat(values[0]).isoformat()
            if day > completed_through:
                continue
            numbers = list(map(float, values[1:6]))
            if len(numbers) != 5 or not all(math.isfinite(x) for x in numbers):
                raise ValueError(f"Invalid ETF quote: {symbol} {day}")
            opening, close, high, low, volume = numbers
            if opening <= 0 or low <= 0 or not low <= close <= high or volume < 0:
                raise ValueError(f"Invalid ETF OHLCV: {symbol} {day}")
            if day in records:
                raise ValueError(f"Duplicate ETF session: {symbol} {day}")
            records[day] = dict(date=day, open=opening, close=close, high=high, low=low,
                                volume=volume * (1 if symbol.endswith(".HK") else 100))
        return records

    prices, adjusted_prices = parse(raw), parse(adjusted)
    if not prices or prices.keys() != adjusted_prices.keys():
        raise ValueError(f"ETF adjusted/raw dates differ: {symbol}")
    # Preserve vendor observations. Opening auction values can fall outside the
    # reported session range (also present in Yahoo); disclose instead of editing.
    opening_notes = [day for day, row in prices.items() if not row["low"] <= row["open"] <= row["high"]]
    for day, row in prices.items():
        row["rawClose"] = row["close"]
        # The trend engine consumes OHLC, so normalize the whole price series,
        # not only RS returns. E.g. 588200's July 2026 unit split must not look
        # like a 67% crash. Keep actual closes separately for daily price moves.
        row.update({key: adjusted_prices[day][key] for key in ("open", "high", "low", "close")})
        row["adjClose"] = adjusted_prices[day]["close"]
    return {"name": raw.get("name") or symbol, "records": [prices[d] for d in sorted(prices)],
            "priceSource": {"provider": "Eastmoney", "url": ETF_SOURCE,
                            "secid": ETF_SECIDS[symbol], "adjustment": "fqt=1 adjusted OHLC; fqt=0 rawClose and volume",
                            "volumeUnit": "shares", "openOutsideSessionRangeDates": opening_notes}}


def build_regional_rs(equity_prices, etf_prices, engine):
    """Score each ETF against regional equities without changing equity ranks."""
    import pandas as pd
    periods = engine.build_period_rs_ratings(equity_prices)
    for ticker in etf_prices:
        reference = pd.concat([equity_prices, etf_prices[[ticker]]], axis=1)
        supplementary = engine.build_period_rs_ratings(reference)
        for period, values in supplementary.items():
            periods[period][ticker] = values[ticker]
    return periods, engine.weighted_rs_rating(periods)


def build_regional_trend(engine, universe, meta, rs_payload, *args):
    """Enable the upstream available-history mode only for requested new listings."""
    previous = engine.PROVISIONAL_LONG_TREND_MIN_PERIODS_BY_TICKER
    previous_set = engine.PROVISIONAL_LONG_TREND_TICKERS
    enabled = {ticker: minimum for ticker, minimum in PROVISIONAL_TREND.items()
               if sum(value is not None for value in rs_payload.get("histories", {}).get(ticker, {}).get("price", [])) < 200}
    try:
        engine.PROVISIONAL_LONG_TREND_MIN_PERIODS_BY_TICKER = {**previous, **enabled}
        engine.PROVISIONAL_LONG_TREND_TICKERS = set(engine.PROVISIONAL_LONG_TREND_MIN_PERIODS_BY_TICKER)
        return engine.build_universe_payload(universe, meta, rs_payload, *args)
    finally:
        engine.PROVISIONAL_LONG_TREND_MIN_PERIODS_BY_TICKER = previous
        engine.PROVISIONAL_LONG_TREND_TICKERS = previous_set
