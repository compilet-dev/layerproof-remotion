// src/components/scenes/problem/TheSetup.tsx
// Scene 1: The Setup — 4 browser tabs cycling with 3D camera (0–210f)

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ChromeBrowser } from "../../ui/ChromeBrowser";
import {
  CanvaIcon,
  GoogleDocsIcon,
  HootsuiteIcon,
  NotionIcon,
} from "../../ui/BrandIcons";
import { MockCanva } from "../../ui/MockCanva";
import { MockGoogleDocs } from "../../ui/MockGoogleDocs";
import { MockHootsuite } from "../../ui/MockHootsuite";
import { MockNotion } from "../../ui/MockNotion";
import { useTheme } from "../../../lib/theme";
import { Cursor, CursorKeyframe } from "../../ui/Cursor";

const APP_TABS = [
  { label: "Canva", url: "canva.com/design/social-post-q4" },
  { label: "Google Docs", url: "docs.google.com/d/content-strategy-q4" },
  { label: "Hootsuite", url: "hootsuite.com/dashboard/streams" },
  { label: "Notion", url: "notion.so/workspace/content-calendar" },
];

const APPS = [MockCanva, MockGoogleDocs, MockHootsuite, MockNotion];

// Each app shown for ~52 frames (1.75s @ 30fps)
const FRAMES_PER_APP = 52;

// Cursor keyframes — x/y in 0–1 fractions of the 1920×1080 container
const cursorKFs: CursorKeyframe[] = [
  // Canva (0–51)
  { frame: 0, x: 0.4, y: 0.5 },
  { frame: 10, x: 0.32, y: 0.35, click: true },
  { frame: 20, x: 0.28, y: 0.55 },
  { frame: 30, x: 0.38, y: 0.6, click: true },
  { frame: 45, x: 0.17, y: 0.04 },
  // Google Docs (52–103)
  { frame: 50, x: 0.17, y: 0.04, click: true },
  { frame: 62, x: 0.5, y: 0.45 },
  { frame: 70, x: 0.55, y: 0.5, click: true },
  { frame: 82, x: 0.12, y: 0.16 },
  { frame: 87, x: 0.12, y: 0.16, click: true },
  { frame: 97, x: 0.27, y: 0.04 },
  // Hootsuite (104–155)
  { frame: 102, x: 0.27, y: 0.04, click: true },
  { frame: 114, x: 0.25, y: 0.5 },
  { frame: 122, x: 0.25, y: 0.55, click: true },
  { frame: 134, x: 0.5, y: 0.45 },
  { frame: 142, x: 0.85, y: 0.11, click: true },
  { frame: 150, x: 0.35, y: 0.04 },
  // Notion (156–210)
  { frame: 154, x: 0.35, y: 0.04, click: true },
  { frame: 166, x: 0.1, y: 0.26 },
  { frame: 172, x: 0.1, y: 0.3, click: true },
  { frame: 184, x: 0.5, y: 0.48 },
  { frame: 192, x: 0.55, y: 0.52, click: true },
  { frame: 210, x: 0.5, y: 0.45 },
];

export const TheSetup: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const theme = useTheme();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const activeIndex = Math.min(
    Math.floor(frame / FRAMES_PER_APP),
    APPS.length - 1,
  );
  const ActiveApp = APPS[activeIndex];
  const activeTab = APP_TABS[activeIndex];

  const TAB_ICONS = [
    <CanvaIcon size={18} />,
    <GoogleDocsIcon size={18} />,
    <HootsuiteIcon size={18} />,
    <NotionIcon size={18} />,
  ];

  const tabs = APP_TABS.map((tab, i) => ({
    label: tab.label,
    active: i === activeIndex,
    icon: TAB_ICONS[i],
  }));

  const narratorOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 3D camera: starts angled, straightens over time
  const camRotateX = interpolate(frame, [0, durationInFrames], [18, 2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const camRotateY = interpolate(frame, [0, durationInFrames], [-14, -1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const camTranslateY = interpolate(frame, [0, durationInFrames], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const camTranslateX = interpolate(frame, [0, durationInFrames], [-40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const camScale = interpolate(frame, [0, durationInFrames], [1.05, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#080808",
        overflow: "hidden",
      }}
    >
      {/* Dark vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* 3D camera + browser + cursor */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: fadeIn * fadeOut,
          perspective: 1800,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            padding: 40,
            transformStyle: "preserve-3d",
            transform: `rotateX(${camRotateX}deg) rotateY(${camRotateY}deg) translateY(${camTranslateY}px) translateX(${camTranslateX}px) scale(${camScale})`,
            transformOrigin: "center center",
          }}
        >
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <ChromeBrowser tabs={tabs} url={activeTab.url}>
              <ActiveApp />
            </ChromeBrowser>
            {/* Custom cursor — lives in same coordinate space as the browser container */}
            <Cursor keyframes={cursorKFs} />
          </div>
        </div>
      </div>

      {/* Narrator text — flat, outside 3D transform */}
      <div
        style={{
          position: "absolute",
          bottom: 110,
          left: 0,
          right: 0,
          opacity: narratorOpacity * (fadeIn * fadeOut),
          textAlign: "center",
          pointerEvents: "none",
          zIndex: 3,
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: 60,
            fontFamily: theme.font.family,
            fontWeight: theme.font.weightBold,
            margin: "24px 0 0 0",
            letterSpacing: 0,
          }}
        >
          Still jumping between editors for one social post?
        </p>
      </div>
    </AbsoluteFill>
  );
};
