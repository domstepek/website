# M006: UI Polish — Domain Pages & Typography

**Vision:** Domain proof pages are scannable and polished — title-cased project names, stack tags surfaced under titles, readable list sections with visual rhythm and breathing room.

## Success Criteria

- All flagship and supporting work titles on `/domains/product`, `/domains/analytics-ai`, and `/domains/developer-experience` render in title case (e.g. "Sample Tracking", "Supply Chain Forecasting", "Collection Curator")
- Stack tags (React, Express, etc.) appear directly under each flagship project's h3 title, before the role line
- Constraints, decisions, and outcomes list items display a `›` prefix marker instead of bare unstyled bullets
- Section labels (Problem, Constraints, Decisions, Outcomes) have an accent-colored left border
- A visible border separates the card header (title + stack + role) from the content body
- All 18 Playwright tests pass unchanged
- `next build` succeeds

## Key Risks / Unknowns

None. This is purely additive CSS and data string edits against a stable codebase with full test coverage. No logic changes, no new components, no routing changes.

## Verification Classes

- Contract verification: 18 existing Playwright tests (DOM marker contract unchanged) + `next build`
- Integration verification: none — static visual changes only
- Operational verification: none
- UAT / human verification: visual inspection of all three domain proof pages in dev server to confirm styling looks correct

## Milestone Definition of Done

This milestone is complete only when all are true:

- All flagship and supporting work titles are title-cased in data files
- `DomainProofPage.tsx` renders stack tags under h3, separator between header and body, styled section labels, and `›`-prefixed lists
- `.flagship-list` CSS class exists in `globals.css` and renders correctly
- `next build` exits 0
- All 18 Playwright tests pass against production build
- Visual inspection confirms all three domain pages render correctly at desktop and mobile viewports

## Requirement Coverage

- Covers: none (no active requirements — all 20 are validated; M006 is an incremental polish pass improving the R003 proof surface)
- Partially covers: none
- Leaves for later: none
- Orphan risks: none

## Slices

- [ ] **S01: Title case, stack tag reorder, and flagship card readability** `risk:low` `depends:[]`
  > After this: visiting any authenticated domain proof page shows title-cased project names, stack tags directly under the title, a header/body separator, accent-bordered section labels, and ›-prefixed list items with increased spacing — all 18 Playwright tests still pass.

## Boundary Map

### S01

Produces:
- Title-cased strings in `src/data/domains/product.ts`, `analytics-ai.ts`, `developer-experience.ts`
- Reordered JSX in `DomainProofPage.tsx` (stack tags after h3, separator div, styled section labels, `.flagship-list` class on section `<ul>` elements)
- `.flagship-list` CSS class in `globals.css` (list-style: none, `›` via `::before`, overrides `.site-main ul` defaults)

Consumes:
- nothing (first and only slice)
