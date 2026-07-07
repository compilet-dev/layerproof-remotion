// src/components/scenes/brandkit/BrandKitSecret.tsx
// Scene 2 — Brand Kit Import (local frames 0–300, 10s)
// Act 1: URL paste + Import click → Act 2: camera punch-in → Act 3: loading checklist
// Act 4: items expand with brand info, camera scrolls top→bottom following cursor

import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { easeIO3, easeOut3 } from '../../../lib/animations';
import { ANTON_FAMILY, ROBOTO_FAMILY } from '../../../lib/loadFont';
import { useTheme } from '../../../lib/theme';
import { Cursor } from '../../ui/Cursor';
import type { CursorKeyframe } from '../../../types';

// ── Timing ───────────────────────────────────────────────────────────────────

const TITLE_IN_START  = 5;
const TITLE_IN_END    = 22;
const TITLE_OUT_START = 68;
const TITLE_OUT_END   = 86;

// Subtitle text phase (shifted +30f total — 1s pause after "The secret?" fades)
const TEXT_IN_START   = 82;
const TEXT_IN_END     = 98;
const TEXT_OUT_START  = 218; // 4s hold after subtitle fully appears (TEXT_IN_END=98 + 120f)
const TEXT_OUT_END    = 232;

const PANEL_IN        = 232;  // follows text phase out
const URL_PASTE_FRAME = 258;
const CLICK_FRAME     = 294;

const PANEL_OUT_START = 299;
const PANEL_OUT_END   = 320;

const LOADING_IN      = 320;
// Ticks spaced 20f apart
const TICK_1          = 334;
const TICK_2          = 354;
const TICK_3          = 374;
const TICK_4          = 394;
const TICK_5          = 414;
const TICK_6          = 470; // +56f — brief beat before brand theme

const LOADING_OUT_START = TICK_6; // kept for camera logic reference

const CANVAS_W = 1920;
const CANVAS_H = 1080;

// Geometry for expanded card stack (used by camera pan)
const EXP_CARD_H    = 158;
const EXP_CARD_HS   = [158, 158, 158, 148, 158, 230]; // per-item expanded heights
const EXP_GAP       = 12;
const ITEM_COUNT    = 6;
const _EXP_STACK_H  = EXP_CARD_HS.reduce((a, h) => a + h, 0) + (ITEM_COUNT - 1) * EXP_GAP;
const _STACK_TOP_Y  = (CANVAS_H - _EXP_STACK_H) / 2;
// Fixed absolute top for each item (based on fully-expanded geometry — never shifts)
const ITEM_TOPS = (() => {
  let y = _STACK_TOP_Y;
  return EXP_CARD_HS.map((h) => { const top = y; y += h + EXP_GAP; return top; });
})();
// Per-item camera center Y: top of stack + sum of previous cards + half of this card
const REVIEW_CAM_YS = (() => {
  let topY = _STACK_TOP_Y;
  return EXP_CARD_HS.map((h) => {
    const cy = (topY + h / 2) / CANVAS_H;
    topY += h + EXP_GAP;
    return cy;
  });
})();
const REVIEW_CAM_Y6 = REVIEW_CAM_YS[ITEM_COUNT - 1];

// Zoom fires immediately when Brand Theme step ticks
const ZOOM_START  = TICK_6;          // punch-in starts at the tick itself
const EXIT_START  = ZOOM_START + 90; // hold to let content reveal + linger
const EXIT_END    = EXIT_START + 24;

// ── Content ──────────────────────────────────────────────────────────────────

const SAMPLE_URL   = 'layerproof.app';
const BRAND_COLORS = ['#FF589B', '#FFD600', '#080808', '#FFFFFF', '#6B7280'];
const COLOR_LABELS = ['Pink', 'Yellow', 'Dark', 'White', 'Neutral'];

const CHECKLIST = [
  { label: 'Detecting your logo',         sectionName: 'Logo',          tickFrame: TICK_1 },
  { label: 'Locking in your colours',     sectionName: 'Brand Colors',  tickFrame: TICK_2 },
  { label: 'Pairing your fonts',          sectionName: 'Typography',    tickFrame: TICK_3 },
  { label: 'Setting your brand tone',     sectionName: 'Brand Voice',   tickFrame: TICK_4 },
  { label: 'Sourcing your image assets',  sectionName: 'Image Assets',  tickFrame: TICK_5 },
  { label: 'Assembling your brand theme', sectionName: 'Brand Theme',   tickFrame: TICK_6 },
];


// ── Cursor keyframes ─────────────────────────────────────────────────────────

// Cursor screen positions are computed from canvas coords + camera transform:
//   screen_y = 540 + scale × (canvas_y − camY × 1080)
// URL row sits at canvas y≈621. camY≈0.513–0.519, scale≈1.06–1.18 → screen y≈611 = 0.566
// Import button canvas x≈973 → screen x = 960 + 1.18×(973−960) ≈ 975 = 0.508
const CURSOR_KFS: CursorKeyframe[] = [
  { frame: 240, x: 0.34,  y: 0.57 },             // hover near URL field
  { frame: 258, x: 0.30,  y: 0.57, click: true }, // click URL field to paste
  { frame: 286, x: 0.48,  y: 0.57, click: true }, // click Import button
  { frame: 304, x: 0.5,   y: 0.5  },
  // Cursor stays at a neutral vertical position while camera follows items
  { frame: TICK_1 + 6,  x: 0.58, y: 0.5  },
  { frame: TICK_2 + 6,  x: 0.58, y: 0.5  },
  { frame: TICK_3 + 6,  x: 0.58, y: 0.5  },
  { frame: TICK_4 + 6,  x: 0.58, y: 0.5  },
  { frame: TICK_5 + 6,        x: 0.58, y: 0.5  },
  { frame: ZOOM_START,        x: 0.5,  y: 0.5  },
  // Cursor moves into the Brand Theme card as camera punches in
  { frame: ZOOM_START + 18,   x: 0.38, y: 0.54 },
  { frame: EXIT_START - 8,    x: 0.36, y: 0.53 },
];

// ─────────────────────────────────────────────────────────────────────────────

export const BrandKitSecret: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const PINK   = theme.colors.accentPink   ?? '#FF589B';
  const YELLOW = theme.colors.accentYellow ?? '#FFD600';

  const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

  // ── Camera ────────────────────────────────────────────────────────────────
  const CAM_CURSOR_START = 240;
  const CAM_INPUT_CLICK  = 258;

  const cameraScale = (() => {
    if (frame <= CAM_CURSOR_START) return 1.0;
    if (frame <= CAM_INPUT_CLICK) {
      const t = easeOut3((frame - CAM_CURSOR_START) / (CAM_INPUT_CLICK - CAM_CURSOR_START));
      return 1.0 + 0.06 * t;
    }
    if (frame <= CLICK_FRAME) {
      const t = easeOut3((frame - CAM_INPUT_CLICK) / (CLICK_FRAME - CAM_INPUT_CLICK));
      return 1.06 + 0.12 * t;
    }
    if (frame <= CLICK_FRAME + 20) {
      const t = easeOut3((frame - CLICK_FRAME) / 20);
      return 1.18 + 0.62 * t; // → 1.80
    }
    // Breathe back to focus zoom as items start loading
    if (frame <= TICK_1) {
      const t = easeOut3((frame - (CLICK_FRAME + 20)) / (TICK_1 - CLICK_FRAME - 20));
      return 1.80 + 0.10 * t; // → 1.9
    }
    // Hold focus zoom throughout item review — no pre-zoom
    if (frame <= ZOOM_START) return 1.9;
    // Punch-in only at Brand Theme tick
    if (frame <= EXIT_START) {
      const s = spring({ frame: frame - ZOOM_START, fps, config: { stiffness: 55, damping: 20 } });
      return 1.9 + 1.3 * s; // → 3.2
    }
    return 3.2;
  })();

  const camY = (() => {
    if (frame <= CAM_CURSOR_START) return 0.5;
    if (frame <= CLICK_FRAME) {
      const t = easeOut3((frame - CAM_CURSOR_START) / (CLICK_FRAME - CAM_CURSOR_START));
      return 0.5 + 0.019 * t;
    }
    if (frame <= CLICK_FRAME + 20) return 0.519;
    // Drift back to center before first item
    if (frame <= TICK_1) {
      const t = easeOut3((frame - (CLICK_FRAME + 20)) / (TICK_1 - CLICK_FRAME - 20));
      return 0.519 - 0.019 * t; // → 0.5
    }
    // Smooth continuous pan from first item through last — camera leads slightly
    // so items fly UP into an already-centered frame
    if (frame <= ZOOM_START) {
      const PAN_START = TICK_3;
      const t = easeIO3(Math.max(0, (frame - PAN_START) / (ZOOM_START - PAN_START)));
      return REVIEW_CAM_YS[0] + (REVIEW_CAM_YS[4] - REVIEW_CAM_YS[0]) * t;
    }
    // At ZOOM_START spring to Brand Theme
    if (frame <= EXIT_START) {
      const s = spring({ frame: frame - ZOOM_START, fps, config: { stiffness: 50, damping: 22 } });
      return REVIEW_CAM_YS[4] + (REVIEW_CAM_Y6 - REVIEW_CAM_YS[4]) * Math.min(s, 1);
    }
    return REVIEW_CAM_Y6;
  })();

  const camX = 0.5; // always centered

  const cameraTX = (CANVAS_W / 2 - camX * CANVAS_W) * cameraScale;
  const cameraTY = (CANVAS_H / 2 - camY * CANVAS_H) * cameraScale;

  // ── Scene opacity ─────────────────────────────────────────────────────────
  const fadeInOp = interpolate(frame, [0, 15], [0, 1], clamp);
  const exitOp   = interpolate(frame, [EXIT_START, EXIT_END], [1, 0], clamp);
  const sceneOpacity = fadeInOp * exitOp;

  // ── Title ─────────────────────────────────────────────────────────────────
  const titleOpacity =
    interpolate(frame, [TITLE_IN_START, TITLE_IN_END], [0, 1], clamp) *
    interpolate(frame, [TITLE_OUT_START, TITLE_OUT_END], [1, 0], clamp);

  // ── Import panel ──────────────────────────────────────────────────────────
  const panelSpring = spring({ frame: Math.max(0, frame - PANEL_IN), fps, config: { stiffness: 80, damping: 22 } });
  const panelY      = interpolate(panelSpring, [0, 1], [32, 0]);
  const panelInOp   = interpolate(Math.max(0, frame - PANEL_IN), [0, 20], [0, 1], clamp);
  const panelOutOp  = interpolate(frame, [PANEL_OUT_START, PANEL_OUT_END], [1, 0], clamp);
  const panelOp     = panelInOp * panelOutOp;
  const panelExitY  = interpolate(frame, [PANEL_OUT_START, PANEL_OUT_END], [0, -380], clamp);

  const cardSpringScale = interpolate(
    spring({ frame: Math.max(0, frame - PANEL_IN), fps, config: { stiffness: 70, damping: 22 } }),
    [0, 1], [0.88, 1.0]
  );
  void cardSpringScale;

  const displayUrl = frame >= URL_PASTE_FRAME ? SAMPLE_URL : '';
  const isPasted   = frame >= URL_PASTE_FRAME;

  // ── Loading state ─────────────────────────────────────────────────────────
  // Each item flies upward into its final position
  // Item 0 appears at its tickFrame (camera is already panning to it by then)
  // Other items appear 22f before their tick
  const loadingItemSprings = CHECKLIST.map((item, i) => {
    const delay = (i === 0 || i === ITEM_COUNT - 1) ? item.tickFrame : item.tickFrame - 8;
    const s = spring({ frame: Math.max(0, frame - delay), fps, config: { stiffness: 60, damping: 20 } });
    return {
      y:          interpolate(s, [0, 1], [200, 0]),
      entranceOp: interpolate(Math.max(0, frame - delay), [0, 10], [0, 1], clamp),
    };
  });

  // Per-item expand spring — triggers immediately when item ticks (slow, deliberate)
  const COMPACT_H = 48;
  const expandSprings = CHECKLIST.map((item) =>
    spring({ frame: Math.max(0, frame - item.tickFrame), fps, config: { stiffness: 38, damping: 22 } })
  );

  // Checklist tick state
  const tickedItems  = CHECKLIST.map((item) => frame >= item.tickFrame);
  const activeIndex  = tickedItems.findIndex(t => !t);
  const tickSprings  = CHECKLIST.map((item) =>
    spring({ frame: Math.max(0, frame - item.tickFrame), fps, config: { stiffness: 120, damping: 16 } })
  );

  // ── Expanded card content ─────────────────────────────────────────────────
  // All content is sized to fit within a 76px content area (card 148px - 2×18px padding - 12px gap - ~24px label)
  const renderExpandedContent = (i: number) => {
    // i=0: Logo — 3 variants: symbol / logo (horizontal) / wordmark
    if (i === 0) {
      const TILE = 96;
      const tileStyle: React.CSSProperties = {
        width: TILE, height: TILE, borderRadius: 14,
        background: '#111', border: '1px solid rgba(255,255,255,0.10)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      };
      return (
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          {/* Symbol */}
          <div style={tileStyle}>
            <img src={staticFile('layerproof-symbol.png')} style={{ width: 46, height: 46, objectFit: 'contain' }} />
          </div>
          {/* Logo — horizontal lockup */}
          <div style={tileStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px' }}>
              <img src={staticFile('layerproof-symbol.png')} style={{ width: 22, height: 22, objectFit: 'contain', flexShrink: 0 }} />
              <span style={{ fontFamily: theme.font.family, fontSize: 13, fontWeight: theme.font.weightBold, color: theme.colors.white, letterSpacing: -0.3, lineHeight: 1, whiteSpace: 'nowrap' as const }}>LayerProof</span>
            </div>
          </div>
          {/* Wordmark */}
          <div style={tileStyle}>
            <span style={{ fontFamily: theme.font.family, fontSize: 13, fontWeight: theme.font.weightBold, color: theme.colors.white, letterSpacing: -0.3, lineHeight: 1, whiteSpace: 'nowrap' as const, padding: '0 10px' }}>LayerProof</span>
          </div>
        </div>
      );
    }
    // i=1: Colours
    if (i === 1) return (
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        {BRAND_COLORS.map((c, ci) => (
          <div key={ci} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
            <div style={{ width: 52, height: 52, borderRadius: 10, background: c, border: '1px solid rgba(255,255,255,0.12)', flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: theme.font.family, fontSize: 11, fontWeight: theme.font.weightMedium, color: theme.colors.white }}>{COLOR_LABELS[ci]}</div>
              <div style={{ fontFamily: theme.font.family, fontSize: 10, color: theme.colors.gray, marginTop: 1, letterSpacing: 0.3 }}>{c}</div>
            </div>
          </div>
        ))}
      </div>
    );
    // i=2: Typography
    if (i === 2) return (
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { role: 'Heading', family: ANTON_FAMILY,  name: 'Anton',  weight: 700, weights: 'Bold · Display' },
          { role: 'Body',    family: ROBOTO_FAMILY, name: 'Roboto', weight: 400, weights: 'Regular · Light' },
        ].map((f) => (
          <div key={f.role} style={{
            display: 'flex', alignItems: 'center', gap: 16,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 12, padding: '10px 18px', flex: 1, overflow: 'hidden',
          }}>
            <span style={{ fontFamily: f.family, fontSize: 64, fontWeight: f.weight, color: theme.colors.white, letterSpacing: f.role === 'Heading' ? 2 : -1, lineHeight: 1, flexShrink: 0 }}>Aa</span>
            <div>
              <div style={{ fontFamily: theme.font.family, fontSize: 10, color: theme.colors.gray, letterSpacing: 0.8, textTransform: 'uppercase' as const, marginBottom: 2 }}>{f.role}</div>
              <div style={{ fontFamily: theme.font.family, fontSize: 14, fontWeight: theme.font.weightBold, color: theme.colors.white }}>{f.name}</div>
              <div style={{ fontFamily: theme.font.family, fontSize: 10, color: theme.colors.gray, marginTop: 1 }}>{f.weights}</div>
            </div>
          </div>
        ))}
      </div>
    );
    // i=3: Brand Voice
    if (i === 3) return (
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 12, alignItems: 'stretch' }}>
        {[
          { label: 'Tone',            body: '"Confident, minimal, innovative"', italic: true },
          { label: 'Target Audience', body: 'Marketers & content teams',        italic: false },
        ].map((box) => (
          <div key={box.label} style={{
            flex: 1,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 10, padding: '8px 12px',
          }}>
            <div style={{ fontFamily: theme.font.family, fontSize: 10, color: theme.colors.gray, letterSpacing: 0.8, textTransform: 'uppercase' as const, marginBottom: 6 }}>{box.label}</div>
            <div style={{ fontFamily: theme.font.family, fontSize: 13, color: theme.colors.white, fontStyle: box.italic ? 'italic' : 'normal', lineHeight: 1.4 }}>{box.body}</div>
          </div>
        ))}
        <div style={{
          flex: 1,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 10, padding: '8px 12px',
        }}>
          <div style={{ fontFamily: theme.font.family, fontSize: 10, color: theme.colors.gray, letterSpacing: 0.8, textTransform: 'uppercase' as const, marginBottom: 6 }}>Personality</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5 }}>
            {['Bold', 'Witty', 'Precise'].map((p) => (
              <span key={p} style={{
                fontFamily: theme.font.family, fontSize: 11, color: YELLOW,
                background: `${YELLOW}18`, border: `1px solid ${YELLOW}44`,
                borderRadius: 5, padding: '2px 8px',
              }}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    );
    // i=4: Image Assets
    if (i === 4) return (
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {['lightbeam.png', 'brain.png', 'laptop.png', 'badges/character.png'].map((src, idx) => (
          <div key={idx} style={{ width: 90, height: 90, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)', flexShrink: 0 }}>
            <img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        ))}
        <div style={{
          width: 90, height: 90, borderRadius: 8, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}>
          <span style={{ fontFamily: theme.font.family, fontSize: 18, fontWeight: theme.font.weightBold, color: theme.colors.white }}>+4</span>
        </div>
      </div>
    );
    // i=5: Brand Theme (camera zooms in here)
    const loadingOp = interpolate(frame, [ZOOM_START, ZOOM_START + 10, ZOOM_START + 40, ZOOM_START + 50], [0, 1, 1, 0], clamp);
    const spinDeg = (frame * 6) % 360; // 6° per frame = 1 full rotation per second
    const R = 16;
    const CIRC = 2 * Math.PI * R;
    const dashLen = CIRC * 0.7; // 70% arc
    return (
      <div style={{ position: 'relative' }}>
        {/* Loading ring */}
        {loadingOp > 0 && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: loadingOp,
          }}>
            <svg width={40} height={40} viewBox="0 0 40 40" style={{ display: 'block' }}>
              {/* Track */}
              <circle cx={20} cy={20} r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={2.5} />
              {/* Spinning arc */}
              <circle
                cx={20} cy={20} r={R}
                fill="none"
                stroke={YELLOW}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeDasharray={`${dashLen} ${CIRC}`}
                strokeDashoffset={0}
                transform={`rotate(${spinDeg} 20 20)`}
              />
            </svg>
          </div>
        )}
        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 180, height: 90, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }}>
            <img src={staticFile('brand-kit-thumbnail.png')} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div>
            <div style={{ fontFamily: theme.font.family, fontSize: 16, fontWeight: theme.font.weightMedium, color: theme.colors.white, letterSpacing: -0.2 }}>LayerProof Brand Theme</div>
            <div style={{ fontFamily: theme.font.family, fontSize: 11, color: theme.colors.gray, marginTop: 3 }}>Bold · Vibrant · Dark Mode</div>
          </div>
        </div>
      </div>
    );
  };


  return (
    <AbsoluteFill style={{ background: theme.colors.bgDark, opacity: sceneOpacity, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: CANVAS_W,
        height: CANVAS_H,
        transform: `translate(${cameraTX}px, ${cameraTY}px) scale(${cameraScale})`,
        transformOrigin: 'center center',
      }}>

        {/* ── "The secret?" ── */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: titleOpacity,
          pointerEvents: 'none',
        }}>
          <span style={{
            fontFamily: theme.font.family,
            fontSize: 100,
            fontWeight: 600,
            color: theme.colors.white,
            letterSpacing: -2.5,
          }}>
            The secret?
          </span>
        </div>

        {/* ── Subtitle text phase ── */}
        {(() => {
          const op =
            interpolate(frame, [TEXT_IN_START, TEXT_IN_END], [0, 1], clamp) *
            interpolate(frame, [TEXT_OUT_START, TEXT_OUT_END], [1, 0], clamp);
          const slideY = interpolate(
            spring({ frame: Math.max(0, frame - TEXT_IN_START), fps, config: { stiffness: 70, damping: 22 } }),
            [0, 1], [28, 0]
          );
          return (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 24,
              opacity: op, transform: `translateY(${slideY}px)`,
              pointerEvents: 'none',
            }}>
              <img
                src={staticFile('brand-kit-banner.png')}
                style={{ height: 520, width: 'auto', objectFit: 'contain', display: 'block' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                <span style={{
                  fontFamily: theme.font.family, fontSize: 110,
                  fontWeight: 600, color: theme.colors.white,
                  letterSpacing: -3, lineHeight: 1, textTransform: 'none',
                }}><span style={{ color: theme.colors.accentPink }}>Brand Kit</span> in LayerProof</span>
                <span style={{
                  fontFamily: theme.font.family, fontSize: 44,
                  fontWeight: theme.font.weightLight, color: theme.colors.gray,
                  letterSpacing: -0.5,
                }}>A Brand DNA layer</span>
              </div>
            </div>
          );
        })()}

        {/* ── ACT 1: Import panel ── */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 36,
          opacity: panelOp,
          transform: `translateY(${panelY + panelExitY}px)`,
          pointerEvents: 'none',
        }}>
          {/* "Paste a URL / or Drop a PDF" label above the panel */}
          <div style={{
            textAlign: 'center',
            fontFamily: theme.font.family,
            fontSize: 36,
            fontWeight: theme.font.weightMedium,
            color: theme.colors.white,
            letterSpacing: -0.5,
            lineHeight: 1.4,
          }}>
            Paste a URL<br />
            <span style={{ color: theme.colors.gray, fontWeight: theme.font.weightLight }}>or Drop a PDF</span>
          </div>

          <div style={{
            display: 'inline-flex',
            borderRadius: 24,
            overflow: 'hidden',
            border: `1px solid ${theme.colors.glassBorder}`,
            background: theme.colors.glassBg,
            backdropFilter: 'blur(20px)',
          }}>
            {/* LEFT — form */}
            <div style={{
              flexShrink: 0,
              width: 'fit-content',
              padding: '56px 52px',
              display: 'flex',
              flexDirection: 'column',
              gap: 28,
            }}>
              <div style={{
                fontFamily: theme.font.family,
                fontSize: 40,
                fontWeight: theme.font.weightMedium,
                color: theme.colors.white,
                letterSpacing: -1,
                lineHeight: 1.15,
              }}>
                Create your Brand Kit{' '}
                <span style={{ color: YELLOW }}>in seconds</span>
              </div>
              <div style={{
                fontFamily: theme.font.family,
                fontSize: 22,
                fontWeight: theme.font.weightLight,
                color: theme.colors.gray,
                lineHeight: 1.5,
              }}>
                Paste your brand guideline URL or upload a PDF
              </div>

              {/* URL input row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                gap: 16,
                background: 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${isPasted ? `${YELLOW}88` : theme.colors.glassBorder}`,
                borderRadius: 14,
                padding: '13px 18px',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke={theme.colors.gray} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke={theme.colors.gray} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{
                  fontFamily: theme.font.family,
                  fontSize: 22,
                  color: displayUrl ? theme.colors.white : theme.colors.gray,
                  flex: 1,
                  letterSpacing: 0.2,
                }}>
                  {displayUrl || 'https://your-brand-guidelines.com'}
                </span>
                <div style={{
                  padding: '10px 24px',
                  borderRadius: 10,
                  background: isPasted ? YELLOW : 'rgba(255,255,255,0.08)',
                  color: isPasted ? '#000000' : theme.colors.gray,
                  fontFamily: theme.font.family,
                  fontSize: 20,
                  fontWeight: theme.font.weightBold,
                  flexShrink: 0,
                }}>
                  Import
                </div>
              </div>

              {/* PDF upload button */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                alignSelf: 'flex-start',
                gap: 14,
                border: `1.5px solid ${theme.colors.glassBorder}`,
                borderRadius: 18,
                padding: '22px 36px',
                color: theme.colors.white,
                fontFamily: theme.font.family,
                fontSize: 22,
                fontWeight: theme.font.weightMedium,
                background: 'transparent',
              }}>
                <span style={{ fontSize: 22 }}>↑</span>
                Upload Guideline PDF
              </div>
            </div>

            {/* RIGHT — brand kit preview image */}
            <div style={{
              width: 580,
              flexShrink: 0,
              background: '#1e1e1e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 36,
            }}>
              <img
                src={staticFile('brand-kit-card.png')}
                style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block', borderRadius: 16 }}
              />
            </div>
          </div>
        </div>

        {/* ── ACT 3 + 4: Items load as checklist rows, expand inline on tick ── */}
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}>
          {CHECKLIST.map((item, i) => {
            const exp = expandSprings[i];
            const cardH = interpolate(exp, [0, 1], [COMPACT_H, EXP_CARD_HS[i]]);
            // Brand Theme: 1.5s loading state before content reveals
            const expandedOp = i === ITEM_COUNT - 1
              ? interpolate(frame, [ZOOM_START + 45, ZOOM_START + 65], [0, 1], clamp)
              : interpolate(exp, [0.2, 1], [0, 1], clamp);
            const isTicked  = tickedItems[i];
            const isActive  = activeIndex === i;
            const isPending = !isTicked && !isActive;
            const tickScale = interpolate(tickSprings[i], [0, 1], [0.6, 1.0]);
            const { y: itemY, entranceOp } = loadingItemSprings[i];

            // Line height: from bottom of circle to top of next circle
            // circle center Y = COMPACT_H/2 = 24, radius = 9 → bottom at 33
            // next circle top = cardH + EXP_GAP + (COMPACT_H/2 - 9) = cardH + EXP_GAP + 15
            // line height = cardH + EXP_GAP - 18
            const lineH = cardH + EXP_GAP - 18;
            const lineOp = interpolate(entranceOp, [0.5, 1], [0, 1], clamp);

            return (
              <div key={i} style={{
                position: 'absolute',
                top: ITEM_TOPS[i],
                left: (CANVAS_W - 600) / 2,
                width: 600,
                height: cardH,
                opacity: entranceOp,
                transform: `translateY(${itemY}px)`,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'visible',
                borderRadius: 18,
                boxSizing: 'border-box' as const,
              }}>
                {/* Vertical connector — only when both this item is ticked AND next item is visible */}
                {i < ITEM_COUNT - 2 && isTicked && loadingItemSprings[i + 1].entranceOp > 0 && (
                  <div style={{
                    position: 'absolute',
                    left: 24 + 8,   // padding-left + circle center (18/2=9, minus 1 for line half-width)
                    top: COMPACT_H / 2 + 9, // circle bottom
                    width: 1.5,
                    height: lineH,
                    background: `rgba(255,214,0,${0.25 * lineOp})`,
                    borderRadius: 1,
                  }} />
                )}

                {/* Header row — always visible once item enters */}
                <div style={{
                  height: COMPACT_H,
                  flexShrink: 0,
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '0 24px',
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 9, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transform: `scale(${isTicked ? tickScale : 1})`,
                    background: isTicked ? YELLOW : 'transparent',
                    border: isTicked ? 'none' : `1.5px solid ${isPending ? `${YELLOW}33` : YELLOW}`,
                  }}>
                    {isTicked && <span style={{ color: '#000', fontSize: 10, fontWeight: 900, lineHeight: 1 }}>✓</span>}
                  </div>
                  <span style={{
                    fontFamily: theme.font.family, fontSize: 18,
                    fontWeight: theme.font.weightMedium,
                    color: isPending ? theme.colors.gray : theme.colors.white,
                    letterSpacing: -0.3,
                  }}>{item.label}</span>
                </div>

                {/* Brand content — revealed below header as card grows */}
                <div style={{
                  flex: 1,
                  opacity: expandedOp,
                  padding: '4px 24px 10px 52px',
                  overflow: 'hidden',
                }}>
                  {renderExpandedContent(i)}
                </div>
              </div>
            );
          })}
        </div>


      </div>
      {/* Cursor — outside camera transform so it renders in screen space */}
      <Cursor keyframes={CURSOR_KFS} />
    </AbsoluteFill>
  );
};
