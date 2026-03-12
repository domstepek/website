# S03: Polish, Performance, and Regression Proof

**Goal:** Add prefers-reduced-motion freeze, tab-visibility pause, shader contract browser test, and wire into validate:site.
**Demo:** The shader freezes to a static frame when reduced-motion is preferred, pauses on tab-hide, a browser test confirms shader presence, and the full `pnpm validate:site` passes.

## Must-Haves
- `prefers-reduced-motion: reduce` freezes shader to one static frame
- `visibilitychange` listener pauses shader when tab is hidden
- Browser test confirms `canvas[data-shader-renderer]` exists with valid value
- `pnpm validate:site` passes (all 20+ existing tests + new shader test)

## Tasks

- [ ] **T01: Reduced motion, tab visibility, and shader contract test**
  Add prefers-reduced-motion freeze + tab-visibility pause to ShaderBackground.astro, write shader-presence browser test, wire into validate:site, run full suite.

## Files Likely Touched
- src/components/shader/ShaderBackground.astro
- tests/shader-presence.browser.test.mjs
- package.json
