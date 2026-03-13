# S01: Title case, stack tag reorder, and flagship card readability — UAT

**Milestone:** M006
**Written:** 2026-03-13

## UAT Type

- UAT mode: mixed (artifact-driven + human-experience)
- Why this mode is sufficient: Contract verification (build + 18 Playwright tests) proves no DOM marker regression; visual styling correctness requires human inspection since CSS appearance is not covered by automated tests

## Preconditions

- Dev server running (`pnpm dev`) or production build served (`pnpm build && pnpm start`)
- Portfolio gate passcode available to authenticate into `/domains/*` pages

## Smoke Test

Authenticate into `/domains/product` and confirm the first flagship project title is title-cased ("Sample Tracking") and has stack tags directly below the title.

## Test Cases

### 1. Title case on all domain pages

1. Navigate to `/domains/product` (authenticated)
2. Scan all flagship and supporting work titles
3. **Expected:** All titles are title case — "Sample Tracking", "Supply Chain Forecasting", "Pricing App". Acronyms preserved (CMS). Prepositions lowercase ("in", "on"). Proper nouns as-is (Charla.cc).

### 2. Title case on analytics-ai page

1. Navigate to `/domains/analytics-ai` (authenticated)
2. Scan all flagship and supporting work titles
3. **Expected:** "Collection Curator", "MCP Tools & Agent Demo", "Bedrock Utilities in Datalabs API". Proper nouns preserved (Umami, Datalabs, Superset, Stargazer, Bedrock).

### 3. Title case on developer-experience page

1. Navigate to `/domains/developer-experience` (authenticated)
2. Scan all titles including domain heading
3. **Expected:** Domain heading is "Developer Experience". Project titles: "Monorepo Template", "Global Design System", "Product Team CLI", "Product Migration Scripts", "CDK-EKS Contributions", "Stargazer Applications", "SSO Reverse Proxy", "Private CDN".

### 4. Stack tags under title

1. On any domain page, inspect a flagship project card
2. **Expected:** Stack tags (colored badges) appear directly under the h3 title, before the role description line.

### 5. Header/body separator

1. On any domain page, inspect a flagship project card
2. **Expected:** A visible horizontal border separates the card header (title + stack tags + role) from the content body (Problem, Constraints, etc.)

### 6. Accent-bordered section labels

1. On any domain page, inspect the section labels (Problem, Constraints, Decisions, Outcomes)
2. **Expected:** Each label has a green accent left border (2px solid `var(--accent)`) with left padding

### 7. ›-prefixed list items

1. On any domain page, inspect list items under Constraints, Decisions, or Outcomes
2. **Expected:** Each item starts with a green `›` character instead of a bullet. No native disc/circle bullet markers visible.

### 8. List item spacing

1. On any domain page, inspect list items under Constraints, Decisions, or Outcomes
2. **Expected:** List items have visible spacing between them (0.5rem gap), not cramped together

### 9. Mobile viewport

1. Resize browser to 375px width (or use device emulation)
2. Navigate to any authenticated domain page
3. **Expected:** All styling (title case, stack tags, separator, labels, list markers, spacing) renders correctly without overflow or clipping

## Edge Cases

### Empty sections

1. If any flagship project has zero items in a section (e.g. no Constraints)
2. **Expected:** The section label and empty list render without visual artifacts

## Failure Signals

- Any project title still in sentence case (e.g. "Sample tracking" instead of "Sample Tracking")
- Stack tags appearing at the bottom of the card instead of under the title
- No visible separator between header and body sections
- Section labels missing the green left border
- List items showing standard disc bullets instead of `›` markers
- List items with no spacing between them (cramped)
- Playwright tests failing (DOM marker contract regression)

## Requirements Proved By This UAT

- None — M006 is an incremental polish pass; all 20 requirements were already validated. This UAT proves the M006 success criteria (title case, stack tag reorder, card readability) but does not advance any tracked requirement.

## Not Proven By This UAT

- No new requirements are in scope for M006
- Operational/deployment behavior is not affected by these visual changes

## Notes for Tester

- This is purely visual polish — if the page looks right and tests pass, the slice is done
- Focus on the three domain pages: `/domains/product`, `/domains/analytics-ai`, `/domains/developer-experience`
- The other two domain pages (`/domains/infrastructure`, `/domains/design-systems`) are not in M006 scope but should not be broken
