// src/components/gif/GifShell.tsx
// Wrapper for all GIF compositions — sets dark background, font defaults, persistent logo mark

import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useTheme } from '../../lib/theme';

interface GifShellProps {
  children: React.ReactNode;
}

export const GifShell: React.FC<GifShellProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <AbsoluteFill
      style={{
        background: theme.colors.bgDark,
        fontFamily: theme.font.family,
        overflow: 'hidden',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
