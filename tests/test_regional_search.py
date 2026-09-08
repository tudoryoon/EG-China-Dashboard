"""Regressions for broker ticker aliases and unscored/unknown-cap rows."""
from pathlib import Path
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]


class RegionalSearchTests(unittest.TestCase):
    def test_aliases_and_missing_values_in_shared_filters(self):
        subprocess.run(['node', '-e', r'''
const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const source = fs.readFileSync('dashboard.js', 'utf8');
const names = ['normalizeMarketTickerSearch', 'marketTickerSearchTerms', 'parseScoreInput',
 'parseMarketCapInput', 'getScoreRangeMeta', 'getMarketRsCapRangeMeta',
 'matchesScoreRange', 'matchesMarketCapRange'];
const context = { MARKET_RS_CAP_RANGES: [{key:'all', min:0, max:Infinity}, {key:'small', min:0, max:1e9}] };
vm.createContext(context);
for (const name of names) {
 const match = source.match(new RegExp('function ' + name + '\\([\\s\\S]*?\\n\\}'));
 assert.ok(match, name); vm.runInContext(match[0], context);
}
for (const [query, ticker] of [['3033 HK','3033.HK'],['6083 HK','6083.HK'],
 ['588200 C1','588200.SS'],['3109 HK','3109.HK'],['100 HK','0100.HK'],
 ['562500 C1','562500.SS'],['159819 C2','159819.SZ'],['00100.HK','0100.HK']]) {
 assert.equal(context.normalizeMarketTickerSearch(query), ticker.toLowerCase());
 assert.ok(context.marketTickerSearchTerms(ticker).includes(context.normalizeMarketTickerSearch(query)));
}
assert.equal(context.normalizeMarketTickerSearch('NVDA US'), 'nvda');
const ranges = [{key:'all',min:1,max:100},{key:'low',min:0,max:4}];
for (const absent of [null, undefined, NaN]) {
 assert.equal(context.matchesScoreRange(absent,ranges,'all'), true);
 assert.equal(context.matchesScoreRange(absent,ranges,'low'), false);
 assert.equal(context.matchesScoreRange(absent,ranges,'all','0'), false);
 assert.equal(context.matchesMarketCapRange({marketCap:absent},'all'), true);
 assert.equal(context.matchesMarketCapRange({marketCap:absent},'small'), false);
 assert.equal(context.matchesMarketCapRange({marketCap:absent},'all','0'), false);
}
assert.equal(context.matchesScoreRange(0,ranges,'low'), true);
assert.equal(context.matchesScoreRange(90,ranges,'all','91'), false);
assert.equal(context.matchesMarketCapRange({marketCap:2e9},'small'), false);
console.log('PASS: regional aliases; All retains missing scores/caps; numeric filters reject missing values');
'''], cwd=ROOT, check=True)
