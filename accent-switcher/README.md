# AccentSwitcher

An accent color picker dropdown built on shadcn DropdownMenu. Theme mode toggling is handled separately by [AnimatedThemeToggler](../animated-theme-toggler/).

## Dependencies

- `react`
- `lucide-react` (Palette icon)
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
  granularity={400}
  onAccentChange={(key) => console.log(key)}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `palettes` | `Record<string, { label, oklch }>` | required | Available accent palettes |
| `defaultPalette` | `string` | first key | Fallback palette |
| `activePalette` | `string` | - | Controlled active palette |
| `accentAttribute` | `string` | `"data-accent"` | HTML attribute for accent |
| `dropdownLabel` | `string` | `"Accent color"` | Dropdown header text |
| `granularity` | `number` | `400` | Transition duration in ms for the color fade. 0 = instant |
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

## Color Transition

Accent changes are smoothly interpolated in oklch color space via `requestAnimationFrame`. The component parses the oklch values from each palette, lerps L/C/H (using shortest hue path), and sets `--accent` via inline `style.setProperty` each frame. At the end of the transition the inline override is removed so the CSS `[data-accent]` rule takes over.

The `granularity` prop controls the transition duration. Set to `0` for instant switching.

### Why JS interpolation instead of CSS transitions

CSS-only approaches were tried and none produced a visible transition:

1. **`@property` + CSS `transition`** — `@property` registered `--accent` as `<color>`, but attribute-selector value switches can't be interpolated by CSS.
2. **`@property` + inline `style.setProperty`** — Same registration, inline value change. Still no transition.
3. **Web Animations API + `@property`** — `element.animate({ '--accent': [from, to] })`. Also didn't work.

All three failed due to browser limitations with oklch values in custom property animations. The current rAF-based JS approach bypasses this entirely.
