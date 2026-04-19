# Slider

Range slider with drag-to-set, keyboard steering, and a thumb-squish micro-interaction on grab. Pointer-based (mouse + touch + pen), no external libraries.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Thumb squish** | On pointer-down the thumb width grows (`thumb → thumbActive`), simulating a rubbery grab. Matches the Switch pattern for consistency. |
| **Focus ring** | When focused or dragging, a `color-mix(in oklch, var(--accent) 25%, transparent)` halo fades in via `box-shadow`. |
| **Smooth settle** | When not dragging, the thumb `left` + width animate with a 150 ms cubic-bezier. While dragging the transition is off, so the thumb tracks the cursor 1:1. |
| **Snap-to-step** | Values snap to `step` resolution on every pointer move + keyboard press. |
| **Keyboard** | Arrow keys step by `step`, PageUp/Down step by `(max−min)/10`, Home/End jump to bounds. |

## How It Works

1. **Pointer capture**: `onPointerDown` calls `setPointerCapture`, so subsequent `pointermove` events route to the track even when the cursor leaves it.
2. **Global listeners only while dragging**: Move/up listeners are added on the `window` in a `useEffect` gated by `dragging` state, and cleaned up on release. Keeps passive listeners off the page when idle.
3. **Controlled/uncontrolled**: Standard pattern — if `value` is provided, the component is controlled; otherwise `useState(defaultValue)`.
4. **Value math**: `valueFromClientX` reads the track `getBoundingClientRect()`, converts to `[0..1]`, then maps to `[min..max]` and snaps to `step`.
5. **a11y**: The thumb is `role="slider"` with `aria-valuemin/max/now/text` and `tabIndex=0`; `aria-valuetext` uses `formatValue` if provided.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — | Controlled value |
| `defaultValue` | `number` | `0` | Initial value (uncontrolled) |
| `onChange` | `(value: number) => void` | — | Fired on every change |
| `onChangeEnd` | `(value: number) => void` | — | Fired once on pointer-up |
| `min` / `max` | `number` | `0` / `100` | Bounds |
| `step` | `number` | `1` | Snap resolution |
| `label` | `string` | — | Label above the track |
| `formatValue` | `(value: number) => string` | — | Format for the displayed value (e.g. `v => \`${v} %\``) |
| `showValue` | `boolean` | `true` | Show the current value on the right of the label row |
| `disabled` | `boolean` | `false` | Dims the slider and disables interaction |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Track + thumb dimensions |
| `className` / `style` | — | — | Forwarded to the wrapper |

## Dependencies

- None (React only)
