# BookingCalendar

Datengetriebener Termin-Picker auf Ark UI `DatePicker` (headless Monatsraster). Buchbare Tage aus den
übergebenen Slots werden hervorgehoben, der Rest ist deaktiviert; nach Datumswahl erscheinen die
Uhrzeit-Chips, dann ein Gäste-Stepper und der Absenden-Button. `onSubmit` ist app-seitig — die
Komponente kennt kein Backend. Wiederverwendbar für Verkostung/Wanderung/Kellerführung.

## Features

- **Ark UI DatePicker** (`inline`): echtes Monatsraster mit Keyboard-Navigation & Screenreader-Support
  gratis. `isDateUnavailable` deaktiviert Tage ohne Slots.
- **Datengetrieben**: `slots` (Datum/Uhrzeit/Plätze/Preis) rein → Komponente gruppiert nach Tag,
  sortiert Uhrzeiten, deckelt Gäste auf `capacity`.
- **Flow-States**: Datum → Uhrzeit → Gäste → Absenden → Erfolgs-Panel (mit Reset für weitere Anfrage).
- **i18n**: `messages`-Prop überschreibt Strings; Monats-/Wochentagsnamen kommen aus Arks `locale`
  (DE/EN via globalen `I18nProvider`). Preis über `Intl.NumberFormat` (de-AT / en-IE, EUR).
- **Theming**: nur semantische oklch-Tokens (`bg-card`, `text-accent`, `border-border`, …), keine Hex.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `slots` | `BookingSlot[]` | — | Buchbare Termine. Leeres Array → Leerzustand. |
| `onSubmit` | `(b: { slotId, guests }) => void \| Promise<void>` | — | App-Callback beim Absenden. Async → Button zeigt Lade-/Erfolgs-State. |
| `messages` | `Partial<BookingCalendarMessages>` | — | Einzelne UI-Strings überschreiben. |
| `className` | `string?` | — | Zusätzliche Klassen am Wurzel-Grid. |

```ts
interface BookingSlot {
  id: string;
  date: string;     // 'YYYY-MM-DD'
  time: string;     // 'HH:mm'
  capacity: number; // freie Plätze
  price?: number;   // € pro Person
}
```

## Usage

```tsx
import { BookingCalendar } from '@components/booking-calendar/booking-calendar';

<BookingCalendar
  slots={[
    { id: 's1', date: '2026-08-14', time: '15:00', capacity: 6, price: 45 },
    { id: 's2', date: '2026-08-14', time: '17:30', capacity: 4, price: 45 },
    { id: 's3', date: '2026-08-21', time: '16:00', capacity: 8, price: 45 },
  ]}
  onSubmit={async ({ slotId, guests }) => {
    await api.book(slotId, guests); // app-seitig
  }}
/>
```

## Dependencies

- `@ark-ui/react/date-picker` (+ transitives `@internationalized/date` über `parseDate`)
- `@components/number-input` (Gäste-Stepper), `lucide-react` (Icons), `../i18n`, `../lib/utils`

## Decisions

| # | Frage | Entscheidung |
|---|---|---|
| 1 | Kalender-Lib vs. handgebaut | **Ark UI DatePicker** — headless, a11y/Keyboard gratis, idiomatisch (Ark ist die Foundation). |
| 2 | Monatsraster vs. Slot-Liste | **Monatsraster** mit deaktivierten Nicht-Slot-Tagen (User-Wahl). |
| 3 | Backend | **Keins** — `onSubmit` ist app-seitig; die Komponente ist rein präsentational + Slot-getrieben. |

## Not in scope

Echte Verfügbarkeits-Abfrage, Zahlung, Persistenz, Mehrfach-/Range-Auswahl.
