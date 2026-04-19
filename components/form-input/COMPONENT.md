# FormInput

Schema-driven text input for forms — text, email, tel, number, password, url. Accepts any `.safeParse(value)` validator (Zod v4 recommended) and handles blur/change validation, error display with shake, and success checkmark.

## Features

- **Zod-compatible**: `schema` accepts anything with `safeParse`. Works with Zod v4 out of the box (no peer dep).
- **Per-type affordances**: correct `inputMode`, `autoComplete`, optional phone auto-formatting, numeric clamping to `min`/`max`.
- **Validation modes**: `onBlur` (default), `onChange` (live after first blur), `onSubmit` (parent-driven via `forceError`).
- **State visual**: idle / error (red border + shake + alert icon) / success (accent border + drawn check).
- **Accessible**: `aria-invalid`, `aria-describedby` wired to the error or description element.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `'text' \| 'email' \| 'tel' \| 'number' \| 'password' \| 'url'` | `'text'` | Input type |
| `label` | `string?` | — | Label above the input |
| `description` | `string?` | — | Helper text shown when no error |
| `schema` | `{ safeParse(v) }?` | — | Zod (or compatible) validator |
| `validateMode` | `'onBlur' \| 'onChange' \| 'onSubmit'` | `'onBlur'` | When to validate |
| `forceError` | `string \| null` | `null` | Parent-supplied error (e.g. from form submit) |
| `value` / `defaultValue` | `string` | `''` | Controlled / uncontrolled value |
| `onChange` | `(v: string) => void` | — | Value change callback |
| `onValidate` | `(r: { valid, error }) => void` | — | Fired after each validation |
| `leftIcon` / `rightIcon` | `ReactNode?` | — | Adornments |
| `autoFormatPhone` | `boolean` | `false` | Format DE/US phone progressively (only `type="tel"`) |
| `min` / `max` | `number?` | — | Numeric clamping (only `type="number"`) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height + font preset |
| …rest | `InputHTMLAttributes` | — | Forwarded to `<input>` |

## Usage

### Email with Zod v4

```tsx
import { z } from 'zod';
import { FormInput } from '@components/form-input/form-input';

const emailSchema = z.string().email('Ungültige E-Mail');

<FormInput
  type="email"
  label="E-Mail"
  schema={emailSchema}
  placeholder="du@beispiel.de"
/>
```

### Phone with auto-format

```tsx
<FormInput
  type="tel"
  label="Telefon"
  autoFormatPhone
  schema={z.string().min(8, 'Zu kurz')}
/>
```

### Number with clamping

```tsx
<FormInput
  type="number"
  label="Alter"
  min={18}
  max={120}
  schema={z.number().min(18, 'Min. 18 Jahre').max(120)}
/>
```

## Dependencies

- None (Zod optional, anything with `safeParse` works)

## Notes

- The component doesn't import Zod itself — pass your own schema. This keeps the component tree-shakeable and works with any version.
- `autoFormatPhone` uses a pragmatic DE/US heuristic. For international forms, pass `schema` with a phone-specific validator and skip auto-format.
- `shakeKey` forces animation restart on each new error — the shake always plays on validation failure, not just once.
