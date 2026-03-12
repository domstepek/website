---
estimated_steps: 5
estimated_files: 2
---

# T03: Orchestrator, demo page, and visual verification

**Slice:** S01 — Faded Dither Shader Engine
**Milestone:** M003

## Description

Wire the two renderers into the public `initDitherShader` API, create a demo page that exercises the engine on a real canvas, and verify end-to-end that the animated dither renders in a browser. This is the task that makes the slice demo true — after T03, opening `localhost:4321/shader-demo/` shows the faded dither pattern.

## Steps

1. Create `src/lib/shader/dither-shader.ts`:
   - Export `initDitherShader(canvas: HTMLCanvasElement, options?: ShaderOptions): Promise<ShaderInstance | null>`
   - Detection chain: check `navigator.gpu` → try WebGPU renderer init → if fails, try WebGL2 renderer init → if fails, return `null`
   - Read CSS custom properties via `getComputedStyle(document.documentElement)` for `--bg`, `--accent`, `--accent-strong`; convert to linear RGB using `srgbToLinear`; allow `ShaderOptions` color overrides
   - Wrap the active renderer in a `ShaderInstance`:
     - `pause()`: cancel rAF, set paused flag
     - `resume()`: restart rAF loop if paused
     - `destroy()`: cancel rAF, disconnect ResizeObserver, call renderer.destroy()
     - `setPointer(x, y)`: store normalized pointer coords for next frame
   - Set up `ResizeObserver` on canvas to keep `canvas.width`/`canvas.height` in sync with CSS size and call `renderer.resize()`
   - rAF render loop: call `renderer.render(elapsedSeconds, pointer)` each frame
   - Log `console.info('[shader] using webgpu')` or `'[shader] using webgl2'` on success; `console.warn('[shader] no gpu api available')` on total failure
   - Set `canvas.dataset.shaderRenderer` to `'webgpu'`, `'webgl2'`, or `'none'`
2. Create `src/pages/shader-demo/index.astro`:
   - Use `BaseLayout` with title "Shader Demo"
   - Render a `<canvas id="shader-canvas">` styled to fill the viewport (`position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: -1`)
   - Client-side `<script>`: import `initDitherShader`, call it on the canvas, store instance for cleanup
   - Add a small text overlay confirming "shader engine demo — check console for renderer info"
3. Run `pnpm check` and `pnpm build` — both must pass with the demo page included
4. Start dev server (`pnpm dev`), open `localhost:4321/shader-demo/` in a real browser, verify:
   - Animated dither pattern fills the viewport with green-tinted blobs
   - Console shows `[shader] using webgpu` or `[shader] using webgl2`
   - Canvas has `data-shader-renderer` attribute set
   - Resizing the browser window causes the pattern to adapt (ResizeObserver working)
5. Verify `pnpm build` still succeeds (no SSR references to `navigator`, `document`, etc. leaking into build)

## Must-Haves

- [ ] `initDitherShader` signature matches boundary map: `(canvas: HTMLCanvasElement, options?: ShaderOptions) => Promise<ShaderInstance | null>`
- [ ] Detection chain: WebGPU → WebGL2 → null (not the reverse, not either-or)
- [ ] Colors read from CSS custom properties at init time, converted to linear RGB
- [ ] ResizeObserver keeps canvas dimensions synced with viewport
- [ ] rAF loop is stoppable via `pause()` and `destroy()`
- [ ] Console logging identifies which renderer is active
- [ ] `data-shader-renderer` attribute on canvas reflects active renderer
- [ ] Demo page builds statically without SSR errors
- [ ] No `pointer-events` on the canvas (it must not eat clicks)
- [ ] `pnpm check` and `pnpm build` both pass

## Verification

- `pnpm check` passes
- `pnpm build` succeeds (demo page included in dist)
- `localhost:4321/shader-demo/` shows animated dither in browser
- Browser console shows `[shader] using webgpu` or `[shader] using webgl2`
- `document.querySelector('canvas').dataset.shaderRenderer` returns `'webgpu'` or `'webgl2'`

## Observability Impact

- Signals added/changed: `[shader] using <renderer>` info log; `[shader] <failure reason>` warning logs; `data-shader-renderer` DOM attribute
- How a future agent inspects this: Check `canvas[data-shader-renderer]` for current state; read browser console for init diagnostics
- Failure state exposed: `initDitherShader` returns `null`; console warnings trace exactly which init step failed; `data-shader-renderer="none"` on canvas

## Inputs

- `src/lib/shader/types.ts` — `ShaderInstance`, `ShaderOptions`, `ShaderColors`, `srgbToLinear` from T01
- `src/lib/shader/webgpu-renderer.ts` — WebGPU renderer from T01
- `src/lib/shader/webgl2-renderer.ts` — WebGL2 renderer from T02
- `src/components/layout/BaseLayout.astro` — layout for demo page
- `src/styles/global.css` — CSS custom properties for palette colors

## Expected Output

- `src/lib/shader/dither-shader.ts` — public orchestrator matching the boundary map API
- `src/pages/shader-demo/index.astro` — visual proof page showing the dither engine in action
