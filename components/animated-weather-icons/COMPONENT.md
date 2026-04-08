# AnimatedWeatherIcons

Collection of 12 SVG weather icons with continuous Framer Motion looping animations — pulsing suns, twinkling stars, falling rain, flickering lightning, and more.

## Icons

| Icon | Animation |
|---|---|
| `SunIcon` | Core circle pulses (`scale 1→1.15→1`); ray lines rotate 360° continuously (12s linear loop). |
| `MoonIcon` | Static crescent path; four star dots pulse `scale + opacity` with staggered delays (0.4s each). |
| `CloudIcon` | Cloud path drifts horizontally (`x: -2 → 2 → -2`, 6s loop). |
| `RainIcon` | Static cloud; four rain lines drop downward (`y: 0→6`) and fade out, staggered by 0.2s. |
| `HeavyRainIcon` | Static cloud; six diagonal rain lines (`y: 0→8, opacity 1→0`), faster pace (0.6s). |
| `SnowIcon` | Static cloud; six snowflakes drift down with lateral sway (`y: 0→8, x: ±3`), staggered. |
| `ThunderIcon` | Static cloud; lightning bolt path flickers via 10-step opacity sequence (flash-pause pattern, 3s). |
| `WindIcon` | Three curved wind lines draw on/off via `pathLength` animation, staggered by 0.3s. |
| `FogIcon` | Four horizontal bars drift left/right (`x: -3→3`) with fading opacity, staggered by 0.5s. |
| `PartlyCloudyIcon` | Sun group with rays rotates (20s); cloud drifts horizontally (5s). |
| `SunriseIcon` | Horizon line; sun bounces up/down (`y: 4→0→4`); upward arrow pulses. |
| `RainbowIcon` | Four colored arcs draw in via `pathLength 0→1`, staggered by 0.1s, repeat with 1s pause. |

## Micro-Interactions

All animations are declarative Framer Motion `animate` props with `repeat: Infinity`:

- **Pulse** — `scale` keyframes (Sun, Moon stars)
- **Drift** — `x` keyframes (Cloud, Fog, PartlyCloudy)
- **Drop** — `y` + `opacity` (Rain, HeavyRain, Snow)
- **Flash** — multi-step `opacity` array (Thunder)
- **Path draw** — `pathLength 0→1→0` (Wind, Rainbow)
- **Rotation** — `rotate: 360` with `ease: 'linear'` (Sun rays, PartlyCloudy sun)

## Props (shared interface)

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `number` | `48` | SVG width and height |
| `className` | `string` | — | Additional CSS class |
| `style` | `CSSProperties` | — | Inline styles |

## Exports

All icons are individual named exports (`SunIcon`, `MoonIcon`, etc.) plus a barrel object `weatherIcons` containing all 12.

## Dependencies

- `framer-motion` — All animation via `motion.*` components
