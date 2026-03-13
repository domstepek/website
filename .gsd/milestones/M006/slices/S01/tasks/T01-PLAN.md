---
estimated_steps: 4
estimated_files: 3
---

# T01: Title-case all project names in domain data files

**Slice:** S01 — Title case, stack tag reorder, and flagship card readability
**Milestone:** M006

## Description

Edit all flagship and supporting work title strings across three domain data files to use proper title case. This is the lowest-risk change in the slice — pure string edits with zero logic changes, zero DOM marker impact, and zero CSS impact. Acronyms, proper nouns, and prepositions require specific handling.

## Steps

1. Read `src/data/domains/product.ts` and edit title strings:
   - "Sample tracking" → "Sample Tracking"
   - "Supply chain forecasting" → "Supply Chain Forecasting"
   - "Charla.cc" → unchanged
   - "Pricing app" → "Pricing App"
   - "CMS" → unchanged
2. Read `src/data/domains/analytics-ai.ts` and edit title strings:
   - "Collection curator" → "Collection Curator"
   - "MCP tools & agent demo" → "MCP Tools & Agent Demo"
   - "Bedrock utilities in Datalabs API" → "Bedrock Utilities in Datalabs API"
   - "Superset on Stargazer" → unchanged (already correct — prepositions lowercase)
   - "Umami" → unchanged
3. Read `src/data/domains/developer-experience.ts` and edit title strings:
   - Domain title: "Developer experience" → "Developer Experience"
   - "Monorepo template" → "Monorepo Template"
   - "Global design system" → "Global Design System"
   - "Product team CLI" → "Product Team CLI"
   - "Product migration scripts" → "Product Migration Scripts"
   - "CDK-EKS contributions" → "CDK-EKS Contributions"
   - "Stargazer applications" → "Stargazer Applications"
   - "Private CDN" → unchanged
   - "SSO reverse proxy" → "SSO Reverse Proxy"
4. Run `npm run build` and `npx playwright test` to confirm no regressions.

## Must-Haves

- [ ] All ~21 titles across 3 data files are title-cased
- [ ] Acronyms preserved exactly: CLI, CMS, CDN, SSO, CDK-EKS, MCP, API
- [ ] Prepositions stay lowercase: "in", "on"
- [ ] Proper nouns stay as-is: Charla.cc, Umami, Datalabs, Superset, Stargazer, Bedrock
- [ ] `npm run build` exits 0
- [ ] All 18 Playwright tests pass

## Verification

- `npm run build` exits 0
- `npx playwright test` — all 18 tests pass (tests use `data-*` selectors, zero text matching)

## Observability Impact

- Signals added/changed: None
- How a future agent inspects this: grep title strings in data files; rendered pages show title-cased names
- Failure state exposed: None

## Inputs

- `src/data/domains/product.ts` — current sentence-case title strings
- `src/data/domains/analytics-ai.ts` — current sentence-case title strings
- `src/data/domains/developer-experience.ts` — current sentence-case title strings
- S01-RESEARCH.md title mapping (preloaded in slice context)

## Expected Output

- `src/data/domains/product.ts` — all 5 titles title-cased (3 changed, 2 unchanged)
- `src/data/domains/analytics-ai.ts` — all 5 titles title-cased (3 changed, 2 unchanged)
- `src/data/domains/developer-experience.ts` — domain title + all 8 work titles title-cased (7 changed, 2 unchanged)
