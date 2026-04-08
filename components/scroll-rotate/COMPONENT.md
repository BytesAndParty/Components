# ScrollRotate

Scroll-driven rotation that maps page scroll progress to element rotation.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Scroll rotation** | Children rotate from 0° to 360° × `speed` as the page scrolls from top to bottom, creating a parallax-like decorative effect. |

## How It Works

1. **`useScroll`**: Framer Motion's `useScroll()` provides a `scrollYProgress` motion value (0–1).
2. **`useTransform`**: Maps `scrollYProgress` to a rotation range `[0, 360 * speed]`, creating a reactive rotation value.
3. **Motion value binding**: The `rotate` value is bound directly to `motion.div`'s `style.rotate`, ensuring hardware-accelerated animation without React re-renders.

## Exports

| Export | Description |
|---|---|
| `ScrollRotate` | Generic wrapper — rotates any children based on scroll |
| `RotatingDecoration` | Pre-made decorative SVG (concentric circles + crosshairs) that rotates at 2× speed |

## Props (ScrollRotate)

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | Content to rotate |
| `speed` | `number` | `1` | Rotation multiplier (1 = one full turn per full scroll) |

## Dependencies

- `framer-motion` — `useScroll`, `useTransform`, `motion.div`
