import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { fadeIn } from '../../../../lib/animations';
import { useTheme } from '../../../../lib/theme';
import { Cursor } from '../../../ui/Cursor';
import type { CursorKeyframe } from '../../../../types';
import { CyclingEditor } from './CyclingEditor';

export const TensionMoment: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const entrySpring = spring({
    frame: Math.max(0, frame - 0),
    fps,
    config: { stiffness: 50, damping: 22 },
  });
  const entryScale = interpolate(entrySpring, [0, 1], [0.96, 1]);
  const containerOpacity = fadeIn(frame, 0, 20);

  const cursorKFs: CursorKeyframe[] = [
    { frame: 5,   x: 0.635, y: 0.563 },
    { frame: 14,  x: 0.635, y: 0.563 },
    { frame: 17,  x: 0.499, y: 0.307 },
    { frame: 19,  x: 0.499, y: 0.307 },
    { frame: 20,  x: 0.499, y: 0.307, click: true },
    { frame: 30,  x: 0.635, y: 0.563 },
    { frame: 108, x: 0.635, y: 0.563 },
    { frame: 113, x: 0.573, y: 0.307 },
    { frame: 118, x: 0.573, y: 0.307 },
    { frame: 120, x: 0.573, y: 0.307, click: true },
    { frame: 130, x: 0.635, y: 0.563 },
    { frame: 210, x: 0.635, y: 0.563 },
    { frame: 215, x: 0.644, y: 0.307 },
    { frame: 220, x: 0.644, y: 0.307 },
    { frame: 222, x: 0.644, y: 0.307, click: true },
    { frame: 232, x: 0.635, y: 0.563 },
    { frame: 270, x: 0.635, y: 0.563 },
  ];

  return (
    <AbsoluteFill style={{ background: '#080808', overflow: 'hidden' }}>
      {/* Vignette */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 20%, rgba(0,0,0,0.5) 100%)',
          pointerEvents: 'none', zIndex: 0,
        }}
      />

      {/* Top/bottom fade */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 12%, transparent 88%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none', zIndex: 0,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 56, paddingLeft: 56, paddingRight: 56, boxSizing: 'border-box',
          opacity: containerOpacity,
          transform: `scale(${entryScale})`,
          transformOrigin: '50% 50%',
          willChange: 'transform', zIndex: 1,
        }}
      >
        {/* ── Left panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36, flexShrink: 0, width: 520 }}>
          <div style={{ opacity: fadeIn(frame, 5, 20) }}>
            <div
              style={{
                fontFamily: theme.font.family, fontSize: 52,
                fontWeight: theme.font.weightBold, color: '#FFFFFF',
                letterSpacing: -1, lineHeight: 1.2,
              }}
            >
              Every platform speaks a different language.
            </div>
            <div
              style={{
                fontFamily: theme.font.family, fontSize: 32,
                fontWeight: theme.font.weightRegular,
                color: 'rgba(255, 255, 255, 0.63)',
                marginTop: 12, lineHeight: 1.55,
              }}
            >
              And you have to write fluently in all of them.
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div
          style={{
            width: 1, alignSelf: 'stretch', margin: '60px 0',
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.09) 30%, rgba(255,255,255,0.09) 70%, transparent)',
            flexShrink: 0,
            opacity: interpolate(frame, [22, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        />

        {/* ── Right panel ── */}
        <div
          style={{
            opacity: interpolate(frame, [10, 28], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            transform: `translateY(${interpolate(
              spring({ frame: Math.max(0, frame - 10), fps, config: { stiffness: 60, damping: 20 } }),
              [0, 1],
              [36, 0],
            )}px)`,
            willChange: 'transform', flexShrink: 0,
          }}
        >
          <CyclingEditor frame={frame} />
        </div>
      </div>

      {/* Cursor */}
      <Cursor keyframes={cursorKFs} />
    </AbsoluteFill>
  );
};
