# Switch

Toggle switch with controlled/uncontrolled support, three sizes, and a squish micro-interaction on press. Built without any external animation library — pure CSS transitions.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Thumb squish** | On `pointerDown`, the thumb width expands (`thumb → thumbActive`) simulating a rubbery press, creating a "squish" feel. Releases on `pointerUp` / `pointerLeave`. |
| **Slide transition** | Thumb smoothly slides between off/on positions via CSS `transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`. |
| **Track color** | Background transitions between `--text-muted` (off) and `--accent` (on) over 200ms. |
| **Direction compensation** | When pressed while checked, the thumb shifts back by the width difference (`thumbActive - thumb`) so it doesn't overflow the track's right edge. |

## How It Works

1. **Controlled/Uncontrolled pattern**: If `checked` prop is provided, the component is controlled. Otherwise it manages its own state via `useState(defaultChecked)`.
2. **Size config table**: A `config` object maps `sm | md | lg` to pixel values for track dimensions, thumb sizes, travel distance, and border radius.
3. **Hidden checkbox**: An invisible `<input type="checkbox" role="switch">` sits inside the `<label>` for native form semantics and accessibility.
4. **Pointer events**: `pointerDown/Up/Leave` on the track `<span>` control the `pressed` state (not on the input).

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | — | Controlled checked state |
| `defaultChecked` | `boolean` | `false` | Initial state (uncontrolled) |
| `onChange` | `(checked: boolean) => void` | — | Called on toggle |
| `label` | `string` | — | Text label beside switch |
| `disabled` | `boolean` | `false` | Disables interaction |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `className` | `string` | — | Additional class on wrapper `<label>` |

## Dependencies

- None (React only)
