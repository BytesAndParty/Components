# Hover3DCard

Card with mouse-dependent 3D tilt perspective and glare overlay.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **3D tilt** | The card rotates on X and Y axes based on mouse position, creating a depth illusion with `perspective(800px)`. Maximum tilt angle is configurable. |
| **Scale on hover** | The card subtly scales to 1.02× while tilting for a "lift" effect. |
| **Glare overlay** | A radial gradient follows the cursor position, simulating light reflection on a glossy surface. |
| **Smooth return** | On mouse leave, the card transitions back to flat with a configurable transition speed (default 300ms). |
| **Responsive tracking** | During hover, the transform updates with only 50ms ease-out for near-instant following of the cursor. |

## How It Works

1. **Mouse position mapping**: `onMouseMove` calculates the cursor's normalized position (0–1 range) within the card bounds.
2. **Tilt calculation**: The normalized position is remapped to `±maxTilt` degrees for both X and Y rotation. Y is inverted so moving left tilts left.
3. **Differential transition speed**: While hovering, the transform uses a fast 50ms transition for tight cursor tracking. On leave, it uses the full `transitionSpeed` for a smooth return.
4. **Glare tracking**: The glare's `radial-gradient` center follows the cursor via `glarePos` state, creating a light-reflection that moves with the mouse.
5. **`preserve-3d`**: The card uses `transformStyle: preserve-3d` for proper 3D rendering of children.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | Card content |
| `maxTilt` | `number` | `15` | Maximum tilt angle in degrees |
| `glareIntensity` | `number` | `0.2` | Glare opacity (0–1) |
| `glare` | `boolean` | `true` | Enable/disable glare overlay |
| `transitionSpeed` | `number` | `300` | Return-to-flat transition in ms |
| `borderRadius` | `number` | `16` | Border radius in px |

## Dependencies

None (React only).
