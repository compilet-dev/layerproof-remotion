// src/components/scenes/solution/DashboardReveal.tsx
// Scene 1: symbol springs in at center → grid fades in → symbol shifts left → name reveals (0–150f)
//
// IMAGE PLACEHOLDERS
// ─────────────────────────────────────────────────────────────────
// Add your slide images to:  public/slides/
//   slide_01.jpg … slide_08.jpg   (any aspect ratio, JPG or PNG)
// Cards show a styled colour placeholder until images are added.
// ─────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useTheme } from "../../../lib/theme";
import { DM_SANS_FAMILY } from "../../../lib/loadFont";

// ─── Image slots ──────────────────────────────────────────────────────────────
const slide = (n: number) =>
  staticFile(`slides/slide_${String(n).padStart(2, "0")}.jpg`);

// ─── Card definitions ─────────────────────────────────────────────────────────

type CardDef = {
  height: number;
  bg: string;
  slideSlot?: number;
  textColor?: string;
  title?: string;
  subtitle?: string;
};

const ALL_CARDS: CardDef[] = [
  {
    height: 320,
    bg: "#FFFFFF",
    slideSlot: 1,
    textColor: "#0a0a0a",
    title: "slide_01.jpg",
  },
  {
    height: 260,
    bg: "#1a1a1a",
    textColor: "#fff",
    title: "CONTENT\nSTRATEGY",
    subtitle: "Powered by LayerProof",
  },
  {
    height: 380,
    bg: "#2A2A2A",
    slideSlot: 2,
    textColor: "#fff",
    title: "slide_02.jpg",
  },
  {
    height: 240,
    bg: "#4A7FBF",
    textColor: "#fff",
    title: "BRAND\nVOICE",
    subtitle: "One prompt. Every platform.",
  },
  {
    height: 300,
    bg: "#F5F0E8",
    slideSlot: 3,
    textColor: "#1a1a1a",
    title: "slide_03.jpg",
  },
  {
    height: 360,
    bg: "#E8856A",
    textColor: "#fff",
    title: "SOCIAL\nFIRST",
    subtitle: "Instagram · LinkedIn · X",
  },
  {
    height: 280,
    bg: "#1C2B3A",
    slideSlot: 4,
    textColor: "#fff",
    title: "slide_04.jpg",
  },
  {
    height: 320,
    bg: "#EDE8DF",
    textColor: "#1a1a1a",
    title: "CAMPAIGN\nREADY",
    subtitle: "Auto-formatted",
  },
  {
    height: 260,
    bg: "#2D1B69",
    slideSlot: 5,
    textColor: "#fff",
    title: "slide_05.jpg",
  },
  {
    height: 300,
    bg: "#D4E8C2",
    textColor: "#1a1a1a",
    title: "AI\nGENERATED",
    subtitle: "100% on-brand",
  },
  {
    height: 340,
    bg: "#111111",
    slideSlot: 6,
    textColor: "#fff",
    title: "slide_06.jpg",
  },
  {
    height: 220,
    bg: "#C9B99A",
    textColor: "#1a1a1a",
    title: "PUBLISH\nEVERYWHERE",
    subtitle: "In one click",
  },
  {
    height: 360,
    bg: "#3D2B1F",
    slideSlot: 7,
    textColor: "#fff",
    title: "slide_07.jpg",
  },
  {
    height: 280,
    bg: "#0A3D2B",
    textColor: "#fff",
    title: "GROW\nFASTER",
    subtitle: "LayerProof AI",
  },
  {
    height: 320,
    bg: "#1A1A2E",
    slideSlot: 8,
    textColor: "#fff",
    title: "slide_08.jpg",
  },
  {
    height: 260,
    bg: "#F0EBE1",
    textColor: "#222",
    title: "ONE\nPROMPT",
    subtitle: "Every platform.",
  },
];

// Three columns for right-half layout
const COLUMNS: CardDef[][] = [
  [
    ALL_CARDS[0],
    ALL_CARDS[3],
    ALL_CARDS[7],
    ALL_CARDS[11],
    ALL_CARDS[14],
    ALL_CARDS[2],
  ],
  [
    ALL_CARDS[5],
    ALL_CARDS[9],
    ALL_CARDS[12],
    ALL_CARDS[1],
    ALL_CARDS[8],
    ALL_CARDS[4],
  ],
  [
    ALL_CARDS[10],
    ALL_CARDS[6],
    ALL_CARDS[15],
    ALL_CARDS[13],
    ALL_CARDS[0],
    ALL_CARDS[3],
  ],
];

const COL_SPEEDS = [6, -7, 6.5];
const COL_WIDTH = 330;
const COL_GAP = 14;

// ─── Card ─────────────────────────────────────────────────────────────────────

const Card: React.FC<{ card: CardDef }> = ({ card }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        width: COL_WIDTH,
        height: card.height,
        background: card.bg,
        borderRadius: 12,
        overflow: "hidden",
        flexShrink: 0,
        position: "relative",
        marginBottom: COL_GAP,
      }}
    >
      {card.slideSlot !== undefined && (
        <img
          src={slide(card.slideSlot)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}
      {card.title && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "20px 22px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            background: card.slideSlot
              ? "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)"
              : "transparent",
          }}
        >
          <div
            style={{
              fontFamily: theme.font.family,
              fontSize: card.slideSlot ? 12 : 24,
              fontWeight: card.slideSlot
                ? theme.font.weightLight
                : theme.font.weightBlack,
              color: card.textColor ?? "#fff",
              lineHeight: 1.2,
              whiteSpace: "pre-line",
              opacity: card.slideSlot ? 0.5 : 1,
              letterSpacing: -0.3,
            }}
          >
            {card.title}
          </div>
          {card.subtitle && (
            <div
              style={{
                fontFamily: theme.font.family,
                fontSize: 10,
                color: card.textColor ?? "#fff",
                opacity: 0.45,
                marginTop: 5,
                letterSpacing: 0.4,
              }}
            >
              {card.subtitle}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Scrolling column ─────────────────────────────────────────────────────────

const ScrollColumn: React.FC<{
  cards: CardDef[];
  speed: number;
  frame: number;
}> = ({ cards, speed, frame }) => {
  const totalH = cards.reduce((s, c) => s + c.height + COL_GAP, 0);
  const goingDown = speed < 0;
  const offset = (frame * Math.abs(speed)) % totalH;
  const translateY = goingDown ? offset - totalH : -offset;
  return (
    <div style={{ width: COL_WIDTH, overflow: "hidden", height: "100%" }}>
      <div
        style={{
          transform: `translateY(${translateY}px)`,
          willChange: "transform",
        }}
      >
        {[0, 1].map((pass) =>
          cards.map((card, i) => <Card key={`${pass}-${i}`} card={card} />),
        )}
      </div>
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

export const DashboardReveal: React.FC = () => {
  const [symbolError, setSymbolError] = useState(false);
  const frame = useCurrentFrame();

  const { fps } = useVideoConfig();
  const theme = useTheme();

  // ── Timings ───────────────────────────────────────────────────────────────
  const LOGO_IN = 5; // symbol springs in immediately
  const LOGO_PEAK = 22; // settled — breathe starts
  const SHIFT_START = 38; // symbol slides left, name reveals
  const TEXT_IN = 46;
  const EXIT_START = 100;
  const SCENE_END = 128;
  const SYMBOL_SIZE = 180;
  const LOCKUP_GAP = 2;
  const LOCKUP_OFFSET_INITIAL = (480 + LOCKUP_GAP) / 2; // ≈ 252

  // ── Grid fades in as symbol settles ──────────────────────────────────────
  const gridOpacity = interpolate(frame, [LOGO_IN + 8, LOGO_IN + 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Symbol: dramatic bouncy spring in ────────────────────────────────────
  const logoSpring = spring({
    frame: Math.max(0, frame - LOGO_IN),
    fps,
    config: { stiffness: 260, damping: 14 }, // big overshoot
  });
  const logoEnterScale = interpolate(logoSpring, [0, 1], [0, 1]);
  const logoEnterOpacity = interpolate(frame, [LOGO_IN, LOGO_IN + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Lockup wrapper: symbol at screen center → shifts left as name reveals ─
  const shiftSpring = spring({
    frame: Math.max(0, frame - SHIFT_START),
    fps,
    config: theme.motion.apple,
  });
  const wrapperShiftX = interpolate(
    shiftSpring,
    [0, 1],
    [LOCKUP_OFFSET_INITIAL, -540],
  );

  // ── Name reveal: slides in from right ─────────────────────────────────────
  const textSpring = spring({
    frame: Math.max(0, frame - TEXT_IN),
    fps,
    config: theme.motion.apple,
  });
  const textOpacity = interpolate(textSpring, [0, 1], [0, 1]);
  const textSlideX = interpolate(textSpring, [0, 1], [48, 0]);

  // ── Breathe ───────────────────────────────────────────────────────────────
  const breathe = Math.sin((frame / 50) * Math.PI * 2);
  const logoBreath =
    frame >= LOGO_PEAK ? interpolate(breathe, [-1, 1], [0.98, 1.02]) : 1;

  // ── Exit ──────────────────────────────────────────────────────────────────
  const exitOpacity = interpolate(frame, [EXIT_START, SCENE_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoScale = logoEnterScale * logoBreath;

  return (
    <AbsoluteFill
      style={{
        background: "#0A0A0A",
        overflow: "hidden",
      }}
    >
      {/* ── Scrolling card grid — right side only, slightly rotated ─────────── */}
      <div
        style={{
          position: "absolute",
          top: "-12%",
          bottom: "-12%",
          left: "44%",
          right: "-3%",
          opacity: gridOpacity,
          display: "flex",
          alignItems: "flex-start",
          gap: COL_GAP,
          transform: "rotate(4deg)",
          transformOrigin: "center center",
        }}
      >
        {COLUMNS.map((cards, ci) => (
          <ScrollColumn
            key={ci}
            cards={cards}
            speed={COL_SPEEDS[ci]}
            frame={frame}
          />
        ))}
      </div>

      {/* Left-edge fade — blends card grid into dark background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "42%",
          width: 180,
          background:
            "linear-gradient(to right, #0A0A0A 0%, rgba(10,10,10,0.85) 40%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Top + bottom fade to keep edges clean */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, #0A0A0A 0%, transparent 12%, transparent 88%, #0A0A0A 100%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* ── Logo + Name lockup — single flex wrapper for perfect centering ──── */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(calc(-50% + ${wrapperShiftX}px), -50%)`,
          display: "flex",
          alignItems: "center",
          gap: LOCKUP_GAP,
          opacity: exitOpacity,
          willChange: "transform",
        }}
      >
        {/* Logo symbol */}
        <div
          style={{
            width: SYMBOL_SIZE,
            height: SYMBOL_SIZE,
            flexShrink: 0,
            transform: `scale(${logoScale})`,
            opacity: logoEnterOpacity,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {symbolError ? (
            /* CSS placeholder: stacked colored squares */
            <div
              style={{
                position: "relative",
                width: SYMBOL_SIZE * 0.65,
                height: SYMBOL_SIZE * 0.65,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: "60%",
                  height: "80%",
                  background: "#E5527A",
                  borderRadius: 4,
                  left: 0,
                  top: "10%",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "60%",
                  height: "80%",
                  background: "#F2D96B",
                  borderRadius: 4,
                  right: 0,
                  top: 0,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "45%",
                  height: "70%",
                  background: "#FFFFFF",
                  borderRadius: 4,
                  left: "25%",
                  top: "15%",
                }}
              />
            </div>
          ) : (
            <img
              src={staticFile("layerproof-symbol.png")}
              alt="LayerProof"
              onError={() => setSymbolError(true)}
              style={{
                width: "50%",
                height: "50%",
                objectFit: "contain",
                userSelect: "none",
              }}
            />
          )}
        </div>

        {/* "LayerProof" name */}
        <span
          style={{
            fontFamily: DM_SANS_FAMILY,
            fontSize: 100,
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: -2,
            lineHeight: 1,
            whiteSpace: "nowrap",
            opacity: textOpacity,
            transform: `translateX(${textSlideX}px)`,
            display: "inline-block",
          }}
        >
          LayerProof
        </span>
      </div>
    </AbsoluteFill>
  );
};
