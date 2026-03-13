# Avatar Integration Ideas

**Context**: The current profile picture on the homepage doesn't integrate well with the retro-terminal aesthetic (dark theme, dither shader background, CRT overlay, Space Mono font, muted green accents).

**Current Implementation**:
- 160×160px avatar with `mix-blend-mode: lighten` and `filter: grayscale(0.2) contrast(1.1)`
- Isolated from shader canvas background with `isolation: isolate`
- CSS variables: `--accent: #6fba7f`, `--accent-strong: #7fd48f`

---

## Approach 1: Indexed Color Dithering *(Subtle Integration)*

Convert photo to limited color palette using Floyd-Steinberg or ordered dithering to match background shader aesthetic, but with more structure.

```css
.home-avatar {
  filter: 
    contrast(1.3) 
    sepia(0.15) 
    hue-rotate(140deg) 
    saturate(0.7)
    url(#dither-filter);
}
```

**Pros**: Complementary relationship between organic background dither and structured pixel dithering
**Cons**: Requires SVG filter generation, may reduce photo recognizability

---

## Approach 2: Terminal Scanline Effect *(Medium Bold)*

Apply horizontal scanlines with green tint to simulate vintage CRT monitor display.

```css
.home-avatar {
  position: relative;
  filter: grayscale(0.8) sepia(0.3) hue-rotate(100deg) contrast(1.2);
}

.home-avatar::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: 
    repeating-linear-gradient(
      0deg,
      transparent 0px,
      transparent 1px,
      rgba(127, 212, 143, 0.15) 2px,
      rgba(127, 212, 143, 0.15) 3px,
      transparent 4px
    );
  pointer-events: none;
  mix-blend-mode: overlay;
}
```

**Pros**: Maintains photo recognition, clearly terminal-themed, subtle tech craft
**Cons**: May look dated if overdone

---

## Approach 3: ASCII Art Transformation *(Bold & Distinctive)*

Convert photo to actual ASCII characters rendered in green accent color.

```css
.home-avatar {
  font-family: var(--font-mono);
  font-size: 2px;
  line-height: 2px;
  color: var(--accent);
  background: transparent;
  white-space: pre;
  letter-spacing: 0;
}
```

Replace `<img>` with `<pre>` containing ASCII art generated from photo.

**Pros**: Most on-brand for terminal aesthetic, unique and memorable
**Cons**: Low recognizability, requires photo-to-ASCII conversion tool

---

## Approach 4: Matrix-Style Pixel Rain *(Maximal Tech Aesthetic)*

Animated green "digital rain" effect that reveals photo underneath.

```css
.home-avatar-wrap {
  position: relative;
  overflow: hidden;
}

.home-avatar {
  filter: contrast(1.1);
}

.home-avatar-wrap::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: 
    linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%),
    var(--bg);
  mask: url('/images/pixel-rain-mask.png');
  animation: digitalRain 4s infinite linear;
  mix-blend-mode: multiply;
}

@keyframes digitalRain {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}
```

**Pros**: High visual impact, strongly tech-themed
**Cons**: May be distracting, could compete with background shader

---

## Approach 5: Retro Photo Border + Glow *(Refined Retro)*

Keep photo recognizable but add vintage computer interface styling.

```css
.home-avatar-wrap {
  padding: 8px;
  background: 
    linear-gradient(45deg, var(--accent) 1px, transparent 1px),
    linear-gradient(-45deg, var(--accent) 1px, transparent 1px),
    var(--bg-elevated);
  background-size: 4px 4px;
  border: 2px solid var(--accent);
  box-shadow: 
    inset 0 0 20px rgba(127, 212, 143, 0.1),
    0 0 30px rgba(127, 212, 143, 0.2);
}

.home-avatar {
  border: 1px solid var(--border);
  filter: contrast(1.1) saturate(0.8);
}
```

**Pros**: Professional but themed, maintains recognition
**Cons**: Less bold, might feel generic

---

## **Recommended: Hybrid Approach 2 + 5**

Combine **scanline CRT effect** with **subtle retro border** for optimal balance:

- Maintains photo recognition (important for professional context)
- Clearly integrates with terminal aesthetic 
- Adds tech craft without overwhelming dither background
- Creates visual hierarchy (structured avatar vs. organic background)

**Implementation Strategy**:
1. Apply subtle scanlines over photo
2. Add minimal retro border treatment
3. Ensure `prefers-reduced-motion` respects user preferences
4. Test contrast ratios for accessibility

---

## Technical Considerations

- **Performance**: CSS-only solutions preferred over JavaScript manipulation
- **Accessibility**: Maintain sufficient contrast, respect `prefers-reduced-motion`
- **Responsive**: Ensure effects scale properly at different viewport sizes
- **Browser Support**: Test scanline effects across browsers for consistency