// src/components/scenes/vellum/VellumPlatformScale.tsx
// Scene 5 — PlatformScale (local frames 0–270)
// Source image card + prompt bar + 3 platform nodes + parallel generation

import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { easeIO3, positionAt } from '../../../lib/animations';
import type { CursorKeyframe } from '../../../types';
import { Cursor } from '../../ui/Cursor';

const INTER = '"Inter", "SF Pro Display", -apple-system, sans-serif';
const INDIGO = '#6366F1';
const CANVAS_W = 1920;
const CANVAS_H = 1080;

const CURSOR_KFS: CursorKeyframe[] = [
  { frame:   5, x: 0.198, y: 0.500 },
  { frame:  30, x: 0.188, y: 0.676 },
  { frame:  78, x: 0.273, y: 0.676 },
  { frame:  87, x: 0.273, y: 0.676, click: true },
  { frame: 105, x: 0.771, y: 0.366 },
  { frame: 145, x: 0.771, y: 0.551 },
  { frame: 195, x: 0.771, y: 0.736 },
  { frame: 225, x: 0.771, y: 0.551 },
];

// Progressive typing
const typeText = (text: string, frame: number, startFrame: number, charsPerFrame = 0.45) =>
  text.slice(0, Math.max(0, Math.floor((frame - startFrame) * charsPerFrame)));

const blinkOpacity = (frame: number) => (Math.floor(frame / 15) % 2 === 0 ? 1 : 0);

// ─── Dot Grid ─────────────────────────────────────────────────────────────────

const DotGrid: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)',
      backgroundSize: '24px 24px',
      pointerEvents: 'none',
    }}
  />
);

// ─── Bezier Wire ──────────────────────────────────────────────────────────────

const Wire: React.FC<{ d: string; progress: number }> = ({ d, progress }) => (
  <path
    d={d}
    fill="none"
    stroke={INDIGO}
    strokeWidth={2}
    strokeOpacity={0.65}
    pathLength={1}
    strokeDasharray={1}
    strokeDashoffset={1 - progress}
    strokeLinecap="round"
  />
);

// ─── Platform node definitions ────────────────────────────────────────────────

const PLATFORMS = [
  {
    label: 'Facebook Post',
    header: '#1877F2',
    aspect: '4:5',
    wireDelay: [90, 120],
  },
  {
    label: 'X Post',
    header: '#000000',
    aspect: '16:9',
    wireDelay: [100, 130],
  },
  {
    label: 'TikTok',
    header: '#FE2C55',
    aspect: '9:16',
    wireDelay: [110, 140],
  },
];

const PLATFORM_Y = [310, 510, 710]; // top-left Y for each platform node

// ─── Main Component ───────────────────────────────────────────────────────────

export const VellumPlatformScale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Scene entrance — fade in + subtle rise, continuing from card selection ─
  const entrySpring  = spring({ frame: Math.max(0, frame), fps, config: { stiffness: 55, damping: 20 } });
  const sceneOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const sceneY       = interpolate(entrySpring, [0, 1], [40, 0]);
  const slideX       = 0;

  // ── Camera ─────────────────────────────────────────────────────────────────
  // Phase 0–88:   tight on source card (cx=380); TX=+667 centers at scale 1.15
  // Phase 88–130: pull back + pan right revealing wires + platform nodes
  // Phase 130–200: zoom into platform nodes (cx=1480)
  // Phase 200–245: showcase completed outputs
  const cameraScale = (() => {
    if (frame <= 88) return 1.15;
    if (frame <= 130) return 1.15 + (0.88 - 1.15) * easeIO3((frame - 88) / 42);
    if (frame <= 200) return 0.88 + (1.10 - 0.88) * easeIO3((frame - 130) / 70);
    if (frame <= 245) return 1.10 + (1.30 - 1.10) * easeIO3((frame - 200) / 45);
    return 1.30;
  })();

  const cursorCameraPos = positionAt(Math.max(0, frame - 8), CURSOR_KFS);
  const camCX = cursorCameraPos.x * CANVAS_W;
  const camCY = cursorCameraPos.y * CANVAS_H;
  const cameraTX = (960 - camCX) * cameraScale;
  const cameraTY = (540 - camCY) * cameraScale;

  // ── Source card ────────────────────────────────────────────────────────────
  // Center x≈380, y≈540, size 240×280
  const srcLeft = 260;
  const srcTop = 400;
  const srcW = 240;
  const srcH = 280;
  const srcRightX = srcLeft + srcW;
  const srcRightY = srcTop + srcH / 2;

  const srcS = spring({ frame: Math.max(0, frame - 8), fps, config: { stiffness: 80, damping: 20 } });
  const srcOpacity = interpolate(frame, [8, 22], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const srcY = interpolate(srcS, [0, 1], [24, 0]);

  // Selected ring spring
  const ringS = spring({ frame: Math.max(0, frame - 12), fps, config: { stiffness: 200, damping: 18 } });
  const ringScale = interpolate(ringS, [0, 0.5, 1], [1, 1.04, 1]);

  // ── Prompt bar ──────────────────────────────────────────────────────────────
  const promptText = 'Optimize for Facebook, X, TikTok';
  const typed = typeText(promptText, frame, 30, 0.55);
  const isTyping = frame >= 30 && frame < 80;
  const cursor = isTyping ? blinkOpacity(frame) : 0;

  const barLeft = srcLeft;
  const barTop = srcTop + srcH + 24;
  const barW = srcW + 60;

  // Gen button pulse at frame 87
  const genS = spring({ frame: Math.max(0, frame - 87), fps, config: { stiffness: 200, damping: 18 } });
  const genScale = frame >= 87 && frame <= 107 ? interpolate(genS, [0, 0.5, 1], [1, 1.06, 1]) : 1;

  // ── Platform node layout ───────────────────────────────────────────────────
  const platLeft = 1340;
  const platW = 280;
  const platH = 170;

  // ── Parallel generation (frames 120–200) ──────────────────────────────────
  const generating = frame >= 120 && frame < 200;
  const revealed = frame >= 200;

  // Shimmer cycling
  const shimmerCycle = generating ? (((frame - 120) % 40) / 40) * 300 - 50 : 300;
  const genProgress = interpolate(frame, [120, 195], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Completion elements
  const checkS = spring({ frame: Math.max(0, frame - 200), fps, config: { stiffness: 150, damping: 15 } });
  const checkScale = interpolate(checkS, [0, 1], [0, 1]);
  const checkOpacity = interpolate(frame, [200, 210], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Border glow on completion
  const completionGlow = interpolate(frame, [200, 220], [0.8, 0.3], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // "Running in parallel" badge
  const badgeOpacity = interpolate(frame, [125, 135, 190, 200], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{ background: '#F5F5F7', overflow: 'hidden', opacity: sceneOpacity, transform: `translateY(${sceneY}px)` }}
    >
      {/* Camera wrapper */}
      <div
        style={{
          position: 'absolute',
          width: CANVAS_W,
          height: CANVAS_H,
          transform: `translate(${cameraTX}px, ${cameraTY}px) scale(${cameraScale})`,
          transformOrigin: 'center center',
        }}
      >
        <DotGrid />

        {/* ── Source card ─────────────────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            left: srcLeft,
            top: srcTop,
            width: srcW,
            height: srcH,
            opacity: srcOpacity,
            transform: `translateY(${srcY}px) scale(${ringScale})`,
          }}
        >
          {/* Selected ring */}
          <div
            style={{
              position: 'absolute',
              inset: -4,
              borderRadius: 20,
              border: '3px solid #F59E0B',
              boxShadow: '0 0 0 6px rgba(245,158,11,0.20)',
              pointerEvents: 'none',
            }}
          />
          {/* Card */}
          <div
            style={{
              width: srcW,
              height: srcH,
              background: '#FFFFFF',
              borderRadius: 16,
              boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ padding: '9px 12px 7px', borderBottom: '1px solid #F3F4F6', flexShrink: 0 }}>
              <span style={{ fontFamily: INTER, fontSize: 11, fontWeight: 600, color: INDIGO, textTransform: 'uppercase' }}>
                Angle 2
              </span>
            </div>
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <Img
                src={staticFile('angle2.png')}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* Right port on source card */}
        <div
          style={{
            position: 'absolute',
            left: srcRightX - 5,
            top: srcRightY - 5,
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: INDIGO,
            border: '2px solid #FFFFFF',
            opacity: srcOpacity,
          }}
        />

        {/* ── Prompt bar ──────────────────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            left: barLeft,
            top: barTop,
            width: barW,
            height: 52,
            background: '#FFFFFF',
            borderRadius: 10,
            border: '1px solid #E5E7EB',
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            opacity: srcOpacity,
          }}
        >
          <div
            style={{
              flex: 1,
              padding: '0 14px',
              fontFamily: INTER,
              fontSize: 15,
              fontWeight: 500,
              color: '#374151',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {typed}
            <span style={{ opacity: cursor, color: INDIGO, fontWeight: 300 }}>|</span>
          </div>
          <div
            style={{
              margin: '5px 7px',
              background: INDIGO,
              borderRadius: 7,
              padding: '7px 13px',
              fontFamily: INTER,
              fontSize: 13,
              fontWeight: 600,
              color: '#FFFFFF',
              whiteSpace: 'nowrap',
              transform: `scale(${genScale})`,
            }}
          >
            Generate →
          </div>
        </div>

        {/* ── Platform destination nodes ───────────────────────────────────── */}
        {PLATFORMS.map((plat, i) => {
          const platTop = PLATFORM_Y[i];
          const platLeftX = platLeft;
          const platMidY = platTop + platH / 2;

          // Wire progress
          const [wStart, wEnd] = plat.wireDelay;
          const wProgress = interpolate(frame, [wStart, wEnd], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });

          // Shimmer style
          const shimmerStyle: React.CSSProperties = generating
            ? {
                background: `linear-gradient(90deg, #F0F0F0 ${shimmerCycle - 60}%, #E0E0E0 ${shimmerCycle}%, #F0F0F0 ${shimmerCycle + 60}%)`,
              }
            : revealed
            ? {
                background: 'linear-gradient(135deg, #C8AA88 0%, #9A7850 100%)',
              }
            : { background: '#F5F5F7' };

          // Border color
          const borderColor = revealed
            ? `rgba(99,102,241,${completionGlow})`
            : generating
            ? '#E5E7EB'
            : '#F3F4F6';

          return (
            <React.Fragment key={i}>
              {/* Wire */}
              <svg
                style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
                width={CANVAS_W}
                height={CANVAS_H}
                viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
              >
                <Wire
                  d={`M ${srcRightX},${srcRightY} C ${(srcRightX + platLeftX) / 2},${srcRightY} ${(srcRightX + platLeftX) / 2},${platMidY} ${platLeftX},${platMidY}`}
                  progress={wProgress}
                />
              </svg>

              {/* Platform node card */}
              <div
                style={{
                  position: 'absolute',
                  left: platLeftX,
                  top: platTop,
                  width: platW,
                  height: platH,
                  background: '#FFFFFF',
                  borderRadius: 14,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: `1.5px solid ${borderColor}`,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'border-color 0.3s',
                }}
              >
                {/* Colored header */}
                <div
                  style={{
                    height: 32,
                    background: plat.header,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontFamily: INTER, fontSize: 11, fontWeight: 600, color: '#FFFFFF' }}>
                    {plat.label}
                  </span>
                  <span
                    style={{
                      marginLeft: 6,
                      fontFamily: INTER,
                      fontSize: 9,
                      fontWeight: 400,
                      color: 'rgba(255,255,255,0.65)',
                    }}
                  >
                    {plat.aspect}
                  </span>
                </div>

                {/* Body (shimmer → image) */}
                <div style={{ flex: 1, position: 'relative', ...shimmerStyle }}>
                  {/* White flash on reveal */}
                  {frame >= 200 && frame <= 201 && (
                    <div style={{ position: 'absolute', inset: 0, background: '#FFFFFF', zIndex: 2 }} />
                  )}

                  {/* Progress bar */}
                  {generating && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        height: 3,
                        width: `${genProgress * 100}%`,
                        background: INDIGO,
                        transition: 'none',
                      }}
                    />
                  )}

                  {/* Green checkmark badge on completion */}
                  {revealed && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: '#22C55E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: checkOpacity,
                        transform: `scale(${checkScale})`,
                        zIndex: 3,
                      }}
                    >
                      <svg width={12} height={12} viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#FFFFFF" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}

                  {/* Left port */}
                  <div
                    style={{
                      position: 'absolute',
                      left: -5,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: INDIGO,
                      border: '2px solid #FFFFFF',
                    }}
                  />
                </div>
              </div>
            </React.Fragment>
          );
        })}

        <Cursor
          keyframes={CURSOR_KFS}
          containerWidth={CANVAS_W}
          containerHeight={CANVAS_H}
        />

        {/* ── "Running in parallel" badge ─────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            left: (srcRightX + platLeft) / 2 - 90,
            top: CANVAS_H / 2 - 16,
            background: INDIGO,
            borderRadius: 20,
            padding: '7px 14px',
            fontFamily: INTER,
            fontSize: 12,
            fontWeight: 500,
            color: '#FFFFFF',
            opacity: badgeOpacity,
            whiteSpace: 'nowrap',
          }}
        >
          Running in parallel
        </div>
      </div>
    </AbsoluteFill>
  );
};
