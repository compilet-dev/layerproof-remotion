// src/lib/themes/bold.ts
// V2 — dark gradient backgrounds, hot-pink + yellow accents, black-weight type
import type { Theme } from "../theme";
import { SpringConfig } from "remotion";

export const boldTheme: Theme = {
  colors: {
    bgDark: "#080808",
    bgMid: "#111111",
    bgSurface: "#1A1A1A",
    white: "#FFFFFF",
    gray: "#999999",
    grayLight: "#CCCCCC",
    glassBg: "rgba(255,255,255,0.06)",
    glassBorder: "rgba(255,255,255,0.12)",
    accentPink: "#FF589B",
    accentYellow: "#FFD600",
    gradientGlow:
      "radial-gradient(ellipse at 80% 90%, rgba(245,140,50,0.25) 0%, transparent 60%), radial-gradient(ellipse at 10% 20%, rgba(50,200,150,0.15) 0%, transparent 55%), #080808",
  },
  font: {
    family: '"Inter", "SF Pro Display", -apple-system, sans-serif',
    weightLight: 300,
    weightRegular: 400,
    weightMedium: 600,
    weightBold: 800,
    weightBlack: 900,
  },
  motion: {
    gentle: { stiffness: 60, damping: 20 } as SpringConfig,
    snappy: { stiffness: 100, damping: 18 } as SpringConfig,
    apple: { stiffness: 80, damping: 22 } as SpringConfig,
    slow: { stiffness: 40, damping: 25 } as SpringConfig,
  },
  radius: { sm: 8, md: 16, lg: 24, xl: 32 },
};
