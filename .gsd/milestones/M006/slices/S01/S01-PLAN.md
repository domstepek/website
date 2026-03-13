# S01: Title case, stack tag reorder, and flagship card readability

**Goal:** Domain proof pages are scannable and polished — title-cased names, stack tags surfaced under titles, readable lists with visual rhythm and breathing room.
**Demo:** Visiting any authenticated domain proof page shows title-cased project names, stack tags directly under the title, a header/body separator, accent-bordered section labels, and ›-prefixed list items with increased spacing — all 18 Playwright tests still pass.

## Must-Haves

- All flagship and supporting work titles render in title case across `/domains/product`, `/domains/analytics-ai`, `/domains/developer-experience`
- Stack tags appear directly under each flagship project's h3 title, before the role line
- A visible border separates the card header (title + stack + role) from the content body
- Section labels (Problem, Constraints, Decisions, Outcomes) have an accent-colored left border
- List items in flagship sections display a `›` prefix marker instead of bare unstyled bullets
- List items have increased spacing for readability
- All 18 Playwright tests pass unchanged
- `npm run build` succeeds

## Proof Level

- This slice proves: contract (existing Playwright suite unchanged) + visual (human inspection)
- Real runtime required: yes — dev server for visual UAT
- Human/UAT required: yes — CSS styling correctness is visually verified

## Verification

- `npm run build` exits 0
- `npx playwright test` — all 18 tests pass (DOM marker contract preserved)
- Visual inspection of `/domains/product`, `/domains/analytics-ai`, `/domains/developer-experience` at desktop and mobile viewports in dev server

## Observability / Diagnostics

- Runtime signals: none — purely static visual changes, no runtime behavior
- Inspection surfaces: Playwright tests exercise DOM marker contract (`data-flagship-highlights`, `data-flagship`, `data-supporting-work`, `data-supporting-item`); browser dev tools for CSS specificity debugging
- Failure visibility: Playwright test failure messages identify which DOM marker is missing; CSS cascade issues visible in browser computed styles panel
- Redaction constraints: none

## Integration Closure

- Upstream surfaces consumed: `src/data/domains/*.ts` (title strings), `src/components/domains/DomainProofPage.tsx` (card layout), `src/app/globals.css` (site-wide styles)
- New wiring introduced in this slice: `.flagship-list` CSS class in `globals.css` consumed by `DomainProofPage.tsx`
- What remains before the milestone is truly usable end-to-end: nothing — S01 is the only slice in M006

## Tasks

- [x] **T01: Title-case all project names in domain data files** `est:15m`
  - Why: Flagship and supporting work titles are currently sentence-case ("Sample tracking") and need to be title case ("Sample Tracking") per M006 success criteria
  - Files: `src/data/domains/product.ts`, `src/data/domains/analytics-ai.ts`, `src/data/domains/developer-experience.ts`
  - Do: Edit each title string to title case. Preserve acronyms exactly (CLI, CMS, CDN, SSO, CDK-EKS, MCP, API). Keep prepositions lowercase (in, on). Keep proper nouns as-is (Charla.cc, Umami, Datalabs, Superset, Stargazer, Bedrock). Also title-case the developer-experience domain title itself.
  - Verify: `npm run build` exits 0; `npx playwright test` — all 18 pass
  - Done when: all ~21 titles across 3 data files are title-cased and both build + tests pass

- [x] **T02: Restructure flagship card layout and add `.flagship-list` CSS** `est:45m`
  - Why: The remaining 6 must-haves — stack tag reorder, header/body separator, accent-bordered section labels, ›-prefixed lists, increased spacing — all require coordinated changes to `DomainProofPage.tsx` and `globals.css`
  - Files: `src/components/domains/DomainProofPage.tsx`, `src/app/globals.css`
  - Do: (1) Move stack tags from card bottom to directly after h3, before role line. (2) Add a border-top separator div between header block (title+stack+role) and content body. (3) Add `border-l-2 border-[var(--accent)] pl-2` to section label `<p>` elements. (4) Add `flagship-list` class to section `<ul>` elements. (5) In `globals.css`, add `.site-main .flagship-list` rules: `list-style: none`, `padding-left: 0`, increased `gap`. (6) Add `.site-main .flagship-list li` rules: `display: flex`, `gap: 0.5rem`, `::before { content: '›'; flex-shrink: 0; color: var(--accent) }`. (7) Use `.site-main .flagship-list` selector (specificity `0,2,0`) to beat `.site-main ul` (`0,1,1`).
  - Verify: `npm run build` exits 0; `npx playwright test` — all 18 pass; visual inspection of all 3 domain pages at desktop and mobile
  - Done when: all 6 card layout must-haves render correctly, build passes, all 18 tests pass, visual inspection confirms styling at desktop and mobile viewports

## Files Likely Touched

- `src/data/domains/product.ts`
- `src/data/domains/analytics-ai.ts`
- `src/data/domains/developer-experience.ts`
- `src/components/domains/DomainProofPage.tsx`
- `src/app/globals.css`
