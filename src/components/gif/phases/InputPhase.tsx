// src/components/gif/phases/InputPhase.tsx
// Phase 1 (0–68f): Dark scene — headline springs in, URL types itself, Generate highlights

import React from 'react';
import { interpolate } from 'remotion';
import { fadeOut, scaleIn, springReveal } from '../../../lib/animations';
import { GIF } from '../../../lib/gif';
import { useTheme } from '../../../lib/theme';
import { PromptInputBox } from '../../ui/PromptInputBox';

interface InputPhaseProps {
  frame: number;
  fps: number;
}

const PROMPT_TEXT = 'https://layerproof.io/ai-launch';

export const InputPhase: React.FC<InputPhaseProps> = ({ frame, fps }) => {
  const theme = useTheme();

  // Fade this phase out as Phase 2 begins
  const containerOpacity = fadeOut(frame, GIF.PHASE_RESULTS_START, 10);

  // Headline: springs up from below, delay 5f
  const { opacity: headlineOpacity, y: headlineY } = springReveal(frame, fps, 5, 28);

  // Sub-label: "Get native formats for every channel" — fades in slightly later
  const subOpacity = interpolate(frame, [18, 36], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Card springs in at delay 14f
  const cardScale = scaleIn(frame, fps, 14);
  const cardOpacity = interpolate(frame, [14, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // URL types itself 20f–50f
  const promptChars = Math.round(
    interpolate(frame, [20, 50], [0, PROMPT_TEXT.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  const generateHighlighted = frame >= 50;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: containerOpacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 80px',
        gap: 24,
      }}
    >
      {/* Headline + sub-label */}
      <div
        style={{
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            fontSize: 62,
            fontWeight: theme.font.weightBold,
            color: theme.colors.white,
            letterSpacing: -1.5,
            lineHeight: 1.05,
          }}
        >
          Share a link.
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: theme.font.weightLight,
            color: theme.colors.gray,
            letterSpacing: 0.2,
            opacity: subOpacity,
          }}
        >
          Get native formats for every channel
        </div>
      </div>

      {/* Prompt input card */}
      <div
        style={{
          width: '100%',
          maxWidth: 740,
          opacity: cardOpacity,
          transform: `scale(${cardScale})`,
        }}
      >
        <PromptInputBox
          cardOnly
          promptText={PROMPT_TEXT}
          promptChars={promptChars}
          frame={frame}
          showCursor
          generateHighlighted={generateHighlighted}
        />
      </div>
    </div>
  );
};
