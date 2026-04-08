# SparklesText

Text overlay with randomly spawning sparkle elements that fade in, scale up, and rotate before disappearing — producing a continuous glitter/shimmer effect.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Sparkle spawn** | Every `sparkleInterval` ms a new sparkle appears at a random position within the text bounds. |
| **Scale + rotate** | Each sparkle uses `sparkle-spin` keyframes: `0% → scale(0) rotate(0°)`, `50% → scale(1) rotate(90°)`, `100% → scale(0) rotate(180°)`. This gives a "twinkle" pop effect. |
| **Staggered lifecycle** | Each sparkle has a random `animationDuration` (650–1000ms) and is removed from state after its animation completes (via `setTimeout`). |
| **Color cycling** | Sparkle fill colors are randomly picked from an internal palette (warm golds/yellows/oranges), producing non-uniform shimmer. |

## How It Works

1. **Interval-based generation**: A `setInterval` creates sparkle objects with random `{ x, y, size, color, duration }` and pushes them into state.
2. **Auto-cleanup**: Each sparkle schedules its own removal via `setTimeout(duration)` to prevent unbounded state growth.
3. **Absolute positioning**: Sparkles are positioned `absolute` within a `relative` container that wraps the text, so the effect follows the text layout.
4. **SVG star shape**: Each sparkle is a four-pointed star SVG (`<path>`) — not a CSS shape — allowing crisp rendering at all sizes.
5. **Keyframe injection**: Injects `@keyframes sparkle-spin` once via a `<style>` tag with ID deduplication.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Text content to sparkle over |
| `sparkleInterval` | `number` | `300` | Milliseconds between sparkle spawns |
| `className` | `string` | — | Additional CSS class for the wrapper |

## Dependencies

- None (React only)
