# S01: Faded Dither Shader Engine — UAT

**Milestone:** M003
**Written:** 2026-03-12

## UAT Type

- UAT mode: mixed (artifact-driven + human-experience)
- Why this mode is sufficient: `pnpm check` and `pnpm build` verify type correctness and build inclusion (artifact-driven), but the dither visual quality is inherently subjective and requires a human looking at the rendered canvas in a real GPU-enabled browser (human-experience).

## Preconditions

- Dev server running: `pnpm dev` at `localhost:4321`
- A real browser with GPU support (not headless Chromium — headless doesn't render GPU pixels)
- Internet connection not required (all assets are local)

## Smoke Test

Open `http://localhost:4321/shader-demo/` in a browser — you should see an animated dither pattern filling the viewport with soft green-tinted blobs dissolving through a grid pattern.

## Test Cases

### 1. Shader renders and animates

1. Open `http://localhost:4321/shader-demo/` in Chrome/Edge/Firefox
2. Observe the canvas fills the entire viewport
3. **Expected:** An animated pattern of soft green/dark blobs with visible dithering (grid-like pixel pattern) — the blobs should visibly shift and morph over time

### 2. Renderer identification

1. Open browser DevTools console on the shader-demo page
2. Look for `[shader] using webgpu` or `[shader] using webgl2` message
3. Run in console: `document.querySelector('canvas').dataset.shaderRenderer`
4. **Expected:** Console message matches the `data-shader-renderer` attribute value; value is `'webgpu'` or `'webgl2'`

### 3. Color palette matches site identity

1. On the shader-demo page, observe the color tones
2. **Expected:** Colors should be dark background tones with green/teal accents — consistent with the site's retro terminal palette (not bright/saturated/jarring)

### 4. Canvas resizes with viewport

1. On the shader-demo page, resize the browser window
2. **Expected:** The canvas fills the new viewport dimensions without stretching, letterboxing, or black bars

### 5. Build verification

1. Run `pnpm check` — expect 0 errors
2. Run `pnpm build` — expect success with `/shader-demo/index.html` in output
3. **Expected:** Both commands succeed

## Edge Cases

### WebGL2 fallback (if testable)

1. Open the shader-demo page in a browser without WebGPU support (e.g., older Firefox, or with WebGPU flag disabled)
2. **Expected:** Console shows `[shader] using webgl2`; dither pattern still renders with similar visual quality

### No GPU support

1. If possible, force both GPU APIs to fail (difficult to test without a specific browser config)
2. **Expected:** Console shows `[shader] no gpu api available`; canvas has `data-shader-renderer="none"`; page shows plain dark background without errors

## Failure Signals

- No visible animation on the canvas (solid color or blank)
- Console errors mentioning WebGPU, WebGL, shader compilation, or context creation
- `data-shader-renderer` attribute missing or set to `'none'` when GPU is available
- Canvas not filling the viewport or showing stretched/distorted content
- `pnpm check` or `pnpm build` failing with errors in shader modules

## Requirements Proved By This UAT

- R401 (partially) — proves the shader engine renders an animated faded dither pattern on a standalone canvas; does not prove site-wide integration (S02)
- R402 (partially) — proves colors derive from CSS custom properties and match site palette; does not prove they update dynamically or work across all page contexts
- R405 (partially) — proves WebGPU primary path works and detection chain is implemented; WebGL2 fallback is algorithmically identical but may not be testable without a specific browser configuration

## Not Proven By This UAT

- R401 full scope — shader not yet integrated into all pages (S02)
- R403 — cursor reactivity not wired yet (S02)
- R404 — per-page opt-out not implemented yet (S02)
- R405 full scope — WebGL2 runtime fallback not yet verified in a real browser without WebGPU
- R406 — `prefers-reduced-motion`, tab-hidden pause not implemented (S03)
- R407 — `pnpm validate:site` regression not yet run with shader integrated (S03)
- Visual parity between WebGPU and WebGL2 renderers — requires side-by-side comparison

## Notes for Tester

- The dither pattern is intentionally subtle — it's an ambient background effect, not a flashy demo. Look for a grid-like pixel pattern with soft blobs, not smooth gradients.
- If WebGPU renders successfully, there's no easy way to force WebGL2 fallback without a different browser or disabling WebGPU flags.
- The demo page has overlay text explaining its purpose — this is intentional and will not appear in the final site integration.
- Moving your cursor over the canvas may subtly affect the pattern (pointer influence is built into the shader) but cursor reactivity wiring is S02 scope.
