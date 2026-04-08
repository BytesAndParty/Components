# PasswordSetup

Complete password creation flow with strength meter, checklist validation, generator, copy, visibility toggle, and dot-based confirmation.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Strength meter** | An animated progress bar that grows/shrinks as password strength changes (width transition + grow animation). Color shifts from red → orange → yellow → blue → green. |
| **Checklist items** | Real-time validation rules with animated icon swap (circle-X → circle-check) and color transition per rule. |
| **Confirmation dots** | Same per-character dot matching as PasswordConfirmation (green/red + glow + pop animation). |
| **Shake on overflow** | Confirmation field shakes when typing past the password length. |
| **Bounce on match** | Confirmation container bounces when all characters match. |
| **Fade-in sections** | Strength meter, checklist, and confirmation field fade in when they become relevant (`pws-fade-in`). |
| **Copy feedback** | Copy button shows a brief "Copied!" state with checkmark icon for 1.5s. |
| **Generate auto-reveal** | Generating a password automatically reveals it (sets visibility to true). |
| **Focus ring** | Both fields show accent-colored focus ring on focus. |
| **Visibility toggle** | Eye/EyeOff icon toggles password visibility per field, with hover color transition. |

## How It Works

1. **Two-phase flow**: Phase 1 is password creation (with strength and checklist). Phase 2 (confirmation) appears only when a password is entered, sliding in with a fade animation.
2. **Secure generation**: `generatePassword()` uses `crypto.getRandomValues()` for cryptographically secure random password generation (16 chars from alphanumeric + special charset).
3. **Clipboard API**: `navigator.clipboard.writeText()` for the copy feature, with async error handling.
4. **Strength calculation**: 4 default checks (length ≥ 8, uppercase, digit, special char). Results map to 5 levels (Sehr schwach → Sehr stark).
5. **Dot comparison**: Identical to PasswordConfirmation — per-character visual comparison with animated dots.
6. **Match deduplication**: A `matchedRef` ensures `onMatch` fires only once per successful match.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `onMatch` | `(password: string) => void` | — | Called once when confirmation matches |
| `onPasswordChange` | `(password: string) => void` | — | Called on every password input change |
| `passwordLabel` | `string` | `'Password'` | Label for password field |
| `confirmLabel` | `string` | `'Confirm password'` | Label for confirmation field |
| `showStrength` | `boolean` | `true` | Show strength meter |
| `showChecklist` | `boolean` | `true` | Show validation checklist |
| `allowGenerate` | `boolean` | `true` | Show generate button |
| `renderVisibilityIcon` | `(visible: boolean) => ReactNode` | — | Custom eye icon |
| `dotSize` | `number` | `10` | Confirmation dot size |
| `matchColor` | `string` | `'#22c55e'` | Match color |
| `mismatchColor` | `string` | `'#ef4444'` | Mismatch color |

## Dependencies

None (React only, uses Web Crypto API and Clipboard API).

## Security Notes

- Password generation uses `crypto.getRandomValues()` (cryptographically secure), not `Math.random()`.
- Uses `autoComplete="new-password"` to signal browser password managers.
- No passwords are stored or transmitted — all logic is client-side. Server-side validation is the consumer's responsibility.
