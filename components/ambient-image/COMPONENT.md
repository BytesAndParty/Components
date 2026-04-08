# AmbientImage

Image component that extracts edge colors from the loaded image and renders a directional ambient glow behind it.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Glow fade-in** | After the image loads, the four edge-sampled glow layers fade in with a 600ms CSS opacity transition. |
| **Dynamic color** | Glow colors are extracted from the actual image pixels — each edge (top/right/bottom/left) gets its own averaged color. |
| **Source change** | When `src` changes, the glow resets and re-extracts colors from the new image. |

## How It Works

1. **Edge color extraction**: On image load, a 64×64 downscaled canvas samples pixels along each edge (top 15%, bottom 15%, etc.). Dark and transparent pixels are excluded.
2. **Four glow layers**: Each side of the image gets its own absolutely positioned `<div>` with a blurred solid background color, offset by `spread` px beyond the image boundary.
3. **Performance**: The canvas is created at 64×64 regardless of image size, minimizing pixel processing. `willReadFrequently: true` hints the browser to optimize for `getImageData`.
4. **CORS**: `crossOrigin="anonymous"` is set on the `<img>` to enable canvas pixel reading for cross-origin images (the server must send appropriate CORS headers).

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | required | Image source URL |
| `alt` | `string` | `''` | Alt text for accessibility |
| `blur` | `number` | `40` | Blur radius for the glow in px |
| `intensity` | `number` | `0.6` | Glow opacity (0–1) |
| `spread` | `number` | `20` | How far the glow extends beyond the image in px |
| `borderRadius` | `string \| number` | `'12px'` | Border radius for image and glow |
| `animated` | `boolean` | `true` | Enable/disable glow fade-in |

## Dependencies

None (React only, uses Canvas API).

## Security Notes

- Uses `crossOrigin="anonymous"` — the image server must support CORS. If it doesn't, the canvas `getImageData` call will fail silently and fall back to neutral gray glows.
- No user input is rendered as HTML; all rendering is via React elements and Canvas API.
