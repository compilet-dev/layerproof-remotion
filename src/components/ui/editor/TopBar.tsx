import React from 'react';
import { useTheme } from '../../../lib/theme';

export const TopBar: React.FC = () => {
  const theme = useTheme();
  return (
  <div
    style={{
      height: 48,
      background: '#FFFFFF',
      borderBottom: '1px solid rgba(0,0,0,0.07)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: 16,
      flexShrink: 0,
      zIndex: 10,
    }}
  >
    {/* Back */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
      <span style={{ fontSize: 14, color: '#888' }}>←</span>
      <span style={{ fontFamily: theme.font.family, fontSize: 12, color: '#888' }}>Back</span>
    </div>
    <div style={{ width: 1, height: 20, background: 'rgba(0,0,0,0.10)' }} />

    {/* Title */}
    <div>
      <div style={{ fontFamily: theme.font.family, fontSize: 13, fontWeight: theme.font.weightBold, color: '#1a1a1a', lineHeight: 1.2 }}>
        AI Feature Launch Campaign
      </div>
      <div style={{ fontFamily: theme.font.family, fontSize: 11, color: '#999', marginTop: 1 }}>
        4 posts
      </div>
    </div>

    <div style={{ flex: 1 }} />

    {/* Right buttons */}
    {[
      { label: 'Theme', icon: '⊞' },
      { label: 'Tone',  icon: '≡' },
    ].map((btn) => (
      <div
        key={btn.label}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 12px', borderRadius: 6,
          border: '1px solid rgba(0,0,0,0.10)',
          fontFamily: theme.font.family, fontSize: 12,
          color: '#444', cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: 13 }}>{btn.icon}</span>
        {btn.label}
      </div>
    ))}

    <div
      style={{
        padding: '5px 14px', borderRadius: 6,
        background: '#0A66C2',
        fontFamily: theme.font.family, fontSize: 12,
        fontWeight: theme.font.weightBold, color: '#fff',
        cursor: 'pointer',
      }}
    >
      ⬆ Upgrade
    </div>

    {/* Char count */}
    <div style={{ fontFamily: theme.font.family, fontSize: 12, color: '#999' }}>
      <span style={{ color: '#1a1a1a', fontWeight: theme.font.weightMedium }}>590</span> / 610
    </div>

    {/* Avatar */}
    <div
      style={{
        width: 30, height: 30, borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, color: '#fff', fontFamily: theme.font.family,
        fontWeight: theme.font.weightBold, flexShrink: 0,
      }}
    >
      TH
    </div>
  </div>
  );
};
