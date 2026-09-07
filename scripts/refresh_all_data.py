"""Daily all-or-nothing refresh with a verifiable KST completion checkpoint."""
from __future__ import annotations

import argparse
from datetime import datetime, timedelta, timezone
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
KST = timezone(timedelta(hours=9))
STATUS_PATH = Path('.github/data-refresh-status.json')
DATA_FILES = ('data/dashboard-data.js',) + tuple(
    f'data/asia-{region}-{kind}.json'
    for region in ('hk', 'cn')
    for kind in ('constituents', 'metadata', 'screening')
)
PIPELINE_FILES = ('requirements.txt', 'scripts/refresh_all_data.py',
                  'scripts/update_asia_screening.py', 'scripts/update_market_rs.py',
                  'scripts/update_market_trend_score.py', 'scripts/update_taiwan_revenue.py',
                  'scripts/validate_asia_screening.py', 'scripts/validate_migration.py')


def hashes(root, names):
    return {name: hashlib.sha256((root / name).read_bytes()).hexdigest() for name in names}


def completed_today(root=ROOT, now=None):
    now = (now or datetime.now(KST)).astimezone(KST)
    try:
        record = json.loads((root / STATUS_PATH).read_text(encoding='utf-8'))
        completed = datetime.fromisoformat(record['completedAt']).astimezone(KST)
        return (record['schemaVersion'] == 1
                and record['kstDate'] == now.date().isoformat()
                and completed.date() == now.date()
                and completed <= now
                and (completed.hour, completed.minute) >= (21, 3)
                and record['dataHashes'] == hashes(root, DATA_FILES)
                and record['pipelineHashes'] == hashes(root, PIPELINE_FILES))
    except (OSError, ValueError, KeyError, TypeError):
        return False


def expected_session(calendar_name, now):
    import exchange_calendars as calendars
    import pandas as pd

    calendar = calendars.get_calendar(calendar_name)
    session = calendar.date_to_session(now.astimezone(KST).date().isoformat(), direction='previous')
    # Manual runs before the close cannot certify an unfinished session.
    if pd.Timestamp(now) < calendar.session_close(session) + pd.Timedelta(minutes=30):
        session = calendar.previous_session(session)
    return session.date().isoformat()


def validate_freshness(root=ROOT, now=None):
    now = now or datetime.now(KST)
    dates = {}
    for region, calendar in [('hk', 'XHKG'), ('cn', 'XSHG')]:
        payload = json.loads((root / f'data/asia-{region}-screening.json').read_text(encoding='utf-8'))
        expected = expected_session(calendar, now)
        actual = payload['rs']['updatedAt']
        if actual != expected or payload['trend']['updatedAt'] != expected:
            raise RuntimeError(f'{region}: expected completed session {expected}, received {actual}; retry needed')
        dates[region] = actual
    return dates


def validate_taiwan(root=ROOT):
    import update_taiwan_revenue as taiwan

    companies = taiwan.parse_js_payload((root / 'data/dashboard-data.js').read_text(encoding='utf-8'))
    names = {item['name']: item for item in companies}
    expected = set(taiwan.COMPANY_CODES) | set(taiwan.AGGREGATES)
    if not expected <= names.keys():
        raise RuntimeError('Taiwan company/aggregate coverage is incomplete')
    for name in expected:
        company = names[name]
        year, month = taiwan.parse_month_text(company['month'])
        index = taiwan.month_index(year, month)
        if index < 0 or index >= len(company['bars']) or company['bars'][index] is None:
            raise RuntimeError(f'Taiwan latest monthly revenue is missing: {name}')
        if any(len(company[key]) != len(company['bars']) for key in ('yoyLine', 'momLine')):
            raise RuntimeError(f'Taiwan history lengths differ: {name}')
    return {name: names[name]['month'] for name in taiwan.COMPANY_CODES}


def refresh(root=ROOT, now=None, run=None):
    started = now or datetime.now(KST)
    if completed_today(root, started):
        print('All data already refreshed today; no changes.')
        return False
    run = run or subprocess.run
    # BOTH collectors and ALL validators must pass before persisting success.
    for command in [
        ['scripts/update_asia_screening.py'],
        ['scripts/update_taiwan_revenue.py', '--strict'],
        ['scripts/validate_asia_screening.py'],
        ['scripts/validate_migration.py'],
    ]:
        run([sys.executable, *command], cwd=root, check=True)
    run(['node', '--check', 'dashboard.js'], cwd=root, check=True)
    dates = validate_freshness(root, started)
    months = validate_taiwan(root)
    completed = now or datetime.now(KST)
    if completed.astimezone(KST).date() != started.astimezone(KST).date():
        raise RuntimeError('Refresh crossed the KST date boundary; retry for the new date')
    record = {
        'schemaVersion': 1, 'kstDate': completed.astimezone(KST).date().isoformat(),
        'completedAt': completed.isoformat(), 'marketSessions': dates,
        'taiwanRevenueMonths': months, 'dataHashes': hashes(root, DATA_FILES),
        'pipelineHashes': hashes(root, PIPELINE_FILES),
        'runId': os.getenv('GITHUB_RUN_ID', 'local'),
    }
    destination = root / STATUS_PATH
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_suffix('.tmp')
    temporary.write_text(json.dumps(record, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    temporary.replace(destination)
    print('Every source refreshed and validated; ready for one atomic data commit.')
    return True


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('command', choices=['check', 'refresh'])
    args = parser.parse_args()
    if args.command == 'refresh':
        refresh()
        return
    skip = completed_today()
    if os.getenv('GITHUB_OUTPUT'):
        with open(os.environ['GITHUB_OUTPUT'], 'a', encoding='utf-8') as output:
            output.write(f'skip={str(skip).lower()}\n')
    print('Already complete today: skip update/push/deploy.' if skip else 'Refresh required; missing, stale, or changed checkpoint.')


if __name__ == '__main__':
    main()
