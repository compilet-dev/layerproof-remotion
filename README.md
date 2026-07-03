# layerproof-remotion

A Claude Code-powered motion design agent for creating LayerProof teaser videos using **Remotion**.

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Open in Remotion Studio
```bash
npm run dev
# → Opens http://localhost:3000
```

## Compositions

| ID | Component | Description | Dimensions | Duration | Frames |
|---|---|---|---|---|---|
| `layerproof-problem` | `LayerProofProblem` | Teaser 1 — The Problem | 1920×1080 | 33s | 990 |
| `layerproof-solution` | `LayerProofSolution` | Teaser 2 — The Solution | 1920×1080 | 44.3s | 1330 |
| `layerproof-vellum-master` | `LayerProofVellumMaster` | Vellum — Master video | 1920×1080 | 46.1s | 1384 |
| `layerproof-vellum-node-demo` | `LayerProofVellumNodeDemo` | Vellum — Node demo | 1920×1080 | 24.1s | 724 |
| `layerproof-gif-prompt` | `PromptMultiPlatform` | GIF — Prompt → Editor Generation → Float (loopable) | 1270×760 | 12s | 360 |
| `layerproof-gif-slides` | `AISlideStack` | GIF — AI Slide Stack (loopable) | 1200×675 | 6.8s | 205 |

## Render

```bash
# Render Teaser 1
npm run render:problem

# Render Teaser 2
npm run render:solution

# Render both teasers
npm run render:all

# Render Vellum master
npm run render:vellum

# Type check only
npm run typecheck
```

## Script-First Workflow

All scenes are built from an approved script. The workflow is:

```
/write-script layerproof-problem "Show the pain of juggling 5 content tools"
# → Review and approve scripts/layerproof-problem.md (change status to approved)
/new-scene TheSetup 1 7 "Browser with orbiting app tabs, cursor clicking frantically"
/new-scene RewriteLoop 1 6 "Same message rewritten 3x, text flickers in and out"
/render problem
```

### Steps

1. **Generate script** — `script-writer` agent writes `scripts/[composition-id].md` with every scene's copy, motion, and audio intent
2. **Review + approve** — edit the script to match your vision, then set `status: approved` in the frontmatter
3. **Build scenes** — `/new-scene` reads the approved script section and builds using it as source of truth
4. **Review** — `scene-reviewer` validates code including Script Compliance checklist
5. **Render** — `/render` outputs final video

## Using Claude Code

### Commands

```
/write-script layerproof-problem "Show the pain of managing content across 5 disconnected tools"
```

```
/new-scene TheSetup 1 7 "Dark browser with 4 orbiting app tabs, tension building"
```

```
/new-scene TextReveal 2 4 "Cinematic word-by-word reveal of the tagline 'One prompt. Every platform.'"
```

```
/render problem
```

## Agents

| Agent | Role |
|---|---|
| `script-writer.md` | Pre-production: writes structured scripts, no code |
| `motion-designer.md` | Scene creation: React/Remotion components, script-first |
| `scene-reviewer.md` | Quality review: technical, brand, and script compliance |

## Brand Reference

| Token | Value |
|---|---|
| Background dark | `#080808` (`theme.colors.bgDark`) |
| Background mid | `#111111` (`theme.colors.bgMid`) |
| Accent pink | `#FF589B` (`theme.colors.accentPink`) |
| Accent yellow | `#FFD600` (`theme.colors.accentYellow`) |
| Glass BG | `rgba(255,255,255,0.06)` (`theme.glass.bg`) |
| Glass border | `rgba(255,255,255,0.12)` (`theme.glass.border`) |
| Spring | stiffness: 80, damping: 22 (`theme.motion.apple`) |
| Font weight | headline 800, body 300 |

> **Never hardcode color values.** Always use `useTheme()` from `src/lib/theme.ts`.

## Project Structure

```
layerproof-remotion/
├── CLAUDE.md                        ← Agent memory: brand, scenes, spec
├── scripts/                         ← Pre-production scripts (source of truth)
│   ├── layerproof-problem.md        ← Teaser 1 script (draft → approved)
│   └── layerproof-solution.md       ← Teaser 2 script (draft → approved)
├── .claude/
│   ├── agents/
│   │   ├── script-writer.md         ← Pre-production specialist
│   │   ├── motion-designer.md       ← Scene creation specialist
│   │   └── scene-reviewer.md        ← Quality reviewer
│   ├── skills/
│   │   └── remotion.md              ← Remotion API reference
│   └── commands/
│       ├── write-script.md          ← /write-script command
│       ├── new-scene.md             ← /new-scene command
│       └── render.md                ← /render command
├── src/
│   ├── index.ts                     ← Remotion entry point
│   ├── Root.tsx                     ← Composition registry
│   ├── lib/
│   │   ├── animations.ts            ← Animation helpers
│   │   ├── theme.ts                 ← ThemeProvider + useTheme()
│   │   └── themes/
│   │       └── bold.ts              ← Bold theme tokens
│   ├── compositions/
│   │   ├── LayerProofProblem.tsx    ← Teaser 1 composition
│   │   ├── LayerProofSolution.tsx   ← Teaser 2 composition
│   │   ├── LayerProofVellumMaster.tsx
│   │   ├── LayerProofVellumNodeDemo.tsx
│   │   └── gifs/                   ← GIF compositions
│   └── components/
│       └── scenes/
│           ├── ProblemScenes.tsx    ← Teaser 1 scene components
│           ├── SolutionScenes.tsx   ← Teaser 2 scene components
│           ├── problem/             ← Teaser 1 sub-scenes
│           ├── solution/            ← Teaser 2 sub-scenes
│           └── vellum/             ← Vellum sub-scenes
├── out/                             ← Rendered video output
├── package.json
└── tsconfig.json
```
