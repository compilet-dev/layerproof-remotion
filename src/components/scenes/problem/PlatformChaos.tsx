// src/components/scenes/problem/PlatformChaos.tsx
// Scene 1: Tool chaos — browser switching between Canva, Google Docs, Buffer (0–90f)

import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fadeIn } from "../../../lib/animations";
import { useTheme } from "../../../lib/theme";
import { Cursor, CursorKeyframe } from "../../ui/Cursor";
import { ChromeBrowser } from "../../ui/ChromeBrowser";
import { MockCanva } from "../../ui/MockCanva";
import { MockGoogleDocs } from "../../ui/MockGoogleDocs";

export const PlatformChaos: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // Tab switches: Canva (0–43f) → Google Docs (44–89f)
  const activeTab = frame < 44 ? 0 : 1;

  const tabs = [
    { label: "Canva", active: activeTab === 0, icon: <span style={{ fontSize: 14 }}>🎨</span> },
    { label: "Google Docs", active: activeTab === 1, icon: <span style={{ fontSize: 14 }}>📄</span> },
    { label: "Buffer", active: false, icon: <span style={{ fontSize: 14 }}>📅</span> },
  ];

  const url =
    activeTab === 0
      ? "canva.com/design/DAGx9v2kPqI/Instagram-Post/edit"
      : "docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/edit";

  const browserSpring = spring({ frame, fps, config: { stiffness: 55, damping: 18 } });
  const browserOpacity = fadeIn(frame, 0, 20);
  const browserScale = interpolate(browserSpring, [0, 1], [0.96, 1]);

  const statsOpacity = interpolate(frame, [70, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cursor: starts in Canva content → moves to Google Docs tab → clicks → back to content
  const cursorKFs: CursorKeyframe[] = [
    { frame: 5,  x: 0.50, y: 0.57 },
    { frame: 30, x: 0.50, y: 0.57 },
    { frame: 38, x: 0.21, y: 0.085 }, // Google Docs tab
    { frame: 44, x: 0.21, y: 0.085, click: true },
    { frame: 52, x: 0.21, y: 0.085 },
    { frame: 65, x: 0.50, y: 0.57 },
    { frame: 89, x: 0.50, y: 0.57 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #E8EAF0 0%, #D8DBE8 35%, #C8CDD8 65%, #D0D4E0 100%)",
        overflow: "hidden",
      }}
    >
      {/* Radial light */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(255,255,255,0.60) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Browser window */}
      <div
        style={{
          position: "absolute",
          inset: "55px 80px 90px",
          opacity: browserOpacity,
          transform: `scale(${browserScale})`,
          transformOrigin: "50% 50%",
        }}
      >
        <ChromeBrowser tabs={tabs} url={url}>
          {activeTab === 0 ? <MockCanva /> : <MockGoogleDocs />}
        </ChromeBrowser>
      </div>

      {/* Bottom stats badge */}
      <div
        style={{
          position: "absolute",
          bottom: 22,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: statsOpacity,
          display: "flex",
          gap: 8,
          alignItems: "center",
          background: "rgba(255,255,255,0.88)",
          borderRadius: 30,
          padding: "10px 28px",
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        }}
      >
        {[
          { text: "3 tools", red: false },
          { text: "·", red: false },
          { text: "4 platforms", red: false },
          { text: "·", red: false },
          { text: "2+ hrs every day", red: true },
        ].map(({ text, red }, i) => (
          <span
            key={i}
            style={{
              color: red ? "#c0392b" : "#555",
              fontFamily: theme.font.family,
              fontSize: 15,
              fontWeight: red ? theme.font.weightBold : theme.font.weightLight,
              letterSpacing: 0.3,
            }}
          >
            {text}
          </span>
        ))}
      </div>

      <Cursor keyframes={cursorKFs} />
    </AbsoluteFill>
  );
};
