// src/components/scenes/problem/ProblemTagline.tsx
// Scene 4: "What if you didn't have to?" — camera zoom, typing, click → burst/flash

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useTheme } from "../../../lib/theme";
import { PromptInputBox } from "../../ui/PromptInputBox";
import { Cursor, CursorKeyframe } from "../../ui/Cursor";

// ─── Constants ────────────────────────────────────────────────────────────────

const WORDS = ["What", "if", "you", "didn't", "have", "to?"];
const PROMPT_TEXT =
  "Create a campaign to promote LayerProof's new AI feature launch.";

// Click frame — camera freezes here so burst doesn't glitch over a moving bg
const CLICK_F = 150;

// Zoom origin: card center (horizontally centered, lower half)
const ZOOM_OX = 0.5;
const ZOOM_OY = 0.64;
const ZOOM_TARGET = 1.22;

// Cursor screen position of Generate button after zoom 1.22 from (0.5, 0.64):
//   tx = 0,  ty = (0.5−0.64)×0.22 = −0.0308
//   screen_x = 0.5 + 1.22×(0.677−0.5) = 0.716
//   screen_y = 0.64 + 1.22×(0.683 − 0.0308 − 0.64) = 0.64 + 1.22×0.0122 = 0.655
const CURSOR_CLICK_X = 0.716;
const CURSOR_CLICK_Y = 0.655;

// ─── Component ────────────────────────────────────────────────────────────────

export const ProblemTagline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // ── "Two hours later" badge ────────────────────────────────────────────────
  const badgeSpring = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: { stiffness: 22, damping: 26 }, // very slow, weighty feel
  });
  const badgeOpacity = interpolate(badgeSpring, [0, 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeY = interpolate(badgeSpring, [0, 1], [60, 0]);
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.88, 1]);
  const badgeBlur = interpolate(badgeSpring, [0, 0.5], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Card entry ────────────────────────────────────────────────────────────
  const promptOpacity = interpolate(frame, [70, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const promptY = interpolate(
    spring({
      frame: Math.max(0, frame - 70),
      fps,
      config: { stiffness: 45, damping: 22 },
    }),
    [0, 1],
    [30, 0],
  );

  // ── Typing animation ──────────────────────────────────────────────────────
  const charsToShow = Math.floor(
    interpolate(frame, [108, 145], [0, PROMPT_TEXT.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const generateHighlighted = frame >= 148;

  // ── Camera zoom — frozen at CLICK_F so burst doesn't glitch ──────────────
  const camFrame = Math.min(frame, CLICK_F);

  const zoomSpring = spring({
    frame: Math.max(0, camFrame - 100),
    fps,
    config: { stiffness: 32, damping: 28 },
  });
  const zoom = interpolate(zoomSpring, [0, 1], [1, ZOOM_TARGET]);

  // Translate keeps the zoom origin visually centered on ZOOM_OX/OY
  const camTX = (0.5 - ZOOM_OX) * (zoom - 1) * 100; // = 0 since ZOOM_OX=0.5
  const camTY = (0.5 - ZOOM_OY) * (zoom - 1) * 100;

  // ── After-click burst ─────────────────────────────────────────────────────
  const burstT = Math.min(1, Math.max(0, (frame - CLICK_F) / 30));
  const burstEased =
    burstT < 0.5 ? 2 * burstT * burstT : 1 - Math.pow(-2 * burstT + 2, 2) / 2;
  const burstDiam = interpolate(burstEased, [0, 1], [80, 2800]);
  const burstOpacity = interpolate(
    burstT,
    [0, 0.08, 0.55, 1],
    [0, 0.8, 0.65, 0],
  );

  // Flash reaches opacity 1 at frame 178, scene ends at 180 → clean wipe
  const flashOpacity = interpolate(
    frame,
    [CLICK_F + 14, CLICK_F + 28],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // ── Cursor ────────────────────────────────────────────────────────────────
  const cursorKFs: CursorKeyframe[] = [
    { frame: 108, x: 0.5, y: 0.62 }, // blinking in textarea
    { frame: 142, x: 0.5, y: 0.62 }, // typing done — start moving
    { frame: 148, x: CURSOR_CLICK_X, y: CURSOR_CLICK_Y }, // arrive at Generate
    { frame: 149, x: CURSOR_CLICK_X, y: CURSOR_CLICK_Y },
    { frame: 150, x: CURSOR_CLICK_X, y: CURSOR_CLICK_Y, click: true },
    { frame: 162, x: CURSOR_CLICK_X, y: CURSOR_CLICK_Y }, // hold through burst
  ];

  return (
    <AbsoluteFill style={{ background: "#080808" }}>
      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Camera wrapper ─────────────────────────────────────────────────── */}
      <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: `scale(${zoom}) translate(${camTX}%, ${camTY}%)`,
            transformOrigin: `${ZOOM_OX * 100}% ${ZOOM_OY * 100}%`,
            willChange: "transform",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 48,
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* ── "Two hours later" badge ──────────────────────────────── */}
            <div
              style={{
                opacity: badgeOpacity,
                transform: `translateY(${badgeY}px) scale(${badgeScale})`,
                filter: `blur(${badgeBlur}px)`,
                willChange: "transform, filter",
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: "rgba(229,57,53,0.08)",
                border: "1px solid rgba(229,57,53,0.22)",
                borderRadius: 40,
                padding: "16px 40px",
                boxShadow:
                  "0 0 40px rgba(229,57,53,0.08), 0 8px 32px rgba(0,0,0,0.5)",
              }}
            >
              <span style={{ fontSize: 32, color: "#FFFFFF" }}>⏱</span>
              <span
                style={{
                  fontFamily: theme.font.family,
                  fontSize: 32,
                  fontWeight: theme.font.weightLight,
                  color: "rgba(255,255,255,0.8)",
                  letterSpacing: 0.2,
                  whiteSpace: "nowrap",
                }}
              >
                Two hours later. Still on the first draft.
              </span>
            </div>

            {/* ── Tagline words ────────────────────────────────────────── */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "baseline",
                gap: "0 20px",
                maxWidth: 1100,
                textAlign: "center",
              }}
            >
              {WORDS.map((word, i) => {
                const s = spring({
                  frame: Math.max(0, frame - (22 + i * 6)),
                  fps,
                  config: theme.motion.apple,
                });
                return (
                  <span
                    key={i}
                    style={{
                      fontFamily: theme.font.family,
                      fontSize: 68,
                      fontWeight: theme.font.weightMedium,
                      color: "#FFFFFF",
                      letterSpacing: 0.5,
                      opacity: interpolate(s, [0, 1], [0, 1]),
                      transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px) scale(${interpolate(s, [0, 1], [0.72, 1])})`,
                      filter: `blur(${interpolate(s, [0, 1], [12, 0])}px)`,
                      display: "inline-block",
                      willChange: "transform, filter",
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </div>

            {/* ── Prompt card ──────────────────────────────────────────── */}
            <div
              style={{
                opacity: promptOpacity,
                transform: `translateY(${promptY}px)`,
                willChange: "transform",
                width: 860,
                borderRadius: 28,
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,0.06), 0 24px 64px rgba(0,0,0,0.6)",
              }}
            >
              <PromptInputBox
                cardOnly
                hidePlaceholder
                promptText={PROMPT_TEXT}
                promptChars={charsToShow}
                frame={frame}
                showCursor={frame >= 108 && frame < CLICK_F}
                generateHighlighted={generateHighlighted}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Cursor — outside zoom wrapper, screen-space coords ─────────────── */}
      {frame >= 108 && <Cursor keyframes={cursorKFs} />}

      {/* ── Burst + flash — above everything ───────────────────────────────── */}
      {frame >= CLICK_F && (
        <>
          {/* Radial glow expanding from Generate button screen position */}
          <div
            style={{
              position: "absolute",
              left: `${CURSOR_CLICK_X * 100}%`,
              top: `${CURSOR_CLICK_Y * 100}%`,
              width: burstDiam,
              height: burstDiam,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(8,8,8,0.98) 0%, rgba(20,20,30,0.75) 40%, rgba(15,15,25,0.3) 70%, transparent 100%)",
              transform: "translate(-50%, -50%)",
              opacity: burstOpacity,
              zIndex: 50,
              pointerEvents: "none",
            }}
          />
          {/* Dark screen wipe */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#080808",
              opacity: flashOpacity,
              zIndex: 51,
              pointerEvents: "none",
            }}
          />
        </>
      )}
    </AbsoluteFill>
  );
};
