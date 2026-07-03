// src/components/scenes/vellum/VellumPlatformParallel.tsx
// Angle 2 selected → prompt → Run → PAN to grid of 3 platform output nodes
// Wire fully drawn → image reveals immediately (no generation phase)

import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { easeIO3 } from '../../../lib/animations';
import type { CursorKeyframe } from '../../../types';
import { Cursor } from '../../ui/Cursor';

const INTER      = '"Inter", "SF Pro Display", -apple-system, sans-serif';
const WIRE_COLOR = '#FACC15';
const GREEN      = '#10B981';
const NODE_BG    = '#FFFFFF';
const NODE_BORD  = 'rgba(0,0,0,0.07)';
const TEXT_PRI   = '#111827';
const TEXT_MUT   = '#9CA3AF';
const PORT_DOT   = '#B8BDCA';
const SKEL_BASE  = '#D4DAE6';   // skeleton base for pre-reveal card bg
const CANVAS_W   = 1920;
const CANVAS_H   = 1080;

// ── Matches FiveAngles overlay exactly ───────────────────────────────────────
const CARD_L  = 584;
const CARD_T  = 275;
const CARD_W  = 400;
const CARD_H  = 530;
const CARD_RX = 984;
const CARD_RY = 540;

const PROMPT_L  = 1030;
const PROMPT_T  = 459;
const PROMPT_W  = 330;
const PROMPT_H  = 162;
const PROMPT_LX = PROMPT_L;
const PROMPT_LY = PROMPT_T + PROMPT_H / 2;  // 540
const PROMPT_RX = PROMPT_L + PROMPT_W;       // 1360
const PROMPT_RY = PROMPT_LY;
const PROMPT_CX = PROMPT_L + PROMPT_W / 2;  // 1195

// ── Staggered node layout — nodes don't need to align ─────────────────────────
//
//   [ X (Twitter) — smaller landscape ]
//
//              ← big gap so TikTok wire has space to breathe →
//
//   [ Facebook ]          [ TikTok — offset right + slightly lower ]
//
// Exact aspect-ratio dimensions: card IS the ratio box.

const NODE_L = 1640;

// X (Twitter) — landscape, scaled down
const X_W = 210;
const X_H = Math.round(X_W * 9 / 16);   // 118 — exact 16:9

// Facebook — portrait
const FB_W = 149;
const FB_H = Math.round(FB_W * 5 / 4);  // 186 — exact 4:5

// TikTok — tall portrait
const TT_W = 149;
const TT_H = Math.round(TT_W * 16 / 9); // 265 — exact 9:16

// Vertical spacing
const X_TO_ROW  = 88;   // gap between X bottom and FB top

// TikTok: Y-aligned so midY = PROMPT_RY=540 → straight wire.
// With STACK_TOP=370: FB_TOP=370+118+88=576. TT_TOP=540-132=408. TT_V_OFF=408-576=-168.
const TT_V_OFF  = -168; // TT_TOP=408, midY=540 → straight horizontal wire
const FB_TT_GAP = 130;  // horizontal gap FB→TT

// STACK_TOP=370: X moved down vs 344, bounding box centre ≈ (370+762)/2=566 ≈ canvas mid
const STACK_TOP = 370;
const X_TOP     = STACK_TOP;                               // 344
const FB_TOP    = STACK_TOP + X_H + X_TO_ROW;             // 550
const TT_TOP    = FB_TOP + TT_V_OFF;                      // 410
const TT_L      = NODE_L + FB_W + FB_TT_GAP;              // 1889

// Wire trunk: all 3 wires share a horizontal stem from PROMPT_RX to TRUNK_X, then fan
const TRUNK_X   = PROMPT_RX + 100;                        // 1460

// Camera target = bounding-box midpoint (left edge of X/FB, right edge of TT)
const NODE_COL_CX = Math.round((NODE_L + TT_L + TT_W) / 2); // (1640+2038)/2 = 1839

const NODES = [
  {
    key: 'x',  label: 'X (Twitter)', aspect: '16:9', chipColor: '#111827', logo: 'logo-x.jpg',
    left: NODE_L, top: X_TOP,  w: X_W,  h: X_H,
    midY: X_TOP  + X_H  / 2,  wireX: NODE_L,
  },
  {
    key: 'fb', label: 'Facebook',    aspect: '4:5',  chipColor: '#1877F2', logo: 'logo-facebook.jpg',
    left: NODE_L, top: FB_TOP, w: FB_W, h: FB_H,
    midY: FB_TOP + FB_H / 2,  wireX: NODE_L,
  },
  {
    key: 'tt', label: 'TikTok',      aspect: '9:16', chipColor: '#FE2C55', logo: 'logo-tiktok.jpg',
    left: TT_L,   top: TT_TOP, w: TT_W, h: TT_H,
    midY: TT_TOP + TT_H / 2,  wireX: TT_L,
  },
] as const;

// ── Frame markers — tuned to fill 240-frame scene ────────────────────────────
// 0–90:   zoom in, read prompt   (~3 s)
// 90–96:  run click + wire start
// 96–153: X wire → FB wire → TT wire draw sequentially
// 113/129/153: X → FB → TT nodes pop in
// 153–240: hold on final state   (~2.9 s)
const WIRE_CARD_END = 10;
const PROMPT_POP_F  = 8;
const CAM_ZOOM_F    = 4;
const CAM_ZOOM_END  = 44;
const RUN_F         = 90;
const NODE_WIRE_F   = RUN_F + 6;  // 96 — wires start 6 frames after click

// Per-wire draw durations — proportional to each wire's approximate path length.
// X & FB have similar short horizontal span + vertical step; TT wire is ~2.5× longer.
const WIRE_DRAW_DURS = [17, 16, 24] as const;   // X, FB, TT

// Sequential start: each wire begins when the previous one finishes.
const WIRE_START_FS = [
  NODE_WIRE_F,
  NODE_WIRE_F + WIRE_DRAW_DURS[0],                         // 113
  NODE_WIRE_F + WIRE_DRAW_DURS[0] + WIRE_DRAW_DURS[1],     // 129
] as const;

// Each node reveals exactly when its wire arrow arrives.
const REVEAL_FS = [
  WIRE_START_FS[0] + WIRE_DRAW_DURS[0],   // 113  X
  WIRE_START_FS[1] + WIRE_DRAW_DURS[1],   // 129  FB
  WIRE_START_FS[2] + WIRE_DRAW_DURS[2],   // 153  TT
] as const;

// ── Cursor ────────────────────────────────────────────────────────────────────
const CURSOR_KFS: CursorKeyframe[] = [
  { frame: 0,          x: CARD_RX / CANVAS_W,           y: CARD_RY / CANVAS_H },
  { frame: 24,         x: PROMPT_CX / CANVAS_W,         y: PROMPT_RY / CANVAS_H },
  { frame: 74,         x: (PROMPT_RX - 46) / CANVAS_W, y: (PROMPT_T + 126) / CANVAS_H },
  { frame: RUN_F,      x: (PROMPT_RX - 46) / CANVAS_W, y: (PROMPT_T + 126) / CANVAS_H, click: true },
  { frame: RUN_F + 16, x: PROMPT_CX / CANVAS_W,        y: PROMPT_RY / CANVAS_H },
  { frame: 220,        x: PROMPT_CX / CANVAS_W,        y: PROMPT_RY / CANVAS_H },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

const easeT = (frame: number, start: number, end: number) =>
  Math.min(1, easeIO3(Math.max(0, frame - start) / Math.max(1, end - start)));

const bezH = (x1: number, y1: number, x2: number, y2: number) => {
  const dx = (x2 - x1) * 0.5;
  return `M ${x1},${y1} C ${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
};

// Step connector: horizontal stem → 90° turn vertical → 90° turn horizontal into dst.
// Rounded corners (radius r) at both bends, exactly like n8n-style wires.
const stepConnector = (srcX: number, srcY: number, trkX: number, dstX: number, dstY: number) => {
  const midX = Math.round((trkX + dstX) / 2);
  const r    = 20;  // soft but not too large — keeps flat-guard from swallowing the bend
  const dy   = dstY >= srcY ? 1 : -1;
  const vertDist = Math.abs(dstY - srcY);

  if (vertDist < r * 2) {
    // Nearly flat — skip vertical segment, just go horizontal
    return `M ${srcX},${srcY} L ${trkX},${srcY} L ${dstX},${dstY}`;
  }

  return [
    `M ${srcX},${srcY}`,
    `L ${trkX},${srcY}`,                                          // shared horizontal trunk
    `L ${midX - r},${srcY}`,                                      // run to first corner
    `Q ${midX},${srcY} ${midX},${srcY + dy * r}`,                 // rounded turn (right→vertical)
    `L ${midX},${dstY - dy * r}`,                                  // vertical run
    `Q ${midX},${dstY} ${midX + r},${dstY}`,                      // rounded turn (vertical→right)
    `L ${dstX},${dstY}`,                                           // horizontal run into dst
  ].join(' ');
};

const DotGrid: React.FC = () => (
  <div style={{
    position: 'absolute', inset: 0,
    backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.065) 1px, transparent 1px)',
    backgroundSize: '26px 26px', pointerEvents: 'none',
  }} />
);

const Port: React.FC<{ x: number; y: number; opacity?: number }> = ({ x, y, opacity = 1 }) => (
  <div style={{
    position: 'absolute', left: x - 5, top: y - 5,
    width: 10, height: 10, borderRadius: '50%',
    background: PORT_DOT, border: '2px solid #FFFFFF',
    opacity, zIndex: 2,
  }} />
);

const ImgIcon: React.FC = () => (
  <svg width={12} height={12} viewBox="0 0 14 14" fill="none">
    <rect x="0.5" y="1.5" width="13" height="11" rx="2" stroke="#6B7280" strokeWidth="1.3"/>
    <circle cx="4.5" cy="5.5" r="1.2" fill="#6B7280"/>
    <path d="M0.5 10.5l3-3 2.5 2.5 2-1.5 4 4" stroke="#6B7280" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

// ── Main component ────────────────────────────────────────────────────────────
export const VellumPlatformParallel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Camera ────────────────────────────────────────────────────────────────
  // Phase A: zoom into prompt        scale 1.0 → 2.1  (CAM_ZOOM_F → CAM_ZOOM_END)
  // Phase B: pan across full wire sequence (NODE_WIRE_F → REVEAL_FS[2])
  //          — continuous smooth pan as wires draw one after another
  const zoomInT = easeT(frame, CAM_ZOOM_F, CAM_ZOOM_END);
  const panT    = easeT(frame, NODE_WIRE_F, REVEAL_FS[2]);

  const cameraScale = 1.0 + 1.1 * zoomInT;

  const focusCX = (() => {
    const cA = CANVAS_W / 2;
    const cB = PROMPT_CX;
    const cC = NODE_COL_CX;
    const afterZoom = cA + (cB - cA) * zoomInT;
    return afterZoom + (cC - cB) * panT;
  })();

  const cameraTX = (CANVAS_W / 2 - focusCX) * cameraScale;

  // ── Angle 2 card ──────────────────────────────────────────────────────────
  const ringS     = spring({ frame: Math.max(0, frame), fps, config: { stiffness: 180, damping: 18 } });
  const ringScale = interpolate(ringS, [0, 0.5, 1], [0.98, 1.02, 1.0]);
  const cardWireP = interpolate(frame, [0, WIRE_CARD_END], [0.15, 1.0], clamp);

  // ── Prompt ────────────────────────────────────────────────────────────────
  const promptS  = spring({ frame: Math.max(0, frame - PROMPT_POP_F), fps, config: { stiffness: 400, damping: 22 } });
  const promptSc = interpolate(promptS, [0, 1], [0, 1]);
  const promptOp = interpolate(frame, [PROMPT_POP_F, PROMPT_POP_F + 10], [0, 1], clamp);

  // ── Run button ────────────────────────────────────────────────────────────
  const runClickS = spring({ frame: Math.max(0, frame - RUN_F), fps, config: { stiffness: 280, damping: 18 } });
  const runBtnSc  = frame >= RUN_F && frame <= RUN_F + 18
    ? interpolate(runClickS, [0, 0.4, 1], [1, 1.13, 1]) : 1;
  const runRunning = frame >= RUN_F + 4 && frame < REVEAL_FS[2];
  const runDone    = frame >= REVEAL_FS[2];

  // ── Wires — each draws sequentially, duration proportional to path length ─
  const wirePs = NODES.map((_, i) =>
    interpolate(frame, [WIRE_START_FS[i], WIRE_START_FS[i] + WIRE_DRAW_DURS[i]], [0, 1], clamp)
  );

  // ── Node entrance — spring pop at each reveal frame, chronological order ─
  const nodePopS  = REVEAL_FS.map(rf =>
    spring({ frame: Math.max(0, frame - rf), fps, config: { stiffness: 320, damping: 22 } })
  );
  const nodeScales = nodePopS.map(s => interpolate(s, [0, 1], [0, 1]));
  const nodeOps    = REVEAL_FS.map(rf => interpolate(frame, [rf, rf + 6], [0, 1], clamp));

  // ── Per-node reveal — fires the moment wire finishes drawing ──────────────
  const nodeAnims = REVEAL_FS.map(rf => {
    const checkS = spring({ frame: Math.max(0, frame - rf), fps, config: { stiffness: 160, damping: 14 } });
    return {
      revealed: frame >= rf,
      checkSc:  interpolate(checkS, [0, 1], [0, 1]),
      checkOp:  interpolate(frame, [rf, rf + 10], [0, 1], clamp),
      flashOp:  interpolate(frame, [rf, rf + 4],  [1, 0], clamp),
    };
  });

  // ── Post-reveal micro-animations ─────────────────────────────────────────
  // Gentle float bob — each card drifts up/down with staggered phase
  const floatYs = NODES.map((_, i) => {
    if (!nodeAnims[i].revealed) return 0;
    const t = frame - REVEAL_FS[i];
    return Math.sin((t / 55) * Math.PI * 2 + i * 1.3) * 3.5;
  });

  // Green glow pulse on card border after reveal
  const glowPulses = NODES.map((_, i) => {
    if (!nodeAnims[i].revealed) return 0;
    const t = frame - REVEAL_FS[i];
    return 0.4 + 0.6 * (0.5 + 0.5 * Math.sin((t / 65) * Math.PI * 2 + i * 0.9));
  });

  // Completion nudge — small spring bounce on ALL cards when last one reveals
  const completionBounce = spring({
    frame: Math.max(0, frame - REVEAL_FS[2]),
    fps,
    config: { stiffness: 260, damping: 14 },
  });
  const completionNudge = frame >= REVEAL_FS[2]
    ? interpolate(completionBounce, [0, 0.5, 1], [1.0, 1.035, 1.0])
    : 1.0;

  // Scene-wide flash when last card reveals
  const completionFlashOp = interpolate(frame, [REVEAL_FS[2], REVEAL_FS[2] + 7], [0.14, 0], clamp);

  return (
    <AbsoluteFill style={{ background: '#F0F2F5', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', width: CANVAS_W, height: CANVAS_H,
        transform: `translate(${cameraTX}px, 0px) scale(${cameraScale})`,
        transformOrigin: 'center center',
      }}>
        <DotGrid />

        {/* ── Angle 2 image card ──────────────────────────────────────────── */}
        <div style={{
          position: 'absolute', left: CARD_L, top: CARD_T,
          width: CARD_W, height: CARD_H, overflow: 'visible',
          transform: `scale(${ringScale})`, transformOrigin: 'center center',
        }}>
          <div style={{
            position: 'absolute', bottom: '100%', left: 0, marginBottom: 10,
            background: WIRE_COLOR, borderRadius: 24, padding: '10px 20px',
            display: 'flex', alignItems: 'center', gap: 7,
          }}>
            <span style={{ fontSize: 16, color: TEXT_PRI }}>✦</span>
            <span style={{ fontFamily: INTER, fontSize: 18, fontWeight: 700, color: TEXT_PRI, letterSpacing: 0.3 }}>
              Result
            </span>
          </div>
          <div style={{
            position: 'absolute', inset: -4, borderRadius: 20,
            border: '3px solid #F59E0B', boxShadow: '0 0 0 6px rgba(245,158,11,0.20)',
            pointerEvents: 'none', zIndex: 5,
          }} />
          <div style={{
            width: CARD_W, height: CARD_H, borderRadius: 16, overflow: 'hidden',
            boxShadow: '0 16px 44px rgba(0,0,0,0.13), 0 0 0 2px rgba(245,158,11,0.60)',
            position: 'relative',
          }}>
            <Img src={staticFile('angle2.png')}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 14px 12px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)',
            }}>
              <span style={{ fontFamily: INTER, fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: 0.3 }}>
                Angle 2
              </span>
            </div>
          </div>
        </div>
        <Port x={CARD_RX} y={CARD_RY} />

        {/* ── Wire: card → prompt ─────────────────────────────────────────── */}
        <svg style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
          width={CANVAS_W} height={CANVAS_H} viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}>
          <defs>
            <marker id="arr-card" markerWidth="20" markerHeight="16" refX="18" refY="8" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M0,1 L18,8 L0,15 Z" fill={WIRE_COLOR} />
            </marker>
          </defs>
          <path d={bezH(CARD_RX, CARD_RY, PROMPT_LX, PROMPT_LY)}
            fill="none" stroke={WIRE_COLOR} strokeWidth={2}
            pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cardWireP}
            markerEnd={cardWireP > 0.9 ? 'url(#arr-card)' : undefined}
            strokeLinecap="round" />
        </svg>
        {cardWireP > 0.9 && <Port x={PROMPT_LX} y={PROMPT_LY} />}

        {/* ── Prompt node ─────────────────────────────────────────────────── */}
        {promptOp > 0 && (
          <>
            <div style={{
              position: 'absolute', left: PROMPT_L, top: PROMPT_T - 28,
              fontFamily: INTER, fontSize: 13, fontWeight: 700, color: TEXT_PRI,
              opacity: promptOp * 0.72, whiteSpace: 'nowrap', letterSpacing: 0.3,
            }}>
              assistance prompt
            </div>

            <div style={{
              position: 'absolute', left: PROMPT_L, top: PROMPT_T,
              width: PROMPT_W, height: PROMPT_H,
              background: NODE_BG, borderRadius: 18, border: `1px solid ${NODE_BORD}`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
              transform: `scale(${promptSc})`, transformOrigin: 'left center',
              opacity: promptOp,
            }}>
              <div style={{ display: 'flex', gap: 6, padding: '9px 14px 8px', flexShrink: 0 }}>
                <div style={{
                  background: 'rgba(0,0,0,0.04)', borderRadius: 6, padding: '3px 9px',
                  display: 'flex', alignItems: 'center', gap: 5, border: '1px solid rgba(0,0,0,0.06)',
                }}>
                  <ImgIcon />
                  <span style={{ fontFamily: INTER, fontSize: 11, color: '#6B7280', fontWeight: 500 }}>Angle 2</span>
                </div>
              </div>
              <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', margin: '0 14px', flexShrink: 0 }} />
              <div style={{ flex: 1, padding: '10px 16px 8px' }}>
                <span style={{ fontFamily: INTER, fontSize: 13, color: TEXT_PRI, lineHeight: 1.6 }}>
                  Adapt this post for X, Facebook and TikTok
                </span>
              </div>
              <div style={{
                padding: '6px 12px 10px', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center',
                flexShrink: 0, borderTop: '1px solid rgba(0,0,0,0.055)',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  border: '1.5px solid rgba(0,0,0,0.11)', borderRadius: 20, padding: '5px 10px 5px 9px',
                }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M6.5 1.5L11 4V9L6.5 11.5L2 9V4L6.5 1.5Z" stroke="#374151" strokeWidth="1.2"/>
                    <path d="M6.5 1.5V11.5M2 4L11 9M11 4L2 9" stroke="#374151" strokeWidth="1" opacity="0.35"/>
                  </svg>
                  <span style={{ fontFamily: INTER, fontSize: 12, color: TEXT_PRI, fontWeight: 500 }}>Auto</span>
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1.5 3L4.5 6L7.5 3" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                </div>
                <div style={{
                  background: runDone ? GREEN : WIRE_COLOR,
                  borderRadius: 20, padding: '6px 15px',
                  display: 'flex', alignItems: 'center', gap: 5,
                  transform: `scale(${runBtnSc})`, transformOrigin: 'center right',
                  boxShadow: runDone ? '0 3px 10px rgba(16,185,129,0.30)' : '0 3px 12px rgba(250,204,21,0.40)',
                }}>
                  {runDone ? (
                    <>
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M2.5 6.5L5.5 9.5L10.5 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span style={{ fontFamily: INTER, fontSize: 12, fontWeight: 600, color: '#fff' }}>Done</span>
                    </>
                  ) : (
                    <span style={{ fontFamily: INTER, fontSize: 12, fontWeight: 700, color: TEXT_PRI }}>
                      {runRunning ? 'Running…' : 'Run →'}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Port x={PROMPT_RX} y={PROMPT_RY} opacity={promptOp} />
          </>
        )}

        {/* ── Parallel wires: prompt → nodes ──────────────────────────────── */}
        <svg style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
          width={CANVAS_W} height={CANVAS_H} viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}>
          <defs>
            <marker id="arr-n" markerWidth="20" markerHeight="16" refX="18" refY="8" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M0,1 L18,8 L0,15 Z" fill={WIRE_COLOR} />
            </marker>
          </defs>
          {NODES.map((nd, i) => {
            const p = wirePs[i];
            if (p < 0.01) return null;
            return (
              <path key={nd.key}
                d={stepConnector(PROMPT_RX, PROMPT_RY, TRUNK_X, nd.wireX, nd.midY)}
                fill="none" stroke={WIRE_COLOR} strokeWidth={2}
                pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p}
                markerEnd={p > 0.92 ? 'url(#arr-n)' : undefined}
                strokeLinecap="round" />
            );
          })}
        </svg>
        {NODES.map((nd, i) => wirePs[i] > 0.92 && (
          <Port key={nd.key} x={nd.wireX} y={nd.midY} />
        ))}

        {/* ── Platform output nodes — full-bleed image card style ─────────── */}
        {NODES.map((nd, i) => {
          const op   = nodeOps[i];
          if (op < 0.01) return null;
          const anim = nodeAnims[i];

          return (
            <div key={nd.key} style={{
              position: 'absolute', left: nd.left, top: nd.top, width: nd.w,
              overflow: 'visible', opacity: nodeOps[i],
              transform: `scale(${nodeScales[i] * completionNudge}) translateY(${floatYs[i]}px)`,
              transformOrigin: 'center center',
            }}>
              {/* ── Label above card: logo + name + aspect (no background) ── */}
              <div style={{
                position: 'absolute', bottom: '100%', left: 0, marginBottom: 8,
                display: 'flex', alignItems: 'center', gap: 6,
                opacity: op, whiteSpace: 'nowrap',
              }}>
                <Img src={staticFile(nd.logo)}
                  style={{ width: 14, height: 14, borderRadius: 3, objectFit: 'contain', flexShrink: 0 }} />
                <span style={{ fontFamily: INTER, fontSize: 11, fontWeight: 700, color: TEXT_PRI, letterSpacing: 0.2 }}>
                  {nd.label}
                </span>
                <span style={{
                  fontFamily: INTER, fontSize: 10, color: TEXT_MUT,
                  background: 'rgba(0,0,0,0.07)', borderRadius: 4, padding: '1px 6px',
                }}>
                  {nd.aspect}
                </span>
              </div>

              {/* ── Card = ratio-correct image area ──────────────────────── */}
              <div style={{
                width: nd.w, height: nd.h,
                borderRadius: 12, overflow: 'hidden',
                position: 'relative',
                background: anim.revealed ? '#E0E5EE' : SKEL_BASE,
                border: `1.5px solid ${anim.revealed ? 'rgba(0,0,0,0.08)' : 'rgba(250,204,21,0.45)'}`,
                boxShadow: anim.revealed
                  ? `0 8px 28px rgba(0,0,0,0.12), 0 0 ${Math.round(glowPulses[i] * 14)}px rgba(16,185,129,${(glowPulses[i] * 0.35).toFixed(2)})`
                  : '0 4px 16px rgba(0,0,0,0.08), 0 0 0 3px rgba(250,204,21,0.10)',
              }}>
                {/* Skeleton shimmer — sweeps during generation */}
                {!anim.revealed && (() => {
                  const shimmerCycle = (frame - WIRE_START_FS[i]) % 22 / 22;
                  const pct = shimmerCycle * 160 - 30;
                  return (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: [
                        'linear-gradient(105deg,',
                        `  ${SKEL_BASE} 0%,`,
                        `  ${SKEL_BASE} ${pct}%,`,
                        `  rgba(255,255,255,0.78) ${pct + 12}%,`,
                        `  rgba(255,255,255,0.90) ${pct + 18}%,`,
                        `  rgba(255,255,255,0.78) ${pct + 26}%,`,
                        `  ${SKEL_BASE} ${pct + 38}%,`,
                        '  transparent 100%)',
                      ].join(''),
                    }} />
                  );
                })()}

                {/* Generating dots + label — centred in card */}
                {!anim.revealed && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      {[0, 1, 2].map(j => {
                        const phase = ((frame - WIRE_START_FS[i]) % 21 + j * 7) % 21;
                        return (
                          <div key={j} style={{
                            width: 5, height: 5, borderRadius: '50%',
                            background: WIRE_COLOR,
                            opacity: phase < 11 ? 0.95 : 0.2,
                            transform: `scale(${phase < 11 ? 1 : 0.7})`,
                          }} />
                        );
                      })}
                    </div>
                    <span style={{ fontFamily: INTER, fontSize: 9, color: 'rgba(100,110,130,0.8)', letterSpacing: 0.4 }}>
                      Generating…
                    </span>
                  </div>
                )}

                {/* Yellow progress bar at card bottom */}
                {!anim.revealed && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(0,0,0,0.08)' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, interpolate(frame, [WIRE_START_FS[i], REVEAL_FS[i] - 2], [0, 100], clamp))}%`,
                      background: WIRE_COLOR,
                      boxShadow: `0 0 6px ${WIRE_COLOR}88`,
                    }} />
                  </div>
                )}

                {/* Revealed: angle2 image cropped to each card's exact aspect ratio */}
                {anim.revealed && (
                  <div style={{ position: 'absolute', inset: 0, opacity: anim.checkOp }}>
                    <Img
                      src={staticFile('angle2.png')}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                )}

                {/* White flash on reveal */}
                {anim.flashOp > 0 && (
                  <div style={{ position: 'absolute', inset: 0, background: '#FFF', opacity: anim.flashOp, zIndex: 5 }} />
                )}

                {/* Green check — bottom-right */}
                {anim.revealed && (
                  <div style={{
                    position: 'absolute', bottom: 7, right: 7, zIndex: 6,
                    width: 18, height: 18, borderRadius: '50%', background: GREEN,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: anim.checkOp, transform: `scale(${anim.checkSc})`,
                  }}>
                    <svg width="10" height="10" viewBox="0 0 13 13" fill="none">
                      <path d="M2.5 6.5L5.5 9.5L10.5 4" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* ── Cursor ──────────────────────────────────────────────────────── */}
        <Cursor keyframes={CURSOR_KFS} containerWidth={CANVAS_W} containerHeight={CANVAS_H} />
      </div>

      {/* ── Completion flash — brief white bloom when last card reveals ── */}
      {completionFlashOp > 0 && (
        <div style={{
          position: 'absolute', inset: 0, background: '#FFFFFF',
          opacity: completionFlashOp, pointerEvents: 'none', zIndex: 50,
        }} />
      )}
    </AbsoluteFill>
  );
};
