# Übergabe: Kontrast-Hero zur 3D-Flaschenbühne

Temporärer Speicher vom 2026-11-10 für die nächste Session. **Nach der Umsetzung löschen**; was dauerhaft gilt, steht schon in `CLAUDE.md`, `COMPONENT-GUIDELINES.md` §11, `KNOWN-ISSUES.md` (Punkt 13, Fragen 6 bis 9) und den `COMPONENT.md` der beiden Komponenten.

## Auftrag

Einen zweiten Hero im Section-Showcase bauen, der dieselben 3D-Bausteine nutzt wie die „Flaschenbühne (3D)", aber **im völligen Kontrast** dazu steht. Wunsch des Users vom 2026-11-10, wörtlich: „eine weitere Page dieser Art, aber in völligem Kontrast".

User Story (Annahme, vom User nicht ausdrücklich bestätigt, sie folgt der Story des ersten Heros): Als Betreiber der Bibliothek möchte ich im Section-Showcase eine zweite, gegensätzliche 3D-Variante zeigen, damit Kunden sehen, dass dieselbe Technik sehr verschiedene Markenwelten trägt. Vor dem Bauen kurz bestätigen lassen.

## Stand am Ende der Session vom 2026-11-10

- Der erste Hero ist fertig, im Browser geprüft und in drei Commits auf `main` committet (`shader-backdrop`, `bottle-stage`, Hero mit Demos und Doku). Der User hat auch den Push beauftragt. **Als Erstes prüfen:** `git status -sb` (steht dort noch `ahead`, ist der Push nicht durchgegangen) und `git log --oneline -5`.
- Ein Code-Review per Subagent ist gelaufen. Sechs Befunde sind behoben, der Rest steht als offen in `KNOWN-ISSUES.md` #13. **Die Fixes sind nur per Lint, Typecheck und Tests geprüft, nicht mehr im Browser.** Beim ersten Sichtcheck der neuen Session deshalb auch den alten Hero kurz ansehen (`?s=hero:bottle-3d`): Sind „Zur Kollektion" und „Mehr zum Jahrgang" klickbar, folgt die Flasche einem Akzentwechsel?
- **Nicht angefasst und nicht committet:** sechs geänderte Dateien unter `components/cellar-canvas/` (`STATUS.md`, `engine/object-factory.ts`, `engine/object-properties.ts`, `engine/object-properties.test.ts`, `engine/units.ts`, `templates/templates.ts`). Sie stammen aus einer anderen Arbeit.
- Im Repo `__AI-Workflow__` liegen uncommittete Änderungen aus dieser Session: der live-docs-Eintrag `skills/live-docs-collection/react-three-fiber/`, eine Zeile in dessen `README.md` und der neue Abschnitt „Prüfauftrag zuschneiden" in `shared/guidelines/subagent-validation.md` (schon nach `config/CLAUDE.md` synchronisiert). Die `README.md` dort hatte schon vorher fremde Änderungen.

## Was es schon gibt

| Baustein | Datei | Wofür |
|---|---|---|
| `ShaderBackdrop` | `components/shader-backdrop/shader-backdrop.tsx` | fließender WebGL-Hintergrund, drei CSS-Farben, ohne Lib |
| `BottleStage` | `components/bottle-stage/bottle-stage.tsx` | 3D-Flasche (three.js + React Three Fiber), Form von der echten Buchart58-Flasche |
| Erster Hero | `section-showcase/src/sections/hero/HeroBottle3D.tsx` | Vorlage für Aufbau, Lazy-Loading, Etikett als SVG-Data-URL |
| Registrierung | `section-showcase/src/sections/hero/manifest.ts` | neue Variante hier eintragen |

Vor dem Bauen lesen: die beiden `COMPONENT.md` (Props und Fallen) und `HeroBottle3D.tsx`. Mehr Code braucht es nicht.

Props, über die der Kontrast entsteht, ohne die Komponenten anzufassen:

- `ShaderBackdrop`: `colors` (Grund, Falten, Glanz als CSS-Farben), `speed`, `scale`, `grain`.
- `BottleStage`: `glassColor`, `capsuleColor`, `labelSrc` (Bild etwa 5:7 hochkant), `progress` (optional, Scroll-Drehung), `turns`, `followPointer`.

## Der erste Hero, gegen den der Kontrast stehen soll

Dunkel und inszeniert: fast schwarzer, weinroter Grund, Shader in Akzentfarbe, weiße Serif-Headline links, Flasche rechts. Die Sektion ist 220vh hoch mit `sticky`-Bühne; beim Scrollen wandert die Flasche in die Mitte, dreht das Etikett nach vorn, die Headline weicht den Eckdaten. Rotweinflasche mit fast schwarzem Glas, Verschluss in Akzentfarbe, cremefarbenes Platzhalter-Etikett „Atelier · Cuvée Nº 7".

## Vorschlag für den Kontrast

Vom User noch nicht freigegeben, in der alten Session nur als Skizze genannt. Vor dem Bauen kurz bestätigen lassen oder Alternativen anbieten (Regel `feature-discussion`: Warum diese Lösung, warum klappt sie, woran kann sie scheitern).

- **Hell statt dunkel:** cremefarbener Grund, Shader in Papier- und Sandtönen, sehr langsam, wenig Körnung.
- **Weißwein statt Rotwein:** grünes Glas wie beim Grünen Veltliner im Shop (Foto: `Buchart58/storefront/dist/_astro/gruener-veltliner-sooss__preview_*.webp`; dort cremefarbenes Etikett mit grünem Namensband, schwarzer Schraubverschluss).
- **Ruhig statt inszeniert:** kein Sticky-Scroll. Eine Bildschirmhöhe, die Flasche steht groß in der Mitte, Typografie klein und streng außen herum (Grotesk statt Serif wäre ein zusätzlicher Bruch).
- **Markenfrei bleiben:** Der erste Hero ist als markenfreie Demo entschieden. Kein „Wachau", kein „seit 1958" (siehe `KNOWN-ISSUES.md` #3). Ein echtes Buchart58-Etikett wäre eine eigene Entscheidung (Frage 6 in `KNOWN-ISSUES.md`).

Arbeitsnamen: Datei `HeroBottleLight.tsx`, Varianten-ID `bottle-light`.

## Bekannte Risiken für genau diese Variante

- **Grünes Glas kann wie Plastik aussehen.** Das Glas ist ein undurchsichtiges Material, es gibt keine Lichtdurchlässigkeit. Beim ersten Hero wirkte ein helleres Grün (`oklch(0.2 0.045 150)`) unter dem Studiolicht wie grünes Plastik, erst fast schwarzes Glas (`oklch(0.08 0.025 150)`) sah nach Glas aus. Erst ein dunkles Olivgrün versuchen (Größenordnung `oklch(0.14 0.04 130)`). Reicht das nicht, bräuchte `BottleStage` echte Transmission (`transmission`, `thickness` am `meshPhysicalMaterial`); das ist eine Änderung an der Komponente und kostet GPU. Vorher mit dem User abstimmen.
- **Lichtstreifen auf hellem Grund.** Die Reflexe sind fast weiß und leben vom dunklen Hintergrund. Auf Creme trägt eher die dunkle Silhouette als die Glanzlichter. Möglicherweise braucht die Flasche einen weichen Schatten oder einen dunkleren Hof hinter sich (CSS-Verlauf im Hero, nicht in der Komponente).
- **Textkontrast.** Auf hellem Shader dunkle Schrift verwenden und den Kontrast an der hellsten und dunkelsten Stelle des Shaders prüfen; im ersten Hero hält ein Scrim den Text lesbar.
- **Theme-Tokens.** Der erste Hero ist in jedem Theme dunkel und nutzt feste Farben plus `var(--accent)`. Der helle Hero sollte genauso fest hell sein, sonst kippt er im Dark-Theme.

## Technische Fallen, die schon gelöst sind

Stehen ausführlich in `COMPONENT-GUIDELINES.md` §11 und in `components/bottle-stage/COMPONENT.md`, hier nur als Erinnerung:

- `BottleStage` immer per `React.lazy` in einem `Suspense` laden (Chunk 246 KB gzip).
- Der Wrapper von `BottleStage` braucht eine Höhe; `ShaderBackdrop` wird mit `className="absolute inset-0"` platziert.
- Etikett als SVG: nur Systemschriften, ein als Bild geladenes SVG lädt keine Webfonts.
- Eine Ebene, die über Links liegt und nichts Klickbares enthält, braucht `pointer-events-none`, auch wenn sie unsichtbar ist. Genau das hat im ersten Hero die Links blockiert.
- Reduced Motion: `BottleStage` ignoriert dann `progress` und steht still mit dem Etikett nach vorn. Das Layout muss dafür stimmen (im ersten Hero stand die Flasche sonst mitten über der Headline).
- Konsolenwarnung `THREE.Clock … deprecated` kommt aus React Three Fiber selbst und ist kein Fehler im eigenen Code.

## Ablauf

1. Stand prüfen (siehe oben), `KNOWN-ISSUES.md` lesen.
2. Konzept und User Story kurz bestätigen lassen.
3. `HeroBottleLight.tsx` schreiben, in `manifest.ts` eintragen.
4. Skill `components-verify`: `bun run lint`, `cd section-showcase && bun run typecheck`, `bun run test`.
5. Sichtcheck nach dem Abschnitt „Selbst im Browser nachsehen" im Skill `components-verify`: Dev-Server als Hintergrund-Task auf Port 5174, `http://localhost:5174/preview?s=hero:bottle-light`, Screenshots bei 1440 px und 390 px, dazu Reduced Motion. Server danach über genau diesen Task beenden, Port mit `lsof -i :5174` bestätigen.
6. Review per Subagent nach der neuen Regel „Prüfauftrag zuschneiden": nur Kernfunktionen benennen (z. B. Flasche rendert auf hellem Grund, Text bleibt lesbar, Reduced Motion zeigt ein stimmiges Standbild, Mobil-Layout ohne Überlappung), kein Rundumschlag. Modell `opus`.
7. Dem User zeigen, erst auf sein Signal committen. Diese Datei im selben Commit löschen.

## Kontingent

Der User hatte am 2026-11-10 nur noch wenig Usage übrig. Sparsam arbeiten: keine neuen Komponenten, keine Änderungen an `BottleStage` ohne Rückfrage, Review eng zuschneiden.
