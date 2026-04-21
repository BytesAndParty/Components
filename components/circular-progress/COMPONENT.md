# CircularProgress

A customizable SVG-based circular progress indicator with smooth transitions.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Fill Animation** | The progress arc grows or shrinks smoothly when the `value` prop changes. |
| **Interactive Labels** | Can host custom children (icons, percentages) in the center of the ring. |

## How It Works

1. **SVG Stroke Dash**: Uses `stroke-dasharray` and `stroke-dashoffset` to control the visible portion of the circle's border.
2. **CSS Transitions**: Animates the dash offset using standard CSS for hardware-accelerated performance.
3. **Flexible Sizing**: Scalable via `size` and `strokeWidth` props while maintaining vector crispness.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | `0` | Progress value (0-100) |
| `size` | `number` | `80` | Diameter of the circle in px |
| `strokeWidth` | `number` | `6` | Thickness of the progress line |
| `color` | `string` | `'auto'` | Progress color (defaults to `--accent`) |
| `children` | `ReactNode` | | Optional content for the center |

## Dependencies

None.
