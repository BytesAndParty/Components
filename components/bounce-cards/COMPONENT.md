# BounceCards

An overlapping row of image cards that elastically push apart when a card is hovered.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Hover push** | The hovered card scales to 1.05 and moves to the front; its siblings slide away from it — the closer the sibling, the stronger the push (`maxTranslation / distance`). |
| **Elastic easing** | All movement runs as a CSS `transform` transition with an overshooting `cubic-bezier(.17, .67, elasticity, 1.2)`, so cards bounce slightly past their target. |
| **Reset** | On mouse-leave of the container, every card springs back to its resting position and original stacking order. |
| **Reduced motion** | With `prefers-reduced-motion: reduce` (read at hover time) the hovered card only moves to the front — no push, no scale. |

## How It Works

1. **Overlapping row**: Cards sit in an `inline-flex` row; each card after the first gets a negative `margin-left` of `baseSize × overlap`.
2. **Imperative styling**: Hover handlers write `transform`, `transition` and `zIndex` directly to the card elements via refs (event handlers only — no render-time ref access), so no React re-render happens per hover.
3. **Spacing**: The container reserves `maxTranslation` px of horizontal padding and extra height so pushed cards never clip.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `images` | `string[]` | required | Image URLs, one card each |
| `alts` | `string[]` | — | Alt texts per image (empty alt when omitted) |
| `baseSize` | `number` | `200` | Card width and height in px |
| `maxTranslation` | `number` | `40` | Maximum sideways push in px |
| `overlap` | `number` | `0.5` | Overlap factor between neighbouring cards (0–1) |
| `duration` | `number` | `500` | Transition duration in ms |
| `elasticity` | `number` | `0.6` | Third control point of the easing curve — higher = bouncier |
| `className` | `string` | — | Additional classes on the container |
| `style` | `CSSProperties` | — | Inline styles on the container |

## Usage

```tsx
import { BounceCards } from '@components/bounce-cards/bounce-cards'

<BounceCards
  images={['/wine-1.jpg', '/wine-2.jpg', '/wine-3.jpg']}
  alts={['Grüner Veltliner', 'Zweigelt', 'Merlot']}
  baseSize={180}
/>
```

## Theming

Cards use `var(--card)` as background and `var(--border)` for the 1 px border, so they follow dark/light mode.

## Known Gaps

- Hover-only: the cards are decorative images without a keyboard or touch equivalent.

## Dependencies

None (React only).
