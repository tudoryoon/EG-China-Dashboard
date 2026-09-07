from __future__ import annotations

import json
import math
import re
import time
import warnings
from io import StringIO
from pathlib import Path

import pandas as pd
import requests

warnings.filterwarnings("ignore", category=FutureWarning, module="pandas")


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "dashboard-data.js"

SERIES_START_YEAR = 2021
SERIES_START_MONTH = 1
REQUEST_DELAY_SECONDS = 1.2
MAX_RETRIES = 5

COMPANY_CODES = {
    "TSMC": "2330",
    "UMC": "2303",
    "Win Semiconductor": "3105",
    "Hon Hai(Foxconn)": "2317",
    "Inventec": "2356",
    "Quanta": "2382",
    "Wiwynn": "6669",
    "Wistron": "3231",
    "Nanya": "2408",
    "Winbond": "2344",
    "Phison": "8299",
    "Innodisk": "5289",
    "ADATA": "3260",
    "Apacer": "8271",
    "Transcend": "2451",
    "TUC": "6274",
    "ITEQ": "6213",
    "EMC": "2383",
    "Kinsus": "3189",
    "Unimicron": "3037",
    "Gold Circuit": "2368",
    "Dynamic Electronics": "3715",
    "Nanya PCB": "8046",
    "Fulltech": "1815",
    "Co-Tech": "8358",
    "Topoint": "8021",
    "Aspeed": "5274",
    "Delta Electronics": "2308",
    "Accton": "2345",
    "Asia Vital Components": "3017",
    "Auras Technology": "3324",
    "Kaori Heat": "8996",
    "Jentech": "3653",
    "SunoWealth": "2421",
    "King Slide Works": "2059",
    "Fositek": "6805",
    "Yageo": "2327",
    "King Yuan": "2449",
    "Winway": "6515",
    "MPI": "6223",
    "Landmark Opto": "3081",
    "VPEC": "2455",
    "Browave": "3163",
    "Grand Process Tech": "3131",
}

AGGREGATES = {
    "Server ODM Total": ["Hon Hai(Foxconn)", "Inventec", "Quanta", "Wiwynn", "Wistron"],
    "CCL Total": ["TUC", "ITEQ", "EMC"],
}


def parse_js_payload(text: str) -> list[dict]:
    payload = re.sub(r"^\s*window\.dashboardCompanies\s*=\s*", "", text.strip())
    payload = re.sub(r";\s*$", "", payload)
    try:
        return json.loads(payload)
    except json.JSONDecodeError:
        jsonish = re.sub(r"([{\s,])([A-Za-z_][A-Za-z0-9_]*)\s*:", r'\1"\2":', payload)
        jsonish = re.sub(r",(\s*[}\]])", r"\1", jsonish)
        return json.loads(jsonish)


def write_js_payload(companies: list[dict]) -> None:
    DATA_PATH.write_text(
        "window.dashboardCompanies = "
        + json.dumps(companies, ensure_ascii=False, indent=2, allow_nan=False)
        + ";\n",
        encoding="utf-8",
        newline="\n",
    )


def parse_month_text(text: str) -> tuple[int, int]:
    year, month = str(text).split("/")
    return 2000 + int(year), int(month)


def format_month(year: int, month: int) -> str:
    return f"{str(year)[2:]}/{month:02d}"


def month_index(year: int, month: int) -> int:
    return (year - SERIES_START_YEAR) * 12 + (month - SERIES_START_MONTH)


def index_month(index: int) -> tuple[int, int]:
    month_zero = SERIES_START_MONTH - 1 + index
    return SERIES_START_YEAR + month_zero // 12, (month_zero % 12) + 1


def number_or_none(value: object) -> float | None:
    try:
        numeric = float(str(value).replace(",", "").replace("%", "").strip())
    except Exception:
        return None
    if not math.isfinite(numeric):
        return None
    return numeric


def fetch_recent_revenue(code: str, session: requests.Session) -> dict[str, dict[str, float]]:
    url = f"https://emops.twse.com.tw/server-java/t146sb05_e?step=0&co_id={code}"
    last_error: Exception | None = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = session.get(url, timeout=30)
            html = response.content.decode("big5", errors="ignore")
            if "查詢過量" in html:
                time.sleep(REQUEST_DELAY_SECONDS * attempt * 3)
                continue
            tables = pd.read_html(StringIO(html))
            for table in tables:
                if table.shape[0] < 3 or table.shape[1] < 3:
                    continue
                if "Operating Revenue" not in str(table.iloc[0, 0]):
                    continue
                if not re.match(r"20\d{2}\.\d{2}", str(table.iloc[1, 0]).strip()):
                    continue
                rows: dict[str, dict[str, float]] = {}
                for row_index in range(1, len(table), 2):
                    if row_index + 1 >= len(table):
                        continue
                    period = str(table.iloc[row_index, 0]).strip()
                    if not re.match(r"20\d{2}\.\d{2}", period):
                        continue
                    revenue = number_or_none(table.iloc[row_index + 1, 0])
                    yoy = number_or_none(table.iloc[row_index + 1, 2])
                    if revenue is None:
                        continue
                    rows[period.replace(".", "/")] = {
                        "revenue": revenue / 1_000_000,
                        "yoy": yoy,
                    }
                return rows
            return {}
        except Exception as error:
            last_error = error
            time.sleep(REQUEST_DELAY_SECONDS * attempt)
    if last_error:
        raise last_error
    return {}


def set_yearly_value(company: dict, year: int, month: int, value: float | None) -> None:
    yearly = company.setdefault(
        "yearly",
        {
            "labels": [f"{month_index:02d}M" for month_index in range(1, 13)],
            "series": [],
        },
    )
    yearly.setdefault("labels", [f"{month_index:02d}M" for month_index in range(1, 13)])
    year_key = str(year)[2:]
    series = yearly.setdefault("series", [])
    row = next((item for item in series if str(item.get("year")) == year_key), None)
    if row is None:
        row = {"year": year_key, "values": [None] * 12}
        series.append(row)
        series.sort(key=lambda item: str(item.get("year", "")))
    values = row.setdefault("values", [None] * 12)
    while len(values) < 12:
        values.append(None)
    values[month - 1] = round(value, 1) if value is not None else None


def update_latest_fields(company: dict) -> None:
    bars = company.get("bars") or []
    month_text = company.get("month")
    if not bars or not month_text:
        return
    latest_revenue = bars[-1]
    previous_revenue = bars[-2] if len(bars) >= 2 else None
    company["mom"] = (
        round(((latest_revenue - previous_revenue) / previous_revenue) * 100, 1)
        if previous_revenue
        else None
    )
    latest_yoy = (company.get("yoyLine") or [None])[-1]
    company["yoy"] = latest_yoy
    currency = company.setdefault("currency", {})
    old_ntd = number_or_none(currency.get("NTD"))
    old_usd = number_or_none(currency.get("USD"))
    usd_ratio = old_usd / old_ntd if old_ntd and old_usd else None
    currency["NTD"] = round(float(latest_revenue), 4)
    if usd_ratio:
        currency["USD"] = round(float(latest_revenue) * usd_ratio, 3)


def sync_company_months(company: dict, source_rows: dict[str, dict[str, float]]) -> list[str]:
    updated: list[str] = []
    bars = company.setdefault("bars", [])
    yoy_line = company.setdefault("yoyLine", [])
    mom_line = company.setdefault("momLine", [])
    latest_year, latest_month = parse_month_text(company["month"])
    latest_index = month_index(latest_year, latest_month)

    source_periods = []
    for period, row in source_rows.items():
        year, month = map(int, period.split("/"))
        idx = month_index(year, month)
        if idx >= 0:
            source_periods.append((idx, year, month, row))

    for idx, year, month, row in sorted(source_periods):
        while len(bars) <= idx:
            bars.append(None)
        while len(yoy_line) <= idx:
            yoy_line.append(None)
        while len(mom_line) <= idx:
            mom_line.append(None)

        revenue = round(float(row["revenue"]), 4)
        yoy = round(float(row["yoy"]), 1) if row.get("yoy") is not None else None
        old_revenue = number_or_none(bars[idx])
        old_yoy = number_or_none(yoy_line[idx])
        changed = old_revenue != revenue or old_yoy != yoy

        bars[idx] = revenue
        yoy_line[idx] = yoy
        previous_revenue = bars[idx - 1] if idx >= 1 else None
        mom = round(((revenue - previous_revenue) / previous_revenue) * 100, 1) if previous_revenue else None
        if mom_line[idx] != mom:
            changed = True
        mom_line[idx] = mom

        if idx + 1 < len(bars) and bars[idx + 1] is not None:
            next_mom = round(((bars[idx + 1] - revenue) / revenue) * 100, 1) if revenue else None
            if mom_line[idx + 1] != next_mom:
                mom_line[idx + 1] = next_mom
                changed = True

        if idx >= latest_index:
            company["month"] = format_month(year, month)
            latest_index = idx
        set_yearly_value(company, year, month, yoy)
        if changed:
            updated.append(format_month(year, month))

    update_latest_fields(company)
    return sorted(set(updated))


def update_aggregate(company: dict, components: list[dict]) -> list[str]:
    if not components:
        return []
    old_month = company.get("month")
    min_len = min(len(item.get("bars", [])) for item in components)
    bars: list[float | None] = []
    for index in range(min_len):
        component_values = [number_or_none(item["bars"][index]) for item in components]
        if any(value is None for value in component_values):
            bars.append(None)
        else:
            bars.append(round(sum(float(value) for value in component_values if value is not None), 4))
    yoy_line: list[float | None] = []
    mom_line: list[float | None] = []
    for index, revenue in enumerate(bars):
        previous_revenue = bars[index - 1] if index >= 1 else None
        prior_year_revenue = bars[index - 12] if index >= 12 else None
        mom_line.append(
            round(((revenue - previous_revenue) / previous_revenue) * 100, 1)
            if revenue is not None and previous_revenue
            else None
        )
        yoy_line.append(
            round(((revenue - prior_year_revenue) / prior_year_revenue) * 100, 1)
            if revenue is not None and prior_year_revenue
            else None
        )
    latest_year, latest_month = index_month(min_len - 1)
    company["bars"] = bars
    company["yoyLine"] = yoy_line
    company["momLine"] = mom_line
    company["month"] = format_month(latest_year, latest_month)
    for year in range(SERIES_START_YEAR, latest_year + 1):
        for month in range(1, 13):
            idx = month_index(year, month)
            if 0 <= idx < len(yoy_line):
                set_yearly_value(company, year, month, yoy_line[idx])
    update_latest_fields(company)
    return [company["month"]] if company.get("month") != old_month else []


def main() -> None:
    companies = parse_js_payload(DATA_PATH.read_text(encoding="utf-8"))
    by_name = {company.get("name"): company for company in companies}
    session = requests.Session()
    session.headers.update({"User-Agent": "Mozilla/5.0"})
    updated: dict[str, list[str]] = {}
    skipped: list[str] = []

    for name, code in COMPANY_CODES.items():
        company = by_name.get(name)
        if not company:
            skipped.append(f"{name}: missing dashboard company")
            continue
        rows = fetch_recent_revenue(code, session)
        months = sync_company_months(company, rows)
        if months:
            updated[name] = months
        time.sleep(REQUEST_DELAY_SECONDS)

    for aggregate_name, component_names in AGGREGATES.items():
        company = by_name.get(aggregate_name)
        components = [by_name[name] for name in component_names if name in by_name]
        if company:
            months = update_aggregate(company, components)
            if months:
                updated[aggregate_name] = months

    write_js_payload(companies)
    print(json.dumps({"updated": updated, "skipped": skipped}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
