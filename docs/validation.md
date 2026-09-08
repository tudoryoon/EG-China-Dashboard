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

## Requested securities and search repair — 2026-09-08

- Added World-Link Logistics `6083.HK` to daily collection separately from Biren `6082.HK`. Refetched all seven requested price histories and recomputed both markets with the unchanged scoring engines; HK 583/583 and China 803/803 pass validation at the completed September 7 session.
- `HK`, `C1` (Shanghai), and `C2` (Shenzhen) search suffixes resolve to canonical symbols, including `100 HK` → `0100.HK`. The All score filter no longer removes ETFs with null RS ratings. Missing scores/caps are retained in All and excluded from explicit numerical ranges instead of being interpreted as zero.
- Browser searches verify all seven requested symbols in both RS and Trend Score. ETF RS remains unranked; MiniMax's 162-session history and STAR 50 ETF's gaps do not receive fabricated 200-session trend scores. Existing CSS and scoring engine hashes remain unchanged. Nineteen regression tests pass, including aliases and missing-value filters.
- This is a targeted securities update; the earlier all-source checkpoint is left unchanged and fails the existing data/pipeline hash check, so the next scheduled full refresh remains eligible.

## Missing ETF values and provisional trend repair — 2026-09-08

- Yahoo's five ETF histories stopped at September 4, while Eastmoney supplied September 7 completed-session OHLCV. The collector now retrieves the entire ETF history from Eastmoney, with raw prices and forward-adjusted closes from matching dates; it excludes an unfinished September 8 session. Mainland volume lots are converted to shares; Hong Kong volume is already shares, verified against overlapping Yahoo observations. Wrong symbols, duplicate dates, invalid prices, and mismatched adjusted histories fail validation.
- Eastmoney also supplies 3109.HK's missing October 24, 2025 and March 6, 2026 prices. Its standard 200-session trend score is now 4. The May 4, 2026 opening price outside the reported high/low range is identical in both providers, retained unchanged, and disclosed in source metadata.
- Each ETF receives an independent RS percentile against its regional equity reference population through the original engine. Both markets' equity RS values exactly match the previous commit; synthetic regressions also verify that ETFs do not change equity rankings or each other's scores.
- The original engine's available-history mode is enabled only for requested new listings 6082.HK (167 sessions) and 0100.HK (162 sessions), with a 60-session minimum. Both scores are 4 and carry `available-history-provisional` plus history length. At 200 observations the adapter removes this exception. No missing prices are interpolated or forward-filled.
- September 7 ETF results (1D / RS / trend): 3033.HK -1.03% / 45 / 1; 3109.HK +1.61% / 67 / 4; 588200.SS +3.08% / 60 / 4; 562500.SS +1.92% / 33 / 0; 159819.SZ +2.64% / 50 / 5. Explicit `returns.1d` is added for consumers and does not bridge missing market sessions.
- Regional validation passes HK 583/583 and China 803/803, with no missing securities. Original engine and CSS hashes and JavaScript syntax pass. All 26 tests pass with data dependencies installed; the shared Action now also executes the seven quote/engine integration tests after installing dependencies.
- The previous full-refresh checkpoint remains invalidated by the changed data/pipeline; this targeted update does not claim a fresh Taiwan collection or suppress tonight's scheduled all-data refresh.

- ETF chart/trend OHLC also uses the provider's forward-adjusted basis; raw closes are retained for explicit daily price returns. This repairs 588200.SS's approximately 3:1 unit discontinuity before July 21, 2026, which otherwise produces an artificial 67% crash and trend 0. With adjusted history its September 7 standard trend is 4, and the 200-day deviation is +11.93%. A regression verifies split normalization across all OHLC fields.
- Browser verification confirms five ETF RS values, all three requested Hong Kong trend values, the existing `167D provisional` detail label, and China ETF trend values. No frontend/CSS changes were required.
