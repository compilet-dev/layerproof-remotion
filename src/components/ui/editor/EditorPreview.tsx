import React from 'react';
import { useTheme } from '../../../lib/theme';
import {
  InstagramMockup,
  InstagramStoryMockup,
  LinkedInMockup,
  TwitterMockup,
} from '../mockups';
import { SkeletonCard } from './SkeletonCard';
import { FloatingActions } from './FloatingActions';

export const TABS = [
  { id: 'instagram', label: 'Instagram Post',  iconText: '◈', color: '#E1306C', previewMaxWidth: 440, MockupComponent: InstagramMockup },
  { id: 'story',     label: 'Instagram Story', iconText: '▤', color: '#C13584', previewMaxWidth: 270, MockupComponent: InstagramStoryMockup },
  { id: 'linkedin',  label: 'LinkedIn',        iconText: 'in', color: '#0A66C2', previewMaxWidth: 580, MockupComponent: LinkedInMockup },
  { id: 'twitter',   label: 'Twitter / X',    iconText: '𝕏', color: '#1D9BF0', previewMaxWidth: 500, MockupComponent: TwitterMockup },
  { id: 'tiktok',    label: 'TikTok',         iconText: '▶', color: '#010101', previewMaxWidth: 300, MockupComponent: InstagramMockup },
  { id: 'facebook',  label: 'Facebook',       iconText: 'f',  color: '#1877F2', previewMaxWidth: 540, MockupComponent: LinkedInMockup },
];

const POST_ITEMS = [
  { title: 'AI Feature Launch',  sub: 'Instagram Post · Published', status: 'published' },
  { title: 'Product Update',     sub: 'LinkedIn · Scheduled',       status: 'scheduled' },
  { title: 'Team Spotlight',     sub: 'Twitter / X · Draft',        status: 'draft' },
  { title: 'Feature Deep-Dive',  sub: 'Blog · Draft',               status: 'draft' },
];

export const EditorPreview: React.FC<{
  activeTabIndex: number;
  frame?: number;
  contentChars?: number;
  activePostIndex?: number;
  imageGenerating?: boolean;
  imageGenProgress?: number;
}> = ({ activeTabIndex, frame = 0, contentChars, activePostIndex = 0, imageGenerating = false, imageGenProgress = 0 }) => {
  const theme = useTheme();
  const tab = TABS[activeTabIndex] ?? TABS[0];
  const { MockupComponent, previewMaxWidth, id: tabId } = tab;

  const shimmerX = imageGenerating ? ((frame % 38) / 38) * 200 - 100 : 0;
  const p = imageGenProgress;
  const genOverlayOpacity = p < 0.1 ? p * 10 : p > 0.85 ? Math.max(0, 1 - (p - 0.85) * 6.67) : 1;

  const prevPost = POST_ITEMS[activePostIndex - 1];
  const nextPost = POST_ITEMS[activePostIndex + 1];

  return (
    <div
      style={{
        flex: 1, height: '100%',
        background: '#E8E8EA',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Platform tabs */}
      <div
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          display: 'flex', alignItems: 'center',
          padding: '0 16px', gap: 2,
          height: 46, flexShrink: 0,
          overflowX: 'hidden',
        }}
      >
        {TABS.map((t, i) => {
          const isActive = i === activeTabIndex;
          return (
            <div
              key={t.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '5px 11px', borderRadius: 6, flexShrink: 0,
                background: isActive ? `${t.color}12` : 'transparent',
                cursor: 'pointer',
                borderBottom: isActive ? `2px solid ${t.color}` : '2px solid transparent',
              }}
            >
              <span
                style={{
                  fontSize: t.iconText === 'in' || t.iconText === 'f' ? 10 : 11,
                  fontWeight: theme.font.weightBold,
                  color: isActive ? t.color : '#aaa',
                  fontFamily: theme.font.family,
                  lineHeight: 1,
                }}
              >
                {t.iconText}
              </span>
              <span
                style={{
                  fontFamily: theme.font.family, fontSize: 12,
                  fontWeight: isActive ? theme.font.weightBold : theme.font.weightRegular,
                  color: isActive ? t.color : '#999',
                  whiteSpace: 'nowrap',
                }}
              >
                {t.label}
              </span>
              <div
                style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: isActive ? t.color : 'rgba(0,0,0,0.12)',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Post navigation strip */}
      <div
        style={{
          height: 34, flexShrink: 0,
          background: '#F2F2F4',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex', alignItems: 'center',
          padding: '0 12px',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, opacity: prevPost ? 1 : 0.25, cursor: prevPost ? 'pointer' : 'default' }}>
          <span style={{ fontSize: 15, color: '#555', lineHeight: 1 }}>‹</span>
          <span style={{ fontFamily: theme.font.family, fontSize: 11, color: '#666', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {prevPost?.title ?? '—'}
          </span>
        </div>
        <span style={{ fontFamily: theme.font.family, fontSize: 11, fontWeight: theme.font.weightBold, color: '#1a1a1a' }}>
          {activePostIndex + 1} / {POST_ITEMS.length}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, opacity: nextPost ? 1 : 0.25, cursor: nextPost ? 'pointer' : 'default' }}>
          <span style={{ fontFamily: theme.font.family, fontSize: 11, color: '#666', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {nextPost?.title ?? '—'}
          </span>
          <span style={{ fontSize: 15, color: '#555', lineHeight: 1 }}>›</span>
        </div>
      </div>

      {/* Timeline */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: tabId === 'story' ? '20px' : '20px 56px 20px 20px',
          overflow: 'hidden',
        }}
      >
        <div style={{ width: '100%', maxWidth: previewMaxWidth, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SkeletonCard opacity={0.28} />

          <div
            style={{
              width: '100%',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(0,0,0,0.10), 0 8px 32px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)',
              flexShrink: 0,
              position: 'relative',
            }}
          >
            <MockupComponent charsToShow={contentChars ?? 300} frame={frame} />

            {imageGenerating && (
              <div
                style={{
                  position: 'absolute', inset: 0, zIndex: 4,
                  opacity: genOverlayOpacity,
                  pointerEvents: 'none',
                }}
              >
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,8,18,0.42)' }} />
                <div
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.16) 50%, transparent 75%)',
                    transform: `translateX(${shimmerX}%)`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute', bottom: 18, left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex', alignItems: 'center', gap: 7,
                    background: 'rgba(0,0,0,0.68)',
                    borderRadius: 20, padding: '6px 16px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ color: '#fff', fontSize: 13, lineHeight: 1 }}>✦</span>
                  <span style={{ fontFamily: theme.font.family, fontSize: 12, color: '#fff', fontWeight: theme.font.weightMedium }}>
                    Generating image...
                  </span>
                </div>
              </div>
            )}
          </div>

          <SkeletonCard opacity={0.18} />
        </div>
      </div>

      <FloatingActions />
    </div>
  );
};
