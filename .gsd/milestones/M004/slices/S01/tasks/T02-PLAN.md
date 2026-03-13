---
estimated_steps: 5
estimated_files: 9
---

# T02: Sentence-case components, client renderers, and notes

**Slice:** S01 — Sentence case all visitor-facing copy and remove lowercase CSS
**Milestone:** M004

## Description

Sentence-case all hardcoded visitor-facing strings in Astro components, client-side renderers, and notes frontmatter. The critical seam is the dual-render parity between `DomainPage.astro` (server path) and `domain-proof-view.ts` (client path) — both must produce identical section headings and labels. Also covers `DomainGateShell.astro`, `domain-gate-client.ts`, `NotesIndexPage.astro`, `NotePage.astro`, `404.astro`, and 2 notes markdown files.

## Steps

1. Edit `src/pages/domains/[slug].astro` (DomainPage) — sentence-case all section headings ("the kind of work i do here" → "The kind of work I do here", "flagship highlights" → "Flagship highlights", "supporting work" → "Supporting work", "nearby domains" → "Nearby domains"), inline labels ("scope:", "problem:", "role:", "constraints:", "decisions:", "outcomes:", "stack:", "proof:"), "back home" link, and the "when a project crosses boundaries" prose
2. Edit `src/scripts/domain-proof-view.ts` — update the exact same headings, labels, and prose to match DomainPage.astro identically. Cross-reference line by line to ensure parity
3. Edit `src/components/DomainGateShell.astro` — sentence-case "protected case file", "back home", status text, "locked boundary / proof withheld", "inside this domain", "current cold-load policy", "request access", "passcode", "enter passcode", "unlock", "ready", and body paragraphs with "i'll" → "I'll"
4. Edit `src/scripts/domain-gate-client.ts` — sentence-case "invalid passcode" → "Invalid passcode", "access granted" → "Access granted", "enter a passcode" → "Enter a passcode"
5. Edit `src/components/NotesIndexPage.astro` — sentence-case heading "notes" → "Notes", intro paragraph. Keep `.toLowerCase()` on line ~19 (date formatting)
6. Edit `src/components/NotePage.astro` — sentence-case "back to notes" → "Back to notes". Keep `.toLowerCase()` on line ~19 (date formatting)
7. Edit `src/pages/404.astro` — sentence-case title, description, `<h1>`, `<p>` body, and link text
8. Edit notes frontmatter: `keep-the-path-explicit.md` (title → "Keep the path explicit", summary sentence-cased), `systems-over-abstractions.md` (title → "Systems over abstractions", summary sentence-cased)
9. Run `pnpm build` and `pnpm validate:site` to confirm everything passes

## Must-Haves

- [ ] `DomainPage.astro` and `domain-proof-view.ts` have identical sentence-cased headings and labels
- [ ] `DomainGateShell.astro` strings sentence-cased
- [ ] `domain-gate-client.ts` 3 status strings sentence-cased
- [ ] Notes page components sentence-cased with date `.toLowerCase()` preserved
- [ ] 404 page sentence-cased
- [ ] Notes frontmatter sentence-cased
- [ ] All `data-*` and `aria-*` attributes unchanged
- [ ] `pnpm validate:site` passes 23 tests

## Verification

- `pnpm build` succeeds
- `pnpm validate:site` passes all 23 tests
- Manual diff of section headings between `DomainPage.astro` and `domain-proof-view.ts` confirms parity

## Observability Impact

- Signals added/changed: None
- How a future agent inspects this: grep headings in both dual-render files to confirm parity; `pnpm validate:site` for regression
- Failure state exposed: None

## Inputs

- T01 completed — data files already sentence-cased, CSS lowercase removed
- `src/pages/domains/[slug].astro` — current lowercase headings/labels
- `src/scripts/domain-proof-view.ts` — current lowercase headings/labels (must match DomainPage)
- `src/components/DomainGateShell.astro` — current lowercase strings
- `src/scripts/domain-gate-client.ts` — 3 lowercase status strings
- `src/components/NotesIndexPage.astro`, `src/components/NotePage.astro` — lowercase headings
- `src/pages/404.astro` — lowercase copy
- `src/content/notes/*.md` — lowercase frontmatter

## Expected Output

- All 9 files updated with sentence-cased visitor-facing strings
- Dual-render parity confirmed between DomainPage.astro and domain-proof-view.ts
- `pnpm validate:site` green (23 tests)
