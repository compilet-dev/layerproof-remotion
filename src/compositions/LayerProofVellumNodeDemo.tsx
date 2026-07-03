// src/compositions/LayerProofVellumNodeDemo.tsx
// Focused cut: opening title → node graph demo → CTA (~24.1s)
//
// Frame layout:
//   0  – 120  VellumVisualControl  opening title (4s)
//   120 – 544  VellumNodeDemo      interactive canvas demo (~14.1s)
//   544 – 724  VellumCTA           closing CTA (6s)

import React from "react";
import { AbsoluteFill, Sequence } from "remotion";

import { VellumVisualControl } from "../components/scenes/vellum/VellumVisualControl";
import { VellumNodeDemo } from "../components/scenes/vellum/VellumNodeDemo";
import { VellumCTA } from "../components/scenes/vellum/VellumCTA";

export const LayerProofVellumNodeDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      {/* Opening: "LayerProof Vellum puts visual control back in your hands" */}
      <Sequence from={0} durationInFrames={120}>
        <VellumVisualControl />
      </Sequence>

      {/* Demo: node graph canvas walkthrough */}
      <Sequence from={120} durationInFrames={424}>
        <VellumNodeDemo />
      </Sequence>

      {/* CTA: "Try LayerProof Vellum today." */}
      <Sequence from={544} durationInFrames={180}>
        <VellumCTA />
      </Sequence>
    </AbsoluteFill>
  );
};

export default LayerProofVellumNodeDemo;
