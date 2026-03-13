# M004: Sentence Case Audit — Context

**Gathered:** 2026-03-12
**Status:** Queued — pending auto-mode execution.

## Project Description

Convert all visitor-facing site copy from all-lowercase to sentence case with standard capitalization of "I". The casual, direct tone stays — the only change is casing. The site currently authors all headings, body copy, section labels, and UI strings in lowercase as a deliberate style choice (D003), but the aesthetic reads as millennial-texting rather than intentionally casual.

## Why This Milestone

The all-lowercase voice was a conscious design decision (D003), but real feedback says it crosses from "casual" into "cringe" — especially the lowercase "i" everywhere. Sentence case keeps the direct, personal tone while reading as a confident professional who happens to write casually, not someone texting.

## User-Visible Outcome

### When this milestone is complete, the user can:

- Visit any page and see sentence-cased copy with standard "I" capitalization throughout — headings, body paragraphs, labels, UI strings
- Still perceive the same casual, direct voice — just without the all-lowercase affectation
- See no visual or functional regression on any page (public, protected, notes, 404)

### Entry point / environment

- Entry point: All site URLs (`/`, `/about/`, `/resume/`, `/domains/*`, `/notes/*`, `/404`)
- Environment: Browser on GitHub Pages deployment and local dev build
- Live dependencies involved: None

## Completion Class

- Contract complete means: Every visitor-facing string uses sentence case with capitalized "I"; no leftover lowercase-only headings, labels, or body copy; CSS `text-transform: lowercase` removed
- Integration complete means: Gate shell copy, passcode form labels, domain proof content, notes frontmatter, and 404 page all follow the new casing convention
- Operational complete means: None — static site, no server lifecycle

## Final Integrated Acceptance

To call this milestone complete, we must prove:

- A visitor can browse the homepage, about page, a domain page (both locked and unlocked states), notes index, and 404 page and see consistent sentence-cased copy throughout
- The full `pnpm validate:site` suite passes (23 tests) — no regressions from copy changes
- No CSS `text-transform: lowercase` remains in shipped styles (the one existing rule on `.site-title` is removed or changed)

## Risks and Unknowns

- Test fixture string matching — existing browser tests and dist validators may assert on exact lowercase strings (e.g., fixture files matching gate copy). These need updating in lockstep with the content changes.
- Notes frontmatter titles — the two existing notes have lowercase titles in their markdown frontmatter; these need updating and the `.toLowerCase()` call in `NotesIndexPage.astro` date formatting should be reviewed (though that one is for dates, not titles).
- Domain proof content rendered client-side — the `domain-proof-view.ts` and `domain-gate-client.ts` render proof content dynamically after unlock; any hardcoded lowercase strings there also need updating.
- Scope of "sentence case" in list items — short list items like "internal tools and operational systems" don't start sentences, but should still capitalize the first word for consistency.

## Existing Codebase / Prior Art

- `src/data/home.ts` — Homepage copy: eyebrow, title, lead, domain intro, personal teaser, contact heading, freshness note. All lowercase-authored.
- `src/data/personal.ts` — About page copy: lead, how-i-work section, open-to roles/problem-spaces/boundaries, resume teaser. All lowercase-authored.
- `src/data/site.ts` — Site-wide metadata: name, default title, description. Lowercase-authored.
- `src/data/domains/product.ts` — Product domain: title, scope, thesis, belongsHere items, flagship content. Lowercase-authored.
- `src/data/domains/developer-experience.ts` — DevEx domain: same structure, lowercase-authored.
- `src/data/domains/analytics-ai.ts` — Analytics & AI domain: same structure, lowercase-authored.
- `src/components/domains/DomainGateShell.astro` — Hardcoded gate shell strings: "protected case file", "back home", status labels, scope preview, request-access copy, passcode form labels.
- `src/components/notes/NotesIndexPage.astro` — Notes index intro paragraph and heading, hardcoded lowercase.
- `src/components/notes/NotePage.astro` — Note page "back" link text.
- `src/pages/404.astro` — 404 page title, description, body copy. Hardcoded lowercase.
- `src/styles/global.css` — Line 124: `text-transform: lowercase` on `.site-title`.
- `src/content/notes/keep-the-path-explicit.md` — Frontmatter title and summary in lowercase.
- `src/content/notes/systems-over-abstractions.md` — Frontmatter title and summary in lowercase.
- `src/data/resume.ts` — Already properly capitalized. Out of scope.
- `tests/helpers/site-boundary-fixtures.mjs` — Shared test fixtures that may contain exact-match lowercase strings.

> See `.gsd/DECISIONS.md` for all architectural and pattern decisions — it is an append-only register; read it during planning, append to it during execution.

## Relevant Requirements

- No existing requirements directly mandate lowercase casing. This milestone revises D003 ("Use a casual lowercase voice") to "Use a casual voice with sentence case." The tone requirement stays; only the casing convention changes.

## Scope

### In Scope

- Converting all visitor-facing copy in data files to sentence case (`home.ts`, `personal.ts`, `site.ts`, `domains/product.ts`, `domains/developer-experience.ts`, `domains/analytics-ai.ts`)
- Converting hardcoded component strings to sentence case (`DomainGateShell.astro`, `NotesIndexPage.astro`, `NotePage.astro`, `404.astro`)
- Removing or replacing `text-transform: lowercase` CSS rule on `.site-title`
- Updating notes frontmatter titles and summaries to sentence case
- Updating test fixtures and validators if they assert on exact lowercase strings
- Capitalizing "I" / "I'm" / "I've" / "I'll" everywhere in first-person copy
- Updating `src/data/site.ts` default title and description

### Out of Scope / Non-Goals

- Changing the resume page (`resume.ts`) — already properly capitalized
- Changing the casual tone or rewriting copy for voice/style beyond casing
- Changing any structural HTML, layout, or component architecture
- Adding new pages or content
- Changing `text-transform: uppercase` rules (those are fine as-is)

## Technical Constraints

- Changes are purely content/CSS — no architectural changes
- Must not break any of the 23 existing tests in `pnpm validate:site`
- Gate shell copy changes must preserve the DOM marker contract and data attributes consumed by tests
- Domain data file changes must preserve TypeScript interfaces and data shapes

## Integration Points

- `pnpm validate:site` — 23 tests that may assert on exact string content; must pass after changes
- `tests/helpers/site-boundary-fixtures.mjs` — shared fixture vocabulary for tests and validators
- `scripts/validate-m002-s01.mjs`, `scripts/validate-m002-s02.mjs`, `scripts/validate-m002-s03.mjs` — dist validators that check built HTML content
- GitHub Actions deploy workflow — blocked by `validate:site`; must stay green

## Open Questions

- Whether domain titles like "product", "developer experience", "analytics & ai" should become "Product", "Developer Experience", "Analytics & AI" — likely yes for headings, to be confirmed during planning.
