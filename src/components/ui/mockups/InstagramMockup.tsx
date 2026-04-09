import React from 'react';
import { interpolate } from 'remotion';
import { useTheme } from '../../../lib/theme';
import Avatar from './shared/Avatar';
import LogoAvatar from './shared/LogoAvatar';
import ContentLines from './shared/ContentLines';

export const InstagramMockup: React.FC<{
  charsToShow: number;
  frame: number;
}> = ({ charsToShow, frame }) => {
  const theme = useTheme();
  const caption = [
    '🚀 Big news! Our AI feature is live.',
    '',
    'No more starting from scratch. Describe what you need,',
    'and let AI handle the rest across every platform.',
    '',
    '#AI #ProductLaunch #ContentCreation #SaaS',
  ];
  const likes = Math.floor(
    interpolate(charsToShow, [0, 200], [0, 2847], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

  return (
    <div
      style={{
        width: '100%',
        background: '#ffffff',
        borderRadius: 12,
        border: '1px solid #dbdbdb',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: theme.font.family,
      }}
    >
      {/* ── Header ── */}
      <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div
            style={{
              position: 'absolute',
              inset: -2,
              borderRadius: '50%',
              background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
              padding: 2,
            }}
          >
            <div style={{ background: '#fff', borderRadius: '50%', padding: 2 }}>
              <LogoAvatar size={30} />
            </div>
          </div>
          <div style={{ width: 34, height: 34 }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#000', fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>
            layerproof
          </div>
          <div style={{ color: '#8e8e8e', fontSize: 11 }}>Sponsored</div>
        </div>
        <div style={{ color: '#262626', fontSize: 20, letterSpacing: 2, cursor: 'pointer' }}>
          ···
        </div>
      </div>

      {/* ── 1:1 Image ── */}
      <img
        src={require('../../../assets/post_instagram.jpg')}
        style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover' }}
      />

      {/* ── Action bar ── */}
      <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <svg width="24" height="22" viewBox="0 0 24 22" fill="none">
          <path d="M12 20.5C12 20.5 2 14 2 7.5C2 4.42 4.42 2 7.5 2C9.24 2 10.91 2.81 12 4.08C13.09 2.81 14.76 2 16.5 2C19.58 2 22 4.42 22 7.5C22 14 12 20.5 12 20.5Z" stroke="#262626" strokeWidth="1.5" fill="none" />
        </svg>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 2C6.03 2 2 5.58 2 10C2 12.05 2.86 13.92 4.27 15.35L3 20L7.9 18.36C8.88 18.77 9.92 19 11 19C15.97 19 20 15.42 20 11C20 6.58 15.97 2 11 2Z" stroke="#262626" strokeWidth="1.5" fill="none" />
        </svg>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M22 11L2 2L7 11L2 20L22 11Z" stroke="#262626" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
        </svg>
        <div style={{ marginLeft: 'auto' }}>
          <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
            <path d="M17 2H3C2.45 2 2 2.45 2 3V20L10 17L18 20V3C18 2.45 17.55 2 17 2Z" stroke="#262626" strokeWidth="1.4" fill="none" />
          </svg>
        </div>
      </div>

      {/* ── Likes ── */}
      <div style={{ padding: '0 14px 6px', fontSize: 13, fontWeight: 600, color: '#000' }}>
        {likes.toLocaleString()} likes
      </div>

      {/* ── Caption ── */}
      <div style={{ padding: '0 14px 10px', flex: 1, overflow: 'hidden' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#000', marginRight: 6 }}>
          layerproof
        </span>
        <ContentLines lines={caption} charsToShow={charsToShow} fontSize={13} color="#262626" />
      </div>

      {/* ── Comments ── */}
      <div style={{ padding: '0 14px 10px' }}>
        <div style={{ fontSize: 12, color: '#8e8e8e' }}>View all 24 comments</div>
        <div style={{ fontSize: 11, color: '#c7c7c7', marginTop: 4 }}>2 HOURS AGO</div>
      </div>

      {/* ── Comment input ── */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid #efefef', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar initials="U" color="#ccc" size={24} />
        <div style={{ flex: 1, fontSize: 13, color: '#8e8e8e' }}>Add a comment…</div>
      </div>
    </div>
  );
};
