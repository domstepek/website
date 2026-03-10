---
phase: 03-homepage-positioning
plan: 04
subsystem: ui
tags: [dark-theme, monospace, crt-effect, retro-cursors, avatar, space-mono, css]

# Dependency graph
requires:
  - phase: 01-astro-scaffold
    provides: BaseLayout, global.css, site shell structure
  - phase: 03-homepage-positioning
    provides: Homepage component, home data, domain navigation
provides:
  - Dark theme with near-black background and light text across all pages
  - Space Mono monospace typography via Google Fonts
  - CRT scanline overlay effect using CSS repeating-linear-gradient
  - Retro pixel cursor assets (default arrow + pointer hand)
  - Personal avatar illustration on homepage hero with blend mode integration
affects: [all-pages, visual-design, homepage]

# Tech tracking
tech-stack:
  added: [Space Mono (Google Fonts), custom PNG cursors]
  patterns: [dark-theme CSS custom properties, mix-blend-mode for image integration, CRT overlay with pointer-events:none]

key-files:
  created:
    - public/cursors/default.png
    - public/cursors/pointer.png
  modified:
    - src/styles/global.css
    - src/components/layout/BaseLayout.astro
    - src/components/home/HomePage.astro
    - src/data/home.ts

key-decisions:
  - "Used mix-blend-mode: lighten to blend white-background avatar into dark theme instead of requiring transparent PNG"
  - "Generated retro pixel cursor PNGs programmatically with Node.js raw PNG encoding (no canvas/sharp dependency needed)"
  - "Applied CRT scanline via fixed overlay div with repeating-linear-gradient and pointer-events: none for zero interaction impact"

patterns-established:
  - "Dark theme: all color values flow through CSS custom properties in :root"
  - "Font stack: --font-mono replaces --font-sans as the single typography variable"
  - "Cursor: universal selector applies default.png, interactive elements get pointer.png"

requirements-completed: [HOME-01]

# Metrics
duration: 8min
completed: 2026-03-10
---

# Phase 03 Plan 04: Dark Theme and CRT Effect Summary

**Dark theme retheme with Space Mono monospace font, CRT scanline overlay, retro pixel cursors, and avatar illustration on homepage**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-10T00:44:00Z
- **Completed:** 2026-03-10T00:52:00Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Switched entire site from light to dark color scheme (#0a0a0a background, #e0e0e0 text, green accent)
- Replaced Inter sans-serif with Space Mono monospace via Google Fonts preconnect
- Added CRT scanline overlay visible as subtle horizontal lines across viewport
- Generated and integrated retro pixel cursor PNGs (arrow default + hand pointer)
- Added personal avatar illustration to homepage hero with mix-blend-mode: lighten for seamless dark-bg integration
- All existing validators (phases 1-6) continue to pass

## Task Commits

Each task was committed atomically:

1. **Task 1: Dark theme, monospace font, and CRT scanline effect** - `13c6765` (feat)
2. **Task 2: Verify dark theme and CRT effect visually** - user-approved checkpoint (no commit)

**Plan metadata:** pending (docs: complete plan)

## Files Created/Modified
- `src/styles/global.css` - Dark theme custom properties, monospace font, CRT overlay, cursor rules, avatar styles
- `src/components/layout/BaseLayout.astro` - Google Fonts link, CRT overlay div
- `src/components/home/HomePage.astro` - Avatar image element in hero section
- `src/data/home.ts` - Added avatar field with image path
- `public/cursors/default.png` - Retro pixel arrow cursor (32x32)
- `public/cursors/pointer.png` - Retro pixel hand cursor (32x32)
- `public/images/avatar.png` - Personal avatar illustration

## Decisions Made
- Used `mix-blend-mode: lighten` to blend the white-background avatar PNG into the dark theme, making the white background disappear while preserving the illustration
- Generated cursor PNGs using raw PNG encoding in Node.js (zlib + Buffer) to avoid requiring canvas or sharp dependencies
- Applied CRT scanline effect via a fixed overlay div with `pointer-events: none` and `aria-hidden="true"` so it never blocks interaction or confuses screen readers
- Used green accent (#6fba7f / #7fd48f) for links and interactive elements to evoke a terminal aesthetic

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Dark theme and retro visual identity are complete and apply across all pages
- All existing content, navigation, and validators remain intact
- Ready for any further visual refinements or content updates

## Self-Check: PASSED

All 7 created/modified files verified on disk. Commit 13c6765 verified in git log.

---
*Phase: 03-homepage-positioning*
*Completed: 2026-03-10*
