# NumberInput

A compact, precision-focused numeric input designed for design toolbars. It supports direct text entry, mouse wheel nudging, and keyboard increments, making it ideal for manipulating physical dimensions (mm) or degrees (°).

## Features

- **Hybrid Display**: Toggle between a clean button-based view and a text input for direct editing (double-click to edit).
- **Precision Control**: Configurable decimal places (`decimals`) and step increments (`step`).
- **Nudge Interactions**: Supports `ArrowUp`/`ArrowDown` keys and mouse wheel scrolling to increment/decrement values.
- **Unit Support**: Optional units (e.g., `mm`, `%`, `°`) displayed inline but excluded during editing.
- **Scroll Hijack**: Prevents page scroll when using the mouse wheel over the input area for a smooth adjustment experience.
- **Clamping**: Automatically enforces `min` and `max` bounds on every change.
- **Accessible**: Uses `useId` for unique label associations and supports standard keyboard interaction patterns.

## How It Works

1. **Dual State**: Uses an `editing` boolean to switch between a `button` (display mode) and an `input` (edit mode).
2. **Wheel Listener**: Registers a non-passive `wheel` event listener via `useEffect`. This allows `e.preventDefault()` to stop the page from scrolling while the user "scrolls" the number value.
3. **Nudge Logic**: Uses a `nudgeRef` to ensure the wheel listener always has access to the most recent `onChange` closure without re-registering the listener on every render.
4. **Floating Point Safety**: Nudging logic uses `toFixed(decimals + 2)` before parsing back to float to avoid common JavaScript floating-point arithmetic errors (e.g., `0.1 + 0.2 !== 0.3`).
5. **Auto-Select**: The input automatically selects all text on focus, allowing for immediate overwrite.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — | The current numeric value. |
| `onChange` | `(value: number) => void` | — | Fired when the value is committed or nudged. |
| `min` | `number` | `-Infinity` | The minimum allowed value. |
| `max` | `number` | `Infinity` | The maximum allowed value. |
| `step` | `number` | `1` | The amount to increment/decrement by when nudging. |
| `decimals` | `number` | `0` | Number of decimal places to show and preserve. |
| `unit` | `string` | — | Optional unit suffix (e.g., "mm"). |
| `label` | `string` | — | Optional text label shown to the left of the input. |
| `className` | `string` | — | Additional CSS classes for the wrapper. |

## Usage

### Physical Dimensions (Millimetres)

```tsx
import { NumberInput } from '@components/number-input'

function Properties() {
  const [width, setWidth] = useState(90)

  return (
    <NumberInput
      label="W"
      value={width}
      onChange={setWidth}
      unit="mm"
      min={10}
      max={500}
      step={0.5}
      decimals={1}
    />
  )
}
```

### Rotation (Degrees)

```tsx
<NumberInput
  label="Rotation"
  value={angle}
  onChange={setAngle}
  unit="°"
  step={1}
  decimals={0}
/>
```

## Dependencies

- `clsx` & `tailwind-merge` — Style utility (`cn`)
