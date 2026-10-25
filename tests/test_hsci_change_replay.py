"""The offline HSCI list may advance only through the official dated change log."""
from io import BytesIO
import importlib.util
from pathlib import Path
import sys
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
HAS_COLLECTOR_DEPENDENCIES = all(importlib.util.find_spec(name)
                                 for name in ("pandas", "yfinance", "curl_cffi"))
if HAS_COLLECTOR_DEPENDENCIES:
    import pandas as pd
    import update_asia_screening as screening


@unittest.skipUnless(HAS_COLLECTOR_DEPENDENCIES, "Requires collector dependencies")
class HsciChangeReplayTests(unittest.TestCase):
    def official_history(self, latest_count):
        rows = [[None] * 7 for _ in range(6)]
        rows[4][0] = "Effective Date"
        # Old events establish that the official log is a full history; none
        # of them may alter a snapshot captured after their effective dates.
        rows.extend([["2026-01-01", 2, "Add", "+1", "1111", "HK", "OLD"]]
                    * 100)
        rows.append(["2026-10-23", latest_count, "Delete", "-1", "2555", "HK", "CHABAIDAO"])
        stream = BytesIO()
        pd.DataFrame(rows).to_excel(stream, sheet_name="HSCI", header=False, index=False)
        return type("Response", (), {"content": stream.getvalue()})()

    def test_official_deletion_reconciles_snapshot_and_count(self):
        members = {"2555.HK": {"ticker": "2555.HK", "groups": ["HSCI"]},
                   "0700.HK": {"ticker": "0700.HK", "groups": ["HSCI"]}}
        with patch.object(screening, "get", return_value=self.official_history(1)):
            current, latest, events = screening.reconcile_hsci_changes(
                members, "2026-10-16", "2026-10-23", 1)
        self.assertEqual(set(current), {"0700.HK"})
        self.assertEqual(set(members), {"2555.HK", "0700.HK"})
        self.assertEqual(latest, "2026-10-23")
        self.assertEqual(events, [{"date": "2026-10-23", "action": "Delete", "ticker": "2555.HK"}])

    def test_mismatched_official_count_refuses_replay(self):
        members = {"2555.HK": {"ticker": "2555.HK", "groups": ["HSCI"]},
                   "0700.HK": {"ticker": "0700.HK", "groups": ["HSCI"]}}
        with patch.object(screening, "get", return_value=self.official_history(2)):
            with self.assertRaisesRegex(RuntimeError, "count"):
                screening.reconcile_hsci_changes(members, "2026-10-16", "2026-10-23", 2)


if __name__ == "__main__":
    unittest.main()
