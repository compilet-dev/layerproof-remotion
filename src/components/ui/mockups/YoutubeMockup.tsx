import React from 'react';
import { interpolate } from 'remotion';
import { useTheme } from '../../../lib/theme';
import LogoAvatar from './shared/LogoAvatar';
import { PostImage } from './shared/PostImage';

export const YoutubeMockup: React.FC<{ charsToShow: number; frame: number }> = ({ charsToShow }) => {
  const theme = useTheme();
  const views = Math.floor(interpolate(charsToShow, [0, 200], [0, 284000], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const formatViews = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(0)}K views` : `${n} views`;

  return (
    <div style={{ width: '100%', background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: theme.font.family }}>
      {/* ── YT top bar ── */}
      <div style={{ background: '#fff', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
        <svg width="22" height="16" viewBox="0 0 22 16">
          <rect width="22" height="16" rx="4" fill="#FF0000" />
          <polygon points="9,4 9,12 16,8" fill="white" />
        </svg>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#030303', letterSpacing: -0.3 }}>YouTube</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: '#606060' }}>🔍</span>
      </div>

      {/* ── 16:9 thumbnail ── */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <PostImage ratio="16 / 9" src={require('../../../assets/post_youtube.jpg')} platformColor="#FF0000" />
        <div style={{ position: 'absolute', bottom: 6, right: 6, background: 'rgba(0,0,0,0.82)', borderRadius: 3, padding: '2px 5px' }}>
          <span style={{ fontSize: 10, color: '#fff', fontWeight: 700 }}>3:47</span>
        </div>
      </div>

      {/* ── Video info ── */}
      <div style={{ padding: '10px 12px', display: 'flex', gap: 10, flex: 1 }}>
        <LogoAvatar size={36} />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#030303', lineHeight: 1.35, marginBottom: 4 }}>
            {`How We Ship AI Content in Under 30 Seconds`.slice(0, charsToShow)}
          </div>
          <div style={{ fontSize: 11, color: '#606060' }}>LayerProof</div>
          <div style={{ fontSize: 11, color: '#606060' }}>{formatViews(views)} · 2 days ago</div>
        </div>
        <span style={{ fontSize: 16, color: '#606060', flexShrink: 0 }}>⋮</span>
      </div>
    </div>
  );
};
