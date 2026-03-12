---
estimated_steps: 3
estimated_files: 1
---

# T02: WebGL2 fallback renderer

**Slice:** S01 — Faded Dither Shader Engine
**Milestone:** M003

## Description

Implement the WebGL2 fallback renderer using the same `Renderer` interface from T01. The GLSL 300 es fragment shader reproduces the identical Bayer dither algorithm from the WGSL version — same sine blob generation, same threshold comparison, same palette mapping — ensuring visual parity between renderers. This fulfills the fallback path of R405.

## Steps

1. Create `src/lib/shader/webgl2-renderer.ts` implementing the `Renderer` interface:
   - `init`: call `canvas.getContext('webgl2')` (null check on failure), compile vertex shader (fullscreen quad via two triangles with a static VAO), compile fragment shader (GLSL 300 es), link program, create uniform locations for `u_time`, `u_resolution`, `u_pointer`, `u_color_bg`, `u_color_accent`, `u_color_strong`, upload Bayer matrix as a uniform or hardcode in shader
   - GLSL fragment shader: identical dither math to WGSL — layered sine/cosine blobs producing 0–1 luminance, Bayer 8×8 threshold comparison at `gl_FragCoord.xy mod 8`, palette color mapping
   - `render`: set uniforms via `gl.uniform1f` / `gl.uniform2f` / `gl.uniform3f`, draw the quad
   - `resize`: update viewport via `gl.viewport`, update resolution uniform
   - `destroy`: delete program, buffers, VAO; lose context if possible
2. Add `webglcontextlost` event listener that calls `destroy` cleanup (context restoration is a stretch goal — just clean up on loss)
3. Verify `pnpm check` passes; confirm the module exports match the `Renderer` interface

## Must-Haves

- [ ] Implements the same `Renderer` interface as WebGPU renderer
- [ ] GLSL dither algorithm is mathematically identical to WGSL version (same Bayer matrix, same blob functions, same palette mapping)
- [ ] Handles `getContext('webgl2')` returning null gracefully (init returns false)
- [ ] Handles `webglcontextlost` event with cleanup
- [ ] Fullscreen quad renders via a two-triangle VAO (no vertex buffer complexity)
- [ ] Passes `pnpm check`

## Verification

- `pnpm check` passes with zero errors
- `webgl2-renderer.ts` exports a class/function implementing `Renderer`
- GLSL shader source in the file uses the same mathematical operations as the WGSL shader in `webgpu-renderer.ts` (reviewable by reading both)

## Observability Impact

- Signals added/changed: None — renderer logs are added in T03's orchestrator
- How a future agent inspects this: Compare GLSL and WGSL shader source strings side-by-side in the two renderer files
- Failure state exposed: WebGL2 `init` returns `false` if context creation fails; `webglcontextlost` triggers cleanup

## Inputs

- `src/lib/shader/types.ts` — `Renderer`, `ShaderColors`, `BAYER_8X8` from T01
- `src/lib/shader/webgpu-renderer.ts` — WGSL shader to port (the dither algorithm is the reference implementation)
- S01-RESEARCH.md — WebGL2 fullscreen quad pattern, context loss handling

## Expected Output

- `src/lib/shader/webgl2-renderer.ts` — complete WebGL2 renderer with GLSL dither shader, visual parity with WebGPU version
