---
id: M003
title: GPU Shader Background
status: complete
slices_completed: 3
total_tests: 23
completed_at: 2026-03-12
---

# M003: GPU Shader Background

**Custom WebGPU/WebGL2 faded dither shader renders as an ambient, cursor-reactive background across all pages with per-page opt-out, reduced-motion freeze, tab-visibility pause, and 23-test regression coverage.**

## What Was Built

- **S01:** Standalone shader engine with WebGPU (WGSL) and WebGL2 (GLSL) renderers producing animated Bayer 8×8 ordered dither with 3-color palette from CSS variables. Public API: `initDitherShader(canvas, options?) → ShaderInstance | null`.
- **S02:** `ShaderBackground.astro` component integrated into `BaseLayout.astro` with `disableShader` prop. Canvas positioned as first child of body at z-index -1. Cursor tracking via `pointermove` feeding `setPointer(x, y)`.
- **S03:** `prefers-reduced-motion` freeze, tab `visibilitychange` pause/resume, 3 browser contract tests, and `validate:site` updated to 23 total tests.

## Key Files

- `src/lib/shader/types.ts` — interfaces, Bayer matrix, srgbToLinear
- `src/lib/shader/webgpu-renderer.ts` — WebGPU WGSL renderer
- `src/lib/shader/webgl2-renderer.ts` — WebGL2 GLSL fallback
- `src/lib/shader/dither-shader.ts` — orchestrator with detection chain
- `src/components/shader/ShaderBackground.astro` — fullscreen canvas component
- `src/components/layout/BaseLayout.astro` — disableShader integration
- `tests/shader-presence.browser.test.mjs` — shader contract tests

## Requirements Validated

- R401: Custom faded dither shader renders as ambient background
- R402: Shader uses site accent color palette from CSS vars
- R403: Shader reacts to cursor movement
- R404: Shader on all pages with per-page opt-out via disableShader
- R405: WebGPU primary with WebGL2 fallback, graceful degradation
- R406: prefers-reduced-motion, tab-pause, pointer-events:none, aria-hidden
- R407: Full validate:site passes (23 tests)
