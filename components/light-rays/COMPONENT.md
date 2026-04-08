# LightRays

WebGL shader-based volumetric light rays with configurable origin, color, mouse tracking, and visual effects.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Animated rays** | Two overlapping ray layers animate via time-based sine/cosine functions, creating organic, flickering light beams. |
| **Mouse tracking** | When `followMouse` is enabled, the ray direction smoothly interpolates toward the mouse position with configurable influence strength. |
| **Pulsating brightness** | Optional periodic brightness oscillation adds a breathing effect to the light rays. |
| **Noise texture** | A noise function can be applied to break up perfectly smooth rays, adding atmospheric realism. |
| **Ray distortion** | Sinusoidal distortion warps ray edges over time for a more organic, less geometric look. |

## How It Works

1. **WebGL setup**: A `<canvas>` is created imperatively in a `useEffect`. The vertex shader renders a full-screen triangle; the fragment shader runs per-pixel ray calculations.
2. **Fragment shader**: Two ray layers are computed with different frequency seeds and speed multipliers. Each calculates angular spread, distance falloff, and optional distortion per pixel.
3. **Uniform pipeline**: All configurable props are passed as WebGL uniforms. Static uniforms are set once; `iTime` and `mousePos` update per frame.
4. **Smooth mouse following**: Raw mouse coordinates are low-pass filtered (`k=0.08` lerp factor) for smooth, non-jittery tracking.
5. **DPR handling**: Canvas resolution is scaled by `devicePixelRatio` (capped at 2×) for sharp rendering without excessive GPU cost.
6. **Resize observer**: A `ResizeObserver` watches the container and updates canvas dimensions + viewport + ray origin.
7. **Full cleanup**: On unmount, all WebGL resources (buffers, shaders, program, context) are explicitly freed to prevent GPU memory leaks.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `raysOrigin` | `RaysOrigin` | `'top-center'` | Where rays emanate from (8 positions) |
| `raysColor` | `string` | `'#ffffff'` | Ray color (hex) |
| `raysSpeed` | `number` | `1` | Animation speed multiplier |
| `lightSpread` | `number` | `1` | Cone width (lower = tighter) |
| `rayLength` | `number` | `2` | How far rays reach |
| `pulsating` | `boolean` | `false` | Enable brightness pulsation |
| `fadeDistance` | `number` | `1` | Base fade distance |
| `saturation` | `number` | `1` | Color saturation |
| `followMouse` | `boolean` | `false` | React to cursor position |
| `mouseInfluence` | `number` | `0.1` | How strongly mouse affects direction |
| `noiseAmount` | `number` | `0` | Noise overlay intensity |
| `distortion` | `number` | `0` | Ray edge distortion amount |

## Dependencies

None (React only, uses WebGL API).

## Browser Support

Requires WebGL 1.0. Falls back silently with a console warning if WebGL is unavailable.
