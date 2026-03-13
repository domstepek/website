# S01: Title case, stack tag reorder, and flagship card readability — Research

**Date:** 2026-03-13

## Summary

This slice is a contained presentational pass touching three file groups: data files (title casing), one React server component (`DomainProofPage.tsx`), and one CSS file (`globals.css`). No logic changes, no new components, no routing changes. The codebase is fully explored and every change is additive.

The component is a ~170-line pure RSC with a flat card layout. Stack tags render at the bottom of each flagship card, section labels are plain `<p>` elements, and list items are bare `<li>` elements in `flex flex-col gap-1 pl-4` containers. The `.site-main` styles apply `padding-left: 1.25rem` and `margin-top: 0.55rem` to `ul`/`li` elements, which partially overlap with the Tailwind utilities already on the card lists. All 18 Playwright tests use `data-*` attribute selectors — zero text matching — so title-case changes are risk-free.

The safest execution is 2 tasks: (1) title-case all project titles in data files, (2) restructure `DomainProofPage.tsx` card layout + add `.flagship-list` CSS to `globals.css`. Task 1 is zero-dependency, smallest blast radius. Task 2 groups the component and CSS changes since they reference each other directly.

## Recommendation

Ship as 2 tasks within this single slice. Task 1: data file title fixes across all three domain files (zero risk, immediate improvement). Task 2: component restructuring + CSS additions (reorder stack tags to after h3, add header/body separator, style section labels with accent border, add `.flagship-list` class for `›`-prefixed lists, increase spacing). Prove with `next build` + full Playwright suite. Visual verification via dev server for styling.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Title casing | Manual string edits | Only ~21 titles across 3 files. Proper nouns (CLI, CMS, CDN, SSO, CDK-EKS, MCP, API, Charla.cc) need specific casing — a generic `toTitleCase()` would break them. |
| Custom list markers (›) | CSS `list-style: none` + `::before` pseudo-element | Keeps data clean, no JSX injection. The `::before` approach is more maintainable than prepending markers in data strings. |
| Section label accent border | Tailwind `border-l-2` arbitrary value | Already available — `border-l-2 border-[var(--accent)] pl-2` is one line. No custom CSS needed. |

## Existing Code and Patterns

- `src/components/domains/DomainProofPage.tsx` (~170 lines) — Pure RSC. Card layout: `border border-[var(--border)] bg-[var(--bg-elevated)] p-6 flex flex-col gap-4`. Stack tags render after outcomes at bottom. Section labels are `<p className="text-[var(--text)] text-xs uppercase tracking-wider">`. Lists use `<ul className="flex flex-col gap-1 pl-4">` with unstyled `<li>`. Reorder stack tags to after `<h3>` and before role, add separator `<hr>` or `border-t` div, style section labels, add `.flagship-list` class to `<ul>` elements.
- `src/data/domains/product.ts` — 3 flagships: "Sample tracking" → "Sample Tracking", "Supply chain forecasting" → "Supply Chain Forecasting", "Charla.cc" stays as-is. 2 supporting: "Pricing app" → "Pricing App", "CMS" stays as-is.
- `src/data/domains/analytics-ai.ts` — 1 flagship: "Collection curator" → "Collection Curator". 4 supporting: "MCP tools & agent demo" → "MCP Tools & Agent Demo", "Bedrock utilities in Datalabs API" → "Bedrock Utilities in Datalabs API", "Superset on Stargazer" → "Superset on Stargazer" (prepositions stay lowercase), "Umami" stays as-is.
- `src/data/domains/developer-experience.ts` — Domain title: "Developer experience" → "Developer Experience". 2 flagships: "Monorepo template" → "Monorepo Template", "Global design system" → "Global Design System". 6 supporting: "Product team CLI" → "Product Team CLI", "Product migration scripts" → "Product Migration Scripts", "CDK-EKS contributions" → "CDK-EKS Contributions", "Stargazer applications" → "Stargazer Applications", "Private CDN" stays as-is, "SSO reverse proxy" → "SSO Reverse Proxy".
- `src/data/domains/domain-view-model.ts` — Passes titles through unchanged. No changes needed.
- `src/data/domains/types.ts` — `title: string`, fully flexible. No changes needed.
- `src/app/globals.css` (lines 149–200) — `.site-main ul, .site-main ol { padding-left: 1.25rem; }` and `.site-main li + li { margin-top: 0.55rem; }`. The `.flagship-list` class must override these. Existing flagship-scoped CSS at lines 1120–1140: `.flagship__figure`, `.flagship__image`, `.flagship__caption` — naming convention to follow.
- `tests/e2e/gate.spec.ts` — Tests use `data-flagship-highlights`, `data-supporting-work`, `data-flagship`, `data-supporting-item` selectors. Zero text content matching. All safe.

## Constraints

- **DOM marker contract preserved.** These `data-*` attributes are consumed by tests and must not change: `data-route-visibility`, `data-protected-proof-state`, `data-visual-state`, `data-flagship-highlights`, `data-flagship`, `data-supporting-work`, `data-supporting-item`. None of the M006 changes alter these.
- **`.site-main` specificity.** `.site-main ul` and `.site-main li + li` use element selectors under a class — specificity `0,1,1`. A `.flagship-list` class selector alone is `0,1,0` which is lower. Must use `.flagship-list` as a class on the `<ul>` and style both `.flagship-list` and `.flagship-list li` to override. Alternatively, the existing rules use `:where()` wrappers for some properties (`:where(p, ul, ol)` has zero specificity), so `.flagship-list` will win for `max-width`. But `padding-left` comes from `.site-main ul` (specificity `0,1,1`) — need `.flagship-list` to be at least that specific or use the component's existing `pl-4` Tailwind class which applies directly.
- **Tailwind v4 config.** No `tailwind.config.ts` — all config in `@theme` block in `globals.css`. Custom CSS classes go in `globals.css` as plain CSS.
- **RSC constraint.** `DomainProofPage.tsx` is a pure server component — no client-side hooks, state, or effects.

## Common Pitfalls

- **Title case edge cases.** Acronyms and proper nouns must be preserved exactly: "CDK-EKS", "CMS", "SSO", "CLI", "CDN", "MCP", "API", "Charla.cc", "Umami", "Datalabs". Only lowercase first-letter words in sentence-case titles need capitalizing. Prepositions ("in", "on") stay lowercase per standard title case.
- **`.site-main` specificity for `padding-left`.** `.site-main ul { padding-left: 1.25rem }` has specificity `0,1,1`. The current card lists use `pl-4` (Tailwind inline class, specificity `0,1,0` with `@layer utilities`), but `.site-main ul` wins in the cascade. The `.flagship-list` CSS should set `padding-left: 0` explicitly. Since Tailwind v4 puts utilities in `@layer utilities` which has lower priority than unlayered CSS, the `.flagship-list` rule in unlayered CSS at `0,1,0` still loses to `.site-main ul` at `0,1,1`. Solution: target `.site-main .flagship-list` in CSS (`0,2,0`) or ensure the class specificity wins.
- **`::before` marker alignment.** Current lists use `flex flex-col` on `<ul>` (each `<li>` is a flex item). For `›` markers, switch `<li>` items to `display: flex; gap: 0.5rem` with `::before { content: '›'; flex-shrink: 0 }` so the marker stays left-aligned and multi-line text wraps cleanly.
- **Card padding at mobile viewport.** Increasing from `p-6` to `p-8` (1.5rem → 2rem) — verify at ~375px that cards don't overflow. The cards are already in a flex column so width isn't an issue, but padding eats into available content width.

## Open Risks

- **No visual regression tests.** Changes are verified by human visual inspection only. CSS conflicts or unintended cascading effects won't be caught automatically. Mitigate by inspecting all three domain pages in dev server at desktop and mobile before finishing.
- **Specificity of `.flagship-list` vs `.site-main ul`.** This is the one CSS detail that could cause a silent failure (list padding not resetting). Must verify in browser dev tools that `.flagship-list` actually wins.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Frontend Design | `frontend-design` | installed |
| Tailwind CSS | Various community skills | available but not needed — changes are too targeted |
| Next.js App Router | Various community skills | available but not needed — no routing changes |

No skill installation recommended. The work is straightforward data edits, Tailwind utility additions, and a small CSS class. The installed `frontend-design` skill covers the relevant patterns.

## Sources

- Direct codebase exploration: `DomainProofPage.tsx`, all three domain data files, `globals.css`, `types.ts`, `domain-view-model.ts`, test files
- M006-RESEARCH.md milestone research (preloaded)
- CSS specificity analysis via `.site-main` rule inspection in `globals.css` lines 149–200
