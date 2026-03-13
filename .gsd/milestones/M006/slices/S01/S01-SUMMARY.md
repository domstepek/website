---
id: S01
parent: M006
milestone: M006
provides:
  - Title-cased project names across all domain data files
  - Restructured flagship card layout with stack tags under title, header/body separator, accent-bordered section labels, and ›-prefixed list items
requires: []
affects: []
key_files:
  - src/data/domains/product.ts
  - src/data/domains/analytics-ai.ts
  - src/data/domains/developer-experience.ts
  - src/components/domains/DomainProofPage.tsx
  - src/app/globals.css
key_decisions:
  - Used `.site-main .flagship-list` selector (specificity 0,2,0) to override `.site-main ul` (0,1,1) — avoids !important and stays within the existing cascade
  - Accent left border on section labels via inline Tailwind classes rather than a new CSS class
patterns_established:
  - Title-case convention for all project titles in domain data files (acronyms preserved, prepositions lowercase, proper nouns as-is)
  - `.flagship-list` CSS class for custom list styling within `.site-main` scope
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M006/slices/S01/tasks/T01-SUMMARY.md
  - .gsd/milestones/M006/slices/S01/tasks/T02-SUMMARY.md
duration: ~20m
verification_result: passed
completed_at: 2026-03-13
---

# S01: Title case, stack tag reorder, and flagship card readability

**Title-cased all project names across 3 domain data files and restructured flagship cards with stack tags under titles, header/body separator, accent-bordered section labels, and ›-prefixed list items with increased spacing.**

## What Happened

T01 edited 13 title strings across `product.ts`, `analytics-ai.ts`, and `developer-experience.ts` from sentence case to title case, preserving acronyms (CLI, CMS, CDN, SSO, CDK-EKS, MCP, API), lowercase prepositions, and proper nouns. Eight titles were already correct and left unchanged.

T02 restructured `DomainProofPage.tsx` flagship `<article>` cards: moved stack tags from card bottom into the header directly after `<h3>`, added a `border-t` separator between header and content body, added `border-l-2 border-[var(--accent)] pl-2` to section label `<p>` elements, and added `flagship-list` class to section `<ul>` elements. Three CSS rule blocks were added to `globals.css` for `.site-main .flagship-list` providing `list-style: none`, `padding-left: 0`, `gap: 0.5rem`, flex layout on `li` elements, and `›` prefix via `::before` pseudo-element colored with `var(--accent)`. The `.site-main .flagship-list` selector at specificity `0,2,0` cleanly overrides `.site-main ul` at `0,1,1`.

## Verification

- `pnpm build` exits 0 — all 8 static pages generated
- `npx playwright test` — all 18 tests pass (DOM marker contract preserved)
- Visual inspection of `/domains/product`, `/domains/analytics-ai`, `/domains/developer-experience` at desktop and mobile viewports confirmed all 6 card layout must-haves render correctly

## Requirements Advanced

- None — M006 is a polish pass; no active requirements exist

## Requirements Validated

- None — all 20 requirements were already validated before M006

## New Requirements Surfaced

- None

## Requirements Invalidated or Re-scoped

- None

## Deviations

None.

## Known Limitations

None — all must-haves from the slice plan are implemented and verified.

## Follow-ups

None.

## Files Created/Modified

- `src/data/domains/product.ts` — title-cased 3 project titles
- `src/data/domains/analytics-ai.ts` — title-cased 3 project titles
- `src/data/domains/developer-experience.ts` — title-cased domain title + 7 project titles
- `src/components/domains/DomainProofPage.tsx` — moved stack tags into header, added separator div, accent-bordered section labels, `flagship-list` class on `<ul>` elements
- `src/app/globals.css` — added `.site-main .flagship-list`, `.site-main .flagship-list li`, `.site-main .flagship-list li::before` rule blocks

## Forward Intelligence

### What the next slice should know
- M006 has only one slice — no downstream consumer exists

### What's fragile
- `.flagship-list` CSS specificity depends on being nested under `.site-main` — if `.site-main` is removed or renamed, the override chain breaks

### Authoritative diagnostics
- Playwright tests exercise the DOM marker contract; CSS specificity is verifiable via browser dev tools computed styles on `.flagship-list` elements

### What assumptions changed
- No assumptions changed — the slice executed exactly as planned
