# PasswordConfirmation

Password confirmation input with per-character dot matching, color-coded feedback, and shake/bounce animations.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Dot matching** | Each typed character is represented by a dot. If it matches the corresponding character in the original password, the dot turns green with a glow; mismatches turn red. |
| **Dot pop** | The most recently typed dot plays a brief scale animation (`pw-dot-pop`: 1→1.4→1 over 200ms). |
| **Shake on overflow** | If the user tries to type more characters than the password length, the entire container shakes side-to-side (`pw-shake`). |
| **Bounce on match** | When all characters match, the container bounces (`pw-bounce`: 1→1.06→1). |
| **Border color feedback** | Border transitions between neutral (default), accent (focused), red (mismatch), and green (full match). |
| **Focus ring** | A soft glow ring appears on focus (accent color) and on match (green). |
| **Match indicator** | A "Passwords match" message with checkmark icon appears below on full match. |

## How It Works

1. **Hidden input**: A visually hidden `<input type="password">` captures typing; the visible UI is entirely dot-based.
2. **Per-character comparison**: Each character in the typed value is compared against the same index in the target `password`. The state is stored in the single `value` string, not per-dot.
3. **Overflow prevention**: Characters beyond `password.length` trigger the shake animation and are discarded.
4. **Match detection**: Uses a `matchedRef` to fire `onMatch` only once per match (not on every keystroke).
5. **Password change reset**: When the `password` prop changes, the confirmation value and match state are reset.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `password` | `string` | required | The original password to confirm against |
| `onChange` | `(value: string) => void` | — | Called on each character typed |
| `onMatch` | `() => void` | — | Called once when passwords match |
| `placeholder` | `string` | `'Confirm password'` | Input placeholder |
| `dotSize` | `number` | `10` | Individual dot size in px |
| `matchColor` | `string` | `'#22c55e'` | Color for matching characters |
| `mismatchColor` | `string` | `'#ef4444'` | Color for mismatching characters |
| `neutralColor` | `string` | `'var(--text-muted)'` | Color for untyped dots |

## Dependencies

None (React only).

## Security Notes

- Uses `type="password"` for the hidden input and `autoComplete="off"` to prevent browser auto-fill.
- Password comparison happens character-by-character in the client for visual feedback. The match callback should trigger server-side validation for the actual password change.
