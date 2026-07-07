import React from 'react';
import { staticFile } from 'remotion';
import { useTheme } from '../../../lib/theme';
import Avatar from './shared/Avatar';
import ContentLines from './shared/ContentLines';
import { PostImage } from './shared/PostImage';

export const BlogMockup: React.FC<{ charsToShow: number; frame: number }> = ({
  charsToShow,
  frame,
}) => {
  const theme = useTheme();
  const bodyLines = [
    "Today we're launching a new way to create content that adapts intelligently",
    'to every platform you publish on — automatically.',
    '',
    'For too long, content teams have wasted hours rewriting the same post for',
    'Instagram, LinkedIn, Twitter, and their blog — all by hand.',
    '',
    'With LayerProof, that stops today.',
  ];

  return (
    <div
      style={{
        width: '100%',
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #e5e5e5',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: theme.font.family,
      }}
    >
      {/* ── Nav ── */}
      <div style={{ padding: '12px 20px', borderBottom: '1px solid #eeeeee', display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: '#0D0D0D' }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: 'linear-gradient(135deg, #FF6B35, #FF6B35cc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff' }}>
            L
          </div>
          LayerProof Blog
        </div>
        <div style={{ flex: 1 }} />
        {['Product', 'Engineering', 'Design'].map((tag) => (
          <span key={tag} style={{ color: '#888', fontSize: 12 }}>{tag}</span>
        ))}
      </div>

      {/* ── 16:9 Hero Image ── */}
      <PostImage ratio="16 / 9" src={require('../../../assets/post_blog.jpg')} platformColor="#FF6B35" />

      {/* ── Article meta ── */}
      <div style={{ padding: '14px 20px 10px' }}>
        <div style={{ display: 'inline-block', background: 'rgba(255,107,53,0.12)', color: '#FF6B35', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '3px 9px', borderRadius: 4, marginBottom: 10 }}>
          Product Update
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#0D0D0D', lineHeight: 1.3, marginBottom: 10 }}>
          {`Introducing Our Most Powerful AI Feature`.slice(0, Math.max(0, charsToShow - 0))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
          <Avatar initials="TR" color="#6366f1" size={22} />
          <span style={{ fontSize: 12, color: '#666' }}>Tracy · LayerProof Team</span>
          <span style={{ color: '#ddd' }}>·</span>
          <span style={{ fontSize: 12, color: '#888' }}>4 min read</span>
          <div style={{ marginLeft: 'auto', background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)', padding: '2px 9px', borderRadius: 20 }}>
            <span style={{ fontSize: 11, color: '#FF6B35' }}>New</span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '0 20px 16px', flex: 1, overflow: 'hidden' }}>
        <ContentLines lines={bodyLines} charsToShow={Math.max(0, charsToShow - 44)} fontSize={13} color="#333" lineHeight={1.75} />
      </div>
    </div>
  );
};
