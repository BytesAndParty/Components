# BounceLoader

Three bouncing dots with squish-on-impact and soft shadows — classic "dots bouncing" loader, fully themeable via accent color.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Bounce** | Each dot follows a 2-keyframe alternating animation: at the bottom it squishes to 25% height and stretches `scaleX(2.7)` with a pill border-radius; at the top it's a perfect circle. Creates the elastic "splat → ball" feel. |
| **Color morph** | On impact, the dot fades to `squishColor` (default `var(--muted-foreground)`), then returns to `color` (`var(--accent)`) mid-air. |
| **Stagger** | Middle and right dots are delayed by `0.2 × speed` and `0.4 × speed`, so the three dots form a rolling wave rather than hitting in sync. |
| **Shadow follow** | A blurred shadow below each dot scales `1.5 → 1 → 0.2` in opposite phase, implying perspective. |

## How It Works

1. **Keyframe injection**: A single `<style id="__bounce-loader-styles__">` is injected once on first mount. Uses CSS custom properties (`--bl-size`, `--bl-bottom`, `--bl-color`, `--bl-squish`) so a single keyframe block can serve any size/color combo.
2. **Size-driven layout**: `wrapperWidth = size × 10`, `wrapperHeight = size × 4`, so doubling `size` doubles the physical footprint without needing media queries.
3. **Shadow via `color-mix`**: `color-mix(in oklch, var(--foreground) 35%, transparent)` means the shadow is visible in both light and dark mode — a plain black rgba shadow disappears on dark backgrounds.
4. **Accessibility**: `role="status"` + `aria-live="polite"` + a visually-hidden `<span>` with the label announce the loading state to screen readers without duplicating the visual.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `number` | `20` | Dot diameter in px |
| `color` | `string` | `'var(--accent)'` | Dot color at apex |
| `squishColor` | `string` | `'var(--muted-foreground)'` | Dot color on impact |
| `speed` | `number` | `0.5` | Full cycle duration in seconds (lower = faster) |
| `label` | `string` | `'Loading'` | SR-only + `aria-label` text |
| `className` | `string` | — | Additional class on wrapper |
| `style` | `CSSProperties` | — | Inline style overrides on wrapper |

## Dependencies

- None (React only)
