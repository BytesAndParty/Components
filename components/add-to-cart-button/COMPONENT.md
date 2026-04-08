# AddToCartButton

Animated add-to-cart button with a multi-stage cart roll-in animation inspired by Aaron Iker (Dribbble).

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Button press scale** | On click, the button scales down to 0.95 with a bouncy cubic-bezier. |
| **Text slide-up** | The label slides upward (`translateY(-32px)`) to reveal the animation stage. |
| **Plus icon spin** | The `+` icon rotates 180° during the transition. |
| **Cart roll-in** | The cart SVG slides in from the left with an 18° tilt, using a multi-keyframe `atc-cart` animation. |
| **Cart fill** | The cart body "fills up" via a `scaleY(0→1)` transform with a perspective tilt. |
| **Checkmark draw** | A polyline checkmark draws itself via `stroke-dashoffset` animation inside the cart. |
| **Cart roll-out** | The cart continues its keyframe, rolling out to the right. |
| **Reset** | After `duration` ms, the button returns to its idle state. |

## How It Works

1. **Keyframe injection**: A `<style>` element with the `atc-cart` keyframe is injected into `<head>` once on module load (SSR-safe via `typeof document` check).
2. **Loading lock**: A `loading` state prevents double-clicks. The animation auto-resets via `setTimeout(duration)`.
3. **CSS-driven animation**: The cart assembly uses pure CSS animations (`animation: atc-cart 3.4s`). Fill and checkmark use CSS transitions with staggered delays.
4. **Cleanup**: Timer refs are cleared on unmount to prevent memory leaks.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | `'Add to cart'` | Button label |
| `onClick` | `() => void` | — | Click callback (fires at animation start) |
| `duration` | `number` | `3700` | Total animation + reset duration in ms |
| `bgColor` | `string` | `'var(--accent)'` | Button background |
| `textColor` | `string` | `'#fff'` | Text and icon color |

## Dependencies

None (React only).

## Security Notes

- Button is disabled during animation (`cursor: default`, early return on `loading`) to prevent rapid-fire cart additions.
