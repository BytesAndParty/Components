# BookingCalendar

Datengetriebener Termin-Picker auf Ark UI `DatePicker` (headless Monatsraster). Buchbare Tage aus den
übergebenen Slots werden hervorgehoben, der Rest ist deaktiviert; nach Datumswahl erscheinen die
Uhrzeit-Chips, dann ein Gäste-Stepper und der Absenden-Button. `onSubmit` ist app-seitig — die
Komponente kennt kein Backend. Wiederverwendbar für Verkostung/Wanderung/Kellerführung.

## Features

- **Ark UI DatePicker** (`inline`): echtes Monatsraster mit Keyboard-Navigation & Screenreader-Support
  gratis. `isDateUnavailable` deaktiviert Tage ohne Slots: Sie bleiben sichtbar, aber ausgegraut, ohne
  Hover-Fläche und mit `not-allowed`-Cursor. Buchbare Tage zeigen `pointer` und geben beim Klick leicht
  nach (`active:scale-95`). Den Klick auf gesperrte Tage blockt Zag selbst. Heute bleibt in Akzentfarbe,
  gesperrt aber gedämpft.
- **Datengetrieben**: `slots` (Datum/Uhrzeit/Plätze/Preis) rein → Komponente gruppiert nach Tag,
  sortiert Uhrzeiten, deckelt Gäste auf `capacity`.
- **Flow-States**: Datum → Uhrzeit → Gäste → Absenden → Erfolgs-Panel (mit Reset für weitere Anfrage).
- **i18n**: `messages`-Prop überschreibt Strings; Monats-/Wochentagsnamen kommen aus Arks `locale`
  (DE/EN/PL via globalen `I18nProvider`, `CALENDAR_LOCALES`: de-DE / en-US / pl-PL). Preis über
  `Intl.NumberFormat` (`CURRENCY_LOCALES`: de-AT / en-IE / pl-PL, EUR). `seatsLeft` ist ein String
  oder ein Objekt mit Pluralformen (`pluralize` aus `components/i18n`); Polnisch braucht drei Formen
  („zostało 1 miejsce“, „zostały 2 miejsca“, „zostało 5 miejsc“). Die polnischen Texte sind ein
  Maschinenentwurf und sollten gegengelesen werden. Die
  Screenreader-Texte von Zag (Monatspfeile „Zum vorherigen Monat“, Tageszellen „Dienstag,
  17. November 2026 wählen“, „Nicht verfügbar. …“) kommen über `useArkTranslations('datePicker')` aus
  `components/i18n/ark-bridge.ts` als `translations` an `DatePicker.Root`; ohne sie wären sie englisch.
- **Touch-Ziele**: Monatspfeile mindestens 44 × 44 px. Die Tageszellen sind als Trefferfläche so breit
  wie ihre Rasterspalte und mindestens 44 px hoch; der sichtbare Kreis (36 px) ist ein inneres
  `span`. Volle 44 px Breite gehen nicht: Sieben Spalten à 44 px brauchen 308 px, auf dem Handy hat
  der Kalender weniger. Der Fokusring liegt am Kreis (`group-focus-visible/day`).
- **Theming**: nur semantische oklch-Tokens (`bg-card`, `text-accent`, `border-border`, …), keine Hex.
  Auf fest gefärbten Flächen lassen sich die Tokens am Wrapper per `style` umsetzen (Beispiel:
  `section-showcase/…/EventsBuchArt.tsx`).
- **Container-Query**: Monat und Uhrzeit stehen ab 36 rem eigener Breite nebeneinander (`@xl`),
  darunter übereinander — unabhängig vom Viewport, also auch in einer schmalen Seitenspalte.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `slots` | `BookingSlot[]` | — | Buchbare Termine. Leeres Array → Leerzustand. |
| `onSubmit` | `(b: { slotId, guests }) => void \| Promise<void>` | — | App-Callback beim Absenden. Async → Button zeigt Lade-/Erfolgs-State. |
| `messages` | `Partial<BookingCalendarMessages>` | — | Einzelne UI-Strings überschreiben. |
| `className` | `string?` | — | Zusätzliche Klassen am äußeren `@container`-Wrapper (Layout: Breite, Abstand). |

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
- `@components/number-input` (Gäste-Stepper, auf Touch-Geräten 44-px-Stepper), `lucide-react` (Icons),
  `../i18n` (inkl. `useArkTranslations`), `../lib/utils`

## Decisions

| # | Frage | Entscheidung |
|---|---|---|
| 1 | Kalender-Lib vs. handgebaut | **Ark UI DatePicker** — headless, a11y/Keyboard gratis, idiomatisch (Ark ist die Foundation). |
| 2 | Monatsraster vs. Slot-Liste | **Monatsraster** mit deaktivierten Nicht-Slot-Tagen (User-Wahl). |
| 3 | Backend | **Keins** — `onSubmit` ist app-seitig; die Komponente ist rein präsentational + Slot-getrieben. |
| 4 | Zwei Spalten ab Viewport `md` vs. ab eigener Breite | **Eigene Breite** (`@container`) — in einer 4-von-12-Spalte überlappten Monat und Uhrzeit-Panel sonst. |

## Not in scope

Echte Verfügbarkeits-Abfrage, Zahlung, Persistenz, Mehrfach-/Range-Auswahl.
