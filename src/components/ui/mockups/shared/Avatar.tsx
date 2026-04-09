import React from 'react';
import { useTheme } from '../../../../lib/theme';

const Avatar: React.FC<{ initials: string; color: string; size?: number }> = ({
  initials,
  color,
  size = 36,
}) => {
  const theme = useTheme();
  return (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${color}, ${color}99)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.38,
      color: 'white',
      fontFamily: theme.font.family,
      fontWeight: theme.font.weightBold,
      flexShrink: 0,
    }}
  >
    {initials}
  </div>
  );
};

export default Avatar;
