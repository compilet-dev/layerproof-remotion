import React from 'react';
import { interpolate, staticFile } from 'remotion';
import { useTheme } from '../../../lib/theme';
import LogoAvatar from './shared/LogoAvatar';
import ContentLines from './shared/ContentLines';
import { PostImage } from './shared/PostImage';

export const FacebookMockup: React.FC<{ charsToShow: number; frame: number }> = ({ charsToShow }) => {
  const theme = useTheme();
  const postLines = [
    '🚀 Big news from LayerProof! We just shipped the feature',
    'our community has been asking for.',
    '',
    'One prompt → perfectly-tailored posts for every platform.',
    'Automatically. Instantly.',
  ];
  const likes = Math.floor(interpolate(charsToShow, [0, 200], [0, 847], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const comments = Math.floor(interpolate(charsToShow, [0, 200], [0, 64], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const shares = Math.floor(interpolate(charsToShow, [0, 200], [0, 112], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

  return (
    <div style={{ width: '100%', background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: theme.font.family }}>
      {/* ── FB top bar ── */}
      <div style={{ background: '#1877F2', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <span style={{ color: '#fff', fontSize: 20, fontWeight: 900, letterSpacing: -0.5 }}>f</span>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '4px 10px' }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Search Facebook</span>
        </div>
      </div>

      {/* ── Post header ── */}
      <div style={{ padding: '12px 14px 8px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <LogoAvatar size={40} borderColor="#1877F2" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#050505' }}>LayerProof</div>
          <div style={{ fontSize: 11, color: '#65676b', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>Sponsored</span>
            <span>·</span>
            <span>🌐</span>
          </div>
        </div>
        <span style={{ fontSize: 18, color: '#65676b' }}>···</span>
      </div>

      {/* ── Post text ── */}
      <div style={{ padding: '0 14px 10px', flexShrink: 0 }}>
        <ContentLines lines={postLines} charsToShow={charsToShow} fontSize={13} color="#050505" lineHeight={1.5} />
      </div>

      {/* ── 1.91:1 Image ── */}
      <div style={{ flexShrink: 0 }}>
        <PostImage ratio="1.91 / 1" src={staticFile('social-posts/post_facebook.jpg')} platformColor="#1877F2" />
      </div>

      {/* ── Reaction bar ── */}
      <div style={{ padding: '6px 14px', borderTop: '1px solid #e4e6eb', display: 'flex', gap: 2, flexShrink: 0 }}>
        {[
          { label: '👍 Like', color: '#1877F2' },
          { label: '💬 Comment', color: '#65676b' },
          { label: '↗ Share', color: '#65676b' },
        ].map(({ label, color }) => (
          <div key={label} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '6px 0', borderRadius: 6, fontSize: 12, fontWeight: 600, color }}>
            {label}
          </div>
        ))}
      </div>

      {/* ── Counts ── */}
      <div style={{ padding: '4px 14px 10px', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: '#65676b' }}>👍❤️ {likes.toLocaleString()}</span>
        <span style={{ fontSize: 11, color: '#65676b' }}>{comments} comments · {shares} shares</span>
      </div>
    </div>
  );
};
