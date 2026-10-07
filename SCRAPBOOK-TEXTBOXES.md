# Scrapbook Textboxes — Kreative Papier-Text-Elemente

> Vier eigenständige Komponenten für "Scrapbook"-artige Textboxen (Kraftpapier-Notiz, Polaroid-Rahmen,
> Marker-Highlight-Callout, Prozess-Schritte) — inspiriert von einem Social-Media-Einladungsgrafik-Stil
> (Washi-Tape, Rissrand, Handschrift-Font). Projektunabhängige, wiederverwendbare Primitives für dieses
> Repo — kein Bezug zu einem konkreten Produkt (Auslöser war eine BuchArt58-Session, die Komponenten
> selbst sind aber generisch für jedes Projekt nutzbar, das den "Scrapbook"-Look braucht).

Status Runde 1: **4 von 4 umgesetzt** — Paper-Note, Polaroid-Frame, Process-Steps und Marker-Callout sind fertig, jeweils mit eigener `COMPONENT.md` unter `components/<name>/`. Die Werkbänke sind entfernt.
Status Runde 2: **2 von 4 umgesetzt** — Hang-Tag und Unterschrift sind fertig. Stempel und Handschrift-Markierungen im Highlighter: Werkbänke offen (siehe [Runde 2](#runde-2)).
**Offen:** Die Unterschrift zeichnet noch einen Platzhalter-Pfad. Simons echte Unterschrift fehlt als SVG-Pfad (je Federzug ein Pfad, Anleitung in [`components/signature/COMPONENT.md`](./components/signature/COMPONENT.md) unter „Hinweise“), danach `SIGNATURE_SIMON` in `components-showcase/src/data.ts` ersetzen.
Dieses Dokument ist der Tracking-Ort für Fortschritt, bis jede Komponente ihr eigenes `COMPONENT.md` bekommt (siehe [COMPONENT-GUIDELINES.md](./COMPONENT-GUIDELINES.md)).

**Vorgehen pro Komponente (seit Paper-Note):** Statt direkt nach dem Props-Entwurf zu bauen, entstehen zuerst
~4 bewusst verschiedene Entwürfe auf einer temporären Werkbank-Seite im components-showcase. Daran wird
iteriert, bis einer (oder eine Kombination) passt — erst dann wandert er nach `components/`.

---

## Entscheidungen

| # | Frage | Entscheidung |
|---|---|---|
| 1 | Welche Elemente? | 4 Komponenten: **Paper-Note**, **Polaroid-Frame**, **Marker-Callout**, **Process-Steps** (siehe unten). |
| 2 | Wie nah am Bild-Vorbild? | **Skeuomorph, wie im Bild.** Eigenes, festes Papier-Farbschema (Kraftpapier-Tan, Creme-Weiß, Chalkboard-Dunkel, Tape-Oliv) — **läuft nicht über die oklch-Theme-Engine** (kein `bg-card`/Dark-Light-Accent-Switch). Der Papier-Look soll themenunabhängig wirken, wie ein physisches Objekt auf der Seite. |
| 3 | Umfang/Vorgehen | Alle 4 jetzt, aber strategisch: **erst dieser Plan**, Review durch User, **dann** Implementierung eine nach der anderen (Reihenfolge siehe Progress-Tabelle unten). Jede Komponente durchläuft vollständig: `.tsx` → `messages.ts` (falls UI-Strings) → `COMPONENT.md` → Showcase-Eintrag → Quality-Gate (§11 COMPONENT-GUIDELINES.md), bevor die nächste startet. |
| 4 | Handschrift-Font | **Entschieden (Werkbank-Review):** zwei Handschriften statt einer. **Caveat** (lockerer Pinselstift) für gerissenes Papier, **Kalam** (Kugelschreiber-Druckschrift) für den Notizblock-Look. Strukturierte Labels (Step-Beschriftungen, "TERMIN ZUR AUSWAHL"-artige Über­schriften) bleiben im normalen UI-Sans. |
| 5 | Font-Ladung | **Geändert:** Die Schriften lädt die konsumierende App self-hosted über `@fontsource/caveat` + `@fontsource/kalam` in ihrer `styles.css`, genau wie alle anderen Schriften im Repo (section-showcase). ~~Google-Font-Injection per JS + `injectScrapbookFonts()`~~ verworfen: Google-Fonts-CDN überträgt die IP der Besucher an Google (DSGVO-Risiko für einen österreichischen Shop), und das Repo hostet Schriften bereits selbst. Fehlt die Schrift, fällt die Komponente auf `cursive` zurück. |
| 6 | Texturen (Papierkorn, Rissrand, Pinselstrich) | **Kein Bildasset.** Alles per Inline-SVG (`feTurbulence` für Papierkorn, gezackter `clipPath`/Polygon-Pfad für Rissrand, handgezeichneter `<path>` für Pinselstrich-Blob). Hält Komponenten self-contained und SSR-safe, keine Asset-Pipeline nötig. |
| 7 | Naming-Kollision | `Stepper` (bestehend) ist eine interaktive Multi-Step-Wizard-Komponente (Formular-Navigation) — komplett anderer Zweck als `ProcessSteps` (statischer, nicht-interaktiver Erklär-Flow). Keine Überschneidung, eigener Name gewählt. |
| 8 | Runde 2: welche Elemente? | **Entschieden 2026-10-07:** **Hang-Tag** (Flaschenanhänger), **Unterschrift**, **Stempel** (für den aktuellen Jahrgang, es gibt keinen Heurigen) und **Handschrift-Markierungen** als neue `action`s im bestehenden `Highlighter`. Gleiches Vorgehen wie Runde 1: erst Werkbank mit ~4 Entwürfen, User wählt, dann Umsetzung. |
| 9 | Runde 2: verworfen | Heurigen-Tafel (kein Heuriger), Umschlag zum Öffnen, Fotostreifen, Klebeband-Hülle für beliebige Elemente. |
| 10 | Runde 2: offen | **Ticket/Eintrittskarte** (Perforation, Abriss mit Datum und Preis, statt Eckdaten auf Kreppband in `EventsEinladung`) und **Collage-Layout** (Container für überlappende Papier-Elemente, statt fester Offsets wie `sm:-mt-48 sm:ml-64`). Vorgeschlagen, noch nicht entschieden. |
| 11 | Runde 2: Unterschrift und Stempel | **Entschieden 2026-10-07:** beide werden **eigene Komponenten**. Der Stempel wird keine Variante von `ProductTag`, die Unterschrift kein Teil von `HangTag`. |

---

## Komponenten

### 1. Paper-Note

**Zweck:** Rotierte Papierkarte mit Rissrand (Deckle-Edge), optional Washi-Tape-Streifen, optional
handgezeichnetem Pfeil — deckt Sticky-Note, dunkle Kraftpapier-Notiz und handschriftliche
Pfeil-Annotation als Varianten einer Komponente ab (im Bild: "Entdecke mit uns...", "Wir schenken dir...",
"Auf einen unvergesslichen...", "Mehr Männer...").

**Werkbank-Ergebnis:** Vier Entwürfe verglichen — A *Scrapbook klassisch* (rundum gerissen, Washi, Caveat),
B *Notizblock-Abriss* (oben gerissen mit Faserrand, Kreppband an den Ecken, Kalam), C *Büttenpapier*
(weicher SVG-Displacement-Rand, Serif-Kursive) und D *Collage* (Scherenschnitt, Eselsohr, Akzent-Washi,
Hover-Lift). **Gewählt: A und B, als zwei Varianten einer Komponente.** C und D verworfen.

**Props (umgesetzt):** Gegenüber dem Entwurf ist `variant` jetzt die Papier-*Art*, die Farbe wanderte nach `paper`.
| Prop | Typ | Default | Beschreibung |
|---|---|---|---|
| `children` | `ReactNode` | required | Notiz-Inhalt |
| `variant` | `'torn' \| 'notepad'` | `'torn'` | A = `torn`, B = `notepad` |
| `paper` | `'kraft' \| 'cream' \| 'dark'` | `'kraft'` | Papierfarbe (bei `notepad` bekommt `cream` Linien) |
| `rotate` | `number` (deg) | `-2` / `1.5` | Rotationswinkel, Default je Variante |
| `tape` | `boolean` | `false` | Washi mittig (`torn`) bzw. Kreppband an beiden Ecken (`notepad`). `position`/`angle` aus dem Entwurf bewusst weggelassen, bis ein Consumer sie braucht. |
| `arrow` | `'up'\|'down'\|'left'\|'right'` | — | Handgezeichneter Pfeil nach außen; als String statt `{ direction }`, Farbe = Textfarbe des Wrappers |
| `seed` | `number` | aus `useId` | Rissform reproduzierbar festlegen |
| `className` / `style` | — | — | Layout-Anpassung am Wrapper |

**Visual:** Rissrand per `clip-path: polygon()` aus einem Random-Walk (statt SVG-`clipPath`), feines +
faseriges Papierkorn (`feTurbulence`), Schatten außerhalb des Clips. `torn` fällt beim Scrollen ins Bild
und zeichnet den Pfeil, `notepad` ist statisch.

**Farbpalette:** als `oklch()`-Konstanten lokal in `paper-note.tsx`. Ausgelagert nach `components/lib/`
wird erst, wenn Polaroid-Frame oder Marker-Callout dieselben Werte braucht.

**Abhängigkeiten:** `motion/react`; in der App `@fontsource/caveat` + `@fontsource/kalam`.

**Im Einsatz:** section-showcase → *Veranstaltungen → Die Pinnwand* (`sections/events/EventsPinnwand.tsx`).

**Status:** ✅ umgesetzt

---

### 2. Polaroid-Frame

**Zweck:** Foto im weißen Polaroid-Rahmen mit breiterem unteren Rand für eine Caption, leichte
Rotation (im Bild: das Kaffee-Cupping-Foto mit "Riechen. Schlürfen. Entdecken.").

**Werkbank-Ergebnis:** Vier Entwürfe verglichen — A *Klassisch* (Washi-Tape, Caveat, richtet sich beim
Hover gerade), B *Sofortbild* (Foto entwickelt sich beim Scrollen), C *Passepartout* (Maison-Stil mit
Bildsignatur und Cormorant) und D *Pinnwand* (Reißzwecke, Sepia, pendelt). **Gewählt: A.** B, C und D verworfen.

**Props (umgesetzt):**
| Prop | Typ | Default | Beschreibung |
|---|---|---|---|
| `src` | `string` | required | Bild-URL |
| `alt` | `string` | required | Alt-Text (A11y-Pflicht) |
| `caption` | `ReactNode` | — | Text auf dem Rahmenfuß (Caveat) |
| `rotate` | `number` (deg) | `1.5` | Rotationswinkel |
| `tape` | `boolean` | `false` | Washi-Tape mittig oben (wie bei Paper-Note `torn`) statt Tape-Eck |
| `className` / `style` | — | — | Layout-Anpassung, Breite per `w-*` (Default `w-64`) |

**Visual:** Fotokarton-Rahmen (dünn oben/seitlich, breiter Fuß), quadratisches Foto `object-cover` mit
Innenkante, flacher Schatten. Fällt beim Scrollen ins Bild, richtet sich beim Hover gerade (nur feiner Zeiger).
Die Sepia-/Vintage-Option ist mit Entwurf D verworfen.

**Abhängigkeiten:** `motion/react`; in der App `@fontsource/caveat`.

**Status:** ✅ umgesetzt

---

### 3. Marker-Callout

**Zweck:** Textblock auf einer unregelmäßigen Pinselstrich-/Textmarker-Fläche im Hintergrund, leicht
rotiert (im Bild: "Ein besonderes Erlebnis für alle Kaffeeliebhaber – mit euch!").

> Abgrenzung zur bestehenden [`Highlighter`](./components/highlighter/highlighter.tsx)-Komponente:
> `Highlighter` ist eine animierte Inline-Markierung (scroll-getriggert, für Wörter in Fließtext).
> `MarkerCallout` ist ein eigenständiger Block mit handgemachter Fläche hinter ganzen Sätzen.
> **Entschieden (Werkbank-Review):** Entwurf B *Textmarker* war technisch derselbe Mechanismus wie
> `Highlighter` (`background-size`-Wipe auf einem Inline-Span) und wurde deshalb **nicht** Teil von
> `MarkerCallout`, sondern als `action="marker"` in den `Highlighter` übernommen. Eine Capability, eine
> Komponente. Bei der Gelegenheit bekam `Highlighter` Reduced Motion, `color-mix` statt Hex-Alpha und
> keinen Hex-Fallback mehr.

**Werkbank-Ergebnis:** Vier Entwürfe verglichen — A *Pinselstrich*, B *Textmarker*, C *Aquarell* und
D *Kreppband-Zeilen*. **A, C und D als drei Varianten von `MarkerCallout`, B in den `Highlighter`.**

**Props (umgesetzt):**
| Prop | Typ | Default | Beschreibung |
|---|---|---|---|
| `variant` | `'brush' \| 'watercolor' \| 'tape'` | `'brush'` | A = `brush`, C = `watercolor`, D = `tape` |
| `children` | `ReactNode` | required (nicht bei `tape`) | Text-Inhalt |
| `lines` | `string[]` | required bei `tape` | Eine Zeile pro Streifen (Discriminated Union mit `children`) |
| `color` | `'kraft' \| 'sage' \| 'rose'` | `'kraft'` | Feste Mini-Palette, keine freien Farbwerte |
| `rotate` | `number` (deg) | `-1` / `-0.5` / `-1` | Rotationswinkel, Default je Variante |
| `seed` | `number` | aus `useId` | Ersetzt das geplante `variant: 1 \| 2 \| 3` für die Blob-Form: automatisch pro Instanz verschieden, reproduzierbar festlegbar |
| `className` / `style` | — | — | Layout-Anpassung |

**Visual:** `brush` = Inline-SVG-Blob (3 Formen) mit Borstenstreifen und trockenem Rand, Caveat.
`watercolor` = Farbwolke mit Pigmentrand per SVG-Displacement, Display-Serif kursiv. `tape` = Kreppband-Streifen
pro Zeile mit gerissenen Enden, Kalam fett. Alle blenden beim Scrollen ein.

**Abhängigkeiten:** `motion/react`; in der App `@fontsource/caveat`, `@fontsource/kalam` (700) und eine
Display-Serif als `--font-display`.

**Status:** ✅ umgesetzt

---

### 4. Process-Steps

**Zweck:** Horizontale (mobile: vertikale) Kette aus Icon-Kreisen mit Pfeilen dazwischen und Label
darunter (im Bild: Bohne → Nase → Tasse → Sprechblasen = "verschiedene Kaffees verkosten" → "den
Cupping-Prozess verstehen" → …).

**Werkbank-Ergebnis:** Vier Entwürfe verglichen — A *Papier-Kreise*, B *Wanderpfad*, C *Hairline-Ledger*
und D *Kreidetafel*. **Gewählt: A, B und C, als drei Varianten einer Komponente.** D verworfen.

**Props (umgesetzt):**
| Prop | Typ | Default | Beschreibung |
|---|---|---|---|
| `steps` | `{ icon: ReactNode; label: string }[]` | required | Schritt-Definitionen |
| `variant` | `'paper' \| 'trail' \| 'ledger'` | `'paper'` | A = `paper`, B = `trail`, C = `ledger` |
| `className` / `style` | — | — | Layout-Anpassung am Container |

`arrowIcon` aus dem Entwurf bewusst weggelassen, bis ein Consumer einen eigenen Pfeil braucht.

**Visual:** `paper` = Creme-Papierkreise mit Pfeilen, UI-Sans-Labels (wie im Plan). `trail` = Kraft-Stempel auf
gepunktetem Wellenpfad, Caveat-Labels. `ledger` = römische Ziffern (`font-display`) über Hairlines, Kapitälchen.
Responsive per Container-Query statt `flex-wrap`: ab 42 rem eine Spalte pro Schritt, darunter vertikaler Stack
mit 90° gedrehten Pfeilen. Die Werkbank-Fassung wechselte schon ab 640 px in die Zeile und lief bei fünf
Schritten dazwischen über.

**Abhängigkeiten:** `motion/react`; in der App `@fontsource/caveat` (`trail`) und eine Display-Serif als
`--font-display` (`ledger`, im components-showcase `@fontsource/cormorant-garamond`).

**Status:** ✅ umgesetzt

---

## Runde 2

Beschlossen am 2026-10-07 (Entscheidung #8). Reihenfolge wie in der Progress-Tabelle. Die User Stories sind aus
den Vorschlägen abgeleitet, denen der User zugestimmt hat. Korrekturen hier eintragen.

### 5. Hang-Tag (Flaschenanhänger)

**Zweck:** Kartonanhänger mit Loch und Schnur, der am Flaschenhals hängt. Trägt eine Widmung zum Geschenk oder eine
Notiz des Winzers zum Wein. Die Flasche bleibt das Hauptmotiv, der Anhänger ist das persönliche Detail daran.
Ohne Flasche auch frei auf der Seite nutzbar (Gutschein, Grußkarte).

**User Story:** Als Shop-Besucher möchte ich an der Flasche eine handgeschriebene Notiz sehen (Widmung oder
Empfehlung des Winzers), damit sich der Wein wie ein Geschenk aus der Familie anfühlt und nicht wie Lagerware.

**Abgrenzung:** `ProductTag` ist ein Status-Badge (`new`, `sale`, `award` …) mit Shimmer und Pop-in. Der Hang-Tag
trägt Fließtext in Handschrift und hängt physisch an der Flasche. Keine Überschneidung.

**Werkbank-Ergebnis:** Vier Entwürfe verglichen, jeweils an Rotwein- und Weißweinflasche plus einer frei auf der
Seite. **Gewählt: A.** B, C und D verworfen, die Werkbank ist entfernt.

| Entwurf | Material | Schrift | Schnur | Bewegung |
|---|---|---|---|---|
| A · Kraft klassisch | Kraftkarton, abgeschrägte Ecken, verstärkte Öse | Caveat | Bäckergarn Bordeaux/Creme | Pendelt beim Einblenden aus, Hover stößt ihn in Zeigerrichtung an |
| B · Bütten & Seidenband | Creme-Bütten mit weichem Rand, gestanztes Loch | Cormorant kursiv + Kapitälchen | Satinband Bordeaux | Ruhiges Einschwingen, Hover hebt ihn leicht an |
| C · Gepäckanhänger | Manila-Karton, Verstärkungsfeld, Metallöse | Vordruck in UI-Sans, Einträge in Kalam (Kugelschreiber-Blau) | Baumwollkordel | Pendelt wie A |
| D · Halskragen | Dunkler Karton mit Loch, über den Hals gestülpt, unten gerissen | Caveat | keine | Rutscht beim Einblenden den Hals hinunter |

**Entschieden bei der Umsetzung:**
- **Name `HangTag`**, weil der Anhänger auch ohne Flasche funktioniert (Gutschein, Nagel an der Wand).
- **Platzierung über einen Ankerpunkt:** Bei `variant="hanging"` ist der Wrapper selbst der Knoten (`absolute`,
  0 × 0 px). Der Consumer setzt ihn per `left`/`top` auf den Hals und gibt optional `neckWidth` für die Schlaufe mit.
  Hals-Koordinaten als Prop wären an ein bestimmtes Bildformat gebunden, der Ankerpunkt funktioniert mit jedem Bild.
- **`variant`** = Aufhängung (`hanging` | `loose`), nicht Material. Die Materialien B–D sind verworfen.

**Props (umgesetzt):**
| Prop | Typ | Default | Beschreibung |
|---|---|---|---|
| `children` | `ReactNode` | required | Text in Caveat |
| `sign` | `ReactNode` | — | Unterschrift unten rechts, Gedankenstrich automatisch |
| `variant` | `'hanging' \| 'loose'` | `'hanging'` | Am Hals hängend oder frei auf der Seite |
| `rotate` | `number` (deg) | `-8` / `-4` | Ruhewinkel (`hanging`, negativ = nach rechts) bzw. Drehung (`loose`) |
| `cordLength` | `number` (px) | `44` | Nur `hanging`: Schnur vom Knoten bis zur Öse |
| `neckWidth` | `number` (px) | — | Nur `hanging`: zeichnet die Schlaufe um den Hals |
| `className` / `style` | — | — | `hanging`: Position des Knotens, `loose`: Layout am Wrapper |

**Im Einsatz:** components-showcase → *Text → HangTag*, section-showcase → *Storefront → Das Geschenk*
(`sections/store/StoreGeschenk.tsx`).

**Status:** ✅ umgesetzt

### 6. Unterschrift

**Zweck:** Handschriftliche Unterschrift des Winzers, die sich beim Scrollen selbst zeichnet (SVG-Stroke), z. B.
unter einer Einladung oder einem Brief.

**User Story:** Als Leser einer Einladung oder eines Briefs vom Weingut möchte ich die Unterschrift des Winzers
sehen, damit der Text persönlich wirkt und klar ist, wer dahintersteht.

**Voraussetzung:** Die Unterschrift muss als echter SVG-Pfad vorliegen. Ein Schriftzug aus einer Handschrift-Font
lässt sich nicht glaubwürdig nachzeichnen. Für die Werkbank genügt ein Platzhalter-Pfad.

**Abgrenzung:** Eigene Komponente (Entscheidung #11). Das `sign`-Feld am `HangTag` bleibt Text in Caveat.

**Werkbank-Ergebnis:** Vier Entwürfe mit demselben Platzhalter-Pfad „Simon“ verglichen, jeweils direkt auf der Seite
(Tinte folgt dem Theme) und auf Papier (feste Tinte). **Gewählt: B als Default, A und C als weitere Varianten.**
D verworfen, die Werkbank ist entfernt.

| Entwurf | Strich | Tinte auf Papier | Bewegung |
|---|---|---|---|
| A · Füllfeder | gleichmäßig fein | Blauschwarz | Zeichnet sich beim Einscrollen in Schreibtempo, Namenszug, i-Punkt, Schwung |
| B · Breitfeder | Haar- und Schattenstriche (versetzte Kopien entlang des Federwinkels) | Bordeaux | Wie A, ruhiger |
| C · Filzstift | kräftig, rauer Rand (SVG-Displacement) | Graphit auf Kraft | Wie A, zügiger |
| D · Briefschluss | wie A, dazu Grußformel, Name und Rolle als Klartext | Blauschwarz | An die Scroll-Position gekoppelt, rückwärts radiert sie |

**Entschieden bei der Umsetzung:**
- **Name `Signature`**, `variant` = Strich: `nib` (B, Default), `pen` (A), `felt` (C).
- **D fällt weg.** Grußformel, Name und Rolle setzt der Consumer selbst um die Unterschrift (Beispiel in der COMPONENT.md).
  Die Scroll-Kopplung entfällt damit auch.
- **Unterschrift als Daten:** `strokes` (Federzüge mit Dauer) + `viewBox`, die Komponente kennt keine bestimmte
  Unterschrift. Der Platzhalter liegt in `components-showcase/src/data.ts`, die Schräglage ist in die Koordinaten eingerechnet.
- **Tinte = `currentColor`**, keine eigene Farb-Prop. Auf Papier erbt sie die Papiertinte oder kommt per `style`.
- **Strich skaliert mit der viewBox** (Referenz 254 Einheiten), damit eine echte Unterschrift in beliebigen Einheiten gleich wirkt.

**Props (umgesetzt):**
| Prop | Typ | Default | Beschreibung |
|---|---|---|---|
| `strokes` | `{ d: string; duration: number }[]` | required | Federzüge in Schreibreihenfolge |
| `viewBox` | `string` | required | viewBox der Pfade |
| `variant` | `'nib' \| 'pen' \| 'felt'` | `'nib'` | Breitfeder, Füllfeder oder Filzstift |
| `label` | `string` | — | Zugänglicher Name, ohne Wert `aria-hidden` |
| `className` / `style` | — | — | Breite (Default `w-60`) und Tintenfarbe am Wrapper |

**Im Einsatz:** components-showcase → *Text → Signature*.

**Offen:** echte Unterschrift von Simon als SVG-Pfad.

**Status:** ✅ umgesetzt (mit Platzhalter-Pfad)

### 7. Stempel

**Zweck:** Schräger Gummistempel mit ungleichmäßigem Farbauftrag, z. B. „Jahrgang 2025“ oder „Neuer Jahrgang“
auf Produktbild oder Papier-Element.

**User Story:** Als Shop-Besucher möchte ich auf einen Blick sehen, welcher Wein aus dem aktuellen Jahrgang ist,
damit ich den neuen Wein schnell finde.

**Abgrenzung:** Eigene Komponente, keine Variante von `ProductTag` (Entscheidung #11).

**Status:** ⬜ Werkbank offen

### 8. Handschrift-Markierungen im Highlighter

**Zweck:** Neue `action`s im bestehenden `Highlighter` statt einer eigenen Komponente (wie schon `marker`, siehe
Marker-Callout): Kreis um ein Wort, Durchstreichen, Kringel-Unterstreichung. Beispiel: „30,–“ durchgestrichen,
„25,–“ daneben.

**User Story:** Als Leser möchte ich, dass einzelne Wörter wie mit dem Stift eingekreist, durchgestrichen oder
unterkringelt werden, damit Preisänderungen und Kernaussagen persönlich hervorgehoben wirken.

**Status:** ⬜ Werkbank offen

---

## Gemeinsame technische Basis

- **Farbpalette (fix, nicht Theme-abhängig):** Kraftpapier-Tan, Creme-Weiß (Polaroid-Rahmen),
  Chalkboard-Dunkel (für dunkle Notiz), Tape-Oliv/Kraft-Beige. Als `oklch()`-Konstanten (kraft
  `oklch(0.80 0.055 76)`, cream `oklch(0.965 0.016 88)`, dark `oklch(0.27 0.014 55)`). **Seit Polaroid-Frame**
  in [`components/lib/scrapbook.ts`](./components/lib/scrapbook.ts): `PAPER`, `paperGrain()`, `WASHI` und `hashSeed()`.
  Komponenten-spezifische Werte (z. B. der etwas weißere Polaroid-Karton) bleiben lokal. Was auf dem
  Seitenhintergrund liegt (Pfeile), folgt dem Theme — sonst ist es im Dark Mode unsichtbar.
- **Handschrift-Font:** Caveat + Kalam (siehe Entscheidung #4), self-hosted via `@fontsource` in der App (#5).
- **Texturen:** ausschließlich Inline-SVG (kein Bild-Asset) — Rissrand, Papierkorn, Pinselstrich-Blobs.
- **A11y:** Rotationen/Deko-SVGs sind `aria-hidden`, Fokus-Reihenfolge bleibt beim eigentlichen Inhalt
  (Text/Bild), keine Information ausschließlich über Rotation/Deko vermittelt.
- **Reduced Motion:** Falls `motion/react`-Entrance-Animationen verwendet werden, `useReducedMotion()`
  Pflicht (siehe COMPONENT-GUIDELINES.md §5).

---

## Progress

| Reihenfolge | Komponente | `.tsx` | `messages.ts` | `COMPONENT.md` | Showcase | Quality-Gate |
|---|---|---|---|---|---|---|
| 1 | Paper-Note | ✅ | — (keine UI-Strings) | ✅ | ✅ | ✅ |
| 2 | Polaroid-Frame | ✅ | — (keine UI-Strings) | ✅ | ✅ | 🟡 Lint/Typecheck ✅, Browser-Checks offen |
| 3 | Marker-Callout | ✅ | — (keine UI-Strings) | ✅ | ✅ | 🟡 Lint/Typecheck ✅, Browser-Checks offen |
| 4 | Process-Steps | ✅ | — (keine UI-Strings) | ✅ | ✅ | 🟡 Lint/Typecheck ✅, Browser-Checks offen |

**Runde 2**

| Reihenfolge | Komponente | Werkbank | Entwurf gewählt | `.tsx` | `messages.ts` | `COMPONENT.md` | Showcase | Quality-Gate |
|---|---|---|---|---|---|---|---|---|
| 5 | Hang-Tag | ✅ (entfernt) | ✅ A | ✅ | — (keine UI-Strings) | ✅ | ✅ | 🟡 Lint/Typecheck ✅, Dark/Light, 390 px und Reduced Motion per Screenshot geprüft; Tastatur entfällt (nicht interaktiv), Anstoßen per Maus offen |
| 6 | Unterschrift | ✅ (entfernt) | ✅ B + A, C | ✅ | — (keine UI-Strings) | ✅ | ✅ | 🟡 Lint/Typecheck ✅, Dark/Light, 390 px und Reduced Motion per Screenshot geprüft; Tastatur entfällt (nicht interaktiv); echte Unterschrift offen |
| 7 | Stempel | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 8 | Highlighter-Handschrift | ⬜ | ⬜ | ⬜ (Erweiterung) | ⬜ | ⬜ | ⬜ | ⬜ |

## Change History

| Date | Change | Reason |
|------|--------|--------|
| 2026-09-18 | Plan erstellt | Vier Scrapbook-Textbox-Komponenten aus Cupping-Workshop-Einladungsgrafik abgeleitet, strategisches Vorgehen (Plan → Review → Implementierung) gewünscht. |
| 2026-10-06 | Paper-Note umgesetzt (`torn` + `notepad`), Showcase-Eintrag, neue Section „Veranstaltungen → Die Pinnwand" | Werkbank mit 4 Entwürfen, A + B gewählt. Fonts entschieden (Caveat + Kalam), Font-Ladung auf self-hosted `@fontsource` umgestellt (DSGVO, Repo-Konvention). Quality-Gate: Lint 0, Typecheck ohne Fehler, Dark/Light, Akzent, Reduced Motion und 390-px-Breite im Browser geprüft. |
| 2026-10-06 | Werkbänke für Polaroid-Frame, Marker-Callout und Process-Steps (je 4 Entwürfe); Paper-Note-Werkbank entfernt | Gleiches Vorgehen wie bei Paper-Note: erst vergleichen, dann übernehmen. |
| 2026-10-06 | Polaroid-Frame umgesetzt (Entwurf A *Klassisch*), Showcase-Eintrag auf der Text-Seite, gemeinsame Basis `components/lib/scrapbook.ts` (Paper-Note darauf umgestellt) | Zweite Komponente braucht Tinte, Washi und Korn von Paper-Note, daher wie geplant nach `lib/` ausgelagert. |
| 2026-10-06 | Process-Steps umgesetzt (Entwürfe A, B, C als `paper`, `trail`, `ledger`), Showcase-Eintrag auf der Text-Seite, Cormorant self-hosted im components-showcase | Werkbank-Review. Responsive auf Container-Query umgestellt, weil die Werkbank-Fassung zwischen 640 und ~900 px überlief. |
| 2026-10-06 | Marker-Callout umgesetzt (A, C, D als `brush`, `watercolor`, `tape`), Entwurf B als `Highlighter` `action="marker"`, Highlighter-Fixes, Werkbank entfernt | Werkbank-Review. B überschnitt sich mit `Highlighter`, daher dort integriert statt doppelt im System. |
| 2026-10-07 | Runde 2 beschlossen: Hang-Tag, Unterschrift, Stempel, Highlighter-Handschrift. Verworfen: Heurigen-Tafel, Umschlag, Fotostreifen, Klebeband-Hülle. Ticket und Collage-Layout offen. | Ideen-Runde nach Abschluss von Runde 1. |
| 2026-10-07 | Werkbank `/lab/hang-tag` mit vier Entwürfen (A Kraft, B Bütten, C Gepäckanhänger, D Halskragen), jeweils an Rot- und Weißweinflasche und frei | Gleiches Vorgehen wie Runde 1: erst vergleichen, dann übernehmen. |
| 2026-10-07 | HangTag umgesetzt (Entwurf A, `hanging` + `loose`), Showcase-Eintrag auf der Text-Seite, neue Storefront-Variante „Das Geschenk“, Werkbank entfernt | Werkbank-Review: A gewählt, B–D verworfen. Platzierung am Hals über einen Ankerpunkt statt Hals-Koordinaten, damit jedes Produktbild funktioniert. |
| 2026-10-07 | Unterschrift und Stempel werden eigene Komponenten (#11). Werkbank `/lab/signature` mit vier Entwürfen (A Füllfeder, B Breitfeder, C Filzstift, D Briefschluss), jeweils auf der Seite und auf Papier | Offene Frage zum Stempel vom User entschieden. Gleiches Vorgehen wie Runde 1: erst vergleichen, dann übernehmen. |
| 2026-10-07 | Signature umgesetzt (B als `nib` Default, A als `pen`, C als `felt`), Showcase-Eintrag auf der Text-Seite, Werkbank entfernt | Werkbank-Review: B gefällt am besten, eine Komponente mit Varianten. D (Briefschluss mit Scroll-Kopplung) verworfen, den Aufbau übernimmt der Consumer. |
