// src/components/scenes/vellum/VellumConsistency.tsx
// Scene 2 — "More Consistency" (local frames 0–80)
// Entry:  "More Consistency" moves up as a unit (spring), chars stagger up
// Exit:   slides left + fades; next scene pushes in from right

import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { easeIO3 } from '../../../lib/animations';

const INTER     = '"Inter", "SF Pro Display", -apple-system, sans-serif';
const PINK      = '#FF589B';
const FONT_SIZE = 120;

const WORD2_CHARS = 'Consistency'.split('');

const ENTRY_START  = 5;
const CHAR_START   = 8;
const CHAR_STAGGER = 2;

const EXIT_START = 58;
const EXIT_END   = 74;

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

const textBase: React.CSSProperties = {
  fontFamily: INTER, fontSize: FONT_SIZE, fontWeight: 600, letterSpacing: -2, lineHeight: 1,
};

export const VellumConsistency: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Scene slide-up entrance from bottom ──────────────────────────────────
  const entrySpring  = spring({ frame, fps, config: { stiffness: 55, damping: 18 } });
  const entryY       = interpolate(entrySpring, [0, 1], [1080, 0]);

  // ── Scene fade-out at the very end ───────────────────────────────────────
  const sceneOpacity = interpolate(frame, [EXIT_END, EXIT_END + 5], [1, 0], clamp);

  // ── Text exit: slides left + fades ───────────────────────────────────────
  const exitT   = easeIO3(interpolate(frame, [EXIT_START, EXIT_END], [0, 1], clamp));
  const exitX   = -400 * exitT;
  const exitOp  = 1 - exitT;

  // ── "More" — move up entry ────────────────────────────────────────────────
  const moreSpring  = spring({ frame: Math.max(0, frame - ENTRY_START), fps, config: { stiffness: 90, damping: 20 } });
  const moreOpacity = interpolate(frame, [ENTRY_START, ENTRY_START + 10], [0, 1], clamp);
  const moreY       = interpolate(moreSpring, [0, 1], [40, 0]);

  // ── "Consistency" chars — stagger up ─────────────────────────────────────
  const charAnims = WORD2_CHARS.map((_, i) => {
    const delay = CHAR_START + i * CHAR_STAGGER;
    const s = spring({ frame: Math.max(0, frame - delay), fps, config: { stiffness: 130, damping: 14 } });
    return {
      opacity: interpolate(frame, [delay, delay + 8], [0, 1], clamp),
      y: interpolate(s, [0, 1], [40, 0]),
    };
  });

  return (
    <AbsoluteFill style={{ background: '#FFFFFF', opacity: sceneOpacity, transform: `translateY(${entryY}px)` }}>

      {/* ── "More Consistency" — moves up, exits left ── */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        whiteSpace: 'nowrap',
        transform: `translateX(${exitX}px)`,
        opacity: exitOp,
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
