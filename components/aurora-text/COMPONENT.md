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
4. **Keyframe self-contained**: The `aurora` keyframe is injected into the document head on first mount, so the component works standalone without any external CSS.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | Text content |
| `colors` | `string[]` | `['#FF0080', '#7928CA', '#0070F3', '#38bdf8']` | Gradient color stops |
| `speed` | `number` | `1` | Animation speed multiplier (higher = faster) |

## Dependencies

None (React only).

## Accessibility

Text content is duplicated in a visually hidden span for screen readers, since the gradient-clipped version uses `aria-hidden`.
