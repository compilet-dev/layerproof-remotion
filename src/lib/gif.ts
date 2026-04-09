// src/lib/gif.ts
// GIF composition constants and timing boundaries

export const GIF = {
  width: 1200,
  height: 630,
  fps: 30,
  // Phase boundaries (global frames)
  PHASE_PROMPT_START: 0,
  PHASE_EDITOR_START: 100,
  TOTAL_FRAMES: 300,
} as const;
