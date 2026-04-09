import React from 'react';

export const FloatingActions: React.FC = () => (
  <div
    style={{
      position: 'absolute', right: 10, top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex', flexDirection: 'column', gap: 8,
      zIndex: 5,
    }}
  >
    {['↺', '✎', '⊡', '⤴'].map((icon, i) => (
      <div
        key={i}
        style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'rgba(255,255,255,0.9)',
          border: '1px solid rgba(0,0,0,0.09)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, color: '#555', cursor: 'pointer',
        }}
      >
        {icon}
      </div>
    ))}
  </div>
);
