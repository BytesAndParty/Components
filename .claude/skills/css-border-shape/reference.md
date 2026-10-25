> Generiert aus der live-docs-collection (skills/live-docs-collection/css-border-shape/css-border-shape.md) am 2026-10-06. Master-Quelle ist dort gepflegt (`/live-docs-update`) — bei Zweifel an der Aktualität zuerst dort nachsehen und diese Datei danach neu generieren, nicht von Hand nachziehen.

# `border-shape` — Echte non-rechteckige Boxen

> **Aus experimentell wird nutzbar (gegengeprüft 2026-09-15):** `border-shape` steckte zuletzt
> (Mai 2026) noch hinter einem Chrome-Canary-Flag. Seit **Chrome 147 (April 2026)** ist es in
> **stable** gelandet — kein `chrome://flags`-Toggle mehr nötig, aktuelle Chrome-Stable-Linie ist
> bereits bei 154. Firefox/Safari haben laut MDN-Browser-Compat-Data weiterhin `version_added: false`
> — die Progressive-Enhancement-Strategie unten bleibt also nötig, aber der Chrome-Zweig läuft jetzt
> ungeflaggt in echtem Traffic, nicht nur im eigenen Canary-Test.

Der Game-Changer: redefiniert **die gesamte Box-Geometrie**, nicht nur Ecken. Anders als `clip-path` (das nur visuell maskiert) folgen mit `border-shape`:

- der **Background**
- der **Border** selbst (incl. `border-image`)
- die **Outline** (Focus-Ring!)
- die **Box-Shadow**
- das **Hit-Testing** für Pointer-Events

…alle der neuen Form.

## Akzeptierte Werte

```css
/* Basic Shapes */
border-shape: circle();
border-shape: ellipse();
border-shape: inset(10px);
border-shape: polygon(0 0, 100% 0, 100% 100%, 0 100%);

/* shape() — moderne Path-Syntax */
border-shape: shape(
  from 0 0,
  hline to 100%,
  vline to 100%,
  arc to 0 100% of 20px,
  close
);

/* SVG-Path-String */
border-shape: path("M 10 10 L 90 10 L 90 90 L 10 90 Z");
```

## `shape()` Funktion (wichtigster Constructor)

Kommandos: `from`, `line to`, `hline`, `vline`, `curve` (Bezier), `arc`, `close`. Koordinaten in `%` oder Längeneinheiten.

```css
/* Stern */
border-shape: shape(
  from 50% 0%,
  line to 61% 35%,
  line to 98% 35%,
  line to 68% 57%,
  line to 79% 91%,
  line to 50% 70%,
  line to 21% 91%,
  line to 32% 57%,
  line to 2% 35%,
  line to 39% 35%,
  close
);

/* Card mit Mid-Edge-Cutout (z.B. für Avatar-Slot) */
border-shape: shape(
  from 0 0,
  hline to 40%,
  arc to 60% 0 of 30px ccw,
  hline to 100%,
  vline to 100%,
  hline to 0,
  close
);
```

## Unterschied zu `corner-shape`

| Property        | Was es macht                              | Anwendungsfall                       |
| --------------- | ----------------------------------------- | ------------------------------------ |
| `corner-shape`  | nur die Eckenform (mit `border-radius`)   | Squircle-Card, scoop-Ecken           |
| `border-shape`  | komplette Box-Outline neu definieren      | Stern, Tooltip mit Pfeil, Scallop    |

## Unterschied zu `clip-path`

| Aspekt          | `clip-path`                               | `border-shape`                       |
| --------------- | ----------------------------------------- | ------------------------------------ |
| Background      | folgt der Form                            | folgt der Form                       |
| Border          | wird *abgeschnitten*                      | folgt der Form (echter Border)       |
| Box-Shadow      | folgt **nicht** (Original-Rechteck)       | folgt der Form                       |
| Outline (Focus) | folgt **nicht**                           | folgt der Form (a11y!)               |
| Hit-Testing     | clipped Bereich nimmt trotzdem Events     | nur die Form ist klickbar            |

## Production-Strategie (Stand 2026-09-15)

`border-shape` läuft **ungeflaggt in Chrome/Edge ≥ 147**, aber Firefox/Safari fehlen noch. Weiter
mit `@supports`-Fallback arbeiten, bis beide nachziehen — der einzige Unterschied zu Mai 2026 ist,
dass der Chrome-Zweig jetzt echten Nutzern zugutekommt statt nur im eigenen Canary-Test sichtbar zu sein:

```css
.shape {
  /* Fallback: clip-path mit gleicher Geometrie */
  clip-path: polygon(0 0, 100% 0, 100% 80%, 60% 100%, 0 100%);
}

@supports (border-shape: shape(from 0 0, close)) {
  .shape {
    clip-path: none;
    border-shape: shape(from 0 0, hline to 100%, vline to 80%,
                         line to 60% 100%, hline to 0, close);
  }
}
```

## Use-Cases, die *nur* mit `border-shape` sauber gehen

- Tooltip mit Pfeil — Border und Shadow durchgängig
- Star-Rating-Buttons mit korrektem Focus-Outline
- Scallop/Wave-Edges für Sektionen mit echtem Drop-Shadow
- Coupon/Ticket-Shapes mit umlaufendem Border

## Kombi mit `corner-shape`

Beide Properties sind orthogonal kombinierbar — `corner-shape` greift auf alle Ecken, die durch die `border-shape`-Geometrie *als Ecken erkannt* werden (Polygon-Vertices mit `border-radius`).
