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

## In Arbeit

- Feature-Liste aus der Spec: als Nächstes Ark-UI-`DownloadTrigger` für die Export-Buttons.

## Warteschlange (in dieser Reihenfolge)

Restliche Bugs aus `components/cellar-canvas/STATUS.md`:
1. **`prepareImageSource`** dekodiert 50-MP-Fotos voll (~200 MB Spitze). **Zurückgestellt (2026-10-14):**
   Kandidat wäre Maße per `<img>` lesen + `createImageBitmap(blob, { resizeWidth, resizeHeight,
   resizeQuality: 'high' })`. MDN lässt offen, ob der Browser dabei schon beim Dekodieren verkleinert
   oder erst danach — ohne Speichermessung im Browser (DevTools → Memory) ist der Nutzen nicht belegbar.
   Erst messen, dann umbauen.
2. **Fullscreen-SSR** — Hydration-Mismatch für SSR-Embedder (niedrige Priorität, Showcase/Buchart58 sind client-only).

Feature-Liste aus der Spec (siehe STATUS.md „Spec-Items"), offen: Ark-UI-`DownloadTrigger`, PDF mit
Beschnitt + Schnittmarken, Lineal, Verlauf/Bild als Hintergrund, Vorlagen Rustic + Bold, SignaturePad +
Ornamente, A11y-Durchgang.
Erledigt: Strg+A, Esc, Duplizieren, Eckenradius, QR-Entfernen-Warnung, Gruppieren, Space+Drag
(Typ-Icons gab es schon).

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
  - Leertaste halten + ziehen → Ansicht verschiebt sich, Loslassen → voriges Werkzeug; Tab auf einen Button + Leertaste → Button klickt.
- **Push**, wenn die Checks passen.
- **Buchart58 nachziehen?** Die Kopie unter `Buchart58/storefront/src/atelier/cellar-canvas/` hat
  dieselben Bugs (Export-Zoom, Snap auf eigene Auswahl, X/Y bei Mehrfachauswahl; Fit vermutlich auch).
  Nicht angefasst — anderes Repo, nur auf ausdrücklichen Auftrag.

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
