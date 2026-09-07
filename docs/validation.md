# Initial migration validation — 2026-09-07

- Regional validator: Hong Kong 582 securities and China 803 securities, both dated 2026-09-04. All expected tickers are covered; ETF rank exclusion, currencies, history lengths, and score bounds pass.
- SHA-256 checks confirm the RS engine, Trend Score engine, regional collector, and CSS match the upstream baseline byte for byte.
- JavaScript syntax check and Python compilation pass. Local frontend assets resolve.
- Browser checks: default Taiwan overview displays 46 company/aggregate cards with charts; Hong Kong RS and Trend Score display Tencent (`0700.HK`); China RS and Trend Score display NAURA (`002371.SZ`). Their price labels use HKD and CNY respectively.
- Search transfers between RS and Trend within a market, and clears independently when changing markets. Applying a Trend Score 10 filter to the searched score-4 NAURA row correctly produces an empty result.
- Source snapshot scores observed in the browser: Tencent RS 44 / Trend 1; NAURA RS 68 / Trend 4. These are imported snapshot values, not new market quotes.
- Visual inspection confirms the original regional tab, filter, card, and chart styling. The original stylesheet is retained. Initial QA uses the in-app browser viewport; no claim of exhaustive cross-device testing is made.
- A stale US-universe hint in the shared Trend table is replaced with a regional-universe hint. The original reference repository remains untouched.

## Daily refresh automation — 2026-09-07

- Three separate daily schedules: UTC 12:03, 12:10, 12:17 = KST 21:03, 21:10, 21:17. All YAML files parse successfully.
- Ten offline regression tests cover successful backup skipping without file changes, retry after collector/validation failure, stale market dates, different market holidays, next-day refresh, corrupt checkpoints, early manual runs, and changes to data or calculation code.
- Real XHKG/XSHG calendar checks pass for a completed weekday session, a weekend, and a pre-close manual run.
- Taiwan validation covers all 44 companies and both aggregates. A mocked empty source response in strict mode raises an error before any data file is written.
- Existing regional data validation, original engine/CSS baseline checks, and JavaScript syntax validation pass. No live market refresh is claimed by the offline or `check_only` checks.
