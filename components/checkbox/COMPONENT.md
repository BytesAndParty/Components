# Checkbox

Animated checkbox with controlled/uncontrolled support, checkmark stroke draw, and press feedback.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Checkmark draw** | The SVG polyline checkmark draws itself via `stroke-dashoffset` animation (250ms linear with 200ms delay for the fill to complete first). |
| **Fill scale** | The accent-colored background scales from `0.5` → `1` when checked and back when unchecked, emerging from the center. |
| **Border color shift** | Border transitions from `--text-muted` to `--accent` when checked. |
| **Press squish** | On pointer down, the box scales to 0.92 with a spring curve; releases back on pointer up/leave. |
| **Disabled state** | Reduces opacity to 0.5 and sets `cursor: not-allowed`. |

## How It Works

1. **Controlled/uncontrolled pattern**: If `checked` is provided, the component is controlled. Otherwise, internal state manages the checked value via `defaultChecked`.
2. **Hidden native input**: A visually hidden `<input type="checkbox">` is used for form compatibility and accessibility, connected via `useId()`.
3. **Three-layer visual**:
   - Border layer: Always visible, color changes with state
   - Fill layer: Accent background, scales with opacity
   - Checkmark layer: SVG polyline with `strokeDasharray: 22` and `strokeDashoffset` toggle

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | — | Controlled checked state |
| `defaultChecked` | `boolean` | `false` | Initial state (uncontrolled mode) |
| `onChange` | `(checked: boolean) => void` | — | Change callback |
| `label` | `string` | — | Label text |
| `disabled` | `boolean` | `false` | Disable interaction |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Box size (16/20/24 px) |

## Dependencies

None (React only).

## Accessibility

- Native `<input type="checkbox">` is present (visually hidden) for form submission and screen reader support.
- Label is connected via `htmlFor` + `useId()`.
