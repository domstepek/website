---
id: T02
parent: S01
milestone: M006
provides:
  - Restructured flagship card layout with stack tags under h3, header/body separator, accent-bordered section labels, and ›-prefixed list items
key_files:
  - src/components/domains/DomainProofPage.tsx
  - src/app/globals.css
key_decisions:
  - Used `.site-main .flagship-list` selector (specificity 0,2,0) to override `.site-main ul` (0,1,1) — avoids !important and stays within the existing cascade
patterns_established:
  - `.flagship-list` CSS class for custom list styling within `.site-main` scope
  - Accent left border on section labels via inline Tailwind classes
observability_surfaces:
  - none
duration: ~15m
verification_result: passed
completed_at: 2026-03-13
blocker_discovered: false
---

# T02: Restructure flagship card layout and add `.flagship-list` CSS

**Restructured flagship cards: stack tags moved under h3, header/body separator added, section labels accent-bordered, list items use › markers with increased spacing.**

## What Happened

Edited `DomainProofPage.tsx` to restructure each flagship `<article>` card:
1. Moved the stack tags `<div>` from the bottom of the card into the `<header>` block, directly after `<h3>` and before the role `<p>`.
2. Added a `<div className="border-t border-[var(--border)]" />` separator between the header and the content body.
3. Added `border-l-2 border-[var(--accent)] pl-2` to the four section label `<p>` elements (Problem, Constraints, Decisions, Outcomes).
4. Added `flagship-list` class to the three section `<ul>` elements (Constraints, Decisions, Outcomes). Removed the old `gap-1` class since spacing is now controlled by CSS.

Added three CSS rule blocks in `globals.css` after the flagship figure section:
- `.site-main .flagship-list`: `list-style: none; padding-left: 0; display: flex; flex-direction: column; gap: 0.5rem;`
- `.site-main .flagship-list li`: `display: flex; gap: 0.5rem; margin-top: 0;` (overrides `.site-main li + li` margin)
- `.site-main .flagship-list li::before`: `content: '›'; flex-shrink: 0; color: var(--accent);`

## Verification

- `pnpm build` — exits 0
- `npx playwright test` — all 18 tests pass
- Visual inspection of `/domains/product`, `/domains/analytics-ai`, `/domains/developer-experience` at desktop (1280px) and mobile (375px) viewports:
  - Stack tags render directly under h3 title ✓
  - Border separator visible between header and body ✓
  - Section labels have green accent left border ✓
  - List items show › prefix markers ✓
  - List items have increased 0.5rem gap spacing ✓
- Browser dev tools: computed `padding-left` on `.flagship-list` is `0px`, `list-style-type` is `none` — confirms specificity override works

## Diagnostics

None — purely visual CSS and layout changes. Future inspection via browser dev tools computed styles on `.flagship-list` elements; Playwright DOM marker tests confirm no structural regression.

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `src/components/domains/DomainProofPage.tsx` — moved stack tags into header, added separator div, accent-bordered section labels, `flagship-list` class on `<ul>` elements
- `src/app/globals.css` — added `.site-main .flagship-list`, `.site-main .flagship-list li`, `.site-main .flagship-list li::before` rule blocks
