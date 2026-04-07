# AccentSwitcher

A dependency-free accent color picker dropdown with smooth oklch color interpolation. Theme mode toggling is handled separately by [AnimatedThemeToggler](../animated-theme-toggler/).

## Dependencies

- `react`
- `lucide-react` (Palette icon)

No Tailwind, shadcn, or Radix UI required. The component uses inline styles only.

## Installation

Copy `accent-switcher.tsx` into your project.

## Usage

```tsx
import { AccentSwitcher } from './accent-switcher';

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
| `style` | `CSSProperties` | - | Additional wrapper styles |

## CSS Requirements

Define accent color tokens per palette using `data-accent` attribute selectors:

```css
:root {
  --accent: oklch(0.555 0.146 49); /* amber default */
}
[data-accent='emerald'] {
  --accent: oklch(0.511 0.086 186.4);
}
```

## Color Transition

Accent changes are smoothly interpolated in oklch color space via `requestAnimationFrame`. A persistent `<style>` element is injected into `<head>` and updated each frame with `:root { --accent: oklch(...) !important; }`. This overrides the `[data-accent]` CSS rules during the transition. At the end, the override is cleared and the CSS rule takes over.

The `granularity` prop controls the transition duration. Set to `0` for instant switching.

### Why JS interpolation instead of CSS transitions

CSS-only approaches were tried and none produced a visible transition:

1. **`@property` + CSS `transition`** — `@property` registered `--accent` as `<color>`, but attribute-selector value switches can't be interpolated by CSS.
2. **`@property` + inline `style.setProperty`** — Same registration, inline value change. Still no transition.
3. **Web Animations API + `@property`** — `element.animate({ '--accent': [from, to] })`. Also didn't work.
4. **Inline `style.setProperty` on `<html>`** — Set `--accent` via `document.documentElement.style.setProperty()` each frame. The value was set but had no visible effect on elements using `var(--accent)`.

The current approach (dynamic `<style>` element with `!important`) uses the same CSS cascade mechanism that the `[data-accent]` attribute selectors already prove works.

---

## Hover-Effekt auf den Palette-Icon-Dots — gescheiterte Versuche

Ziel: Beim Hover auf den Trigger-Button sollen die 4 Dots im Palette-Icon jeweils die Farben der konfigurierten Paletten annehmen (oklch-Werte).

### Was NICHT funktioniert hat

1. **CSS `var()` auf SVG `fill`** — CSS Custom Properties (`--dot-1` etc.) am SVG-Element gesetzt, in `<style>` via `.accent-trigger:hover .dot { fill: var(--dot-1); }` referenziert. Farben werden nicht angezeigt.

2. **Hardcodierte oklch in `<style>`-Tag** — `fill: oklch(0.585 0.233 277) !important` direkt im CSS. Keine Wirkung auf SVG `<circle>` Elemente.

3. **JS Hover State + `fill` Attribut** — `useState` trackt hover, `fill={hovered ? 'oklch(...)' : 'currentColor'}` direkt als React-Prop. SVG `fill`-Attribut kennt kein oklch — wird ignoriert.

4. **JS Hover State + `style={{ fill: 'oklch(...)' }}`** — Inline CSS-Property statt SVG-Attribut. Sollte theoretisch oklch unterstützen, zeigt aber keine Farbe auf den SVG-Circles.

5. **Dual SVG mit opacity swap** — Zwei übereinandergestapelte SVGs (mono + colored), auf Hover opacity 0/1 getauscht. Die Colored-SVG nutzt `fill={oklch}` als Attribut → selbes Problem wie #3.

6. **Dual SVG + `style={{ fill }}` statt Attribut** — Wie #5, aber mit CSS-Property. Selbes Ergebnis wie #4.

### Kern-Problem

`oklch()` als Farbwert wird in SVG-`fill` (weder als Attribut noch als CSS-Property auf `<circle>`) scheinbar nicht zuverlässig gerendert. Die CSS `color`-Property auf HTML-Elementen unterstützt oklch, aber SVG-Fill verhält sich anders.

### Lösung: `currentColor`-Trick

SVG ist grundsätzlich mehrfarbig — jedes Element kann eine eigene Farbe haben. Der Trick: `currentColor`-Vererbung über `<g style={{ color: 'oklch(...)' }}>` pro Dot nutzen, da `fill="currentColor"` den CSS-`color`-Wert auflöst.

```tsx
<g style={{ color: hovered ? 'oklch(0.555 0.146 49)' : 'inherit' }}>
  <circle cx="7.5" cy="7.5" r="3" fill="currentColor" />
</g>
```

CSS `color` unterstützt oklch, und `currentColor` bridgt den Wert zum SVG `fill`. Implementiert in `accent-switcher.tsx` (JS Hover mit `useState`). Alternative Variante (Dual SVG mit opacity swap) archiviert in `accent-switcher-v-dualsvg.tsx`.
