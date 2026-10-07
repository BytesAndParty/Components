# Confetti

Thin React wrapper around [`canvas-confetti`](https://github.com/catdad/canvas-confetti) — imperative bursts, a button that fires from its own position, and a declarative rain overlay.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Realistic burst** | Layered multi-shot pattern (5 fire calls) with varying spread, velocity, scalar, and decay for a natural look. |
| **Button origin** | `ConfettiButton` fires from the centre of the clicked button, calculated from its viewport position. |
| **Rain** | `ConfettiRain` / `fireConfettiRain()` let single particles fall in at random x positions just above the top edge, evenly spread over `duration`, with no launch impulse and a little side wind. Reads as falling rain, not as bursts. |
| **3D confetti** | Particles wobble, tilt, and flutter as they fall — handled natively by canvas-confetti. |
| **Reduced motion** | Every burst passes `disableForReducedMotion: true`; the rain does not start at all and completes immediately. |

## How It Works

1. **`fireConfetti()`** fires a "realistic look" burst pattern (from the canvas-confetti docs) on the global confetti canvas. Default origin is the viewport centre.
2. **`ConfettiButton`** calls the optional `onClick`, then `fireConfetti()` with `originX/Y` derived from the button's bounding box.
3. **`startRain(cannon, options)`** (in `fire.ts`) drives the rain: a `requestAnimationFrame` loop fires one particle at a time (`startVelocity: 0`, random gravity 1.4–2.0, random drift) until `particleCount` is reached after `duration` ms. canvas-confetti fades particles linearly over their lifetime, so each particle lives ~1.8× its travel time to stay visible down to the bottom edge. `done` resolves once the slowest particle has left the viewport; the off-screen remainder is cleared with `reset()`. That end is counted in canvas-confetti ticks with the library's own throttle (at most one tick per 16 ms), not in milliseconds, so the rain is not cut off early on 75/90/144 Hz displays. A background tab pauses the schedule instead of dropping all missed particles at once on return. `cancel()` stops everything immediately and also resolves `done`.
4. **`ConfettiRain`** renders a fixed fullscreen `<canvas>` (`aria-hidden`, `pointer-events: none`) while `active` is true, creates a fresh cannon for it on every run and calls `onComplete` when the rain is done. Turning `active` off or unmounting cancels the rain.
5. **`fireConfettiRain()`** is the imperative twin: it appends a temporary canvas to `<body>` and removes it when the rain is done.
6. Without `colors`, the rain uses the built-in palette (indigo, amber, emerald, rose).

## Exports

| Export | Type | Description |
|---|---|---|
| `fireConfetti(options?)` | Function | Fullscreen burst (from `fire.ts`) |
| `fireConfettiRain(options?)` | Function | Fullscreen rain from the top (from `fire.ts`), takes `RainOptions` |
| `startRain(cannon, options?)` | Function | Rain on your own `confetti.create()` cannon, returns `{ done, cancel }` (from `fire.ts`) |
| `ConfettiButton` | Component | Button that bursts from its own position |
| `ConfettiRain` | Component | Declarative rain overlay |
| `ConfettiOptions` | Type | Option bag for bursts |
| `RainOptions` | Type | `particleCount`, `duration`, `colors` for the rain (from `fire.ts`) |

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
| `onComplete` | `() => void` | — | Called once the last particle has left the viewport |
| `particleCount` | `number` | `400` | Total particles over the whole rain |
| `colors` | `string[]` | built-in palette | Particle colours |
| `duration` | `number` | `3000` | How long new confetti keeps falling in, in ms |

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
