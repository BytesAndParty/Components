# RevealImage

Editorial curtain reveal for images — a clip-path wipe paired with a counter-zoom (image scales from ~1.12 down to 1) when the element scrolls into view. The classic "high-end magazine" image entrance.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Curtain Wipe** | `clip-path: inset(…)` animates from one fully-clipped edge to `inset(0)`, revealing the image in the chosen direction. |
| **Counter-Zoom** | The inner `<img>` starts at `scale(zoom)` and settles to `scale(1)` during the wipe — image content appears to stand still while the frame opens. |
| **Scroll Trigger** | `IntersectionObserver` (threshold 0.15) fires the reveal; `once=false` replays on every re-entry. |

## How It Works

1. **Two-layer animation**: the wrapper animates `clip-path`, the image animates `transform` — both GPU-friendly, no layout thrash.
2. **Expo-out easing** (`cubic-bezier(0.16, 1, 0.3, 1)`): fast opening, very soft settle — the signature editorial feel.
3. **Sizing is consumer-driven**: put aspect/size classes on the wrapper (`className`, e.g. `aspect-3/4`); the image fills via `object-cover`.
4. **Accessibility**: respects `prefers-reduced-motion` (image shows immediately, no transition). `alt` is a required prop — pass `''` only for decorative images.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | — | Image source URL |
| `alt` | `string` | — | Alt text (required; `''` for decorative) |
| `direction` | `'up'\|'down'\|'left'\|'right'` | `'up'` | Wipe direction of the reveal |
| `duration` | `number` | `1200` | Animation duration in ms |
| `delay` | `number` | `0` | Delay in ms before the reveal starts |
| `zoom` | `number` | `1.12` | Initial image scale for the counter-zoom |
| `once` | `boolean` | `true` | Play once vs. replay on every viewport entry |
| `className` | `string` | — | Wrapper classes — set size/aspect here |
| `imgClassName` | `string` | — | Classes for the inner `<img>` |

## Usage

```tsx
import { RevealImage } from '@components/reveal-image/reveal-image'

// Editorial portrait, wipes upward
<RevealImage
  src="/vineyard.jpg"
  alt="Morgennebel über der Riede"
  className="aspect-3/4 w-full"
/>

// Slower, wipes from the left, replays on scroll
<RevealImage
  src="/cellar.jpg"
  alt=""
  direction="right"
  duration={1600}
  once={false}
  className="aspect-video"
/>
```

## Dependencies

None (standard React).
