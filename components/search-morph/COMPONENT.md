# SearchMorph

SVG morphing search icon that unrolls into a search input with underline — the magnifying glass circle unwinds into the field underline and the handle morphs into a close X.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Circle unroll** | The magnifying glass circle uses `strokeDashoffset` animation to "unwind" along its circumference (600ms easeInOut). |
| **Handle → X morph** | The search handle (45° line) smoothly morphs its endpoints to become the first arm of an X. A second arm fades in with a delay. |
| **Icon slide** | The entire icon group slides from left to right as the field expands, via `translateX` spring animation. |
| **Underline grow** | A horizontal `<line>` extends from the icon position to the full width as the search opens. |
| **Blinking cursor** | A custom blinking cursor appears (opacity keyframes) when the field is open but empty, disappearing when typing starts. |
| **Input delayed focus** | The input receives focus 700ms after opening (aligned with the morph animation completion). |
| **Keyboard shortcuts** | Enter submits; Escape closes. Blur on empty input also closes. |

## How It Works

1. **Single SVG canvas**: All animations happen in one SVG that spans the full `expandedWidth`. The icon group is a `<g>` that translates, and the underline is a separate `<line>`.
2. **Spring physics**: All layout movements use framer-motion springs (`damping: 16, stiffness: 90`).
3. **strokeDasharray trick**: The circle has a `strokeDasharray` equal to its circumference. Animating `strokeDashoffset` from 0 to `-circumference` creates the unroll effect.
4. **Accessibility**: The collapsed state has `role="button"` and `tabIndex={0}` with keyboard support (Enter/Space to open).

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `placeholder` | `string` | `'Search...'` | Input placeholder |
| `onSearch` | `(value: string) => void` | — | Called on Enter |
| `onChange` | `(value: string) => void` | — | Called on input change |
| `expandedWidth` | `number` | `280` | Field width when open |
| `strokeWidth` | `number` | `2.5` | SVG stroke width |

## Dependencies

- `framer-motion` — Spring animations for layout morphing
