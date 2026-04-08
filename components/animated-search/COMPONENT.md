# AnimatedSearch

Expandable search field that morphs from a compact icon button into a full input with spring animations.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Expand animation** | The container and background pill spring-animate from icon width to `expandedWidth` using framer-motion's spring physics (`damping: 22, stiffness: 170`). |
| **Border color shift** | The pill border transitions from `--border` to `--accent` when expanded. |
| **Input fade-in** | The text input fades in and grows from 0 width simultaneously with the container expansion. |
| **Close button entrance** | The X button springs in with a combined `opacity + scale + rotate` animation; exits with the reverse. |
| **Icon hover/tap** | The search and close buttons scale on hover (1.1×) and squish on tap (0.95×). |
| **Auto-focus** | The input auto-focuses 150ms after opening (delayed to let the animation start first). |
| **Keyboard shortcuts** | `Enter` submits the search; `Escape` closes and resets the field. |

## How It Works

1. **State machine**: `isOpen` toggles between icon mode and expanded mode. `value` holds the search text and resets on close.
2. **Spring physics**: All layout animations use framer-motion springs for natural, non-artificial motion.
3. **AnimatePresence**: The input and close button are conditionally rendered with mount/unmount animations.
4. **Dual-purpose search button**: When collapsed, it opens the search. When expanded, it submits (if value exists) or closes (if empty).

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `placeholder` | `string` | `'Search...'` | Input placeholder |
| `onSearch` | `(value: string) => void` | — | Called on Enter with trimmed value |
| `onChange` | `(value: string) => void` | — | Called on every input change |
| `expandedWidth` | `number` | `280` | Width when expanded in px |

## Dependencies

- `framer-motion` — Spring animations and AnimatePresence
