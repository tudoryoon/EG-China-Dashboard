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

## Navigation correction — 2026-09-07

- The former regional parent tab is removed. Browser checks confirm the primary order RS / 추세스코어 / Taiwan and the nested order 중국 / 홍콩 under both screening tabs.
- Empty-hash entry opens `#/rs/china`. All five canonical views render data; Taiwan hides the country subtabs and retains its revenue filters/charts.
- Switching from Hong Kong Trend Score to RS retains Hong Kong. Browser Back restores the correct tab, market, and URL.
- The previous `#/taiwan/china-trend` bookmark canonicalizes to `#/trend-score/china`. Other previous route names are explicitly mapped to the corresponding new routes.
- Visual QA confirms reuse of the original primary/nested chip styling and no leftover parent-tab row. Regional data, original CSS/engine checks, and JavaScript syntax validation pass.

## Refresh failure repair — 2026-09-08

- Scheduled runs 34148599947, 34148807527, and 34148858507 all failed before price collection because the HSCI response contained 582 rows against a declared count of 580. The live response had 580 `isDummy=N` rows and two blank-flag residual rows (1475 and 6603).
- The HSCI parser now selects the named composite index, filters explicit non-dummy members, and validates the official count, minimum size, unique symbols, and names. Excluded source codes and raw/reported counts are recorded in provenance and run logs. The scoring engines and CSS remain unchanged.
- Eighteen offline tests pass, including the 582/580 response, incomplete/duplicate members, delayed runs across midnight, and checkpoint portability between Windows and Linux line endings.
- Checkpoints apply to cycles starting at 21:03 KST. A delayed success suppresses later attempts in that cycle; the next 21:03 run remains enabled. Failures retain retry eligibility and now include the last collector log lines in the Actions summary.
- A full local execution of `refresh_all_data.py refresh` passed all collectors and validators: Hong Kong 582/582 and China 803/803, both screening dates 2026-09-07; Taiwan 44 companies plus two aggregates. Taiwan latest published months are August for 27 companies and July for 17. All 1,380 equity quotes are dated September 7; the five ETF feeds still end on September 4 and retain their actual quote dates.
- The generated completion checkpoint skips a repeat run now and leaves the next 21:03 KST refresh enabled. Regional validation, migration provenance checks, and both JavaScript syntax checks pass.
