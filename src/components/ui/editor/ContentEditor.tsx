import React from 'react';
import { useTheme } from '../../../lib/theme';

const BODY_TEXT = `We're thrilled to announce the launch of our most powerful AI feature yet. This isn't just another tool — it's a complete rethinking of how teams create and distribute content.

With a single prompt, LayerProof now generates perfectly-tailored posts for every platform simultaneously.`;

const KEY_POINTS = [
  'AI adapts tone and format for each platform',
  'Generate 4 platform versions in under 3 seconds',
  'One-click scheduling to publish everywhere',
];

export const ContentEditor: React.FC<{
  contentChars?: number;
  frame?: number;
}> = ({ contentChars, frame = 0 }) => {
  const theme = useTheme();
  const displayBody = contentChars !== undefined ? BODY_TEXT.slice(0, contentChars) : BODY_TEXT;
  const showCursor = contentChars !== undefined && contentChars < BODY_TEXT.length;

  return (
    <div
      style={{
        width: 300, height: '100%',
        background: '#FFFFFF',
        borderLeft: '1px solid rgba(0,0,0,0.07)',
        display: 'flex', flexDirection: 'column',
        flexShrink: 0, overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '0 18px', height: 46,
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <span style={{ fontFamily: theme.font.family, fontSize: 11, fontWeight: theme.font.weightBold, color: '#aaa', letterSpacing: 1.5, textTransform: 'uppercase' }}>
          Content
        </span>
        <div
          style={{
            padding: '3px 9px', borderRadius: 5,
            background: 'rgba(10,102,194,0.08)',
            fontFamily: theme.font.family, fontSize: 11,
            color: '#0A66C2', fontWeight: theme.font.weightMedium,
          }}
        >
          AI Draft
        </div>
      </div>

      {/* Scrollable content */}
      <div
        style={{
          flex: 1, overflowY: 'hidden',
          padding: '16px 18px',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}
      >
        {/* Post title */}
        <div>
          <div style={{ fontFamily: theme.font.family, fontSize: 10, color: '#bbb', fontWeight: theme.font.weightMedium, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 5 }}>
            Post Title
          </div>
          <div style={{ fontFamily: theme.font.family, fontSize: 14, fontWeight: theme.font.weightBold, color: '#1a1a1a', lineHeight: 1.4 }}>
            AI Feature Launch Announcement
          </div>
        </div>

        {/* Body text */}
        <div>
          <div style={{ fontFamily: theme.font.family, fontSize: 10, color: '#bbb', fontWeight: theme.font.weightMedium, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 5 }}>
            Body
          </div>
          <div
            style={{
              fontFamily: theme.font.family, fontSize: 12,
              color: '#444', lineHeight: 1.7,
              fontWeight: theme.font.weightLight,
            }}
          >
            {displayBody}
            {showCursor && (
              <span
                style={{
                  display: 'inline-block', width: 1.5, height: 13,
                  background: '#0A66C2', marginLeft: 1,
                  opacity: frame % 16 < 8 ? 0.9 : 0,
                  verticalAlign: 'middle',
                }}
              />
            )}
          </div>
        </div>

        {/* Key Points */}
        {(contentChars === undefined || contentChars > 80) && (
          <div>
            <div style={{ fontFamily: theme.font.family, fontSize: 10, color: '#bbb', fontWeight: theme.font.weightMedium, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
              Key Points
            </div>
            {KEY_POINTS.map((point, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8,
                  opacity: contentChars !== undefined ? Math.min(1, Math.max(0, (contentChars - 80 - i * 40) / 30)) : 1,
                }}
              >
                <div
                  style={{
                    width: 16, height: 16, borderRadius: 4,
                    background: 'rgba(0,0,0,0.04)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: 1,
                  }}
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4L3.5 6L6.5 2" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ fontFamily: theme.font.family, fontSize: 11, color: '#555', lineHeight: 1.5, fontWeight: theme.font.weightLight }}>
                  {point}
                </span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, opacity: 0.45, cursor: 'pointer' }}>
              <div
                style={{
                  width: 16, height: 16, borderRadius: 4,
                  border: '1px dashed rgba(0,0,0,0.22)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, color: '#888', flexShrink: 0,
                }}
              >
                +
              </div>
              <span style={{ fontFamily: theme.font.family, fontSize: 11, color: '#888' }}>Add key point</span>
            </div>
          </div>
        )}
      </div>

      {/* Publish bar */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: 8, flexShrink: 0 }}>
        <div
          style={{
            flex: 1, padding: '8px 0', borderRadius: 8,
            background: 'rgba(0,0,0,0.05)',
            fontFamily: theme.font.family, fontSize: 12, color: '#666',
            fontWeight: theme.font.weightMedium, textAlign: 'center',
          }}
        >
          Schedule
        </div>
        <div
          style={{
            flex: 1, padding: '8px 0', borderRadius: 8,
            background: '#1a1a1a',
            fontFamily: theme.font.family, fontSize: 12, color: '#fff',
            fontWeight: theme.font.weightBold, textAlign: 'center',
          }}
        >
          Publish All
        </div>
      </div>
    </div>
  );
};
