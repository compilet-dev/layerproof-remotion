// src/components/ui/MockCanva.tsx
// Simulated Canva editor — dark brand style, purple accent
import React from "react";

const PURPLE = "#7c3aed";
const PURPLE_DIM = "rgba(124,58,237,0.12)";

export const MockCanva: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0e0e10",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#fff",
      }}
    >
      {/* ── Top toolbar ─────────────────────────────────────────────────── */}
      <div
        style={{
          height: 56,
          backgroundColor: "#18181b",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 20,
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: PURPLE,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 800 }}>C</span>
          </div>
          <span style={{ color: "#fff", fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>
            Canva
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)" }} />

        {/* Toolbar actions */}
        {["File", "Edit", "Resize & Magic Switch", "Share"].map((item, i) => (
          <span
            key={item}
            style={{
              color: i === 2 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.45)",
              fontSize: 13,
              fontWeight: i === 2 ? 500 : 400,
              background: i === 2 ? PURPLE_DIM : "transparent",
              padding: i === 2 ? "4px 10px" : "0",
              borderRadius: 6,
              border: i === 2 ? `1px solid rgba(124,58,237,0.3)` : "none",
            }}
          >
            {item}
          </span>
        ))}

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          {/* Size badge */}
          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 6,
              padding: "4px 12px",
              fontSize: 12,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            1080 × 1080 px
          </div>
          {/* Publish button */}
          <div
            style={{
              background: PURPLE,
              borderRadius: 8,
              padding: "6px 18px",
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
            }}
          >
            Publish
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* ── Icon rail ─────────────────────────────────────────────────── */}
        <div
          style={{
            width: 56,
            backgroundColor: "#18181b",
            borderRight: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 16,
            gap: 6,
            flexShrink: 0,
          }}
        >
          {[
            { icon: "⊞", label: "Templates", active: false },
            { icon: "✦", label: "Elements", active: true },
            { icon: "T", label: "Text", active: false },
            { icon: "⬛", label: "Brand", active: false },
            { icon: "↑", label: "Uploads", active: false },
          ].map((item) => (
            <div
              key={item.label}
              title={item.label}
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                background: item.active ? PURPLE_DIM : "transparent",
                color: item.active ? PURPLE : "rgba(255,255,255,0.35)",
                border: item.active ? `1px solid rgba(124,58,237,0.25)` : "1px solid transparent",
                cursor: "pointer",
              }}
            >
              {item.icon}
            </div>
          ))}
        </div>

        {/* ── Left sidebar ──────────────────────────────────────────────── */}
        <div
          style={{
            width: 240,
            backgroundColor: "#141416",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            padding: "14px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 2,
            }}
          >
            Format
          </div>

          {[
            { label: "Instagram Post", ratio: "1 : 1", active: true, accent: "#e1306c" },
            { label: "Instagram Story", ratio: "9 : 16", active: false, accent: "#f77737" },
            { label: "LinkedIn Post",  ratio: "1.91 : 1", active: false, accent: "#0a66c2" },
            { label: "Twitter / X",   ratio: "16 : 9", active: false, accent: "#ffffff" },
          ].map((t) => (
            <div
              key={t.label}
              style={{
                borderRadius: 10,
                padding: "10px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: t.active ? "rgba(255,255,255,0.05)" : "transparent",
                border: t.active
                  ? `1px solid rgba(255,255,255,0.10)`
                  : "1px solid rgba(255,255,255,0.04)",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: t.active ? t.accent : "rgba(255,255,255,0.2)",
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    color: t.active ? "#fff" : "rgba(255,255,255,0.4)",
                    fontWeight: t.active ? 500 : 400,
                  }}
                >
                  {t.label}
                </span>
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.25)",
                  fontFamily: "monospace",
                }}
              >
                {t.ratio}
              </span>
            </div>
          ))}

          <div
            style={{
              marginTop: 8,
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 2,
            }}
          >
            Suggested
          </div>

          {/* Mini template thumbnails */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["#1a0a2e", "#0a1a2e", "#1a1a0a", "#0a1a10"].map((bg, i) => (
              <div
                key={i}
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 8,
                  background: bg,
                  border: i === 0
                    ? `2px solid ${PURPLE}`
                    : "1px solid rgba(255,255,255,0.08)",
                  overflow: "hidden",
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    bottom: 6,
                    left: 6,
                    right: 6,
                    height: 3,
                    borderRadius: 2,
                    background: i === 0 ? PURPLE : "rgba(255,255,255,0.12)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 14,
                    left: 6,
                    right: 20,
                    height: 3,
                    borderRadius: 2,
                    background: "rgba(255,255,255,0.1)",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Canvas area ───────────────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#0a0a0c",
          }}
        >
          {/* Canvas toolbar strip */}
          <div
            style={{
              height: 40,
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              gap: 16,
            }}
          >
            {["⟳", "⟲", "|", "Aa", "🎨", "⚡"].map((icon, i) => (
              <span
                key={i}
                style={{
                  fontSize: i === 2 ? 18 : 14,
                  color: i === 2 ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.3)",
                  cursor: i !== 2 ? "pointer" : "default",
                }}
              >
                {icon}
              </span>
            ))}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>100%</span>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.25)" }}>▾</span>
            </div>
          </div>

          {/* Canvas viewport */}
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 40,
              position: "relative",
            }}
          >
            {/* Page indicator */}
            <div
              style={{
                position: "absolute",
                top: 12,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: 11,
                color: "rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.04)",
                padding: "3px 10px",
                borderRadius: 4,
              }}
            >
              Page 1 / 1
            </div>

            {/* The canvas card */}
            <div
              style={{
                width: "60%",
                aspectRatio: "1 / 1",
                borderRadius: 6,
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,0.06), 0 8px 48px rgba(0,0,0,0.6)",
                position: "relative",
                overflow: "hidden",
                background: "#111",
              }}
            >
              <img
                src={require("../../assets/post_image.jpg")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  opacity: 0.85,
                }}
              />
              {/* Overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
                }}
              />
              {/* Text overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "18px 20px 20px",
                }}
              >
                <div
                  style={{
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: 700,
                    lineHeight: 1.3,
                    letterSpacing: -0.3,
                  }}
                >
                  AI Feature Launch
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    fontSize: 12,
                    marginTop: 4,
                    letterSpacing: 0.2,
                  }}
                >
                  layerproof.com
                </div>
              </div>
              {/* Selection handles */}
              <div
                style={{
                  position: "absolute",
                  inset: 6,
                  border: `1.5px solid ${PURPLE}`,
                  borderRadius: 3,
                  pointerEvents: "none",
                }}
              />
              {[
                { top: 3, left: 3 }, { top: 3, right: 3 },
                { bottom: 3, left: 3 }, { bottom: 3, right: 3 },
              ].map((pos, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    ...pos,
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: "#fff",
                    border: `1.5px solid ${PURPLE}`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Right properties panel ────────────────────────────────────── */}
        <div
          style={{
            width: 200,
            backgroundColor: "#141416",
            borderLeft: "1px solid rgba(255,255,255,0.06)",
            padding: "14px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Position & Size
          </div>
          {[
            { label: "W", value: "1080 px" },
            { label: "H", value: "1080 px" },
            { label: "X", value: "0 px" },
            { label: "Y", value: "0 px" },
          ].map((field) => (
            <div
              key={field.label}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.3)",
                  width: 14,
                  flexShrink: 0,
                }}
              >
                {field.label}
              </span>
              <div
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 5,
                  padding: "4px 8px",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "monospace",
                }}
              >
                {field.value}
              </div>
            </div>
          ))}

          <div
            style={{
              width: "100%",
              height: 1,
              background: "rgba(255,255,255,0.06)",
            }}
          />

          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Fill
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 5,
                background: PURPLE,
                border: "1px solid rgba(255,255,255,0.1)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.45)",
                fontFamily: "monospace",
              }}
            >
              #7c3aed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
