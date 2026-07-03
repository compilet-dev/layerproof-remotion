// src/components/scenes/vellum/VellumEfficient.tsx
// Scene 4 — "More Efficient" (local frames 0–95)
// Overlays on FiveAngles' completed card spread via frosted glass.
// Entry:  overlay fades in, "More Efficient" chars stagger up
// Exit:   fades to solid white (no blur) → bridges into PlatformParallel

import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const INTER     = '"Inter", "SF Pro Display", -apple-system, sans-serif';
const PINK      = '#FF589B';
const FONT_SIZE = 120;

const WORD2_CHARS = 'Efficient'.split('');

const ENTRY_START  = 5;
const CHAR_START   = 8;
const CHAR_STAGGER = 2;

const EXIT_START = 70;
const EXIT_END   = 93;

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

const textBase: React.CSSProperties = {
  fontFamily: INTER, fontSize: FONT_SIZE, fontWeight: 600, letterSpacing: -2, lineHeight: 1,
};

export const VellumEfficient: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Frosted overlay fades in ──────────────────────────────────────────────
  const overlayFade = interpolate(frame, [0, 18], [0, 1], clamp);

  // ── Exit: fade to solid white (no blur) ──────────────────────────────────
  const bgAlpha = interpolate(frame, [EXIT_START, EXIT_END], [1.0,  0  ], clamp);
  const blurAmt = interpolate(frame, [EXIT_START, EXIT_END], [0,    0  ], clamp);
  const textOp  = interpolate(frame, [EXIT_START, EXIT_END], [1,    0  ], clamp);

  // ── "More" — move up entry ────────────────────────────────────────────────
  const moreSpring  = spring({ frame: Math.max(0, frame - ENTRY_START), fps, config: { stiffness: 90, damping: 20 } });
  const moreOpacity = interpolate(frame, [ENTRY_START, ENTRY_START + 10], [0, 1], clamp);
  const moreY       = interpolate(moreSpring, [0, 1], [40, 0]);

  // ── "Efficient" chars — stagger up ───────────────────────────────────────
  const charAnims = WORD2_CHARS.map((_, i) => {
    const delay = CHAR_START + i * CHAR_STAGGER;
    const s = spring({ frame: Math.max(0, frame - delay), fps, config: { stiffness: 130, damping: 14 } });
    return {
      opacity: interpolate(frame, [delay, delay + 8], [0, 1], clamp),
      y: interpolate(s, [0, 1], [40, 0]),
    };
  });

  return (
    <AbsoluteFill>

      {/* ── White overlay — fades in over cards, exits to solid white ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `rgba(245,245,247,${bgAlpha * overlayFade})`,
      }} />

      {/* ── "More Efficient" — moves up, fades out on exit ── */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        whiteSpace: 'nowrap',
        opacity: textOp,
      }}>
        <span style={{
          ...textBase, color: '#0A0A0A', marginRight: 18,
          display: 'inline-block',
          opacity: moreOpacity,
          transform: `translateY(${moreY}px)`,
        }}>
          More
        </span>
        {WORD2_CHARS.map((char, i) => (
          <span key={i} style={{
            ...textBase, color: PINK,
            display: 'inline-block',
            opacity: charAnims[i].opacity,
            transform: `translateY(${charAnims[i].y}px)`,
          }}>
            {char}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
