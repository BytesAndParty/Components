# Highlighter

Text highlight/underline/marker effect and handwriting marks (circle, strike, squiggle) that animate when scrolled into view. Inline, for words or sentences inside running text. For a standalone block on a brush-stroke, watercolor or tape surface use [`MarkerCallout`](../marker-callout/COMPONENT.md).

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Highlight reveal** | A colored background grows from 0% to 100% width behind the text via CSS `background-size` transition. |
| **Underline reveal** | Alternatively, a 2px underline grows from left to right using the same mechanism. |
| **Marker stroke** | A hand-drawn felt-tip stroke per line, drawn from left to right with an expo-out ease. Uneven, softly fading ends, sitting slightly below the text. |
| **Handwriting marks** | `circle`, `strike` and `squiggle` write themselves like a pen: a loop around the words, a line through them, a wave below. Three pens: `pen` (fountain pen), `nib` (broad nib with thin and thick strokes), `pencil` (grainy graphite, drawn twice). Every instance gets its own slightly different shape. |
| **Scroll trigger** | Animation starts when the element is 50% visible in the viewport (configurable via `animateOnView`). |
| **Delay** | An optional delay before the animation starts, useful for staggering multiple highlights. |

## How It Works

1. **IntersectionObserver**: When `animateOnView` is true, an observer watches the element. Once 50% visible, `isVisible` is set to true and the observer disconnects (fire-once).
2. **CSS background trick**: The element uses `background-size` transition from `0%` to `100%` with `no-repeat` and `left` position. This creates a smooth reveal without any JavaScript animation loop.
3. **Three modes**:
   - `'highlight'`: Full-height background behind the text at 20 % opacity via `color-mix(in oklch, <color> 20%, transparent)`, so any CSS color format works (hex, `oklch()`, named).
   - `'underline'`: 2px-tall bar at the bottom of the text
   - `'marker'`: 82 %-tall stroke shifted down (`background-position: 0 78%`), color at 45 % via `color-mix`, fading ends via a 100° gradient, irregular `border-radius`. `box-decoration-break: clone` gives every wrapped line its own stroke with its own ends.
4. **CSS variable support**: When the color is a `var()` reference, the 20 % tint is skipped and the variable is used as is (default `var(--accent)`).
5. **Handwriting marks** (`hand-mark.tsx`): The words sit in an `inline-block` span that measures itself with a `ResizeObserver`. The SVG on top uses the span's pixel size as its viewBox, so the stroke keeps the same width for every word length. Shapes are generated from the size and a seeded random (`useId()` → `hashSeed()` → mulberry32), so each instance looks hand-made but stays identical across renders:
   - `circle`: a slightly squarish loop (superellipse) that starts top left, runs counter-clockwise, tightens a little and overshoots instead of closing. The span gets `0.25em` side margin so the loop does not touch the neighbouring words.
   - `strike`: a slightly rising, slightly bent line at 60 % of the line height, which hits lowercase letters as well as old-style and lining figures. The words are wrapped in `<s>` (no default line), because struck text means "no longer valid", e.g. an old price.
   - `squiggle`: a wave just below the words.
   - Pens: `nib` draws every path seven times, offset along a ~40° nib angle (same technique as `Signature`), which turns into thick strokes across the nib and hairlines along it. `pencil` draws every mark twice with a delay and adds a turbulence grain filter.
   - Drawing uses `pathLength={1}` and a `stroke-dashoffset` transition from 1 to 0, so no animation library is needed. Opacity jumps to 1 only when the stroke starts, otherwise the round line caps would show a dot beforehand. Writing time follows the word width and is scaled by `duration / 800`.
6. **Reduced motion**: A style block injected once (`__highlighter-styles__`) sets `transition: none !important` on the span and its SVG paths under `prefers-reduced-motion: reduce`. The highlight or mark then appears instantly when scrolled into view.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | Text content to highlight |
| `action` | `'highlight' \| 'underline' \| 'marker' \| 'circle' \| 'strike' \| 'squiggle'` | `'highlight'` | Effect type. The last three are handwriting marks for single words or short phrases (they keep the words on one line). |
| `pen` | `'pen' \| 'nib' \| 'pencil'` | `'pen'` | Pen for the handwriting marks: fountain pen, broad nib, sketched pencil. Ignored by the other actions. |
| `color` | `string` | `'var(--accent)'` | Highlight/underline/ink color, any CSS color format. `'currentColor'` takes the surrounding text color, e.g. the ink of a `PaperNote`. |
| `duration` | `number` | `800` | Animation duration in ms. Handwriting marks scale their writing time by `duration / 800`. |
| `animateOnView` | `boolean` | `true` | Trigger on scroll into view |
| `delay` | `number` | `0` | Delay before animation in ms |
| `className` | `string` | — | Additional classes on the span |
| `style` | `CSSProperties` | — | Inline styles on the span |

## Usage

```tsx
import { Highlighter } from '@components/highlighter/highlighter'

// Price change: old price struck through, new price next to it
<p>Kellerführung <Highlighter action="strike">30,–</Highlighter> 25,– Euro</p>

// Circle and wave with the other pens
<p>Wir lesen <Highlighter action="circle" pen="pencil">von Hand</Highlighter>, und der 2025er wird{' '}
  <Highlighter action="squiggle" pen="nib">außergewöhnlich</Highlighter>.</p>

// On paper: the mark takes the ink of the note
<PaperNote paper="kraft">
  Wir öffnen die Fässer <Highlighter action="circle" pen="pencil" color="currentColor">nur für euch</Highlighter>.
</PaperNote>
```

## Dependencies

None (React only, uses IntersectionObserver and ResizeObserver). `cn()` from `@components/lib/utils`, `hashSeed()` from `@components/lib/scrapbook` for the handwriting marks.
