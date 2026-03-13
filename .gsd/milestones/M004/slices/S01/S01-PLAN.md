# S01: Sentence case all visitor-facing copy and remove lowercase CSS

**Goal:** Every visitor-facing string on the site uses sentence case with standard "I" capitalization, and no CSS forces lowercase.
**Demo:** A visitor browsing `/`, `/about/`, `/domains/*` (locked and unlocked), `/notes/*`, and `/404` sees consistent sentence-cased copy. `pnpm validate:site` passes 23 tests with zero regressions.

## Must-Haves

- All `src/data/*.ts` strings converted to sentence case with "I" capitalized
- All hardcoded component strings in `.astro` and `.ts` files converted to sentence case
- `DomainPage.astro` and `domain-proof-view.ts` section headings and labels updated in lockstep
- `domain-gate-client.ts` status strings sentence-cased
- Notes frontmatter titles and summaries in sentence case
- `text-transform: lowercase` removed from `.site-title` in `global.css`
- Date `.toLowerCase()` calls preserved in `NotesIndexPage.astro` and `NotePage.astro`
- `text-transform: uppercase` rules untouched
- Abbreviations (AI, SSO, CDK, AWS, GCP, DevEx) preserved
- D031 recorded in DECISIONS.md superseding D003

## Proof Level

- This slice proves: final-assembly
- Real runtime required: yes (browser walkthrough of all page types)
- Human/UAT required: yes (visual scan confirming no leftover lowercase headings)

## Verification

- `pnpm build` — site builds without errors after all text changes
- `pnpm validate:site` — all 23 tests pass with zero regressions
- Browser walkthrough: homepage, about, locked domain page, unlocked domain page, notes index, note page, 404 — all show sentence-cased copy
- `rg 'text-transform:\s*lowercase' src/` returns no matches

## Observability / Diagnostics

- Runtime signals: none — static site, no runtime state
- Inspection surfaces: `pnpm validate:site` (23 tests), `rg` for leftover lowercase CSS, browser visual inspection
- Failure visibility: test failures report exact assertion mismatch; `rg` shows file:line for any leftover CSS
- Redaction constraints: none

## Integration Closure

- Upstream surfaces consumed: all `src/data/*.ts` data files, `.astro` templates, `domain-proof-view.ts`, `domain-gate-client.ts`, `global.css`, notes markdown files
- New wiring introduced in this slice: none (text content changes only)
- What remains before the milestone is truly usable end-to-end: nothing — single-slice milestone

## Tasks

- [x] **T01: Sentence-case all data files and remove lowercase CSS** `est:45m`
  - Why: Data files contain ~80% of visitor-facing copy. CSS removal must happen simultaneously to avoid the rule overriding new casing. This is the highest-surface-area change and should be proven with a build first.
  - Files: `src/data/site.ts`, `src/data/home.ts`, `src/data/personal.ts`, `src/data/domains/product.ts`, `src/data/domains/developer-experience.ts`, `src/data/domains/analytics-ai.ts`, `src/styles/global.css`
  - Do: Sentence-case all visitor-facing strings in 6 data files. Capitalize "I" and "I'm/I've/I'll/I'd" contractions. Preserve abbreviations (AI, SSO, CDK, AWS, GCP, DevEx). Remove `text-transform: lowercase` from `.site-title` in `global.css`. Do not touch `text-transform: uppercase` rules.
  - Verify: `pnpm build` succeeds; `rg 'text-transform:\s*lowercase' src/` returns nothing
  - Done when: All data file strings are sentence-cased, CSS lowercase rule is removed, and site builds cleanly

- [x] **T02: Sentence-case components, client renderers, and notes** `est:45m`
  - Why: Components and client renderers contain the remaining visitor-facing strings. The dual-render parity between `DomainPage.astro` and `domain-proof-view.ts` is the riskiest seam — both must be updated in lockstep. Gate client status strings were missed in milestone research but are visitor-facing.
  - Files: `src/components/DomainGateShell.astro`, `src/pages/domains/[slug].astro` (DomainPage), `src/scripts/domain-proof-view.ts`, `src/scripts/domain-gate-client.ts`, `src/components/NotesIndexPage.astro`, `src/components/NotePage.astro`, `src/pages/404.astro`, `src/content/notes/keep-the-path-explicit.md`, `src/content/notes/systems-over-abstractions.md`
  - Do: Sentence-case all hardcoded strings in listed files. Update `DomainPage.astro` and `domain-proof-view.ts` in lockstep — identical section headings and labels. Update gate client status strings. Update notes frontmatter. Preserve `.toLowerCase()` date formatting in NotesIndexPage and NotePage. Preserve all `data-*` and `aria-*` attributes unchanged.
  - Verify: `pnpm build` succeeds; `pnpm validate:site` passes all 23 tests
  - Done when: All component/renderer/note strings are sentence-cased, dual-render parity holds, and full test suite passes

- [x] **T03: Browser walkthrough and decision record** `est:30m` ✅
  - Why: Mechanical text changes need visual verification to catch edge cases that automated tests miss. D031 must be formally recorded as superseding D003.
  - Files: `.gsd/DECISIONS.md`
  - Do: Start dev server. Browser walkthrough of homepage, about, one locked domain page, unlock and verify proof view, notes index, a note page, and 404. Verify sentence case throughout and no leftover lowercase affectation. Confirm dual-render parity between cold-load locked shell and post-unlock proof view. Append D031 to DECISIONS.md if not already present (check first — it was added during milestone planning).
  - Verify: All 7 page types visually confirmed sentence-cased; `pnpm validate:site` passes 23 tests; D031 exists in DECISIONS.md
  - Done when: Browser walkthrough complete with no casing issues found, test suite green, D031 recorded

## Files Likely Touched

- `src/data/site.ts`
- `src/data/home.ts`
- `src/data/personal.ts`
- `src/data/domains/product.ts`
- `src/data/domains/developer-experience.ts`
- `src/data/domains/analytics-ai.ts`
- `src/styles/global.css`
- `src/components/DomainGateShell.astro`
- `src/pages/domains/[slug].astro`
- `src/scripts/domain-proof-view.ts`
- `src/scripts/domain-gate-client.ts`
- `src/components/NotesIndexPage.astro`
- `src/components/NotePage.astro`
- `src/pages/404.astro`
- `src/content/notes/keep-the-path-explicit.md`
- `src/content/notes/systems-over-abstractions.md`
- `.gsd/DECISIONS.md`
