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

1. **Loading lock**: A `loading` state prevents double-clicks. The animation auto-resets via `setTimeout(duration)`.
2. **CSS-driven animation**: The cart assembly uses pure CSS animations (`animation: atc-cart 3.4s`). Fill and checkmark use CSS transitions with staggered delays.
3. **Cleanup**: Timer refs are cleared on unmount to prevent memory leaks.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | `'Add to cart'` | Button label |
| `onClick` | `() => void` | — | Click callback (fires at animation start) |
| `duration` | `number` | `3700` | Total animation + reset duration in ms |
| `bgColor` | `string` | `'var(--accent)'` | Button background |
| `textColor` | `string` | `'#fff'` | Text and icon color |

## Required CSS

Add to your global stylesheet if not using `showcase/src/styles.css`:

```css
@keyframes atc-cart {
  0%    { transform: translateX(-120px) rotate(-18deg); }
  12.5% { transform: translateX(-60px) rotate(-18deg); }
  25%, 45%, 55%, 75% { transform: none; }
  50%   { transform: scale(.9); }
  44%, 56% { transform-origin: 12px 23px; }
  45%, 55% { transform-origin: 50% 50%; }
  87.5% { transform: translateX(70px) rotate(-18deg); }
  100%  { transform: translateX(140px) rotate(-18deg); }
}
```

## Dependencies

None (React only).

## Security Notes

- Button is disabled during animation (`cursor: default`, early return on `loading`) to prevent rapid-fire cart additions.
