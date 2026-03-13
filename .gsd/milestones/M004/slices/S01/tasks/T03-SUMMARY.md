---
id: T03
parent: S01
milestone: M004
provides:
  - Visual confirmation of sentence case across all 7 page types
  - Fixed 6 remaining lowercase hardcoded strings missed by T01/T02
  - D031 confirmed present in DECISIONS.md
  - All 23 validate:site tests passing
key_files:
  - src/components/home/HomePage.astro
  - src/components/personal/PersonalPage.astro
  - src/components/resume/ResumePage.astro
key_decisions: []
patterns_established:
  - Browser walkthrough as final casing sweep catches hardcoded strings that automated tests and grep miss
observability_surfaces:
  - none
duration: 20m
verification_result: passed
completed_at: 2026-03-12
blocker_discovered: false
---

# T03: Browser walkthrough and decision record

**Visually verified all 7 page types in browser, fixed 6 remaining lowercase strings missed by T01/T02, confirmed D031, and validated 23 tests green.**

## What Happened

Browser walkthrough revealed 6 hardcoded lowercase strings that T01 and T02 missed because those tasks focused on data files and domain/gate/notes components — the personal/about page component and homepage component had additional hardcoded strings.

Fixes applied:
1. **HomePage.astro** — "pick a domain" → "Pick a domain"
2. **PersonalPage.astro** — "back home" → "Back home", "role modes" → "Role modes", "best-fit problems" → "Best-fit problems", "boundaries" → "Boundaries", "full resume" → "Full resume"
3. **ResumePage.astro** — "back home" → "Back home"

After fixes, walked all 7 page types:
- Homepage (`/`) — hero, domain section, personal teaser, contact, currently ✅
- About (`/about/`) — lead, how-I-work, open-to groups, resume section ✅
- Locked domain (`/domains/product/`) — gate shell, status, request access, passcode ✅
- Unlocked domain — proof view headings, inline labels, flagship content ✅
- Notes index (`/notes/`) — heading, intro, note titles ✅
- Note page (`/notes/keep-the-path-explicit/`) — title, "Back to notes" ✅
- 404 (`/nonexistent-page/`) — heading, body, link ✅

Confirmed D031 already present in DECISIONS.md (added during milestone planning).

## Verification

- All 7 page types visually confirmed sentence-cased in browser — no leftover lowercase headings or un-capitalized "I"
- Dual-render parity confirmed: locked gate shell and unlocked proof view both sentence-cased
- `pnpm validate:site` — all 23 tests passed (9 cold-load + 4 gate unlock + 4 visual state + 2 notes + 1 assembled flow + 3 shader)
- `grep 'D031' .gsd/DECISIONS.md` — match confirmed
- Slice-level checks: `pnpm build` clean, `rg 'text-transform:\s*lowercase' src/` returns no matches (verified in T01)

## Diagnostics

None — static content changes only. Future inspection: `pnpm validate:site` for regression; browser walkthrough for visual confirmation.

## Deviations

Browser walkthrough found 6 additional lowercase strings in HomePage.astro, PersonalPage.astro, and ResumePage.astro that were not in scope for T03 (which was planned as verification-only). Fixed them in-task rather than creating a follow-up since they were small, obvious, and the same pattern as T01/T02.

## Known Issues

None.

## Files Created/Modified

- `src/components/home/HomePage.astro` — Sentence-cased "Pick a domain" heading
- `src/components/personal/PersonalPage.astro` — Sentence-cased "Back home", "Role modes", "Best-fit problems", "Boundaries", "Full resume"
- `src/components/resume/ResumePage.astro` — Sentence-cased "Back home"
