> Generiert aus der live-docs-collection (skills/live-docs-collection/fontsource/fontsource.md) am 2026-10-23. Master-Quelle ist dort gepflegt (`/live-docs-update`) — bei Zweifel an der Aktualität zuerst dort nachsehen und diese Datei danach neu generieren, nicht von Hand nachziehen.

# `@fontsource/*`

Self-hosted Google-Fonts-Distribution als npm-Pakete — kein `<link>` zu `fonts.googleapis.com`,
kein CSP-Loch, kein externer Request. Ein Paket pro Font-Familie.

## Naming Convention

Zwei Paket-Typen:

| Typ | Paket | Wann |
|---|---|---|
| Statisch | `@fontsource/<font-name>` | Standard — feste Gewichte als separate CSS-Dateien |
| Variable | `@fontsource-variable/<font-name>` | Bei vielen benötigten Gewichten — ein File deckt den ganzen `wght`-Range ab, kleiner im Bundle als 4+ statische Imports |

## Installation & Import

```bash
bun add @fontsource/dm-serif-display
```

Import **pro benötigtem Schnitt**, nicht pauschal die ganze Familie — jeder Import lädt genau eine `.woff2`:

```css
@import "@fontsource/dm-serif-display/400.css";
@import "@fontsource/dm-serif-display/400-italic.css";
```

- Default-Import (`import "@fontsource/open-sans"` bzw. `@import "@fontsource/open-sans/index.css"`) lädt **nur Gewicht 400**.
- Italic ist ein **eigener Import** — `/400-italic.css` lädt nicht automatisch mit, wenn nur `/400.css` importiert wird.
- „Alle Gewichte importieren" ist von Fontsource selbst **nicht empfohlen**, außer bei explizitem Bedarf (Bundle-Aufblähung).
- Funktioniert sowohl als CSS-`@import` (in einer bestehenden Stylesheet-Kette, von Vite aufgelöst) als auch als JS-`import` in einer Entry-Datei — beides lädt dieselben generierten CSS-Files.

Nach dem Import ist der Font-Name direkt in `font-family` nutzbar — kein `@font-face` von Hand nötig, das Paket bringt es mit.

## Variable Fonts (`@fontsource-variable`)

```bash
bun add @fontsource-variable/inter
```

```css
@import "@fontsource-variable/inter/standard.css"; /* wght 200–1000 in einer Datei */
```

```css
.el {
  font-family: "Inter Variable", sans-serif;
  font-variation-settings: "wght" 550;
}
```

- Basis-Import deckt den vollen Standard-Achsen-Range ab (`wght`, teils `wdth`/`slnt`/`opsz`/`ital`) — gezielt einzelne Achsen oder `full.css` für alle (inkl. Font-spezifischer Custom-Achsen) importierbar.
- Fallback für Browser ohne Support: `@supports (font-variation-settings: normal) { … }`.
- **Trade-off gegen dieses Projekt:** Für Genussgut/Gastgeber wurden hier bewusst **statische** Pakete mit 2–3 festen Gewichten gewählt (300/400/500 bzw. 400/500/600), weil pro Familie nur eine Handvoll Schnitte gebraucht wird — die Variable-Variante lohnt sich erst ab ca. 4+ genutzten Gewichten derselben Familie. Bei künftigen Familien mit breiterem Gewichtsbedarf `@fontsource-variable` statt vieler einzelner `.css`-Imports prüfen.

## In diesem Projekt genutzt (`section-showcase`)

Alle sieben als statische Pakete, importiert in `section-showcase/src/styles.css`:

| Paket | Gewichte importiert | Rolle |
|---|---|---|
| `cormorant-garamond` | 300, 400, 500 (+ italic) | Globaler Default-Display-Font (`--font-display-base`) |
| `fraunces` | 300, 400, 500 (+ italic) | Genussgut-Display (Kicker) |
| `archivo` | 300, 400, 500 | Genussgut-Sans (Headline/Body) |
| `dm-serif-display` | 400 (+ italic) | Schwarzweiß-Display — Font hat ohnehin nur einen Schnitt |
| `pt-sans` | 400, 700 | Schwarzweiß-Sans — Font hat nur Regular/Bold, kein 500/600 |
| `lora` | 400, 500, 600 | Gastgeber-Display |
| `inter` | 400, 500, 600 | Gastgeber-Sans |

## Gotchas

- **Weight-Auswahl vorab grep'en.** Vor dem Import per `grep -o "font-\(light\|medium\|semibold\|…\)"` durch die Ziel-Komponenten gehen — nur die tatsächlich genutzten Gewichte importieren, sonst lädt man z. B. 900 „für alle Fälle" ungenutzt mit.
- **Nicht jede Familie hat jedes Gewicht.** `pt-sans` und `dm-serif-display` haben z. B. keine 500/600-Datei — Tailwind-Klassen wie `font-semibold` fallen dann auf synthetisches Fake-Bold des Browsers zurück. Das ist für einen Font mit nur einem "echten" Schnitt (wie DM Serif Display, ein reiner Display-Font) normales, akzeptables Verhalten — kein Bug.
- **Tailwind v4 `@theme inline` Falle** (nicht Fontsource-spezifisch, aber hier drauf gestoßen): Ein Theme-Token wie `--font-display: "Cormorant Garamond", …;` wird bei `@theme inline` **literal** in die kompilierte Utility-Klasse gebacken (`.font-display { font-family: "Cormorant Garamond", …; }`), *kein* `var()` im Output — außer der Theme-Wert ist selbst schon eine `var()`-Referenz. Für scope-überschreibbare Fonts (z. B. pro Design-Familie) daher über eine zusätzliche `--font-*-base`-Variable in `:root` indirizieren, siehe das Gotcha in [tailwindcss](../tailwindcss/tailwindcss.md) und `__Components__/section-showcase/src/sections/family-fonts.ts`.
