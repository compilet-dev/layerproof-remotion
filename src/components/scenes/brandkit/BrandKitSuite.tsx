// src/components/scenes/brandkit/BrandKitSuite.tsx
// Scene 3 — Creative Suite Unlock (local frames 0–195, 6.5s)
// Brand Kit Active label → "Unlock the Creative Suite" → two feature cards whoosh in

import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { springReveal } from '../../../lib/animations';
import { useTheme } from '../../../lib/theme';
import { Cursor } from '../../ui/Cursor';
import type { CursorKeyframe } from '../../../types';

// ── Timing ───────────────────────────────────────────────────────────────────

const HEADER_IN   = 5;
const CARD1_IN    = 42;
const CARD2_IN    = 62;

const CURSOR_IN   = 90;   // cursor appears, moves toward Social Post card
const HOVER_START = 110;  // card turns yellow
const CLICK_FRAME = 135;  // cursor clicks
const EXIT_START  = 148;
const EXIT_END    = 168;

const CANVAS_W = 1920;
const CANVAS_H = 1080;

// Social Post card centre in normalised coords (approx for 1920×1080 layout)
// Cards are right-half of screen; card 1 (Social Post) is the top card.
// Right column starts ~960+60=1020, card width 640, centred → x≈1340 → 1340/1920≈0.698
// Vertically: centre 1080/2 - card_height/2 - gap/2 ≈ 540 - 68 - 12 = 460 → 460/1080≈0.426
const CARD1_X = 0.698;
const CARD1_Y = 0.40;

const CURSOR_KFS: CursorKeyframe[] = [
  { frame: CURSOR_IN,    x: 0.82,   y: 0.70 },
  { frame: HOVER_START,  x: CARD1_X, y: CARD1_Y },
  { frame: CLICK_FRAME,  x: CARD1_X, y: CARD1_Y, click: true },
  { frame: EXIT_START,   x: CARD1_X, y: CARD1_Y },
];

// ── Feature cards ────────────────────────────────────────────────────────────

const IconSocialPost = ({ color }: { color: string }) => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const IconPresentation = ({ color }: { color: string }) => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const CARDS = [
  {
    Icon: IconSocialPost,
    title: 'Social Post',
    desc: 'Create single posts and carousels.',
    fromX: -160,
  },
  {
    Icon: IconPresentation,
    title: 'Presentation',
    desc: 'Build slide decks from templates.',
    fromX:  160,
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export const BrandKitSuite: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const PINK   = theme.colors.accentPink   ?? '#FF589B';
  const YELLOW = theme.colors.accentYellow ?? '#FFD600';

  const sceneOpacity = interpolate(frame, [0, 15, EXIT_START, EXIT_END], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Header reveal
  const { opacity: headerRevealOp, y: headerY } = springReveal(frame, fps, HEADER_IN, 20, {
    stiffness: 80, damping: 22,
  });
  const headerBlur          = interpolate(headerRevealOp, [0, 1], [8, 0]);
  const headerLetterSpacing = interpolate(headerRevealOp, [0, 1], [6, -2]);

  // Card animations
  const cardAnims = [CARD1_IN, CARD2_IN].map((delay, i) => {
    const s = spring({ frame: Math.max(0, frame - delay), fps, config: { stiffness: 90, damping: 20 } });
    const x = interpolate(s, [0, 1], [CARDS[i].fromX, 0]);
    const opacity = interpolate(Math.max(0, frame - delay), [0, 18], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
    const pulseS = spring({ frame: Math.max(0, frame - (delay + 28)), fps, config: { stiffness: 220, damping: 16 } });
    const scale = interpolate(pulseS, [0, 0.3, 1], [1, 1.045, 1]);
    return { x, opacity, scale };
  });

  // Hover state: card 0 is "hovered" between HOVER_START and EXIT
  const hoverT = interpolate(frame, [HOVER_START, HOVER_START + 10], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Click flash: brief scale pop on click
  const clickPop = spring({ frame: Math.max(0, frame - CLICK_FRAME), fps, config: { stiffness: 400, damping: 18 } });
  const card0Scale = cardAnims[0].scale * interpolate(clickPop, [0, 0.15, 1], [1, 0.96, 1]);

  const card0Border = hoverT > 0
    ? `1.5px solid rgba(255,214,0,${0.55 + hoverT * 0.45})`
    : '1px solid rgba(255,255,255,0.10)';
  const card0Glow = hoverT > 0
    ? `0 0 40px ${YELLOW}33`
    : 'none';

  return (
    <AbsoluteFill style={{ background: theme.colors.bgDark, opacity: sceneOpacity, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: CANVAS_W, height: CANVAS_H,
      }}>
        {/* Dot-grid texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.035) 1px, transparent 0)',
          backgroundSize: '44px 44px',
          pointerEvents: 'none',
        }} />

        {/* Radial glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse 70% 55% at 50% 50%, ${PINK}0A 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'row',
          alignItems: 'center', justifyContent: 'center', gap: 0,
          paddingLeft: 120, paddingRight: 120,
        }}>
          {/* Header */}
          <h1 style={{
            opacity: headerRevealOp,
            transform: `translateY(${headerY}px)`,
            color: theme.colors.white,
            fontFamily: theme.font.family,
            fontSize: 88, fontWeight: 600,
            letterSpacing: headerLetterSpacing, margin: 0, lineHeight: 1.2,
            filter: `blur(${headerBlur}px)`,
            flex: '0 0 auto', marginRight: 80,
          }}>
            Unlock the<br /><span style={{ color: PINK }}>Creative Suite</span>
          </h1>

          {/* Feature cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: '0 0 auto' }}>
            {CARDS.map((card, i) => {
              const isHovered = i === 0 && hoverT > 0;
              const iconColor = isHovered
                ? `rgba(255,214,0,${0.7 + hoverT * 0.3})`
                : 'rgba(255,255,255,0.85)';

              return (
                <div key={card.title} style={{
                  width: 780,
                  background: isHovered
                    ? `rgba(255,214,0,${0.04 * hoverT})`
                    : 'rgba(255,255,255,0.04)',
                  border: i === 0 ? card0Border : '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 28,
                  padding: '44px 52px',
                  display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 44,
                  opacity: cardAnims[i].opacity,
                  transform: `translateX(${cardAnims[i].x}px) scale(${i === 0 ? card0Scale : cardAnims[i].scale})`,
                  boxShadow: i === 0 ? card0Glow : 'none',
                }}>
                  <div style={{
                    width: 108, height: 108, borderRadius: 26, flexShrink: 0,
                    background: isHovered ? `rgba(255,214,0,${0.1 * hoverT})` : 'rgba(255,255,255,0.07)',
                    border: isHovered
                      ? `1px solid rgba(255,214,0,${0.4 + hoverT * 0.3})`
                      : '1px solid rgba(255,255,255,0.14)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <card.Icon color={iconColor} />
                  </div>
                  <div>
                    <div style={{
                      color: isHovered
                        ? `rgba(255,214,0,${0.85 + hoverT * 0.15})`
                        : theme.colors.white,
                      fontFamily: theme.font.family,
                      fontSize: 40, fontWeight: theme.font.weightBold,
                      letterSpacing: -0.5, marginBottom: 10,
                    }}>{card.title}</div>
                    <div style={{
                      color: 'rgba(255,255,255,0.45)',
                      fontFamily: theme.font.family,
                      fontSize: 28, fontWeight: 300,
                      lineHeight: 1.5,
                    }}>{card.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cursor */}
        <Cursor keyframes={CURSOR_KFS} containerWidth={CANVAS_W} containerHeight={CANVAS_H} />
      </div>
    </AbsoluteFill>
  );
};
