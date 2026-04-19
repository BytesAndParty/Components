# ImagesSlider

Fullscreen-capable hero image slider with Ken-Burns zoom, directional slide transitions, keyboard arrows, and overlay tint. Aceternity-inspired, no framer-motion.

## Features

- **Preload**: All images are loaded before the first transition; shows a subtle "Loading…" state until at least two frames are cached.
- **Ken-Burns zoom**: Each active image runs a slow 6 s scale-from-1.08 animation so even a static image feels alive.
- **Directional slide**: `up | down | left | right` — the outgoing slide translates off in that direction while the incoming one flies in from the opposite side.
- **Autoplay**: `interval` prop controls cadence. Keyboard arrows (←/→) always work.
- **Overlay**: Optional dark tint sits above the image for contrast behind slot content.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `images` | `string[]` | — | URLs to slide through |
| `children` | `ReactNode?` | — | Slot rendered above the image (typically a headline / CTA) |
| `autoplay` | `boolean` | `true` | Auto-advance slides |
| `interval` | `number` | `5000` | Autoplay interval in ms |
| `direction` | `'up' \| 'down' \| 'left' \| 'right'` | `'up'` | Exit direction for the outgoing slide |
| `overlay` | `boolean` | `true` | Render tint overlay |
| `overlayColor` | `string` | `'rgba(0,0,0,0.55)'` | Tint color |
| `height` | `string \| number` | `560` | Wrapper height |

## Usage

```tsx
<ImagesSlider
  images={['/hero1.jpg', '/hero2.jpg', '/hero3.jpg']}
  height="100vh"
  direction="up"
>
  <div>
    <h1 className="text-4xl font-bold">Weinhaus</h1>
    <p>Rotwein aus dem Piemonte</p>
  </div>
</ImagesSlider>
```

## Dependencies

- None (React only)

## Notes

- `background-size: cover` is used so the component works at any aspect ratio. For art-directed framing, crop source images in advance.
- `willChange: transform, opacity` is set on each slide — not free, but necessary to keep the transition buttery at 4K.
