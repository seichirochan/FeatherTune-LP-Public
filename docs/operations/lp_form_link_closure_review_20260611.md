# LP Form Link Closure Review 2026-06-11

Status: proposal only. No implementation branch or PR should be created from this note until Seichan/PJmain confirms.

## Context

- PR #24 already moved the top page and `preparing.html` ORIGIN route to "final verification / coming soon".
- The remaining question is whether public pages that still link directly to Google Forms should also be closed while ORIGIN recruitment and launch are in the final verification buffer.
- Do not add a new public date. Use "準備中", "最終検証中", or "せいちゃん/PJmain判断待ち".

## Current Direct Form Links On `origin/main`

| Page | Count | Form Type | Current Meaning |
| --- | ---: | --- | --- |
| `origin.html` | 5 | ORIGIN Google Form | ORIGIN application is open |
| `help.html` | 1 | ORIGIN Google Form | Help route sends users directly to ORIGIN form |
| `monitor.html` | 1 | MONITOR Google Form | Monitor application is open |
| `samples.html` | 1 | ORIGIN Google Form | Sample viewer can open ORIGIN form directly |

No stale fixed date strings were found in the four target pages:

- `2026-06-07`
- `6/14`
- `6月14`
- `今すぐご利用いただけます`
- `受付中`

## Minimal PR Options

### Option A: 完全クローズ

Close all remaining direct Google Form links in `origin.html`, `help.html`, `monitor.html`, and `samples.html`.

Minimum diff:

- `origin.html`: replace 5 ORIGIN form links with `preparing.html`; update surrounding copy to "最終検証中 / もうすぐ受付開始".
- `help.html`: replace ORIGIN form button with `preparing.html`; copy becomes "受付準備状況を見る".
- `samples.html`: replace ORIGIN form button with `preparing.html`; keep sample browsing available.
- `monitor.html`: replace MONITOR form button with `preparing.html` or a monitor-specific "準備中" section if already present.

Pros:

- Prevents accidental intake while final E2E and clean test data work are not complete.
- Public route becomes consistent: all signup/purchase-looking paths are "preparing / final verification".
- Reduces support risk from users entering forms during a known buffer period.

Cons:

- Stronger conversion brake. People ready to apply cannot submit immediately.
- Monitor outreach is also paused unless we leave MONITOR open separately.

### Option B: 現状維持

Leave remaining form links as-is.

Pros:

- No more work.
- Existing direct application paths remain available.

Cons:

- Inconsistent with PR #24. Top page says final verification, but deeper pages still allow direct application.
- Higher risk of accidental intake, stale expectations, and operator confusion during final verification.

### Option C: 一部だけ閉じる

Close ORIGIN form links only, keep `monitor.html` as-is.

Minimum diff:

- `origin.html`, `help.html`, `samples.html`: replace ORIGIN Google Form links with `preparing.html`.
- `monitor.html`: leave MONITOR form link unchanged, unless Seichan/PJmain wants all intake closed.

Pros:

- Aligns the main ORIGIN recruitment route with "final verification / coming soon".
- Leaves MONITOR available if it is intentionally separate from ORIGIN recruitment.
- Smaller and less disruptive than full closure.

Cons:

- Public site still contains one live Google Form route.
- Requires clear decision that MONITOR is allowed to remain open during the verification buffer.

## Recommendation

Recommended: Option C unless Seichan/PJmain explicitly wants every intake route closed.

Reason:

- The current mismatch is primarily ORIGIN: the top page and preparing page now say "final verification", but `origin.html`, `help.html`, and `samples.html` still open the ORIGIN form directly.
- MONITOR may be an outreach/recruitment route with different operational timing, so it should not be silently closed inside an ORIGIN cleanup.
- If Seichan wants a clean "all public forms paused" posture, choose Option A and include MONITOR in the same small PR.

## Suggested Handoff If Approved

Ask Kurochan/Claude Code to create a small PR:

- Branch: `feat/lp-origin-form-links-preparing-20260611`
- Scope: `origin.html`, `help.html`, `samples.html`; add `monitor.html` only if Option A is chosen.
- Verification:
  - `git diff --check`
  - `git grep -n "docs.google.com/forms" origin/main -- origin.html help.html samples.html`
  - For Option A, include `monitor.html` in the same grep and expect no direct form links in all four target pages.
  - Confirm no fixed launch date strings are added.

## Stop Lines

- No PR creation until Seichan/PJmain chooses an option.
- No BASE sales/payment activation.
- No CNAME/domain/URL switch.
- No real form intake start/stop setting change outside link copy changes.
- No SNS, real email, Drive/GAS, Secret, or customer data operation.
