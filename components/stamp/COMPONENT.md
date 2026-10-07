# Stamp

Gummistempel für den Jahrgang, der sich beim Einscrollen aufdrückt. Siebte Komponente aus dem Scrapbook-Set ([SCRAPBOOK-TEXTBOXES.md](../../SCRAPBOOK-TEXTBOXES.md), Runde 2). Die zwei Varianten sind die Werkbank-Entwürfe A (Rundstempel, Default) und D (Datumsstempel). Gedacht für Etikett, Produktbild und Papier: Shop-Besucher sehen auf einen Blick, welcher Wein aus dem aktuellen Jahrgang ist.

Kein Status-Badge: „Neu“, „Sale“ oder „Prämiert“ als Pille mit Shimmer liefert `ProductTag`.

## Features

- **`seal`** (Default): Rundstempel mit Doppelring und Umschrift (Absender oben, Ort unten), in der Mitte „Jahrgang“ und das Jahr in der Display-Serif. Wird aufgedrückt und setzt weich auf.
- **`date`**: Datumsstempel als Oval mit Datumsband. Nach dem Aufsetzen rasten die Ziffernräder nacheinander auf das Jahr ein, darunter optional der Absender.
- Ungleichmäßiger Farbauftrag wie bei einem echten Abdruck: Fehlstellen, wolkiger Druck und rauer Rand (`seal`) bzw. leicht auslaufende Tinte (`date`). Jede Instanz bekommt in aller Regel eigene Fehlstellen.
- Tinte ist `currentColor`: auf der Seite folgt sie dem Theme, auf Etikett und Papier kommt sie per `style` (auch Deckweiß auf dunklen Etiketten).
- „Jahrgang“ ist übersetzt (de/en) und per `messages` überschreibbar.
- Rein SVG, kein Bild-Asset. Respektiert `prefers-reduced-motion`.

## How It Works

1. **Aufstempeln per `useInView`.** Sobald 30 % des Stempels sichtbar sind (einmalig), läuft die Bewegung: `seal` mit dem kurzen Spring (`stiffness: 300, damping: 30`) aus `scale: 1.3` und leichter Drehung, die Deckkraft springt dabei in 0,12 s. `date` blendet in 0,22 s aus `scale: 1.12` ein. Die niedrige Schwelle sorgt dafür, dass auch ein über die Kachel-Ecke gesetzter, halb abgeschnittener Stempel erscheint.
2. **Farbauftrag per SVG-Filter.** Feines `feTurbulence`-Rauschen wird über eine `feColorMatrix` steil zur Alpha-Maske geschnitten, das ergibt kleine Löcher. `seal` legt dazu ein grobes Rauschen als wolkige Dichte und verzieht den Rand per `feDisplacementMap`. `date` weichzeichnet den Abdruck minimal und schneidet die Kante wieder hart, die Tinte wirkt dadurch frisch und leicht ausgelaufen. Der Rausch-Seed kommt aus `useId()`, damit zwei Stempel nebeneinander in aller Regel verschieden aussehen. Die Filterfläche ist fest auf die viewBox gesetzt, sonst würde sie bei `date` mit den verdeckten Ziffern der Räder mitwachsen.
3. **Umschrift auf dem Kreis.** Zwei Bögen als `textPath`: oben stehen die Buchstaben nach außen, unten nach innen, beide lesbar von links nach rechts. Ohne Umschrift entfällt der innere Ring und die Mitte wird größer.
4. **Lange Texte werden gestaucht.** Die Breite einer Zeile wird aus Zeichenzahl, Schriftgröße und Sperrung geschätzt. Liegt sie über dem Platz im Bogen, in der Mitte bzw. unter dem Band, setzt die Komponente `textLength` mit `lengthAdjust="spacingAndGlyphs"`. Das gilt auch für ein per `messages` verlängertes „Jahrgang“. Geschätzt statt gemessen, damit der Render rein bleibt, und bewusst knapp, damit kürzere Zeilen nie gedehnt werden.
5. **Ziffernräder.** Jede Ziffer des Jahres ist eine Spalte 0–9, zweimal untereinander, hinter einem Clip auf das Datumsband. Die Spalten rollen gestaffelt auf die zweite Umdrehung, sodass jede Ziffer sichtbar durchläuft. Delays stehen je Property (COMPONENT-GUIDELINES §5).
6. **Reduced Motion:** `useReducedMotion()` gilt als „schon gestempelt“. Mit `initial={false}` steht der Stempel samt Jahr sofort fertig da.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `year` | `number` | required | Jahrgang als vierstellige Jahreszahl, z. B. `2025`. |
| `variant` | `'seal' \| 'date'` | `'seal'` | Rundstempel mit Umschrift oder Datumsstempel mit Ziffernrädern. |
| `issuer` | `string` | — | Absender, z. B. „Weingut Buchart“. `seal`: obere Umschrift, `date`: Zeile unter dem Band. Wird in Versalien gesetzt. |
| `place` | `string` | — | Nur `seal`: untere Umschrift, z. B. „Sooß · Niederösterreich“. |
| `rotate` | `number` (deg) | `-12` / `-8` | Drehung (`seal` / `date`). |
| `messages` | `Partial<StampMessages>` | — | Überschreibt `vintage` („Jahrgang“ / „Vintage“). |
| `className` | `string` | — | Klassen am Wrapper. Breite per `w-*` (Default `w-40` bzw. `w-52`), Tinte per `text-*`. |
| `style` | `CSSProperties` | — | Inline-Styles am Wrapper, z. B. `{ color: 'oklch(0.43 0.13 18)' }` für Bordeaux. |

## Usage

### Golden Path: auf der Seite

```tsx
import { Stamp } from '@components/stamp/stamp'

<Stamp year={2025} issuer="Weingut Buchart" place="Sooß · Niederösterreich" className="text-foreground" />
<Stamp year={2025} variant="date" issuer="Weingut Buchart" className="text-foreground" />
```

### Auf dem Produktbild

Der Stempel sitzt auf dem Etikett. Auf hellem Etikett eine dunkle Tinte, auf dunklem Etikett Deckweiß:

```tsx
<div className="relative">
  <img src="/wine.png" alt="Grüner Veltliner 2025" />
  <div className="absolute flex items-center justify-center" style={{ left: 40, top: 230, width: 126, height: 172 }}>
    <Stamp year={2025} issuer="Weingut Buchart" className="w-27" style={{ color: 'oklch(0.43 0.13 18)' }} />
  </div>
</div>
```

### Auf Papier

```tsx
<PaperNote variant="notepad" paper="cream">
  Der Veltliner ist abgefüllt, ab Samstag im Hofladen!
  <Stamp year={2025} issuer="Weingut Buchart" place="Sooß" className="mt-5 ml-auto w-28" style={{ color: 'oklch(0.43 0.13 18)' }} />
</PaperNote>
```

### Andere Sprache

Der Text folgt der Locale aus dem `AtelierProvider`. Einzelne Stempel lassen sich überschreiben:

```tsx
<Stamp year={2025} variant="date" issuer="Domaine Buchart" messages={{ vintage: 'Millésime' }} />
```

## Hinweise

- **Lesbarkeit:** Unter ~100 px Breite wird die Umschrift von `seal` sehr klein. Auf kleinen Produktkacheln lieber `date` oder `seal` ohne `place`.
- **Schriften:** Umschrift und Versalien nutzen `--font-sans`, das Jahr bei `seal` `--font-display` aus dem Theme (Fallback System-Sans bzw. Georgia). Die Ziffern bei `date` laufen in der System-Monospace.
- **Jahr:** Erwartet eine vierstellige Jahreszahl. Fehlt der Jahrgang in den Produktdaten, den Stempel gar nicht rendern statt `NaN` zu übergeben.
- **Ohne JS unsichtbar:** Der Stempel startet mit `opacity: 0` und erscheint erst per JS. In Astro muss er deshalb als Insel hydriert werden (`client:visible`), ohne Hydration bliebe er für alle unsichtbar.
- **A11y:** Der Wrapper ist `role="img"` mit `aria-label` „Jahrgang 2025“ (übersetzt), das SVG selbst `aria-hidden`. Absender und Ort sind Deko und stehen nicht im Label. Nicht interaktiv, kein Fokus-Stop.

## Dependencies

- `motion` (`motion/react`) für Aufstempeln, Ziffernräder und `useInView`.
- `useComponentMessages` aus `@components/i18n`.
- `hashSeed()` aus `@components/lib/scrapbook`, `cn()` aus `@components/lib/utils`.
