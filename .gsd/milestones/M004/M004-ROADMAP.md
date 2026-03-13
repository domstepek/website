# M004: Sentence Case Audit

**Vision:** Every visitor-facing string on the site uses sentence case with standard "I" capitalization — the casual, direct tone stays, only the all-lowercase affectation goes away.

## Success Criteria

- A visitor browsing `/`, `/about/`, `/domains/*` (locked and unlocked states), `/notes/*`, and `/404` sees consistent sentence-cased copy with capitalized "I" throughout
- No CSS `text-transform: lowercase` remains in shipped styles
- The full `pnpm validate:site` suite passes (23 tests) with zero regressions
- Domain proof content renders identically between cold-load (server) and dynamic-unlock (client) paths — no casing mismatch

## Key Risks / Unknowns

- **Dual-render parity** — `DomainPage.astro` and `domain-proof-view.ts` both render section headings and inline labels; updating one without the other creates a visible inconsistency between cold-load and post-unlock views.

## Proof Strategy

Not needed — this is a straightforward content/CSS change. The dual-render risk is retired by updating both files in the same slice and visually verifying both paths.

## Verification Classes

- Contract verification: `pnpm validate:site` (23 existing tests — already case-insensitive)
- Integration verification: Visual browser check of cold-load locked gate, post-unlock proof rendering, and public pages
- Operational verification: None — static site
- UAT / human verification: Quick visual scan of all page types to confirm no leftover lowercase headings or un-capitalized "I"

## Milestone Definition of Done

This milestone is complete only when all are true:

- All visitor-facing copy in data files, components, and notes frontmatter uses sentence case
- CSS `text-transform: lowercase` on `.site-title` is removed
- `pnpm validate:site` passes (23 tests)
- A browser walkthrough of homepage, about, a locked domain page, an unlocked domain page, notes index, a note page, and 404 confirms consistent sentence-cased copy
- D003 is superseded by D031 in DECISIONS.md

## Requirement Coverage

- Covers: No active requirements — this milestone addresses a design decision revision (D003 → D031)
- Partially covers: None
- Leaves for later: None
- Orphan risks: None — zero active requirements in REQUIREMENTS.md; all 19 requirements are already validated

## Slices

- [x] **S01: Sentence case all visitor-facing copy and remove lowercase CSS** `risk:low` `depends:[]`
  > After this: A visitor can browse every page on the site and see sentence-cased copy with capitalized "I" throughout, with no CSS forcing lowercase — confirmed by `pnpm validate:site` (23 tests) and a browser walkthrough of all page types including both locked and unlocked domain views.

## Boundary Map

### S01

Produces:
- All `src/data/*.ts` strings converted to sentence case (preserved TypeScript interfaces and data shapes)
- All hardcoded component strings in `.astro` and `.ts` files converted to sentence case
- `DomainPage.astro` and `domain-proof-view.ts` section headings and labels updated in lockstep
- Notes frontmatter titles and summaries in sentence case
- `text-transform: lowercase` removed from `.site-title` in `global.css`
- D031 recorded in DECISIONS.md (superseding D003)

Consumes:
- Nothing (single slice milestone)
