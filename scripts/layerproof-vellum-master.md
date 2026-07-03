---
composition: layerproof-vellum-master
id: layerproof-vellum-master
dimensions: 1920x1080
fps: 30
totalFrames: 1260
status: draft
---

# LayerProof Vellum — Master Video (~42s)

> **Aesthetic:** Light theme — white canvas background (#FAFAFA) for node-editor scenes,
> pure white (#FFFFFF) for text transition beats. Clean, product-demo energy.
> Node cards: white with subtle drop shadow, bezier wire connections in indigo (#6366F1),
> highlights in warm amber (#F59E0B). Typography: Inter 700 for headings, 400 for body.

---

## Scene 0 — Hook
**Frames:** 0–100 (3.3s) — local frames 0–100
**On-screen copy:**
- Line 1 (Inter, 52px, weight 400, color #888888, fades in frame 10–30): "AI Image Lab, now with..."
- Line 2 (Inter, 88px, weight 700, color #0A0A0A, springs in from +24px at frame 40): "More control"
**Visual:** Pure white (#FFFFFF) full-bleed background. Text block centered. No other elements.
Subtle fade-in of entire scene 0→1 over 15 frames. Scene holds, then cross-fades into Scene 1 at frames 85–100.
**Motion:** Line 1: `fadeIn` frames 10–30. Line 2: spring stiffness 90, damping 22, translateY +24→0, opacity 0→1 at frame 40.
Exit: opacity 1→0 over frames 85–100.
**Audio:** Voiceover `vellum_hook.mp3` starts at local frame 10.
**Implementation hints:** `VellumHook.tsx`. Simple centered flex column. No decorative elements.

---

## Scene 1 — NodeGraphDemo
**Frames:** 100–400 (10s) — local frames 0–300
**On-screen copy:** None (voiceover carries it)
**Visual:** Light canvas background (`#F5F5F7`) — mimics Vellum's node editor. The canvas has a faint dot-grid pattern (rgba(0,0,0,0.06), 24px spacing). Four nodes are arranged horizontally left-to-right with breathing room:

- **Node 1 — Character** (left, x≈360, y≈540): White card (280×320px, border-radius 16, shadow `0 4px 24px rgba(0,0,0,0.10)`). Header label "Character" (Inter 600, 13px, #6366F1). Body: a fashion model photograph filling the card (use placeholder rectangle with gradient `linear-gradient(135deg,#D4B89A,#C09070)` or `staticFile('vellum/model_photo.jpg')`). Small connection port (12px circle, fill #6366F1) on the right edge.

- **Node 2 — Composition** (center-left, x≈720, y≈480): Same card style (300×280px). Label "Composition". Body: a studio background image (neutral gradient `linear-gradient(160deg,#E8E4DC,#C8C4BC)`) representing a composed scene. Ports on left and right edges.

- **Node 3 — Lighting Prompt** (center-right, x≈1080, y≈600): Narrower card (260×160px). Label "Lighting". Body: a text prompt chip reading `"Afternoon / Morning light"` (Inter 500, 16px, #374151) inside a light input area (#F9FAFB, border 1px #E5E7EB). Port on left and right.

- **Result Node** (right, x≈1440, y≈540): Larger card (340×380px). Label "Output" with a gold accent. Body: initially empty/loading shimmer, then reveals the final composed image — model in composition with warm afternoon lighting. Gradient vignette overlay on card edges (subtle). Glowing border animation on reveal (rgba(245,158,11,0.6) pulse).

**Wire animations (bezier curves, stroke 2.5px, color #6366F1, opacity 0.7):**
- Wire A (Node 1 → Node 2): draws from right port of Node 1 to left port of Node 2, animated local frames 40–70 (pathLength 0→1)
- Wire B (Node 2 → Result): draws from right port of Node 2 to left port of Result, animated local frames 75–105
- Wire C (Node 3 → Result): draws from right port of Node 3 to bottom-left port of Result, animated local frames 85–115

**Camera behavior:**
- Start: camera pulled back slightly (scale 0.82) showing the whole canvas, centered around x=900
- Local frames 0–20: camera fades in (opacity 0→1), nodes not yet visible
- Local frames 20–50: Node 1 springs in (translateY +32→0, opacity 0→1, spring stiffness 80, damping 20)
- Local frames 35–65: Node 2 springs in (same spring, stagger +15f)
- Local frames 50–80: Node 3 springs in (stagger +15f)
- Local frames 20–120: camera slowly zooms in (scale 0.82→1.0) and pans right (translateX 0→−80px) using easeIO over 100f — focuses attention on the wire-drawing sequence
- Local frames 120–200: camera holds near 1.0 scale while wires complete and Result node populates
- Local frames 145–175: Result node body transitions from shimmer → composed image with a white flash (opacity 1 for 4f) and immediate glow border pulse (amber, 0→1→0.4 over 30f)
- Local frames 200–280: camera slowly zooms further into Result node (scale 1.0→1.25, translateX −80→−180px) to showcase the output image quality. Gentle float on Result card (sinusoidal ±3px, period 90f)
- Local frames 265–300: scene fades out (opacity 1→0)

**Motion:** All node entrances: spring stiffness 80, damping 20. Wire draw: SVG `stroke-dashoffset` animation with `easeOut` cubic. Camera: `easeIO3` interpolation (no springs) for smooth cinematic feel. Result shimmer: CSS `linear-gradient` animated from left to right over 30f.
**Audio:** Voiceover `vellum_node_demo.mp3` starts at local frame 15 (absolute frame 115).
**Implementation hints:** `VellumNodeDemo.tsx`. Use `<svg>` overlay for bezier wires drawn with `stroke-dasharray` / `stroke-dashoffset`. Node cards as `<div>` with CSS. Camera: outer wrapper with `transform: scale() translateX()`. Use `interpolate` with `extrapolateRight: 'clamp'` for all camera values.

---

## Scene 2 — MoreConsistency
**Frames:** 400–490 (3s) — local frames 0–90
**On-screen copy:**
- Line 1 (Inter, 88px, weight 700, color #0A0A0A, springs in from +24px at frame 20): "More consistency"
**Visual:** Pure white (#FFFFFF) background. Single bold word-block centered vertically and horizontally.
Scene receives cross-fade from Scene 1 (opacity builds 0→1 over frames 0–15). Holds through frame 75, fades out 75–90.
**Motion:** Text: spring stiffness 90, damping 22, translateY +24→0, opacity 0→1 at frame 20.
**Audio:** Voiceover `vellum_consistency_title.mp3` at local frame 18.
**Implementation hints:** `VellumConsistency.tsx` (reuse layout from VellumHook).

---

## Scene 3 — FiveAngles
**Frames:** 490–720 (7.7s) — local frames 0–230
**On-screen copy:** None on screen (voiceover only)
**Visual:** Light canvas (#F5F5F7) with faint dot-grid. Layout:

- **Source image card** (top-center, x≈960, y≈180): compact node card (220×260px). Label "Character". Shows the same model photo from Scene 1. Appears at local frame 10 with spring entrance.

- **Prompt input bar** (centered below source, y≈310, width 520px): white rounded input card (#FFFFFF, border 1px #E5E7EB, border-radius 12, shadow soft). Contains a blinking cursor followed by typed text `"5 angles of the model"`. Text types progressively from local frames 25–75 (Inter 500, 18px, #374151). A "Generate" button (rounded, #6366F1 fill, white text "Generate →") on the right end of the bar highlights and pulses at frame 82.

- **5 result image cards** arranged in a horizontal row (y≈580, evenly spaced from x≈200 to x≈1720, each 260×320px): same node card style. Each represents the model from a distinct camera angle:
  - Card A (front-on portrait, −5° tilt)
  - Card B (3/4 left angle, +3° tilt)
  - Card C (profile left, −2° tilt)
  - Card D (3/4 right angle, +4° tilt)
  - Card E (overhead/low angle, −3° tilt)
  Use gradient placeholder fills: `linear-gradient(135deg, #D4B89A, #A08060)` with a subtle face silhouette overlay (CSS clip-path circle). Each card has a thin wire connecting from the source card (draw-in animation, frames 88–115).

  **Stagger entrance** (spring in from translateY +50px, opacity 0→1):
  - Card A: local frame 95, spring stiffness 100, damping 22
  - Card B: local frame 105 (+10f stagger)
  - Card C: local frame 115 (+10f)
  - Card D: local frame 125 (+10f)
  - Card E: local frame 135 (+10f)

  **Highlight effect on each card** (border pop + scale pulse):
  - After card springs in, a bright border glows in (border: 2px solid #6366F1, box-shadow: 0 0 0 4px rgba(99,102,241,0.25)) — opacity 0→1 over 12f, then settles to static border
  - Card scale: 1.0→1.03→1.0 pulse over 20f using spring stiffness 200, damping 18

**Camera behavior:** Starts at scale 1.0, centered. At local frame 85 (Generate click): subtle zoom-in punch (scale 1.0→1.05 over 20f using spring stiffness 120, damping 22) to signal generation, then eases back 1.05→0.98 by frame 135 as cards appear. Gentle left-to-right pan (translateX 0→−60px) over frames 100–200 using easeIO to scan across all 5 cards. Scene fades out 205–230.
**Motion:** All springs as specified. Text typing: `getTypedText(text, frame, startFrame, charsPerFrame=0.45)`.
**Audio:** Voiceover `vellum_five_angles.mp3` at local frame 5 (absolute frame 495).
**Implementation hints:** `VellumFiveAngles.tsx`. Re-use `getTypedText` from `src/lib/animations.ts`. Wire SVGs connecting source to each card.

---

## Scene 4 — MoreEfficient
**Frames:** 720–810 (3s) — local frames 0–90
**On-screen copy:**
- Line 1 (Inter, 88px, weight 700, color #0A0A0A, springs in from +24px at frame 15): "More efficient"
- Platform icons row (Facebook, X/Twitter, TikTok — each 40×40px, color #6B7280) fades in at frame 45, spaced 20px apart, centered below the text
**Visual:** Pure white (#FFFFFF). Fades in 0–15, holds, fades out 75–90.
**Motion:** Text spring: stiffness 90, damping 22. Icons: opacity 0→1 interpolate frames 45–60, stagger 8f each.
**Audio:** Voiceover `vellum_efficient_title.mp3` at local frame 15.
**Implementation hints:** `VellumEfficient.tsx`. Use SVG icons for Facebook, X, TikTok (inline or from assets).

---

## Scene 5 — PlatformScale
**Frames:** 810–1080 (9s) — local frames 0–270
**On-screen copy:** Platform icons as node labels (Facebook, X, TikTok) — no headline text
**Visual:** Light canvas (#F5F5F7) with faint dot-grid. Layout:

- **Source image card** (left-center, x≈380, y≈540): node card (240×280px). Label "Master Image". Shows one of the 5 angle images from Scene 3 (e.g., Card B — 3/4 angle). A gold "selected" ring around it (border 3px solid #F59E0B, box-shadow 0 0 0 6px rgba(245,158,11,0.2)) springs in at local frame 12 with scale pulse (1.0→1.04→1.0).

- **Prompt bar** (below source card, y≈680, width 420px): same style as Scene 3. Types: `"Optimize for Facebook, X, TikTok"` from frames 30–80. Generate button clicks at frame 87.

- **Three platform destination nodes** (right side, stacked vertically at x≈1380):
  - Node A — Facebook (y≈360): card 280×200px, Facebook blue header (#1877F2), label "Facebook Post" (4:5 ratio preview). Port on left.
  - Node B — X/Twitter (y≈560): card 280×200px, X black header (#000000), label "X Post" (16:9 ratio). Port on left.
  - Node C — TikTok (y≈760): card 280×200px, TikTok gradient header (linear-gradient #010101→#FE2C55), label "TikTok" (9:16 ratio). Port on left.

- **Three wires** from Source card right-port to each platform node left-port (bezier curves, color #6366F1, stroke 2px):
  - Wire to Facebook: draw-in frames 90–120
  - Wire to X: draw-in frames 100–130 (slight stagger)
  - Wire to TikTok: draw-in frames 110–140 (slight stagger)

- **Parallel generation effect** on all 3 platform nodes (local frames 120–195):
  - Each card body shows an animated shimmer (CSS gradient sweep, left-to-right, 40f period) while "generating"
  - A small animated progress indicator (thin indigo line growing 0→100% along card bottom edge) over 60f
  - All 3 nodes complete simultaneously at frame 200: shimmer stops, card body reveals a cropped version of the master image adapted to each platform's aspect ratio, with a brief white flash (2f) and green checkmark badge (✓, 20×20px, #22C55E fill) appearing at top-right of each card
  - Card border color transitions: shimmer-gray (#E5E7EB) → completion-glow (#6366F1, opacity 0.8→0.3 over 20f)

- **"Running in parallel" visual accent**: A small label badge `"Running in parallel"` (Inter 500, 12px, white on #6366F1, pill shape, 8px padding) appears between the wires at local frame 125, fades out at frame 200.

**Camera behavior:** Starts at scale 0.9 (wide view of whole layout), pans from center → slightly right over frames 0–80 using easeIO to reveal platform nodes. At frame 120: gentle zoom-in (scale 0.9→1.0) as wires draw. At frame 195: brief zoom-in punch to platform nodes (scale 1.0→1.08, translateX −80→−120px) using spring stiffness 60, damping 22, to show all 3 completed cards. Scene fades out frames 245–270.
**Motion:** Selected ring: spring stiffness 200, damping 18. Wire draw: stroke-dashoffset easeOut cubic. Parallel progress bars: linear easing (no spring). Completion badge: spring stiffness 150, damping 15 (bouncy pop).
**Audio:** Voiceover `vellum_platform_scale.mp3` at local frame 5 (absolute frame 815).
**Implementation hints:** `VellumPlatformScale.tsx`. Reuse SVG wire draw pattern from VellumNodeDemo. Progress bars as `<div>` with width interpolation. Shimmer as CSS keyframe animation via inline style.

---

## Scene 6 — CTA
**Frames:** 1080–1260 (6s) — local frames 0–180
**On-screen copy:**
- Line 1 (Inter, 56px, weight 700, color #0A0A0A, springs in from +20px at frame 20): "Build your ultimate creative workflow."
- Line 2 (Inter, 56px, weight 700, color #6366F1, springs in from +20px at frame 55): "Try LayerProof Vellum today."
- Logo: LayerProof logotype (`layerproof-logo-dark.png` or dark variant, width 220px) fades in from frame 110, centered below text block
**Visual:** Pure white (#FFFFFF). Receives cross-fade from Scene 5 (opacity 0→1 over frames 0–18). Text block centered. Logo appears below lines separated by 36px margin. Everything fades out frames 155–180 to pure white (or holds to end).
**Motion:** Line 1: spring stiffness 80, damping 22. Line 2: spring stiffness 80, damping 22, +35f stagger. Logo: opacity 0→1 interpolate frames 110–145.
**Audio:** Voiceover `vellum_cta.mp3` at local frame 20 (absolute frame 1100).
**Implementation hints:** `VellumCTA.tsx`. Max-width 1100px text container for comfortable line lengths.

---

## Composition Registration

Add to `src/Root.tsx`:
```tsx
<Composition
  id="layerproof-vellum-master"
  component={LayerProofVellumMaster}
  durationInFrames={1260}
  fps={30}
  width={1920}
  height={1080}
/>
```

Create `src/compositions/LayerProofVellumMaster.tsx` wrapping all 6 scenes with `<Sequence>` at these absolute offsets:

| Scene | Component | from | durationInFrames |
|---|---|---|---|
| VellumHook | 0 | 100 |
| VellumNodeDemo | 100 | 300 |
| VellumConsistency | 400 | 90 |
| VellumFiveAngles | 490 | 230 |
| VellumEfficient | 720 | 90 |
| VellumPlatformScale | 810 | 270 |
| VellumCTA | 1080 | 180 |

Scene files go in `src/components/scenes/vellum/`.

## Render Command

```bash
npx remotion render layerproof-vellum-master --output out/layerproof-vellum-master.mp4
```

Add to `package.json` scripts:
```json
"render:vellum": "remotion render layerproof-vellum-master --output out/layerproof-vellum-master.mp4"
```

## Verification

1. Run `npm run dev` and open the `layerproof-vellum-master` composition in Remotion Studio
2. Scrub through each scene boundary to verify cross-fades are clean (frames 85–100, 385–400, 475–490, 705–720, 795–810, 1065–1080)
3. Check wire draw animations in Scene 1 and Scene 5 — wires should fully draw within their specified frame windows
4. Confirm all 3 platform nodes complete simultaneously at Scene 5 frame 200
5. Render a preview clip with `--frames=0-100` for each scene segment for fast QA
