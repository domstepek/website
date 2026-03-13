# S01: Sentence case all visitor-facing copy and remove lowercase CSS — Research

**Date:** 2026-03-12

## Summary

This slice is a mechanical text-replacement pass across ~17 files with one CSS deletion. No architectural changes, no new dependencies, no unfamiliar APIs. The entire scope is: (1) sentence-case all visitor-facing strings in 6 data files, 6 component/page templates, 1 client-side renderer, 1 client-side gate controller, and 2 notes markdown files; (2) remove the single `text-transform: lowercase` CSS rule on `.site-title`; (3) record D031 in DECISIONS.md.

The primary execution risk is the **dual-render parity** between `DomainPage.astro` (server path) and `domain-proof-view.ts` (client path). Both contain identical section headings ("the kind of work i do here", "flagship highlights", "supporting work", "nearby domains") and inline labels ("problem:", "role:", "constraints:", "decisions:", "outcomes:", "stack:", "scope:", "proof:") that must be updated in lockstep. A secondary risk is the **gate client status strings** in `domain-gate-client.ts` — "invalid passcode", "access granted", "enter a passcode" — which the milestone research didn't flag but are visitor-facing.

The test infrastructure is safe. All 23 existing tests use `data-*` attribute selectors and case-insensitive regex patterns (`/request access/i`, `/passcode/i`). No test fixtures assert on exact lowercase copy. The `gateCopyExpectations` object in `site-boundary-fixtures.mjs` is entirely case-insensitive. No fixture or validator changes are expected.

## Recommendation

Execute as 3 tasks in dependency order:

1. **T01: Data files + CSS** — Sentence-case all 6 `src/data/*.ts` files (home, personal, site, 3 domains). Remove `text-transform: lowercase` from `.site-title` in `global.css:124`. This is the highest-surface-area change (~667 lines across data files) and should be proven first with a build.

2. **T02: Components + client renderers + notes** — Sentence-case hardcoded strings in `DomainGateShell.astro`, `DomainPage.astro`, `domain-proof-view.ts`, `domain-gate-client.ts`, `NotesIndexPage.astro`, `NotePage.astro`, `404.astro`, and 2 notes markdown files. The Astro/TS dual-render path is the riskiest seam — update both files in one task.

3. **T03: Validation + decision record** — Run `pnpm validate:site` (23 tests), browser walkthrough of all page types (homepage, about, locked domain, unlocked domain, notes index, note page, 404), append D031 to DECISIONS.md superseding D003.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Automated case conversion | Manual editing | File count is small (~17 files). Automated converters would break proper nouns ("AI", "SSO", "CDK"), abbreviations, first-person "I", and domain-specific terms. |
| Test fixture updates | Existing case-insensitive patterns in `site-boundary-fixtures.mjs` | All `gateCopyExpectations` use `/pattern/i` flags. No changes needed. |

## Existing Code and Patterns

### Data files (T01 targets)
- `src/data/site.ts` — 3 strings: `name: "dom"` → `"Dom"`, `defaultTitle`, `defaultDescription`. Simple.
- `src/data/home.ts` (81 lines) — eyebrow, title, lead, domainIntro, personalTeaser, contactHeading, freshness, seo. All lowercase-authored. Contains first-person "i" that needs → "I".
- `src/data/personal.ts` (106 lines) — lead, howIWork, openTo sections, resumeTeaser. Heavy with "i'm", "i've", "i'll" contractions.
- `src/data/domains/product.ts` (190 lines) — title, thesis, scope, belongsHere, 4 flagships with problem/role/constraints/decisions/outcomes/stack/proof, supportingWork, relatedDomains.
- `src/data/domains/developer-experience.ts` (142 lines) — Same structure, 2 flagships.
- `src/data/domains/analytics-ai.ts` (148 lines) — Same structure, 3 flagships.

### CSS (T01 target)
- `src/styles/global.css:124` — `text-transform: lowercase` on `.site-title`. **Remove entire declaration.** Lines 591 and 1302 have `text-transform: uppercase` — leave those alone.

### Components — dual-render parity (T02, critical seam)

**DomainPage.astro** (server render) section headings:
- Line 97: `"the kind of work i do here"`
- Line 114: `"flagship highlights"`
- Line 224: `"supporting work"`
- Line 261: `"nearby domains"`
- Line 104: `"scope:"` label
- Lines 124, 128: `"problem:"`, `"role:"` labels
- Flagship grid labels: `"constraints:"`, `"decisions:"`, `"outcomes:"`, `"stack:"`
- Line 88: `"back home"` link

**domain-proof-view.ts** (client render) — mirrors exactly:
- Line 269: `"the kind of work i do here"`
- Line 284: `"flagship highlights"`
- Line 295: `"supporting work"`
- Line 302: `"nearby domains"`
- Line 159: `"problem:"`, line 161: `"role:"`
- Lines 168-171: `"constraints"`, `"decisions"`, `"outcomes"`, `"stack"` (used as label text via grid loop)
- Line 41: `"proof:"` label
- Line 257: `"back home"` link

### Components — gate shell (T02)
- `DomainGateShell.astro` — Strings to sentence-case:
  - Line 29: `"protected case file"` → `"Protected case file"`
  - Line 25: `"back home"` → `"Back home"`
  - Line 32: body paragraph with lowercase "i" references
  - Line 44: `"status"` → `"Status"`
  - Line 45: `"locked boundary / proof withheld"` → `"Locked boundary / proof withheld"`
  - Line 52: `"inside this domain"` → `"Inside this domain"`
  - Line 59: `"current cold-load policy"` → `"Current cold-load policy"`
  - Line 69: `"Scope preview:"` — already capitalized
  - Line 81: `"request access"` → `"Request access"`
  - Line 83: request body paragraph with `"i'll"` → `"I'll"`
  - Line 107: `"passcode"` → `"Passcode"`
  - Line 111/117: `"enter passcode"` → `"Enter passcode"`
  - Line 126: `"unlock"` → `"Unlock"`
  - Line 130: `"ready"` → `"Ready"`

### Components — gate client (T02, missed in milestone research)
- `domain-gate-client.ts`:
  - Line 146: `"invalid passcode"` → `"Invalid passcode"`
  - Line 151: `"access granted"` → `"Access granted"`
  - Line 182: `"enter a passcode"` → `"Enter a passcode"`

### Components — notes and 404 (T02)
- `NotesIndexPage.astro` — Line 28: heading `"notes"` → `"Notes"`, intro paragraph sentence-case, line 24: `"back home"` → `"Back home"`. **Keep `.toLowerCase()` on line 19** — that's date formatting.
- `NotePage.astro` — Line 25: `"back to notes"` → `"Back to notes"`. **Keep `.toLowerCase()` on line 19** — date formatting.
- `404.astro` — `title="page not found"` → `"Page not found"`, `description=` string, `<h1>`, `<p>` body copy, link text.

### Notes frontmatter (T02)
- `keep-the-path-explicit.md` — title: `"keep the path explicit"` → `"Keep the path explicit"`, summary sentence-case.
- `systems-over-abstractions.md` — title: `"systems over abstractions"` → `"Systems over abstractions"`, summary sentence-case.
- Note body content already uses proper capitalization — no changes needed there.

### Test infrastructure (T03 — verify only, no changes expected)
- `tests/helpers/site-boundary-fixtures.mjs` — All assertions use `data-*` selectors and case-insensitive regex. `gateCopyExpectations` patterns: `/request access/i`, `/domstepek@gmail\.com/i`, `/linkedin/i`, `/passcode/i`. **No changes needed.**
- `scripts/validate-m002-s01.mjs`, `s02`, `s03` — Check `data-*` attributes and link hrefs, not copy text. **No changes needed.**
- Browser tests use `data-*` attribute selectors for element targeting. **No changes needed.**

## Constraints

- **Dual-render parity is mandatory** — `DomainPage.astro` and `domain-proof-view.ts` must produce identical section headings and labels. Update both in the same task, verify both paths.
- **TypeScript interfaces unchanged** — Data file changes are values only. No type signature modifications.
- **DOM marker contracts preserved** — All `data-*` attributes, `aria-*` attributes, and element IDs stay unchanged.
- **Date `.toLowerCase()` is intentional** — `NotesIndexPage.astro:19` and `NotePage.astro:19` produce lowercase month abbreviations ("mar", "jan"). This is date formatting, not site voice. Leave alone.
- **`text-transform: uppercase` rules are out of scope** — Lines 591 and 1302 in `global.css`. Don't touch.
- **Sentence case, not title case** — Capitalize first word of each sentence/heading/list-item. Don't capitalize every word. "The kind of work I do here", not "The Kind Of Work I Do Here".
- **Preserve abbreviations** — "AI", "SSO", "CDK", "AWS", "GCP" stay all-caps. "DevEx" stays as-is.

## Common Pitfalls

- **Forgetting `domain-gate-client.ts`** — The milestone research flagged `domain-proof-view.ts` but not the gate client. It has 3 visitor-facing status strings ("invalid passcode", "access granted", "enter a passcode") that must be sentence-cased.
- **Breaking "I" in contractions** — "i'm" → "I'm", "i've" → "I've", "i'll" → "I'll", "i'd" → "I'd". A naive find-replace on standalone "i" could break words like "inside", "into", "is", "it".
- **Over-capitalizing list items** — belongsHere items and supporting-work contexts start lowercase in the data. Sentence-case the first word only: "internal tools and operational systems" → "Internal tools and operational systems".
- **Leaving CSS active** — Even with all source text sentence-cased, the `text-transform: lowercase` on `.site-title` would force it back to lowercase at render time.
- **Mermaid diagram labels** — Domain data files may contain mermaid content. These render as SVG — still review for consistency but they're not directly visitor-readable text.
- **Missing the "nearby domains" related-link prose** — Both `DomainPage.astro:263` and `domain-proof-view.ts:303` have inline prose "when a project crosses boundaries, it usually lands closest to" — starts with lowercase "when", needs sentence-casing.

## Open Risks

- **Other client-side scripts with hardcoded strings** — If any JS beyond `domain-gate-client.ts` and `domain-proof-view.ts` contains lowercase UI strings, they'd be missed. A post-conversion browser walkthrough is essential.
- **SEO/meta description changes** — Updating `siteConfig.defaultTitle` and `defaultDescription` changes the `<title>` and `<meta>` tags site-wide. This is intentional but should be verified in the built output.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Astro | `astrolicious/agent-skills@astro` | Available — not needed (pure content changes, no Astro API work) |

No skills needed. The work is mechanical text editing across known files.

## Sources

- Direct codebase exploration of all 17 target files
- Test fixture analysis confirming case-insensitive patterns in `site-boundary-fixtures.mjs`
- CSS audit confirming single `text-transform: lowercase` target at `global.css:124`
- `domain-gate-client.ts` audit revealing 3 additional visitor-facing status strings not flagged in milestone research
