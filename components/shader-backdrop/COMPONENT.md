# ShaderBackdrop

Flowing WebGL backdrop that reads like silk or liquid. Three CSS colors go in, the shader folds them into a slowly moving surface. Meant to sit behind typography or product imagery: heroes, CTA bands, footers, section transitions.

## Features

- **Theme-aware colors:** `colors` takes CSS colors, including `var(--accent)` and `color-mix(…)`. The backdrop follows theme and accent changes, also while the `AccentSwitcher` interpolates.
- **No dependency:** plain WebGL 1, one fullscreen triangle, one fragment shader.
- **Reduced motion:** shows one still frame instead of the flow. Color changes still repaint it.
- **Off-screen pause:** the render loop only runs while the backdrop is in the viewport.
- **Film grain:** hides the banding that dark gradients otherwise show on 8-bit displays.

## How It Works

1. **Domain-warped fbm:** the fragment shader evaluates fractal noise, feeds the result back into the noise lookup twice (`q`, then `r`) and only then reads the final value. The warping stretches noise blobs into long folds; time is added to the offsets, so the folds drift instead of sliding as a whole.
2. **Three colors:** `colors[0]` is the base, `colors[1]` fills the folds, `colors[2]` is a sheen that only appears on the strongest folds.
3. **Color resolution:** WebGL cannot parse CSS colors. Each color is set as `color` on a hidden probe `<span>`; the computed value goes through `cssColorToRgb` (`components/lib/css-color.ts`), which lets a 1×1 canvas convert `oklch(…)` to sRGB. Because the probes sit inside the wrapper, a token overridden on an ancestor is respected.
4. **Theme changes:** a `MutationObserver` re-reads the probes and repaints. It watches the attributes of `<html>` (theme, accent) and the contents of `<head>` (the `AccentSwitcher` rewrites a `<style>` there while it interpolates). A token that changes anywhere else at runtime, or through `@media (prefers-color-scheme)`, is not noticed until a prop changes.
5. **Resolution:** the canvas is capped at a device pixel ratio of 1.5. The field is smooth and gains nothing from more pixels; 1.5 keeps the grain fine.
6. **Sizing:** the wrapper sets no `position`. Place it with `className` (typically `absolute inset-0`); the canvas fills it.
7. **Without WebGL:** nothing is drawn and a console warning is logged. Give the parent a CSS background as fallback. A shader that fails to compile throws, and a lost WebGL context is not restored (open, see `KNOWN-ISSUES.md` #13).

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `colors` | `[string, string, string]` | background → accent mix → accent | Base, fold and sheen color as CSS colors |
| `speed` | `number` | `1` | Flow speed multiplier |
| `scale` | `number` | `1` | Fold size; higher = more, smaller folds |
| `grain` | `number` | `0.05` | Film grain amount, 0..1 |
| `className` | `string` | — | Classes on the wrapper, used for placement |
| `style` | `CSSProperties` | — | Inline styles on the wrapper |

## Usage

```tsx
import { ShaderBackdrop } from '@components/shader-backdrop/shader-backdrop'

<section className="relative overflow-hidden bg-background">
  <ShaderBackdrop className="absolute inset-0" />
  <div className="relative">…</div>
</section>
```

Fixed palette, independent of the theme:

```tsx
<ShaderBackdrop
  colors={['oklch(0.16 0.03 60)', 'oklch(0.42 0.11 55)', 'oklch(0.86 0.12 85)']}
  speed={0.6}
  className="absolute inset-0"
/>
```

Text on top needs its own contrast: the sheen can get bright. Put a scrim (a gradient overlay) between backdrop and text, as `HeroBottle3D` in the section showcase does.

## Dependencies

None (React only, uses the WebGL API).
