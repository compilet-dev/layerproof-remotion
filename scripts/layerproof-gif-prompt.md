---
composition: layerproof-gif-prompt
id: layerproof-gif-prompt
dimensions: 1270x760
fps: 30
totalFrames: 360
status: approved
---

# GIF: Prompt Multi-Platform

Loopable 12-second GIF. Three-phase story: prompt → editor generates → platform cards reveal with headline.

## Phase 1 — Prompt Scene
**Frames:** 0–95 (~3.2s)
**On-screen copy:**
- Prompt text (types itself): "Promote www.layerproof.app new AI feature"
- Generate button (highlighted near end)
**Visual:** Decorated prompt scene on dark background. Floating platform cards and icons orbit around the centered search/prompt bar (brand colors yellow #F5E642, pink #FF5C9E). The prompt bar receives typed text. At frame 83 (`PHASE1_CLICK`), the cursor clicks Generate — white flash transition fires.
**Motion:** Floating cards orbit with gentle sinusoidal motion. Prompt text types progressively. Cursor moves to Generate, clicks at frame 83. White burst expands, white wipe at ~frame 96.
**Audio:** None (GIF — no audio).
**Implementation hints:** Phase 1 runs 0–95 inside `PromptMultiPlatform.tsx`. Editor scale factor `EDITOR_SCALE = 1270/1920`. `YELLOW = "#F5E642"`, `PINK = "#FF5C9E"`.

---

## Phase 2 — Editor Generation
**Frames:** 96–225 (~4.3s) — `PHASE2_START = 96`
**On-screen copy:**
- Post content in editor right panel (types itself)
- Platform tab labels
**Visual:** `LayerProofEditor` springs in (scaled by `EDITOR_SCALE = 1270/1920`, centered vertically). Image generates, posts stagger in, content types in the right content panel. Cursor clicks the LinkedIn tab at frame 150 (local). Reformat flash. Camera zooms into content panel.
**Motion:** Editor entry spring (apple config). Same camera choreography as SplitExplosion, scaled to canvas size. Tab switch pulse on click.
**Audio:** None (GIF — no audio).
**Implementation hints:** Phase 2 offset `PHASE2_START = 96`. `Cursor` keyframes offset accordingly.

---

## Phase 3 — Platform Card Strip
**Frames:** 226–360 (~4.5s) — `PHASE3_START = 226`
**On-screen copy:**
- Line 1 (Anton font, stagger from `TEXT_LINE1_P3 = 65` local): headline copy (yellow words)
- Line 2 (stagger after): continuation (pink words)
**Visual:** UIFloat-style horizontal card strip — 7 platform post cards (TikTok, Instagram, Facebook, YouTube, Instagram Story, LinkedIn, Twitter) in native aspect ratios, springing in from below with stagger. Gentle float after settling. Strip pans left. Dark scrim fades in (`OVERLAY_IN_P3 = 50`, `OVERLAY_OUT_P3 = 72` local). Anton headline appears word by word over the scrim. Fades out frames 345–360 (`FADE_OUT_START`, `FADE_OUT_END`) for clean loop back to Phase 1.
**Motion:** Cards: spring stiffness 110, damping 22, mass 0.85. Float: sinusoidal. Pan: `easeIO`. Overlay: 0→0.8 over 22f local. Words: spring stiffness 90, damping 18, stagger 7f. Fade out frames 345–360 (absolute) = 119–134 local.
**Audio:** None (GIF — no audio).
**Implementation hints:** `PHASE3_START = 226`, `SETTLED_P3 = 35` (local). Uses same `PlatformMockups` as UIFloat scene. `ANTON_FAMILY` font.
