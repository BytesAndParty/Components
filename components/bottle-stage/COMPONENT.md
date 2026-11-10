# BottleStage

A wine bottle rendered in real time: dark glass with studio reflections, a screw cap and an optional label wrapped around the body. Its proportions are measured from a real 0.75 l bottle of the Buchart 58 shop. It sways gently, leans toward the mouse and can be turned by scroll progress. The canvas is transparent, so any background works behind it.

This is the first component on three.js. three is large (246 KB gzip, measured in the section showcase build), so **always load it lazily** (see Usage).

## Features

- **No 3D model file:** the bottle is generated from a profile curve. Nothing to download or license.
- **Label from any image:** `labelSrc` takes a URL or data URL, for example an inline SVG or a canvas export.
- **Scroll choreography:** pass a motion value as `progress`; the bottle turns on the way and shows its label at 1.
- **Theme-aware colors:** `glassColor` and `capsuleColor` are CSS colors, `var(--accent)` included, and follow theme and accent changes.
- **Reduced motion:** the bottle rests upright with the label in front; frames are only rendered when something changes.
- **Off-screen pause:** the render loop stops while the stage is outside the viewport.
- **Decorative:** `aria-hidden` and `pointer-events: none`. Describe the product in the surrounding text.

## How It Works

1. **Geometry:** a bottle is a solid of revolution. `bottleProfile()` draws the outline of a slim Bordeaux bottle as a 2D path (base, body, shoulder, neck) and `<latheGeometry>` turns it around the Y axis. The screw cap is a second profile; the label is an open cylinder segment a hair outside the glass.
   The numbers come from a product photo of the Buchart 58 shop (Merlot 0.75 l), read row by row and scaled to a height of 3: diameter to height 0.24, body straight up to 62 % of the height, neck reached at 76 %, cap over the top 20 %, label from 12 % to 52 % of the height and about 135° around. Absolute millimetres are not known, only proportions.
2. **Lighting:** dark glass shows almost only reflections. `createStudioEnvironment` builds a small studio of glowing panels (softboxes) and bakes it into an environment map with `PMREMGenerator`. The panels are far brighter than white, because glass reflects only about 4 % head-on.
3. **Environment per material:** the map is assigned to glass and cap only, not to `scene.environment`. Scene-wide it washed out the paper label, and `material.envMapIntensity` does not dim a scene-wide environment (checked with three 0.187). The label is lit by an ambient and a directional light instead.
4. **Motion:** `useFrame` mutates the groups through refs, never React state. An inner group spins (sway plus scroll turn), an outer group floats and leans toward the pointer with frame-rate independent damping. `progress` is read with `.get()` each frame, so scrolling causes no re-render.
5. **Pointer:** a `pointermove` listener on `window`, mouse only. The canvas itself takes no pointer events, so content below stays clickable.
6. **Colors:** same probe mechanism as `ShaderBackdrop`: hidden `<span>`s resolve the CSS colors, `cssColorToRgb` converts them, a `MutationObserver` on `<html>` and `<head>` re-reads them on theme or accent change, also while the `AccentSwitcher` interpolates.
7. **Frame loop:** `always` while visible, `never` off screen, `demand` under reduced motion.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `labelSrc` | `string` | — | Label image (URL or data URL), about 5:7 portrait. Omit for a bare bottle |
| `glassColor` | `string` | near-black green | Glass color as CSS color |
| `capsuleColor` | `string` | `var(--accent)` | Screw cap color as CSS color |
| `progress` | `MotionValue<number>` | — | Progress 0..1; label faces the viewer at 1 |
| `turns` | `number` | `0.75` | Full turns over `progress` 0 → 1 |
| `followPointer` | `boolean` | `true` | Lean toward the mouse pointer |
| `className` | `string` | — | Classes on the wrapper; it needs a height |
| `style` | `CSSProperties` | — | Inline styles on the wrapper |

## Usage

Lazy-load, so three.js stays out of the initial bundle:

```tsx
import { lazy, Suspense } from 'react'

const BottleStage = lazy(() =>
  import('@components/bottle-stage/bottle-stage').then(module => ({ default: module.BottleStage })),
)

<div className="h-96">
  <Suspense fallback={null}>
    <BottleStage labelSrc="/labels/cuvee.png" className="h-full w-full" />
  </Suspense>
</div>
```

Turned by scroll, as in `section-showcase/src/sections/hero/HeroBottle3D.tsx`:

```tsx
const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })

<BottleStage labelSrc={labelSrc} progress={scrollYProgress} className="h-full w-full" />
```

Notes:

- **Label as SVG:** an SVG loaded as an image cannot fetch web fonts. Use system fonts in it, or render the label to a canvas and pass `canvas.toDataURL()`.
- **Astro:** render it in a client island (`client:visible`); WebGL does not render on the server.
- **Without WebGL, or when the label image fails to load,** an internal error boundary renders nothing instead of letting the error reach the page. Keep the layout meaningful without the bottle. A cross-origin `labelSrc` needs CORS headers. A failed load of the lazy chunk itself is the consumer's to catch.

## Dependencies

- `three`
- `@react-three/fiber`
- `motion` (type only, for the `progress` motion value)
