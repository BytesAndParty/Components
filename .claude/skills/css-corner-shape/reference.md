> Generiert aus der live-docs-collection (skills/live-docs-collection/css-corner-shape/css-corner-shape.md) am 2026-10-06. Master-Quelle ist dort gepflegt (`/live-docs-update`) — bei Zweifel an der Aktualität zuerst dort nachsehen und diese Datei danach neu generieren, nicht von Hand nachziehen.

# `corner-shape` — Form der Ecken jenseits von `border-radius`

> **Neu gegengeprüft 2026-10-05:** **Firefox steht laut MDN-Browser-Compat-Data jetzt ebenfalls auf
> `version_added: "preview"`** (vorher `false`). Damit hat neben Chrome/Edge (stable seit 139) auch jede andere
> Engine einen Preview-Build; Release-Support gibt es weiterhin nur in Chromium. Die Progressive-Enhancement-
> Pflicht unten bleibt, aber „Firefox ohne Support" stimmt nicht mehr — was „preview" bei Firefox konkret heißt
> (Nightly vs. Flag), nennt die BCD-Datei nicht.
>
> **Gegengeprüft 2026-09-15:** Safari steht laut MDN-Browser-Compat-Data jetzt auf
> `version_added: "preview"` — also in der **Safari Technology Preview**, noch nicht im
> Release-Safari. Fortschritt gegenüber Mai 2026 (damals kein Safari-Signal), aber noch kein
> Grund, die Progressive-Enhancement-Pflicht unten aufzugeben. Firefox weiterhin `false`. Chrome
> unverändert seit 139 (aktuelle Stable-Linie: 154).

Modifiziert die *Form* der Rundung, die `border-radius` definiert. Ohne aktiven `border-radius` (>0) hat `corner-shape` keinen Effekt.

Borders, Outlines, Shadows und Backgrounds folgen automatisch der neuen Form — das ist der Hauptvorteil gegenüber `clip-path`.

## Werte

| Keyword       | Beschreibung                                        | Superellipse-Äquivalent |
| ------------- | --------------------------------------------------- | ----------------------- |
| `round`       | Default. Klassische Kreis-/Ellipsenrundung.         | `superellipse(1)`       |
| `squircle`    | Apple-Style, weicher Übergang zwischen Kreis/Quadrat | `superellipse(2)`        |
| `bevel`       | Diagonal abgeschnitten                              | `superellipse(0)`       |
| `scoop`       | **Konkav** (eingebuchtet), normale Ellipse          | `superellipse(-1)`      |
| `notch`       | **90° konkave** Ecke (rechtwinklig eingeschnitten)  | `superellipse(-infinity)` |
| `square`      | Keine Rundung                                       | `superellipse(infinity)` |
| `superellipse(<n>)` | Frei steuerbar. Negative `n` = konkav.        | —                       |

## Syntax

```css
/* Alle Ecken gleich */
corner-shape: squircle;

/* TL TR BR BL (wie border-radius) */
corner-shape: scoop round bevel squircle;

/* Mit border-radius zusammen */
.card {
  border-radius: 1.5rem;
  corner-shape: squircle;
}

/* Per-Corner Longhands existieren */
corner-top-left-shape: scoop;
corner-top-right-shape: scoop;
```

## Progressive Enhancement (Pflicht in Production)

```css
.card {
  border-radius: 16px; /* Fallback überall */
}
@supports (corner-shape: squircle) {
  .card {
    border-radius: 20px;     /* meist mehr Radius nötig, da squircle weicher wirkt */
    corner-shape: squircle;
  }
}
```

## Praktische Patterns

```css
/* "Apple-Card" */
.card-premium {
  border-radius: 1.5rem;
  corner-shape: squircle;
}

/* Slanted bottom (Hero-Section) */
.hero {
  corner-shape: bevel;
  border-bottom-right-radius: 100% 50px;
}

/* Konkaver Tooltip-Anschluss oben */
.tooltip {
  corner-shape: scoop;
  border-top-left-radius: 100% 50%;
}

/* Sale-Tag (asymmetrisch) */
.sale-tag {
  corner-shape: round bevel bevel round;
  border-radius: 16px 48px 48px 16px / 16px 50% 50% 16px;
}

/* Ticket-Stub */
.ticket {
  corner-shape: notch;
  border-top-left-radius: 30px 50%;
}
```

## Wann `corner-shape` vs. Alternativen

- **`corner-shape`**: nur Eckenmodifikation, Box bleibt rechteckig im Layout. Border/Shadow folgen automatisch.
- **`border-shape`**: komplette Box-Geometrie (siehe separate Doc). Erlaubt Sterne, Mid-Edge-Cutouts, Pfade.
- **`clip-path`**: überall verfügbar, aber Shadow/Outline folgen *nicht* — sie zeigen das Originalrechteck.
- **`mask-image`**: Cutouts mit `radial-gradient`, Shadow via `filter: drop-shadow()` möglich.

## Animation

`corner-shape` ist nicht direkt animierbar zwischen Keywords, aber `border-radius` selbst animiert weiter wie gewohnt — und der Effekt skaliert mit. Für Übergänge zwischen Shapes: `superellipse(<n>)` interpolieren via custom property + `@property`.

```css
@property --ss {
  syntax: "<number>";
  initial-value: 1;
  inherits: false;
}
.card {
  --ss: 2;
  corner-shape: superellipse(var(--ss));
  transition: --ss 300ms ease;
}
.card:hover { --ss: -1; } /* squircle → scoop on hover */
```
