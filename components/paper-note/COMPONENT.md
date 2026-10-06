# PaperNote

Scrapbook-Notiz, die wie ein echtes Stück Papier auf der Seite liegt: Rissrand, Papierkorn, Klebestreifen, optional ein handgezeichneter Pfeil. Erste Komponente aus dem Scrapbook-Set ([SCRAPBOOK-TEXTBOXES.md](../../SCRAPBOOK-TEXTBOXES.md)). Gedacht für persönliche Zwischentöne neben ruhigen Editorial-Layouts, z. B. Einladungen, Termine oder Hinweise vom Gastgeber.

## Features

- Zwei Papier-Arten über `variant`:
  - `torn` (Default): rundum gerissen, olivgrünes Washi-Tape mittig, Handschrift **Caveat**. Fällt beim Scrollen ins Bild, der Pfeil zeichnet sich dabei.
  - `notepad`: vom Block abgerissen (nur die Oberkante, mit hellem Faserrand), Kreppband an beiden Ecken, angehobene Ecken als Schatten, Handschrift **Kalam**. Statisch.
- Drei Papierfarben über `paper`: `kraft`, `cream`, `dark`. Bei `notepad` bekommt `cream` blaugraue Linien.
- Rissform pro Instanz automatisch verschieden (aus `useId` abgeleitet), per `seed` reproduzierbar festlegbar.
- Pfeil in vier Richtungen, übernimmt die Textfarbe des Wrappers (`currentColor`), also z. B. `className="text-accent"`.
- Texturen komplett per Inline-SVG und CSS (kein Bild-Asset), SSR-tauglich.

## How It Works

1. **Fixe Papierfarben statt Theme-Tokens.** Die Notiz soll wie ein physisches Objekt wirken und sich beim Dark/Light-Wechsel nicht verfärben (Entscheidung #2 in SCRAPBOOK-TEXTBOXES.md). Die Werte sind trotzdem `oklch()`-Konstanten, keine Hex-Farben, und liegen zusammen mit Papierkorn und Washi-Tape in [`components/lib/scrapbook.ts`](../lib/scrapbook.ts), das sich `PaperNote` mit `PolaroidFrame` teilt. Was auf dem Seitenhintergrund liegt (Pfeil), folgt dagegen dem Theme, sonst wäre er im Dark Mode unsichtbar.
2. **Rissrand per `clip-path: polygon()`.** Die Punkte entstehen aus einem deterministischen PRNG (mulberry32) als Random-Walk. So wirkt der Rand gerissen statt gesägt. Die Tiefe ist in px angegeben, damit sie nicht mit der Notizgröße skaliert.
3. **Schatten außerhalb des Clips.** `clip-path` schneidet `box-shadow` und `filter` am selben Element weg. Deshalb sitzt bei `torn` ein `drop-shadow` auf einem Eltern-Element, bei `notepad` liegen zwei schräge Schatten-Spans mit `-z-10` hinter dem Blatt (`isolate` am Wrapper).
4. **Papierkorn** als zwei `feTurbulence`-Data-URIs (fein + faserig), per `background-blend-mode` mit der Papierfarbe verrechnet.
5. **Animation (nur `torn`)** über `motion/react` mit `useInView` (einmalig, 40 % sichtbar) und Spring `stiffness 150 / damping 20`. `useReducedMotion()` schaltet Drop-in und Pfeil-Zeichnen ab.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | Inhalt der Notiz. |
| `variant` | `'torn' \| 'notepad'` | `'torn'` | Papier-Art (siehe Features). |
| `paper` | `'kraft' \| 'cream' \| 'dark'` | `'kraft'` | Papierfarbe, theme-unabhängig. |
| `rotate` | `number` (Grad) | `-2` / `1.5` | Drehung. Default hängt von `variant` ab. |
| `tape` | `boolean` | `false` | Klebestreifen anzeigen (Washi mittig bzw. Kreppband an den Ecken). |
| `arrow` | `'up' \| 'down' \| 'left' \| 'right'` | — | Handgezeichneter Pfeil außerhalb der Notiz. Farbe = Textfarbe des Wrappers. |
| `seed` | `number` | aus `useId` | Legt die Rissform fest. |
| `className` | `string` | — | Klassen am Wrapper. Breite (`max-w-*`), Schriftgröße (`text-*`) und Pfeilfarbe (`text-*`) lassen sich hier überschreiben. |
| `style` | `CSSProperties` | — | Inline-Styles am Wrapper, z. B. `fontFamily` für eine andere Handschrift. |

## Usage

### Golden Path: Einladung mit Tape und Pfeil

```tsx
import { PaperNote } from '@components/paper-note/paper-note'

<PaperNote paper="kraft" rotate={-3} tape arrow="down">
  Kellerführung am Samstag – wir öffnen die alten Fässer nur für euch.
</PaperNote>
```

### Notizblock mit Linien

```tsx
<PaperNote variant="notepad" paper="cream">
  Mitbringen: festes Schuhwerk, eine Jacke für den Keller – und Durst.
</PaperNote>
```

### Pfeil in Akzentfarbe, ohne Drehung

```tsx
<PaperNote paper="cream" rotate={0} arrow="left" className="text-accent">
  Hier geht's zur Anmeldung.
</PaperNote>
```

Im Einsatz: Section „Veranstaltungen → Die Pinnwand" in der section-showcase (`sections/events/EventsPinnwand.tsx`).

## Hinweise

- **Schriften lädt die App**, nicht die Komponente. Self-hosted über `@fontsource/caveat` und `@fontsource/kalam` (je `400.css`) in der `styles.css`, wie die übrigen Schriften im Repo. Bewusst kein Google-Fonts-CDN (DSGVO). Fehlt die Schrift, fällt die Notiz auf `cursive` zurück.
- **Astro ohne Hydration:** `torn` startet unsichtbar und blendet erst per JS ein. In einer Astro-Insel daher `client:visible` setzen oder `variant="notepad"` verwenden.
- **Platz für den Pfeil:** Der Pfeil liegt absolut außerhalb der Notiz (ca. 86 px seitlich bzw. 90 px nach unten). Im Layout entsprechend Abstand lassen.
- **A11y:** Tape, Pfeil, Schatten und Faserrand sind `aria-hidden`. Die Notiz selbst ist nicht interaktiv. Information steckt nie allein in Drehung oder Deko.

## Dependencies

- `motion` (`motion/react`) für Drop-in und Pfeil-Zeichnen.
- `cn()` aus `@components/lib/utils`, Farben und Texturen aus `@components/lib/scrapbook`.
- In der konsumierenden App: `@fontsource/caveat`, `@fontsource/kalam`.
