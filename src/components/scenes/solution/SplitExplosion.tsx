// src/components/scenes/solution/SplitExplosion.tsx
// Scene 3: LayerProofEditor springs in (330–510f)
// Camera zooms into right content panel during typing, then pulls out for LinkedIn click

import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { easeOut3, easeIO3 } from "../../../lib/animations";
import { useTheme } from "../../../lib/theme";
import { LayerProofEditor } from "../../ui/editor";
import { Cursor, CursorKeyframe } from "../../ui/Cursor";

export const SplitExplosion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // ── Editor entry spring ────────────────────────────────────────────────────
  const entrySpring = spring({ frame: Math.max(0, frame), fps, config: theme.motion.apple });
  const editorOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const editorScale = interpolate(entrySpring, [0, 1], [0.93, 1]);
  const editorTranslateY = interpolate(entrySpring, [0, 1], [28, 0]);

  // ── Posts stagger in ───────────────────────────────────────────────────────
  const postsVisible = Math.min(4, Math.floor(
    interpolate(frame, [10, 55], [0, 4.99], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  ));

  // ── Content typing ─────────────────────────────────────────────────────────
  const CONTENT_LEN = 350;
  const contentChars = Math.floor(
    interpolate(frame, [15, 130], [0, CONTENT_LEN], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );

  // ── Tab switch at F150 — fires when cursor clicks the LinkedIn tab ──────────
  const activeTabIndex = frame < 150 ? 0 : 2;
  const tabSwitchSpring = spring({ frame: Math.max(0, frame - 150), fps, config: { stiffness: 70, damping: 18 } });
  const tabSwitchScale = frame >= 150 ? interpolate(tabSwitchSpring, [0, 0.5, 1], [1, 1.018, 1]) : 1;

  // ── Image generation phase ────────────────────────────────────────────────
  // Image generates during frames 5–68; camera focuses center preview during this time
  const GEN_START = 5;
  const GEN_END   = 68;
  const imageGenerating  = frame >= GEN_START && frame < GEN_END + 12;
  const imageGenProgress = Math.min(1, Math.max(0, (frame - GEN_START) / (GEN_END - GEN_START)));

  // ── Camera — frame-exact interpolation (no springs, no drift) ────────────

  // Phase 1 — zoom to center for image generation  (5→28 in, 28→70 hold, 70→84 out)
  const p1InT  = easeOut3((frame - 5)  / 23);
  const p1OutT = easeIO3( (frame - 70) / 14);
  const p1Zoom = frame < 5   ? 1
               : frame < 28  ? 1 + 0.22 * p1InT
               : frame < 70  ? 1.22
               : frame < 84  ? 1.22 - 0.22 * p1OutT
               : 1;

  // Phase 2 — zoom to right content panel while typing  (86→106 in, 106→125 hold, 125→142 out)
  // Zoom-out pans BACK TO CENTER so the full editor is visible before the cursor click.
  const p2InT  = easeOut3((frame - 86)  / 20);
  const p2OutT = easeIO3( (frame - 125) / 17);
  const p2Zoom = frame < 86  ? 1
               : frame < 106 ? 1 + 0.30 * p2InT
               : frame < 125 ? 1.30
               : frame < 142 ? 1.30 - 0.30 * p2OutT
               : 1;

  // LinkedIn tab exact canvas coords:
  // x = (96 inset + 260 sidebar + 16 tab-padding + 143 tab0 + 2 gap + 139 tab1 + 2 gap + 49.5 half-tab2) / 1920
  //   = 707.5 / 1920 ≈ 0.368
  // y = (64 inset + 48 TopBar + 23 half-tab-height) / 1080 = 135/1080 ≈ 0.125
  const TAB_X = 0.368;
  const TAB_Y = 0.125;

  // Right content panel center — this is where the reformatted LinkedIn post lives.
  // x ≈ midpoint between sidebar-right (96+260=356px) and editor-right (1920-96=1824px) = 1090/1920 ≈ 0.568
  // We bias slightly right to frame the post card nicely.
  const CONTENT_X = 0.62;
  const CONTENT_Y = 0.44;

  // Phase 3 — click → punch into content panel → hold (show reformatted post) → snap-back
  //
  //   Phase breakdown (balanced against Phase 1's 79f and Phase 2's 56f):
  //   150→174 : punch in  (24f) — energetic zoom to content panel
  //   174→246 : hold      (72f) — LinkedIn post fills frame, viewer reads the reformat
  //   246→264 : snap-back (18f) — pull-out reveals full editor
  //   264→310 : settle    (46f ≈ 1.5s) — editor rests, then scene fades out
  //
  const p3InT  = easeOut3((frame - 150) / 24);
  const p3OutT = easeIO3( (frame - 246) / 18);
  const p3Zoom = frame < 150 ? 1
               : frame < 174 ? 1 + 0.60 * p3InT
               : frame < 246 ? 1.60
               : frame < 264 ? 1.60 - 0.60 * p3OutT
               : 1;

  const camZoom = p1Zoom * p2Zoom * p3Zoom;

  // Camera target X:
  //  Phase 2 out (125→142): pans from right panel back to center
  //  Hold (142→150): center, full editor visible, cursor walking to tab
  //  Phase 3 in  (150→174): dives into right content panel
  //  Phase 3 hold (174→246): locked on reformatted LinkedIn post
  //  Phase 3 out  (246→276): snaps back to center
  const camTargetX = frame < 86  ? 0.50
                   : frame < 106 ? 0.50  + 0.385 * p2InT
                   : frame < 125 ? 0.885
                   : frame < 142 ? 0.885 - 0.385 * p2OutT
                   : frame < 150 ? 0.50
                   : frame < 174 ? 0.50 + (CONTENT_X - 0.50) * p3InT
                   : frame < 246 ? CONTENT_X
                   : frame < 264 ? CONTENT_X + (0.50 - CONTENT_X) * p3OutT
                   : 0.50;

  const camTargetY = frame < 150 ? 0.50
                   : frame < 174 ? 0.50 + (CONTENT_Y - 0.50) * p3InT
                   : frame < 246 ? CONTENT_Y
                   : frame < 264 ? CONTENT_Y + (0.50 - CONTENT_Y) * p3OutT
                   : 0.50;

  // Reformat flash — white burst on click, fades fully before hold begins
  const reformatFlash = interpolate(frame, [150, 153, 172], [0, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene fade-out — graceful exit after the settle period
  const sceneFadeOut = interpolate(frame, [310, 360], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Correct formula: with transformOrigin=50% 50%, translate = (0.5 - target) * 100
  // This ensures the target pixel is always centered on screen regardless of zoom level.
  const camTX = (0.5 - camTargetX) * 100;
  const camTY = (0.5 - camTargetY) * 100;

  // ── Cursor ────────────────────────────────────────────────────────────────
  const cursorKFs: CursorKeyframe[] = [
    { frame: 10,  x: 0.50,   y: 0.52   },   // center preview (image generating)
    { frame: 60,  x: 0.50,   y: 0.52   },   // hold
    { frame: 90,  x: 0.52,   y: 0.52   },   // move to content panel (centered on screen)
    { frame: 110, x: 0.52,   y: 0.52   },   // hold while typing
    // ── Cursor travels to the LinkedIn tab (45f approach) ───────────────────
    // Starts moving at 105, camera zooms back to 1x and pans to center by 142.
    // At zoom=1 the LinkedIn tab lives at (TAB_X=0.368, TAB_Y=0.125) in screen space.
    { frame: 105, x: TAB_X,  y: TAB_Y  },   // begin long approach — heading toward tab
    { frame: 142, x: TAB_X,  y: TAB_Y  },   // arrive — camera cleared, tab visible here
    { frame: 148, x: TAB_X,  y: TAB_Y  },   // hover one beat over the tab
    { frame: 150, x: TAB_X,  y: TAB_Y, click: true }, // CLICK — zoom punch fires
    // ── Camera dives into content panel, cursor follows ──────────────────────
    { frame: 176, x: 0.50,   y: 0.50   },   // arrive at content panel (zoom-in complete)
    { frame: 244, x: 0.50,   y: 0.50   },   // hold — read the reformatted LinkedIn post
    // ── Snap-back reveals full editor ────────────────────────────────────────
    { frame: 270, x: 0.52,   y: 0.52   },   // drift to center as zoom-out completes
    { frame: 370, x: 0.52,   y: 0.52   },   // hold — full editor view
  ];

  // ── Entry white fade — matches OnePrompt's flash wipe ─────────────────────
  const entryWhite = interpolate(frame, [0, 38], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#0A0A0A",
        opacity: sceneFadeOut,
      }}
    >
      {/* Subtle vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Camera zoom wrapper */}
      <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: `scale(${camZoom}) translate(${camTX}%, ${camTY}%)`,
            transformOrigin: "50% 50%",
            willChange: "transform",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "64px 96px",
              opacity: editorOpacity,
              transform: `scale(${editorScale * tabSwitchScale}) translateY(${editorTranslateY}px)`,
              transformOrigin: "center center",
              willChange: "transform",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.05)",
            }}
          >
            <LayerProofEditor
              activeTabIndex={activeTabIndex}
              contentChars={contentChars}
              postsVisible={postsVisible}
              activePostIndex={0}
              frame={frame}
              imageGenerating={imageGenerating}
              imageGenProgress={imageGenProgress}
            />
          </div>
        </div>
      </div>

      {sceneFadeOut > 0 && <Cursor keyframes={cursorKFs} />}

      {/* Reformat flash — white burst on LinkedIn click, sells instant reformatting */}
      {reformatFlash > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#FFFFFF",
            opacity: reformatFlash,
            zIndex: 50,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Entry overlay — fades out to reveal the editor */}
      {entryWhite > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#0A0A0A",
            opacity: entryWhite,
            zIndex: 100,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
