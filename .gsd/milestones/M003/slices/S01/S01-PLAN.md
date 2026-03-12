# S01: Faded Dither Shader Engine

**Goal:** Produce a standalone shader engine — four TypeScript modules that render an animated faded dither pattern on a canvas using WebGPU (primary) or WebGL2 (fallback), with graceful degradation when neither is available.
**Demo:** Opening `localhost:4321` shows an animated faded dither pattern filling the viewport as a standalone canvas, with soft green-tinted blobs dissolving through an ordered dither grid, running on WebGPU or WebGL2.

## Must-Haves

- `ShaderInstance` interface with `destroy()`, `setPointer(x, y)`, `pause()`, `resume()` methods exposed from `dither-shader.ts`
- WebGPU renderer implementing Bayer 8×8 ordered dithering on animated gradient blobs in WGSL
- WebGL2 renderer implementing the same dither algorithm in GLSL with visual parity
- `initDitherShader(canvas, options?)` orchestrator that tries WebGPU → WebGL2 → `null`
- Colors derived from CSS custom properties (`--bg`, `--accent`, `--accent-strong`) at init time
- Canvas resizes with viewport via ResizeObserver
- `requestAnimationFrame` render loop that is stoppable (`pause`/`destroy`)
- Demo page at `/shader-demo/` proving the engine renders visually
- `pnpm check` (Astro strict TS) passes with all new modules
- No third-party shader library (D023)

## Proof Level

- This slice proves: contract (the engine API and both renderers work standalone)
- Real runtime required: yes (browser must render the shader on a canvas)
- Human/UAT required: yes (visual quality of the dither effect is subjective — needs a human look)

## Verification

- `pnpm check` — all new TypeScript compiles cleanly under Astro strict mode
- `pnpm build` — static build succeeds with the demo page included
- Dev server at `localhost:4321/shader-demo/` shows animated dither filling viewport
- Both renderers produce visible dither (verify WebGL2 by forcing fallback: the orchestrator logs which renderer was selected to the console)

## Observability / Diagnostics

- Runtime signals: `console.info('[shader] using <webgpu|webgl2>')` on successful init; `console.warn('[shader] ...')` on fallback or failure with reason
- Inspection surfaces: demo page at `/shader-demo/` with `<canvas data-shader-renderer="webgpu|webgl2|none">` attribute reflecting active renderer
- Failure visibility: `initDitherShader` returns `null` on total failure; console warnings identify which step failed (adapter null, device null, context lost, no webgl2)
- Redaction constraints: none — no secrets or PII

## Integration Closure

- Upstream surfaces consumed: CSS custom properties from `src/styles/global.css` (`--bg`, `--accent`, `--accent-strong`)
- New wiring introduced in this slice: demo page imports `initDitherShader` via a client-side `<script>` — this is a standalone proof, not the real site integration
- What remains before the milestone is truly usable end-to-end: S02 integrates into `BaseLayout.astro` with cursor tracking and per-page opt-out; S03 adds `prefers-reduced-motion`, tab-hidden pause, browser tests, and `validate:site` regression proof

## Tasks

- [x] **T01: Shared types, constants, and WebGPU renderer** `est:1h`
  - Why: Establishes the Renderer/ShaderInstance interfaces and the primary WebGPU code path with the WGSL dither shader — the foundation everything else builds on
  - Files: `src/lib/shader/types.ts`, `src/lib/shader/webgpu-renderer.ts`, `package.json`, `tsconfig.json`
  - Do: Install `@webgpu/types`; create `types.ts` with `Renderer`, `ShaderInstance`, `ShaderOptions` interfaces and Bayer 8×8 matrix constant; create `webgpu-renderer.ts` with WGSL fragment shader (fullscreen quad via `vertex_index`, Bayer dithering on animated sine blobs, palette uniforms), uniform buffer setup, render loop, resize handling, and explicit null checks on adapter/device
  - Verify: `pnpm check` passes; manual import of types in a scratch file resolves correctly
  - Done when: `types.ts` exports all interfaces per boundary map; `webgpu-renderer.ts` implements the full `Renderer` interface and compiles cleanly

- [x] **T02: WebGL2 fallback renderer** `est:45m`
  - Why: Covers browsers without WebGPU (~25% of traffic) with the same dither algorithm in GLSL, fulfilling the fallback requirement (R405)
  - Files: `src/lib/shader/webgl2-renderer.ts`
  - Do: Create `webgl2-renderer.ts` implementing the same `Renderer` interface; port WGSL dither math to GLSL 300 es (same Bayer matrix, same sine blob generation, same palette mapping); use `gl.uniform*` for uniforms; handle context creation failure and `webglcontextlost` cleanup; use a two-triangle fullscreen quad VAO
  - Verify: `pnpm check` passes; module exports match `Renderer` interface
  - Done when: `webgl2-renderer.ts` compiles cleanly and implements the identical dither algorithm as the WebGPU renderer

- [x] **T03: Orchestrator, demo page, and visual verification** `est:1h`
  - Why: Wires the renderers into the public `initDitherShader` API, adds a demo page for visual proof, and verifies the full engine works end-to-end in a real browser — this is where the slice demo becomes true
  - Files: `src/lib/shader/dither-shader.ts`, `src/pages/shader-demo/index.astro`
  - Do: Create `dither-shader.ts` that detects GPU capability (WebGPU → WebGL2 → null), picks renderer, wraps it in `ShaderInstance` with `destroy`/`setPointer`/`pause`/`resume`, manages rAF loop and ResizeObserver, reads CSS custom properties via `getComputedStyle`, logs renderer selection to console; create demo page that renders a fullscreen `<canvas>` and calls `initDitherShader` in a client script; set `data-shader-renderer` attribute on canvas; verify visually that the dither renders and animates
  - Verify: `pnpm check` && `pnpm build` pass; open `localhost:4321/shader-demo/` in browser — animated dither pattern visible; console shows `[shader] using webgpu` or `[shader] using webgl2`; canvas has `data-shader-renderer` attribute
  - Done when: Demo page shows animated faded dither pattern; both `pnpm check` and `pnpm build` succeed; `initDitherShader` returns a working `ShaderInstance` with all lifecycle methods

## Files Likely Touched

- `src/lib/shader/types.ts`
- `src/lib/shader/webgpu-renderer.ts`
- `src/lib/shader/webgl2-renderer.ts`
- `src/lib/shader/dither-shader.ts`
- `src/pages/shader-demo/index.astro`
- `package.json`
- `tsconfig.json`
