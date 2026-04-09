---
composition: layerproof-solution
id: layerproof-solution
dimensions: 1920x1080
fps: 30
totalFrames: 1330
status: approved
---

# Teaser 2: The Solution

## Scene 0 — OpeningQuestion
**Frames:** 0–155 (5.2s) — local frames 0–155
**On-screen copy:**
- Line 1 (Anton font, 84px, uppercase, word-by-word stagger from frame 22):
  "Tired" (white) "of" (white) "reformatting" (white) "the" (yellow #F5C842) "same" (yellow) "post" (yellow)
- Line 2 (stagger after Line 1 completes):
  "for" (white) "every" (pink #FF589B) "single" (pink) "platform?" (pink)
- No subtext
**Visual:** Deep warm dark background — `linear-gradient(135deg, rgb(82,19,46) 0%, rgb(32,14,9) 60%, #1C0C08 70%)`. Centered text block. Below the two headline lines: a horizontal overlapping stack of 6 platform icons (Instagram, Facebook, Twitter/X, TikTok, YouTube, LinkedIn) each tilted at slightly different angles (−13°, 7°, −5°, 11°, −9°, 4°), appearing with stagger after the text finishes. Subtle vignette overlay.
**Motion:** Scene fades in 0→1 over 18f, fades out 135→155 (1→0). Words spring up from +32px with blur (stiffness 80, damping 20, stagger 6f). Platform icons: spring stiffness 90, damping 18, stagger 3f, each scaling from 0.6 and rising from +32px.
**Audio:** Voiceover (`opening_question.mp3`) starts at absolute frame 15 (local frame 15). Background music not yet playing.
**Implementation hints:** `OpeningQuestion.tsx`, `PlatformIcon` sub-component, `ANTON_FAMILY` font. Word stagger: LINE1_START=22, LINE2_START=LINE1+36+8=80, ICONS_START=LINE2+24+10.

---

## Scene 1 — DashboardReveal
**Frames:** 155–305 (5s) — local frames 0–150
**On-screen copy:**
- Logo name: "LayerProof" (DM Sans, 100px, weight 700, slides in from right at local frame 46)
- No other text
**Visual:** Dark background (#0A0A0A). Left half: LogoProof symbol (180px) springs dramatically in at center, then shifts left as the brand name reveals. Right half (starting ~frame 13): three scrolling columns of mixed content cards (slide images + text labels like "CONTENT STRATEGY", "BRAND VOICE", "PUBLISH EVERYWHERE") rotating at different speeds (col 0: +6, col 1: −7, col 2: +6.5), slightly rotated 4°. Left-edge and top/bottom gradients blend the grid into the dark background. The entire lockup (symbol + wordmark) fades out at frame 100–128.
**Motion:** Symbol: spring stiffness 260, damping 14 — big dramatic overshoot entry. Symbol breathes (sinusoidal ±2%) after settling at frame 22. Lockup shifts left via spring (apple config, stiffness 80, damping 22) starting frame 38. Wordmark slides in from +48px right. Grid fades in frames 13–33. Exit: lockup fades 100→128.
**Audio:** `star_sfx.wav` (volume 0.12, startFrom=30) at local frame 5. Voiceover `meetLayerProof.mp3` at local frame 60. Background music (`background-music.mp3`) starts at absolute frame 155 (local frame 0), volume 0→0.08 over 20f.
**Implementation hints:** `DashboardReveal.tsx`, `ScrollColumn`, `Card` sub-components, `DM_SANS_FAMILY`, `staticFile('slides/slide_0N.jpg')` for card images.

---

## Scene 2 — OnePrompt
**Frames:** 305–510 (6.8s) — local frames 0–205
**On-screen copy:**
- Prompt textarea: "Create a campaign to promote Layerproof's new AI feature launch." (types itself frames 25–130)
- Generate button: highlighted (pink) from frame 143
- No headline text
**Visual:** Centered `PromptInputBox` card on near-black (#0D0D0D) background. The card springs in from +36px at frame 2, fades in 0→1 over 20f. Text types progressively. Camera zooms in gradually (1×→1.28× base by frame 8, then +0.34 punch from frame 138). Camera pans slightly right toward the Generate button. Cursor moves from textarea center to the Generate button at frame 148, clicks at 152. White radial burst (80→2800px diameter) expands from the button, followed by a full white screen wipe by frame 186. Scene transitions out through white.
**Motion:** Card entry spring: apple config (stiffness 80, damping 22). Camera: base zoom spring stiffness 40, damping 28; pan spring stiffness 52, damping 22; punch spring stiffness 55, damping 20. Camera frozen at frame 152 to prevent glitch during burst. Burst ease-in-out-quad over 32f.
**Audio:** Voiceover `prompt.mp3` starts at local frame 0 (absolute frame 305).
**Implementation hints:** `OnePrompt.tsx`, `PromptInputBox`, `Cursor`.

---

## Scene 3 — SplitExplosion
**Frames:** 510–890 (12.7s) — local frames 0–380
**On-screen copy:**
- No persistent headline text
- Post content in the editor (types itself frames 15–130, ~350 chars)
- Platform tab labels: "Instagram" (active 0–149), "LinkedIn" (active 150+)
**Visual:** Full-screen `LayerProofEditor` (inset 64px top/bottom, 96px sides) springs in on dark background (#0A0A0A). The editor shows a generated post with image, 4 platform post previews (Instagram, Story, LinkedIn, Twitter) staggering in frames 10–55. Content text types in right panel. At frame 150, the cursor clicks the LinkedIn tab — the editor snaps to the LinkedIn post view. Three camera zoom phases: (1) zoom to center for image generation (frames 5–84, peak 1.22×), (2) zoom right content panel during typing (frames 86–142, peak 1.30×), (3) hard dive into LinkedIn content (frames 150–264, peak 1.60×, holds 72f), then snap-back to full editor (frames 264–310). Scene fades out 310→360.
**Motion:** Editor entry: spring apple config. Camera zoom: precise easeOut3/easeIO3 interpolation (no springs) for exact control. Tab switch at frame 150: brief scale pulse (1→1.018→1, stiffness 70, damping 18). Reformat flash: white overlay 0→0.85→0 at frames 150–172. Entry overlay: dark fade out 1→0 over frames 0–38 (receives OnePrompt's white wipe).
**Audio:** Voiceover `editor.mp3` at local frame 0 (absolute frame 510).
**Implementation hints:** `SplitExplosion.tsx`, `LayerProofEditor`, `Cursor`. Camera math: `camTX = (0.5 - camTargetX) * 100`, transformOrigin always `50% 50%`.

---

## Scene 4 — UIFloat
**Frames:** 890–1100 (7s) — local frames 0–210
**On-screen copy:**
- Line 1 (Anton font, 100px, stagger from local frame 82): "ONE" (yellow #FFE600) "CAMPAIGN." (yellow) "SIX" (white) "PLATFORMS." (white)
- Line 2 (Anton font, 100px, stagger from local frame 138): "ONLY" (pink #FF3D8B) "IN" (pink) "THIRTY" (pink) "SECONDS." (pink)
**Visual:** Warm dark background (radial pink glow + dark gradient). 7 platform post cards in their correct aspect ratios (TikTok 320×568, Instagram 380×720, Facebook 480×535, YouTube 500×400, Instagram Story 320×568, LinkedIn 480×510, Twitter 500×460) arranged in a horizontal strip wider than the screen. Cards spring in from +70px with blur, each at a different delay (0–18f stagger). Cards gently float after settling (sinusoidal ±4px). Strip pans left over the scene duration. At frame 68–90: dark scrim fades in (0.8 opacity), and the bold headline text appears over the cards word by word. Scene fades out frames 185–210.
**Motion:** Card entry: spring stiffness 110, damping 22, mass 0.85. Float: `sin(frame * 0.04)` per card with unique phase offset. Pan: `easeIO(t)` over frames 20–195. Overlay scrim: opacity 0→0.8 frames 68–90. Words: spring stiffness 90, damping 18, stagger 7f.
**Audio:** Voiceover `UIFloat.mp3` at local frame 0 (absolute frame 890).
**Implementation hints:** `UIFloat.tsx`, `FlyInCard`, `Word`, `PlatformMockups` (InstagramMockup, TikTokMockup, LinkedInMockup, TwitterMockup, FacebookMockup, InstagramStoryMockup, YoutubeMockup), `ANTON_FAMILY`.

---

## Scene 5 — SolutionTagline
**Frames:** 1100–1330 (7.7s) — local frames 0–230
**On-screen copy:**
- Tagline (Anton font, 54px, uppercase, letter-spacing 2, fades in from local frame 20): "One prompt. Every platform."
- Logo: LayerProof logotype (`layerproof-logo-white.png`, 800×200, fades in from local frame 90)
**Visual:** Pure black (#080808) with radial vignette. The tagline "One prompt. Every platform." appears centered (opacity 0.55 white). Then the LayerProof logo scales in ~30px above center. The tagline slides from its center position down 110px so logo + tagline form a composed lockup. Everything fades out at local frames 190–225.
**Motion:** Tagline: `fadeIn` frames 20–60. Logo: `fadeIn` frames 90–140, spring stiffness 40, damping 22 (scale 0.92→1). Tagline slide: spring stiffness 120, damping 18 (snappy), starting at frame 90. Exit: `fadeOut` frames 190–225. Background music fades 0.08→0 between absolute frames 1175–1175 (held until end).
**Audio:** Voiceover `SolutionTagline.mp3` at local frame 25 (absolute frame 1125). Background music (`background-music.mp3`) fades out starting at absolute frame 1115.
**Implementation hints:** `SolutionTagline.tsx`, `ANTON_FAMILY`, `require('../../../assets/layerproof-logo-white.png')`.
