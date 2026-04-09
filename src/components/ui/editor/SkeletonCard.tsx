import React from 'react';

export const SkeletonCard: React.FC<{ opacity?: number }> = ({ opacity = 0.3 }) => (
  <div
    style={{
      width: '100%',
      borderRadius: 12,
      background: '#FFFFFF',
      overflow: 'hidden',
      opacity,
      boxShadow: '0 1px 6px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
    }}
  >
    <div style={{ width: '100%', paddingTop: '52%', background: 'linear-gradient(135deg, #e8e8ea 0%, #d8d8dc 100%)', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)' }} />
    </div>
    <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ height: 10, borderRadius: 5, background: '#e0e0e3', width: '75%' }} />
      <div style={{ height: 8,  borderRadius: 5, background: '#e8e8eb', width: '90%' }} />
      <div style={{ height: 8,  borderRadius: 5, background: '#e8e8eb', width: '60%' }} />
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <div style={{ height: 7, borderRadius: 4, background: '#eee', width: 40 }} />
        <div style={{ height: 7, borderRadius: 4, background: '#eee', width: 40 }} />
        <div style={{ height: 7, borderRadius: 4, background: '#eee', width: 40 }} />
      </div>
    </div>
  </div>
);
