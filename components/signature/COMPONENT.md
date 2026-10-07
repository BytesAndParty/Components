# Signature

Handschriftliche Unterschrift, die sich beim Einscrollen Federzug für Federzug selbst zeichnet. Sechste Komponente aus dem Scrapbook-Set ([SCRAPBOOK-TEXTBOXES.md](../../SCRAPBOOK-TEXTBOXES.md), Runde 2). Die drei Strich-Varianten sind die Werkbank-Entwürfe B (Breitfeder, Default), A (Füllfeder) und C (Filzstift). Gedacht für Einladungen, Briefe und Notizen vom Weingut: Der Text wirkt persönlich, und es ist klar, wer dahintersteht.

## Features

- **`nib`** (Default): Breitfeder mit Haar- und Schattenstrichen, ruhiges Tempo.
- **`pen`**: Füllfeder, gleichmäßig feiner Strich in Schreibtempo.
- **`felt`**: Filzstift, kräftiger Strich mit leicht rauem Rand, zügig geschrieben.
- Zeichnet in Schreibreihenfolge, mit kurzer Pause zwischen den Federzügen (z. B. Namenszug, i-Punkt, Schwung).
- Tinte ist `currentColor`: auf der Seite folgt sie dem Theme, auf Papier übernimmt sie die Papiertinte oder eine eigene Farbe per `style`.
- Strichstärke skaliert mit der viewBox, die Unterschrift wirkt bei jeder Größe und in allen Einheiten gleich.
- Rein SVG, keine Schrift und kein Bild-Asset. Respektiert `prefers-reduced-motion`.

## How It Works

1. **Strich-Animation über `pathLength`.** Jeder Federzug ist ein `motion.path`, der von `pathLength: 0` auf `1` läuft, sobald 60 % der Unterschrift sichtbar sind (`useInView`, einmalig). Die Startzeit eines Zuges ist die Summe aller vorigen Dauern plus je 0,15 s zum Absetzen. `nib` streckt alle Zeiten um den Faktor 1,35, `felt` staucht sie auf 0,7.
2. **Deckkraft springt erst beim Ansetzen.** Runde Strichenden würden bei `pathLength: 0` schon einen Punkt zeigen. Deshalb ist jeder Zug bis zu seinem Start unsichtbar. Delays stehen je Property, nicht auf dem Top-Level der Transition (COMPONENT-GUIDELINES §5).
3. **Breitfeder ohne Umriss-Berechnung.** `nib` zeichnet jeden Pfad sieben Mal, jeweils ein Stück entlang des Federwinkels (~40°) versetzt. Läuft der Strich quer zur Feder, liegen die Kopien nebeneinander und ergeben den Schattenstrich, parallel zur Feder fallen sie zum Haarstrich zusammen. Alle Kopien laufen synchron.
4. **Filzstift per SVG-Filter.** `felt` legt `feTurbulence` und `feDisplacementMap` über den Strich, das raut den Rand minimal auf. Die Filter-ID kommt aus `useId()`, damit mehrere Instanzen sich nicht stören.
5. **Skalierung über die viewBox.** Strichstärke, Federversatz und Filter-Werte sind für eine 254 Einheiten breite viewBox abgestimmt und werden mit `viewBox-Breite / 254` multipliziert. Eine in Inkscape nachgezogene Unterschrift mit 1000 Einheiten Breite bekommt so denselben Strich wie der Platzhalter.
6. **Reduced Motion:** `useReducedMotion()` gilt als „schon sichtbar“. Mit `initial={false}` steht die Unterschrift dann sofort fertig da.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `strokes` | `SignatureStroke[]` | required | Federzüge in Schreibreihenfolge. Je Zug `d` (SVG-Pfad) und `duration` (Sekunden, bezogen auf `pen`). |
| `viewBox` | `string` | required | viewBox der Pfade, z. B. `'0 0 254 112'`. |
| `variant` | `'nib' \| 'pen' \| 'felt'` | `'nib'` | Breitfeder, Füllfeder oder Filzstift. |
| `label` | `string` | — | Zugänglicher Name, z. B. `"Unterschrift: Simon Buchart"`. Ohne Wert ist die Unterschrift Deko (`aria-hidden`). |
| `className` | `string` | — | Klassen am Wrapper. Breite per `w-*` (Default `w-60`), Tintenfarbe per `text-*`. |
| `style` | `CSSProperties` | — | Inline-Styles am Wrapper, z. B. `{ color: 'oklch(0.36 0.1 15)' }` für Bordeaux auf Papier. |

## Usage

### Daten einmal definieren

Die Unterschrift liegt als Pfad-Daten vor, nicht als Bild. Ein Federzug ist alles, was ohne Absetzen geschrieben wird. Die Dauern bestimmen das Schreibtempo: lange Züge länger, i-Punkte kurz.

```tsx
import type { SignatureStroke } from '@components/signature/signature'

export const SIGNATURE_SIMON: { viewBox: string; strokes: SignatureStroke[] } = {
  viewBox: '4 4 254 104',
  strokes: [
    { d: 'M 105 20 C 97 4, 56 8, 50.5 30 …', duration: 1.7 }, // Namenszug
    { d: 'M 89.3 47 L 93.8 45', duration: 0.1 },               // i-Punkt
    { d: 'M 20.1 104 C 70.1 96, …', duration: 0.5 },           // Schwung
  ],
}
```

Der Platzhalter „Simon“ steht vollständig in `components-showcase/src/data.ts`.

### Golden Path: auf der Seite

```tsx
import { Signature } from '@components/signature/signature'

<Signature {...SIGNATURE_SIMON} label="Unterschrift: Simon Buchart" className="text-foreground" />
```

### Auf Papier

In einer `PaperNote` erbt die Unterschrift die Papiertinte. Eine eigene Farbe kommt per `style`:

```tsx
<PaperNote variant="notepad" paper="cream">
  Danke fürs Mithelfen bei der Lese!
  <Signature {...SIGNATURE_SIMON} label="Unterschrift: Simon" className="mt-4 w-40" style={{ color: 'oklch(0.36 0.1 15)' }} />
</PaperNote>

<PaperNote paper="kraft">
  Kellerführung am Samstag, 16 Uhr.
  <Signature {...SIGNATURE_SIMON} variant="felt" label="Unterschrift: Simon" className="mt-3 w-36" />
</PaperNote>
```

### Briefschluss mit Namen in Klartext

Steht der Name ohnehin als Text daneben, bleibt die Unterschrift ohne `label` und damit Deko:

```tsx
<div className="text-foreground">
  <p className="font-display text-2xl italic">Herzlich,</p>
  <Signature {...SIGNATURE_SIMON} variant="pen" className="mt-1 w-52" />
  <div className="border-border mt-2 border-t pt-2.5">
    <p className="text-[0.68rem] font-medium tracking-[0.22em] uppercase">Simon Buchart</p>
    <p className="text-muted-foreground mt-1 text-xs">Winzer · Weingut Buchart</p>
  </div>
</div>
```

## Hinweise

- **Echte Unterschrift als Pfad:** Eine Handschrift-Font lässt sich nicht glaubwürdig nachzeichnen, die Pfade müssen der Mittellinie des Strichs folgen. Am einfachsten auf dem Tablet als Vektor schreiben oder einen Scan in Inkscape mit dem Bézier-Werkzeug nachziehen, je Federzug ein Pfad, Kontur statt Füllung. Schräglage und Transforms vorher in die Koordinaten übernehmen.
- **Leser ohne JS:** Die Unterschrift startet unsichtbar und zeichnet sich erst per JS. In einer Astro-Insel daher `client:visible` setzen.
- **Aufwand:** `nib` rendert sieben Pfade je Federzug, bei drei Zügen also 21. Für eine Unterschrift pro Ansicht unkritisch, für lange Listen `pen` nehmen.
- **A11y:** Mit `label` ist das SVG `role="img"` mit `aria-label`, ohne `label` `aria-hidden`. Nicht interaktiv, kein Fokus-Stop.

## Dependencies

- `motion` (`motion/react`) für die Strich-Animation und `useInView`.
- `cn()` aus `@components/lib/utils`.
