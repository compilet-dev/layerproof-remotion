// src/components/scenes/brandkit/BrandKitHook.tsx
// Scene 1 — Hook (local frames 0–280, ~9.3s)
// Phase 1: cards slide right→left fast with rising wave on Y
// Phase 2: hero text fades in + orbiting badge images

import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { useTheme } from '../../../lib/theme';
import { Image, PenNib, Aperture, Person, Mountains, Cube, Palette, Shapes } from '@phosphor-icons/react';

// ── Images ────────────────────────────────────────────────────────────────────

const WAVE_IMAGES = [
  'wave/img_1.png',
  'wave/img_2.png',
  'wave/img_3.png',
  'wave/img_4.png',
  'wave/img_5.png',
  'wave/img_6.png',
];

const FALLBACK_IMG = staticFile('brand-kit-card.png');

const PostImg: React.FC<{ filename: string; style: React.CSSProperties }> = ({ filename, style }) => {
  const [errored, setErrored] = React.useState(false);
  return (
    <img
      src={errored ? FALLBACK_IMG : staticFile(filename)}
      onError={() => setErrored(true)}
      style={style}
    />
  );
};

// ── Phase 1: sliding wave ─────────────────────────────────────────────────────

const CARD_W        = 680;
const CARD_GAP      = 80;
const STRIDE        = CARD_W + CARD_GAP;
const CARDS_PER_ROW = 22;

// Dynamic velocity: smooth start, decelerates to a gentle crawl
const scrollX = (f: number) => {
  const fast  = 80;    // initial burst speed (px/frame)
  const floor = 2;     // minimum cruising speed (px/frame)
  const decay = 0.04;  // lower = fast phase lasts longer
  return (fast / decay) * (1 - Math.exp(-decay * f)) + floor * f;
};

const ROW_Y     = 200; // single row — vertically centered-ish
// Wave: vertical oscillation tied to current X position
const WAVE_AMP  = 70;   // px vertical peak
const WAVE_LEN  = 3840; // px per full cycle — only 1 peak visible at a time
const WAVE_SPEED = 0.03; // rad/frame — wave propagates forward

// ── Timing ────────────────────────────────────────────────────────────────────

const CANVAS_W     = 1920;
const CANVAS_H     = 1080;
const TEXT_START      = 30;   // all text appears together with char fade
const BADGES_START    = 130;  // badges spring out after text is in
const EXIT_START   = 260;
const EXIT_END     = 280;

// Strip dims slightly once text overlays it so text stays readable
const PHASE1_DIM_START = TEXT_START;
const PHASE1_DIM_END   = TEXT_START + 20;

// ── CharFade ─────────────────────────────────────────────────────────────────

// Renders text with per-character staggered fade-in starting at `startFrame`
const CHAR_STAGGER = 1.4; // frames between each character's fade
const CHAR_FADE    = 8;   // frames to fade each character from 0→1

const CharFade: React.FC<{
  text: string;
  frame: number;
  startFrame: number;
  style: React.CSSProperties;
  charOffset?: number; // global char index offset for cross-line stagger
}> = ({ text, frame, startFrame, style, charOffset = 0 }) => {
  return (
    <span style={{ ...style, opacity: 1 }}>
      {text.split('').map((char, i) => {
        const charStart = startFrame + (charOffset + i) * CHAR_STAGGER;
        const opacity = Math.min(1, Math.max(0, (frame - charStart) / CHAR_FADE));
        return (
          <span key={i} style={{ opacity }}>
            {char}
          </span>
        );
      })}
    </span>
  );
};

// ── Icon Panel ───────────────────────────────────────────────────────────────

type PhosphorIcon = React.FC<{ size: number; color: string }>;

const ICON_ITEMS: PhosphorIcon[] = [
  Image as PhosphorIcon,
  PenNib as PhosphorIcon,
  Aperture as PhosphorIcon,
  Person as PhosphorIcon,
  Mountains as PhosphorIcon,
  Cube as PhosphorIcon,
  Palette as PhosphorIcon,
  Shapes as PhosphorIcon,
];

const IconPanel: React.FC<{ size: number }> = ({ size }) => (
  <div style={{
    width: size,
    borderRadius: 20,
    background: '#1a1a1a',
    border: '1px solid rgba(255,255,255,0.12)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
    padding: '16px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gridTemplateRows: '1fr 1fr',
    gap: 10,
  }}>
    {ICON_ITEMS.map((Icon, i) => (
      <div key={i} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: '14px 0',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <Icon size={Math.round(size * 0.12)} color="rgba(255,255,255,0.75)" />
      </div>
    ))}
  </div>
);

// ── Hero text ─────────────────────────────────────────────────────────────────

// Badges fly from center to fixed corner positions
// stackImg: optional second image rendered overlapping bottom-right
const BADGES: { img: string; label: string; desc?: string; pillTop?: boolean; pillRight?: boolean; pillOffsetX?: number; pillOffsetY?: number; appearAt: number; tx: number; ty: number; floatAmp: number; floatPhase: number; tilt: number; size: number; stackImg?: string; whiteBorder?: boolean; noBg?: boolean; iconPanel?: boolean; imagePanel?: boolean }[] = [
  { img: 'badge-01.png', label: 'Colors',       appearAt: 130, tx:  535, ty: -300, floatAmp: 12, floatPhase: 0,   tilt: -6,  size: 192, pillOffsetX: -50, pillOffsetY: 70 },
  { img: 'badge-02.png', label: 'Logos',         appearAt: 148, tx:  680, ty:   10, floatAmp:  9, floatPhase: 1.6, tilt:  5,  size: 250, whiteBorder: false },
  { img: 'badge-05.png', label: 'Typography',    appearAt: 166, tx:  350, ty:  270, floatAmp: 11, floatPhase: 2.3, tilt:  8,  size: 160, whiteBorder: false, pillOffsetY: -20 },
  { img: 'character.png', label: 'Image assets',  appearAt: 184, tx: -600, ty: -220, floatAmp: 14, floatPhase: 3.1, tilt: -5,  size: 220, pillOffsetX: 30 },
  { img: 'badge-04.png', label: 'Brand voice',   appearAt: 202, tx: -600, ty:  280, floatAmp: 10, floatPhase: 4.7, tilt: -12, size: 270, whiteBorder: false, noBg: true, pillTop: true, pillRight: true, pillOffsetY: 55, pillOffsetX: 55 },
];

// ── Image Panel ──────────────────────────────────────────────────────────────

const PANEL_IMAGES = [
  'slides/slide_01.jpg',
  'character_01.jpg',
  'slides/slide_02.jpg',
  'composition.jpg',
];

const ImagePanel: React.FC<{ size: number }> = ({ size }) => (
  <div style={{
    width: size,
    borderRadius: 20,
    background: '#1a1a1a',
    border: '1px solid rgba(255,255,255,0.12)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
    padding: 10,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gap: 8,
  }}>
    {PANEL_IMAGES.map((src, i) => (
      <div key={i} style={{ borderRadius: 10, overflow: 'hidden', aspectRatio: '1' }}>
        <PostImg filename={src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

export const BrandKitHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const sceneOpacity = interpolate(frame, [0, 15, EXIT_START, EXIT_END], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 1: wave strip opacity ───────────────────────────────────────────

  // Strip stays visible but dims to 30% once text overlays it
  const stripOpacity = interpolate(frame, [PHASE1_DIM_START, PHASE1_DIM_END], [1, 0.12], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 2: text ─────────────────────────────────────────────────────────

  const exitOp = interpolate(frame, [EXIT_START, EXIT_END], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // ── Phase 2: badge orbit ───────────────────────────────────────────────────

  const badgeAnims = BADGES.map((b) => {
    const localF      = Math.max(0, frame - b.appearAt);
    const entrySpring = spring({ frame: localF, fps, config: { stiffness: 75, damping: 14 } });
    const opacity     = interpolate(localF, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    // Spring from center (0,0) to target corner
    const x = b.tx * entrySpring + Math.sin((frame / 80) * Math.PI * 2 + b.floatPhase) * b.floatAmp;
    const y = b.ty * entrySpring + Math.cos((frame / 80) * Math.PI * 2 + b.floatPhase) * b.floatAmp;
    return { opacity, x, y, rotate: b.tilt, size: b.size, label: b.label, desc: b.desc, pillTop: b.pillTop, stackImg: b.stackImg };
  });

  return (
    <AbsoluteFill style={{ background: '#2a2a2a', opacity: sceneOpacity, overflow: 'hidden' }}>

      {/* ── Phase 1: single sliding wave row ── */}
      <div style={{ position: 'absolute', inset: 0, opacity: stripOpacity }}>
        {Array.from({ length: CARDS_PER_ROW }, (_, col) => {
          const startX = (col - 1) * STRIDE;
          const cardX  = startX - scrollX(frame);
          const waveY  = WAVE_AMP * Math.sin(
            (cardX / WAVE_LEN) * Math.PI * 2 + frame * WAVE_SPEED
          );
          const cardY  = ROW_Y + waveY;

          return (
            <div
              key={col}
              style={{
                position: 'absolute',
                left: cardX,
                top:  cardY,
                width: CARD_W,
                borderRadius: 18,
                overflow: 'hidden',
                border: `1px solid ${theme.colors.glassBorder}`,
                boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
              }}
            >
              {WAVE_IMAGES.length > 0 ? (
                <PostImg
                  filename={WAVE_IMAGES[col % WAVE_IMAGES.length]}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: 400,
                  background: `linear-gradient(135deg, #1a1a1a 0%, #222 50%, #1a1a1a 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 18,
                    color: 'rgba(255,255,255,0.15)',
                    fontWeight: 500,
                  }}>Image {(col % 22) + 1}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Radial vignette — dark center over the cards ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 55% 48% at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.75) 65%, rgba(0,0,0,0.55) 100%)',
          opacity: interpolate(frame, [TEXT_START, TEXT_START + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          pointerEvents: 'none',
        }}
      />

      {/* ── Phase 2: hero text — all lines at once, per-character fade ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        opacity: exitOp,
      }}>
        {/* Line 1: Visual Assets That Match */}
        <CharFade
          text="Visual Assets That Match"
          frame={frame}
          startFrame={TEXT_START}
          charOffset={0}
          style={{
            fontFamily: theme.font.family,
            fontSize: 84,
            fontWeight: 600,
            color: theme.colors.white,
            letterSpacing: -2,
            lineHeight: 1,
            whiteSpace: 'nowrap',
            display: 'block',
          }}
        />
        {/* Line 2: Your Brand Identity */}
        <div style={{ display: 'flex', gap: 0 }}>
          <CharFade
            text="Your"
            frame={frame}
            startFrame={TEXT_START}
            charOffset={'Visual Assets That Match'.length}
            style={{
              fontFamily: theme.font.family,
              fontSize: 84,
              fontWeight: 600,
              color: theme.colors.white,
              letterSpacing: -2,
              lineHeight: 1,
              whiteSpace: 'nowrap',
              display: 'block',
              marginRight: 20,
            }}
          />
          <CharFade
            text="Brand Identity"
            frame={frame}
            startFrame={TEXT_START}
            charOffset={'Visual Assets That MatchYour '.length}
            style={{
              fontFamily: theme.font.family,
              fontSize: 84,
              fontWeight: 600,
              color: theme.colors.accentPink,
              letterSpacing: -2,
              lineHeight: 1,
              whiteSpace: 'nowrap',
              display: 'block',
            }}
          />
        </div>
      </div>

      {/* ── Phase 2: orbiting badge images ── */}
      {BADGES.map((b, i) => {
        const anim = badgeAnims[i];
        return (
          <div
            key={b.img}
            style={{
              position: 'absolute',
              left: CANVAS_W / 2 + anim.x,
              top:  CANVAS_H / 2 + anim.y,
              transform: `translate(-50%, -50%)`,
              opacity: anim.opacity,
            }}
          >
            {/* Image(s) */}
            <div style={{ position: 'relative', width: anim.size, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.7))' }}>
              {/* Main image, icon panel, or image panel */}
              {b.iconPanel ? (
                <IconPanel size={anim.size} />
              ) : b.imagePanel ? (
                <ImagePanel size={anim.size} />
              ) : (
                <div style={{
                  width: '100%',
                  borderRadius: b.noBg ? 0 : 20,
                  overflow: 'hidden',
                  border: b.noBg ? 'none' : b.whiteBorder ? '4px solid rgba(255,255,255,0.85)' : `1px solid ${theme.colors.glassBorder}`,
                  boxShadow: b.noBg ? 'none' : '0 12px 40px rgba(0,0,0,0.5)',
                  background: b.noBg ? 'transparent' : undefined,
                }}>
                  <PostImg
                    filename={`badges/${b.img}`}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              )}
              {/* Stack image — overlaps bottom-right corner */}
              {anim.stackImg && (
                <div style={{
                  position: 'absolute',
                  bottom: -60,
                  right: -80,
                  width: '65%',
                  borderRadius: 16,
                  overflow: 'hidden',
                  border: `2px solid ${theme.colors.bgDark}`,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                }}>
                  <PostImg
                    filename={anim.stackImg}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              )}
            </div>
            {/* Label pill — left of image for desc badges, bottom-overlap for others */}
            <div style={{
              position: 'absolute',
              ...(anim.pillTop ? { top: -20 + (b.pillOffsetY ?? 0) } : { bottom: -20 + (b.pillOffsetY ?? 0) }),
              ...(b.pillRight ? { right: 12 - (b.pillOffsetX ?? 0) } : { left: 12 + (b.pillOffsetX ?? 0) }),
              background: 'rgba(255,255,255,0.96)',
              borderRadius: anim.desc ? 20 : 100,
              padding: anim.desc ? '14px 18px' : '10px 24px',
              whiteSpace: anim.desc ? 'normal' : 'nowrap',
              maxWidth: anim.desc ? 400 : undefined,
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}>
              {!anim.desc && (
                <span style={{
                  fontFamily: theme.font.family,
                  fontSize: 26,
                  fontWeight: 600,
                  color: '#111',
                  letterSpacing: 0.1,
                }}>
                  {anim.label}
                </span>
              )}
              {anim.desc && (
                <span style={{
                  fontFamily: theme.font.family,
                  fontSize: 26,
                  fontWeight: 600,
                  color: '#111',
                  letterSpacing: 0.2,
                }}>
                  {anim.desc}
                </span>
              )}
            </div>
          </div>
        );
      })}

    </AbsoluteFill>
  );
};
