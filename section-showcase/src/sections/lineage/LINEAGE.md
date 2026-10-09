# Stammbaum — Rebsorten-Lineage (Section)

Ein „Stammbaum" der Weinreben statt Menschen. Rebsorten sind vegetativ vermehrte Klone,
keine Generationen: Die Abstammung ist ein **Graph** (DAG), kein Baum. Zeit taugt nicht
als Layout-Achse, eine Mutation erzeugt einen Klon und kein Kind, jede Kante trägt eine
Sicherheit (DNA-bestätigt, publiziert, vermutet).

## Varianten

| Variante | Idee |
|---|---|
| **V2 — Die vier Häuser** | Galerie pro Familie: erst ein Haus wählen, dann stehen nur 6–10 Sorten auf der Bühne. Kreuzungen als beschrifteter Punkt, Brücken zu anderen Häusern gestrichelt. |
| **V3 — Eine Rebe, ein Bildschirm** | Fokus-Ansicht: immer eine Sorte groß im Zentrum mit Eltern, Kindern und Geschwistern. Verbindungen beschriftet, das Wissensende beim Urahn markiert. |
| **Buch·Art — Die Familie** | Stammbaum als Familie (Personen, keine Rebsorten); nutzt die Rebsorten-Daten nicht. |

Die frühere Variante „Espalier" (Ahnentafel nach Zeit) wurde entfernt, weil sie auf dem
alten, fachlich falschen Baum-Modell (`lineage-data.ts`) aufbaute.

## Dateien

| Datei | Rolle |
|---|---|
| `lineage-graph.ts` | Einziger Datensatz (`NODES`, `EDGES`, Typen, Graph-Helfer). Quellen je Kante inline (VIVC). Bilder, Weine, Preise illustrativ. **Swappable** gegen Vendure/CMS. |
| `lineage-layout.ts` | Layout eines Teilgraphen (`layoutSubgraph`). |
| `lineage-stage.tsx` | Bühne der Galerie-Ansicht. |
| `lineage-ui.tsx` | Geteilte Kleinteile (`ColourDot`, `RebstockCTA`). |
| `LineageV2.tsx`, `LineageV3.tsx`, `LineageBuchArt.tsx` | Section-Varianten. |
| `manifest.ts` | Registrierung im Showcase. |

## Daten-Status

Verwandtschaften gegen VIVC geprüft (Quellen im Datei-Header von `lineage-graph.ts`).
Weine, Preise, Lagen und Bilder illustrativ.
