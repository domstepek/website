# S01: Faded Dither Shader Engine — Research

**Date:** 2026-03-12

## Summary

S01 owns R401 (custom faded dither shader as ambient background), R402 (site accent color palette), and R405 (WebGPU + WebGL2 fallback + graceful degradation). The slice produces a standalone shader engine — four TypeScript modules that render an animated faded dither pattern on a canvas, ready for S02 to integrate into `BaseLayout.astro`.

The primary technical approach is a **fullscreen-quad fragment shader** running on WebGPU (WGSL) with a WebGL2 (GLSL) fallback. The shader math — Bayer ordered dithering applied to animated gradient blobs — is identical across both renderers; only the shading language and API plumbing differ. A thin orchestrator (`dither-shader.ts`) detects GPU capability, picks the renderer, and exposes a `ShaderInstance` interface for lifecycle control.

The main risks are WebGPU adapter/device acquisition failures (some drivers return `null` silently) and ensuring visual parity between the two renderers. Both are directly addressable in this slice.

## Recommendation

Build three layers:

1. **Shader math** — Bayer 8×8 ordered dither threshold matrix, animated gradient blob generation using layered sine waves, color palette mapping from CSS custom properties to uniform vec3s. This math is the same in WGSL and GLSL.

2. **Two renderers** — `webgpu-renderer.ts` and `webgl2-renderer.ts`, each implementing the same `Renderer` interface (`init`, `render`, `resize`, `destroy`). The WebGPU renderer uses a fullscreen quad via `vertex_index` (no vertex buffer), a uniform buffer for `time`, `resolution`, `pointer`, and `colors`. The WebGL2 renderer uses the same uniforms via `gl.uniform*`.

3. **Orchestrator** — `dither-shader.ts` tries WebGPU first (with explicit null checks on adapter and device), falls back to WebGL2 (`canvas.getContext('webgl2')`), and returns `null` if neither works. Exposes `ShaderInstance` with `destroy()`, `setPointer(x, y)`, `pause()`, `resume()`.

Use `requestAnimationFrame` for the render loop. The canvas element is created by the caller (S02) — S01 just receives it.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Bayer dither matrix | Hardcode the classic 8×8 matrix as a constant | It's 64 floats — no library needed, and the values are well-known |
| WebGPU types | `@webgpu/types` npm package | Provides `GPUDevice`, `GPUAdapter`, etc. for TypeScript — Astro's strict tsconfig needs these |

## Existing Code and Patterns

- `src/components/layout/BaseLayout.astro` — S02's integration point. Body structure: `.site-shell` (header/main/footer) → `.crt-overlay`. The shader canvas must sit before `.site-shell` in DOM order or use `z-index: -1` to layer behind everything.
- `src/styles/global.css` — CSS custom properties define the palette: `--bg: #0a0a0a`, `--bg-elevated: #141414`, `--accent: #6fba7f`, `--accent-strong: #7fd48f`. The CRT overlay is `z-index: 9999`, screenshot gallery is `z-index: 10000`, lightbox is `z-index: 10000`, skip-link is `z-index: 1000`.
- `src/lib/paths.ts` — only existing lib module. S01 creates `src/lib/shader/` as a new namespace.
- `astro.config.mjs` — static output mode, no SSR. All shader code must be client-side.
- `tsconfig.json` — extends `astro/tsconfigs/strict`. WebGPU types need `@webgpu/types` as a devDependency and a types reference in the shader files or tsconfig.

## Constraints

- **No third-party shader library** (D023, R304) — all shader code is hand-written WGSL + GLSL.
- **Static Astro site** — no server-side processing; shader init is purely client-side JS.
- **TypeScript strict mode** — `astro/tsconfigs/strict` extends strict TS; WebGPU API needs `@webgpu/types` for type safety since `navigator.gpu` isn't in standard lib.
- **Canvas must not block interaction** — `pointer-events: none` on the shader canvas, or it will eat clicks.
- **Colors from CSS custom properties** — read at init time via `getComputedStyle`, not hardcoded. This keeps the shader cohesive with the site identity (D025).
- **S01 boundary** — this slice produces the engine only. No BaseLayout integration, no cursor tracking wiring, no `prefers-reduced-motion`. S02 and S03 handle those.

## Common Pitfalls

- **WebGPU adapter returns null** — `navigator.gpu.requestAdapter()` can return `null` on unsupported hardware or headless contexts. Must check explicitly before calling `requestDevice()`. Some browsers also gate WebGPU behind flags.
- **Canvas resize without observer** — if the canvas doesn't match viewport size, the shader looks blurry or misaligned. Use a `ResizeObserver` on the canvas (or listen to `resize` events) and update both `canvas.width/height` and the resolution uniform.
- **WebGL2 context loss** — `webgl2` contexts can be lost. Listen for `webglcontextlost` and `webglcontextrestored` events. For S01, just clean up on loss; restoration is a stretch goal.
- **requestAnimationFrame leak** — the render loop must be stoppable. Store the rAF ID and cancel it in `destroy()` and `pause()`.
- **Color space mismatch** — WebGPU defaults to `srgb` canvas format on most systems (`bgra8unorm`). WebGL2 also outputs sRGB. The Bayer math operates in linear space, so convert palette colors from sRGB hex to linear RGB in the shader or at uniform-upload time. If both renderers do the same conversion, visual parity is maintained.
- **Fullscreen quad via vertex_index** — in WebGPU/WGSL, generate a fullscreen triangle (3 vertices, not 6) from `vertex_index` without a vertex buffer. This is the standard pattern: `let pos = array(vec2f(-1,-1), vec2f(3,-1), vec2f(-1,3)); output.position = vec4f(pos[vertex_index], 0, 1);`. In WebGL2, use a simple two-triangle quad VAO.

## Open Risks

- **`@webgpu/types` compatibility with Astro 5** — need to verify the types package works with Astro's TS setup. Fallback: use `// @ts-ignore` or a local `.d.ts` ambient declaration for `navigator.gpu`.
- **Visual tuning** — the exact dither density, blob animation speed, and color intensity are subjective. The roadmap acknowledges this will be tuned visually during S01. Plan for iteration.
- **WebGPU in Puppeteer** — the existing test suite uses Puppeteer. WebGPU may not be available in Puppeteer's headless Chrome. S01 doesn't add tests (that's S03), but this is a forward risk for later slices. The shader's graceful degradation means tests should still pass — the canvas just won't render.

## Shader Architecture Detail

### Uniform Buffer Layout

```
struct Uniforms {
  time: f32,           // elapsed seconds
  resolution: vec2f,   // canvas width, height in pixels
  pointer: vec2f,      // normalized pointer position (0-1), or (-1,-1) if no pointer
  color_bg: vec3f,     // background color (linear RGB)
  color_accent: vec3f, // accent color (linear RGB)
  color_strong: vec3f, // strong accent color (linear RGB)
}
```

Total: ~56 bytes, fits in a single uniform buffer. Updated every frame for `time`; `pointer` updated on S02 pointer events; colors set once at init.

### Dither Algorithm

1. Generate smooth gradient blobs: layered sine/cosine functions of `(uv, time)` producing a 0–1 luminance field
2. Apply Bayer 8×8 ordered dithering: compare luminance against threshold matrix value at `(fragCoord % 8)`
3. Map dither result to palette: below threshold → `color_bg`, above → mix of `color_accent` and `color_strong` based on luminance
4. The result is a retro, stippled pattern where blobs dissolve through the dither grid

### File Structure (S01 output)

```
src/lib/shader/
  types.ts              — ShaderInstance, ShaderOptions, Renderer interfaces
  dither-shader.ts      — orchestrator: detect GPU, pick renderer, expose ShaderInstance
  webgpu-renderer.ts    — WebGPU implementation (WGSL shader embedded as string)
  webgl2-renderer.ts    — WebGL2 implementation (GLSL shader embedded as string)
```

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| GLSL shaders | `martinholovsky/claude-skills-generator@glsl` | available (98 installs) |
| WebGL | `martinholovsky/claude-skills-generator@webgl` | available (155 installs) |
| WebGL | `ronnycoding/.claude@webgl-expert` | available (50 installs) |
| Three.js shaders | `cloudai-x/threejs-skills@threejs-shaders` | available (1.7K installs) — not directly relevant (Three.js not used) |

The GLSL and WebGL skills could help with shader authoring quality. The Three.js skills are not relevant since this is a raw WebGPU/WebGL2 implementation.

## Sources

- WebGPU adapter/device acquisition pattern with null checks and feature detection (source: [WebGPU spec — compatibility mode proposal](https://github.com/gpuweb/gpuweb/blob/main/proposals/compatibility-mode.md))
- Fullscreen quad rendering with `vertex_index`, uniform buffer creation, and `requestAnimationFrame` render loop (source: [WebGPU Fundamentals](https://webgpufundamentals.org/))
- WGSL shader module creation with compilation error checking (source: [WebGPU spec](https://context7.com/gpuweb/gpuweb))
- Render pipeline configuration, command encoding, and texture view submission (source: [WebGPU spec](https://context7.com/gpuweb/gpuweb))
- Bayer ordered dither matrix values and algorithm — well-established computer graphics technique, no single source
