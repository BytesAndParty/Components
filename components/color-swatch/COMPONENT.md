# Color Swatch

A compact color picker trigger. It displays a small colored pill that, when clicked, opens a full color picker panel in a popover.

## Features

- **Compact UI:** Designed for use in toolbars and context panels.
- **Full Picker Integration:** Seamlessly integrates with the `ColorPickerPanel`.
- **Customizable Presets:** Supports custom color palettes and presets.
- **Alpha Support:** Can be configured to support alpha transparency.
- **Accessibility:** Built on top of Ark UI Popover for robust keyboard and screen reader support.
- **Labels:** Supports optional leading badges/labels for context (e.g., "A" for text color).

## How It Works

The component uses an Ark UI `Popover` to manage the lifecycle of the picker dialog. The trigger is a standard `button` that styles a `span` with the currently selected color using an inline `background` style.

When clicked, the `ColorPickerPanel` is rendered within the popover content. All color logic (hex/rgba conversion, swatch selection) is delegated to the `ColorPickerPanel`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Current color as a hex string (`#rrggbb` or `#rrggbbaa`). |
| `onChange` | `(hex: string) => void` | — | Callback triggered when a new color is selected. |
| `label` | `ReactNode` | — | Optional badge/label displayed before the color pill. |
| `title` | `string` | — | Tooltip and aria-label for the trigger button. |
| `showAlpha` | `boolean` | `false` | Whether to show the alpha transparency slider. |
| `presets` | `string[]` | *Wine Cellar Palette* | Array of hex strings for the quick-select swatches. |
| `paletteGroups` | `PaletteGroup[]` | `[]` | Grouped palettes for organized color selection. |
| `className` | `string` | — | Additional CSS classes for the trigger button. |
| `messages` | `Partial<ColorSwatchMessages>` | — | Custom UI strings. |

## Usage

```tsx
import { ColorSwatch } from '@components/color-swatch'

export function MyToolbar() {
  const [color, setColor] = useState('#722f37')

  return (
    <div className="flex h-10 items-center border rounded-md overflow-hidden">
      <ColorSwatch
        label="Fill"
        value={color}
        onChange={setColor}
        showAlpha
      />
    </div>
  )
}
```

## Dependencies

| Package | Purpose |
|---|---|
| `@ark-ui/react` | Headless UI (Popover, Portal) |
| `@local/color-picker` | Internal full-featured color picker panel |
| `@local/lib` | Utility functions (`cn`) |
| `@local/i18n` | UI strings management |
