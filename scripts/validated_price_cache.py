"""Reuse only prices verified in this refresh run and for this exact session."""
import json
import os


def scope():
    if os.getenv('EG_DATA_REFRESH_SCOPE'):
        return os.environ['EG_DATA_REFRESH_SCOPE']
    if os.getenv('GITHUB_RUN_ID'):
        return os.environ['GITHUB_RUN_ID'] + ':' + os.getenv('GITHUB_RUN_ATTEMPT', '1')
    return None


def read_current(path, expected, minimum):
    run_scope = scope()
    if not run_scope:
        return None
    try:
        data = json.loads(path.read_text(encoding='utf8'))
        if (data.get('_verified') == {'scope': run_scope, 'session': expected}
                and len(data['records']) >= minimum
                and data['records'][-1]['date'] == expected
                and data.get('priceSource')):
            return data
    except (OSError, ValueError, KeyError, TypeError):
        pass
    return None


def mark(data, expected):
    data['_verified'] = {'scope': scope(), 'session': expected}
    return data
