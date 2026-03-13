---
estimated_steps: 4
estimated_files: 7
---

# T01: Sentence-case all data files and remove lowercase CSS

**Slice:** S01 — Sentence case all visitor-facing copy and remove lowercase CSS
**Milestone:** M004

## Description

Convert all visitor-facing strings in the 6 `src/data/*.ts` files to sentence case with proper "I" capitalization, and remove the `text-transform: lowercase` CSS declaration from `.site-title` in `global.css`. This is the highest-surface-area change (~80% of visitor-facing copy) and must be proven with a clean build.

## Steps

1. Edit `src/data/site.ts` — sentence-case `name` ("dom" → "Dom"), `defaultTitle`, and `defaultDescription`
2. Edit `src/data/home.ts` — sentence-case all string values (eyebrow, title, lead, domainIntro, personalTeaser, contactHeading, freshness, seo). Convert all standalone "i" to "I" and contractions "i'm/i've/i'll/i'd" to "I'm/I've/I'll/I'd"
3. Edit `src/data/personal.ts` — sentence-case all string values (lead, howIWork, openTo, resumeTeaser). Same "I" contraction handling. Preserve abbreviations (AI, SSO, CDK, AWS, GCP, DevEx)
4. Edit the 3 domain data files (`product.ts`, `developer-experience.ts`, `analytics-ai.ts`) — sentence-case titles, thesis, scope, belongsHere items, flagship fields (problem, role, constraints, decisions, outcomes, stack, proof), supportingWork entries, and relatedDomains. Preserve abbreviations and technical terms
5. Edit `src/styles/global.css` — remove the `text-transform: lowercase` declaration from `.site-title` (line ~124). Do NOT touch `text-transform: uppercase` on lines ~591 and ~1302
6. Run `pnpm build` to confirm clean build; run `rg 'text-transform:\s*lowercase' src/` to confirm CSS removal

## Must-Haves

- [ ] All 6 data files use sentence case for visitor-facing strings
- [ ] "I" and "I'm/I've/I'll/I'd" properly capitalized throughout
- [ ] Abbreviations (AI, SSO, CDK, AWS, GCP, DevEx) preserved
- [ ] `text-transform: lowercase` removed from `.site-title`
- [ ] `text-transform: uppercase` rules untouched
- [ ] TypeScript interfaces and data shapes unchanged (values only)
- [ ] `pnpm build` succeeds

## Verification

- `pnpm build` completes without errors
- `rg 'text-transform:\s*lowercase' src/` returns no matches
- Spot-check a few data file strings to confirm sentence case and "I" capitalization

## Observability Impact

- Signals added/changed: None
- How a future agent inspects this: `rg` for lowercase patterns in data files; `pnpm build` for type safety
- Failure state exposed: None

## Inputs

- `src/data/site.ts` — current lowercase strings
- `src/data/home.ts` — current lowercase strings with "i" contractions
- `src/data/personal.ts` — current lowercase strings with "i" contractions
- `src/data/domains/product.ts` — current lowercase strings
- `src/data/domains/developer-experience.ts` — current lowercase strings
- `src/data/domains/analytics-ai.ts` — current lowercase strings
- `src/styles/global.css` — contains `text-transform: lowercase` on `.site-title`

## Expected Output

- `src/data/site.ts` — all visitor-facing strings sentence-cased
- `src/data/home.ts` — all strings sentence-cased, "I" capitalized
- `src/data/personal.ts` — all strings sentence-cased, "I" capitalized, abbreviations preserved
- `src/data/domains/product.ts` — all strings sentence-cased
- `src/data/domains/developer-experience.ts` — all strings sentence-cased
- `src/data/domains/analytics-ai.ts` — all strings sentence-cased
- `src/styles/global.css` — `text-transform: lowercase` removed from `.site-title`
