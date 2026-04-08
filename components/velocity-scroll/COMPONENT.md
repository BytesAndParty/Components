# VelocityScroll

Scroll-velocity-driven infinite marquee — rows of content scroll horizontally at a base speed that accelerates or reverses based on the page's scroll velocity. Includes a ready-made `TestimonialCard`.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Velocity response** | Scrolling the page fast amplifies the marquee speed (up to 5× via `velocityFactor`). Scrolling in the opposite direction reverses the marquee. |
| **Spring smoothing** | Raw scroll velocity is fed through `useSpring` (`damping: 50, stiffness: 400`) for inertia-like deceleration — no abrupt speed changes. |
| **Opposing rows** | Multiple rows alternate direction: row 1 moves left, row 2 moves right, row 3 moves left again. |
| **Infinite loop** | When the translated position exceeds one repetition's width, it wraps around seamlessly. The number of repetitions is auto-calculated from container/content width. |
| **Responsive** | Measures widths on mount and on window resize to recalculate repetition count. |

## How It Works

1. **VelocityRow** (internal): Each row has its own animation loop via `useAnimationFrame`. It reads `velocityFactor` (derived from `useScroll` → `useVelocity` → `useSpring` → `useTransform`) and adds it to the base velocity.
2. **Wrap-around**: The `baseX` motion value is manually updated each frame. When it drifts past one content repetition's width, it's snapped back, creating a seamless loop.
3. **Auto-repetition**: On mount, measures the inner content's `offsetWidth` vs. container's `offsetWidth` and computes `ceil(container/inner) + 2` repetitions for safe overlap.
4. **VelocityScroll** (outer): Renders 1–3 `VelocityRow` instances with alternating `baseVelocity` signs.

## Props

### `VelocityScroll`

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Content to marquee |
| `baseVelocity` | `number` | `-40` | Pixels/sec base speed (negative = leftward) |
| `rows` | `1 \| 2 \| 3` | `2` | Number of scrolling rows |
| `gap` | `string` | `'1rem'` | Gap between items and rows |
| `className` | `string` | — | Additional class |

### `TestimonialCard`

| Prop | Type | Description |
|---|---|---|
| `testimonial` | `Testimonial` | `{ name, role?, content, avatar? }` |
| `className` | `string` | Additional class |

## Note

Uses Tailwind CSS classes (`w-full`, `overflow-hidden`, `flex`, etc.) — the consumer project needs Tailwind configured.

## Dependencies

- `framer-motion` — `useScroll`, `useVelocity`, `useSpring`, `useTransform`, `useAnimationFrame`, `useMotionValue`, `motion`
