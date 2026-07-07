# LayerProof Brand Kit — Video Script

**Composition:** `layerproof-brand-kit`
**Duration:** 1440 frames @ 30fps = 48s
**Dimensions:** 1920×1080
**Theme:** Dark (`#080808` bg, `#FF589B` accent pink, `boldTheme`)

---

## Scene 1 — Hook (0–210f, 7s)

**Goal:** Explosive visual of quantity — 20 social assets already looking consistent.

**Visual:**
- Dark background, 4 rows of 5 platform mini-cards stagger in (spring bounce, stiffness 180, damping 16)
- Each card: glass dark surface, platform icon, content type label, pink accent bottom bar
- Cards delay 4f apart (card 0 at 0f, card 19 at 76f)
- Frame 90: hero text appears word-by-word: "Create **100s** of Social Posts & Presentations"
- Frame 120+: checklist stagger: ✓ Brand colors / ✓ Logos & assets / ✓ Image library / ✓ Brand voice
- Exit: 190–210f

**Copy:**
- "Create 100s of Social Posts & Presentations"
- "✓ Brand colors  ✓ Logos & assets  ✓ Image library  ✓ Brand voice"

---

## Scene 2 — The Secret (210–510f, 10s)
_Local frames: 0–300_

**Goal:** Reveal the Brand Kit import mechanism. Brand DNA in, consistent output out.

**Visual:**
- Frames 5–30: "The secret?" fades in large, then fades out
- Frames 28+: URL import panel slides in with spring
  - Label: "A Brand DNA layer" (uppercase muted)
  - Dark glass card with URL input field (pink accent border when active)
  - "Paste a URL / Drop a PDF" alternating badge (cycles every 60f)
  - Cursor slides in, types "layerproof.app" (frames 50–110)
  - "Import" button highlighted when URL complete
  - Progress bar fills 0→100% (frames 110–170)
- Frames 165+: Brand kit overview card springs in
  - Logo swatch (◈ in pink), 5 brand color circles, font name, voice excerpt
  - "✓ Imported successfully"
- Frame 210: "Brand Theme: LayerProof" pink badge springs up
- Exit: 280–300f

**Copy:**
- "The secret?"
- "A Brand DNA layer"
- "Paste a URL / Drop a PDF"
- "Brand Theme: LayerProof"

---

## Scene 3 — Creative Suite (510–690f, 6s)
_Local frames: 0–180_

**Goal:** Show what's unlocked. Two content types ready to go.

**Visual:**
- Frame 5+: Header fades in — "Unlock the Creative Suite"
  - "Brand Kit Active" label in pink above headline
- Frame 40+: "Social Post" card slides in from left
  - Icon 📱, subtitle "Single post + Carousel", pink glow border, bottom accent bar
- Frame 60+: "Presentation" card slides in from right
  - Icon 📊, subtitle "Slide deck + Templates", same treatment
- Each card scales 1→1.04→1 (pulse) on arrival
- Subtle dot grid texture in background
- Exit: 160–180f

**Copy:**
- "Brand Kit Active"
- "Unlock the Creative Suite"
- "Social Post — Single post + Carousel"
- "Presentation — Slide deck + Templates"

---

## Scene 4 — Execution (690–1110f, 14s)
_Local frames: 0–420_

**Goal:** Show the workflow: select brand theme → type one prompt → AI does the rest.

**Phase A (0–90f):** Theme selection
- PromptInputBox centered (cardOnly mode), slow camera zoom (1→1.08)
- Cursor moves to theme dropdown area (frame 45), clicks (frame 60)
- Dropdown opens: LayerProof / Default / Minimal / Bold, "LayerProof" highlighted pink
- Cursor moves to "LayerProof" (frame 95), clicks (frame 130)
- "Brand Theme: LayerProof" badge appears above prompt box
- Callout badge right side: "Select **Brand Theme**" (frame 60)

**Phase B (90–200f):** Dropdown open & theme select
- Dropdown spring in, item highlighted, cursor clicks, badge selected

**Phase C (200–420f):** Typing prompt
- Cursor fades out
- Text types into prompt: "Launch LayerProof Brand Kit feature" (frames 200–340)
- Callout badge: "Type a **Short Prompt**" (frame 200)
- Callout badge: "AI enforces the **Rules**" (frame 350)
- Generate button highlighted at frame 380
- Exit: 400–420f

**Copy:**
- "Select Brand Theme" (badge)
- "Type a Short Prompt" (badge)
- "AI enforces the Rules" (badge)
- Prompt text: "Launch LayerProof Brand Kit feature"

---

## Scene 5 — Output + CTA (1110–1440f, 11s)
_Local frames: 0–330_

**Goal:** Prove brand consistency across 3 outputs. End with clear CTA.

**Phase A (0–120f):** 3-way split screen
- 3 equal columns, dark dividers
- Col 1: Instagram post mockup (springs in, frame 0)
- Col 2: Presentation slide (custom dark slide, springs in, frame 15)
- Col 3: Carousel stack — 3 stacked cards (springs in, frame 30)
- All columns have "◈ LayerProof Brand Kit" pink badge
- All share pink accent, ◈ logo in top-left

**Phase B (80–180f):** Brand highlight pulses
- White glow flash at frames 80, 110, 140 (color, logo, font)

**Phase C (180–330f):** Fade to CTA
- Split fades out (180–210f)
- Logo (◈ + "LayerProof") springs in (frame 200)
- "100% **Brand Consistency**" slides up (frame 220, 72px)
- "Brand Kit in LayerProof" fades in (frame 260, 28px gray)
- "layerproof.app" in pink fades in (frame 290, 22px)

**Copy:**
- "100% Brand Consistency"
- "Brand Kit in LayerProof"
- "layerproof.app"

---

## Reused Utilities

| Utility | Source |
|---|---|
| `boldTheme` | `src/lib/themes/bold.ts` |
| `useTheme()` | `src/lib/theme.ts` |
| `springReveal()` | `src/lib/animations.ts` |
| `getTypedText()` | `src/lib/animations.ts` |
| `glassCard()` | `src/lib/animations.ts` |
| `Cursor` | `src/components/ui/Cursor.tsx` |
| `PromptInputBox` | `src/components/ui/PromptInputBox.tsx` |
| `InstagramMockup` | `src/components/ui/mockups/InstagramMockup.tsx` |
