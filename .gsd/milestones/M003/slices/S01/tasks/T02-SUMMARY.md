---
id: T02
parent: S01
milestone: M003
provides:
  - WebGL2Renderer class implementing the Renderer interface with GLSL 300 es dither shader
key_files:
  - src/lib/shader/webgl2-renderer.ts
key_decisions:
  - Fullscreen quad uses gl_VertexID with 6 vertices (two triangles) in vertex shader — no vertex buffer needed, just an empty VAO
  - Bayer matrix hardcoded as GLSL const array (same values as WGSL) rather than uploaded as a uniform/texture
  - Context loss handled by calling destroy() on webglcontextlost event; context restoration is not attempted
  - WEBGL_lose_context extension used in destroy() to force resource cleanup
patterns_established:
  - WebGL2 uniform pattern: cached WebGLUniformLocation objects in a typed interface, set via gl.uniform*f calls in render()
observability_surfaces:
  - Console errors on shader compile failure with shader type and info log
  - Console errors on program link failure with info log
  - init() returns false on any failure (null context, compile error, link error, missing uniform)
duration: 10m
verification_result: passed
completed_at: 2026-03-12
blocker_discovered: false
---

# T02: WebGL2 fallback renderer

**Complete WebGL2 renderer with GLSL 300 es dither shader — identical Bayer 8×8 algorithm, blob field, and palette mapping to the WGSL version.**

## What Happened

Created `src/lib/shader/webgl2-renderer.ts` implementing the `Renderer` interface from T01. The GLSL 300 es fragment shader is a direct port of the WGSL shader: same three-layer sine/cosine blob field with identical constants (0.15, 0.25, 2.5, 1.3, 1.8, 3.1, 0.9, 2.2, 0.7, 1.7, 0.6), same pointer influence (smoothstep 0.35→0.0 with 0.4 multiplier), same Bayer 8×8 threshold comparison at `gl_FragCoord.xy mod 8`, and same accent/strong blend via `smoothstep(0.4, 0.85, lum)`. The vertex shader generates a fullscreen quad from two triangles using `gl_VertexID` with an empty VAO bound. Uniforms are set per-frame via `gl.uniform*f` calls with cached locations. Context loss triggers `destroy()` cleanup. All GPU resources (program, VAO) are deleted on destroy, and `WEBGL_lose_context` is used to force final resource release.

## Verification

- `pnpm check`: 0 errors, 0 warnings (3 pre-existing hints)
- Module exports `WebGL2Renderer` class implementing `Renderer` interface with all four methods (init, render, resize, destroy)
- GLSL shader math manually verified identical to WGSL shader in webgpu-renderer.ts

## Diagnostics

- Compare GLSL fragment shader source in `webgl2-renderer.ts` against WGSL shader in `webgpu-renderer.ts` for visual parity verification
- Shader compile/link errors logged to console with `[shader/webgl2]` prefix
- `init()` returns `false` if: getContext('webgl2') returns null, shader compilation fails, program linking fails, or uniform locations are missing
- `webglcontextlost` event triggers full cleanup via destroy()

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `src/lib/shader/webgl2-renderer.ts` — Complete WebGL2 renderer with GLSL 300 es dither shader, fullscreen quad via empty VAO, cached uniform locations, and context loss handling
