#!/usr/bin/env python3
"""Check public sample AI marks are embedded and textless."""

from __future__ import annotations

from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
TARGETS = [
    Path("samples/anon-origin-sample.public-summary.html"),
    Path("samples/full/rinne-meikon-shiseikan-public-summary.html"),
    Path("samples/options/analysis-card-rinne.html"),
    Path("samples/options/visual-report-miagete-goran.html"),
    Path("samples/options/one-on-one-similarity.html"),
    Path("samples/options/one-on-one-friendship.html"),
    Path("samples/options/one-on-one-rival.html"),
]


def main() -> int:
    issues: list[str] = []
    for rel in TARGETS:
        text = (ROOT / rel).read_text(encoding="utf-8")
        if "ft-ai-mark" not in text:
            issues.append(f"{rel}: missing ft-ai-mark")
            continue
        mark_match = re.search(r'<div class="ft-ai-mark"[^>]*>(.*?)</div>', text, re.S)
        mark_html = mark_match.group(1) if mark_match else ""
        if "AI活用" in text:
            issues.append(f"{rel}: remove visible/alt/aria AI活用 wording from AI mark")
        if "<span" in mark_html:
            issues.append(f"{rel}: AI mark must not include visible text span")
        if re.search(r'<img[^>]+src=["\']\.\.?/', mark_html, re.S):
            issues.append(f"{rel}: AI mark must not depend on relative image files")
        if "ft-ai-mark-svg" not in text:
            issues.append(f"{rel}: AI mark must use embedded inline SVG")
        if not re.search(r"\.ft-ai-mark\s*\{[^}]*position\s*:\s*(?:fixed|absolute)", text, re.S):
            issues.append(f"{rel}: AI mark should use the right-bottom visual pattern")
        if not re.search(r"\.ft-ai-mark\s*\{[^}]*right\s*:", text, re.S):
            issues.append(f"{rel}: AI mark should define right position")
        if not re.search(r"\.ft-ai-mark\s*\{[^}]*bottom\s*:", text, re.S):
            issues.append(f"{rel}: AI mark should define bottom position")

    if issues:
        print("AI mark embed check failed:")
        for issue in issues:
            print(f"- {issue}")
        return 1
    print("AI mark embed check passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
