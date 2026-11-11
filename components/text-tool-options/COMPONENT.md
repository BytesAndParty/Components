# TextToolOptions

A comprehensive formatting toolbar for text elements, featuring font selection, sizing, and styling controls.

## Features

- **Font Family Selection:** Integrated Google Fonts catalogue with live previews, on Ark UI's `Select`: arrow keys, Home/End, type-ahead and Escape work. A font outside the catalogue (a system font on an older label) is listed as what it is instead of being shown as the first entry.
- **Dynamic Font Loading:** Automatically injects required Google Fonts into the document head. `font-loader.ts` exposes the same loader to hosts that draw text themselves (see below).
- **Sizing Controls:** Precise font size adjustment using `NumberInput`.
- **Text Styling:** Toggles for Bold, Italic, and Underline.
- **Alignment:** Support for left, center, right, and justified alignment.
- **Advanced Typography:** Letter spacing (tracking) and line height adjustment.
- **Color Swatch:** Integrated color selection for text.
- **I18n Support:** Fully translatable labels and tooltips.

## How It Works

The component manages a `TextFormatValues` object. It uses sub-components like `FontSelect`, `ToggleBtn`, and `NumberInput` to provide a dense, professional UI. The `FontSelect` uses a `Portal` to ensure the font list is never clipped by parent containers; inside a host that provides an overlay container (`components/lib/overlay-container.ts`) the list mounts there. The list mounts on open only, so its previews do not fetch all ten families up front.

### Font Management
It loads a curated set of Google Fonts (Serif, Sans-serif, Display, Script) by appending a `<link>` tag to the document head exactly once (`ensureFontStylesheet()` in `font-loader.ts`).

A host that draws text on a canvas must not measure it before the font is there: the canvas measures the fallback font and keeps those widths. `loadFonts(faces)` loads the given faces (`family`, `weight`, `style`, `text` for the unicode subsets) and resolves with the families that were not usable before the call, i.e. the ones whose text has to be measured again. `cellar-canvas` uses it in `FabricBridge.settleFonts`. The fonts still come from `fonts.googleapis.com`; self-hosting them is open (KNOWN-ISSUES 12.6).

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
import { TextToolOptions, type TextFormatValues } from '@components/text-tool-options/text-tool-options'

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

- `@ark-ui/react`: `Select` for the font list, Portal management.
- `lucide-react`: Icons.
- `components/number-input`: For size and spacing.
- `components/color-swatch`: For text color.
- `components/i18n`: Internationalization.
