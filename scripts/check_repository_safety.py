#!/usr/bin/env python3
"""Fail CI when tracked files contain likely runtime data or secrets."""

from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

FORBIDDEN_PARTS = {"secrets", "private-data", "user-data", "uploads", "backups", ".hermes", ".worktrees"}
FORBIDDEN_NAMES = {".env", ".env.local", ".env.production"}
FORBIDDEN_SUFFIXES = {".db", ".sqlite", ".sqlite3", ".pem", ".p12", ".pfx"}
SECRET_PATTERNS = {
    "GitHub token": re.compile(rb"\b(?:gh[opsru]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})\b"),
    "private key": re.compile(rb"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
}
MAX_SCAN_BYTES = 5_000_000


def tracked_files() -> list[Path]:
    result = subprocess.run(
        ["git", "ls-files", "-z"],
        check=True,
        stdout=subprocess.PIPE,
    )
    return [Path(raw.decode("utf-8")) for raw in result.stdout.split(b"\0") if raw]


def main() -> int:
    failures: list[str] = []
    for path in tracked_files():
        lowered_parts = {part.lower() for part in path.parts}
        if lowered_parts & FORBIDDEN_PARTS:
            failures.append(f"forbidden directory: {path}")
            continue
        if path.name.lower() in FORBIDDEN_NAMES or path.suffix.lower() in FORBIDDEN_SUFFIXES:
            failures.append(f"forbidden tracked file: {path}")
            continue
        try:
            data = path.read_bytes()
        except OSError as exc:
            failures.append(f"cannot read tracked file {path}: {exc}")
            continue
        if len(data) > MAX_SCAN_BYTES:
            continue
        for label, pattern in SECRET_PATTERNS.items():
            if pattern.search(data):
                failures.append(f"possible {label}: {path}")

    if failures:
        print("Repository safety check failed:", file=sys.stderr)
        for failure in failures:
            print(f"- {failure}", file=sys.stderr)
        return 1

    print(f"Repository safety check passed for {len(tracked_files())} tracked files.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
