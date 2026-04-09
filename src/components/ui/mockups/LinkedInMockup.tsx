import React from 'react';
import { interpolate } from 'remotion';
import { useTheme } from '../../../lib/theme';
import LogoAvatar from './shared/LogoAvatar';
import ContentLines from './shared/ContentLines';
import { PostImage } from './shared/PostImage';

export const LinkedInMockup: React.FC<{
  charsToShow: number;
  frame: number;
}> = ({ charsToShow, frame }) => {
  const theme = useTheme();
  const postLines = [
    "We're excited to announce the launch of our most powerful AI feature yet.",
    '',
    'After months of development, our team built a content generation system that',
    'understands context, tone, and platform nuances — giving you polished drafts in',
    'seconds, not hours. Teams are saving 8+ hours per week.',
  ];
  const reactions = Math.floor(
    interpolate(charsToShow, [0, 300], [0, 847], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

  return (
    <div
      style={{
        width: '100%',
        background: '#fff',
        borderRadius: 10,
        border: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: theme.font.family,
      }}
    >
      {/* ── Author row ── */}
      <div style={{ padding: '14px 16px 10px', display: 'flex', gap: 10 }}>
        <LogoAvatar size={46} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#000', lineHeight: 1.3 }}>LayerProof</div>
          <div style={{ fontSize: 12, color: '#666', lineHeight: 1.4 }}>AI Content Platform · 8,204 followers</div>
          <div style={{ fontSize: 11, color: '#666', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <span>Just now</span>
            <span>·</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="#666" strokeWidth="1.1" />
              <ellipse cx="6" cy="6" rx="2.5" ry="5" stroke="#666" strokeWidth="0.9" />
              <path d="M1 4.5h10M1 7.5h10" stroke="#666" strokeWidth="0.9" />
            </svg>
          </div>
        </div>
        <div style={{ color: '#0A66C2', fontSize: 13, fontWeight: 600, border: '1.5px solid #0A66C2', padding: '4px 14px', borderRadius: 20, height: 'fit-content', flexShrink: 0 }}>
          + Follow
        </div>
      </div>

      {/* ── Post text ── */}
      <div style={{ padding: '0 16px 12px' }}>
        <ContentLines lines={postLines} charsToShow={charsToShow} fontSize={13} color="#333" lineHeight={1.55} />
      </div>

      {/* ── 1.91:1 Image ── */}
      <PostImage ratio="1.91 / 1" src={require('../../../assets/post_linkedin.jpg')} platformColor="#0A66C2" />

      {/* ── Reactions ── */}
      <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 4, borderBottom: '1px solid #e0e0e0' }}>
        <div style={{ display: 'flex', gap: -4 }}>
          {['👍', '❤️', '💡'].map((r, i) => (
            <span key={i} style={{ fontSize: 14, marginLeft: i > 0 ? -6 : 0 }}>{r}</span>
          ))}
        </div>
        <span style={{ color: '#666', fontSize: 12, marginLeft: 6 }}>{reactions.toLocaleString()} reactions</span>
        <span style={{ marginLeft: 'auto', color: '#666', fontSize: 12 }}>47 comments · 12 reposts</span>
      </div>

      {/* ── Action buttons ── */}
      <div style={{ display: 'flex' }}>
        {[
          { icon: '👍', label: 'Like' },
          { icon: '💬', label: 'Comment' },
          { icon: '♺', label: 'Repost' },
          { icon: '✉', label: 'Send' },
        ].map(({ icon, label }) => (
          <div key={label} style={{ flex: 1, padding: '10px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, color: '#666', fontSize: 12, fontFamily: theme.font.family }}>
            <span style={{ fontSize: 14 }}>{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
