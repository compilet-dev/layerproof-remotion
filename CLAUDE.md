# LayerProof Motion Designer Agent

## Project Overview
This is a Remotion video project for **LayerProof** — an AI content generation platform that supports multiple media types: presentations, social media posts, web blog, and video.

Videos produced in this project:
- **Teaser 1 (Problem)**: Raises the pain of adjusting content for multiple platforms manually
- **Teaser 2 (Solution)**: Introduces LayerProof as the answer
- **Vellum Master**: Full-length product video for Vellum
- **Vellum Node Demo**: Short node demo clip for Vellum
- **GIF — Prompt Multi-Platform**: Loopable prompt → generation → float GIF
- **GIF — AI Slide Stack**: Loopable AI slide stack GIF

## Brand Identity
- **Product**: LayerProof
- **Tagline**: "One prompt. Every platform."
- **Vibe**: Sleek, minimal, Apple-style — dark backgrounds, clean white/charcoal type, glass morphism, cinematic pacing
- **Color Palette**:
  - Background dark: `#080808` (`theme.colors.bgDark`)
  - Background mid: `#111111` (`theme.colors.bgMid`)
  - Accent pink: `#FF589B` (`theme.colors.accentPink`)
  - Accent yellow: `#FFD600` (`theme.colors.accentYellow`)
  - Glass surface: `rgba(255,255,255,0.06)` (`theme.glass.bg`)
  - Glass border: `rgba(255,255,255,0.12)` (`theme.glass.border`)
- **Typography**: `Inter` / SF Pro Display style — headline weight 800, body weight 300
- **Motion style**: Smooth spring-based reveals, slow push-in camera moves, stagger word reveals, gentle float animations

> **Never hardcode color values.** Always use `useTheme()` from `src/lib/theme.ts`.

## Compositions

| ID | Composition file | Frames | Duration | Dimensions |
|---|---|---|---|---|
| `layerproof-problem` | `LayerProofProblem.tsx` | 990 | 33s | 1920×1080 |
| `layerproof-solution` | `LayerProofSolution.tsx` | 1330 | 44.3s | 1920×1080 |
| `layerproof-vellum-master` | `LayerProofVellumMaster.tsx` | 1384 | 46.1s | 1920×1080 |
| `layerproof-vellum-node-demo` | `LayerProofVellumNodeDemo.tsx` | 724 | 24.1s | 1920×1080 |
| `layerproof-gif-prompt` | `gifs/PromptMultiPlatform.tsx` | 360 | 12s | 1270×760 |
| `layerproof-gif-slides` | `gifs/AISlideStack.tsx` | 205 | 6.8s | 1200×675 |

## Scene Structure

### Teaser 1 — "The Problem" (~33s, 990 frames)
1. **Overcrowded desk** (0–90f): Multiple blurred platform cards orbiting, chaotic layout
2. **Rewrite loop** (90–180f): Text appearing/disappearing, same message being rewritten 3x
3. **Tension moment** (180–270f): Dark screen, just a blinking cursor in 3 separate boxes
4. **Tagline** (270–360f): "Why are you writing the same thing 5 times?" fades in, white on black
5. **Hard cut** (360–450f): Logo mark fade in, then black

### Teaser 2 — "The Solution" (~44s, 1330 frames)
1. **Dashboard reveal** (0–90f): LayerProof UI glows into existence from black, slow orbit
2. **One prompt** (90–180f): Single input field, user types one sentence, cursor blinks
3. **Split explosion** (180–300f): Screen splits into 4 panels (Instagram, LinkedIn, Twitter/X, Blog) generating simultaneously
4. **UI float** (300–420f): Dashboard card floating in 3D space, platform icons orbiting
5. **Human moment** (420–510f): Soft warm scene, person smiles, one tap, all posts publish
6. **Tagline** (510–600f): "LayerProof." then "One prompt. Every platform."

### Vellum Master (~46s, 1384 frames)
Scenes: `VellumHook`, `VellumFiveAngles`, `VellumPlatformParallel`, `VellumEfficient`, `VellumConsistency`, `VellumVisualControl`, `VellumPlatformScale`, `VellumCTA`

### Vellum Node Demo (~24s, 724 frames)
Scene: `VellumNodeDemo`

## Technical Guidelines
- Use `interpolate()` with `extrapolateLeft: 'clamp'` and `extrapolateRight: 'clamp'`
- Use `spring()` for enter/exit animations — stiffness: 80, damping: 22
- Use `useCurrentFrame()` and `useVideoConfig()` in every scene component
- Prefer CSS transforms over layout changes for performance
- Each scene = its own React component in `src/components/scenes/`
- Shared animations in `src/lib/animations.ts`
- Theme tokens via `useTheme()` from `src/lib/theme.ts`

## File Conventions
- Scene files: `src/components/scenes/[folder]/[SceneName].tsx`
- Composition files: `src/compositions/[CompositionName].tsx`
- GIF compositions: `src/compositions/gifs/[Name].tsx`
- Reusable components: `src/components/ui/[ComponentName].tsx`
- Entry point: `src/index.ts`
- Root: `src/Root.tsx`

## Script Files

Pre-production scripts live in `scripts/`. Each composition should have a corresponding script.

| Script | Status |
|---|---|
| `scripts/layerproof-problem.md` | ✅ exists |
| `scripts/layerproof-solution.md` | ✅ exists |
| `scripts/layerproof-vellum-master.md` | ✅ exists |
| `scripts/layerproof-gif-prompt.md` | ✅ exists |
| `scripts/layerproof-gif-slides.md` | ✅ exists |
| `scripts/layerproof-vellum-node-demo.md` | ❌ missing — script not yet written |

## Render Commands
```bash
# Preview in Remotion Studio
npm run dev

# Render Teaser 1
npm run render:problem

# Render Teaser 2
npm run render:solution

# Render both teasers
npm run render:all

# Render Vellum master
npm run render:vellum

# Type check
npm run typecheck
```
