from __future__ import annotations

import argparse
import re
from datetime import UTC, datetime, timedelta, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INDEX_PATH = ROOT / "index.html"
KST = timezone(timedelta(hours=9), name="KST")


def normalize_data_path(value: str) -> str:
    path = value.replace("\\", "/").strip()
    if path.startswith("./"):
        path = path[2:]
    if path.startswith("data/"):
        return path
    candidate = Path(path)
    try:
        rel = candidate.resolve().relative_to(ROOT)
        return rel.as_posix()
    except Exception:
        return path


def next_version(current: str | None, today: str) -> str:
    if not current:
        return f"{today}-1"
    match = re.fullmatch(r"(\d{8})(?:-(\d+))?", current)
    if not match:
        return f"{today}-1"
    base, suffix = match.group(1), match.group(2)
    if base != today:
        return f"{today}-1"
    return f"{today}-{int(suffix or '1') + 1}"


def bump_index_versions(data_paths: list[str], index_path: Path | None = None) -> list[str]:
    # The regional orchestrator also validates isolated fixture roots.
    index_path = index_path or INDEX_PATH
    if not index_path.exists():
        raise FileNotFoundError(f"Missing {index_path}")
    text = index_path.read_text(encoding="utf-8")
    today = datetime.now(KST).strftime("%Y%m%d")
    changed: list[str] = []

    for data_path in data_paths:
        normalized = normalize_data_path(data_path)
        escaped = re.escape("./" + normalized)
        pattern = re.compile(
            rf'(<script\s+src="{escaped}|<link\s+rel="stylesheet"\s+href="{escaped})'
            rf'(?:\?v=([^"]+))?("(?=[^>]*>))'
        )

        def replace(match: re.Match[str]) -> str:
            version = next_version(match.group(2), today)
            return f"{match.group(1)}?v={version}{match.group(3)}"

        text, count = pattern.subn(replace, text)
        if count:
            changed.append(normalized)

    if changed:
        index_path.write_text(text, encoding="utf-8", newline="\n")
    return changed


def main() -> None:
    parser = argparse.ArgumentParser(description="Bump index.html script cache versions for updated data files.")
    parser.add_argument("data_files", nargs="+", help="Data JS files whose script query version should be bumped.")
    args = parser.parse_args()

    changed = bump_index_versions(args.data_files)
    if changed:
        print("Bumped cache versions for: " + ", ".join(changed))
    else:
        print("No matching index.html script tags found.")


if __name__ == "__main__":
    main()
