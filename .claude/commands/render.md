# /render

Renders one or both LayerProof teaser videos.

## Usage
```
/render [problem|solution|all|gif-link|gif-prompt|gif-slides]
```

## Examples
```
/render problem
/render solution
/render all
/render gif-link
```

## What this command does
1. Validates all scene components compile without errors (`npx tsc --noEmit`)
2. Runs the appropriate render command
3. Reports output file location and file size

## Render Mappings

### Teaser Videos
| Argument | Composition ID | Output | Frames | Dimensions |
|---|---|---|---|---|
| `problem` | `layerproof-problem` | `out/layerproof-problem.mp4` | 990 | 1920×1080 |
| `solution` | `layerproof-solution` | `out/layerproof-solution.mp4` | 1330 | 1920×1080 |
| `all` | both | renders sequentially | — | — |

### GIF Compositions
| Argument | Composition ID | Output | Frames | Dimensions |
|---|---|---|---|---|
| `gif-link` | `layerproof-gif-link` | `out/layerproof-gif-link.gif` | 300 | 1200×630 |
| `gif-prompt` | `layerproof-gif-prompt` | `out/layerproof-gif-prompt.gif` | 360 | 1270×760 |
| `gif-slides` | `layerproof-gif-slides` | `out/layerproof-gif-slides.gif` | 205 | 1200×675 |

## Agent Instructions
Run these bash commands in sequence:
1. `npx tsc --noEmit` — check for type errors first
2. If errors: fix them before rendering
3. `mkdir -p out`
4. Run the appropriate `npx remotion render` command
5. Report: file size, duration, and path
