import React from 'react';
import { useTheme } from '../../../../lib/theme';

const ContentLines: React.FC<{
  lines: string[];
  charsToShow: number;
  fontSize?: number;
  color?: string;
  lineHeight?: number;
}> = ({
  lines,
  charsToShow,
  fontSize = 13,
  color = '#333',
  lineHeight = 1.6,
}) => {
  const theme = useTheme();
  let totalChars = 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {lines.map((line, i) => {
        const lineStart = totalChars;
        totalChars += line.length;
        const visible = Math.max(0, Math.min(line.length, charsToShow - lineStart));
        if (charsToShow < lineStart) return null;
        return (
          <div
            key={i}
            style={{
              color,
              fontFamily: theme.font.family,
              fontSize,
              fontWeight: theme.font.weightLight,
              lineHeight,
              letterSpacing: 0.2,
              minHeight: line === '' ? 6 : undefined,
            }}
          >
            {line.slice(0, visible)}
          </div>
        );
      })}
    </div>
  );
};

export default ContentLines;
