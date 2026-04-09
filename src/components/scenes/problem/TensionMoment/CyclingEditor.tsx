import React from 'react';
import { interpolate } from 'remotion';
import { getTypedText, countChars } from '../../../../lib/animations';
import { useTheme } from '../../../../lib/theme';

// ─── Platform data ────────────────────────────────────────────────────────────
// Renamed from PLATFORMS to TENSION_PLATFORMS to avoid namespace conflicts

export const TENSION_PLATFORMS = [
  {
    id: 'instagram',
    label: 'Instagram',
    color: '#E1306C',
    iconBg: 'linear-gradient(135deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
    iconBorder: 'none',
    descriptor: 'Casual · Emojis · Hashtags',
    rule: 'Max 2,200 characters',
    tone: 'Casual · Emojis · Hashtags',
    limit: 2200,
    icon: (
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
        <rect x="6" y="6" width="20" height="20" rx="6" stroke="#fff" strokeWidth="2" />
        <circle cx="16" cy="16" r="5" stroke="#fff" strokeWidth="2" />
        <circle cx="22.5" cy="9.5" r="1.5" fill="#fff" />
      </svg>
    ),
    activeAt: 20,
    tl: [28, 95, 110] as [number, number, number],
    attempt: '🚀 Big news! We just launched our AI feature — honestly it\'s a total game-changer for your content team. You\'ll never go back! 🙌 #AI #ContentCreation #GameChanger',
    hint: 'Too casual?',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    color: '#0A66C2',
    iconBg: '#0A66C2',
    iconBorder: 'none',
    descriptor: 'Professional · Formal · Long-form',
    rule: 'Up to 3,000 characters',
    tone: 'Professional · Formal · Long-form',
    limit: 3000,
    icon: (
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
        <rect x="6" y="13" width="4" height="13" fill="#fff" />
        <circle cx="8" cy="9" r="2.5" fill="#fff" />
        <path d="M14 13h4v2.5C18.8 14 20 13 22 13c3 0 4 2 4 5v8h-4v-7c0-1.5-.5-2.5-2-2.5s-2 1-2 2.5v7h-4V13z" fill="#fff" />
      </svg>
    ),
    activeAt: 120,
    tl: [128, 198, 212] as [number, number, number],
    attempt: 'We are pleased to announce the launch of our most powerful AI feature to date. After months of development, LayerProof now enables teams to publish across every platform instantly.',
    hint: 'Too stiff?',
  },
  {
    id: 'twitter',
    label: 'Twitter / X',
    color: '#FFFFFF',
    iconBg: '#000000',
    iconBorder: '1.5px solid rgba(255,255,255,0.18)',
    descriptor: 'Punchy · Hook first',
    rule: 'Max 280 characters',
    tone: 'Punchy · Hook first · ≤280 chars',
    limit: 280,
    icon: (
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
        <path d="M6 6L13.5 16.2L6 26H8.5L14.6 17.6L20 26H27L19.1 15.4L26 6H23.5L18 14L13 6H6Z" fill="#fff" />
      </svg>
    ),
    activeAt: 222,
    tl: [230, 260, 270] as [number, number, number],
    attempt: '⚡️ Just shipped something huge. AI content gen that understands your brand voice — and reformats it for every platform automatically.',
    hint: 'Too generic?',
  },
];

// ─── Cycling Editor Component ──────────────────────────────────────────────────

export const CyclingEditor: React.FC<{ frame: number }> = ({ frame }) => {
  const theme = useTheme();
  const phaseIndex =
    frame < TENSION_PLATFORMS[1].activeAt ? 0 : frame < TENSION_PLATFORMS[2].activeAt ? 1 : 2;
  const phase = TENSION_PLATFORMS[phaseIndex];
  const [ts, te, de] = phase.tl;

  const text = getTypedText(frame, phase.tl, phase.attempt);
  const count = countChars(text);
  const isTyping = frame >= ts && frame < te;
  const isDeleting = frame >= te && frame < de;
  const isEmpty = frame < ts || frame >= de;
  const cursorOn = (isTyping || isEmpty) && frame % 20 < 10;
  const nearLimit = phase.limit === 280 && count > 200;

  const age = frame - phase.activeAt;
  const contentReveal = interpolate(age, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const tabPulse = interpolate(Math.min(age, 14), [0, 5, 14], [0.9, 1.05, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const deleteProgress = isDeleting
    ? interpolate(frame - te, [0, 6], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  const nextActiveAt =
    phaseIndex < TENSION_PLATFORMS.length - 1
      ? TENSION_PLATFORMS[phaseIndex + 1].activeAt
      : 280;
  const isLastPhase = phaseIndex === TENSION_PLATFORMS.length - 1;
  let hintOpacity: number;
  if (isLastPhase) {
    hintOpacity = interpolate(frame, [de - 14, de - 6], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  } else {
    const fadeOutStart = Math.max(de + 4, nextActiveAt - 6);
    hintOpacity = interpolate(
      frame,
      [de - 14, de - 6, fadeOutStart, nextActiveAt],
      [0, 1, 1, 0],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      },
    );
  }

  const borderColor = isDeleting
    ? `rgba(229,57,53,${0.25 + deleteProgress * 0.5})`
    : 'rgba(255,255,255,0.09)';

  return (
    <div
      style={{
        width: 960,
        background: '#141416',
        borderRadius: 18,
        border: `1.5px solid ${borderColor}`,
        boxShadow: isDeleting
          ? `0 2px 16px rgba(229,57,53,${deleteProgress * 0.15}), 0 20px 60px rgba(0,0,0,0.7)`
          : '0 2px 8px rgba(0,0,0,0.3), 0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.02)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Window chrome dots */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '14px 18px 0' }}>
        {['#FF5F57', '#FFBD2E', '#27C93F'].map((c) => (
          <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c, opacity: 0.85 }} />
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
        {TENSION_PLATFORMS.map((p, i) => {
          const isActive = i === phaseIndex;
          const isDone = i < phaseIndex;
          return (
            <div
              key={p.id}
              style={{
                padding: '20px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                borderBottom: isActive ? `2.5px solid ${p.color}` : '2.5px solid transparent',
                background: isActive ? `${p.color}12` : 'transparent',
                borderRadius: '6px 6px 0 0',
                transform: `scale(${isActive ? tabPulse : 1})`,
                transformOrigin: 'bottom center',
              }}
            >
              <div
                style={{
                  width: 30, height: 30, borderRadius: 7,
                  background: p.iconBg, border: p.iconBorder,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <div style={{ transform: 'scale(0.72)', transformOrigin: 'center' }}>{p.icon}</div>
              </div>
              <span
                style={{
                  fontFamily: theme.font.family, fontSize: 22,
                  fontWeight: isActive ? theme.font.weightMedium : theme.font.weightLight,
                  color: isActive ? p.color : isDone ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.38)',
                }}
              >
                {p.label}
              </span>
              {isDone && (
                <span style={{ fontSize: 13, color: '#e53935', fontFamily: theme.font.family }}>✗</span>
              )}
            </div>
          );
        })}
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex', alignItems: 'center', paddingBottom: 4,
            opacity: interpolate(age, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        >
          <span style={{ fontFamily: theme.font.family, fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
            Draft #{phaseIndex + 1}
          </span>
        </div>
      </div>

      {/* Tone pill */}
      <div
        style={{
          padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 12,
          opacity: contentReveal,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <span style={{ fontFamily: theme.font.family, fontSize: 22, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
          Tone:
        </span>
        <span style={{ fontFamily: theme.font.family, fontSize: 28, color: phase.color, fontWeight: theme.font.weightMedium, letterSpacing: 0.2 }}>
          {phase.tone}
        </span>
      </div>

      {/* Text area */}
      <div style={{ padding: '36px 36px 90px', minHeight: 420, position: 'relative', opacity: contentReveal }}>
        <span style={{ fontFamily: theme.font.family, fontSize: 28, fontWeight: theme.font.weightLight, color: '#FFFFFF', lineHeight: 1.8 }}>
          {text}
        </span>
        <span
          style={{
            display: 'inline-block', width: 2, height: 28,
            background: phase.color, marginLeft: 2,
            opacity: cursorOn ? 0.9 : 0,
            verticalAlign: 'middle', borderRadius: 1,
          }}
        />
        {isEmpty && frame >= de && (
          <div style={{ position: 'absolute', inset: '28px 28px' }}>
            <span style={{ fontFamily: theme.font.family, fontSize: 28, fontStyle: 'italic', color: 'rgba(255,255,255,0.16)' }}>
              Start over...
            </span>
          </div>
        )}
        {/* Hint */}
        <div
          style={{
            position: 'absolute', bottom: 14, right: 18,
            opacity: hintOpacity,
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'rgba(229,57,53,0.09)',
            border: '1px solid rgba(229,57,53,0.22)',
            borderRadius: 24, padding: '8px 18px',
          }}
        >
          <span style={{ fontSize: 32 }}>💭</span>
          <span style={{ fontFamily: theme.font.family, fontSize: 32, color: '#ef5350', fontWeight: theme.font.weightMedium }}>
            {phase.hint}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '10px 20px', borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}
      >
        {nearLimit ? (
          <span style={{ fontFamily: theme.font.family, fontSize: 12, color: '#e53935', fontWeight: theme.font.weightBold }}>
            ⚠️ Almost at limit
          </span>
        ) : (
          <span />
        )}
        <span style={{ fontFamily: theme.font.family, fontSize: 14, color: nearLimit ? '#e53935' : 'rgba(255,255,255,0.25)' }}>
          {count} / {phase.limit.toLocaleString()}
        </span>
      </div>
    </div>
  );
};
