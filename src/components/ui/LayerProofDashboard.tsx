// src/components/ui/LayerProofDashboard.tsx
// Full pixel-accurate LayerProof Studio dashboard mockup

import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Platform, PLATFORMS, staggerReveal } from '../../lib/animations';
import { useTheme } from '../../lib/theme';

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar: React.FC<{ activeItem?: string }> = ({ activeItem = 'posts' }) => {
  const theme = useTheme();
  const navItems = [
    { id: 'home',       icon: '⊞', label: 'Dashboard' },
    { id: 'posts',      icon: '✦', label: 'AI Creator',  active: true },
    { id: 'calendar',   icon: '◫', label: 'Schedule' },
    { id: 'analytics',  icon: '▲', label: 'Analytics' },
    { id: 'settings',   icon: '⚙', label: 'Settings' },
  ];

  return (
    <div
      style={{
        width: 220,
        height: '100%',
        background: 'rgba(0,0,0,0.03)',
        borderRight: '1px solid rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '0 24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #00000018, #00000006)',
              border: '1px solid rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              color: theme.colors.white,
            }}
          >
            ◈
          </div>
          <span
            style={{
              color: theme.colors.white,
              fontFamily: theme.font.family,
              fontSize: 15,
              fontWeight: theme.font.weightBold,
              letterSpacing: 1,
            }}
          >
            LayerProof
          </span>
        </div>
      </div>

      {/* Nav */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 12px', flex: 1 }}>
        {navItems.map((item) => {
          const isActive = item.id === activeItem;
          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 8,
                background: isActive ? 'rgba(0,0,0,0.06)' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 14, color: isActive ? theme.colors.white : theme.colors.gray }}>
                {item.icon}
              </span>
              <span
                style={{
                  color: isActive ? theme.colors.white : theme.colors.gray,
                  fontFamily: theme.font.family,
                  fontSize: 13,
                  fontWeight: isActive ? theme.font.weightMedium : theme.font.weightRegular,
                }}
              >
                {item.label}
              </span>
              {isActive && (
                <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: theme.colors.white, opacity: 0.6 }} />
              )}
            </div>
          );
        })}
      </div>

      {/* User */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              color: 'white',
              fontFamily: theme.font.family,
              fontWeight: theme.font.weightBold,
            }}
          >
            TR
          </div>
          <div>
            <div style={{ color: theme.colors.white, fontFamily: theme.font.family, fontSize: 12, fontWeight: theme.font.weightMedium }}>
              Tracy
            </div>
            <div style={{ color: theme.colors.gray, fontFamily: theme.font.family, fontSize: 11 }}>
              Pro Plan
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Prompt Bar ───────────────────────────────────────────────────────────────

interface PromptBarProps {
  text?: string;
  charsToShow?: number;
  showCursor?: boolean;
  frame?: number;
}

export const PromptBar: React.FC<PromptBarProps> = ({
  text = '',
  charsToShow,
  showCursor = true,
  frame = 0,
}) => {
  const theme = useTheme();
  const displayText = charsToShow !== undefined ? text.slice(0, charsToShow) : text;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: 'rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.10)',
        borderRadius: 12,
        padding: '16px 20px',
        width: '100%',
      }}
    >
      {/* AI sparkle icon */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.08), rgba(0,0,0,0.03))',
          border: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: 14,
        }}
      >
        ✦
      </div>

      <span
        style={{
          color: displayText ? theme.colors.white : theme.colors.gray,
          fontFamily: theme.font.family,
          fontSize: 15,
          fontWeight: theme.font.weightLight,
          flex: 1,
          letterSpacing: 0.3,
        }}
      >
        {displayText || 'Describe your post...'}
        {showCursor && displayText && (
          <span
            style={{
              display: 'inline-block',
              width: 2,
              height: 16,
              background: theme.colors.white,
              marginLeft: 2,
              opacity: frame % 20 < 10 ? 1 : 0,
              verticalAlign: 'middle',
            }}
          />
        )}
      </span>

      {/* Platform pills */}
      <div style={{ display: 'flex', gap: 6 }}>
        {PLATFORMS.map((p: Platform) => (
          <div
            key={p.id}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: `${p.color}18`,
              border: `1px solid ${p.color}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
            }}
          >
            {p.icon}
          </div>
        ))}
      </div>

      {/* Generate button */}
      <div
        style={{
          background: theme.colors.white,
          color: theme.colors.bgDark,
          fontFamily: theme.font.family,
          fontSize: 13,
          fontWeight: theme.font.weightBold,
          padding: '8px 18px',
          borderRadius: 8,
          letterSpacing: 0.5,
          flexShrink: 0,
        }}
      >
        Generate →
      </div>
    </div>
  );
};

// ─── Platform Output Card ─────────────────────────────────────────────────────

interface OutputCardProps {
  platform: Platform;
  content: string;
  charsToShow?: number;
  isGenerating?: boolean;
  frame?: number;
  opacity?: number;
  scale?: number;
}

export const OutputCard: React.FC<OutputCardProps> = ({
  platform,
  content,
  charsToShow,
  isGenerating = false,
  frame = 0,
  opacity = 1,
  scale = 1,
}) => {
  const theme = useTheme();
  const displayText = charsToShow !== undefined ? content.slice(0, charsToShow) : content;

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        willChange: 'transform',
        background: 'rgba(0,0,0,0.03)',
        border: `1px solid ${platform.color}25`,
        borderRadius: 14,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        flex: 1,
        minHeight: 200,
      }}
    >
      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 7,
            background: `${platform.color}20`,
            border: `1px solid ${platform.color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
          }}
        >
          {platform.icon}
        </div>
        <span
          style={{
            color: theme.colors.grayLight,
            fontFamily: theme.font.family,
            fontSize: 13,
            fontWeight: theme.font.weightMedium,
          }}
        >
          {platform.label}
        </span>

        {/* Generating dot */}
        {isGenerating && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, alignItems: 'center' }}>
            {[0, 6, 12].map((offset) => (
              <div
                key={offset}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: platform.color,
                  opacity: (frame + offset) % 20 < 10 ? 1 : 0.2,
                }}
              />
            ))}
          </div>
        )}

        {!isGenerating && displayText && (
          <div
            style={{
              marginLeft: 'auto',
              background: `${platform.color}20`,
              color: platform.color,
              fontFamily: theme.font.family,
              fontSize: 11,
              fontWeight: theme.font.weightMedium,
              padding: '3px 8px',
              borderRadius: 6,
              letterSpacing: 0.5,
            }}
          >
            Ready
          </div>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          color: theme.colors.grayLight,
          fontFamily: theme.font.family,
          fontSize: 13,
          fontWeight: theme.font.weightLight,
          lineHeight: 1.7,
          flex: 1,
          letterSpacing: 0.2,
        }}
      >
        {displayText}
        {isGenerating && charsToShow !== undefined && (
          <span
            style={{
              display: 'inline-block',
              width: 2,
              height: 13,
              background: theme.colors.grayLight,
              marginLeft: 1,
              opacity: frame % 16 < 8 ? 0.8 : 0,
              verticalAlign: 'middle',
            }}
          />
        )}
      </div>

      {/* Action row */}
      {!isGenerating && displayText && (
        <div style={{ display: 'flex', gap: 8, borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 12 }}>
          {['Copy', 'Edit', 'Schedule'].map((action) => (
            <div
              key={action}
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                background: 'rgba(0,0,0,0.05)',
                color: theme.colors.gray,
                fontFamily: theme.font.family,
                fontSize: 11,
                fontWeight: theme.font.weightMedium,
                cursor: 'pointer',
              }}
            >
              {action}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Full Dashboard ───────────────────────────────────────────────────────────

interface DashboardProps {
  promptText?: string;
  promptChars?: number;
  showOutputs?: boolean;
  outputsFrame?: number;
  frame?: number;
}

export const LayerProofDashboard: React.FC<DashboardProps> = ({
  promptText = '',
  promptChars,
  showOutputs = false,
  outputsFrame = 0,
  frame = 0,
}) => {
  const theme = useTheme();
  const postContent: Record<string, string> = {
    instagram:
      '🚀 Big news! Our AI feature is live and it\'s changing how teams create content.\n\nNo more starting from scratch. Just describe what you need, and let our AI handle the rest across every platform.\n\n#AI #ProductLaunch #ContentCreation',
    linkedin:
      "We're excited to announce the launch of our most powerful AI feature yet.\n\nAfter months of development, our team has built a content generation system that understands context, tone, and platform nuances — giving you polished drafts in seconds, not hours.",
    twitter:
      '⚡️ Just shipped: AI-powered content generation that actually understands your brand voice.\n\nWrite once → publish everywhere. Thread incoming 🧵',
    blog:
      "Introducing Our Most Powerful AI Feature\n\nToday we're launching a new way to create content that adapts intelligently to every platform you publish on. Here's what makes it different...",
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: theme.colors.bgDark,
        display: 'flex',
        fontFamily: theme.font.family,
        overflow: 'hidden',
      }}
    >
      <Sidebar />

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 32, gap: 24, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1
              style={{
                color: theme.colors.white,
                fontFamily: theme.font.family,
                fontSize: 22,
                fontWeight: theme.font.weightBold,
                margin: 0,
                letterSpacing: 0.5,
              }}
            >
              AI Social Creator
            </h1>
            <p style={{ color: theme.colors.gray, fontFamily: theme.font.family, fontSize: 13, margin: '4px 0 0', fontWeight: theme.font.weightLight }}>
              Generate for all platforms at once
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ color: theme.colors.gray, fontFamily: theme.font.family, fontSize: 12, letterSpacing: 1 }}>
              12 posts left today
            </div>
            <div
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                background: 'rgba(0,0,0,0.05)',
                border: '1px solid rgba(0,0,0,0.08)',
                color: theme.colors.grayLight,
                fontFamily: theme.font.family,
                fontSize: 12,
                fontWeight: theme.font.weightMedium,
              }}
            >
              History
            </div>
          </div>
        </div>

        {/* Prompt bar */}
        <PromptBar
          text={promptText}
          charsToShow={promptChars}
          showCursor={!showOutputs}
          frame={frame}
        />

        {/* Outputs grid */}
        {showOutputs && (
          <div style={{ display: 'flex', gap: 16, flex: 1, overflow: 'hidden' }}>
            {PLATFORMS.map((platform: Platform, i: number) => {
              const delay = i * 18;
              const cardProgress = Math.max(0, outputsFrame - delay);
              const totalChars = postContent[platform.id].length;
              const charsToShow = Math.floor(
                interpolate(cardProgress, [0, 60], [0, totalChars], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                })
              );
              const isGenerating = charsToShow < totalChars;

              return (
                <OutputCard
                  key={platform.id}
                  platform={platform}
                  content={postContent[platform.id]}
                  charsToShow={charsToShow}
                  isGenerating={isGenerating}
                  frame={frame}
                />
              );
            })}
          </div>
        )}

        {/* Empty state when no outputs yet */}
        {!showOutputs && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              opacity: 0.3,
            }}
          >
            <div style={{ fontSize: 40 }}>✦</div>
            <div style={{ color: theme.colors.gray, fontFamily: theme.font.family, fontSize: 14, letterSpacing: 2, textTransform: 'uppercase' }}>
              Your posts will appear here
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
