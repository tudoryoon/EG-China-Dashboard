# EG China & HK & Taiwan Dashboard — fixed project rules

## User decisions (2026-09-07)

- This repository is the independent China & Hong Kong & Taiwan dashboard.
- **UI/UX must remain identical to EG Dashboard**: https://tudoryoon.github.io/EG_Dashboard/#/taiwan/overview . This is a fixed default, not an invitation to redesign.
- Preserve the original typography, colors, spacing, tabs, cards, tables, filters, charts, responsive behavior, and interactions. Reuse the original CSS and renderers. Changes to this rule require an explicit user request.
- First migration: existing Hong Kong and China RS and Trend Score, their data and update workflow, plus the existing Taiwan revenue overview. Taiwan equity RS is not in the source and has not been invented here.
- Keep the reference EG_Dashboard repository unchanged when working on this repository.

## Calculations and data

- Use `scripts/update_asia_screening.py`, which calls the original `update_market_rs.py` and `update_market_trend_score.py` engines. Do not independently approximate the formulas.
- Rank Hong Kong and China equities independently in local currency. ETFs are tracked but excluded from equity RS rankings. Shared market-cap filters use USD; chart prices remain HKD/CNY.
- Hong Kong uses the explicitly disclosed HSI fallback for unavailable HSCI history. China uses CSI800. Preserve missing observations and holiday handling.
- Regional data stays in `data/asia-*.json`; do not introduce the US universe.
- Preserve the `#/taiwan/overview`, `hong-kong-rs`, `hong-kong-trend`, `china-rs`, and `china-trend` routes.
- Run `python scripts/validate_asia_screening.py`, `python scripts/validate_migration.py`, and `node --check dashboard.js` before publishing. Check all five views in a browser after UI changes.
- `docs/migration-source.json` records the source commit and unchanged baseline hashes. Update provenance deliberately when importing future upstream changes; daily data refreshes may naturally change snapshot hashes.

## Delivery

- Daily data refresh is scheduled through three Actions at **21:03, 21:10, 21:17 KST**, every day. All three call the same workflow and share a queued concurrency lock; read `main` after acquiring the lock.
- Refresh Hong Kong/China screening and Taiwan revenue together. Publish only after all collectors and validators succeed. A complete same-day checkpoint matching the data and pipeline hashes suppresses later collection, commits, pushes, and deployments. Failed or stale refreshes must leave later retries enabled.
- Do not replace this with three unguarded push jobs. Run `python -m unittest discover -s tests -v` for schedule/refresh changes.

- Carry over the source project's authorized workflow: validate, create a scoped commit, and normally push to `origin/main` without asking again. Respect explicit no-push or review-only requests. Never force-push.
- Deployment uses this repository's GitHub Pages. Only the regional refresh workflow is migrated; do not enable unrelated US-market jobs.
