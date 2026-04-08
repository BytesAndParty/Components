# BounceCards

A stacked image card gallery with elastic bounce entrance animation and optional hover interaction.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Bounce entrance** | Cards scale from 0 → 1 with GSAP elastic easing and configurable stagger. |
| **Hover push** | Hovering a card flattens its rotation and pushes sibling cards apart with `back.out` easing. |
| **Hover reset** | On mouse-leave, all cards spring back to their original transforms. |

## How It Works

1. **Stacked layout**: Cards are absolutely positioned and centered with `translate(-50%, -50%)`, offset by individual `transformStyles` entries (rotation + translate).
2. **Entrance**: GSAP `fromTo` scales each card from 0 with staggered timing and elastic easing.
3. **Hover push**: On `mouseEnter`, the hovered card's rotation is stripped to `0deg`, and siblings receive an additional X-translate (±160px) with distance-based delay.
4. **Data attributes**: Cards are targeted via `data-bounce-card` attributes instead of CSS class selectors for better encapsulation.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `images` | `string[]` | — | Array of image URLs (required) |
| `containerWidth` | `number` | `400` | Container width in px |
| `containerHeight` | `number` | `400` | Container height in px |
| `animationDelay` | `number` | `0.5` | Delay before entrance animation (seconds) |
| `animationStagger` | `number` | `0.06` | Stagger between cards (seconds) |
| `easeType` | `string` | `'elastic.out(1, 0.8)'` | GSAP easing function |
| `transformStyles` | `string[]` | 5 rotation/translate combos | Per-card transform strings |
| `enableHover` | `boolean` | `true` | Enable hover push interaction |

## Dependencies

- `gsap`
