import React from 'react';

const CursorSVG: React.FC<{ scale?: number; pressed?: boolean; tiltDeg?: number }> = ({
  scale   = 1,
  pressed = false,
  tiltDeg = 0,
}) => (
  <svg
    width={32 * scale}
    height={36 * scale}
    viewBox="0 0 32 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      transform:       `rotate(${tiltDeg}deg)`,
      transformOrigin: '5px 3px',
      transition:      'none',
    }}
  >
    {/* White outline (drawn first, slightly larger via strokeWidth) */}
    <path
      d="M5 3L5 29L11 23L15 32L19 30.5L15 21.5L24 21.5L5 3Z"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="3.5"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    {/* Black solid body */}
    <path
      d="M5 3L5 29L11 23L15 32L19 30.5L15 21.5L24 21.5L5 3Z"
      fill={pressed ? '#444444' : '#1a1a1a'}
      strokeLinejoin="round"
    />
  </svg>
);

export default CursorSVG;
