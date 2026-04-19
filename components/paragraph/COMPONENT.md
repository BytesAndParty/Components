# Paragraph

Truncating paragraph with optional "Show more" toggle. Uses [`@chenglou/pretext`](https://github.com/chenglou/pretext) for font-engine-based line measurement — **no `getBoundingClientRect` reflow**.

## Why Pretext?

Standard truncation patterns either:
- Render text → measure with `getBoundingClientRect` → re-render → **two layout passes per paragraph** (expensive at scale)
- Use CSS `-webkit-line-clamp` blindly → "Show more" button always visible, even when text fits

Pretext computes wrap layout via the browser's font engine without DOM measurement. The "Show more" button appears **only when truncation actually happens**.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Width-aware re-measure** | A `ResizeObserver` re-runs Pretext layout when the container width changes (e.g. mobile rotation, container query break). |
| **Lazy library load** | Pretext is dynamically imported the first time a clamped paragraph mounts; subsequent paragraphs reuse the loaded module. |
| **Graceful fallback** | If `@chenglou/pretext` is not installed, falls back to a character-width heuristic (less precise but functional). |
| **Smooth expand** | `max-height` transition on toggle (200ms ease). |

## How It Works

1. **Mount + measure**: A `ResizeObserver` tracks the container's width. The component reads computed font properties (`getComputedStyle`) and feeds them to Pretext alongside the text.
2. **Pretext prepare → layout**: `prepare(text, font)` is called once per text/font, `layout(prepared, width, lineHeight)` returns `{ lineCount }` without any DOM mutation or measurement.
3. **Conditional UI**: If `lineCount > clamp`, the toggle button is rendered. Otherwise the paragraph displays at full height with no button.
4. **CSS clamping**: When clamped, standard `-webkit-line-clamp` handles the visual truncation. Pretext only decides *whether* to clamp — the visual truncation is browser-native.
5. **SSR-safe**: First render shows the clamped text without measurement; measurement happens on hydration. No layout shift if the server-rendered clamp matches the measured outcome.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | `string` | required | Paragraph content |
| `clamp` | `number` | — | Max lines before truncation. Undefined = never truncate. |
| `expandable` | `boolean` | `false` | Show "More"/"Less" button when truncated |
| `expandLabel` | `string` | `'Mehr lesen'` | Expand button label |
| `collapseLabel` | `string` | `'Weniger'` | Collapse button label |
| `className` | `string` | — | Wrapper class |
| `style` | `CSSProperties` | — | Wrapper inline style |
| `onMeasure` | `(r: { lineCount, truncated }) => void` | — | Callback after each measurement |

## Dependencies

- `@chenglou/pretext` — text measurement (peer; component degrades gracefully if missing)

## Installation

```bash
bun add @chenglou/pretext
```

## Usage

```tsx
import { Paragraph } from '@/components/paragraph';

<Paragraph
  text={wine.geschmacksprofil}
  clamp={3}
  expandable
  expandLabel="Mehr lesen"
  collapseLabel="Weniger"
/>
```

### Without expand (truncate silently)

```tsx
<Paragraph text={wine.description} clamp={2} />
```

### React to truncation state (e.g. for analytics or layout)

```tsx
<Paragraph
  text={wine.speiseempfehlung}
  clamp={3}
  onMeasure={({ truncated }) => setHasMore(truncated)}
/>
```

## Notes

- **Container Queries-friendly:** Because measurement is width-driven via `ResizeObserver`, the same `<Paragraph>` adapts correctly when its container shrinks or grows.
- **Performance:** Avoids the typical "render → measure → re-render" double-pass. At 50 wine cards × 2 paragraphs, that's 100 reflows saved per route.
- **Accessibility:** The button uses `aria-expanded` to communicate state to screen readers. The collapsed text is still in the DOM — just visually clipped.
