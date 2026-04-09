# Remotion Skill

## What is Remotion
Remotion is a React-based framework for creating videos programmatically. Videos are React components where `frame` is the time variable.

## Core Concepts

### useCurrentFrame
```tsx
const frame = useCurrentFrame(); // 0-indexed frame number
```

### useVideoConfig
```tsx
const { fps, durationInFrames, width, height } = useVideoConfig();
```

### interpolate
Maps frame numbers to values:
```tsx
const opacity = interpolate(
  frame,          // input value
  [0, 30],        // input range (frames)
  [0, 1],         // output range
  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
);
```

### spring
Physics-based animation:
```tsx
const scale = spring({
  frame,
  fps,
  config: { stiffness: 80, damping: 22 }, // apple config
  delay: 10, // optional: delay in frames
});
```

**Named spring configs** (use `theme.motion.*`):
- `apple`: stiffness 80, damping 22 — default, Apple-keynote feel
- `gentle`: stiffness 60, damping 20 — slow floats
- `snappy`: stiffness 100, damping 18 — quick reveals
- `slow`: stiffness 40, damping 25 — very deliberate entrances

### Sequence
Offsets child frame count:
```tsx
<Sequence from={30} durationInFrames={60}>
  <MyScene /> {/* sees frame 0-59 internally */}
</Sequence>
```

### AbsoluteFill
Full-frame container:
```tsx
const { colors } = useTheme();
<AbsoluteFill style={{ background: colors.bgDark }}>
  {/* fills 100% width and height */}
</AbsoluteFill>
```

### Composition
Registers a video:
```tsx
<Composition
  id="my-video"
  component={MyComponent}
  durationInFrames={300}
  fps={30}
  width={1920}
  height={1080}
/>
```

## Theme System

All colors and motion configs come from `src/lib/theme.ts` via `ThemeProvider` + `useTheme()`. Never hardcode hex values.

```tsx
import { ThemeProvider, useTheme } from '../../lib/theme';
import { boldTheme } from '../../lib/theme';

// In a composition root:
<ThemeProvider theme={boldTheme}>
  <MyScene />
</ThemeProvider>

// In a scene component:
const theme = useTheme();
// theme.colors, theme.motion, theme.glass
```

**Bold theme token values:**
| Token | Value |
|---|---|
| `colors.bgDark` | `#080808` |
| `colors.bgMid` | `#111111` |
| `colors.bgSurface` | `#1A1A1A` |
| `colors.accentPink` | `#FF589B` |
| `colors.accentYellow` | `#FFD600` |
| `colors.white` | `#FFFFFF` |
| `colors.gray` | `#888888` |
| `glass.bg` | `rgba(255,255,255,0.06)` |
| `glass.border` | `rgba(255,255,255,0.12)` |
| `motion.apple` | `{ stiffness: 80, damping: 22 }` |
| `motion.gentle` | `{ stiffness: 60, damping: 20 }` |
| `motion.snappy` | `{ stiffness: 100, damping: 18 }` |
| `motion.slow` | `{ stiffness: 40, damping: 25 }` |

## LayerProof Animation Helpers

All helpers live in `src/lib/animations.ts`. Import as needed:

```tsx
import {
  fadeIn, fadeOut, scaleIn, staggerReveal,
  floatY, orbitAngle, glassCard, springReveal,
  getTypedText, positionAt, PLATFORMS,
  easeInOut, easeOut, easeIn,
} from '../../lib/animations';
```

| Export | Description |
|---|---|
| `fadeIn(frame, start, duration)` | Returns opacity 0→1 |
| `fadeOut(frame, start, duration)` | Returns opacity 1→0 |
| `scaleIn(frame, fps, config?)` | Spring-based scale 0→1 |
| `staggerReveal(frame, index, stagger?)` | Per-item staggered opacity |
| `floatY(frame, amplitude, speed)` | Sinusoidal vertical float |
| `orbitAngle(frame, speed, offset?)` | Angle in radians for orbital motion |
| `glassCard` | CSS style object for glass surface |
| `springReveal(frame, fps, config?)` | Spring value for enter reveal |
| `getTypedText(text, frame, charsPerFrame)` | Typewriter substring |
| `positionAt(x, y)` | Absolute position style helper |
| `PLATFORMS` | Array: `['Instagram','LinkedIn','Twitter/X','Blog']` |
| `easeInOut / easeOut / easeIn` | Easing functions for `interpolate` |

> ⚠️ `BRAND` const in `animations.ts` is a legacy V1 artifact — its `bgDark` value is `#F8F8F8` (light!). Do NOT use `BRAND` for colors. Use `useTheme()` instead.

## Audio in Sequences

Nest `<Audio>` inside an inner `<Sequence>` with an offset to sync audio timing:

```tsx
<Sequence from={0} durationInFrames={990}>
  <Sequence from={15}> {/* offset so audio starts after visual fade-in */}
    <Audio src={staticFile('audio/scene1.mp3')} volume={0.8} />
  </Sequence>
  <MyScene />
</Sequence>
```

## Common Patterns

### Stagger word reveal
```tsx
const words = text.split(' ');
return (
  <div>
    {words.map((word, i) => {
      const wordOpacity = interpolate(frame, [i * 4, i * 4 + 12], [0, 1], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      });
      const wordY = interpolate(frame, [i * 4, i * 4 + 12], [20, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      });
      return (
        <span key={i} style={{ opacity: wordOpacity, transform: `translateY(${wordY}px)`, display: 'inline-block', marginRight: 8 }}>
          {word}
        </span>
      );
    })}
  </div>
);
```

### Panel split animation
```tsx
const panels = ['Instagram', 'LinkedIn', 'Twitter', 'Blog'];
panels.map((panel, i) => {
  const delay = i * 8;
  const panelScale = spring({ frame: Math.max(0, frame - delay), fps, config: { stiffness: 80, damping: 22 } });
  return (
    <div key={panel} style={{ transform: `scale(${panelScale})`, opacity: panelScale }}>
      {/* panel content */}
    </div>
  );
});
```

### Slow camera push
```tsx
// Simulates slow dolly/push in with CSS scale
const cameraScale = interpolate(frame, [0, durationInFrames], [1, 1.08], {
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
});
<AbsoluteFill style={{ transform: `scale(${cameraScale})` }}>
```

### Glass card
```tsx
const { glass } = useTheme();
<div style={{
  background: glass.bg,             // rgba(255,255,255,0.06)
  border: `1px solid ${glass.border}`, // rgba(255,255,255,0.12)
  borderRadius: 16,
  backdropFilter: 'blur(20px)',
  padding: 32,
}}>
```

## Registered Composition IDs

| ID | Frames | Dimensions |
|---|---|---|
| `layerproof-problem` | 990 | 1920×1080 |
| `layerproof-solution` | 1330 | 1920×1080 |
| `layerproof-gif-link` | 300 | 1200×630 |
| `layerproof-gif-prompt` | 360 | 1270×760 |
| `layerproof-gif-slides` | 205 | 1200×675 |

## Render Commands
```bash
# Preview in studio
npm run dev

# Render local
npx remotion render [composition-id] --output out/video.mp4

# Render with quality
npx remotion render [id] --codec h264 --crf 18
```
