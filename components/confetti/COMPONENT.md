# Confetti

Thin React wrapper around [`canvas-confetti`](https://github.com/catdad/canvas-confetti) — with imperative API and a ready-to-use button component.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Realistic burst** | Layered multi-shot pattern (5 fire calls) with varying spread, velocity, scalar, and decay for a natural look. |
| **3D confetti** | Particles wobble, tilt, and flutter as they fall — handled natively by canvas-confetti. |
| **Shape variety** | Squares, circles, and stars with automatic random selection. |
| **Reduced motion** | Respects `prefers-reduced-motion` via `disableForReducedMotion`. |

## How It Works

1. **`fireConfetti()`** fires a "realistic look" burst pattern (from canvas-confetti docs) on the global confetti instance.
2. **`ConfettiButton` in local mode** uses `confetti.create(canvas)` to scope the effect to a canvas positioned around the button.
3. **`ConfettiButton` in fullscreen mode** calculates origin from button position and delegates to `fireConfetti()`.

## Exports

| Export | Type | Description |
|---|---|---|
| `fireConfetti(options?)` | Function | Imperative API — fires fullscreen confetti |
| `ConfettiButton` | Component | Button with built-in confetti (local or fullscreen) |

## Props (ConfettiButton)

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | Button content |
| `mode` | `'fullscreen' \| 'local'` | `'local'` | Where confetti renders |
| `confettiOptions` | `ConfettiOptions` | — | Particle count, spread, velocity, gravity, etc. |
| `onClick` | `(e) => void` | — | Additional click handler |

## Dependencies

`canvas-confetti`
