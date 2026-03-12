---
id: S01
milestone: M003
status: ready
---

# S01: Faded dither shader engine — Context

## Goal

Prove the dither shader engine renders an animated faded dither pattern on a standalone demo page, running on WebGPU or WebGL2, with graceful degradation when neither is available.

## Why this Slice

This is the highest-risk slice — GPU API acquisition, shader compilation, and visual parity between two renderers must all work before any site integration (S02) or polish (S03) can proceed. Isolating the engine on a dedicated demo page decouples rendering proof from DOM layering concerns.

## Scope

### In Scope

- Completing and verifying the existing shader engine code (`dither-shader.ts`, `webgpu-renderer.ts`, `webgl2-renderer.ts`, `types.ts`)
- WebGPU → WebGL2 → null detection chain with console logging per D028
- `data-shader-renderer` attribute on the canvas element per D028
- A dedicated `/shader-demo/` page as the standalone visual proof surface per D027
- Renderer info overlay on the demo page (which backend is active)
- ResizeObserver-based canvas sizing to fill viewport
- Animation loop with `requestAnimationFrame`
- Pointer position uniform wired (accepting `setPointer` calls, even if cursor tracking is S02 scope)

### Out of Scope

- Site integration into `BaseLayout.astro` (S02)
- Cursor/touch event tracking and wiring to `setPointer` (S02)
- Per-page opt-out prop (S02)
- CRT overlay coexistence and z-layering (S02)
- `prefers-reduced-motion` support (S03)
- Tab visibility pause/resume (S03)
- Browser tests for shader presence (S03)
- Performance profiling or optimization (S03)

## Constraints

- No third-party shader libraries — all GPU code is handwritten WGSL/GLSL (D023)
- Color palette derived from CSS custom properties `--bg`, `--accent`, `--accent-strong` (D025)
- Console logging contract: `[shader] using <renderer>` on success, `[shader] <reason>` on failure (D028)
- Canvas `data-shader-renderer` set to `'webgpu'`, `'webgl2'`, or `'none'` (D028)

## Visual Direction

- **Visibility:** In between subtle and prominent — noticeable atmospheric texture that doesn't compete with page content
- **Animation speed:** Gentle drift — like slow-moving clouds or ink diffusing, clearly animated but calm
- **Color tuning:** Start from CSS variable values, tune visually during implementation on the demo page
- **Style:** Faded dither — animated gradient blobs dissolving through Bayer ordered dithering grid (D024)

## Integration Points

### Consumes

- `src/styles/global.css` — CSS custom properties `--bg`, `--accent`, `--accent-strong` for palette resolution
- No upstream slice dependencies (first slice)

### Produces

- `src/lib/shader/dither-shader.ts` — `initDitherShader(canvas, options?)` → `ShaderInstance | null`
- `src/lib/shader/types.ts` — `ShaderInstance`, `ShaderOptions`, `ShaderColors`, `Renderer` interfaces; `BAYER_8X8` matrix; `srgbToLinear()` utility
- `src/lib/shader/webgpu-renderer.ts` — WebGPU renderer implementation
- `src/lib/shader/webgl2-renderer.ts` — WebGL2 fallback renderer implementation
- `src/pages/shader-demo.astro` — standalone demo page at `/shader-demo/`

## Open Questions

- Exact dither grid density and blob animation speed — will tune visually on the demo page during implementation
- Whether WebGPU and WebGL2 outputs are close enough visually — compare side-by-side on the demo page; minor differences are acceptable as long as the feel is consistent
