---
estimated_steps: 5
estimated_files: 4
---

# T01: Shared types, constants, and WebGPU renderer

**Slice:** S01 — Faded Dither Shader Engine
**Milestone:** M003

## Description

Establish the shared TypeScript interfaces (`Renderer`, `ShaderInstance`, `ShaderOptions`) and the Bayer 8×8 dither matrix constant, then implement the primary WebGPU renderer with a WGSL fragment shader. This is the foundation — T02 and T03 build directly on these types and patterns.

## Steps

1. Install `@webgpu/types` as a devDependency and add a `/// <reference types="@webgpu/types" />` directive (or update tsconfig) so `navigator.gpu` resolves in strict mode
2. Create `src/lib/shader/types.ts`:
   - `ShaderOptions` interface: optional color overrides, optional canvas
   - `ShaderInstance` interface: `destroy()`, `setPointer(x: number, y: number)`, `pause()`, `resume()`
   - `Renderer` interface (internal): `init(canvas: HTMLCanvasElement, colors: ShaderColors): Promise<boolean>`, `render(time: number, pointer: [number, number]): void`, `resize(width: number, height: number): void`, `destroy(): void`
   - `ShaderColors` interface: `bg: [number, number, number]`, `accent: [number, number, number]`, `strong: [number, number, number]` (linear RGB)
   - Export the Bayer 8×8 ordered dither threshold matrix as a `Float32Array` constant (64 values, normalized 0–1)
   - Export an `srgbToLinear(hex: string): [number, number, number]` utility for color conversion
3. Create `src/lib/shader/webgpu-renderer.ts`:
   - Implement the `Renderer` interface
   - `init`: request adapter (null check), request device (null check), configure canvas context with `bgra8unorm`, create shader module with WGSL code (compilation error check), create render pipeline (fullscreen triangle via `vertex_index`), create uniform buffer (~64 bytes for time, resolution, pointer, 3 palette colors)
   - WGSL fragment shader: generate smooth gradient blobs from layered sine/cosine of `(uv, time)`, apply Bayer 8×8 ordered dithering (compare luminance against threshold at `fragCoord % 8`), map result to palette colors
   - `render`: write uniform buffer with current time and pointer, begin render pass, draw 3 vertices, submit
   - `resize`: reconfigure canvas context, update resolution uniform
   - `destroy`: destroy device, release resources
4. Verify `pnpm check` passes with all new files
5. Verify types are importable: create a minimal test import in the dev console or a scratch assertion

## Must-Haves

- [ ] `ShaderInstance` interface matches boundary map: `destroy()`, `setPointer(x, y)`, `pause()`, `resume()`
- [ ] `Renderer` interface is generic enough for both WebGPU and WebGL2
- [ ] Bayer 8×8 matrix is the classic normalized threshold values
- [ ] WebGPU renderer null-checks adapter and device before proceeding
- [ ] WGSL shader produces animated dither pattern (not just a static screen)
- [ ] `srgbToLinear` correctly converts hex sRGB to linear RGB for uniform upload
- [ ] All files pass `pnpm check` under Astro strict tsconfig

## Verification

- `pnpm check` passes with zero errors
- `types.ts` exports: `ShaderInstance`, `ShaderOptions`, `ShaderColors`, `Renderer`, `BAYER_8X8`, `srgbToLinear`
- `webgpu-renderer.ts` exports a class/function implementing `Renderer` that compiles cleanly

## Observability Impact

- Signals added/changed: None yet — renderer logs are added in T03's orchestrator
- How a future agent inspects this: Read the exported interfaces in `types.ts`; the boundary contract is the type signatures
- Failure state exposed: WebGPU `init` returns `false` if adapter/device/context acquisition fails

## Inputs

- S01-RESEARCH.md — shader architecture detail, uniform buffer layout, dither algorithm, fullscreen quad pattern
- `src/styles/global.css` — CSS custom property names for palette colors
- D023 — no third-party shader library
- D025 — colors from CSS custom properties

## Expected Output

- `src/lib/shader/types.ts` — all shared interfaces, Bayer matrix, color utility
- `src/lib/shader/webgpu-renderer.ts` — complete WebGPU renderer with WGSL dither shader
- `package.json` — `@webgpu/types` added to devDependencies
