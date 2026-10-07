# HangTag

Anhänger aus Kraftkarton mit abgeschrägten Ecken, Ösenring und Bäckergarn, beschrieben in Handschrift. Hängt an der Schnur am Flaschenhals (`hanging`) oder liegt frei auf der Seite (`loose`). Fünfte Komponente aus dem Scrapbook-Set ([SCRAPBOOK-TEXTBOXES.md](../../SCRAPBOOK-TEXTBOXES.md), Runde 2), Entwurf A aus der Werkbank. Gedacht für die Widmung zum Geschenk, die Notiz des Winzers zum Wein oder einen Gutschein. Die Flasche bleibt das Hauptmotiv, der Anhänger ist das persönliche Detail daran.

## Features

- Kraftkarton mit feinem Korn, abgeschrägten oberen Ecken und echtem Loch (Maske) mit hellem Verstärkungsring.
- Text in Handschrift **Caveat**, optional mit Unterschrift unten rechts (`sign`, Gedankenstrich kommt automatisch).
- Bäckergarn in Creme mit Bordeaux-Strichelung, mit dunkler Kante, damit es auch auf hellem Grund sichtbar bleibt.
- **`hanging`:** Knoten vorne am Hals, zwei Schnurstränge bis in die Öse, optional die Schlaufe um den Hals (`neckWidth`). Pendelt beim Einblenden zwei, drei Mal aus. Streift die Maus darüber, stößt sie den Anhänger in Zeigerrichtung an.
- **`loose`:** Lose Schnurenden aus der Öse, fällt beim Scrollen ins Bild und richtet sich beim Hover gerade.
- Länge des Textes bestimmt die Höhe, die Mindesthöhe hält die Anhängerform auch bei einem Wort.
- Texturen per Inline-SVG und CSS (kein Bild-Asset), SSR-tauglich.

## How It Works

1. **Fixe Farben statt Theme-Tokens.** Karton, Tinte und Garn bleiben beim Dark/Light- und Akzent-Wechsel gleich, der Anhänger ist ein physisches Objekt (Entscheidung #2 in SCRAPBOOK-TEXTBOXES.md). Kraftpapier, Tinte und Korn kommen aus [`components/lib/scrapbook.ts`](../lib/scrapbook.ts), Garn und Ösenring sind lokal, weil nur der HangTag sie braucht.
2. **Loch per Maske, Schatten per Filter.** Die Ecken schneidet `clip-path`, das Loch stanzt ein `radial-gradient` als `mask-image`. Beides würde einen `box-shadow` mit abschneiden, deshalb liegt der Schatten als `drop-shadow`-Filter am Elternteil und folgt so auch dem Loch.
3. **`hanging`: Der Wrapper ist der Knoten.** Er ist `absolute` und 0 × 0 px groß. Der Consumer setzt ihn per `left`/`top` auf den Punkt vorne am Hals, an dem die Schnur geknotet ist. Daran hängt ein ebenfalls 0 × 0 px großes `motion.div` mit `transformOrigin: '0 0'`, das sich um genau diesen Punkt dreht. Schlaufe und Knoten liegen außerhalb und drehen nicht mit.
4. **Pendeln über einen MotionValue.** Der Winkel startet 16° ausgelenkt und läuft per `animate()` mit einer schwach gedämpften Spring (`stiffness 60 / damping 5`) in den Ruhewinkel, sobald der Anhänger zur Hälfte sichtbar ist. Beim Anstoßen bekommt dieselbe Spring eine Startgeschwindigkeit von ±55°/s, die Richtung ergibt sich aus der Seite, von der der Zeiger kommt.
5. **`loose`: Untransformierter Wrapper** wie bei `PolaroidFrame`. Der äußere `div` misst die Sichtbarkeit und nimmt den Hover entgegen, gedreht wird nur das innere Element (Variants `hidden` → `shown` → `lift`). Sonst flackert der Hover an den gedrehten Ecken.
6. **Hover/Anstoßen nur mit feinem Zeiger** über `useDeviceCapabilities().hasFinePointer`.
7. **Reduced Motion:** `prefersReducedMotion` aus `useDeviceCapabilities()` schaltet Pendeln, Anstoßen, Einfallen und Hover ab. Der Anhänger steht sofort im Ruhewinkel.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | Text auf dem Anhänger. |
| `sign` | `ReactNode` | — | Unterschrift unten rechts, z. B. `"Simon"`. |
| `variant` | `'hanging' \| 'loose'` | `'hanging'` | Am Hals hängend oder frei auf der Seite. |
| `rotate` | `number` (Grad) | `-8` / `-4` | `hanging`: Ruhewinkel, negativ hängt der Anhänger nach rechts, positiv nach links. `loose`: Drehung. |
| `cordLength` | `number` (px) | `44` | Nur `hanging`: Schnur vom Knoten bis zur Öse. |
| `neckWidth` | `number` (px) | — | Nur `hanging`: Halsbreite am Knoten. Zeichnet die Schlaufe um den Hals. Ohne Wert nur Knoten und Schnur (z. B. an einem Nagel). |
| `className` | `string` | — | `hanging`: Klassen am Knoten, z. B. `left-1/2 top-4`. `loose`: Klassen am Wrapper. Schriftgröße per `text-*` (Default `1.3rem`). |
| `style` | `CSSProperties` | — | `hanging`: typischerweise `left`/`top` in px. `loose`: Inline-Styles am Wrapper. |

## Usage

### Golden Path: Widmung am Flaschenhals

Der Knoten sitzt vorne am Hals, dort wo er in die Schulter übergeht. Die Position hängt vom Produktbild ab und wird einmal pro Bild vermessen. Bei einem Bild, das genau auf die Flasche zugeschnitten ist, reichen Prozentwerte:

```tsx
import { HangTag } from '@components/hang-tag/hang-tag'

// Bild auf die Flasche zugeschnitten (kein transparenter Rand), 130 × 520 px
<div className="relative h-130 w-32.5">
  <img src="/zweigelt-2022.png" alt="Flasche Zweigelt 2022" className="size-full" />
  <HangTag className="top-[26.5%] left-1/2" neckWidth={49} rotate={-11} cordLength={46} sign="Simon">
    Für Anna – auf viele gemeinsame Abende!
  </HangTag>
</div>
```

Ein zugeschnittenes Beispiel mit vermessenem Bild steht in `components-showcase/src/pages/text.tsx` (`TaggedBottle`) und `section-showcase/src/sections/store/StoreGeschenk.tsx`.

### Frei auf der Seite als Gutschein

```tsx
<HangTag variant="loose" rotate={4} sign="Simon">
  Gutschein für eine Kellerführung zu zweit
</HangTag>
```

### An einem Nagel, ohne Halsschlaufe

```tsx
<div className="relative h-80 w-40">
  <HangTag className="top-1 left-1/2" rotate={3} cordLength={64}>
    Danke fürs Mithelfen bei der Lese!
  </HangTag>
</div>
```

## Hinweise

- **Schrift lädt die App**, nicht die Komponente: `@fontsource/caveat` (`400.css`) in der `styles.css`, wie bei `PaperNote` und `PolaroidFrame`. Bewusst kein Google-Fonts-CDN (DSGVO). Fehlt die Schrift, fällt der Text auf `cursive` zurück.
- **Platz einplanen:** `hanging` ragt je nach Ruhewinkel seitlich über die Flasche hinaus (bei −11° ca. 35 px nach rechts). `loose` hat lose Schnurenden, die ca. 55 px über die Oberkante und 40 px nach links reichen.
- **Positioniertes Elternteil:** Bei `hanging` braucht der umgebende Container `position: relative`, sonst bezieht sich `left`/`top` auf den nächsten positionierten Vorfahren.
- **Astro ohne Hydration:** Der Anhänger startet unsichtbar und blendet erst per JS ein. In einer Astro-Insel daher `client:visible` setzen.
- **A11y:** Garn, Knoten, Ösenring und Schatten sind `aria-hidden`. Der Text bleibt normaler Fließtext in Lesereihenfolge. Der Anhänger ist nicht interaktiv, das Anstoßen ist reine Deko, deshalb gibt es keinen Fokus-Stop.

## Dependencies

- `motion` (`motion/react`) für Pendeln, Einfallen und Hover.
- `cn()` aus `@components/lib/utils`, `useDeviceCapabilities` aus `@components/lib/use-device-capabilities`, Farben und Korn aus `@components/lib/scrapbook`.
- In der konsumierenden App: `@fontsource/caveat`.
