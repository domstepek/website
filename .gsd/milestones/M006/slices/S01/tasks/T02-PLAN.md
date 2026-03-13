---
estimated_steps: 7
estimated_files: 2
---

# T02: Restructure flagship card layout and add `.flagship-list` CSS

**Slice:** S01 — Title case, stack tag reorder, and flagship card readability
**Milestone:** M006

## Description

Restructure the flagship card layout in `DomainProofPage.tsx` and add the `.flagship-list` CSS class in `globals.css`. This task delivers 6 of the 8 slice must-haves: stack tags moved under h3, header/body separator, accent-bordered section labels, ›-prefixed list markers, increased list spacing, and proper CSS specificity to override `.site-main` defaults.

## Steps

1. Read `src/components/domains/DomainProofPage.tsx` to understand current card structure — identify where stack tags render, section labels, and list elements.
2. Move the stack tags block (the `div` with `flex flex-wrap gap-2` containing tech stack spans) from its current position at the bottom of the card to directly after the `<h3>` title, before the role line.
3. Add a separator between the header block (title + stack tags + role) and the content body — use a `<div>` with `border-t border-[var(--border)]` and appropriate margin/padding.
4. Add accent left border to section label `<p>` elements — add `border-l-2 border-[var(--accent)] pl-2` to each section label (Problem, Constraints, Decisions, Outcomes).
5. Add `flagship-list` class to each section `<ul>` element alongside existing classes.
6. Add `.flagship-list` CSS rules in `src/app/globals.css`:
   - `.site-main .flagship-list` (specificity `0,2,0` beats `.site-main ul` at `0,1,1`): `list-style: none; padding-left: 0;` plus increased gap (e.g. `gap: 0.5rem`).
   - `.site-main .flagship-list li`: override `.site-main li + li` margin; set `display: flex; gap: 0.5rem;` for marker alignment.
   - `.site-main .flagship-list li::before`: `content: '›'; flex-shrink: 0; color: var(--accent);` for the marker.
7. Start dev server, visually inspect all three domain pages (`/domains/product`, `/domains/analytics-ai`, `/domains/developer-experience`) at desktop (~1280px) and mobile (~375px) viewports. Then run `npm run build` and `npx playwright test`.

## Must-Haves

- [ ] Stack tags appear directly under each flagship h3, before role line
- [ ] Visible border separates card header (title + stack + role) from content body
- [ ] Section labels have accent-colored left border (`border-l-2 border-[var(--accent)]`)
- [ ] List items display `›` prefix marker (via CSS `::before`)
- [ ] List items have increased spacing for readability
- [ ] `.site-main .flagship-list` CSS specificity beats `.site-main ul` — no leftover padding-left from site defaults
- [ ] All `data-*` DOM marker attributes unchanged
- [ ] `npm run build` exits 0
- [ ] All 18 Playwright tests pass

## Verification

- `npm run build` exits 0
- `npx playwright test` — all 18 tests pass
- Visual inspection: stack tags under h3, separator visible, section labels have accent border, lists show `›` markers with no bullet overlap
- Browser dev tools: computed `padding-left` on `.flagship-list` is `0` (not `1.25rem` from `.site-main ul`)

## Observability Impact

- Signals added/changed: None — purely visual CSS and layout changes
- How a future agent inspects this: browser dev tools computed styles on `.flagship-list` elements; Playwright DOM marker tests confirm no structural regression
- Failure state exposed: None

## Inputs

- `src/components/domains/DomainProofPage.tsx` — current card layout (T01 has already changed titles in data files)
- `src/app/globals.css` — existing `.site-main` rules at lines 149–200, flagship-scoped CSS at lines 1120–1140
- S01-RESEARCH.md specificity analysis and pitfall notes (preloaded in slice context)

## Expected Output

- `src/components/domains/DomainProofPage.tsx` — restructured card: stack tags after h3, separator div, accent-bordered labels, `flagship-list` class on `<ul>` elements
- `src/app/globals.css` — new `.site-main .flagship-list`, `.site-main .flagship-list li`, `.site-main .flagship-list li::before` rule blocks
