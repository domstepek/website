---
id: T01
parent: S01
milestone: M003
provides:
  - ShaderInstance, ShaderOptions, ShaderColors, Renderer interfaces
  - Bayer 8×8 ordered dither threshold matrix (BAYER_8X8)
  - srgbToLinear hex-to-linear-RGB utility
  - WebGPU renderer with WGSL animated dither shader
key_files:
  - src/lib/shader/types.ts
  - src/lib/shader/webgpu-renderer.ts
  - tsconfig.json
key_decisions:
  - WebGPU types added globally via tsconfig types array (not per-file triple-slash directives)
  - Uniform buffer layout: 80 bytes, std140-aligned with explicit padding for vec3→vec4 alignment
  - Bayer matrix duplicated in WGSL as const array (GPU-side) and in types.ts as Float32Array (JS-side, for WebGL2 in T02)
patterns_established:
  - Renderer interface pattern: init(canvas, colors) → Promise<boolean>, render(time, pointer), resize(w, h), destroy()
  - Fullscreen triangle via vertex_index (3 verts, no vertex buffer)
  - Color conversion at uniform upload time (sRGB hex → linear RGB), not in shader
observability_surfaces:
  - WebGPU init returns false on adapter/device/context/compilation failure
  - WGSL compilation errors logged to console via getCompilationInfo()
  - Device loss logged via device.lost promise
duration: 15m
verification_result: passed
completed_at: 2026-03-12
blocker_discovered: false
---

# T01: Shared types, constants, and WebGPU renderer

**Established the shader engine type system, Bayer dither matrix, sRGB-to-linear utility, and complete WebGPU renderer with animated WGSL dither shader.**

## What Happened

Created `src/lib/shader/types.ts` with all shared interfaces (`ShaderInstance`, `ShaderOptions`, `ShaderColors`, `Renderer`), the classic Bayer 8×8 ordered dither threshold matrix as a normalized `Float32Array`, and an `srgbToLinear` utility that converts hex sRGB strings to linear RGB triplets using the standard transfer function.

Created `src/lib/shader/webgpu-renderer.ts` implementing the `Renderer` interface with:
- Adapter/device/context acquisition with explicit null checks at each step
- WGSL shader module with compilation error checking via `getCompilationInfo()`
- Fullscreen triangle rendering via `vertex_index` (no vertex buffer)
- 80-byte uniform buffer (std140-aligned) carrying time, resolution, pointer, and 3 palette colors
- Fragment shader generating animated gradient blobs from layered sine/cosine waves, applying Bayer 8×8 ordered dithering, and mapping results to the 3-color palette
- Pointer influence (gentle radial brightening near cursor position)
- Device loss handling via `device.lost` promise
- Clean resource teardown in `destroy()`

Installed `@webgpu/types` as devDependency and added it to tsconfig `types` array for project-wide WebGPU type support.

## Verification

- `pnpm check`: 0 errors, 0 warnings (3 pre-existing hints from other files)
- `types.ts` exports verified via tsx: `BAYER_8X8` (64 elements), `srgbToLinear` (correct conversions for #0a0a0a → near-zero, #6fba7f → correct linear values, #fff → [1,1,1])
- `webgpu-renderer.ts` exports `WebGPURenderer` class implementing full `Renderer` interface

## Diagnostics

- Read `src/lib/shader/types.ts` for the boundary contract (type signatures)
- WebGPU `init()` returns `false` if adapter, device, context, or shader compilation fails
- WGSL compilation errors are logged to console with message type and content
- Device loss is caught and logged via `device.lost` promise

## Deviations

- Added `@webgpu/types` to tsconfig `types` array instead of per-file `/// <reference>` directives — cleaner for a multi-file shader module
- Uniform buffer is 80 bytes (not ~64 as estimated in plan) due to std140 vec3→vec4 alignment padding

## Known Issues

None.

## Files Created/Modified

- `src/lib/shader/types.ts` — created: all shared interfaces, Bayer 8×8 matrix, srgbToLinear utility
- `src/lib/shader/webgpu-renderer.ts` — created: complete WebGPU renderer with WGSL animated dither shader
- `tsconfig.json` — modified: added `@webgpu/types` to compilerOptions.types
- `package.json` — modified: `@webgpu/types` added to devDependencies

## Slice-Level Verification Status

- [x] `pnpm check` — passes with 0 errors
- [ ] `pnpm build` — not yet tested (demo page not created until T03)
- [ ] Dev server at `localhost:4321/shader-demo/` — demo page is T03 scope
- [ ] Both renderers produce visible dither — WebGL2 renderer is T02 scope
