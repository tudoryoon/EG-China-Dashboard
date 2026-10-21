"""Corporate-action regressions use real event boundary prices, offline."""
from copy import deepcopy
from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from corporate_actions import normalize_equity_history


class RealordSplitTests(unittest.TestCase):
    def setUp(self):
        self.payload = {
            'name': '伟禄科技股份',
            'priceSource': {'provider': 'Tencent', 'symbol': 'hk01196'},
            'records': [
                {'date': '2026-09-10', 'open': 10.88, 'high': 10.88, 'low': 10.0,
                 'close': 10.43, 'adjClose': 10.43, 'volume': 9470509.0},
                {'date': '2026-09-11', 'open': 10.35, 'high': 11.19, 'low': 9.555,
                 'close': 10.85, 'adjClose': 10.85, 'volume': 10699620.0},
                {'date': '2026-09-14', 'open': 2.7, 'high': 3.19, 'low': 2.56,
                 'close': 2.88, 'adjClose': 2.88, 'volume': 34538000.0},
            ],
        }

    def test_missing_split_is_normalized_once_without_false_crash(self):
        original = deepcopy(self.payload)
        fixed = normalize_equity_history('1196.HK', self.payload, '2026-09-14')
        self.assertEqual(self.payload, original)
        before, after = fixed['records'][-2:]
        self.assertEqual(before['close'], 2.7125)
        self.assertEqual(before['adjClose'], 2.7125)
        self.assertEqual(before['volume'], 42798480.0)
        self.assertEqual(before['rawClose'], 10.85)
        self.assertEqual(before['rawVolume'], 10699620.0)
        self.assertEqual(after, original['records'][-1])
        self.assertAlmostEqual((after['adjClose'] / before['adjClose'] - 1) * 100, 6.1751152074)
        self.assertEqual(normalize_equity_history('1196.HK', fixed, '2026-09-14'), fixed)

    def test_provider_qfq_already_split_adjusted_is_not_divided_again(self):
        for row in self.payload['records'][:-1]:
            row['adjClose'] *= 0.25
        fixed = normalize_equity_history('1196.HK', self.payload, '2026-09-14')
        self.assertEqual(fixed['records'][-2]['adjClose'], 2.7125)
        self.assertTrue(fixed['priceSource']['corporateActions'][0]['providerQfqAlreadyAdjusted'])

    def test_provider_rounding_does_not_trigger_a_second_split(self):
        for row in self.payload['records'][:-1]:
            row['adjClose'] = round(row['adjClose'] * 0.25, 3)
        self.payload['records'][-2]['adjClose'] = 2.713
        fixed = normalize_equity_history('1196.HK', self.payload, '2026-09-14')
        self.assertEqual(fixed['records'][-2]['adjClose'], 2.713)

    def test_ambiguous_raw_or_adjusted_scale_is_rejected(self):
        self.payload['records'][-2]['adjClose'] *= 0.5
        with self.assertRaisesRegex(ValueError, 'ambiguous qfq/raw'):
            normalize_equity_history('1196.HK', self.payload, '2026-09-14')
        self.payload['records'][-2]['close'] *= 0.25
        with self.assertRaisesRegex(ValueError, 'unknown/missing raw'):
            normalize_equity_history('1196.HK', self.payload, '2026-09-14')

    def test_missing_anchor_or_post_split_history_is_rejected(self):
        del self.payload['records'][-1]
        with self.assertRaisesRegex(ValueError, 'no post-split'):
            normalize_equity_history('1196.HK', self.payload, '2026-09-14')
        del self.payload['records'][-1]
        with self.assertRaisesRegex(ValueError, 'unknown/missing raw'):
            normalize_equity_history('1196.HK', self.payload, '2026-09-14')

    def test_other_security_or_pre_event_data_is_unchanged(self):
        self.assertIs(normalize_equity_history('0700.HK', self.payload, '2026-09-14'), self.payload)
        self.assertIs(normalize_equity_history('1196.HK', self.payload, '2026-09-11'), self.payload)

    def test_wrong_issuer_or_provider_is_rejected(self):
        self.payload['name'] = 'Different Issuer'
        with self.assertRaisesRegex(ValueError, 'unexpected issuer'):
            normalize_equity_history('1196.HK', self.payload, '2026-09-14')
        self.payload['priceSource']['provider'] = 'Yahoo Finance'
        with self.assertRaisesRegex(ValueError, 'requires Tencent'):
            normalize_equity_history('1196.HK', self.payload, '2026-09-14')

    def test_verified_new_share_aliases_keep_split_and_identity_guards(self):
        for name in ('伟禄科技股份-新', '偉祿科技股份-新'):
            with self.subTest(name=name):
                payload = deepcopy(self.payload)
                payload['name'] = name
                fixed = normalize_equity_history('1196.HK', payload, '2026-09-29')
                self.assertEqual(fixed['records'][-2]['close'], 2.7125)
                self.assertEqual(fixed['records'][-2]['rawClose'], 10.85)
                self.assertEqual(fixed['records'][-1]['close'], 2.88)
                payload['records'][-2]['close'] = 9.0
                with self.assertRaisesRegex(ValueError, 'unknown/missing raw'):
                    normalize_equity_history('1196.HK', payload, '2026-09-29')
        for name in ('Different Issuer-新', '伟禄科技股份-其他', '伟禄科技股份新'):
            self.payload['name'] = name
            with self.subTest(name=name), self.assertRaisesRegex(ValueError, 'unexpected issuer'):
                normalize_equity_history('1196.HK', self.payload, '2026-09-29')


class HesaiSplitTests(unittest.TestCase):
    def setUp(self):
        self.payload = {
            'name': 'Hesai Group',
            'priceSource': {'provider': 'Tencent', 'symbol': 'hk02525'},
            'records': [
                {'date': '2026-07-09', 'open': 130.0, 'high': 132.0, 'low': 127.0,
                 'close': 128.8, 'adjClose': 128.8, 'volume': 1112378.0},
                {'date': '2026-07-10', 'open': 16.53, 'high': 17.17, 'low': 15.64,
                 'close': 16.57, 'adjClose': 16.57, 'volume': 2640331.0},
            ],
        }

    def test_unadjusted_qfq_is_normalized_once(self):
        original = deepcopy(self.payload)
        fixed = normalize_equity_history('2525.HK', self.payload, '2026-10-20')
        self.assertEqual(self.payload, original)
        self.assertEqual(fixed['records'][0]['close'], 16.1)
        self.assertEqual(fixed['records'][0]['adjClose'], 16.1)
        self.assertEqual(fixed['records'][0]['volume'], 8899024.0)
        self.assertEqual(fixed['records'][0]['rawClose'], 128.8)
        self.assertEqual(fixed['records'][1], original['records'][1])
        self.assertEqual(normalize_equity_history('2525.HK', fixed, '2026-10-20'), fixed)

    def test_already_adjusted_qfq_and_wrong_anchor(self):
        self.payload['records'][0]['adjClose'] = 16.1
        fixed = normalize_equity_history('2525.HK', self.payload, '2026-10-20')
        self.assertEqual(fixed['records'][0]['adjClose'], 16.1)
        self.assertTrue(fixed['priceSource']['corporateActions'][0]['providerQfqAlreadyAdjusted'])
        self.payload['records'][0]['close'] = 100.0
        with self.assertRaisesRegex(ValueError, 'unknown or missing raw'):
            normalize_equity_history('2525.HK', self.payload, '2026-10-20')


if __name__ == '__main__':
    unittest.main()
