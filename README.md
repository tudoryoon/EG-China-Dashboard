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

Each attempt refreshes Hong Kong/China constituents, metadata, prices, RS, and Trend Score through the existing regional pipeline, then Taiwan monthly revenue with `--strict`. Metadata keeps the collector's existing refresh cadence; unchanged values are retained. Price histories are cached. Taiwan revenue is checked against the latest available source publication, not an invented daily/monthly value.

Only after every collector, data validation, and market-session freshness check succeeds are all data and `.github/data-refresh-status.json` committed together. XHKG/XSHG calendars account for separate exchange holidays. A same-day success checkpoint matching all data and pipeline hashes causes later attempts to skip collection, commit, push, and deployment. Failure or stale market dates do not certify success; the next attempt retries. A manual success before 21:03 does not suppress the evening refresh.

The completion checkpoint may produce one successful daily commit even when the underlying source values are unchanged. Later backups never push merely to record that they ran. Scheduled trigger times can be delayed by GitHub; a busy preceding attempt also delays the queued backup.

Use the `check_only` manual input on any of the three Actions to validate orchestration without collecting or publishing data. Run local regression tests with `python -m unittest discover -s tests -v`.

GitHub Pages deploys the static files using `.github/workflows/deploy-pages.yml`. The update workflow also dispatches deployment after its data commit, because pushes with `GITHUB_TOKEN` do not trigger a second workflow automatically. Site artifacts contain only the frontend and regional data.
