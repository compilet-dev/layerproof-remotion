// src/components/scenes/solution/UIFloat.tsx
// Scene 4: Horizontal slider — each card at its correct platform ratio

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { easeIO } from "../../../lib/animations";
import { useTheme } from "../../../lib/theme";
import { ANTON_FAMILY } from "../../../lib/loadFont";
import {
  InstagramMockup,
  InstagramStoryMockup,
  LinkedInMockup,
  TwitterMockup,
  FacebookMockup,
  TikTokMockup,
  YoutubeMockup,
} from "../../ui/PlatformMockups";

// ─── Types ────────────────────────────────────────────────────────────────────

type CardDef = {
  id: string;
  Component: React.FC<{ charsToShow: number; frame: number }>;
  w: number; // card width — reflects platform format
  h: number; // natural content height — hugs the card content
  delay: number;
  floatOffset: number;
};

// ─── Card definitions — each card hugs its own content height ────────────────
//
//  TikTok / Story  9:16  → w=320, h=568
//  Instagram        1:1  → w=380, h=720  (380px image + header/caption/actions)
//  Facebook      1.91:1  → w=480, h=535  (251px image + text bars)
//  LinkedIn      1.91:1  → w=480, h=510  (251px image + post/reactions)
//  Twitter          16:9 → w=500, h=460  (263px image + tweet text)
//  YouTube          16:9 → w=500, h=400  (281px thumbnail + info bar)

const GAP = 40;
const SIDE_PAD = 80;

const CARDS: CardDef[] = [
  {
    id: "tiktok",
    Component: TikTokMockup,
    w: 320,
    h: 568,
    delay: 0,
    floatOffset: 15,
  },
  {
    id: "instagram",
    Component: InstagramMockup,
    w: 380,
    h: 720,
    delay: 6,
    floatOffset: 0,
  },
  {
    id: "facebook",
    Component: FacebookMockup,
    w: 480,
    h: 535,
    delay: 10,
    floatOffset: 40,
  },
  {
    id: "youtube",
    Component: YoutubeMockup,
    w: 500,
    h: 400,
    delay: 18,
    floatOffset: 30,
  },
  {
    id: "story",
    Component: InstagramStoryMockup,
    w: 320,
    h: 568,
    delay: 8,
    floatOffset: 20,
  },
  {
    id: "linkedin",
    Component: LinkedInMockup,
    w: 480,
    h: 510,
    delay: 3,
    floatOffset: 10,
  },
  {
    id: "twitter",
    Component: TwitterMockup,
    w: 500,
    h: 460,
    delay: 13,
    floatOffset: 55,
  },
];

// Strip geometry — strip height = tallest card, all cards bottom-aligned
const MAX_H = Math.max(...CARDS.map((c) => c.h));
const CONTENT_W = CARDS.reduce((s, c) => s + c.w, 0) + (CARDS.length - 1) * GAP;
const STRIP_W = CONTENT_W + 2 * SIDE_PAD;
const PAN_RANGE = Math.max(0, STRIP_W - 1920);

// ─── Timing ───────────────────────────────────────────────────────────────────

const SETTLED = 55;
const OVERLAY_IN = 68;
const OVERLAY_OUT = 90;
const TEXT_LINE1 = 82; // "One campaign. Six platforms."
const TEXT_LINE2 = 138; // "Only in thirty seconds."

// ─── FlyInCard ────────────────────────────────────────────────────────────────

const FlyInCard: React.FC<{
  card: CardDef;
  frame: number;
  fps: number;
  overlayProgress: number;
}> = ({ card, frame, fps, overlayProgress }) => {
  const s = spring({
    frame: Math.max(0, frame - card.delay),
    fps,
    config: { damping: 22, stiffness: 110, mass: 0.85 },
  });

  const opacity = interpolate(s, [0, 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const entryY = interpolate(s, [0, 1], [70, 0]);
  const entryBlur = interpolate(s, [0, 0.6], [5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Gentle idle float after cards settle
  const settled = Math.max(0, frame - SETTLED);
  const floatY = Math.sin((settled + card.floatOffset) * 0.04) * 4;

  const cardScale = interpolate(overlayProgress, [0, 1], [1, 0.97]);

  return (
    <div
      style={{
        width: card.w,
        height: card.h,
        flexShrink: 0,
        opacity,
        transform: `translateY(${entryY + floatY}px) scale(${cardScale})`,
        filter: `blur(${entryBlur}px)`,
        borderRadius: 14,
        overflow: "hidden",
        boxShadow:
          "0 4px 16px rgba(0,0,0,0.18), 0 20px 60px rgba(0,0,0,0.24), 0 0 0 1px rgba(0,0,0,0.06)",
        willChange: "transform",
      }}
    >
      <card.Component charsToShow={300} frame={frame} />
    </div>
  );
};

// ─── Animated word ────────────────────────────────────────────────────────────

const Word: React.FC<{
  text: string;
  frame: number;
  fps: number;
  startFrame: number;
  style?: React.CSSProperties;
}> = ({ text, frame, fps, startFrame, style }) => {
  const s = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { stiffness: 90, damping: 18 },
  });
  const opacity = interpolate(s, [0, 0.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(s, [0, 1], [28, 0]);
  const blur = interpolate(s, [0, 0.5], [6, 0], {
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
        willChange: "transform",
        ...style,
      }}
    >
      {text}
    </span>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

export const UIFloat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const sceneOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sceneFadeOut = interpolate(frame, [185, 210], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Horizontal pan ──────────────────────────────────────────────────────────
  const panT = interpolate(frame, [20, 195], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const panX = -easeIO(panT) * PAN_RANGE;

  // ── Overlay scrim ───────────────────────────────────────────────────────────
  const overlayProgress = interpolate(
    frame,
    [OVERLAY_IN, OVERLAY_OUT],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const overlayOpacity = interpolate(overlayProgress, [0, 1], [0, 0.8]);

  const line1Words = ["ONE", "CAMPAIGN.", "SIX", "PLATFORMS."];
  const line2Words = ["ONLY", "IN", "THIRTY", "SECONDS."];

  const cardTop = (1080 - MAX_H) / 2; // vertically centered on tallest card

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at 50% 50%, rgba(229,82,122,0.15) 0%, transparent 60%), linear-gradient(135deg, #0a0510 0%, #150810 100%)",
        opacity: Math.min(sceneOpacity, sceneFadeOut),
        overflow: "hidden",
      }}
    >
      {/* ── Scrolling card strip ── */}
      <div
        style={{
          position: "absolute",
          top: cardTop,
          left: 0,
          width: STRIP_W,
          height: MAX_H,
          display: "flex",
          alignItems: "flex-end",
          gap: GAP,
          paddingLeft: SIDE_PAD,
          paddingRight: SIDE_PAD,
          boxSizing: "border-box",
          transform: `translateX(${panX}px)`,
          willChange: "transform",
        }}
      >
        {CARDS.map((card) => (
          <FlyInCard
            key={card.id}
            card={card}
            frame={frame}
            fps={fps}
            overlayProgress={overlayProgress}
          />
        ))}
      </div>

      {/* ── Dark scrim ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.60) 100%)",
          opacity: overlayOpacity,
          pointerEvents: "none",
        }}
      />

      {/* ── Overlay text ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          pointerEvents: "none",
        }}
      >
        {/* "One campaign. Six platforms." */}
        <div
          style={{
            display: "flex",
            gap: 22,
            alignItems: "baseline",
            overflow: "hidden",
          }}
        >
          {line1Words.map((word, i) => (
            <Word
              key={word}
              text={word}
              frame={frame}
              fps={fps}
              startFrame={TEXT_LINE1 + i * 7}
              style={{
                fontFamily: ANTON_FAMILY,
                fontSize: 100,
                fontWeight: 400,
                color: i < 2 ? "#FFE600" : "#FFFFFF",
                letterSpacing: 1,
                lineHeight: 1.125,
              }}
            />
          ))}
        </div>

        {/* "Only in thirty seconds." */}
        <div
          style={{
            display: "flex",
            gap: 22,
            alignItems: "baseline",
            overflow: "hidden",
          }}
        >
          {line2Words.map((word, i) => (
            <Word
              key={word}
              text={word}
              frame={frame}
              fps={fps}
              startFrame={TEXT_LINE2 + i * 7}
              style={{
                fontFamily: ANTON_FAMILY,
                fontSize: 100,
                fontWeight: 400,
                color: "#FF3D8B",
                letterSpacing: 1,
                lineHeight: 1.125,
              }}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
