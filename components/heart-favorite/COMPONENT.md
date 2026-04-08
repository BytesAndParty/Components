# HeartFavorite

Animated favorite/like toggle button with a heart bounce and fill transition.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Heart bounce** | On like, the heart scales up to 1.3× and bounces back to 1× with easeInOut (300ms). |
| **Fill transition** | The heart fills with red (`#ef4444`) on like and returns to outlined on unlike, with a CSS transition on both `fill` and `color`. |
| **Tap squish** | Using framer-motion `whileTap`, the button scales to 0.9× on press. |
| **Hover background** | A subtle `rgba(255,255,255,0.06)` background appears on hover via inline style manipulation. |

## How It Works

1. **State toggle**: `isLiked` boolean state toggles on click. The `onToggle` callback fires with the new value.
2. **Framer Motion animate**: The `scale` property is animated as a keyframe array `[1, 1.3, 1]` only when `isLiked` is true.
3. **Lucide Heart**: The `Heart` icon from lucide-react is used with conditional `fill` and `color` props.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `number` | `32` | Heart icon size in px |
| `defaultLiked` | `boolean` | `false` | Initial liked state |
| `onToggle` | `(liked: boolean) => void` | — | Callback on toggle |

## Dependencies

- `framer-motion` — Bounce animation and whileTap
- `lucide-react` — Heart icon
