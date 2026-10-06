# Highlighter

Text highlight/underline/marker effect that animates when scrolled into view. Inline, for words or sentences inside running text. For a standalone block on a brush-stroke, watercolor or tape surface use [`MarkerCallout`](../marker-callout/COMPONENT.md).

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Highlight reveal** | A colored background grows from 0% to 100% width behind the text via CSS `background-size` transition. |
| **Underline reveal** | Alternatively, a 2px underline grows from left to right using the same mechanism. |
| **Marker stroke** | A hand-drawn felt-tip stroke per line, drawn from left to right with an expo-out ease. Uneven, softly fading ends, sitting slightly below the text. |
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
5. **Reduced motion**: A style block injected once (`__highlighter-styles__`) sets `transition: none !important` under `prefers-reduced-motion: reduce`. The highlight then appears instantly when scrolled into view.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | Text content to highlight |
| `action` | `'highlight' \| 'underline' \| 'marker'` | `'highlight'` | Effect type |
| `color` | `string` | `'var(--accent)'` | Highlight/underline color, any CSS color format |
| `duration` | `number` | `800` | Animation duration in ms |
| `animateOnView` | `boolean` | `true` | Trigger on scroll into view |
| `delay` | `number` | `0` | Delay before animation in ms |
| `className` | `string` | — | Additional classes on the span |
| `style` | `CSSProperties` | — | Inline styles on the span |

## Dependencies

None (React only, uses IntersectionObserver API). `cn()` from `@components/lib/utils`.
