# LayerPanel

A sophisticated sidebar component for managing a stack of layers or canvas objects with drag-and-drop support and visibility controls.

## Features

- **Drag-and-Drop Reordering:** Intuitive sorting using the `dnd-kit` library.
- **Visual Type Indicators:** Automatic icons for text, images, shapes, wine-fields, and QR codes.
- **Layer Controls:** Toggle visibility, lock/unlock, and delete layers.
- **In-place Renaming:** Double-click a layer name to rename it.
- **Selection State:** Supports highlighting the currently active layers.
- **Keyboard Navigation:** Full support for sorting via keyboard (Shift + ↑/↓).
- **Smooth Animations:** Framer Motion (`motion`) transitions for adding and removing layers.

## How It Works

The component uses a combination of **dnd-kit** for sorting logic and **Framer Motion** for list animations.
- `DndContext` and `SortableContext` manage the drag interactions.
- `LayerRow` handles individual layer actions like renaming and visibility toggling.
- To prevent animation conflicts, `dnd-kit` handles the position transforms during dragging, while Framer Motion handles the entrance/exit fades.

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `layers` | `Layer[]` | - | Array of layer objects to display. |
| `selectedIds` | `string[]` | `[]` | IDs of currently selected layers. |
| `onReorder` | `(layers: Layer[]) => void` | - | Callback when layer order changes. |
| `onSelect` | `(id: string) => void` | - | Callback when a layer is clicked. |
| `onVisibilityToggle`| `(id: string) => void` | - | Toggle visibility for a layer. |
| `onLockToggle` | `(id: string) => void` | - | Toggle lock status for a layer. |
| `onRename` | `(id: string, name: string) => void` | - | Callback for layer renaming. |
| `onDelete` | `(id: string) => void` | - | Callback to delete a layer. |
| `onMove` | `(id: string, dir: 1 \| -1) => void` | - | Programmatic move up/down. |
| `className` | `string` | - | Custom container classes. |
| `messages` | `Partial<LayerPanelMessages>` | - | Custom i18n overrides. |

### Layer Type
```typescript
interface Layer {
  id: string
  name: string
  type: 'text' | 'image' | 'rect' | 'circle' | 'line' | 'group' | 'wine-field' | 'qr-code'
  visible: boolean
  locked: boolean
}
```

## Usage

```tsx
import { LayerPanel, type Layer } from './components/layer-panel'

function Sidebar() {
  const [layers, setLayers] = useState<Layer[]>([...])

  return (
    <LayerPanel
      layers={layers}
      onReorder={setLayers}
      onSelect={(id) => console.log('Selected:', id)}
    />
  )
}
```

## Dependencies

- `@dnd-kit/core`: Drag and drop primitives.
- `@dnd-kit/sortable`: Sorting logic and hooks.
- `motion`: For entry/exit animations.
- `lucide-react`: Icons for layer types and actions.
- `components/i18n`: Internationalization support.
