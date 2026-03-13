---
id: T02
parent: S01
milestone: M004
provides:
  - Sentence-cased all hardcoded visitor-facing strings in Astro components and client renderers
  - Dual-render parity confirmed between DomainPage.astro and domain-proof-view.ts
  - Sentence-cased gate shell, gate client status strings, notes pages, 404 page, and notes frontmatter
key_files:
  - src/components/domains/DomainPage.astro
  - src/components/domains/domain-proof-view.ts
  - src/components/domains/DomainGateShell.astro
  - src/components/domains/domain-gate-client.ts
  - src/components/notes/NotesIndexPage.astro
  - src/components/notes/NotePage.astro
  - src/pages/404.astro
  - src/content/notes/keep-the-path-explicit.md
  - src/content/notes/systems-over-abstractions.md
key_decisions: []
patterns_established:
  - Sentence case applied consistently across dual-render pair (Astro server + TS client) with line-by-line parity
  - Labels capitalized as "Scope:", "Problem:", "Role:", "Constraints:", "Decisions:", "Outcomes:", "Stack:", "Proof:", "Overlap:"
  - Date .toLowerCase() preserved in NotesIndexPage and NotePage (formatting, not casing style)
observability_surfaces:
  - none
duration: 15m
verification_result: passed
completed_at: 2026-03-12
blocker_discovered: false
---

# T02: Sentence-case components, client renderers, and notes

**Sentence-cased all hardcoded visitor-facing strings in 9 files across Astro components, client-side renderers, gate UI, notes pages, 404, and notes frontmatter.**

## What Happened

Updated all visitor-facing strings to sentence case in the component and renderer layer:

1. **DomainPage.astro** — Section headings ("The kind of work I do here", "Flagship highlights", "Supporting work", "Nearby domains"), inline labels (Scope/Problem/Role/Constraints/Decisions/Outcomes/Stack/Proof/Overlap), "Back home" link, and "When a project crosses boundaries" prose.
2. **domain-proof-view.ts** — Identical changes to maintain exact parity with DomainPage.astro. Cross-referenced line by line.
3. **DomainGateShell.astro** — "Protected case file", "Back home", "Status", "Locked boundary / proof withheld", "Inside this domain", "Current cold-load policy", list items, "Request access", "If you'd like…I'll send…", "Passcode", "Enter passcode", "Unlock", "Ready".
4. **domain-gate-client.ts** — Three status strings: "Invalid passcode", "Access granted", "Enter a passcode".
5. **NotesIndexPage.astro** — "Notes" heading, intro paragraph. Preserved `.toLowerCase()` on date formatting.
6. **NotePage.astro** — "Back to notes". Preserved `.toLowerCase()` on date formatting.
7. **404.astro** — Title, description, h1, body paragraph, link text.
8. **Notes frontmatter** — Both notes titles and summaries sentence-cased.

## Verification

- `pnpm build` — succeeded, 11 pages built
- `pnpm validate:site` — all 23 tests passed (9 cold-load + 4 gate unlock + 4 visual state + 2 notes + 1 assembled flow + 3 shader)
- Dual-render parity confirmed via `rg` — DomainPage.astro and domain-proof-view.ts have identical headings, labels, and prose strings

## Diagnostics

None — static content changes only. Future inspection: `rg` for casing patterns in component files; `pnpm validate:site` for regression.

## Deviations

- Task plan referenced paths like `src/scripts/domain-proof-view.ts` and `src/components/DomainGateShell.astro` — actual paths are under `src/components/domains/` and `src/components/notes/`. No impact on execution.

## Known Issues

None.

## Files Created/Modified

- `src/components/domains/DomainPage.astro` — Sentence-cased headings, labels, link, prose
- `src/components/domains/domain-proof-view.ts` — Matching sentence-cased headings, labels, link, prose (dual-render parity)
- `src/components/domains/DomainGateShell.astro` — Sentence-cased all gate shell strings
- `src/components/domains/domain-gate-client.ts` — Sentence-cased 3 status strings
- `src/components/notes/NotesIndexPage.astro` — Sentence-cased heading and intro
- `src/components/notes/NotePage.astro` — Sentence-cased back link
- `src/pages/404.astro` — Sentence-cased title, description, heading, body, link
- `src/content/notes/keep-the-path-explicit.md` — Sentence-cased frontmatter title and summary
- `src/content/notes/systems-over-abstractions.md` — Sentence-cased frontmatter title and summary
