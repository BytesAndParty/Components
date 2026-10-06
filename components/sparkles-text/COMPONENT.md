# SparklesText

Text wrapper with small four-pointed sparkles that pop in, rotate and vanish at random positions — a continuous glitter effect over the text.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Sparkle spawn** | Every 350 ms a new sparkle appears at a random position within the text bounds, as long as fewer than `sparkleCount` are alive. |
| **Scale + rotate** | Each sparkle runs `sparkle-spin` (700 ms): `scale(0) rotate(0°)` → `scale(1) rotate(90°)` → `scale(0) rotate(180°)` with a final fade. |
| **Lifecycle** | Sparkles older than 700 ms are dropped from state on the next tick, so state never grows unbounded. |

## How It Works

1. **Interval**: One `setInterval(350)` per instance filters out expired sparkles and adds a new one with random `{ x, y, size }` while below `sparkleCount`. Disabled entirely when `enabled` is `false`.
2. **Positioning**: Sparkles are absolutely positioned (percent coordinates) inside an `inline-block`, `position: relative` span that wraps the text.
3. **SVG star**: Each sparkle is an inline SVG path (`aria-hidden`, `pointer-events: none`) — crisp at any size.
4. **Keyframe injection**: `@keyframes sparkle-spin` is injected once per page (`__sparkles-text-keyframes__`) in an effect.
5. **Reduced motion**: The same style block hides all sparkles under `@media (prefers-reduced-motion: reduce)` — the text stays, the glitter goes.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | Text content to sparkle over |
| `sparkleColor` | `string` | `var(--accent)` | Sparkle fill colour |
| `sparkleCount` | `number` | `3` | Maximum sparkles visible at once |
| `minSize` | `number` | `8` | Minimum sparkle size in px |
| `maxSize` | `number` | `18` | Maximum sparkle size in px |
| `enabled` | `boolean` | `true` | Turns the effect on/off |
| `className` | `string` | — | Classes on the wrapper span |
| `style` | `CSSProperties` | — | Inline styles on the wrapper span |

## Dependencies

- None (React only)
