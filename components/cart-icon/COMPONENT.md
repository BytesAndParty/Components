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
3. **CSS keyframes**: All keyframes (`ci-box-add`, `ci-box-remove`, `ci-badge-pop`, `ci-badge-in`, `ci-badge-out`) are defined in `showcase/src/styles.css` (see Required CSS below).
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

## Required CSS

Add to your global stylesheet if not using `showcase/src/styles.css`:

```css
@keyframes ci-box-add {
  0%   { top: 20%;  left: -30%; opacity: 0; }
  25%  { top: -20%; left: 50%;  opacity: 1; }
  50%  { top: 0%;   left: 70%; }
  75%  { top: 35%;  left: 50%; }
  100% { top: 35%;  left: 50%;  opacity: 0; }
}
@keyframes ci-box-remove {
  0%   { top: 35%;  left: 50%;  opacity: 0; }
  25%  { top: 35%;  left: 50%; }
  50%  { top: 0%;   left: 70%;  opacity: 1; }
  75%  { top: -20%; left: 50%;  opacity: 1; }
  100% { top: 20%;  left: -30%; opacity: 0; }
}
@keyframes ci-badge-pop {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.3); }
  70%  { transform: scale(0.9); }
  100% { transform: scale(1); }
}
@keyframes ci-badge-in {
  0%   { transform: scale(0); }
  50%  { transform: scale(1.25); }
  100% { transform: scale(1); }
}
@keyframes ci-badge-out {
  0%   { transform: scale(1); opacity: 1; }
  100% { transform: scale(0); opacity: 0; }
}
```

## Dependencies

None (React only).

## Accessibility

- `aria-label` includes item count (e.g., "Warenkorb, 3 Artikel").
