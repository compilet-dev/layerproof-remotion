// src/components/scenes/solution/OpeningQuestion.tsx
// Scene 0: Hook question before the demo — fades in word by word, holds, fades out

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useTheme } from "../../../lib/theme";
import { ANTON_FAMILY } from "../../../lib/loadFont";

// ─── Platform icons ───────────────────────────────────────────────────────────

const PLATFORMS = [
  {
    id: "instagram",
    bg: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect
          x="6"
          y="6"
          width="20"
          height="20"
          rx="6"
          stroke="#fff"
          strokeWidth="2"
        />
        <circle cx="16" cy="16" r="5" stroke="#fff" strokeWidth="2" />
        <circle cx="22.5" cy="9.5" r="1.5" fill="#fff" />
      </svg>
    ),
  },
  {
    id: "facebook",
    bg: "#1877F2",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M20 6h-3a5 5 0 0 0-5 5v3H9v4h3v8h4v-8h3l1-4h-4v-3a1 1 0 0 1 1-1h3z"
          fill="#fff"
        />
      </svg>
    ),
  },
  {
    id: "twitter",
    bg: "#000000",
    border: "rgba(255,255,255,0.15)",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M6 6L13.5 16.2L6 26H8.5L14.6 17.6L20 26H27L19.1 15.4L26 6H23.5L18 14L13 6H6Z"
          fill="#fff"
        />
      </svg>
    ),
  },
  {
    id: "tiktok",
    bg: "#010101",
    border: "rgba(255,255,255,0.15)",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M22 8c.5 2.5 2.5 4 5 4v4c-2 0-3.8-.6-5-1.6V22a8 8 0 1 1-8-8v4a4 4 0 1 0 4 4V8h4z"
          fill="#fff"
        />
        <path
          d="M22 8c.5 2.5 2.5 4 5 4"
          stroke="#69C9D0"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M14 26a8 8 0 1 1 8-8"
          stroke="#EE1D52"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    ),
  },
  {
    id: "youtube",
    bg: "#FF0000",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect
          x="4"
          y="9"
          width="24"
          height="14"
          rx="4"
          fill="white"
          opacity="0.9"
        />
        <polygon points="13,12 21,16 13,20" fill="#FF0000" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    bg: "#0A66C2",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="6" y="13" width="4" height="13" fill="#fff" />
        <circle cx="8" cy="9" r="2.5" fill="#fff" />
        <path
          d="M14 13h4v2.5C18.8 14 20 13 22 13c3 0 4 2 4 5v8h-4v-7c0-1.5-.5-2.5-2-2.5s-2 1-2 2.5v7h-4V13z"
          fill="#fff"
        />
      </svg>
    ),
  },
];

// Each icon gets a fixed tilt to create a scattered-stack feel
const ROTATIONS = [-13, 7, -5, 11, -9, 4];

const PlatformIcon: React.FC<{
  platform: (typeof PLATFORMS)[0];
  frame: number;
  fps: number;
  startFrame: number;
  rotate?: number;
}> = ({ platform, frame, fps, startFrame, rotate = 0 }) => {
  const s = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { stiffness: 90, damping: 18 },
  });
  const opacity = interpolate(s, [0, 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(s, [0, 1], [32, 0]);
  const scale = interpolate(s, [0, 1], [0.6, 1]);

  return (
    <div
      style={{
        width: 90,
        height: 90,
        borderRadius: 22,
        background: platform.bg,
        border: `1.5px solid ${platform.border ?? "rgba(255,255,255,0.10)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        transform: `translateY(${y}px) scale(${scale}) rotate(${rotate}deg)`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        willChange: "transform",
        flexShrink: 0,
      }}
    >
      {/* Scale up the SVG icon to fill the larger container */}
      <div style={{ transform: "scale(1.35)", transformOrigin: "center" }}>
        {platform.icon}
      </div>
    </div>
  );
};

// ─── Animated word ────────────────────────────────────────────────────────────

const Word: React.FC<{
  text: string;
  frame: number;
  fps: number;
  startFrame: number;
  color?: string;
}> = ({ text, frame, fps, startFrame, color = "#FFFFFF" }) => {
  const s = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { stiffness: 80, damping: 20 },
  });

  const opacity = interpolate(s, [0, 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(s, [0, 1], [32, 0]);
  const blur = interpolate(s, [0, 0.55], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <span
      style={{
        display: "inline-block",
        opacity,
        transform: `translateY(${y}px)`,
        filter: `blur(${blur}px)`,
        color,
        willChange: "transform",
      }}
    >
      {text}
    </span>
  );
};

// ─── Scene ────────────────────────────────────────────────────────────────────

export const OpeningQuestion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // Scene fade in / fade out
  const fadeIn = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [135, 155], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sceneOpacity = Math.min(fadeIn, fadeOut);

  // Word groups — stagger across two lines
  //  Line 1: "Tired of reformatting the same post for"
  //  Line 2: "every single platform?"
  const line1 = [
    { text: "Tired", color: "#FFFFFF" },
    { text: "of", color: "#FFFFFF" },
    { text: "reformatting", color: "#FFFFFF" },
    { text: "the", color: "#F5C842" },
    { text: "same", color: "#F5C842" },
    { text: "post", color: "#F5C842" },
  ];
  const line2 = [
    { text: "for", color: "#FFFFFF" },
    { text: "every", color: "#FF589B" },
    { text: "single", color: "#FF589B" },
    { text: "platform?", color: "#FF589B" },
  ];

  const STAGGER = 6; // frames between each word
  const LINE1_START = 22;
  const LINE2_START = LINE1_START + line1.length * STAGGER + 8;
  const ICONS_START = LINE2_START + line2.length * STAGGER + 10;

  const textStyle: React.CSSProperties = {
    fontFamily: ANTON_FAMILY,
    fontSize: 84,
    fontWeight: 400,
    letterSpacing: 1,
    textTransform: "uppercase",
    lineHeight: 1.15,
  };

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg,rgb(82, 19, 46) 0%,rgb(32, 14, 9) 60%, #1C0C08 70%)",
        opacity: sceneOpacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Subtle vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(0,0,0,0.25) 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          maxWidth: 1300,
          textAlign: "center",
        }}
      >
        {/* Line 1 */}
        <div
          style={{
            ...textStyle,
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {line1.map((w, i) => (
            <Word
              key={w.text + i}
              text={w.text}
              frame={frame}
              fps={fps}
              startFrame={LINE1_START + i * STAGGER}
              color={w.color}
            />
          ))}
        </div>

        {/* Line 2 */}
        <div
          style={{
            ...textStyle,
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {line2.map((w, i) => (
            <Word
              key={w.text + i}
              text={w.text}
              frame={frame}
              fps={fps}
              startFrame={LINE2_START + i * STAGGER}
              color={w.color}
            />
          ))}
        </div>

        {/* Platform icons — overlapping stack */}
        <div style={{ display: "flex", marginTop: 64, alignItems: "center" }}>
          {PLATFORMS.map((p, i) => (
            <div
              key={p.id}
              style={{
                marginLeft: i === 0 ? 0 : -22,
                zIndex: i,
                position: "relative",
              }}
            >
              <PlatformIcon
                platform={p}
                frame={frame}
                fps={fps}
                startFrame={ICONS_START + i * 3}
                rotate={ROTATIONS[i] ?? 0}
              />
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
