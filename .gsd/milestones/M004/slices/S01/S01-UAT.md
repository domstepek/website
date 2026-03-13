# S01: Sentence case all visitor-facing copy and remove lowercase CSS — UAT

**Milestone:** M004
**Written:** 2026-03-12

## UAT Type

- UAT mode: mixed
- Why this mode is sufficient: Automated tests (23 in validate:site) confirm no regressions, but sentence-case correctness is fundamentally a visual/human judgment — automated tests are case-insensitive by design. Browser walkthrough catches edge cases.

## Preconditions

- Site builds cleanly with `pnpm build`
- Dev server running (`pnpm dev`) or built output available for preview

## Smoke Test

Open the homepage (`/`) — the site title, hero text, and domain section headings should all be sentence case (not all-lowercase). "I" should be capitalized.

## Test Cases

### 1. Homepage sentence case

1. Navigate to `/`
2. Read the hero section, domain cards, personal teaser, contact section, and "currently" section
3. **Expected:** All text is sentence case. "I", "I'm", "I've", "I'll", "I'd" are capitalized. Abbreviations (AI, CDK, etc.) preserved. No all-lowercase headings.

### 2. About page sentence case

1. Navigate to `/about/`
2. Read the lead section, how-I-work groups, open-to section, and resume link
3. **Expected:** All text is sentence case. Section headings capitalized. "Back home" link is sentence case.

### 3. Locked domain gate

1. Navigate to `/domains/product/` (without entering passcode)
2. Read the gate shell: status, request-access messaging, passcode form
3. **Expected:** "Protected case file", "Locked boundary / proof withheld", "Request access", "Enter passcode", "Unlock" — all sentence case.

### 4. Unlocked domain proof view

1. Enter the correct passcode on a domain page
2. Read section headings, inline labels (Scope, Problem, Role, etc.), flagship content
3. **Expected:** All headings and labels sentence case. Content matches between cold-load server render and client-side dynamic render (dual-render parity).

### 5. Notes index and note page

1. Navigate to `/notes/`
2. Read heading and intro paragraph
3. Click into a note (e.g., "Keep the path explicit")
4. **Expected:** Note titles sentence case. "Back to notes" link sentence case. Date formatting remains lowercase (by design — `.toLowerCase()` preserved).

### 6. 404 page

1. Navigate to `/nonexistent-page/`
2. Read heading, body text, and link
3. **Expected:** All text sentence case.

### 7. No CSS lowercase override

1. Inspect the site title element in browser dev tools
2. **Expected:** No `text-transform: lowercase` applied. The rendered text matches the source string casing.

## Edge Cases

### Abbreviations preserved

1. Navigate to domain pages and about page
2. Look for technical terms: AI, SSO, CDK, AWS, GCP, DevEx, BDD, TypeScript, GraphQL
3. **Expected:** All abbreviations remain in their standard casing, not forced to sentence case (e.g., "AI" stays "AI", not "Ai").

### Date formatting preserved

1. Navigate to `/notes/` and open a note page
2. Check the date display
3. **Expected:** Month names are lowercase (e.g., "mar 2026") — this is intentional formatting via `.toLowerCase()`, not leftover all-lowercase styling.

## Failure Signals

- Any heading or body text that is all-lowercase (except dates)
- Un-capitalized standalone "i" or "i'm/i've/i'll/i'd" contractions
- Mismatch between locked gate shell text and unlocked proof view text (dual-render parity broken)
- `text-transform: lowercase` visible in browser dev tools on any element
- Any of the 23 `pnpm validate:site` tests failing

## Requirements Proved By This UAT

- None — this milestone addresses design decision D031 (superseding D003), not a tracked requirement in REQUIREMENTS.md

## Not Proven By This UAT

- No new requirements were in scope — all 19 validated requirements remain validated by prior milestones
- Runtime performance impact of casing changes is not tested (not applicable — static content only)

## Notes for Tester

- The validate:site tests are case-insensitive by design, so they don't directly verify sentence case — they verify no regressions. The human eye is the primary casing verification tool here.
- Date formatting on notes pages is intentionally lowercase — don't flag that.
- The dual-render parity check (test case 4) is the highest-risk area — compare the proof view headings and labels between a cold-load of a locked page vs. the dynamically rendered view after unlock.
