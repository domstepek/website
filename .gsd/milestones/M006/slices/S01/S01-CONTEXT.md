---
id: S01
milestone: M006
status: ready
---

# S01: Title case, stack tag reorder, and flagship card readability — Context

## Goal

Make the domain proof flagship cards scannable and polished by title-casing project names, surfacing stack tags directly under each title, and giving the body sections (problem, constraints, decisions, outcomes) clear visual rhythm with markers, spacing, and separators.

## Why this Slice

This is the only slice in M006. The domain proof pages are the core portfolio artifact — what a recruiter or collaborator reads after unlocking. The three issues (sentence-cased titles, buried stack tags, wall-of-text card bodies) all degrade scannability of that artifact. Fixing them is low-risk, purely presentational, and independent of any other work.

## Scope

### In Scope

- Title-case all flagship and supporting work titles across `product.ts`, `analytics-ai.ts`, `developer-experience.ts` (including domain title "Developer Experience")
- Move stack tags from the bottom of each flagship card to directly under the h3 title, before the role line
- Add a `border-t` separator between the card header block (title + stack + role) and the content body
- Add `›` prefix markers to constraints, decisions, and outcomes list items via a `.flagship-list` CSS class
- Add accent-colored left border (`border-l-2 border-[var(--accent)]`) to section labels (Problem, Constraints, Decisions, Outcomes)
- Increase card padding to `p-8` and inter-section gap to `gap-6` — user confirmed "airy / spacious" feel
- Dim role text slightly (`opacity-60`) to differentiate it from section label text

### Out of Scope

- Rendering `scope` text on the proof page (stays gate-only per user decision)
- Rendering `belongsHere` lists anywhere (stays unused per user decision)
- Changes to the gate page (`DomainGatePage.tsx`)
- Changes to any other pages (homepage, about, resume, notes)
- Adding new content or restructuring the domain data model
- Adding or modifying Playwright tests (DOM marker contract is unchanged)

## Constraints

- DOM marker contract must be preserved: `data-flagship-highlights`, `data-flagship`, `data-supporting-work`, `data-supporting-item` and all other `data-*` attributes consumed by the 18 Playwright tests
- `.flagship-list` CSS must override `.site-main ul` defaults (which apply `padding-left: 1.25rem` and `li + li { margin-top: 0.55rem }`) — use explicit `list-style: none`, `padding: 0`, and `::before` for the `›` marker
- Title case must be applied manually per title — no generic `toTitleCase()` function, because proper nouns and acronyms (CDK-EKS, CMS, CLI, CDN, SSO, MCP, API, Charla.cc, Umami) need specific casing
- Must pass `next build` and all 18 Playwright tests unchanged

## Integration Points

### Consumes

- `src/data/domains/product.ts` — flagship and supporting work titles (sentence-cased → title-cased)
- `src/data/domains/analytics-ai.ts` — flagship and supporting work titles
- `src/data/domains/developer-experience.ts` — domain title + flagship and supporting work titles
- `src/components/domains/DomainProofPage.tsx` — current card layout JSX to restructure
- `src/app/globals.css` — existing `.site-main` styles and `.flagship__figure` patterns

### Produces

- Title-cased strings in all three domain data files
- Restructured `DomainProofPage.tsx` with stack tags after h3, separator div, accent-bordered section labels, `.flagship-list` class on lists, increased spacing
- `.flagship-list` CSS class in `globals.css` with `›` markers via `::before`

## Open Questions

- None — all behavioural decisions resolved during discuss.
