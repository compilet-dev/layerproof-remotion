// src/compositions/LayerProofSolution.tsx
// Teaser 2: "The Solution" — bold theme variant

import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import {
  OpeningQuestion,
  DashboardReveal,
  OnePrompt,
  SplitExplosion,
  UIFloat,
  SolutionTagline,
} from "../components/scenes/solution";
import { ThemeProvider } from "../lib/theme";
import { boldTheme } from "../lib/themes/bold";

const BG_MUSIC_FRAMES = 1175;

const BackgroundMusic: React.FC = () => {
  const frame = useCurrentFrame();
  const volume = interpolate(
    frame,
    [0, 20, BG_MUSIC_FRAMES - 60, BG_MUSIC_FRAMES],
    [0, 0.08, 0.08, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return <Audio src={staticFile("background-music.mp3")} volume={volume} loop />;
};

export const LayerProofSolution: React.FC = () => {
  return (
    <ThemeProvider theme={boldTheme}>
      <AbsoluteFill>
        {/* Scene 0: Opening hook question — 0–155f (5.2s) */}
        <Sequence from={0} durationInFrames={155}>
          <Sequence from={15}>
            <Audio src={staticFile("opening_question.mp3")} />
          </Sequence>
          <OpeningQuestion />
        </Sequence>

        {/* Background music — starts at scene 1, fades in and out */}
        <Sequence from={155}>
          <BackgroundMusic />
        </Sequence>

        {/* Scene 1: Logo → prompt reveal — 155–305f (5s) */}
        <Sequence from={155} durationInFrames={150}>
          <Sequence from={5}>
            <Audio
              src={staticFile("star_sfx.wav")}
              startFrom={30}
              volume={0.12}
            />
          </Sequence>
          <Sequence from={60}>
            <Audio src={staticFile("meetLayerProof.mp3")} />
          </Sequence>
          <DashboardReveal />
        </Sequence>

        {/* Scene 2: One prompt + camera zoom — 305–510f (6.8s) */}
        <Sequence from={305} durationInFrames={205}>
          <Sequence from={0}>
            <Audio src={staticFile("prompt.mp3")} />
          </Sequence>
          <OnePrompt />
        </Sequence>

        {/* Scene 3: Editor / LinkedIn zoom — 510–890f (12.7s) */}
        <Sequence from={510} durationInFrames={380}>
          <Sequence from={0}>
            <Audio src={staticFile("editor.mp3")} />
          </Sequence>
          <SplitExplosion />
        </Sequence>

        {/* Scene 4: Platform slider — 890–1100f (7s) */}
        <Sequence from={890} durationInFrames={210}>
          <Sequence from={0}>
            <Audio src={staticFile("UIFloat.mp3")} />
          </Sequence>
          <UIFloat />
        </Sequence>

        {/* Scene 5: Final tagline — 1100–1330f (7.7s) */}
        <Sequence from={1100} durationInFrames={230}>
          <Sequence from={25}>
            <Audio src={staticFile("SolutionTagline.mp3")} />
          </Sequence>
          <SolutionTagline />
        </Sequence>
      </AbsoluteFill>
    </ThemeProvider>
  );
};

export default LayerProofSolution;
