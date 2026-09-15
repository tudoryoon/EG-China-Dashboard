"""Offline coverage of the September 2026 HSCI feed failure."""
from copy import deepcopy
from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from hsci_constituents import parse_hsci


class HSCIParserTests(unittest.TestCase):
    def setUp(self):
        self.rows = [{'code': str(i), 'constituentName': f'Company {i}', 'isDummy': 'N'}
                     for i in range(1, 581)]
        self.item = {'indexName': 'Hang Seng Composite Index', 'constituentsCount': 580,
                     'constituentContent': self.rows}
        self.payload = {'indexSeriesList': [{'seriesCode': 'hsci', 'indexList': [self.item]}]}

    def test_review_residual_rows_do_not_break_complete_universe(self):
        self.rows.extend([{'code': '1475', 'isDummy': ''}, {'code': '6603', 'isDummy': ''}])
        members, info = parse_hsci(self.payload)
        self.assertEqual(len(members), 580)
        self.assertNotIn('1475.HK', members)
        self.assertEqual(info['excludedCodes'], ['1475', '6603'])
        self.assertEqual(info['rawCount'], 582)

    def test_missing_active_member_still_fails(self):
        self.rows.pop()
        with self.assertRaisesRegex(ValueError, 'expected 580 active members, received 579'):
            parse_hsci(self.payload)

    def test_duplicate_and_invalid_symbols_fail(self):
        for code in ('1', 'bad', '0'):
            payload = deepcopy(self.payload)
            payload['indexSeriesList'][0]['indexList'][0]['constituentContent'][-1]['code'] = code
            with self.assertRaises(ValueError):
                parse_hsci(payload)

    def test_selects_named_index_instead_of_first_item(self):
        self.payload['indexSeriesList'].insert(0, {'seriesCode': 'other', 'indexList': []})
        self.payload['indexSeriesList'][1]['indexList'].insert(0, {'indexName': 'Other'})
        self.assertEqual(len(parse_hsci(self.payload)[0]), 580)

    def test_unknown_flags_do_not_silently_pass(self):
        self.rows[-1]['isDummy'] = 'unknown'
        with self.assertRaises(ValueError):
            parse_hsci(self.payload)

    def test_temporary_realord_counter_preserves_canonical_history_identity(self):
        self.payload['requestDate'] = '2026-09-14 00:05:12'
        self.rows[-1].update(code='2922', constituentName='REALORD TECH')
        members, info = parse_hsci(self.payload)
        self.assertEqual(len(members), info['reportedCount'])
        self.assertNotIn('2922.HK', members)
        self.assertEqual(members['1196.HK']['sourceTicker'], '2922.HK')
        self.assertEqual(members['1196.HK']['aliases'], ['2922.HK'])

    def test_canonical_alias_collision_and_wrong_issuer_fail(self):
        self.payload['requestDate'] = '2026-09-14 00:05:12'
        self.rows[-1].update(code='2922', constituentName='REALORD TECH')
        self.rows[-2].update(code='1196', constituentName='REALORD TECH')
        with self.assertRaisesRegex(ValueError, 'duplicate active constituent 1196.HK'):
            parse_hsci(self.payload)
        self.rows[-2]['code'] = '579'
        self.rows[-1]['constituentName'] = 'Different Issuer'
        with self.assertRaisesRegex(ValueError, 'unexpected issuer'):
            parse_hsci(self.payload)

    def test_temporary_mapping_is_date_bounded(self):
        self.rows[-1].update(code='2922', constituentName='Different Issuer')
        for day in ('2026-09-11', '2026-10-21'):
            self.payload['requestDate'] = day
            members, _ = parse_hsci(self.payload)
            self.assertIn('2922.HK', members)
            self.assertNotIn('1196.HK', members)
        self.payload.pop('requestDate')
        with self.assertRaisesRegex(ValueError, 'valid requestDate'):
            parse_hsci(self.payload)
