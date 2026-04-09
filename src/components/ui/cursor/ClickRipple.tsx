import React from 'react';
import { interpolate } from 'remotion';

const ClickRipple: React.FC<{ clickFrame: number; frame: number }> = ({
  clickFrame,
  frame,
}) => {
  const age = frame - clickFrame;
  if (age < 0 || age > 30) return null;

  const progress     = age / 30;
  const outerScale   = interpolate(progress, [0, 1], [0.2, 3.0]);
  const outerOpacity = interpolate(progress, [0, 0.2, 1], [0.6, 0.3, 0]);

  return (
    <div
      style={{
        position:      'absolute',
        width:         36,
        height:        36,
        borderRadius:  '50%',
        border:        '1.5px solid rgba(0,0,0,0.7)',
        transform:     `translate(-50%, -50%) scale(${outerScale})`,
        opacity:       outerOpacity,
        pointerEvents: 'none',
      }}
    />
  );
};

export default ClickRipple;
