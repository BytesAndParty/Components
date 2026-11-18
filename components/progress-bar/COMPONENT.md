# ProgressBar

Lineare Fortschrittsanzeige: eine Spur mit Füllung, die bei jeder Wertänderung weich nachläuft. Gegenstück zu `CircularProgress` für Leisten, Level-Balken und Sammelstände. Der Fortschritt beim Scrollen der Seite ist `ScrollProgress`.

## Features

- Beliebiger Wertebereich über `max` (z. B. `value={43} max={91}`), Werte außerhalb werden auf `0…max` begrenzt.
- Natives ARIA-Muster `role="progressbar"` mit `aria-valuemin/max/now` und übersetztem Default-Namen („Fortschritt“ / „Progress“).
- Füllung läuft per CSS-Transition auf `width` nach (500 ms, ease-out).
- Spur und Füllung sind getrennt per `className` und `fillClassName` gestaltbar, z. B. mit einem Verlauf.
- Ohne Bewegungs-Lib, SSR-sicher (kein `matchMedia` im Render), respektiert `prefers-reduced-motion`.

## How It Works

1. **Breite statt `scaleX`.** Die Füllung bekommt `width: <percent>%` als Inline-Style (COMPONENT-GUIDELINES §4b). `scaleX` wäre günstiger beim Rendern, staucht aber die runden Enden und einen Verlauf auf der Füllung mit. Bei einer Leiste, die sich nur bei Nutzeraktionen ändert, fällt der Layout-Aufwand nicht ins Gewicht.
2. **Prozent aus `value` und `max`.** `aria-valuenow` ist der begrenzte Rohwert, `aria-valuemax` das `max`. Screenreader rechnen daraus selbst den Prozentwert. `max <= 0` ergibt eine leere Leiste statt `NaN`.
3. **Name.** `aria-labelledby` gewinnt vor `aria-label`, ohne beides greift `messages.label`.
4. **Reduced Motion:** reines CSS über `motion-reduce:transition-none` an der Füllung (COMPONENT-GUIDELINES §5, ein Weg pro Komponente). Server und Client rendern dasselbe Markup.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | required | Aktueller Wert, wird auf `0…max` begrenzt. |
| `max` | `number` | `100` | Obergrenze des Bereichs. |
| `aria-label` | `string` | `messages.label` | Zugänglicher Name. |
| `aria-labelledby` | `string` | — | ID eines sichtbaren Labels, hat Vorrang vor `aria-label`. |
| `messages` | `Partial<ProgressBarMessages>` | — | Überschreibt den Default-Namen (`label`). |
| `className` | `string` | — | Klassen an der Spur (äußeres Element). Default `h-2 w-full overflow-hidden rounded-full bg-muted`. |
| `fillClassName` | `string` | — | Klassen an der Füllung. Default `h-full rounded-full bg-accent` plus Transition. |
| `style` | `CSSProperties` | — | Inline-Styles an der Spur. |

## Usage

### Golden Path

```tsx
import { ProgressBar } from '@components/progress-bar/progress-bar'

<ProgressBar value={64} aria-label="Upload" />
```

### Eigener Bereich und sichtbares Label

```tsx
<p id="cellar-label">Kellerführungen gebucht: 7 von 12</p>
<ProgressBar value={7} max={12} aria-labelledby="cellar-label" />
```

### Eigene Gestaltung

Höhe, Spur und Füllung per Utilities, `cn()` löst Konflikte mit den Defaults auf:

```tsx
<ProgressBar
  value={visited}
  max={total}
  className="h-3 bg-card ring-1 ring-border"
  fillClassName="bg-linear-to-r from-accent to-accent-lifted duration-700"
/>
```

Gestaltung über eigene CSS-Klassen statt Utilities: Diese Regeln müssen ungelayert stehen (nicht in `@layer components`), sonst gewinnen die Default-Utilities aus `@layer utilities` unabhängig von der Spezifität.

### Nur Deko

Steht der Stand schon als Text daneben, die Leiste für Screenreader ausblenden:

```tsx
<p>3 / 9</p>
<div aria-hidden="true">
  <ProgressBar value={3} max={9} />
</div>
```

## Dependencies

- `useComponentMessages` aus `@components/i18n`.
- `cn()` aus `@components/lib/utils` (`clsx`, `tailwind-merge`).
