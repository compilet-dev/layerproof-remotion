// src/components/ui/BrandIcons.tsx
// Brand-accurate SVG icons for Chrome browser tabs
import React from "react";

interface IconProps {
  size?: number;
}

export const CanvaIcon: React.FC<IconProps> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#7B2FBE" />
    <text
      x="12"
      y="17"
      textAnchor="middle"
      fontSize="14"
      fontWeight="700"
      fontFamily="system-ui, sans-serif"
      fill="#fff"
    >
      C
    </text>
  </svg>
);

export const GoogleDocsIcon: React.FC<IconProps> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="4" y="1" width="14" height="18" rx="2" fill="#4285f4" />
    <path d="M14 1v5h4" fill="#A8C7FA" />
    <rect x="7" y="9" width="10" height="1.5" rx="0.75" fill="white" opacity="0.85" />
    <rect x="7" y="12" width="10" height="1.5" rx="0.75" fill="white" opacity="0.85" />
    <rect x="7" y="15" width="7" height="1.5" rx="0.75" fill="white" opacity="0.85" />
  </svg>
);

export const HootsuiteIcon: React.FC<IconProps> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#1F3148" />
    {/* Owl eye circles */}
    <circle cx="9" cy="11" r="3.5" fill="#FFCF00" />
    <circle cx="16" cy="11" r="3.5" fill="#FFCF00" />
    <circle cx="9" cy="11" r="2" fill="#1F3148" />
    <circle cx="16" cy="11" r="2" fill="#1F3148" />
    {/* Beak */}
    <path d="M11.5 14.5 L12.5 16 L13.5 14.5Z" fill="#FFCF00" />
    {/* Ears */}
    <path d="M6 8 L8 5 L10 8Z" fill="#1F3148" />
    <path d="M14 8 L16 5 L18 8Z" fill="#1F3148" />
  </svg>
);

export const NotionIcon: React.FC<IconProps> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#fff" />
    <path
      d="M5 4.5C5 3.67 5.67 3 6.5 3H16.8C17.2 3 17.6 3.17 17.9 3.47L20.5 6.1C20.8 6.4 21 6.8 21 7.2V20.5C21 21.33 20.33 22 19.5 22H6.5C5.67 22 5 21.33 5 20.5V4.5Z"
      fill="#fff"
      stroke="#E5E5E5"
      strokeWidth="0.5"
    />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fontSize="13"
      fontWeight="800"
      fontFamily="Georgia, serif"
      fill="#111"
    >
      N
    </text>
  </svg>
);
