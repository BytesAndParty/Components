# Toast

Complete toast notification system with Context + Hook API, swipe-to-dismiss, progress bar, hover-pause, and four visual variants. Also provides a global `toast()` function.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Slide in** | Toasts enter from below (or above for top placements) with `y: 40 → 0` and fade in (300ms easeOut). |
| **Layout animation** | `layout` prop on `motion.div` causes toasts to smoothly slide when siblings are added/removed. |
| **Progress bar** | A rAF-driven progress bar fills from 0% → 100% over the toast's duration. No React re-renders — direct DOM manipulation via `ref`. |
| **Hover pause** | Hovering a toast pauses its progress timer. Accumulated pause time is subtracted from elapsed time on resume, so remaining time is exact. |
| **Swipe dismiss** | Drag right (corner placement) or drag up/down (center placement) with elastic overshoot. Dismisses on drag > 100px (x) or > 20px (y). |
| **Close on hover** | The X button fades in (`opacity: 0 → 1`) only when hovering the toast. |
| **Variant dot** | A colored dot left of the title indicates variant (accent/green/yellow/red). |

## Architecture

```
ToastProvider       — Context, state management, position container
├── useToast()      — Hook returning { toasts, add, dismiss }
├── toast()         — Global function (requires mounted Provider)
└── ToastItem       — Individual toast card with progress, drag, dismiss
```

## How It Works

1. **Counter-based IDs**: `counter.current++` generates unique toast IDs (`toast-1`, `toast-2`, ...).
2. **Max visible**: Only the last `maxVisible` toasts render; older ones are silently dropped from view.
3. **Progress via rAF**: Each `ToastItem` runs its own `requestAnimationFrame` loop, writing directly to `progressRef.current.style.width` — zero state updates for smooth 60fps progress.
4. **Placement system**: Four placements (`top-right`, `top-center`, `bottom-right`, `bottom-center`) change flex direction and position styles.
5. **Global function**: The `toast()` export captures `add` from the Provider via `globalAdd` ref, enabling imperative usage outside React tree (e.g., in utility functions).

## Props

### `ToastProvider`

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | App content |
| `placement` | `Placement` | `'bottom-right'` | Where toasts appear |
| `maxVisible` | `number` | `4` | Max toasts shown at once |

### `useToast()` / `toast()`

| Method | Signature | Description |
|---|---|---|
| `add` | `(opts) => string` | Add toast, returns ID |
| `dismiss` | `(id: string) => void` | Remove by ID |
| `toast` | `(opts) => string` | Global add (requires Provider) |

### Toast options

| Field | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Required title text |
| `description` | `string` | — | Optional body |
| `variant` | `'default' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Color variant |
| `duration` | `number` | `4000` | Auto-dismiss time (ms) |

## Dependencies

- `framer-motion` — AnimatePresence, motion, drag, layout animations
- `lucide-react` — `X` icon for close button
