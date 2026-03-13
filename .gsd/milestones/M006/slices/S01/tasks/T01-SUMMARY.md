---
id: T01
parent: S01
milestone: M006
provides:
  - Title-cased project names across all 3 domain data files
key_files:
  - src/data/domains/product.ts
  - src/data/domains/analytics-ai.ts
  - src/data/domains/developer-experience.ts
key_decisions: []
patterns_established:
  - Title-case convention for all project titles in domain data files (acronyms preserved, prepositions lowercase, proper nouns as-is)
observability_surfaces:
  - none
duration: 5m
verification_result: passed
completed_at: 2026-03-13
blocker_discovered: false
---

# T01: Title-case all project names in domain data files

**Edited 13 title strings across 3 domain data files from sentence case to title case; 8 titles already correct were left unchanged.**

## What Happened

Applied title-case edits to all flagship and supporting work title strings in `product.ts` (3 changed: Sample Tracking, Supply Chain Forecasting, Pricing App), `analytics-ai.ts` (3 changed: Collection Curator, MCP Tools & Agent Demo, Bedrock Utilities in Datalabs API), and `developer-experience.ts` (7 changed: Developer Experience domain title, Monorepo Template, Global Design System, Product Team CLI, Product Migration Scripts, CDK-EKS Contributions, Stargazer Applications, SSO Reverse Proxy). Eight titles were already correct and left unchanged (Charla.cc, CMS, Superset on Stargazer, Umami, Private CDN, plus the Product/Analytics & AI domain titles).

## Verification

- `pnpm build` — exits 0, all 8 static pages generated
- `npx playwright test` — all 18 tests pass
- Grep of all `title:` lines across 3 files confirms correct casing, acronym preservation (CLI, CMS, CDN, SSO, CDK-EKS, MCP, API), lowercase prepositions (in, on), and proper noun preservation (Charla.cc, Umami, Datalabs, Superset, Stargazer, Bedrock)

### Slice-level verification (partial — T01 is not final task)

- [x] `pnpm build` exits 0
- [x] `npx playwright test` — all 18 pass
- [ ] Visual inspection of domain pages — deferred to T02

## Diagnostics

None — pure string edits with no runtime behavior.

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `src/data/domains/product.ts` — title-cased 3 project titles (Sample Tracking, Supply Chain Forecasting, Pricing App)
- `src/data/domains/analytics-ai.ts` — title-cased 3 project titles (Collection Curator, MCP Tools & Agent Demo, Bedrock Utilities in Datalabs API)
- `src/data/domains/developer-experience.ts` — title-cased domain title + 7 project titles (Developer Experience, Monorepo Template, Global Design System, Product Team CLI, Product Migration Scripts, CDK-EKS Contributions, Stargazer Applications, SSO Reverse Proxy)
