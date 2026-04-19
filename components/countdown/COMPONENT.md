# Countdown

Rolling-digit countdown to a target date/time. Uses the daisyUI-style `transform: translateY(calc(var(--value) * -1em))` trick so digits roll smoothly between numbers without any React re-paint per digit.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Digit roll** | Each pair of digits (0–99) is a vertical strip of 100 `"00"…"99"` lines rendered via `::before { content }`, translated up/down by `--cd-value × 1em`. Transitions with a ~900 ms ease so every tick animates. |
| **Tabular nums** | `font-variant-numeric: tabular-nums` + monospace stack prevents the block from jittering as digits change widths. |
| **Auto-drop leading units** | If `hideLeadingZeros` is set, `days` and `hours` hide themselves once they reach zero, so a 3-minute countdown renders as just `MM : SS`. |
| **Completion callback** | `onComplete` fires exactly once when `Date.now() ≥ target`. The interval self-clears. |

## How It Works

1. **CSS `@property --cd-value`**: A custom property is registered as `<integer>`, so it can be animated/transitioned. The `::before` pseudo-element holds all 100 line-strings (`00`–`99`) separated by `\A` (newline in CSS) and uses `white-space: pre`. Shifting `--cd-value` translates the whole strip; the parent has `overflow-y: clip` + `height: 1em` to show only one value.
2. **Single interval**: One `setInterval(1000)` diffs `target − Date.now()` and updates `{days, hours, minutes, seconds}` state. The digits animate on their own via CSS transitions.
3. **Style injection**: Global `<style id="__countdown-styles__">` is appended once on first mount (ID-dedup), so the `::before` string + `@property` definition exist exactly once in the document.
4. **Theme integration**: Block background is `var(--card)` + `var(--border)` (or fully transparent via `transparent` prop), labels use `var(--muted-foreground)`, digits use `var(--foreground)`. No hardcoded colors.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `target` | `Date \| string \| number` | — | When to count down to. ISO string / Date / epoch ms |
| `hideLeadingZeros` | `boolean` | `false` | Drop days/hours blocks when they are zero |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Digit font + block padding |
| `labels` | `{ days?; hours?; minutes?; seconds? }` | German defaults (`Tage`/`Std`/`Min`/`Sek`) | Override per-block labels |
| `separator` | `ReactNode` | `":"` | Node between blocks |
| `transparent` | `boolean` | `false` | Strip card background + border |
| `onComplete` | `() => void` | — | Fired once when the target is reached |
| `className` / `style` | — | — | Forwarded to the wrapper |

## Dependencies

- None (React only). Requires CSS `@property` support (all evergreen browsers 2024+).
