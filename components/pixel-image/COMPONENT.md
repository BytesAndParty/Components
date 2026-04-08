# PixelImage

Image reveal effect where the image is split into a grid of cells that fade in with a randomized stagger order.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Staggered reveal** | Each grid cell fades from `opacity: 0` to `opacity: 1` with a unique delay based on a Fisher-Yates shuffled reveal order, creating a random pixel-by-pixel appearance. |
| **Scroll trigger** | Animation starts when the element becomes 30% visible in the viewport (configurable). |
| **Grayscale option** | Can animate from grayscale to full color simultaneously with the reveal. |

## How It Works

1. **Grid division**: The image is divided into `rows × cols` cells, each showing a fragment of the full image via `background-size` and `background-position` math.
2. **Fisher-Yates shuffle**: A shuffled index array determines the reveal order. Each cell's `transition-delay` is its position in the shuffle × `stagger` ms.
3. **Intersection observer**: When `triggerOnView` is enabled, the component waits until it's visible before setting `revealed = true`, which triggers all cell transitions.
4. **Image preloading**: A `new Image()` preloads the source to ensure cells don't show a broken state before the image is ready.
5. **Accessibility**: The container has `role="img"` and `aria-label` with the alt text. A hidden `<img>` element is included for assistive technology.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | required | Image source URL |
| `alt` | `string` | `''` | Alt text |
| `grid` | `{ rows, cols }` | `{ rows: 4, cols: 6 }` | Grid configuration |
| `grayscale` | `boolean` | `false` | Animate from grayscale to color |
| `duration` | `number` | `800` | Per-cell animation duration in ms |
| `stagger` | `number` | `40` | Delay between cells in ms |
| `triggerOnView` | `boolean` | `true` | Trigger on scroll into view |
| `threshold` | `number` | `0.3` | Intersection observer threshold |

## Dependencies

None (React only, uses IntersectionObserver API).
