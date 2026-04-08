# TextRotate

Cycling text display that rotates through an array of strings with staggered per-character (or per-word/line) enter/exit animations. Supports imperative control via `ref`.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Staggered entrance** | Each character/word enters with a configurable delay (default 30ms from first). Spring physics (`stiffness: 300, damping: 25`) drive the motion. |
| **Slide up/out** | Default animation: characters slide up from `y: 100%` and exit to `y: -120%`, with opacity fading. |
| **Stagger origin** | Configurable stagger source: `first`, `last`, `center`, `random`, or a numeric index — creating wave, converge, or scatter patterns. |
| **Auto rotation** | By default cycles through texts every 2000ms. Can be disabled with `auto={false}` for manual control. |
| **Width stability** | An invisible spacer grid renders all texts overlapping in one cell, so the container width always matches the widest text — no layout shift. |

## How It Works

1. **Text splitting**: `splitText()` splits the current string by characters (using `Intl.Segmenter` when available for emoji support), words, lines, or a custom separator.
2. **AnimatePresence mode="wait"**: Only one text variant is mounted at a time. Exit animation completes before the next enters.
3. **Stagger calculation**: `getStaggerDelay()` computes per-element delay based on the chosen `staggerFrom` strategy.
4. **Imperative API**: `useImperativeHandle` exposes `next()`, `previous()`, `jumpTo(index)`, and `reset()` via a forwarded ref.
5. **Spacer trick**: The invisible grid with all texts stacked in `gridArea: '1 / 1'` establishes the maximum width without causing layout thrashing during transitions.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `texts` | `string[]` | — | Array of strings to cycle through |
| `rotationInterval` | `number` | `2000` | Milliseconds between rotations |
| `initial` | `object` | `{ y: '100%', opacity: 0 }` | Framer Motion initial state |
| `animate` | `object` | `{ y: 0, opacity: 1 }` | Framer Motion animate state |
| `exit` | `object` | `{ y: '-120%', opacity: 0 }` | Framer Motion exit state |
| `transition` | `object` | Spring (300/25) | Per-element transition config |
| `staggerDuration` | `number` | `0.03` | Delay between each element (seconds) |
| `staggerFrom` | `'first' \| 'last' \| 'center' \| 'random' \| number` | `'first'` | Where the stagger wave originates |
| `splitBy` | `'characters' \| 'words' \| 'lines' \| string` | `'characters'` | How to split text for animation |
| `loop` | `boolean` | `true` | Wrap around at ends |
| `auto` | `boolean` | `true` | Auto-advance on interval |
| `onNext` | `(index: number) => void` | — | Called when text changes |
| `mainClassName` | `string` | — | Class for outer container |
| `splitLevelClassName` | `string` | — | Class for animation wrapper |
| `elementLevelClassName` | `string` | — | Class for each animated element |
| `mainStyle` | `CSSProperties` | — | Style for outer container |
| `splitLevelStyle` | `CSSProperties` | — | Style for animation wrapper |
| `elementLevelStyle` | `CSSProperties` | — | Style for each element |

## Ref API (`TextRotateRef`)

| Method | Description |
|---|---|
| `next()` | Advance to next text |
| `previous()` | Go to previous text |
| `jumpTo(index)` | Jump to specific index |
| `reset()` | Reset to first text |

## Dependencies

- `framer-motion` — AnimatePresence + motion for staggered enter/exit
