from copy import deepcopy
import importlib.util
import json
from pathlib import Path
import sys
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from collection_policy import summarize_failures, validate_taiwan_report
from validate_asia_screening import validate_region
import refresh_all_data as refresh

HAS_TAIWAN_DEPENDENCIES = all(importlib.util.find_spec(module) for module in ('pandas', 'requests'))
if HAS_TAIWAN_DEPENDENCIES:
    import update_taiwan_revenue as taiwan


@unittest.skipUnless(HAS_TAIWAN_DEPENDENCIES, 'Requires Taiwan data dependencies')
class TaiwanPublicationValidationTests(unittest.TestCase):
    def setUp(self):
        self.companies = [
            {'name': name, 'month': '21/01', 'bars': [1.0], 'yoyLine': [None], 'momLine': [None]}
            for name in ('A', 'B')
        ]
        self.report = {'schemaVersion': 1, 'checkedAt': '2026-09-15T11:00:00+09:00',
                       'failures': {}, 'retained': [], 'successful': ['2330', '2303']}

    def validate(self):
        payload = 'window.dashboardCompanies = ' + json.dumps(self.companies) + ';'
        report = json.dumps(self.report)

        def read(path, *args, **kwargs):
            return report if path.name == 'taiwan-collection-status.json' else payload

        with patch.object(Path, 'read_text', read), \
             patch.object(taiwan, 'COMPANY_CODES', {'A': '2330', 'B': '2303'}), \
             patch.object(taiwan, 'AGGREGATES', {}):
            return refresh.validate_taiwan(Path('.'))

    def retain(self):
        self.report.update(failures={'2330': 'offline'}, retained=['2330'], successful=['2303'])
        self.companies[0].update(dataStatus='stale', collectionError='offline',
                                 sourceCheckedAt=self.report['checkedAt'])

    def test_complete_and_disclosed_partial_attempts_pass(self):
        self.assertEqual(self.validate(), {'A': '21/01', 'B': '21/01'})
        self.retain()
        self.assertEqual(self.validate(), {'A': '21/01', 'B': '21/01'})

    def test_retained_company_requires_this_attempts_exact_timestamp(self):
        self.retain()
        for checked_at in (None, '2026-09-14T11:00:00+09:00', '2026-09-15T11:01:00+09:00'):
            with self.subTest(checked_at=checked_at):
                self.companies[0]['sourceCheckedAt'] = checked_at
                with self.assertRaisesRegex(RuntimeError, 'failure is not disclosed'):
                    self.validate()
        del self.companies[0]['sourceCheckedAt']
        with self.assertRaisesRegex(RuntimeError, 'failure is not disclosed'):
            self.validate()

    def test_recovered_company_cannot_keep_any_failure_metadata(self):
        for field, value in (('dataStatus', 'stale'), ('collectionError', ''),
                             ('sourceCheckedAt', self.report['checkedAt'])):
            with self.subTest(field=field):
                self.companies[0][field] = value
                with self.assertRaisesRegex(RuntimeError, 'recovered company still marked stale'):
                    self.validate()
                del self.companies[0][field]

    def test_duplicate_missing_and_malformed_existing_companies_fail(self):
        original = deepcopy(self.companies)
        cases = [original + [deepcopy(original[0])], original[:1]]
        for field, value in (('month', '21/13'), ('bars', [1.0, 2.0]),
                             ('momLine', ['broken']), ('yoyLine', []), ('bars', [None])):
            broken = deepcopy(original)
            broken[0][field] = value
            cases.append(broken)
        for companies in cases:
            with self.subTest(companies=companies):
                self.companies = companies
                with self.assertRaises(RuntimeError):
                    self.validate()

    def test_report_cannot_omit_or_substitute_a_configured_company(self):
        for successful in (['2330'], ['2330', '9999']):
            with self.subTest(successful=successful):
                self.report['successful'] = successful
                with self.assertRaisesRegex(RuntimeError, 'omits configured companies'):
                    self.validate()


class FailureBudgetTests(unittest.TestCase):
    def regional(self, hk, cn):
        return {region: {'meta': {'missing': {f'{i:04d}{suffix}': 'provider offline' for i in range(n)}}}
                for region, n, suffix in [('hk', hk, '.HK'), ('cn', cn, '.SS')]}

    def taiwan(self, n):
        codes = [str(2330 + i) for i in range(n)]
        return {'schemaVersion': 1, 'checkedAt': '2026-09-15T11:00:00+09:00',
                'failures': dict.fromkeys(codes, 'offline'), 'retained': codes, 'successful': ['9999']}

    def test_exactly_ten_across_three_markets_pass_and_eleven_fail(self):
        self.assertEqual(summarize_failures(self.regional(0, 0), self.taiwan(0))['failureCount'], 0)
        self.assertEqual(summarize_failures(self.regional(4, 3), self.taiwan(3))['failureCount'], 10)
        with self.assertRaisesRegex(RuntimeError, '11 securities'):
            summarize_failures(self.regional(4, 4), self.taiwan(3))
        with self.assertRaises(RuntimeError):
            summarize_failures(self.regional(10, 1))

    def test_bad_reports_do_not_turn_into_zero_failures(self):
        for value in [[], None, {'x': ''}]:
            with self.assertRaises(ValueError):
                summarize_failures({'hk': {'meta': {'missing': value}}})
        report = self.taiwan(1)
        report['successful'].append(report['retained'][0])
        with self.assertRaises(ValueError):
            validate_taiwan_report(report)


class PartialSnapshotValidationTests(unittest.TestCase):
    def setUp(self):
        self.members = [{'ticker': f'{i:04d}.HK'} for i in range(1, 401)]
        self.data = {'meta': {'currency': 'HKD', 'requested': 400, 'covered': 400, 'fresh': 400,
                             'watchlist': ['0001.HK'], 'missing': {}, 'retained': [], 'omitted': []},
                     'rs': {'updatedAt': '2026-09-14', 'historyDates': ['2026-09-11', '2026-09-14'], 'rows': [], 'histories': {}},
                     'trend': {'updatedAt': '2026-09-14', 'historyDates': ['2026-09-11', '2026-09-14'], 'rows': {'all': []}, 'histories': {'all': {}}}}
        for member in self.members:
            ticker = member['ticker']
            self.data['rs']['rows'].append({'ticker': ticker, 'asOfDate': '2026-09-14', 'assetType': 'Equity', 'currency': 'HKD', 'rsRatingAll': 50, 'historySessions': 2})
            self.data['rs']['histories'][ticker] = {key: [10, 10] for key in ['price', 'open', 'high', 'low', 'volume', 'rsRatingAll']}
            self.data['trend']['rows']['all'].append({'ticker': ticker, 'asOfDate': '2026-09-14', 'score': 4})
            self.data['trend']['histories']['all'][ticker] = {'score': [4, 4], 'rank': [1, 1]}

    def retain(self, index=0):
        ticker = self.members[index]['ticker']
        self.data['meta']['missing'][ticker] = 'offline'
        self.data['meta']['retained'].append(ticker)
        self.data['meta']['fresh'] -= 1
        for row in [self.data['rs']['rows'][index], self.data['trend']['rows']['all'][index]]:
            row.update(asOfDate='2026-09-11', dataStatus='stale', collectionError='offline')
        for histories in [self.data['rs']['histories'], self.data['trend']['histories']['all']]:
            for values in histories[ticker].values():
                values[-1] = None

    def test_ten_retained_rows_keep_real_dates_and_empty_new_sessions(self):
        for i in range(10):
            self.retain(i)
        self.assertEqual(len(validate_region(self.data, 'hk', self.members)), 10)
        self.assertEqual(summarize_failures({'hk': self.data})['failureCount'], 10)

    def test_undeclared_stale_row_and_invented_current_price_fail(self):
        self.data['rs']['rows'][0]['asOfDate'] = '2026-09-11'
        with self.assertRaises(AssertionError):
            validate_region(self.data, 'hk', self.members)
        self.retain()
        self.data['rs']['histories']['0001.HK']['price'][-1] = 10
        with self.assertRaises(AssertionError):
            validate_region(self.data, 'hk', self.members)

    def test_failed_new_watchlist_can_be_omitted_but_not_undeclared(self):
        for section in ['rs', 'trend']:
            rows = self.data[section]['rows'] if section == 'rs' else self.data[section]['rows']['all']
            rows.pop(0)
            histories = self.data[section]['histories'] if section == 'rs' else self.data[section]['histories']['all']
            del histories['0001.HK']
        self.data['meta'].update(covered=399, fresh=399, missing={'0001.HK': 'no history'}, omitted=['0001.HK'])
        validate_region(self.data, 'hk', self.members)
        self.data['meta']['missing'] = {}
        with self.assertRaises(AssertionError):
            validate_region(self.data, 'hk', self.members)
