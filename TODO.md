# TODO — Kleine Fixes Showcase

Stand: 2026-10-07

## Booking Calendar
`components/booking-calendar/` · Showcase: `pages/shop.tsx`

- [ ] Hover über einen buchbaren Tag: Cursor auf `pointer`, damit klar ist, dass man den Tag anklicken kann.
- [ ] Nicht verfügbare Tage weiter anzeigen, aber ausgegraut und mit `not-allowed`-Cursor. Aktuell ändert sich der Cursor gar nicht, auch nicht über der Tageszahl selbst.

## Stepper
`components/stepper/` · Showcase: `pages/shop.tsx`

- [ ] Beim Wechsel auf den nächsten Step springt die Höhe der Section ohne Animation oder Übergang. Die Höhe soll weich mitwachsen bzw. schrumpfen.
- [ ] Vertical Stepper: Animation langsamer machen.

## Floating Cart
`components/floating-cart/` · eingebunden in `components-showcase/src/layout.tsx`

- [ ] Klick auf ein Item im Cart-Flyover führt zu einer Dummy-Detailseite des Produkts.

## Wine Inventory (DataTable)
`components/data-table/` · Showcase: `pages/data.tsx`

- [ ] Animationen und Übergänge prüfen: Gibt es Bugs? Lässt sich etwas vereinfachen oder besser darstellen?

## Confetti
`components/confetti/` · Showcase: `pages/feedback.tsx`

- [ ] Burst Confetti passt.
- [ ] Rain Confetti überarbeiten: Der Name lässt Regen erwarten, die aktuelle Umsetzung wirkt aber eher wie viele kleine Bursts. Entweder echten Konfetti-Regen bauen (von oben gleichmäßig herabfallend) oder umbenennen.

## CSS-Animated SVG Icons
`components/animated-icons/` · Showcase: `pages/icons.tsx`

- [ ] Die Animation des Mond-Icons ergibt keinen Sinn, bitte überarbeiten.

## Polaroid Frame
`components/polaroid-frame/` · Showcase: `pages/text.tsx`

- [x] Leeres Polaroid ist eine bewusste Edge-Case-Demo (`src="/does-not-exist.jpg"`). Umbenannt von „Foto vom Hoffest" zu „Test: absichtlich leer", damit es nicht wie ein Bug aussieht.
- [ ] Offen: `PolaroidFrame` hat keinen Fallback für fehlgeschlagene Bilder (kein `onError`), es erscheint nur der Alt-Text in kleiner Sans-Schrift. Platzhalter im Polaroid-Look bauen?

## Wave Text
`components/wave-text/` · Showcase: `pages/text.tsx`

- [ ] Die Box von Wave Text ist viel zu klein.
