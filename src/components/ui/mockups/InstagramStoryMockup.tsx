import React from 'react';
import { useTheme } from '../../../lib/theme';
import LogoAvatar from './shared/LogoAvatar';
import { PostImage } from './shared/PostImage';

export const InstagramStoryMockup: React.FC<{
  charsToShow: number;
  frame: number;
}> = ({ charsToShow, frame }) => {
  const theme = useTheme();
  const cursorVisible = frame % 20 < 10;

  return (
    <div
      style={{
        width: '100%',
        aspectRatio: '9 / 16',
        background: '#000',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: theme.font.family,
      }}
    >
      {/* ── 9:16 full-bleed image ── */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <PostImage
          ratio="9 / 16"
          src={require('../../../assets/post_story.jpg')}
          platformColor="#E1306C"
          style={{ aspectRatio: 'unset', width: '100%', height: '100%' }}
        />
      </div>

      {/* ── Dark gradient overlays ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 30%, transparent 65%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* ── Progress bars ── */}
      <div style={{ position: 'absolute', top: 10, left: 10, right: 10, display: 'flex', gap: 4 }}>
        {[1, 0.35, 0, 0].map((fill, i) => (
          <div key={i} style={{ flex: 1, height: 2.5, background: 'rgba(255,255,255,0.35)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${fill * 100}%`, background: '#fff', borderRadius: 2 }} />
          </div>
        ))}
      </div>

      {/* ── Header: avatar + name + time + ✕ ── */}
      <div style={{ position: 'absolute', top: 22, left: 10, right: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
        <LogoAvatar size={32} borderColor="#fff" />
        <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>layerproof</span>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>2h</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 14 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="4" r="1.2" fill="rgba(255,255,255,0.8)" />
            <circle cx="8" cy="8" r="1.2" fill="rgba(255,255,255,0.8)" />
            <circle cx="8" cy="12" r="1.2" fill="rgba(255,255,255,0.8)" />
          </svg>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12.5 3.5L3.5 12.5M3.5 3.5L12.5 12.5" stroke="rgba(255,255,255,0.8)" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* ── Caption overlay at bottom ── */}
      <div style={{ position: 'absolute', bottom: 70, left: 14, right: 14 }}>
        <div style={{ fontSize: 15, color: '#fff', fontWeight: 500, textShadow: '0 1px 4px rgba(0,0,0,0.6)', lineHeight: 1.4 }}>
          {`AI-powered content — write once,\npublish everywhere.`.slice(0, charsToShow)}
          {charsToShow < 48 && (
            <span
              style={{
                display: 'inline-block',
                width: 2,
                height: 16,
                background: '#fff',
                marginLeft: 2,
                opacity: cursorVisible ? 0.9 : 0,
                verticalAlign: 'middle',
              }}
            />
          )}
        </div>
      </div>

      {/* ── Bottom: Like/Share + Send message ── */}
      <div style={{ position: 'absolute', bottom: 16, left: 14, right: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.15)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.35)', padding: '8px 14px', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
          Send message
        </div>
        <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
          <path d="M11 18.5C11 18.5 2 12.5 2 6.5C2 3.74 4.24 1.5 7 1.5C8.62 1.5 10.06 2.26 11 3.46C11.94 2.26 13.38 1.5 15 1.5C17.76 1.5 20 3.74 20 6.5C20 12.5 11 18.5 11 18.5Z" stroke="rgba(255,255,255,0.9)" strokeWidth="1.4" fill="none" />
        </svg>
        <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
          <path d="M21 10L1 1L7 10L1 19L21 10Z" stroke="rgba(255,255,255,0.9)" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
    </div>
  );
};
