# AnimatedIcons

Collection of animated icons — Lottie-based icons with play-on-hover/click behavior plus CSS-animated SVG icons.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Lottie hover play** | Icons play forward on mouse enter and reverse on mouse leave, creating a smooth in/out animation cycle. |
| **Lottie click play** | On click, the animation plays forward then auto-reverses after 1 second. |
| **Sun rays rotate** | CSS hover animation rotates and scales the sun ray group. |
| **Moon rock + twinkle** | Moon body rocks on hover; three stars sequentially twinkle in with staggered delays. |
| **Star spin-glow** | Star polygon spins 360° with a pulsing glow drop-shadow in the accent color. |
| **Wine tilt + slosh** | The wine glass tilts on hover; the liquid line sloshes with scale/rotate. |
| **Reduced motion** | All CSS icon animations are disabled via `prefers-reduced-motion: reduce` media query. |

## How It Works

1. **Factory pattern**: `createLottieIcon()` generates icon components from Lottie JSON data. Each icon shares the `useLottieHover` hook for consistent play/reverse behavior.
2. **`useLottieHover` hook**: Returns `lottieRef`, `onMouseEnter`, `onMouseLeave`, and `onClick` handlers. Uses `setDirection(1/-1)` + `play()` on the Lottie instance.
3. **CSS icon injection**: CSS-animated SVG icons inject their keyframes once via `injectCssOnce()` with a module-level flag.
4. **Color inversion**: Lottie icons use `filter: invert(1)` by default (since Lottie JSONs are typically black-on-white). A `--icon-invert` CSS custom property can override this.

## Available Icons

### Lottie Icons
`HomeIcon`, `SearchToXIcon`, `MenuIcon`, `MenuAltIcon`, `FilterIcon`, `NotificationIcon`, `VisibilityIcon`, `CheckmarkIcon`, `CopyIcon`, `LoadingIcon` (auto-loops), `MaximizeMinimizeIcon`, `ShareIcon`, `TrashIcon`

### CSS SVG Icons
`SunIconCss`, `MoonIconCss`, `StarIconCss`, `WineIconCss`

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `number` | `32` | Icon size in px |
| `className` | `string` | — | Additional CSS classes |
| `color` | `string` | — | Stroke color override (Lottie icons only) |
| `trigger` | `'hover' \| 'click'` | `'hover'` | Animation trigger (Lottie icons only) |

## Dependencies

- `lottie-react` — Lottie animation player
- Lottie JSON files from `_resources_/` directory
