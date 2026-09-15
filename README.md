# EG China & HK & Taiwan Dashboard

Independent regional dashboard migrated from [EG Dashboard](https://tudoryoon.github.io/EG_Dashboard/#/taiwan/overview).

**Fixed UI/UX baseline:** reuse the original EG Dashboard stylesheet, RS/Trend renderers, filters, tables, cards, charts, and interactions. The user-requested navigation is **RS → 추세스코어 → Taiwan**, with **중국 → 홍콩** nested under each screening tab and no extra regional parent tab. Default entry is RS / 중국. These decisions are recorded in `AGENTS.md` for future work.

## Available views

| View | Route | Initial snapshot |
| --- | --- | --- |
| China RS (default) | `#/rs/china` | 803 securities, 2026-09-04 |
| Hong Kong RS | `#/rs/hong-kong` | 582 securities, 2026-09-04 |
| China Trend Score | `#/trend-score/china` | Same regional universe |
| Hong Kong Trend Score | `#/trend-score/hong-kong` | Same regional universe |
| Taiwan monthly revenue | `#/taiwan` | Original Taiwan company data |

Switching between RS and 추세스코어 retains the selected market. Taiwan remains an independent tab. Existing `#/taiwan/...` bookmarks redirect to the corresponding canonical URLs above.

The source's Taiwan view is monthly revenue; Taiwan equity RS/Trend is not part of this initial migration. Snapshot dates above describe imported data, not a newly completed market refresh.

## Shared calculation engines

`update_asia_screening.py` invokes the original RS and Trend Score functions without changing their calculations. RS weights are 1M 20%, 3M 40%, 6M 20%, and 12M 20%. Trend Score retains the source's price trend (4), benchmark-relative trend (4), and momentum (2), along with its history and climax/extension logic.

Hong Kong and China rank independently. ETFs are excluded from equity RS ranks. Prices remain in HKD/CNY and market-cap filters use USD. The original HSI fallback disclosure and CSI800 benchmark source are preserved. Constituents, watchlists, metadata, and existing history are included.

`docs/migration-source.json` identifies the exact upstream commit and byte-identical files. The larger shared frontend is intentionally retained to preserve its renderers during the initial migration; unrelated routes and data downloads are disabled.

## Run and validate

```sh
python -m pip install -r requirements.txt
python scripts/validate_asia_screening.py
python scripts/validate_migration.py
node --check dashboard.js
python -m http.server 8000
```

Open `http://localhost:8000/`. Chart.js, Hammer.js, and the zoom plugin use the same CDN versions as the source.

## Refresh and publish

```sh
python scripts/update_asia_screening.py
python scripts/validate_asia_screening.py
```

Three daily GitHub Actions run at **21:03, 21:10, and 21:17 KST** (UTC 12:03, 12:10, 12:17), including weekends. They call `refresh-all-data.yml` and share a queued lock, so an overlapping backup waits and then reads the newest `main`.

Within each Action, unaccepted collection and validation failures are retried up to six times with waits of 1, 2, 3, 4, and 5 minutes. Each attempt has a 45-minute process-tree timeout. Already verified prices and Taiwan responses are reused within that same run. Failed attempts never reach the commit step. A failed publication job dispatches the guarded 21:17 recovery workflow from a separate recovery job. The first accepted run writes the checkpoint and commits once; remaining queued runs skip collection and push. A GitHub Actions service or account outage can still prevent runners or dispatches from starting.

Each attempt refreshes Hong Kong/China constituents, metadata, prices, RS, and Trend Score through the existing regional pipeline, then Taiwan monthly revenue with `--strict --allow-partial`. Metadata keeps the collector's existing refresh cadence; unchanged values are retained. Taiwan revenue is checked against the latest available source publication.

**Up to 10 failed securities across all three markets are accepted**, as requested on September 15. Successful securities are published. Failed securities retain their previous values and true dates, with `dataStatus: stale` and an error reason; chart dates after the last real observation remain null. A failed new security without usable previous data is omitted and reported. RS and Trend failures for the same security count once. Regional `meta.missing`, `data/taiwan-collection-status.json`, and the checkpoint record the failures. These securities retry in the next daily cycle. Eleven or more failures, invalid membership/schema, stale benchmarks, or other systemic errors still block publication.

For GitHub job timeouts, a separate completion watcher checks GitHub's execution-limit annotation before queuing recovery. Deliberate manual cancellations stay stopped. Repeated Tencent failures temporarily switch requests to the next validated provider. Newly listed constituents are retained with current prices and unscored values where the original engines lack enough history.

Only after all validators accept the refresh under this shared allowance are the data and `.github/data-refresh-status.json` committed together. XHKG/XSHG calendars account for separate exchange holidays. An accepted checkpoint matching all data and pipeline hashes applies to the cycle starting at 21:03 KST, including retries delayed past midnight. Later attempts skip collection, commit and push; the next cycle retries all securities. Unaccepted failures or undeclared stale rows do not certify success. The checkpoint is checked again after rebasing before push. A manual success before 21:03 does not suppress the evening refresh.

The completion checkpoint may produce one successful daily commit even when the underlying source values are unchanged. Later backups never push merely to record that they ran. Scheduled trigger times can be delayed by GitHub; a busy preceding attempt also delays the queued backup.

Use the `check_only` manual input on any of the three Actions to validate orchestration without collecting or publishing data. Run local regression tests with `python -m unittest discover -s tests -v`.

GitHub Pages deploys the static files using `.github/workflows/deploy-pages.yml`. Every accepted publication run checks delivery of committed `main`, even when collection was skipped, because pushes with `GITHUB_TOKEN` do not trigger a second workflow automatically. An active or successful deployment for that commit suppresses duplicate dispatch. Pages reads `main` after its concurrency lock, and a separate completion watcher retries failed/timed-out deployments without collecting or pushing data. Site artifacts contain only the frontend and regional data.
