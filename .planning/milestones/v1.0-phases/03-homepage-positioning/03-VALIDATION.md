---
phase: 3
slug: homepage-positioning
status: planned
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-09
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | other - Astro compiler checks, production build validation, Node artifact assertions, and `/agent-browser --native` smoke checks against the built or deployed site |
| **Config file** | `package.json`, `astro.config.mjs`, `scripts/validate-phase1.mjs`, `scripts/validate-phase2.mjs`, `scripts/validate-phase3.mjs` (to be introduced in this phase) |
| **Quick run command** | `pnpm astro check && pnpm astro build` |
| **Full suite command** | `pnpm astro check && pnpm astro build && pnpm validate:site` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every completed task until `validate:phase3` exists:** Run `pnpm astro check && pnpm astro build`
- **After the task that introduces `validate:phase3` and after each later task:** Run `pnpm astro check && pnpm astro build && pnpm validate:site`
- **After every plan wave:** Run the full suite command available at that point in the phase
- **Before `$gsd-verify-work`:** Full suite must be green, then use `/agent-browser --native` for homepage-first smoke checks before reserving any remaining subjective checks to the manual checklist below
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

This map is the planning-time validation contract for Phase 3. The plan and wave columns match the `03-01` through `03-03` breakdown below.

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 3-01-01 | 01 | 1 | HOME-01, HOME-03, HOME-04 | static | `pnpm astro check` | `src/data/home.ts` | ⬜ pending |
| 3-01-02 | 01 | 1 | HOME-01, HOME-02, HOME-03, HOME-04 | build | `pnpm astro check && pnpm astro build` | `src/components/home/HomePage.astro` | ⬜ pending |
| 3-01-03 | 01 | 1 | HOME-01, HOME-02 | build | `pnpm astro check && pnpm astro build` | `src/pages/index.astro` | ⬜ pending |
| 3-02-01 | 02 | 2 | HOME-01, HOME-04 | static | `pnpm astro check` | `src/data/home.ts` | ⬜ pending |
| 3-02-02 | 02 | 2 | HOME-01, HOME-02 | build | `pnpm astro check && pnpm astro build` | `src/data/domains/analytics.ts` plus the other 4 domain modules | ⬜ pending |
| 3-02-03 | 02 | 2 | HOME-01, HOME-02, HOME-03, HOME-04 | build | `pnpm astro check && pnpm astro build` | `src/styles/global.css` | ⬜ pending |
| 3-03-01 | 03 | 3 | HOME-01, HOME-02, HOME-03, HOME-04 | artifact | `pnpm astro check && pnpm astro build && pnpm validate:phase3` | `scripts/validate-phase3.mjs` | ⬜ pending |
| 3-03-02 | 03 | 3 | HOME-01, HOME-02, HOME-03, HOME-04 | artifact | `pnpm astro check && pnpm astro build && pnpm validate:site` | `package.json` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all Phase 3 requirements:

- `pnpm astro check`
- `pnpm astro build`
- `scripts/validate-phase1.mjs`
- `scripts/validate-phase2.mjs`
- `.github/workflows/deploy.yml` already runs the aggregate site validator after build

Phase 3 should add `scripts/validate-phase3.mjs` and extend `validate:site` during normal execution rather than through a separate setup wave.

---

## Manual-Only Verifications

These are the subjective and browser-level checks that should happen after the automated artifact gates are green.

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| The first screen immediately communicates the five areas of work | HOME-01 | Structural assertions can prove links exist, but not whether the homepage actually explains the scope clearly | Open the homepage, read only the first screen, and confirm it is obvious that Dom works across analytics, infrastructure, ai / ml, product, and developer experience |
| Domain links feel like the primary next step and the five preview lines stay distinct | HOME-01, HOME-02 | Link presence is automatable, but information hierarchy, wording quality, and boundary clarity are visual judgments | Open the homepage on mobile and desktop widths and confirm the domain block reads as the main internal navigation surface and that the five preview lines sound distinct without blurring the Phase 2 domain boundaries |
| Contact links are easy to find and feel intentional | HOME-03 | Source checks can validate hrefs, but not prominence in the page flow | Open the homepage and verify GitHub, LinkedIn, and email are visible without hunting, then open each link once |
| Freshness signal reads as meaningful rather than decorative | HOME-04 | Automation can check presence, but not whether the wording feels intentional | Review the homepage freshness note and confirm it reads like real status or recency information, not a throwaway label |
| Focus states and spacing remain comfortable across the new homepage layout | HOME-02, HOME-03 | Reading comfort and keyboard flow are best confirmed in-browser | Tab through the homepage, then check the layout on mobile and desktop widths for heading wraps, spacing rhythm, and visible focus styles |

Use `/agent-browser --native` first when browser-accessible smoke checks are available.

---

## Validation Sign-Off

- [x] All tasks have `<verify>` coverage or a clearly mapped manual-only check
- [x] Sampling continuity: no 3 consecutive tasks without automated verification
- [x] Wave 0 dependencies are not required
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter after the final plan/task mapping is filled in

**Approval:** planned 2026-03-09
