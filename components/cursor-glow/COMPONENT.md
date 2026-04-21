# CursorGlow

A lightweight ambient cursor-tracking glow effect using pure CSS gradients and transforms.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Cursor Tracking** | A soft radial glow follows the cursor across the entire viewport. |
| **Interactive Opacity** | The glow can subtly change intensity or size based on movement speed or context. |

## How It Works

1. **Window Mouse Tracking**: Listens to global `mousemove` events to update the glow position.
2. **Fixed Overlay**: Renders as a `position: fixed` element with `pointer-events: none` to avoid interfering with interactions.
3. **Performance**: Uses `transform: translate()` for smooth movement that stays off the main thread where possible.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `string` | `'auto'` | Glow color (defaults to `--accent`) |
| `size` | `number` | `400` | Diameter of the glow in px |
| `opacity` | `number` | `0.15` | Maximum opacity of the glow |

## Dependencies

None.
