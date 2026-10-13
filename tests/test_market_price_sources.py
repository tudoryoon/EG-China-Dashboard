from pathlib import Path
import sys
import unittest
from unittest.mock import Mock, patch
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
import market_price_sources as sources


class PriceSourceTests(unittest.TestCase):
    def test_star50_symbol_mapping(self):
        self.assertEqual(sources.tencent_symbol('000688.SS'), 'sh000688')
        self.assertEqual(sources.INDEX_SECIDS['000688.SS'], '1.000688')
        self.assertEqual(sources.INDEX_SECIDS['^HSI'], '100.HSI')

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

    def test_eastmoney_star50_identity_freshness_and_ohlcv(self):
        lines = [f'2024-01-{day:02d},100,101,102,99,1000,100000' for day in range(1, 29)] * 15
        lines[-1] = '2026-09-08,1200,1210,1220,1190,2000,2000000'
        response = Mock(json=lambda: {'data': {'code': '000688', 'name': 'STAR 50', 'klines': lines}})
        result = sources.eastmoney_index_history('000688.SS', '2026-09-08', Mock(return_value=response))
        self.assertEqual(result['records'][-1]['date'], '2026-09-08')
        self.assertEqual(result['records'][-1]['adjClose'], 1210)
        self.assertEqual(result['priceSource']['provider'], 'Eastmoney')
        wrong = Mock(json=lambda: {'data': {'code': '000300', 'klines': lines}})
        with self.assertRaises(ValueError):
            sources.eastmoney_index_history('000688.SS', '2026-09-08', Mock(return_value=wrong))

        hsi = Mock(json=lambda: {'data': {'code': 'HSI', 'name': 'Hang Seng Index', 'klines': lines}})
        result = sources.eastmoney_index_history('^HSI', '2026-09-08', Mock(return_value=hsi))
        self.assertEqual(result['records'][-1]['date'], '2026-09-08')

    def test_tencent_equity_keeps_raw_ohlc_and_uses_adjusted_close(self):
        raw = self.payload(symbol='sh600519')
        adjusted = self.payload('qfqday', 'sh600519')
        adjusted['data']['sh600519']['qfqday'][-1][1:5] = ['3.96', '3.96', '3.96', '3.96']
        get = Mock(side_effect=[Mock(json=lambda: raw), Mock(json=lambda: adjusted)])
        result = sources.tencent_equity_history('600519.SS', '2026-09-09', get)
        self.assertEqual(result['records'][-1]['close'], 4.4)
        self.assertEqual(result['records'][-1]['adjClose'], 3.96)
        self.assertEqual(result['records'][-1]['volume'], 10000)
        self.assertEqual(result['priceSource']['provider'], 'Tencent')

        adjusted['data']['sh600519']['qfqday'].pop(1)
        get = Mock(side_effect=[Mock(json=lambda: raw), Mock(json=lambda: adjusted)])
        with self.assertRaises(ValueError):
            sources.tencent_equity_history('600519.SS', '2026-09-09', get)

    def test_tencent_mirror_keeps_identity_adjustment_and_source_url(self):
        raw = self.payload(symbol='sz300308')
        adjusted = self.payload('qfqday', 'sz300308')
        get = Mock(side_effect=[Mock(json=lambda: raw), Mock(json=lambda: adjusted)])
        result = sources.tencent_equity_history('300308.SZ', '2026-09-09', get, sources.TENCENT_MIRROR_URL)
        self.assertEqual(result['priceSource']['url'], sources.TENCENT_MIRROR_URL)
        self.assertEqual(result['priceSource']['symbol'], 'sz300308')
        self.assertEqual(result['records'][-1]['date'], '2026-09-09')
        self.assertEqual([call.args[0] for call in get.call_args_list], [sources.TENCENT_MIRROR_URL] * 2)
        with self.assertRaisesRegex(ValueError, 'Wrong Tencent security'):
            sources.tencent_equity_history('688072.SS', '2026-09-09',
                Mock(return_value=Mock(json=lambda: raw)), sources.TENCENT_MIRROR_URL)

    def test_eastmoney_equity_keeps_raw_close_and_coherent_adjustment(self):
        raw = {'data': {'code': '000001', 'market': 0, 'name': 'Sample', 'klines': [
            '2026-10-09,11.78,11.59,11.89,11.58,1078106',
            '2026-10-12,11.62,11.73,11.83,11.62,1058635']}}
        adjusted = {'data': {**raw['data'], 'klines': [
            '2026-10-09,11.78,11.57,11.89,11.56,1078106',
            '2026-10-12,11.62,11.73,11.83,11.62,1058635']}}
        get = Mock(side_effect=[Mock(json=lambda: raw), Mock(json=lambda: adjusted)])
        result = sources.eastmoney_equity_history('000001.SZ', '2026-10-12', get)
        self.assertEqual([r['date'] for r in result['records']], ['2026-10-09', '2026-10-12'])
        self.assertEqual(result['records'][0]['close'], 11.59)
        self.assertEqual(result['records'][0]['adjClose'], 11.57)
        self.assertEqual(result['records'][-1]['volume'], 105863500)
        self.assertEqual(result['priceSource']['secid'], '0.000001')
        self.assertEqual(result['priceSource']['provider'], 'Eastmoney')
        self.assertEqual(get.call_args_list[0].kwargs['params']['end'], '20261012')

        wrong = {'data': {**raw['data'], 'code': '000002'}}
        with self.assertRaises(ValueError):
            sources.eastmoney_equity_history('000001.SZ', '2026-10-12',
                                             Mock(return_value=Mock(json=lambda: wrong)))
        gap = {'data': {**adjusted['data'], 'klines': adjusted['data']['klines'][:1]}}
        with self.assertRaises(ValueError):
            sources.eastmoney_equity_history('000001.SZ', '2026-10-12',
                                             Mock(side_effect=[Mock(json=lambda: raw), Mock(json=lambda: gap)]))

    def test_eastmoney_hong_kong_identity_and_volume(self):
        data = {'data': {'code': '03355', 'market': 116, 'name': 'Sample',
                         'klines': ['2026-10-12,32.02,33.30,37.00,32.02,213900']}}
        result = sources.eastmoney_equity_history('3355.HK', '2026-10-12',
                                                  Mock(return_value=Mock(json=lambda: data)))
        self.assertEqual(result['records'][-1]['volume'], 213900)
        self.assertEqual(result['priceSource']['secid'], '116.03355')
        bad = {'data': {**data['data'], 'market': 0}}
        with self.assertRaises(ValueError):
            sources.eastmoney_equity_history('3355.HK', '2026-10-12',
                                             Mock(return_value=Mock(json=lambda: bad)))
