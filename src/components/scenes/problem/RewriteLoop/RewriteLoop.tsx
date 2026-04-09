// src/components/scenes/problem/RewriteLoop/RewriteLoop.tsx
// Scene 2: Split layout — left: crop tool cycling through platforms, right: platform list

import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { fadeIn } from '../../../../lib/animations';
import { useTheme } from '../../../../lib/theme';
import { Cursor } from '../../../ui/Cursor';
import type { CursorKeyframe } from '../../../../types';
import { CropEditor, REWRITE_PLATFORMS, CROPS, IMG_LEFT, IMG_TOP, IMG_W, IMG_H } from './CropEditor';

// ─── Phase boundaries (frames 0–180) ─────────────────────────────────────────

const PF = [0, 44, 88, 133, 180];

// ─── Coordinate helpers ───────────────────────────────────────────────────────

const nx = (px: number) => px / 1920;
const ny = (py: number) => py / 1080;

// ─── Left panel row ───────────────────────────────────────────────────────────

const PlatformRow: React.FC<{
  platform: (typeof REWRITE_PLATFORMS)[0];
  enterAt: number;
  active: boolean;
  done: boolean;
  frame: number;
  fps: number;
}> = ({ platform, enterAt, active, done, frame, fps }) => {
  const theme = useTheme();
  const s = spring({
    frame: Math.max(0, frame - enterAt),
    fps,
    config: { stiffness: 70, damping: 18 },
  });
  const opacity = interpolate(s, [0, 0.5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const tx = interpolate(s, [0, 1], [-18, 0]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        opacity,
        transform: `translateX(${tx}px)`,
        willChange: 'transform',
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 18,
          background: platform.iconBg,
          border: active ? `2px solid ${platform.color}` : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: active
            ? `0 0 0 3px ${platform.color}30, 0 4px 16px rgba(0,0,0,0.45)`
            : '0 4px 16px rgba(0,0,0,0.45)',
          flexShrink: 0,
        }}
      >
        <div style={{ transform: 'scale(1.3)', transformOrigin: 'center' }}>
          {platform.icon}
        </div>
      </div>
      <div>
        <div
          style={{
            fontFamily: theme.font.family,
            fontSize: 32,
            fontWeight: theme.font.weightBold,
            color: active ? '#fff' : done ? 'rgba(255,255,255,0.35)' : '#fff',
            letterSpacing: -0.4,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {platform.label}
          {done && (
            <span style={{ fontSize: 32, color: '#e53935', fontWeight: 700 }}>✗</span>
          )}
        </div>
        <div
          style={{
            fontFamily: theme.font.family,
            fontSize: 20,
            color: platform.color,
            fontWeight: theme.font.weightMedium,
            marginTop: 3,
          }}
        >
          {platform.descriptor}
        </div>
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

export const RewriteLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // ── Phase ─────────────────────────────────────────────────────────────────
  const phase = frame < PF[1] ? 0 : frame < PF[2] ? 1 : frame < PF[3] ? 2 : 3;
  const phaseAge = frame - PF[phase];

  // ── Animated crop box ─────────────────────────────────────────────────────
  const cropW = interpolate(
    frame,
    [0, PF[1], PF[1] + 10, PF[2], PF[2] + 10, PF[3], PF[3] + 10, 180],
    [440, 440, 248, 248, 840, 840, 782, 782],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const cropH = interpolate(frame, [0, 180], [440, 440], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cropOX = interpolate(
    frame,
    [0, PF[1], PF[1] + 10, PF[2], PF[2] + 10, PF[3], PF[3] + 10, 180],
    [210, 210, 306, 306, 10, 10, 39, 39],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const wastedPct = Math.round((1 - (cropW * cropH) / (IMG_W * IMG_H)) * 100);
  const isExtreme = wastedPct >= 40;
  const warnColor = isExtreme ? '#c62828' : '#e65100';
  const warnBg = isExtreme ? 'rgba(198,40,40,0.09)' : 'rgba(230,81,0,0.09)';
  const warnBorder = isExtreme ? 'rgba(198,40,40,0.22)' : 'rgba(230,81,0,0.22)';

  const warningOpacity = interpolate(phaseAge, [12, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const undoOpacity = [28, 68, 112, 152].reduce((acc, f) => {
    const age = frame - f;
    if (age >= 0 && age < 22) {
      return Math.max(
        acc,
        interpolate(age, [0, 4, 16, 22], [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
      );
    }
    return acc;
  }, 0);

  const ratioLockVisible =
    (frame >= 22 && frame <= 36) ||
    (frame >= 64 && frame <= 80) ||
    (frame >= 108 && frame <= 122) ||
    (frame >= 150 && frame <= 166);

  const ratioLockOpacity = ratioLockVisible
    ? interpolate(frame % 46, [0, 6, 38, 45], [0, 1, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  // ── Entry animation ───────────────────────────────────────────────────────
  const entrySpring = spring({
    frame: Math.max(0, frame),
    fps,
    config: { stiffness: 50, damping: 22 },
  });
  const entryScale = interpolate(entrySpring, [0, 1], [0.96, 1]);
  const containerOpacity = fadeIn(frame, 0, 20);

  const tabPulse = interpolate(
    Math.min(phaseAge, 14),
    [0, 5, 14],
    [0.9, 1.05, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // ── Cursor keyframes ──────────────────────────────────────────────────────
  const TAB_Y = 0.296;
  const IMG_CX = nx(IMG_LEFT + IMG_W / 2);
  const IMG_CY = ny(IMG_TOP + IMG_H / 2);

  const br = (p: number) => ({
    x: nx(IMG_LEFT + CROPS[p].oX + CROPS[p].cW),
    y: ny(IMG_TOP + CROPS[p].oY + CROPS[p].cH),
  });

  const cursorKFs: CursorKeyframe[] = [
    // Phase 0: Instagram 1:1
    { frame: 5,   x: IMG_CX,            y: IMG_CY },
    { frame: 16,  x: br(0).x,           y: br(0).y },
    { frame: 20,  x: br(0).x,           y: br(0).y, click: true },
    { frame: 26,  x: br(0).x - 0.03,    y: br(0).y, click: true },
    { frame: 32,  x: br(0).x - 0.03,    y: br(0).y },
    { frame: 38,  x: 0.222,             y: TAB_Y },
    // Phase 1: Story 9:16
    { frame: 42,  x: 0.222,             y: TAB_Y, click: true },
    { frame: 52,  x: IMG_CX,            y: IMG_CY },
    { frame: 60,  x: br(1).x,           y: br(1).y },
    { frame: 64,  x: br(1).x,           y: br(1).y, click: true },
    { frame: 70,  x: br(1).x + 0.03,    y: br(1).y, click: true },
    { frame: 74,  x: br(1).x + 0.03,    y: br(1).y },
    { frame: 82,  x: 0.305,             y: TAB_Y },
    // Phase 2: LinkedIn 1.91:1
    { frame: 86,  x: 0.305,             y: TAB_Y, click: true },
    { frame: 96,  x: IMG_CX,            y: IMG_CY },
    { frame: 102, x: br(2).x,           y: br(2).y },
    { frame: 106, x: br(2).x,           y: br(2).y, click: true },
    { frame: 112, x: br(2).x,           y: br(2).y - 0.04, click: true },
    { frame: 118, x: br(2).x,           y: br(2).y - 0.04 },
    { frame: 126, x: 0.387,             y: TAB_Y },
    // Phase 3: Twitter 16:9
    { frame: 130, x: 0.387,             y: TAB_Y, click: true },
    { frame: 140, x: IMG_CX,            y: IMG_CY },
    { frame: 146, x: br(3).x,           y: br(3).y },
    { frame: 150, x: br(3).x,           y: br(3).y, click: true },
    { frame: 156, x: br(3).x,           y: br(3).y - 0.04, click: true },
    { frame: 162, x: br(3).x,           y: br(3).y - 0.04 },
    { frame: 172, x: IMG_CX,            y: IMG_CY },
    { frame: 180, x: IMG_CX,            y: IMG_CY },
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
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 12%, transparent 88%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none', zIndex: 0,
        }}
      />

      {/* ── Content ──────────────────────────────────────────────────────────── */}
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
        {/* ── Left panel: Crop editor ─────────────────────────────────────── */}
        <div
          style={{
            opacity: interpolate(frame, [10, 28], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            transform: `translateY(${interpolate(
              spring({
                frame: Math.max(0, frame - 10),
                fps,
                config: { stiffness: 60, damping: 20 },
              }),
              [0, 1],
              [36, 0],
            )}px)`,
            willChange: 'transform',
            flexShrink: 0,
          }}
        >
          <CropEditor
            phase={phase}
            phaseAge={phaseAge}
            cropW={cropW}
            cropH={cropH}
            cropOX={cropOX}
            tabPulse={tabPulse}
            undoOpacity={undoOpacity}
            ratioLockOpacity={ratioLockOpacity}
            warningOpacity={warningOpacity}
            wastedPct={wastedPct}
            isExtreme={isExtreme}
            warnColor={warnColor}
            warnBg={warnBg}
            warnBorder={warnBorder}
          />
        </div>

        {/* ── Divider ────────────────────────────────────────────────────── */}
        <div
          style={{
            width: 1, alignSelf: 'stretch', margin: '60px 0',
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.09) 30%, rgba(255,255,255,0.09) 70%, transparent)',
            flexShrink: 0,
            opacity: interpolate(frame, [22, 40], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        />

        {/* ── Right panel: Platform list ──────────────────────────────────── */}
        <div
          style={{
            display: 'flex', flexDirection: 'column', gap: 36,
            flexShrink: 0, width: 520,
          }}
        >
          <div style={{ opacity: fadeIn(frame, 5, 20) }}>
            <div
              style={{
                fontFamily: theme.font.family, fontSize: 52,
                fontWeight: theme.font.weightBold, color: '#FFFFFF',
                letterSpacing: -1, lineHeight: 1.2,
              }}
            >
              One photo. Four different crops.
            </div>
            <div
              style={{
                fontFamily: theme.font.family, fontSize: 32,
                fontWeight: theme.font.weightRegular,
                color: 'rgba(255,255,255,0.63)',
                marginTop: 12, lineHeight: 1.55,
              }}
            >
              Each platform needs a different aspect ratio
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {REWRITE_PLATFORMS.map((p, i) => (
              <PlatformRow
                key={p.id}
                platform={p}
                enterAt={18 + i * 10}
                active={i === phase}
                done={i < phase}
                frame={frame}
                fps={fps}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Cursor */}
      <Cursor keyframes={cursorKFs} />
    </AbsoluteFill>
  );
};
