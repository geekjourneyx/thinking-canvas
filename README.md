# thinking-canvas

A Copilot CLI / Claude Code skill for live, browser-based HTML/SVG visualization of in-flight thinking.

## What it does

- Runs a local HTTP server that serves `docs/brainstorm/<topic>/visual.html`
- Injects SSE live-reload — edit the file, browser updates instantly
- Second `render` on same topic reuses the existing server (no port conflicts)
- 30-min idle auto-exit, zero npm dependencies

## Usage

```bash
node scripts/canvas.cjs render --topic <topic>
```

Returns JSON `{url, port, topic_dir}`. Open `url` in browser.

## Files

| File | Purpose |
|------|---------|
| `scripts/canvas.cjs` | Single-file CLI (zero deps) |
| `SKILL.md` | Skill capability spec |
| `references/design-system.md` | Design system (absorbed from taste-skill, adapted for standalone HTML) |
| `references/svg-animations.md` | SVG/CSS/SMIL animation techniques |
| `tests/test-render.sh` | Integration test |

## Install as Copilot CLI skill

Copy this directory into your superpowers skills folder:

```bash
cp -r thinking-canvas ~/.copilot/installed-plugins/superpowers-marketplace/superpowers/skills/
```
