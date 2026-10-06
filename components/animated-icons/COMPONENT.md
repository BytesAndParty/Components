# AnimatedIcons

Collection of animated icons — Lottie-based icons with play-on-hover/click behavior plus CSS-animated SVG icons.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Lottie hover play** | Icons play forward on mouse enter and reverse on mouse leave, creating a smooth in/out animation cycle. |
| **Lottie click play** | On click (or Enter/Space), the animation plays forward then auto-reverses after 1 second. |
| **Sun rays rotate** | CSS hover animation rotates and scales the sun ray group. |
| **Moon rock + twinkle** | Moon body rocks on hover; three stars sequentially twinkle in with staggered delays. |
| **Star spin-glow** | Star polygon spins 360° with a pulsing glow drop-shadow in the accent color. |
| **Wine tilt + slosh** | The wine glass tilts on hover; the liquid line sloshes with scale/rotate. |
| **Heart toggle** | `HeartIconCss` / `Heart3DIconCss` are real toggle buttons (`aria-pressed`) that fill red with a soft drop-shadow when liked. |
| **Reduced motion** | All CSS icon animations are disabled via `prefers-reduced-motion: reduce` media query. |

## How It Works

1. **Factory pattern**: `createLottieIcon()` generates icon components from Lottie JSON data, rendered with `DotLottieReact`. Each icon shares the `useLottieHover` hook for consistent play/reverse behavior.
2. **`useLottieHover` hook**: Mirrors the dotLottie player instance (delivered via `dotLottieRefCallback`) in a ref and returns `setPlayer`, `onMouseEnter`, `onMouseLeave` and `onClick`. Direction switches via `setMode('forward' | 'reverse')` + `play()`.
3. **CSS icon injection**: CSS-animated SVG icons inject their keyframes once (`__animated-icons-styles__`) via `useInsertionEffect` — before layout, so there is no unstyled first paint.
4. **Lottie coloring**: dotLottie renders to `<canvas>`, so CSS cannot color the strokes. The wrapper carries the color (`color` prop or inherited `currentColor`); after mount `resolveCssColor()` paints it into a 1×1 canvas to get sRGB values, and `recolorLottie()` replaces every static **black** fill/stroke in the animation data with it. Other colors stay (the red badge of `NotificationIcon`). A `MutationObserver` on `<html>` (`class`, `data-theme`, `data-accent`) re-resolves on theme/accent switches, once more 500 ms later so an accent fade can settle. The player mounts once the first color is resolved. Both helpers live in `lottie-color.ts`.
5. **Accessibility**: Without `aria-label` the icon is decorative (`aria-hidden`); with it, the wrapper becomes `role="img"`. Click-trigger Lottie icons are focusable (`role="button"`, `tabIndex={0}`) and react to Enter/Space.

## Available Icons

### Lottie Icons
`HomeIcon`, `SearchToXIcon`, `MenuIcon`, `MenuAltIcon`, `FilterIcon`, `NotificationIcon`, `VisibilityIcon`, `CheckmarkIcon`, `CopyIcon`, `LoadingIcon` (auto-loops), `MaximizeMinimizeIcon`, `ShareIcon`, `TrashIcon`

### CSS SVG Icons
`SunIconCss`, `MoonIconCss`, `StarIconCss`, `WineIconCss`, `ChevronDownIconCss`, `ChevronRightIconCss`, `UserIconCss`, `PlusIconCss`, `MinusIconCss`, `TruckIconCss`, `HeartIconCss`, `Heart3DIconCss`

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `number` | `32` | Icon size in px |
| `className` | `string` | — | Additional CSS classes |
| `aria-label` | `string` | — | Accessible name. Omit for decorative icons (`aria-hidden`). Heart icons fall back to `'Like'`. |
| `color` | `string` | inherited text color | Lottie icons only: any CSS color incl. `var(--accent)` or oklch |
| `trigger` | `'hover' \| 'click'` | `'hover'` | Animation trigger (Lottie icons only) |

## Dependencies

- `@lottiefiles/dotlottie-react` — dotLottie player (WASM)
- Lottie JSON files from `_resources_/` directory
