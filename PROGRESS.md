# Progress — Session-Übergabe

Sessionübergreifender Arbeitsstand. Hier steht, was zuletzt erledigt wurde, was als Nächstes
dran ist und was eine neue Session wissen muss. Details pro Komponente bleiben in deren
`STATUS.md` (für Cellar Canvas: [components/cellar-canvas/STATUS.md](components/cellar-canvas/STATUS.md)).

**Stand:** 2026-10-14 · Branch `main` · lokale Commits noch **nicht gepusht**

---

## Erledigt

| Datum | Commit | Was | Verifikation |
|---|---|---|---|
| 2026-10-14 | `b6754ce` | Cellar Canvas: Hilfslinien lösen keinen Voll-Sync pro Drag-Frame mehr aus; Mehrfachauswahl rastet nicht mehr an den eigenen Kanten ein | Lint, tsc, 48 Tests |
| 2026-10-14 | `2c7e66d` | Cellar Canvas: X/Y im Properties-Panel bei Mehrfachauswahl auf die linke obere Ecke bezogen (`originOffset`) | Lint, tsc, 48 Tests, Skript gegen echtes Fabric |
| 2026-10-14 | `afed502` | Cellar Canvas: PNG/PDF-Export unabhängig vom Zoom (vorher verkleinert/verschoben nach Zoom-to-Fit) | Lint, tsc, 48 Tests, Formel aus Fabric-Quelle nachgerechnet |
| 2026-10-14 | `c446585` | Cellar Canvas: Fit to Screen — `<canvas>` füllt den Arbeitsbereich (`ResizeObserver` → `bridge.resize()`), Fit rechnet mit Label + Bleed, Hilfslinien über den sichtbaren Ausschnitt | Lint, tsc, 48 Tests · **Browser-Check offen** |
| 2026-10-14 | `f61c104` | Cellar Canvas: Stille Fehlerpfade — kaputtes Bild / QR-Fehler zeigen einen schließbaren Header-Hinweis (`insertError`), `prepareImageSource`-Ketten mit `.catch` | Lint, tsc, 48 Tests, Reject-Verhalten in Fabric-Quelle geprüft · **Browser-Check offen** |
| 2026-10-14 | `6957809` | Cellar Canvas: Tour-Neustart — Fragezeichen-Button im Header (`startTour` im Store, registriert von `OnboardingTour`) | Lint, tsc, 48 Tests · **Browser-Check offen** |
| 2026-10-14 | `6e08e71` | Cellar Canvas: Einfüge-Versatz nimmt die erste freie 8-px-Stufe statt `Anzahl % 10` | Lint, tsc, 48 Tests |
| 2026-10-14 | `f1fa1f8` | Review-Nacharbeit Fit: Maske verdeckt Validator-Badge nicht mehr (`isolate`), kein leerer Frame beim Resize (`renderAll`), Resize behält gewählten Zoom (`fitted`-Flag), Zoom feuert nur `cellar:viewport-changed` (kein Autosave/`onChange`), Vollbild ohne toten Streifen (`fitShiftX`), Grid-Zeile `minmax(0, 1fr)` | Lint, tsc, 48 Tests · **Browser-Check offen** |
| 2026-10-14 | `ce1992b` | Review-Nacharbeit Fehlerhinweis: `ImageCropperModal.onError` (Datei-Dialog/Drag & Drop), wiederholter Fehler wird neu angesagt, Schließen-Button 44 px + `aria-label` | Lint, tsc, 48 Tests · **Browser-Check offen** |
| 2026-10-14 | `e23fe0f` | Review-Nacharbeit X/Y: Größenänderung einer Mehrfachauswahl hält die linke obere Ecke; `getPositionByOrigin` statt deprecated Alias | Lint, tsc, 48 Tests, Skript gegen echtes Fabric |
| 2026-10-14 | `8b3a5b2` | Cellar Canvas: `useCanvasSync`/`useCanvasAutosave` folgen einer neuen Etikettgröße | Lint, tsc, 48 Tests |
| 2026-10-14 | `0b4cea6` | Feature: `Mod+A` wählt alle sichtbaren, nicht gesperrten Objekte; `Escape` hebt die Auswahl auf, ohne Auswahl verlässt es das Vollbild | Lint, tsc, 48 Tests, Fabric-Keymap geprüft · **Browser-Check offen** |
| 2026-10-14 | `2846148` | Feature: Duplizieren (`Mod+D` + Toolbar-Button), Auswahl wird vor dem Klonen aufgelöst | Lint, tsc, 48 Tests, Koordinaten per Skript geprüft · **Browser-Check offen** |
| 2026-10-14 | `8a17858` | Feature: Eckenradius „R" (mm) für Rechtecke in der Kontext-Toolbar | Lint, tsc, 48 Tests · **Browser-Check offen** |
| 2026-10-14 | `c39699d` | Feature: entfernter QR-Code → Validator-Fehler (rot) statt Warnung; Typ-Icons im Layer-Panel gab es schon (STATUS bereinigt) | Lint, tsc, 48 Tests, Skript mit drei Fällen |
| 2026-10-14 | `94a2f1a` | Feature: Gruppieren / Aufheben (`Mod+G` / `Mod+Shift+G` + Kontext-Toolbar); Weinfeld-Sync und Validator schauen in Gruppen | Lint, tsc, 48 Tests, Gruppenmechanik per Skript · **Browser-Check offen** |
| 2026-10-14 | `70590ef` | Feature: Leertaste halten = temporäres Hand-Tool (nur mit Fokus auf Seite/Canvas) | Lint, tsc, 48 Tests · **Browser-Check offen** |
| 2026-10-14 | `0b3463d` | Export-Buttons über Arks `DownloadTrigger`, eigener Anchor-Download entfernt (Doku-Cache `live-docs-collection/ark-ui/download-trigger.md` angelegt) | Lint, tsc, 48 Tests · **Browser-Check offen** |
| 2026-10-14 | `db59b8e` | Feature: PDF optional mit Beschnitt + Schnittmarken (`pdfBleedMm`, Default 0 = Trim-only wie entschieden) | Lint, tsc, 48 Tests, Layout gerechnet + jsPDF-Lauf (110×140 mm, 8 Marken) |
| 2026-10-14 | `b06e862` | Feature: mm-Lineal (Header-Toggle + `Shift+R`), Null an der Etikettecke | Lint, tsc, 48 Tests, Server-Render geprüft · **Browser-Check offen** |
| 2026-10-14 | `dacf57d` | Feature: Etiketten-Hintergrund Farbe / Verlauf / Bild (`LabelBackground`, Ark `SegmentGroup`, Export via `bridge.withPaper`) | Lint, tsc, 48 Tests, Gradient-Winkel gegen CSS + Fabric-Quelle geprüft · **Browser-Check offen** |
| 2026-10-14 | `ff6c3c1` | Feature: Vorlagen Rustikal + Kräftig (Rahmen nur auf der Linie klickbar) | Lint, tsc, 48 Tests · **Browser-Check offen** |
| 2026-10-14 | `e0bd216` | Feature: Unterschrift (Ark `SignaturePad`) + 4 Ornamente als neuer Ebenentyp `path` | Lint, tsc, 48 Tests, Ornamente mit Fabric geparst · **Browser-Check offen** |
| 2026-10-14 | `e667cbe` | A11y: Layer-Panel komplett per Tastatur (↑/↓, Leertaste, Enter/F2, Entf) | Lint, tsc, 48 Tests · **Browser-Check offen** |
| 2026-10-14 | `9c64648` | A11y: Toolbars mit Rolle + Pfeiltasten, benannte Buttons, `aria-disabled`, benanntes Canvas, 44 px bei Touch | Lint, tsc, 48 Tests, Pfeiltasten per jsdom · **Screenreader-Check offen** |
| 2026-10-14 | `17118b7` | Fix: kein Hydration-Mismatch bei SSR (client-only Wrapper) | Lint, tsc, 48 Tests, `renderToString` → `""` |
| 2026-10-14 | `9455071` | Showcase: Schalter „PDF mit 3 mm Beschnitt und Schnittmarken“ im Etiketten-Designer | Lint, tsc |
| 2026-10-14 | `5b89df3` | Review 2 (Daten): Gruppe nach Weindaten-Wechsel neu ausgerichtet (Flag pro Feld), duplizierte Gruppen-Mitglieder mit eigenen IDs | Lint, tsc, 48 Tests, Klon-IDs per Skript bestätigt |
| 2026-10-14 | `7823f53` | Review 2: Export wartet auf das dekodierte Hintergrundbild (`whenPaperReady`, `exportLabelPng` jetzt async) | Lint, tsc, 48 Tests |
| 2026-10-14 | `e0bee9d` | Review 2: Verlauf im PDF mit Beschnitt über das Endformat (deckt sich mit der Vorschau) | Lint, tsc, 48 Tests |
| 2026-10-14 | `7a150f8` | Review 2: kein falscher QR-Fehler nach Vorlagenwechsel/Undo (Tracking in der Bridge, Reset bei Szenen-Ersatz) | Lint, tsc, 48 Tests |
| 2026-10-14 | `a88e23a` | Review 2: Eckenradius bleibt beim Skalieren rund (`_cornerRadiusMm`, Panel + Anfasser) | Lint, tsc, 48 Tests |
| 2026-10-14 | `16db38d` | Review 2 (Tastatur): Leertaste halten scrollt nicht, kein hängendes Hand-Tool nach App-Wechsel, keine Konsolenwarnung | Lint, tsc, 48 Tests, TanStack-Quelle geprüft |
| 2026-10-14 | `3a90478` | Review 2: Esc im offenen Overlay hebt die Auswahl nicht mehr auf; verschachtelte Toolbars springen nicht doppelt | Lint, tsc, 48 Tests, Zag-Quelle geprüft |
| 2026-10-14 | `0c0c402` | Tote SSR-Zweige entfernt; Typänderung `CellarCanvasState.bg` in COMPONENT.md dokumentiert | Lint, tsc, 48 Tests, SSR-Check |

## In Arbeit

- **Buchart58-Abgleich (2026-10-14, Subagent mit Opus):** alle Cellar-Canvas-Fixes und -Features ab `b6754ce`
  werden nach `Buchart58/storefront/src/atelier/cellar-canvas/` (+ Geschwister-Kopien) übertragen, direkt auf
  Buchart58-`main`, ohne Push. Ausgenommen: Vorlagen Rustic/Bold (Buchart58 hat keine Vorlagen) und
  Showcase-Änderungen. Ergebnis steht dann in Buchart58s `cellar-canvas/STATUS.md` („Upstream-Abgleich 2026-10-14“).
- Beide Reviews (Daten/Export und Tastatur/A11y/SSR) sind abgearbeitet; alle bestätigten Befunde behoben.

## Warteschlange

Die Spec-Feature-Liste ist vollständig. Offen bleiben:
1. **`prepareImageSource`** dekodiert 50-MP-Fotos voll (~200 MB Spitze). **Zurückgestellt (2026-10-14):**
   Kandidat wäre Maße per `<img>` lesen + `createImageBitmap(blob, { resizeWidth, resizeHeight,
   resizeQuality: 'high' })`. MDN lässt offen, ob der Browser dabei schon beim Dekodieren verkleinert
   oder erst danach — ohne Speichermessung im Browser (DevTools → Memory) ist der Nutzen nicht belegbar.
   Erst messen, dann umbauen.
2. **Vorlagen-Thumbnails** und `customTemplates`-Prop (bewusst rudimentär, nicht in dieser Runde).
3. **Roving-Tabindex** in den Toolbars (heute mehrere Tab-Stopps pro Toolbar; Pfeiltasten gehen schon).
5. **Kleinkram aus Review 2, bewusst offen:** `Cmd+D`/`Cmd+G` in einem Eingabefeld lösen die Browser-Defaults
   aus (Lesezeichen/Weitersuchen), weil die Kürzel dort absichtlich nicht greifen. Hintergrundbild im PDF mit
   Beschnitt ist ein paar Prozent größer als in der Vorschau (cover über die Beschnitt-Box, damit der
   Beschnitt gefüllt ist).
6. **Embedder-Hinweis:** `CellarCanvasState.bg` ist jetzt `LabelBackground` (String oder Objekt) — für die
   Buchart58-Kopie relevant, falls dort nachgezogen wird.
4. ~~**Showcase-Demos**~~ — `pdfBleedMm` per Schalter (`9455071`); Lineal, Hintergrund, Vorlagen und
   Extras sind direkt im Editor bedienbar.

Erledigt aus der Spec: Strg+A, Esc, Duplizieren, Eckenradius, QR-Entfernen-Warnung, Gruppieren,
Space+Drag, `DownloadTrigger`, PDF-Beschnitt (opt-in), Lineal, Verlauf/Bild-Hintergrund, Vorlagen
Rustic + Bold, Unterschrift + Ornamente, A11y-Durchgang, SSR (Typ-Icons gab es schon).

## Offen beim User

- **Branches löschen** (alle bereits in `main` gemergt; der Auto-Mode-Klassifikator lässt das nicht zu):
  ```bash
  git branch -d chore/astro-7.0.7 feat/customer-account-area feat/storefront-publish-button mobile-section-responsive-fixes
  git push origin --delete chore/astro-7.0.7 fix/storefront-mobile-layout mobile-section-responsive-fixes
  ```
- **Browser-Checks im Showcase** (Claude startet keinen Dev-Server):
  - Mehrfachauswahl ziehen → rastet an anderen Objekten ein; X/Y tippen → Auswahl landet dort.
  - PNG-Export nach „Fit" → Etikett füllt das Bild exakt, kein Bleed-Streifen.
  - Fit-to-Screen: Normalansicht, Vollbild, kleines Fenster; Hilfslinien reichen über den sichtbaren Bereich.
  - Tour abschließen, dann Fragezeichen im Header → Tour startet erneut.
  - Kaputte Bilddatei (z. B. umbenannte `.txt` → `.png`) per Ersetzen/Einfügen → roter Hinweis im Header, ✕ schließt ihn.
  - Validator-Badge unten rechts im Preview-Modus sichtbar (nicht von der Maske verdeckt).
  - Fensterrand ziehen → kein Flackern; erst zoomen, dann Fenster ändern → Zoom bleibt; „Fit" passt wieder ein.
  - Vollbild → Etikett mittig im Fenster, links kein abgeschnittener Streifen.
  - Kaputte Datei über Datei-Dialog oder Drag & Drop → Cropper schließt, Hinweis erscheint.
  - Mehrfachauswahl: Breite im Panel ändern → linke obere Ecke bleibt stehen.
  - `Cmd+A` auf der Fläche → alles außer gesperrten/ausgeblendeten Ebenen ausgewählt; im Panel-Eingabefeld markiert `Cmd+A` weiter den Text.
  - `Esc`: Textbearbeitung beenden → Auswahl aufheben → (im Vollbild) Vollbild verlassen — je ein Schritt pro Druck.
  - `Cmd+D` / Kopieren-Button → Kopie 8 px versetzt; auch bei Mehrfachauswahl an der richtigen Stelle.
  - Rechteck → „R" im Kontext-Toolbar → runde Ecken.
  - QR-Code einfügen, löschen → Validator-Badge rot; Undo → wieder grün/gelb.
  - Zwei Objekte → Gruppieren-Button / `Cmd+G` → eine Ebene „Group"; Weinfeld in der Gruppe ändert sich mit den Weindaten; `Cmd+Shift+G` löst auf, Positionen bleiben.
  - PNG/PDF-Buttons laden weiterhin herunter (jetzt über Ark `DownloadTrigger`); mit `pdfBleedMm={3}` im Showcase → PDF 6 mm größer + Schnittmarken.
  - Lineal-Button / `Shift+R` → Skalen oben/links, 0 an der Etikettecke, folgen Zoom und Verschieben.
  - Hintergrund-Tab: Farbe / Verlauf (Winkel ändern) / Bild → Etikett zeigt es, PNG-Export identisch.
  - Vorlagen „Rustikal" und „Kräftig" anwenden; Klick ins leere Etikett wählt **nicht** den Rahmen.
  - Extras: Unterschrift zeichnen → Einfügen; Ornamente einfügen, über die Kontext-Toolbar umfärben.
  - Tastatur: Tab in die Werkzeugleiste, ↑/↓ wechselt; im Layer-Panel ↑/↓, Enter umbenennen, Entf löschen (löscht nur die Ebene, nicht zusätzlich die Canvas-Auswahl).
  - Leertaste halten + ziehen → Ansicht verschiebt sich, Loslassen → voriges Werkzeug; Tab auf einen Button + Leertaste → Button klickt.
- **Push**, wenn die Checks passen.
- **Buchart58:** Abgleich beauftragt (siehe „In Arbeit“); danach dort Browser-Checks und Push.

## Hinweise für weitere Sessions

- **TypeScript:** `components/` hat keine eigene `tsconfig.json`. Typcheck über den Showcase, der die
  Komponenten mitprüft: `cd components-showcase && ./node_modules/.bin/tsc --noEmit`.
  `bunx tsc -p components` scheitert (lädt ein fremdes tsc, findet keine Config).
- **Tests:** `bunx vitest run components/cellar-canvas` (6 Dateien, 48 Tests). `node-canvas` ist nicht
  installiert, Fabric kann in Tests also nicht rendern. Geometrie lässt sich mit einem Wegwerf-Skript
  per `bun` prüfen: Fabric-Objekte und `ActiveSelection` funktionieren ohne Canvas.
- **Fabric 7.4.0:**
  - Standard-Bezugspunkt ist `center`. Eigene Objekte werden mit `left/top` erzeugt (`ORIGIN` in
    `engine/object-factory.ts`), eine `ActiveSelection` bleibt `center`.
  - `toCanvasElement`/`toDataURL` schneidet in Viewport-Pixeln aus und behält Zoom + Pan
    (`node_modules/fabric/dist/index.mjs`, Suche nach `toCanvasElement(multiplier`).
  - Kinder einer `ActiveSelection` bleiben in `canvas.getObjects()`.
- **Auto-Mode:** Der Klassifikator blockt `git branch -d` und `git push --delete` als „Git Destructive"
  und danach zeitweise auch harmlose Lesebefehle. Branch-Löschungen dem User überlassen.
- **Playwright-MCP** hatte in der Session vom 2026-10-14 einen Connect-Timeout. Visuelle Checks macht
  bis auf Weiteres der User.
- **`claude.md` ist klein geschrieben im Git.** Auf macOS (case-insensitive) heißt sie im Editor
  `CLAUDE.md`, aber `git add CLAUDE.md` nimmt nichts auf — `git add claude.md` verwenden.
- **Review 2026-10-14** (Subagent, adversarial) — alle bestätigten Befunde sind behoben. Offen und
  bewusst nicht angefasst: `insertError` liegt wie der restliche Designer-State im globalen Store und
  überlebt damit einen Remount; Header-`IconButton`s sind ~28 px und nur per `title` benannt (gehört in
  den A11y-Durchgang).
- **Wegwerf-Skripte mit Fabric:** `fabric` über den absoluten Pfad
  `…/__Components__/node_modules/fabric/dist/index.mjs` importieren und Repo-Module ebenfalls absolut —
  sonst lädt Bun aus dem Scratchpad eine zweite Fabric-Instanz und `instanceof` schlägt fehl. Text
  (`Textbox`) braucht ein echtes Canvas zum Messen und läuft im Skript nicht.
- **Commit-Hashes in dieser Datei** erst im nächsten Commit eintragen — `--amend` ändert den Hash.
- **Regeln (Kurzfassung):** direkt auf `main`, pro Schritt committen, Commit-Messages ohne AI-Spuren,
  kein Push ohne Auftrag, `bun run lint` grün vor jedem Commit, keine neuen Testdateien ohne Rückfrage.
