// src/lib/animations.ts
// Shared animation utilities and LayerProof brand tokens

import React from 'react';
import { interpolate, spring, SpringConfig } from 'remotion';
import type { CursorKeyframe } from '../types';
import type { Theme } from './theme';
import { darkTheme } from './themes/dark';

// ─── Brand Tokens ─────────────────────────────────────────────────────────────

export const BRAND = {
  colors: {
    bgDark: '#F8F8F8',
    bgMid: '#F0F0F0',
    bgSurface: '#E8E8E8',
    white: '#0A0A0A',
    gray: '#666666',
    grayLight: '#444444',
    glassBg: 'rgba(0,0,0,0.04)',
    glassBorder: 'rgba(0,0,0,0.08)',
  },
  font: {
    family: '"Inter", "SF Pro Display", -apple-system, sans-serif',
    weightLight: 300,
    weightRegular: 400,
    weightMedium: 500,
    weightBold: 700,
    weightBlack: 900,
  },
  motion: {
    gentle: { stiffness: 60, damping: 20 } as SpringConfig,
    snappy: { stiffness: 100, damping: 18 } as SpringConfig,
    apple:  { stiffness: 80,  damping: 22 } as SpringConfig,
    slow:   { stiffness: 40,  damping: 25 } as SpringConfig,
  },
  radius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
} as const;

// ─── Animation Helpers ────────────────────────────────────────────────────────

export function fadeIn(frame: number, from = 0, duration = 20): number {
  return interpolate(frame, [from, from + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

export function fadeOut(frame: number, from: number, duration = 20): number {
  return interpolate(frame, [from, from + duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

export function scaleIn(
  frame: number,
  fps: number,
  delay = 0,
  config: SpringConfig = BRAND.motion.apple
): number {
  const s = spring({ frame: Math.max(0, frame - delay), fps, config });
  return interpolate(s, [0, 1], [0.85, 1]);
}

export function staggerReveal(
  frame: number,
  index: number,
  staggerFrames = 5,
  duration = 15
): number {
  const start = index * staggerFrames;
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

export function floatY(frame: number, amplitude = 8, period = 120): number {
  return Math.sin((frame / period) * Math.PI * 2) * amplitude;
}

export function orbitAngle(frame: number, period = 300, startAngle = 0): number {
  return startAngle + (frame / period) * 360;
}

// ─── Glass Card Style ─────────────────────────────────────────────────────────

export function glassCard(borderRadius: number = BRAND.radius.lg, theme: Theme = darkTheme): React.CSSProperties {
  return {
    background: theme.colors.glassBg,
    border: `1px solid ${theme.colors.glassBorder}`,
    borderRadius,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  };
}

// ─── Platform Config ──────────────────────────────────────────────────────────

export interface Platform {
  id: string;
  label: string;
  color: string;
  icon: string;
}

export const PLATFORMS: Platform[] = [
  { id: 'instagram', label: 'Instagram', color: '#E1306C', icon: '📸' },
  { id: 'linkedin',  label: 'LinkedIn',  color: '#0A66C2', icon: '💼' },
  { id: 'twitter',   label: 'Twitter/X', color: '#1DA1F2', icon: '𝕏'  },
  { id: 'blog',      label: 'Blog',      color: '#FF6B35', icon: '✍️' },
];

// ─── Easing Functions ───────────────────────────────────────────────────────

/** Cubic ease-out */
export function easeOut3(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Cubic ease-in-out */
export function easeIO3(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Quadratic ease-in-out */
export function easeIO(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/** Exponential ease-out — ideal for cursor feel */
export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

// ─── Spring Reveal Helper ────────────────────────────────────────────────────

/**
 * Standardizes the stagger entrance pattern used in 6+ scenes.
 * Returns { opacity, y } for a spring-based reveal.
 */
export function springReveal(
  frame: number,
  fps: number,
  delay: number = 0,
  fromY: number = 30,
  config: { stiffness?: number; damping?: number; mass?: number } = {}
): { opacity: number; y: number } {
  const { stiffness = 80, damping = 20, mass = 1 } = config;
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: { stiffness, damping, mass } });
  const opacity = interpolate(f, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const y = interpolate(progress, [0, 1], [fromY, 0]);
  return { opacity, y };
}

// ─── Type / Delete Animation ─────────────────────────────────────────────────

/**
 * Returns the number of characters to show for a type-then-delete animation.
 * tl = [typeInEndFrame, holdEndFrame, deleteEndFrame]
 */
export function getTypedText(
  frame: number,
  tl: [number, number, number],
  attempt: string
): string {
  const [typeEnd, holdEnd, deleteEnd] = tl;
  const len = attempt.length;

  if (frame <= typeEnd) {
    const chars = Math.round(interpolate(frame, [0, typeEnd], [0, len], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }));
    return attempt.slice(0, chars);
  }
  if (frame <= holdEnd) {
    return attempt;
  }
  if (frame <= deleteEnd) {
    const chars = Math.round(interpolate(frame, [holdEnd, deleteEnd], [len, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }));
    return attempt.slice(0, chars);
  }
  return '';
}

/** Unicode-safe character count */
export function countChars(text: string): number {
  return [...text].length;
}

// ─── Cursor Position Interpolation ───────────────────────────────────────────

/**
 * Interpolates cursor position between keyframes using exponential easing.
 * Returns { x, y } normalized (0–1).
 */
export function positionAt(
  f: number,
  sortedKFs: CursorKeyframe[]
): { x: number; y: number } {
  if (sortedKFs.length === 0) return { x: 0.5, y: 0.5 };
  if (f <= sortedKFs[0].frame) return { x: sortedKFs[0].x, y: sortedKFs[0].y };
  const last = sortedKFs[sortedKFs.length - 1];
  if (f >= last.frame) return { x: last.x, y: last.y };

  let kfA = sortedKFs[0];
  let kfB = sortedKFs[1];
  for (let i = 0; i < sortedKFs.length - 1; i++) {
    if (f >= sortedKFs[i].frame && f <= sortedKFs[i + 1].frame) {
      kfA = sortedKFs[i];
      kfB = sortedKFs[i + 1];
      break;
    }
  }

  const span = kfB.frame - kfA.frame;
  if (span === 0) return { x: kfB.x, y: kfB.y };
  const t = easeOutExpo((f - kfA.frame) / span);
  return {
    x: kfA.x + (kfB.x - kfA.x) * t,
    y: kfA.y + (kfB.y - kfA.y) * t,
  };
}
