import React from 'react';

const LogoAvatar: React.FC<{ size?: number; borderColor?: string }> = ({
  size = 36,
  borderColor,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: '#fff',
      border: borderColor ? `2px solid ${borderColor}` : '1.5px solid rgba(0,0,0,0.10)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      flexShrink: 0,
    }}
  >
    <img
      src={require('../../../../assets/logo_black_symbol.png')}
      style={{ width: '65%', height: '65%', objectFit: 'contain' }}
    />
  </div>
);

export default LogoAvatar;
