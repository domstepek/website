---
phase: 02-domain-hubs-supporting-work
plan: "03"
subsystem: testing
tags: [astro, validation, dist, github-pages, ci]
requires:
  - phase: 01-publishing-foundation
    provides: Static Astro build output, GitHub Pages deploy wiring, and the Phase 1 dist-first validation pattern
  - phase: 02-domain-hubs-supporting-work
    provides: Shared domain routes, stable domain-page data markers, and curated supporting-work content to audit
provides:
  - Dist-first validation for all five built domain pages
  - Aggregate site validation that runs Phase 1 and Phase 2 checks together
  - GitHub Pages deploy gating that blocks publish on structural domain regressions
affects: [phase-03-homepage-positioning, release-gates, github-pages-deploy]
tech-stack:
  added: []
  patterns:
    - dist-first HTML assertions over emitted Astro artifacts
    - aggregate site validation reused locally and in CI
key-files:
  created:
    - scripts/validate-phase2.mjs
    - .planning/phases/02-domain-hubs-supporting-work/02-03-SUMMARY.md
  modified:
    - package.json
    - .github/workflows/deploy.yml
    - .planning/STATE.md
    - .planning/ROADMAP.md
    - .planning/REQUIREMENTS.md
key-decisions:
  - "Keep Phase 2 validation dependency-free and dist-first by parsing built domain HTML directly in Node."
  - "Derive the expected back-home href from each page's canonical URL so the validator stays base-path aware without importing app helpers."
  - "Expose one aggregate `validate:site` command and reuse it in CI so future phases extend a single site-level release gate."
patterns-established:
  - "Validation pattern: phase-level checks inspect built HTML in `dist` rather than source templates."
  - "Release-gate pattern: `validate:site` aggregates site validators locally and in the Pages workflow."
requirements-completed: [DOMN-01, DOMN-02, DOMN-03, DOMN-04]
duration: 6 min
completed: 2026-03-09
---

# Phase 02 Plan 03: Add Dist-First Domain Validation and CI Release Gates Summary

**A built-artifact validator for all five domain hubs, a shared `validate:site` gate, and GitHub Pages enforcement that blocks deploys on structural regressions**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-09T20:45:40Z
- **Completed:** 2026-03-09T20:51:40Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments
- Added a fast Node validator that audits the emitted domain pages in `dist/` for artifact existence, canonical metadata, template markers, back-home wiring, and outward proof links.
- Exposed `validate:phase2` and `validate:site` so the same release gate can be run locally after build and extended in future phases.
- Updated the GitHub Pages workflow to run the aggregate site validation before artifact upload while keeping the official Pages actions intact.

## Task Commits

Each task was committed atomically:

1. **Task 1: Implement a fast dist-first validator for the five domain pages** - `2540b17` (feat)
2. **Task 2: Add local Phase 2 and aggregate site validation scripts** - `25b6e12` (chore)
3. **Task 3: Update the GitHub Pages workflow to enforce the combined validation gate** - `13452b0` (ci)

**Plan metadata:** Pending final docs commit

## Files Created/Modified
- `scripts/validate-phase2.mjs` - Audits built domain HTML for the five required artifacts and structural release markers.
- `package.json` - Adds `validate:phase2` plus the aggregate `validate:site` command.
- `.github/workflows/deploy.yml` - Runs the aggregate site validation gate before `upload-pages-artifact` and `deploy-pages`.
- `.planning/phases/02-domain-hubs-supporting-work/02-03-SUMMARY.md` - Records the shipped validation gate, task commits, and plan decisions.
- `.planning/STATE.md` - Advances the project state past Phase 2 and points the next work at Phase 3 planning.
- `.planning/ROADMAP.md` - Marks `02-03` and Phase 2 complete.
- `.planning/REQUIREMENTS.md` - Refreshes the planning metadata after Phase 2 completion.

## Decisions Made
- Kept the validator dependency-free and dist-first so the release gate checks exactly what GitHub Pages will publish without adding a parsing library just for one script.
- Derived the expected `back home` href from each page's canonical URL so base-path handling stays correct for both local and Pages builds.
- Aggregated Phase 1 and Phase 2 validation behind `validate:site` so future phases can add checks once without copying workflow logic.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fall back to manual planning-doc updates when current `gsd-tools` helpers cannot persist this repo's planning markdown shape cleanly**
- **Found during:** Plan wrap-up (metadata/docs update)
- **Issue:** `state advance-plan` returned `Cannot parse Current Plan or Total Plans in Phase from STATE.md`, `roadmap update-plan-progress` reported success without changing `ROADMAP.md` on disk, and `requirements mark-complete` could not match the already-complete `DOMN-*` items in the current markdown format.
- **Fix:** Updated `.planning/STATE.md`, `.planning/ROADMAP.md`, and `.planning/REQUIREMENTS.md` manually after confirming the helper limitations.
- **Files modified:** `.planning/STATE.md`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`
- **Verification:** Re-read the planning docs to confirm Phase 2 is complete, the next focus is Phase 3 planning, and the requirements file reflects the latest completion date.
- **Committed in:** Pending final docs commit

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The fallback only affected planning bookkeeping. Shipped validator, scripts, and CI gate stayed within the approved scope.

## Issues Encountered
None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 2 now has a repeatable local and CI release gate that validates the built domain hubs, not just the source template shape.
- Phase 3 can reuse the finished domain routes and validation baseline when the homepage starts routing visitors into those hubs.

## Self-Check: PASSED

---
*Phase: 02-domain-hubs-supporting-work*
*Completed: 2026-03-09*
