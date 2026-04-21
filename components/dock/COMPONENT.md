# Dock

A macOS-style navigation dock with a magnification effect that responds to mouse proximity.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Magnification** | Items near the cursor scale up smoothly, while those further away return to normal size. |
| **Hover Feedback** | Subtle scale and opacity changes on individual items when directly hovered. |
| **Spring Physics** | Uses `framer-motion` spring animations for organic-feeling magnification movement. |

## How It Works

1. **Mouse Tracking**: Uses `useMotionValue` to track the X-coordinate of the mouse relative to the dock.
2. **Distance Calculation**: For each item, the distance to the mouse is calculated and mapped to a scale value.
3. **Smooth Interplay**: Adjoining items are partially scaled, creating a "wave" effect as the cursor moves across.

## Props (Dock)

| Prop | Type | Default | Description |
|---|---|---|---|
| `magnification` | `number` | `60` | Max additional size in px when magnified |
| `distance` | `number` | `140` | The distance in px at which magnification begins |

## Props (DockItem)

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `ReactNode` | | The icon or content to display |
| `label` | `string` | | Label shown on hover or for accessibility |
| `href` | `string` | | Optional link destination |

## Dependencies

- `framer-motion`
