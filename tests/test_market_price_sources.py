from pathlib import Path
import sys
import unittest
from unittest.mock import Mock, patch
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
import market_price_sources as sources


class PriceSourceTests(unittest.TestCase):
    def payload(self, key='day', symbol='hk03033'):
        return {'code': 0, 'data': {symbol: {'qt': {symbol: ['100', 'ETF', symbol[2:]]}, key: [
            ['2026-09-07', '4.48', '4.438', '4.482', '4.424', '1460273673'],
            ['2026-09-08', '4.42', '4.372', '4.43', '4.366', '1714197519'],
            ['2026-09-09', '4.4', '4.4', '4.4', '4.4', '100']]}}}

    def test_identity_adjustment_and_unfinished_session(self):
        result = sources.parse_tencent(self.payload(), '3033.HK', 'qfq', '2026-09-08')
        self.assertEqual(len(result['records']), 2)
        self.assertEqual(result['records'][-1]['close'], 4.372)
        qfq = sources.parse_tencent(self.payload('qfqday'), '3033.HK', 'qfq', '2026-09-08')
        self.assertEqual(result, qfq)
        with self.assertRaises(ValueError):
            sources.parse_tencent(self.payload(symbol='hk03109'), '3033.HK', '', '2026-09-08')

    def test_invalid_and_duplicate_quotes_fail(self):
        for values in (['2026-09-08', '4', 'nan', '4', '4', '1'], ['2026-09-08', '4', '5', '4', '4', '1']):
            p = self.payload();p['data']['hk03033']['day'] = [values]
            with self.assertRaises(ValueError):
                sources.parse_tencent(p, '3033.HK', '', '2026-09-08')
        p = self.payload();p['data']['hk03033']['day'] *= 2
        with self.assertRaises(ValueError):
            sources.parse_tencent(p, '3033.HK', '', '2026-09-08')

    def test_stale_successful_response_falls_back(self):
        stale = {'records': [{'date': '2026-09-07'}] * 500}
        current = {'records': [{'date': '2026-09-08'}] * 500}
        self.assertIs(sources.current_source('^HSI', '2026-09-08', [('stale', lambda: stale), ('current', lambda: current)]), current)
        with self.assertRaises(RuntimeError):
            sources.current_source('^HSI', '2026-09-08', [('stale', lambda: stale)])

    def test_network_failure_falls_back_and_all_failures_raise(self):
        broken = Mock(side_effect=ConnectionError('closed abruptly'))
        current = {'records': [{'date': '2026-09-08'}] * 500}
        self.assertIs(sources.current_source('000906', '2026-09-08', [('broken', broken), ('current', lambda: current)]), current)
        with self.assertRaises(RuntimeError):
            sources.current_source('000906', '2026-09-08', [('broken', broken)])

    def test_adjusted_history_start_can_differ_but_internal_gap_cannot(self):
        raw = self.payload(symbol='sh588200')
        adj = self.payload('qfqday', 'sh588200')
        adj['data']['sh588200']['qfqday'] = adj['data']['sh588200']['qfqday'][1:]
        get = Mock(side_effect=[Mock(json=lambda: raw), Mock(json=lambda: adj)])
        with patch.object(sources, 'require_current', side_effect=lambda payload, expected: payload):
            result = sources.tencent_history('588200.SS', '2026-09-09', get)
        self.assertEqual(len(result['records']), 2)
        self.assertEqual(result['priceSource']['provider'], 'Tencent')
        self.assertEqual(result['records'][0]['volume'], 171419751900)
        adj = self.payload('qfqday', 'sh588200');del adj['data']['sh588200']['qfqday'][1]
        get = Mock(side_effect=[Mock(json=lambda: raw), Mock(json=lambda: adj)])
        with self.assertRaises(ValueError):
            sources.tencent_history('588200.SS', '2026-09-09', get)
