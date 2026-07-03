// src/components/scenes/vellum/VellumHook.tsx
// Scene 0 — Hook (local frames 0–100)
// "AI Image Lab, now with" exits left; "more [control]" flows in from right — continuous pan feel

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { easeIO3, easeOut3 } from "../../../lib/animations";

const INTER = '"Inter", "SF Pro Display", -apple-system, sans-serif';

// ── Timing ────────────────────────────────────────────────────────────────────
const LEAD_IN_START = 5;
const LEAD_IN_END = 22;
const LEAD_OUT_START = 40;
const LEAD_OUT_END = 62;

const MORE_START = 48;  // "more" group begins sliding in from right
const MORE_STAGGER = 4;
const CONTROL_START = 66;

const EXIT_START = 81;
const EXIT_END = 98;

const PINK = "#FF589B";
const MORE_LETTERS = ["M", "o", "r", "e"];


export const VellumHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Scene exit ────────────────────────────────────────────────────────────
  const sceneOpacity = interpolate(frame, [EXIT_START, EXIT_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Lead text ─────────────────────────────────────────────────────────────
  const leadFadeIn = interpolate(frame, [LEAD_IN_START, LEAD_IN_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const leadExitT = easeIO3(
    interpolate(frame, [LEAD_OUT_START, LEAD_OUT_END], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const leadOpacity = leadFadeIn * (1 - leadExitT);
  // Exits to the left — same direction as the panning conveyor feel
  const leadX = -380 * leadExitT;

  // ── "more [control]" group — slides in from right to center ──────────────
  // Starts 360px to the right, settles at 0 (centered). Overlaps with lead exit.
  const mcRaw = interpolate(frame, [MORE_START, CONTROL_START + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const mcX = interpolate(easeOut3(mcRaw), [0, 1], [360, 0]);

  // ── "more" letters — vertical kinetic stagger on top of container slide ──
  const letterAnims = MORE_LETTERS.map((_, i) => {
    const delay = MORE_START + i * MORE_STAGGER;
    const s = spring({
      frame: Math.max(0, frame - delay),
      fps,
      config: { stiffness: 120, damping: 16 },
    });
    const opacity = interpolate(frame, [delay, delay + 10], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const y = interpolate(s, [0, 1], [32, 0]);
    return { opacity, y };
  });

  // ── Decoration ────────────────────────────────────────────────────────────
  const decoBase = interpolate(frame, [0, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * interpolate(frame, [EXIT_START, EXIT_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Independent float phases so nothing bobs in sync
  const t = frame / 30;
  const floatA = Math.sin(t * Math.PI * 0.38) * 5;
  const floatB = Math.sin(t * Math.PI * 0.31 + 1.0) * 7;
  const floatC = Math.sin(t * Math.PI * 0.42 + 2.1) * 4;
  const floatD = Math.sin(t * Math.PI * 0.28 + 3.3) * 6;
  const floatE = Math.sin(t * Math.PI * 0.35 + 0.6) * 5;

  // ── "control" chip ────────────────────────────────────────────────────────
  const controlSpring = spring({
    frame: Math.max(0, frame - CONTROL_START),
    fps,
    config: { stiffness: 85, damping: 22 },
  });
  const controlOpacity = interpolate(
    frame,
    [CONTROL_START, CONTROL_START + 10],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const controlScale = interpolate(controlSpring, [0, 1], [0.94, 1]);

  return (
    <AbsoluteFill style={{ background: "#FFFFFF", opacity: sceneOpacity }}>
      {/* Edge vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 88% 78% at 50% 50%, transparent 52%, rgba(205,205,215,0.25) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ══ Ghost outline cards — outline only, no detail ══ */}

      {/* Card A — top-left, partially clipped, list style */}
      <div style={{ position: "absolute", left: -28, top: 55, width: 340, opacity: decoBase * 0.28, transform: `translateY(${floatA}px) rotate(-4deg)`, transformOrigin: "top left", pointerEvents: "none", border: "1px solid rgba(0,0,0,0.11)", borderRadius: 18, background: "rgba(255,255,255,0.55)", overflow: "hidden" }}>
        {/* chrome bar */}
        <div style={{ height: 38, borderBottom: "1px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "center", padding: "0 14px", gap: 7 }}>
          <div style={{ width: 38, height: 10, borderRadius: 5, background: "rgba(0,0,0,0.08)" }} />
          <div style={{ flex: 1 }} />
          <div style={{ width: 20, height: 10, borderRadius: 5, background: "rgba(0,0,0,0.05)" }} />
        </div>
        {/* rows */}
        {[100, 70, 80, 55].map((w, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px" }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.10)", flexShrink: 0 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
              <div style={{ height: 8, width: `${w}%`, borderRadius: 4, background: "rgba(0,0,0,0.08)" }} />
              <div style={{ height: 6, width: `${w * 0.65}%`, borderRadius: 4, background: "rgba(0,0,0,0.05)" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Card B — top-right, partially clipped */}
      <div style={{ position: "absolute", right: -22, top: 40, width: 310, opacity: decoBase * 0.25, transform: `translateY(${floatB}px) rotate(5deg)`, transformOrigin: "top right", pointerEvents: "none", border: "1px solid rgba(0,0,0,0.10)", borderRadius: 18, background: "rgba(255,255,255,0.5)", overflow: "hidden" }}>
        <div style={{ height: 36, borderBottom: "1px solid rgba(0,0,0,0.06)" }} />
        {[90, 75, 85, 60, 70].map((w, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.09)", flexShrink: 0 }} />
            <div style={{ height: 7, width: `${w}%`, borderRadius: 4, background: "rgba(0,0,0,0.07)" }} />
          </div>
        ))}
      </div>

      {/* Card C — bottom-left, prompt-style */}
      <div style={{ position: "absolute", left: 64, bottom: 70, width: 370, opacity: decoBase * 0.26, transform: `translateY(${floatC}px) rotate(-6deg)`, transformOrigin: "bottom left", pointerEvents: "none", border: "1px solid rgba(0,0,0,0.10)", borderRadius: 20, background: "rgba(255,255,255,0.5)", overflow: "hidden" }}>
        <div style={{ height: 44, borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", padding: "0 14px", gap: 8 }}>
          <div style={{ width: 80, height: 22, borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.03)" }} />
        </div>
        <div style={{ padding: "16px 16px 10px", display: "flex", flexDirection: "column", gap: 7 }}>
          <div style={{ height: 8, width: "88%", borderRadius: 4, background: "rgba(0,0,0,0.07)" }} />
          <div style={{ height: 8, width: "72%", borderRadius: 4, background: "rgba(0,0,0,0.05)" }} />
          <div style={{ height: 8, width: "55%", borderRadius: 4, background: "rgba(0,0,0,0.04)" }} />
        </div>
        <div style={{ height: 44, borderTop: "1px solid rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 14px" }}>
          <div style={{ width: 70, height: 26, borderRadius: 13, border: "1px solid rgba(0,0,0,0.09)", background: "rgba(0,0,0,0.04)" }} />
        </div>
      </div>

      {/* Card D — bottom-right, flow / node style */}
      <div style={{ position: "absolute", right: 60, bottom: 55, width: 440, height: 170, opacity: decoBase * 0.24, transform: `translateY(${floatD}px) rotate(5deg)`, transformOrigin: "bottom right", pointerEvents: "none" }}>
        {/* SVG wire outlines */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
          <path d="M 120,85 C 142,85 138,55 160,55" fill="none" stroke="rgba(0,0,0,0.13)" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M 280,55 C 302,55 298,85 320,85" fill="none" stroke="rgba(0,0,0,0.13)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        {/* Node 1 */}
        <div style={{ position: "absolute", left: 0, top: 52, width: 120, height: 66, border: "1px solid rgba(0,0,0,0.10)", borderRadius: 14, background: "rgba(255,255,255,0.55)" }}>
          <div style={{ margin: "12px 12px 6px", height: 7, width: "60%", borderRadius: 4, background: "rgba(0,0,0,0.08)" }} />
          <div style={{ margin: "0 12px", height: 6, width: "40%", borderRadius: 4, background: "rgba(0,0,0,0.05)" }} />
        </div>
        {/* Node 2 (center, raised) */}
        <div style={{ position: "absolute", left: 160, top: 22, width: 120, height: 66, border: "1px solid rgba(0,0,0,0.10)", borderRadius: 14, background: "rgba(255,255,255,0.55)" }}>
          <div style={{ margin: "12px 12px 6px", height: 7, width: "70%", borderRadius: 4, background: "rgba(0,0,0,0.08)" }} />
          <div style={{ margin: "0 12px", height: 6, width: "50%", borderRadius: 4, background: "rgba(0,0,0,0.05)" }} />
        </div>
        {/* Node 3 */}
        <div style={{ position: "absolute", left: 320, top: 52, width: 120, height: 66, border: "1px solid rgba(0,0,0,0.10)", borderRadius: 14, background: "rgba(255,255,255,0.55)" }}>
          <div style={{ margin: "12px 12px 6px", height: 7, width: "55%", borderRadius: 4, background: "rgba(0,0,0,0.08)" }} />
          <div style={{ margin: "0 12px", height: 6, width: "35%", borderRadius: 4, background: "rgba(0,0,0,0.05)" }} />
        </div>
      </div>

      {/* Card E — center-top-left, small dropdown style */}
      <div style={{ position: "absolute", left: 380, top: 68, width: 230, opacity: decoBase * 0.20, transform: `translateY(${floatE}px) rotate(-3deg)`, transformOrigin: "top center", pointerEvents: "none", border: "1px solid rgba(0,0,0,0.10)", borderRadius: 16, background: "rgba(255,255,255,0.5)", overflow: "hidden" }}>
        {[85, 65, 75, 50].map((w, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderBottom: i < 3 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, border: "1px solid rgba(0,0,0,0.09)", flexShrink: 0 }} />
            <div style={{ height: 7, width: `${w}%`, borderRadius: 4, background: "rgba(0,0,0,0.07)" }} />
          </div>
        ))}
      </div>

      {/* ── Phase 1: lead text — exits left ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: leadOpacity,
          transform: `translateX(${leadX}px)`,
        }}
      >
        <span
          style={{
            fontFamily: INTER,
            fontSize: 120,
            fontWeight: 600,
            color: "#0A0A0A",
            letterSpacing: -2,
            whiteSpace: "nowrap",
          }}
        >
          AI Image Lab, now with
        </span>
      </div>

      {/* ── Phase 2: "more [control]" — slides in from right, settles center ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateX(${mcX}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
          }}
        >
          {/* "more" letters */}
          {MORE_LETTERS.map((letter, i) => (
            <span
              key={letter + i}
              style={{
                fontFamily: INTER,
                fontSize: 120,
                fontWeight: 600,
                color: "#0A0A0A",
                letterSpacing: "-2px",
                lineHeight: 1,
                display: "inline-block",
                opacity: letterAnims[i].opacity,
                transform: `translateY(${letterAnims[i].y}px)`,
              }}
            >
              {letter}
            </span>
          ))}

          {/* Spacer */}
          <span style={{ display: "inline-block", width: 24 }} />

          {/* Control — pink text */}
          <span
            style={{
              fontFamily: INTER,
              fontSize: 120,
              fontWeight: 600,
              color: PINK,
              letterSpacing: "-2px",
              lineHeight: 1,
              display: "inline-block",
              opacity: controlOpacity,
              transform: `translateY(${interpolate(controlSpring, [0, 1], [32, 0])}px)`,
            }}
          >
            Control
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
