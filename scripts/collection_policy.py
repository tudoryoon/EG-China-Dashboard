"""Disclose individual collection failures without delaying usable updates."""
from datetime import datetime

FAILURE_POLICY = 'retain-and-publish'


def failure_map(value, label):
    if not isinstance(value, dict) or any(
        not isinstance(key, str) or not key or not isinstance(error, str) or not error.strip()
        for key, error in value.items()
    ):
        raise ValueError(f'{label}: malformed collection failure report')
    return value


def validate_taiwan_report(report):
    if report.get('schemaVersion') != 1:
        raise ValueError('Taiwan: unsupported collection report')
    checked = datetime.fromisoformat(report['checkedAt'])
    if checked.tzinfo is None:
        raise ValueError('Taiwan: collection report requires a timezone')
    failed = failure_map(report['failures'], 'Taiwan')
    retained, successful = report['retained'], report['successful']
    if (not isinstance(retained, list) or not isinstance(successful, list)
            or any(not isinstance(code, str) or not code.isdecimal() for code in retained + successful)
            or len(retained) != len(set(retained)) or len(successful) != len(set(successful))
            or set(retained) != set(failed) or set(retained) & set(successful)):
        raise ValueError('Taiwan: inconsistent collection coverage')
    return failed


def summarize_failures(regional, taiwan_report=None):
    failures = {}
    for region, payload in regional.items():
        for ticker, error in failure_map(payload['meta']['missing'], region).items():
            failures[f'{region}:{ticker}'] = error
    if taiwan_report is not None:
        for code, error in validate_taiwan_report(taiwan_report).items():
            failures[f'tw:{code}'] = error
    return {'failurePolicy': FAILURE_POLICY, 'failureCount': len(failures),
            'failures': failures, 'retry': 'next-refresh-cycle'}
