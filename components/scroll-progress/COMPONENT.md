# ScrollProgress

Fixed scroll progress bar at the top of the viewport.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Scroll tracking** | A horizontal bar fills from left to right proportionally to the page scroll position, updated on every scroll event. |
| **Smooth fill** | Progress uses `scaleX` transform (GPU-accelerated) with a brief 50ms linear transition for smoothness without lag. |

## How It Works

1. **Scroll calculation**: `scrollTop / (scrollHeight - clientHeight)` maps scroll position to a 0–1 range.
2. **Transform-based**: Uses `transform: scaleX(progress)` with `transformOrigin: left` instead of `width` for better rendering performance.
3. **Passive listener**: The scroll event listener uses `{ passive: true }` for optimal scroll performance.
4. **ARIA**: Has `role="progressbar"` with `aria-valuenow` reflecting the current percentage.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `string` | `'var(--accent)'` | Bar color |
| `height` | `number` | `3` | Bar height in px |
| `top` | `string` | `'0'` | CSS top position (e.g., `'65px'` below navbar) |
| `zIndex` | `number` | `50` | z-index |

## Dependencies

None (React only).
