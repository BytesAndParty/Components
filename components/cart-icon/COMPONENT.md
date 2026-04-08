# CartIcon

Shopping cart icon with flying box animation on count changes and an animated badge.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Flying box (add)** | When count increases, a small box SVG arcs from the left into the cart via a multi-step keyframe (`ci-box-add`). |
| **Flying box (remove)** | When count decreases, the box reverses its arc from the cart outward (`ci-box-remove`). |
| **Badge pop** | On count change (non-zero → non-zero), the badge scales 1→1.3→0.9→1 with a bouncy cubic-bezier. |
| **Badge entrance** | On first item added (0→N), the badge springs in from `scale(0)` with overshoot. |
| **Badge exit** | On last item removed (N→0), the badge shrinks to `scale(0)` and fades out. |
| **Count cap** | Displays `99+` when count exceeds 99 to prevent badge overflow. |

## How It Works

1. **Diff detection**: A `useRef` tracks the previous count. On each change, the component determines if items were added or removed and selects the appropriate animation.
2. **Staggered state updates**: `displayCount` updates 500ms into the animation (midpoint) so the number changes while the box is visually "in the cart". Badge animation clears after 500ms, box animation after 1000ms.
3. **Keyframe injection**: All keyframes (`ci-box-add`, `ci-box-remove`, `ci-badge-pop`, `ci-badge-in`, `ci-badge-out`) are injected once on module load.
4. **First-mount guard**: The component skips animation on initial render to prevent entrance artifacts.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `count` | `number` | `0` | Number of items in cart |
| `size` | `number` | `24` | Icon size in px |
| `color` | `string` | `'currentColor'` | Icon stroke color |
| `badgeColor` | `string` | `'var(--accent)'` | Badge background |
| `badgeTextColor` | `string` | `'#fff'` | Badge text color |
| `onClick` | `() => void` | — | Click handler |

## Dependencies

None (React only).

## Accessibility

- `aria-label` includes item count (e.g., "Warenkorb, 3 Artikel").
