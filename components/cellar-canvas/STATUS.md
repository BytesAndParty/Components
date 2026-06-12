# Cellar Canvas — Status & Bug Log

> Lebendes Dokument zum aktuellen Stand des Minimal-Editors für Weinetiketten.
> Bugs, Entscheidungen, Workarounds werden hier kurz festgehalten.
> High-Level-Vision und Roadmap liegen in `/CELLAR-CANVAS.md` im Repo-Root.

---

## Aktueller Stand

| Bereich              | Stand                                                                 |
|----------------------|------------------------------------------------------------------------|
| Canvas               | Fabric v7 via `use-fabric-canvas.ts`, mm/px Umrechnung steht. Symmetrische 40 mm Bleed-Margin rundherum; Label-Backdrop wird als CSS-`<div>` in `LabelCanvas` gerendert (NICHT mehr als Fabric-Objekt) und tracking-aligned via Fabric-Zoom + Viewport-Transform. User-facing `x/y` bleibt label-relativ. |
| Tools                | Rect / Circle / Line / Text (Textbox mit Word-Wrap) / Image / QR-Code addbar. Text-Click-to-Edit per `mouse:up` + Drag-Threshold; `hiddenTextarea` wird in `canvas.wrapperEl` umgehängt damit Edit auch in modalen Subtrees funktioniert. |
| History              | ✅ Undo/Redo (50 Steps) via Zustand. Snapshot ist die volle `serializeState`-Form `{ canvas, bg }` — Bg-Color partizipiert seit 2026-05-26 an Undo/Redo. Alte plain-canvas-Snapshots aus localStorage werden weiterhin akzeptiert (Backward-Compat). |
| Shortcuts            | ✅ TanStack Hotkeys (mod+z, mod+shift+z, del, backspace) inkl. Registry. |
| Zoom                 | ✅ Zoom-to-Fit fittet den vollen Canvas-Pixelbereich (Label + Bleed). Wheel/Pinch auf der Canvas zoomt cursor-zentriert via `canvas.zoomToPoint` mit `preventDefault` gegen Browser-Page-Zoom. |
| Fullscreen           | ✅ CSS-Fullscreen (`fixed inset-0 z-50`) statt der Browser-Fullscreen-API — Escape exitet. Vorher schluckte die API-Variante Keyboard-Input in Fabric's `hiddenTextarea` (Focus-Restriktion auf Subtree). |
| Properties Panel     | x / y / rotation / opacity verdrahtet; w / h pro Objekttyp (Rect via scale, Circle via radius, Line via x2, Textbox direkt). |
| Context Toolbar      | Text (Font/Size/Bold/Italic/Underline/Align/Color/Letter-Spacing/Line-Height) + Shape Fill/Stroke/Stroke-Width + Image (Crop / Replace / Opacity) + StackOrderControls + AlignmentBar (live). |
| Snap-to-Grid         | ✅ `SnapManager` (engine/snap-manager.ts) zeichnet Smart Guides bei `object:moving`, snappt zu Kanten/Mittellinien anderer Objekte + Label-Center. Toggle per Header-Button (Magnet) + `S`-Hotkey; Alt unterdrückt Snapping pro Drag. Guides werden bei `mouse:up` und `selection:cleared` weggeräumt. |
| Background           | ✅ ColorSwatch im rechten Panel-Tab (`Background`), `bridge.setBackground` setzt `labelColor` Instance-Prop + `isDirty`. Wird per `serializeState` mitpersistiert (`{ canvas, bg }`). |
| Wine Fields          | 6 Felder + QR-Code, `_fieldKey` Metadata.                              |
| Validator            | EU-Reg. 2023/2977 — alcohol, volume, allergen, QR.                     |
| Layer Panel          | Listet alle User-Objekte (Backdrop ist DOM, nicht im Stack). Rename / Visibility / Lock / Delete / Reorder. Programmatic Reorder (Bring-to-Front etc.) wird via `framer-motion layout="position"` sanft animiert, dnd-kit owns die Animation während aktiver Drags. |
| Clipboard Paste      | ✅ `Cmd/Ctrl+V` mit Bilddaten landet direkt auf der Canvas (kein Cropper). |
| Persistence          | ✅ Debounced (1 s) localStorage-Autosave + `onSave`-Callback (async, Idle/Saving/Success/Error-Button). Restore aus `initialState` → localStorage → leerer Canvas. Serialisierter State = `{ canvas, bg }`. `storageKey`-Prop overridable, `null` deaktiviert. |
| Image Crop           | ✅ Pre-measured `naturalSize` + `viewportSize` vor Mount, korrekter `defaultZoom` + `initialCrop`. `naturalSize` ist src-gegated, damit sequenzielle Uploads keine stale Messungen weiterreichen (Bug #24). Apply rendert eigene High-Res-Canvas in **Source-Pixel-Auflösung** (`crop.width / zoom`, capped bei 4096 px) statt Zags Viewport-Pixel-Output — keine Quality-Loss beim Übergang Cropper → Canvas. **Re-Crop:** Über ContextToolbar für selektierte Bilder möglich; behält ID und Position bei. |
| Bleed Mask + Preview | ✅ Vier semi-transparente CSS-Stripes (`pointer-events:none`, `z-40`) überlagern den Bleed-Bereich. Design-View ~55 % opak (überlaufende Objekte bleiben lesbar), Preview-Toggle (Eye-Icon Header) schaltet auf 100 % → Bleed verschwindet, nur das druckbare Etikett ist sichtbar. **3 mm Print-Bleed-Indikator:** Maske reicht im Design-Mode 3 mm INS Label hinein — der entstehende dunklere Randstreifen markiert die Trim-Risiko-Zone (kein wichtiger Inhalt). Preview-Mode unterdrückt das (echter Druck-Look). |
| i18n                 | ✅ `messages.ts` (en+de) + `messages?`-Prop. Locale aus globalem `I18nProvider`; ~60 Strings verteilen sich über einen scoped Messages-Context auf alle Subcomponents (kein Prop-Drilling). |
| Onboarding Tour      | ✅ 5-Step Ark UI Tour (Welcome / Canvas / Wine Data / Layers / Save). DOM-Anchors via `[data-tour=...]`. Auto-Start mit 400 ms Delay, `cellar-canvas-tour-completed`-Flag in localStorage; `disableTour`-Prop + `tourStorageKey`-Prop. |
| Extras-Panel         | ✅ 4. Tab "Extras" mit `emoji-picker-react`. Click landet als `fabric.Textbox` (fontSize 48, Layer-Label `"Emoji 🍷"`, `_extras: true` Meta). Picker-Theme syncen wir via MutationObserver auf `data-theme`. |
| Export               | ✅ PDF in Label-Trim-Größe (300 dpi via Fabric `toDataURL` + `jspdf`), Download via Header-Button. `onExport({ format: 'pdf', blob })`-Callback für Server-Upload. PNG-Export + Bleed-PDF mit Crop-Marks bleibt offen. |
| Multi-Area           | ⏸ out of scope — eine Canvas (Front).                                  |

---

## Offen

### Roadmap-Items (CELLAR-CANVAS.md)

**Später / Zum Schluss:**
- **Templates** — 5 Built-in (Classic / Modern / Rustic / Minimal / Bold) als Fabric-JSON + `TemplatesPanel`. `customTemplates`-Prop für app-spezifische. *Allerletzter Roadmap-Punkt.*

**Out of Scope** (vorerst zurückgestellt):
- ~~Multi-Area Tabs (Front / Back / Neck)~~ — eine Canvas reicht.

### Spec-Items aus Feature-Inventory (CELLAR-CANVAS.md)

- **Ruler-Overlay** (mm-Skala an Canvas-Rändern, toggleable).
- **Pan-Tool** — aktuell nur Tool-Switch ohne Funktion. Plan: Space+Drag, oder eigenes Pan-Mode.
- **Background Image** — neben Color auch Image (im `BackgroundPanel`).
- **Group / Ungroup** für Layer.
- **Duplicate** (Layer / Selection).
- **Strg+A** (Select-All) — selektiert alle User-Objekte; mit Active-Selection-Rebuild damit Alignment/Distribute direkt drauf laufen kann.
- **Esc** — discardet aktive Selection bzw. exitet Text-Edit-Mode; muss mit dem `hiddenTextarea`-Lifecycle abgestimmt sein.

### Tech-Debt / Known Limitations

- ~~Bg-Color nicht in Undo/Redo-History~~ — **gefixt 2026-05-26**: `saveHistory` schreibt jetzt die volle `{ canvas, bg }`-Form, `setBackground` ruft `saveHistory` nach jeder Mutation, `restoreHistory` lädt beide Werte zurück. Backward-Compat für alte plain-canvas-Snapshots in localStorage bleibt.
- ~~`cellar:property-changed` feuert teils mehrfach pro logischer Aktion~~ — **entschärft 2026-05-26**: `useCanvasSync` debounct den Sync-`update`-Callback per `queueMicrotask`. Mehrere Events im selben Tick (Stack-Op + Selection-Restore, `alignSelected`-Mass-Mutationen, Bridge-Property-Changes) kollabieren zu genau einem `update()`-Aufruf. `saveHistory` bleibt ungedrosselt — jede `object:modified` ist eine diskrete User-Aktion und verdient einen eigenen History-Eintrag.
- ~~ContextToolbar Image-Branch unvollständig~~ — **gefixt 2026-05-26**: Crop + Replace + Opacity sind verdrahtet. Replace nimmt eine neue Datei aus dem File-Picker und schreibt direkt via `bridge.updateImageSource(targetId, dataUrl)` — kein Cropper-Dialog, ID + Position + Layer-Meta bleiben.
- ~~`updateActiveObject` / NumberInputs triggern keine History~~ — **gefixt 2026-06-08**: `bridge.updateActiveObject` ruft nun `saveHistory()` auf. Damit sind manuelle Geometrie-Eingaben über Undo/Redo abgedeckt.
- ~~Layer Panel zeigt Snap-Guides~~ — **gefixt 2026-06-08**: `bridge.getLayers` filtert jetzt Objekte ohne `_type` Meta-Property (wie interne Hilfslinien) aus.
- ~~Performance-Lag bei Canvas-Events~~ — **gefixt 2026-06-08**: `useCanvasSync` nutzt nun verschiedene Update-Modi (`full`, `geometry`, `viewport`) und überspringt teure Operationen (Ebenen-Re-Snapshot, Validation) während flüssiger Bewegungen wie Dragging oder Zooming.
- ~~ContextToolbar Redundanz~~ — **gefixt 2026-06-08**: `ContextToolbar` erhält `activeProps` direkt vom optimierten Parent-Hook; eigene Listener und interner State entfernt.
- ~~Veraltete Weindaten auf Canvas~~ — **gefixt 2026-06-08**: `CellarCanvas` synchronisiert Text-Inhalte von `wine-field` Objekten nun automatisch mit der `initialWineFields`-Prop.
- ~~Doppelte Wein-Felder möglich~~ — **gefixt 2026-06-08**: `WineFieldsPanel` deaktiviert Buttons für bereits platzierte Felder.

---

## Refactoring-Analyse (2026-06-12)

> Basis: fallow health/dead-code + manuelle Sichtung aller Engine-/Store-Dateien.
> Umfang: ~3.700 LOC · Testabdeckung: nur `wine-fields/validator.test.ts`.

### Einschätzung

Die Architektur-Idee trägt (Fabric = Geometrie-Wahrheit, Zustand = UI-Metadaten,
Sync nur in Effekten; `use-canvas-sync` mit Microtask-Debounce und Update-Modi ist
durchdacht). Drei Dinge sind ihr aber entwachsen: `fabric-bridge.ts` ist ein
877-LOC-God-Object, die History hat zwei Halb-Besitzer, und die Bild-Quellen sind
inkonsistent (Reload-Bug, F1). Refactoring lohnt — als gezielte Modul-Extraktion
mit Tests dort, wo fallow CRAP > 200 meldet, nicht als Rewrite.

### fallow-Evidenz

| Fundstelle | Metrik |
|---|---|
| `fabric-bridge.ts updateActiveObject` (:544) | cyclomatic 21 · cognitive 20 · **CRAP 462** |
| `snap-manager.ts handleMoving` (:45) | cyclomatic 15 · cognitive 22 · CRAP 240 |
| `ContextToolbar.tsx` (:17) | cyclomatic 15 · 137 Zeilen · CRAP 240 |
| `CellarCanvas.tsx CellarCanvas` (:126) | 270 Zeilen Komponentenfunktion |
| `designer-store.ts` | 54 LOC, 7 Dependents — klein & sauber, **kein** Ziel |

CRAP > 200 = hohe Komplexität × null Tests. Hebel: komplexe Pfade in pure
Functions ziehen und testen.

### Befunde

- **F1 — Bug, Datenverlust:** Crop-Apply (`CellarCanvas.tsx:194`) und
  Clipboard-Paste (`use-clipboard-paste.ts:36`) erzeugen `blob:`-URLs;
  Toolbar-Upload und Drag&Drop nutzen Data-URLs. Fabric serialisiert `src`
  wörtlich in Autosave + History → gecroppte/gepastete Bilder sind nach Reload
  tote Referenzen. Zudem fehlt `revokeObjectURL` (Leak).
- **F2 — God-Object:** Bridge bündelt History, Serialisierung, 7 Objekt-Fabriken,
  Property-Mapping mm↔px (beide Richtungen), Stack-Ops, Alignment, Background,
  Viewport, Layer-Ops. Die `add*`-Fabriken wiederholen je ~30 Zeilen Boilerplate
  (Corner-Style, Origin-Pinning, Meta-Assign, add→activate→render→saveHistory)
  ≈ 150 LOC Dopplung.
- **F3 — History, zwei Halb-Besitzer:** Store besitzt Stack/Index
  (`designer-store.ts:32`), Bridge besitzt Save/Restore/Lock
  (`fabric-bridge.ts:154`); `undo()` koppelt beide via `getState()`.
  `restoreHistory` ist async ohne Reentrancy-Guard — schnelles Cmd+Z-Hammering
  startet überlappende `loadFromJSON`-Läufe.
- **F4 — Snapshot-Gewicht:** Jeder History-Step ist eine Vollkopie inkl.
  Base64-Bilder. 2-MB-Foto × 50 Steps ⇒ bis ~100 MB Heap nur für Undo —
  plausibelste Wurzel der Performance-Lags aus `b0f78da`.
- **F5 — Drei Benachrichtigungswege:** native Fabric-Events, Custom-Channel
  `cellar:property-changed` (8× `as any`), manuelles `setLayers`-Spiegeln durch
  Aufrufer (`use-canvas-sync.ts:17`, „panel snap-back"). Wer eine Bridge-Methode
  ergänzt, muss raten, welcher Weg greift.
- **F6 — Teardown-Falle:** `canvas.off('selection:created')` ohne Handler-Ref
  (`use-canvas-sync.ts:133`) entfernt **alle** Listener dieses Events — aktuell
  verdeckt, weil Teardown ≈ Dispose, aber fragil.
- **F7 — Root zu fett:** Wine-Field-Sync, Crop, PDF-Export, Drag&Drop, Hotkeys,
  Fullscreen-Escape, Portal in einer 270-Zeilen-Komponente.

### Plan (commit pro Schritt, jeweils mit Verify)

| # | Schritt | Verify | Aufwand |
|---|---|---|---|
| 1 | **F1-Fix:** `imageSourceFromBlob(blob)`-Helper (Data-URL), alle 4 Upload-Pfade darüber | croppen/pasten → Reload → Bild da; Unit-Test | S |
| 2 | Objekt-Fabriken → `engine/object-factory.ts` (gemeinsames `CORNER_STYLE` + `attach(meta)`), Bridge delegiert | Tests grün + alle 7 Insert-Wege im Showcase | S |
| 3 | mm↔px-Mapping aus `get/updateActiveObject` → pure Functions in `object-properties.ts`, **Unit-Tests pro Objekttyp** | CRAP 462 ⇒ < 50 | M |
| 4 | History → `engine/history-manager.ts` (Stack + Index + Reentrancy-Lock); Store behält nur `canUndo/canRedo/isDirty` | Tests: push/undo/redo/Limit/Reentrancy; Cmd+Z-Hammering | M |
| 5 | Snapshot-Diät: Bild-Registry (`id → src`), Snapshots referenzieren statt kopieren | Heap-Vergleich: 3 Fotos × 30 Steps | M |
| 6 | Benachrichtigung vereinheitlichen: Custom-Channel für alle non-emitting Mutationen, `setLayers`-Hatch raus, typisierte Events, Teardown mit Handler-Refs | Layer-Panel: reorder/lock/hide/rename ohne Snap-back | M |
| 7 | Root entschlacken: `use-wine-field-sync` / `use-canvas-hotkeys` / `use-image-drop` | tsc + Showcase-Smoke | S |
| 8 | snap-manager: Guide-Kandidaten als pure Function + Tests | CRAP 240 ⇒ < 50 | S |

Reihenfolge bewusst: 1 ist User-facing Bugfix, 2–3 mechanisch (senken Risiko für
4–5, die Operation am offenen Herzen), 6–8 Aufräumen mit Eigenwert.
**Nicht anfassen:** `designer-store.ts` und die `use-canvas-sync`-Update-Modi
(nur Teardown ändert sich in Schritt 6). Neue Features (Templates, Background-Image,
Group/Ungroup) erst **nach** Schritt 4 — sie setzen sonst auf dem Doppel-Besitz auf.

---

## Entscheidungs-Log

### #24 — ImageCropper-Drift bei sequenziellen Uploads *(2026-05-25 — gefixt)*

**Symptom:** Erster Upload → Cropper liefert pixel-genau das, was selektiert war (Fix aus #21 hält). Beim zweiten/dritten Upload in derselben Session driftete das Ergebnis leicht ab — verschoben oder falsch skaliert wie vor #21.

**Root Cause:** `naturalSize` (im `ImageCropperModal` pre-gemessen) trug keine Identität — nur `{ width, height }`. Beim Re-Open mit neuem `imageSrc` konnte ein Render-Frame entstehen, in dem `naturalSize` noch von Bild A stand, `imageSrc` aber bereits B war. In diesem Frame galt `ready = true`, `ImageCropper.Root` mountete mit `defaultZoom`/`initialCrop`, die aus den **alten** A-Dimensionen für den **neuen** B-Viewport berechnet waren. Die `cancelled`-Flag im Pre-Decode-Effect verhinderte zwar stale `setNaturalSize`-Calls, aber sie verhinderte nicht, dass eine bereits-gesetzte alte Messung gegen das neue `imageSrc` ausgewertet wurde.

**Fix:** `naturalSize`-State trägt jetzt zusätzlich das `src`-Feld der Messung. Das `ready`-Gate prüft `naturalSize.src === imageSrc`. Stale Messungen werden damit automatisch verworfen — der Cropper bleibt im Loading-Shell, bis das neue Bild komplett gemessen ist. Das alte `setNaturalSize(null)`/`setViewportSize(null)` im `onOpenChange(false)`-Handler ist durch die Identitäts-Bindung obsolet geworden und wurde entfernt. Reproducer aus dem Bug-Log (zwei verschiedene Fotos, dieselbe Crop-Region) liefert jetzt identische Outputs.

### #23 — Fullscreen schluckte Tastatur-Input in Text-Edit *(2026-05-25 — gefixt)*

**Symptom:** Cursor liess sich im Fullscreen-Mode setzen, Enter funktionierte, aber Buchstaben-Tasten kamen nicht im Text an. Im normalen Mode lief Edit sauber.

**Root Cause:** Die Browser-Fullscreen-API (`Element.requestFullscreen`) beschränkt Focus auf Descendants des Fullscreen-Elements. Fabric's `hiddenTextarea` wird per Default an `document.body` angehängt — landet damit *außerhalb* des Fullscreen-Subtrees. Reparenting nach `canvas.wrapperEl` half nur teilweise (Timing + interne Fabric-Focus-Restores).

**Fix:** Migration auf CSS-Fullscreen (`fixed inset-0 z-50 p-4`). Sichtbar identisch (volle Viewport-Fläche), aber ohne Focus-Restriktion. `Escape`-Key-Handler exitet. Browser-API-Code (`requestFullscreen` / `fullscreenchange`) komplett raus. Reparent-Logik für `hiddenTextarea` bleibt drin als belt-and-suspenders falls jemand doch noch die echte API triggert.

### #22 — `sendToBack` versteckte Objekte hinter dem weißen Label *(2026-05-25 — gefixt)*

**Symptom:** "Bring to Back" / Drag-Reorder-an-die-letzte-Position schob das Objekt visuell aus dem Label raus — es lag plötzlich hinter dem weißen Hintergrund-Rect und war unsichtbar.

**Root Cause:** Der Label-Backdrop war als Fabric-`Rect` im Object-Stack (Index 0). `canvas.sendObjectToBack(userObj)` schob den User-Obj auf Index 0 → das Label rutschte auf Index 1 und lag damit *über* dem User-Obj.

**Fix (kurzfristig, dann besser):** Initial mit `pinLabelToBottom()`-Helper nach jeder Stack-Op + `+1`-Offset im `reorderLayers`. Funktionierte, aber roch nach Workaround. **Definitive Lösung:** Label-Backdrop aus dem Fabric-Stack komplett rausgezogen — wird jetzt als CSS-`<div>` in `LabelCanvas` gerendert. Vorteile:

- Stack-Mutationen touchen nur User-Objekte; keine Pin-Logik nötig
- Layer-Panel zeigt ausschließlich User-Objekte; kein `_isLabel`-Filter
- `getActiveObjectProperties` braucht keinen Defensive-Skip
- History serialisiert nur User-Content; kein Re-Pin nach `loadFromJSON`

`labelColor` lebt als private Instance-Prop am Bridge. `LabelCanvas` bekommt ein `backdrop`-Prop mit DOM-Koordinaten + Farbe + Shadow; `CellarCanvas` rechnet die Koords aus Fabric-`zoom` + `viewportTransform` aus und re-rendert via `cellar:property-changed`-Listener bei jedem View-Change. Trade-off: Bg-Color nicht in History (siehe Open-Liste).

### #21 — ImageCropper schneidet den falschen Bereich aus *(2026-05-25 — gefixt)*

**Symptom:** Der ausgewählte Crop-Bereich im `ImageCropperModal` deckt sich nicht mit dem, was nach `addImage` auf der Canvas landet — leicht verschoben, falsch skaliert.

**Root Cause:** Race zwischen `setDefaultCrop` und `setZoom(fit)` im Cropper-Lifecycle:

1. `ImageCropper.Root` mountete mit `defaultZoom={1}`. Das Bild rendert in Zags Layout-Modell an seiner natürlichen CSS-Größe — bei großen Fotos überläuft die Layout-Box den 600×340-Viewport.
2. Sobald `viewportRect` gemessen war, rief Zags Machine `setDefaultCrop` und setzte die Selection auf 80 % des Viewports (`computeDefaultCropDimensions` in `@zag-js/image-cropper/dist/image-cropper.utils.js`).
3. `FitZoomOnLoad` schoss **danach** los und rief `setZoom(fitZoom)` (z. B. 0,085). Das Bild schrumpfte visuell auf Viewport-Größe — die Selection-Rect blieb aber in Viewport-Pixeln stehen und deckte plötzlich mehr als das sichtbare Bild ab.
4. Bei Apply rechnete `drawCroppedImageToCanvas`: `sourceWidth = crop.width / zoom`. Mit dem geschrumpften Zoom überschritt das `naturalSize.width` → der Browser sampled über die Bildränder hinaus, das Output-Canvas (in Viewport-Pixeln) stretchte das Ergebnis um genau jenen Faktor `crop.width / (naturalSize.width × fitZoom)`. Genau die wahrgenommene Verschiebung + Skalierung.

**Fix:** `naturalSize` per Hidden-`new Image()` und Viewport-Größe per `ResizeObserver` ermittelt **bevor** `ImageCropper.Root` mountet. Dann `defaultZoom={fitZoom}` plus passendes `initialCrop={…}` (95 % der sichtbaren Bildregion, in der Viewport-Mitte) direkt als Props mitgegeben — Zags allererstes `setDefaultCrop` sieht damit bereits die korrekt sichtbare Bildregion. `FitZoomOnLoad` ersatzlos entfernt. Während der Mess-Phase rendert ein dünnes Loading-Skeleton (`m.loading`), die Modal-Höhe bleibt stabil (kein Layout-Shift). Reset der gemessenen Werte läuft im `onOpenChange`-Handler (nicht im Effect), um den React-Compiler `set-state-in-effect`-Lint sauber zu halten.

**Follow-up: Source-Pixel-Output statt Viewport-Pixel-Output.** Zags `getCroppedImage` rendert das Ergebnis-Canvas in `crop.width × crop.height` Viewport-Pixeln — bei einem 6000×4000-Foto im 600×340-Viewport sind das ~570 px für die volle Selection, deutlich unter Print-Auflösung. `ApplyButton` ruft jetzt `renderHighResCrop()` mit denselben Zoom/Crop/Offset/Rotation/Flip/Viewport-Werten auf und zeichnet auf ein Canvas in **Source-Pixel-Auflösung** (`crop.width / zoom × crop.height / zoom`, gecappt bei 4096 px gegen Memory-Blow-ups bei extremem Zoom-out). Math identisch mit Zags `drawCroppedImageToCanvas` — Position/Skalierung bleiben pixelgenau, nur das Output-Canvas ist groß genug für 300 dpi Print.

### #20 — Text-Drag war blockiert + Bleed nur rechts/unten *(2026-05-24 — gefixt)*

**Symptom A:** Texte ließen sich nicht mehr per Drag-and-Drop verschieben — jeder Klick wechselte sofort in den Edit-Mode.
**Symptom B:** Bleed-Zone war nur rechts/unten — links/oben rausgeschobene Objekte verschwanden weiterhin am Canvas-Rand.

**Root Cause A:** Der Click-to-Edit-Hook aus #18 hing an `mouse:down`. Fabric setzt das aktive Objekt aber bereits BEVOR `mouse:down` feuert — der Vergleich `getActiveObject() === target` war damit schon beim allerersten Klick wahr und `enterEditing` schlug zu, bevor der User die Maus überhaupt bewegen konnte.
**Root Cause B:** `use-fabric-canvas.ts` vergrößerte die Canvas nur um `BLEED_MM` (einseitig); das `labelRect` saß bei (0,0) statt eingerückt.

**Fix A:** Drag-Threshold-Pattern. `mouse:down` merkt sich nur die Pointer-Koordinaten, `mouse:up` checkt die Distanz: bei < 4 px Bewegung → `enterEditing()` + `selectAll()`. Ein echter Drag wandert mehr und wird in Ruhe gelassen.
**Fix B:** Canvas-Pixelfläche jetzt `widthMm + 2*BLEED_MM` × `heightMm + 2*BLEED_MM`; `labelRect` sitzt eingerückt bei `(bleedPx, bleedPx)`. `add*`-Methoden, `getActiveObjectProperties` und `updateActiveObject` rechnen über `bleedPx` um — User-facing `x/y` bleibt label-relativ (0/0 = obere linke Ecke des druckbaren Bereichs, negative Werte = im Bleed).

### #19 — Wrapper-Background ließ den Bleed zweifarbig wirken *(2026-05-24 — gefixt)*

**Symptom:** Zwei Grautöne sichtbar — der Bleed-Fill der Fabric-Canvas und der `bg-muted/20` der `<main>`. Optisch wie eine zweite Rahmenzone um das Label.
**Fix:** Fabric `backgroundColor` auf `'transparent'`, `bg-white shadow-2xl` aus dem `LabelCanvas`-Wrapper entfernt — `bg-muted/20` zieht durchgehend. `labelRect` bekommt eine `fabric.Shadow` für den Karten-Look.

### #18 — Text on canvas konnte nur per Doppelklick editiert werden *(2026-05-24 — siehe #20)*

**Symptom:** Klick auf ein Text-Objekt selektierte es nur; Edit-Mode ging nur via Fabric-Default `dblclick` oder Toolbar-Input.

**Fix:** Click-to-edit-Hook implementiert (mouse:down) — siehe #20 für die nachgereichte Korrektur, die Drag wieder ermöglicht.

### #17 — Überstehende Objekte wurden am Canvas-Rand abgeschnitten *(2026-05-24 — gefixt)*

**Symptom:** Text breiter als das Label oder Bilder rechts/unten über den Rand → wurden vom Fabric-Canvas weg-geclippt, nicht mehr sichtbar. Designer hatte keine Möglichkeit, den Überlauf zu sehen oder zurückzudrücken.

**Root Cause:** Die HTML-Canvas-Pixelfläche war exakt label-groß (`mmToPx(widthMm) × mmToPx(heightMm)`). Alles außerhalb dieses Bereichs liegt buchstäblich außerhalb der gezeichneten Pixelfläche und ist nicht renderbar.

**Fix:** Canvas-Pixelfläche um `BLEED_MM = 40` mm rechts und unten vergrößert; `canvas.backgroundColor` wechselt zu einem neutralen Grau (`#e5e7eb`), und das Label wird durch ein nicht-interaktives `fabric.Rect` bei `(0, 0)` mit `widthMm × heightMm` und der eigentlichen Label-Farbe abgebildet. Das Rect wird auf den Stack-Boden geschickt und über einen `_isLabel`-Tag gefiltert (Layer-Panel, `getActiveObjectProperties`). `setBackground`/`getBackground` greift jetzt auf `labelRect.fill` statt `canvas.backgroundColor`. `zoomToFit` fittet den gesamten Pixelbereich (Label + Bleed) — Überlauf bleibt im Default-View sichtbar. History-`loadFromJSON` re-pinnt die `selectable: false`/`evented: false`-Flags am wiederhergestellten Label-Rect, weil Fabric diese Flags von Haus aus nicht serialisiert.

### #16 — Text-Komponente konnte nicht umbrechen *(2026-05-24 — gefixt)*

**Symptom:** Eingefügter Text wuchs einzeilig nach rechts aus dem Label heraus; ein manuelles `\n` ging zwar im Canvas-Edit-Mode, aber Auto-Wrap an einer mm-Breite gab es nicht. Das Text-Input in der Context-Toolbar war ein Single-Line `<input>` — `Enter` ohne Funktion.

**Root Cause:** `bridge.addText` instanziierte `fabric.IText`. IText kennt kein Word-Wrap; es rendert eine einzige Zeile (oder mehrere, wenn `\n` enthalten ist). Für Wine-Labels mit fester Breite (Producer-Block, Region-Beschreibung …) ist Wrapping aber Pflicht.

**Fix:** Switch auf `fabric.Textbox` (extendet `IText` — alle bestehenden Text-Properties bleiben kompatibel) mit `width: mmToPx(50)` als Default-Wrap-Breite. `updateActiveObject` bekommt einen Textbox-Branch für die W-Property: `obj.set('width', targetPx)` reflowt das Textbox, statt das Glyphenbild über `scaleX` zu strecken. Höhe wird für Textbox ignoriert — Fabric berechnet sie aus der Anzahl gewrappter Zeilen. Das Text-Edit-Feld in der Context-Toolbar wurde gleichzeitig auf `<textarea rows={1}>` umgestellt, damit Multi-Line-Text auch dort eingebbar ist.

### #15 — NumberInput-Stepper stallten nach dem ersten Klick *(2026-05-24 — gefixt)*

**Symptom:** Die `+`/`−`-Pfeile am Font-Size-Feld (Context-Toolbar) änderten den Wert nur ein einziges Mal sichtbar, danach passierte nichts mehr. Geometrie- und Opacity-Stepper im Properties-Panel hatten denselben Defekt — fiel nur weniger auf, weil das Objekt beim ersten Klick visuell springt.

**Root Cause:** `bridge.updateActiveObject` mutiert das Fabric-Objekt via `obj.set(...)` und ruft `canvas.renderAll()`, feuert aber **kein** Canvas-Event. Sowohl `ContextToolbar` als auch `CellarCanvas` halten ihre Property-Snapshots in React-State und refreshen ausschließlich über Canvas-Events (`object:moving|scaling|modified|…`). Resultat: nach dem ersten Klick blieb `value` im `NumberInput` stale, jeder weitere Klick berechnete `staleValue + step` und sendete denselben Zielwert ein zweites Mal — Fabric änderte nichts, der Stepper stand visuell still.

**Fix:** Bridge feuert nach jeder `updateActiveObject`-Mutation ein eigenes Event `cellar:property-changed` auf der Canvas. Beide React-Listener abonnieren es und ziehen `getActiveObjectProperties()` nach. Das alte konditionale `text:changed`-Feuern (nur bei Text-Content-Änderungen) wurde durch das generische Event ersetzt — es deckt automatisch alle Property-Pfade ab (fontSize, charSpacing, lineHeight, x/y/w/h, rotation, opacity, fill, …).

### #14 — TextToolOptions: charSpacing + lineHeight wurden silently gedroppt *(2026-05-24 — gefixt)*

**Symptom:** Schieben der Letter-Spacing- oder Line-Height-Slider in der Context-Toolbar bewirkt nichts auf der Canvas.

**Root Cause:** `handleTextChange` in `ContextToolbar.tsx` mappte zwar `bold/italic/underline/color/fontFamily/fontSize/textAlign`, aber **nicht** `charSpacing` und `lineHeight`. Die Werte kamen über `TextFormatValues` rein, wurden aber nicht in `fabricProps` übertragen → Bridge bekam einen leeren Prop-Bag, Fabric blieb unverändert.

**Fix:** Beide Felder in `handleTextChange` ergänzt. `FabricObjectProperties` führt sie bereits, der Pass-through reicht.

### #13 — Geometry W/H mappte mm-Werte direkt als Fabric-Pixel *(2026-05-24 — gefixt)*

**Symptom:** Width/Height im Properties-Panel verzerrte die Form (Rect wurde winzig, Skalierung kaputt). X/Y/Rotation/Opacity funktionierten dagegen.

**Root Cause:** `bridge.updateActiveObject` startete den Fabric-Prop-Bag mit `{ ...cleanProps }` und überschrieb dann `left`/`top`/`scaleX`/`scaleY`. Die mm-keyed Felder `width` / `height` blieben damit im Bag — Fabric interpretierte `width: 20` aber als 20 px (nicht mm) und setzte das parallel zum frisch berechneten `scaleX`. Ergebnis: doppelter Effekt, Form verzerrt. Zusätzlich gab's keine Sonderbehandlung für `Circle` (kein echtes `width`-Feld, nur `radius`) und `Line` (Geometrie in `x1/y1/x2/y2`).

**Fix:** Bridge-Prop-Bag wird sauber gebaut: virtuelle mm-Keys (`x`, `y`, `width`, `height`) werden via Destructuring rausgezogen, restliche Props werden 1:1 als Fabric-Props gespreaded. W/H-Mapping pro Objekttyp:

- `Rect` / `Image` / `IText`: `scaleX = mmToPx(target) / obj.width`, analog `scaleY`.
- `Circle`: `radius = mmToPx(width) / 2 / scaleX`, Height wird ignoriert (uniform).
- `Line`: `x2 = x1 + mmToPx(width) / scaleX`, Height wird ignoriert.

`setCoords()` wird jetzt für alle Objekttypen aufgerufen (vorher nur IText).

### #12 — LayerPanel: Shadow erscheint beim Drag auf allen Rows *(2026-05-24 — gefixt)*

**Symptom:** Beim Anklicken und Halten einer Layer-Row bekommen *alle* Rows den Drop-Shadow — nicht nur die, die gezogen wird.

**Root Cause:** Wir hatten die Elevation auf `isDragging || transform !== null` umgestellt, damit die gezogene Row während der Drop-Decay-Phase oben bleibt. `transform !== null` ist während des Drags aber auf *allen* Rows wahr, weil dnd-kit den Nicht-Gezogenen einen Shift-Transform verpasst, um Platz zu machen. Damit galt der Shadow für alle.

**Fix:** Shadow + Z-Elevation getrennt. `shadow-lg` strikt an `isDragging` (nur die aktiv gezogene Row). Z-Elevation hält weiterhin über die Drop-Decay-Phase — dafür gibt's einen lokalen `isDropping`-State, der via `useEffect` getriggert wird, wenn `isDragging` von `true` auf `false` fällt, und nach 300 ms zurück geht. So bleibt die gezogene Row während der Animation oben, ohne dass die anderen Shadow bekommen.

### #11 — Shortcut-Konflikte mit Inputs *(2026-05-24 — gefixt)*

**Symptom:** Drücken der `Backspace`-Taste beim Editieren eines Layer-Namens oder Wein-Feldes löscht das ausgewählte Objekt auf der Canvas.

**Fix:** In der Hotkey-Action für `delete, backspace` einen Check auf `document.activeElement` eingebaut. Die Action wird ignoriert, wenn der Fokus in einem `INPUT` oder einer `TEXTAREA` liegt.

### #10 — Zoom-to-fit basierte auf Hardcoded Werten *(2026-05-24 — gefixt)*

**Symptom:** Bei Labels, die nicht dem Standardmaß entsprachen, war der Zoom nach dem Laden oder Fullscreen-Wechsel entweder zu weit weg oder schnitt Kanten ab.

**Root Cause:** Die Bridge nutzte feste 400x600px für die Berechnung des Fit-Scales.

**Fix:** `zoomToFit` akzeptiert nun `widthMm` und `heightMm` und berechnet den exakten Pixel-Raum dynamisch.

### #9 — Selection-Update-Zyklus zu aggressiv *(2026-05-24 — gefixt)*

**Symptom:** Die React-Event-Listener in `CellarCanvas.tsx` wurden bei jeder Selektionsänderung (`selectedIds`) ab- und wieder angemeldet.

**Fix:** Event-Listener-Logik stabilisiert. Die Listener werden einmalig gebunden und greifen intern auf die Bridge zu. `onModified` triggert nun zusätzlich `saveHistory()`.

---

## Entscheidungs-Log

### 2026-05-26 — PDF-Export in Label-Trim-Größe

- **`engine/export-pipeline.ts`** — `exportLabelPdf(bridge)` rendert die Label-Region via Fabric `toDataURL({ left, top, width, height, multiplier: 3.125 })` als 300 dpi PNG, packt es in ein `jsPDF` mit Custom-Page-Format `[widthMm, heightMm]` und gibt einen Blob zurück. `downloadBlob(blob, filename)` löst den Browser-Download aus (Anchor-Trick mit verzögertem `revokeObjectURL`).
- **Trim-only, kein Bleed, keine Crop-Marks.** Die Druckerei legt Bleed selbst an wenn nötig — die Variante hält das PDF schlank und das Mental-Model des Users ('was ich sehe, ist was gedruckt wird') intakt.
- **Background-Color im Export:** Die Fabric-Canvas läuft im Editor mit `backgroundColor: 'transparent'` — die Label-Farbe ist ein CSS-Backdrop. Für den Export setzen wir `canvas.backgroundColor` temporär auf `bridge.getBackground()` und restoren danach. Snap-Guide-Lines tragen `excludeFromExport: true` und fallen automatisch raus.
- **Header-Button** (Download-Icon, `m.exportLabel = 'PDF'`) neben Save. `onExport({ format: 'pdf', blob })`-Callback für Server-Upload-Wiring; lokaler Download passiert immer, der Callback ist additiv.

### 2026-05-26 — 3 mm Print-Bleed-Indikator (Maske überlappt Label-Rand)

- Statt einer separaten gestrichelten Linie (Decision #3 schlug das vor) erweitern wir die bestehende Bleed-Maske um die Print-Bleed-Distanz nach INNEN: `LabelCanvas.printBleedMm`-Prop (default 0, im Editor 3) bumpt die Strip-Breiten/-Höhen in `BleedMask` um diesen mm-Wert. Resultat ist ein leicht abgedunkelter Streifen am Label-Rand, der wie ein "achtung, nicht hierhin"-Hinweis wirkt.
- **Warum keine Dashed-Line:** Die bestehende Maske kommuniziert "außerhalb der Linie ≈ gefährlicher Bereich" schon. Eine zusätzliche gestrichelte Box wäre visuelles Doppel-Marker für dieselbe Information. Die Mask-Erweiterung integriert sich nahtlos in das vorhandene Preview-System: bei `bleedMaskOpacity = 1` (Preview-Mode) verschwindet die Safety-Zone genauso wie der Bleed-Außenbereich — entspricht dem echten Druckergebnis ohne jede UI-Andeutung.
- `PRINT_BLEED_MM = 3` als Konstante in `CellarCanvas.tsx`. Im Preview-Mode wird `printBleedMm={0}` durchgereicht.

### 2026-05-26 — Event-Dedupe für `cellar:property-changed`

- `useCanvasSync` koalesziert mehrere Sync-Events pro Tick zu einem einzelnen `update()`-Call via `queueMicrotask` + `scheduled`-Flag. Vorher konnte eine Stack-Op die schwere Berechnung (`getLayers`, `validateCompliance`, Viewport-Snapshot) doppelt feuern: einmal über `notifyStackChanged → cellar:property-changed`, ein weiteres Mal über die Selection-Restore-Sequenz (z. B. `alignSelected` discardet + setzt die ActiveSelection neu, was zwei `selection:*`-Events erzeugt).
- **Bewusst nicht gedrosselt:** `saveHistory()` in `onModified`. Jede `object:modified` ist eine diskrete User-Aktion, die einen eigenen History-Eintrag verdient. Würde man das auch debouncen, gingen Mid-Action-Snapshots verloren.
- Initial-Render bleibt synchron (`update()` direkt nach Listener-Setup), damit der erste Paint mit korrekten Werten kommt.
- Cleanup setzt ein `cancelled`-Flag, das der Microtask vor dem `update()`-Aufruf prüft — verhindert State-Schreibe auf eine bereits unmountete Komponente, falls ein Event kurz vor Cleanup noch eingereiht wurde.

### 2026-05-26 — Bg-Color in Undo/Redo-History

- `saveHistory` serialisiert nicht länger nur den Fabric-`canvas.toObject(...)`, sondern direkt die volle `serializeState()`-Form `{ canvas, bg }`. Damit wandert die Label-Paper-Farbe als gleichberechtigte Property in jeden Snapshot.
- `setBackground` ruft jetzt `saveHistory()` nach der Mutation; vorher passierte das nie und Bg-Changes blieben außerhalb der History. Idempotenz-Guard: gleicher Color → No-Op (verhindert sinnlose Snapshots beim Picker-Hover).
- `restoreHistory` parst das Snapshot, lädt `canvas` via `loadFromJSON` und schreibt `labelColor` zurück. Anschließend `cellar:property-changed` ausgelöst, damit der React-Sync-Hook `getBackground()` neu pullt und der CSS-Backdrop die alte Farbe wieder rendert.
- **Backward-Compat:** Wenn ein Snapshot keinen `bg`-Key trägt (alte localStorage-Drafts, plain Fabric JSON), bleibt `labelColor` unverändert — kein Reset auf Weiß, kein Crash.

### 2026-05-26 — Snap-to-Grid + Re-Crop from ContextToolbar

- **`engine/snap-manager.ts`** — eigene Klasse, lebt auf `canvas.on('object:moving')`. Kollektioniert Snap-Targets (Kanten + Mittellinien anderer User-Objekte + Label-Center) und schiebt das Active Object innerhalb eines kleinen Threshold-Korridors auf die nächste Linie. Smart Guides werden als `fabric.Line` mit `excludeFromExport: true` und `selectable: false` gerendert; bei `mouse:up` und `selection:cleared` weggeräumt.
- **Toggle:** `snappingEnabled` lebt im Zustand-Store (default `true`). Header-Button (Magnet-Icon) + Hotkey `S`. Alt-Key während Drag unterdrückt Snapping pro Event ohne den Toggle zu kippen.
- **Cropper-Centralisation:** `cropperOpen` / `cropperSrc` / `cropperTargetId` jetzt im Zustand-Store statt im `MainToolbar`-lokalen State. Modal mountet einmalig in `CellarCanvas`. Vorteil: ContextToolbar kann den Cropper für ein bereits platziertes Bild öffnen, ohne dass MainToolbar als Vermittler nötig ist.
- **Re-Crop-Flow:** Image-Selektion in ContextToolbar → Crop-Button → `bridge.getSelectedImageSrc()` → `setCropper({ open, src, targetId })`. Beim Apply: wenn `targetId` gesetzt, `bridge.updateImageSource(id, newUrl)` statt `addImage` — ID + Position + Layer-Meta bleiben erhalten.
- **Hotkey-Category bleibt Literal:** Kurzer Versuch, `category: m.hotkeyCategory` durchzureichen, scheiterte am strikten Union-Type des Hotkey-Providers (`'Global' | 'Navigation' | 'Actions' | 'Context'`). Lösung: Category bleibt als Literal `'Actions'` in der Registrierung; Übersetzung müsste display-side in `ShortcutOverview` passieren. `messages.ts` trägt `hotkeyCategory` weiterhin, wird aktuell aber nicht konsumiert.

### 2026-05-26 — Refactor + i18n + Tour + Emoji-Extras

- **CellarCanvas.tsx 560 → 253 LOC.** Split in drei Engine-Hooks (`use-canvas-sync`, `-autosave`, `-restore`) und sub-komponenten (`CanvasHeader` + `SaveButton`, `RightPanel` + `PropertiesPanel` / `BackgroundPanel`). Verhalten unverändert; public API (`CellarCanvas`, `WineFieldValues`, `CellarCanvasProps`) bleibt stabil.
- **i18n via `messages.ts` + scoped Context.** ~60 Strings in en+de, locale aus dem globalen `I18nProvider` via `useComponentMessages`. Override per `messages?: Partial<CellarCanvasMessages>`-Prop, anschließend durch einen cellar-canvas-lokalen `MessagesProvider` an alle Subcomponents weitergereicht — kein Prop-Drilling. ImageCropperModal hat weiterhin eigene `messages.ts` (kontextfreie Wiederverwendbarkeit).
- **Onboarding Tour (Ark UI).** 5 Steps, DOM-Anchors via `[data-tour=...]`-Attribute statt Ref-Forwarding. Auto-Start mit 400 ms Delay (Fabric braucht den Layout-Settle, sonst sitzt der Spotlight-Rect auf einer Pre-Layout-Box). `cellar-canvas-tour-completed`-Flag in localStorage; jeder terminale Status (completed / dismissed / skipped) schreibt das Flag. `disableTour`-Prop für Embed-Cases ohne Tour.
- **Emoji-Extras-Panel via `emoji-picker-react`.** Lib statt Headless gewählt (User-Entscheidung) trotz opinionated Styles. Theme syncen wir via `MutationObserver` auf `data-theme` — die `Theme.AUTO`-Option der Library folgt `prefers-color-scheme`, was vom kontrollierten Atelier-Theme abweichen kann. Insert als `fabric.Textbox` mit fontSize 48 statt PNG-Layer: minimale State-Größe (ein Codepoint), vektor-clean beim Zoom, editierbar wie normaler Text. Layer-Label trägt das Emoji selbst (`Emoji 🍷`), Meta-Flag `_extras: true` für spätere Filter.

### 2026-05-25 — Bleed Mask + Preview Mode (CSS-Overlay statt Fabric-Layer)

- Vier absolute-positionierte `<div>`-Stripes (top / bottom / left / right) in `LabelCanvas` decken den Bleed-Bereich um das Label ab. Position via prozentuale Anteile der bekannten `widthMm`/`heightMm`/`bleedMm` — keine pixel-coords, kein Re-Compute bei Zoom/Pan nötig, weil das `<canvas>` DOM-Element seine feste Pixelgröße behält (Fabric skaliert über `viewportTransform` nur den Inhalt).
- `pointer-events: none` + `z-index: 40` lässt Fabrics Selection/Drag-Handler ungestört, dimmt aber alles visuell außerhalb des Labels.
- **Design-View:** Opacity 0.55 mit `var(--background)` als Fill — überlaufende Objekte bleiben halb-transparent erkennbar. **Preview-Mode:** Opacity 1.0 → Bleed verschwindet komplett, nur das druckbare Label ist sichtbar (praktischer „Wie sieht das gedruckte Etikett aus?"-Test).
- Toggle-Button mit Eye/EyeOff-Icon im Header neben Fullscreen. `aria-pressed` für State-Indikation. `transition: opacity 180ms` für sanften Wechsel.
- Bewusst NICHT als Fabric-Layer implementiert: ein Fabric-Object würde im Object-Stack, History-Snapshots, Layer-Panel auftauchen und die existierenden Filter (`_isLabel`, etc.) duplizieren. Die CSS-Lösung bleibt orthogonal zum Editor-State.

### 2026-05-24 — Stacking + Color in eigenständige Komponenten extrahiert

- **`components/stack-order-controls/`** — neues Headless-Komponente mit 4 Buttons (Front, Forward, Backward, Back). Eigene Messages (DE/EN), Tooltips, Disabled-State, `visible`-Prop zum Reduzieren auf eine Teilmenge. Reused von `ContextToolbar`.
- **`components/color-swatch/`** — popover-gekapselter `ColorPickerPanel`-Trigger. Vorher inline im `TextToolOptions`, jetzt shared zwischen Text-Color und Shape-Fill. Default-Presets bleiben die Cellar-Cellar-Palette.
- **Bridge:** `bringForward` / `sendBackward` (Fabric v7 `canvas.bringObjectForward` / `sendObjectBackwards`) plus `alignSelected(action)` für die 6 Align-Aktionen + 2 Distributions. Implementierung discardet die `ActiveSelection`, mutiert in absoluten Canvas-Koords, rebuilded die Selection (sonst kollidiert das mit den group-relativen Koordinaten der Children).
- **ContextToolbar:** verwendet jetzt `StackOrderControls` + `AlignmentBar` (wirklich verdrahtet statt Stub) + `ColorSwatch` für Shape-Fill, wenn ein `rect`/`circle`/`line` selektiert ist.



### 2026-05-24 — Undo/Redo Integration

- Implementierung eines linearen History-Stacks (max. 50 Steps) im `useDesignerStore`.
- Serialisierung via `canvas.toJSON(['id', ...customProps])`.
- UI: Undo/Redo Buttons im Header + Keyboard-Shortcuts.
- `isRestoringHistory` Flag in der Bridge verhindert rekursive Snapshots während des Undo-Vorgangs.

### 2026-05-24 — Migration auf TanStack Hotkeys

- Ablösung der manuellen `useEffect` Key-Listener.
- Verwendung von `useDesignEngineHotkey` zur Registrierung in der globalen Shortcut-Übersicht.
- `mod+z` (Undo), `mod+shift+z` (Redo), `delete/backspace` (Delete).
- Kategorie `Actions` für alle Designer-Shortcuts zugewiesen.

---

*Last updated: 2026-06-12*
