# PolaroidFrame

Foto im klassischen Polaroid-Rahmen: schmaler Rand oben und seitlich, breiter Fuß für eine handschriftliche Caption, leicht gedreht, optional mit Washi-Tape. Zweite Komponente aus dem Scrapbook-Set ([SCRAPBOOK-TEXTBOXES.md](../../SCRAPBOOK-TEXTBOXES.md)), passt direkt neben [`PaperNote`](../paper-note/COMPONENT.md). Gedacht für persönliche Momente in Event- und Story-Sections: Riedenwanderung, Verkostung, Lese.

## Features

- Quadratisches Foto (`object-cover`) im Fotokarton-Rahmen mit feinem Korn und Innenkante, damit das Bild wie ein Abzug wirkt.
- Breiter Fuß mit Caption in Handschrift **Caveat**. Ohne Caption bleibt der Fuß leer, das Polaroid-Format bleibt erhalten.
- Olivgrünes Washi-Tape (dasselbe wie bei `PaperNote` `torn`) mittig oben über `tape`.
- Fällt beim Scrollen ins Bild (einmalig) und richtet sich beim Hover gerade, wie in die Hand genommen.
- Während das Bild lädt, hält eine ruhige Fläche das Quadrat. Das Layout springt nicht. Lädt das Bild nicht (`onError`), bleibt das Polaroid „unentwickelt“: dunkle, warme Fläche mit Bild-Symbol und dem Alt-Text klein in Sans. Der Platzhalter trägt den Alt-Text als `role="img"`-Namen, bei leerem Alt ist er `aria-hidden`. Ein neues `src` setzt den Fallback zurück.
- Texturen per Inline-SVG und CSS (kein Bild-Asset), SSR-tauglich.

## How It Works

1. **Fixe Farben statt Theme-Tokens.** Rahmen und Tinte bleiben beim Dark/Light- und Akzent-Wechsel gleich, das Polaroid ist ein physisches Objekt (Entscheidung #2 in SCRAPBOOK-TEXTBOXES.md). Tinte, Washi-Tape und Papierkorn teilt sich die Komponente mit `PaperNote` über [`components/lib/scrapbook.ts`](../lib/scrapbook.ts). Der Rahmen selbst ist eine Spur weißer als das Creme-Papier, weil Polaroids Fotokarton sind.
2. **Animation über Variants** (`motion/react`): `hidden` → `shown` startet per `useInView` (einmalig, 40 % sichtbar) mit Spring `stiffness 150 / damping 20`. `lift` beim Hover nutzt die kurze Spring `300 / 30` und dreht auf 0°.
3. **Untransformierter Wrapper:** Der äußere `div` trägt `className`/`style`, misst die Sichtbarkeit und nimmt den Hover entgegen. Gedreht wird nur die innere `<figure>`, die die Variants erbt. Läge der Hover auf dem gedrehten Element, würden sich die Ecken beim Geraderichten unter dem Zeiger wegbewegen und der Hover flackern.
4. **Hover nur mit feinem Zeiger** über `useDeviceCapabilities().hasFinePointer`, wie überall im Projekt.
5. **Reduced Motion:** `prefersReducedMotion` aus `useDeviceCapabilities()` schaltet Einfallen und Hover komplett ab. Das Polaroid steht dann sofort in seiner Drehung.
6. **Semantik:** `<figure>` mit `<figcaption>`. Ohne Caption gibt es kein leeres `figcaption`, sondern einen `aria-hidden`-Platzhalter für den Fuß. Die Caption steckt in einem inneren `<span>`, damit eine Caption mit Markup (`<em>` o. Ä.) als ein Textfluss umbricht.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | required | Bild-URL. |
| `alt` | `string` | required | Alt-Text. Leer (`''`) nur bei rein dekorativem Foto. |
| `caption` | `ReactNode` | — | Text auf dem Rahmenfuß. Ohne Angabe bleibt der Fuß leer. |
| `rotate` | `number` (Grad) | `1.5` | Drehung. |
| `tape` | `boolean` | `false` | Washi-Tape mittig oben. |
| `className` | `string` | — | Klassen am Wrapper. Breite (`w-*`, Default `w-64`) und Caption-Größe (`text-*`, Default `1.55rem`) lassen sich hier überschreiben. |
| `style` | `CSSProperties` | — | Inline-Styles am Wrapper, z. B. `fontFamily` für eine andere Handschrift. |

## Usage

### Golden Path: Event-Foto mit Caption und Tape

```tsx
import { PolaroidFrame } from '@components/polaroid-frame/polaroid-frame'

<PolaroidFrame
  src="/img/riedenwanderung.jpg"
  alt="Reihen von Weinstöcken im Abendlicht"
  caption="Riedenwanderung im Oktober"
  rotate={-3}
  tape
/>
```

### Ohne Caption, breiter

```tsx
<PolaroidFrame src="/img/keller.jpg" alt="Gewölbekeller mit Holzfässern" rotate={-1} className="w-80" />
```

### Mit PaperNote kombiniert

```tsx
<div className="flex flex-wrap items-start gap-16">
  <PolaroidFrame src="/img/verkostung.jpg" alt="Zwei Weingläser beim Anstoßen" caption="Anstoßen im Gewölbe" tape />
  <PaperNote paper="kraft" rotate={3} arrow="left">Samstag, 16 Uhr am Hoftor</PaperNote>
</div>
```

## Hinweise

- **Schrift lädt die App**, nicht die Komponente: `@fontsource/caveat` (`400.css`) in der `styles.css`, wie bei `PaperNote`. Bewusst kein Google-Fonts-CDN (DSGVO). Fehlt die Schrift, fällt die Caption auf `cursive` zurück.
- **Astro ohne Hydration:** Das Polaroid startet unsichtbar und blendet erst per JS ein. In einer Astro-Insel daher `client:visible` setzen.
- **Platz fürs Tape:** Das Tape ragt ca. 12 px über die Oberkante. Im Layout etwas Abstand nach oben lassen.
- **A11y:** Tape, Innenkante und Schatten sind `aria-hidden`. Das Polaroid ist nicht interaktiv, der Hover ist reine Deko. Information steckt nie allein in Drehung oder Deko.

## Dependencies

- `motion` (`motion/react`) für Einfallen und Hover.
- `lucide-react` (`ImageOff`) für den Fallback bei fehlendem Bild.
- `cn()` aus `@components/lib/utils`, `useDeviceCapabilities` aus `@components/lib/use-device-capabilities`, Farben und Texturen aus `@components/lib/scrapbook`.
- In der konsumierenden App: `@fontsource/caveat`.
