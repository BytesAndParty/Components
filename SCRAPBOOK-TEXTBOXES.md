# Scrapbook Textboxes — Kreative Papier-Text-Elemente

> Vier eigenständige Komponenten für "Scrapbook"-artige Textboxen (Kraftpapier-Notiz, Polaroid-Rahmen,
> Marker-Highlight-Callout, Prozess-Schritte) — inspiriert von einem Social-Media-Einladungsgrafik-Stil
> (Washi-Tape, Rissrand, Handschrift-Font). Projektunabhängige, wiederverwendbare Primitives für dieses
> Repo — kein Bezug zu einem konkreten Produkt (Auslöser war eine BuchArt58-Session, die Komponenten
> selbst sind aber generisch für jedes Projekt nutzbar, das den "Scrapbook"-Look braucht).

Status: **Plan — noch keine Komponente implementiert.** Dieses Dokument ist der Tracking-Ort für
Fortschritt, bis jede Komponente ihr eigenes `COMPONENT.md` bekommt (siehe [COMPONENT-GUIDELINES.md](./COMPONENT-GUIDELINES.md)).

---

## Entscheidungen

| # | Frage | Entscheidung |
|---|---|---|
| 1 | Welche Elemente? | 4 Komponenten: **Paper-Note**, **Polaroid-Frame**, **Marker-Callout**, **Process-Steps** (siehe unten). |
| 2 | Wie nah am Bild-Vorbild? | **Skeuomorph, wie im Bild.** Eigenes, festes Papier-Farbschema (Kraftpapier-Tan, Creme-Weiß, Chalkboard-Dunkel, Tape-Oliv) — **läuft nicht über die oklch-Theme-Engine** (kein `bg-card`/Dark-Light-Accent-Switch). Der Papier-Look soll themenunabhängig wirken, wie ein physisches Objekt auf der Seite. |
| 3 | Umfang/Vorgehen | Alle 4 jetzt, aber strategisch: **erst dieser Plan**, Review durch User, **dann** Implementierung eine nach der anderen (Reihenfolge siehe Progress-Tabelle unten). Jede Komponente durchläuft vollständig: `.tsx` → `messages.ts` (falls UI-Strings) → `COMPONENT.md` → Showcase-Eintrag → Quality-Gate (§11 COMPONENT-GUIDELINES.md), bevor die nächste startet. |
| 4 | Handschrift-Font | **Neu, noch nicht im Repo.** Vorschlag: [`Caveat`](https://fonts.google.com/specimen/Caveat) (Google Font, Weights 400–700, gute Lesbarkeit auch fett) für alle handschriftlichen Texte. Strukturierte Labels (Step-Beschriftungen, "TERMIN ZUR AUSWAHL"-artige Über­schriften) bleiben im normalen UI-Sans. **Offen: User-Review der Font-Wahl.** |
| 5 | Font-Ladung | Self-contained: Google-Font-`@import` wird per JS injiziert (gleiches `STYLE_ID`-Dedup-Pattern wie Keyframes, siehe COMPONENT-GUIDELINES.md §4c), nicht global in `index.html` ergänzt — Komponente bleibt portabel/kopierbar. Geteilter Helper `injectScrapbookFonts()` in `components/lib/` (einmalige Abstraktion, weil alle 4 Komponenten denselben Font brauchen — kein Over-Engineering, sondern Vermeidung von 4× Duplikat + FOUC-Rennen). |
| 6 | Texturen (Papierkorn, Rissrand, Pinselstrich) | **Kein Bildasset.** Alles per Inline-SVG (`feTurbulence` für Papierkorn, gezackter `clipPath`/Polygon-Pfad für Rissrand, handgezeichneter `<path>` für Pinselstrich-Blob). Hält Komponenten self-contained und SSR-safe, keine Asset-Pipeline nötig. |
| 7 | Naming-Kollision | `Stepper` (bestehend) ist eine interaktive Multi-Step-Wizard-Komponente (Formular-Navigation) — komplett anderer Zweck als `ProcessSteps` (statischer, nicht-interaktiver Erklär-Flow). Keine Überschneidung, eigener Name gewählt. |

---

## Komponenten

### 1. Paper-Note

**Zweck:** Rotierte Papierkarte mit Rissrand (Deckle-Edge), optional Washi-Tape-Streifen, optional
handgezeichnetem Pfeil — deckt Sticky-Note, dunkle Kraftpapier-Notiz und handschriftliche
Pfeil-Annotation als Varianten einer Komponente ab (im Bild: "Entdecke mit uns...", "Wir schenken dir...",
"Auf einen unvergesslichen...", "Mehr Männer...").

**Props (Entwurf):**
| Prop | Typ | Default | Beschreibung |
|---|---|---|---|
| `children` | `ReactNode` | required | Notiz-Inhalt |
| `variant` | `'kraft' \| 'cream' \| 'dark'` | `'kraft'` | Papierfarbe |
| `rotate` | `number` (deg) | `-2` | Rotationswinkel |
| `tape` | `boolean \| { position?: 'left'\|'center'\|'right'; angle?: number }` | `false` | Washi-Tape-Streifen oben |
| `arrow` | `{ direction: 'up'\|'down'\|'left'\|'right' }` | — | Handgezeichneter Verbindungspfeil nach außen |
| `className` / `style` | — | — | Layout-Anpassung am Wrapper |

**Visual:** Gezackter Rissrand per SVG-`clipPath` (4 Seiten leicht unregelmäßig), feines Papierkorn
(`feTurbulence`, sehr niedrige Opazität), weicher Drop-Shadow für "liegt auf der Seite"-Effekt,
Handschrift-Font für `children` (Override via `className` möglich).

**Abhängigkeiten:** keine externen Libs. `motion/react` optional für Fade+Rotate-In beim Mount.

**Status:** ⬜ nicht begonnen

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

- **Farbpalette (fix, nicht Theme-abhängig):** Kraftpapier-Tan (`#D9C7A3`-artig), Creme-Weiß
  (Polaroid-Rahmen), Chalkboard-Dunkel (`#2B2622`-artig, für dunkle Notiz), Tape-Oliv/Kraft-Beige. Exakte
  Werte werden beim Implementieren als Modul-Konstanten in einer gemeinsamen `components/lib/`-Datei
  oder pro Komponente lokal gepflegt (Entscheidung fällt bei Paper-Note als erster Komponente, dann
  konsistent für die restlichen 3 übernommen).
- **Handschrift-Font:** `Caveat` (Vorschlag, siehe Entscheidung #4) — self-contained per Font-Injection.
- **Texturen:** ausschließlich Inline-SVG (kein Bild-Asset) — Rissrand, Papierkorn, Pinselstrich-Blobs.
- **A11y:** Rotationen/Deko-SVGs sind `aria-hidden`, Fokus-Reihenfolge bleibt beim eigentlichen Inhalt
  (Text/Bild), keine Information ausschließlich über Rotation/Deko vermittelt.
- **Reduced Motion:** Falls `motion/react`-Entrance-Animationen verwendet werden, `useReducedMotion()`
  Pflicht (siehe COMPONENT-GUIDELINES.md §5).

---

## Progress

| Reihenfolge | Komponente | `.tsx` | `messages.ts` | `COMPONENT.md` | Showcase | Quality-Gate |
|---|---|---|---|---|---|---|
| 1 | Paper-Note | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 2 | Polaroid-Frame | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 3 | Marker-Callout | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 4 | Process-Steps | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

## Change History

| Date | Change | Reason |
|------|--------|--------|
| 2026-09-18 | Plan erstellt | Vier Scrapbook-Textbox-Komponenten aus Cupping-Workshop-Einladungsgrafik abgeleitet, strategisches Vorgehen (Plan → Review → Implementierung) gewünscht. |
