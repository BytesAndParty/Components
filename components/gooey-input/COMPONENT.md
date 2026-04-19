# GooeyInput

Search/input that starts as an icon-only circle and morphs into a full input via an SVG goo filter — the circle visually stretches into a pill as it grows. Slower than a typical morph (~1.2 s) to emphasize the liquid feel.

## How It Works

1. **SVG goo filter**: A `feGaussianBlur` + `feColorMatrix` pair is applied to a wrapper. Any two shapes inside it fuse when close enough — giving the trigger button and the growing pill their liquid bond.
2. **Width morph**: The pill's `width` animates from `height` (circle) to the full expanded width over `duration` ms. The filter masks the transition seam.
3. **Input crisp**: The `<input>` sits **outside** the filtered layer so its text isn't blurred. Its width + opacity animate in synced with the pill.
4. **Icon rotate**: The trigger icon rotates 90° on open (subtle) to indicate state.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `placeholder` | `string` | `'Search…'` | Input placeholder |
| `value` | `string?` | — | Controlled value |
| `defaultValue` | `string` | `''` | Uncontrolled initial value |
| `onChange` | `(v: string) => void` | — | Value change callback |
| `onSubmit` | `(v: string) => void` | — | Fired on Enter |
| `width` | `number` | `320` | Expanded width in px |
| `height` | `number` | `48` | Collapsed circle diameter + open pill height |
| `duration` | `number` | `1200` | Morph duration (ms). Default is intentionally slow for liquid feel. |
| `icon` | `ReactNode?` | search SVG | Custom icon |
| `color` | `string` | `'var(--accent)'` | Pill + circle fill |
| `iconColor` | `string` | `'#fff'` | Icon stroke color |

## Usage

```tsx
<GooeyInput placeholder="Weine suchen…" onSubmit={(v) => navigate(`/search?q=${v}`)} />

<GooeyInput
  color="#10b981"
  width={420}
  height={56}
  duration={900}
  icon={<MyIcon />}
/>
```

## Dependencies

- None (React + inline SVG filter)

## Notes

- The filter uses a relatively strong blur (`stdDeviation = 8`). At `height < 32`, edges may erode — bump `height` or reduce the blur/matrix alpha for smaller sizes.
- Escape closes the input; Enter fires `onSubmit`.
