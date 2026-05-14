# Design System — thinking-canvas

Distilled from taste-skill. Applied to standalone HTML/CSS/JS (no bundler, no framework).
These rules apply to every canvas render. Non-negotiable.

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

**Font stack — load via CDN. Pick ONE pairing per canvas.**

```html
<!-- Preferred: Satoshi (general purpose) -->
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" rel="stylesheet">

<!-- Alt: Cabinet Grotesk (expressive, editorial) -->
<link href="https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800&display=swap" rel="stylesheet">

<!-- Monospace (data, code, numbers) -->
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

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
| Purple/neon gradient | AI aesthetic cliché | Neutral base + one muted accent |
| Outer `box-shadow` glow | Looks cheap | Inset border + tinted shadow |
| Centered hero + centered body | Symmetry bias | Split-screen, left-aligned |
| 3 equal horizontal cards | Feature-row slop | Asymmetric grid or zig-zag |
| Emoji in content | Breaks premium feel | SVG icon or plain text |
| Round numbers in data | Fake | Organic messy values: `47.2%`, `3,841` |
| `John Doe`, `Acme Corp` | Placeholder slop | Invent specific, realistic names |
| Oversized H1 screaming | No hierarchy | Control via weight + color contrast |

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
