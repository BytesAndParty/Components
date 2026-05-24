# ValidatorBadge

A compact status indicator that displays compliance warnings and errors, typically used for legal or data integrity checks (e.g., EU Label Compliance).

## Features

- **Dynamic Severity:** Automatically switches between "Compliant" (Emerald), "Warning" (Amber), and "Error" (Destructive) states.
- **Detailed Popover:** Click the badge to reveal a list of specific issues with labels and descriptions.
- **Smart Counting:** Summarizes the number of missing or invalid fields.
- **Accessibility:** Includes screen-reader labels for severity levels and ARIA-compliant popover management.
- **I18n Integrated:** Support for translatable strings and dynamic interpolation (e.g., "{count} fields missing").

## How It Works

The component uses **Ark UI's Popover** primitive to handle positioning and focus management.
- It filters the `warnings` array to determine if any errors are present.
- If no warnings exist, it renders a simple "Compliant" badge.
- When clicked, a `Portal`-ed popover shows the full list of `ValidationWarning` objects.

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `warnings` | `ValidationWarning[]` | - | List of validation issues. |
| `className` | `string` | - | Custom classes for the badge. |
| `messages` | `Partial<ValidatorBadgeMessages>` | - | Custom i18n overrides. |

### ValidationWarning
```typescript
interface ValidationWarning {
  key: string
  label: string
  description?: string
  severity: 'warning' | 'error'
}
```

## Usage

```tsx
import { ValidatorBadge, type ValidationWarning } from './components/validator-badge'

const warnings: ValidationWarning[] = [
  { 
    key: 'alc', 
    label: 'Alcohol content missing', 
    severity: 'error',
    description: 'Mandatory for EU wine labels.' 
  }
]

function Header() {
  return (
    <ValidatorBadge warnings={warnings} />
  )
}
```

## Dependencies

- `@ark-ui/react`: Popover and Portal primitives.
- `lucide-react`: Status and close icons.
- `components/i18n`: Internationalization and `interpolate` utility.
