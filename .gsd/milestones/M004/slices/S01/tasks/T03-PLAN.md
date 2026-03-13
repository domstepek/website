---
estimated_steps: 4
estimated_files: 1
---

# T03: Browser walkthrough and decision record

**Slice:** S01 — Sentence case all visitor-facing copy and remove lowercase CSS
**Milestone:** M004

## Description

Visually verify all page types in a real browser to catch edge cases that automated tests miss. Confirm dual-render parity between the locked gate shell and post-unlock proof view. Verify D031 is recorded in DECISIONS.md (it was added during milestone planning — confirm presence, don't duplicate).

## Steps

1. Start the dev server with `pnpm dev`
2. Browser walkthrough of all 7 page types:
   - Homepage (`/`) — verify sentence-cased hero, domain intro, personal teaser, contact heading, site title in nav
   - About (`/about/`) — verify sentence-cased lead, how-I-work section, open-to items
   - Locked domain page (`/domains/product/`) — verify sentence-cased gate shell headings, status text, request access copy, passcode input label
   - Unlock the domain page with the passcode — verify sentence-cased proof view headings ("The kind of work I do here", "Flagship highlights", "Supporting work", "Nearby domains"), inline labels, and flagship content
   - Notes index (`/notes/`) — verify sentence-cased heading and intro
   - A note page (`/notes/keep-the-path-explicit/`) — verify sentence-cased title and "Back to notes" link
   - 404 page (`/nonexistent-page/`) — verify sentence-cased heading and body
3. Confirm D031 exists in `.gsd/DECISIONS.md` — it was already added during milestone planning. Do not duplicate it.
4. Run final `pnpm validate:site` to confirm 23 tests pass

## Must-Haves

- [ ] All 7 page types visually confirmed as sentence-cased
- [ ] No leftover lowercase headings or un-capitalized "I" visible
- [ ] Dual-render parity: locked gate shell and unlocked proof view both sentence-cased
- [ ] D031 present in DECISIONS.md
- [ ] `pnpm validate:site` passes 23 tests

## Verification

- Browser screenshots or assertions confirm sentence case on all page types
- `pnpm validate:site` passes 23 tests
- `grep 'D031' .gsd/DECISIONS.md` returns a match

## Observability Impact

- Signals added/changed: None
- How a future agent inspects this: `pnpm validate:site` for regression; browser walkthrough for visual confirmation
- Failure state exposed: None

## Inputs

- T01 and T02 completed — all source files already sentence-cased
- Dev server runnable via `pnpm dev`
- `.gsd/DECISIONS.md` — D031 should already be present

## Expected Output

- Visual confirmation that all visitor-facing copy is sentence-cased across all page types
- `pnpm validate:site` green (23 tests)
- D031 confirmed in DECISIONS.md
- Slice is complete — milestone definition of done is met
