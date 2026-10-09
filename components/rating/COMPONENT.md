# Rating

Star rating component with controlled/uncontrolled support, hover preview, and pop animation.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Star pop** | Clicking a star triggers a scale animation (`rating-pop`: 1→1.3→1 over 300ms) on the clicked star. |
| **Hover preview** | On hover, all stars up to the hovered one scale to 1.1× and show as filled, previewing the potential rating. |
| **Fill transition** | Stars transition between filled (accent color) and outlined (border color) via inline SVG `fill` and `stroke`. |
| **Read-only mode** | When `readOnly`, stars show a static display with no cursor or hover effects — rendered as an image, not as disabled buttons. |

## How It Works

1. **Controlled/uncontrolled pattern**: If `value` is provided, the component is controlled. Otherwise `defaultValue` + internal state is used.
2. **Display value**: `hoverValue ?? currentValue` determines which stars are filled, so hover always takes visual priority.
3. **CSS keyframe**: `rating-pop` is defined in `components-showcase/src/styles.css` (see Required CSS below).
4. **ARIA**: Uses `role="radiogroup"` with individual `role="radio"` and `aria-checked` per star for full screen reader support. With `readOnly` the group becomes `role="img"` with one label („Bewertung: 5 von 5 Sternen“) — a display is announced as a picture, not as a set of disabled inputs.

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
| `readOnly` | `boolean` | `false` | Display only: no interactions, announced as an image with the value |
| `messages` | `Partial<RatingMessages>` | — | i18n overrides for the group and per-star labels |
| `className` | `string` | — | Additional classes on the radiogroup |
| `style` | `CSSProperties` | — | Inline styles on the radiogroup |

## Required CSS

Add to your global stylesheet if not using `components-showcase/src/styles.css`:

```css
@keyframes rating-pop {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.3); }
  100% { transform: scale(1); }
}
```

## Dependencies

None (React only).

## Accessibility

- `role="radiogroup"` on the container with `aria-label="Rating"`
- Each star is `role="radio"` with `aria-checked` and German `aria-label` (e.g., "3 von 5 Sternen")
