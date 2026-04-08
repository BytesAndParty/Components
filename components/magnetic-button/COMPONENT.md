# MagneticButton

Button that magnetically follows the cursor on hover with configurable pull strength and 7 visual variants.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Magnetic pull** | The button translates toward the cursor proportionally to the distance from its center, scaled by `strength`. |
| **Snap back** | On mouse leave, the button snaps back to position with a CSS transition (200ms ease-out). |
| **Reduced motion** | Uses `motion-safe:` and `motion-reduce:` Tailwind variants — transitions are disabled for users who prefer reduced motion. |
| **Extended hit area** | A `before:` pseudo-element extends the trigger area by 12px (via `before:-inset-3`) so the magnetic effect activates before the actual button edge. |
| **CTA glow** | The `cta` variant includes an accent-colored box-shadow glow via `color-mix`. |

## How It Works

1. **Position tracking**: `onMouseMove` calculates the cursor's distance from the button center and multiplies by `strength` (0–1).
2. **Inline transform**: The computed `x/y` offsets are applied as `translate(x, y)` via inline style.
3. **Reset on leave**: Position state resets to `{ x: 0, y: 0 }` on mouse leave.
4. **Variant system**: 7 variants (`default`, `primary`, `secondary`, `outline`, `ghost`, `destructive`, `cta`) use Tailwind classes for layout and inline styles for theme-aware colors via CSS custom properties.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `strength` | `number` | `0.3` | Magnetic pull strength (0 = none, 1 = full follow) |
| `variant` | `Variant` | `'default'` | Visual style variant |
| `children` | `ReactNode` | required | Button content |
| ...rest | `ButtonHTMLAttributes` | — | Spread to the `<button>` |

## Dependencies

None (React only).

## Note

This component uses Tailwind CSS utility classes for base layout and transition behavior. Ensure Tailwind is configured when using outside the showcase.
