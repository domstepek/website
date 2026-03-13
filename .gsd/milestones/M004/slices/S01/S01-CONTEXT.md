---
id: S01
milestone: M004
status: ready
---

# S01: Sentence case all visitor-facing copy and remove lowercase CSS — Context

## Goal

Convert all visitor-facing site copy from all-lowercase to sentence case with standard "I" capitalization, remove CSS `text-transform: lowercase`, and ensure visual consistency between server-side and client-side rendering paths.

## Why this Slice

This addresses the feedback that all-lowercase copy reads as "millennial-texting" rather than intentionally casual. Sentence case preserves the direct, personal tone while appearing more professionally confident. This is a single-slice milestone because the changes are purely content/CSS with no architectural dependencies.

## Scope

### In Scope

- Converting all visitor-facing copy in `src/data/*.ts` files using case-by-case evaluation for different content types
- Converting hardcoded component strings in `.astro` and `.ts` files with lockstep updates for dual-render paths
- Updating `DomainPage.astro` and `domain-proof-view.ts` section headings and labels simultaneously to prevent visual inconsistency
- Removing `text-transform: lowercase` CSS rule from `.site-title` in `global.css`
- Converting notes frontmatter titles and summaries to sentence case
- Preserving technical abbreviations (AI, API, CDK) and being conservative with proper nouns/brand names
- Updating test fixtures and validators as needed to accommodate copy changes
- Recording D031 decision in DECISIONS.md to supersede D003

### Out of Scope

- Changing `src/data/resume.ts` (already properly capitalized per context)
- Modifying the casual tone or rewriting copy beyond casing
- Changing `text-transform: uppercase` CSS rules (intentional and out of scope)  
- Touching date formatting `.toLowerCase()` calls in notes components (those are for date format, not site copy voice)
- Any architectural, layout, or component structure changes

## Constraints

- **Dual-render parity**: `DomainPage.astro` (server) and `domain-proof-view.ts` (client) must produce identical section headings and labels to prevent inconsistency between cold-load and dynamic-unlock views
- **TypeScript interfaces preserved**: Data file changes are values only — no interface or type changes
- **DOM marker contracts preserved**: All `data-*` attributes and element structure must remain unchanged for test compatibility
- **Case-by-case evaluation**: Not mechanical conversion — thoughtful choices per content type (domain titles, list items, technical terms)
- **Technical term preservation**: Keep abbreviations like "AI", "API", "CDK" uppercase; be conservative with proper nouns and brand names

## Integration Points

### Consumes

- `src/data/home.ts` — Homepage copy strings (eyebrow, title, lead, domain intro, personal teaser, contact)
- `src/data/personal.ts` — About page copy (lead, how-i-work, open-to, resume teaser)
- `src/data/site.ts` — Site metadata (name, title, description)
- `src/data/domains/*.ts` — Domain copy (titles, thesis, scope, flagship content)
- `src/components/domains/DomainPage.astro` — Server-side section headings and labels
- `src/components/domains/domain-proof-view.ts` — Client-side section headings and labels  
- `src/styles/global.css` — Current `text-transform: lowercase` rule at line 124
- Notes frontmatter in `src/content/notes/*.md` files

### Produces

- All data files with sentence-cased copy while preserving data shapes and interfaces
- Both rendering paths updated in lockstep with identical section headings and labels
- CSS with `text-transform: lowercase` removed from `.site-title`
- Notes with sentence-cased frontmatter titles and summaries
- Updated test fixtures if needed to maintain `pnpm validate:site` passing
- D031 decision recorded in `.gsd/DECISIONS.md` superseding D003

## Open Questions

- Whether domain titles in navigation should become "Product", "Developer Experience", "Analytics & AI" vs staying lowercase for aesthetic reasons — evaluate during conversion based on visual impact
- If any hardcoded strings exist in `domain-gate-client.ts` or other client scripts beyond what research identified — visual review of all pages will catch these
- Specific handling of mermaid diagram labels in domain data files — likely sentence case for consistency but evaluate during conversion