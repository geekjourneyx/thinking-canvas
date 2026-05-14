---
name: thinking-canvas
description: Use when in-flight thinking needs a live visual — design exploration, architecture sketching, comparing options, mapping concepts. Renders a persistent, browser-viewable, shareable HTML/SVG canvas. Capability-style: model picks the visual form freely.
---

# thinking-canvas

A live, browser-based canvas for visualizing thinking as it happens. Capability-style skill: provides infrastructure, principles, and pointers — does NOT prescribe diagram templates or auto-pick logic. The model decides the visual form for each render.

## ① When to Use

Activate when any of the following apply:

- The user explicitly asks to visualize, draw, sketch, compare, or map something
- The user is mid-design or mid-architecture and the conversation is becoming abstract
- You judge that *showing* the idea will move the conversation forward faster than describing it
- Another skill (e.g. brainstorming, idea-refine) is in flight and a visual would clarify a current decision

You do NOT need permission from another skill to activate. This skill is orthogonal — not bound to any flow.

You do NOT ask the user "which kind of diagram?" — make a call and render. The user can correct in plain text.

## ② Infrastructure (one verb, zero ceremony)

Independent. Zero npm dependencies. Pure Node built-ins. No relationship to brainstorming or any other skill's runtime.

**The only command you need:**

```bash
node <path-to-skill>/canvas.cjs render --topic "<short-topic>"
```

What it does (idempotent):
1. Computes `TOPIC_DIR=$(pwd)/docs/brainstorm/<slugified-topic>` and creates it
2. If no server is running for this topic: starts one in the background (random free port, lockfile records it)
3. If a server is already running for this topic: reuses it, broadcasts a reload signal to all open browsers
4. Prints JSON to stdout: `{"url":"http://localhost:NNNNN","port":NNNNN,"topic_dir":"/abs/path"}`

**Render workflow per turn:**

1. Decide whether the canvas needs an update (not every turn does)
2. Write the **full HTML document** to `$TOPIC_DIR/visual.html` — overwrite, no diffing, no patching
3. Run `canvas.cjs render --topic <topic>` — server pushes reload to all open browsers automatically
4. On the FIRST render, tell the user the URL ("Open `http://localhost:NNNNN`"). On subsequent renders, just say what changed.

**Lifecycle:**

- Server self-exits after 30 minutes of HTTP inactivity. No stop command needed.
- The server only injects the live-reload script into HTTP responses. **The on-disk `visual.html` is never polluted** — it is itself the standalone shareable artifact.

**Sharing / archiving:**

There is no separate export step. `docs/brainstorm/<topic>/visual.html` IS the shareable file. Anyone can open it in a browser, attach it to email, commit it to git, or include it in docs. Treat it as a self-contained artifact: any external libs/fonts you reference should be inlined as `<style>...</style>` and `<script>...</script>` blocks in your HTML.

## ③ Aesthetic Principles (REFERENCE, not rigid)

If `taste-skill` is available in this environment, defer to it for the full directive set. Otherwise, the irreducible defaults:

- No emoji in any rendered content
- No `Inter` font; default to `Geist` or `Satoshi` (CDN if needed, or `system-ui` if offline)
- No "AI Lila" purple/blue gradients
- No pure `#000000` — use `#0a0a0b` or a near-black like zinc-950
- ≤ 1 accent color, saturation < 80%
- Generous whitespace; primary container padding ≥ `2rem`

**Tier the polish to the moment:**

- During rapid iteration: "good enough" is good enough. Do not burn tokens on pixel polish.
- When the user signals "this is the version to share": invest in a polish pass.

You decide which mode you are in based on context.

## ④ Visual Arsenal (POINTER, not catalog)

The model is free to choose, mix, or invent the visual form. Examples of the *example space* (non-exhaustive, non-prescriptive):

- mindmap, tree, dependency graph, knowledge graph
- flowchart, decision tree, state machine
- sequence / interaction diagram
- architecture diagram, layered stack, bento layout
- timeline, gantt-like progression
- comparison matrix, quadrant, 2×2
- UI mockup comparison, wireframe split view
- custom-invented forms suited to the specific question

If `svg-animations` is available: refer to it for animation recipes (path-drawing, stagger fade-in, breathing, morphing, motion paths, gradient shifts).

If `taste-skill` is available: refer to its §8 "Creative Arsenal" for high-end interaction patterns (Bento, Liquid Glass, Magnetic Button, Parallax Tilt, Sticky Scroll, Holographic Foil, etc.).

**Mix freely. Invent freely. Ignore freely.** This skill does not enumerate "the N supported diagram types" — it points you at the universe and trusts your judgment.

## ⑤ Boundaries (NOT TO DO)

- Do not couple to `brainstorming`, `idea-refine`, or any other skill's runtime. This skill stands alone.
- Do not introduce hard-gates, spec requirements, or chained skill invocations.
- Do not implement annotation embedding, real-time collaboration, version snapshots, or theme switching.
- Do not wrap mermaid. Render SVG/HTML directly.
- Do not ask the user "which diagram type do you want?" — make a call and proceed.
- Do not create `visual-1.html`, `visual-2.html`, etc. Always overwrite `visual.html`.
- Do not pre-render templates. Generate fresh each turn.
- Do not write the live-reload `<script>` into the on-disk file. The CLI handles that on the wire.
- Do not invent a "stop" command, a "phase" concept, or a "session". A render is a render.
