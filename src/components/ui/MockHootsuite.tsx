// src/components/ui/MockHootsuite.tsx
// Simulated Hootsuite social scheduling dashboard — dark sidebar, stream columns, scheduled posts
import React from "react";

const STREAMS = [
  {
    platform: "Twitter / X",
    color: "#1DA1F2",
    posts: [
      { handle: "@layerproof", time: "Scheduled · 2:00 PM", text: "AI content generation that understands your brand voice. Write once, publish everywhere." },
      { handle: "@layerproof", time: "Scheduled · 4:30 PM", text: "Introducing our most powerful feature yet. Thread incoming." },
    ],
  },
  {
    platform: "LinkedIn",
    color: "#0A66C2",
    posts: [
      { handle: "LayerProof", time: "Scheduled · 9:00 AM", text: "Excited to announce the launch of our AI content platform. Teams saving 8+ hours per week." },
      { handle: "LayerProof", time: "Draft", text: "Three months ago we set out to solve content reformatting for good..." },
    ],
  },
  {
    platform: "Instagram",
    color: "#E1306C",
    posts: [
      { handle: "@layerproof", time: "Scheduled · 11:00 AM", text: "One prompt. Every platform. AI-powered content generation is here." },
      { handle: "@layerproof", time: "Needs image · PENDING", text: "Big news. Caption ready, waiting on resize..." },
    ],
  },
];

export const MockHootsuite: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: "#111113",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Dark left sidebar */}
      <div
        style={{
          width: 64,
          backgroundColor: "#111820",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 16,
          gap: 20,
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            backgroundColor: "#FFCF00",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 800,
            color: "#1F3148",
          }}
        >
          H
        </div>
        {["📊", "📅", "✉️", "📈"].map((icon, i) => (
          <div
            key={i}
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              backgroundColor: i === 1 ? "rgba(255,255,255,0.15)" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            {icon}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <div
          style={{
            height: 56,
            backgroundColor: "#1e1e22",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: 16,
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 600, color: "#e8e8e8", flex: 1 }}>
            Streams
          </span>
          <div
            style={{
              backgroundColor: "#FFCF00",
              color: "#1F3148",
              padding: "8px 20px",
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            + New Post
          </div>
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              padding: "8px 16px",
              borderRadius: 6,
              fontSize: 14,
              color: "rgba(255,255,255,0.45)",
            }}
          >
            Compose
          </div>
        </div>

        {/* Stream columns */}
        <div
          style={{
            flex: 1,
            display: "flex",
            gap: 16,
            padding: 16,
            overflowX: "auto",
            backgroundColor: "#111113",
          }}
        >
          {STREAMS.map((stream) => (
            <div
              key={stream.platform}
              style={{
                flex: 1,
                minWidth: 280,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {/* Column header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  backgroundColor: "rgba(255,255,255,0.04)",
                  borderRadius: 8,
                  border: `1.5px solid ${stream.color}20`,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: stream.color,
                  }}
                />
                <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
                  {stream.platform}
                </span>
              </div>

              {/* Post cards */}
              {stream.posts.map((post, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: "#1e1e22",
                    borderRadius: 8,
                    padding: "12px 14px",
                    border: "1px solid rgba(255,255,255,0.07)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${stream.color}, ${stream.color}99)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        color: "#fff",
                        fontWeight: 700,
                      }}
                    >
                      LP
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                        {post.handle}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: post.time.includes("PENDING") ? "#e53935" : "rgba(255,255,255,0.4)",
                          fontWeight: post.time.includes("PENDING") ? 600 : 400,
                        }}
                      >
                        {post.time}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>
                    {post.text}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      borderTop: "1px solid rgba(255,255,255,0.07)",
                      paddingTop: 8,
                    }}
                  >
                    {["Edit", "Preview"].map((btn) => (
                      <div
                        key={btn}
                        style={{
                          fontSize: 11,
                          color: "rgba(255,255,255,0.45)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          padding: "3px 10px",
                          borderRadius: 4,
                        }}
                      >
                        {btn}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
