# EG China & HK & Taiwan Dashboard

Independent regional dashboard migrated from [EG Dashboard](https://tudoryoon.github.io/EG_Dashboard/#/taiwan/overview).

**Fixed UI/UX baseline:** identical to the original EG Dashboard. The original stylesheet, RS/Trend renderers, filters, tables, cards, charts, and interactions are reused. Regional naming, navigation scope, and repository identity are adapted. This decision is recorded in `AGENTS.md` for future work.

## Available views

| View | Route | Initial snapshot |
| --- | --- | --- |
| Taiwan monthly revenue | `#/taiwan/overview` (default) | Original Taiwan company data |
| Hong Kong RS | `#/taiwan/hong-kong-rs` | 582 securities, 2026-09-04 |
| Hong Kong Trend Score | `#/taiwan/hong-kong-trend` | Same regional universe |
| China RS | `#/taiwan/china-rs` | 803 securities, 2026-09-04 |
| China Trend Score | `#/taiwan/china-trend` | Same regional universe |

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

The regional workflow retains the original weekday schedules (18:35 and 19:20 KST), price cache, validation, and regional-only commits. Taiwan revenue can be refreshed with `python scripts/update_taiwan_revenue.py`.

GitHub Pages deploys the static files using `.github/workflows/deploy-pages.yml`. The update workflow also dispatches deployment after its data commit, because pushes with `GITHUB_TOKEN` do not trigger a second workflow automatically. Site artifacts contain only the frontend and regional data.
