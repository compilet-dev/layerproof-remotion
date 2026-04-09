// src/components/scenes/problem/ProblemLogoOut.tsx
// Scene 5: Problem logo out (840–990f) — mirrors SolutionTagline animation

import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fadeIn, fadeOut } from "../../../lib/animations";
import { useTheme } from "../../../lib/theme";

export const ProblemLogoOut: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // Dark flash receiver — fades from 1→0 over first 35 frames
  const flashFadeOut = interpolate(frame, [0, 35], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tagline appears first at center
  const taglineOpacity = fadeIn(frame, 38, 35);

  // Logo scales in after tagline settles
  const logoOpacity = fadeIn(frame, 80, 40);
  const logoSpring = spring({
    frame: Math.max(0, frame - 80),
    fps,
    config: { stiffness: 40, damping: 22 },
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.92, 1]);

  // Tagline slides from center down to final position as logo appears
  const taglineSlide = spring({
    frame: Math.max(0, frame - 80),
    fps,
    config: { stiffness: 120, damping: 18 },
  });
  const taglineY = interpolate(taglineSlide, [0, 1], [0, 110]);

  // Scene exit
  const exitOpacity = fadeOut(frame, 118, 28);

  return (
    <AbsoluteFill style={{ background: "#080808" }}>
      {/* Subtle vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Content wrapper — fades out at exit, background stays solid */}
      <div style={{ position: "absolute", inset: 0, opacity: exitOpacity }}>
        {/* Logo — fades in above center */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, calc(-50% - 30px)) scale(${logoScale})`,
            opacity: logoOpacity,
          }}
        >
          <img
            src={require("../../../assets/layerproof-logo-white.png")}
            alt="LayerProof Logo"
            style={{
              width: 800,
              height: 200,
              objectFit: "contain",
            }}
          />
        </div>

        {/* Tagline — starts centered, slides down as logo appears */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, calc(-50% + ${taglineY}px))`,
            opacity: taglineOpacity,
            color: "rgba(255,255,255,0.55)",
            fontFamily: theme.font.family,
            fontSize: 40,
            fontWeight: theme.font.weightLight,
            letterSpacing: 8,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          There's a better way.
        </div>
      </div>

      {/* Dark flash receiver — sits on top, fades out */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#080808",
          opacity: flashFadeOut,
          zIndex: 10,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
