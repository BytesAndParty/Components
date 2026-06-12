# Stack Order Controls

A specialized toolbar for managing the z-order (layer stacking) of canvas elements. It provides four standard actions: Bring to Front, Bring Forward, Send Backward, and Send to Back.

## Features

- **Four Standard Actions:** Complete control over object layering.
- **Visual Clarity:** Uses Lucide icons (`BringToFront`, `ArrowUp`, `ArrowDown`, `SendToBack`) for intuitive interaction.
- **Configurable Visibility:** Allows limiting the shown buttons to a subset of the four actions.
- **Accessibility:** Implements `role="toolbar"` and proper `aria-label` and `title` attributes for all buttons.
- **Themed UI:** Uses design system tokens (`bg-card`, `border-border`, `text-muted-foreground`) to fit seamlessly into any panel.

## How It Works

The component renders a horizontal button group. Each button is associated with a callback prop. If a callback is not provided, the corresponding button is automatically disabled.

The buttons are separated by vertical borders and feature subtle hover states and transitions consistent with the rest of the AtelierUI toolset.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `onBringToFront` | `() => void` | — | Callback to move selection to the very top. |
| `onBringForward` | `() => void` | — | Callback to move selection one layer up. |
| `onSendBackward` | `() => void` | — | Callback to move selection one layer down. |
| `onSendToBack` | `() => void` | — | Callback to move selection to the very bottom. |
| `disabled` | `boolean` | `false` | Disables all buttons in the toolbar. |
| `visible` | `ButtonKey[]` | *All* | Array of keys (`front`, `forward`, `backward`, `back`) to show. |
| `className` | `string` | — | Additional CSS classes for the toolbar div. |
| `messages` | `Partial<StackOrderControlsMessages>` | — | Custom UI strings. |

## Usage

```tsx
import { StackOrderControls } from '@components/stack-order-controls'

export function LayerActions() {
  const bringToFront = () => { /* canvas logic */ }
  const sendToBack   = () => { /* canvas logic */ }

  return (
    <StackOrderControls
      onBringToFront={bringToFront}
      onSendToBack={sendToBack}
      visible={['front', 'back']}
    />
  )
}
```

## Dependencies

| Package | Purpose |
|---|---|
| `lucide-react` | Icons |
| `react` | UI Library |
| `@local/lib` | Utility functions (`cn`) |
| `@local/i18n` | UI strings management |
