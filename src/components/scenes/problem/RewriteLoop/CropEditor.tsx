// src/components/scenes/problem/RewriteLoop/CropEditor.tsx
// Crop editor panel — receives all computed values as explicit props

import React from 'react';
import { useTheme } from '../../../../lib/theme';

// ─── Platform data ────────────────────────────────────────────────────────────

export const REWRITE_PLATFORMS = [
  {
    id: 'instagram',
    label: 'Instagram',
    descriptor: '1 : 1 · Square post',
    dims: '1080 × 1080',
    color: '#E1306C',
    iconBg:
      'linear-gradient(135deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
    icon: (
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
        <rect x="6" y="6" width="20" height="20" rx="6" stroke="#fff" strokeWidth="2" />
        <circle cx="16" cy="16" r="5" stroke="#fff" strokeWidth="2" />
        <circle cx="22.5" cy="9.5" r="1.5" fill="#fff" />
      </svg>
    ),
  },
  {
    id: 'story',
    label: 'Instagram Story',
    descriptor: '9 : 16 · Vertical',
    dims: '1080 × 1920',
    color: '#C13584',
    iconBg:
      'linear-gradient(135deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
    icon: (
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
        <rect x="10" y="4" width="12" height="24" rx="4" stroke="#fff" strokeWidth="2" />
        <circle cx="16" cy="16" r="4" stroke="#fff" strokeWidth="1.5" />
        <circle cx="20.5" cy="9.5" r="1.2" fill="#fff" />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    descriptor: '1.91 : 1 · Landscape',
    dims: '1200 × 628',
    color: '#0A66C2',
    iconBg: '#0A66C2',
    icon: (
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
        <rect x="6" y="13" width="4" height="13" fill="#fff" />
        <circle cx="8" cy="9" r="2.5" fill="#fff" />
        <path
          d="M14 13h4v2.5C18.8 14 20 13 22 13c3 0 4 2 4 5v8h-4v-7c0-1.5-.5-2.5-2-2.5s-2 1-2 2.5v7h-4V13z"
          fill="#fff"
        />
      </svg>
    ),
  },
  {
    id: 'twitter',
    label: 'Twitter / X',
    descriptor: '16 : 9 · Widescreen',
    dims: '1600 × 900',
    color: '#FFFFFF',
    iconBg: '#000000',
    icon: (
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
        <path
          d="M6 6L13.5 16.2L6 26H8.5L14.6 17.6L20 26H27L19.1 15.4L26 6H23.5L18 14L13 6H6Z"
          fill="#fff"
        />
      </svg>
    ),
  },
];

// ─── Image area constants ─────────────────────────────────────────────────────

export const IMG_LEFT = 214;
export const IMG_TOP = 390;
export const IMG_W = 860;
export const IMG_H = 440;

// ─── Crop box definitions ─────────────────────────────────────────────────────
// oX/oY = offset from image top-left; cW/cH = crop box size

export const CROPS = [
  { cW: 440, cH: 440, oX: 210, oY: 0 }, // 1:1
  { cW: 248, cH: 440, oX: 306, oY: 0 }, // 9:16
  { cW: 840, cH: 440, oX: 10,  oY: 0 }, // 1.91:1
  { cW: 782, cH: 440, oX: 39,  oY: 0 }, // 16:9 (height-fitted)
];

// ─── Props ────────────────────────────────────────────────────────────────────

export interface CropEditorProps {
  phase: number;
  phaseAge: number;
  cropW: number;
  cropH: number;
  cropOX: number;
  tabPulse: number;
  undoOpacity: number;
  ratioLockOpacity: number;
  warningOpacity: number;
  wastedPct: number;
  isExtreme: boolean;
  warnColor: string;
  warnBg: string;
  warnBorder: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CropEditor: React.FC<CropEditorProps> = ({
  phase,
  phaseAge: _phaseAge,
  cropW,
  cropH,
  cropOX,
  tabPulse,
  undoOpacity,
  ratioLockOpacity,
  warningOpacity,
  wastedPct,
  isExtreme,
  warnColor,
  warnBg,
  warnBorder,
}) => {
  const theme = useTheme();
  const pInfo = REWRITE_PLATFORMS[phase];
  const { cW, cH, oX, oY } = CROPS[phase];

  return (
    <div
      style={{
        width: 960,
        background: '#141416',
        borderRadius: 18,
        border: '1.5px solid rgba(255,255,255,0.09)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3), 0 20px 60px rgba(0,0,0,0.7)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* MacOS chrome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '14px 18px 0' }}>
        {['#FF5F57', '#FFBD2E', '#27C93F'].map((c) => (
          <div
            key={c}
            style={{ width: 12, height: 12, borderRadius: '50%', background: c, opacity: 0.85 }}
          />
        ))}
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '6px 18px 0',
          gap: 4,
          marginTop: 6,
        }}
      >
        {REWRITE_PLATFORMS.map((p, i) => {
          const isActive = i === phase;
          const isDone = i < phase;
          return (
            <div
              key={p.id}
              style={{
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                borderBottom: isActive ? `2.5px solid ${p.color}` : '2.5px solid transparent',
                background: isActive ? `${p.color}12` : 'transparent',
                borderRadius: '6px 6px 0 0',
                transform: `scale(${isActive ? tabPulse : 1})`,
                transformOrigin: 'bottom center',
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 5,
                  background: p.iconBg,
                  border: p.id === 'twitter' ? '1px solid rgba(255,255,255,0.18)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <div style={{ transform: 'scale(0.56)', transformOrigin: 'center' }}>{p.icon}</div>
              </div>
              <span
                style={{
                  fontFamily: theme.font.family,
                  fontSize: 16,
                  fontWeight: isActive ? theme.font.weightMedium : theme.font.weightLight,
                  color: isActive
                    ? p.color
                    : isDone
                      ? 'rgba(255,255,255,0.2)'
                      : 'rgba(255,255,255,0.38)',
                }}
              >
                {p.label}
              </span>
              {isDone && (
                <span style={{ fontSize: 16, color: '#e53935', fontFamily: theme.font.family }}>
                  ✗
                </span>
              )}
            </div>
          );
        })}
        <div
          style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', paddingBottom: 4 }}
        >
          <div
            style={{
              padding: '4px 12px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 5,
              fontFamily: theme.font.family,
              fontSize: 16,
              color: 'rgba(255,255,255,0.25)',
            }}
          >
            {pInfo.dims} px
          </div>
        </div>
      </div>

      {/* Toolbar strip */}
      <div
        style={{
          height: 52,
          padding: '0 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(255,255,255,0.02)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            background: `${pInfo.color}12`,
            border: `1px solid ${pInfo.color}30`,
            padding: '4px 12px',
            borderRadius: 20,
          }}
        >
          <span
            style={{
              fontFamily: theme.font.family,
              fontSize: 16,
              fontWeight: theme.font.weightMedium,
              color: pInfo.color,
            }}
          >
            Target: {pInfo.dims} · {pInfo.descriptor.split('·')[0].trim()}
          </span>
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            opacity: undoOpacity,
            padding: '4px 12px',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 6,
            fontFamily: theme.font.family,
            fontSize: 16,
            color: 'rgba(255,255,255,0.6)',
            background: '#2a2a2e',
          }}
        >
          ↩ Undo
        </div>
        <div
          style={{
            padding: '4px 12px',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 6,
            fontFamily: theme.font.family,
            fontSize: 16,
            color: 'rgba(255,255,255,0.45)',
            background: '#2a2a2e',
          }}
        >
          ⊡ Fit
        </div>
      </div>

      {/* Image / crop area */}
      <div
        style={{
          position: 'relative',
          width: IMG_W,
          height: IMG_H,
          alignSelf: 'center',
          overflow: 'hidden',
          background: '#222226',
          flexShrink: 0,
        }}
      >
        {/* Dimmed base image */}
        <img
          src={require('../../../../assets/post_image.jpg')}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.22,
          }}
        />
        {/* Masks outside crop box */}
        <div
          style={{
            position: 'absolute',
            left: 0, top: 0,
            width: cropOX, height: IMG_H,
            background: 'rgba(0,0,0,0.52)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: cropOX + cropW, top: 0,
            width: IMG_W - cropOX - cropW, height: IMG_H,
            background: 'rgba(0,0,0,0.52)',
          }}
        />
        {/* Active crop region */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: `inset(${oY}px ${IMG_W - oX - cW}px ${IMG_H - oY - cH}px ${oX}px)`,
          }}
        >
          <img
            src={require('../../../../assets/post_image.jpg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        {/* Crop border */}
        <div
          style={{
            position: 'absolute',
            left: cropOX, top: oY,
            width: cropW, height: cropH,
            border: `2px solid ${pInfo.color}`,
            borderRadius: 2,
            boxShadow: '0 0 0 1px rgba(255,255,255,0.2)',
            pointerEvents: 'none',
          }}
        />
        {/* Dashed inner guide */}
        <div
          style={{
            position: 'absolute',
            left: cropOX + 4, top: oY + 4,
            width: cropW - 8, height: cropH - 8,
            border: '1px dashed rgba(255,255,255,0.3)',
            pointerEvents: 'none',
          }}
        />
        {/* Corner handles */}
        {[
          { x: cropOX,        y: oY },
          { x: cropOX + cropW, y: oY },
          { x: cropOX,        y: oY + cropH },
          { x: cropOX + cropW, y: oY + cropH },
        ].map((h, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: h.x - 6, top: h.y - 6,
              width: 12, height: 12,
              background: '#fff',
              border: `2px solid ${pInfo.color}`,
              borderRadius: 2,
              boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
            }}
          />
        ))}
        {/* Ratio lock tooltip */}
        <div
          style={{
            position: 'absolute',
            right: 16, top: 12,
            opacity: ratioLockOpacity,
            background: '#1a1a1a',
            color: '#fff',
            fontFamily: theme.font.family,
            fontSize: 16,
            fontWeight: theme.font.weightBold,
            padding: '5px 12px',
            borderRadius: 6,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          🔒 Ratio locked: {pInfo.descriptor.split('·')[0].trim()}
        </div>
      </div>

      {/* Status bar */}
      <div
        style={{
          height: 48,
          padding: '0 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderTop: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
        }}
      >
        <div style={{ opacity: warningOpacity, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              background: warnBg,
              border: `1px solid ${warnBorder}`,
              color: warnColor,
              fontFamily: theme.font.family,
              fontSize: 16,
              fontWeight: theme.font.weightBold,
              padding: '4px 14px',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {isExtreme ? '⚠️' : '⚡'} {wastedPct}% cropped out
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <span
          style={{
            fontFamily: theme.font.family,
            fontSize: 16,
            color: 'rgba(255,255,255,0.25)',
          }}
        >
          Resize {phase + 1} / {REWRITE_PLATFORMS.length}
        </span>
      </div>
    </div>
  );
};
