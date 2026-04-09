# LayerProof Motion Designer Agent

## Project Overview
This is a Remotion video project for **LayerProof** — an AI content generation platform that supports multiple media types: presentations, social media posts, web blog, and video.

We are building **two teaser videos** for the social media post creator feature:
- **Teaser 1 (Problem)**: Raises the pain of adjusting content for multiple platforms manually
- **Teaser 2 (Solution)**: Introduces LayerProof as the answer

## Brand Identity
- **Product**: LayerProof
- **Tagline**: "One prompt. Every platform."
- **Vibe**: Sleek, minimal, Apple-style — dark backgrounds, clean white/charcoal type, glass morphism, cinematic pacing
- **Color Palette**:
  - Background dark: `#0A0A0A`
  - Background mid: `#111111`  
  - Accent white: `#FFFFFF`
  - Accent gray: `#888888`
  - Glass surface: `rgba(255,255,255,0.05)`
  - Glass border: `rgba(255,255,255,0.1)`
- **Typography**: Use `Inter` or `SF Pro Display` style — clean, weight contrast between headline (700) and body (300)
- **Motion style**: Smooth spring-based reveals, slow push-in camera moves, stagger word reveals, gentle float animations

## Video Specs
- Resolution: 1920x1080 (16:9) for main, 1080x1080 (1:1) for social square
- FPS: 30
- Teaser 1 duration: ~15 seconds (450 frames)
- Teaser 2 duration: ~20 seconds (600 frames)

## Scene Structure

### Teaser 1 — "The Problem" (~15s)
1. **Overcrowded desk** (0–90f): Multiple blurred platform cards orbiting, chaotic layout
2. **Rewrite loop** (90–180f): Text appearing/disappearing, same message being rewritten 3x
3. **Tension moment** (180–270f): Dark screen, just a blinking cursor in 3 separate boxes
4. **Tagline** (270–360f): "Why are you writing the same thing 5 times?" fades in, white on black
5. **Hard cut** (360–450f): Logo mark fade in, then black

### Teaser 2 — "The Solution" (~20s)
1. **Dashboard reveal** (0–90f): LayerProof UI glows into existence from black, slow orbit
2. **One prompt** (90–180f): Single input field, user types one sentence, cursor blinks
3. **Split explosion** (180–300f): Screen splits into 4 panels (Instagram, LinkedIn, Twitter/X, Blog) generating simultaneously
4. **UI float** (300–420f): Dashboard card floating in 3D space, platform icons orbiting
5. **Human moment** (420–510f): Soft warm scene, person smiles, one tap, all posts publish
6. **Tagline** (510–600f): "LayerProof." then "One prompt. Every platform."

## Technical Guidelines
- Use `interpolate()` with `extrapolateLeft: 'clamp'` and `extrapolateRight: 'clamp'`
- Use `spring()` for enter/exit animations — stiffness: 80, damping: 20
- Use `useCurrentFrame()` and `useVideoConfig()` in every scene component
- Prefer CSS transforms over layout changes for performance
- Each scene = its own React component in `src/components/scenes/`
- Shared animations in `src/lib/animations.ts`
- Platform mock UIs in `src/components/ui/`

## File Conventions
- Scene files: `src/components/scenes/[SceneName].tsx`
- Composition files: `src/compositions/[CompositionName].tsx`
- Reusable components: `src/components/ui/[ComponentName].tsx`
- Entry point: `src/index.ts`
- Root: `src/Root.tsx`

## Composition IDs
- `layerproof-problem` — Teaser 1
- `layerproof-solution` — Teaser 2

## Render Commands
```bash
# Preview in studio
npm run dev

# Render Teaser 1
npx remotion render layerproof-problem --output out/layerproof-problem.mp4

# Render Teaser 2
npx remotion render layerproof-solution --output out/layerproof-solution.mp4

# Render both
npm run render:all
```
