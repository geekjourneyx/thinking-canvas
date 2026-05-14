---
name: thinking-canvas
description: Use when the user needs to visualize in-flight thinking — design exploration, architecture sketching, comparing approaches, mapping concepts, or any moment when showing beats describing. Creates a live, browser-based HTML/SVG canvas with instant reload. Trigger when the user says "draw", "visualize", "show me", "diagram", "canvas", "sketch", "compare visually", or when a conversation grows abstract and a visual would unblock it. Also trigger proactively when brainstorming, idea-refine, or planning reaches a decision point that a visual would clarify.
---

# thinking-canvas

A live, browser-based HTML/SVG canvas for visualizing thinking as it happens. Write a file, run one command, browser reloads. No ceremony, no templates — pick the visual form that serves the thinking.

## When to Use

Activate when any of these apply:

- User asks to visualize, draw, sketch, diagram, compare, or map something
- Mid-design or mid-architecture conversation is becoming abstract
- You judge that *showing* beats describing at this moment
- A decision point in another skill would clarify with a visual

No permission from another skill needed. No "which diagram type?" — pick and render. User corrects in plain text.

## Infrastructure

Zero npm dependencies. Pure Node built-ins.

```bash
node <skill-path>/scripts/canvas.cjs render --topic "<short-topic>"
```

What it does (idempotent):

1. Computes `TOPIC_DIR = $(pwd)/docs/brainstorm/<slug>` and creates it
2. Starts a detached background server if none is running (random free port, lockfile)
3. If server exists: reuses it, broadcasts reload to all open browsers
4. Prints JSON: `{"url":"http://localhost:NNNNN","port":NNNNN,"topic_dir":"/abs/path"}`

Server exits automatically after 30 minutes idle. No stop command needed.

## Render Workflow

Each turn that needs a canvas update:

1. **Decide** — not every turn warrants a redraw
2. **Write** — overwrite `$TOPIC_DIR/visual.html` with the complete HTML document
3. **Render** — `node <skill-path>/scripts/canvas.cjs render --topic <topic>`
4. **Tell** — on first render: give the user the URL; on subsequent: describe what changed

**HTML must be self-contained.** Inline all CSS (`<style>`) and JS (`<script>`). Load fonts or CDN libs in `<head>`. The disk file is the shareable artifact — the server injects the live-reload script at serve time, never on disk.

## Visual Form

Pick the form that serves the thinking. There is no fixed list of supported types.

Common forms: mindmap, dependency graph, decision tree, flowchart, state machine, sequence diagram, architecture stack, bento grid, comparison matrix, UI mockup split, timeline, custom-invented form.

When animation would help: read `references/svg-animations.md` for SVG/CSS/SMIL techniques — path drawing, stagger, morphing, motion paths, gradient shifts, breathing effects.

## Design

Read `references/design-system.md` before generating HTML. These rules are non-negotiable — not suggestions.

Quick reference (full rules in the file):

- **Font:** `Satoshi`, `Cabinet Grotesk`, or `Geist` via CDN. **Never `Inter`.**
- **Color:** Max 1 accent. Saturation < 80%. Never `#000000`. Never AI-purple/neon gradients.
- **Layout:** Asymmetric over centered. Min `2rem` container padding. No 3-equal-card rows.
- **Motion:** Animate `transform` and `opacity` only. Always include `prefers-reduced-motion` guard.
- **No emoji** anywhere in rendered content.

Polish tier: rapid iteration → clarity over beauty. Share-ready → full `design-system.md` pass.

## Boundaries

- Render SVG/HTML directly — do not wrap Mermaid
- Always overwrite `visual.html` — never create `visual-1.html`, `visual-2.html`
- Do not write the live-reload `<script>` into the disk file
- Do not ask the user which diagram type — decide and render
- Do not couple to brainstorming, idea-refine, or any other skill's runtime
- Do not implement annotation storage, real-time collaboration, or version snapshots
