# TextScramble

Text reveal effect that shows random scrambled characters before progressively resolving to the final text — triggered when the element scrolls into view.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Scroll-to-reveal** | Uses `useInView` (framer-motion) with `once: true` — animation triggers when the element enters the viewport for the first time. |
| **Progressive resolve** | Characters resolve left-to-right: positions before the current iteration show the real character, positions after show random characters from the `chars` pool. |
| **Scramble speed** | The iteration advances by `1/3` per interval tick, meaning each character position goes through ~3 random characters before settling. |
| **Placeholder state** | Before the animation starts, all non-space characters display as the `placeholder` character (`'0'` by default), creating a uniform "encrypted" look. |
| **Completion signal** | Sets `data-complete="true"` on the `<span>` and calls `onComplete` when finished, enabling follow-up animations or state changes. |

## How It Works

1. **Initial state**: `generatePlaceholder()` replaces every non-space character with the placeholder, preserving word spacing.
2. **IntersectionObserver via framer-motion**: `useInView(ref, { once: true })` returns `true` the first time the element is visible.
3. **Delayed start**: An optional `delay` (ms) before the interval begins, useful for staggering multiple instances.
4. **Interval loop**: Every `speed` ms (default 30), the display text is recalculated. Characters at index < `iteration` show the real letter; others show a random char from `chars`.
5. **Self-cleanup**: Clears both the timeout and interval on unmount or when `text` changes.
6. **Text reset**: When `text` or `placeholder` props change, the animation resets and replays on next view.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | `string` | — | Target text to reveal |
| `className` | `string` | `''` | CSS class for the `<span>` |
| `delay` | `number` | `0` | Delay before animation starts (ms) |
| `speed` | `number` | `30` | Interval between scramble ticks (ms) |
| `onComplete` | `() => void` | — | Called when scramble finishes |
| `placeholder` | `string` | `'0'` | Character shown before animation |
| `chars` | `string` | A-Za-z0-9@#$%&* | Character pool for scramble |

## Dependencies

- `framer-motion` — `useInView` hook for scroll-trigger detection
