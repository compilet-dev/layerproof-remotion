---
composition: layerproof-gif-slides
id: layerproof-gif-slides
dimensions: 1200x675
fps: 30
totalFrames: 205
status: approved
---

# GIF: AI Slide Stack

Loopable 6.8-second GIF. AI-generated presentation slides stack one by one into a growing deck, demonstrating LayerProof's presentation content type.

## Phase — SlideStackPhase
**Frames:** 0–205 (~6.8s)
**On-screen copy:**
- Slide content labels/text on individual slide cards (varies per slide design)
- No persistent headline overlay
**Visual:** On the `GifShell` (1200×675, dark background), individual slide cards appear one by one and stack into a deck. Each slide has its own visual content (image, headline, layout). The stack grows across the scene. `posterFrame={50}` is set in Root.tsx so the thumbnail shows the stack mid-build. Loop: composition loops cleanly from frame 205 back to 0.
**Motion:** Slides stack with spring-based entrance animation (likely scale + translateY per card, stagger). The deck accumulates naturally. Timing matches a deliberate cadence — one slide per ~1–1.5 seconds.
**Audio:** None (GIF — no audio).
**Implementation hints:** `SlideStackPhase.tsx` (inside `src/components/gif/phases/`), `GifShell`, `AISlideStack.tsx`. `posterFrame={50}` set in Root.tsx registration.
