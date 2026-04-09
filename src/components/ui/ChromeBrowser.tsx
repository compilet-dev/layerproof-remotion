// src/components/ui/ChromeBrowser.tsx
import React from "react";

interface Tab {
  label: string;
  active: boolean;
  icon?: React.ReactNode;
}

interface ChromeBrowserProps {
  tabs: Tab[];
  url: string;
  children: React.ReactNode;
}

export const ChromeBrowser: React.FC<ChromeBrowserProps> = ({ tabs, url, children }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1e1e20",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 2px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          backgroundColor: "#2a2a2e",
          paddingTop: 12,
          paddingLeft: 100,
          paddingRight: 16,
          height: 64,
          position: "relative",
        }}
      >
        {/* Traffic lights */}
        <div style={{ position: "absolute", left: 20, top: 22, display: "flex", gap: 10 }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
          <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#febc2e" }} />
          <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#28c840" }} />
        </div>

        {/* Tabs */}
        {tabs.map((tab) => (
          <div
            key={tab.label}
            style={{
              padding: "10px 28px",
              fontSize: 18,
              fontFamily: "system-ui, -apple-system, sans-serif",
              color: tab.active ? "#e8e8e8" : "rgba(255,255,255,0.35)",
              backgroundColor: tab.active ? "#1e1e20" : "transparent",
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              marginRight: 2,
              fontWeight: tab.active ? 500 : 400,
              maxWidth: 260,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {tab.icon}
            {tab.label}
          </div>
        ))}
      </div>

      {/* Address bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#2a2a2e",
          padding: "8px 16px",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", gap: 10 }}>
          <BrowserArrow direction="left" />
          <BrowserArrow direction="right" />
          <RefreshIcon />
        </div>

        <div
          style={{
            flex: 1,
            backgroundColor: "#3a3a3e",
            borderRadius: 24,
            padding: "10px 20px",
            fontSize: 18,
            fontFamily: "system-ui, -apple-system, sans-serif",
            color: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          {url}
        </div>
      </div>

      {/* Content area */}
      <div style={{ flex: 1, overflow: "hidden" }}>{children}</div>
    </div>
  );
};

const BrowserArrow: React.FC<{ direction: "left" | "right" }> = ({ direction }) => (
  <div style={{ width: 36, height: 36, display: "flex", justifyContent: "center", alignItems: "center" }}>
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgba(255,255,255,0.4)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: direction === "right" ? "scaleX(-1)" : undefined }}
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  </div>
);

const RefreshIcon: React.FC = () => (
  <div style={{ width: 36, height: 36, display: "flex", justifyContent: "center", alignItems: "center" }}>
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgba(255,255,255,0.4)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 4v6h-6" />
      <path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10" />
      <path d="M20.49 15a9 9 0 01-14.85 3.36L1 14" />
    </svg>
  </div>
);
