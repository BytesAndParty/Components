# HeartLike

Favorite / Like heart button with a pop-in fill and a celebratory spark burst. Controlled + uncontrolled, accent-aware, disabled-aware.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Outline → fill** | Outline heart fades out while the solid heart scales in (`0 → 1.2 → 1`) with a brightness flash. ~600 ms. |
| **Celebrate burst** | Six tiny polygon "sparks" radiate outward and fade, scaling `0 → 1.4` over 500 ms. Restarts on every re-check via a remounted `key`. |
| **Repeat triggering** | If the user unchecks and checks again, the celebrate SVG re-mounts and the animation plays fresh (no CSS-iteration jank). |

## How It Works

1. **Controlled/uncontrolled**: Same pattern as `Switch` / `Checkbox`. If `checked` prop is provided, the component is controlled; otherwise it uses `useState(defaultChecked)`.
2. **Hidden checkbox**: The native `<input type="checkbox">` sits over the SVGs at `opacity: 0`, `z-index: 2`, preserving form semantics and keyboard focus.
3. **Keyframe injection**: On mount, a global `<style id="__heart-like-styles__">` is appended once — idempotent via ID dedup. Defines `heart-like-fill` and `heart-like-celebrate`.
4. **Celebrate key**: A `celebrateKey` counter remounts the burst SVG every time a check happens, which restarts its CSS animation without any `animation-play-state` tricks.
5. **CSS-var theming**: `color` defaults to `var(--accent)`, so it automatically picks up the active accent palette. Override per-instance with any CSS color.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | — | Controlled checked state |
| `defaultChecked` | `boolean` | `false` | Initial state (uncontrolled) |
| `onChange` | `(checked: boolean) => void` | — | Called on toggle |
| `size` | `number` | `50` | Size in px (square) |
| `color` | `string` | `'var(--accent)'` | Heart + sparks color |
| `disabled` | `boolean` | `false` | Disables interaction |
| `ariaLabel` | `string` | `'Like'` | Accessible label / title |
| `className` | `string` | — | Additional class on wrapper `<label>` |

## Dependencies

- None (React only)
