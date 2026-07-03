# /new-scene

Creates a new Remotion scene component for LayerProof teasers.

## Usage
```
/new-scene [scene-name] [teaser-number] [duration-in-seconds] [description]
```

Teaser numbers: `1` = problem, `2` = solution, `3` = vellum.

## Example
```
/new-scene PlatformChaos 1 3 "Multiple platform cards orbit in chaotic arrangement, desaturated color, tension building"
/new-scene VellumNewFeature 3 4 "Node editor demo showing a new connection type"
```

## What this command does
1. Creates `src/components/scenes/problem/[SceneName].tsx` (teaser 1) or `src/components/scenes/solution/[SceneName].tsx` (teaser 2) with correct Remotion boilerplate and `useTheme()` hook
1b. Adds named export to the barrel `index.ts` in that subdirectory
2. Applies LayerProof brand tokens via `useTheme()` — never hardcoded hex values
3. Implements the scene based on the description
4. Adds the scene to the correct composition:
   - **Teaser 1** → `src/compositions/LayerProofProblem.tsx` (990 total frames):
     - TheSetup: 0–210
     - RewriteLoop: 210–390
     - TensionMoment: 390–660
     - ProblemTagline: 660–840
     - ProblemLogoOut: 840–990
   - **Teaser 2** → `src/compositions/LayerProofSolution.tsx` (1330 total frames):
     - OpeningQuestion: 0–155
     - DashboardReveal: 155–305
     - OnePrompt: 305–510
     - SplitExplosion: 510–890
     - UIFloat: 890–1100
     - SolutionTagline: 1100–1330
   - **Teaser 3 (Vellum)** → `src/compositions/LayerProofVellumMaster.tsx` (1260 total frames):
     - VellumHook: 0–100
     - VellumNodeDemo: 100–400
     - VellumConsistency: 400–490
     - VellumFiveAngles: 490–720
     - VellumEfficient: 720–810
     - VellumPlatformScale: 810–1080
     - VellumCTA: 1080–1260
     - Scene file path: `src/components/scenes/vellum/[SceneName].tsx`
     - Light theme: white/`#F5F5F7` canvas, indigo `#6366F1` wires, amber `#F59E0B` accents
     - Script source of truth: `scripts/layerproof-vellum-master.md`
5. Runs the scene reviewer agent to validate the output

## Agent Instructions
When executing this command:

**0. Check for approved script**
Before creating any scene, verify that `scripts/[composition-id].md` exists and has `status: approved` in its frontmatter. The composition ID is derived from the teaser number: teaser 1 → `layerproof-problem`, teaser 2 → `layerproof-solution`.
- If the file doesn't exist: stop and tell the user to run `/write-script [composition-id] [prompt]` first.
- If status is `draft`: stop and tell the user to review the script, edit as needed, and change `status` to `approved` in the frontmatter.
- If status is `approved`: read the matching scene section (by scene name) from the script to use as the source of truth for copy, motion, and audio. Pass this section to the motion-designer agent.

1. Delegate scene CREATION to the `motion-designer` agent (providing the script section found in Step 0)
2. Delegate scene REVIEW to the `scene-reviewer` agent
3. If review fails, iterate with motion-designer until passing
4. Show final file path and how to preview: `npm run dev`
