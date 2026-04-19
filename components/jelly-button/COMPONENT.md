# JellyButton

Rubbery CTA button with a "goo" SVG filter — three small blobs shoot out of the button on hover and merge back elastically. Pure React state + inline styles, no styled-components.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Hover squish** | On mouse-enter, the button itself scales to `1.06 × 0.94` (wider/shorter) while the text inverts to `0.94 × 1.06`, simulating a rubbery stretch. |
| **Blob escape** | Three invisible blobs (radii 1.6 / 1.2 / 0.9 em) translate outwards from the center on hover, staggered by 0 / 50 / 100 ms. The SVG `feGaussianBlur + feColorMatrix` filter fuses them with the button silhouette — goo. |
| **Active punch** | On mouse-down, the button flips to `0.94 × 1.06` (taller/narrower) with a 100ms duration, and the blobs snap back to center. |
| **Gloss fade** | The inner gloss highlight opacity goes `1 → 0.7 → 0.3` across idle / hover / active states. |
| **Shadow pulse** | Box-shadow intensity ramps up on hover and collapses on press. |

## How It Works

1. **Goo filter**: A hidden inline `<svg>` defines a filter using `feGaussianBlur` + `feColorMatrix` with the canonical goo matrix (`0 0 0 18 -7` in the alpha channel). `filter: url(#jelly-goo-xxx)` is applied to the button itself, so children — including the blobs that poke outside the button bounds — are fused into a continuous gooey shape.
2. **Per-instance filter id**: `useId()` produces a unique id so multiple `<JellyButton>` instances on the same page do not share the same filter id.
3. **State-driven styles**: `hovered` and `pressed` are React state, set via `onMouseEnter/Leave/Down/Up`. All transitions are inline styles — no `:hover` CSS.
4. **Color from CSS var**: Default `color = 'var(--accent)'`. Hover color uses `color-mix(in oklch, <color> 85%, white)`, so the hover shade auto-adjusts to the active accent palette.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Button label |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Padding + font size preset |
| `color` | `string` | `'var(--accent)'` | Base button color. Any CSS color or var. |
| `disabled` | `boolean` | `false` | Disables interaction + dims opacity |
| …props | `ButtonHTMLAttributes` | — | All standard `<button>` attrs forwarded |

## Dependencies

- None (React only)

## Notes

- The `color-mix(in oklch, …)` hover blend requires a browser with OKLCH support (all evergreen 2024+).
- The SVG goo filter uses a relatively strong blur (`stdDeviation = 6`); if you shrink the button below ~32 px, the filter may eat its edges.
