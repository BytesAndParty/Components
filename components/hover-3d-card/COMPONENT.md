# Hover3DCard

Card with mouse-dependent 3D tilt and a glare overlay that follows the cursor.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **3D tilt** | The card rotates on X and Y based on the cursor position — up to `maxRotate` degrees at the edges, flat at the centre. |
| **Glare overlay** | A white radial gradient follows the cursor, simulating light on a glossy surface. It fades in on enter and out on leave. |
| **Direct tracking** | While hovering, the transform has no transition, so the tilt follows the cursor 1:1. |
| **Smooth return** | On mouse leave, the card eases back to flat over `transitionSpeed` ms. |
| **Reduced motion** | With `prefers-reduced-motion: reduce` (read on every mouse move) the card stays flat; only the glare follows the cursor. |

## How It Works

1. **Mouse position mapping**: `onMouseMove` measures the cursor relative to the card centre and maps it to `±maxRotate` (X inverted, so the card tilts towards the cursor).
2. **Transition switch**: `transition: none` while hovering, `transform <transitionSpeed>ms ease-out` otherwise — fast tracking, soft return.
3. **Glare**: `glarePos` (percent of width/height) becomes the centre of the radial gradient; the overlay is `aria-hidden` and `pointer-events: none`.
4. **3D context**: `transformStyle: preserve-3d` plus a `perspective` on the card itself. Use `className`/`style` for size and border radius — the glare inherits the radius.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | Card content |
| `maxRotate` | `number` | `15` | Maximum rotation angle in degrees |
| `perspective` | `number` | `1000` | Perspective distance in px |
| `transitionSpeed` | `number` | `400` | Return-to-flat and glare fade duration in ms |
| `glare` | `boolean` | `true` | Enable/disable the glare overlay |
| `glareIntensity` | `number` | `0.15` | Glare opacity (0–1) |
| `className` | `string` | — | Classes on the card |
| `style` | `CSSProperties` | — | Inline styles on the card |

## Known Gaps

- Mouse-only: no touch fallback.

## Dependencies

None (React only).
