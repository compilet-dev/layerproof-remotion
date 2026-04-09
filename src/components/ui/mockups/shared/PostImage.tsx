import React from 'react';

export const PostImage: React.FC<{
  ratio: string;
  src?: string;
  platformColor: string;
  label?: string;
  style?: React.CSSProperties;
}> = ({ ratio, src, platformColor, label, style }) => (
  <div
    style={{
      width: '100%',
      aspectRatio: ratio,
      position: 'relative',
      overflow: 'hidden',
      flexShrink: 0,
      ...style,
    }}
  >
    <img
      src={src ?? require('../../../../assets/post_image.jpg')}
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
  </div>
);
