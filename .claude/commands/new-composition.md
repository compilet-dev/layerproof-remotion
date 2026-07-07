# /new-composition

Generates an entire Remotion composition from an approved script — all scene files, the composition file, and `Root.tsx` registration — in one pass.

## Usage
```
/new-composition [composition-id]
```

Example: `/new-composition layerproof-problem`

The `composition-id` must match a script file in `scripts/[composition-id].md`.

---

## Agent Instructions

### Step 0 — Validate script

Read `scripts/[composition-id].md`.

- **File missing** → stop and tell the user:
  > Script not found. Run `/write-script [composition-id] [prompt]` to generate one first.
- **`status: draft`** → stop and tell the user:
  > Script is still in draft. Review `scripts/[composition-id].md`, make any edits, then change `status` to `approved` in the frontmatter before running this command again.
- **`status: approved`** → proceed to Step 1.

---

### Step 1 — Parse script

From the YAML frontmatter extract:
- `totalFrames` → `durationInFrames` for the `<Composition>` entry
- `dimensions` (format `WxH`) → split into `width` and `height`
- `fps`
- `composition` or `id` → derive the React component name by converting `layerproof-problem` → `LayerProofProblem` (kebab-case segments, each capitalised, joined)

For each `## Scene N — [SceneName]` section in the script body:
- Extract the scene name (e.g. `TheSetup`, `RewriteLoop`)
- Extract the absolute frame range from the **Frames:** line (e.g. `0–210`)
- Retain the full section text as the source of truth for that scene

Derive the subdirectory name from the composition id suffix: `layerproof-problem` → `problem`, `layerproof-solution` → `solution`, `layerproof-vellum-master` → `vellum`, etc.

---

### Step 2 — Delegate to `motion-designer` agent

Pass the **full approved script** and the parsed metadata above to the `motion-designer` agent with these instructions:

#### 2a — Scene files
For each scene parsed in Step 1, generate `src/components/scenes/[subdir]/[SceneName].tsx`:
- Use `useCurrentFrame()`, `useVideoConfig()`, and `useTheme()` in every file
- Use `interpolate()` with `extrapolateLeft: 'clamp'` and `extrapolateRight: 'clamp'`
- Use `spring()` for enter/exit animations (stiffness 80, damping 22 unless the script specifies otherwise)
- All frames inside the scene file are **local** (i.e. `frame` starts at 0 within the `<Sequence>`)
- All color values come from `useTheme()` — never hardcode hex values
- Match on-screen copy, motion, and visual details exactly as described in the script section

#### 2b — Barrel export
Create or update `src/components/scenes/[subdir]/index.ts` with a named export for every scene:
```ts
export { TheSetup } from './TheSetup';
export { RewriteLoop } from './RewriteLoop';
// … one per scene
```

#### 2c — Composition file
Generate `src/compositions/[ComponentName].tsx`:
```tsx
import { Composition } from 'remotion';
import { ThemeProvider } from '../lib/theme';
import { BackgroundMusic } from '../components/ui/BackgroundMusic';
import { TheSetup, RewriteLoop, /* … */ } from '../components/scenes/[subdir]';

export const [ComponentName]: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <ThemeProvider>
      <BackgroundMusic src="background-musicA.mp3" fadeInFrames={30} fadeOutFrames={[930, 990]} volume={0.7} />
      <Sequence from={0} durationInFrames={210}><TheSetup /></Sequence>
      <Sequence from={210} durationInFrames={180}><RewriteLoop /></Sequence>
      {/* … one <Sequence> per scene using absolute frame ranges from the script */}
    </ThemeProvider>
  );
};
```
- `from` and `durationInFrames` for each `<Sequence>` must exactly match the absolute frame ranges extracted in Step 1
- Derive audio fade in/out frames from the script's **Audio:** notes

#### 2d — Register in Root.tsx
Open `src/Root.tsx` and add a `<Composition>` entry:
```tsx
<Composition
  id="[composition-id]"
  component={[ComponentName]}
  durationInFrames={[totalFrames]}
  fps={[fps]}
  width={[width]}
  height={[height]}
/>
```
Do not duplicate if an entry with the same `id` already exists — update it instead.

---

### Step 3 — Review

Delegate to the `scene-reviewer` agent to validate every generated scene file:
- Correct Remotion hook usage
- No hardcoded colors
- `extrapolateLeft/Right: 'clamp'` on all `interpolate()` calls
- Local frame arithmetic is correct (scene-relative, not absolute)
- On-screen copy matches the script exactly

If the reviewer flags any issues, iterate with `motion-designer` until all scenes pass.

---

### Step 4 — Confirm

Report all created and modified file paths, then tell the user:

```
All done. Run `npm run dev` to preview in Remotion Studio.
```
