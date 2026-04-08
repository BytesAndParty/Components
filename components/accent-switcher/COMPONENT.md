# AccentSwitcher

Accent color picker dropdown with smooth oklch color interpolation between palettes.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Color transition** | On palette switch, the accent color interpolates from current → target via oklch with easeInOutCubic easing. Duration configurable via `granularity` prop. |
| **Icon preview dots** | The 4 palette dots on the trigger icon reveal their actual oklch colors on hover via CSS `color` + `currentColor` trick. |
| **Trigger hover** | Subtle background fade (`rgba(255,255,255,0.08)`) on mouse enter/leave. |
| **Dropdown item hover** | Each palette option highlights with a translucent overlay on hover. |
| **Active checkmark** | Currently selected palette shows a `✓` indicator. |

## How It Works

1. **oklch interpolation**: `parseOklch()` extracts L/C/H channels from oklch strings. `lerpOklch()` interpolates with shortest-path hue rotation (handles the 0°↔360° wrap).
2. **Animation loop**: On palette change, a `requestAnimationFrame` loop writes interpolated values to a dynamic `<style>` element with `!important`, overriding the CSS variable `--accent` until the transition completes.
3. **Multi-instance sync**: A `MutationObserver` watches `document.documentElement` for changes to the accent attribute, so multiple AccentSwitcher instances stay in sync.
4. **Outside click dismiss**: Dropdown closes when clicking outside trigger or menu areas.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `palettes` | `Record<string, PaletteConfig>` | required | Map of palette key → `{ label, oklch }` |
| `defaultPalette` | `string` | first key | Initial palette key |
| `activePalette` | `string` | — | Controlled mode: currently active key |
| `accentAttribute` | `string` | `'data-accent'` | HTML attribute set on `<html>` |
| `granularity` | `number` | `400` | Transition duration in ms (0 = instant) |
| `onAccentChange` | `(key: string) => void` | — | Callback on palette change |
| `dropdownLabel` | `string` | `'Accent color'` | Dropdown header label |

## Dependencies

None (React only).

## Variants

- `accent-switcher.tsx` — Main component with oklch interpolation
- `accent-switcher-v-dualsvg.tsx` — Alternate version with dual SVG icons
