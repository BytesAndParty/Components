# Toast

Complete toast notification system with Context + Hook API, swipe-to-dismiss, progress bar, hover/focus pause, and four visual variants. Also provides a global `toast()` function.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Slide in** | Toasts enter from below (or above for top placements) with `y: 40 → 0` and fade in (300ms easeOut). With reduced motion they only fade. |
| **Layout animation** | `layout` prop on `motion.div` causes toasts to smoothly slide when siblings are added/removed. Off with reduced motion. |
| **Progress bar** | A rAF-driven progress bar fills from 0% → 100% over the toast's duration. No React re-renders — direct DOM manipulation via `ref`. |
| **Hover/focus pause** | Hovering a toast or focusing inside it (keyboard on the X) pauses its timer. Only unpaused frames count as elapsed time, so the remaining time continues exactly where it stopped. |
| **Swipe dismiss** | Drag right (corner placement) or drag up/down (center placement) with elastic overshoot. Dismisses on drag > 100px (x) or > 20px (y). |
| **Close button** | On fine pointers (mouse/trackpad) the X fades in when hovering the toast or when it has keyboard focus (`:focus-visible`). On touch it is always visible. Hit area 44 × 44 px, the visible square stays 24 px. |
| **Variant dot** | A colored dot left of the title indicates variant (accent/success/warning/destructive token). |

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
3. **Progress via rAF**: Each `ToastItem` runs its own `requestAnimationFrame` loop, writing directly to `progressRef.current.style.width` — zero state updates for smooth 60fps progress. Hover and focus are tracked in refs and the elapsed time in a ref, so the loop never restarts when they change. `onDismiss` is called through `useEffectEvent`, so a new toast (provider re-render) does not reset the timers of the visible ones.
4. **Placement system**: Four placements (`top-right`, `top-center`, `bottom-right`, `bottom-center`) change flex direction and position classes. The card is `min(22rem, 100vw - 2rem)` wide, so with the container's 1rem padding it fits viewports below 384 px, centered placements included.
5. **Screen readers**: The always-mounted container is an `aria-live="polite"` region, so new toasts are announced. It deliberately has no `role="status"` (implies `aria-atomic="true"`, which would re-read every visible toast).
6. **Reduced motion**: `useReducedMotion()` drops the `y` offset on enter/exit and the `layout` animation; toasts only fade.
7. **Global function**: The `toast()` export calls `toastBridge.add` (`toast-context.ts`), which the mounted Provider wires up in an effect, enabling imperative usage outside the React tree (e.g., in utility functions).

## Props

### `ToastProvider`

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | App content |
| `placement` | `Placement` | `'bottom-right'` | Where toasts appear |
| `maxVisible` | `number` | `4` | Max toasts shown at once |
| `messages` | `Partial<ToastMessages>` | — | i18n override for the dismiss button label |
| `className` | `string` | — | Classes for the fixed container (offsets, gap, z-index), merged via `cn()` |
| `toastClassName` | `string` | — | Classes for every toast card (e.g. `bg-muted`, `rounded-none`, `w-96`), merged via `cn()` |

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

## Theme tokens

Styled with Tailwind utilities on semantic tokens: `bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`, `bg-accent`, `bg-destructive`, plus two status tokens defined in `components-showcase/src/styles.css` (`:root` for dark, `[data-theme="light"]` for light, mapped in `@theme inline`):

| Token | Utility | Used by |
|---|---|---|
| `--success` | `bg-success` (`--color-success`) | `success` dot and progress bar |
| `--warning` | `bg-warning` (`--color-warning`) | `warning` dot and progress bar |

A project that copies the toast needs both tokens and their `--color-*` mappings, otherwise the `success` and `warning` dots stay transparent.

## Dependencies

- `motion` (`motion/react`) — AnimatePresence, motion, drag, layout animations, `useReducedMotion`
- `lucide-react` — `X` icon for close button
- `cn()` from `components/lib/utils` (`clsx` + `tailwind-merge`)
