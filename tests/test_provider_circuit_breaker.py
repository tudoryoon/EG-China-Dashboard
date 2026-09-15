"""Failover and recovery tests use an isolated process-memory breaker and clock."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import sys
import unittest
from unittest.mock import Mock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
import market_price_sources as sources


class ProviderCircuitBreakerTests(unittest.TestCase):
    def setUp(self):
        self.now = 0.0
        self.breaker = sources.ProviderCircuitBreaker(clock=lambda: self.now)

    def open_circuit(self):
        for _ in range(5):
            ticket = self.breaker.acquire()
            self.assertIsNotNone(ticket)
            self.breaker.failure(ticket)

    def test_five_failures_pause_calls_for_five_minutes(self):
        self.open_circuit()
        self.assertIsNone(self.breaker.acquire())
        self.now = 299.999
        self.assertIsNone(self.breaker.acquire())
        self.now = 300.0
        self.assertIsNotNone(self.breaker.acquire())

    def test_success_resets_consecutive_failure_count(self):
        for _ in range(4):
            self.breaker.failure(self.breaker.acquire())
        self.breaker.success(self.breaker.acquire())
        for _ in range(4):
            self.breaker.failure(self.breaker.acquire())
        self.assertIsNotNone(self.breaker.acquire())

    def test_only_one_worker_probes_and_success_reopens_provider(self):
        self.open_circuit()
        self.now = 300.0
        with ThreadPoolExecutor(max_workers=6) as pool:
            tickets = list(pool.map(lambda _: self.breaker.acquire(), range(6)))
        probes = [ticket for ticket in tickets if ticket is not None]
        self.assertEqual(len(probes), 1)
        self.breaker.success(probes[0])
        self.assertIsNotNone(self.breaker.acquire())

    def test_failed_probe_restarts_cooldown_and_old_success_cannot_reset_it(self):
        old_ticket = self.breaker.acquire()
        self.open_circuit()
        self.breaker.success(old_ticket)
        self.assertIsNone(self.breaker.acquire())
        self.now = 300.0
        self.breaker.failure(self.breaker.acquire())
        self.now = 599.0
        self.assertIsNone(self.breaker.acquire())
        self.now = 600.0
        self.assertIsNotNone(self.breaker.acquire())

    def test_collection_skips_paused_provider_but_still_checks_fallback_date(self):
        broken = Mock(side_effect=ConnectionError('HTTP 501'))
        fresh = {'records': [{'date': '2026-09-14'}]}
        stale = {'records': [{'date': '2026-09-11'}]}
        with patch.object(sources, '_TENCENT_CIRCUIT', self.breaker):
            for _ in range(7):
                result = sources.current_source('0700.HK', '2026-09-14', [
                    ('Tencent', broken), ('Yahoo Finance', lambda: fresh)], minimum=1)
                self.assertIs(result, fresh)
            self.assertEqual(broken.call_count, 5)
            with self.assertRaisesRegex(RuntimeError, 'Incomplete/stale history'):
                sources.current_source('0700.HK', '2026-09-14', [
                    ('Tencent', broken), ('Yahoo Finance', lambda: stale)], minimum=1)
            self.assertEqual(broken.call_count, 5)
            self.now = 300.0
            recovered = Mock(return_value=fresh)
            self.assertIs(sources.current_source('0700.HK', '2026-09-14', [
                ('Tencent', recovered)], minimum=1), fresh)
            recovered.assert_called_once()


if __name__ == '__main__':
    unittest.main()
