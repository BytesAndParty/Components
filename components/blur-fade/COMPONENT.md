# BlurFade

A viewport-controlled reveal wrapper that fades in and blurs from a specified direction when scrolled into view.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Scroll Reveal** | Uses `IntersectionObserver` to trigger the reveal animation once the component enters the viewport. |
| **Directional Slide** | Smoothly translates from a given direction (up, down, left, right) into its final position. |
| **Blur Transition** | Animates from a blurred state to crystal clear focus alongside the opacity fade. |

## How It Works

1. **Native CSS Transitions**: High performance reveal using standard CSS `opacity`, `filter: blur()`, and `transform`.
2. **IntersectionObserver**: Only animates when visible. Supports `once` (one-time reveal) or repeating on scroll.
3. **Accessibility**: Respects `prefers-reduced-motion` by skipping animations and showing content immediately.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `delay` | `number` | `0` | Delay in ms before animation starts |
| `duration` | `number` | `600` | Animation duration in ms |
| `direction` | `'up'\|'down'\|'left'\|'right'` | `'up'` | Direction to slide in from |
| `blur` | `string` | `'8px'` | Initial blur amount (e.g., '12px') |
| `once` | `boolean` | `true` | If true, only animates once per mount |

## Dependencies

None (standard React).
