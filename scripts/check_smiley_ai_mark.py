#!/usr/bin/env python3
"""Verify the Smiley concept preview credits its AI co-creation mark."""

from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "smiley-japan-studio" / "index.html"
MARK = ROOT / "smiley-japan-studio" / "assets" / "co-created-with-ai-metal.png"


def main() -> int:
    html = PAGE.read_text(encoding="utf-8")
    issues: list[str] = []
    if 'class="ai-mark"' not in html:
        issues.append("missing ai-mark class")
    if 'src="assets/co-created-with-ai-metal.png"' not in html:
        issues.append("missing AI mark asset reference")
    if 'alt="Co-created with AI"' not in html:
        issues.append("missing accessible AI mark label")
    if not MARK.is_file():
        issues.append("missing AI mark asset")

    if issues:
        print("Smiley AI mark check failed:")
        for issue in issues:
            print(f"- {issue}")
        return 1

    print("Smiley AI mark check passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
