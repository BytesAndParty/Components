# FloatingCart

Fixed-position floating action button (FAB) with stacked product thumbnails, inspired by Quickbeam.js.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **FAB swing-in** | The cart button enters from the right with a rotation arc (`rotate(70deg) → -20deg → 0deg`) using the `fc-show` keyframe. |
| **FAB slide-out** | When emptied, the button slides out to the right (`fc-hide`). |
| **Item entrance** | New product bubbles spring in with a scale + translateY overshoot (`fc-item-in`). |
| **Item removal** | Removed items slide out to the right and fade (`fc-remove-product`). |
| **Count change animation** | When an item's count changes, the count badge plays a fadeDown→fadeUp sequence (old number falls, new number rises). |
| **Badge bump** | The total count badge at the bottom bounces on every count change (`fc-badge-bump`). |
| **Hover overlay** | Product circles show different overlay info on hover (count multiplier or label). |
| **Remove button reveal** | The × button appears on hover over a product circle. |
| **FAB hover** | Border and inner circle transition to `--text` color on hover. |

## How It Works

1. **Visibility lifecycle**: The FAB appears when `items.length > 0` and hides (with animation delay) when items are emptied.
2. **Per-item animations**: Each item tracks its previous count via `useRef`. On count change, a state machine drives the fadeDown/fadeUp CSS animations.
3. **Stacked layout**: Items are displayed as 60×60 circles in a vertical column above the FAB, capped at `maxVisible`. Newest items appear at the bottom (closest to the FAB).
4. **Removal flow**: Setting a `removingId` triggers the exit animation; after 200ms, the actual `onItemRemove` callback fires.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `FloatingCartItem[]` | required | Items in cart (`{ id, image?, label?, count? }`) |
| `totalPrice` | `string` | — | Price string for the badge (falls back to count) |
| `onClick` | `() => void` | — | FAB click (e.g., go to checkout) |
| `onItemClick` | `(id: string) => void` | — | Click on a product circle |
| `onItemRemove` | `(id: string) => void` | — | Remove button handler |
| `fabColor` | `string` | `'var(--accent)'` | FAB accent color |
| `maxVisible` | `number` | `4` | Max visible product thumbnails |
| `icon` | `ReactNode` | — | Custom cart icon |

## Dependencies

None (React only).
