#!/usr/bin/env python3
"""Static security checks for FeatherTune public HTML.

This is intentionally lightweight: it catches risky patterns that can regress
in a static LP without requiring a browser or server headers.
"""

from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
import re
from typing import Iterable


ROOT = Path(__file__).resolve().parents[1]
WINDOW_OPEN_NOREFERRER_RE = re.compile(
    r"window\.open\([^\n]*,\s*['\"]_blank['\"]\s*,\s*['\"](?=[^'\"]*\bnoopener\b)(?![^'\"]*\bnoreferrer\b)[^'\"]*['\"]"
)


class StaticSecurityParser(HTMLParser):
    def __init__(self, path: Path) -> None:
        super().__init__(convert_charrefs=True)
        self.path = path
        self.issues: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr = {key.lower(): value or "" for key, value in attrs}
        line, col = self.getpos()

        if tag == "a":
            href = attr.get("href", "")
            if href.lower().startswith("javascript:"):
                self.issues.append(f"{self.path}:{line}:{col}: javascript: href is not allowed")

            if attr.get("target") == "_blank":
                rel = set(attr.get("rel", "").split())
                missing = {"noopener", "noreferrer"} - rel
                if missing:
                    names = ", ".join(sorted(missing))
                    self.issues.append(
                        f"{self.path}:{line}:{col}: target=_blank missing rel token(s): {names}"
                    )

        if tag == "script":
            src = attr.get("src", "")
            if src.startswith(("http://", "https://")):
                if not attr.get("integrity"):
                    self.issues.append(f"{self.path}:{line}:{col}: external script missing integrity")
                if attr.get("crossorigin") != "anonymous":
                    self.issues.append(
                        f"{self.path}:{line}:{col}: external script missing crossorigin=anonymous"
                    )


def html_files() -> Iterable[Path]:
    for path in sorted(ROOT.rglob("*.html")):
        rel = path.relative_to(ROOT)
        if path.name.startswith("google") and "site-verification" in path.read_text(errors="ignore"):
            continue
        yield rel


def main() -> int:
    issues: list[str] = []
    for rel_path in html_files():
        text = (ROOT / rel_path).read_text(errors="ignore")
        parser = StaticSecurityParser(rel_path)
        parser.feed(text)
        issues.extend(parser.issues)
        for match in WINDOW_OPEN_NOREFERRER_RE.finditer(text):
            line = text.count("\n", 0, match.start()) + 1
            issues.append(f"{rel_path}:{line}: window.open _blank missing noreferrer")

    if issues:
        print("Static security check failed:")
        for issue in issues:
            print(f"- {issue}")
        return 1

    print("Static security check passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
