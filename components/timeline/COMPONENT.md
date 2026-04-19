# Timeline

Vertical timeline with scroll-reveal dots and content. Aceternity-inspired but simplified — no framer-motion dependency, pure IntersectionObserver + CSS keyframes.

## Features

- **Scroll-reveal**: Each item's dot pops in with a spring curve, content fades up, triggered when ~15 % visible.
- **One spine, many dots**: Shared vertical line with a soft fade at top/bottom.
- **Accent-aware**: Dot + glow use `var(--accent)` by default.
- **Optional marker**: Number, emoji, or icon rendered inside the dot.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `TimelineItem[]` | — | Array of items (see below) |
| `dotColor` | `string` | `'var(--accent)'` | Dot fill + glow color |
| `lineColor` | `string` | `'var(--border)'` | Spine color |
| `spineOffset` | `number` | `22` | Horizontal offset of spine (px) |

### `TimelineItem`

| Field | Type | Description |
|---|---|---|
| `title` | `string` | Short heading |
| `subtitle` | `string?` | Optional uppercase eyebrow above title |
| `content` | `ReactNode` | Body content |
| `marker` | `ReactNode?` | Optional content inside the dot (number, emoji) |

## Usage

```tsx
<Timeline
  items={[
    {
      subtitle: '2015',
      title: 'Terroir & Ernte',
      content: 'Ein außergewöhnlich heißer Sommer …',
      marker: '1',
    },
    { subtitle: '2017', title: 'Ausbau im Barrique', content: '…', marker: '2' },
  ]}
/>
```

## Dependencies

- None (React + IntersectionObserver)

## Notes

- The observer uses `rootMargin: 0px 0px -10% 0px` so items trigger ~10 % before fully entering the viewport — feels more natural than triggering at the exact edge.
- Items mount hidden (`opacity: 0`) and are revealed via the animation once intersected.
