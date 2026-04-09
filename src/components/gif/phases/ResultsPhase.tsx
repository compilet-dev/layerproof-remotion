// src/components/gif/phases/ResultsPhase.tsx
// Phase 2 (58–150f): Full LayerProofDashboard with real content streaming into all 4 cards

import React from 'react';
import { interpolate } from 'remotion';
import { GIF } from '../../../lib/gif';
import { fadeIn } from '../../../lib/animations';
import { LayerProofDashboard } from '../../ui/LayerProofDashboard';

interface ResultsPhaseProps {
  frame: number;
  fps: number;
}

const PROMPT_TEXT = 'https://layerproof.io/ai-launch';

export const ResultsPhase: React.FC<ResultsPhaseProps> = ({ frame }) => {
  const localFrame = frame - GIF.PHASE_RESULTS_START;

  // Fade entire phase in over 12 frames
  const phaseOpacity = fadeIn(localFrame, 0, 12);

  // Dashboard card springs into position
  const cardTranslateY = interpolate(
    Math.min(localFrame, 20),
    [0, 20],
    [18, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // outputsFrame drives the card streaming animation (0 → grows as time passes)
  // Cards stagger every 18f inside LayerProofDashboard — give it the local offset
  const outputsFrame = Math.max(0, localFrame - 4);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: phaseOpacity,
        transform: `translateY(${cardTranslateY}px)`,
      }}
    >
      {/* Scale wrapper — dashboard was designed for 1920×1080; scale down to fit 1200×630 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: 'scale(0.82)',
          transformOrigin: 'top left',
          width: `${100 / 0.82}%`,
          height: `${100 / 0.82}%`,
        }}
      >
        <LayerProofDashboard
          promptText={PROMPT_TEXT}
          showOutputs
          outputsFrame={outputsFrame}
          frame={frame}
        />
      </div>
    </div>
  );
};
