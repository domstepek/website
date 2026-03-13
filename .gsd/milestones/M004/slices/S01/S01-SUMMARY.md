---
id: S01
parent: M004
milestone: M004
provides:
  - All visitor-facing strings converted to sentence case with standard "I" capitalization
  - CSS text-transform lowercase removed from .site-title
  - Dual-render parity maintained between DomainPage.astro and domain-proof-view.ts
  - D031 confirmed in DECISIONS.md (supersedes D003)
requires: []
affects: []
key_files:
  - src/data/site.ts
  - src/data/home.ts
  - src/data/personal.ts
  - src/data/domains/product.ts
  - src/data/domains/developer-experience.ts
  - src/data/domains/analytics-ai.ts
  - src/styles/global.css
  - src/components/domains/DomainPage.astro
  - src/components/domains/domain-proof-view.ts
  - src/components/domains/DomainGateShell.astro
  - src/components/domains/domain-gate-client.ts
  - src/components/notes/NotesIndexPage.astro
  - src/components/notes/NotePage.astro
  - src/pages/404.astro
  - src/content/notes/keep-the-path-explicit.md
  - src/content/notes/systems-over-abstractions.md
  - src/components/home/HomePage.astro
  - src/components/personal/PersonalPage.astro
  - src/components/resume/ResumePage.astro
key_decisions:
  - D031 — Sentence case replaces all-lowercase (supersedes D003)
patterns_established:
  - Sentence case with capitalized I/I'm/I've/I'll/I'd throughout all visitor-facing strings
  - Abbreviations and proper nouns (AI, SSO, CDK, AWS, GCP, DevEx, BDD, TypeScript, GraphQL, etc.) preserved as-is
  - Dual-render pairs (Astro server + TS client) updated in lockstep with line-by-line parity
  - Browser walkthrough as final casing sweep catches hardcoded strings that grep and automated tests miss
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M004/slices/S01/tasks/T01-SUMMARY.md
  - .gsd/milestones/M004/slices/S01/tasks/T02-SUMMARY.md
  - .gsd/milestones/M004/slices/S01/tasks/T03-SUMMARY.md
duration: 45m
verification_result: passed
completed_at: 2026-03-12
---

# S01: Sentence case all visitor-facing copy and remove lowercase CSS

**Converted every visitor-facing string across data files, components, client renderers, notes frontmatter, and gate UI from all-lowercase to sentence case, removed the CSS lowercase override, and visually verified all 7 page types.**

## What Happened

T01 converted ~80% of visitor-facing copy in 6 data files (`site.ts`, `home.ts`, `personal.ts`, and 3 domain data files) to sentence case and removed the `text-transform: lowercase` rule from `.site-title` in `global.css`. All standalone "i" became "I", contractions capitalized, abbreviations preserved.

T02 completed the component and renderer layer: `DomainPage.astro` and `domain-proof-view.ts` updated in lockstep for dual-render parity, `DomainGateShell.astro` gate UI strings, `domain-gate-client.ts` status messages, `NotesIndexPage.astro` and `NotePage.astro` headings (preserving `.toLowerCase()` date formatting), `404.astro`, and both notes' frontmatter. All 23 `validate:site` tests passed.

T03 ran a browser walkthrough of all 7 page types and caught 6 additional lowercase strings in `HomePage.astro`, `PersonalPage.astro`, and `ResumePage.astro` that T01/T02 missed because those files had hardcoded strings outside the data layer. Fixed in-task. Final walkthrough confirmed consistent sentence case across homepage, about, locked domain gate, unlocked proof view, notes index, note page, and 404.

## Verification

- `pnpm build` — 11 pages built successfully
- `pnpm validate:site` — all 23 tests passed (9 cold-load + 4 gate unlock + 4 visual state + 2 notes + 1 assembled flow + 3 shader)
- `rg 'text-transform:\s*lowercase' src/` — no matches
- Browser walkthrough of all 7 page types confirmed sentence case throughout
- Dual-render parity confirmed between DomainPage.astro and domain-proof-view.ts
- D031 confirmed present in DECISIONS.md

## Requirements Advanced

- None — this milestone addresses a design decision revision (D003 → D031), not a tracked requirement

## Requirements Validated

- None — no active requirements were in scope for this milestone

## New Requirements Surfaced

- None

## Requirements Invalidated or Re-scoped

- None

## Deviations

- T03 (planned as verification-only) fixed 6 additional lowercase strings in HomePage.astro, PersonalPage.astro, and ResumePage.astro discovered during browser walkthrough. Small, same-pattern fixes applied in-task.
- Task plan referenced paths under `src/scripts/` and `src/components/` — actual paths were under `src/components/domains/` and `src/components/notes/`. No impact on execution.

## Known Limitations

None — all visitor-facing strings are sentence-cased, CSS lowercase rule removed, full test suite green.

## Follow-ups

None.

## Files Created/Modified

- `src/data/site.ts` — Sentence-cased name, defaultTitle, defaultDescription
- `src/data/home.ts` — Sentence-cased all string values
- `src/data/personal.ts` — Sentence-cased all strings, preserved abbreviations
- `src/data/domains/product.ts` — Sentence-cased all flagship and supporting work strings
- `src/data/domains/developer-experience.ts` — Sentence-cased all flagship and supporting work strings
- `src/data/domains/analytics-ai.ts` — Sentence-cased all flagship and supporting work strings
- `src/styles/global.css` — Removed `text-transform: lowercase` from `.site-title`
- `src/components/domains/DomainPage.astro` — Sentence-cased headings, labels, link, prose
- `src/components/domains/domain-proof-view.ts` — Matching sentence-cased strings (dual-render parity)
- `src/components/domains/DomainGateShell.astro` — Sentence-cased all gate shell strings
- `src/components/domains/domain-gate-client.ts` — Sentence-cased 3 status strings
- `src/components/notes/NotesIndexPage.astro` — Sentence-cased heading and intro
- `src/components/notes/NotePage.astro` — Sentence-cased back link
- `src/pages/404.astro` — Sentence-cased title, description, heading, body, link
- `src/content/notes/keep-the-path-explicit.md` — Sentence-cased frontmatter
- `src/content/notes/systems-over-abstractions.md` — Sentence-cased frontmatter
- `src/components/home/HomePage.astro` — Sentence-cased "Pick a domain"
- `src/components/personal/PersonalPage.astro` — Sentence-cased 5 hardcoded strings
- `src/components/resume/ResumePage.astro` — Sentence-cased "Back home"

## Forward Intelligence

### What the next slice should know
- This is a single-slice milestone — no downstream slices. For future milestones: all visitor-facing copy is now sentence case; maintain this pattern for any new strings.

### What's fragile
- Dual-render parity between `DomainPage.astro` and `domain-proof-view.ts` — any future content changes to domain proof sections must update both files in lockstep.

### Authoritative diagnostics
- `pnpm validate:site` (23 tests) — trustworthy regression gate; tests are case-insensitive so they survived the casing change without modification.

### What assumptions changed
- Original plan scoped T01/T02 to data files + domain/gate/notes components — browser walkthrough in T03 revealed 6 additional hardcoded strings in HomePage, PersonalPage, and ResumePage that needed updating.
