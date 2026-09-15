"""Parse active HSCI members, excluding residual/dummy API rows."""
from corporate_actions import canonical_hk_member


def parse_hsci(data):
    indexes = [index for series in data['indexSeriesList']
               if series.get('seriesCode') == 'hsci'
               for index in series['indexList']
               if index.get('indexName') == 'Hang Seng Composite Index']
    if len(indexes) != 1:
        raise ValueError('HSCI: expected exactly one composite index')
    item = indexes[0]
    raw = item['constituentContent']
    # The live feed can retain blank-flag rows after an index review. Only
    # explicit non-dummy rows count toward constituentsCount (580 on 2026-09-08).
    active = [row for row in raw if row.get('isDummy') == 'N']
    expected = int(item['constituentsCount'])
    if len(active) != expected or expected < 400:
        raise ValueError(f'HSCI: expected {expected} active members, received '
                         f'{len(active)} from {len(raw)} rows; refusing incomplete universe')
    members = {}
    for row in active:
        code = str(row['code'])
        if not code.isdecimal() or not 0 < int(code) < 100000 or not row.get('constituentName'):
            raise ValueError(f'HSCI: invalid active constituent code/name: {code}')
        symbol = str(int(code)).zfill(4) + '.HK'
        member = canonical_hk_member(symbol, row['constituentName'], data.get('requestDate'))
        symbol = member['ticker']
        if symbol in members:
            raise ValueError(f'HSCI: duplicate active constituent {symbol}')
        members[symbol] = {**member, 'groups': ['HSCI']}
    return members, {'reportedCount': expected, 'rawCount': len(raw),
                     'excludedCodes': [str(row.get('code', '')) for row in raw if row.get('isDummy') != 'N']}
