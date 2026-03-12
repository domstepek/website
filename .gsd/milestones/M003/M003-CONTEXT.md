# M003: GPU Shader Background — Context

**Gathered:** 2026-03-12
**Status:** Ready for planning

## Project Description

Add a custom GPU-accelerated faded dither shader as an ambient, cursor-reactive background effect across all pages of the personal website. The shader is inspired by the "Faded Dither" presets on shaders.com but is built entirely from scratch using WebGPU (WGSL) with a WebGL2 (GLSL) fallback — no third-party shader library.

## Why This Milestone

The site already has a dark retro terminal aesthetic (D005) with a CRT overlay, Space Mono typography, and muted green accents. A subtle animated dither shader behind page content reinforces this identity with genuine technical craft — a GPU-rendered effect that feels handmade rather than template-driven. It differentiates the site from typical portfolio builds.

## User-Visible Outcome

### When this milestone is complete, the user can:

- Visit any page and see an animated faded dither pattern as the page background, with soft color blobs dissolving through an ordered dither grid
- Move their cursor and see the dither pattern respond subtly to pointer position
- Visit on any modern browser and see the effect (WebGPU or WebGL2), or see the plain dark background on unsupported browsers with no breakage

### Entry point / environment

- Entry point: Any page URL (homepage, about, resume, domains, notes)
- Environment: Browser (GitHub Pages static site)
- Live dependencies involved: None — pure client-side GPU rendering

## Completion Class

- Contract complete means: Shader canvas renders, animates, and responds to cursor; per-page opt-out works; fallback degrades gracefully
- Integration complete means: Shader is wired into BaseLayout.astro and coexists with CRT overlay, gate shell, unlock flow, and all existing interactive behavior
- Operational complete means: None — static site, no server lifecycle

## Final Integrated Acceptance

To call this milestone complete, we must prove:

- The shader renders and animates on the homepage, a public page, and a protected domain page without breaking any existing functionality
- Cursor movement visibly affects the shader pattern
- The full `pnpm validate:site` suite passes (20 browser tests + 3 dist validators)
- A page with `disableShader` prop shows no shader canvas
- When WebGPU and WebGL2 are both unavailable, the page renders normally with the plain dark background

## Risks and Unknowns

- WebGPU API surface in browsers — WebGPU is relatively new; adapter/device acquisition can fail silently or with opaque errors on some hardware
- WebGL2 shader parity — the visual effect must look comparable between WGSL (WebGPU) and GLSL (WebGL2) renderers; Bayer dither and noise math ports cleanly but color behavior may differ
- Canvas z-ordering with existing DOM — the shader canvas must layer behind all content including the CRT overlay, gate shell, and blur/reveal layers without z-index conflicts
- Performance on low-end hardware — GPU shaders on portfolio visitors' machines (potentially older laptops) need to be efficient; the dither pattern should be cheap to compute

## Existing Codebase / Prior Art

- `src/components/layout/BaseLayout.astro` — the shared layout where the shader canvas will be injected
- `src/styles/global.css` — CSS variables for colors (`--bg`, `--accent`, `--accent-strong`, etc.) and the CRT overlay (`.crt-overlay`)
- `src/components/domains/DomainGateShell.astro` — the gate shell that must layer above the shader
- `src/components/domains/domain-gate-client.ts` — client-side unlock logic that must not conflict with shader initialization
- `src/components/home/HomePage.astro` — the homepage hero where the shader will be most prominent

> See `.gsd/DECISIONS.md` for all architectural and pattern decisions — it is an append-only register; read it during planning, append to it during execution.

## Relevant Requirements

- R401 — Custom faded dither shader renders as ambient background (primary goal)
- R402 — Shader uses site accent color palette
- R403 — Shader reacts to cursor movement
- R404 — Shader on all pages with per-page opt-out
- R405 — WebGPU + WebGL2 fallback + graceful degradation
- R406 — No performance or accessibility degradation
- R407 — Existing test suite continues to pass

## Scope

### In Scope

- Custom WebGPU shader with WGSL fragment shader implementing animated faded dither
- WebGL2 fallback with equivalent GLSL fragment shader
- Cursor position uniform for interactive reactivity
- Integration into BaseLayout.astro with per-page opt-out prop
- Color palette derived from CSS custom properties
- `prefers-reduced-motion` support
- Tab visibility pause/resume
- Coexistence with CRT overlay and gate/unlock DOM layers

### Out of Scope / Non-Goals

- Using the `shaders` npm package or any third-party shader library
- Adding React, Svelte, or any framework integration to Astro
- Audio-reactive or webcam-reactive effects
- Mobile-specific touch gestures beyond basic touch-as-cursor mapping
- Shader editor or runtime parameter tweaking UI

## Technical Constraints

- Static Astro site — all shader code must be client-side JavaScript + GPU shader code
- No framework integration — shader initialization is vanilla TypeScript wired via Astro's client-side script mechanism
- GitHub Pages hosting — no server-side processing
- Must not increase initial page load weight significantly (shader code is small, but canvas setup has a cost)

## Integration Points

- `BaseLayout.astro` — shader canvas injection point and opt-out prop
- `.crt-overlay` — must layer above the shader canvas
- `data-gate-state`, `data-visual-state` DOM markers — shader must not interfere with these
- `pnpm validate:site` — must pass after integration

## Open Questions

- Exact dither grid density and blob animation speed — will tune visually during S01 implementation
- Whether touch events should map to cursor position or just fall back to ambient — decided: map touch to cursor position for consistency
