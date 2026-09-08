"""Check immutable engine/UI provenance and the standalone site's assets."""
import hashlib
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def main():
    manifest = json.loads((ROOT / 'docs/migration-source.json').read_text(encoding='utf-8'))
    for name in ('styles.css', 'scripts/update_market_rs.py', 'scripts/update_market_trend_score.py'):
        digest = hashlib.sha256((ROOT / name).read_bytes()).hexdigest()
        assert digest == manifest['unchangedFiles'][name], f'Upstream baseline changed: {name}'
    html = (ROOT / 'index.html').read_text(encoding='utf-8')
    for asset in re.findall(r'(?:src|href)="\./([^"?]+)', html):
        assert (ROOT / asset).is_file(), f'Missing asset: {asset}'
    assert 'data/market-rs-data.js' not in html
    js = (ROOT / 'dashboard.js').read_text(encoding='utf-8')
    assert 'const GITHUB_REPO_NAME = "EG-China-Dashboard";' in js
    assert 'const tabKey = requestedTab || "RS";' in js
    assert 'id="country-switch"' not in html
    for route in ('rs', 'trend-score', 'taiwan', 'china', 'hong-kong'):
        assert f'"{route}"' in js
    print('PASS: original scoring engines and CSS; local assets; regional routes and repository identity')


if __name__ == '__main__':
    main()
