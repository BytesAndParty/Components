# AccentSwitcher

A shadcn-style component for theme mode (light/dark) and accent color switching.

## Dependencies

- `react`
- `lucide-react` (Sun, Moon, Palette icons)
- `@radix-ui/react-dropdown-menu`
- shadcn `Button` + `DropdownMenu` components
- `cn()` utility (clsx + tailwind-merge)

## Installation

Copy `accent-switcher.tsx` into your `src/components/ui/` directory.

Ensure you have the shadcn `Button` and `DropdownMenu` components installed:

```bash
npx shadcn@latest add button dropdown-menu
```

## Usage

```tsx
import { AccentSwitcher } from '@/components/ui/accent-switcher';

<AccentSwitcher
  palettes={{
    amber:     { label: 'Amber',     oklch: 'oklch(0.555 0.146 49)' },
    emerald:   { label: 'Emerald',   oklch: 'oklch(0.511 0.086 186.4)' },
    cobalt:    { label: 'Cobalt',    oklch: 'oklch(0.488 0.217 264.4)' },
    raspberry: { label: 'Raspberry', oklch: 'oklch(0.525 0.199 4)' },
  }}
  defaultPalette="amber"
  themeStorageKey="my_theme_pref"
  dropdownLabel="Accent color"
  onThemeChange={(mode) => console.log(mode)}
  onAccentChange={(key) => console.log(key)}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `palettes` | `Record<string, { label, oklch }>` | required | Available accent palettes |
| `defaultPalette` | `string` | first key | Fallback palette |
| `activePalette` | `string` | - | Controlled active palette |
| `themeStorageKey` | `string` | `"theme_pref"` | localStorage key for theme mode |
| `accentAttribute` | `string` | `"data-accent"` | HTML attribute for accent |
| `themeAttribute` | `string` | `"data-theme"` | HTML attribute for theme mode |
| `toggleDarkClass` | `boolean` | `true` | Toggle `.dark` class on `<html>` |
| `dropdownLabel` | `string` | `"Accent color"` | Dropdown header text |
| `onThemeChange` | `(mode) => void` | - | Callback on theme change |
| `onAccentChange` | `(key) => void` | - | Callback on accent change |
| `className` | `string` | - | Additional wrapper classes |

## CSS Requirements

Define accent color tokens per palette using `data-accent` attribute selectors:

```css
:root {
  --accent-primary: oklch(0.555 0.146 49); /* amber default */
}
html[data-accent='emerald'] {
  --accent-primary: oklch(0.511 0.086 186.4);
}
```

Support dark mode via `data-theme="dark"` and/or `.dark` class.
