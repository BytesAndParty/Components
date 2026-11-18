# CheckboxCard

Ganze Karte als Checkbox: Ein Klick irgendwo auf die Karte hakt ab, darunter liegt ein nativer Checkbox-Input. Für Auswahl-Kacheln mit freiem Inhalt (Sammelkarten, Event-Optionen, Weinpakete). Die kleine Checkbox mit Text daneben ist `Checkbox`, ein Ein/Aus-Schalter `Switch`.

## Features

- Die ganze Karte ist das `<label>`, der native Input liegt visuell versteckt (`sr-only`) darin: Tab, Leertaste, Formular-Semantik und Screenreader funktionieren ohne eigenen Key-Handler.
- Freier Inhalt als `children`, der Text daraus ist der zugängliche Name der Checkbox.
- Indikator austauschbar (`indicator`), z. B. ein Stempel statt des Häkchens. Default: Box mit Häkchen, das sich per Stroke zeichnet.
- Zustand als Attribut an der Karte: `data-state="checked" | "unchecked"`, dazu `data-disabled`. Darüber lässt sich die Karte von außen gestalten.
- Controlled und uncontrolled (`checked` bzw. `defaultChecked`), `disabled`.
- Formularfeld: `name`, `value`, `required` und `id` gehen unverändert an den nativen Input. Absenden und Pflichtfeld-Prüfung übernimmt der Browser wie bei jeder Checkbox.
- Fokus als `outline` am Kartenrand, sobald der Input per Tastatur fokussiert ist.
- Ohne Bewegungs-Lib, SSR-sicher, respektiert `prefers-reduced-motion`.

## How It Works

1. **Label statt Button-Rolle.** Ein `<label>` mit verschachteltem Input braucht kein `role`, kein `tabIndex` und kein `onKeyDown` (COMPONENT-GUIDELINES §7): Ein Klick auf das Label schaltet den Input, der Input feuert `change`. Daraus folgt die Regel für den Inhalt: keine Buttons oder Links in `children`, sonst sind interaktive Elemente verschachtelt. Zusätzliche Aktionen (z. B. ein Favoriten-Stern) als Geschwister neben die Karte legen und absolut positionieren.
2. **Indikator ist Deko.** Er steht in einem `aria-hidden`-Wrapper, den Zustand meldet der Input. Ein eigener Indikator kann den Zustand vom Einsatzort kennen (controlled) oder per CSS über `[data-state="checked"]` der Karte reagieren.
3. **Fokus per `outline`, nicht `ring`.** Abweichung vom Ring-Muster in COMPONENT-GUIDELINES §7, bewusst: Ein Ring ist ein `box-shadow` und verschwindet, sobald der Einsatzort der Karte einen eigenen Schatten gibt (typisch für den ausgewählten Zustand), und im Forced-Colors-Modus (Windows-Kontrastdesign). Die Outline bleibt in beiden Fällen sichtbar. Selektor `:has(:focus-visible)` an der Karte, Farbe `--ring`.
4. **Häkchen per `pathLength`.** Der Pfad bekommt `pathLength={1}` und `stroke-dasharray: 1`, der Offset wechselt zwischen 1 und 0. Ungecheckt ist das SVG zusätzlich unsichtbar, sonst bliebe die runde Linienkappe als Punkt am Pfadanfang stehen.
5. **Reduced Motion:** reines CSS über `motion-reduce:transition-none` an Karte, Box, SVG und Pfad (COMPONENT-GUIDELINES §5).
6. **Formular-Semantik.** Die Komponente reicht `name`, `value`, `required` und `id` nur durch, eigenes Verhalten hängt nicht daran. Gesendet wird die Karte nur, wenn sie angehakt ist, als `name=value` (ohne `value` als `name=on`). Mit `required` hält der Browser das Formular an, solange die Karte nicht angehakt ist. Ein `reset` des Formulars kennt die Komponente nicht: Der Zustand liegt in React, `data-state` und Indikator bleiben stehen. Wer zurücksetzen muss, führt die Karte controlled und setzt `checked` im `onReset` des Formulars selbst.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | — | Zustand (controlled). |
| `defaultChecked` | `boolean` | `false` | Startzustand (uncontrolled). |
| `onChange` | `(checked: boolean) => void` | — | Wird mit dem neuen Zustand aufgerufen. |
| `disabled` | `boolean` | `false` | Sperrt die Karte (Input `disabled`, `data-disabled`, halbe Deckkraft). |
| `name` | `string` | — | Feldname des nativen Inputs im Formular. |
| `value` | `string` | — | Gesendeter Wert, solange die Karte angehakt ist. Ohne Angabe sendet der Browser `on`. |
| `required` | `boolean` | — | Native Pflichtfeld-Prüfung: Das Formular wird erst mit Haken gesendet. |
| `id` | `string` | — | ID des nativen Inputs. |
| `children` | `ReactNode` | required | Inhalt der Karte, zugleich der zugängliche Name. Keine interaktiven Elemente. |
| `indicator` | `ReactNode` | Box mit Häkchen | Ersetzt den Indikator, wird `aria-hidden` gerendert. |
| `className` | `string` | — | Klassen an der Karte (`<label>`), per `cn()` mit den Defaults zusammengeführt. |
| `style` | `CSSProperties` | — | Inline-Styles an der Karte. |

## Usage

### Golden Path

```tsx
import { CheckboxCard } from '@components/checkbox-card/checkbox-card'

const [picnic, setPicnic] = useState(false)

<CheckboxCard checked={picnic} onChange={setPicnic}>
  <span className="font-medium">Picknick im Weingarten</span>
  <span className="text-sm text-muted-foreground">Korb für zwei, ab 12 Uhr</span>
</CheckboxCard>
```

### Eigener Indikator (controlled)

```tsx
<CheckboxCard
  checked={visited}
  onChange={() => toggle(id)}
  indicator={<Stamp checked={visited} />}
>
  {name}
</CheckboxCard>
```

### Im Formular

```tsx
<form action="/buchung">
  <CheckboxCard name="extras" value="picknick">Picknick im Weingarten</CheckboxCard>
  <CheckboxCard name="agb" value="gelesen" required>AGB gelesen</CheckboxCard>
  <button type="submit">Buchen</button>
</form>
```

### Gestaltung von außen

Per Utilities über `className`, Zustände über die Attribute:

```tsx
<CheckboxCard className="rounded-2xl border-dashed data-[state=checked]:border-solid data-[state=checked]:shadow-lg">
  …
</CheckboxCard>
```

Mit eigenen CSS-Klassen (`.sticker`, `.sticker[data-state="checked"]`): Diese Regeln müssen ungelayert stehen, nicht in `@layer components`. Sonst gewinnen die Default-Utilities aus `@layer utilities` unabhängig von der Spezifität. Fokus gestaltet man dann über `.sticker:has(input:focus-visible) { outline: … }`.

### Zusatzaktion neben der Karte

```tsx
<li className="relative">
  <CheckboxCard checked={visited} onChange={() => toggle(id)}>{name}</CheckboxCard>
  {visited && (
    <button type="button" aria-pressed={starred} aria-label={`Favorit: ${name}`} className="absolute top-2 right-2" onClick={() => star(id)}>⭐</button>
  )}
</li>
```

## Dependencies

- `cn()` aus `@components/lib/utils` (`clsx`, `tailwind-merge`).
