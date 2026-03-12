---
id: S03
milestone: M003
status: ready
---

# S03: Polish, performance, and regression proof — Context

## Goal

Add accessibility polish (`prefers-reduced-motion`, tab-visibility pause), wire shader contract tests into the existing `validate:site` release gate, and confirm the full test suite passes with the shader integrated.

## Why this Slice

S01 and S02 deliver the working shader across all pages. S03 closes the accessibility and regression gaps that block milestone completion: reduced-motion support (R406), tab-hidden pause (performance), and machine-verifiable proof that the shader is present and the existing 20+ tests still pass (R407). Without this, the milestone can't be called done.

## Scope

### In Scope

- `prefers-reduced-motion: reduce` support — freeze the shader to a static dither frame (one rendered frame, then stop the animation loop); no cursor reactivity while frozen
- Tab visibility pause — listen for `visibilitychange`, call `pause()` when hidden, `resume()` when visible (save GPU cycles on backgrounded tabs)
- Shader contract browser test: confirm `canvas[data-shader-renderer]` exists on a page and has a valid value (`webgpu`, `webgl2`, or `none`)
- Wire the new shader test into `validate:site` pipeline (new `validate:m003:s03` script or equivalent)
- Full `pnpm validate:site` passes — all existing M002 tests + new shader test
- Cleanup: remove or exclude `/shader-demo/` page from production build (agent's discretion on approach — could delete, could gate behind dev-only, could keep if harmless)

### Out of Scope

- Performance profiling or frame budget optimization beyond tab-pause — the shader is already lightweight
- Visual regression testing (screenshot diffing) — visual quality is human-verified via UAT
- Thorough behavioral tests for opt-out, reduced motion, or tab pause — minimal contract test is sufficient
- Any new features or visual changes to the shader itself

## Constraints

- Must not break any of the 20 existing browser tests or 3 dist validators
- `prefers-reduced-motion` behavior must be freeze-to-static, not hide-entirely — the dither pattern is still visible, just not animated
- New tests follow the existing pattern: Node test runner (`node --test`), Puppeteer browser tests, wired into `package.json` scripts
- Console logging contract from D028 must be preserved (`[shader] using <renderer>`)

## Integration Points

### Consumes

- `src/components/shader/ShaderBackground.astro` — S02 output, where reduced-motion and visibility listeners will be wired
- `src/lib/shader/dither-shader.ts` → `ShaderInstance.pause()`, `ShaderInstance.resume()` — S01 lifecycle API
- `src/lib/shader/types.ts` → `ShaderInstance` interface
- `pnpm validate:site` pipeline in `package.json` — existing test orchestration
- `canvas[data-shader-renderer]` attribute from D028 — the testable contract surface

### Produces

- `prefers-reduced-motion` handling wired into shader initialization (freeze after first frame)
- `visibilitychange` listener for tab-hidden pause/resume
- `tests/shader-presence.browser.test.mjs` (or similar) — browser test confirming shader canvas contract
- Updated `package.json` with `validate:m003:s03` script wired into `validate:site`

## Open Questions

- Whether the static frozen frame should render with the pointer at center (0.5, 0.5) or at the user's last known position — likely center for consistency, but trivial either way
- Whether `/shader-demo/` should be deleted, dev-gated, or kept — agent's discretion during implementation
