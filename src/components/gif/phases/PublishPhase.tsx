// src/components/gif/phases/PublishPhase.tsx
// Phase 3 (118–150f): Glass overlay over completed dashboard — success pill + tagline

import React from 'react';
import { interpolate, spring } from 'remotion';
import { fadeIn, glassCard, staggerReveal, PLATFORMS } from '../../../lib/animations';
import { GIF } from '../../../lib/gif';
import { useTheme } from '../../../lib/theme';

interface PublishPhaseProps {
  frame: number;
  fps: number;
}

export const PublishPhase: React.FC<PublishPhaseProps> = ({ frame, fps }) => {
  const theme = useTheme();
  const localFrame = frame - GIF.PHASE_PUBLISH_START;

  // Dark vignette fades over the dashboard to give overlay contrast
  const vignetteOpacity = fadeIn(localFrame, 0, 16);

  // Success pill — spring scale in at localFrame 0
  const pillSpring = spring({ frame: localFrame, fps, config: theme.motion.apple });
  const pillScale = interpolate(pillSpring, [0, 1], [0.72, 1]);
  const pillOpacity = interpolate(localFrame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Platform icons stagger inside the pill
  const emojiOpacity = PLATFORMS.map((_, i) =>
    staggerReveal(localFrame - 6, i, 5, 10)
  );
  const emojiY = PLATFORMS.map((_, i) =>
    interpolate(emojiOpacity[i], [0, 1], [10, 0])
  );

  // Tagline fades in at localFrame 14
  const taglineOpacity = fadeIn(localFrame, 14, 18);
  const taglineY = interpolate(
    Math.min(Math.max(localFrame - 14, 0), 18),
    [0, 18],
    [10, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
      }}
    >
      {/* Soft dark vignette over the dashboard beneath */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `rgba(${theme.colors.bgDark === '#080808' ? '8,8,8' : '8,8,8'},0.72)`,
          opacity: vignetteOpacity,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Success pill */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          opacity: pillOpacity,
          transform: `scale(${pillScale})`,
        }}
      >
        <div
          style={{
            ...glassCard(40, theme),
            padding: '20px 40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          {/* Published label */}
          <div
            style={{
              fontSize: 24,
              fontWeight: theme.font.weightBold,
              color: theme.colors.white,
              letterSpacing: 0.2,
            }}
          >
            ✦ Published to 4 channels
          </div>

          {/* Platform icons + labels */}
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            {PLATFORMS.map((platform, i) => (
              <div
                key={platform.id}
                style={{
                  opacity: emojiOpacity[i],
                  transform: `translateY(${emojiY[i]}px)`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: `${platform.color}22`,
                    border: `1px solid ${platform.color}50`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                  }}
                >
                  {platform.icon}
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color: theme.colors.gray,
                    fontWeight: theme.font.weightMedium,
                    letterSpacing: 0.4,
                  }}
                >
                  {platform.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: theme.font.weightLight,
            color: theme.colors.gray,
            letterSpacing: 2.5,
            textTransform: 'uppercase',
          }}
        >
          One prompt. Every platform.
        </div>
      </div>
    </div>
  );
};
