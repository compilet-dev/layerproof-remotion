// src/components/gif/phases/SlideStackPhase.tsx
// All animation logic for AI Slide Stack GIF composition

import React from "react";
import { interpolate, spring, staticFile } from "remotion";
import { fontFamily as antonFamily } from "@remotion/google-fonts/Anton";
import {
  fadeIn,
  fadeOut,
  floatY,
  springReveal,
  BRAND,
} from "../../../lib/animations";
import { boldTheme } from "../../../lib/themes/bold";
import type { Theme } from "../../../lib/theme";

// ─── Timing Constants ─────────────────────────────────────────────────────────

const HEADLINE_DELAY = 0;

const SLIDE_A_ARRIVE = 65;
const SLIDE_B_ARRIVE = 125;

const PROMPT_A_IN = -10;
const PROMPT_A_OUT = 65; // with base slide
const PROMPT_B_IN = 65;
const PROMPT_B_OUT = 125; // with slide A
const PROMPT_C_IN = 125;
const PROMPT_C_OUT = 165; // with slide B

const FOOTER_IN = 168;
const FLOAT_START = 172;

// 3 slides total: base (0), arrives at 70 (1), arrives at 145 (2)
const ARRIVE_FRAMES = [0, SLIDE_A_ARRIVE, SLIDE_B_ARRIVE];

// ─── Slide dimensions ─────────────────────────────────────────────────────────

const SLIDE_W = 700;
const SLIDE_H = 394; // 16:9

// ─── Stack helpers ────────────────────────────────────────────────────────────

/** stackDepth 0 = top (newest), n = bottom */
function stackDepth(activeIndex: number, totalActive: number): number {
  return totalActive - 1 - activeIndex;
}

function depthStyle(depth: number) {
  return {
    offsetX: depth * 10,
    offsetY: depth * 18, // peek DOWN so back slides show below front
    scale: 1 - depth * 0.025,
    opacity: Math.max(0.3, 1 - depth * 0.2),
  };
}

// ─── SlideContent ─────────────────────────────────────────────────────────────

// Remap slot index → image file index
const SLIDE_IMAGE_ORDER = [1, 0, 2];

const SlideContent: React.FC<{ slideId: number }> = ({ slideId }) => (
  <img
    src={staticFile(`slides/slide_${SLIDE_IMAGE_ORDER[slideId]}.png`)}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    }}
  />
);

// ─── SlideCard ────────────────────────────────────────────────────────────────

interface SlideCardProps {
  slideId: number;
  frame: number;
  fps: number;
  activeIndex: number; // position within active slides array (0 = oldest/bottom)
  totalActive: number;
  theme: Theme;
}

const SlideCard: React.FC<SlideCardProps> = ({
  slideId,
  frame,
  fps,
  activeIndex,
  totalActive,
  theme,
}) => {
  const arriveFrame = ARRIVE_FRAMES[slideId];
  const isBase = arriveFrame === 0;

  const currDepth = stackDepth(activeIndex, totalActive);
  const curr = depthStyle(currDepth);

  // --- Base slide (0) ---
  if (isBase) {
    const deckOpacity = 1;

    // Depth at each stage
    const d0 = stackDepth(activeIndex, 1); // initial (only base slide)
    const d1 = stackDepth(activeIndex, 2); // after slide 1 arrives
    const d2 = stackDepth(activeIndex, 3); // after slide 2 arrives

    const s0 = depthStyle(d0);
    const s1 = depthStyle(d1);
    const s2 = depthStyle(d2);

    const sp1 = spring({
      frame: Math.max(0, frame - SLIDE_A_ARRIVE),
      fps,
      config: BRAND.motion.gentle,
    });
    const sp2 = spring({
      frame: Math.max(0, frame - SLIDE_B_ARRIVE),
      fps,
      config: BRAND.motion.gentle,
    });

    const afterA = frame >= SLIDE_A_ARRIVE ? 1 : 0;
    const afterB = frame >= SLIDE_B_ARRIVE ? 1 : 0;

    const offsetX =
      s0.offsetX +
      afterA * (s1.offsetX - s0.offsetX) * sp1 +
      afterB * (s2.offsetX - s1.offsetX) * sp2;

    const offsetY =
      s0.offsetY +
      afterA * (s1.offsetY - s0.offsetY) * sp1 +
      afterB * (s2.offsetY - s1.offsetY) * sp2;

    const scale =
      s0.scale +
      afterA * (s1.scale - s0.scale) * sp1 +
      afterB * (s2.scale - s1.scale) * sp2;

    const opacityBase =
      s0.opacity +
      afterA * (s1.opacity - s0.opacity) * sp1 +
      afterB * (s2.opacity - s1.opacity) * sp2;

    return (
      <div
        style={{
          position: "absolute",
          width: SLIDE_W,
          height: SLIDE_H,
          borderRadius: theme.radius.md,
          overflow: "hidden",
          border: `1px solid ${theme.colors.glassBorder}`,
          boxShadow: "0 12px 48px rgba(0,0,0,0.6)",
          transform: `translateX(${offsetX}px) translateY(${offsetY}px) scale(${scale})`,
          opacity: deckOpacity * opacityBase,
          zIndex: 10 - currDepth,
        }}
      >
        <SlideContent slideId={slideId} />
      </div>
    );
  }

  // --- Arriving slides (1, 2) ---
  const arrivalProgress = spring({
    frame: Math.max(0, frame - arriveFrame),
    fps,
    config: BRAND.motion.apple,
  });

  const isArriving = frame < arriveFrame + 20;

  let offsetX: number;
  let offsetY: number;
  let scale: number;
  let opacity: number;

  if (isArriving) {
    offsetX = interpolate(
      arrivalProgress,
      [0, 1],
      [curr.offsetX - 20, curr.offsetX],
    );
    offsetY = interpolate(
      arrivalProgress,
      [0, 1],
      [curr.offsetY - 30, curr.offsetY],
    );
    scale = interpolate(arrivalProgress, [0, 1], [1.15, curr.scale]);
    opacity = interpolate(frame, [arriveFrame, arriveFrame + 8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else {
    // Settled — shift deeper as subsequent slides arrive
    const depthAtArrival = stackDepth(activeIndex, activeIndex + 1);
    const sAtArrival = depthStyle(depthAtArrival);

    const laterArrivals = ARRIVE_FRAMES.slice(slideId + 1).filter(
      (f) => f > arriveFrame,
    );

    let oX = sAtArrival.offsetX;
    let oY = sAtArrival.offsetY;
    let sc = sAtArrival.scale;
    let op = sAtArrival.opacity;
    let depthSoFar = depthAtArrival;

    for (const lf of laterArrivals) {
      if (frame >= lf) {
        const nextDepth = depthSoFar + 1;
        const nextS = depthStyle(nextDepth);
        const sp = spring({
          frame: Math.max(0, frame - lf),
          fps,
          config: BRAND.motion.gentle,
        });
        oX += (nextS.offsetX - depthStyle(depthSoFar).offsetX) * sp;
        oY += (nextS.offsetY - depthStyle(depthSoFar).offsetY) * sp;
        sc += (nextS.scale - depthStyle(depthSoFar).scale) * sp;
        op += (nextS.opacity - depthStyle(depthSoFar).opacity) * sp;
        depthSoFar = nextDepth;
      }
    }

    offsetX = oX;
    offsetY = oY;
    scale = sc;
    opacity = Math.max(0.3, op);
  }

  return (
    <div
      style={{
        position: "absolute",
        width: SLIDE_W,
        height: SLIDE_H,
        borderRadius: theme.radius.md,
        overflow: "hidden",
        border: `1px solid ${theme.colors.glassBorder}`,
        boxShadow: "0 12px 48px rgba(0,0,0,0.6)",
        transform: `translateX(${offsetX}px) translateY(${offsetY}px) scale(${scale})`,
        opacity,
        zIndex: 10 - currDepth,
      }}
    >
      <SlideContent slideId={slideId} />
    </div>
  );
};

// ─── HeadlineReveal ───────────────────────────────────────────────────────────

const HeadlineReveal: React.FC<{
  frame: number;
  fps: number;
  theme: Theme;
}> = ({ frame, fps, theme }) => {
  const { y } = springReveal(frame, fps, HEADLINE_DELAY, 28);
  return (
    <div
      style={{
        position: "absolute",
        top: 52,
        left: 0,
        right: 0,
        textAlign: "center",
        zIndex: 20,
        transform: `translateY(${y}px)`,
        opacity: 1,
      }}
    >
      <div
        style={{
          fontFamily: antonFamily,
          fontSize: 28,
          color: theme.colors.accentPink,
          letterSpacing: 2,
          textTransform: "uppercase" as const,
        }}
      >
        LAYERPROOF CHROMO
      </div>
      <div
        style={{
          fontFamily: antonFamily,
          fontSize: 50,
          color: theme.colors.white,
          marginTop: 12,
          letterSpacing: 0,
          lineHeight: 1.1,
          textTransform: "uppercase" as const,
        }}
      >
        AI slides you can stand behind
      </div>
    </div>
  );
};

// ─── PromptBubble ─────────────────────────────────────────────────────────────

interface PromptBubbleProps {
  frame: number;
  fps: number;
  text: string;
  inFrame: number;
  outFrame: number;
  theme: Theme;
}

const PromptBubble: React.FC<PromptBubbleProps> = ({
  frame,
  text,
  inFrame,
  outFrame,
  theme,
}) => {
  const opacity = Math.min(
    fadeIn(frame, inFrame, 10),
    fadeOut(frame, outFrame - 8, 8),
  );
  const cursorOn = Math.floor(frame / 18) % 2 === 0;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 52,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 40,
        opacity,
        width: 700,
      }}
    >
      {/* Pill bar — same design as CompactPrompt in PromptMultiPlatform */}
      <div
        style={{
          width: "100%",
          height: 64,
          borderRadius: 32,
          background: "rgba(28,28,28,0.94)",
          border: "1.5px solid rgba(255,255,255,0.18)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          display: "flex",
          alignItems: "center",
          paddingLeft: 24,
          paddingRight: 8,
          boxSizing: "border-box" as const,
          gap: 12,
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.06), 0 8px 48px rgba(0,0,0,0.7)",
        }}
      >
        {/* Text */}
        <div
          style={{
            flex: 1,
            fontSize: 20,
            fontWeight: 400,
            color: theme.colors.white,
            fontFamily: '"Inter","SF Pro Display",-apple-system,sans-serif',
            letterSpacing: 0.1,
            whiteSpace: "nowrap" as const,
            overflow: "hidden",
          }}
        >
          {text}
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: 20,
              background: "#FFFFFF",
              marginLeft: 3,
              opacity: cursorOn ? 1 : 0,
              verticalAlign: "middle",
              borderRadius: 1,
            }}
          />
        </div>

        {/* Generate button */}
        <div
          style={{
            height: 48,
            borderRadius: 24,
            flexShrink: 0,
            padding: "0 20px",
            background: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              fontFamily: '"Inter","SF Pro Display",-apple-system,sans-serif',
              color: "#0A0A0A",
              letterSpacing: 0.2,
              whiteSpace: "nowrap" as const,
            }}
          >
            Generate
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── FooterTagline ────────────────────────────────────────────────────────────

const FooterTagline: React.FC<{ frame: number; theme: Theme }> = ({
  frame,
  theme,
}) => {
  const opacity = fadeIn(frame, FOOTER_IN, 15);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        opacity,
        // Frosted glass overlay covering the whole frame
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        background: "rgba(10,10,10,0.55)",
      }}
    >
      <div
        style={{
          fontFamily: antonFamily,
          fontSize: 80,
          color: theme.colors.white,
          letterSpacing: 2,
          textAlign: "center",
          lineHeight: 1.15,

          textTransform: "uppercase" as const,
        }}
      >
        Your knowledge,
        <br />
        <span style={{ color: theme.colors.accentYellow }}>
          now visualized.
        </span>
      </div>
    </div>
  );
};

// ─── SlideStackPhase ─────────────────────────────────────────────────────────

export interface SlideStackPhaseProps {
  frame: number;
  fps: number;
}

export const SlideStackPhase: React.FC<SlideStackPhaseProps> = ({
  frame,
  fps,
}) => {
  const theme = boldTheme;

  const activeSlides = ARRIVE_FRAMES.map((arriveFrame, id) => ({
    id,
    arriveFrame,
  })).filter((s) => frame >= s.arriveFrame);

  const totalActive = activeSlides.length;

  const floatOffset =
    frame >= FLOAT_START ? floatY(frame - FLOAT_START, 5, 90) : 0;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Background image */}
      <img
        src={staticFile("gifbg.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
        }}
      />

      <HeadlineReveal frame={frame} fps={fps} theme={theme} />

      {/* Deck — centered with float in final hold */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, calc(-34% + ${floatOffset}px))`,
          width: SLIDE_W,
          height: SLIDE_H,
        }}
      >
        {activeSlides.map(({ id }, activeIndex) => (
          <SlideCard
            key={id}
            slideId={id}
            frame={frame}
            fps={fps}
            activeIndex={activeIndex}
            totalActive={totalActive}
            theme={theme}
          />
        ))}
      </div>

      <PromptBubble
        frame={frame}
        fps={fps}
        text="Educational slide explaining electromagnetic waves"
        inFrame={PROMPT_A_IN}
        outFrame={PROMPT_A_OUT}
        theme={theme}
      />
      <PromptBubble
        frame={frame}
        fps={fps}
        text="Product and regional sales performance report"
        inFrame={PROMPT_B_IN}
        outFrame={PROMPT_B_OUT}
        theme={theme}
      />
      <PromptBubble
        frame={frame}
        fps={fps}
        text="Understanding and treating anxiety"
        inFrame={PROMPT_C_IN}
        outFrame={PROMPT_C_OUT}
        theme={theme}
      />

      <FooterTagline frame={frame} theme={theme} />
    </div>
  );
};
