---
id: M004
provides:
  - All visitor-facing strings converted from all-lowercase to sentence case with standard "I" capitalization
  - CSS text-transform lowercase removed from .site-title
  - Dual-render parity maintained between DomainPage.astro and domain-proof-view.ts
  - D031 recorded in DECISIONS.md (supersedes D003)
key_decisions:
  - D031 — Sentence case replaces all-lowercase (supersedes D003)
patterns_established:
  - Sentence case with capitalized I/I'm/I've/I'll/I'd throughout all visitor-facing strings
  - Abbreviations and proper nouns (AI, SSO, CDK, AWS, GCP, DevEx, BDD, TypeScript, GraphQL, etc.) preserved as-is
  - Dual-render pairs (Astro server + TS client) updated in lockstep with line-by-line parity
  - Browser walkthrough as final casing sweep catches hardcoded strings that grep and automated tests miss
observability_surfaces:
  - none
requirement_outcomes: []
duration: 45m
verification_result: passed
completed_at: 2026-03-12
---

# M004: Sentence Case Audit

**Converted every visitor-facing string across the entire site from all-lowercase to sentence case with standard "I" capitalization, removed the CSS lowercase override, and verified all 7 page types via browser walkthrough and 23 automated tests.**

## What Happened

This was a single-slice milestone (S01) executed across three tasks. T01 converted ~80% of visitor-facing copy in six data files (`site.ts`, `home.ts`, `personal.ts`, and three domain data files) to sentence case and removed the `text-transform: lowercase` rule from `.site-title` in `global.css`. T02 completed the component and renderer layer — `DomainPage.astro` and `domain-proof-view.ts` updated in lockstep for dual-render parity, gate shell strings, client status messages, notes components, both notes' frontmatter, and the 404 page. T03 ran a browser walkthrough of all 7 page types and caught 6 additional lowercase strings in `HomePage.astro`, `PersonalPage.astro`, and `ResumePage.astro` that T01/T02 missed because those files had hardcoded strings outside the data layer. All fixes were applied in-task and re-verified.

## Cross-Slice Verification

Single-slice milestone — no cross-slice integration needed. Success criteria verified:

- **Consistent sentence-cased copy with capitalized "I" throughout:** Confirmed by T03 browser walkthrough of homepage, about, locked domain gate, unlocked proof view, notes index, note page, and 404. All 7 page types show sentence case.
- **No CSS `text-transform: lowercase` remains:** Confirmed by `rg 'text-transform:\s*lowercase' src/` returning zero matches.
- **Full `pnpm validate:site` suite passes (23 tests):** Confirmed — all 23 tests pass (9 cold-load + 4 gate unlock + 4 visual state + 2 notes + 1 assembled flow + 3 shader).
- **Domain proof content renders identically between cold-load and dynamic-unlock paths:** Confirmed by S01 verification — dual-render parity between `DomainPage.astro` and `domain-proof-view.ts` maintained with matching sentence-cased strings.
- **D003 superseded by D031 in DECISIONS.md:** Confirmed present in decisions register.

## Requirement Changes

No requirement status transitions. This milestone addressed a design decision revision (D003 → D031) rather than a tracked requirement. All 19 validated requirements remain validated; the single active requirement (R301) is unaffected.

## Forward Intelligence

### What the next milestone should know
- All visitor-facing copy is now sentence case. Any new strings added in M005 (Next.js migration) must follow sentence case convention — no all-lowercase copy.
- The existing 23 tests are case-insensitive, so they survived the casing change without modification. New tests should also be case-insensitive for resilience.

### What's fragile
- Dual-render parity between `DomainPage.astro` and `domain-proof-view.ts` — any content changes to domain proof sections must update both files in lockstep. M005 migration must preserve this pairing or consolidate it.

### Authoritative diagnostics
- `pnpm validate:site` (23 tests) — trustworthy regression gate covering route boundaries, unlock flow, visual reveal, notes isolation, assembled flow, and shader presence.

### What assumptions changed
- Original plan scoped T01/T02 to data files and domain/gate/notes components. Browser walkthrough in T03 revealed 6 additional hardcoded strings in `HomePage.astro`, `PersonalPage.astro`, and `ResumePage.astro` that needed updating — grep and automated tests didn't catch them because tests are case-insensitive.

## Files Created/Modified

- `src/data/site.ts` — Sentence-cased name, defaultTitle, defaultDescription
- `src/data/home.ts` — Sentence-cased all string values
- `src/data/personal.ts` — Sentence-cased all strings, preserved abbreviations
- `src/data/domains/product.ts` — Sentence-cased all flagship and supporting work strings
- `src/data/domains/developer-experience.ts` — Sentence-cased all flagship and supporting work strings
- `src/data/domains/analytics-ai.ts` — Sentence-cased all flagship and supporting work strings
- `src/styles/global.css` — Removed `text-transform: lowercase` from `.site-title`
- `src/components/domains/DomainPage.astro` — Sentence-cased headings, labels, link, prose
- `src/components/domains/domain-proof-view.ts` — Matching sentence-cased strings (dual-render parity)
- `src/components/domains/DomainGateShell.astro` — Sentence-cased all gate shell strings
- `src/components/domains/domain-gate-client.ts` — Sentence-cased 3 status strings
- `src/components/notes/NotesIndexPage.astro` — Sentence-cased heading and intro
- `src/components/notes/NotePage.astro` — Sentence-cased back link
- `src/pages/404.astro` — Sentence-cased title, description, heading, body, link
- `src/content/notes/keep-the-path-explicit.md` — Sentence-cased frontmatter
- `src/content/notes/systems-over-abstractions.md` — Sentence-cased frontmatter
- `src/components/home/HomePage.astro` — Sentence-cased "Pick a domain"
- `src/components/personal/PersonalPage.astro` — Sentence-cased 5 hardcoded strings
- `src/components/resume/ResumePage.astro` — Sentence-cased "Back home"
