# Rating

Star rating component with controlled/uncontrolled support, hover preview, and pop animation.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Star pop** | Clicking a star triggers a scale animation (`rating-pop`: 1→1.3→1 over 300ms) on the clicked star. |
| **Hover preview** | On hover, all stars up to the hovered one scale to 1.1× and show as filled, previewing the potential rating. |
| **Fill transition** | Stars transition between filled (accent color) and outlined (border color) via inline SVG `fill` and `stroke`. |
| **Read-only mode** | When `readOnly`, stars show a static display with no cursor or hover effects. |

## How It Works

1. **Controlled/uncontrolled pattern**: If `value` is provided, the component is controlled. Otherwise `defaultValue` + internal state is used.
2. **Display value**: `hoverValue ?? currentValue` determines which stars are filled, so hover always takes visual priority.
3. **Keyframe injection**: The `rating-pop` keyframe is injected once via the standard ID-deduplicated pattern.
4. **ARIA**: Uses `role="radiogroup"` with individual `role="radio"` and `aria-checked` per star for full screen reader support.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `count` | `number` | `5` | Number of stars |
| `value` | `number` | — | Controlled value |
| `defaultValue` | `number` | `0` | Initial value (uncontrolled) |
| `onChange` | `(value: number) => void` | — | Change callback |
| `size` | `number` | `24` | Star size in px |
| `activeColor` | `string` | `'var(--accent)'` | Filled star color |
| `inactiveColor` | `string` | `'var(--border)'` | Empty star color |
| `readOnly` | `boolean` | `false` | Disable interactions |

## Dependencies

None (React only).

## Accessibility

- `role="radiogroup"` on the container with `aria-label="Rating"`
- Each star is `role="radio"` with `aria-checked` and German `aria-label` (e.g., "3 von 5 Sternen")
