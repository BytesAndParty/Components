# AccentSwitcher

Accent color picker dropdown with smooth oklch color interpolation between palettes. Theme mode toggling is handled separately by [AnimatedThemeToggler](../animated-theme-toggler/COMPONENT.md).

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Color transition** | On palette switch, the accent color interpolates from current → target via oklch with easeInOutCubic easing. Duration configurable via `granularity` prop. |
| **Icon preview dots** | The 4 palette dots on the trigger icon reveal their actual oklch colors on hover via CSS `color` + `currentColor` trick (see below). |
| **Trigger hover** | Subtle background fade (`rgba(255,255,255,0.08)`) on mouse enter/leave. |
| **Dropdown item hover** | Each palette option highlights with a translucent overlay on hover. |
| **Active checkmark** | Currently selected palette shows a `✓` indicator plus a visually-hidden "current" suffix. |

## How It Works

1. **State from the Atelier system**: The active accent comes from `useAtelier()`; choosing a palette calls `setAccent`, and `AtelierProvider` persists it and writes `data-accent` on `<html>`. All switcher instances therefore stay in sync through context. `activePalette` overrides the displayed selection (controlled mode).
2. **oklch interpolation**: `parseOklch()` extracts L/C/H channels from oklch strings. `lerpOklch()` interpolates with shortest-path hue rotation (handles the 0°↔360° wrap).
3. **Animation loop**: On palette change, a `requestAnimationFrame` loop writes interpolated values to a dynamic `<style>` element as `:root { --accent: … !important; }`, overriding the `[data-accent]` CSS rule until the transition completes. Then the override is cleared and the CSS rule takes over.
4. **Keyboard**: WAI-ARIA menu pattern with `menuitemradio` items. ArrowDown/Enter/Space on the trigger opens the menu, arrow keys cycle items, Home/End jump to the ends, Escape closes and returns focus to the trigger.
5. **Outside click dismiss**: Dropdown closes on `mousedown` outside trigger or menu.

### Why JS interpolation instead of CSS transitions

None of the CSS-only approaches produced a visible transition:

1. `@property` registering `--accent` as `<color>` + CSS `transition` — a value switch via attribute selector is not interpolated.
2. `@property` + inline `style.setProperty` — same registration, still no transition.
3. Web Animations API on `--accent` (`element.animate({ '--accent': [from, to] })`) — no effect.
4. Inline `style.setProperty('--accent', …)` on `<html>` per frame — value was set but had no visible effect on `var(--accent)` consumers.

The dynamic `<style>` element with `!important` uses the same cascade mechanism the `[data-accent]` selectors already prove works.

### oklch on SVG fills: the `currentColor` trick

Coloring the trigger's palette dots with oklch failed in every direct form: CSS variables in `fill`, hardcoded oklch in a `<style>` block, the `fill` attribute, `style={{ fill }}`, and two stacked SVGs swapped by opacity. What works is setting CSS `color` (which accepts oklch) on a wrapping `<g>` and `fill="currentColor"` on the shape:

```tsx
<g style={{ color: hovered ? 'oklch(0.555 0.146 49)' : 'inherit' }}>
  <circle cx="7.5" cy="7.5" r="3" fill="currentColor" />
</g>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `palettes` | `Record<string, PaletteConfig>` | required | Map of palette key → `{ label, oklch }` |
| `activePalette` | `string` | — | Controlled mode: palette shown as active (falls back to the Atelier accent) |
| `granularity` | `number` | `400` | Transition duration in ms (0 = instant) |
| `onAccentChange` | `(key: string) => void` | — | Callback on palette change |
| `defaultPalette` | `string` | — | Currently ignored — the initial accent comes from `AtelierProvider` (`defaultAccent`) |
| `accentAttribute` | `string` | `'data-accent'` | Currently ignored — `AtelierProvider` always writes `data-accent` |
| `messages` | `Partial<AccentSwitcherMessages>` | — | i18n overrides for the trigger/dropdown label and the visually-hidden "current" suffix |
| `className` | `string` | — | Additional classes on the wrapper |
| `style` | `CSSProperties` | — | Inline styles on the wrapper |

## Usage

```tsx
import { AccentSwitcher } from '@components/accent-switcher/accent-switcher'

<AccentSwitcher
  palettes={{
    amber:     { label: 'Amber',     oklch: 'oklch(0.555 0.146 49)' },
    emerald:   { label: 'Emerald',   oklch: 'oklch(0.511 0.086 186.4)' },
    cobalt:    { label: 'Cobalt',    oklch: 'oklch(0.488 0.217 264.4)' },
  }}
  granularity={400}
  onAccentChange={(key) => console.log(key)}
/>
```

## CSS Requirements

Define the accent token per palette via `data-accent` attribute selectors (the showcase does this in `components-showcase/src/styles.css`):

```css
:root { --accent: oklch(0.555 0.146 49); }
[data-accent='emerald'] { --accent: oklch(0.511 0.086 186.4); }
```

## Dependencies

None beyond React and `@components/atelier` (must be rendered inside `AtelierProvider`).
