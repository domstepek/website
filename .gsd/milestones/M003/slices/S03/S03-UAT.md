# S03: Polish, Performance, and Regression Proof — UAT

## Test 1: Reduced Motion Freeze
1. Open browser DevTools → Rendering → check "Emulate CSS prefers-reduced-motion: reduce"
2. Navigate to any page
3. **Expected:** Shader shows a static dither pattern (not animating). Canvas has `data-shader-motion="frozen"`.
4. Uncheck the emulation
5. **Expected:** Shader resumes animation. Canvas has `data-shader-motion="animating"`.

## Test 2: Tab Visibility Pause
1. Open the site on any page, confirm shader is animating
2. Switch to a different browser tab (or minimize the window)
3. Switch back
4. **Expected:** Shader pauses while hidden and resumes when the tab is visible again

## Test 3: Full Regression Suite
1. Run `pnpm validate:site`
2. **Expected:** All 23 tests pass (20 M002 + 3 M003 shader tests)
