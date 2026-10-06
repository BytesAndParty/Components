# Scrapbook Textboxes — Kreative Papier-Text-Elemente

> Vier eigenständige Komponenten für "Scrapbook"-artige Textboxen (Kraftpapier-Notiz, Polaroid-Rahmen,
> Marker-Highlight-Callout, Prozess-Schritte) — inspiriert von einem Social-Media-Einladungsgrafik-Stil
> (Washi-Tape, Rissrand, Handschrift-Font). Projektunabhängige, wiederverwendbare Primitives für dieses
> Repo — kein Bezug zu einem konkreten Produkt (Auslöser war eine BuchArt58-Session, die Komponenten
> selbst sind aber generisch für jedes Projekt nutzbar, das den "Scrapbook"-Look braucht).

Status: **1 von 4 umgesetzt** — Paper-Note ist fertig ([`components/paper-note/COMPONENT.md`](./components/paper-note/COMPONENT.md)).
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

**Props (Entwurf):**
| Prop | Typ | Default | Beschreibung |
|---|---|---|---|
| `src` | `string` | required | Bild-URL |
| `alt` | `string` | required | Alt-Text (A11y-Pflicht) |
| `caption` | `ReactNode` | — | Text unter dem Foto (Handschrift-Font) |
| `rotate` | `number` (deg) | `1.5` | Rotationswinkel |
| `tape` | `boolean` | `false` | Kleines Tape-Eck als Deko |
| `className` / `style` | — | — | Layout-Anpassung |

**Visual:** Weißer Rahmen (dünn oben/seitlich, breit unten ~22%), Foto `object-cover`, dezenter
Schlagschatten, optionale leichte Sepia/Warmton-Filter-Option für "Vintage"-Gefühl (später, nicht MVP).

**Abhängigkeiten:** keine.

**Status:** ⬜ nicht begonnen

---

### 3. Marker-Callout

**Zweck:** Textblock auf einer unregelmäßigen Pinselstrich-/Textmarker-Fläche im Hintergrund, leicht
rotiert (im Bild: "Ein besonderes Erlebnis für alle Kaffeeliebhaber – mit euch!").

> Abgrenzung zur bestehenden [`Highlighter`](./components/highlighter/highlighter.tsx)-Komponente:
> `Highlighter` ist eine animierte Inline-Text-Unterstreichung/-Markierung (scroll-getriggert, für
> einzelne Wörter in Fließtext). `MarkerCallout` ist ein eigenständiger, statischer Block mit
> handgezeichneter Pinselstrich-Fläche als Hintergrund für ganze Sätze — anderer Einsatzzweck, kein
> Duplikat.

**Props (Entwurf):**
| Prop | Typ | Default | Beschreibung |
|---|---|---|---|
| `children` | `ReactNode` | required | Text-Inhalt |
| `color` | `'kraft' \| 'sage' \| 'rose'` | `'kraft'` | Pinselstrich-Farbe (festes Mini-Palette, keine freien Hex-Werte) |
| `rotate` | `number` (deg) | `-1` | Rotationswinkel |
| `variant` | `1 \| 2 \| 3` | `1` | Wählt eine von 3 vorgefertigten Blob-Pfad-Varianten (vermeidet identisch wirkende Wiederholung bei Mehrfach-Einsatz) |
| `className` / `style` | — | — | Layout-Anpassung |

**Visual:** Inline-SVG-`<path>` (handgezeichnete Blob-Form, 3 Varianten vordefiniert) als Hintergrund,
Text zentriert darüber, Handschrift-Font.

**Abhängigkeiten:** keine.

**Status:** ⬜ nicht begonnen

---

### 4. Process-Steps

**Zweck:** Horizontale (mobile: vertikale) Kette aus Icon-Kreisen mit Pfeilen dazwischen und Label
darunter (im Bild: Bohne → Nase → Tasse → Sprechblasen = "verschiedene Kaffees verkosten" → "den
Cupping-Prozess verstehen" → …).

**Props (Entwurf):**
| Prop | Typ | Default | Beschreibung |
|---|---|---|---|
| `steps` | `{ icon: ReactNode; label: string }[]` | required | Schritt-Definitionen |
| `arrowIcon` | `ReactNode` | eingebauter Pfeil | Custom-Pfeil zwischen Schritten |
| `className` / `style` | — | — | Layout-Anpassung |

**Visual:** Kreis-Badges (Kraftpapier-Creme-Ton, dünner Border, dunkles Linien-Icon mittig), Pfeile
zwischen den Kreisen, Labels in normalem UI-Sans (**nicht** Handschrift — Lesbarkeit bei kurzen
Prozess-Beschreibungen hat Vorrang). Responsive: `flex-wrap` + Pfeil dreht sich 90° im vertikalen
Stack.

**Abhängigkeiten:** keine. `motion/react` optional für Staggered-Reveal beim Scroll-in-View.

**Status:** ⬜ nicht begonnen

---

## Gemeinsame technische Basis

- **Farbpalette (fix, nicht Theme-abhängig):** Kraftpapier-Tan, Creme-Weiß (Polaroid-Rahmen),
  Chalkboard-Dunkel (für dunkle Notiz), Tape-Oliv/Kraft-Beige. **Entschieden bei Paper-Note:** als
  `oklch()`-Modul-Konstanten lokal in der Komponente (kraft `oklch(0.80 0.055 76)`, cream
  `oklch(0.965 0.016 88)`, dark `oklch(0.27 0.014 55)`). Sobald die zweite Komponente dieselben Werte
  braucht, wandern sie in eine gemeinsame `components/lib/`-Datei. Was auf dem Seitenhintergrund liegt
  (Pfeile), folgt dem Theme — sonst ist es im Dark Mode unsichtbar.
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
| 2 | Polaroid-Frame | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 3 | Marker-Callout | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 4 | Process-Steps | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

## Change History

| Date | Change | Reason |
|------|--------|--------|
| 2026-09-18 | Plan erstellt | Vier Scrapbook-Textbox-Komponenten aus Cupping-Workshop-Einladungsgrafik abgeleitet, strategisches Vorgehen (Plan → Review → Implementierung) gewünscht. |
| 2026-10-06 | Paper-Note umgesetzt (`torn` + `notepad`), Showcase-Eintrag, neue Section „Veranstaltungen → Die Pinnwand" | Werkbank mit 4 Entwürfen, A + B gewählt. Fonts entschieden (Caveat + Kalam), Font-Ladung auf self-hosted `@fontsource` umgestellt (DSGVO, Repo-Konvention). Quality-Gate: Lint 0, Typecheck ohne Fehler, Dark/Light, Akzent, Reduced Motion und 390-px-Breite im Browser geprüft. |
