# FormInput

Presentational text input for forms — text, email, tel, number, password, url. Validation lives outside (TanStack Form, a Zod schema, plain state); the component renders the result: error with shake, success with a drawn checkmark, description and an optional info hint.

## Features

- **Externally validated**: pass `error` (string) and/or `success` (boolean). No schema logic inside — keeps the component library-agnostic and works with TanStack Form's field meta out of the box.
- **State visual**: idle / error (red border + glow + shake + animated `role="alert"` message) / success (accent border + glow + drawn check).
- **Info hint**: `hint` renders a [`FieldHint`](../field-hint/COMPONENT.md) next to the label, linked to the input.
- **Accessible**: `aria-invalid`, `aria-required`, and `aria-describedby` wired to error *or* description plus the hint id.
- **Ref forwarding**: `forwardRef` to the native `<input>` for form libraries and focus control.
- **Required marker**: `required` appends a localized marker (default `*`) to the label.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `'text' \| 'email' \| 'tel' \| 'number' \| 'password' \| 'url'` | `'text'` | Input type |
| `label` | `string` | — | Label above the input |
| `description` | `string` | — | Helper text, shown when there is no error |
| `error` | `string` | — | Error message; switches to the error state and replays the shake on every new error |
| `success` | `boolean` | — | Success state (accent border + check icon, unless `rightIcon` is set) |
| `hint` | `ReactNode` | — | Info-icon tooltip next to the label, linked via `aria-describedby` |
| `hintPosition` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Tooltip position of the hint |
| `leftIcon` / `rightIcon` | `ReactNode` | — | Adornments inside the field |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height + font preset (36 / 44 / 52 px) |
| `required` | `boolean` | — | Native `required` + `aria-required` + label marker |
| `wrapperClassName` | `string` | — | Classes on the outer wrapper |
| `className` | `string` | — | Classes on the `<input>` |
| `style` | `CSSProperties` | — | Inline styles on the field container |
| `messages` | `Partial<FormInputMessages>` | — | i18n override for the required marker |
| …rest | `InputHTMLAttributes` | — | Forwarded to `<input>` (`value`, `onChange`, `onBlur`, `placeholder`, …) |

## Usage

### Validate on blur with Zod

```tsx
import { z } from 'zod'
import { FormInput } from '@components/form-input/form-input'

const emailSchema = z.email('Ungültige E-Mail')
const [value, setValue] = useState('')
const [error, setError] = useState<string>()

<FormInput
  type="email"
  label="E-Mail"
  value={value}
  error={error}
  onChange={(e) => setValue(e.target.value)}
  onBlur={(e) => {
    const res = emailSchema.safeParse(e.target.value)
    setError(res.success ? undefined : res.error.issues[0].message)
  }}
/>
```

### With hint and success state

```tsx
<FormInput
  label="Steuernummer"
  hint="Bitte die 11-stellige Steuer-Identifikationsnummer eintragen."
  hintPosition="right"
  success={isValid}
/>
```

## Dependencies

- `motion` (`motion/react`) — error/description transitions
- `@components/field-hint` — info hint

Shake and check-draw keyframes are injected once (`__form-input-styles__`).
