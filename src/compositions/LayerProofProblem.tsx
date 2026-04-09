// src/compositions/LayerProofProblem.tsx
// Teaser 1: "The Problem" — bold theme variant

import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  TheSetup,
  RewriteLoop,
  TensionMoment,
  ProblemTagline,
  ProblemLogoOut,
} from "../components/scenes/problem";
import { ThemeProvider } from "../lib/theme";
import { boldTheme } from "../lib/themes/bold";

const TOTAL_FRAMES = 990;

const BackgroundMusic: React.FC = () => {
  const frame = useCurrentFrame();
  const volume = interpolate(
    frame,
    [0, 30, TOTAL_FRAMES - 60, TOTAL_FRAMES],
    [0, 0.7, 0.7, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return <Audio src={staticFile("background-musicA.mp3")} volume={volume} loop />;
};

export const LayerProofProblem: React.FC = () => {
  return (
    <ThemeProvider theme={boldTheme}>
      <AbsoluteFill>
        <BackgroundMusic />

        {/* Scene 1: The Setup — 0–210f (7s) */}
        <Sequence from={0} durationInFrames={210}>
          <TheSetup />
        </Sequence>

        {/* Scene 2: Rewrite Loop — 210–390f (6s) */}
        <Sequence from={210} durationInFrames={180}>
          <RewriteLoop />
        </Sequence>

        {/* Scene 3: Tension — 390–660f (9s) */}
        <Sequence from={390} durationInFrames={270}>
          <TensionMoment />
        </Sequence>

        {/* Scene 4: Tagline — 660–840f (6s) */}
        <Sequence from={660} durationInFrames={180}>
          <ProblemTagline />
        </Sequence>

        {/* Scene 5: Logo out — 840–990f (5s) */}
        <Sequence from={840} durationInFrames={150}>
          <ProblemLogoOut />
        </Sequence>
      </AbsoluteFill>
    </ThemeProvider>
  );
};

export default LayerProofProblem;
