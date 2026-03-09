---
phase: 03-homepage-positioning
plan: "01"
subsystem: ui
tags: [astro, homepage, navigation, contact, seo]
requires:
  - phase: 01-publishing-foundation
    provides: BaseLayout metadata handoff and base-aware path helpers
  - phase: 02-domain-hubs-supporting-work
    provides: Ordered domain registry and domain summaries reused as homepage navigation
provides:
  - Homepage-specific intro, contact, freshness, and SEO data in one module
  - Shared homepage markup with stable hero, navigation, contact, and freshness markers
  - Real homepage routing through BaseLayout instead of the earlier placeholder
affects: [phase-03-copy-refinement, phase-03-validation, homepage-routing]
tech-stack:
  added: []
  patterns:
    - thin Astro route plus shared data and shared component
    - registry-driven homepage navigation with base-aware internal links
key-files:
  created:
    - src/data/home.ts
    - src/components/home/HomePage.astro
    - .planning/phases/03-homepage-positioning/03-01-SUMMARY.md
  modified:
    - src/pages/index.astro
    - .planning/STATE.md
    - .planning/ROADMAP.md
    - .planning/REQUIREMENTS.md
key-decisions:
  - "Keep homepage-specific copy, contact links, freshness, and SEO fields in src/data/home.ts rather than embedding them in the route."
  - "Render homepage navigation from the shared Phase 2 domains registry and domainPath(slug) instead of inventing a second homepage-only link list."
  - "Keep src/pages/index.astro thin so BaseLayout remains the single owner of metadata and shell structure."
patterns-established:
  - "Homepage composition pattern: thin route + dedicated home data module + shared HomePage component."
  - "Homepage validation pattern: stable data-* markers exist in shipped markup so dist-first checks can audit the built artifact later."
requirements-completed: [HOME-01, HOME-02, HOME-03, HOME-04]
duration: 7 min
completed: 2026-03-09
---

# Phase 03 Plan 01: Replace the Placeholder Homepage with Shared Hero, Route, and Home Data Summary

**A real text-first homepage now ships through BaseLayout with shared intro, contact, and freshness data plus the five domain-registry routes as the primary next step.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-03-09T23:43:51Z
- **Completed:** 2026-03-09T23:51:01Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments
- Added one homepage data source for the intro, contact links, freshness signal, and SEO copy.
- Built a shared homepage component that turns the existing five-domain registry into the homepage's main navigation surface.
- Replaced the old landing-page placeholder with a thin route that hands homepage metadata to BaseLayout and renders the shared component.

## Task Commits

Each task was committed atomically:

1. **Task 1: Define homepage-specific content and outbound-link data** - `acab6c0` (feat)
2. **Task 2: Build a shared homepage component around the existing domain registry** - `3c5b980` (feat)
3. **Task 3: Rewire the homepage route through BaseLayout and the shared component** - `27a75ce` (feat)

**Plan metadata:** Pending final docs commit

## Files Created/Modified
- `src/data/home.ts` - Defines the homepage copy, contact links, freshness note, and SEO metadata in one typed module.
- `src/components/home/HomePage.astro` - Renders the hero, five domain links, visible contact links, and freshness marker with stable `data-*` hooks.
- `src/pages/index.astro` - Routes the homepage through `BaseLayout` and the shared homepage component.
- `.planning/phases/03-homepage-positioning/03-01-SUMMARY.md` - Records plan outcome, decisions, verification, and commit traceability.
- `.planning/STATE.md` - Advances the execution state to the next Phase 3 plan and records decisions plus metrics.
- `.planning/ROADMAP.md` - Marks `03-01` complete and updates Phase 3 progress.
- `.planning/REQUIREMENTS.md` - Marks the homepage requirements completed by this plan.

## Decisions Made
- Kept homepage-specific content in `src/data/home.ts` so the route stays thin and later copy work has one source of truth.
- Reused the shared Phase 2 `domains` registry and `domainPath(slug)` helpers so the homepage stays aligned with the domain-first information architecture.
- Preserved the `BaseLayout` metadata handoff pattern from Phase 1 instead of moving page-shell logic into the homepage component.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Manually corrected planning state after `gsd-tools state advance-plan` failed to parse the repo's current `STATE.md` plan wording**
- **Found during:** Plan wrap-up (metadata/docs update)
- **Issue:** The required `gsd-tools` update flow partially succeeded, but `state advance-plan` still reported `Cannot parse Current Plan or Total Plans in Phase from STATE.md`, leaving the current-position section stale even after the metric/session updates ran.
- **Fix:** Ran the supported helpers that still worked (`state update-progress`, `state record-metric`, `state record-session`, `roadmap update-plan-progress`, and `requirements mark-complete`), then manually patched `STATE.md` to reflect `03-01` completion, the next plan, updated progress, and the new Phase 3 decisions.
- **Files modified:** `.planning/STATE.md`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`
- **Verification:** Re-read the planning docs to confirm `03-01` is marked complete, Phase 3 shows `1/3` plans complete, and `HOME-01` through `HOME-04` are marked complete.
- **Committed in:** Pending final docs commit

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The fallback only affected planning bookkeeping. The homepage implementation and verification results stayed within the planned scope.

## Issues Encountered
None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- `03-02` can refine homepage wording and layout on top of the new shared data/component structure instead of rewriting the route again.
- `03-03` can validate the built homepage artifact directly because the required `data-*` markers are now present in the shipped markup.

## Self-Check: PASSED

---
*Phase: 03-homepage-positioning*
*Completed: 2026-03-09*
