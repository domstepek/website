---
id: S02
milestone: M003
status: ready
---

# S02: Site integration and cursor reactivity — Context

## Goal

Wire the S01 shader engine into BaseLayout.astro so every page shows the dither background behind all content, cursor movement softly influences the pattern, individual pages can opt out via a layout prop, and the shader coexists with the CRT overlay and gate/unlock layers without z-index conflicts.

## Why this Slice

S01 proves the shader renders on an isolated canvas. S02 is the integration risk — layering it behind the full site DOM (header, content, CRT overlay, gate shell, lightbox, blur/reveal) without breaking any existing behavior. Until this works, the shader is a standalone demo, not a site feature. S03 depends on this for polish and regression testing.

## Scope

### In Scope

- `ShaderBackground.astro` component rendering a fixed, fullscreen canvas behind all content
- Integration into `BaseLayout.astro` with a `disableShader` prop (boolean, defaults to enabled)
- Canvas z-index below all existing layers (site content z-index 1, CRT overlay 9999, gate/lightbox 10000)
- Cursor tracking via `pointermove` on `document` or `window`, feeding `setPointer(x, y)` with normalized coordinates
- Touch-as-cursor mapping via `touchmove` for mobile devices
- Soft cursor influence — pointer acts as a gentle gravity well / attractor affecting blob drift, not a ripple or global tint shift
- Shader always visible, including behind the locked gate shell on protected domain pages
- Graceful degradation: if `initDitherShader` returns null, no canvas is shown and the plain `--bg` background remains
- Removing or keeping the `/shader-demo/` page from S01 (agent's discretion — it can stay as a dev tool)

### Out of Scope

- `prefers-reduced-motion` support (S03)
- Tab visibility pause/resume (S03)
- Browser tests for shader canvas presence or opt-out (S03)
- Performance profiling or frame budget optimization (S03)
- Any page actually using `disableShader` — the prop exists but no page sets it yet; it's forward-looking

## Constraints

- Canvas must layer behind **all** existing DOM: site-shell (z-index 1), CRT overlay (z-index 9999), gate shell and lightbox (z-index 10000)
- Shader initialization is vanilla TypeScript via Astro's `<script>` mechanism — no framework integration (D023)
- Must not interfere with `data-gate-state`, `data-visual-state`, or `data-route-visibility` DOM markers used by gate/unlock logic (D013, D015, D020)
- Must not block pointer events on content — canvas needs `pointer-events: none`
- Existing `pnpm validate:site` should still pass (formal regression proof is S03, but no new breakage allowed)

## Integration Points

### Consumes

- `src/lib/shader/dither-shader.ts` → `initDitherShader(canvas, options?)` — S01 output
- `src/lib/shader/types.ts` → `ShaderInstance` interface (`destroy`, `setPointer`, `pause`, `resume`) — S01 output
- `src/styles/global.css` → CSS custom properties `--bg`, `--accent`, `--accent-strong` for palette
- `src/components/layout/BaseLayout.astro` → existing layout structure (`.site-shell`, `.crt-overlay`)

### Produces

- `src/components/shader/ShaderBackground.astro` — Astro component: renders canvas, runs init script, wires cursor tracking
- `src/components/layout/BaseLayout.astro` — updated with `disableShader` prop and `ShaderBackground` integration
- Cursor/touch event listeners feeding `setPointer(x, y)` with normalized viewport coordinates

## Open Questions

- Exact z-index value for the shader canvas — needs to be below z-index 1 (site content); likely `z-index: -1` or `z-index: 0` with `position: fixed` — will determine during implementation based on stacking context behavior
- Whether cursor tracking should throttle/debounce pointermove events — likely unnecessary since `setPointer` just updates a uniform read once per frame, but worth checking if high-frequency events cause issues
