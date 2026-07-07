// src/compositions/LayerProofBrandKit.tsx
// LayerProof Brand Kit — Feature video (~54s)
// 6-scene narrative: Hook → Secret → Suite → Execution → Output → CTA

import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { ThemeProvider } from '../lib/theme';
import { boldTheme } from '../lib/themes/bold';
import { BrandKitHook }      from '../components/scenes/brandkit/BrandKitHook';
import { BrandKitSecret }    from '../components/scenes/brandkit/BrandKitSecret';
import { BrandKitSuite }     from '../components/scenes/brandkit/BrandKitSuite';
import { BrandKitExecution } from '../components/scenes/brandkit/BrandKitExecution';
import { BrandKitOutput }    from '../components/scenes/brandkit/BrandKitOutput';
import { BrandKitCTA }      from '../components/scenes/brandkit/BrandKitCTA';

export const LayerProofBrandKit: React.FC = () => (
  <ThemeProvider theme={boldTheme}>
    <AbsoluteFill style={{ background: '#080808' }}>

      {/* Scene 1: Hook — 0–280f */}
      <Sequence from={0} durationInFrames={280}>
        <BrandKitHook />
      </Sequence>

      {/* Scene 2: Brand Kit Import — 250–846f (30f crossfade with Scene 1) */}
      <Sequence from={250} durationInFrames={596}>
        <BrandKitSecret />
      </Sequence>

      {/* Scene 3: Creative Suite Unlock — 810–1005f (36f crossfade with Scene 2) */}
      <Sequence from={810} durationInFrames={195}>
        <BrandKitSuite />
      </Sequence>

      {/* Scene 4: Prompt + Theme Selection — 990–1360f (15f crossfade with Scene 3) */}
      <Sequence from={990} durationInFrames={370}>
        <BrandKitExecution />
      </Sequence>

      {/* Scene 5: Split Output — 1345–1555f (15f crossfade with Scene 4) */}
      <Sequence from={1345} durationInFrames={210}>
        <BrandKitOutput />
      </Sequence>

      {/* Scene 6: CTA — 1540–1720f (15f crossfade with Scene 5) */}
      <Sequence from={1540} durationInFrames={180}>
        <BrandKitCTA />
      </Sequence>

    </AbsoluteFill>
  </ThemeProvider>
);
