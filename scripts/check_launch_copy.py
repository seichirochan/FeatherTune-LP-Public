from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FILES = [
    ROOT / "index.html",
    ROOT / "origin.html",
    ROOT / "preparing.html",
    ROOT / "samples.html",
    ROOT / "help.html",
]

FORBIDDEN = [
    "ORIGIN番号必須",
    "TRIAL / MASTERはORIGIN番号必須",
    "ORIGIN番号のないご注文は受付保留",
    "ORIGIN分析体験済みの方が対象",
    "通常分析（ORIGIN体験後）",
]

REQUIRED = [
    "ORIGIN番号がない場合も",
    "通常TRIAL / MASTER",
    "ORIGIN登録特典",
]


def main() -> int:
    failed = False
    combined = []
    for path in FILES:
        text = path.read_text(encoding="utf-8")
        combined.append(text)
        for phrase in FORBIDDEN:
            if phrase in text:
                print(f"forbidden phrase remains: {phrase!r} in {path.relative_to(ROOT)}")
                failed = True
    all_text = "\n".join(combined)
    for phrase in REQUIRED:
        if phrase not in all_text:
            print(f"required launch phrase missing: {phrase!r}")
            failed = True
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
