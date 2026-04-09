// src/components/scenes/solution/OnePrompt.tsx
// Scene 2: One prompt + camera zoom (150–360f)

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useTheme } from "../../../lib/theme";
import { Cursor, CursorKeyframe } from "../../ui/Cursor";
import { PromptInputBox } from "../../ui/PromptInputBox";

export const OnePrompt: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const promptText =
    "Create a campaign to promote Layerproof's new AI feature launch.";

  const charsToShow = Math.floor(
    interpolate(frame, [25, 130], [0, promptText.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  const generateHighlighted = frame >= 143;

  const appearSpring = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: theme.motion.apple,
  });
  const cardOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cardTranslateY = interpolate(appearSpring, [0, 1], [36, 0]);
  const cardScale = interpolate(appearSpring, [0, 1], [0.95, 1]);

  // Freeze camera at click frame so the burst doesn't glitch over a moving background
  const CLICK_F = 152;
  const camFrame = Math.min(frame, CLICK_F);

  const zoomBaseSpring = spring({
    frame: Math.max(0, camFrame - 8),
    fps,
    config: { stiffness: 40, damping: 28 },
  });
  const zoomBase = interpolate(zoomBaseSpring, [0, 1], [1, 1.28]);

  const panSpring = spring({
    frame: Math.max(0, camFrame - 130),
    fps,
    config: { stiffness: 52, damping: 22 },
  });
  const targetX = interpolate(panSpring, [0, 1], [0.5, 0.686]);
  const targetY = 0.616;

  const zoomPunchSpring = spring({
    frame: Math.max(0, camFrame - 138),
    fps,
    config: { stiffness: 55, damping: 20 },
  });
  const zoomPunch = interpolate(zoomPunchSpring, [0, 1], [0, 0.34]);
  const currentZoom = zoomBase + zoomPunch;

  const camTranslateX = (0.5 - targetX) * (currentZoom - 1) * 100;
  const camTranslateY = (0.5 - targetY) * (currentZoom - 1) * 100;

  const cursorKFs: CursorKeyframe[] = [
    { frame: 20, x: 0.5, y: 0.56 }, // blinking in textarea
    { frame: 130, x: 0.5, y: 0.6 }, // typing done, move toward Generate
    { frame: 148, x: 0.52, y: 0.63 }, // arrived at Generate button
    { frame: 152, x: 0.52, y: 0.63, click: true }, // click!
    { frame: 162, x: 0.52, y: 0.63 }, // brief hold — burst covers rest
  ];

  // ── After-click burst transition ──────────────────────────────────────────
  const burstT = Math.min(1, Math.max(0, (frame - CLICK_F) / 32));
  // ease-in-out-quad
  const burstEased =
    burstT < 0.5 ? 2 * burstT * burstT : 1 - Math.pow(-2 * burstT + 2, 2) / 2;
  // Radial glow circle expands from Generate button (~52%, ~63.5% screen)
  const burstDiam = interpolate(burstEased, [0, 1], [80, 2800]);
  const burstOpacity = interpolate(burstT, [0, 0.08, 0.55, 1], [0, 0.8, 0.65, 0]);
  // White screen flash wipes everything out — longer, softer fade
  const flashOpacity = interpolate(frame, [CLICK_F + 14, CLICK_F + 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#0D0D0D" }}>
      <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: `scale(${currentZoom}) translate(${camTranslateX}%, ${camTranslateY}%)`,
            transformOrigin: `${targetX * 100}% ${targetY * 100}%`,
            willChange: "transform",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              opacity: cardOpacity,
              transform: `translateY(${cardTranslateY}px) scale(${cardScale})`,
              willChange: "transform",
            }}
          >
            <PromptInputBox
              promptText={promptText}
              promptChars={charsToShow}
              frame={frame}
              showCursor={frame >= 20 && frame < 152}
              generateHighlighted={generateHighlighted}
            />
          </div>
        </div>
      </div>

      <Cursor keyframes={cursorKFs} />

      {/* ── Burst + flash transition — sits above camera & cursor ─────────── */}
      {frame >= CLICK_F && (
        <>
          {/* Radial glow expanding from Generate button */}
          <div
            style={{
              position: "absolute",
              left: "52%",
              top: "63.5%",
              width: burstDiam,
              height: burstDiam,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(210,220,255,0.75) 40%, rgba(190,205,255,0.25) 70%, transparent 100%)",
              transform: "translate(-50%, -50%)",
              opacity: burstOpacity,
              zIndex: 50,
              pointerEvents: "none",
            }}
          />
          {/* White screen wipe */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#FFFFFF",
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
