// src/components/ui/MockGoogleDocs.tsx
// Simulated Google Docs editor — dark top bar, toolbar, dark document with text lines and blinking cursor
import React from "react";
import { useCurrentFrame } from "remotion";

export const MockGoogleDocs: React.FC = () => {
  const frame = useCurrentFrame();
  const cursorVisible = frame % 30 < 15;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1e1e1e",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          height: 64,
          backgroundColor: "#2a2a2e",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 36,
            height: 44,
            backgroundColor: "#4285f4",
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          D
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 20, fontWeight: 500, color: "#e8e8e8" }}>
            Content Strategy Q4 2025
          </span>
          <div style={{ display: "flex", gap: 16, marginTop: 3 }}>
            {["File", "Edit", "View", "Insert", "Format", "Tools"].map((item) => (
              <span key={item} style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", cursor: "default" }}>
                {item}
              </span>
            ))}
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            backgroundColor: "#1a73e8",
            color: "#fff",
            padding: "8px 24px",
            borderRadius: 6,
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          Share
        </div>
      </div>

      {/* Toolbar */}
      <div
        style={{
          height: 48,
          backgroundColor: "#242428",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 8,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {["B", "I", "U", "S"].map((btn) => (
          <div
            key={btn}
            style={{
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 17,
              fontWeight: btn === "B" ? 700 : 400,
              fontStyle: btn === "I" ? "italic" : "normal",
              textDecoration:
                btn === "U" ? "underline" : btn === "S" ? "line-through" : "none",
              color: "rgba(255,255,255,0.6)",
              borderRadius: 4,
            }}
          >
            {btn}
          </div>
        ))}
        <div style={{ width: 1, height: 24, backgroundColor: "rgba(255,255,255,0.15)", margin: "0 6px" }} />
        <div
          style={{
            padding: "6px 14px",
            fontSize: 15,
            color: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 4,
            backgroundColor: "#3a3a3e",
          }}
        >
          Arial ▾
        </div>
        <div
          style={{
            padding: "6px 10px",
            fontSize: 15,
            color: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 4,
            backgroundColor: "#3a3a3e",
          }}
        >
          11 ▾
        </div>
      </div>

      {/* Document area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          paddingTop: 36,
          backgroundColor: "#1a1a1e",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "65%",
            backgroundColor: "#2a2a2e",
            boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
            padding: "60px 70px",
            position: "relative",
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: 30,
              fontWeight: 400,
              color: "#e8e8e8",
              marginBottom: 30,
              fontFamily: "Georgia, serif",
            }}
          >
            Social Media Content Plan
          </div>

          {/* Text lines */}
          {[100, 85, 90, 70, 95, 80, 60, 88].map((width, i) => (
            <div
              key={i}
              style={{
                width: `${width}%`,
                height: 16,
                backgroundColor: "rgba(255,255,255,0.08)",
                borderRadius: 4,
                marginBottom: i === 3 ? 26 : 14,
              }}
            />
          ))}

          {/* Blinking cursor */}
          <div
            style={{
              position: "absolute",
              top: 160,
              left: 320,
              width: 2,
              height: 22,
              backgroundColor: "#1a73e8",
              opacity: cursorVisible ? 1 : 0,
            }}
          />
        </div>
      </div>
    </div>
  );
};
