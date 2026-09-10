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
- Checkpoints apply to cycles starting at 21:03 KST. A delayed success suppresses later attempts in that cycle; the next 21:03 run remains enabled. Each Action retries the complete atomic refresh up to six times with increasing one-to-five-minute waits. Failed attempts never reach staging or publication. Any failed publication run dispatches the guarded 21:17 recovery workflow, repeating recovery cycles until validation succeeds; the failure summary includes the last collector log lines. GitHub service/account outages remain outside workflow control.
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

## September 8 refresh recovery — 2026-09-09

- All three scheduled runs (34251467688, 34252052078, 34252426602) failed with curl error 56, connection closed abruptly, when contacting Eastmoney for Hong Kong ETF quotes and CSI800 history. They did not publish partial data. Yahoo HSI also ended on September 7, silently limiting Hong Kong's calculation calendar before final freshness validation. A live local run reproduced the stale-HSI failure even where Eastmoney was reachable.
- Tencent now supplies ETF and HSI/CSI800 history first, with independent Eastmoney/Yahoo fallbacks. Every source must reach the exchange calendar's completed session before use; stale HTTP-success responses trigger fallback. No fabricated closes or relaxed date checks are used. Source identity, OHLC validity, duplicate dates, raw/adjusted internal gaps and minimum coverage are checked. The shorter leading window of Tencent's capped adjusted series is explicitly trimmed, preserving missing early observations.
- Thirty-two tests pass, including connection failures, stale successful responses, exhaustion of all sources, symbol validation, adjusted-history alignment, and explicit forced verification without weakening scheduled backup skipping. Original scoring engines and CSS remain unchanged.
- Manual recovery collected all equity prices and Taiwan source rows, then rebuilt both markets against the corrected benchmarks: HK 583/583 and China 803/803, all 1,386 quote dates September 8. All five ETF sources and both benchmark sources are Tencent. Taiwan strict collection updated August revenue for 10 companies; 37 companies now have August and seven have July, plus both aggregates. Regional, session-freshness, Taiwan, provenance and JavaScript checks pass.
- `Verify Full Data Refresh` is a manual, read-only Action that runs the real collectors and validators with `--force`; it never commits or deploys. The three scheduled publication jobs retain their normal checkpoints and concurrency lock.

## STAR 50 index addition — 2026-09-09

- Added `000688.SS` as `STAR 50 Index` and asset type `Index` to both China RS and Trend Score. Tencent supplied 651 verified sessions through September 8; Eastmoney is an identity- and freshness-checked fallback.
- September 8 output: close 1,591.00, 1D -1.52%, RS 53, and Trend Score 4 versus CSI800. Period RS values are 1W 22, 2W 39, 1M 24, 3M 40, 6M 84, and 12M 76.
- STAR 50 receives an independent percentile against the China equity population through the unchanged RS engine. A full comparison with the prior published file confirms all 800 equity RS values remain identical. The index is excluded from equity ranks and market-cap calculations.
- China coverage is 804/804 at the September 8 session: 800 CSI equities, three requested ETFs, and STAR 50. All 34 tests and regional/provenance/JavaScript checks pass. The daily collector now retains STAR 50 automatically.

## Per-security freshness and score completeness repair — 2026-09-10

- The September 9 primary Action reached a current Tencent benchmark and published `updatedAt: 2026-09-09`, but all 581 Hong Kong equities and all 800 China equities still ended on September 8 in Yahoo history. The previous validator checked benchmark-level dates and only required ETF/index rows to match, so the run wrote a valid checkpoint and both backup Actions skipped collection.
- Ordinary equities now use Tencent raw OHLC plus the same response family's qfq adjusted close as the primary full-history source. Yahoo is accepted only when its own history reaches the expected session. Tencent calls are serialized with a 250 ms cooldown to avoid the provider's sustained-request 501 throttle. HSI also has an identity- and date-validated Eastmoney fallback.
- Publication now rejects any regional row whose `asOfDate` or last price observation differs from the exchange calendar's completed session. The shared Action runs this audit again before staging data, and failed summaries retain 80 collector lines so the 21:10 and 21:17 runs can diagnose and retry a failed primary.
- The unchanged trend engine's existing available-history mode now covers every regional security whose latest 200-session price/RS window is incomplete, with its 20-observation floor and explicit `available-history-provisional` basis. The existing stricter 60-session settings for 6082.HK and 0100.HK remain.
- Manual recovery produced September 9 data with no stale rows, no missing RS values, and no missing Trend Scores: Hong Kong 583/583 and China 804/804. Provisional disclosure applies to 84 Hong Kong and 20 China rows. No observations were interpolated or forward-filled.
