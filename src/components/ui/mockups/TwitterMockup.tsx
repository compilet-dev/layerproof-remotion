import React from 'react';
import { interpolate, staticFile } from 'remotion';
import { useTheme } from '../../../lib/theme';
import LogoAvatar from './shared/LogoAvatar';
import ContentLines from './shared/ContentLines';
import { PostImage } from './shared/PostImage';

export const TwitterMockup: React.FC<{
  charsToShow: number;
  frame: number;
}> = ({ charsToShow, frame }) => {
  const theme = useTheme();
  const tweetLines = [
    '⚡️ Just shipped: AI-powered content generation',
    'that actually understands your brand voice.',
    '',
    'Write once → publish everywhere. Thread incoming 🧵',
  ];
  const replies = Math.floor(interpolate(charsToShow, [0, 200], [0, 47], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const retweets = Math.floor(interpolate(charsToShow, [0, 200], [0, 183], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const likes = Math.floor(interpolate(charsToShow, [0, 200], [0, 1204], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

  return (
    <div
      style={{
        width: '100%',
        background: '#fff',
        borderRadius: 14,
        border: '1px solid #eff3f4',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: theme.font.family,
      }}
    >
      {/* ── Tweet header ── */}
      <div style={{ padding: '14px 16px 8px', display: 'flex', gap: 10 }}>
        <LogoAvatar size={40} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#0f1419' }}>LayerProof</span>
            <svg width="16" height="16" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="7.5" fill="#1DA1F2" />
              <path d="M5 8L7 10L11 6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 13, color: '#71767b' }}>@layerproof · 2h</span>
            <div style={{ marginLeft: 'auto', color: '#71767b', fontSize: 16 }}>···</div>
          </div>
          <div style={{ marginTop: 4 }}>
            <ContentLines lines={tweetLines} charsToShow={charsToShow} fontSize={15} color="#0f1419" lineHeight={1.5} />
          </div>
        </div>
      </div>

      {/* ── 16:9 Image ── */}
      <div style={{ padding: '0 16px 10px' }}>
        <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #eff3f4' }}>
          <PostImage ratio="16 / 9" src={staticFile('social-posts/post_twitter.jpg')} platformColor="#1DA1F2" />
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div style={{ padding: '6px 16px', borderTop: '1px solid #eff3f4', display: 'flex', gap: 18 }}>
        {[
          { icon: '💬', val: replies },
          { icon: '🔁', val: retweets },
          { icon: '♡', val: likes },
          { icon: '📊', val: '14.2K' },
        ].map(({ icon, val }) => (
          <div key={icon} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#71767b', fontSize: 13 }}>
            <span>{icon}</span>
            <span>{typeof val === 'number' ? val.toLocaleString() : val}</span>
          </div>
        ))}
        <div style={{ marginLeft: 'auto' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13 7H3M9 3L13 7L9 11" stroke="#71767b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};
