---
composition: layerproof-problem
id: layerproof-problem
dimensions: 1920x1080
fps: 30
totalFrames: 990
status: approved
---

# Teaser 1: The Problem

## Scene 1 — TheSetup
**Frames:** 0–210 (7s)
**On-screen copy:**
- Narrator (bottom center, fades in at frame 60): "Still jumping between editors for one social post?"
**Visual:** Dark browser window (Chrome) with 4 active tabs — Canva, Google Docs, Hootsuite, Notion. The browser cycles through each app in turn (~52 frames per app), displaying the respective mock UI (canva.com/design/social-post-q4, docs.google.com/d/content-strategy-q4, hootsuite.com/dashboard/streams, notion.so/workspace/content-calendar). An animated cursor clicks between tabs, ripples on click. Radial dark vignette around the edges.
**Motion:** 3D camera starts strongly angled (18° rotateX, −14° rotateY, +60px Y, −40px X, scale 1.05) and slowly normalises to near-flat (2°, −1°, 0, 0, 1.0) over the full 210 frames. Scene fades in over 15f, fades out over final 15f. Narrator text fades in at frame 60–90.
**Audio:** Background music (`background-musicA.mp3`) fades in from 0→0.7 over frames 0–30, holds. No voiceover.
**Implementation hints:** `TheSetup.tsx`, `ChromeBrowser`, `MockCanva`, `MockGoogleDocs`, `MockHootsuite`, `MockNotion`, `Cursor` (cursorKFs span all 4 tab phases), `BrandIcons`.

---

## Scene 2 — RewriteLoop
**Frames:** 210–390 (6s) — local frames 0–180
**On-screen copy:**
- Headline (right panel): "One photo. Four different crops."
- Subtext (right panel): "Each platform needs a different aspect ratio"
- Platform labels (right panel, stagger in): Instagram 1:1, Instagram Story 9:16, LinkedIn 1.91:1, Twitter/X 16:9 — each marked with ✗ (red) when the crop phase passes
**Visual:** Split layout. Left: a crop editor (Canva-style) showing a photo with an animated bounding box that changes size per platform ratio — the crop box animates between Instagram square (440×440), Story portrait (248×440), LinkedIn landscape (840×440), and Twitter wide (782×440). A "% wasted" warning badge appears per phase (orange → red as waste increases). Right: a vertical list of the 4 platforms with icons, the active one highlighted with its brand color.
**Motion:** Scene fades/scales in (spring stiffness 50, damping 22). Crop box resizes abruptly with 10f snaps between phases. Platform rows spring in from left (stagger 10f apart, stiffness 70, damping 18). Cursor drags crop handles, then clicks the next platform tab. An "Undo" tooltip flashes briefly (frames 28, 68, 112, 152). A ratio lock icon pulses near the crop corner.
**Audio:** Continuous `background-musicA.mp3` (from Scene 1). No voiceover.
**Implementation hints:** `RewriteLoop.tsx`, `CropEditor.tsx`, `PlatformRow`, `Cursor` (cursorKFs follow crop handle → tab pattern for all 4 phases).

---

## Scene 3 — TensionMoment
**Frames:** 390–660 (9s) — local frames 0–270
**On-screen copy:**
- Headline (left panel): "Every platform speaks a different language."
- Subtext (left panel): "And you have to write fluently in all of them."
**Visual:** Split layout. Left: the headline/subtext text block. Right: a `CyclingEditor` component — a mock content editor that cycles through different platform post formats (Instagram caption → LinkedIn article snippet → Twitter/X thread → repeat). The editor content changes on three click events (frames 20, 120, 222 local). Cursor clicks a "Next Platform" style control repeatedly. Dark vignette, top/bottom gradient fade.
**Motion:** Scene springs in (stiffness 50, damping 22). Left text fades in at local frame 5–20. Right editor rises in from +36px (spring stiffness 60, damping 20). Cursor moves to a control at frame ~17, clicks at 20, returns; repeats at 113→120 and 215→222. Very deliberate pacing — 9 seconds, Apple keynote weight.
**Audio:** Continuous `background-musicA.mp3`. No voiceover.
**Implementation hints:** `TensionMoment.tsx`, `CyclingEditor.tsx`, `Cursor`.

---

## Scene 4 — ProblemTagline
**Frames:** 660–840 (6s) — local frames 0–180
**On-screen copy:**
- Badge (top, fades in from frame 2): "⏱ Two hours later. Still on the first draft."
- Tagline words (stagger from frame 22): "What" "if" "you" "didn't" "have" "to?"
- Prompt card textarea (fades in frame 70–100): "Create a campaign to promote LayerProof's new AI feature launch."
- Generate button (highlighted from frame 148): highlighted state
**Visual:** Centered composition. A "Two hours later" pill badge (red-tinted glass, slow heavy spring in, blur clears). Below it, 6 tagline words spring up from +40px, blurring in one by one (stagger 6f each, starting frame 22). Below that, a `PromptInputBox` card fades up — text types itself from frame 108–145. Camera slowly zooms in (1×→1.22×) from frame 100, targeting the card lower-center. Cursor moves to Generate button at frame 148, clicks at 150. A radial dark burst expands from the button position and a dark screen wipe covers everything by frame 178.
**Motion:** Badge: spring stiffness 22, damping 26 (very slow, weighty). Words: spring apple config (stiffness 80, damping 22). Camera: spring stiffness 32, damping 28. Zoom frozen at frame 150 so the burst doesn't glitch. Burst diameter 80→2800px ease-in-out-quad over 30 frames. Scene transitions into black.
**Audio:** Continuous `background-musicA.mp3`. No voiceover. (Audio cue: the "Generate" click lands at absolute frame 810.)
**Implementation hints:** `ProblemTagline.tsx`, `PromptInputBox`, `Cursor`.

---

## Scene 5 — ProblemLogoOut
**Frames:** 840–990 (5s) — local frames 0–150
**On-screen copy:**
- Subtext (centered, then slides down): "There's a better way."
- Logo: LayerProof logotype (`layerproof-logo-white.png`, 800×200)
**Visual:** Black screen receives the wipe from Scene 4. The tagline subtext "There's a better way." appears centered (letter-spacing 8, uppercase, weight 300, opacity 0.55 white). Then the LayerProof logo scales in above center. The tagline slides from center down ~110px to rest below the logo. Everything fades out over the final 28 frames.
**Motion:** Entry: dark flash overlay fades 1→0 over 35f (inherits wipe from Scene 4). Tagline: `fadeIn` starting at local frame 38 over 35f. Logo: `fadeIn` at frame 80 over 40f, spring stiffness 40, damping 22. Tagline slide: spring stiffness 120, damping 18 (snappy). Exit: `fadeOut` at frame 118 over 28f.
**Audio:** `background-musicA.mp3` fades from 0.7→0 over frames 930–990 (absolute). No voiceover.
**Implementation hints:** `ProblemLogoOut.tsx`.
