# Timeline

Vertical timeline with scroll-reveal dots and content. Aceternity-inspired but simplified — no `motion/react` dependency, pure IntersectionObserver + CSS keyframes.

## Features

- **Scroll-reveal**: Each item's dot pops in with a spring curve, content fades up, triggered when ~15 % visible.
- **One spine, many dots**: Shared vertical line with a soft fade at top/bottom.
- **Accent-aware**: Dot + glow use `var(--accent)` by default.
- **Step markers**: The dot shows the step number by default; `marker` overrides it with any node (emoji, icon).
- **Responsive year column**: `year` sits left of the dot on desktop and above the title on mobile.
- **Semantic list**: Rendered as an `<ol>` with an accessible label (`aria-label` prop or localized default).
- **Reduced motion**: The injected keyframes are disabled under `prefers-reduced-motion: reduce`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `TimelineItem[]` | — | Array of items (see below) |
| `dotColor` | `string` | `'var(--accent)'` | Dot fill + glow color |
| `lineColor` | `string` | `'var(--border)'` | Spine color |
| `aria-label` | `string` | `messages.label` | Accessible name of the list |
| `messages` | `Partial<TimelineMessages>` | — | i18n override for the list label |
| `className` | `string` | — | Classes on the `<ol>` |
| `style` | `CSSProperties` | — | Inline styles on the `<ol>` |

### `TimelineItem`

| Field | Type | Description |
|---|---|---|
| `year` | `string?` | Year or date label — left of the dot on desktop, above the title on mobile |
| `title` | `string` | Short heading |
| `content` | `ReactNode` | Body content |
| `marker` | `ReactNode?` | Overrides the automatic step number inside the dot |

## Usage

```tsx
<Timeline
  items={[
    {
      year: '2015',
      title: 'Terroir & Ernte',
      content: 'Ein außergewöhnlich heißer Sommer …',
    },
    { year: '2017', title: 'Ausbau im Barrique', content: '…' },
  ]}
/>
```

## Dependencies

- None (React + IntersectionObserver)

## Notes

- The observer uses `rootMargin: 0px 0px -10% 0px` plus `threshold: 0.15`, so an item reveals once ~15 % of it is visible above the bottom 10 % of the viewport — feels more natural than triggering at the exact edge.
- Items mount hidden (`opacity: 0`) and are revealed via the animation once intersected.
