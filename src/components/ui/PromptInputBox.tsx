// src/components/ui/PromptInputBox.tsx
// Faithful recreation of the LayerProof prompt input UI from Figma

import React from "react";
import { useTheme } from "../../lib/theme";
import "../../lib/loadFont";
import { ANTON_FAMILY } from "../../lib/loadFont";

const DARKER_GROTESQUE = "'Darker Grotesque', 'Inter', sans-serif";

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const IconPresentation: React.FC = () => (
  <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
    <rect
      x="1"
      y="1"
      width="14"
      height="10"
      rx="1.5"
      stroke="#3a3a3a"
      strokeWidth="1.3"
    />
    <line
      x1="1.5"
      y1="4.5"
      x2="14.5"
      y2="4.5"
      stroke="#3a3a3a"
      strokeWidth="1.1"
    />
    <line
      x1="5"
      y1="13"
      x2="11"
      y2="13"
      stroke="#3a3a3a"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <line x1="8" y1="11" x2="8" y2="13" stroke="#3a3a3a" strokeWidth="1.2" />
  </svg>
);

const IconChevron: React.FC<{ color?: string }> = ({ color = "#888" }) => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
    <path
      d="M1 1L5 5L9 1"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconGlobe: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8.3" stroke="#4285F4" strokeWidth="1.4" />
    <ellipse
      cx="10"
      cy="10"
      rx="4.3"
      ry="8.3"
      stroke="#4285F4"
      strokeWidth="1.2"
    />
    <path
      d="M1.8 7h16.4M1.8 13h16.4"
      stroke="#4285F4"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const IconClip: React.FC = () => (
  <svg width="17" height="20" viewBox="0 0 17 20" fill="none">
    <path
      d="M14.5 8.5L7.5 15.5C5.84 17.16 3.16 17.16 1.5 15.5C-0.16 13.84 -0.16 11.16 1.5 9.5L8.5 2.5C9.66 1.34 11.54 1.34 12.7 2.5C13.86 3.66 13.86 5.54 12.7 6.7L5.7 13.7C5.12 14.28 4.18 14.28 3.6 13.7C3.02 13.12 3.02 12.18 3.6 11.6L10 5"
      stroke="#FFFFFF"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const IconSparkle: React.FC<{ color?: string }> = ({
  color = "rgba(0,0,0,0.28)",
}) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M7 1L8.18 5.36L12.5 7L8.18 8.64L7 13L5.82 8.64L1.5 7L5.82 5.36L7 1Z"
      fill={color}
    />
  </svg>
);

// ─── Pill Dropdown ─────────────────────────────────────────────────────────────

const Pill: React.FC<{
  icon: React.ReactNode;
  label: string;
  large?: boolean;
}> = ({ icon, label, large = false }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: large ? "10px 16px" : "7px 12px",
        border: "1px solid rgba(0,0,0,0.10)",
        borderRadius: large ? 12 : 10,
        background: large ? "rgba(255,255,255,0.85)" : "rgba(250,250,250,0.7)",
        flexShrink: 0,
      }}
    >
      {icon}
      <span
        style={{
          fontSize: large ? 15 : 13,
          fontWeight: large
            ? theme.font.weightMedium
            : theme.font.weightRegular,
          color: large ? "#1a1a1a" : "#444",
          fontFamily: theme.font.family,
          letterSpacing: 0.1,
        }}
      >
        {label}
      </span>
      <IconChevron color={large ? "#888" : "#aaa"} />
    </div>
  );
};

// ─── Image Background ─────────────────────────────────────────────────────────
// Full-bleed photo from assets, with a light overlay to keep UI legible.

const ImageBackground: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      pointerEvents: "none",
    }}
  >
    <img
      src={require("../../assets/img_background.png")}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center",
      }}
    />
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────

export interface PromptInputBoxProps {
  promptText?: string;
  promptChars?: number;
  frame?: number;
  showCursor?: boolean;
  generateHighlighted?: boolean;
  /** Render only the glass prompt card — no background photo or headline */
  cardOnly?: boolean;
  /** Suppress the placeholder text when no chars are typed yet */
  hidePlaceholder?: boolean;
}

export const PromptInputBox: React.FC<PromptInputBoxProps> = ({
  promptText = "",
  promptChars,
  frame = 0,
  showCursor = true,
  generateHighlighted = false,
  cardOnly = false,
  hidePlaceholder = false,
}) => {
  const theme = useTheme();
  const displayText =
    promptChars !== undefined ? promptText.slice(0, promptChars) : promptText;
  const hasText = displayText.length > 0;
  const cursorVisible = frame % 20 < 10;

  const card = (
    <div
      style={{
        width: "100%",
        background: cardOnly
          ? "rgba(255,255,255,0.07)"
          : "rgba(255,255,255,0.2)",
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        borderRadius: 28,
        border: cardOnly
          ? "1px solid rgba(255,255,255,0.12)"
          : "1px solid rgba(255,255,255,0.35)",
        boxShadow: cardOnly
          ? "0 4px 32px rgba(0,0,0,0.4)"
          : "0 4px 24px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.8) inset",
        overflow: "hidden",
      }}
    >
      {/* ── Toolbar row ──────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "14px 20px",
          borderBottom: "1px solid rgba(0,0,0,0.055)",
          gap: 10,
        }}
      >
        <Pill icon={<IconPresentation />} label="Social Post" large />
        <div
          style={{
            width: 1,
            height: 24,
            marginLeft: 4,
            marginRight: 8,
            flexShrink: 0,
          }}
        />
      </div>

      {/* ── Textarea ─────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "26px 24px 18px",
          minHeight: 155,
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            fontSize: 20,
            color: hasText ? "#FFFFFF" : "#C0C0C0",
            fontWeight: theme.font.weightRegular,
            lineHeight: 1.65,
            flex: 1,
            letterSpacing: 0.1,
          }}
        >
          {hasText ? (
            <>
              {displayText}
              {showCursor && (
                <span
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: 22,
                    background: "#1A1A1A",
                    marginLeft: 2,
                    opacity: cursorVisible ? 1 : 0,
                    verticalAlign: "middle",
                    borderRadius: 1,
                  }}
                />
              )}
            </>
          ) : hidePlaceholder ? null : (
            "Ask LayerProof to generate the presentation..."
          )}
        </div>
      </div>

      {/* ── Bottom action row ────────────────────────────────────────── */}
      <div
        style={{
          padding: "10px 20px 22px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: "rgba(255, 255, 255, 0.64)",
            border: "1px solid rgba(255,255,255,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <IconGlobe />
        </div>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: "rgba(255, 255, 255, 0.23)",
            border: "1px solid rgba(0,0,0,0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <IconClip />
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "13px 28px",
            borderRadius: 30,
            background: generateHighlighted ? "#0A0A0A" : "rgba(0,0,0,0.055)",
            flexShrink: 0,
          }}
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            <IconSparkle
              color={
                generateHighlighted
                  ? "rgba(255,255,255,0.8)"
                  : "rgba(0,0,0,0.28)"
              }
            />
          </span>
          <span
            style={{
              fontSize: 15,
              fontWeight: theme.font.weightMedium,
              color: generateHighlighted ? "#FFFFFF" : "#AAAAAA",
              letterSpacing: 0.2,
              fontFamily: theme.font.family,
            }}
          >
            Generate
          </span>
        </div>
      </div>
    </div>
  );

  // ── Card-only mode ────────────────────────────────────────────────────────────
  if (cardOnly) {
    return (
      <div style={{ width: "100%", fontFamily: theme.font.family }}>{card}</div>
    );
  }

  // ── Full mode (with photo background and headline) ────────────────────────────
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        fontFamily: theme.font.family,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <ImageBackground />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "80%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "0 320px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 400,
            fontFamily: ANTON_FAMILY,
            lineHeight: 1.08,
            marginBottom: 18,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "#FFFFFF" }}>Let's create </span>
          <span style={{ color: "#FFE600" }}>something great.</span>
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: theme.font.weightRegular,
            color: "#FFFFFF",
            marginBottom: 36,
            lineHeight: 1.55,
            letterSpacing: 0.1,
          }}
        >
          Describe what you need, and we'll turn it into a polished visual
          content.
        </div>
        {card}
      </div>
    </div>
  );
};
