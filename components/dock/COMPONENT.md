# Dock

A macOS-style navigation dock with a magnification effect that responds to mouse proximity.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Magnification** | Items near the cursor scale up smoothly, while those further away return to normal size. |
| **Hover Feedback** | Subtle scale and opacity changes on individual items when directly hovered. |
| **Spring Physics** | Uses `motion` (`motion/react`) spring animations for organic-feeling magnification movement. |

## How It Works

1. **Mouse Tracking**: Uses `useMotionValue` to track the X-coordinate of the mouse relative to the dock.
2. **Distance Calculation**: For each item, the distance to the mouse is mapped to a scale between `1` (at `distance` px or further) and `magnification` (directly under the cursor), smoothed by `useSpring` (`stiffness: 260`).
3. **Smooth Interplay**: Adjoining items are partially scaled, creating a "wave" effect as the cursor moves across.
4. **Semantics**: The dock is a `role="toolbar"` with a localized label. Items render as `<a>` with `href`, as `<button>` with `onClick`, otherwise as a static element.

## Props (Dock)

| Prop | Type | Default | Description |
|---|---|---|---|
| `magnification` | `number` | `1.6` | Maximum scale of an item directly under the cursor |
| `distance` | `number` | `100` | Radius of the magnification effect in px |
| `children` | `ReactNode` | required | `DockItem` elements |
| `messages` | `Partial<DockMessages>` | — | i18n override for the toolbar label |
| `className` | `string` | — | Classes on the toolbar |
| `style` | `CSSProperties` | — | Inline styles on the toolbar |

## Props (DockItem)

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `ReactNode` | required | The icon or content to display |
| `label` | `string` | required | Label shown on hover and used as accessible name |
| `href` | `string` | — | Renders the item as a link |
| `onClick` | `() => void` | — | Renders the item as a button |
| `className` | `string` | — | Classes on the item |

## Dependencies

- `motion` (`motion/react`)
