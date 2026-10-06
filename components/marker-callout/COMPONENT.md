# MarkerCallout

Eigenständiger Satz auf einer handgemachten Farbfläche, leicht gedreht. Für die eine Zeile, die in einer Einladung oder Story hängen bleiben soll („Ein besonderes Erlebnis für alle Weinliebhaber – mit euch!“). Vierte Komponente aus dem Scrapbook-Set ([SCRAPBOOK-TEXTBOXES.md](../../SCRAPBOOK-TEXTBOXES.md)).

> **Abgrenzung zu [`Highlighter`](../highlighter/COMPONENT.md):** Der markiert Wörter *im* Fließtext (inline, auch als handgezeichneter Textmarker mit `action="marker"`). `MarkerCallout` ist ein eigener Block mit Fläche hinter dem ganzen Satz. Für einen Textmarker-Strich also immer `Highlighter` nehmen, nicht diese Komponente.

## Features

- Drei Flächen über `variant`:
  - `brush` (Default): handgezeichneter Pinsel-Blob mit Borstenstreifen und trocken ausgefranstem Rand, Handschrift **Caveat**. Der Strich zieht sich beim Scrollen von links auf, danach blendet der Text ein.
  - `watercolor`: verlaufende Wasserfarben-Wolke, die Pigmente sammeln sich am zerfließenden Rand. Display-Serif kursiv (`font-display`). Blutet beim Scrollen von unscharf zu scharf ein.
  - `tape`: jede Zeile ein eigener Kreppband-Streifen mit gerissenen Enden, leicht schief und versetzt, Handschrift **Kalam** fett. Die Streifen gleiten gestaffelt ein.
- Drei Farben über `color`: `kraft`, `sage`, `rose`. Feste Mini-Palette, keine freien Farbwerte.
- Pinselform und Aquarell-Rand pro Instanz automatisch verschieden (aus `useId`), per `seed` reproduzierbar.
- Texturen komplett per Inline-SVG und CSS (kein Bild-Asset), SSR-tauglich.

## How It Works

1. **Fixe Farben statt Theme-Tokens.** Die Fläche ist ein physisches Objekt und bleibt beim Dark/Light- und Akzent-Wechsel gleich (Entscheidung #2 in SCRAPBOOK-TEXTBOXES.md). Tinte und Kraft-Ton kommen aus [`lib/scrapbook.ts`](../lib/scrapbook.ts), Salbei und Rosé sind lokal.
2. **Brush:** Ein `<path>` aus drei vordefinierten Blobs (`seed % 3`), gestreckt per `preserveAspectRatio="none"` auf die Textgröße. Ein `feTurbulence` + `feDisplacementMap` franst den Rand aus, vier helle Streifen im Blob-`clipPath` imitieren Borsten. Das Aufziehen läuft über `clip-path: inset()` auf einem inneren Wrapper. Das `useInView`-Ziel bleibt ungeclippt (STYLE-GUIDE §11).
3. **Watercolor:** Eine Fläche mit unregelmäßigem `border-radius` und innerem Schatten in dunklerem Ton (das Pigment am Rand), verzerrt durch einen SVG-Displacement-Filter. Der Text liegt unverzerrt darüber.
4. **Tape:** `lines` statt `children`, weil jede Zeile ein eigenes Element mit eigenem `clip-path` sein muss. Das geht mit einem einzigen umbrechenden Text nicht. Die Streifen sind Flex-Items und damit eigene Blöcke, Screenreader und Kopieren lesen sie als getrennte Zeilen.
5. **Animation** über `motion/react` mit `useInView` (einmalig, 50 % sichtbar). Stagger-Delays je Property (COMPONENT-GUIDELINES §5). `useReducedMotion()` schaltet alle Einblendungen ab, die Fläche steht dann sofort da.
6. **Typen:** `MarkerCalloutProps` ist eine Discriminated Union. `variant="tape"` verlangt `lines` und verbietet `children`, die anderen Varianten umgekehrt.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'brush' \| 'watercolor' \| 'tape'` | `'brush'` | Fläche (siehe Features). |
| `children` | `ReactNode` | required bei `brush`/`watercolor` | Der Satz. Bei `tape` nicht erlaubt. |
| `lines` | `string[]` | required bei `tape` | Eine Zeile pro Streifen. Nur bei `tape`. |
| `color` | `'kraft' \| 'sage' \| 'rose'` | `'kraft'` | Farbe der Fläche. |
| `rotate` | `number` (Grad) | `-1` / `-0.5` / `-1` | Drehung. Default je Variante. |
| `seed` | `number` | aus `useId` | Legt Pinselform bzw. Aquarell-Rand fest. Bei `tape` ohne Wirkung. |
| `className` | `string` | — | Klassen am Wrapper. Breite (`max-w-*`, Default `max-w-88`) und Schriftgröße (`text-*`) lassen sich hier überschreiben. |
| `style` | `CSSProperties` | — | Inline-Styles am Wrapper. |

## Usage

### Golden Path: Pinselstrich

```tsx
import { MarkerCallout } from '@components/marker-callout/marker-callout'

<MarkerCallout>Ein besonderes Erlebnis für alle Weinliebhaber – mit euch!</MarkerCallout>
```

### Aquarell in Salbei

```tsx
<MarkerCallout variant="watercolor" color="sage">
  Reben mieten, durch die Ried wandern, im Keller verkosten.
</MarkerCallout>
```

### Kreppband-Zeilen

```tsx
<MarkerCallout variant="tape" color="rose" lines={['Die Miete', 'ist rein symbolisch.']} />
```

## Hinweise

- **Schriften lädt die App:** `brush` braucht `@fontsource/caveat` (`400.css`), `tape` `@fontsource/kalam` (`700.css`), `watercolor` eine Display-Serif über das Tailwind-Token `--font-display` (im Repo Cormorant Garamond, `400-italic.css`). Fehlt eine Schrift, greift der Fallback (`cursive` bzw. die Grundschrift).
- **Lange Zeilen bei `tape`:** Streifen brechen nicht um (`white-space: nowrap`). Zeilen also kurz halten, wie auf echtem Klebeband.
- **Astro ohne Hydration:** Alle Varianten starten unsichtbar und blenden erst per JS ein. In einer Astro-Insel daher `client:visible` setzen.
- **A11y:** Nicht interaktiv. Pinsel-SVG und Aquarell-Fläche sind `aria-hidden`, der Text bleibt normaler Text. Die Farbe trägt keine Information.

## Dependencies

- `motion` (`motion/react`) für die Einblendungen.
- `cn()` aus `@components/lib/utils`, Tinte, Kraft-Ton und `hashSeed` aus `@components/lib/scrapbook`.
- In der konsumierenden App: `@fontsource/caveat`, `@fontsource/kalam` (700), eine Display-Serif als `--font-display`.
