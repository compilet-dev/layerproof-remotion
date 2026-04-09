// src/components/scenes/solution/HumanMoment.tsx
// Scene 5: Human moment — publish confirmation (420–510f)

import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fadeIn, glassCard, PLATFORMS, staggerReveal, Platform } from "../../../lib/animations";
import { useTheme } from "../../../lib/theme";
import { Cursor, ZoomLens, CursorKeyframe } from "../../ui/Cursor";
import { LayerProofDashboard } from "../../ui/LayerProofDashboard";

export const HumanMoment: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const sceneOpacity = fadeIn(frame, 0, 25);

  const cursorKFs: CursorKeyframe[] = [
    { frame: 10, x: 0.28, y: 0.82 },
    { frame: 30, x: 0.28, y: 0.82, click: true },
    { frame: 45, x: 0.5, y: 0.82, click: true },
    { frame: 60, x: 0.73, y: 0.82, click: true },
    { frame: 75, x: 0.9, y: 0.82, click: true },
    { frame: 90, x: 0.9, y: 0.82 },
  ];

  const checkScale = spring({
    frame: Math.max(0, frame - 50),
    fps,
    config: theme.motion.snappy,
  });
  const confirmOpacity = fadeIn(frame, 50, 20);

  return (
    <AbsoluteFill
      style={{
        background: "#FFFDF8",
        opacity: sceneOpacity,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(255,180,50,0.08) 0%, transparent 70%)",
          top: "20%",
          left: "30%",
          pointerEvents: "none",
        }}
      />

      <ZoomLens
        zoomInAt={0}
        holdUntil={65}
        zoomOutAt={68}
        targetX={0.5}
        targetY={0.82}
        maxZoom={1.35}
      >
        <LayerProofDashboard
          promptText="Announce our new AI feature launch for all channels."
          showOutputs
          outputsFrame={120}
          frame={frame}
        />
      </ZoomLens>

      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: "50%",
          transform: `translateX(-50%) scale(${checkScale})`,
          opacity: confirmOpacity,
          willChange: "transform",
          ...glassCard(14, theme),
          padding: "18px 36px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          background: "rgba(255,255,255,0.97)",
          border: "1px solid rgba(0,0,0,0.10)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(74,222,128,0.15)",
            border: "1px solid rgba(74,222,128,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}
        >
          ✓
        </div>
        <div>
          <div
            style={{
              color: theme.colors.white,
              fontFamily: theme.font.family,
              fontSize: 16,
              fontWeight: theme.font.weightMedium,
            }}
          >
            Published to 4 platforms
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 6,
              alignItems: "center",
            }}
          >
            {PLATFORMS.map((p: Platform, i: number) => {
              const chipOpacity = staggerReveal(frame, i + 2, 5, 12);
              return (
                <span key={p.id} style={{ opacity: chipOpacity, fontSize: 18 }}>
                  {p.icon}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <Cursor keyframes={cursorKFs} />
    </AbsoluteFill>
  );
};
