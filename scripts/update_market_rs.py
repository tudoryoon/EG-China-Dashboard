from __future__ import annotations

import argparse
import json
import math
import os
import re
import time
from datetime import datetime, timezone
from io import StringIO
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from xml.etree import ElementTree as ET

import pandas as pd
import requests
import yfinance as yf


WIKI_HEADERS = {"User-Agent": "Mozilla/5.0"}
# Persist the dashboard chart from this date onward. Daily refreshes only need
# a few new sessions because the saved window already covers the 12-month RS
# lookback used for current rankings.
PRICE_PERIOD = os.getenv("MARKET_RS_PRICE_PERIOD", "5d")
BENCHMARK_SYMBOL = "^GSPC"
HISTORY_START_DATE = pd.Timestamp(os.getenv("MARKET_RS_HISTORY_START_DATE", "2025-01-01"))
MIN_MARKET_CAP_USD = 200_000_000
MAX_SHARES_FETCH = int(os.getenv("MARKET_RS_MAX_SHARES_FETCH", "25"))
SHARES_REFRESH_RATIO_LOW = 0.70
SHARES_REFRESH_RATIO_HIGH = 1.45
BATCH_SIZE = int(os.getenv("MARKET_RS_BATCH_SIZE", "15"))
BATCH_WORKERS = max(1, int(os.getenv("MARKET_RS_BATCH_WORKERS", "4")))
BATCH_SLEEP = float(os.getenv("MARKET_RS_BATCH_SLEEP", "0.6"))
RETRY_SLEEP = float(os.getenv("MARKET_RS_RETRY_SLEEP", "1.0"))
RETRY_ATTEMPTS = int(os.getenv("MARKET_RS_RETRY_ATTEMPTS", "4"))
# Yahoo Spark currently accepts up to 20 symbols per request.
SPARK_BATCH_SIZE = int(os.getenv("MARKET_RS_SPARK_BATCH_SIZE", "20"))
OHLC_FALLBACK_WORKERS = max(1, int(os.getenv("MARKET_RS_OHLC_FALLBACK_WORKERS", "8")))
LOOKBACKS = {
    "1w": 5,
    "2w": 10,
    "10d": 10,
    "20d": 20,
    "1m": 21,
    "3m": 63,
    "6m": 126,
    "9m": 189,
    "12m": 252,
}
UNIVERSES = {
    "sp500": {
        "label": "S&P 500",
        "url": "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies",
        "table_index": 0,
        "ticker_col": "Symbol",
        "name_col": "Security",
    },
    "nasdaq100": {
        "label": "NASDAQ 100",
        "url": "https://api.nasdaq.com/api/quote/list-type/nasdaq100",
        "ticker_col": "Ticker",
        "name_col": "Name",
        "source": "nasdaq_api",
    },
    "dowjones": {
        "label": "Dow Jones",
        "url": "https://en.wikipedia.org/wiki/Dow_Jones_Industrial_Average",
        "table_index": 1,
        "ticker_col": "Symbol",
        "name_col": "Company",
    },
    "russell2000": {
        "label": "Russell 2000",
        "url": "https://www.ishares.com/us/products/239710/ishares-russell-2000-etf/1467271812596.ajax?fileType=csv&fileName=IWM_holdings&dataType=fund",
        "ticker_col": "Ticker",
        "name_col": "Name",
        "source": "csv",
    },
}
MIN_UNIVERSE_MEMBERS = {
    "sp500": 450,
    "nasdaq100": 90,
    "dowjones": 25,
    "russell2000": 1_500,
}
# Wikipedia removed the constituent table from the Dow page in August 2026. Keep a
# compact fallback so a temporary source-layout change cannot zero out the universe.
DOW_JONES_FALLBACK = [
    ("AMGN", "Amgen"), ("AMZN", "Amazon"), ("AAPL", "Apple"), ("AXP", "American Express"),
    ("BA", "Boeing"), ("CAT", "Caterpillar"), ("CSCO", "Cisco"), ("CVX", "Chevron"),
    ("DIS", "Walt Disney"), ("GS", "Goldman Sachs"), ("HD", "Home Depot"), ("HON", "Honeywell"),
    ("IBM", "IBM"), ("JNJ", "Johnson & Johnson"), ("JPM", "JPMorgan Chase"), ("KO", "Coca-Cola"),
    ("MCD", "McDonald's"), ("MMM", "3M"), ("MRK", "Merck"), ("MSFT", "Microsoft"),
    ("NKE", "Nike"), ("NVDA", "NVIDIA"), ("PG", "Procter & Gamble"), ("CRM", "Salesforce"),
    ("SHW", "Sherwin-Williams"), ("TRV", "Travelers"), ("UNH", "UnitedHealth"),
    ("V", "Visa"), ("WMT", "Walmart"), ("GOOGL", "Alphabet"),
]
COLOR_BY_UNIVERSE = {
    "all": "#111827",
    "sp500": "#4b5563",
    "nasdaq100": "#2563eb",
    "dowjones": "#8b5cf6",
    "russell2000": "#0f766e",
}
RS_WEIGHTS = {"1m": 0.20, "3m": 0.40, "6m": 0.20, "12m": 0.20}
ATR_WINDOW = 21
ATR_MIN_PERIODS = 2
EXTENSION_ANCHORS = {
    "ema21": {
        "label": "21 EMA",
        "kind": "ema",
        "period": 21,
        # The article gives 1 sigma = 1.45x ATR and 3 sigma = 4.17x ATR for 21 EMA.
        # 2 sigma is linearly interpolated so the UI can show a complete 1/2/3 sigma ladder.
        "sigma_thresholds": {1: 1.45, 2: 2.81, 3: 4.17},
    },
    "sma50": {
        "label": "50 SMA",
        "kind": "sma",
        "period": 50,
        "sigma_thresholds": {1: 2.50, 2: 5.00, 3: 7.50},
    },
}
OUTPUT_PATH = Path(__file__).resolve().parents[1] / "data" / "market-rs-data.js"
BRIEFING_DATA_PATH = OUTPUT_PATH.parent / "market-briefing-data.js"
MANUAL_CONFIG_PATH = Path(__file__).resolve().parents[1] / "data" / "market-rs-manual-tickers.json"
# Isolate yfinance's SQLite cache from any concurrently running local updater.
yf.set_tz_cache_location(str(OUTPUT_PATH.parent.parent / ".yfinance-cache"))
NASDAQ100_SNAPSHOT_PATH = Path(__file__).resolve().parents[1] / "data" / "market-rs-nasdaq100-snapshot.json"
SYMBOL_ALIASES = {
    "CRDA": "CRD-A",
    "GEFB": "GEF-B",
    "MOGA": "MOG-A",
}
TERMINAL_SKIP_TICKERS = {
    "ADRO",
    "AKE",
    "GTXI",
    "INH",
    "P5N994",
    "PDLI",
    "SBT",
    "THRD",
}
SOURCE_PLACEHOLDER_TICKERS = {"", "NAN", "-", "--"}
MANUAL_UNIVERSE_MEMBERS = [
    {
        "ticker": "NBIS",
        "name": "Nebius Group N.V.",
        "member_sp500": False,
        "member_nasdaq100": False,
        "member_dowjones": False,
        "member_russell2000": False,
    },
    {
        "ticker": "CBRS",
        "name": "Cerebras Systems, Inc.",
        "member_sp500": False,
        "member_nasdaq100": False,
        "member_dowjones": False,
        "member_russell2000": False,
    },
    {
        "ticker": "ENPH",
        "name": "Enphase Energy, Inc.",
        "member_sp500": False,
        "member_nasdaq100": False,
        "member_dowjones": False,
        "member_russell2000": False,
    },
    {
        "ticker": "STM",
        "name": "STMicroelectronics N.V.",
        "member_sp500": False,
        "member_nasdaq100": False,
        "member_dowjones": False,
        "member_russell2000": False,
    },
    {
        "ticker": "NVT",
        "name": "nVent Electric plc",
        "member_sp500": False,
        "member_nasdaq100": False,
        "member_dowjones": False,
        "member_russell2000": False,
    },
]
MANUAL_SHARES_OUTSTANDING = {
    "NBIS": 253_898_194,
    "NVT": 161_720_452,
}


def load_manual_config() -> dict[str, object]:
    if not MANUAL_CONFIG_PATH.exists():
        return {}
    try:
        return json.loads(MANUAL_CONFIG_PATH.read_text(encoding="utf-8"))
    except Exception:
        return {}


def get_manual_universe_members() -> list[dict[str, object]]:
    members = [dict(member) for member in MANUAL_UNIVERSE_MEMBERS]
    seen = {normalize_ticker(member.get("ticker")) for member in members}
    for member in load_manual_config().get("members", []):
        if not isinstance(member, dict):
            continue
        ticker = normalize_ticker(member.get("ticker"))
        if not ticker or ticker in seen:
            continue
        memberships = member.get("memberships") if isinstance(member.get("memberships"), dict) else {}
        members.append(
            {
                "ticker": ticker,
                "name": str(member.get("name") or ticker).strip(),
                "member_sp500": bool(memberships.get("sp500") or member.get("member_sp500")),
                "member_nasdaq100": bool(memberships.get("nasdaq100") or member.get("member_nasdaq100")),
                "member_dowjones": bool(memberships.get("dowjones") or member.get("member_dowjones")),
                "member_russell2000": bool(memberships.get("russell2000") or member.get("member_russell2000")),
            }
        )
        seen.add(ticker)
    return members


def get_manual_shares_outstanding() -> dict[str, int]:
    shares = dict(MANUAL_SHARES_OUTSTANDING)
    for member in load_manual_config().get("members", []):
        if not isinstance(member, dict):
            continue
        ticker = normalize_ticker(member.get("ticker"))
        manual_shares = normalize_positive_int(member.get("sharesOutstanding") or member.get("shares"))
        if ticker and manual_shares:
            shares[ticker] = manual_shares
    return shares


def normalize_ticker(raw: object) -> str:
    ticker = str(raw).strip().upper().replace(".", "-")
    return SYMBOL_ALIASES.get(ticker, ticker)


def is_terminal_symbol(symbol: str) -> bool:
    return normalize_ticker(symbol) in TERMINAL_SKIP_TICKERS


def fetch_html(url: str) -> str:
    response = requests.get(url, headers=WIKI_HEADERS, timeout=30)
    response.raise_for_status()
    return response.text


def read_wiki_table(url: str, table_index: int) -> pd.DataFrame:
    html = fetch_html(url)
    tables = pd.read_html(StringIO(html))
    return tables[table_index]


def read_ishares_holdings_csv(url: str) -> pd.DataFrame:
    response = requests.get(url, headers=WIKI_HEADERS, timeout=30)
    response.raise_for_status()
    text = response.text.lstrip("\ufeff")
    lines = text.splitlines()
    header_index = next((index for index, line in enumerate(lines) if line.startswith("Ticker,")), None)
    if header_index is None:
        blackrock_frame = read_blackrock_fund_download_holdings("239710")
        if not blackrock_frame.empty:
            print("Using BlackRock fund download holdings for Russell 2000 membership.")
            return blackrock_frame
        fallback = read_existing_universe("russell2000")
        if not fallback.empty:
            print("Unable to locate IWM holdings CSV header; using existing Russell 2000 membership snapshot.")
            return fallback
        raise RuntimeError("Unable to locate IWM holdings CSV header.")
    payload = "\n".join(lines[header_index:])
    frame = pd.read_csv(StringIO(payload))
    return frame[frame["Asset Class"].fillna("").eq("Equity")].copy()


def read_blackrock_fund_download_holdings(portfolio_id: str) -> pd.DataFrame:
    url = (
        "https://www.blackrock.com/varnish-api/blk-one01-product-data/product-data/api/v1/get-fund-document"
        f"?appType=PRODUCT_PAGE&appSubType=ISHARES&targetSite=us-ishares&locale=en_US&portfolioId={portfolio_id}"
        "&component=fundDownload&userType=individual"
    )
    try:
        response = requests.get(url, headers=WIKI_HEADERS, timeout=60)
        response.raise_for_status()
    except Exception as error:
        print(f"Unable to download BlackRock fund holdings document: {error}")
        return pd.DataFrame(columns=["Ticker", "Name", "Asset Class"])

    xml_text = response.content.decode("utf-8", errors="replace")
    xml_text = re.sub(r"&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9A-Fa-f]+;)", "&amp;", xml_text)
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError as error:
        print(f"Unable to parse BlackRock fund holdings document: {error}")
        return pd.DataFrame(columns=["Ticker", "Name", "Asset Class"])

    namespace = {"ss": "urn:schemas-microsoft-com:office:spreadsheet"}
    holdings_sheet = None
    for worksheet in root.findall("ss:Worksheet", namespace):
        if worksheet.attrib.get(f"{{{namespace['ss']}}}Name") == "Holdings":
            holdings_sheet = worksheet
            break
    if holdings_sheet is None:
        return pd.DataFrame(columns=["Ticker", "Name", "Asset Class"])

    rows: list[list[str]] = []
    for row in holdings_sheet.findall(".//ss:Row", namespace):
        values = []
        for cell in row.findall("ss:Cell", namespace):
            data = cell.find("ss:Data", namespace)
            values.append((data.text or "").strip() if data is not None else "")
        rows.append(values)

    header_index = next((index for index, row in enumerate(rows) if row[:4] == ["Ticker", "Name", "Sector", "Asset Class"]), None)
    if header_index is None:
        return pd.DataFrame(columns=["Ticker", "Name", "Asset Class"])

    header = rows[header_index]
    data_rows = [row for row in rows[header_index + 1 :] if row and row[0]]
    normalized_rows = [(row + [""] * len(header))[: len(header)] for row in data_rows]
    frame = pd.DataFrame(normalized_rows, columns=header)
    if "Asset Class" not in frame.columns:
        return pd.DataFrame(columns=["Ticker", "Name", "Asset Class"])
    return frame[frame["Asset Class"].fillna("").eq("Equity")].copy()


def load_existing_payload() -> dict:
    if not OUTPUT_PATH.exists():
        return {}
    text = OUTPUT_PATH.read_text(encoding="utf-8").strip()
    prefix = "window.marketRsData = "
    if text.startswith(prefix):
        text = text[len(prefix):]
    if text.endswith(";"):
        text = text[:-1]
    try:
        return json.loads(text)
    except Exception:
        return {}


def read_existing_universe(universe_key: str) -> pd.DataFrame:
    rows = []
    for row in load_existing_payload().get("rows", []):
        memberships = row.get("memberships") or {}
        if not memberships.get(universe_key):
            continue
        ticker = normalize_ticker(row.get("ticker"))
        if not ticker or is_terminal_symbol(ticker):
            continue
        rows.append(
            {
                "Ticker": ticker,
                "Name": row.get("name") or ticker,
                "Asset Class": "Equity",
            }
        )
    if not rows:
        return pd.DataFrame(columns=["Ticker", "Name", "Asset Class"])
    return pd.DataFrame(rows).drop_duplicates(subset=["Ticker"])


def usable_universe_member_count(frame: pd.DataFrame, ticker_col: str) -> int:
    if ticker_col not in frame.columns:
        return 0
    return len(
        {
            normalize_ticker(value)
            for value in frame[ticker_col].tolist()
            if normalize_ticker(value) and not is_terminal_symbol(normalize_ticker(value))
        }
    )


def read_universe_fallback(universe_key: str, ticker_col: str, name_col: str) -> pd.DataFrame:
    fallback = read_existing_universe(universe_key)
    if len(fallback) < MIN_UNIVERSE_MEMBERS[universe_key] and universe_key == "dowjones":
        fallback = pd.DataFrame(DOW_JONES_FALLBACK, columns=["Ticker", "Name"])
    if len(fallback) < MIN_UNIVERSE_MEMBERS[universe_key]:
        return pd.DataFrame(columns=[ticker_col, name_col])
    return fallback.rename(columns={"Ticker": ticker_col, "Name": name_col})[[ticker_col, name_col]]


def read_nasdaq100_snapshot() -> pd.DataFrame:
    if not NASDAQ100_SNAPSHOT_PATH.exists():
        return pd.DataFrame(columns=["Ticker", "Name"])
    try:
        payload = json.loads(NASDAQ100_SNAPSHOT_PATH.read_text(encoding="utf-8"))
        frame = pd.DataFrame(payload.get("rows") or [])
    except Exception:
        return pd.DataFrame(columns=["Ticker", "Name"])
    if not {"Ticker", "Name"}.issubset(frame.columns) or len(frame) < 90:
        return pd.DataFrame(columns=["Ticker", "Name"])
    return frame[["Ticker", "Name"]].copy()


def write_nasdaq100_snapshot(frame: pd.DataFrame, source_date: str | None) -> None:
    rows = [
        {"Ticker": str(row["Ticker"]), "Name": str(row["Name"])}
        for _, row in frame[["Ticker", "Name"]].sort_values("Ticker").iterrows()
    ]
    payload = {
        "updatedAt": source_date or datetime.now(timezone.utc).date().isoformat(),
        "source": UNIVERSES["nasdaq100"]["url"],
        "rows": rows,
    }
    NASDAQ100_SNAPSHOT_PATH.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
        newline="\n",
    )


def read_nasdaq100_constituents(url: str) -> pd.DataFrame:
    last_error: Exception | None = None
    for attempt in range(1, 4):
        try:
            response = requests.get(url, headers=WIKI_HEADERS, timeout=30)
            response.raise_for_status()
            payload = response.json()
            data = payload.get("data") or {}
            rows = ((data.get("data") or {}).get("rows") or [])
            frame = pd.DataFrame(rows).rename(columns={"symbol": "Ticker", "companyName": "Name"})
            if not {"Ticker", "Name"}.issubset(frame.columns) or len(frame) < 90:
                raise RuntimeError(f"Nasdaq API returned only {len(frame)} usable rows.")
            frame = frame[["Ticker", "Name"]].copy()
            write_nasdaq100_snapshot(frame, str(data.get("date") or ""))
            return frame
        except Exception as error:
            last_error = error
            if attempt < 3:
                time.sleep(attempt * 2)

    snapshot = read_nasdaq100_snapshot()
    if not snapshot.empty:
        print(f"Unable to refresh Nasdaq-100 membership; using local source snapshot: {last_error}")
        return snapshot
    fallback = read_existing_universe("nasdaq100")
    if not fallback.empty:
        print(f"Unable to refresh Nasdaq-100 membership; using existing RS snapshot: {last_error}")
        return fallback
    raise RuntimeError(f"Unable to load Nasdaq-100 membership: {last_error}") from last_error


def fetch_universe_frame() -> pd.DataFrame:
    merged: dict[str, dict[str, object]] = {}
    for key, meta in UNIVERSES.items():
        ticker_col = str(meta["ticker_col"])
        name_col = str(meta["name_col"])
        source_error: Exception | None = None
        try:
            if meta.get("source") == "nasdaq_api":
                table = read_nasdaq100_constituents(str(meta["url"]))
            elif meta.get("source") == "csv":
                table = read_ishares_holdings_csv(str(meta["url"]))
            else:
                table = read_wiki_table(str(meta["url"]), int(meta["table_index"]))
        except Exception as error:
            source_error = error
            table = pd.DataFrame(columns=[ticker_col, name_col])

        if usable_universe_member_count(table, ticker_col) < MIN_UNIVERSE_MEMBERS[key]:
            fallback = read_universe_fallback(key, ticker_col, name_col)
            if fallback.empty:
                detail = f": {source_error}" if source_error else ""
                raise RuntimeError(f"Unable to load a usable {meta['label']} membership source{detail}")
            print(f"Using stored {meta['label']} membership fallback ({len(fallback)} names).")
            table = fallback
        for _, row in table.iterrows():
            ticker = normalize_ticker(row.get(ticker_col, ""))
            if ticker in SOURCE_PLACEHOLDER_TICKERS or is_terminal_symbol(ticker):
                continue
            item = merged.setdefault(
                ticker,
                {
                    "ticker": ticker,
                    "name": str(row.get(name_col, ticker)).strip(),
                    "member_sp500": False,
                    "member_nasdaq100": False,
                    "member_dowjones": False,
                    "member_russell2000": False,
                },
            )
            item["name"] = str(row.get(name_col, item["name"])).strip()
            item[f"member_{key}"] = True
    for manual_member in get_manual_universe_members():
        ticker = normalize_ticker(manual_member["ticker"])
        if not ticker or is_terminal_symbol(ticker):
            continue
        item = merged.setdefault(
            ticker,
            {
                "ticker": ticker,
                "name": str(manual_member.get("name") or ticker).strip(),
                "member_sp500": False,
                "member_nasdaq100": False,
                "member_dowjones": False,
                "member_russell2000": False,
            },
        )
        item["name"] = str(manual_member.get("name") or item["name"]).strip()
        for universe_key in UNIVERSES:
            member_key = f"member_{universe_key}"
            item[member_key] = bool(manual_member.get(member_key, item[member_key]))
    return pd.DataFrame(merged.values()).sort_values("ticker").reset_index(drop=True)


def download_batch(
    symbols: list[str],
    period: str = PRICE_PERIOD,
    retry_missing: bool = True,
) -> tuple[
    dict[str, pd.Series],
    dict[str, pd.Series],
    dict[str, pd.Series],
    dict[str, pd.Series],
    dict[str, pd.Series],
    dict[str, pd.Series],
]:
    symbols = [symbol for symbol in symbols if not is_terminal_symbol(symbol)]
    if not symbols:
        return {}, {}, {}, {}, {}, {}
    history = yf.download(
        tickers=symbols,
        period=period,
        auto_adjust=False,
        progress=False,
        threads=False,
        group_by="ticker",
    )
    if history.empty:
        return {}, {}, {}, {}, {}, {}

    raw_close_map: dict[str, pd.Series] = {}
    adjusted_close_map: dict[str, pd.Series] = {}
    open_map: dict[str, pd.Series] = {}
    high_map: dict[str, pd.Series] = {}
    low_map: dict[str, pd.Series] = {}
    volume_map: dict[str, pd.Series] = {}
    multi = isinstance(history.columns, pd.MultiIndex)
    for symbol in symbols:
        try:
            symbol_frame = history[symbol] if multi else history
        except KeyError:
            continue
        open_price = symbol_frame.get("Open")
        raw_close = symbol_frame.get("Close")
        adjusted_close = symbol_frame.get("Adj Close", raw_close)
        high = symbol_frame.get("High")
        low = symbol_frame.get("Low")
        volume = symbol_frame.get("Volume")
        if open_price is None or raw_close is None or adjusted_close is None or high is None or low is None or volume is None:
            continue
        open_price = open_price.dropna()
        raw_close = raw_close.dropna()
        adjusted_close = adjusted_close.dropna()
        high = high.dropna()
        low = low.dropna()
        volume = volume.dropna()
        if open_price.empty or raw_close.empty or adjusted_close.empty or high.empty or low.empty or volume.empty:
            continue
        open_map[symbol] = open_price.rename(symbol)
        raw_close_map[symbol] = raw_close.rename(symbol)
        adjusted_close_map[symbol] = adjusted_close.rename(symbol)
        high_map[symbol] = high.rename(symbol)
        low_map[symbol] = low.rename(symbol)
        volume_map[symbol] = volume.rename(symbol)
    missing = [
        symbol
        for symbol in symbols
        if (
            symbol not in open_map
            or symbol not in raw_close_map
            or symbol not in adjusted_close_map
            or symbol not in high_map
            or symbol not in low_map
            or symbol not in volume_map
        )
    ]
    if not retry_missing:
        return raw_close_map, adjusted_close_map, open_map, high_map, low_map, volume_map
    for symbol in missing:
        if is_terminal_symbol(symbol):
            continue
        for attempt in range(RETRY_ATTEMPTS):
            try:
                single = yf.download(
                    tickers=symbol,
                    period=period,
                    auto_adjust=False,
                    progress=False,
                    threads=False,
                )
                if (
                    single.empty
                    or "Open" not in single.columns
                    or "Close" not in single.columns
                    or "High" not in single.columns
                    or "Low" not in single.columns
                    or "Volume" not in single.columns
                ):
                    time.sleep(RETRY_SLEEP)
                    continue
                open_price = single["Open"].dropna()
                raw_close = single["Close"].dropna()
                adjusted_close = single["Adj Close"].dropna() if "Adj Close" in single.columns else raw_close
                high = single["High"].dropna()
                low = single["Low"].dropna()
                volume = single["Volume"].dropna()
                if open_price.empty or raw_close.empty or adjusted_close.empty or high.empty or low.empty or volume.empty:
                    time.sleep(RETRY_SLEEP)
                    continue
                open_map[symbol] = open_price.rename(symbol)
                raw_close_map[symbol] = raw_close.rename(symbol)
                adjusted_close_map[symbol] = adjusted_close.rename(symbol)
                high_map[symbol] = high.rename(symbol)
                low_map[symbol] = low.rename(symbol)
                volume_map[symbol] = volume.rename(symbol)
                break
            except Exception:
                time.sleep(RETRY_SLEEP)
    return raw_close_map, adjusted_close_map, open_map, high_map, low_map, volume_map


def fetch_price_frames(
    symbols: list[str],
    batch_size: int = BATCH_SIZE,
    allow_empty: bool = False,
    period: str = PRICE_PERIOD,
    retry_missing: bool = True,
) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    raw_close_map: dict[str, pd.Series] = {}
    adjusted_close_map: dict[str, pd.Series] = {}
    open_map: dict[str, pd.Series] = {}
    high_map: dict[str, pd.Series] = {}
    low_map: dict[str, pd.Series] = {}
    volume_map: dict[str, pd.Series] = {}
    batches = [symbols[start : start + batch_size] for start in range(0, len(symbols), batch_size)]
    if BATCH_WORKERS == 1 or len(batches) == 1:
        batch_results = (download_batch(batch, period, retry_missing) for batch in batches)
        for (
            batch_raw_close_map,
            batch_adjusted_close_map,
            batch_open_map,
            batch_high_map,
            batch_low_map,
            batch_volume_map,
        ) in batch_results:
            raw_close_map.update(batch_raw_close_map)
            adjusted_close_map.update(batch_adjusted_close_map)
            open_map.update(batch_open_map)
            high_map.update(batch_high_map)
            low_map.update(batch_low_map)
            volume_map.update(batch_volume_map)
            time.sleep(BATCH_SLEEP)
    else:
        # Parallel batches avoid turning a full RS refresh into hundreds of serial Yahoo requests.
        with ThreadPoolExecutor(max_workers=min(BATCH_WORKERS, len(batches))) as executor:
            futures = [executor.submit(download_batch, batch, period, retry_missing) for batch in batches]
            for future in as_completed(futures):
                (
                    batch_raw_close_map,
                    batch_adjusted_close_map,
                    batch_open_map,
                    batch_high_map,
                    batch_low_map,
                    batch_volume_map,
                ) = future.result()
                raw_close_map.update(batch_raw_close_map)
                adjusted_close_map.update(batch_adjusted_close_map)
                open_map.update(batch_open_map)
                high_map.update(batch_high_map)
                low_map.update(batch_low_map)
                volume_map.update(batch_volume_map)
    if not raw_close_map or not adjusted_close_map or not open_map or not high_map or not low_map or not volume_map:
        if allow_empty:
            return pd.DataFrame(), pd.DataFrame(), pd.DataFrame(), pd.DataFrame(), pd.DataFrame(), pd.DataFrame()
        raise RuntimeError("No price data downloaded for RS universe.")
    raw_close_frame = pd.concat(raw_close_map.values(), axis=1).sort_index()
    adjusted_close_frame = pd.concat(adjusted_close_map.values(), axis=1).sort_index()
    open_frame = pd.concat(open_map.values(), axis=1).sort_index()
    high_frame = pd.concat(high_map.values(), axis=1).sort_index()
    low_frame = pd.concat(low_map.values(), axis=1).sort_index()
    volume_frame = pd.concat(volume_map.values(), axis=1).sort_index()
    return raw_close_frame, adjusted_close_frame, open_frame, high_frame, low_frame, volume_frame


def fill_closed_session_close_gaps_from_spark(
    symbols: list[str],
    raw_close_frame: pd.DataFrame,
    adjusted_close_frame: pd.DataFrame,
    open_frame: pd.DataFrame,
    high_frame: pd.DataFrame,
    low_frame: pd.DataFrame,
) -> tuple[pd.DataFrame, pd.DataFrame]:
    session_indexes = [
        frame.dropna(how="all").index.max()
        for frame in (open_frame, high_frame, low_frame)
        if not frame.empty and not frame.dropna(how="all").empty
    ]
    if not session_indexes:
        return raw_close_frame, adjusted_close_frame
    target_date = max(session_indexes)
    candidates = []
    for symbol in symbols:
        if symbol not in open_frame.columns or symbol not in high_frame.columns or symbol not in low_frame.columns:
            continue
        session_values = (
            open_frame.at[target_date, symbol] if target_date in open_frame.index else None,
            high_frame.at[target_date, symbol] if target_date in high_frame.index else None,
            low_frame.at[target_date, symbol] if target_date in low_frame.index else None,
        )
        if not all(pd.notna(value) for value in session_values):
            continue
        current_close = (
            raw_close_frame.at[target_date, symbol]
            if target_date in raw_close_frame.index and symbol in raw_close_frame.columns
            else None
        )
        if pd.isna(current_close):
            candidates.append(symbol)
    if not candidates:
        return raw_close_frame, adjusted_close_frame

    filled = 0
    for start in range(0, len(candidates), SPARK_BATCH_SIZE):
        batch = candidates[start : start + SPARK_BATCH_SIZE]
        try:
            response = requests.get(
                "https://query1.finance.yahoo.com/v7/finance/spark",
                params={"symbols": ",".join(batch), "range": "5d", "interval": "1d"},
                headers=WIKI_HEADERS,
                timeout=60,
            )
            response.raise_for_status()
            results = response.json().get("spark", {}).get("result", [])
        except Exception as error:
            print(f"Unable to fetch Yahoo Spark close fallback batch: {error}", flush=True)
            continue

        for result in results:
            symbol = normalize_ticker(result.get("symbol"))
            payloads = result.get("response") or []
            if not symbol or not payloads:
                continue
            meta = payloads[0].get("meta") or {}
            market_time = safe_float(meta.get("regularMarketTime"))
            market_price = safe_float(meta.get("regularMarketPrice"))
            if market_time is None or market_price is None or market_price <= 0:
                continue
            timezone_name = str(meta.get("exchangeTimezoneName") or "America/New_York")
            try:
                local_market_time = pd.to_datetime(int(market_time), unit="s", utc=True).tz_convert(timezone_name)
            except Exception:
                continue
            if (local_market_time.hour, local_market_time.minute) < (15, 59):
                continue
            market_date = local_market_time.tz_localize(None).normalize()
            if market_date != pd.Timestamp(target_date).normalize():
                continue
            raw_close_frame.at[target_date, symbol] = market_price
            adjusted_close_frame.at[target_date, symbol] = market_price
            filled += 1

    if filled:
        raw_close_frame = raw_close_frame.sort_index()
        adjusted_close_frame = adjusted_close_frame.sort_index()
        print(
            f"Filled {filled} finalized {target_date:%Y-%m-%d} closes from Yahoo Spark regularMarketPrice.",
            flush=True,
        )
    return raw_close_frame, adjusted_close_frame


def fetch_finalized_daily_ohlcv(
    symbol: str,
    target_date: pd.Timestamp,
) -> tuple[str, dict[str, float]] | None:
    encoded_symbol = requests.utils.quote(symbol, safe="")
    target_date = pd.Timestamp(target_date).normalize()
    for attempt in range(2):
        try:
            response = requests.get(
                f"https://query1.finance.yahoo.com/v8/finance/chart/{encoded_symbol}",
                params={"range": "5d", "interval": "1d", "events": "div,splits"},
                headers=WIKI_HEADERS,
                timeout=30,
            )
            response.raise_for_status()
            result = (response.json().get("chart", {}).get("result") or [None])[0]
            if not result:
                return None
            meta = result.get("meta") or {}
            timezone_name = str(meta.get("exchangeTimezoneName") or "America/New_York")
            market_time = safe_float(meta.get("regularMarketTime"))
            if market_time is not None:
                local_market_time = pd.to_datetime(int(market_time), unit="s", utc=True).tz_convert(timezone_name)
                local_market_date = local_market_time.tz_localize(None).normalize()
                if local_market_date < target_date or (
                    local_market_date == target_date
                    and (local_market_time.hour, local_market_time.minute) < (15, 59)
                ):
                    return None

            timestamps = result.get("timestamp") or []
            quote = ((result.get("indicators") or {}).get("quote") or [{}])[0]
            adjusted = ((result.get("indicators") or {}).get("adjclose") or [{}])[0].get("adjclose") or []
            for index, timestamp in enumerate(timestamps):
                local_date = (
                    pd.to_datetime(int(timestamp), unit="s", utc=True)
                    .tz_convert(timezone_name)
                    .tz_localize(None)
                    .normalize()
                )
                if local_date != target_date:
                    continue
                values = {
                    "open": safe_float((quote.get("open") or [])[index]),
                    "high": safe_float((quote.get("high") or [])[index]),
                    "low": safe_float((quote.get("low") or [])[index]),
                    "close": safe_float((quote.get("close") or [])[index]),
                    "volume": safe_float((quote.get("volume") or [])[index]),
                }
                if not all(values[key] is not None and values[key] > 0 for key in ("open", "high", "low", "close")):
                    return None
                values["adjusted_close"] = (
                    safe_float(adjusted[index]) if index < len(adjusted) else values["close"]
                ) or values["close"]
                return symbol, values
            return None
        except Exception:
            if attempt == 0:
                time.sleep(0.35)
    return None


def fill_closed_session_ohlcv_gaps_from_chart(
    symbols: list[str],
    raw_close_frame: pd.DataFrame,
    adjusted_close_frame: pd.DataFrame,
    open_frame: pd.DataFrame,
    high_frame: pd.DataFrame,
    low_frame: pd.DataFrame,
    volume_frame: pd.DataFrame,
) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    available_dates = [
        frame.dropna(how="all").index.max()
        for frame in (raw_close_frame, open_frame, high_frame, low_frame)
        if not frame.empty and not frame.dropna(how="all").empty
    ]
    if not available_dates:
        return raw_close_frame, adjusted_close_frame, open_frame, high_frame, low_frame, volume_frame
    target_date = max(available_dates)

    def missing(frame: pd.DataFrame, symbol: str) -> bool:
        return (
            target_date not in frame.index
            or symbol not in frame.columns
            or pd.isna(frame.at[target_date, symbol])
        )

    candidates = [
        symbol
        for symbol in symbols
        if not is_terminal_symbol(symbol)
        and any(missing(frame, symbol) for frame in (raw_close_frame, open_frame, high_frame, low_frame, volume_frame))
    ]
    if not candidates:
        return raw_close_frame, adjusted_close_frame, open_frame, high_frame, low_frame, volume_frame

    results: list[tuple[str, dict[str, float]]] = []
    with ThreadPoolExecutor(max_workers=min(OHLC_FALLBACK_WORKERS, len(candidates))) as executor:
        futures = [executor.submit(fetch_finalized_daily_ohlcv, symbol, target_date) for symbol in candidates]
        for future in as_completed(futures):
            result = future.result()
            if result:
                results.append(result)

    frame_values = (
        (raw_close_frame, "close"),
        (adjusted_close_frame, "adjusted_close"),
        (open_frame, "open"),
        (high_frame, "high"),
        (low_frame, "low"),
        (volume_frame, "volume"),
    )
    for symbol, values in results:
        for frame, key in frame_values:
            frame.at[target_date, symbol] = values[key]

    print(
        f"Filled finalized {target_date:%Y-%m-%d} OHLCV for {len(results)} / {len(candidates)} gap symbols from Yahoo Chart.",
        flush=True,
    )
    return (
        raw_close_frame.sort_index(),
        adjusted_close_frame.sort_index(),
        open_frame.sort_index(),
        high_frame.sort_index(),
        low_frame.sort_index(),
        volume_frame.sort_index(),
    )


def ensure_symbol_price_frames(
    symbols: list[str],
    raw_close_frame: pd.DataFrame,
    adjusted_close_frame: pd.DataFrame,
    open_frame: pd.DataFrame,
    high_frame: pd.DataFrame,
    low_frame: pd.DataFrame,
    volume_frame: pd.DataFrame,
) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    missing = [symbol for symbol in symbols if symbol not in raw_close_frame.columns]
    if not missing:
        return raw_close_frame, adjusted_close_frame, open_frame, high_frame, low_frame, volume_frame

    raw_map, adjusted_map, open_map, high_map, low_map, volume_map = fetch_price_frames(
        missing,
        batch_size=1,
        allow_empty=True,
    )
    for symbol in missing:
        if symbol in raw_map:
            raw_close_frame[symbol] = raw_map[symbol]
        if symbol in adjusted_map:
            adjusted_close_frame[symbol] = adjusted_map[symbol]
        if symbol in open_map:
            open_frame[symbol] = open_map[symbol]
        if symbol in high_map:
            high_frame[symbol] = high_map[symbol]
        if symbol in low_map:
            low_frame[symbol] = low_map[symbol]
        if symbol in volume_map:
            volume_frame[symbol] = volume_map[symbol]

    unresolved = [symbol for symbol in missing if symbol not in raw_map.columns]
    if unresolved:
        print(
            "No fresh Yahoo price data for manual symbols; existing history will be used when available: "
            + ", ".join(unresolved),
            flush=True,
        )

    return (
        raw_close_frame.sort_index(),
        adjusted_close_frame.sort_index(),
        open_frame.sort_index(),
        high_frame.sort_index(),
        low_frame.sort_index(),
        volume_frame.sort_index(),
    )


def restore_existing_history_gaps(
    raw_close_frame: pd.DataFrame,
    adjusted_close_frame: pd.DataFrame,
    open_frame: pd.DataFrame,
    high_frame: pd.DataFrame,
    low_frame: pd.DataFrame,
    volume_frame: pd.DataFrame,
) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    existing = load_existing_payload()
    history_dates = existing.get("historyDates") or []
    histories = existing.get("histories") or {}
    if not history_dates or not histories:
        return raw_close_frame, adjusted_close_frame, open_frame, high_frame, low_frame, volume_frame

    price_frames = {
        "price": raw_close_frame,
        "open": open_frame,
        "high": high_frame,
        "low": low_frame,
        "volume": volume_frame,
    }
    restored = 0
    for ticker, history in histories.items():
        ticker = normalize_ticker(ticker)
        if ticker not in raw_close_frame.columns:
            continue
        existing_prices = history.get("price") or []
        for index, date_label in enumerate(history_dates):
            timestamp = pd.Timestamp(date_label)
            if timestamp not in raw_close_frame.index:
                continue
            existing_price = safe_float(existing_prices[index]) if index < len(existing_prices) else None
            if existing_price is not None and (
                ticker in adjusted_close_frame.columns
                and (pd.isna(adjusted_close_frame.at[timestamp, ticker]))
            ):
                adjusted_close_frame.at[timestamp, ticker] = existing_price
                restored += 1
            for key, frame in price_frames.items():
                values = history.get(key) or []
                if index >= len(values) or ticker not in frame.columns:
                    continue
                existing_value = safe_float(values[index])
                if existing_value is None or not pd.isna(frame.at[timestamp, ticker]):
                    continue
                frame.at[timestamp, ticker] = existing_value
                restored += 1
    if restored:
        print(f"Restored {restored} missing OHLCV points from existing market RS history.")
    return raw_close_frame, adjusted_close_frame, open_frame, high_frame, low_frame, volume_frame


def merge_existing_history_window(
    raw_close_frame: pd.DataFrame,
    adjusted_close_frame: pd.DataFrame,
    open_frame: pd.DataFrame,
    high_frame: pd.DataFrame,
    low_frame: pd.DataFrame,
    volume_frame: pd.DataFrame,
) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """Keep the saved 2025+ chart history while refreshing only recent sessions."""
    existing = load_existing_payload()
    history_dates = existing.get("historyDates") or []
    histories = existing.get("histories") or {}
    if not history_dates or not histories:
        return raw_close_frame, adjusted_close_frame, open_frame, high_frame, low_frame, volume_frame

    date_index = pd.Index(pd.to_datetime(history_dates), name="Date")

    def stored_frame(key: str) -> pd.DataFrame:
        series_map: dict[str, pd.Series] = {}
        for ticker, history in histories.items():
            values = history.get(key) or []
            if not values:
                continue
            tail_values = values[-len(date_index) :]
            tail_index = date_index[-len(tail_values) :]
            series_map[normalize_ticker(ticker)] = pd.Series(tail_values, index=tail_index, dtype="float64")
        return pd.concat(series_map, axis=1) if series_map else pd.DataFrame()

    def merge(fresh: pd.DataFrame, key: str) -> pd.DataFrame:
        stored = stored_frame(key)
        if stored.empty:
            return fresh.sort_index()
        # Fresh Yahoo values supersede the cached range; the saved 2025+
        # history supplies the rolling lookback without a large daily download.
        return fresh.combine_first(stored).sort_index()

    raw_close_frame = merge(raw_close_frame, "price")
    # The serialized chart line is raw close.  The current two-year Yahoo pull
    # supplies adjusted close for every RS return lookback; pre-window values
    # only preserve the visual history.
    adjusted_close_frame = merge(adjusted_close_frame, "price")
    open_frame = merge(open_frame, "open")
    high_frame = merge(high_frame, "high")
    low_frame = merge(low_frame, "low")
    volume_frame = merge(volume_frame, "volume")
    return raw_close_frame, adjusted_close_frame, open_frame, high_frame, low_frame, volume_frame


def load_existing_rows() -> dict[str, dict[str, object]]:
    if not OUTPUT_PATH.exists():
        return {}
    text = OUTPUT_PATH.read_text(encoding="utf-8")
    payload = json.loads(re.sub(r"^window\.marketRsData = |;\s*$", "", text))
    return {row["ticker"]: row for row in payload.get("rows", [])}


def normalize_positive_int(value: object) -> int | None:
    try:
        numeric = float(value)
    except Exception:
        return None
    if not math.isfinite(numeric) or numeric <= 0:
        return None
    return int(numeric)


def safe_float(value: object) -> float | None:
    try:
        numeric = float(value)
    except Exception:
        return None
    if not math.isfinite(numeric):
        return None
    return numeric


def fetch_shares_outstanding_for_symbol(symbol: str) -> tuple[str, int | None]:
    try:
        ticker = yf.Ticker(symbol)
        fast_info = getattr(ticker, "fast_info", {}) or {}
        shares = normalize_positive_int(fast_info.get("shares"))
        if shares:
            return symbol, shares
        market_cap = normalize_positive_int(fast_info.get("market_cap") or fast_info.get("marketCap"))
        price = safe_float(
            fast_info.get("last_price")
            or fast_info.get("lastPrice")
            or fast_info.get("regular_market_price")
            or fast_info.get("regularMarketPrice")
        )
        if market_cap and price and price > 0:
            inferred_shares = normalize_positive_int(market_cap / price)
            if inferred_shares:
                return symbol, inferred_shares

        info = ticker.get_info()
        shares = normalize_positive_int(
            info.get("sharesOutstanding") or info.get("impliedSharesOutstanding")
        )
        if shares:
            return symbol, shares
        market_cap = normalize_positive_int(info.get("marketCap"))
        price = safe_float(info.get("currentPrice") or info.get("regularMarketPrice") or info.get("previousClose"))
        if market_cap and price and price > 0:
            inferred_shares = normalize_positive_int(market_cap / price)
            if inferred_shares:
                return symbol, inferred_shares
    except Exception:
        return symbol, None
    return symbol, None


def detect_share_refresh_symbols(
    symbols: list[str],
    existing_rows: dict[str, dict[str, object]],
    raw_close_frame: pd.DataFrame,
) -> list[str]:
    refresh: list[str] = []
    for symbol in symbols:
        row = existing_rows.get(symbol)
        if not row or symbol not in raw_close_frame.columns:
            continue
        previous_price = safe_float(row.get("price"))
        prices = raw_close_frame[symbol].dropna()
        if previous_price is None or previous_price <= 0 or prices.empty:
            continue
        latest_price = safe_float(prices.iloc[-1])
        if latest_price is None or latest_price <= 0:
            continue
        price_ratio = latest_price / previous_price
        if price_ratio < SHARES_REFRESH_RATIO_LOW or price_ratio > SHARES_REFRESH_RATIO_HIGH:
            refresh.append(symbol)
    if refresh:
        print(
            "Refreshing shares after possible split-like price moves: "
            + ", ".join(refresh),
            flush=True,
        )
    return refresh


def build_shares_cache(
    symbols: list[str],
    existing_rows: dict[str, dict[str, object]],
    refresh_symbols: list[str] | None = None,
) -> dict[str, int | None]:
    cache: dict[str, int | None] = {}
    manual_shares_outstanding = get_manual_shares_outstanding()
    for symbol in symbols:
        manual_shares = manual_shares_outstanding.get(symbol)
        if manual_shares:
            cache[symbol] = manual_shares
    for symbol in symbols:
        if symbol in cache:
            continue
        if symbol not in existing_rows:
            continue
        row = existing_rows[symbol]
        shares = row.get("sharesOutstanding")
        if shares:
            try:
                numeric = int(float(shares))
                if numeric > 0:
                    cache[symbol] = numeric
                    continue
            except Exception:
                pass

        # Fallback: infer shares from the last known market cap / price so daily market-cap
        # refresh can keep running even if Yahoo blocks quote fundamentals.
        market_cap = row.get("marketCap")
        price = row.get("price")
        try:
            if market_cap and price and float(price) > 0 and float(market_cap) > 0:
                inferred = int(round(float(market_cap) / float(price)))
                if inferred > 0:
                    cache[symbol] = inferred
        except Exception:
            continue

    refresh_set = set(refresh_symbols or [])
    fetch_symbols = list(
        dict.fromkeys(
            [symbol for symbol in symbols if symbol in refresh_set]
            + [symbol for symbol in symbols if symbol not in cache]
        )
    )[:MAX_SHARES_FETCH]
    if not fetch_symbols:
        return cache

    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = {
            executor.submit(fetch_shares_outstanding_for_symbol, symbol): symbol
            for symbol in fetch_symbols
        }
        for future in as_completed(futures):
            symbol, shares = future.result()
            if shares:
                cache[symbol] = shares
            elif symbol not in cache:
                cache[symbol] = None
    return cache


def percentile_to_rating(frame: pd.DataFrame) -> pd.DataFrame:
    valid_counts = frame.notna().sum(axis=1)
    ranks = frame.rank(axis=1, method="average", ascending=False)
    denominator = (valid_counts - 1).replace(0, 1)
    rating = 99 - (ranks.sub(1, axis=0)).mul(98).div(denominator, axis=0)
    rating = rating.where(frame.notna())
    single_name_mask = valid_counts <= 1
    if single_name_mask.any():
        rating.loc[single_name_mask] = frame.loc[single_name_mask].notna().astype(float) * 99
    return rating.round().clip(lower=1, upper=99)


def cross_sectional_percentile(frame: pd.DataFrame) -> pd.DataFrame:
    valid_counts = frame.notna().sum(axis=1)
    ranks = frame.rank(axis=1, method="average", ascending=True)
    denominator = (valid_counts - 1).replace(0, 1)
    percentile = ranks.sub(1, axis=0).div(denominator, axis=0)
    percentile = percentile.where(frame.notna())
    single_name_mask = valid_counts <= 1
    if single_name_mask.any():
        percentile.loc[single_name_mask] = frame.loc[single_name_mask].notna().astype(float)
    return percentile.clip(lower=0, upper=1)


def weighted_rs_rating(period_ratings: dict[str, pd.DataFrame]) -> pd.DataFrame:
    first = next(iter(period_ratings.values()))
    weighted_sum = pd.DataFrame(0.0, index=first.index, columns=first.columns)
    weight_sum = pd.DataFrame(0.0, index=first.index, columns=first.columns)

    for period_key, weight in RS_WEIGHTS.items():
        component = period_ratings[period_key]
        weighted_sum = weighted_sum.add(component.fillna(0).mul(weight), fill_value=0)
        weight_sum = weight_sum.add(component.notna().astype(float).mul(weight), fill_value=0)

    return weighted_sum.div(weight_sum.where(weight_sum > 0)).round().clip(lower=1, upper=99)


def build_period_rs_ratings(close_frame: pd.DataFrame) -> dict[str, pd.DataFrame]:
    return {
        "1w": percentile_to_rating(close_frame.div(close_frame.shift(LOOKBACKS["1w"])).sub(1)),
        "2w": percentile_to_rating(close_frame.div(close_frame.shift(LOOKBACKS["2w"])).sub(1)),
        "1m": percentile_to_rating(close_frame.div(close_frame.shift(LOOKBACKS["1m"])).sub(1)),
        "3m": percentile_to_rating(close_frame.div(close_frame.shift(LOOKBACKS["3m"])).sub(1)),
        "6m": percentile_to_rating(close_frame.div(close_frame.shift(LOOKBACKS["6m"])).sub(1)),
        "12m": percentile_to_rating(close_frame.div(close_frame.shift(LOOKBACKS["12m"])).sub(1)),
    }


def compute_return(series: pd.Series, periods: int) -> float | None:
    if len(series) <= periods:
        return None
    current = series.iloc[-1]
    base = series.iloc[-(periods + 1)]
    if not math.isfinite(current) or not math.isfinite(base) or base == 0:
        return None
    return round((float(current / base) - 1) * 100, 2)


def normalize_line(series: pd.Series) -> list[float | None]:
    first_valid = series.dropna()
    if first_valid.empty:
        return [None for _ in series]
    base = float(first_valid.iloc[0])
    values: list[float | None] = []
    for value in series:
        if value is None or not math.isfinite(value) or base == 0:
            values.append(None)
        else:
            values.append(round(float(value / base) * 100, 2))
    return values


def compute_rating_new_high(series: pd.Series, window: int = LOOKBACKS["12m"]) -> bool:
    recent = series.dropna().tail(window)
    if recent.empty:
        return False
    latest = float(recent.iloc[-1])
    trailing_high = float(recent.max())
    return latest >= trailing_high - 1e-9


def compute_price_new_high(series: pd.Series, window: int = LOOKBACKS["12m"]) -> bool:
    recent = series.dropna().tail(window)
    if recent.empty:
        return False
    latest = float(recent.iloc[-1])
    trailing_high = float(recent.max())
    if not math.isfinite(latest) or not math.isfinite(trailing_high):
        return False
    return latest >= trailing_high - 1e-9


def serialize_price_line(series: pd.Series) -> list[float | None]:
    values: list[float | None] = []
    for value in series:
        if value is None or not math.isfinite(value):
            values.append(None)
        else:
            values.append(round(float(value), 2))
    return values


def serialize_volume_line(series: pd.Series) -> list[int | None]:
    values: list[int | None] = []
    for value in series:
        if value is None or not math.isfinite(value):
            values.append(None)
        else:
            values.append(int(round(float(value))))
    return values


def build_payload(
    universe: pd.DataFrame,
    raw_close_frame: pd.DataFrame,
    adjusted_close_frame: pd.DataFrame,
    open_frame: pd.DataFrame,
    high_frame: pd.DataFrame,
    low_frame: pd.DataFrame,
    volume_frame: pd.DataFrame,
    shares_cache: dict[str, int | None],
) -> dict[str, object]:
    manual_tickers = {
        normalize_ticker(member.get("ticker"))
        for member in get_manual_universe_members()
        if normalize_ticker(member.get("ticker"))
    }
    stock_adjusted_close = adjusted_close_frame.drop(columns=[BENCHMARK_SYMBOL], errors="ignore")
    stock_raw_close = raw_close_frame.drop(columns=[BENCHMARK_SYMBOL], errors="ignore")
    stock_open = open_frame.drop(columns=[BENCHMARK_SYMBOL], errors="ignore")
    stock_high = high_frame.drop(columns=[BENCHMARK_SYMBOL], errors="ignore")
    stock_low = low_frame.drop(columns=[BENCHMARK_SYMBOL], errors="ignore")
    stock_volume = volume_frame.drop(columns=[BENCHMARK_SYMBOL], errors="ignore")
    market_caps: dict[str, int] = {}
    eligible_tickers: list[str] = []
    for _, member in universe.iterrows():
        ticker = str(member["ticker"])
        shares_outstanding = shares_cache.get(ticker)
        if not shares_outstanding or ticker not in stock_raw_close.columns:
            continue
        raw_prices = stock_raw_close[ticker].dropna()
        if raw_prices.empty:
            continue
        latest_price = float(raw_prices.iloc[-1])
        if not math.isfinite(latest_price) or latest_price <= 0:
            continue
        market_cap = round(latest_price * int(shares_outstanding))
        if market_cap <= MIN_MARKET_CAP_USD:
            continue
        market_caps[ticker] = market_cap
        eligible_tickers.append(ticker)

    universe = universe[universe["ticker"].isin(eligible_tickers)].copy().reset_index(drop=True)
    stock_adjusted_close = stock_adjusted_close[[ticker for ticker in eligible_tickers if ticker in stock_adjusted_close.columns]]
    stock_raw_close = stock_raw_close[[ticker for ticker in eligible_tickers if ticker in stock_raw_close.columns]]
    stock_open = stock_open[[ticker for ticker in eligible_tickers if ticker in stock_open.columns]]
    stock_high = stock_high[[ticker for ticker in eligible_tickers if ticker in stock_high.columns]]
    stock_low = stock_low[[ticker for ticker in eligible_tickers if ticker in stock_low.columns]]
    stock_volume = stock_volume[[ticker for ticker in eligible_tickers if ticker in stock_volume.columns]]
    stock_adjusted_close = stock_adjusted_close.ffill(limit=1)
    stock_raw_close = stock_raw_close.ffill(limit=1)
    if stock_adjusted_close.empty or stock_raw_close.empty:
        raise RuntimeError("No RS universe members passed the market-cap filter.")

    period_rs_ratings_all = build_period_rs_ratings(stock_adjusted_close)
    rs_rating_all = weighted_rs_rating(period_rs_ratings_all)

    rs_ratings_by_universe = {"all": rs_rating_all}
    for key in UNIVERSES:
        tickers = [
            ticker
            for ticker in universe.loc[universe[f"member_{key}"], "ticker"].tolist()
            if ticker in stock_adjusted_close.columns
        ]
        if not tickers:
            continue
        subset_period_ratings = build_period_rs_ratings(stock_adjusted_close[tickers])
        rs_ratings_by_universe[key] = weighted_rs_rating(subset_period_ratings)

    latest_date = rs_rating_all.dropna(how="all").index.max()
    if pd.isna(latest_date):
        raise RuntimeError("Unable to compute an RS rating date for the active universe.")

    history_rating_all = rs_rating_all.loc[
        (rs_rating_all.index >= HISTORY_START_DATE) & (rs_rating_all.index <= latest_date)
    ]
    if history_rating_all.empty:
        raise RuntimeError(f"RS history is empty after {HISTORY_START_DATE.date().isoformat()}.")
    history_dates = [date.strftime("%Y-%m-%d") for date in history_rating_all.index]

    rows = []
    histories: dict[str, dict[str, object]] = {}

    for _, member in universe.iterrows():
        ticker = str(member["ticker"])
        if ticker not in stock_adjusted_close.columns or ticker not in stock_raw_close.columns:
            continue
        latest_rating = rs_rating_all.at[latest_date, ticker] if ticker in rs_rating_all.columns else None
        if (latest_rating is None or pd.isna(latest_rating)) and ticker not in manual_tickers:
            continue

        performance_series = stock_adjusted_close[ticker].dropna()
        raw_price_series = stock_raw_close[ticker].dropna()
        current_price = float(raw_price_series.reindex([latest_date]).iloc[0])
        if not math.isfinite(current_price) or current_price <= 0:
            continue
        raw_price_window = stock_raw_close[ticker].reindex(history_rating_all.index)
        open_window = stock_open[ticker].reindex(history_rating_all.index) if ticker in stock_open.columns else pd.Series(index=history_rating_all.index, dtype=float)
        high_window = stock_high[ticker].reindex(history_rating_all.index) if ticker in stock_high.columns else pd.Series(index=history_rating_all.index, dtype=float)
        low_window = stock_low[ticker].reindex(history_rating_all.index) if ticker in stock_low.columns else pd.Series(index=history_rating_all.index, dtype=float)
        volume_window = stock_volume[ticker].reindex(history_rating_all.index) if ticker in stock_volume.columns else pd.Series(index=history_rating_all.index, dtype=float)
        shares_outstanding = shares_cache.get(ticker)
        if shares_outstanding is not None and not isinstance(shares_outstanding, int):
            try:
                if math.isfinite(float(shares_outstanding)) and float(shares_outstanding) > 0:
                    shares_outstanding = int(float(shares_outstanding))
                else:
                    shares_outstanding = None
            except Exception:
                shares_outstanding = None
        market_cap = market_caps.get(ticker)
        if market_cap is None or market_cap <= MIN_MARKET_CAP_USD:
            continue
        rs_rating_sp500_frame = rs_ratings_by_universe.get("sp500", pd.DataFrame())
        rs_rating_nasdaq100_frame = rs_ratings_by_universe.get("nasdaq100", pd.DataFrame())
        rs_rating_dowjones_frame = rs_ratings_by_universe.get("dowjones", pd.DataFrame())
        rs_rating_russell2000_frame = rs_ratings_by_universe.get("russell2000", pd.DataFrame())

        history_all_series = rs_rating_all[ticker] if ticker in rs_rating_all.columns else pd.Series(dtype=float)
        history_sp500_series = (
            rs_rating_sp500_frame[ticker] if ticker in rs_rating_sp500_frame.columns else pd.Series(dtype=float)
        )
        history_nasdaq100_series = (
            rs_rating_nasdaq100_frame[ticker] if ticker in rs_rating_nasdaq100_frame.columns else pd.Series(dtype=float)
        )
        history_dowjones_series = (
            rs_rating_dowjones_frame[ticker] if ticker in rs_rating_dowjones_frame.columns else pd.Series(dtype=float)
        )
        history_russell2000_series = (
            rs_rating_russell2000_frame[ticker] if ticker in rs_rating_russell2000_frame.columns else pd.Series(dtype=float)
        )

        rs_new_high_1y_all = compute_rating_new_high(history_all_series, LOOKBACKS["12m"])
        rs_new_high_1y_sp500 = compute_rating_new_high(history_sp500_series, LOOKBACKS["12m"])
        rs_new_high_1y_nasdaq100 = compute_rating_new_high(history_nasdaq100_series, LOOKBACKS["12m"])
        rs_new_high_1y_dowjones = compute_rating_new_high(history_dowjones_series, LOOKBACKS["12m"])
        rs_new_high_1y_russell2000 = compute_rating_new_high(history_russell2000_series, LOOKBACKS["12m"])
        rs_new_high_3m_all = compute_rating_new_high(history_all_series, LOOKBACKS["3m"])
        rs_new_high_3m_sp500 = compute_rating_new_high(history_sp500_series, LOOKBACKS["3m"])
        rs_new_high_3m_nasdaq100 = compute_rating_new_high(history_nasdaq100_series, LOOKBACKS["3m"])
        rs_new_high_3m_dowjones = compute_rating_new_high(history_dowjones_series, LOOKBACKS["3m"])
        rs_new_high_3m_russell2000 = compute_rating_new_high(history_russell2000_series, LOOKBACKS["3m"])
        price_new_high_1y = compute_price_new_high(raw_price_series, LOOKBACKS["12m"])
        price_new_high_3m = compute_price_new_high(raw_price_series, LOOKBACKS["3m"])

        ticker_high_series = stock_high[ticker] if ticker in stock_high.columns else pd.Series(dtype=float)
        ticker_low_series = stock_low[ticker] if ticker in stock_low.columns else pd.Series(dtype=float)
        ticker_raw_close_series = stock_raw_close[ticker] if ticker in stock_raw_close.columns else pd.Series(dtype=float)
        ticker_atr_series = compute_atr_series(ticker_high_series, ticker_low_series, ticker_raw_close_series)
        ticker_atr_pct_series = compute_atr_pct_series(ticker_high_series, ticker_low_series, ticker_raw_close_series)

        row = {
            "ticker": ticker,
            "name": str(member["name"]),
            "price": round(current_price, 2),
            "marketCap": market_cap,
            "sharesOutstanding": shares_outstanding,
            "rsRatingAll": nullable_int(latest_rating),
            "rsRatingSp500": nullable_int(rs_ratings_by_universe.get("sp500", pd.DataFrame()).get(ticker, pd.Series(dtype=float)).get(latest_date)),
            "rsRatingNasdaq100": nullable_int(rs_ratings_by_universe.get("nasdaq100", pd.DataFrame()).get(ticker, pd.Series(dtype=float)).get(latest_date)),
            "rsRatingDowjones": nullable_int(rs_ratings_by_universe.get("dowjones", pd.DataFrame()).get(ticker, pd.Series(dtype=float)).get(latest_date)),
            "rsRatingRussell2000": nullable_int(rs_ratings_by_universe.get("russell2000", pd.DataFrame()).get(ticker, pd.Series(dtype=float)).get(latest_date)),
            "rsPeriods": {
                "1w": nullable_int(period_rs_ratings_all["1w"].get(ticker, pd.Series(dtype=float)).get(latest_date)),
                "2w": nullable_int(period_rs_ratings_all["2w"].get(ticker, pd.Series(dtype=float)).get(latest_date)),
                "1m": nullable_int(period_rs_ratings_all["1m"].get(ticker, pd.Series(dtype=float)).get(latest_date)),
                "3m": nullable_int(period_rs_ratings_all["3m"].get(ticker, pd.Series(dtype=float)).get(latest_date)),
                "6m": nullable_int(period_rs_ratings_all["6m"].get(ticker, pd.Series(dtype=float)).get(latest_date)),
                "12m": nullable_int(period_rs_ratings_all["12m"].get(ticker, pd.Series(dtype=float)).get(latest_date)),
            },
            "returns": {
                "1w": compute_return(performance_series, LOOKBACKS["1w"]),
                "2w": compute_return(performance_series, LOOKBACKS["2w"]),
                "1m": compute_return(performance_series, LOOKBACKS["1m"]),
                "3m": compute_return(performance_series, LOOKBACKS["3m"]),
                "6m": compute_return(performance_series, LOOKBACKS["6m"]),
                "12m": compute_return(performance_series, LOOKBACKS["12m"]),
            },
            "atr21Pct": compute_atr_pct(
                ticker_high_series,
                ticker_low_series,
                ticker_raw_close_series,
            ),
            "extension": compute_extension_metrics(ticker_raw_close_series, ticker_atr_series, ticker_atr_pct_series),
            "distanceTo52wHighPct": compute_52w_gap(performance_series),
            "rsNewHigh": rs_new_high_1y_all,
            "rsNewHighAll": rs_new_high_1y_all,
            "rsNewHighSp500": rs_new_high_1y_sp500,
            "rsNewHighNasdaq100": rs_new_high_1y_nasdaq100,
            "rsNewHighDowjones": rs_new_high_1y_dowjones,
            "rsNewHighRussell2000": rs_new_high_1y_russell2000,
            "rsNewHigh1yAll": rs_new_high_1y_all,
            "rsNewHigh1ySp500": rs_new_high_1y_sp500,
            "rsNewHigh1yNasdaq100": rs_new_high_1y_nasdaq100,
            "rsNewHigh1yDowjones": rs_new_high_1y_dowjones,
            "rsNewHigh1yRussell2000": rs_new_high_1y_russell2000,
            "rsNewHigh3mAll": rs_new_high_3m_all,
            "rsNewHigh3mSp500": rs_new_high_3m_sp500,
            "rsNewHigh3mNasdaq100": rs_new_high_3m_nasdaq100,
            "rsNewHigh3mDowjones": rs_new_high_3m_dowjones,
            "rsNewHigh3mRussell2000": rs_new_high_3m_russell2000,
            "priceNewHigh": price_new_high_1y,
            "priceNewHigh1y": price_new_high_1y,
            "priceNewHigh3m": price_new_high_3m,
            "memberships": {
                "sp500": bool(member["member_sp500"]),
                "nasdaq100": bool(member["member_nasdaq100"]),
                "dowjones": bool(member["member_dowjones"]),
                "russell2000": bool(member["member_russell2000"]),
            },
        }
        rows.append(row)
        history_payload = {
            "rsRatingAll": [
                None if pd.isna(value) else int(value)
                for value in history_rating_all[ticker].tolist()
            ],
            "price": serialize_price_line(raw_price_window),
            "open": serialize_price_line(open_window),
            "high": serialize_price_line(high_window),
            "low": serialize_price_line(low_window),
            "volume": serialize_volume_line(volume_window),
        }
        universe_history_series = {
            "rsRatingSp500": history_sp500_series,
            "rsRatingNasdaq100": history_nasdaq100_series,
            "rsRatingDowjones": history_dowjones_series,
            "rsRatingRussell2000": history_russell2000_series,
        }
        for history_key, history_series in universe_history_series.items():
            aligned_values = history_series.reindex(history_rating_all.index)
            if aligned_values.notna().any():
                history_payload[history_key] = [
                    None if pd.isna(value) else int(value)
                    for value in aligned_values.tolist()
                ]
        histories[ticker] = history_payload

    rows.sort(key=lambda item: (-int(item.get("rsRatingAll") or 0), item["ticker"]))
    return {
        "updatedAt": latest_date.strftime("%Y-%m-%d"),
        "benchmark": {"symbol": BENCHMARK_SYMBOL, "label": "S&P 500"},
        "historyDates": history_dates,
        "historyRanges": [
            {"key": "1m", "label": "1M"},
            {"key": "3m", "label": "3M"},
            {"key": "6m", "label": "6M"},
            {"key": "ytd", "label": "YTD"},
            {"key": "1y", "label": "1Y"},
            {"key": "max", "label": "Since 2025"},
        ],
        "universes": {
            "all": {"label": "All", "color": COLOR_BY_UNIVERSE["all"]},
            "sp500": {"label": "S&P 500", "color": COLOR_BY_UNIVERSE["sp500"]},
            "nasdaq100": {"label": "NASDAQ 100", "color": COLOR_BY_UNIVERSE["nasdaq100"]},
            "dowjones": {"label": "Dow Jones", "color": COLOR_BY_UNIVERSE["dowjones"]},
            "russell2000": {"label": "Russell 2000", "color": COLOR_BY_UNIVERSE["russell2000"]},
        },
        "scoring": {
            "label": "StockEasy-style RS Rating",
            "description": "Weighted average of period RS ranks using RS_1M 20%, RS_3M 40%, RS_6M 20%, and RS_12M 20%. Each period RS is a daily 1-99 percentile rank. Names with market cap at or below $200M are excluded.",
            "minMarketCapUsd": MIN_MARKET_CAP_USD,
            "weights": RS_WEIGHTS,
            "atr": "ATR% = the average of each session's true range divided by its previous close over up to 21 trading days; newly listed names use available history after two trading sessions.",
        },
        "rows": rows,
        "histories": histories,
    }


def compute_52w_gap(series: pd.Series) -> float | None:
    if len(series) < LOOKBACKS["12m"]:
        return None
    recent = series.tail(LOOKBACKS["12m"])
    high = recent.max()
    current = recent.iloc[-1]
    if not math.isfinite(high) or not math.isfinite(current) or high == 0:
        return None
    return round((float(high - current) / float(high)) * 100, 2)


def compute_atr_series(high_series: pd.Series, low_series: pd.Series, close_series: pd.Series, window: int = ATR_WINDOW) -> pd.Series:
    frame = pd.concat(
        {
            "high": high_series,
            "low": low_series,
            "close": close_series,
        },
        axis=1,
    ).dropna()
    if len(frame) < ATR_MIN_PERIODS:
        return pd.Series(dtype=float)
    previous_close = frame["close"].shift(1)
    true_range = pd.concat(
        [
            frame["high"] - frame["low"],
            (frame["high"] - previous_close).abs(),
            (frame["low"] - previous_close).abs(),
        ],
        axis=1,
    ).max(axis=1)
    return true_range.rolling(window, min_periods=ATR_MIN_PERIODS).mean().dropna()


def compute_atr_pct_series(high_series: pd.Series, low_series: pd.Series, close_series: pd.Series, window: int = ATR_WINDOW) -> pd.Series:
    frame = pd.concat(
        {
            "high": high_series,
            "low": low_series,
            "close": close_series,
        },
        axis=1,
    ).dropna()
    if len(frame) < ATR_MIN_PERIODS:
        return pd.Series(dtype=float)
    previous_close = frame["close"].shift(1).fillna(frame["close"])
    true_range = pd.concat(
        [
            frame["high"] - frame["low"],
            (frame["high"] - previous_close).abs(),
            (frame["low"] - previous_close).abs(),
        ],
        axis=1,
    ).max(axis=1)
    true_range_pct = (true_range / previous_close.where(previous_close > 0)) * 100
    return true_range_pct.rolling(window, min_periods=ATR_MIN_PERIODS).mean().dropna()


def compute_atr_pct(high_series: pd.Series, low_series: pd.Series, close_series: pd.Series, window: int = ATR_WINDOW) -> float | None:
    frame = pd.concat(
        {
            "high": high_series,
            "low": low_series,
            "close": close_series,
        },
        axis=1,
    ).dropna()
    if len(frame) < ATR_MIN_PERIODS:
        return None
    atr_series = compute_atr_pct_series(frame["high"], frame["low"], frame["close"], window)
    if atr_series.empty:
        return None
    atr_pct = atr_series.iloc[-1]
    if not math.isfinite(float(atr_pct)):
        return None
    return round(float(atr_pct), 2)


def interpolate_sigma(abs_multiple: float, thresholds: dict[int, float]) -> float:
    if abs_multiple <= 0:
        return 0.0
    ordered = sorted((int(key), float(value)) for key, value in thresholds.items())
    previous_sigma = 0
    previous_value = 0.0
    for sigma, threshold in ordered:
        if abs_multiple <= threshold:
            if threshold <= previous_value:
                return float(sigma)
            ratio = (abs_multiple - previous_value) / (threshold - previous_value)
            return previous_sigma + ratio * (sigma - previous_sigma)
        previous_sigma = sigma
        previous_value = threshold
    top_sigma, top_value = ordered[-1]
    base_step = top_value / top_sigma if top_sigma else top_value
    if base_step <= 0:
        return float(top_sigma)
    return top_sigma + ((abs_multiple - top_value) / base_step)


def classify_extension(abs_sigma: float | None) -> str:
    if abs_sigma is None:
        return "na"
    if abs_sigma >= 3:
        return "extreme"
    if abs_sigma >= 2:
        return "stretched"
    if abs_sigma >= 1:
        return "watch"
    return "normal"


def compute_extension_metrics(
    close_series: pd.Series,
    atr_series: pd.Series,
    atr_pct_series: pd.Series,
) -> dict[str, dict[str, object]]:
    metrics: dict[str, dict[str, object]] = {}
    close = close_series.dropna()
    if close.empty or atr_pct_series.empty:
        return metrics
    current_price = float(close.iloc[-1])
    aligned_atr_pct = atr_pct_series.reindex(close.index).dropna()
    if aligned_atr_pct.empty:
        return metrics
    latest_atr_pct = float(aligned_atr_pct.iloc[-1])
    latest_atr_dollar = None
    if not atr_series.empty:
        aligned_atr_dollar = atr_series.reindex(close.index).dropna()
        if not aligned_atr_dollar.empty and math.isfinite(float(aligned_atr_dollar.iloc[-1])):
            latest_atr_dollar = float(aligned_atr_dollar.iloc[-1])
    if not math.isfinite(current_price) or current_price <= 0 or not math.isfinite(latest_atr_pct) or latest_atr_pct <= 0:
        return metrics
    for key, meta in EXTENSION_ANCHORS.items():
        period = int(meta["period"])
        if len(close) < period:
            continue
        if meta["kind"] == "ema":
            anchor_series = close.ewm(span=period, adjust=False).mean()
        else:
            anchor_series = close.rolling(period).mean()
        anchor = float(anchor_series.dropna().iloc[-1])
        if not math.isfinite(anchor) or anchor <= 0:
            continue
        deviation_pct = ((current_price / anchor) - 1) * 100
        atr_multiple = deviation_pct / latest_atr_pct
        abs_sigma = interpolate_sigma(abs(float(atr_multiple)), dict(meta["sigma_thresholds"]))
        metrics[key] = {
            "label": meta["label"],
            "anchor": round(anchor, 2),
            "price": round(current_price, 2),
            "atr": round(latest_atr_pct, 2),
            "atrPct": round(latest_atr_pct, 2),
            "atrDollar": round(latest_atr_dollar, 2) if latest_atr_dollar is not None else None,
            "deviationPct": round(float(deviation_pct), 2),
            "atrMultiple": round(float(atr_multiple), 2),
            "absAtrMultiple": round(abs(float(atr_multiple)), 2),
            "sigma": round(abs_sigma, 2),
            "signedSigma": round(abs_sigma if atr_multiple >= 0 else -abs_sigma, 2),
            "zone": classify_extension(abs_sigma),
            "direction": "above" if atr_multiple >= 0 else "below",
            "sigmaThresholds": {str(level): value for level, value in meta["sigma_thresholds"].items()},
        }
    return metrics


def nullable_int(value: object) -> int | None:
    if value is None or pd.isna(value):
        return None
    return int(value)


def load_js_payload(path: Path, variable_name: str) -> dict[str, object]:
    if not path.exists():
        return {}
    text = path.read_text(encoding="utf-8").strip()
    prefix = f"window.{variable_name} = "
    if text.startswith(prefix):
        text = text[len(prefix) :]
    if text.endswith(";"):
        text = text[:-1]
    try:
        payload = json.loads(text)
    except json.JSONDecodeError:
        return {}
    return payload if isinstance(payload, dict) else {}


def load_daily_briefing_tickers() -> set[str]:
    payload = load_js_payload(BRIEFING_DATA_PATH, "marketBriefingData")
    tickers: set[str] = set()
    for sector in payload.get("sectorPanels", []):
        if not isinstance(sector, dict):
            continue
        for item in sector.get("items", []):
            if not isinstance(item, dict):
                continue
            ticker = normalize_ticker(item.get("ticker"))
            if ticker:
                tickers.add(ticker)
    return tickers


def read_cached_universe(existing: dict) -> pd.DataFrame:
    rows = []
    for row in existing.get("rows", []):
        if not isinstance(row, dict):
            continue
        ticker = normalize_ticker(row.get("ticker"))
        if not ticker or is_terminal_symbol(ticker):
            continue
        memberships = row.get("memberships") or {}
        rows.append(
            {
                "ticker": ticker,
                "name": str(row.get("name") or ticker),
                "member_sp500": bool(memberships.get("sp500")),
                "member_nasdaq100": bool(memberships.get("nasdaq100")),
                "member_dowjones": bool(memberships.get("dowjones")),
                "member_russell2000": bool(memberships.get("russell2000")),
            }
        )
    return pd.DataFrame(rows).drop_duplicates(subset=["ticker"]).reset_index(drop=True)


def refresh_daily_briefing_priority() -> dict[str, object]:
    """Refresh Daily Briefing names without re-downloading the full RS universe."""
    existing = load_existing_payload()
    universe = read_cached_universe(existing)
    if universe.empty:
        raise RuntimeError("No cached market RS universe is available for the priority refresh.")

    requested = load_daily_briefing_tickers()
    available = set(universe["ticker"].tolist())
    symbols = sorted(requested & available)
    missing = sorted(requested - available)
    if not symbols:
        raise RuntimeError("No Daily Briefing symbols matched the cached market RS universe.")
    if missing:
        print("Daily Briefing names missing from cached RS universe: " + ", ".join(missing), flush=True)

    raw_close_frame, adjusted_close_frame, open_frame, high_frame, low_frame, volume_frame = fetch_price_frames(
        symbols + [BENCHMARK_SYMBOL],
        period=PRICE_PERIOD,
        retry_missing=False,
    )
    raw_close_frame, adjusted_close_frame, open_frame, high_frame, low_frame, volume_frame = merge_existing_history_window(
        raw_close_frame,
        adjusted_close_frame,
        open_frame,
        high_frame,
        low_frame,
        volume_frame,
    )
    rows_by_ticker = {
        normalize_ticker(row.get("ticker")): row
        for row in existing.get("rows", [])
        if isinstance(row, dict) and normalize_ticker(row.get("ticker"))
    }
    shares_cache = {
        ticker: normalize_positive_int(row.get("sharesOutstanding"))
        for ticker, row in rows_by_ticker.items()
    }
    payload = build_payload(
        universe,
        raw_close_frame,
        adjusted_close_frame,
        open_frame,
        high_frame,
        low_frame,
        volume_frame,
        shares_cache,
    )
    payload["refreshScope"] = {
        "mode": "daily-briefing-priority",
        "freshTickerCount": len(symbols),
        "label": "Daily Briefing priority OHLCV refresh; remaining symbols retain the prior close until the weekly full refresh.",
    }
    return payload


def main() -> None:
    parser = argparse.ArgumentParser(description="Refresh market RS data.")
    parser.add_argument(
        "--daily-briefing-priority",
        action="store_true",
        help="Refresh only Daily Briefing OHLCV and reuse the cached RS universe for the remaining names.",
    )
    args = parser.parse_args()

    if args.daily_briefing_priority:
        payload = refresh_daily_briefing_priority()
        OUTPUT_PATH.write_text(
            "window.marketRsData = " + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n",
            encoding="utf-8",
            newline="\n",
        )
        print(f"Wrote {OUTPUT_PATH}")
        print(f"Rows: {len(payload['rows'])}")
        print(f"As of: {payload['updatedAt']}")
        print(f"Priority fresh tickers: {payload['refreshScope']['freshTickerCount']}")
        return

    universe = fetch_universe_frame()
    symbols = sorted(symbol for symbol in universe["ticker"].tolist() if not is_terminal_symbol(str(symbol)))
    raw_close_frame, adjusted_close_frame, open_frame, high_frame, low_frame, volume_frame = fetch_price_frames(symbols + [BENCHMARK_SYMBOL])
    raw_close_frame, adjusted_close_frame, open_frame, high_frame, low_frame, volume_frame = merge_existing_history_window(
        raw_close_frame,
        adjusted_close_frame,
        open_frame,
        high_frame,
        low_frame,
        volume_frame,
    )
    manual_symbols = [normalize_ticker(member["ticker"]) for member in get_manual_universe_members()]
    raw_close_frame, adjusted_close_frame, open_frame, high_frame, low_frame, volume_frame = ensure_symbol_price_frames(
        manual_symbols,
        raw_close_frame,
        adjusted_close_frame,
        open_frame,
        high_frame,
        low_frame,
        volume_frame,
    )
    # merge_existing_history_window already fills missing fresh sessions from the
    # saved chart history. A second cell-by-cell historical pass here was
    # redundant and made the daily 2,400-symbol refresh take tens of minutes.
    raw_close_frame, adjusted_close_frame, open_frame, high_frame, low_frame, volume_frame = (
        fill_closed_session_ohlcv_gaps_from_chart(
            symbols + [BENCHMARK_SYMBOL],
            raw_close_frame,
            adjusted_close_frame,
            open_frame,
            high_frame,
            low_frame,
            volume_frame,
        )
    )
    raw_close_frame, adjusted_close_frame = fill_closed_session_close_gaps_from_spark(
        symbols + [BENCHMARK_SYMBOL],
        raw_close_frame,
        adjusted_close_frame,
        open_frame,
        high_frame,
        low_frame,
    )
    existing_rows = load_existing_rows()
    refresh_symbols = detect_share_refresh_symbols(symbols, existing_rows, raw_close_frame)
    shares_cache = build_shares_cache(symbols, existing_rows, refresh_symbols)
    payload = build_payload(
        universe,
        raw_close_frame,
        adjusted_close_frame,
        open_frame,
        high_frame,
        low_frame,
        volume_frame,
        shares_cache,
    )

    OUTPUT_PATH.write_text(
        "window.marketRsData = " + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n",
        encoding="utf-8",
        newline="\n",
    )
    print(f"Wrote {OUTPUT_PATH}")
    print(f"Rows: {len(payload['rows'])}")
    print(f"As of: {payload['updatedAt']}")


if __name__ == "__main__":
    main()
