# SplashCursor

Full-screen WebGL fluid simulation that reacts to mouse/touch movement — colorful ink-like splats follow the cursor, with velocity-driven diffusion, pressure, and vorticity for realistic fluid dynamics.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Cursor trail** | Moving the mouse/touch continuously splats dye at the pointer position, scaled by `SPLAT_FORCE` and velocity delta. |
| **Click burst** | Mouse clicks trigger a colorful burst with random directional impulse. |
| **Color cycling** | Pointer colors auto-cycle at `COLOR_UPDATE_SPEED`, producing ever-changing hues. |
| **Fluid physics** | Each frame runs a Navier-Stokes-inspired simulation: advection, divergence, pressure solve (Jacobi iterations), vorticity confinement, and gradient subtraction. |
| **Density dissipation** | Ink fades over time at `DENSITY_DISSIPATION` rate, preventing permanent marks. |
| **Shading** | Optional normal-based diffuse shading gives the fluid 3D-like depth. |
| **Lazy start** | The animation loop only starts on the first mouse/touch interaction, saving GPU until needed. |

## How It Works

1. **WebGL context**: Acquires WebGL2 (fallback WebGL1) with floating-point texture support. Checks for `OES_texture_float_linear` and adjusts quality if unsupported.
2. **Double-buffered FBOs**: Velocity and dye fields use ping-pong framebuffers (`createDoubleFBO`) for read/write swaps each simulation step.
3. **GLSL pipeline**: 9 shader programs run per frame — curl, vorticity, divergence, clear, pressure (N iterations), gradient subtract, advection (velocity), advection (dye), and display.
4. **Canvas overlay**: Renders into a `position: fixed` canvas covering the viewport at `z-index: 50` with `pointer-events: none`.
5. **Cleanup**: The `useEffect` return properly cancels `requestAnimationFrame` and removes all event listeners.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `SIM_RESOLUTION` | `number` | `128` | Velocity field resolution |
| `DYE_RESOLUTION` | `number` | `1440` | Dye (color) field resolution |
| `CAPTURE_RESOLUTION` | `number` | `512` | Capture resolution |
| `DENSITY_DISSIPATION` | `number` | `3.5` | How fast dye fades |
| `VELOCITY_DISSIPATION` | `number` | `2` | How fast velocity decays |
| `PRESSURE` | `number` | `0.1` | Pressure solve intensity |
| `PRESSURE_ITERATIONS` | `number` | `20` | Jacobi iteration count |
| `CURL` | `number` | `3` | Vorticity confinement strength |
| `SPLAT_RADIUS` | `number` | `0.2` | Radius of ink splats |
| `SPLAT_FORCE` | `number` | `6000` | Force multiplier for splats |
| `SHADING` | `boolean` | `true` | Enable 3D-like shading |
| `COLOR_UPDATE_SPEED` | `number` | `10` | How fast colors cycle |
| `BACK_COLOR` | `{ r, g, b }` | `{ r:0.5, g:0, b:0 }` | Background color |
| `TRANSPARENT` | `boolean` | `true` | Transparent background |

## Notes

- ~1100 lines, mostly WebGL boilerplate. Based on [PavelDoGreat/WebGL-Fluid-Simulation](https://github.com/nicoptere/webgl-fluid-simulation).
- Not a candidate for splitting — the GLSL shaders, FBO management, and simulation loop are tightly coupled.
- Consider `prefers-reduced-motion` to disable or reduce simulation intensity.

## Dependencies

- None (React + raw WebGL)
