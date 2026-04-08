# Highlighter

Text highlight/underline effect that animates when scrolled into view.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Highlight reveal** | A colored background grows from 0% to 100% width behind the text via CSS `background-size` transition. |
| **Underline reveal** | Alternatively, a 2px underline grows from left to right using the same mechanism. |
| **Scroll trigger** | Animation starts when the element is 50% visible in the viewport (configurable via `animateOnView`). |
| **Delay** | An optional delay before the animation starts, useful for staggering multiple highlights. |

## How It Works

1. **IntersectionObserver**: When `animateOnView` is true, an observer watches the element. Once 50% visible, `isVisible` is set to true and the observer disconnects (fire-once).
2. **CSS background trick**: The element uses `background-size` transition from `0%` to `100%` with `no-repeat` and `left` position. This creates a smooth reveal without any JavaScript animation loop.
3. **Two modes**:
   - `'highlight'`: Full-height background behind the text (20% opacity via hex alpha `33`)
   - `'underline'`: 2px-tall bar at the bottom of the text
4. **CSS variable support**: When the color is a `var()` reference, the alpha modification is skipped.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | Text content to highlight |
| `action` | `'highlight' \| 'underline'` | `'highlight'` | Effect type |
| `color` | `string` | `'var(--accent)'` | Highlight/underline color |
| `duration` | `number` | `800` | Animation duration in ms |
| `animateOnView` | `boolean` | `true` | Trigger on scroll into view |
| `delay` | `number` | `0` | Delay before animation in ms |

## Dependencies

None (React only, uses IntersectionObserver API).
