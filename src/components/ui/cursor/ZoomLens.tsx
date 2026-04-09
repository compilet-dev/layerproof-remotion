import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';

interface ZoomLensProps {
  zoomInAt:   number;
  holdUntil:  number;
  zoomOutAt:  number;
  targetX:    number;
  targetY:    number;
  maxZoom?:   number;
  children:   React.ReactNode;
}

export const ZoomLens: React.FC<ZoomLensProps> = ({
  zoomInAt,
  holdUntil: _holdUntil,
  zoomOutAt,
  targetX,
  targetY,
  maxZoom = 1.8,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoomInSpring  = spring({ frame: Math.max(0, frame - zoomInAt),  fps, config: { stiffness: 60, damping: 22 } });
  const zoomOutSpring = spring({ frame: Math.max(0, frame - zoomOutAt), fps, config: { stiffness: 55, damping: 20 } });

  const zoomIn      = interpolate(zoomInSpring,  [0, 1], [1, maxZoom]);
  const zoomOut     = interpolate(zoomOutSpring, [0, 1], [maxZoom, 1]);
  const currentZoom = frame < zoomOutAt ? zoomIn : zoomOut;

  const translateX = (0.5 - targetX) * (currentZoom - 1) * 100;
  const translateY = (0.5 - targetY) * (currentZoom - 1) * 100;

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <div
        style={{
          width:           '100%',
          height:          '100%',
          transform:       `scale(${currentZoom}) translate(${translateX}%, ${translateY}%)`,
          transformOrigin: `${targetX * 100}% ${targetY * 100}%`,
          willChange:      'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
};
