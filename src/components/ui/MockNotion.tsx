// src/components/ui/MockNotion.tsx
// Simulated Notion workspace — sidebar, content calendar table, rich text page
import React from "react";

const SIDEBAR_PAGES = [
  { emoji: "📋", label: "Content Calendar", active: false },
  { emoji: "📖", label: "Social Playbook", active: true },
  { emoji: "🖼️", label: "Asset Library", active: false },
  { emoji: "📊", label: "Analytics Review", active: false },
  { emoji: "✅", label: "Q4 Launch Tasks", active: false },
];

const TABLE_ROWS = [
  { platform: "Instagram", status: "Needs resize", format: "1:1", due: "Today", tag: "🔴" },
  { platform: "LinkedIn",  status: "In progress",  format: "1.91:1", due: "Today", tag: "🟡" },
  { platform: "Twitter/X", status: "Draft",         format: "16:9",  due: "Tomorrow", tag: "🟡" },
  { platform: "Story",     status: "Not started",   format: "9:16",  due: "Fri",  tag: "⚪" },
  { platform: "Blog hero", status: "Not started",   format: "16:9",  due: "Fri",  tag: "⚪" },
];

export const MockNotion: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: "#191919",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: 240,
          backgroundColor: "#1f1f1f",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          padding: "16px 0",
          flexShrink: 0,
        }}
      >
        {/* Workspace name */}
        <div
          style={{
            padding: "0 12px 12px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              backgroundColor: "#2a2a2e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            L
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#e8e8e8" }}>
            LayerProof
          </span>
        </div>

        {/* Pages list */}
        {SIDEBAR_PAGES.map((page) => (
          <div
            key={page.label}
            style={{
              padding: "6px 12px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: page.active ? "rgba(255,255,255,0.06)" : "transparent",
              borderRadius: 4,
              margin: "0 4px",
            }}
          >
            <span style={{ fontSize: 14 }}>{page.emoji}</span>
            <span
              style={{
                fontSize: 14,
                color: page.active ? "#ffffff" : "rgba(255,255,255,0.55)",
                fontWeight: page.active ? 500 : 400,
              }}
            >
              {page.label}
            </span>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            height: 44,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>LayerProof</span>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Social Playbook</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(255,255,255,0.10)",
                padding: "4px 12px",
                borderRadius: 4,
              }}
            >
              Share
            </div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(255,255,255,0.10)",
                padding: "4px 12px",
                borderRadius: 4,
              }}
            >
              ···
            </div>
          </div>
        </div>

        {/* Page content */}
        <div
          style={{
            flex: 1,
            padding: "40px 60px",
            overflowY: "auto",
            backgroundColor: "#1a1a1a",
          }}
        >
          {/* Page title */}
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: 6,
            }}
          >
            📖 Social Playbook
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", marginBottom: 28 }}>
            Last edited by Tracy · 2 hours ago
          </div>

          {/* Callout block */}
          <div
            style={{
              background: "rgba(255,107,53,0.12)",
              border: "1px solid rgba(255,107,53,0.2)",
              borderRadius: 6,
              padding: "12px 16px",
              marginBottom: 24,
              fontSize: 14,
              color: "rgba(255,255,255,0.65)",
              display: "flex",
              gap: 10,
            }}
          >
            <span>⚠️</span>
            <span>
              Each platform requires a different image size. Images must be manually resized
              before uploading. See resize tracker below.
            </span>
          </div>

          {/* Section title */}
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#ffffff",
              marginBottom: 14,
            }}
          >
            Content Format Tracker
          </div>

          {/* Table */}
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.2fr 0.8fr 0.8fr 0.4fr",
                backgroundColor: "rgba(255,255,255,0.04)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                padding: "8px 16px",
              }}
            >
              {["Platform", "Status", "Format", "Due", ""].map((h, i) => (
                <div
                  key={i}
                  style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)" }}
                >
                  {h}
                </div>
              ))}
            </div>

            {/* Table rows */}
            {TABLE_ROWS.map((row, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.2fr 0.8fr 0.8fr 0.4fr",
                  padding: "10px 16px",
                  borderBottom: i < TABLE_ROWS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  alignItems: "center",
                  backgroundColor: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
                }}
              >
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
                  {row.platform}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color:
                      row.status === "Needs resize"
                        ? "#c0392b"
                        : row.status === "In progress"
                        ? "#d68910"
                        : "rgba(255,255,255,0.35)",
                    fontWeight: row.status === "Needs resize" ? 600 : 400,
                  }}
                >
                  {row.status}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.6)",
                    background: "rgba(255,255,255,0.08)",
                    padding: "2px 8px",
                    borderRadius: 4,
                    display: "inline-block",
                  }}
                >
                  {row.format}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{row.due}</div>
                <div style={{ fontSize: 14 }}>{row.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
