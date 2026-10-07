# TODO — Kleine Fixes Showcase

Stand: 2026-10-07

Status-Legende: `[ ]` offen · `[~]` in Arbeit · `[x]` umgesetzt (im Browser geprüft, noch nicht committet, bis der Commit-Hash dabeisteht)

## Reihenfolge

1. Booking Calendar (klein)
2. Wave Text (klein)
3. Mond-Icon (klein)
4. Floating Cart (klein)
5. Polaroid-Fallback (klein)
6. Stepper (mittel)
7. Rain Confetti (mittel)
8. Wine Inventory / DataTable (Review + Fixes)
9. Abschluss: `bun lint`, COMPONENT.md-Updates, unabhängiger Review per Subagent

---

## 1. Booking Calendar
`components/booking-calendar/` · Showcase: `pages/shop.tsx`

- [x] Hover über einen buchbaren Tag: Cursor auf `pointer`, damit klar ist, dass man den Tag anklicken kann.
- [x] Nicht verfügbare Tage weiter anzeigen, aber ausgegraut und mit `not-allowed`-Cursor. Aktuell ändert sich der Cursor gar nicht, auch nicht über der Tageszahl selbst.

**Ursache:** Gesperrte Tage haben `pointer-events-none`, deshalb kann der Cursor dort gar nicht wechseln. Zag setzt bei gesperrten Tagen zusätzlich `data-disabled`, dadurch greifen zwei Abdunklungen übereinander (`/25` Textfarbe × `opacity-25`) und die Tage verschwinden fast. Die Zellen sind `div`s mit `role="button"`, über der Zahl erscheint deshalb der Text-Cursor.
**Plan:** `pointer-events-none` raus (Klicks auf gesperrte Tage blockt Zag selbst), eine einzige Grau-Stufe, `cursor-not-allowed` ohne Hover-Fläche für gesperrte Tage, `cursor-pointer` + `select-none` für buchbare. Pfeile, Uhrzeit-Chips und Absenden bekommen ebenfalls `cursor-pointer`.
**Ergebnis:** Im Browser geprüft: buchbare Tage `pointer`, gesperrte `not-allowed` in einer Grau-Stufe, Klick auf gesperrten Tag wählt nichts aus. Tage außerhalb des Monats etwas blasser. Der heutige Tag bleibt in Akzentfarbe, ist gesperrt aber gedämpft.

## 2. Wave Text
`components/wave-text/` · Showcase: `pages/text.tsx`

- [x] Die Box von Wave Text ist viel zu klein.

**Ursache:** Die Golden-Path-Box hat eine feste Höhe (`h-56`, 224 px). Die vertikale Zeile „Sooss · Niederösterreich — Familie Buchart" ist mit Versalien und `tracking-[0.45em]` aber rund doppelt so lang und läuft oben und unten aus der Box.
**Plan:** Feste Höhe raus, die Box wächst mit dem Text (Padding statt Höhe).
**Ergebnis:** `h-56` → `py-8`. Im Browser gemessen: Text 408 px, Box jetzt 474 px, Text liegt vollständig darin.

## 3. CSS-Animated SVG Icons: Mond
`components/animated-icons/` · Showcase: `pages/icons.tsx`

- [x] Die Animation des Mond-Icons ergibt keinen Sinn, bitte überarbeiten.

**Ursache:** Die drei Sterne skalieren vom SVG-Ursprung (0,0) aus statt von ihrer Mitte (`transform-box` fehlt) und rutschen dabei aus dem Bild. Sie sind winzig (r 0,4–0,6) und verschwinden am Ende der Animation wieder, obwohl man noch hovert.
**Plan:** Mond neigt sich beim Hover sanft und bleibt geneigt, zwei bis drei kleine Funkelsterne (4-zackig) erscheinen gestaffelt in der Aussparung, bleiben sichtbar und funkeln leicht, solange man hovert. Beim Verlassen läuft alles weich zurück. Reduced Motion: nur Einblenden, keine Bewegung.
**Ergebnis:** Umgesetzt mit CSS-Transitions statt einmaliger Keyframes (hält den Zustand beim Hover, läuft beim Verlassen zurück). Im Browser in Ruhe, Hover und nach dem Verlassen geprüft.

## 4. Floating Cart
`components/floating-cart/` · eingebunden in `components-showcase/src/layout.tsx`

- [x] Klick auf ein Item im Cart-Flyover führt zu einer Dummy-Detailseite des Produkts.

**Ursache:** `onItemClick` ist im Layout nicht verdrahtet. Außerdem setzt das Overlay über dem Produktkreis `cursor: default` und überdeckt damit den Pointer-Cursor des Buttons.
**Plan:** `onItemClick` → `navigate('/wine/<id>')`. Die bestehende Route `wine/:slug` fällt bei unbekannten IDs auf den Dummy-Wein zurück. `cursor: default` aus den Overlays entfernen.
**Ergebnis:** Im Browser geprüft: Barolo aus dem Shop in den Warenkorb, Klick aufs Item → `/wine/barolo` mit Dummy-Wein, Pointer-Cursor über dem Kreis.

## 5. Polaroid Frame
`components/polaroid-frame/` · Showcase: `pages/text.tsx`

- [x] Leeres Polaroid ist eine bewusste Edge-Case-Demo (`src="/does-not-exist.jpg"`). Umbenannt von „Foto vom Hoffest" zu „Test: absichtlich leer", damit es nicht wie ein Bug aussieht. (`e267bef`)
- [x] Fallback für fehlgeschlagene Bilder: Statt Broken-Image-Symbol + Alt-Text zeigt das Polaroid eine ruhige Fläche mit Symbol und Alt-Text im Polaroid-Look.

**Plan:** `onError` → Platzhalter (`role="img"` mit Alt-Text als Name, bei leerem Alt `aria-hidden`). Bei neuem `src` wird der Fehlerzustand zurückgesetzt. COMPONENT.md nachziehen.
**Ergebnis:** „Unentwickeltes“ Polaroid: dunkle, warme Fläche mit `ImageOff`-Symbol und Alt-Text. Der Fehlerzustand hängt an der fehlgeschlagenen URL, ein neues `src` setzt ihn ohne Effekt zurück. Im Browser geprüft, COMPONENT.md aktualisiert.

## 6. Stepper
`components/stepper/` · Showcase: `pages/shop.tsx`

- [x] Beim Wechsel auf den nächsten Step springt die Höhe der Section ohne Animation oder Übergang. Die Höhe soll weich mitwachsen bzw. schrumpfen.
- [x] Vertical Stepper: Animation langsamer machen.

**Ursache:** Der Inhaltsbereich hat keine animierte Höhe. Der alte Step blendet aus, dann springt der Container auf die Höhe des neuen Steps.
**Plan:** Inhalt per `ResizeObserver` messen und die Container-Höhe mit `motion` animieren (Spring ohne Überschwingen). Vertical Stepper: Auf- und Zuklappen, Rahmenfarbe und Verbindungslinie langsamer und aufeinander abgestimmt. Beide Varianten respektieren `prefers-reduced-motion`, das fehlt bisher.
**Ergebnis:** Im Browser gemessen: Die Höhe gleitet beim Step-Wechsel stufenlos (z. B. 294 → 240 px in ~350 ms nach dem Ausblenden). Vertical Stepper: Aufklappen von ~280 ms auf ~600 ms mit demselben gleichmäßigen Easing, Rahmen, Badge, Titel und Verbindungslinie im gleichen Tempo. COMPONENT.md aktualisiert.

## 7. Confetti
`components/confetti/` · Showcase: `pages/feedback.tsx`

- [x] Burst Confetti passt.
- [x] Rain Confetti überarbeiten: Der Name lässt Regen erwarten, die aktuelle Umsetzung wirkt aber eher wie viele kleine Bursts.

**Ursache:** Pro Welle feuern 4 Positionen × 4 Farbgruppen je einen gebündelten Schuss mit hoher Startgeschwindigkeit nach unten. Das sieht aus wie Mini-Explosionen am oberen Rand.
**Plan:** Echter Regen: Über eine Dauer hinweg fällt pro Frame einzelnes Konfetti an zufälligen x-Positionen über die ganze Breite, ohne Startimpuls, mit leichtem Seitenwind. `waves`/`waveDelay` werden durch `duration` ersetzt, `fireConfettiRain()` nutzt dieselbe Logik. COMPONENT.md nachziehen.
**Ergebnis:** Neue Funktion `startRain()` in `fire.ts`, von `ConfettiRain` und `fireConfettiRain()` gemeinsam genutzt. Nebenbei gefundener Bug: `ConfettiRain` hielt die Kanone in einem Ref, obwohl das Canvas zwischen zwei Läufen unmountet. Ab dem zweiten Klick fiel der Regen deshalb auf ein abgehängtes Canvas und blieb unsichtbar. Jetzt gibt es pro Lauf eine eigene Kanone. Im Browser geprüft: gleichmäßiger Regen über die ganze Breite, zweiter Lauf sichtbar, nach ~6,4 s fertig und Canvas entfernt. API-Änderung: `waves`/`waveDelay` → `duration` (einziger Consumer ist der Showcase, der beide nicht nutzt). COMPONENT.md aktualisiert.

## 8. Wine Inventory (DataTable)
`components/data-table/` · Showcase: `pages/data.tsx`

- [x] Animationen und Übergänge prüfen: Gibt es Bugs? Lässt sich etwas vereinfachen oder besser darstellen?

**Plan:** Im Browser prüfen (Sortieren, Blättern, Spalten-Resize, Browser-Zurück). Verdachtsfälle aus dem Code:
- `layout` auf jeder Zeile animiert auch Größenänderungen. Beim Ziehen einer Spaltenbreite werden die Zeilen dadurch per `scale` verzerrt. → `layout="position"`.
- `mode="popLayout"` setzt ausblendende `<tr>` auf `position: absolute`, dabei verlieren die Zellen ihre Spaltenbreiten.
- Die Blätter-Richtung wird bei Änderung von außen (URL, Browser-Zurück) erst nach dem Render per Effekt gesetzt. Die Zeilen animieren dann in die falsche Richtung.
- Doppelte Enter/Space-Behandlung an den Sortier-Buttons (natives `<button>` erledigt das schon).

**Ergebnis (im Browser gemessen):**
- Bestätigt: Beim Spalten-Resize wurden alle Zeilen per `scaleX` gestaucht und federten ~2 s nach. → `layout="position"`, jetzt 0 Frames mit Transform, Zeilen folgen sofort.
- Bestätigt: Beim Blättern lagen die 15 ausblendenden Zeilen ~650 ms als `position: absolute` / `display: block` über der Tabelle, Zellen 186/66/69 px statt 220/86/93 px. → Ein `tbody` pro Seite, die alte Seite gleitet als Ganzes in ~180 ms hinaus, Spaltenbreiten bleiben durchgehend stabil.
- Blätter-Richtung wird jetzt im Render abgeleitet statt per Effekt (Effekt + `eslint-disable` entfernt). Geprüft: Zurück läuft von links ein, Weiter von rechts.
- Neu gefunden: Die Resize-Griffe wurden zur Hälfte von der nächsten Spaltenüberschrift überdeckt. Genau auf der sichtbaren Linie griff man ins Leere. → `z-10`, jetzt greift der Griff auf der Linie.
- Sortieren: Zeilen gleiten an die neue Position, neu auf die Seite kommende Zeilen blenden ohne seitlichen Versatz ein (vorher erschienen sie auf Seite 1 schlagartig). Beim ersten Laden läuft weiterhin nichts ein.
- Doppelte Tastenbehandlung an den Sortier-Buttons entfernt. Die 4 bestehenden DataTable-Tests sind grün, COMPONENT.md ist aktualisiert.
- Nicht geändert: Hat die letzte Seite weniger Zeilen, springt die Tabellenhöhe. In der Demo tritt das nicht auf (60 Zeilen / 15 pro Seite).

## 9. Abschluss

- [x] `bun lint` ohne Fehler (Exit 0), `tsc --noEmit` im Showcase ohne Fehler, `bun run test` 95/95 grün
- [x] COMPONENT.md der geänderten Komponenten aktuell
- [x] Unabhängiger Review per Subagent (Findings unten abgearbeitet, danach erneut Lint/tsc/Tests grün)

### Review-Findings

Behoben:
- **Rain Confetti:** Der Regen wurde auf 75/90/144-Hz-Displays zu früh abgeschnitten, weil canvas-confetti höchstens alle 16 ms einen Tick rechnet (dort < 60 Ticks/s). Das Ende wird jetzt in Ticks mit derselben Drossel gezählt. Zusätzlich holt ein Hintergrund-Tab beim Zurückkehren nicht mehr alle verpassten Teilchen in einem Frame nach, und `cancel()` löst `done` auf.
- **Booking Calendar:** Das Theme der components-showcase hatte kein `accent-foreground`-Token (die section-showcase schon). `text-accent-foreground` griff nie, ausgewählte Tage und der Absenden-Button hatten deshalb nur geerbte Textfarbe. Token in `components-showcase/src/styles.css` ergänzt (weiß, wie in der section-showcase). Dazu: heute + ausgewählt explizit lesbar, wirkungsloses `data-[disabled]:font-normal` entfernt. Im Browser geprüft: Text weiß auf Akzent. Nebeneffekt: Die Hover-Buttons in `pages/cards.tsx` nutzen dasselbe Token und bekommen jetzt beim Hover weißen Text, wie dort beabsichtigt.
- **Stepper:** `overflow-hidden` → `overflow-clip`. Damit ist der Container kein Scroll-Container mehr und Fokus kann den Inhalt während des Höhen-Morphs nicht dauerhaft verschieben.
- **Polaroid:** Bei SSR kann ein Bild vor der Hydration scheitern, `onError` kommt dann nie an. Nach dem Mount wird ein bereits gescheiterter Ladevorgang per erneutem `src` neu angestoßen, damit der Fehler gemeldet wird. (`decode()` wäre die Alternative, lehnt in Safari aber teils gültige SVGs ab.)
- **DataTable:** Die Richtung wird auch bei neuen `data` auf „nur einblenden" zurückgesetzt. Die Tabelle hat `isolate`, damit `z-10` der Resize-Griffe nicht mit Seiten-Elementen konkurriert. In der COMPONENT.md präzisiert: Sortieren auf einer späteren Seite springt (TanStack `autoResetPageIndex`) auf Seite 1 und spielt den Seitenwechsel.
- **Cart:** ID in der URL wird kodiert (`encodeURIComponent`).

Bewusst nicht geändert:
- Mond-Icon auf Touch-Geräten: `:hover` bleibt nach dem Tippen hängen, Neigung und Funkeln laufen weiter, bis man woanders hintippt. Gilt für alle CSS-Icons gleich, deshalb nicht nur beim Mond anders gelöst.
- DataTable: Zeilen ohne `exit` verlassen das DOM über einen kurzen Umweg in `AnimatePresence`. Bei Router-Updates mit Transition könnte theoretisch ein Frame alte und neue Zeilen zeigen. Nur aus dem Code abgeleitet, im Browser nicht beobachtet.
- Polaroid: Wechselt `src` zurück auf eine früher gescheiterte URL, wird nicht neu versucht.
- Regen: Wird das Fenster während des Regens höher, kann das Ende etwas zu früh kommen (Strecke wird beim Start gemessen).
- Keine neuen Tests für Richtungslogik, `startRain`, Polaroid-Fallback und Stepper-Höhe. Neue Tests nur nach Freigabe.
