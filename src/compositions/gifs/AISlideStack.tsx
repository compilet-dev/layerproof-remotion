// src/compositions/gifs/AISlideStack.tsx
// 4-second loopable GIF: AI-generated slides stack into a growing deck
// Resolution: 1200×675 (16:9) | 30fps | 120 frames

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { GifShell } from '../../components/gif/GifShell';
import { SlideStackPhase } from '../../components/gif/phases/SlideStackPhase';
import { ThemeProvider } from '../../lib/theme';
import { boldTheme } from '../../lib/themes/bold';

export const AISlideStack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <ThemeProvider theme={boldTheme}>
      <GifShell>
        <SlideStackPhase frame={frame} fps={fps} />
      </GifShell>
    </ThemeProvider>
  );
};
