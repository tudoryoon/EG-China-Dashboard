"""Try one bounded repair after publication, retaining only a verified improvement."""
from __future__ import annotations

import argparse
from datetime import date
import json
import os
from pathlib import Path
import sys
import time

from collection_policy import failure_map, summarize_failures
import refresh_all_data as refresh
from retry_data_refresh import run_attempt

DEFAULT_DELAY_SECONDS = 300
DEFAULT_TIMEOUT_SECONDS = 20 * 60
SNAPSHOT_FILES = (*refresh.DATA_FILES, str(refresh.STATUS_PATH))


def output(updated):
    if os.getenv('GITHUB_OUTPUT'):
        with open(os.environ['GITHUB_OUTPUT'], 'a', encoding='utf8') as stream:
            stream.write(f'updated={str(updated).lower()}\n')


def describe(message):
    print(message, flush=True)
    if os.getenv('GITHUB_STEP_SUMMARY'):
        with open(os.environ['GITHUB_STEP_SUMMARY'], 'a', encoding='utf8') as stream:
            stream.write(f'\n{message}\n')


def read_state(root):
    record = json.loads((root / refresh.STATUS_PATH).read_text(encoding='utf8'))
    regional = {region: json.loads((root / f'data/asia-{region}-screening.json').read_text(encoding='utf8'))
                for region in ('hk', 'cn')}
    taiwan = json.loads((root / 'data/taiwan-collection-status.json').read_text(encoding='utf8'))
    actual = summarize_failures(regional, taiwan)
    failures = failure_map(record['collection']['failures'], 'checkpoint')
    if (failures != actual['failures'] or record['collection']['failureCount'] != actual['failureCount']):
        raise ValueError('Checkpoint and collection reports disagree')
    return record, regional, taiwan


def improvement(before, after):
    old, old_regions, _ = before
    new, new_regions, taiwan = after
    previous = set(old['collection']['failures'])
    remaining = set(new['collection']['failures'])
    if new['refreshDate'] != old['refreshDate']:
        raise ValueError('Repair crossed a refresh cycle')
    if not remaining < previous:
        raise ValueError('No strict improvement, or a previously successful security failed')
    for region in ('hk', 'cn'):
        if new['marketSessions'][region] != old['marketSessions'][region]:
            raise ValueError('Repair changed the completed market session')
        old_rows = {row['ticker']: row for row in old_regions[region]['rs']['rows']}
        new_rows = {row['ticker']: row for row in new_regions[region]['rs']['rows']}
        for ticker, row in old_rows.items():
            if ticker not in new_rows:
                raise ValueError(f'Repair removed a published security: {region}:{ticker}')
            if date.fromisoformat(new_rows[ticker]['asOfDate']) < date.fromisoformat(row['asOfDate']):
                raise ValueError(f'Repair regressed an observation date: {region}:{ticker}')
        for key in previous - remaining:
            market, ticker = key.split(':', 1)
            if market != region:
                continue
            row = new_rows.get(ticker)
            if (row is None or row.get('dataStatus') == 'stale'
                    or row.get('asOfDate') != new['marketSessions'][region]):
                raise ValueError(f'Removed failure has no fresh security: {key}')
    for name, month in old['taiwanRevenueMonths'].items():
        latest = new['taiwanRevenueMonths'].get(name)
        if latest is None or tuple(map(int, latest.split('/'))) < tuple(map(int, month.split('/'))):
            raise ValueError(f'Repair regressed a Taiwan revenue month: {name}')
    for key in previous - remaining:
        market, ticker = key.split(':', 1)
        if market == 'tw' and ticker not in taiwan['successful']:
            raise ValueError(f'Removed failure has no successful Taiwan response: {key}')
        if market not in ('hk', 'cn', 'tw'):
            raise ValueError(f'Unknown recovered market: {market}')
    return sorted(previous - remaining)


def restore(root, snapshot):
    # Restore exact bytes, including the already-published checkpoint. A failed
    # restoration must raise: allowing a subsequent push would risk partial data.
    for name, contents in snapshot.items():
        path = root / name
        temporary = path.with_suffix(path.suffix + '.repair-restore')
        temporary.write_bytes(contents)
        temporary.replace(path)


def repair(root=refresh.ROOT, delay_seconds=DEFAULT_DELAY_SECONDS,
           timeout_seconds=DEFAULT_TIMEOUT_SECONDS, run=run_attempt, sleep=time.sleep):
    if delay_seconds < 0 or timeout_seconds <= 0:
        raise ValueError('Delay must be nonnegative and timeout must be positive')
    output(False)
    try:
        if not refresh.completed_today(root):
            raise ValueError('The published checkpoint is not current and intact')
        before = read_state(root)
        if not before[0]['collection']['failures']:
            describe('No retained collection failures; no repair or additional push needed.')
            return False
        snapshot = {name: (root / name).read_bytes() for name in SNAPSHOT_FILES}
    except Exception as error:
        describe(f'Published-data repair skipped: {error}. Existing publication remains in place.')
        return False

    count = len(before[0]['collection']['failures'])
    describe(f'Initial data is published. Rechecking {count} collection failures once after {delay_seconds}s.')
    try:
        sleep(delay_seconds)
        # Same-run successful quote and Taiwan caches remain available. Failed
        # sources get one more opportunity, without a new workflow dispatch.
        status = run([sys.executable, str(root / 'scripts/refresh_all_data.py'), 'refresh', '--force'],
                     timeout_seconds)
        if status != 0:
            raise RuntimeError(f'Bounded repair exited {status}')
        if not refresh.completed_today(root):
            raise ValueError('Repaired checkpoint does not match the current cycle, data and pipeline')
        recovered = improvement(before, read_state(root))
        describe(f'Recovered {len(recovered)} securities without new failures or older observations; ready for one additional publication.')
        output(True)
    except Exception as error:
        restore(root, snapshot)
        describe(f'No additional publication: {error}. Restored the exact published data and checkpoint.')
        return False
    return True


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--delay-seconds', type=float, default=DEFAULT_DELAY_SECONDS)
    parser.add_argument('--timeout-seconds', type=float, default=DEFAULT_TIMEOUT_SECONDS)
    args = parser.parse_args()
    repair(delay_seconds=args.delay_seconds, timeout_seconds=args.timeout_seconds)


if __name__ == '__main__':
    main()
