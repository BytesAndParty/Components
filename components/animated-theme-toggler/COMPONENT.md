# AnimatedThemeToggler

Dark/light theme toggle button with View Transition API circle-reveal animation and animated SVG icons.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Circle reveal** | Theme switch triggers a `clipPath` circle animation expanding from the button's center to cover the entire viewport, using the View Transition API. |
| **Icon crossfade** | Sun and moon icons cross-transition via `rotate + scale(0↔1)` — the active icon scales in while the inactive scales out with a 90° rotation. |
| **Sun rays rotate** | On hover, the sun's ray group rotates 30° and scales 1.15× over 0.8s. |
| **Moon rock + stars** | On hover, the moon body rocks ±8°; three tiny stars twinkle in sequence with staggered delays. |
| **Button hover** | Background fades to `rgba(255,255,255,0.08)` on hover. |
| **Reduced motion** | All CSS hover animations respect `prefers-reduced-motion: reduce`. |

## How It Works

1. **View Transition API**: `document.startViewTransition()` captures the current page snapshot, applies the theme change via `flushSync`, then animates a `clipPath: circle()` on `::view-transition-new(root)`.
2. **Progressive enhancement**: If `startViewTransition` is not available (older browsers), the theme switches instantly without animation.
3. **Persistence**: Theme preference is stored in `localStorage('theme_pref')` and restored on mount.
4. **DOM sync**: Sets both `class="dark"` and `data-theme="light|dark"` on `<html>`. A `MutationObserver` watches the `class` attribute to sync state if changed externally.
5. **SSR safety**: Initial state reads from `localStorage` with a `typeof document` guard.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `duration` | `number` | `400` | View transition animation duration in ms |
| `iconSize` | `number` | `18` | SVG icon size in px |
| `onThemeChange` | `(isDark: boolean) => void` | — | Callback after theme changes |
| ...rest | `ButtonHTMLAttributes` | — | Spread to the `<button>` |

## Dependencies

- `react-dom` (`flushSync`) — Synchronous DOM updates during view transitions

## Browser Support

The View Transition API requires Chrome 111+, Edge 111+, or Safari 18+. Falls back gracefully to instant switches in unsupported browsers.
