# Stammbaum — Rebsorten-Lineage (Section)

Ein „Stammbaum" der Weinreben statt Menschen — als **organische Ampelographie-Tafel
auf einer Zoom-Bühne**. Der Überblick zeigt die ganze Verwandtschaft verteilt über die
Fläche; ein Klick **fährt die Kamera an eine Rebe heran** (Ahnen-Pfad leuchtet auf,
Detail erscheint), Zurück zoomt an die exakte Ausgangsposition raus.

## Komposition (bewusst KEINE Zeilen)

Die Knoten sind **kuratiert platziert** (`POS` in `lineage-tree.tsx`), nicht in ein
Zeilen-Grid gezwängt:

- **Weißer Ast** (links): Traminer (Urahn), Roter Veltliner, Silvaner, St.-Georgen →
  Rotgipfler, Zierfandel, Neuburger, Grüner Veltliner.
- **Roter Ast** (rechts): Blaufränkisch, Sankt Laurent, Blauer Portugieser →
  Zweigelt, Blauburger → **PIWI** Rösler & Rathay (unten rechts).
- **Seyve-Villard 18-402** („die Brücke", Direktträger) sitzt bei den Kreuzungen und
  speist über eine **gestrichelte Cross-Family-Kante** Rösler & Rathay.
- **Uhudler-Direktträger** (Isabella, Concord, Elvira, Noah) als **eigener Cluster**
  unten links, mit Hairline-Box umrandet — amerikanische Hybriden, **nicht** mit dem
  Traminer verwandt.

Generationstiefe läuft grob oben→unten; Kanten Eltern→Kind als geschwungene
**Ranken-Kurven** (Bézier). `row`/`col` in den Daten dienen nur noch der
**Tastatur-Navigation** und den **Listen-Gruppen**, nicht dem Rendering.

## Interaktion (Kamera-Zoom)

- **Überblick:** ganze Komposition in die Bühne gefittet (Safe-Zones für Headline
  oben und Command-Bar unten).
- **Heranzoomen:** Klick/Enter auf eine Rebe fährt die Kamera weich heran und framt
  die Rebe **plus ihre direkten Eltern**; der Ahnen-Pfad leuchtet in Accent, der Rest
  tritt zurück (Recede-Scrim). Detail-Panel rechts (Desktop).
- **Zurück:** Browser-Zurück, `Esc`, Klick auf freie Fläche und „← Überblick" zoomen
  an die **exakte Ausgangsposition** raus. Auswahl aus dem Überblick = History-**Push**
  (ein Browser-Zurück reicht); Wechsel zwischen Reben = `replace` (Zurück bleibt der
  Überblick).

## URL-Deep-Link

- `?rebe=<id>` — gewählte Rebsorte (zoomt hin, hebt Ahnen-Pfad hervor, öffnet Detail).
  Teilbar, z. B. `…/lineage?rebe=rotgipfler`.
- `?ansicht=liste` — Reader-/Listen-Ansicht statt Baum.

## Dateien

| Datei | Rolle |
|---|---|
| `lineage-data.ts` | Datensatz (`row`/`col`/`epoch`/`parents` …) + Typen + Graph-Helfer (`ancestorsOf`, `firstChildOf`). Bilder illustrativ. **Swappable.** |
| `lineage-tree.tsx` | Primitiv: `POS`-Layout, Bézier-Kanten, Ahnen-Highlight, Kamera-Zoom (`fitTransform`/`focusTransform`), Keyboard-Nav, Detail-Panel, Reader-Ansicht, URL-/History-State, Reben-Wasserzeichen. |
| `LineageV1.tsx` | Section-Variante „Espalier": Serif-Kopf (blendet im Fokus aus) + Baum + Kolophon. |

## Accessibility

- Jeder Knoten ein `<button>` mit Roving-Tabindex; ←/→ Nachbarn (logische Reihe),
  ↑ Elternteil, ↓ Kind; Enter zoomt heran, Escape zoomt raus (global registriert).
- Rot/Weiß + Epoche stehen immer im `aria-label` (nicht nur in der Farbkante).
- `useReducedMotion()` + `motion-reduce:`-Guards; Kamera springt bei Reduced-Motion hart.
- Reader-/Listen-Ansicht (Desktop-Toggle & Mobile-Default) als semantische `<ul>`-Outline.

## Daten-Status

Verwandtschaften ampelographisch belegt (Quellen im Datei-Header). Weine, Preise, Lagen
und Bilder illustrativ (Kolophon), swappable gegen Vendure/CMS.
