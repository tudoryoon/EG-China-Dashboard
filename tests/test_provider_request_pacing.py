"""Provider attempts are paced at the real HTTP boundary, including retries."""
import importlib.util
from pathlib import Path
import sys
import unittest
from unittest.mock import Mock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
import market_price_sources as sources

HAS_DATA_DEPENDENCIES = all(importlib.util.find_spec(module) for module in ('pandas', 'curl_cffi', 'yfinance'))
if HAS_DATA_DEPENDENCIES:
    import update_asia_screening as collector


class InjectedClientPacingTests(unittest.TestCase):
    def test_custom_client_without_per_attempt_contract_is_paced(self):
        response = object()
        get = Mock(return_value=response)
        with patch.object(sources, 'pace_tencent_request') as pace:
            self.assertIs(sources.tencent_get(get, {'param': 'example'}), response)
        pace.assert_called_once_with()
        get.assert_called_once_with(sources.TENCENT_URL, params={'param': 'example'})

    def test_explicit_per_attempt_client_is_not_paced_twice(self):
        get = Mock()
        get.paces_tencent_attempts = True
        with patch.object(sources, 'pace_tencent_request') as pace:
            sources.tencent_get(get, {'param': 'example'})
        pace.assert_not_called()


@unittest.skipUnless(HAS_DATA_DEPENDENCIES, 'Requires data dependencies')
class ProductionRequestPacingTests(unittest.TestCase):
    def test_every_retry_has_one_pacing_call_immediately_before_http(self):
        events = []
        response = Mock()
        errors = [collector.requests.exceptions.HTTPError('HTTP 501'),
                  collector.requests.exceptions.Timeout('timeout')]
        def request(*args, **kwargs):
            events.append('request')
            if errors:
                raise errors.pop(0)
            return response
        with patch.object(collector, 'pace_tencent_request', side_effect=lambda: events.append('pace')), \
                patch.object(sources, 'pace_tencent_request') as outer_pace, \
                patch.object(collector.requests, 'get', side_effect=request), \
                patch.object(collector.time, 'sleep'):
            self.assertIs(sources.tencent_get(collector.get, {'param': 'example'}), response)
        self.assertEqual(events, ['pace', 'request'] * 3)
        outer_pace.assert_not_called()

    def test_actual_requests_transport_errors_open_circuit(self):
        breaker = sources.ProviderCircuitBreaker(clock=lambda: 0)
        broken = Mock(side_effect=collector.requests.exceptions.HTTPError('HTTP 501'))
        with patch.object(sources, '_TENCENT_CIRCUIT', breaker):
            for _ in range(6):
                with self.assertRaises(RuntimeError):
                    sources.current_source('9988.HK', '2026-09-29', [('Tencent', broken)], minimum=1)
        self.assertEqual(broken.call_count, 5)
        self.assertIsNone(breaker.acquire())

    def test_other_providers_do_not_use_tencent_pacer(self):
        response = Mock()
        with patch.object(collector, 'pace_tencent_request') as pace, \
                patch.object(collector.requests, 'get', return_value=response):
            self.assertIs(collector.get('https://example.test/quotes'), response)
        pace.assert_not_called()


if __name__ == '__main__':
    unittest.main()
