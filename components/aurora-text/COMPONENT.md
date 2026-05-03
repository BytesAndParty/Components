# AuroraText

Gradient text effect with an animated aurora shimmer that flows across the text.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Aurora shimmer** | A multi-color linear gradient continuously slides across the text via `background-position` animation, creating an iridescent shimmer. Speed is adjustable. |

## How It Works

1. **Gradient clip**: The text is rendered with `background-clip: text` and `WebkitTextFillColor: transparent`, making the gradient visible through the letterforms.
2. **Background-position animation**: The gradient uses `background-size: 200% auto` and animates `background-position` from 0% to 200%, creating a seamless loop with `infinite alternate`.
3. **Screen-reader duplicate**: A visually hidden `<span>` with the same text content ensures screen readers can access the text, while the visible copy has `aria-hidden="true"`.
4. **CSS keyframes**: `aurora` and `aurora-gradient` are defined in `showcase/src/styles.css` (see Required CSS below).

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | Text content |
| `colors` | `string[]` | `['#FF0080', '#7928CA', '#0070F3', '#38bdf8']` | Gradient color stops |
| `speed` | `number` | `1` | Animation speed multiplier (higher = faster) |
| `variant` | `'aurora'\|'gradient'` | `'aurora'` | `'aurora'`: subtle shimmer with alternate; `'gradient'`: continuous linear loop |

## Required CSS

Add to your global stylesheet if not using `showcase/src/styles.css`:

```css
@keyframes aurora {
  0%   { background-position: 0% center; }
  100% { background-position: 200% center; }
}
@keyframes aurora-gradient {
  0%   { background-position: 0% center; }
  100% { background-position: 300% center; }
}
```

## Dependencies

None (React only).

## Accessibility

Text content is duplicated in a visually hidden span for screen readers, since the gradient-clipped version uses `aria-hidden`.
