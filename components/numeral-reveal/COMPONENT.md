# NumeralReveal

Römische Ziffer mit verstecktem Klick-Easteregg: Ein Klick blendet für ein paar Sekunden den
arabischen Wert ein und danach wieder die römische Ziffer. Gleiche Haltung wie
[`WaveText`](../wave-text/COMPONENT.md) — nichts kündigt den Klick an.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Numeral Reveal** | Klick blendet `XXX` → `30` über, hält, blendet zurück. Ein Klick während der Standzeit verlängert sie. |

## How It Works

1. **Kein Layout-Sprung, strukturell**: Beide Schreibweisen liegen in derselben Grid-Zelle
   (`display: inline-grid`, beide Kinder `grid-area: 1 / 1`, `justify-items: start`). Der Container
   misst sich am breiteren Kind, der Wechsel ist danach reine `opacity`. Die naheliegende
   Alternative — ein geschätztes `min-width` — wird bei jeder neuen Ziffer still falsch.
2. **Timer statt Animationskette**: Klick setzt `revealed`, ein Timeout auf
   `transitionDuration + revealDuration` nimmt es zurück. Ein Klick während der Standzeit löscht den
   alten Timer, statt eine zweite Rückblende dahinter zu hängen — sonst flackert die Zahl.
3. **Parser, keine Lookup-Map**: `romanToArabic` (eigenes Modul [`roman.ts`](./roman.ts), Tests in
   [`roman.test.ts`](./roman.test.ts)) läuft die Zeichen durch und subtrahiert, wenn der
   Nachfolger größer ist. Damit fallen `IV` = 4 und `XL` = 40 automatisch raus. Eine Map hätte jeden
   Wert einzeln aufzählen müssen und wäre bei der ersten unbekannten Stufe still falsch geworden.
4. **Totale Funktion**: Bei ungültiger Eingabe gibt der Parser `null` zurück, und die Komponente
   rendert den String unverändert und ohne Klick-Verhalten. Kein Raten, kein Wurf.
5. **Style-Injection**: nur die `prefers-reduced-motion`-Regel, dedupliziert per
   `__numeral-reveal-styles__` (Guidelines §4c/§9).

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `numeral` | `string` | | Die römische Ziffer, z. B. `'I'`, `'II'`, `'XXX'`. Ungültige Werte werden unverändert und ohne Klick gerendert. |
| `revealDuration` | `number` | `3000` | Standzeit der arabischen Zahl in ms, nach der Überblendung. |
| `transitionDuration` | `number` | `300` | Dauer einer Überblendung in ms. |
| `className` | `string` | | Schrift und Farbe kommen komplett vom Aufrufer. |
| `style` | `CSSProperties` | | |

Die Parser-Logik liegt bewusst in [`roman.ts`](./roman.ts) statt im Komponenten-File: so bleibt sie
eigenständig testbar, ohne dass der Zusatz-Export Fast Refresh für die Komponente bricht
(`react-refresh/only-export-components`). Gleiches Muster wie
[`cellar-canvas/wine-fields/validator.ts`](../cellar-canvas/wine-fields/validator.ts).

```tsx
import { romanToArabic } from '@components/numeral-reveal/roman'
```

Der Parser prüft das *Alphabet*, nicht die Orthografie — `IIII` ergibt 4. Absicht: Er soll eine
Ziffer lesen, die jemand aufs Layout gesetzt hat, sie nicht benoten.

## Usage

```tsx
// Preis-Ledger: I → 1, II → 2, XXX → 30
<NumeralReveal numeral="XXX" className="font-display text-lg font-light italic text-accent" />

// Kürzere Standzeit
<NumeralReveal numeral="IV" revealDuration={1500} />
```

## Accessibility

**Bewusste Abweichung von Guidelines §7 (Tastatur-Pflicht)** — Begründung identisch zu
[`WaveText`](../wave-text/COMPONENT.md#accessibility): Hinter dem Klick liegt keine Funktion und
keine Information, die römische Ziffer ist ohne Interaktion vollständig lesbar.

Weiter beachtet:
- Die arabische Zahl ist `aria-hidden` — Screenreader lesen durchgehend die römische Ziffer, also
  den eigentlichen Inhalt.
- Unter `prefers-reduced-motion` bleibt die Enthüllung erhalten und wird nur hart statt überblendet.
  Reduced Motion soll Bewegung reduzieren, nicht Funktion entfernen.
- Der Timer wird beim Unmount gecleart.

## Dependencies

`cn()` aus [`components/lib/utils.ts`](../lib/utils.ts) und [`./roman.ts`](./roman.ts).
Kein `motion/react`.
