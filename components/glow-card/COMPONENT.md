# GlowCard

Two card variants with glow effects — cursor-tracking glow border and rotating conic gradient border.

## Variants

### GlowCard (cursor-tracking)

A card whose border glows in a radial gradient that follows the mouse cursor.

#### Micro-Interactions

| Interaction | Detail |
|---|---|
| **Cursor-following glow** | A radial gradient on the border tracks the mouse position via CSS custom properties (`--glow-x`, `--glow-y`). |
| **Fade in/out** | The glow layer fades from 0 to 1 opacity on hover with a 500ms transition. |

#### How It Works

1. **Mouse tracking**: `onMouseMove` calculates cursor position relative to the card and stores it in state.
2. **CSS custom properties**: The glow position, opacity, and size are set as inline CSS custom properties, consumed by the radial gradient.
3. **Mask-based border**: The glow layer uses `mask: ... content-box exclude` to render only the border area, not the card interior. This creates a clean glow-border without affecting content.
4. **Performance**: `useMemo` prevents recalculation of the glow style object on unrelated re-renders.

### RotatingGlowCard (animated border)

A card with a continuously rotating conic gradient border and a blurred glow halo.

#### Micro-Interactions

| Interaction | Detail |
|---|---|
| **Rotating gradient** | A conic gradient spins continuously around the card border (`glow-spin` keyframe). |
| **Glow halo** | A blurred copy of the gradient creates a soft glow effect behind the border. |
| **Two modes** | `'full'` renders a symmetric gradient; `'stripe'` renders a single narrow stripe orbiting the border. |

#### How It Works

1. **Overflow + padding**: The outer div uses `overflow: hidden` with padding equal to `borderWidth`, creating a "frame" that the rotating gradient fills.
2. **200% oversized spinner**: The gradient div is 200% of the card size, centered with `translate(-50%, -50%)`, so the rotation covers all border angles.
3. **Dual layers**: One sharp gradient for the visible border, one blurred (12px) at reduced opacity for the glow.
4. **`color-mix` default**: The secondary color defaults to a lighter variant of `--accent` using CSS `color-mix(in oklch)`.

## Props (GlowCard)

| Prop | Type | Default | Description |
|---|---|---|---|
| `glowRadius` | `number` | `250` | Size of the glow radial gradient |
| `glowColor` | `string` | `'var(--accent)'` | Primary glow color |
| `accentColor` | `string` | `'var(--accent)'` | Outer glow ring color |

## Props (RotatingGlowCard)

| Prop | Type | Default | Description |
|---|---|---|---|
| `duration` | `number` | `3` | Rotation cycle in seconds |
| `borderWidth` | `number` | `2` | Border thickness in px |
| `primaryColor` | `string` | `'var(--accent)'` | Primary gradient color |
| `accentColor` | `string` | `color-mix(...)` | Secondary gradient color |
| `mode` | `'full' \| 'stripe'` | `'full'` | Gradient style |

## Dependencies

None (React only).

## Note

`RotatingGlowCard` requires a `@keyframes glow-spin` rule (a simple `0%→360%` rotation). Ensure it's defined in your CSS or inject it.
