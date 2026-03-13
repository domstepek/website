---
id: T01
parent: S01
milestone: M004
provides:
  - Sentence-cased visitor-facing strings in all 6 data files
  - Removed text-transform lowercase from .site-title CSS
key_files:
  - src/data/site.ts
  - src/data/home.ts
  - src/data/personal.ts
  - src/data/domains/product.ts
  - src/data/domains/developer-experience.ts
  - src/data/domains/analytics-ai.ts
  - src/styles/global.css
key_decisions: []
patterns_established:
  - Sentence case with capitalized I/I'm/I've/I'll/I'd throughout data files
  - Abbreviations (AI, SSO, CDK, AWS, GCP, DevEx, BDD, CI, CLI, CDN, CMS, PDF, API, UI, GraphQL, TypeScript, ESLint) preserved as-is
observability_surfaces:
  - none
duration: 10m
verification_result: passed
completed_at: 2026-03-12
blocker_discovered: false
---

# T01: Sentence-case all data files and remove lowercase CSS

**Converted all visitor-facing strings in 6 data files to sentence case and removed the `text-transform: lowercase` CSS rule from `.site-title`.**

## What Happened

Rewrote all visitor-facing string values in `site.ts`, `home.ts`, `personal.ts`, `product.ts`, `developer-experience.ts`, and `analytics-ai.ts` from all-lowercase to sentence case. Every standalone "i" became "I", and contractions like "i'm/i've/i'll/i'd" became "I'm/I've/I'll/I'd". Technical abbreviations and proper nouns (AI, SSO, CDK, AWS, GCP, DevEx, BDD, TypeScript, GraphQL, React, etc.) were preserved. Removed the single `text-transform: lowercase` declaration from `.site-title` in `global.css` while leaving the two `text-transform: uppercase` rules untouched.

## Verification

- `pnpm build` completed successfully — all 11 pages built in 4.81s
- `rg 'text-transform:\s*lowercase' src/` returned no matches (exit code 1 = no results)
- `rg` spot-check confirmed no leftover standalone lowercase "i" in data file strings
- TypeScript interfaces and data shapes unchanged — only string values modified

### Slice-level checks (partial — intermediate task)
- ✅ `pnpm build` passes
- ✅ `rg 'text-transform:\s*lowercase' src/` returns nothing
- ⬜ `pnpm validate:site` — deferred to T02/T03 (may need component updates first)
- ⬜ Browser walkthrough — deferred to T03

## Diagnostics

None — static content changes only. Future inspection: `rg` for casing patterns in data files; `pnpm build` for type safety.

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `src/data/site.ts` — Sentence-cased name, defaultTitle, defaultDescription
- `src/data/home.ts` — Sentence-cased all string values including contact labels, freshness, SEO
- `src/data/personal.ts` — Sentence-cased all strings, preserved abbreviations
- `src/data/domains/product.ts` — Sentence-cased all flagship and supporting work strings
- `src/data/domains/developer-experience.ts` — Sentence-cased all flagship and supporting work strings
- `src/data/domains/analytics-ai.ts` — Sentence-cased all flagship and supporting work strings
- `src/styles/global.css` — Removed `text-transform: lowercase` from `.site-title`
