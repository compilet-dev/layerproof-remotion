// src/compositions/gifs/PromptMultiPlatform.tsx
// 3-phase loopable GIF:
//   Phase 1 (0–96f)    — Decorated prompt scene: floating platform cards + icons + search bar
//   Phase 2 (96–196f)  — LayerProofEditor springs in, generates content
//   Phase 3 (196–360f) — UIFloat-style horizontal card strip + Anton bold headline
// Resolution: 1270×760 | 30fps | 360 frames

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  loadFont,
  fontFamily as antonFamily,
} from "@remotion/google-fonts/Anton";
import { easeIO } from "../../lib/animations";
import { ThemeProvider, darkTheme } from "../../lib/theme";
import { LayerProofEditor } from "../../components/ui/editor";
import { Cursor } from "../../components/ui/Cursor";
import type { CursorKeyframe } from "../../types";
import {
  LinkedInMockup,
  TwitterMockup,
  InstagramMockup,
  TikTokMockup,
  FacebookMockup,
  InstagramStoryMockup,
  YoutubeMockup,
} from "../../components/ui/PlatformMockups";

loadFont();

// ─── Timing ───────────────────────────────────────────────────────────────────

const PROMPT_TEXT = "Promote www.layerproof.app new AI feature";
const PHASE1_CLICK = 83;
const PHASE2_START = 96;
const PHASE3_START = 226;
const FADE_OUT_START = 345;
const FADE_OUT_END = 360;

const EDITOR_SCALE = 1270 / 1920;
const EDITOR_TOP = (760 - 1080 * EDITOR_SCALE) / 2;

const YELLOW = "#F5E642";
const PINK = "#FF5C9E";

// ─── Phase 3 strip constants ──────────────────────────────────────────────────

const GAP = 40;
const SIDE_PAD = 80;

const SETTLED_P3 = 35;
const OVERLAY_IN_P3 = 50;
const OVERLAY_OUT_P3 = 72;
const TEXT_LINE1_P3 = 65;
const TEXT_LINE2_P3 = 92;

type CardDef = {
  id: string;
  Component: React.FC<{ charsToShow: number; frame: number }>;
  w: number;
  h: number;
  delay: number;
  floatOffset: number;
};

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

const MAX_H = Math.max(...CARDS.map((c) => c.h));
const STRIP_W =
  CARDS.reduce((s, c) => s + c.w, 0) + (CARDS.length - 1) * GAP + 2 * SIDE_PAD;
const PAN_RANGE_NATURAL = Math.max(0, STRIP_W - 1920);
const CARD_STRIP_SCALE = 1270 / 1920;
const STRIP_TOP = (760 - MAX_H * CARD_STRIP_SCALE) / 2;

// ─── Phase 1: Platform icon SVGs ─────────────────────────────────────────────

const LinkedInIcon: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <svg width={size} height={size} viewBox="0 0 52 52">
    <rect width="52" height="52" rx="12" fill="#0A66C2" />
    <text
      x="26"
      y="36"
      textAnchor="middle"
      fontSize="24"
      fontWeight="700"
      fontFamily="Arial,sans-serif"
      fill="#fff"
    >
      in
    </text>
  </svg>
);

const TikTokIcon: React.FC<{ size?: number }> = ({ size = 50 }) => (
  <svg width={size} height={size} viewBox="0 0 50 50">
    <rect width="50" height="50" rx="12" fill="#010101" />
    <path
      d="M30 10.5c.5 4.2 2.9 6.8 6.3 7.8v5.2c-2.3-.2-4.4-1.1-6.3-2.4v11c0 5.5-4.5 9.7-9.9 9.2-4.7-.4-8.3-4.4-8.3-9.2 0-5.1 4.2-9.2 9.3-9.2.4 0 .8 0 1.2.1v5.3c-.4-.1-.8-.1-1.2-.1-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4V10.5H30z"
      fill="#69C9D0"
      transform="translate(1.5,1)"
      opacity="0.75"
    />
    <path
      d="M30 10.5c.5 4.2 2.9 6.8 6.3 7.8v5.2c-2.3-.2-4.4-1.1-6.3-2.4v11c0 5.5-4.5 9.7-9.9 9.2-4.7-.4-8.3-4.4-8.3-9.2 0-5.1 4.2-9.2 9.3-9.2.4 0 .8 0 1.2.1v5.3c-.4-.1-.8-.1-1.2-.1-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4V10.5H30z"
      fill="#EE1D52"
      transform="translate(-1.5,-1)"
      opacity="0.75"
    />
    <path
      d="M30 10.5c.5 4.2 2.9 6.8 6.3 7.8v5.2c-2.3-.2-4.4-1.1-6.3-2.4v11c0 5.5-4.5 9.7-9.9 9.2-4.7-.4-8.3-4.4-8.3-9.2 0-5.1 4.2-9.2 9.3-9.2.4 0 .8 0 1.2.1v5.3c-.4-.1-.8-.1-1.2-.1-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4V10.5H30z"
      fill="#fff"
    />
  </svg>
);

const InstagramIcon: React.FC<{ size?: number }> = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    <defs>
      <radialGradient id="ig3" cx="30%" cy="107%" r="140%">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect width="60" height="60" rx="15" fill="url(#ig3)" />
    <rect
      x="15"
      y="15"
      width="30"
      height="30"
      rx="9"
      fill="none"
      stroke="#fff"
      strokeWidth="3"
    />
    <circle cx="30" cy="30" r="8" fill="none" stroke="#fff" strokeWidth="3" />
    <circle cx="41" cy="19" r="2.5" fill="#fff" />
  </svg>
);


const FacebookIcon: React.FC<{ size?: number }> = ({ size = 58 }) => (
  <svg width={size} height={size} viewBox="0 0 58 58">
    <rect width="58" height="58" rx="14" fill="#1877F2" />
    <path
      d="M31 50V32h5.9l.9-6.9H31v-4.2c0-1.9.6-3.2 3.2-3.2H38V11c-.7-.1-3-.3-5.7-.3-5.2 0-8.6 3.1-8.6 8.9V25H18v6.9h5.7V50H31z"
      fill="#fff"
    />
  </svg>
);

const Sparkle: React.FC<{ size?: number }> = ({ size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12">
    <path
      d="M6 0L6.7 4.7L12 6L6.7 7.3L6 12L5.3 7.3L0 6L5.3 4.7Z"
      fill="rgba(255,255,255,0.35)"
    />
  </svg>
);

// ─── Phase 1: Floating platform object ───────────────────────────────────────

type SkeletonType = "social" | "portrait" | "square" | "tweet";

type FloatObjDef = {
  Icon: React.FC<{ size?: number }>;
  iconSize: number;
  cardW: number;
  cardH: number;
  x: number;
  y: number;
  iconOffX: number;
  iconOffY: number;
  rotate: number;
  delay: number;
  floatPhase: number;
  skeleton: SkeletonType;
};

const FLOAT_OBJECTS: FloatObjDef[] = [
  // top-left: LinkedIn — social skeleton
  {
    Icon: LinkedInIcon,
    iconSize: 58,
    cardW: 275,
    cardH: 215,
    x: 95,
    y: 60,
    iconOffX: -21,
    iconOffY: -21,
    rotate: -5,
    delay: 2,
    floatPhase: 0,
    skeleton: "social",
  },
  // top-right: TikTok — portrait skeleton (icon badge top-right)
  {
    Icon: TikTokIcon,
    iconSize: 54,
    cardW: 240,
    cardH: 200,
    x: 910,
    y: 50,
    iconOffX: 205,
    iconOffY: -20,
    rotate: 4,
    delay: 7,
    floatPhase: 1.3,
    skeleton: "portrait",
  },
  // bottom-left: Instagram — square skeleton (icon badge bottom-left)
  {
    Icon: InstagramIcon,
    iconSize: 66,
    cardW: 258,
    cardH: 242,
    x: 95,
    y: 460,
    iconOffX: -23,
    iconOffY: 198,
    rotate: -6,
    delay: 13,
    floatPhase: 2.5,
    skeleton: "square",
  },
  // bottom-right: Facebook — social skeleton (icon badge bottom-right)
  {
    Icon: FacebookIcon,
    iconSize: 70,
    cardW: 310,
    cardH: 230,
    x: 730,
    y: 490,
    iconOffX: 262,
    iconOffY: 182,
    rotate: 3,
    delay: 10,
    floatPhase: 3.1,
    skeleton: "social",
  },
];

// ─── Skeleton card SVG internals ─────────────────────────────────────────────

const S_LINE = "rgba(255,255,255,0.22)";
const S_DIM = "rgba(255,255,255,0.07)";
const S_GHOST = "rgba(255,255,255,0.13)";

const SkeletonSocial: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <svg width={w} height={h}>
    <circle cx={20} cy={20} r={11} fill={S_GHOST} />
    <rect x={38} y={12} width={70} height={7} rx={3.5} fill={S_LINE} />
    <rect x={38} y={24} width={45} height={5} rx={2.5} fill={S_DIM} />
    <rect x={8} y={42} width={w - 16} height={h * 0.44} rx={7} fill={S_DIM} />
    <rect
      x={8}
      y={h * 0.44 + 52}
      width={w - 18}
      height={6}
      rx={3}
      fill={S_LINE}
    />
    <rect
      x={8}
      y={h * 0.44 + 64}
      width={w - 35}
      height={6}
      rx={3}
      fill={S_LINE}
    />
    <rect
      x={8}
      y={h * 0.44 + 76}
      width={w - 55}
      height={6}
      rx={3}
      fill={S_DIM}
    />
    <circle cx={16} cy={h - 16} r={5} fill={S_GHOST} />
    <rect x={26} y={h - 20} width={28} height={6} rx={3} fill={S_DIM} />
    <circle cx={80} cy={h - 16} r={5} fill={S_GHOST} />
    <rect x={90} y={h - 20} width={22} height={6} rx={3} fill={S_DIM} />
  </svg>
);

const SkeletonPortrait: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <svg width={w} height={h}>
    <rect x={0} y={0} width={w} height={h} fill={S_DIM} />
    <rect x={0} y={h - 46} width={w} height={46} fill="rgba(0,0,0,0.3)" />
    <circle cx={18} cy={h - 23} r={9} fill={S_GHOST} />
    <rect x={34} y={h - 29} width={60} height={6} rx={3} fill={S_LINE} />
    <rect x={34} y={h - 19} width={40} height={5} rx={2.5} fill={S_DIM} />
    <circle cx={w - 16} cy={h * 0.45} r={7} fill={S_GHOST} />
    <circle cx={w - 16} cy={h * 0.6} r={7} fill={S_GHOST} />
    <circle cx={w - 16} cy={h * 0.75} r={7} fill={S_GHOST} />
  </svg>
);

const SkeletonSquare: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <svg width={w} height={h}>
    <circle cx={20} cy={18} r={10} fill={S_GHOST} />
    <rect x={36} y={11} width={60} height={6} rx={3} fill={S_LINE} />
    <rect x={36} y={22} width={38} height={5} rx={2.5} fill={S_DIM} />
    <rect
      x={0}
      y={36}
      width={w}
      height={Math.min(w * 0.78, h - 68)}
      rx={0}
      fill={S_DIM}
    />
    <circle cx={16} cy={h - 20} r={6} fill={S_GHOST} />
    <circle cx={38} cy={h - 20} r={6} fill={S_GHOST} />
    <circle cx={60} cy={h - 20} r={6} fill={S_GHOST} />
  </svg>
);

const SkeletonTweet: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <svg width={w} height={h}>
    <circle cx={18} cy={18} r={10} fill={S_GHOST} />
    <rect x={34} y={10} width={65} height={6} rx={3} fill={S_LINE} />
    <rect x={34} y={21} width={42} height={5} rx={2.5} fill={S_DIM} />
    <rect x={8} y={38} width={w - 14} height={6} rx={3} fill={S_LINE} />
    <rect x={8} y={50} width={w - 28} height={6} rx={3} fill={S_LINE} />
    <rect x={8} y={62} width={w - 50} height={6} rx={3} fill={S_DIM} />
    <circle cx={16} cy={h - 15} r={5} fill={S_GHOST} />
    <rect x={26} y={h - 19} width={20} height={5} rx={2.5} fill={S_DIM} />
    <circle cx={68} cy={h - 15} r={5} fill={S_GHOST} />
    <circle cx={100} cy={h - 15} r={5} fill={S_GHOST} />
  </svg>
);

const SKELETON_MAP = {
  social: SkeletonSocial,
  portrait: SkeletonPortrait,
  square: SkeletonSquare,
  tweet: SkeletonTweet,
} as const;

// ─── FloatingObject ───────────────────────────────────────────────────────────

const FloatingObject: React.FC<{
  obj: FloatObjDef;
  frame: number;
  fps: number;
}> = ({ obj, frame, fps }) => {
  const s = spring({
    frame: Math.max(0, frame - obj.delay),
    fps,
    config: { stiffness: 85, damping: 22 },
  });
  const opacity = interpolate(s, [0, 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const entryY = interpolate(s, [0, 1], [20, 0]);
  const entryScl = interpolate(s, [0, 1], [0.82, 1]);
  const floatY = 7 * Math.sin((frame / 88 + obj.floatPhase) * Math.PI * 2);
  const SkeletonComp = SKELETON_MAP[obj.skeleton];

  return (
    <div
      style={{
        position: "absolute",
        left: obj.x,
        top: obj.y,
        opacity,
        transform: `scale(${entryScl}) translateY(${entryY + floatY}px) rotate(${obj.rotate}deg)`,
        transformOrigin: "center center",
        willChange: "transform",
      }}
    >
      {/* Skeleton card */}
      <div
        style={{
          width: obj.cardW,
          height: obj.cardH,
          borderRadius: 16,
          background: "rgba(36,30,30,0.75)",
          border: "1px solid rgba(255,255,255,0.14)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 12px 42px rgba(0,0,0,0.65)",
          overflow: "hidden",
        }}
      >
        <SkeletonComp w={obj.cardW} h={obj.cardH} />
      </div>
      {/* Platform icon sticker */}
      <div
        style={{
          position: "absolute",
          left: obj.iconOffX,
          top: obj.iconOffY,
          filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.75))",
          zIndex: 10,
        }}
      >
        <obj.Icon size={obj.iconSize} />
      </div>
    </div>
  );
};

// ─── Compact Phase 1 search bar (no rings — those are in background layer) ────

// Only "www.layerproof.app" is highlighted — compute start and end indices
const LINK_START = PROMPT_TEXT.indexOf("www");
const LINK_END = LINK_START + "www.layerproof.app".length;

const CompactPrompt: React.FC<{
  chars: number;
  frame: number;
  showCursor: boolean;
  highlighted: boolean;
}> = ({ chars, frame, showCursor, highlighted }) => {
  const cursorOn = frame % 20 < 10;
  const preText = PROMPT_TEXT.slice(0, Math.min(chars, LINK_START));
  const linkText =
    chars > LINK_START
      ? PROMPT_TEXT.slice(LINK_START, Math.min(chars, LINK_END))
      : "";
  const postText = chars > LINK_END ? PROMPT_TEXT.slice(LINK_END, chars) : "";

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div
        style={{
          width: "100%",
          height: 68,
          borderRadius: 34,
          background: "rgba(52,52,52,0.92)",
          border: `1.5px solid rgba(255,255,255,${highlighted ? 0.3 : 0.13})`,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          display: "flex",
          alignItems: "center",
          paddingLeft: 30,
          paddingRight: 10,
          boxSizing: "border-box",
          gap: 10,
          boxShadow: highlighted
            ? "0 0 0 2px rgba(255,255,255,0.15), 0 8px 40px rgba(0,0,0,0.6)"
            : "0 4px 32px rgba(0,0,0,0.55)",
        }}
      >
        <div
          style={{
            flex: 1,
            fontSize: 22,
            fontWeight: 400,
            color: "#FFFFFF",
            fontFamily: '"Inter","SF Pro Display",-apple-system,sans-serif',
            letterSpacing: 0.1,
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {preText}
          {linkText && (
            <span
              style={{
                color: "#6CA9FF",
                textDecoration: "underline",
                textDecorationColor: "rgba(108,169,255,0.6)",
                textUnderlineOffset: 3,
              }}
            >
              {linkText}
            </span>
          )}
          {postText}
          {showCursor && (
            <span
              style={{
                display: "inline-block",
                width: 2.5,
                height: 24,
                background: "#FFFFFF",
                marginLeft: 3,
                opacity: cursorOn ? 1 : 0,
                verticalAlign: "middle",
                borderRadius: 1,
              }}
            />
          )}
        </div>

        {/* Generate button */}
        <div
          style={{
            height: 50,
            borderRadius: 25,
            flexShrink: 0,
            padding: "0 22px",
            background: highlighted ? "#FFFFFF" : "rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: highlighted ? "0 2px 12px rgba(0,0,0,0.25)" : "none",
          }}
        >
          <span
            style={{
              fontSize: 15,
              fontWeight: 600,
              fontFamily: '"Inter","SF Pro Display",-apple-system,sans-serif',
              color: highlighted ? "#0A0A0A" : "rgba(255,255,255,0.65)",
              letterSpacing: 0.2,
              whiteSpace: "nowrap",
            }}
          >
            Generate
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── Phase 3: FlyInCard ───────────────────────────────────────────────────────

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
  const settled = Math.max(0, frame - SETTLED_P3);
  const floatY = Math.sin((settled + card.floatOffset) * 0.04) * 4;
  const scale = interpolate(overlayProgress, [0, 1], [1, 0.97]);

  return (
    <div
      style={{
        width: card.w,
        height: card.h,
        flexShrink: 0,
        opacity,
        transform: `translateY(${entryY + floatY}px) scale(${scale})`,
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

// ─── Phase 3: Word reveal ─────────────────────────────────────────────────────

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
  const y = interpolate(s, [0, 1], [30, 0]);
  const blur = interpolate(s, [0, 0.5], [5, 0], {
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

// ─── Main Composition ─────────────────────────────────────────────────────────

export const PromptMultiPlatform: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lf2 = Math.max(0, frame - PHASE2_START);
  const lf3 = Math.max(0, frame - PHASE3_START);
  const isPhase2 = frame >= PHASE2_START;
  const isPhase3 = frame >= PHASE3_START;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const charsP1 = Math.floor(
    interpolate(frame, [14, 74], [0, PROMPT_TEXT.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const generateHighlighted = frame >= 78 && frame < PHASE2_START;
  // Phase 1 holds visible until Phase 2 starts, then crossfades out (matches Phase 2→3)
  const phase1Opacity = interpolate(frame, [PHASE2_START, PHASE2_START + 22], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bar entry
  const appearSpring = spring({
    frame: Math.max(0, frame - 1),
    fps,
    config: { stiffness: 80, damping: 20 },
  });
  const barOpacity = interpolate(frame, [0, 11], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barTranslateY = interpolate(appearSpring, [0, 1], [20, 0]);
  const barScale = interpolate(appearSpring, [0, 1], [0.96, 1]);

  // Camera zoom to center
  const camFrame1 = Math.min(frame, PHASE1_CLICK);
  const zoomBaseSpring = spring({
    frame: Math.max(0, camFrame1 - 4),
    fps,
    config: { stiffness: 40, damping: 28 },
  });
  const zoomBase = interpolate(zoomBaseSpring, [0, 1], [1, 1.18]);
  const zoomPunchSpring = spring({
    frame: Math.max(0, camFrame1 - 75),
    fps,
    config: { stiffness: 55, damping: 20 },
  });
  const zoomPunch = interpolate(zoomPunchSpring, [0, 1], [0, 0.24]);
  const currentZoom = zoomBase + zoomPunch;

  // Cursor: Generate button at right of 660px bar centered at x=635
  // Bar right: 635+330=965 | button center: 965-10-52=903 → 903/1270≈0.711
  const cursorKFs: CursorKeyframe[] = [
    { frame: 11, x: 0.4, y: 0.5 },
    { frame: 74, x: 0.4, y: 0.5 },
    { frame: 80, x: 0.711, y: 0.5 },
    { frame: 83, x: 0.711, y: 0.5, click: true },
    { frame: 93, x: 0.711, y: 0.5 },
  ];


  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const editorEntrySpring = spring({
    frame: lf2,
    fps,
    config: { stiffness: 80, damping: 22 },
  });
  // Hold visible until Phase 3 starts (lf2≈130=frame 226), then crossfade out
  const editorOpacity = interpolate(lf2, [0, 22, 128, 150], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const editorScaleEntry = interpolate(editorEntrySpring, [0, 1], [0.94, 1]);
  const editorSlideY = interpolate(editorEntrySpring, [0, 1], [22, 0]);
  const editorFrame = Math.min(lf2, 100);
  const contentChars = Math.floor(
    interpolate(editorFrame, [8, 90], [0, 280], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const postsVisible = Math.min(
    4,
    Math.floor(
      interpolate(editorFrame, [5, 40], [0, 4.99], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    ),
  );
  const imageGenerating = editorFrame >= 5 && editorFrame < 55;
  const imageGenProgress = Math.min(1, Math.max(0, (editorFrame - 5) / 50));
  const entryOverlayOp =
    isPhase2 && !isPhase3
      ? interpolate(lf2, [0, 38], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const panT = interpolate(lf3, [10, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const panX = -easeIO(panT) * PAN_RANGE_NATURAL;
  const overlayProgress = interpolate(
    lf3,
    [OVERLAY_IN_P3, OVERLAY_OUT_P3],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const overlayOpacity = interpolate(overlayProgress, [0, 1], [0, 0.82]);

  const globalFade = interpolate(
    frame,
    [FADE_OUT_START, FADE_OUT_END],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const line1Yellow = ["SHARE", "A", "LINK."];
  const line1White = ["GET", "NATIVE", "FORMAT"];
  const line2Pink = ["FOR", "EVERY", "CHANNEL"];

  // Sparkle positions for Phase 1
  const sparkles = [
    { x: 640, y: 308, size: 11, phase: 0 },
    { x: 432, y: 548, size: 9, phase: 1.5 },
    { x: 820, y: 438, size: 10, phase: 0.8 },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <AbsoluteFill
        style={{
          fontFamily: '"Inter","SF Pro Display",-apple-system,sans-serif',
          overflow: "hidden",
          opacity: globalFade,
        }}
      >
        {/* ── Phase 1: Gradient background ──────────────────────────────── */}
        {!isPhase2 && (
          <AbsoluteFill
            style={{
              background:
                "radial-gradient(ellipse at 75% 100%, rgba(255,88,155,0.45) 0%, rgba(200,45,95,0.18) 32%, transparent 58%), " +
                "radial-gradient(ellipse at 20% 100%, rgba(245,230,66,0.10) 0%, transparent 40%), " +
                "#060608",
            }}
          />
        )}

        {/* ── Phase 1: Concentric rings (background layer, not zoomed) ──── */}
        {!isPhase2 && (
          <AbsoluteFill
            style={{ opacity: phase1Opacity, pointerEvents: "none" }}
          >
            <svg
              width="1270"
              height="760"
              style={{ position: "absolute", inset: 0 }}
            >
              {[165, 295, 435, 580].map((r, i) => (
                <circle
                  key={i}
                  cx={635}
                  cy={380}
                  r={r}
                  fill="none"
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth="1"
                />
              ))}
            </svg>
          </AbsoluteFill>
        )}

        {/* ── Phase 1: Floating platform objects ────────────────────────── */}
        {!isPhase2 && (
          <AbsoluteFill style={{ opacity: phase1Opacity }}>
            {FLOAT_OBJECTS.map((obj, i) => (
              <FloatingObject key={i} obj={obj} frame={frame} fps={fps} />
            ))}
            {/* Sparkles */}
            {sparkles.map((s, i) => {
              const pulse =
                0.25 + 0.15 * Math.sin((frame / 40 + s.phase) * Math.PI * 2);
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: s.x,
                    top: s.y,
                    opacity: pulse,
                    pointerEvents: "none",
                  }}
                >
                  <Sparkle size={s.size} />
                </div>
              );
            })}
          </AbsoluteFill>
        )}

        {/* ── Phase 1: Prompt bar with camera zoom ──────────────────────── */}
        {!isPhase2 && (
          <AbsoluteFill style={{ opacity: phase1Opacity }}>
            <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  transform: `scale(${currentZoom})`,
                  transformOrigin: "50% 50%",
                  willChange: "transform",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    opacity: barOpacity,
                    transform: `translateY(${barTranslateY}px) scale(${barScale})`,
                    willChange: "transform",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 660,
                      zIndex: 20,
                    }}
                  >
                    <CompactPrompt
                      chars={charsP1}
                      frame={frame}
                      showCursor={frame >= 11 && frame < PHASE1_CLICK}
                      highlighted={generateHighlighted}
                    />
                  </div>
                </div>
              </div>
            </div>
          </AbsoluteFill>
        )}

        {/* ── Phase 1: Mouse cursor ─────────────────────────────────────── */}
        {!isPhase2 && <Cursor keyframes={cursorKFs} />}


        {/* ── Phase 2: Dark base ────────────────────────────────────────── */}
        {isPhase2 && <AbsoluteFill style={{ background: "#0A0A0A" }} />}

        {/* ── Phase 3: Gradient background ──────────────────────────────── */}
        {isPhase3 && (
          <AbsoluteFill
            style={{
              background:
                "radial-gradient(ellipse at 15% 60%, rgba(40,20,80,0.55) 0%, transparent 55%), " +
                "radial-gradient(ellipse at 85% 40%, rgba(80,15,40,0.45) 0%, transparent 50%), " +
                "#080810",
              opacity: interpolate(lf3, [0, 30], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          />
        )}

        {/* ── Phase 2: Editor ───────────────────────────────────────────── */}
        {isPhase2 && !isPhase3 && (
          <AbsoluteFill>
            <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 1,
                  pointerEvents: "none",
                  background:
                    "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(0,0,0,0.45) 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: 1920,
                  height: 1080,
                  top: EDITOR_TOP,
                  left: 0,
                  transform: `scale(${EDITOR_SCALE})`,
                  transformOrigin: "top left",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: "64px 96px",
                    opacity: editorOpacity,
                    transform: `scale(${editorScaleEntry}) translateY(${editorSlideY}px)`,
                    transformOrigin: "center center",
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow:
                      "0 2px 8px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)",
                  }}
                >
                  <LayerProofEditor
                    activeTabIndex={0}
                    contentChars={contentChars}
                    postsVisible={postsVisible}
                    activePostIndex={0}
                    frame={editorFrame}
                    imageGenerating={imageGenerating}
                    imageGenProgress={imageGenProgress}
                  />
                </div>
              </div>
            </div>
          </AbsoluteFill>
        )}

        {/* ── Phase 3: Card strip + Anton headline ──────────────────────── */}
        {isPhase3 && (
          <>
            <div
              style={{
                position: "absolute",
                top: STRIP_TOP,
                left: 0,
                width: STRIP_W,
                height: MAX_H,
                display: "flex",
                alignItems: "flex-end",
                gap: GAP,
                paddingLeft: SIDE_PAD,
                paddingRight: SIDE_PAD,
                boxSizing: "border-box",
                transform: `scale(${CARD_STRIP_SCALE}) translateX(${panX}px)`,
                transformOrigin: "top left",
                willChange: "transform",
              }}
            >
              {CARDS.map((card) => (
                <FlyInCard
                  key={card.id}
                  card={card}
                  frame={lf3}
                  fps={fps}
                  overlayProgress={overlayProgress}
                />
              ))}
            </div>

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.65) 100%)",
                opacity: overlayOpacity,
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                pointerEvents: "none",
                paddingTop: 40,
                paddingBottom: 40,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "baseline",
                  paddingBottom: 8,
                }}
              >
                {line1Yellow.map((word, i) => (
                  <Word
                    key={`y-${word}`}
                    text={word}
                    frame={lf3}
                    fps={fps}
                    startFrame={TEXT_LINE1_P3 + i * 6}
                    style={{
                      fontFamily: antonFamily,
                      fontSize: 68,
                      color: YELLOW,
                      letterSpacing: 1,
                      lineHeight: 1,
                    }}
                  />
                ))}
                {line1White.map((word, i) => (
                  <Word
                    key={`w-${word}`}
                    text={word}
                    frame={lf3}
                    fps={fps}
                    startFrame={TEXT_LINE1_P3 + (line1Yellow.length + i) * 6}
                    style={{
                      fontFamily: antonFamily,
                      fontSize: 68,
                      color: "#FFFFFF",
                      letterSpacing: 1,
                      lineHeight: 1,
                    }}
                  />
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 22,
                  alignItems: "baseline",
                  paddingBottom: 8,
                }}
              >
                {line2Pink.map((word, i) => (
                  <Word
                    key={`p-${word}`}
                    text={word}
                    frame={lf3}
                    fps={fps}
                    startFrame={TEXT_LINE2_P3 + i * 7}
                    style={{
                      fontFamily: antonFamily,
                      fontSize: 86,
                      color: PINK,
                      letterSpacing: 2,
                      lineHeight: 1,
                    }}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Phase 2: Entry overlay ────────────────────────────────────── */}
        {entryOverlayOp > 0 && (
          <AbsoluteFill
            style={{
              background: "#0A0A0A",
              opacity: entryOverlayOp,
              zIndex: 30,
              pointerEvents: "none",
            }}
          />
        )}

      </AbsoluteFill>
    </ThemeProvider>
  );
};
