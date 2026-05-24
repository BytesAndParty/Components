# ColorPicker

A high-fidelity color picking panel designed for design engines. It provides a 2D saturation/brightness area, hue and alpha sliders, and support for multiple color formats (HEX, RGB, HSL) with direct numeric input.

## Features

- **2D Picker Area**: Intuitive saturation and brightness selection with keyboard support (arrow keys).
- **Format Support**: Toggle between HEX, RGB, and HSL modes with synchronized numeric fields.
- **Alpha Channel**: Optional alpha (opacity) support with a transparency-grid preview and dedicated slider.
- **EyeDropper Integration**: Built-in support for the browser's native EyeDropper API to pick colors from anywhere on the screen.
- **Curated Palettes**: Includes thematic default palettes (Wine, Ivory, Gold, Midnight, Bark) plus support for custom presets and groups.
- **Accessibility**: ARIA `slider` and `application` roles, full keyboard navigation for all interactive areas, and localized screen-reader descriptions.
- **Visual Feedback**: Real-time previews of current color, RGB/Alpha values, and a pure-hue strip for visual confirmation.

## How It Works

1. **State Management**: Uses HSBA (Hue, Saturation, Brightness, Alpha) as the source of truth for all internal math, converting to/from HEX for the external API.
2. **Custom Math Engine**: Implements specialized conversion logic for HSB/HSL/RGB/HEX to ensure precision across different formats.
3. **Pointer Capture**: Uses Pointer Events API for the 2D area and sliders, ensuring smooth dragging on both mouse and touch devices.
4. **Roaming Tabindex**: Implements focus management for the color formats toggle and numeric inputs.
5. **i18n Integration**: Uses `useComponentMessages` to provide localized labels for sliders, inputs, and palette groups.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Controlled HEX value (e.g., `#FF0000` or `#FF000080`). |
| `defaultValue` | `string` | `'#000000'` | Initial color if `value` is not provided. |
| `onChange` | `(hex: string) => void` | — | Fired on every color mutation. |
| `showAlpha` | `boolean` | `false` | Enables the alpha slider and 8-digit HEX support. |
| `presets` | `string[]` | `[]` | Array of HEX strings for a quick-access preset row. |
| `paletteGroups` | `PaletteGroup[]` | — | Custom labeled color groups. If omitted, uses default thematic palettes. |
| `className` | `string` | — | Classes for the outer container. |
| `messages` | `Partial<ColorPickerMessages>` | — | Message overrides for i18n. |

## Usage

### Basic Usage

```tsx
import { ColorPickerPanel } from '@components/color-picker'

function Designer() {
  const [color, setColor] = useState('#722f37')

  return (
    <ColorPickerPanel
      value={color}
      onChange={setColor}
      presets={['#ffffff', '#000000', '#722f37']}
    />
  )
}
```

### Advanced (Alpha + Custom Palettes)

```tsx
<ColorPickerPanel
  showAlpha
  paletteGroups={[
    { label: 'Brand', colors: ['#9c1f38', '#ede0c8'] },
    { label: 'Accents', colors: ['#fbbf24', '#4060a8'] }
  ]}
  onChange={(hex) => console.log('Final Color:', hex)}
/>
```

## Dependencies

- `lucide-react` — Pipette icon
- `clsx` & `tailwind-merge` — Style utility (`cn`)
- `@components/i18n` — Internationalization hooks
