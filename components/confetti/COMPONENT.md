# Confetti

Thin React wrapper around [`canvas-confetti`](https://github.com/catdad/canvas-confetti) — imperative bursts, a button that fires from its own position, and a declarative rain overlay.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Realistic burst** | Layered multi-shot pattern (5 fire calls) with varying spread, velocity, scalar, and decay for a natural look. |
| **Button origin** | `ConfettiButton` fires from the centre of the clicked button, calculated from its viewport position. |
| **Rain** | `ConfettiRain` / `fireConfettiRain()` drop waves of particles from random x positions along the top edge, one shot per colour group. |
| **3D confetti** | Particles wobble, tilt, and flutter as they fall — handled natively by canvas-confetti. |
| **Reduced motion** | Every shot passes `disableForReducedMotion: true`. |

## How It Works

1. **`fireConfetti()`** fires a "realistic look" burst pattern (from the canvas-confetti docs) on the global confetti canvas. Default origin is the viewport centre.
2. **`ConfettiButton`** calls the optional `onClick`, then `fireConfetti()` with `originX/Y` derived from the button's bounding box.
3. **`ConfettiRain`** creates a fixed fullscreen `<canvas>` (`aria-hidden`, `pointer-events: none`) while `active` is true, fires `waves` waves `waveDelay` ms apart via `confetti.create()`, and calls `onComplete` 3 s after the last wave. Timers and the cannon are cleaned up on unmount or when `active` turns false.
4. **`fireConfettiRain()`** is the imperative twin: it appends a temporary canvas to `<body>`, fires 5 waves 350 ms apart and removes the canvas after 4 s.
5. Without `colors`, the rain uses four built-in colour pairs (indigo, amber, emerald, rose).

## Exports

| Export | Type | Description |
|---|---|---|
| `fireConfetti(options?)` | Function | Fullscreen burst (from `fire.ts`) |
| `fireConfettiRain(options?)` | Function | Fullscreen rain from the top (from `fire.ts`) |
| `ConfettiButton` | Component | Button that bursts from its own position |
| `ConfettiRain` | Component | Declarative rain overlay |
| `ConfettiOptions` | Type | Shared option bag |

## Props

### ConfettiButton

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | Button content |
| `confettiOptions` | `ConfettiOptions` | — | Particle count, spread, velocity, gravity, colors, shapes, … |
| `onClick` | `(e) => void` | — | Additional click handler (runs before the burst) |
| `disabled` | `boolean` | — | Disables the button |
| `className` | `string` | — | Classes on the `<button>` |
| `style` | `CSSProperties` | — | Inline styles on the `<button>` |

### ConfettiRain

| Prop | Type | Default | Description |
|---|---|---|---|
| `active` | `boolean` | required | Starts the rain when `true`; renders nothing when `false` |
| `onComplete` | `() => void` | — | Called 3 s after the last wave |
| `particleCount` | `number` | `400` | Total particles across all waves |
| `colors` | `string[]` | built-in pairs | Particle colours |
| `waves` | `number` | `7` | Number of waves |
| `waveDelay` | `number` | `500` | Delay between waves in ms |

### ConfettiOptions

`particleCount` (burst default 200), `spread`, `angle`, `startVelocity`, `gravity`, `decay`, `colors`, `originX` / `originY` (0–1), `shapes` (`'square' | 'circle' | 'star'`), `scalar`, `ticks`, `drift`.

## Usage

```tsx
import { ConfettiButton, ConfettiRain } from '@components/confetti/confetti'
import { fireConfetti } from '@components/confetti/fire'

<ConfettiButton confettiOptions={{ particleCount: 150 }}>Bestellen</ConfettiButton>

const [raining, setRaining] = useState(false)
<ConfettiRain active={raining} onComplete={() => setRaining(false)} />

fireConfetti({ colors: ['#7f1d1d', '#d4a373'] })
```

## Dependencies

`canvas-confetti`
