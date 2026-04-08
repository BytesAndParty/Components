# PricingInteraction

Interactive pricing selector with plan selection, monthly/yearly period toggle, and animated number transitions.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Number roll** | Price values animate between old and new numbers using `@number-flow/react`, creating a smooth digit-by-digit rolling effect on period toggle. |
| **Period toggle slide** | The active period indicator slides between "Monthly" and "Yearly" via `translateX` transition (300ms). |
| **Selection highlight** | A 3px accent-colored border highlight slides vertically to the active plan via `translateY` transition (300ms). |
| **Radio dot** | The radio indicator's inner circle fades in/out with opacity transition on selection change. |
| **CTA press** | The "Get Started" button scales down to 0.97× on mouse down and returns on mouse up. |
| **Badge pulse** | Plan badges use accent-tinted backgrounds via `color-mix`. |

## How It Works

1. **Period pricing**: When the second period is selected, prices are multiplied by `periodMultiplier` (default 0.8 = 20% discount) and rounded to 2 decimal places.
2. **NumberFlow**: The `<NumberFlow>` component from `@number-flow/react` handles the animated digit transition when prices change.
3. **Absolute highlight**: The selection border is an absolutely positioned `<div>` that uses `translateY(index * height + index * gap)` to track the active option. This avoids re-rendering option elements.
4. **Single callback**: `onSelect(index, period)` fires on both plan change and period change, providing both values simultaneously.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `options` | `PricingOption[]` | required | Array of `{ label, description?, price, badge? }` |
| `periodLabels` | `[string, string]` | `['Monthly', 'Yearly']` | Toggle labels |
| `periodMultiplier` | `number` | `0.8` | Price multiplier for second period |
| `currency` | `string` | `'$'` | Currency symbol |
| `priceSuffix` | `string` | `'/month'` | Text after price |
| `ctaLabel` | `string` | `'Get Started'` | CTA button text |
| `defaultIndex` | `number` | `0` | Initially selected plan |
| `onSelect` | `(index, period) => void` | — | Selection callback |

## Dependencies

- `@number-flow/react` — Animated number transitions
