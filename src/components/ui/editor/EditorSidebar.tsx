import React from 'react';
import { useTheme } from '../../../lib/theme';

const POST_ITEMS = [
  { title: 'AI Feature Launch',  sub: 'Instagram Post · Published', status: 'published' },
  { title: 'Product Update',     sub: 'LinkedIn · Scheduled',       status: 'scheduled' },
  { title: 'Team Spotlight',     sub: 'Twitter / X · Draft',        status: 'draft' },
  { title: 'Feature Deep-Dive',  sub: 'Blog · Draft',               status: 'draft' },
];

export const statusColor = (s: string) =>
  s === 'published' ? '#22c55e' : s === 'scheduled' ? '#3b82f6' : '#d1d5db';

export const EditorSidebar: React.FC<{
  postsVisible: number;
  activePostIndex?: number;
}> = ({ postsVisible, activePostIndex = 0 }) => {
  const theme = useTheme();
  return (
  <div
    style={{
      width: 260,
      height: '100%',
      background: '#FAFAFA',
      borderRight: '1px solid rgba(0,0,0,0.07)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      overflow: 'hidden',
    }}
  >
    {/* Header */}
    <div
      style={{
        padding: '14px 16px 12px',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      <span style={{ fontFamily: theme.font.family, fontSize: 11, fontWeight: theme.font.weightBold, color: '#999', letterSpacing: 1.5, textTransform: 'uppercase' }}>
        Posts
      </span>
      <div
        style={{
          width: 22, height: 22, borderRadius: 6,
          background: 'rgba(0,0,0,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, color: '#555', lineHeight: 1, cursor: 'pointer',
        }}
      >
        +
      </div>
    </div>

    {/* Post list */}
    <div style={{ flex: 1, overflowY: 'hidden', padding: '6px 0' }}>
      {POST_ITEMS.slice(0, postsVisible).map((post, i) => {
        const isActive = i === activePostIndex;
        return (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', margin: '0 6px',
              borderRadius: 8,
              background: isActive ? 'rgba(0,0,0,0.055)' : 'transparent',
              cursor: 'pointer',
            }}
          >
            {/* Thumbnail */}
            <div
              style={{
                width: 40, height: 40, borderRadius: 7,
                overflow: 'hidden', flexShrink: 0,
                border: isActive ? '1.5px solid rgba(0,0,0,0.15)' : '1px solid rgba(0,0,0,0.08)',
              }}
            >
              <img
                src={require('../../../assets/post_instagram.jpg')}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* Text */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                <span
                  style={{
                    fontFamily: theme.font.family, fontSize: 12,
                    fontWeight: isActive ? theme.font.weightBold : theme.font.weightMedium,
                    color: isActive ? '#1a1a1a' : '#444',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1,
                  }}
                >
                  {post.title}
                </span>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor(post.status), flexShrink: 0 }} />
              </div>
              <span
                style={{
                  fontFamily: theme.font.family, fontSize: 10, color: '#aaa',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block',
                }}
              >
                {post.sub}
              </span>
            </div>
          </div>
        );
      })}
    </div>

    {/* Bottom icon bar */}
    <div
      style={{
        borderTop: '1px solid rgba(0,0,0,0.06)',
        padding: '10px 14px',
        display: 'flex', gap: 8,
        flexShrink: 0,
      }}
    >
      {[{ label: 'Uploads', icon: '⬆' }, { label: 'Feedback', icon: '💬' }].map((btn) => (
        <div
          key={btn.label}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '5px 10px', borderRadius: 6,
            background: 'rgba(0,0,0,0.04)',
            fontFamily: theme.font.family, fontSize: 11, color: '#666',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: 12 }}>{btn.icon}</span>
          {btn.label}
        </div>
      ))}
    </div>
  </div>
  );
};
