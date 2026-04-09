import React from 'react';
import { interpolate } from 'remotion';
import { useTheme } from '../../../lib/theme';

export const TikTokMockup: React.FC<{ charsToShow: number; frame: number }> = ({ charsToShow }) => {
  const theme = useTheme();
  const hearts = Math.floor(interpolate(charsToShow, [0, 200], [0, 24800], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const comments = Math.floor(interpolate(charsToShow, [0, 200], [0, 1340], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

  const formatK = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`;

  return (
    <div style={{ width: '100%', aspectRatio: '9 / 16', background: '#010101', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: theme.font.family, position: 'relative' }}>
      {/* ── Full-bleed video ── */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <img src={require('../../../assets/post_tiktok.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 50%)' }} />
      </div>

      {/* ── Top bar ── */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', padding: '12px 14px', zIndex: 2 }}>
        <span style={{ color: '#fff', fontSize: 14 }}>Following</span>
        <span style={{ flex: 1, textAlign: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>For You</span>
        <span style={{ color: '#fff', fontSize: 18 }}>⊕</span>
      </div>

      {/* ── Right action column ── */}
      <div style={{ position: 'absolute', right: 10, bottom: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, zIndex: 2 }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid #fff', overflow: 'hidden' }}>
          <img src={require('../../../assets/post_image.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        {[
          { icon: '♥', val: formatK(hearts), color: '#FE2C55' },
          { icon: '💬', val: formatK(comments), color: '#fff' },
          { icon: '↗', val: 'Share', color: '#fff' },
        ].map(({ icon, val, color }) => (
          <div key={icon} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <span style={{ fontSize: 22, color }}>{icon}</span>
            <span style={{ fontSize: 10, color: '#fff', fontWeight: 600 }}>{val}</span>
          </div>
        ))}
      </div>

      {/* ── Bottom caption ── */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 50, padding: '0 12px 18px', zIndex: 2 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>@layerproof</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', lineHeight: 1.4 }}>
          {`Write once. Publish everywhere ✨ #AI #ContentCreator #LayerProof`.slice(0, charsToShow)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>♪ Original sound · LayerProof</span>
        </div>
      </div>
    </div>
  );
};
