<div align="center">

# thinking-canvas

**说出想法，AI 即刻可视化，浏览器实时呈现，链接即分享**

<img src="assets/banner.png" alt="thinking-canvas — AI 驱动的实时思维可视化浏览器画布" width="100%">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-brightgreen.svg)](https://nodejs.org)
[![零依赖](https://img.shields.io/badge/%E4%BE%9D%E8%B5%96-zero-brightgreen.svg)](#)
[![Copilot CLI Skill](https://img.shields.io/badge/Copilot%20CLI-Skill-purple.svg)](#安装)

</div>

---

## 这是什么

thinking-canvas 是一个 Copilot CLI / Claude Code 技能，能将 AI 的实时思考过程转化为活跃的浏览器 HTML/SVG 画布 — 零依赖、即时重载、可直接分享。

当对话进入抽象阶段（"帮我对比这两个方案"）或头脑风暴到达关键决策点时，技能会自动生成 `visual.html` 并启动本地服务。浏览器随 AI 迭代实时刷新。无需模板，无需手动操作 — AI 根据当下思维内容自主选择最适合的呈现形式：思维导图、流程图、时序图、架构图、方案对比网格。

```
输入：  "可视化这三个架构方案的取舍对比"
输出：  http://localhost:52341  →  浏览器打开，AI 每次修改即时刷新
```

---

## 核心特性

<img src="assets/features.png" alt="thinking-canvas 六大能力：SSE 实时重载、零依赖、锁文件复用端口、自由画布、内置设计系统、可分享产出物" width="100%">

---

## 工作流程

<img src="assets/workflow.png" alt="thinking-canvas 五阶段流水线：触发 → 设计 → 渲染 → 迭代 → 分享" width="100%">

---

## 安装

```bash
npx skills add https://github.com/geekjourneyx/thinking-canvas
```

无需 `npm install`。服务端（`scripts/canvas.cjs`）仅使用 Node.js 内置模块。

---

## 快速上手

说出"画个图"、"可视化一下"、"做个流程图"、"draw"、"visualize"、"diagram" 等关键词时技能自动激活。也可以手动调用：

```bash
node scripts/canvas.cjs render --topic "auth-flow"
# → {"url":"http://localhost:52341","port":52341,"topic_dir":"/your/project/docs/brainstorm/auth-flow"}
```

打开 URL，编辑 `docs/brainstorm/auth-flow/visual.html`，浏览器实时重载。

**同一 topic 再次渲染会复用已有服务** — 无端口冲突：

```bash
node scripts/canvas.cjs render --topic "auth-flow"
# → 复用现有服务，向所有已打开的浏览器广播重载
```

服务在空闲 30 分钟后自动退出，无需手动停止。

---

## 设计系统

每张生成的画布均遵循 `references/design-system.md` — 涵盖字体、动效、色彩与电影化动画模式的第一性原理设计规范：

- **字体：** Satoshi · Cabinet Grotesk · Instrument Serif + Geist 组合。禁用 `Inter`
- **色彩：** Zinc 中性底色 · 单一强调色 · 禁用 `#0D1117` 霓虹赛博暗色
- **动效：** 仅对 `transform` + `opacity` 做动画 · 慢快爆停叙事节奏 · 禁用 `linear` easing
- **SVG：** 路径描边 · SMIL · 交错入场 · 变形 — 详见 `references/svg-animations.md`
- **AI 陷阱：** 17 种常见 AI 生成视觉噪音已归档并主动规避

---

## 文件结构

| 路径 | 说明 |
|------|------|
| `scripts/canvas.cjs` | 单文件 CLI 服务（零依赖） |
| `SKILL.md` | AI 智能体能力规格说明 |
| `references/design-system.md` | 设计系统规范（字体、色彩、动效、电影化模式） |
| `references/svg-animations.md` | SVG/CSS/SMIL 动画技术参考手册 |
| `tests/test-render.sh` | 集成测试脚本 |
| `assets/` | README 信息图 |

画布产出写入当前项目目录的 `docs/brainstorm/<slug>/visual.html`。

---

## 许可证

[MIT](./LICENSE) — 自由使用、修改与分发。

---

## 关于作者

| | |
|:---|:---|
| 个人主页 | [jieni.ai](https://jieni.ai) |
| GitHub | [geekjourneyx](https://github.com/geekjourneyx) |
| Twitter | [@seekjourney](https://x.com/seekjourney) |
| 公众号 | 微信搜「极客杰尼」 |
