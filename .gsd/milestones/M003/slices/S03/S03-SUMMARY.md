---
id: S03
parent: M003
milestone: M003
provides:
  - prefers-reduced-motion freeze (static dither frame, data-shader-motion attribute)
  - Tab visibility pause/resume via visibilitychange listener
  - 3 browser tests for shader presence, valid renderer attribute, and disableShader opt-out
  - validate:m003:s03 script wired into validate:site pipeline (23 total tests)
requires:
  - slice: S02
    provides: ShaderBackground.astro, BaseLayout disableShader prop, cursor tracking
affects: []
key_files:
  - src/components/shader/ShaderBackground.astro
  - tests/shader-presence.browser.test.mjs
  - package.json
key_decisions:
  - Reduced motion freezes to static frame (one render then pause), not hide entirely
  - Tab-hidden respects reduced-motion state — only resumes on visible if motion is not reduced
  - data-shader-motion attribute reflects animating/frozen state for testability
patterns_established:
  - Motion preference media query listener pattern for shader lifecycle
  - Tab visibility combined with motion preference for correct resume behavior
drill_down_paths:
  - .gsd/milestones/M003/slices/S03/S03-PLAN.md
duration: 10m
verification_result: passed
completed_at: 2026-03-12
---

# S03: Polish, Performance, and Regression Proof

**Reduced-motion freeze, tab-visibility pause, 3 shader contract browser tests, and full 23-test validate:site suite passing.**

## What Happened

Single task added three capabilities to ShaderBackground.astro:

1. **prefers-reduced-motion:** On init, checks `matchMedia("(prefers-reduced-motion: reduce)")`. If matched, calls `instance.pause()` immediately after first frame render, producing a static dither pattern. Sets `data-shader-motion="frozen"` on canvas. Listens for changes to toggle between frozen/animating.

2. **Tab visibility:** Listens for `visibilitychange` on document. Pauses shader when tab is hidden, resumes when visible — but only if reduced-motion is not active (avoids overriding the freeze).

3. **Browser tests:** Three Puppeteer tests in `shader-presence.browser.test.mjs`:
   - Homepage has `#shader-bg` canvas with valid `data-shader-renderer` (webgpu, webgl2, or none)
   - About page has shader canvas present
   - Shader-demo page has NO `#shader-bg` (confirms disableShader opt-out works)

All wired into `validate:m003:s03` → `validate:site`. Full suite: 23 tests passing.

## Verification

- `pnpm validate:site` — 23 tests, 0 failures
  - M002 S01-S04: 20 tests pass (unchanged)
  - M003 S03: 3 new tests pass
- `pnpm build` — 11 pages, clean
- `pnpm check` — 0 errors

## Files Created/Modified

- `src/components/shader/ShaderBackground.astro` — added reduced-motion freeze, tab-visibility pause, data-shader-motion attribute
- `tests/shader-presence.browser.test.mjs` — 3 browser tests for shader contract
- `package.json` — added test:shader-presence:browser, validate:m003:s03, updated validate:site
- `.gsd/milestones/M003/slices/S03/S03-PLAN.md` — slice plan
