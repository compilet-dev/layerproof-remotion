// src/components/scenes/solution/SolutionTagline.tsx
// Scene 5: Tagline appears centered, then logo fades in above and tagline slides down below it

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fadeIn, fadeOut } from "../../../lib/animations";
import { useTheme } from "../../../lib/theme";
import { ANTON_FAMILY } from "../../../lib/loadFont";

export const SolutionTagline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // Tagline appears first — slow fade in at center
  const taglineOpacity = fadeIn(frame, 20, 40);

  // Logo appears after tagline
  const logoOpacity = fadeIn(frame, 90, 50);
  const logoSpring = spring({
    frame: Math.max(0, frame - 90),
    fps,
    config: { stiffness: 40, damping: 22 },
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.92, 1]);

  // Tagline slides from screen center to its final position below the logo.
  // Logo sits at -30px from center, tagline at +110px — group is visually centered.
  const taglineSlide = spring({
    frame: Math.max(0, frame - 90),
    fps,
    config: { stiffness: 120, damping: 18 },
  });
  const taglineY = interpolate(taglineSlide, [0, 1], [0, 110]);

  // Scene exit
  const exitOpacity = fadeOut(frame, 190, 35);

  return (
    <AbsoluteFill style={{ background: "#080808" }}>
      {/* Subtle vignette — always visible, never transparent */}
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
            fontFamily: ANTON_FAMILY,
            fontSize: 54,
            fontWeight: 400,
            letterSpacing: 2,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          One prompt. Every platform.
        </div>
      </div>
    </AbsoluteFill>
  );
};
