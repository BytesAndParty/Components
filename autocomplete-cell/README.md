# autocomplete-cell

Autocomplete input with keyboard navigation and tab-completion.

## Files

- `autocomplete-cell.tsx`

## Props

- `value: string`
- `suggestions: { id: number | string; key: string; label: string }[]`
- `onChange(value: string)`
- `onKeyDown?(event)`
- `inputRef?(element)`
- `onFocus?()`
- `onBlur?()`
- `placeholder?: string` (default `"–"`)

## Behavior

- Arrow keys navigate dropdown
- Enter selects highlighted item
- Tab auto-completes to top match when input is partial
- Escape closes dropdown

## Usage

```tsx
import { AutocompleteCell } from '@/components/ui/autocomplete-cell'

<AutocompleteCell
  value={value}
  suggestions={suggestions}
  onChange={setValue}
/>
```
