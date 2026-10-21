"""The daily STAR50 collector must work without third-party quote gateways."""
from copy import deepcopy
from datetime import date, timedelta
import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import Mock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
import market_price_sources as sources


def official_payload():
    rows = [[int((date(2024, 1, 1) + timedelta(days=i)).strftime('%Y%m%d')),
             100, 103, 98, 101, 2000, 202000] for i in range(400)]
    rows += [[20261020, 1319.657, 1355.196, 1309.865, 1342.424, 8033098, 75266390709],
             [20261021, 1342.4243, 1342.4243, 1342.4243, 1342.4243, 0, 0]]
    return {'code': '000688', 'total': len(rows), 'kline': rows}


class OfficialSTAR50Tests(unittest.TestCase):
    def parse(self, payload):
        return sources.sse_star50_history('2026-10-20', Mock(return_value=Mock(json=lambda: payload)))

    def test_completed_official_ohlcv_excludes_unfinished_later_bar(self):
        get = Mock(return_value=Mock(json=official_payload))
        data = sources.sse_star50_history('2026-10-20', get)
        self.assertEqual(len(data['records']), 401)
        self.assertEqual(data['records'][-1], {'date': '2026-10-20', 'open': 1319.657,
            'high': 1355.196, 'low': 1309.865, 'close': 1342.424, 'adjClose': 1342.424,
            'volume': 8033098})
        self.assertEqual(data['priceSource']['provider'], 'Shanghai Stock Exchange')
        get.assert_called_once_with(sources.SSE_STAR50_URL, params={'begin': -1000, 'end': -1})

    def test_wrong_index_stale_and_short_histories_are_rejected(self):
        source = official_payload()
        for payload in [{**source, 'code': '000001'},
                        {**source, 'kline': source['kline'][:-2]},
                        {**source, 'kline': source['kline'][-3:]}]:
            with self.subTest(code=payload['code'], length=len(payload['kline'])), self.assertRaises(ValueError):
                self.parse(payload)

    def test_invalid_duplicate_or_out_of_order_bars_are_rejected(self):
        for change in ('duplicate', 'order', 'date', 'shape', 'range', 'nan', 'volume'):
            p = deepcopy(official_payload())
            if change == 'duplicate': p['kline'].insert(1, p['kline'][0])
            elif change == 'order': p['kline'][0], p['kline'][1] = p['kline'][1], p['kline'][0]
            elif change == 'date': p['kline'][0][0] = 20261301
            elif change == 'shape': p['kline'][0] = [20240101, 100]
            elif change == 'range': p['kline'][0][4] = 104
            elif change == 'nan': p['kline'][0][4] = float('nan')
            elif change == 'volume': p['kline'][0][5] = -1
            with self.subTest(change=change), self.assertRaises(ValueError):
                self.parse(p)


HAS_DEPS = all(importlib.util.find_spec(name) for name in ('pandas', 'yfinance', 'curl_cffi'))
if HAS_DEPS:
    import update_asia_screening as screening


@unittest.skipUnless(HAS_DEPS, 'Requires collector dependencies')
class STAR50CollectorTests(unittest.TestCase):
    def test_normal_collector_uses_exchange_before_unavailable_gateways(self):
        with tempfile.TemporaryDirectory() as directory, \
                patch.object(screening, 'CACHE', Path(directory)), \
                patch.object(screening, 'completed_session', return_value='2026-10-20'), \
                patch.object(screening, 'get', return_value=Mock(json=official_payload)), \
                patch.object(screening, 'tencent_history', side_effect=ConnectionError('HTTP 501')) as gateway:
            result = screening.index_chart('000688.SS')
            written = json.loads((Path(directory) / '000688.SS.json').read_text(encoding='utf8'))
        gateway.assert_not_called()
        self.assertEqual(written, result)
        self.assertEqual(result['records'][-1]['date'], '2026-10-20')
        self.assertEqual(result['priceSource']['url'], sources.SSE_STAR50_URL)

    def test_unavailable_exchange_keeps_validated_gateway_fallback(self):
        fresh = sources.sse_star50_history('2026-10-20', Mock(return_value=Mock(json=official_payload)))
        fresh['priceSource'] = {'provider': 'Tencent', 'url': sources.TENCENT_URL}
        with tempfile.TemporaryDirectory() as directory, \
                patch.object(screening, 'CACHE', Path(directory)), \
                patch.object(screening, 'completed_session', return_value='2026-10-20'), \
                patch.object(screening, 'get', side_effect=ConnectionError('exchange unavailable')), \
                patch.object(screening, 'tencent_history', return_value=fresh) as gateway, \
                patch.object(sources, '_TENCENT_CIRCUIT', sources.ProviderCircuitBreaker(clock=lambda: 0)):
            result = screening.index_chart('000688.SS')
        gateway.assert_called_once()
        self.assertEqual(result['priceSource']['provider'], 'Tencent')
        self.assertEqual(result['records'][-1]['date'], '2026-10-20')
