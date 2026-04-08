# Particles

Canvas-based floating particle background with optional mouse interaction.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Floating drift** | Particles move continuously in random directions with configurable speed. |
| **Edge wrapping** | Particles wrap around canvas edges for seamless infinite movement. |
| **Mouse repulsion** | When `moveParticlesOnHover` is enabled, particles push away from the cursor within `hoverRadius`. |

## How It Works

1. **Canvas 2D**: Renders on a `<canvas>` element using the 2D context — no WebGL dependency.
2. **DPR-aware**: Canvas resolution is multiplied by `devicePixelRatio` for crisp rendering on retina displays.
3. **ResizeObserver**: Automatically re-initializes particles when the container size changes.
4. **requestAnimationFrame**: Animation loop runs at display refresh rate with proper cleanup on unmount.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `particleColors` | `string[]` | `['#ffffff']` | Color palette — each particle picks a random color |
| `particleCount` | `number` | `200` | Total number of particles |
| `particleSpread` | `number` | `10` | Spread factor (scales initial distribution) |
| `speed` | `number` | `0.1` | Base movement speed multiplier |
| `particleBaseSize` | `number` | `2` | Maximum additional radius in px (actual: 1 to baseSize+1) |
| `moveParticlesOnHover` | `boolean` | `false` | Enable mouse repulsion effect |
| `hoverRadius` | `number` | `80` | Radius of the mouse repulsion zone in px |

## Dependencies

None (React only, uses Canvas 2D API).
