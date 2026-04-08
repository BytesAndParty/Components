# Confetti

Canvas-based confetti particle system with an imperative API and a ready-to-use button component.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Particle burst** | On trigger, particles launch from the origin point with randomized velocity, angle, rotation, and size. |
| **Physics simulation** | Particles follow a gravity + decay model — they arc upward, slow down, and fall with natural motion. |
| **Rotation** | Each particle spins independently with a random rotation speed. |
| **Fade out** | Particles fade to 0 opacity in the last 30% of their lifetime. |
| **Shape variety** | Each particle is randomly either a rectangle or a circle for visual diversity. |
| **Multi-burst (fullscreen)** | `fireConfetti()` spreads particles across 3 origin points (15%, 50%, 85% of viewport width) for fuller coverage. |

## How It Works

1. **Particle creation**: `createParticle()` generates a particle with random velocity (within spread angle), random shape, color, size, and rotation.
2. **Animation loop**: `renderConfetti()` runs a `requestAnimationFrame` loop, applying gravity, decay, and drawing each particle to a canvas via the 2D context.
3. **DPR-aware canvas**: Canvas dimensions are multiplied by `devicePixelRatio` for sharp rendering on high-DPI screens.
4. **Two modes**:
   - **Fullscreen**: `fireConfetti()` creates a temporary `<canvas>` fixed overlay and auto-removes it after the animation.
   - **Local**: `ConfettiButton` has its own canvas positioned behind the button.

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

None (React only, uses Canvas API).
