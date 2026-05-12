# FieldHint

Kleines Info-Icon mit Tooltip für Formular-Labels und ähnliche Stellen. Wrappt den bestehenden `Tooltip` und liefert eine stabile `id` für Screenreader, sodass das zugehörige Feld den Hint per `aria-describedby` referenzieren kann.

## Features

- **A11y first:** Hint-Text liegt zusätzlich als `sr-only`-Element im DOM mit stabiler ID — funktioniert auch wenn der Tooltip nicht sichtbar ist.
- **Keyboard:** Fokussierbar via Tab, Tooltip öffnet bei `:focus` und `:hover`, schließt bei Blur/Mouse-Leave.
- **Style-konsistent:** Nutzt `var(--accent)`, `var(--muted-foreground)` und `var(--foreground)` — folgt automatisch Theme- und Accent-Wechseln.
- **Composable:** Standalone neben jedem Label nutzbar oder per `hint`-Prop direkt in `FormInput`.
- **i18n:** `triggerLabel` für den Icon-Button (`aria-label`) über `messages`-Prop überschreibbar.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `content` | `ReactNode` | — | Hint-Inhalt (Tooltip + sr-only-Text) |
| `id` | `string?` | auto | Stabile ID für `aria-describedby` am zugehörigen Feld |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Tooltip-Position |
| `size` | `number` | `14` | Icon-Größe in px |
| `delay` | `number` | `0.15` | Tooltip-Delay in Sekunden |
| `className` | `string?` | — | Zusätzliche Klassen am Trigger-Button |
| `messages` | `Partial<FieldHintMessages>?` | — | i18n-Override |

## Usage

### Standalone neben einem Label

```tsx
import { FieldHint } from '@components/field-hint/field-hint';

const hintId = 'username-hint';

<div className="flex items-center gap-1.5">
  <label htmlFor="username">Benutzername</label>
  <FieldHint
    id={hintId}
    content="3–20 Zeichen, nur Buchstaben, Zahlen und Unterstrich."
  />
</div>
<input id="username" aria-describedby={hintId} />
```

### Mit FormInput (integrierte Variante)

```tsx
import { FormInput } from '@components/form-input/form-input';

<FormInput
  label="Steuernummer"
  hint="Bitte die 11-stellige Steuer-Identifikationsnummer eintragen."
  hintPosition="right"
/>
```

`FormInput` verkabelt `aria-describedby` automatisch mit Hint-, Error- und Description-IDs.

## Dependencies

- `motion` (über `tooltip`)
- `lucide-react` (`Info`-Icon)

## Notes

- Der `sr-only`-Span hält den Hint-Text dauerhaft im A11y-Tree. Das Icon ist eine zusätzliche visuelle Affordance, kein primärer Träger der Information.
- Der Tooltip wird auf `whitespace-normal` mit `max-w-xs` überschrieben, damit auch ganze Sätze umbrechen.
