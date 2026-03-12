---
id: T03
parent: S01
milestone: M003
provides:
  - initDitherShader public API (WebGPU → WebGL2 → null detection chain)
  - ShaderInstance lifecycle (pause/resume/destroy/setPointer)
  - Demo page at /shader-demo/ for visual proof
key_files:
  - src/lib/shader/dither-shader.ts
  - src/pages/shader-demo/index.astro
key_decisions:
  - ResizeObserver uses devicePixelRatio scaling for crisp rendering on HiDPI displays
  - CSS var fallback defaults hardcoded to match global.css values for robustness
patterns_established:
  - Orchestrator pattern: detect → init → wrap in lifecycle handle with rAF loop and ResizeObserver
  - Demo page pattern: BaseLayout + fullscreen fixed canvas + client script import
observability_surfaces:
  - "console.info('[shader] using <webgpu|webgl2>') on successful init"
  - "console.warn('[shader] no gpu api available') on total failure"
  - "canvas[data-shader-renderer] DOM attribute reflects active renderer"
  - "initDitherShader returns null on failure"
duration: 20m
verification_result: passed
completed_at: 2026-03-12
blocker_discovered: false
---

# T03: Orchestrator, demo page, and visual verification

**Wired WebGPU and WebGL2 renderers into public `initDitherShader` API with detection chain, lifecycle control, and a demo page proving the engine renders.**

## What Happened

Created `dither-shader.ts` as the public orchestrator that implements the detection chain (WebGPU → WebGL2 → null), reads palette colors from CSS custom properties via `getComputedStyle`, wraps the active renderer in a `ShaderInstance` with `pause`/`resume`/`destroy`/`setPointer`, manages the `requestAnimationFrame` loop, and syncs canvas dimensions via `ResizeObserver` with devicePixelRatio scaling.

Created `src/pages/shader-demo/index.astro` with a fullscreen fixed canvas and client-side script that imports and calls `initDitherShader`. The overlay text confirms the page purpose and directs users to the console for renderer info.

## Verification

- `pnpm check` — 0 errors, 0 warnings (3 pre-existing hints)
- `pnpm build` — succeeded, `/shader-demo/index.html` included in static output
- `localhost:4321/shader-demo/` — page loads, canvas renders with WebGPU
- Browser console confirmed: `[shader] using webgpu`
- `document.querySelector('canvas').dataset.shaderRenderer` returned `'webgpu'`
- ShaderInstance active: `window.__shaderInstance` exists with all lifecycle methods
- Canvas dimensions synced: 2530×1600 physical pixels for 1265×800 CSS size (2× DPR)

**Slice-level verification status (T03 is final task):**
- ✅ `pnpm check` passes
- ✅ `pnpm build` succeeds with demo page included
- ✅ Dev server at `/shader-demo/` shows shader running (WebGPU active)
- ⚠️ Visual dither pattern not confirmable in headless Playwright (WebGPU initializes but GPU rendering doesn't produce visible pixels in headless Chromium) — requires human UAT for visual quality
- ⚠️ WebGL2 fallback not tested in this session (WebGPU succeeded first) — forcing fallback requires a browser without WebGPU support

## Diagnostics

- Check `canvas[data-shader-renderer]` for current renderer: `'webgpu'`, `'webgl2'`, or `'none'`
- Read browser console for `[shader] using ...` info or `[shader] ...` warnings
- `initDitherShader` returns `null` on total failure
- Access `window.__shaderInstance` on demo page for runtime lifecycle control

## Deviations

- Renderer classes are exported as `class WebGPURenderer` / `class WebGL2Renderer` (not factory functions) — adapted imports accordingly

## Known Issues

- Headless Chromium (Playwright) initializes WebGPU but doesn't render visible pixels — visual verification requires a real browser with GPU support
- WebGL2 fallback path untested in this session (WebGPU succeeds on test browser)

## Files Created/Modified

- `src/lib/shader/dither-shader.ts` — public orchestrator with detection chain, lifecycle, rAF loop, ResizeObserver
- `src/pages/shader-demo/index.astro` — demo page with fullscreen canvas and client script
