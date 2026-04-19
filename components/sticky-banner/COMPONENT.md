# StickyBanner

Sticky announcement bar that slides in on mount, can be dismissed, and optionally persists the dismissal in `localStorage`. A theme-aware, richer alternative to the plain `Banner` — sticky position, optional scroll-reveal, gradient variants, and an `action` slot (e.g. for an inline `Countdown`).

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Slide-in on mount** | On first render `visible = false` → `true` next tick, so the banner translates from `±120%` to `0` with a 350 ms ease-out curve. No flash. |
| **Scroll-reveal** | With `showAfterScrollY`, the banner stays hidden until the user has scrolled past the threshold. Re-hides if they scroll back up. |
| **Dismiss** | Close button fades in on hover, banner unmounts via state on click. Optional `persistKey` stores dismissal in `localStorage`, so it stays gone across reloads. |
| **Sticky** | `position: sticky; top: 0` (or `bottom: 0`), so it sits at the edge of the scroll container. When placed at the page level, it sticks as the user scrolls. |

## How It Works

1. **Variants** as inline style objects (`accent`, `neutral`, `warning`, `danger`). Accent variant gradients use `color-mix(in oklch, var(--accent) 94%, black)` so they follow the active accent palette automatically. Warning + danger use fixed amber/red gradients — semantic meaning shouldn't shift with accent.
2. **LocalStorage dismissal**: `persistKey` + `LS_PREFIX` → `localStorage.setItem("sticky-banner:dismissed:<key>", "1")`. On mount, `readDismissed` checks the same key and sets state accordingly. Try/catch guards against quota/private-mode errors.
3. **Mount gate**: `mounted` starts `false` and flips to `true` in an effect so the very first paint is off-screen — producing the slide-in transition without SSR mismatch.
4. **Action slot**: An `action` prop is rendered next to the children, typically used for a `<Countdown>` or a small CTA button. Keeps the main copy + the dynamic bit in a single flex row.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Primary banner copy |
| `position` | `'top' \| 'bottom'` | `'top'` | Stick to top or bottom of the scroll container |
| `variant` | `'accent' \| 'neutral' \| 'warning' \| 'danger'` | `'accent'` | Preset background + border |
| `dismissible` | `boolean` | `true` | Show the X button |
| `onDismiss` | `() => void` | — | Fired when the banner is closed |
| `persistKey` | `string \| null` | `null` | LocalStorage key — when set, dismissal persists across reloads |
| `action` | `ReactNode` | — | Optional node placed next to `children` (e.g. `<Countdown />`) |
| `showAfterScrollY` | `number` | — | Only show after the page has scrolled past this Y offset |
| `zIndex` | `number` | `50` | `z-index` of the sticky container |
| `className` / `style` | — | — | Forwarded to the wrapper |

## Dependencies

- None (React only)
