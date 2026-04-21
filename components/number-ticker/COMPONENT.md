# NumberTicker

An animated number counter that uses a vertical rolling slot-machine effect for individual digits.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Digit Roll** | When the value changes, individual digits roll vertically to their new value. |
| **Elastic Ease** | Rolling animation uses a smooth ease-out to feel physical and responsive. |

## How It Works

1. **Vertical Translation**: Each digit is a vertical stack of 0-9. The component translates the stack to show the correct digit.
2. **Zero Runtime CSS**: Keyframes and transitions are handled via inline styles and standard CSS transitions.
3. **Composable**: Can be used standalone or integrated into other UI elements like cart badges.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | `0` | The value to display |
| `duration` | `number` | `600` | Duration of the roll animation in ms |
| `className` | `string` | | Optional CSS class |
| `style` | `CSSProperties` | | Optional inline styles |

## Dependencies

None (standard React).
