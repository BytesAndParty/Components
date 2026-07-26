# Stammbaum — Rebsorten-Lineage (Section)

Ein „Stammbaum" der Weinreben statt Menschen als **chronologische, vertikale Zeitachse**:
oben die uralten Urreben, nach unten durch die Epochen bis zu den PIWI-Neuzüchtungen —
man **scrollt durch die Zeit**. Schmal & hoch statt breit. Genealogie ist chronologisch:
Kinder erscheinen immer unter ihren Eltern.

## Aufbau (Zeitachse, oben alt → unten jung)

Zeilen = Epochen (linke Achse mit Marker), zwei Familien:

- **`vinifera`** — der zusammenhängende Hauptstamm über die Epochen:
  - *Urreben (uralt):* Traminer (Urahn), Roter Veltliner, Silvaner, St.-Georgen, Blaufränkisch,
    Sankt Laurent, Blauer Portugieser.
  - *Alte Naturkreuzungen (vor 1800):* Rotgipfler, Zierfandel, Neuburger, Grüner Veltliner.
  - *Klosterneuburg (1920er):* Zweigelt, Blauburger.
  - *PIWI-Neuzüchtungen (1960–70):* Rösler, Rathay.
- **`direkttraeger`** — die **Uhudler-Direktträger** (Isabella 1816, Concord 1849, Elvira 1863,
  Noah 1869) + **Seyve-Villard** (um 1930, die Brücke). Amerikanische Hybriden, **nicht** mit dem
  Traminer verwandt. Seyve-Villard verbindet echt zu Rösler/Rathay (gestrichelte Cross-Family-Kante).

Layout deterministisch über `row`/`col`; Kanten Eltern(oben)→Kind(unten). Kein Zoom/Pan mehr —
der Baum ist hoch und **scrollt mit der Seite**.

## URL-Deep-Link

- `?rebe=<id>` — gewählte Rebsorte (zoomt/scrollt hin, hebt Ahnen-Pfad hervor, öffnet Detail).
- `?ansicht=liste` — Reader-/Listen-Ansicht statt Baum.
- Die URL ist die **Quelle der Wahrheit** (`useSearchParams`, `replace`); Links sind teilbar,
  z. B. `…/lineage?rebe=rotgipfler`.

## Dateien

| Datei | Rolle |
|---|---|
| `lineage-data.ts` | Datensatz (`row`/`col`/`epoch`, `ERAS`) + Typen + Graph-Helfer. Bilder + `BACKGROUND_IMAGE`. **Swappable.** |
| `lineage-tree.tsx` | Primitiv: Zeitachsen-Layout, SVG-Kanten, Ahnen-Highlight, Keyboard-Nav, sticky Detail-Panel (mit Foto), Reader-Ansicht, URL-State, Hintergrund-Untermalung. |
| `LineageV1.tsx` | Section-Variante „Espalier": Serif-Kopf + Baum + Kolophon. |

## Accessibility

- Jeder Knoten ein `<button>` mit Roving-Tabindex; ←/→ Nachbarn der Zeile, ↑ Elternteil, ↓ Kind;
  Enter öffnet, Escape schließt. Fokus scrollt in den sichtbaren Bereich.
- Rot/Weiß + Epoche stehen immer im `aria-label` (nicht nur im Farbpunkt).
- `useReducedMotion()` + `motion-reduce:`-Guards; Scroll-Verhalten `auto` statt `smooth`.
- Reader-/Listen-Ansicht (Desktop-Toggle & Mobile-Default) als semantische `<ul>`-Outline.

## Daten-Status

Verwandtschaften ampelographisch belegt (Quellen im Datei-Header). Weine, Preise, Lagen und
Bilder illustrativ (Kolophon), swappable gegen Vendure/CMS.
