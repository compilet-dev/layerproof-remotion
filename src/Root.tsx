// src/Root.tsx
// Registers all LayerProof video compositions

import React from 'react';
import { Composition } from 'remotion';
import { LayerProofProblem } from './compositions/LayerProofProblem';
import { LayerProofSolution } from './compositions/LayerProofSolution';
import { LayerProofVellumMaster } from './compositions/LayerProofVellumMaster';
import { LayerProofVellumNodeDemo } from './compositions/LayerProofVellumNodeDemo';
import { PromptMultiPlatform } from './compositions/gifs/PromptMultiPlatform';
import { AISlideStack } from './compositions/gifs/AISlideStack';
import { LayerProofBrandKit } from './compositions/LayerProofBrandKit';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Teaser 1: The Problem — 30s, bold theme */}
      <Composition
        id="layerproof-problem"
        component={LayerProofProblem}
        durationInFrames={990}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Teaser 2: The Solution — ~45s, bold theme */}
      <Composition
        id="layerproof-solution"
        component={LayerProofSolution}
        durationInFrames={1330}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* GIF: Prompt → Editor Generation → Float — 12s loopable */}
      <Composition
        id="layerproof-gif-prompt"
        component={PromptMultiPlatform}
        durationInFrames={360}
        fps={30}
        width={1270}
        height={760}
      />

      {/* Vellum Master Video — ~43s product walkthrough */}
      <Composition
        id="layerproof-vellum-master"
        component={LayerProofVellumMaster}
        durationInFrames={1384}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Vellum Node Demo cut — opening title + node demo + CTA (~24.1s) */}
      <Composition
        id="layerproof-vellum-node-demo"
        component={LayerProofVellumNodeDemo}
        durationInFrames={724}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* GIF: AI Slide Stack — 6s loopable */}
      <Composition
        id="layerproof-gif-slides"
        component={AISlideStack}
        durationInFrames={205}
        fps={30}
        width={1200}
        height={675}
        posterFrame={50}
      />

      {/* Brand Kit Feature Video — 57s */}
      <Composition
        id="layerproof-brand-kit"
        component={LayerProofBrandKit}
        durationInFrames={1679}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
