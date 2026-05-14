# Design System — thinking-canvas

Distilled from taste-skill. Applied to standalone HTML/CSS/JS (no bundler, no framework).
These rules apply to every canvas render. Non-negotiable.

---

## Design Context Protocol

**Before generating any HTML, extract existing design DNA. Generic output is the failure mode.**

Priority order (highest → lowest):

1. **User's codebase** — read `theme.ts`, `colors.ts`, `tokens.css`, `_variables.scss`, key components. Lift exact hex/px values; don't guess.
2. **Existing product URL** — inspect with browser devtools or Playwright screenshot.
3. **Brand assets** — logo file, slide templates, marketing materials.
4. **This design system** (fallback) — when no context exists, apply these rules and tell the user you're starting fresh.

**Verbalize the design system back to the user** before generating HTML:
> "I found: `#1a1a2e` background, `Söhne` at 400/700, 8px border-radius, 16px base grid. I'll use these."

If nothing exists: state "Building from first principles with zinc palette" and proceed.

---

## Visual Style Guide

Selecting the right design language for the canvas topic. HTML-executable styles only.

| Topic | Style Ref | Visual Language |
|-------|-----------|-----------------|
| System architecture / technical | **Fathom** + Müller-Brockmann | Precision grid, data-dense, cool neutrals |
| Strategy / decision comparison | **Pentagram** | Type hierarchy, 60% whitespace, black+1 accent |
| Process / workflow narrative | **Takram** | Systems thinking, R&D aesthetic, annotated diagrams |
| Creative brainstorm / idea explosion | **Build** | Bold editorial, playful weight contrast |
| UX flows / product design | **Locomotive** | Interactive-first, scroll choreography |
| Minimalist / deep thinking | **Kenya Hara** | Emptiness as communication, almost no color |
| Data patterns / exploration | **Stamen** | Cartographic depth, organic patterns, warm palette |

**Mood-driven selection:** Describe the *emotion* of the thinking, not the layout:
- "This feels like a lab report" → Fathom
- "This is trying to find the one truth" → Kenya Hara
- "Ideas are exploding in every direction" → Build or Sagmeister
- "Architecture is emerging from chaos" → Müller-Brockmann

---

## Design Dials (Defaults)

| Dial | Default | Range Meaning |
|------|---------|--------------|
| DESIGN_VARIANCE | 8 | 1 = perfect symmetry, 10 = artsy asymmetry |
| MOTION_INTENSITY | 6 | 1 = static only, 10 = cinematic choreography |
| VISUAL_DENSITY | 4 | 1 = art gallery airy, 10 = cockpit packed |

Adapt to context: architecture diagram → density 6–7; rapid brainstorm → motion 4; share-ready showcase → variance 9, motion 7.

---

## Typography

**Font stack — load via CDN. Pick ONE pairing per canvas. Dual-typeface is the rule: serif (voice/brand) + sans (function/UI).**

```html
<!-- Pairing A: General purpose — Satoshi Sans -->
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" rel="stylesheet">

<!-- Pairing B: Literary / editorial — Instrument Serif + Geist Sans -->
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;700&display=swap" rel="stylesheet">

<!-- Pairing C: Bold editorial — Bricolage Grotesque (single-family, high expressiveness) -->
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;700;800&display=swap" rel="stylesheet">

<!-- Pairing D: Narrative / warm — Fraunces (serif) + Work Sans -->
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600&display=swap" rel="stylesheet">

<!-- Alt: Cabinet Grotesk (expressive, editorial) -->
<link href="https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800&display=swap" rel="stylesheet">

<!-- Monospace (data, code, numbers) — always pair with above -->
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

**Pairing selection by topic:**

| Topic | Serif | Sans | Mono |
|-------|-------|------|------|
| Technical / architecture | — | Satoshi or Geist | JetBrains Mono |
| Strategy / narrative | Instrument Serif | Geist | JetBrains Mono |
| Creative / editorial | Fraunces | Work Sans | — |
| Bold / expressive | — | Bricolage Grotesque | — |

**BANNED font: `Inter`** — it signals default AI output. Replace with Satoshi, Cabinet Grotesk, or Geist.

**Scale rules:**

```css
/* Display / headline */
.display {
  font-size: clamp(2rem, 4vw, 3.5rem);
  letter-spacing: -0.04em;
  line-height: 1.05;
  font-weight: 700;
}

/* Body */
.body {
  font-size: 1rem;
  line-height: 1.7;
  max-width: 65ch;
}

/* Labels / captions */
.label {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 500;
}

/* Data / numeric */
.mono {
  font-family: 'JetBrains Mono', monospace;
  font-variant-numeric: tabular-nums;
}
```

---

## Color System

**Foundation: zinc neutral base. One accent max.**

```css
/* Dark mode (default for thinking canvas) */
:root {
  --bg:             #09090b;   /* zinc-950 — NEVER use #000000 */
  --surface:        #18181b;   /* zinc-900 */
  --surface-2:      #27272a;   /* zinc-800 — elevated cards */
  --border:         #3f3f46;   /* zinc-700 */
  --muted:          #71717a;   /* zinc-500 */
  --text:           #fafafa;   /* zinc-50 */
  --text-secondary: #a1a1aa;   /* zinc-400 */

  /* One accent — pick what fits the domain */
  --accent:         #10b981;   /* emerald-500 example */
  --accent-dim:     rgba(16, 185, 129, 0.12);
}

/* Light mode variant */
:root[data-theme="light"] {
  --bg:             #fafafa;
  --surface:        #ffffff;
  --surface-2:      #f4f4f5;
  --border:         #e4e4e7;
  --muted:          #a1a1aa;
  --text:           #09090b;
  --text-secondary: #71717a;
}
```

**Accent selection:**

| Context | Accent |
|---------|--------|
| Technical / neutral | Emerald `#10b981`, Blue `#3b82f6` |
| Warning / decision | Amber `#f59e0b` |
| Creative / expressive | Rose `#f43f5e` |
| Architecture / system | Sky `#0ea5e9` |

Always: saturation < 80%. Never a pure white or black accent.

**BANNED colors:**

- `#000000` → use `#09090b`
- `#0D1117` → GitHub dark / neon-cyber cliché; banned wholesale
- AI-purple: `#a855f7`, `#818cf8`, `oklch(60% 0.22 270)` or any neon gradient
- Outer glow `box-shadow: 0 0 20px rgba(...)` → use inset borders instead

---

## Layout

**Container:**

```css
.canvas-root {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;          /* NEVER less than 2rem */
  box-sizing: border-box;
}
```

**Grid over flex-math:**

```css
/* DO: named grid areas, fractional units */
.bento {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto;
  gap: 1rem;
}
.bento-wide { grid-column: 1 / -1; }

/* DON'T: calc() flexbox hacks */
/* .bad { display: flex; width: calc(33.33% - 1rem); } */
```

**Anti-center rule (DESIGN_VARIANCE ≥ 5):**

Avoid the default AI layout: centered headline → centered subtext → centered CTA stack.

Use instead:
- Split-screen 50/50 (text left, asset right)
- Left-aligned content with offset asset
- Asymmetric whitespace (`padding-left: 15vw`)

Exception: isolated stat callouts, single-metric displays.

**No 3-equal-card horizontal row.** Use zig-zag, asymmetric grid, or `grid-template-columns: 3fr 2fr`:

```css
.feature-row { display: grid; grid-template-columns: 3fr 2fr; gap: 2rem; }
.feature-row:nth-child(even) { direction: rtl; }
.feature-row > * { direction: ltr; }
```

**Section spacing:**

```css
section + section { margin-top: clamp(4rem, 8vw, 8rem); }
```

---

## Motion

**Philosophy: Animation is physics, not timing curves.** Every element has weight, inertia, and friction. The question easing answers is: "how heavy is this object?"

### Slow-Fast-Boom-Stop Narrative (5 beats)

Every animated canvas should breathe at this rhythm:

| Beat | % of runtime | Tempo | Purpose |
|------|-------------|-------|---------|
| S1 Trigger | ~15% | Slow | Give humans reaction time, establish reality |
| S2 Reveal | ~15% | Medium | The visual "wow" moment arrives |
| S3 Process | ~40% | Fast | Depth / density / detail |
| S4 Boom | ~20% | Climax | Pull back / multi-panel surge / zoom out |
| S5 Hold | ~10% | Still | Cut sharp — **never fade to black** |

**Forbidden:** uniform density (no peaks → no memory), fade-out endings.

### Easing Map

```js
// 1. Expo Out — primary easing (most elements)
// CSS: cubic-bezier(0.16, 1, 0.3, 1)
// Use: card rise, panel enter, terminal fade, focus overlay

// 2. Overshoot — toggle / button spring
// CSS: cubic-bezier(0.34, 1.56, 0.64, 1)
// Use: toggle switches, button pop, emphasis interactions

// 3. Spring — geometric / physical settling
// CSS: cubic-bezier(0.175, 0.885, 0.32, 1.275)
// Use: modal settle, drag-release, position snap

// 4. EaseInOut — continuous motion (cursor trails, looping)
// CSS: cubic-bezier(0.45, 0, 0.55, 1)
```

**`linear` is BANNED** — it makes elements feel like numbers, not objects.

### Show Process, Not Magic

- ❌ One-click → perfect result
- ✅ Show the tweak, show the diff, show the build-up

This is the single biggest differentiator between AI slop and Anthropic-level animation. "Magic" erodes trust; process builds it.

### Focus Transition (depth pull)

```css
/* Non-focused elements — don't just dim, also blur */
.unfocused {
  filter: brightness(0.5) saturate(0.7) blur(4px);
  opacity: 0.4;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
```

Blur is required. Opacity alone leaves elements visually "sharp" — they don't recede.

**Rule: animate only GPU-composited properties.**

```css
/* Standard transition */
.interactive {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Spring-like overshoot */
.spring {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Hardware acceleration — always for animated elements */
.animated {
  will-change: transform;
  transform: translateZ(0);
}
```

**NEVER animate:** `top`, `left`, `width`, `height`, `margin`, `padding` — always triggers layout.

**Staggered reveals:**

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.stagger-item {
  opacity: 0;
  animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(var(--i, 0) * 80ms);
}
```

```js
document.querySelectorAll('.stagger-item').forEach((el, i) => {
  el.style.setProperty('--i', i);
});
```

**Required — prefers-reduced-motion guard:**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**For complex choreography:** GSAP via CDN is acceptable.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
```

---

## Surfaces & Depth

**Glassmorphism (correctly):**

```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 4px 24px rgba(0, 0, 0, 0.3);
  border-radius: 1rem;
}
```

**Diffusion shadow (depth without clutter):**

```css
.card {
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.15);
  /* Tint to bg hue — never pure gray */
}
```

**Cards only when elevation communicates hierarchy.** Otherwise: `border-top`, padding, or negative space.

**Spotlight border (interactive hover):**

```js
card.addEventListener('mousemove', (e) => {
  const rect = card.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  card.style.setProperty('--x', `${x}%`);
  card.style.setProperty('--y', `${y}%`);
});
```

```css
.spotlight-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    circle at var(--x, 50%) var(--y, 50%),
    rgba(255, 255, 255, 0.06) 0%,
    transparent 60%
  );
  pointer-events: none;
}
```

---

## AI Tells — Forbidden Patterns

The LLM will reach for these instinctively. Resist all of them.

| Pattern | Why Banned | Do This Instead |
|---------|-----------|-----------------|
| `Inter` font | Default AI signal | `Satoshi`, `Cabinet Grotesk`, `Geist` |
| `#000000` black | Flat, dead | `#09090b` (zinc-950) |
| `#0D1117` neon-cyber dark | GitHub/sci-fi cliché | Zinc-950 `#09090b` + warm tint |
| Pure white `#FFFFFF` bg | No paper feel | `#fafafa` (zinc-50) or warm `#f8f5f0` |
| Purple/neon gradient | AI aesthetic cliché | Neutral base + one muted accent |
| `linear` easing | Feels like a number, not an object | `cubic-bezier(0.16, 1, 0.3, 1)` (expoOut) |
| Fade-to-black / fade-out ending | Anticlimactic, no decision | Cut sharp — hold on the last frame |
| Step-based animation (fade, fade, fade) | PowerPoint thinking | Scene-based with Slow-Fast-Boom-Stop |
| Magic one-click results | Erodes trust | Show process: diffs, tweaks, build-up |
| Outer `box-shadow` glow | Looks cheap | Inset border + tinted shadow |
| Centered hero + centered body | Symmetry bias | Split-screen, left-aligned |
| 3 equal horizontal cards | Feature-row slop | Asymmetric grid or zig-zag |
| Emoji in content | Breaks premium feel | SVG icon or plain text |
| Round numbers in data | Fake | Organic messy values: `47.2%`, `3,841` |
| `John Doe`, `Acme Corp` | Placeholder slop | Invent specific, realistic names |
| Oversized H1 screaming | No hierarchy | Control via weight + color contrast |
| Generic AI cliché icons (brain, lightbulb, rocket) | No substance | Abstract geometry or typography-as-image |

---

## Cinematic Canvas Patterns

For workflow demos and animated decision flows. Distilled from Anthropic-level motion design.

### Dashboard + Cinematic Overlay (dual-layer)

Default state: full static dashboard (always visible).
Triggered state: cinematic overlay (22 seconds), then auto-returns.

```html
<!-- Structure -->
<div class="dash"><!-- static workflow diagram --></div>
<div class="cinema"><!-- animated overlay --></div>
<button class="play-cta">▶</button>
```

```css
.cinema { opacity: 0; pointer-events: none; transition: opacity 0.4s; }
.cinema.show { opacity: 1; pointer-events: auto; }
```

```js
playBtn.onclick = () => {
  cinema.classList.add('show');
  dash.classList.add('hide');
  runAnimation(() => endCinematic()); // 22s then reverse
};
```

**Banned:** default = black screen with big ▶ button covering everything.

### Scene-based Timeline (not step-based)

5 scenes, ~22 seconds total. Each scene is a full-screen focus on ONE thing:

| Scene | Type | Length | Purpose |
|-------|------|--------|---------|
| 1 | Invoke | 3–4s | User trigger (typewriter terminal) |
| 2 | Process | 5–6s | Core work visualized (unique per topic) |
| 3 | Insight | 4–5s | Key artifact crystallizes |
| 4 | Output | 3–4s | Concrete result / diff / metric |
| 5 | Hero Reveal | 4–5s | Big moment + sharp cut |

**22 seconds is the golden length.** < 18s: PM hasn't settled in. > 25s: attention gone.

Use a single `requestAnimationFrame(render)` loop with a global timeline object. No `setTimeout` chains.

```js
const T = { DURATION: 22.0, s1_in: 0, s2_in: 3.8, s3_in: 9.6, s4_in: 14.2, s5_in: 18.0 };
function render(ts) {
  const t = Math.min((ts - startTs) / 1000, T.DURATION);
  // interpolate all scene opacities/transforms from T.*
  if (t < T.DURATION) requestAnimationFrame(render);
  else endCinematic();
}
```

### Cross-fade Scene Transitions (no blank frames)

```js
// ❌ Wrong: gap between scenes
if (t >= 9) hideScene2();       // scene 2 fades out
if (t >= 9.5) showScene3();     // 0.5s blank screen

// ✅ Right: overlapping cross-fade
if (t >= 8.6) hideScene2();     // start fade-out early
if (t >= 8.6) showScene3();     // start fade-in simultaneously
```

### Each Demo Needs a Unique Visual Language

If two canvases look identical under different text, the design has failed. Cover the text — can you tell them apart?

---

## Animation Pitfalls

Bugs that cost a full debugging round. Know them before you write the first line.

**1. `position: relative` is mandatory for absolute children**
```css
/* Any container with position:absolute children MUST have: */
.container { position: relative; } /* even if no offset needed */
```

**2. Data-driven grid templates**
```js
// Don't hardcode column count when N comes from data
el.style.setProperty('--cols', items.length);
```
```css
.grid { grid-template-columns: repeat(var(--cols), 1fr); }
```

**3. No rare Unicode in animations**
Avoid `␣ ↩ ⌘ ⌥ ⇧ ␦` — most fonts don't have these glyphs. Use CSS-constructed boxes instead.

**4. Pure Render: animation state must be seekable**
Build animations as pure functions of time `t`. Avoid one-shot `fireOnce()` or `setTimeout` chains — they can't be replayed or seeked.

---

## Creative Arsenal

High-end patterns for canvas renders. Use when the moment calls for polish.

**Bento Grid:**

```css
.bento {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto;
  gap: 1rem;
}
.bento-wide { grid-column: 1 / -1; }
.bento-tall { grid-row: span 2; }
```

**Mesh Gradient Background:**

```css
.mesh-bg {
  background:
    radial-gradient(at 40% 20%, hsla(28, 100%, 74%, 0.25) 0, transparent 50%),
    radial-gradient(at 80% 0%,  hsla(189, 100%, 56%, 0.15) 0, transparent 50%),
    radial-gradient(at 0%  50%, hsla(355, 100%, 93%, 0.1) 0,  transparent 50%),
    var(--bg);
}
```

**Holographic Foil Text:**

```css
@keyframes holo {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.foil {
  background: linear-gradient(135deg,
    hsl(0,80%,60%), hsl(60,80%,60%), hsl(120,80%,60%),
    hsl(180,80%,60%), hsl(240,80%,60%), hsl(300,80%,60%), hsl(360,80%,60%)
  );
  background-size: 400% 400%;
  animation: holo 4s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**Typewriter Effect:**

```js
async function typewriter(el, text, speed = 50) {
  el.textContent = '';
  for (const char of text) {
    el.textContent += char;
    await new Promise(r => setTimeout(r, speed));
  }
}
```

**Text Scramble:**

```js
function scramble(el, finalText, duration = 800) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let start = null;
  function frame(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const revealed = Math.floor(progress * finalText.length);
    el.textContent = finalText.slice(0, revealed) +
      Array.from({ length: finalText.length - revealed }, () =>
        chars[Math.floor(Math.random() * chars.length)]).join('');
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
```

**Magnetic Button:**

```js
btn.addEventListener('mousemove', (e) => {
  const rect = btn.getBoundingClientRect();
  const dx = (e.clientX - rect.left - rect.width / 2) * 0.3;
  const dy = (e.clientY - rect.top - rect.height / 2) * 0.3;
  btn.style.transform = `translate(${dx}px, ${dy}px)`;
});
btn.addEventListener('mouseleave', () => {
  btn.style.transform = 'translate(0, 0)';
});
```

**Scroll-driven SVG path drawing:**

```js
const path = document.querySelector('.scroll-path');
const len = path.getTotalLength();
path.style.strokeDasharray = len;
path.style.strokeDashoffset = len;
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  path.style.strokeDashoffset = len * (1 - scrolled);
}, { passive: true });
```

**Dynamic Island (status pill):**

```css
.island {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: #09090b;
  border: 1px solid #3f3f46;
  border-radius: 999px;
  padding: 0.5rem 1.25rem;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.island.expanded {
  border-radius: 1.5rem;
  padding: 1rem 1.5rem;
}
```
