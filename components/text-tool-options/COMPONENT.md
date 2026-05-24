# TextToolOptions

A comprehensive formatting toolbar for text elements, featuring font selection, sizing, and styling controls.

## Features

- **Font Family Selection:** Integrated Google Fonts catalogue with live previews.
- **Dynamic Font Loading:** Automatically injects required Google Fonts into the document head.
- **Sizing Controls:** Precise font size adjustment using `NumberInput`.
- **Text Styling:** Toggles for Bold, Italic, and Underline.
- **Alignment:** Support for left, center, right, and justified alignment.
- **Advanced Typography:** Letter spacing (tracking) and line height adjustment.
- **Color Swatch:** Integrated color selection for text.
- **I18n Support:** Fully translatable labels and tooltips.

## How It Works

The component manages a `TextFormatValues` object. It uses sub-components like `FontSelect`, `ToggleBtn`, and `NumberInput` to provide a dense, professional UI. The `FontSelect` uses a `Portal` to ensure the font list is never clipped by parent containers.

### Font Management
It loads a curated set of Google Fonts (Serif, Sans-serif, Display, Script) by appending a `<link>` tag to the document head exactly once.

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `Partial<TextFormatValues>` | `defaultTextFormat` | Current formatting values. |
| `onChange` | `(patch: Partial<TextFormatValues>) => void` | - | Callback when a value changes. |
| `className` | `string` | - | Custom classes for the toolbar. |
| `messages` | `Partial<TextToolOptionsMessages>` | - | Custom i18n overrides. |

### TextFormatValues
```typescript
interface TextFormatValues {
  fontFamily: string
  fontSize: number
  bold: boolean
  italic: boolean
  underline: boolean
  textAlign: 'left' | 'center' | 'right' | 'justify'
  charSpacing: number
  lineHeight: number
  color: string
}
```

## Usage

```tsx
import { TextToolOptions, type TextFormatValues } from './components/text-tool-options'

function Editor() {
  const [format, setFormat] = useState<TextFormatValues>(defaultTextFormat)

  return (
    <TextToolOptions
      value={format}
      onChange={(patch) => setFormat(prev => ({ ...prev, ...patch }))}
    />
  )
}
```

## Dependencies

- `@ark-ui/react`: Portal management.
- `lucide-react`: Icons.
- `components/number-input`: For size and spacing.
- `components/color-swatch`: For text color.
- `components/i18n`: Internationalization.
