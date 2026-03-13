# M004: Sentence Case Audit — Research

**Date:** 2026-03-12

## Summary

This milestone is a content-and-CSS-only change across ~15 files. All visitor-facing copy lives in clearly separated data files (`src/data/home.ts`, `personal.ts`, `site.ts`, three domain data files), component templates (`DomainGateShell.astro`, `NotesIndexPage.astro`, `NotePage.astro`, `404.astro`, `DomainPage.astro`), a client-side proof renderer (`domain-proof-view.ts`), and two notes markdown files. The single CSS rule (`text-transform: lowercase` on `.site-title`) is at line 124 of `global.css`.

The primary risk is not the conversion itself — it's ensuring the **two parallel rendering paths** for domain proof content stay in sync. Domain content renders server-side via `DomainPage.astro` for the unlocked-cold-load path AND client-side via `domain-proof-view.ts` for the dynamic post-unlock path. Both have hardcoded section headings ("flagship highlights", "supporting work", "the kind of work i do here", "nearby domains") and inline labels ("problem:", "role:", "constraints:", "decisions:", "outcomes:", "stack:", "proof:") that must be updated in lockstep. A mismatch between these two would create a visual inconsistency between cold-load and dynamic-unlock rendering.

The recommended approach is a single-slice milestone. The work is purely mechanical text replacement with no architectural changes. Slice it by risk: update data files first (biggest surface area), then components (two rendering paths), then CSS, then notes frontmatter, then run the full test suite. The 23 existing tests are largely safe — test fixtures use `data-*` attribute selectors and case-insensitive regex patterns (`/request access/i`, `/passcode/i`), not exact lowercase string matching.

## Recommendation

Single slice with ~3 tasks:

1. **Data files + CSS** — Convert all six `src/data/*.ts` files to sentence case, remove `text-transform: lowercase` from `.site-title`. This is the highest-surface-area change and should be proven first.
2. **Components + proof renderer** — Convert hardcoded strings in `DomainGateShell.astro`, `DomainPage.astro`, `domain-proof-view.ts`, `NotesIndexPage.astro`, `NotePage.astro`, `404.astro`, and the two notes markdown files. The Astro/TS dual-render path for domain proof is the riskiest seam.
3. **Validation** — Run `pnpm validate:site`, fix any test fixture or validator breakage, update D003→D031 in DECISIONS.md.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Sentence-case conversion rules | Manual editing | This is a one-time content audit, not a runtime transformation. No library or automation needed — the file count is small enough for direct editing. Automated case converters would get proper nouns, abbreviations ("AI", "SSO", "CDK"), and first-person "I" wrong. |
| Test fixture string matching | Existing `site-boundary-fixtures.mjs` patterns | The fixtures already use case-insensitive regex (`/request access/i`) and `data-*` attribute selectors — not exact lowercase string matching. Reuse them as-is. |

## Existing Code and Patterns

### Data files (sentence-case targets)
- `src/data/home.ts` — Homepage copy: eyebrow, title, lead, domain intro, personal teaser, contact heading, freshness. All lowercase-authored. ~30 strings to convert.
- `src/data/personal.ts` — About page: lead, how-i-work, open-to, resume teaser. All lowercase-authored. ~25 strings to convert.
- `src/data/site.ts` — Site metadata: `name`, `defaultTitle`, `defaultDescription`. 3 strings.
- `src/data/domains/product.ts` — Product domain: title, thesis, scope, belongsHere, 3 flagships with full copy. ~80+ strings.
- `src/data/domains/developer-experience.ts` — DevEx domain: same structure. ~60+ strings.
- `src/data/domains/analytics-ai.ts` — Analytics & AI domain: same structure. ~70+ strings.

### Components (hardcoded strings)
- `src/components/domains/DomainGateShell.astro` — Gate shell strings: "protected case file", "back home", "status", "locked boundary / proof withheld", "inside this domain", "current cold-load policy", list items, "Scope preview:", "request access", request copy, "passcode", "enter passcode", "unlock", "ready". Note: "Scope preview:" already has a capital S.
- `src/components/domains/DomainPage.astro` — Section headings: "the kind of work i do here", "flagship highlights", "supporting work", "nearby domains". Inline labels: "problem:", "role:", "constraints:", "decisions:", "outcomes:", "stack:", "proof:".
- `src/components/domains/domain-proof-view.ts` — **Mirrors DomainPage.astro headings and labels exactly** for client-side rendering after unlock. Lines 159, 161, 168-171, 269, 284, 295, 302. Must stay in sync.
- `src/components/notes/NotesIndexPage.astro` — Heading "notes", intro paragraph, "back home" link. Also has `.toLowerCase()` on date formatting (line 19) — this is for dates ("mar 12, 2026"), keep it.
- `src/components/notes/NotePage.astro` — "back to notes" link. Also has `.toLowerCase()` on date formatting (line 19) — keep it.
- `src/pages/404.astro` — "page not found" title, description, body copy, "go back to the homepage" link.

### CSS
- `src/styles/global.css:124` — `text-transform: lowercase` on `.site-title`. Remove this rule entirely.
- `src/styles/global.css:591,1302` — `text-transform: uppercase` rules. Out of scope, leave as-is.

### Notes frontmatter
- `src/content/notes/keep-the-path-explicit.md` — Title: "keep the path explicit", Summary: "a surprising amount of..."
- `src/content/notes/systems-over-abstractions.md` — Title: "systems over abstractions", Summary: "the abstraction usually is not..."
- Note: The note **body** content already uses proper capitalization and "I" — only frontmatter titles/summaries need updating.

### Test infrastructure
- `tests/helpers/site-boundary-fixtures.mjs` — `gateCopyExpectations` uses case-insensitive regex: `/request access/i`, `/passcode/i`, `/domstepek@gmail\.com/i`, `/linkedin/i`. **No changes needed.**
- All browser tests use `data-*` attribute selectors for element targeting, not text content matching. **No changes needed.**
- `scripts/validate-m002-s01.mjs`, `s02`, `s03` — Dist validators check HTML for `data-*` attributes and link hrefs, not copy text. **No changes needed.**

## Constraints

- **Dual-render parity**: `DomainPage.astro` (server) and `domain-proof-view.ts` (client) must produce identical section headings and labels. Any mismatch creates a visual inconsistency between cold-load and dynamic-unlock views.
- **TypeScript interfaces preserved**: Data file changes are values only — no interface or type changes.
- **DOM marker contracts preserved**: All `data-*` attributes, `aria-*` attributes, and element structure stay unchanged.
- **Date `.toLowerCase()` is intentional**: The date formatting calls in `NotesIndexPage.astro` and `NotePage.astro` produce lowercase month names ("mar", "jan") — this is a date format choice, not the site copy voice. Leave these alone.
- **`siteConfig.name` is "dom"**: This is a proper noun (short name), should become "Dom".
- **Domain titles**: "product", "developer experience", "analytics & ai" should become "Product", "Developer Experience", "Analytics & AI" — these are headings and navigation labels.
- **Resume data is already capitalized**: `src/data/resume.ts` is explicitly out of scope per context.

## Common Pitfalls

- **Forgetting the client-side renderer** — `domain-proof-view.ts` has the same section headings and labels as `DomainPage.astro` but is easy to overlook because it's TypeScript, not a template. Both must be updated together.
- **Over-capitalizing list items** — Sentence case means capitalizing the first word of each item, even mid-sentence-style items like "internal tools and operational systems" → "Internal tools and operational systems". Don't title-case every word.
- **Breaking "I" in contractions** — "i'm", "i've", "i'll", "i'd" must all become "I'm", "I've", "I'll", "I'd". A naive find-replace on "i" alone will break words like "inside", "into", "is".
- **Leaving CSS `text-transform: lowercase` active** — Even if all source text is sentence-cased, the CSS rule on `.site-title` would force it back to lowercase at render time. Must be removed.
- **Touching the `uppercase` rules** — Lines 591 and 1302 in `global.css` use `text-transform: uppercase` for different elements. These are intentional and out of scope.
- **Assuming tests will break** — The test fixtures are already case-insensitive. The main risk is not test breakage but missing a file during conversion.

## Open Risks

- **Missed strings in dynamic rendering** — If `domain-gate-client.ts` or any other client-side script has hardcoded lowercase UI strings beyond what was found in this research, they'd be missed. A post-conversion visual review of all pages is essential.
- **Mermaid diagram labels** — Domain data files include mermaid diagram definitions with labels. These are not visitor-facing text (they're rendered as SVG diagrams) but should still be reviewed for consistency.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Astro | `astrolicious/agent-skills@astro` (2K installs) | Available — not needed for this milestone (pure content changes, no Astro API work) |

No skills are needed for this milestone. The work is mechanical text editing across known files with no unfamiliar APIs or frameworks.

## Sources

- Codebase exploration of all files listed in M004-CONTEXT.md scope
- Test fixture analysis confirming case-insensitive patterns in `site-boundary-fixtures.mjs`
- CSS audit confirming single `text-transform: lowercase` target at `global.css:124`
