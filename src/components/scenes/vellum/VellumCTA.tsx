// src/components/scenes/vellum/VellumCTA.tsx
// Scene 6 — CTA (local frames 0–180)
// Phase 1: "Build your ultimate creative workflow." exits left
// Phase 2: "Try [logo] LayerProof Vellum today." slides in from right

import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { easeIO3 } from '../../../lib/animations';

const INTER = '"Inter", "SF Pro Display", -apple-system, sans-serif';
const PINK = '#FF589B';

// ── Timing ──────────────────────────────────────────────────────────────────
const P1_IN_START  = 5;
const P1_IN_END    = 22;
const P1_EXIT_START = 65;
const P1_EXIT_END   = 88;

const P2_ENTER_START = 72;
const P2_SETTLE_END  = 112;

const FADE_OUT_START = 158;
const FADE_OUT_END   = 180;

export const VellumCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade out
  const sceneOpacity = interpolate(frame, [FADE_OUT_START, FADE_OUT_END], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const p1FadeIn = interpolate(frame, [P1_IN_START, P1_IN_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const p1ExitT = easeIO3(
    interpolate(frame, [P1_EXIT_START, P1_EXIT_END], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
  const p1Opacity = p1FadeIn * (1 - p1ExitT);
  const p1X = -400 * p1ExitT;

  // ── Phase 2 — roll up from bottom ─────────────────────────────────────────
  const p2Spring = spring({
    frame: Math.max(0, frame - P2_ENTER_START),
    fps,
    config: { stiffness: 72, damping: 18 },
  });
  const p2Y = interpolate(p2Spring, [0, 1], [120, 0]);
  const p2Opacity = interpolate(frame, [P2_ENTER_START, P2_ENTER_START + 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Nudge: fires once roll-up has settled, scale 1.0 → 1.05 → spring back to 1.0
  const NUDGE_START_F  = P2_ENTER_START + 32;
  const NUDGE_ATTACK   = 5; // frames to reach peak
  const NUDGE_PEAK     = 1.05;
  const nudgeAge = Math.max(0, frame - NUDGE_START_F);
  // attack: easeOutQuad from 1.0 → NUDGE_PEAK
  const upT      = Math.min(1, nudgeAge / NUDGE_ATTACK);
  const upEased  = 1 - Math.pow(1 - upT, 2);
  const nudgeUp  = 1 + (NUDGE_PEAK - 1) * upEased;
  // spring: from NUDGE_PEAK back to 1.0, starts exactly when attack ends
  const nudgeDownSpring = spring({
    frame: Math.max(0, nudgeAge - NUDGE_ATTACK),
    fps,
    config: { stiffness: 180, damping: 22 },
  });
  const nudgeDown  = interpolate(nudgeDownSpring, [0, 1], [NUDGE_PEAK, 1.0]);
  const nudgeScale = nudgeAge <= NUDGE_ATTACK ? nudgeUp : nudgeDown;

  return (
    <AbsoluteFill style={{ background: '#FFFFFF', opacity: sceneOpacity }}>
      {/* Edge vignette — matches Hook */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 88% 78% at 50% 50%, transparent 52%, rgba(205,205,215,0.25) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Phase 1: "Build your ultimate creative workflow." ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: p1Opacity,
          transform: `translateX(${p1X}px)`,
        }}
      >
        <span
          style={{
            fontFamily: INTER,
            fontSize: 88,
            fontWeight: 600,
            color: '#0A0A0A',
            letterSpacing: -2,
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          Build your ultimate creative workflow.
        </span>
      </div>

      {/* ── Phase 2: "Try [logo] LayerProof Vellum today." ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: p2Opacity,
          transform: `translateY(${p2Y}px)`,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {/* "Try " */}
          <span
            style={{
              fontFamily: INTER,
              fontSize: 88,
              fontWeight: 600,
              color: '#0A0A0A',
              letterSpacing: -2,
              lineHeight: 1,
            }}
          >
            Try&nbsp;
          </span>

          {/* Logo + "LayerProof" + "Vellum" — grouped nudge bounce when Vellum finishes */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              transform: `scale(${nudgeScale})`,
              transformOrigin: 'center bottom',
            }}
          >
            <img
              src={staticFile('layerproof-symbol.png')}
              alt=""
              style={{
                width: 76,
                height: 76,
                objectFit: 'contain',
                marginRight: 10,
                flexShrink: 0,
              }}
            />

            <span
              style={{
                fontFamily: INTER,
                fontSize: 88,
                fontWeight: 600,
                color: '#0A0A0A',
                letterSpacing: -2,
                lineHeight: 1,
              }}
            >
              LayerProof
            </span>

            {/* "Vellum" */}
            <span
              style={{
                fontFamily: INTER,
                fontSize: 88,
                fontWeight: 600,
                color: PINK,
                letterSpacing: -2,
                lineHeight: 1,
              }}
            >
              &nbsp;Vellum
            </span>
          </div>

          {/* " today." in dark */}
          <span
            style={{
              fontFamily: INTER,
              fontSize: 88,
              fontWeight: 600,
              color: '#0A0A0A',
              letterSpacing: -2,
              lineHeight: 1,
            }}
          >
            &nbsp;today.
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
