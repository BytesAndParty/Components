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

## In Arbeit

- **Einfüge-Versatz** (siehe Warteschlange 1)

## Warteschlange (in dieser Reihenfolge)

Bugs aus `components/cellar-canvas/STATUS.md`:
1. **Einfüge-Versatz** zählt Objekte statt freie Plätze.
2. **Dimensionswechsel zur Laufzeit** — `useCanvasSync`/`useCanvasAutosave` hängen an der alten Canvas.
3. **`prepareImageSource`** dekodiert 50-MP-Fotos voll (~200 MB Spitze).
4. **Fullscreen-SSR** — Hydration-Mismatch für SSR-Embedder (niedrige Priorität, Showcase/Buchart58 sind client-only).

Danach die Feature-Liste aus der Spec (siehe STATUS.md „Spec-Items"): Strg+A, Esc, Duplizieren,
Gruppieren, Eckenradius, Typ-Icons im Layer-Panel, QR-Entfernen-Warnung, Lineal, Verlauf/Bild als
Hintergrund, Vorlagen Rustic + Bold, PDF mit Beschnitt + Schnittmarken, Ark-UI-`DownloadTrigger`,
SignaturePad + Ornamente, A11y-Durchgang.

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
- **Regeln (Kurzfassung):** direkt auf `main`, pro Schritt committen, Commit-Messages ohne AI-Spuren,
  kein Push ohne Auftrag, `bun run lint` grün vor jedem Commit, keine neuen Testdateien ohne Rückfrage.
