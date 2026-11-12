# Cellar Canvas — Status & Bug Log

> Lebendes Dokument zum aktuellen Stand des Minimal-Editors für Weinetiketten.
> Bugs, Entscheidungen, Workarounds werden hier kurz festgehalten.
> High-Level-Vision und Roadmap liegen in `/CELLAR-CANVAS.md` im Repo-Root.
>
> **Laufende Arbeit:** Der Umbau auf Basics (Hochladen, Overlays, Flaschenansicht) ist unterbrochen. Er steht bei Schritt 5 von 9,
> Stand, Prüfliste und Plan für den Rest stehen im Entscheidungs-Log unter **#32**, Block „Übergabe“.

---

## Aktueller Stand

| Bereich              | Stand                                                                 |
|----------------------|------------------------------------------------------------------------|
| Canvas               | Fabric v7 via `use-fabric-canvas.ts`, mm/px Umrechnung steht. Symmetrische 40 mm Bleed-Margin rundherum; Label-Backdrop wird als CSS-`<div>` in `LabelCanvas` gerendert (NICHT mehr als Fabric-Objekt) und tracking-aligned via Fabric-Zoom + Viewport-Transform. User-facing `x/y` bleibt label-relativ. |
| Tools                | Rect / Circle / Line / Text (Textbox mit Word-Wrap) / Image / QR-Code addbar. Jeder Button der Werkzeugleiste fügt ein Objekt ein, Zeichen-Modi gibt es nicht; die Buttons „Auswählen“ und „Hand“ sind entfernt (#32). Die Ansicht verschiebt man per Mausrad oder mit gehaltener Leertaste (`skipTargetFind` + `relativePan`, Sync via `cellar:viewport-changed`). Text-Click-to-Edit per `mouse:up` + Drag-Threshold; `hiddenTextarea` wird in `canvas.wrapperEl` umgehängt damit Edit auch in modalen Subtrees funktioniert. |
| History              | ✅ Undo/Redo (50 Steps; Debounce-Snapshot wird vor jeder Pointer-Interaktion weggeschrieben, #27) via `engine/history-manager.ts` — alleiniger Besitzer von Stack/Index/Lock; `runExclusive` serialisiert Restores gegen Cmd+Z-Overlap (seit 2026-06-20, Step 4). Store hält nur noch `canUndo/canRedo` (Buttons disablen an den Grenzen). Snapshot ist die volle `serializeState`-Form `{ canvas, bg }` — Bg-Color partizipiert an Undo/Redo. Alte plain-canvas-Snapshots aus localStorage werden weiterhin akzeptiert (Backward-Compat). `saveHistory()` debounct jetzt 300ms (seit 2026-09-29, #26); `resetHistory()` seedet den Stack einmalig nach dem Mount-Restore statt der Bridge-Constructor selbst zu snapshotten. |
| Shortcuts            | ✅ TanStack Hotkeys (mod+z, mod+shift+z, Delete, Backspace, `=`/`-` Zoom, `mod+a` Alles auswählen, `mod+d` Duplizieren, Leertaste halten = Ansicht verschieben, `Escape` Auswahl aufheben) inkl. Registry. Entfernt in #32: `s` (Snapping), `shift+r` (Lineal), `mod+g`/`mod+shift+g` (Gruppieren). Delete/Backspace als **separate** Registrierungen — Komma-Listen (`'delete, backspace'`) parst die Lib als einen unmatchbaren Key, der nie feuert (mit 0.17 erneut geprüft). Ein literales `+` geht seit `@tanstack/hotkeys` 0.11 auch als String (`'+'`, `'Mod++'`), die Objektform (`RawHotkeyChord`, `{ key: '+' }`) ist dafür nicht mehr nötig. |
| Zoom                 | ✅ Das `<canvas>` füllt den Arbeitsbereich: ein `ResizeObserver` in `CellarCanvas` ruft `bridge.resize()` (setDimensions + Fit) bei jeder Größenänderung, auch beim Fullscreen-Wechsel (seit 2026-10-14). Zoom-to-Fit passt Label + Bleed in diese Fläche ein. Neu eingepasst wird beim Resize nur, solange die Ansicht noch eingepasst ist (`fitted`-Flag; Zoom/Pan per Wheel, Leertaste oder `+`/`-` hebt es auf, „Einpassen" setzt es). Zoom und Fit feuern nur `cellar:viewport-changed` — kein Voll-Sync, kein Autosave/`onChange`. Das Etikett sitzt in der Mitte der Arbeitsfläche; der Vollbild-Versatz `fitShiftX` ist entfernt (#32). Grid-Zeile `minmax(0, 1fr)` + `min-h-0` am RightPanel, damit ein hohes Panel scrollt statt die Arbeitsfläche zu verändern. Pinch bzw. Strg/Cmd+Wheel zoomt cursor-zentriert via `canvas.zoomToPoint`, normales Scrollen/Zwei-Finger-Swipe verschiebt (seit 2026-10-05, #27); `preventDefault` gegen Browser-Page-Zoom/-Scroll. Die Zoom-Leiste unten links (`ZoomBar`: −, Stufe in %, +, „Einpassen", seit #32) und die Hotkeys zoomen Center-verankert über `bridge.zoomBy` (gleiche Clamp-Range 0.05–20). |
| Fullscreen           | ✅ CSS-Fullscreen (`fixed inset-0 z-50`) statt der Browser-Fullscreen-API — Escape exitet. Vorher schluckte die API-Variante Keyboard-Input in Fabric's `hiddenTextarea` (Focus-Restriktion auf Subtree). Die Shell rendert immer in denselben Portal-Container, der nur im DOM verschoben wird (Platzhalter ↔ `body`) — ein Wechsel Inline ↔ Portal mountete den `<canvas>` neu (#27). |
| Rechte Seite         | Einklappbare Abschnitte statt Tabs (Ark `Accordion`, mehrere zugleich offen, #32): Weindaten, Hintergrund, Vorlagen, Position & Größe, Ebenen. Ab 56rem Editor-Breite (Container-Query `@4xl/editor`, nicht Fensterbreite) eine eigene Spalte, darunter eine Überlagerung über der Arbeitsfläche, die der Kopf ein- und ausblendet. |
| Position & Größe     | x / y / Drehung / Deckkraft verdrahtet; B / H pro Objekttyp (Rect via scale, Circle via radius, Line via x2, Textbox direkt). Seit #32 ein Abschnitt der rechten Seite. |
| Kontext-Leiste       | Eine Zeile über der Arbeitsfläche, seitlich scrollbar statt umzubrechen (#32). Text: `TextToolOptions basic` (Schrift, Größe, fett, kursiv, links/mittig/rechts, Farbe). Form: Füllung, Rand, Stärke, Ecken. Bild: Zuschneiden, Ersetzen. Für alles: auf dem Etikett zentrieren (`bridge.centerOnLabel`), Reihenfolge (`StackOrderControls`, nur Einzelauswahl) bzw. `AlignmentBar` (Mehrfachauswahl), Duplizieren, Löschen. |
| Snap-to-Grid         | ✅ `SnapManager` (engine/snap-manager.ts) zeichnet Smart Guides bei `object:moving`, snappt zu Kanten/Mittellinien anderer Objekte sowie zu Mitte und allen vier Kanten des Etiketts (Kanten seit #32, Schritt 5). Immer an, Alt unterdrückt Snapping pro Drag; Schalter und `S`-Hotkey sind entfernt (#32). Guides werden bei `mouse:up` und `selection:cleared` weggeräumt. |
| Background           | ✅ Panel-Tab `Background` mit Ark `SegmentGroup`: **Farbe** (ColorSwatch) oder **Bild** (Datei → `prepareImageSource`, cover; erst nach Dateiwahl umgeschaltet). Die Verlaufs-Bedienung ist entfernt (#32); die Engine rendert und exportiert einen Verlauf aus älteren Entwürfen weiter, im Panel erscheint er als „Farbe“ mit seiner Startfarbe. Modell `LabelBackground` (`store/types.ts`): Farbe bleibt ein String, Verlauf/Bild sind Objekte. Persistiert als `bg` in `{ canvas, bg }`, nimmt an Undo/Redo teil. Bildschirm: CSS-Backdrop (`backgroundStyle`); Export: `bridge.withPaper()` malt Farbe / `fabric.Gradient` (`gradientLine`) / vorab dekodiertes Bild in den Canvas-Hintergrund, inkl. Druck-Beschnitt. |
| Wine Fields          | 8 Felder (inkl. Allergenhinweis + Herkunftsland — deckt alle Validator-Pflichtfelder ab) + QR-Code, `_fieldKey` Metadata. QR-Button disabled ohne `nutritionalInfoUrl` (kein `example.com`-Fallback mehr). Felder ohne Wert sind gesperrt, Wein-Felder `editable: false` (serialisiert, Click-to-Edit respektiert es) — Text kommt nur aus den Weindaten (#27). Fehlt dem Wein ein Wert, wird das Feld ausgeblendet statt veraltet gedruckt; der Sync läuft auch nach Restore/Undo (#28). |
| Validator            | EU-Reg. 2023/2977 — alcohol, volume, allergen, QR.                     |
| Layer Panel          | Listet alle User-Objekte (Backdrop ist DOM, nicht im Stack). Rename / Visibility / Lock / Delete / Reorder. Programmatic Reorder (Bring-to-Front etc.) wird via `framer-motion layout="position"` sanft animiert, dnd-kit owns die Animation während aktiver Drags. |
| Clipboard Paste      | ✅ `Cmd/Ctrl+V` mit Bilddaten landet direkt auf der Canvas (kein Cropper). |
| Bild-Eingänge        | ✅ Alle fünf (Datei, Drag&Drop, Paste, Ersetzen, Cropper-Output) laufen über `prepareImageSource`: lange Kante ≤ 2400 px; Transparenz → PNG, verlustbehaftete Quellen → JPEG q0,9, opake verlustfreie → PNG bis 1,5 MB, sonst JPEG; nie größer als das Original; SVG unverändert (#27, #28). Platziert wird ein neues Bild von `fitImageToLabel` (`engine/object-factory.ts`, #32 Schritt 5): im Etikettformat (±4 %) deckt es das Etikett ab und liegt hinter allen anderen Objekten (über einem früheren deckenden Bild), sonst ist es mittig eingepasst und liegt obenauf. Datei und Drag & Drop gehen vorerst weiter durch den Zuschnitt (Pflicht, wird in Schritt 5 abgelöst). |
| Persistence          | ✅ Debounced (1 s) localStorage-Autosave + `onSave`-Callback (async, Idle/Saving/Success/Error-Button). Restore aus `initialState` → localStorage → leerer Canvas, direkt im Effekt (kein Timer, #27); `initialState` wird nur beim Mount gelesen (#28). Serialisierter State = `{ canvas, bg }`, Objekt-Props aus `SERIALIZED_OBJECT_PROPS`. `storageKey`-Prop overridable, `null` deaktiviert. Gescheiterter Autosave (Quota, gesperrter Storage) → `draftSaveFailed` + schließbarer Hinweis über der Arbeitsfläche (`Notices`). |
| Image Crop           | ✅ Pre-measured `naturalSize` + `viewportSize` vor Mount, korrekter `defaultZoom` + `initialCrop`. `naturalSize` ist src-gegated, damit sequenzielle Uploads keine stale Messungen weiterreichen (Bug #24). Apply rendert eigene High-Res-Canvas in **Source-Pixel-Auflösung** (`crop.width / zoom`, capped bei 4096 px) statt Zags Viewport-Pixel-Output — keine Quality-Loss beim Übergang Cropper → Canvas. **Re-Crop:** Über ContextToolbar für selektierte Bilder möglich; behält ID und Position bei. |
| Bleed Mask + Preview | ✅ Vier semi-transparente CSS-Stripes (`pointer-events:none`, `z-40`) überlagern den Bleed-Bereich, positioniert am Backdrop-Rechteck — folgen damit Zoom und Pan (#27). Die Maske ist ~55 % opak (überlaufende Objekte bleiben lesbar). Der Vorschau-Schalter (Auge im Kopf) ist entfernt (#32, Schritt 4), das Druckergebnis zeigt künftig die Flaschenansicht (Schritt 8). **3 mm Print-Bleed-Indikator:** Die Maske reicht 3 mm INS Label hinein — der entstehende dunklere Randstreifen markiert die Trim-Risiko-Zone (kein wichtiger Inhalt). |
| i18n                 | ✅ `messages.ts` (en+de) + `messages?`-Prop. Locale aus globalem `I18nProvider`; rund 100 Strings verteilen sich über einen scoped Messages-Context auf alle Subcomponents (kein Prop-Drilling). Tastenkürzel in Button-Titeln schreibt `useShortcutTitle` so, wie die Plattform sie schreibt (#32). |
| Onboarding Tour      | ❌ entfernt 2026-11-11 (#32, Entscheidung 9 in `/CELLAR-CANVAS.md`). Props `disableTour` und `tourStorageKey` gibt es nicht mehr; der Schlüssel `cellar-canvas-tour-completed` bleibt ungenutzt im localStorage alter Besucher liegen. |
| Extras-Panel         | ❌ entfernt 2026-11-11 (#32): Emoji-Picker (`emoji-picker-react` ist aus `components/package.json` raus), Unterschrift und Ornamente. Objekte dieser Art aus älteren Entwürfen laden weiter (Emoji = Text, Unterschrift/Ornament = Layer-Typ `'path'` mit Füllung/Kontur in der Kontext-Leiste), nur das Einfügen gibt es nicht mehr. |
| Export               | ✅ PNG + PDF in Label-Trim-Größe (`exportDpi`, default 300, via Fabric `toDataURL`; PDF via `jspdf`), Download über zwei Header-Buttons. PDF gated über `enablePdfExport`. `onExport({ format, blob })`-Callback für Server-Upload. jsPDF lädt nur auf dem PDF-Pfad (#27). Mit `pdfBleedMm` > 0 zusätzlich Beschnitt und Schnittmarken (seit 2026-10-14). |
| Templates            | ✅ 5/5 Built-ins: Classic / Modern / Minimal (2026-09-29, #26), Rustic + Bold (2026-10-14; Doppelrahmen mit `perPixelTargetFind` bzw. Farbblock, beide mit Alkohol + Füllmenge im Fuß) als `templates/templates.ts` — reine Funktionen, bauen live Fabric-Objekte über dieselben `attach()`-Metadaten wie die Toolbar-Inserts, keine vorserialisierten JSON-Dateien. Der Abschnitt „Vorlagen" ruft `bridge.applyTemplate()` (ein Undo-Schritt, `window.confirm`-Gate wenn die Leinwand nicht leer ist). Wein-Felder ohne Wert lässt das Template weg statt Platzhalter zu drucken (#27). Thumbnails und `customTemplates`-Prop weiterhin offen (siehe unten). |
| Multi-Area           | ⏸ out of scope — eine Canvas (Front).                                  |

---

## Offen

### Roadmap-Items (CELLAR-CANVAS.md)

**Später / Zum Schluss:**
- **Templates** — 5/5 Built-ins gebaut (Classic/Modern/Minimal 2026-09-29 #26, Rustic/Bold 2026-10-14). Kein Thumbnail-Grid (nur Text-Buttons — bewusst rudimentär für die Demo). `customTemplates`-Prop für app-spezifische Vorlagen weiterhin offen. Kein History-Clear bei Template-Wechsel (aus der ursprünglichen Spec) — nicht nötig, `applyTemplate` ist selbst ein normaler Undo-Schritt.

**Out of Scope** (vorerst zurückgestellt):
- ~~Multi-Area Tabs (Front / Back / Neck)~~ — eine Canvas reicht.

### Spec-Items aus Feature-Inventory (CELLAR-CANVAS.md)

- ~~**Ruler-Overlay**~~ — **erledigt 2026-10-14**: `CanvasRulers` (SVG, oben + links, 20 px), Nullpunkt an der linken oberen Etikettecke wie im Properties-Panel, 1-2-5-mm-Raster nach Zoom (Beschriftungen ≥ 48 px auseinander). Toggle-Button im Header (`aria-pressed`) + `Shift+R`, standardmäßig aus. Der Viewport-Snapshot trägt jetzt auch `width`/`height`; `resize()` feuert `cellar:viewport-changed`. Per Server-Render geprüft (Zoom 1: 20-mm-Raster, Zoom 3: 5 mm, Null exakt an der Kante).
- ~~**Pan-Tool**~~ — **erledigt 2026-07-04** als eigener Pan-Mode (Hand-Tool). Space+Drag als temporärer Pan: **erledigt 2026-10-14** — Leertaste halten schaltet auf das Hand-Tool, Loslassen stellt das vorige Werkzeug wieder her (Keyup per `useHotkey` mit `ignoreInputs: false`, `blur` stellt ebenfalls zurück; Key-Repeat per `e.repeat` nach dem `preventDefault`, damit die Seite beim Halten nicht scrollt — Review 2026-10-14). Greift nur mit Fokus auf `body` oder im Canvas-Bereich, damit Space auf einem fokussierten Button weiter klickt.
- ~~**Background Gradient + Image**~~ — **erledigt 2026-10-14** (siehe Zeile „Background“ oben). Gradient-Winkel gegen CSS geprüft (90°/180°/45°), Fabric-Gradient im Canvas-Hintergrund läuft durch den Viewport-Transform (Szenen-Koordinaten). Nicht im Browser geprüft.
- ~~**Group / Ungroup**~~ — **erledigt 2026-10-14**: `Mod+G` / `Mod+Shift+G` und ein Button in der Kontext-Toolbar (bei Mehrfachauswahl „Gruppieren“, bei Gruppe „Aufheben“). `createGroup` mit Top-Left-Origin (Alignment und Panel lesen `left/top` als Ecke), Stapelposition des obersten Mitglieds. Weinfeld-Sync (`withGroupMembers`, danach `triggerLayout` der Gruppe) und Validator (`getValidatableObjects`, ausgeblendete Gruppe blendet Mitglieder aus) schauen in Gruppen hinein. Das Layer-Panel zeigt eine Gruppe als eine Zeile; Text in einer Gruppe ist nicht per Klick editierbar (Fabric-Default, kein `subTargetCheck`).
- ~~**Duplicate** (Layer / Selection)~~ — **erledigt 2026-10-14**: `bridge.duplicateSelected()` über `Mod+D` und Button über „Löschen“ in der MainToolbar. Auswahl wird vor dem Klonen aufgelöst (Kinder einer `ActiveSelection` haben relative Koordinaten), Kopien +8 px über `left/top`, neue `id`, Metadaten über `SERIALIZED_OBJECT_PROPS`.
- ~~**Strg+A** (Select-All)~~ — **erledigt 2026-10-14**: `bridge.selectAll()` baut eine `ActiveSelection` aus allen sichtbaren, nicht gesperrten User-Objekten (gesperrte würden sonst mitgezogen). `ignoreInputs: true`, damit Eingabefelder ihr natives Alles-Markieren behalten.
- ~~**Esc**~~ — **erledigt 2026-10-14**: `bridge.discardSelection()`; ein Escape, das eine Auswahl aufgehoben hat, wird per `preventDefault` markiert, der Vollbild-Listener lässt es dann liegen. Ohne Auswahl verlässt Escape das Vollbild. Text-Edit-Mode beendet Fabric selbst (keysMap 27 → `exitEditing`, `stopImmediatePropagation`).
- ~~**Type-Icons pro Layer-Row**~~ — **war bereits umgesetzt** (`TYPE_ICON` in `layer-panel.tsx`, alle acht `LayerType`s, seit `21e15ca`); Eintrag am 2026-10-14 bereinigt.
- ~~**Corner-Radius für Rect**~~ — **erledigt 2026-10-14**: Feld „R“ (mm) in der Shape-ContextToolbar, nur für Rechtecke. `cornerRadius` ist eine virtuelle Prop wie x/y: `rx = mm / scaleX`, `ry = mm / scaleY`, damit die Ecken beim Setzen rund sind. Nachtrag (Review 2026-10-14): Der Radius liegt als `_cornerRadiusMm` am Objekt (serialisiert) und wird nach jeder Größenänderung neu auf `rx`/`ry` verteilt — im Panel (`updateActiveObject`) und an den Anfassern (`object:modified`), die Ecken bleiben rund. Ausnahme: Skalieren einer Mehrfachauswahl, deren Kinder ihre Skalierung erst beim Auflösen übernehmen.
- ~~**QR-Removal-Warning**~~ — **erledigt 2026-10-14**: `validateCompliance(objects, { qrWasPlaced })` meldet einen fehlenden QR-Code als `error` (rot), wenn in dieser Sitzung schon einer auf der Fläche lag; die Bridge merkt sich das (`getValidationInput`) und setzt es zurück, wenn die Szene als Ganzes ersetzt wird — Laden, Undo/Redo, Vorlage (Review 2026-10-14: sonst falscher Fehler nach Vorlagenwechsel). Ohne vorherigen QR-Code bleibt es die gelbe Warnung. Undo bringt den Code zurück und entschärft damit die Meldung.
- ~~**PDF-Bleed + Crop-Marks**~~ — **erledigt 2026-10-14, opt-in**: Prop `pdfBleedMm` (Default 0 = Trim-only wie im Entscheidungs-Log 2026-05-26). Mit Wert > 0 rendert `renderLabelPng` Trim + Beschnitt (Papierfarbe läuft mit), `printLayout()` legt Seite, Rasterposition und 8 Haarlinien-Marken fest (1 mm Abstand zum Beschnitt, 5 mm lang, 1 mm Papierrand). Mit jsPDF geprüft: 90×120 mm + 3 mm → Seite 110×140 mm, 8 Linien.
- ~~**Ark UI `DownloadTrigger`**~~ — **erledigt 2026-10-14**: Die Export-Buttons im Header sind `DownloadTrigger` mit `data`-Funktion (`exportBlob(format)` in CellarCanvas, ruft auch `onExport`). `downloadBlob` (Anchor + `revokeObjectURL`) ist entfernt. Ark fängt eine Rejection der `data`-Funktion nicht ab (siehe `live-docs-collection/ark-ui/download-trigger.md`) — wie vorher bleibt ein Export-Fehler unbehandelt.
- ~~**Extras-Panel: `SignaturePad` + Ornamente**~~ — **erledigt 2026-10-14** (siehe Zeile „Extras-Panel“ oben). Ornament-Pfade mit Fabric geparst und auf Zielbreite geprüft. Unterschrift ist reine Zeiger-Eingabe — per Tastatur nicht zeichenbar (liegt in der Natur des Felds).
- ~~**Accessibility-Pass**~~ — **erledigt 2026-10-14**: (1) Layer-Panel per Tastatur vollständig (↑/↓, Leertaste, Enter/F2, Entf; Label lokalisiert). (2) Header, MainToolbar und Kontext-Toolbar sind `role="toolbar"` mit lokalisiertem `aria-label`; Pfeiltasten + Pos1/Ende über `toolbarArrowKeys` (Eingabefelder behalten ihre Pfeile; per jsdom geprüft). (3) Werkzeug-Buttons mit `aria-label` + `aria-pressed`; Header-Buttons mit `aria-label`, Fokusring und 44 px bei grobem Zeiger (`pointer-coarse:`); Vorschau/Vollbild/Lineal mit `aria-pressed`. (4) Duplizieren/Löschen in der MainToolbar per `aria-disabled` statt `disabled` — fokussierbar, Tooltip erscheint wieder. (5) `<canvas>` mit `role="img"` + `aria-label` (verweist auf die Ebenenliste). (6) FocusTrap-Audit: einziges Modal ist der Cropper (Ark `Dialog`, `trapFocus` Default an); ein Export-Modal gibt es nicht mehr, Extras ist ein Panel. Offen: Roving-Tabindex (jede Toolbar ist heute mehrere Tab-Stopps), Screenreader-Lauf im Browser.
- ~~**Tour hat keinen Re-Entry-Punkt**~~ — **gefixt 2026-10-14**: `OnboardingTour` meldet seine Start-Funktion im Store an (`startTour`), der Header-Button ruft sie auf; `tourStartTitle` = Tooltip, `tourStartButton` = Screenreader-Name. *Ursprünglicher Befund (2026-09-29, Usability-Audit):* einmal dismissed, nie wieder erreichbar; `tourStartButton`/`tourStartTitle` existieren in `messages.ts`, werden aber von keiner Komponente konsumiert. Fehlt: Header-Button, der `OnboardingTour` neu startet.
- ~~**Stille Fehlerpfade**~~ — **gefixt 2026-10-14**: `bridge.loadImage` fängt `FabricImage.fromURL` ab, `updateImageSource` fängt `setSrc` ab (altes Bild bleibt), `addQRCode` meldet einen leeren QR-Data-URL. Alle setzen `insertError` (`'image' | 'qr'`), der Header zeigt einen schließbaren Hinweis (`role="alert"`), der nächste erfolgreiche Insert räumt ihn ab. Die `prepareImageSource`-Ketten enden auf `.catch(reportImageError)`. Nachtrag (Review 2026-10-14): Datei-Dialog und Drag & Drop scheitern erst im Cropper, weil `prepareImageSource` undekodierbare Dateien durchreicht — `ImageCropperModal` hat dafür `onError`, CellarCanvas schließt den Cropper und zeigt den Hinweis. `insertError` trägt eine `id`, damit ein wiederholter Fehler neu angesagt wird; Schließen-Button 44 px mit `aria-label`. *Ursprünglicher Befund (2026-09-29, Usability-Audit):* `addImage`/`updateImageSource` awaiten `FabricImage.fromURL` ungeguarded (korrupter Upload → nichts passiert sichtbar); `generateQRCodeDataURL`/`addQRCode` loggen nur in die Konsole. `prepareImageSource().then(...)`-Ketten in `MainToolbar.tsx`, `CellarCanvas.tsx`, `ContextToolbar.tsx`, `use-clipboard-paste.ts` haben kein `.catch` (nicht dekodierbare Bilder fängt `prepareImageSource` seit #27 ab und reicht sie unverändert durch; ein Lesefehler des `FileReader` bliebe aber eine unhandled rejection).
- ~~**„Fit to Screen" misst nie den sichtbaren Container**~~ — **gefixt 2026-10-14**: Canvas-Element = Arbeitsbereich (`ResizeObserver` → `bridge.resize`), `zoomToFit` rechnet mit der Szenengröße (Label + 2 × Bleed) statt mit der Element-Größe; Snap-Guides spannen über `calcViewportBoundaries()` den sichtbaren Bereich. Noch nicht im Browser geprüft. *Ursprünglicher Befund (2026-09-29, Bug-Audit):* `fabric-bridge.ts zoomToFit` skaliert nur relativ zur eigenen (fixen) Canvas-Pixelgröße, nie zur tatsächlichen Viewport-/Wrapper-Größe. Im Fullscreen oder auf kleinen/projektor-großen Fenstern bleibt das Label zu klein bzw. oben abgeschnitten, der Button behebt das nicht. Fix bräuchte eine Referenz auf den äußeren Container zum Messen — noch nicht verdrahtet.
- ~~**Snap-Guides lösen vollen Sync auf jedem Drag-Frame aus + snappen auf die eigene Multi-Selektion**~~ — **gefixt 2026-10-14**: `useCanvasSync` überspringt `object:added`/`removed` von Hilfslinien (`isSnapGuide`), die Snap-Schleife schließt die Kinder einer `ActiveSelection` aus. Die Linien bleiben Canvas-Objekte; sie auf `contextTop` zu zeichnen wäre sauberer, ist aber nicht umgesetzt. *Ursprünglicher Befund (2026-09-29, Bug-Audit):* `snap-manager.ts` fügt Guide-Lines per `canvas.add`/`remove` ein, was `object:added`/`removed` feuert → `useCanvasSync` löst einen vollen `'full'`-Update aus (Layer-Re-Snapshot + Validator) bei jedem Snap-Frame, nicht nur bei echten Änderungen. Zusätzlich schließt die Snap-Loop die eigenen Kinder einer Multi-Selektion nicht aus — die Gruppe kann an der eigenen Kante mit Delta 0 "snappen" und blockiert damit echtes Snapping gegen andere Objekte.
- ~~**PNG/PDF-Export hing vom aktuellen Zoom ab**~~ — **gefixt 2026-10-14**: Fabrics `toCanvasElement` schneidet in Viewport-Pixeln aus und behält Zoom + Pan bei. Der Export übergab Szenen-Koordinaten; nach Zoom-to-Fit (≈0,9) kam das Etikett verkleinert und verschoben heraus, mit einem Streifen Bleed oben links. `renderLabelPng` rechnet den Ausschnitt jetzt in Viewport-Pixel um und teilt den Zoom über den `multiplier` heraus.
- ~~**Properties-Panel X/Y falsch bei Multi-Selektion**~~ — **gefixt 2026-10-14**: `originOffset()` (object-properties.ts) rechnet beim Lesen und Schreiben vom Bezugspunkt auf die linke obere Ecke um; für eigene Objekte (Top-Left-Origin) ist der Versatz 0. Breiten-/Höhenänderung an einer Mehrfachauswahl hält die linke obere Ecke fest (vorher Skalierung um die Mitte → X/Y sprang); `getPositionByOrigin` statt des in v7 deprecated `getPointByOrigin`. *Ursprünglicher Befund (2026-09-29, Bug-Audit):* Fabric v7s `ActiveSelection` nutzt `originX/Y: center` als Default; `readGeometryMm`/`xToLeft` behandeln `left/top` aber als Top-Left-Ecke. Eine getippte X-Koordinate auf eine Mehrfachauswahl springt um die halbe Selektionsbreite daneben.
- ~~**Wine-Field-Sync erreicht restaurierte Objekte nicht zuverlässig**~~ — **gefixt 2026-10-06 (#28)**: der Sync liegt in der Bridge (`setWineFields`) und läuft nach jedem Scene-Load (Restore, Undo/Redo) erneut.
- ~~**Dimensionswechsel (`widthMm`/`heightMm` zur Laufzeit) hinterlässt tote Hooks**~~ — **gefixt 2026-10-14**: `useCanvasSync` und `useCanvasAutosave` hängen jetzt wie `useCanvasRestore` an `widthMm`/`heightMm` und abonnieren die neue Canvas. Nicht im Browser geprüft. *Ursprünglicher Befund (2026-09-29, Bug-Audit):* — `use-fabric-canvas.ts` erstellt bei Dimensionswechsel eine neue Canvas-Instanz, aber `useCanvasSync`/`useCanvasAutosave` listen nicht auf diese Deps und bleiben an der alten (disposed) Canvas hängen: Properties/Layers/Validator frieren ein, Autosave stoppt. Nur relevant, falls eine Embedding-App die Label-Größe zur Laufzeit ändert.
- ~~**`canvas.off(event)` ohne Handler-Ref räumt fremde Listener mit ab**~~ — **gefixt 2026-10-05 (#27)**, Listener werden mit Handler-Referenz abgemeldet. *Ursprünglicher Befund (2026-09-29, Bug-Audit):* `use-canvas-sync.ts`s Cleanup nutzt argumentlose `canvas.off('selection:created')` etc., was ALLE Listener dieses Event-Typs entfernt, nicht nur die eigenen. Trifft aktuell auch den Bridge-eigenen `mouse:wheel`- (Zoom) und `object:moving`-Handler (Snapping), sobald `enableValidator` zur Laufzeit umgeschaltet wird — bislang nur beim Unmount beobachtet (dort harmlos, da ≈ Dispose).
- ~~**Wein-Feld-Sync schreibt leere oder veraltete Werte**~~ — **gefixt 2026-10-06 (#28)**: Feld ohne Wert wird geleert und ausgeblendet (`_valueMissing`), mit Wert erscheint es wieder; Validator zählt nur sichtbare Felder mit Text; eine Regel `hasFieldValue()` für Panel, Templates und Sync.
- ~~**Restore läuft bei jeder neuen `initialState`-Identität**~~ — **gefixt 2026-10-06 (#28)**: `initialState` wird einmal beim Mount gelesen; ein anderes Dokument lädt der Embedder per React-`key`.
- **`prepareImageSource`: 50-MP-Foto wird voll dekodiert** *(2026-10-05, Review #27; 2026-11-09 in #31 gemessen: Resize-on-decode spart in Chromium keinen Speicher, Umstellung verworfen)* — ~200 MB Speicherspitze vor dem Verkleinern. Die übrigen Kanten sind gefixt (2026-10-06, #28): opake verlustfreie Quellen bleiben PNG bis 1,5 MB, das Original bleibt, wenn der Re-Encode nicht kleiner ist. Zurückgestellt (2026-10-14): Kandidat wäre, die Maße per `<img>` zu lesen und `createImageBitmap(blob, { resizeWidth, resizeHeight, resizeQuality: 'high' })` zu nutzen. MDN lässt offen, ob der Browser schon beim Dekodieren verkleinert oder erst danach; ohne Speichermessung im Browser (DevTools → Memory) ist der Nutzen nicht belegt. Erst messen, dann umbauen.
- ~~**Gezogene Linie springt bei Breitenänderung zurück**~~ — **gefixt 2026-10-06 (#28)**: `updateActiveObject` setzt bei Linien-Breite die Position zuletzt.
- ~~**Fullscreen: SSR und Refit**~~ — **gefixt 2026-10-14**: `CellarCanvas` ist ein client-only Wrapper (`useSyncExternalStore`, Server-Snapshot `false`) um den Editor — Server und Hydration rendern nichts, danach mountet der Editor frisch (Fabric init + Portal in einem Zug). Per `renderToString` geprüft: `""`, kein `document`-Zugriff. *Ursprünglicher Befund (2026-10-05, Review #27):* ein SSR-Embedder bekäme einen Hydration-Mismatch (Showcase und Buchart58 rendern client-only). ~~Der Fullscreen-Refit-Effekt (#26) begründet sich mit „Wrapper resized", `zoomToFit` misst den Container aber nie~~ — erledigt 2026-10-14, der Effekt ist durch den `ResizeObserver` ersetzt. Der Fokusverlust beim Wechsel ist gefixt (2026-10-06, #28).
- ~~**Undo/Redo setzen `isDirty` nicht**~~ — **gefixt 2026-10-06 (#28)**.
- ~~**Einfüge-Versatz zählt Objekte statt freie Plätze**~~ — **gefixt 2026-10-14**: `place()` nimmt die erste 8-px-Stufe (0–9), an der noch kein Objekt mit derselben linken oberen Ecke liegt. *Ursprünglicher Befund (2026-10-05, Review #27):* — nach einem Löschen kann ein neues Objekt wieder exakt auf einem bestehenden landen.
- ~~**Werkzeug-Buttons ohne zugänglichen Namen**~~ — **gefixt 2026-10-14** im Accessibility-Pass (`aria-label` + `aria-pressed`), im Browser bestätigt (#30). *Ursprünglicher Befund (2026-10-06, Browser-Smoke #28):* die Buttons im `MainToolbar` tragen nur ein Icon und einen Tooltip, kein `aria-label`; Screenreader lesen „Schaltfläche". Gehört zum Accessibility-Pass oben.
- ~~**Keine Tests** für History-Debounce/Flush/Reset und `prepareImageSource`~~ — **2026-10-06 (#28)**: `fabric-bridge.test.ts` (echte Bridge, Fake-Timer), dazu Validator, `hasFieldValue`, Bild-Weiche; 27 → 48 Tests. Einfüge-Versatz weiter ohne Test.
- **`pxToMm` rundet auf ganze mm** *(2026-09-29, Bug-Audit, Polish)* — `units.ts`, Properties-Panel arbeitet dadurch nur in 1mm-Schritten; ein bereits angezeigter X-Wert erneut eingegeben kann das Objekt um ~2px verschieben.

### Tech-Debt / Known Limitations

- ~~Bg-Color nicht in Undo/Redo-History~~ — **gefixt 2026-05-26**: `saveHistory` schreibt jetzt die volle `{ canvas, bg }`-Form, `setBackground` ruft `saveHistory` nach jeder Mutation, `restoreHistory` lädt beide Werte zurück. Backward-Compat für alte plain-canvas-Snapshots in localStorage bleibt.
- ~~`cellar:property-changed` feuert teils mehrfach pro logischer Aktion~~ — **entschärft 2026-05-26**: `useCanvasSync` debounct den Sync-`update`-Callback per `queueMicrotask`. Mehrere Events im selben Tick (Stack-Op + Selection-Restore, `alignSelected`-Mass-Mutationen, Bridge-Property-Changes) kollabieren zu genau einem `update()`-Aufruf. `saveHistory` war hier bewusst ungedrosselt gelassen — siehe #26, das war ein Fehlschluss: kontinuierliche Controls (Color-Picker-Hue-Drag) riefen `saveHistory` pro Pointermove auf, nicht pro diskreter Aktion.
- ~~`saveHistory()` ungedrosselt~~ — **gefixt 2026-09-29 (#26)**: 300ms-Debounce in `FabricBridge.saveHistory`. `undo()`/`redo()` flushen einen ausstehenden Snapshot zuerst, damit ein schnelles Cmd+Z direkt nach einer Aktion sie trotzdem sieht.
- ~~ContextToolbar Image-Branch unvollständig~~ — **gefixt 2026-05-26**: Crop + Replace + Opacity sind verdrahtet. Replace nimmt eine neue Datei aus dem File-Picker und schreibt direkt via `bridge.updateImageSource(targetId, dataUrl)` — kein Cropper-Dialog, ID + Position + Layer-Meta bleiben.
- ~~`updateActiveObject` / NumberInputs triggern keine History~~ — **gefixt 2026-06-08**: `bridge.updateActiveObject` ruft nun `saveHistory()` auf. Damit sind manuelle Geometrie-Eingaben über Undo/Redo abgedeckt.
- ~~Layer Panel zeigt Snap-Guides~~ — **gefixt 2026-06-08**: `bridge.getLayers` filtert jetzt Objekte ohne `_type` Meta-Property (wie interne Hilfslinien) aus.
- ~~Performance-Lag bei Canvas-Events~~ — **gefixt 2026-06-08**: `useCanvasSync` nutzt nun verschiedene Update-Modi (`full`, `geometry`, `viewport`) und überspringt teure Operationen (Ebenen-Re-Snapshot, Validation) während flüssiger Bewegungen wie Dragging oder Zooming.
- ~~ContextToolbar Redundanz~~ — **gefixt 2026-06-08**: `ContextToolbar` erhält `activeProps` direkt vom optimierten Parent-Hook; eigene Listener und interner State entfernt.
- ~~Veraltete Weindaten auf Canvas~~ — **gefixt 2026-06-08**: `CellarCanvas` synchronisiert Text-Inhalte von `wine-field` Objekten nun automatisch mit der `initialWineFields`-Prop.
- ~~Doppelte Wein-Felder möglich~~ — **gefixt 2026-06-08**: `WineFieldsPanel` deaktiviert Buttons für bereits platzierte Felder.

### Kleinkram, bewusst offen (Review 2026-10-14)

- `Cmd+D`/`Cmd+G` in einem Eingabefeld lösen die Browser-Defaults aus (Lesezeichen/Weitersuchen), weil die Kürzel dort absichtlich nicht greifen.
- Das Hintergrundbild im PDF mit Beschnitt ist ein paar Prozent größer als in der Vorschau (cover über die Beschnitt-Box, damit der Beschnitt gefüllt ist).
- `insertError` liegt wie der restliche Designer-State im globalen Store und überlebt damit einen Remount.

### Browser-Checks

Die Checkliste vom 2026-10-15 ist am 2026-10-25/27 per Playwright im Showcase abgearbeitet (Chromium, 1440 × 900), siehe #30. Offen beim User bleibt der Screenreader-Lauf (Toolbars, Ebenenliste, Tour, Hinweis im Header). In die Buchart58-Kopie sind die Fixes aus #30 am 2026-10-27 übernommen und unter `/etiketten` im Browser geprüft (dort `cellar-canvas/STATUS.md` #30).

### Arbeitshinweise

- Tests: `bunx vitest run components/cellar-canvas`. `node-canvas` ist nicht installiert, Fabric rendert in Tests also nicht. Geometrie lässt sich mit einem Wegwerf-Skript per `bun` prüfen: Fabric-Objekte und `ActiveSelection` funktionieren ohne Canvas, `Textbox` braucht ein echtes Canvas zum Messen.
- Wegwerf-Skripte importieren `fabric` über den absoluten Pfad `…/__Components__/node_modules/fabric/dist/index.mjs` und Repo-Module ebenfalls absolut. Sonst lädt Bun aus dem Scratchpad eine zweite Fabric-Instanz und `instanceof` schlägt fehl.
- Fabric 7.4.0: Standard-Bezugspunkt ist `center`. Eigene Objekte entstehen mit `left/top` (`ORIGIN` in `engine/object-factory.ts`), eine `ActiveSelection` bleibt `center`. `toCanvasElement`/`toDataURL` schneidet in Viewport-Pixeln aus und behält Zoom + Pan (`node_modules/fabric/dist/index.mjs`, Suche nach `toCanvasElement(multiplier`). Kinder einer `ActiveSelection` bleiben in `canvas.getObjects()`.
- Browser-Test per Playwright-MCP: Die Bridge steckt in einem React-Ref. Vom `canvas.lower-canvas` über `__reactFiber$…` die `.return`-Kette hochlaufen und in `memoizedState` den Ref suchen, dessen `current.canvas.getObjects` existiert. Nach Undo/Redo (`loadFromJSON`) oder einem Vite-Reload neu suchen. Szenen-Maße: 1 mm = 3,7795 px, Beschnittrand 40 mm = 151,18 px.
- Playwright-MCP fängt Datei-Dialoge und `window.confirm` ab: Dateien per `browser_file_upload` (nur unter `.playwright-mcp/`), `confirm` im Skript überschreiben. Ein `mousedown` kurz nach einem Klick auf dasselbe Textobjekt wertet Fabric als Doppelklick (Objekt bewegt sich nicht). Bei „Fit“ (Zoom ≈ 0,48) ist ein CSS-Pixel ≈ 2,1 Szenen-Pixel.

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

- **F1 — Bug, Datenverlust ✅ gefixt 2026-06-20:** Crop-Apply und Clipboard-Paste
  erzeugten `blob:`-URLs — tot nach Reload, da Fabric `src` wörtlich in Autosave +
  History serialisiert. **Fix:** `engine/image-source.ts` (`imageSourceFromBlob` →
  Data-URL via `FileReader`); alle 4 Upload-Pfade (Crop, Paste, Toolbar-Upload,
  Drag&Drop) laufen darüber; Unit-Test `image-source.test.ts` (3/3 grün). Der
  `revokeObjectURL`-Leak entfällt, da keine `createObjectURL` mehr für Canvas-Bilder.
  **Nebenwirkung:** Data-URLs sind Base64 → **F4 (Snapshot-Gewicht) ist jetzt akut**
  (jeder History-Step trägt die vollen Bilddaten), siehe Schritt 5.
- **F2 — God-Object:** Bridge bündelt History, Serialisierung, 7 Objekt-Fabriken,
  Property-Mapping mm↔px (beide Richtungen), Stack-Ops, Alignment, Background,
  Viewport, Layer-Ops. Die `add*`-Fabriken wiederholen je ~30 Zeilen Boilerplate
  (Corner-Style, Origin-Pinning, Meta-Assign, add→activate→render→saveHistory)
  ≈ 150 LOC Dopplung.
- **F3 — History, zwei Halb-Besitzer ✅ gefixt 2026-06-20:** Store besaß Stack/Index,
  Bridge Save/Restore/Lock; `restoreHistory` war async ohne Reentrancy-Guard →
  Cmd+Z-Hammering startete überlappende `loadFromJSON`-Läufe. **Fix:**
  `engine/history-manager.ts` ist jetzt alleiniger Besitzer (Stack + Index + Limit
  + Lock). `runExclusive` serialisiert Restores (jeder wartet auf den vorigen,
  `isRestoring` für die Dauer gehalten). Store hält nur noch `canUndo/canRedo`.
- **F4 — Snapshot-Gewicht:** Jeder History-Step ist eine Vollkopie inkl.
  Base64-Bilder. 2-MB-Foto × 50 Steps ⇒ bis ~100 MB Heap nur für Undo —
  plausibelste Wurzel der Performance-Lags aus `b0f78da`.
- **F5 — Drei Benachrichtigungswege:** native Fabric-Events, Custom-Channel
  `cellar:property-changed` (8× `as any`), manuelles `setLayers`-Spiegeln durch
  Aufrufer (`use-canvas-sync.ts:17`, „panel snap-back"). Wer eine Bridge-Methode
  ergänzt, muss raten, welcher Weg greift.
- **F6 — Teardown-Falle ✅ gefixt 2026-10-05 (#27):** `canvas.off('selection:created')` ohne Handler-Ref
  (`use-canvas-sync.ts:133`) entfernt **alle** Listener dieses Events — aktuell
  verdeckt, weil Teardown ≈ Dispose, aber fragil.
- **F7 — Root zu fett:** Wine-Field-Sync, Crop, PDF-Export, Drag&Drop, Hotkeys,
  Fullscreen-Escape, Portal in einer 270-Zeilen-Komponente.

### Plan (commit pro Schritt, jeweils mit Verify)

| # | Schritt | Verify | Aufwand |
|---|---|---|---|
| ✅ | ~~**F1-Fix:** `imageSourceFromBlob(blob)`-Helper (Data-URL), alle 4 Upload-Pfade darüber~~ **erledigt 2026-06-20** | croppen/pasten → Reload → Bild da; Unit-Test 3/3 ✅ | S |
| ✅ | ~~Objekt-Fabriken → `engine/object-factory.ts` (gemeinsames `CORNER_STYLE` + `attach(meta)`), Bridge delegiert~~ **erledigt 2026-06-20** | Bridge 881→715 LOC, 7 `place()`-Delegationen, Lint 0 · 11/11 | S |
| ✅ | ~~mm↔px-Mapping aus `get/updateActiveObject` → pure Functions in `object-properties.ts`, **Unit-Tests pro Objekttyp**~~ **erledigt 2026-06-20** | CRAP 462 ⇒ unter Threshold (raus aus fallow-Top-Liste); 11 Unit-Tests pro Kind | M |
| ✅ | ~~History → `engine/history-manager.ts` (Stack + Index + Reentrancy-Lock); Store behält nur `canUndo/canRedo/isDirty`~~ **erledigt 2026-06-20** | 9 Unit-Tests (push/undo/redo/Limit/Branch-Truncation/serialisierte Restores); Store auf `canUndo/canRedo` + `setHistoryFlags` reduziert; Undo/Redo-Buttons disablen jetzt. **Browser-Smoke (Cmd+Z-Hammering) steht noch aus** (kein Dev-Server). | M |
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

### #32 — Umbau auf Basics: Hochladen, Overlays, Flaschenansicht *(seit 2026-11-10, in Arbeit; Stand 2026-11-12: Schritte 1 bis 4 fertig, Schritt 5 begonnen)*

Auftrag, Entscheidungen und Annahmen stehen in `KNOWN-ISSUES.md` #14 und in `/CELLAR-CANVAS.md` (Entscheidungen 9 bis 11).
Ein Commit je Schritt, diese Liste wandert mit. **Wer weitermacht: zuerst den Block „Übergabe“ unter der Tabelle lesen.**

| # | Schritt | Stand |
|---|---|---|
| 1 | Zuschnitt-Vorschau, Overlays im Vollbild, Esc, Seiten-Scroll | ✅ 2026-11-11 |
| 2 | Schriften: nach dem Laden neu messen (Laden, Undo, Einfügen, Schriftwechsel), Export wartet, Schriftliste per Tastatur und mit der echten Schrift | ✅ 2026-11-11 |
| 3 | Entfernen: Extras (Emoji, Unterschrift, Ornamente), Lineal, Tour, Gruppieren, Verlauf, Hand-Button, Snapping-Schalter | ✅ 2026-11-11 |
| 4 | Neue Oberfläche: Kopf, Werkzeugleiste, Kontext-Leiste ohne Überlauf, rechte Seite als Abschnitte, Hinweise als Banner, Zoom-Leiste | ✅ 2026-11-11 |
| 5 | Hochladen zuerst: Bild füllt das Etikett, Zuschnitt optional, Einrasten an den Etikettkanten, größeres Einpassen, leeres Etikett mit Ablagefläche | begonnen 2026-11-12: Teil 1 (Platzierung, Einrasten) im Code, Rest offen |
| 6 | Texte und Sprache: Klartext statt Jargon, Kürzel je Plattform, Validator und Ebenennamen in de/en, Text-Ebenen heißen wie ihr Inhalt | offen |
| 7 | Weindaten-Overlays als Schalter, formatierte Werte, Pflichtangaben-Block, Vorlagen darauf umgestellt (inkl. Überlappung in „Klassisch“) | offen |
| 8 | Flaschenansicht: `BottleStage` drehbar und mit Etikettmaßen, Umschalter „Etikett / Flasche“ | offen |
| 9 | Showcase-Seite, `COMPONENT.md`, unabhängiger Review, Abschluss | offen |
| 10 | Auflösungshinweis am Bild: nicht blockierend, wenn ein Bild bei seiner Größe unter etwa 150 dpi liegt | offen, nach Schritt 9 (User, 2026-11-12) |

**Übergabe (Stand 2026-11-12):** Der Umbau ist nicht fertig, die Session endete mitten in Schritt 5 (Session-Limit).
Wer weitermacht, braucht diesen Block, die Schritt-Notizen darunter und `KNOWN-ISSUES.md` #14.

- **Commits auf `main` (nichts gepusht):** Schritt 1 `e5a8d1b`, 2 `4b773a6`, 3 `eb67749`, 4 `a1d7c33`, 5 Teil 1 `ab942d5`;
  davor `c572a4c` (#31) und `ebff576` (Entscheidungen). Der Arbeitsbaum ist sauber bis auf `Tempchat.txt` im Repo-Root:
  nicht von dieser Arbeit, nie stagen.
- **Weiter bei:** dem Rest von Schritt 5 (unten), danach 6, 7, 8, 9 und 10 in dieser Reihenfolge. Die Reihenfolge hat Gründe:
  Schritt 7 braucht die Sprache aus 6 (Zahlenformat nach Locale), Schritt 8 braucht das fertige Etikett aus 5 bis 7.
- **Vorgehen je Schritt (Entscheidung des Users, 2026-11-10):** `bun run lint`, Typecheck (`cd components-showcase &&
  ./node_modules/.bin/tsc --noEmit`), `bunx vitest run components/cellar-canvas`, Browser-Check mit Playwright (Dev-Server
  nur als Hintergrund-Task, danach genau diesen Task beenden und `lsof -i :5171` prüfen; zum Bridge-Zugriff im Browser
  siehe „Arbeitshinweise“ oben), Tabellenzeile auf ✅ mit Datum, Notizen unter der Tabelle, dann **ein Commit je Schritt**
  direkt auf `main`, Message aus einer Datei (`git commit -F`), **ohne Push**. Tests für die Kernfunktionen des Umbaus sind
  freigegeben (User, 2026-11-12), weitere neue Tests nur nach ausdrücklichem Ja des Users.
- **Zuerst im Browser prüfen: Teil 1 von Schritt 5 ist nur über Bridge-Aufrufe bestätigt, nicht über die Oberfläche** (`/designer`, Vollbild 1440 × 900;
  die Demo startet mit der Vorlage „Classic“ und einem Entwurf in `localStorage` unter `cellar-canvas-draft`, für saubere
  Tests löschen):
  1. „Bild“, Datei im Etikettformat (z. B. 1063 × 1417), im Zuschnitt bestätigen: Das Bild deckt das Etikett (Position &
     Größe: X ≈ 0, Y 0, Breite ≈ 90, Höhe ≈ 120) und liegt in der Ebenenliste ganz unten, Text darüber bleibt sichtbar.
  2. Dasselbe mit einem Querformat (z. B. 2400 × 1800): Breite 90 mm, mittig, obenauf.
  3. Bild aus der Zwischenablage einfügen (Strg/Cmd+V).
  4. Ein Rechteck an eine Etikettkante ziehen: Hilfslinie, es rastet exakt ein.
  5. Ein zweites deckendes Bild: liegt wieder exakt auf dem Etikett (kein 8-px-Versatz).
  Die Punkte 2, 4 und 5 sind über Bridge-Aufrufe schon bestätigt (Zahlen unter Teil 1), offen sind die Wege über die Oberfläche
  (1 und 3) und der Eindruck mit einem echten Entwurf. Findet man dabei etwas, zuerst hier und in `KNOWN-ISSUES.md` #14
  eintragen.

**Rest von Schritt 5** (mit Ort im Code; Plan, vom User nicht bestätigt, soweit nicht anders vermerkt):

1. **Zuschnitt beim Hochladen nicht mehr erzwingen.** Heute öffnen `MainToolbar.handleFileChange`
   (`components/toolbar/MainToolbar.tsx`, Zeile 28 bis 31) und `CellarCanvas.handleDrop` (Zeile 454 bis 459) den Zuschnitt
   (`setCropper({ open: true, src })`); erst `handleCrop` (Zeile 213) ruft `bridge.addImage`. Neu rufen beide direkt
   `prepareImageSource(file).then(src => bridge.current?.addImage(src)).catch(reportImageError)`. Den Zuschnitt erreicht man
   über „Zuschneiden“ in der Kontext-Leiste (der `cropperTargetId`-Pfad mit `updateImageSource`); der `addImage`-Zweig in
   `handleCrop` ist danach tot und fliegt raus. Der Standardrahmen des Zuschnitts (95 %) schneidet heute ohne Zutun 5 % ab
   (Befund 10.11.): Beim Zuschneiden eines vorhandenen Bildes soll der Rahmen das ganze Bild umfassen (`initialCrop` in
   `components/image-cropper-modal/`). *Warum:* Kunden mit fertigem Entwurf wollen hochladen und fertig sein, der
   Pflicht-Zuschnitt war der größte Reibungspunkt im Test vom 10.11. *Woran es scheitern kann:* Ein Foto im falschen Format
   landet jetzt eingepasst mit Rand statt zugeschnitten. Das ist gewollt, gehört aber mit einem echten Foto angesehen.
2. **„Ersetzen“ erhält die Größe nicht** (siehe Teil 1): Das Ersatzbild in die bisherige Anzeigebox (`width × scaleX`,
   `height × scaleY`) einpassen, bei einem deckenden Bild wieder nach `fitImageToLabel` platzieren. Erst im Browser mit zwei
   Bildern verschiedener Pixelmaße bestätigen, dass es wirklich springt.
3. **Größeres Einpassen:** `FabricBridge.zoomToFit` (`engine/fabric-bridge.ts`) rechnet mit Etikett + 2 × 40 mm Arbeitsrand
   (`sceneWidth = mmToPx(widthMm + 2 * bleedMm)`); das Etikett belegt bei 1030 px Breite nur etwa 300 px (Befund 10.11.).
   Neu: das Etikett allein (`mmToPx(widthMm)` × `mmToPx(heightMm)`), Versatz so, dass es mittig steht:
   `tx = (viewWidth - labelWidth * scale) / 2 - bleedPx * scale` (das Etikett liegt in der Szene bei `bleedPx`), `ty`
   entsprechend; Padding 24 px und Höchstmaß 2,0 bleiben. Überstehende Objekte im Arbeitsrand bleiben per Zoom und
   Verschieben erreichbar. Maske und Backdrop in `CellarCanvas.tsx` hängen am Viewport und folgen von selbst, trotzdem
   ansehen. `resize()` und der Vollbild-Wechsel rufen `zoomToFit` ebenfalls auf.
4. **Leeres Etikett mit Ablagefläche** (Ersatz für die entfernte Tour): Solange `layers.length === 0`, zeigt
   `components/canvas/LabelCanvas.tsx` auf dem Etikett einen Hinweis „Bild hierher ziehen oder hochladen“ mit den Knöpfen
   „Bild hochladen“ (derselbe Datei-Dialog wie in `MainToolbar`) und „Vorlage wählen“ (öffnet den Abschnitt `templates`;
   `RightPanel` hält den Accordion-Zustand unkontrolliert, `defaultValue={['wine', 'layers']}`, er müsste dafür kontrolliert
   werden), dazu eine Hervorhebung beim Ziehen einer Datei über die Fläche (`onDragOver`/`onDrop` hängen schon in
   `CellarCanvas.tsx`, Zeile 504). `pointer-events: none` außer auf den Knöpfen. Neue Texte in `messages.ts` (de + en, kein
   ungenutzter Key), Touch-Ziele 44 px. *Woran es scheitern kann:* Vorlage oder Weinfelder füllen das Etikett sofort, dann
   ist der Hinweis weg (gewollt); auf dem Handy ist die Fläche klein, der Hinweis muss kurz bleiben.
5. **3-mm-Rand als gestrichelte Linie:** `CellarCanvas.tsx` (`BLEED_MASK_OPACITY = 0.55`, `PRINT_BLEED_MM = 3`) lässt die
   Maske 3 mm ins Etikett reichen; das sieht wie ein grauer Rahmen aus und ist seit dem Wegfall des Vorschau-Schalters immer
   da. Neu: Maske nur außerhalb des Etiketts (oder ganz weg, weil der Arbeitsrand nach Punkt 3 kaum noch im Bild ist), dazu
   eine gestrichelte Linie 3 mm im Etikett (`border-dashed`, semantischer Farb-Token, `pointer-events: none`). Danach
   `/CELLAR-CANVAS.md` Entscheidung 3, den Eintrag „2026-05-26 — 3 mm Print-Bleed-Indikator“ im Entscheidungs-Log unten und
   die Zeile „Bleed Mask + Preview“ oben nachziehen.
6. **Abschluss:** Tabellenzeile 5 auf ✅, Notizen, `KNOWN-ISSUES.md` #14 (Befunde „Upload“ und „Einpassen“ löschen,
   Tabellenzeile), `COMPONENT.md` (Features: Einpassen, Hochladen, leeres Etikett), Lint, Typecheck, Tests, Browser
   (Vollbild 1440 × 900, Showcase-Spalte, 390 × 844), Commit.

**Schritt 6, Texte und Sprache (Plan):**

- **Validator zweisprachig:** `wine-fields/validator.ts` trägt `label` und `description` fest auf Deutsch (Zeile 16 bis 45
  und 80/81). Der Validator soll nur Schlüssel liefern, die Texte kommen aus `messages.ts` (de + en) und werden für
  `ValidatorBadge` und `onValidationChange` in der aktuellen Sprache zusammengesetzt (die Prop gibt `label`/`description`
  an Einbetter weiter, ihre Form ändert sich nicht). Die Verweise auf die Verordnungen bleiben wörtlich. Annahme: Kurze
  englische Beschreibungen genügen; die rechtliche Prüfung der Texte bleibt beim User.
- **Ebenennamen** kommen aus fünf Stellen: `engine/object-factory.ts` (`'Rectangle'`, `'Circle'`, `'Line'`, `'Image'`,
  `'QR Code'`; ein Text heißt wie sein Anfangstext, also dauerhaft „Neuer Text“), `templates/templates.ts` (deutsch:
  „Trennlinie“, „Akzentbalken“, „Rahmen“, „Farbblock“), `getLayers()` (`_layerName || text || 'Unnamed Layer'`),
  `renameLayer` und das Weindaten-Panel (die Ebene heißt wie der Wert, „12.5%“). Plan: den Anzeigenamen beim Lesen
  bestimmen: vom User umbenannt (neues Meta-Feld `_nameCustom` in `SERIALIZED_OBJECT_PROPS`, `renameLayer` setzt es) →
  übersetzter Feldname bei `_fieldKey` → Textinhalt, gekürzt → übersetzter Typname. Alte Entwürfe tragen `_layerName` ohne
  `_nameCustom`: Annahme, dass ein früher von Hand umbenannter Name dabei verloren geht (selten); Alternative: jeden Namen,
  der kein Standardname ist, als eigenen übernehmen. *Woran es scheitern kann:* Sprachwechsel zur Laufzeit (die Namen
  müssen beim Lesen übersetzt werden, nicht beim Anlegen); `LayerPanel` ist eine geteilte Komponente und bekommt nur Strings.
- **`text-tool-options/messages.ts`** nennt „Fett (Strg+B)“, „Kursiv (Strg+I)“, „Unterstrichen (Strg+U)“ fest, auch am Mac.
  Diese Kürzel sind nirgends verdrahtet (kein `Mod+B` im Code, Fabric kennt sie nicht, geprüft 2026-11-12): verdrahten
  (dann plattformgerecht über `useShortcutTitle`) oder aus den Titeln streichen. Empfehlung: streichen, es sind Basics.
- **Rest-Jargon:** „Bleed“, „Snapping“, „Rot“ stehen in den `messages.ts` von Designer, Validator-Badge, Layer-Panel, Zuschnitt
  und Farbwähler nicht mehr (geprüft 2026-11-12). Noch durchsehen: die Hotkey-Beschreibungen (`hotkey…Description`) und die
  Showcase-Seite.
- **Prüfen:** Sprache umschalten (Sprachumschalter im Showcase) und Validator-Popover, Ebenenliste, Kontext-Leiste und
  Dialoge in beiden Sprachen ansehen.

**Schritt 7, Weindaten-Overlays als Schalter (Plan; „Schalter, gedruckt, verschiebbar“ hat der User entschieden,
`/CELLAR-CANVAS.md` Nr. 10, der Rest ist Annahme):**

- **Heute:** `components/panels/WineFieldsPanel.tsx` hat je Feld einen Einfügen-Knopf (`bridge.addText(String(value), key)`,
  Rohwert wie „12.5%“ und „750“), der QR-Code geht über `bridge.addQRCode(url)`. Felder ohne Wert sind gesperrt, ein schon
  platziertes Feld sperrt seinen Knopf. Alle Einfügungen landen an derselben Stelle (nur der 8-px-Versatz trennt sie), die
  Ebene heißt wie der Wert. `FabricBridge.applyWineFields` (rund Zeile 489) schreibt bei jeder Prop-Änderung und nach jedem
  Laden `String(value)` in die Textfelder (`_type: 'wine-field'`, `_fieldKey`).
- **Soll:** Je Baustein (Name, Jahrgang, Region, Erzeuger, Pflichtangaben, QR-Code) ein Schalter
  (`components/switch/switch.tsx`). Eingeschaltet liegt der Baustein formatiert an einem festen Platz, ist verschiebbar und
  wird mitgedruckt. Aus = Objekt entfernen (Annahme; Alternative: ausblenden), ein Undo-Schritt je Schalter.
- **Eine Quelle für die Formatierung:** eine neue reine Datei, z. B. `wine-fields/overlays.ts`, mit Formatierern (`12,5 % vol`
  bzw. `12.5% vol`, `750 ml`, ab 1000 ml in Litern; Zahlenformat nach Locale über `Intl.NumberFormat`) und den Bausteinen
  (Feldschlüssel, Baufunktion, Platz). **`applyWineFields` muss denselben Formatierer benutzen**, sonst überschreibt der Sync
  bei der nächsten Prop-Änderung oder dem nächsten Laden den formatierten Text wieder mit dem Rohwert. Bei einem
  Sprachwechsel muss der Sync neu laufen.
- **Pflichtangaben-Block:** Empfehlung: **ein** Textfeld mit mehreren Zeilen (Alkohol, Füllmenge, Allergen, Herkunftsland)
  statt einer Gruppe, mit einem neuen Meta-Feld (z. B. `_covers: ['alcoholPercent', …]`), das der Validator in einzelne
  Einträge auflöst. Dann wirken Schrift, Größe und Farbe aus den normalen Textwerkzeugen auf den ganzen Block, und das
  Layer-Panel zeigt eine Zeile. Eine `fabric.Group` (Validator, Sync und Schrift-Nachmessen schauen schon in Gruppen,
  `withGroupMembers`) bräuchte keine Validator-Änderung, aber die Textwerkzeuge der Kontext-Leiste wirken nicht auf Gruppen,
  und die Fabrik `createGroup` ist seit Schritt 3 weg.
- **Platz ohne Stapeln:** feste Plätze (Name oben mittig, darunter Jahrgang und Region, unten die Pflichtangaben, der QR-Code
  rechts unten) mit Fluss nach gemessener Höhe, damit ein zweizeiliger Name den Jahrgang nicht überdeckt (die
  „Classic“-Überlappung, `KNOWN-ISSUES.md` 10): Höhen erst nach `settleFonts()` lesen, dann untereinander setzen. Von Hand
  verschobene Bausteine nicht zurückholen (Flag am Objekt; neu setzen nur beim Einschalten und bei Namensänderung ohne
  Verschiebung).
- **Lesbarkeit:** je Baustein zwei Textfarben-Voreinstellungen (hell/dunkel), damit die Schrift auf dunklen und hellen
  Entwürfen lesbar bleibt (Annahme; die normale Farbwahl in der Kontext-Leiste bleibt).
- **Vorlagen** (`templates/templates.ts`, 5 Stück) bauen ihre Weinfelder aus denselben Bausteinen statt mit eigenen
  Positionen. Die Schriften dort ändern: heute `sans-serif` und Georgia, besser Schriften aus der Liste in
  `text-tool-options/` (laden über `loadFonts`).
- **Validator:** bleibt die Wahrheit für „EU-konform“. Der Pflichtangaben-Block zählt, solange er an ist und die Werte da
  sind; ein Baustein ohne Wert hat einen gesperrten Schalter mit Hinweis, welcher Wert fehlt. Ein neues, leeres Etikett
  startet ohne Bausteine (Annahme), der Validator bleibt dann gelb, bis Pflichtangaben und QR-Code an sind.
- **Woran es scheitern kann:** (1) Sync ohne Formatierer (s. o.); (2) alte Entwürfe in `localStorage` mit Rohwert-Texten: sie
  laden weiter, der Sync nach dem Laden setzt den formatierten Text; (3) Fluss-Layout und Schriftladen: `settleFonts` ändert
  Höhen nachträglich, der Fluss muss danach noch einmal laufen; (4) ein QR-Code ohne `nutritionalInfoUrl` (Schalter
  gesperrt, wie der Knopf heute).

**Schritt 8, Flaschenansicht (Plan; „Umschalter ‚Etikett | Flasche‘, `BottleStage` trägt das Etikett und dreht per Maus“
hat der User entschieden, `KNOWN-ISSUES.md` #14, der Rest ist Annahme):**

- **Umschalter** über der Arbeitsfläche (Ark `SegmentGroup`, wie im `BackgroundPanel`), Zustand z. B. `view: 'label' | 'bottle'`
  im Store. Der Fabric-Canvas bleibt gemountet (nur verdeckt), damit Zustand, Auswahl und Undo nicht neu aufgebaut werden.
  Werkzeug- und Kontext-Leiste sind in der Flaschenansicht aus, die Einstellungen rechts bleiben bedienbar (Overlays
  erscheinen sofort auf der Flasche).
- **Etikett-Textur:** eine neue Bridge-Methode (z. B. `renderLabelDataUrl(maxWidthPx)`) über den Weg des Exports
  (`engine/export-pipeline.ts` `renderLabelPng`, Papier über `bridge.withPaper()`, vorher `await bridge.whenFontsReady()`),
  höchstens 1024 px breit, ohne Beschnitt. Neu rendern beim Wechsel und, solange die Flaschenansicht offen ist, bei
  Änderungen (`cellar:property-changed`, entprellt).
- **`BottleStage` (`components/bottle-stage/bottle-stage.tsx`) braucht zwei Änderungen:** (a) Drehen per Ziehen (Maus und
  Touch). Heute `pointer-events: none` und `aria-hidden`, nur Pendeln über `progress`/`turns` und Zeigerneigung
  (`followPointer`); neue Prop (z. B. `draggable`) mit Pointer-Handlern, Trägheit, Pfeiltasten für Tastaturnutzer und einem
  Zurücksetzen. (b) Etikettmaße: Die Etikettfläche auf dem Glas ist fest etwa 5:7 (86 × 120 mm). Neue Props für Breite und
  Höhe des Etiketts (und die Flaschenhöhe, Annahme 300 mm, gemessen sind nur Verhältnisse, `bottle-stage/COMPONENT.md`),
  damit ein 90 × 120-Etikett nicht verzerrt.
- **Laden:** `React.lazy(() => import('../../bottle-stage/bottle-stage'))` im `Suspense`, erst beim ersten Klick auf „Flasche“
  (three + R3F wiegen 246 KB gzip; Regel in `CLAUDE.md` und `COMPONENT-GUIDELINES.md` §11; Referenz: `HeroBottle3D.tsx`).
  Danach `bun run build` im `components-showcase` (Chunk-Größe; `grep -l react.memo_cache_sentinel dist/assets/*.js` zeigt,
  ob der Compiler lief).
- **Ohne WebGL oder bei einem Ladefehler** rendert `BottleStage` nichts (eigene Error Boundary). Annahme: Der Umschalter zeigt
  dann die flache Etikettvorschau (dasselbe Bild) mit einem Hinweis; erkennen per `getContext('webgl2')` oder über die
  Boundary. Das beantwortet Frage 7 in `KNOWN-ISSUES.md` nur für den Designer.
- **Warum diese Lösung:** Die Bühne gibt es schon (kein zweiter 3D-Weg); die Textur aus demselben Render wie der Export zeigt,
  was gedruckt wird, mit Papierfarbe. **Warum sie klappen sollte:** `labelSrc` nimmt Data-URLs (`bottle-stage/COMPONENT.md`),
  die Export-Pipeline rendert deterministisch. **Woran sie scheitern kann:** Etiketten weit weg vom Verhältnis der
  Etikettfläche verzerren (daher (b)); das Rendern der Textur blockiert bei großen Etiketten kurz den Hauptthread; das
  WebGL-Kontextlimit (Chrome erlaubt 16) bei häufigem Neu-Mounten; Safari, Firefox und Mobilgeräte sind ungeprüft
  (`KNOWN-ISSUES.md` 13); der Farbraum der Textur (sRGB) ist zu prüfen.

**Schritt 9, Showcase, Doku, Review, Abschluss (Plan):**

- **`components-showcase/src/pages/designer.tsx`:** `CellarCanvasDemo` (Zeile 49 bis 104) steht in der 720 px breiten
  Textspalte der Seite, der Editor zeigt dort immer die schmale Ansicht; die Demo soll die Seitenbreite füllen. Die
  Stummel-Hotkeys am Ende (Zeile 409 bis 427: `Mod+Z`, `Mod+Shift+Z`, `Mod+D`, `Mod+A`, `Mod+G`, `[`, `]`, leere Handler nur
  für die Shortcut-Übersicht) beschreiben zum Teil entfernte Funktionen (`Mod+G` Gruppieren): streichen. Beim Öffnen von
  `/designer` warnt die Konsole außerdem „'Escape' is already registered“, ebenso für `Delete`, `Mod+Z`, `Mod+Shift+Z`,
  `Mod+D` und `Mod+A`: Editor und Demos der Seite melden dieselben Kürzel an (gesehen 2026-11-12, die Quellen sind nicht
  einzeln geprüft). Die Einzel-Demos der
  geteilten Komponenten (LayerPanel, Cropper, TextToolOptions) gegen die geänderten Props (`showHeader`, `basic`) prüfen.
- **`COMPONENT.md`** (Features, Props, Dependencies mit lazy `three`/`@react-three/fiber`, How it works) und
  `bottle-stage/COMPONENT.md` (Drehen, Etikettmaße) auf den Endstand bringen, ebenso die Zustandstabelle oben in dieser
  Datei (Zeilen Tools, Image Crop, Wine Fields, Templates, Zoom, Bleed Mask).
- **Weitere Doku:** `KNOWN-ISSUES.md` (erledigte Befunde von #14 löschen, Tabellenzeile, Frage 7), `/CELLAR-CANVAS.md`
  (Entscheidung 3, „Last updated“), `components/COMPONENTS-OVERVIEW.md`, falls die Zeile zu `cellar-canvas` beschreibend ist.
- **Unabhängiger Review** (globale Regel: ein frischer Subagent, `model: "opus"`, adversarial, **eng geschnitten**, vier
  Kernfunktionen): (1) Hochladen und Platzieren (`fitImageToLabel`, `addImage`, Datei, Drop, Paste, Ersetzen);
  (2) Overlay-Schalter (an/aus, Undo, Wertänderung, Sprachwechsel, Laden aus dem Entwurf, Validator); (3) Flaschenansicht
  (Textur, Drehen, Fallback ohne WebGL, Lazy-Laden); (4) Export unverändert (PNG und PDF, Papier, Beschnitt). Kein
  Stil-Rundumschlag.
- **Abschlussbericht an den User** auf Deutsch. Nennen: Buchart58 behält seine Kopie (nichts kommt von selbst an), API-Bruch
  `disableTour`/`tourStorageKey`, Google Fonts (12.6) bleibt offen, `exportBlob` löst bei einem Fehler nie auf (Entscheidung
  aus Schritt 4, weil Arks `DownloadTrigger` keinen Fehlerpfad hat).

**Schritt 10, Auflösungshinweis am Bild (Plan; „ja, nach dem Umbau“ hat der User am 2026-11-12 entschieden, der Rest ist
Annahme):**

- **Rechnung:** Effektive Auflösung = Pixelbreite des Bildes / angezeigte Breite in Zoll, also
  `img.width / (pxToMm(img.getScaledWidth()) / 25.4)`. `pxToMm` rundet auf 0,1 mm, das genügt hier. Eine reine Funktion, z. B.
  `effectiveDpi(imagePx, displayedMm)` in `engine/`, damit sie sich testen lässt. Beispiele: 340 px auf 90 mm sind 96 dpi,
  1063 px auf 90 mm sind 300 dpi, 2400 px auf 90 mm sind 677 dpi (die Obergrenze von `prepareImageSource`).
- **Schwelle:** Hinweis unter etwa 150 dpi (Annahme: im Druck gelten meist 300 dpi als Ziel und 150 dpi als Untergrenze, ein
  Erfahrungswert, nicht belegt; vor dem Bau gegen die Angaben der Druckerei prüfen). Der Hinweis blockiert nichts, der Export
  bleibt möglich.
- **Ort:** Kontext-Leiste beim ausgewählten Bild, ein kurzer Text mit Warnsymbol und einem Titel, der es erklärt (Annahme;
  optional ein Zeichen in der Ebenenliste). Der Wert wird beim Anzeigen berechnet, nicht gespeichert, damit Skalieren,
  Zuschneiden und Ersetzen ihn von selbst nachziehen.
- **Texte:** neue Keys in `messages.ts` (de + en, mit `{dpi}`), kein ungenutzter Key.
- **Woran es scheitern kann:** SVG ist Vektor und hat keine sinnvolle Auflösung (`prepareImageSource` lässt SVG unverändert):
  überspringen. Ein Bild, das auf Etikettgröße 2400 px hat, löst nie aus. Maßgeblich ist die angezeigte Größe in mm, nicht
  `widthMm`/`heightMm` des Etiketts. Ein gedrehtes Bild ändert die Rechnung nicht.
- **Tests:** `effectiveDpi` als reine Funktion (die Beispiele oben, Grenzfälle Breite 0 und sehr klein).

**Außerhalb der Schritte offen:** Schriften selbst hosten (`KNOWN-ISSUES.md` 12.6, `@fontsource`, eigener Schritt), Drift-Check
zu Buchart58 (Frage 4), Screenreader-Lauf im Browser (offen beim User).

**Schritt 1 (2026-11-11, im Browser geprüft, Chromium 1440 × 900):**

- **Zuschnitt-Vorschau:** `ImageCropper.Image` trug `max-width: 100%` aus dem Tailwind-Preflight. Die Layout-Box war damit
  auf die Breite der Arbeitsfläche (ca. 570 px) begrenzt, Zag rechnet aber mit der natürlichen Größe: Jedes breitere Bild
  erschien zu klein, der Rahmen passte nicht dazu. Jetzt `maxWidth: 'none'`. Geprüft mit 1063 × 1417 px: Bild 255 × 340,
  Rahmen 242 × 323 (95 %), vorher Bild 145 × 193 bei gleichem Rahmen.
- **Overlays im Vollbild:** Die Vollbild-Hülle liegt mit `z-index` 9999 über der Seite, Zuschnitt-Dialog, Farbwähler,
  Schriftliste und Validator-Popover portalten an den `body` (40 bzw. 50) und öffneten dahinter. Beim Dialog fror der
  Editor ein, weil Zag `pointer-events: none` an den `body` setzt. Neu: `components/lib/overlay-container.ts`
  (`OverlayContainerProvider`, `useOverlayContainer`). `ImageCropperModal`, `ColorSwatch`, `TextToolOptions` und
  `ValidatorBadge` reichen den Container an Arks `Portal` durch, der Editor stellt im Vollbild ein Element in der Hülle
  bereit. Ohne Provider bleibt es beim `body`.
- **Esc:** Ein Esc, das Dialog, Popover oder Liste schließt, verließ zugleich das Vollbild (Zag markiert das Event
  nicht). Ein Capture-Listener am `window` merkt sich, ob ein Overlay offen war.
- **Seiten-Scroll:** Im Vollbild trägt `<html>` `overflow: hidden`, der Scrollbalken der Seite schien vorher durch.

**Schritt 2 (2026-11-11, im Browser geprüft):**

- **Ursache:** Fabric misst einen Text beim Anlegen oder Ändern. Lädt seine Webschrift da noch, misst es die
  Ersatzschrift, merkt sich die Zeichenbreiten (`fabric.cache`) und schaut nie wieder hin. Der Google-Fonts-Link entstand
  außerdem erst, wenn `TextToolOptions` mountete, nach einem Neuladen also erst beim ersten angeklickten Text.
- **`FabricBridge.settleFonts()`:** lädt die Schriften aller Texte (`loadFonts` aus `text-tool-options/font-loader.ts`,
  inkl. Gewicht, Stil und Textinhalt für die Unicode-Teilmengen), leert für neu geladene Familien Fabrics Zeichen-Cache
  und misst die betroffenen Texte neu (`initDimensions`, Gruppen per `triggerLayout`). Läuft nach jedem Scene-Load
  (Restore, Undo/Redo), nach `place()`, `applyTemplate()` und nach einem Wechsel von Schrift, Gewicht oder Stil.
  Bewusst „erst anwenden, dann nachmessen“ statt vorab zu laden: Die Auswahl reagiert sofort.
- **Export:** `exportLabelPng`/`exportLabelPdf` warten auf `bridge.whenFontsReady()`.
- **Schriftliste:** `FontSelect` läuft auf Arks `Select` (Pfeiltasten, Pos1/Ende, Tippen, Esc; KNOWN-ISSUES 12.6 zur
  Tastatur erledigt). Eine Schrift außerhalb der Liste wird als das angezeigt, was sie ist: vorher stand
  „Playfair Display“ über jedem Text in `sans-serif`. Neuer Text entsteht in `defaultTextFormat.fontFamily`.
- **Gemessen** mit künstlich um 1,5 s verzögerten Schriftdateien (Playwright `route`), Text in Cinzel: direkt nach dem
  Restore 225,3 px (Ersatzschrift), nach `whenFontsReady()` (1522 ms) 308,3 px, gleich der echten Breite. Vorher blieb
  der falsche Wert auch nach 3 s stehen. Tastatur im Vollbild: Enter, zweimal Pfeil ab, Enter wählt „Lora“.
- **Offen:** Die Schriften kommen weiter von Google (12.6). Die Vorlagen setzen noch `sans-serif`/Georgia, das ändert
  Schritt 7.

**Schritt 3 (2026-11-11, reines Entfernen, im Browser gegengeprüft):**

- **Extras:** `ExtrasPanel.tsx` und `extras/ornaments.ts` gelöscht, dazu `bridge.addEmoji`/`addPath`, `createEmoji`/
  `createPath`, das Meta-Flag `_extras`, die `signaturePad`-Übersetzungen in `i18n/ark-bridge.ts` und die Abhängigkeit
  `emoji-picker-react` (`bun.lock` geändert, `bunx fallow dead-code` unverändert bei den 10 bekannten Befunden).
- **Lineal:** `CanvasRulers.tsx`, `Shift+R`, Header-Button. Der Viewport-Snapshot trägt wieder nur `zoom`/`tx`/`ty`.
- **Tour:** `OnboardingTour.tsx`, Props `disableTour`/`tourStorageKey`, Hilfe-Button, `startTour` im Store,
  `data-tour`-Anker. Als Ersatz kommt in Schritt 5 ein leeres Etikett mit Hinweisen.
- **Gruppieren:** `groupSelected`/`ungroupSelected`, `createGroup`, `Mod+G`/`Mod+Shift+G`, Button. Die Engine schaut
  weiter in Gruppen hinein (Weinfeld-Sync, Validator, Schriften): Gruppen können aus `initialState` kommen, und der
  Pflichtangaben-Block aus Schritt 7 wird eine.
- **Verlauf:** nur die Bedienung im Hintergrund-Panel. `LabelBackground` kennt den Verlauf weiter.
- **Werkzeugleiste:** Buttons „Auswählen“ und „Hand“ entfernt, übrig sind die fünf Einfüge-Aktionen. Leertaste halten
  verschiebt weiter die Ansicht.
- **Snapping:** immer an, Alt unterdrückt es pro Drag. Schalter, `S` und `snappingEnabled` im Store sind weg.
- **Texte:** 51 Keys aus `messages.ts` entfernt, darunter der ungenutzte `hotkeyCategory` (KNOWN-ISSUES 12.13).
- **API-Änderung für Einbetter:** `disableTour` und `tourStorageKey` entfallen ersatzlos.

**Schritt 4 (2026-11-11, im Browser geprüft: Vollbild 1440 × 900 und 1024 × 768, Showcase-Spalte 718 px, Handy 390 × 844):**

- **Raster nach Editor-Breite:** Die Hülle ist ein Container (`@container/editor`). Ab 56rem liegt die rechte Seite in
  einer eigenen Spalte (300 px), darunter über der Arbeitsfläche; der Kopf blendet sie mit „Einstellungen“ ein
  (`aria-expanded`, standardmäßig zu). Vorher brach das feste Raster `auto 1fr 300px` in jeder schmalen Spalte.
- **Kopf:** Etikettmaße, Rückgängig/Wiederholen, Speichern, PNG, PDF, Vollbild. Die Zeile bricht um, wenn sie nicht
  passt (Handy: zwei Zeilen). Der Marken-Schriftzug und der Vorschau-Schalter sind weg: Was gedruckt wird, zeigt ab
  Schritt 8 die Flaschenansicht.
- **Werkzeugleiste:** volle Höhe, Icons mit Beschriftung, „Bild“ zuerst und hervorgehoben. Duplizieren und Löschen sind
  in die Kontext-Leiste gewandert, die Leiste hat damit keine deaktivierten Buttons mehr.
- **Kontext-Leiste:** siehe Zeile oben. Kürzel wie „SW“, „R“, „OP“ sind durch Wörter ersetzt („Stärke“, „Ecken“);
  Deckkraft steht nur noch unter „Position & Größe“. Neu: Zentrieren auf dem Etikett (waagrecht, senkrecht) über
  `bridge.centerOnLabel`, gemessen an der Bounding-Box. Gemessen: Rechteck 20 × 20 mm landet bei 34,8 / 49,9 mm
  (Mitte 44,8 / 59,9; die 0,2 mm kommen vom unsichtbaren 1-px-Rand in der Bounding-Box).
  Breite bei Textauswahl im Vollbild 1024 px: 960 px, kein Überlauf (vorher lagen Zoom und „Anpassen“ außerhalb).
- **Rechte Seite:** Abschnitte statt Tabs (Ark `Accordion`), offen sind anfangs Weindaten und Ebenen. „Ebenen“ steht
  nur noch einmal da (`LayerPanel` mit neuer Prop `showHeader={false}`), der Scrollbalken folgt dem Theme.
- **Hinweise:** `Notices` über der Arbeitsfläche statt im Kopf, schließbar. Aus `insertError` wurde `notice`
  (`'image' | 'qr' | 'export'`). Neu ist der Export-Fehler: `exportBlob` fängt ihn ab und zeigt den Hinweis; weil Arks
  `DownloadTrigger` keinen Fehlerpfad hat, löst das Promise dann nie auf (so wird nichts gespeichert). Die
  Autosave-Warnung lässt sich schließen und kommt erst nach einem erfolgreichen Speichern wieder.
- **Zoom-Leiste:** unten links mit der Stufe in Prozent, daneben der Validator; auf schmaler Fläche rutscht der
  Validator darüber (vorher überlappten beide am Handy).
- **Tastenkürzel in Titeln:** `useShortcutTitle` schreibt sie über `formatForDisplay` plattformgerecht („⌘ Z“ bzw.
  „Ctrl+Z“) und lässt sie auf Touch-Geräten weg. Die Button-Namen kommen aus den `hotkey…Label`-Texten.
- **Aufgeräumt:** `components/shared/index.ts` (Index-Reexport, KNOWN-ISSUES 12.13) ist gelöscht,
  `bridge.selectLayer` ersetzt den direkten Fabric-Zugriff im Panel, `fitShiftX` ist entfernt.
- **Geteilte Komponenten:** `LayerPanel` hat `showHeader`, `TextToolOptions` hat `basic`.
- **Offen aus diesem Schritt:** Der 3-mm-Randstreifen sieht auf dem Etikett wie ein grauer Rahmen aus und ist ohne den
  Vorschau-Schalter immer da. Schritt 5 ersetzt ihn durch eine gestrichelte Linie.

**Schritt 5, Teil 1 (2026-11-12; Lint, Typecheck und 48 Tests grün, im Browser über die Bridge geprüft, siehe letzter Punkt):**

- **`fitImageToLabel` (`engine/object-factory.ts`):** Liegt das Seitenverhältnis des Bildes innerhalb von ±4 % am Etikett
  (`FILL_RATIO_TOLERANCE`), gilt es als „im Format des Etiketts“ (fertiger Entwurf, auch mit 3 mm Beschnitt: 1,6 bis
  1,8 % Abweichung). Dann deckt es das Etikett ab (`scale = max(Etikettbreite / Bildbreite, Etiketthöhe / Bildhöhe)`),
  sitzt mittig und liegt hinten, über einem früheren deckenden Bild (`place(…, { behind: true })` in der Bridge, ohne den 8-px-Versatz, der ein zweites
  Bild vom Rand geschoben hätte). Jedes andere Bild wird eingepasst (`min(…, 1)`: nie größer als seine Pixel), mittig und
  obenauf. `configureImage` bekommt die Platzierung als dritten Parameter. Mit `bun` durchgerechnet (Etikett 340 × 454 px):
  1063 × 1417 deckt (340,6 × 454), 1134 × 1488 deckt (346 × 454, je 3 px Überstand links und rechts), 2400 × 1800 wird
  340 × 255, 1000 × 1000 wird 340 × 340, 50 × 50 bleibt 50 px, 90 × 120 deckt mit 3,8-facher Vergrößerung, ein Bild ohne
  Maße ergibt kein NaN (bleibt unsichtbar wie vorher).
- **Eingänge:** alles läuft über `bridge.addImage`: das Ergebnis des Zuschnitts (`CellarCanvas.handleCrop`) und das Einfügen
  aus der Zwischenablage (`use-clipboard-paste.ts`). „Ersetzen“ (`updateImageSource`, Fabric `setSrc`) ist nicht angefasst:
  `setSrc` setzt Breite und Höhe auf die Pixelmaße des neuen Bildes, den Skalierungsfaktor behält es. Ein Ersatzbild mit
  anderen Pixelmaßen erscheint deshalb in anderer Größe (Annahme aus dem Fabric-Quelltext, nicht im Browser geprüft).
- **Einrasten:** `SnapManager` rastet an Etikettmitte und allen vier Etikettkanten ein (vorher nur Mitte).
- **Warum diese Lösung:** Kunden bringen meist einen fertigen Entwurf mit (Ziel in `KNOWN-ISSUES.md` #14). Im Etikettformat
  soll er ohne Zutun exakt sitzen. „Immer abdecken“ schneidet ein Foto in fremdem Format unbemerkt an, „immer einpassen“
  lässt auf fertigen Entwürfen einen Rand stehen. Die Entscheidung trifft allein das Seitenverhältnis.
- **Warum sie klappen sollte:** Der Beschnitt, den Druckdaten üblicherweise mitbringen, verschiebt das Verhältnis um 1,6 bis
  2,6 % (3 bis 5 mm), die Toleranz liegt darüber. Die Rechnung ist rein und durchgerechnet. Annahme: Ein Foto, das bis zu
  4 % vom Etikettformat abweicht und deshalb leicht angeschnitten wird, fällt nicht auf.
- **Woran sie scheitern kann:** Ein Entwurf mit mehr als etwa 8 mm Beschnitt rundum (10 mm ergeben 4,8 %) wird eingepasst und
  lässt einen Rand stehen; der Kunde skaliert dann von Hand. Ein zu kleines Bild im Etikettformat wird abdeckend
  vergrößert und ist unscharf, eine Auflösungswarnung gibt es noch nicht (kommt in Schritt 10). Man merkt beides
  beim ersten Hochladen eines echten Kundenentwurfs; ein solcher Test steht noch aus.
- **Im Browser geprüft** (Chromium 1440 × 900, `/designer`, per `bridge.addImage` mit im Skript erzeugten PNGs, nicht über
  den Datei-Dialog; Etikett 340 × 454 px, `bleedPx` 151, Zoom 0,76): Bild 1063 × 1417 liegt auf Index 0 hinter dem Text, bei
  x 150,71 und y 151, 340,58 × 454 px. Bild 2400 × 1800 liegt obenauf, bei x 151 und y 250,5, 340 × 255 px (mittig). Bild
  1134 × 1488 (3 mm Beschnitt) liegt ganz hinten, bei x 148, 345,99 × 454 px (3 px Überstand links und rechts). Ein zweites
  Bild im Etikettformat sitzt wieder exakt bei 150,71 / 151 (kein 8-px-Versatz), die Reihenfolge von hinten nach vorn ist
  danach: drei deckende Bilder, Text, Querformat (damals lag das neueste deckende Bild ganz hinten, siehe „Korrektur“ unten). Einrasten: ein Rechteck von 76,6 px, jeweils 3 px vor eine Etikettkante
  gezogen, sitzt danach exakt auf links 151, rechts 491, oben 151, unten 605. **Nicht gesehen:** der Weg über den Datei-Dialog
  mit Zuschnitt, das Einfügen aus der Zwischenablage und das Aussehen mit einem echten Kundenentwurf.
- **Tests (2026-11-12, Freigabe des Users, geschrieben von einem Opus-Subagenten, Commit `11e8f4b`):** 90 Tests in 8 Dateien
  (vorher 48 in 6), mit den zwei Tests der Korrektur unten 92. `engine/object-factory.test.ts` (23): `fitImageToLabel` mit den
  Rechenbeispielen, den Toleranzgrenzen auf beiden Seiten und den Eigenschaften „mittig“, „deckt“ bzw. „passt hinein, nie größer
  als die eigenen Pixel“. `engine/snap-manager.test.ts` (12): Etikettmitte und die vier Kanten rasten innerhalb von 5 px exakt
  ein, außerhalb nicht. `engine/fabric-bridge.test.ts` (+9): Platzierung in `addImage` (Reihenfolge, Position, kein
  Einfügeversatz, Fehlerfall mit Hinweis) und `centerOnLabel` (waagrecht, senkrecht bei gedrehtem Objekt, Mehrfachauswahl).
  17 Mutationen am Produktionscode machten je mindestens einen Test rot, die zwei Tests der Korrektur wurden ebenso geprüft.
  Nicht getestet: `zoomToFit` (wird in Schritt 5 umgebaut), Schriftladen, Export, Cropper, Flaschenansicht, UI.
  - *Bekannt:* Beim Lauf von `fabric-bridge.test.ts` steht einmal „Not implemented: HTMLCanvasElement's getContext()“ in der
    Ausgabe, die Tests sind grün. Ursache ist ein Render per `requestAnimationFrame` aus dem alten Block `wine-field sync`
    (echte Timer), der nach `afterAll` feuert, wenn der Stub für `getContext` schon zurückgesetzt ist; die längere Laufzeit der
    Datei macht es sichtbar. Abhilfe: in dem Block Fake-Timer verwenden oder im `afterAll` kurz warten.
  - *Bekannt:* Der Showcase-Typecheck aus `components-verify` schließt Test-Dateien aus (`components-showcase/tsconfig.json`). Die
    neuen Tests wurden einmal mit einer vorübergehenden tsconfig geprüft (grün). Siehe Frage 11 in `KNOWN-ISSUES.md`.
- **Korrektur nach den Tests (2026-11-12):** Der Subagent fand, dass ein zweites deckendes Bild hinter dem ersten landete und
  damit unsichtbar war, obwohl es ausgewählt war (ein falsch hochgeladener Entwurf hätte sich so nicht ersetzen lassen). Jetzt
  geht ein deckendes Bild direkt über das oberste Bild, das das ganze Etikett deckt (`FabricBridge.indexAboveArtwork`, 1 px
  Toleranz, über die Begrenzungsbox), sonst ganz nach hinten; alles andere bleibt darüber. Zwei Tests dazu. Die Reihenfolge nach
  der Korrektur ist nur per Test geprüft, nicht im Browser.

### #31 — mm-Eingaben auf 0,1 mm genau; 50-MP-Umstellung gemessen und verworfen *(2026-11-09 — gefixt, im Browser geprüft)*

- **mm-Rundung:** `mmToPx` rundete auf ganze px, `pxToMm` auf ganze mm. Das Properties-Panel arbeitete damit im
  1-mm-Raster: aus der Eingabe 12,5 mm wurde die Anzeige 12. Jetzt gibt es `mmToPxExact` (ungerundet) für den
  Schreibpfad der Nutzereingaben (`xToLeft`, `yToTop`, `widthToFabricProps`, `heightToFabricProps`), und `pxToMm`
  rundet auf 0,1 mm. `mmToPx` bleibt ganzzahlig für Canvas- und Label-Maße, weil ein Canvas nicht gebrochen sein kann.
- **Standardformen exakt angelegt:** `object-factory.ts` und `templates.ts` nutzen ebenfalls `mmToPxExact`. Sonst
  läse ein frisch eingefügtes 20-mm-Rechteck 20,1 mm (76 px), was die alte Rundung bisher verdeckt hat.
- **Im Browser bestätigt** (Playwright, 1440 px): Eingabe 12,5 / 7,3 / 33,3 / 21,7 mm zeigt vorher 12 / 7 / 33 / 22,
  jetzt exakt die Eingabe; der Pfeiltasten-Schritt funktioniert (13,5); ein neues Rechteck zeigt wieder 20 mm.
- **50-MP-Foto: Umstellung verworfen.** Versucht war, die Maße per `<img>` zu lesen und mit `createImageBitmap(blob,
  { resizeWidth | resizeHeight })` direkt skaliert zu dekodieren. Gemessen in headless Chromium (Playwright 1.64,
  Summe des RSS aller Browser-Prozesse, Spitze minus Ausgangswert, zwei Läufe je Variante, 8000×6250 JPEG, 17,6 MB):

  | Variante | Spitze |
  |---|---|
  | bisher: `createImageBitmap(blob)` | +210 MB |
  | `createImageBitmap` mit `resizeWidth`, Qualität `high` | +257 MB |
  | `createImageBitmap` mit `resizeWidth`, Qualität `low` | +210 MB |
  | nur die `<img>`-Probe der Maße (Blob-URL, `onload`) | +38 MB |
  | `<img>` direkt skaliert auf ein Canvas zeichnen | +359 MB |
  | `<img>` mit `decode()`, dann skaliert zeichnen | +550 MB |

  Im Editor Ende-zu-Ende (Datei wählen bis Zuschnitt-Dialog): bisher +221 MB, mit der Umstellung +296 MB; schon ein
  1200×800-Bild kostete +88 statt +55 MB. **Chromium dekodiert trotz Resize-Optionen das volle Bild**, und keine
  Variante schlägt die einfache Dekodierung. `image-source.ts` ist deshalb wieder auf dem Stand vor dem Versuch.
  Nur Chromium gemessen; Firefox und Safari offen. Die EXIF-Drehung wurde im Versuch richtig behandelt (Orientation 6
  ergab 1600×2400), das ist also kein Hindernis. Die Speicherspitze bleibt ein bekannter Rest.
- **Tests:** Erwartungen in `object-properties.test.ts` an die exakte Umrechnung angepasst (vorher 76 px und 20 mm,
  jetzt 75,59 px und 20,1 mm in der Gegenrichtung). Keine neuen Tests.
- **Geprüft:** vitest 48/48, ESLint auf den geänderten Dateien sauber.

### #30 — Browser-Test der Checkliste, sieben Fixes *(2026-10-27 — gefixt)*

Die Checkliste vom 2026-10-15 lief am 2026-10-25/26 erstmals im Browser (Playwright-MCP gegen `/designer`). Die meisten Punkte bestanden; sieben Fehler wurden behoben und am 2026-10-27 auf dem aktuellen Paketstand (Ark 5.39.3/Zag 1.45, React 19.3, motion 14.6, TanStack Hotkeys 0.17) komplett nachgetestet:

- **Snapping sprang beim Ziehen zurück** (`snap-manager.ts`): Fabrics `dragHandler` setzt nur `left`/`top`, `getBoundingRect()` liest die gecachten `aCoords`. `handleMoving` rechnete mit der Position vom letzten `setCoords()`. Jetzt `setCoords()` davor; Rechteck ohne Rücksprung, Mehrfachauswahl rastet stabil ein.
- **Unterschrift verschwand beim Loslassen** (`ExtrasPanel.tsx`): Mit controlled `paths` speichert Zag den neuen Strich nicht und meldet aus `onDrawEnd` den alten Prop-Wert `[]`. Jetzt uncontrolled über `useSignaturePad` + `SignaturePad.RootProvider`; „Löschen“/„Einfügen“ nutzen `clear()`, `paths`, `empty`.
- **Tour unbedienbar** (`OnboardingTour.tsx`): Zags Inline-`z-index` am Positioner überschrieb `z-50`, der Inhalt lag unter dem Backdrop; Dialog- und Floating-Schritte bekommen von Zag keine Position. Jetzt `--tour-z-index: 10000` für Backdrop/Spotlight/Positioner (über der Vollbild-Shell mit 9999), Dialog-/Floating-Schritte per `data-[type=…]` mittig im Viewport, Spotlight nur bei Tooltip-Schritten, Fortschritt übersetzt (`tourProgress`).
- **Winkel-Feld ohne zugänglichen Namen** (`BackgroundPanel.tsx`): `label` am `NumberInput` statt eines losen `<span>`.
- **„Hinweis schließen“ schrumpfte auf 14 px Breite** (`CanvasHeader.tsx`): `size-11` als Flex-Item ohne Padding; jetzt Muster der Nachbar-Buttons (30 × 30 Maus, 44 × 44 bei `pointer-coarse`).
- **Ebenenliste verlor nach `Entf` den Fokus** (`layer-panel.tsx`): Fokus springt nach dem Löschen auf die nächste Zeile, am Ende auf die vorige, bei leerer Liste auf den Empty-State; auch über den Lösch-Button.
- **Showcase: Vollbild ließ sich nicht per `Esc` verlassen** (`components-showcase/src/pages/designer.tsx`): Die Layer-Panel-Demo registrierte `Escape`/`Delete` seitenweit mit TanStacks Default `preventDefault` (in 0.17 unverändert); jedes `Escape` kam `defaultPrevented` beim Vollbild-Listener an, jedes `Entf` im Editor löschte zusätzlich eine Demo-Ebene. Die Kürzel wirken jetzt nur bei Fokus in der Demo. Bewusst nicht per `target`: Der Listener am Element liefe vor Reacts Root-Delegation und nähme der fokussierten Zeile `Delete` und dem Umbenennen-Feld `Escape` weg.

Neu gefunden und nicht behoben (Entscheidung offen oder größer): siehe `KNOWN-ISSUES.md`.

### #28 — Review-Befunde aus #27 umgesetzt, Tests, Browser-Smoke *(2026-10-06 — gefixt)*

Entscheidungen (User): Feld ohne Wert ausblenden statt löschen, `initialState` nur beim Mount, Größen-Weiche
für Bilder. Je ein Commit, identisch in der Buchart58-Kopie:

- **Wein-Feld-Sync:** in die Bridge gezogen (`setWineFields`), läuft nach jedem Scene-Load erneut. Feld ohne
  Wert (auch `null`/Leerraum, `hasFieldValue()`) wird geleert, ausgeblendet und mit `_valueMissing`
  markiert; mit Wert erscheint es wieder an derselben Stelle. Vom User ausgeblendete Felder bleiben aus.
  Validator zählt nur Gedrucktes (sichtbar, Text nicht leer).
- **`initialState`** wird einmal beim Mount gelesen (Ref); neues Dokument = neuer React-`key`.
- **Bild-Weiche:** `encodingPlan` (Transparenz → PNG, verlustbehaftet → JPEG, opak verlustfrei → PNG und
  erst über 1,5 MB JPEG) und `keepSmaller` (ohne Verkleinerung nie größer als das Original).
- **Kleinkram:** gezogene Linie springt bei Breitenänderung nicht mehr zurück; Fokus bleibt beim
  Fullscreen-Wechsel; Undo/Redo setzen `isDirty`.
- **Tests:** `fabric-bridge.test.ts` baut eine echte Bridge auf jsdom (2D-Context-Attrappe mit
  `canvas`-Rückreferenz für Fabrics Text-Rendering) und prüft mit Fake-Timern Debounce, Flush, Reset,
  Snapshot vor Pointer-Interaktion, Redo-Button, `isDirty` sowie den Wein-Feld-Sync. Gegenprobe: ohne
  `mouse:down:before`-Flush bzw. ohne Re-Apply nach Scene-Load wird der jeweilige Test rot. 27 → 48 Tests.
- **Browser-Smoke** (Playwright gegen `/designer`, Skript nicht im Repo): Fullscreen hin und zurück lässt
  dieselbe Fabric-Canvas im DOM und den Fokus auf dem Button; Mausrad verschiebt (Label 120 px, Größe gleich),
  Strg+Mausrad zoomt; Undo nach Einfügen + sofortigem Ziehen landet auf der Ausgangsposition (35 mm), keine
  Konsolenfehler. **Gegenprobe:** mit dem alten Inline↔Portal-Wechsel existiert nach dem Toggle keine
  `.upper-canvas` mehr (B1 im Browser bestätigt); ohne Flush landet Undo auf einem Zwischenstand (39 mm).

### #27 — Abgleich mit der Buchart58-Kopie *(2026-10-05 — gefixt)*

Die Kopie in `Buchart58/storefront/src/atelier/cellar-canvas` und der Upstream waren in beide Richtungen
auseinandergelaufen: Buchart58 hatte am 2026-09-26 eigene Fixes (dort STATUS #26, Analyse in
`Buchart58/CELLAR-CANVAS-PLAN.md`, Bug-Nummern B1–B13), der Upstream am 2026-09-29 (#26 oben). B3
(Fullscreen-Restore) und B4 (Undo nach Reload) hatten beide Seiten unabhängig gelöst. Jetzt abgeglichen,
ein Commit pro Fix:

**Buchart58 → Upstream**
- **B1 Fullscreen-Remount:** Der Wechsel Inline ↔ `createPortal(shell, body)` mountete den `<canvas>` neu,
  Fabric hing am toten Element. Stabiler Portal-Container, nur im DOM verschoben (Platzhalter ↔ `body`).
  Der Fullscreen-Refit-Effekt aus #26 bleibt.
- **B2 Bildgröße:** `prepareImageSource` für alle fünf Bild-Eingänge, lange Kante ≤ 2400 px, JPEG q0,9
  bzw. PNG bei Transparenz. F4 (Snapshot-Gewicht) entschärft, nicht gelöst (Asset-Registry bleibt Schritt 5).
- **Autosave-Fehler sichtbar:** `draftSaveFailed` + Hinweis im Header statt `catch {}`.
- **B6 Wein-Felder:** ohne Wert nicht einfügbar, `editable: false` + serialisiert, Click-to-Edit
  respektiert das. Die Prop-Liste ist jetzt `SERIALIZED_OBJECT_PROPS`; der Showcase-Startzustand hatte
  vorher eine eigene, kürzere Liste. Templates lassen Felder ohne Wert weg statt Platzhalter wie
  „Weinname" zu drucken (die Templates nutzen nur Name/Jahrgang/Region, den Validator betraf das nicht).
- **B8 / F6:** Listener-Teardown mit Handler-Referenz.
- **B12 Wheel:** Scroll/Zwei-Finger verschiebt, Pinch bzw. Strg/Cmd+Wheel zoomt.
- **B13:** Default-Text lokalisiert, `_extras` serialisiert, `toolCrop`-Fallback raus; jsPDF nur noch
  auf dem PDF-Pfad (in Buchart58 gemessen: `export-pipeline`-Chunk 128 KB → 0,8 KB gzip).
- **Bleed-Maske** positioniert sich am Backdrop-Rechteck statt in Prozent des Canvas — folgt Zoom/Pan.
- **Restore ohne 100-ms-Timer:** läuft direkt im Effekt (die Bridge-Ref steht dann schon), Cancel-Flag
  gegen Unmount, `readDraft` fängt gesperrten Storage ab. `resetHistory()` aus #26 bleibt.

**Neu beim Zusammenführen:** `resetHistory()` verwirft einen ausstehenden Debounce-Snapshot — sonst
landete er als Duplikat auf der frischen Baseline (Undo sichtbar wirkungslos).

**Upstream → Buchart58:** History-Debounce, Insert-Kaskade, ehrliche Tooltips (aus #26).

**Unabhängiger Review des Abgleichs (Subagent), daraus gefixt (beide Kopien, außer Templates):**
- Der Debounce-Snapshot nahm die Szene beim Auslösen auf: Farbe ändern, dann sofort ziehen → Snapshot
  mitten im Drag. `mouse:down:before` schreibt den ausstehenden Snapshot jetzt vorher weg.
- Redo direkt nach einem Edit: der Flush verwarf den Redo-Zweig, der Redo-Button blieb aktiv. Flush
  synchronisiert die Flags; `saveHistory` setzt `canUndo`/`canRedo` sofort statt 300 ms später.
- Einfüge-Versatz über `left/top` ließ Linien bei der nächsten Breitenänderung zurückspringen
  (`_setWidthHeight` positioniert aus den Punkten, mit Fabric 7 nachgeprüft). Linien werden über ihre
  Punkte versetzt.
- Upstream: Minimal-Template ohne Name und Jahrgang ist leer, `applyTemplate([])` leerte die Leinwand.
  Das Panel bricht bei leerem Template ab.

**Bewusst nicht abgeglichen:** Templates (Buchart58 plant dort einen eigenen Konfigurator), die
9-px-Tab-Labels aus Buchart58 (für 4 Tabs gerechnet, hier sind es 5), `zoomToFit` (Buchart58-Formel
rechnerisch identisch, siehe „Fit to Screen" oben). Kein Browser-Lauf: B1 und B12 sind aus dem Code
abgeleitet.

### #26 — Demo-Vorbereitung: zwei Opus-Audits, zwei History-Blocker gefixt, Templates + dynamische Weindaten *(2026-09-29)*

Vor einer Kundenpräsentation zwei parallele Opus-Subagent-Audits (Bugs + Usability) gegen `components/cellar-canvas/` gefahren. Ergebnisse und Fixes:

**Gefixt (Bug-Audit):**
- **Undo nach Restore leerte die ganze Leinwand** — Bridge-Constructor pushte 100ms nach Mount einen leeren Initial-Snapshot; das Mount-Restore lief auf einem separaten, später feuernden Timer und pushte selbst nie einen Snapshot. `history[0]` war damit immer "leer", auch nach einem erfolgreichen Restore. Erste Cmd+Z nach einer Änderung sprang auf die leere Canvas zurück, nicht auf den restaurierten Zustand. **Fix:** Constructor-Snapshot entfernt, neue `FabricBridge.resetHistory()` seedet den Stack stattdessen einmalig NACH `useCanvasRestore`s Restore-Timer (`history.clear()` + ein frischer Snapshot des tatsächlich sichtbaren Zustands).
- **Farbregler-Drag spammte die History** — `ColorPickerPanel`s Hue-Slider feuert `onChange` pro Pointermove; `setBackground`/`updateActiveObject` riefen `saveHistory()` bei jedem Call auf. Ein Drag konnte alle 50 History-Slots mit Fast-Duplikaten füllen und (mit einem Bild auf der Canvas) die Tab wegen wiederholter Base64-Serialisierung spürbar einfrieren lassen. **Fix:** `saveHistory()` debounct jetzt 300ms; `undo()`/`redo()` flushen einen ausstehenden Snapshot zuerst, damit ein schnelles Cmd+Z direkt nach einer echten Aktion sie nicht verschluckt.
- Weitere Befunde (Fit-to-Screen-Messung, Snap-Guide-Sync-Thrash + Self-Snap, Multi-Selection-X/Y-Origin, Wine-Field-Sync nach Restore, toter Code bei Dimensionswechsel, `canvas.off()` ohne Handler-Ref) bewusst **nicht** gefixt — zu invasiv für den Demo-Zeitrahmen, siehe „Offen" oben für Details.

**Gefixt (Usability-Audit, Auswahl):**
- **Inserts stapelten sich auf einem Pixel** — `object-factory.ts` platziert jedes neue Objekt am selben festen `INSET_PX`; drei Klicks auf "Text einfügen" landeten exakt übereinander, wirkten wie ein Bug. **Fix:** `FabricBridge.place()` kaskadiert neue Inserts um `(Objektanzahl % 10) * 8`px.
- **Fullscreen-Toggle warf die letzte Aktion zurück** — `useCanvasRestore` hatte `isFullscreen` in den Deps; jeder Fullscreen-Wechsel führte das komplette Mount-Restore erneut aus (inkl. `initialState`/localStorage-Reload + `setDirty(false)`). **Fix:** Restore-Hook re-runnt nur noch bei Dimensionswechsel; ein separater Effekt in `CellarCanvas.tsx` macht bei Fullscreen-Wechsel ausschließlich `zoomToFit()`.
- **Toolbar-Tooltips versprachen nicht-existente Shortcuts** — `(V)`/`(T)`/`(I)`/`(R)`/`(C)`/`(L)` waren nie registriert (nur Delete/Backspace/`=`/`-`/`S`/Cmd+Z/Cmd+Shift+Z existieren). Zoom-Tooltip zeigte `(+)`, registriert ist aber das ungeshiftete `=`. **Fix:** Fake-Buchstaben aus `messages.ts` (de+en) entfernt, Zoom-Label auf `(=)` korrigiert.
- Weitere Befunde (fehlender Save-Button im Showcase — s. u. behoben, Export ohne Ladefeedback, Tour ohne Re-Entry, stille Fehlerpfade bei Bild/QR-Upload, tote Tooltips auf disabled Buttons) bewusst **nicht** alle gefixt — siehe „Offen" oben.

**Neu: Templates (3/5 Built-ins)** — `templates/templates.ts` (Classic/Modern/Minimal als reine Builder-Funktionen, liefern live Fabric-Objekte mit denselben `attach()`-Metadaten wie die Toolbar-Inserts, keine vorserialisierten JSON-Dateien) + neuer Panel-Tab „Vorlagen" (`TemplatesPanel.tsx`) + `FabricBridge.applyTemplate()` (leert die Canvas, fügt die Template-Elemente ein, ein einziger Undo-Schritt; `window.confirm`-Gate wenn die Canvas nicht leer ist). Wine-Field-Objekte in Templates tragen echte `_fieldKey`-Metadaten und hängen damit automatisch am bestehenden `initialWineFields`-Sync — ein Wein-Wechsel aktualisiert platzierte Template-Texte ohne zusätzlichen Code.

**Neu: Dynamische Weindaten im Showcase** — `components-showcase/scripts/fetch-wines.ts` fragt beim `dev`/`build`-Start (`bun run fetch-wines`, vorangestellt in `package.json`) `GET_PRODUCTS` gegen den Vendure Shop-API ab (dieselbe Query wie `vendure-showcase/storefront`s `getStaticPaths`, dort aber Astro-Build-Time; hier mangels Astro-Äquivalent als eigenständiges Script). Bei nicht erreichbarem Server (Timeout 3s — u. a. der Fall auf Netlify, das `localhost:3000` nie erreicht) schreibt das Script einen 4er-Fallback-Datensatz. Output landet in `src/data/wines.json` (gitignored, wird bei jedem Dev-/Build-Start neu geschrieben). `designer.tsx` zeigt ein Wein-Dropdown; die Auswahl geht direkt in `initialWineFields`.

**Nebenbei behoben:** Showcase mountete `<CellarCanvas />` bisher ohne jede Prop — leere Canvas + rotes „5 Felder fehlen"-Badge beim ersten Laden (Usability-Befund #1). Jetzt: `initialState` = Classic-Template mit dem ersten Wein vorbefüllt, `storageKey={null}` (kein localStorage-Draft-Restore mehr im Showcase — verhindert auch, dass alte Dev-Testkritzeleien wieder auftauchen), `onSave`-Stub (zeigt den Save-Button überhaupt erst an).

### #25 — Dead-UI-Sweep: tote Props, Validator-Deadlock, tote Hotkeys *(2026-07-04 — gefixt)*

Audit auf „UI vorhanden, Funktion fehlt" — sieben Befunde, alle behoben (ein Commit pro Fix):

- **Tote Props:** `exportDpi`, `enablePdfExport`, `onValidationChange` standen in `CellarCanvasProps` + COMPONENT.md, wurden aber nie destrukturiert. Jetzt verdrahtet; `onValidationChange` liefert `ValidationWarning[]` (statt `string[]` wie ursprünglich in der Spec) — inkl. Label, Severity und EU-Rechtsgrundlage, direkt in der Storefront anzeigbar. Feuert Signatur-geguardet (Keys-Join), weil Full-Syncs identische Arrays mit neuer Identität erzeugen.
- **Validator-Deadlock:** Der Validator verlangt `allergenNote` + `countryOfOrigin`, das Panel bot beide nicht an — zwei Error-Warnungen waren per UI unlösbar. Felder ergänzt (8 statt 6), Demo-Daten inkl. `enthält Sulfite` / `Österreich`.
- **Toter Delete-Hotkey:** `useDesignEngineHotkey('delete, backspace', …)` feuerte nie — `@tanstack/hotkeys` kennt keine Komma-Listen, der String parst zu einem unmatchbaren Key. Jetzt zwei Registrierungen.
- **Pan-Tool** implementiert (siehe Offen-Liste), **Zoom** per Buttons + `+`/`-`-Hotkeys (A11y: Zoom war bisher nicht tastaturbedienbar). `useDesignEngineHotkey` akzeptiert dafür die RawHotkey-Objektform.
- **Image-Replace** war beim Refactor 2026-05-26→06-08 aus der ContextToolbar verloren gegangen (STATUS behauptete ihn weiter) — wiederhergestellt via verstecktem File-Input → `bridge.updateImageSource`.
- **Tour-Step 5** zielte auf `[data-tour="save-button"]`, der ohne `onSave`-Prop nicht existiert (Zag: `not-found`, Tour bricht ab — genau im Showcase-Default). Step ist jetzt konditional (`includeSaveStep={!!onSave}`).
- **QR ohne URL:** Fallback auf `https://example.com` entfernt — Button disabled mit Hinweis, statt einen toten Link druckfertig zu machen.
- **Stamp-Semantik:** Insert-Buttons (Text/Image/Shapes) markierten sich als aktiver Modus, obwohl kein Zeichen-Modus existiert — sie fallen jetzt auf `select` zurück.

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
- **Trim-only, kein Bleed, keine Crop-Marks.** *(Nachtrag 2026-10-14: bleibt Default; Beschnitt + Marken per `pdfBleedMm` zuschaltbar.)* Die Druckerei legt Bleed selbst an wenn nötig — die Variante hält das PDF schlank und das Mental-Model des Users ('was ich sehe, ist was gedruckt wird') intakt.
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

*Last updated: 2026-11-11*
