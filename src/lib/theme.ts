// src/lib/theme.ts
// Theme context system for LayerProof V2

import React from 'react';
import { SpringConfig } from 'remotion';

export interface Theme {
  colors: {
    bgDark: string;
    bgMid: string;
    bgSurface: string;
    white: string;
    gray: string;
    grayLight: string;
    glassBg: string;
    glassBorder: string;
    accentPink?: string;
    accentYellow?: string;
    gradientGlow?: string;
  };
  font: {
    family: string;
    weightLight: number;
    weightRegular: number;
    weightMedium: number;
    weightBold: number;
    weightBlack: number;
  };
  motion: {
    gentle: SpringConfig;
    snappy: SpringConfig;
    apple: SpringConfig;
    slow: SpringConfig;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

// Default theme (V1 values) — defined here to avoid circular import
export const darkTheme: Theme = {
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
  radius: { sm: 8, md: 16, lg: 24, xl: 32 },
};

const ThemeContext = React.createContext<Theme>(darkTheme);

export const useTheme = (): Theme => React.useContext(ThemeContext);

export const ThemeProvider: React.FC<{ theme: Theme; children: React.ReactNode }> = ({ theme, children }) =>
  React.createElement(ThemeContext.Provider, { value: theme }, children);
