// src/compositions/LayerProofVellumMaster.tsx
// LayerProof Vellum — Master Video (~40.5s)
// Light theme walkthrough: More control → More consistency → More efficient → CTA

import React from "react";
import { AbsoluteFill, Sequence } from "remotion";

import { VellumHook } from "../components/scenes/vellum/VellumHook";
import { VellumNodeDemo } from "../components/scenes/vellum/VellumNodeDemo";
import { VellumConsistency } from "../components/scenes/vellum/VellumConsistency";
import { VellumFiveAngles } from "../components/scenes/vellum/VellumFiveAngles";
import { VellumEfficient } from "../components/scenes/vellum/VellumEfficient";
import { VellumPlatformScale } from "../components/scenes/vellum/VellumPlatformScale";
import { VellumCTA } from "../components/scenes/vellum/VellumCTA";
import { VellumPlatformParallel } from "../components/scenes/vellum/VellumPlatformParallel";

export const LayerProofVellumMaster: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      {/* Scene 0: Hook — 0–100f (3.3s) */}
      <Sequence from={0} durationInFrames={100}>
        <VellumHook />
      </Sequence>

      {/* Scene 1: Node Graph Demo — 100–524f (14.1s) */}
      <Sequence from={100} durationInFrames={424}>
        <VellumNodeDemo />
      </Sequence>

      {/* Scene 2: More Consistency — 524–604f (2.7s) */}
      <Sequence from={524} durationInFrames={80}>
        <VellumConsistency />
      </Sequence>

      {/* Scene 3: Five Angles — 604–964f */}
      <Sequence from={604} durationInFrames={360}>
        <VellumFiveAngles />
      </Sequence>

      {/* Scene 4: More Efficient — overlays FiveAngles at local 240 (global 844), ends at local 335 (global 939) */}
      <Sequence from={844} durationInFrames={95}>
        <VellumEfficient />
      </Sequence>

      {/* Scene 4b: Platform Parallel — 964–1204f */}
      <Sequence from={964} durationInFrames={240}>
        <VellumPlatformParallel />
      </Sequence>

      {/* Scene 6: CTA — 1204–1384f (6s) */}
      <Sequence from={1204} durationInFrames={180}>
        <VellumCTA />
      </Sequence>
    </AbsoluteFill>
  );
};

export default LayerProofVellumMaster;
