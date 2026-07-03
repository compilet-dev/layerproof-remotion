// src/components/scenes/vellum/VellumFiveAngles.tsx
// Scene 3 — FiveAngles: source card → prompt node (right) → single output
// Camera zooms into prompt during typing, pulls back to reveal output

import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { easeIO3, positionAt } from '../../../lib/animations';
import type { CursorKeyframe } from '../../../types';
import { Cursor } from '../../ui/Cursor';

const INTER        = '"Inter", "SF Pro Display", -apple-system, sans-serif';
const INDIGO       = '#6366F1';
const WIRE_COLOR   = '#FACC15';
const GREEN        = '#10B981';
const PORT_DOT     = '#B8BDCA';
const NODE_BG      = '#FFFFFF';
const NODE_BORDER  = 'rgba(0,0,0,0.07)';
const TEXT_PRIMARY = '#111827';
const TEXT_MUTED   = '#9CA3AF';
const CANVAS_W     = 1920;
const CANVAS_H     = 1080;

// ── Node layout — horizontal flow ──────────────────────────────────────────
const SRC_W = 220;  const SRC_H = 295;
const SRC_L = 540;  const SRC_T = (CANVAS_H - SRC_H) / 2;   // 392
const SRC_CX = SRC_L + SRC_W / 2;  // 600
const SRC_PORT_X = SRC_L + SRC_W;  // 710  — right port
const SRC_PORT_Y = SRC_T + SRC_H / 2;  // 540

const PROMPT_W = 330;  const PROMPT_H = 162;
const PROMPT_L = 820;  const PROMPT_T = (CANVAS_H - PROMPT_H) / 2;  // 459
const PROMPT_LX = PROMPT_L;                    // 820  — left port
const PROMPT_LY = PROMPT_T + PROMPT_H / 2;    // 540
const PROMPT_RX = PROMPT_L + PROMPT_W;         // 1150 — right port
const PROMPT_RY = PROMPT_LY;                   // 540

// Spread layout — 4 cards (1 original + 3 angles), screen space (1920×1080)
const CARD_W  = 400;
const CARD_H  = 530;
const CARD_GAP = 22;
const CARD1_W = 470;   // original card slightly wider
const SPREAD_TOTAL_W = CARD1_W + 3 * CARD_W + 3 * CARD_GAP;  // 1736
const SPREAD_X0 = (CANVAS_W - SPREAD_TOTAL_W) / 2;            // 92
const SPREAD_Y  = (CANVAS_H - CARD_H) / 2;                  // 275

// Horizontal bezier (S-curve for horizontal wires)
const bezH = (x1: number, y1: number, x2: number, y2: number) => {
  const dx = (x2 - x1) * 0.5;
  return `M ${x1},${y1} C ${x1+dx},${y1} ${x2-dx},${y2} ${x2},${y2}`;
};

// ── Frame markers ──────────────────────────────────────────────────────────
const BUBBLE_F   = 30;
const GEN_F      = 62;
const POPUP_F    = 75;
const FADE_START = 165;
const FADE_END   = 182;
const PICK_FRAME    = 244;
const PROMPT_APPEAR = PICK_FRAME + 22;  // 266

// ── Screen-space prompt connector (appears after card pick) ───────────────
// Angle 2 right edge: SPREAD_X0+CARD1_W+CARD_GAP+CARD_W = 92+470+22+400 = 984
// Angle 2 center Y:  SPREAD_Y + CARD_H/2 = 275 + 265 = 540
const SC_CARD_RX  = 984;
const SC_CARD_RY  = 540;
const SC_PROMPT_L = 1030;
const SC_PROMPT_T = 459;   // 540 - 162/2
const SC_PROMPT_W = 330;
const SC_PROMPT_H = 162;

// ── Camera-space cursor keyframes ──────────────────────────────────────────
const CURSOR_KFS: CursorKeyframe[] = [
  { frame:  5,         x: SRC_CX / CANVAS_W, y: 0.500 },
  { frame: BUBBLE_F,   x: PROMPT_L / CANVAS_W, y: 0.500 },
  { frame: 50,         x: 0.562, y: 0.548 },
  { frame: GEN_F,      x: 0.562, y: 0.548, click: true },
  { frame: GEN_F + 16, x: 0.510, y: 0.500 },
  { frame: 155,        x: 0.510, y: 0.500 },
];

// ── Screen-space cursor — appears after overlay fades, picks Angle 2 ───────
// Angle 2 screen center: x=784/1920=0.408, y=540/1080=0.500
const OVERLAY_CURSOR_KFS: CursorKeyframe[] = [
  { frame: 228, x: 0.494, y: 0.500 },
  { frame: 236, x: 0.408, y: 0.500 },
  { frame: PICK_FRAME, x: 0.408, y: 0.500, click: true },
  { frame: 280, x: 0.408, y: 0.500 },
];

// ─── Micro components ──────────────────────────────────────────────────────

const DotGrid: React.FC = () => (
  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)', backgroundSize: '26px 26px', pointerEvents: 'none' }} />
);

const ImgIcon: React.FC<{ color?: string }> = ({ color = '#9CA3AF' }) => (
  <svg width={13} height={13} viewBox="0 0 14 14" fill="none">
    <rect x="0.5" y="1.5" width="13" height="11" rx="2" stroke={color} strokeWidth="1.3" />
    <circle cx="4.5" cy="5.5" r="1.2" fill={color} />
    <path d="M0.5 10.5l3-3 2.5 2.5 2-1.5 4 4" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const TextIcon: React.FC<{ color?: string }> = ({ color = '#9CA3AF' }) => (
  <svg width={13} height={13} viewBox="0 0 14 14" fill="none">
    <path d="M1 3.5h12M1 7h8M1 10.5h10" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const NodeLabel: React.FC<{ type: string; name?: string; x: number; y: number; opacity: number }> = ({ type, name, x, y, opacity }) => (
  <div style={{ position: 'absolute', left: x, top: y - 28, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6, opacity, pointerEvents: 'none' }}>
    <span style={{ display: 'flex', alignItems: 'center', lineHeight: 1 }}>
      {type === 'image' ? <ImgIcon color="#6B7280" /> : <TextIcon color="#6B7280" />}
    </span>
    <span style={{ fontFamily: INTER, fontSize: 13, fontWeight: 700, color: TEXT_PRIMARY, letterSpacing: 0.3 }}>{type}</span>
    {name && <span style={{ fontFamily: INTER, fontSize: 13, fontWeight: 400, color: TEXT_MUTED, letterSpacing: 0.2 }}>{name}</span>}
  </div>
);

const Port: React.FC<{ x: number; y: number; opacity?: number }> = ({ x, y, opacity = 1 }) => (
  <div style={{ position: 'absolute', left: x - 5, top: y - 5, width: 10, height: 10, borderRadius: '50%', background: PORT_DOT, border: '2px solid #FFFFFF', opacity, zIndex: 2 }} />
);

const GrowingWire: React.FC<{ d: string; progress: number; pathLen?: number }> = ({ d, progress, pathLen = 300 }) => {
  if (progress < 0.01) return null;
  return (
    <path d={d} fill="none" stroke={WIRE_COLOR} strokeWidth={2}
      strokeDasharray={pathLen} strokeDashoffset={pathLen * (1 - progress)}
      markerEnd={progress > 0.94 ? 'url(#arr5)' : undefined}
      strokeLinejoin="round" strokeLinecap="round" />
  );
};

// ─── Main Component ────────────────────────────────────────────────────────

export const VellumFiveAngles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

  // ── Scene entrance / exit ──────────────────────────────────────────────
  // Soft slide + fade-in for a cinematic entrance
  // Fast snap-in: stiffness 75 → ~95% settled by f14, fully done by f20
  // This ensures the slide is completely finished before zoom begins at BUBBLE_F=35
  const slideSpring = spring({ frame: Math.max(0, frame), fps, config: { stiffness: 75, damping: 24 } });
  const slideX      = interpolate(slideSpring, [0, 1], [260, 0]);
  const sceneEnterOp = interpolate(frame, [0, 22], [0, 1], clamp);
  const sceneOp     = sceneEnterOp; // VellumEfficient overlay handles the exit

  // ── Camera: zooms into prompt immediately from frame 0 ───────────────
  const PROMPT_CX = PROMPT_L + PROMPT_W / 2;  // 985

  // Fast zoom spring starts at frame 0 — no wide-angle pause
  const typingZoomS = spring({ frame: Math.max(0, frame), fps, config: { stiffness: 55, damping: 22 } });
  const genPunchS   = spring({ frame: Math.max(0, frame - GEN_F), fps, config: { stiffness: 200, damping: 18 } });

  // Scale: immediately zooms 1.0 → 2.1, brief punch on generate
  const cameraScale = interpolate(typingZoomS, [0, 1], [1.0, 2.1])
    + (frame >= GEN_F ? interpolate(genPunchS, [0, 0.3, 1], [0, 0.12, 0]) : 0);

  // Camera locks onto prompt center from the very start
  const lockBlend    = interpolate(typingZoomS, [0, 1], [0, 1]);
  const cursorCamPos = positionAt(Math.max(0, frame - 8), CURSOR_KFS);
  const focusCX = cursorCamPos.x * CANVAS_W + (PROMPT_CX - cursorCamPos.x * CANVAS_W) * lockBlend;
  const focusCY = CANVAS_H / 2;

  const cameraTX = (960 - focusCX) * cameraScale;
  const cameraTY = (540 - focusCY) * cameraScale;

  // ── Source card ────────────────────────────────────────────────────────
  const srcS      = spring({ frame: Math.max(0, frame - 8), fps, config: { stiffness: 80, damping: 20 } });
  const srcOp     = interpolate(frame, [8, 20], [0, 1], clamp);
  const srcEntryX = interpolate(srcS, [0, 1], [-24, 0]);

  // ── Prompt node — bubble pop ───────────────────────────────────────────
  const bubbleSpring = spring({ frame: Math.max(0, frame - BUBBLE_F), fps, config: { stiffness: 400, damping: 22 } });
  const bubbleScale  = interpolate(bubbleSpring, [0, 1], [0, 1]);

  // Wire A: static — no draw animation

  // Prompt — pre-filled, no typing effect
  const PROMPT_TEXT    = '3 new angles, preserve face features';
  const showPlaceholder = frame < BUBBLE_F;
  const typedText      = PROMPT_TEXT;   // always fully shown once bubble is visible
  const textCursor     = 0;             // no blinking cursor needed

  // Generate button
  const genBtnS    = spring({ frame: Math.max(0, frame - GEN_F), fps, config: { stiffness: 200, damping: 18 } });
  const genBtnDone = frame >= GEN_F + 6;
  const genBtnScale = frame >= GEN_F && frame <= GEN_F + 20 ? interpolate(genBtnS, [0, 0.45, 1], [1, 1.1, 1]) : 1;

  // ── Angle file names — 1 original + 3 additional ──────────────────────
  const ANGLE_VARIANTS = [
    { src: 'output.jpg', label: 'Original' },
    { src: 'angle2.png', label: 'Angle 2' },
    { src: 'angle3.png', label: 'Angle 3' },
    { src: 'angle4.png', label: 'Angle 4' },
  ];

  // ── Phase 1: angle 1 pops in centered + zoomed with processing FX ─────
  const PROCESS_FRAMES = 30;                        // how long card 1 holds center
  const PAN_START_F    = POPUP_F + PROCESS_FRAMES - 2;   // 136 — overlap slightly
  const ZOOM_FACTOR    = 1.35;
  const CARD1_CX_FINAL = SPREAD_X0 + CARD1_W / 2;  // card 1 center X at rest
  const CARD1_OFFSET_X = 960 - CARD1_CX_FINAL;     // 632 — shift to center on screen

  const card1EntryS  = spring({ frame: Math.max(0, frame - POPUP_F),    fps, config: { stiffness: 220, damping: 24 } });
  const card1EntryY  = interpolate(card1EntryS, [0, 1], [60, 0]);
  const card1EntryOp = interpolate(card1EntryS, [0, 0.3], [0, 1]);

  // ── Phase 2: pan card 1 left + zoom out; cards 2–5 spread right ───────
  const panS     = spring({ frame: Math.max(0, frame - PAN_START_F), fps, config: { stiffness: 55, damping: 22 } });
  const panT     = interpolate(panS, [0, 1], [0, 1]);
  const card1TX  = CARD1_OFFSET_X * (1 - panT);
  const card1Scale = 1 + (ZOOM_FACTOR - 1) * (1 - panT);   // 1.35 → 1.0

  const SPREAD_STAGGER    = 7;   // tight stagger — deck-spread feel
  const OTHER_PUSH_FRAMES = [1, 2, 3].map(i => POPUP_F + PROCESS_FRAMES + (i - 1) * SPREAD_STAGGER);
  // = [138, 145, 152]
  // Fast, snappy spring for crisp card-flick motion
  const otherSprings = OTHER_PUSH_FRAMES.map(pf =>
    spring({ frame: Math.max(0, frame - pf), fps, config: { stiffness: 380, damping: 28 } })
  );

  // ── Processing FX on card 1 (shimmer + fill bar) ───────────────────────
  const shimmerOp    = interpolate(frame, [PAN_START_F - 4, PAN_START_F + 10], [1, 0], clamp);
  const shimmerCycle = ((frame - POPUP_F) % 24) / 24;
  const shimmerX     = interpolate(shimmerCycle, [0, 1], [-100, CARD_W + 100]);
  const processBarOp = Math.min(
    interpolate(frame, [POPUP_F + 2, POPUP_F + 8],       [0, 1], clamp),
    interpolate(frame, [PAN_START_F - 6, PAN_START_F + 4], [1, 0], clamp)
  );
  const processBar   = interpolate(frame, [POPUP_F + 3, PAN_START_F - 4], [0, 1], clamp);

  const overlayOp = interpolate(frame, [POPUP_F, POPUP_F + 12], [0, 1], clamp);

  // ── Card pick: camera cursor fades as overlay comes in, screen cursor after ─
  const camCursorOp = interpolate(frame, [148, 158], [1, 0], clamp);

  // Selection ring on Angle 2 after click
  const selectedS     = spring({ frame: Math.max(0, frame - PICK_FRAME), fps, config: { stiffness: 200, damping: 18 } });
  const selectedScale = interpolate(selectedS, [0, 0.5, 1], [1, 1.04, 1]);
  const selectedOp    = interpolate(frame, [PICK_FRAME, PICK_FRAME + 6], [0, 1], clamp);

  // Non-picked cards dismiss after selection
  const dismissOp  = interpolate(frame, [PICK_FRAME + 6, PICK_FRAME + 22], [1, 0], clamp);
  const dismissX   = interpolate(frame, [PICK_FRAME + 6, PICK_FRAME + 22], [0, -80], clamp);
  const dismissXR  = interpolate(frame, [PICK_FRAME + 6, PICK_FRAME + 22], [0,  80], clamp);

  // Screen-space prompt connector appears right after dismiss
  const wireS       = spring({ frame: Math.max(0, frame - PROMPT_APPEAR), fps, config: { stiffness: 200, damping: 22 } });
  const wireProgress = interpolate(wireS, [0, 1], [0, 1]);
  const promptPopS  = spring({ frame: Math.max(0, frame - (PROMPT_APPEAR + 8)), fps, config: { stiffness: 400, damping: 24 } });
  const promptScale = interpolate(promptPopS, [0, 1], [0, 1]);
  const promptOp    = interpolate(frame, [PROMPT_APPEAR + 8, PROMPT_APPEAR + 14], [0, 1], clamp);

  const svgDefs = (
    <defs>
      <marker id="arr5" markerWidth="20" markerHeight="16" refX="18" refY="8" orient="auto" markerUnits="userSpaceOnUse">
        <path d="M0,1 L18,8 L0,15 Z" fill={WIRE_COLOR} />
      </marker>
    </defs>
  );

  return (
    <AbsoluteFill style={{ background: '#F0F2F5', overflow: 'hidden', opacity: sceneOp, transform: `translateX(${slideX}px)` }}>
      <div style={{
        position: 'absolute', width: CANVAS_W, height: CANVAS_H,
        transform: `translate(${cameraTX}px, ${cameraTY}px) scale(${cameraScale})`,
        transformOrigin: 'center center',
      }}>
        <DotGrid />

        {/* ── Source card ─────────────────────────────────────────────── */}
        <NodeLabel type="image" name="output.jpg" x={SRC_L + srcEntryX} y={SRC_T} opacity={srcOp} />
        <div style={{
          position: 'absolute', left: SRC_L, top: SRC_T, width: SRC_W, height: SRC_H,
          background: NODE_BG, borderRadius: 16, border: `1px solid ${NODE_BORDER}`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden', opacity: srcOp,
          transform: `translateX(${srcEntryX}px)`,
        }}>
          <Img src={staticFile('output.jpg')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <Port x={SRC_PORT_X + srcEntryX} y={SRC_PORT_Y} opacity={Math.min(srcOp, bubbleScale)} />

        {/* ── Wire A: source → prompt (static) ────────────────────────── */}
        <svg style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
          width={CANVAS_W} height={CANVAS_H} viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} overflow="visible">
          {svgDefs}
          <path
            d={bezH(SRC_PORT_X, SRC_PORT_Y, PROMPT_LX, PROMPT_LY)}
            stroke={WIRE_COLOR} strokeWidth={2} fill="none"
            markerEnd="url(#arr5)"
            opacity={Math.min(srcOp, bubbleScale)}
          />
        </svg>
        <Port x={PROMPT_LX} y={PROMPT_LY} opacity={bubbleScale} />

        {/* ── Prompt node ─────────────────────────────────────────────── */}
        <NodeLabel type="assistance prompt" x={PROMPT_L} y={PROMPT_T} opacity={bubbleScale} />
        <div style={{
          position: 'absolute', left: PROMPT_L, top: PROMPT_T,
          width: PROMPT_W, height: PROMPT_H,
          background: NODE_BG, borderRadius: 18, border: `1px solid ${NODE_BORDER}`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
          transform: `scale(${bubbleScale})`, transformOrigin: 'left center',
        }}>
          {/* Chips row */}
          <div style={{ display: 'flex', gap: 6, padding: '9px 14px 8px', flexShrink: 0 }}>
            <div style={{ background: 'rgba(0,0,0,0.04)', borderRadius: 6, padding: '3px 9px', display: 'flex', alignItems: 'center', gap: 5, border: '1px solid rgba(0,0,0,0.06)' }}>
              <ImgIcon color="#9CA3AF" />
              <span style={{ fontFamily: INTER, fontSize: 11, color: '#6B7280', fontWeight: 500 }}>Character</span>
            </div>
          </div>
          <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', margin: '0 14px', flexShrink: 0 }} />
          {/* Text area */}
          <div style={{ flex: 1, padding: '10px 16px 8px', overflow: 'hidden' }}>
            {showPlaceholder
              ? <span style={{ fontFamily: INTER, fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6 }}>Describe your prompt…</span>
              : <span style={{ fontFamily: INTER, fontSize: 13, color: TEXT_PRIMARY, lineHeight: 1.6 }}>
                  {typedText}
                  <span style={{ opacity: textCursor, display: 'inline-block', width: 1.5, height: 13, background: INDIGO, marginLeft: 2, verticalAlign: 'text-bottom' }} />
                </span>
            }
          </div>
          {/* Toolbar */}
          <div style={{ padding: '6px 12px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, borderTop: '1px solid rgba(0,0,0,0.055)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, border: '1.5px solid rgba(0,0,0,0.11)', borderRadius: 20, padding: '5px 10px 5px 9px' }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1.5L11 4V9L6.5 11.5L2 9V4L6.5 1.5Z" stroke="#374151" strokeWidth="1.2"/>
                <path d="M6.5 1.5V11.5M2 4L11 9M11 4L2 9" stroke="#374151" strokeWidth="1" opacity="0.35"/>
              </svg>
              <span style={{ fontFamily: INTER, fontSize: 12, color: TEXT_PRIMARY, fontWeight: 500 }}>Auto</span>
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M1.5 3L4.5 6L7.5 3" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{
              background: genBtnDone ? GREEN : WIRE_COLOR,
              borderRadius: 20, padding: '6px 15px',
              display: 'flex', alignItems: 'center', gap: 5,
              transform: `scale(${genBtnScale})`, transformOrigin: 'center right',
              boxShadow: genBtnDone ? '0 3px 10px rgba(16,185,129,0.28)' : '0 3px 12px rgba(250,204,21,0.35)',
            }}>
              {genBtnDone && (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2.5 6.5L5.5 9.5L10.5 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              <span style={{ fontFamily: INTER, fontSize: 12, fontWeight: 600, color: genBtnDone ? '#FFFFFF' : '#111827' }}>
                {genBtnDone ? 'Done' : 'Generate →'}
              </span>
            </div>
          </div>
        </div>
        <Port x={PROMPT_RX} y={PROMPT_RY} opacity={bubbleScale} />

        <div style={{ opacity: camCursorOp }}>
          <Cursor keyframes={CURSOR_KFS} containerWidth={CANVAS_W} containerHeight={CANVAS_H} />
        </div>
      </div>

      {/* ── 5-angle output — screen-space overlay ──────────────────────────── */}
      {overlayOp > 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `rgba(255,255,255,${0.70 * overlayOp})`,
          backdropFilter: `blur(${20 * overlayOp}px)`,
          WebkitBackdropFilter: `blur(${20 * overlayOp}px)`,
        }}>

          {/* ── Card 1 — Original: taller, vertically centered at y=540 ── */}
          <div style={{
            position: 'absolute',
            left: SPREAD_X0, top: Math.round(540 - (CARD_H + 55) / 2),
            width: CARD1_W, height: CARD_H + 55,
            borderRadius: 16, overflow: 'hidden',
            boxShadow: '0 28px 70px rgba(0,0,0,0.20), 0 0 0 1px rgba(0,0,0,0.07)',
            transform: `translateX(${card1TX + dismissX}px) translateY(${card1EntryY}px) scale(${card1Scale})`,
            transformOrigin: 'center center',
            opacity: card1EntryOp * dismissOp,
            zIndex: 3,
          }}>
            <Img src={staticFile('output.jpg')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />

            {/* Shimmer sweep */}
            {shimmerOp > 0 && (
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: `linear-gradient(90deg, transparent ${shimmerX - 90}px, rgba(255,255,255,0.28) ${shimmerX}px, transparent ${shimmerX + 90}px)`,
                opacity: shimmerOp,
              }} />
            )}

            {/* Processing fill bar */}
            {processBarOp > 0 && (
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(0,0,0,0.15)', opacity: processBarOp }}>
                <div style={{ height: '100%', width: `${processBar * 100}%`, background: WIRE_COLOR }} />
              </div>
            )}

            {/* Label */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 14px 14px', background: 'linear-gradient(to top, rgba(0,0,0,0.60) 0%, transparent 100%)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: INTER, fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: 0.3 }}>Original</span>
            </div>
          </div>

          {/* ── Cards 2–4 — Generated: badge above the card ── */}
          {[1, 2, 3].map(i => {
            if (frame < OTHER_PUSH_FRAMES[i - 1]) return null;
            const s = otherSprings[i - 1];
            const slideX  = interpolate(s, [0, 1], [-(i * (CARD_W + CARD_GAP)), 0]);
            const entryOp = interpolate(s, [0, 0.15], [0, 1]);
            const v       = ANGLE_VARIANTS[i];
            return (
              // Outer wrapper — image sits at SPREAD_Y (center = 540), badge floats above
              <div key={i} style={{
                position: 'absolute',
                left: SPREAD_X0 + CARD1_W + CARD_GAP + (i - 1) * (CARD_W + CARD_GAP), top: SPREAD_Y,
                width: CARD_W, height: CARD_H,
                overflow: 'visible',
                transform: `translateX(${slideX + (i !== 1 ? dismissXR : 0)}px) scale(${i === 1 ? selectedScale : 1})`,
                transformOrigin: 'center center',
                opacity: entryOp * (i !== 1 ? dismissOp : 1),
                zIndex: 3 - i,
              }}>
                {/* Result badge — absolutely positioned above the card */}
                <div style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: 0,
                  marginBottom: 10,
                  display: 'flex', justifyContent: 'flex-start',
                }}>
                  <div style={{
                    background: WIRE_COLOR,
                    borderRadius: 24, padding: '10px 20px',
                    display: 'flex', alignItems: 'center', gap: 7,
                  }}>
                    <span style={{ fontSize: 16, color: '#111827' }}>✦</span>
                    <span style={{ fontFamily: INTER, fontSize: 18, fontWeight: 700, color: '#111827', letterSpacing: 0.3 }}>Result</span>
                  </div>
                </div>

                {/* Selection ring on Angle 2 after pick */}
                {i === 1 && frame >= PICK_FRAME && (
                  <div style={{
                    position: 'absolute',
                    inset: -4, borderRadius: 20,
                    border: '3px solid #F59E0B',
                    boxShadow: '0 0 0 6px rgba(245,158,11,0.20)',
                    opacity: selectedOp, pointerEvents: 'none', zIndex: 5,
                  }} />
                )}

                {/* Card image — fills the wrapper (height = CARD_H) */}
                <div style={{
                  width: CARD_W, height: CARD_H,
                  borderRadius: 16, overflow: 'hidden',
                  boxShadow: i === 1 && frame >= PICK_FRAME
                    ? '0 16px 44px rgba(0,0,0,0.13), 0 0 0 2px rgba(245,158,11,0.60)'
                    : '0 16px 44px rgba(0,0,0,0.13), 0 0 0 1px rgba(99,102,241,0.18)',
                  position: 'relative',
                }}>
                  <Img src={staticFile(v.src)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 14px 12px', background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)', display: 'flex', alignItems: 'flex-end' }}>
                    <span style={{ fontFamily: INTER, fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: 0.3 }}>{v.label}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* ── Screen-space prompt connector ────────────────────────────── */}
          {wireProgress > 0 && (
            <>
              {/* Port dot on Angle 2 right edge */}
              <div style={{
                position: 'absolute',
                left: SC_CARD_RX - 5, top: SC_CARD_RY - 5,
                width: 10, height: 10, borderRadius: '50%',
                background: PORT_DOT, border: '2px solid #FFFFFF', zIndex: 6,
              }} />

              {/* Growing wire */}
              <svg style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
                width={CANVAS_W} height={CANVAS_H} viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}>
                <defs>
                  <marker id="arr-sc" markerWidth="20" markerHeight="16" refX="18" refY="8" orient="auto" markerUnits="userSpaceOnUse">
                    <path d="M0,1 L18,8 L0,15 Z" fill={WIRE_COLOR} />
                  </marker>
                </defs>
                <path
                  d={bezH(SC_CARD_RX, SC_CARD_RY, SC_PROMPT_L, SC_PROMPT_T + SC_PROMPT_H / 2)}
                  fill="none" stroke={WIRE_COLOR} strokeWidth={2}
                  pathLength={1} strokeDasharray={1} strokeDashoffset={1 - wireProgress}
                  markerEnd={wireProgress > 0.9 ? 'url(#arr-sc)' : undefined}
                  strokeLinecap="round"
                />
              </svg>

              {/* Port dot on prompt left edge */}
              {wireProgress > 0.9 && (
                <div style={{
                  position: 'absolute',
                  left: SC_PROMPT_L - 5, top: SC_PROMPT_T + SC_PROMPT_H / 2 - 5,
                  width: 10, height: 10, borderRadius: '50%',
                  background: PORT_DOT, border: '2px solid #FFFFFF', zIndex: 6,
                }} />
              )}
            </>
          )}

          {/* ── Screen-space prompt box ───────────────────────────────────── */}
          {promptOp > 0 && (
            <div style={{
              position: 'absolute',
              left: SC_PROMPT_L, top: SC_PROMPT_T,
              width: SC_PROMPT_W, height: SC_PROMPT_H,
              background: NODE_BG, borderRadius: 18, border: `1px solid ${NODE_BORDER}`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
              transform: `scale(${promptScale})`, transformOrigin: 'left center',
              opacity: promptOp, zIndex: 5,
            }}>
              {/* Chips row */}
              <div style={{ display: 'flex', gap: 6, padding: '9px 14px 8px', flexShrink: 0 }}>
                <div style={{ background: 'rgba(0,0,0,0.04)', borderRadius: 6, padding: '3px 9px', display: 'flex', alignItems: 'center', gap: 5, border: '1px solid rgba(0,0,0,0.06)' }}>
                  <ImgIcon color="#9CA3AF" />
                  <span style={{ fontFamily: INTER, fontSize: 11, color: '#6B7280', fontWeight: 500 }}>Angle 2</span>
                </div>
              </div>
              <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', margin: '0 14px', flexShrink: 0 }} />
              {/* Text area */}
              <div style={{ flex: 1, padding: '10px 16px 8px', overflow: 'hidden' }}>
                <span style={{ fontFamily: INTER, fontSize: 13, color: TEXT_PRIMARY, lineHeight: 1.6 }}>
                  Optimize for Facebook, X, TikTok
                </span>
              </div>
              {/* Toolbar */}
              <div style={{ padding: '6px 12px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, borderTop: '1px solid rgba(0,0,0,0.055)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, border: '1.5px solid rgba(0,0,0,0.11)', borderRadius: 20, padding: '5px 10px 5px 9px' }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M6.5 1.5L11 4V9L6.5 11.5L2 9V4L6.5 1.5Z" stroke="#374151" strokeWidth="1.2"/>
                    <path d="M6.5 1.5V11.5M2 4L11 9M11 4L2 9" stroke="#374151" strokeWidth="1" opacity="0.35"/>
                  </svg>
                  <span style={{ fontFamily: INTER, fontSize: 12, color: TEXT_PRIMARY, fontWeight: 500 }}>Auto</span>
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1.5 3L4.5 6L7.5 3" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                </div>
                <div style={{
                  background: WIRE_COLOR, borderRadius: 20, padding: '6px 15px',
                  display: 'flex', alignItems: 'center', gap: 5,
                  boxShadow: '0 3px 12px rgba(250,204,21,0.35)',
                }}>
                  <span style={{ fontFamily: INTER, fontSize: 12, fontWeight: 600, color: '#111827' }}>Generate →</span>
                </div>
              </div>
            </div>
          )}

          {/* Screen-space cursor picks Angle 2 — appears after More Efficient is done */}
          {frame >= 228 && (
            <Cursor keyframes={OVERLAY_CURSOR_KFS} containerWidth={CANVAS_W} containerHeight={CANVAS_H} />
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};
