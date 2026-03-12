---
id: S01
parent: M003
milestone: M003
provides:
  - initDitherShader(canvas, options?) public API — WebGPU → WebGL2 → null detection chain
  - ShaderInstance interface with destroy(), setPointer(x, y), pause(), resume()
  - ShaderOptions and ShaderColors interfaces for color/config
  - WebGPU renderer with WGSL animated Bayer 8×8 dither shader
  - WebGL2 renderer with GLSL 300 es port of the same dither algorithm
  - Bayer 8×8 ordered dither threshold matrix (BAYER_8X8) and srgbToLinear utility
  - Demo page at /shader-demo/ for visual proof
requires:
  - slice: none
    provides: none (first slice)
affects:
  - S02 (consumes initDitherShader, ShaderInstance for BaseLayout integration and cursor tracking)
key_files:
  - src/lib/shader/types.ts
  - src/lib/shader/webgpu-renderer.ts
  - src/lib/shader/webgl2-renderer.ts
  - src/lib/shader/dither-shader.ts
  - src/pages/shader-demo/index.astro
key_decisions:
  - D023: Custom WebGPU + WebGL2 from scratch — no third-party shader library
  - D025: Colors derived from CSS custom properties (--bg, --accent, --accent-strong)
  - D027: /shader-demo/ page as standalone visual proof with data-shader-renderer attribute
  - D028: Console logging contract — [shader] using <renderer> on success, warnings on failure
  - WebGPU types added globally via tsconfig types array (not per-file triple-slash directives)
  - Uniform buffer 80 bytes, std140-aligned with explicit padding for vec3→vec4 alignment
  - Bayer matrix duplicated in WGSL (GPU-side const) and types.ts (JS-side Float32Array for WebGL2)
  - Fullscreen geometry without vertex buffers (vertex_index in WGSL, gl_VertexID in GLSL)
patterns_established:
  - Renderer interface pattern: init(canvas, colors) → Promise<boolean>, render(time, pointer), resize(w, h), destroy()
  - Orchestrator pattern: detect → init → wrap in lifecycle handle with rAF loop and ResizeObserver
  - Color conversion at uniform upload time (sRGB hex → linear RGB), not in shader
  - Demo page pattern: BaseLayout + fullscreen fixed canvas + client script import
observability_surfaces:
  - "console.info('[shader] using <webgpu|webgl2>') on successful init"
  - "console.warn('[shader] ...') on fallback or failure with reason"
  - "canvas[data-shader-renderer] DOM attribute reflects active renderer ('webgpu', 'webgl2', or 'none')"
  - "initDitherShader returns null on total failure"
  - "WGSL compilation errors logged via getCompilationInfo()"
  - "WebGL2 shader compile/link errors logged with [shader/webgl2] prefix"
  - "WebGPU device loss logged via device.lost promise"
drill_down_paths:
  - .gsd/milestones/M003/slices/S01/tasks/T01-SUMMARY.md
  - .gsd/milestones/M003/slices/S01/tasks/T02-SUMMARY.md
  - .gsd/milestones/M003/slices/S01/tasks/T03-SUMMARY.md
duration: 45m
verification_result: passed
completed_at: 2026-03-12
---

# S01: Faded Dither Shader Engine

**Standalone shader engine with WebGPU and WebGL2 renderers producing an animated Bayer 8×8 ordered dither pattern, wired through a public `initDitherShader` API with lifecycle control and a demo page at `/shader-demo/`.**

## What Happened

Built four TypeScript modules forming a complete standalone dither shader engine:

**T01 — Types, constants, and WebGPU renderer.** Established all shared interfaces (`ShaderInstance`, `ShaderOptions`, `ShaderColors`, `Renderer`), the Bayer 8×8 ordered dither threshold matrix, and an `srgbToLinear` utility. The WebGPU renderer implements a WGSL fragment shader that generates animated gradient blobs from layered sine/cosine waves, applies Bayer 8×8 ordered dithering, and maps results to a 3-color palette derived from CSS custom properties. Rendering uses a fullscreen triangle via `vertex_index` with an 80-byte std140-aligned uniform buffer carrying time, resolution, pointer, and palette colors. Robust error handling: null checks on adapter/device/context, compilation error logging via `getCompilationInfo()`, and device loss handling.

**T02 — WebGL2 fallback renderer.** Direct GLSL 300 es port of the WGSL shader with identical blob field constants, pointer influence, Bayer threshold comparison, and palette mapping. Uses `gl_VertexID` with an empty VAO for the fullscreen quad. Context loss triggers `destroy()` cleanup with `WEBGL_lose_context` for forced resource release.

**T03 — Orchestrator and demo page.** `dither-shader.ts` implements the detection chain (WebGPU → WebGL2 → null), reads palette colors from CSS custom properties via `getComputedStyle`, wraps the active renderer in a `ShaderInstance` with `pause`/`resume`/`destroy`/`setPointer`, manages the `requestAnimationFrame` loop, and syncs canvas dimensions via `ResizeObserver` with devicePixelRatio scaling. The demo page at `/shader-demo/` renders a fullscreen fixed canvas and calls `initDitherShader` in a client script, with `data-shader-renderer` reflecting the active renderer.

## Verification

- `pnpm check` — 0 errors, 0 warnings (3 pre-existing hints from other files)
- `pnpm build` — succeeded, `/shader-demo/index.html` included in static output
- Dev server at `localhost:4321/shader-demo/` — page loads, canvas renders with WebGPU
- Console confirmed: `[shader] using webgpu`
- `canvas[data-shader-renderer]` correctly set to `'webgpu'`
- `ShaderInstance` accessible at `window.__shaderInstance` with all lifecycle methods
- Canvas dimensions synced: 2530×1600 physical pixels for 1265×800 CSS (2× DPR)
- `types.ts` exports verified: `BAYER_8X8` (64 elements), `srgbToLinear` (correct conversions)

## Requirements Advanced

- R401 (custom dither GPU shader) — shader engine renders animated faded dither pattern on a standalone canvas; full site integration deferred to S02
- R402 (site accent color palette) — colors derived from CSS custom properties at init time; palette is cohesive with site identity
- R405 (WebGPU primary with WebGL2 fallback) — detection chain implemented and WebGPU path verified; WebGL2 renderer compiles and matches algorithm but runtime fallback untested (WebGPU succeeded on test browser)

## Requirements Validated

- None — R401, R402, R405 are advanced but not fully validated; site integration (S02) and regression proof (S03) remain

## New Requirements Surfaced

- None

## Requirements Invalidated or Re-scoped

- None

## Deviations

- Renderer classes exported as `class WebGPURenderer` / `class WebGL2Renderer` rather than factory functions — no impact on API surface
- Uniform buffer is 80 bytes (not ~64 as estimated) due to std140 vec3→vec4 alignment padding

## Known Limitations

- WebGL2 fallback path untested at runtime (WebGPU succeeds on test browser) — S02/S03 should verify on a browser without WebGPU
- Headless Chromium (Playwright) initializes WebGPU but doesn't render visible pixels — visual verification requires a real browser with GPU support
- Visual quality of the dither effect requires human UAT (subjective assessment)
- No `prefers-reduced-motion` support yet (S03 scope)
- No tab-hidden pause behavior yet (S03 scope)
- No cursor reactivity wired yet (S02 scope)

## Follow-ups

- S02: Integrate into `BaseLayout.astro` with `ShaderBackground.astro` component, wire cursor tracking via `setPointer`, add per-page opt-out prop
- S03: Add `prefers-reduced-motion` support, tab-hidden pause, browser tests for canvas presence, and `validate:site` regression proof

## Files Created/Modified

- `src/lib/shader/types.ts` — shared interfaces, Bayer 8×8 matrix, srgbToLinear utility
- `src/lib/shader/webgpu-renderer.ts` — WebGPU renderer with WGSL animated dither shader
- `src/lib/shader/webgl2-renderer.ts` — WebGL2 renderer with GLSL 300 es dither shader
- `src/lib/shader/dither-shader.ts` — public orchestrator with detection chain, lifecycle, rAF loop, ResizeObserver
- `src/pages/shader-demo/index.astro` — demo page with fullscreen canvas and client script
- `tsconfig.json` — added `@webgpu/types` to compilerOptions.types
- `package.json` — `@webgpu/types` added to devDependencies

## Forward Intelligence

### What the next slice should know
- `initDitherShader(canvas, options?)` is the only public entry point — it returns `ShaderInstance | null`
- The `ShaderInstance.setPointer(x, y)` method accepts normalized coordinates (0–1 range, relative to canvas) — S02's cursor tracking needs to normalize `clientX/clientY` against canvas bounds
- Colors are read once at init from `getComputedStyle` — if CSS vars change at runtime (e.g., theme toggle), the shader won't update without re-initialization
- The demo page exposes `window.__shaderInstance` for debugging — this should not be relied on in production integration

### What's fragile
- WebGL2 renderer is algorithmically identical but runtime-untested — any visual parity issues will surface when a browser actually falls back to it
- The `data-shader-renderer` attribute is the only machine-readable signal for which renderer is active — browser tests in S03 should use this, not visual pixel inspection
- devicePixelRatio scaling in ResizeObserver means the canvas physical size can be very large on HiDPI — watch for performance on low-end GPUs

### Authoritative diagnostics
- Console `[shader] using <renderer>` — the single reliable signal for which code path executed
- `canvas[data-shader-renderer]` — DOM-inspectable renderer state
- `initDitherShader` return value — `null` means total failure, non-null means a renderer initialized

### What assumptions changed
- Assumed ~64 byte uniform buffer — actual is 80 bytes due to std140 alignment (no functional impact)
- Assumed factory function exports — actual is class exports (adapted in orchestrator, no API change)
