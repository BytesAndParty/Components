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
| History              | ✅ Undo/Redo (50 Steps) via Zustand + Fabric JSON Serialization. Bg-Color liegt außerhalb der History (Trade-off — Undo revertet sie nicht). |
| Shortcuts            | ✅ TanStack Hotkeys (mod+z, mod+shift+z, del, backspace) inkl. Registry. |
| Zoom                 | ✅ Zoom-to-Fit fittet den vollen Canvas-Pixelbereich (Label + Bleed). Wheel/Pinch auf der Canvas zoomt cursor-zentriert via `canvas.zoomToPoint` mit `preventDefault` gegen Browser-Page-Zoom. |
| Fullscreen           | ✅ CSS-Fullscreen (`fixed inset-0 z-50`) statt der Browser-Fullscreen-API — Escape exitet. Vorher schluckte die API-Variante Keyboard-Input in Fabric's `hiddenTextarea` (Focus-Restriktion auf Subtree). |
| Properties Panel     | x / y / rotation / opacity verdrahtet; w / h pro Objekttyp (Rect via scale, Circle via radius, Line via x2, Textbox direkt). |
| Context Toolbar      | Text (Font/Size/Bold/Italic/Underline/Align/Color/Letter-Spacing/Line-Height) + StackOrderControls + AlignmentBar (live) + Shape Fill / Stroke ColorSwatch + Stroke-Width. |
| Background           | ✅ ColorSwatch im rechten Panel-Tab (`Background`), `bridge.setBackground` setzt `labelColor` Instance-Prop + `isDirty`. Wird per `serializeState` mitpersistiert (`{ canvas, bg }`). |
| Wine Fields          | 6 Felder + QR-Code, `_fieldKey` Metadata.                              |
| Validator            | EU-Reg. 2023/2977 — alcohol, volume, allergen, QR.                     |
| Layer Panel          | Listet alle User-Objekte (Backdrop ist DOM, nicht im Stack). Rename / Visibility / Lock / Delete / Reorder. Programmatic Reorder (Bring-to-Front etc.) wird via `framer-motion layout="position"` sanft animiert, dnd-kit owns die Animation während aktiver Drags. |
| Clipboard Paste      | ✅ `Cmd/Ctrl+V` mit Bilddaten landet direkt auf der Canvas (kein Cropper). |
| Persistence          | ✅ Debounced (1 s) localStorage-Autosave + `onSave`-Callback (async, Idle/Saving/Success/Error-Button). Restore aus `initialState` → localStorage → leerer Canvas. Serialisierter State = `{ canvas, bg }`. `storageKey`-Prop overridable, `null` deaktiviert. |
| Image Crop           | ✅ Pre-measured `naturalSize` + `viewportSize` vor Mount, korrekter `defaultZoom` + `initialCrop`. Apply rendert eigene High-Res-Canvas in **Source-Pixel-Auflösung** (`crop.width / zoom`, capped bei 4096 px) statt Zags Viewport-Pixel-Output — keine Quality-Loss beim Übergang Cropper → Canvas. |
| Bleed Mask + Preview | ✅ Vier semi-transparente CSS-Stripes (`pointer-events:none`, `z-40`) überlagern den Bleed-Bereich. Design-View ~55 % opak (überlaufende Objekte bleiben lesbar), Preview-Toggle (Eye-Icon Header) schaltet auf 100 % → Bleed verschwindet, nur das druckbare Etikett ist sichtbar. |
| Export               | ❌ noch nicht — kein PNG / PDF.                                         |
| Multi-Area           | ❌ noch nicht — eine Canvas (Front).                                    |

---

## Offen

### Roadmap-Items (CELLAR-CANVAS.md)

- **Export-Pipeline (PNG + PDF)** — Fabric `toDataURL` bei 300 dpi clipped auf den Label-Bereich (Bleed muss raus); `jspdf` mit 3 mm Crop-Marks (PDF). Braucht `jspdf`-Install und einen `ExportPanel`-Dialog. Wichtigster nächster Schritt — ohne Export ist das Label nicht druckbar.
- **Multi-Area Tabs (Front / Back / Neck)** — Store von einer Canvas auf `Map<area, state>`, `LabelAreaTabs`-Komponente, History pro Area. Macht erst Sinn nach Export.
- **Templates** — 5 Built-in (Classic / Modern / Rustic / Minimal / Bold) als Fabric-JSON + `TemplatesPanel`. `customTemplates`-Prop für app-spezifische.
- **Onboarding Tour** — Ark UI `Tour`, 5 Schritte, `localStorage`-Flag für First-Run-Detect.
- **i18n** — `i18n/en.ts` + `i18n/de.ts`, Props-`i18n`-Override.
- **Extras-Panel** — `SignaturePad` + Decorative Dividers / Ornaments (Phase 8, niedrige Prio).

### Spec-Items aus Feature-Inventory (CELLAR-CANVAS.md)

- **3 mm Print-Bleed-Indicator** — gestricheltes Rect am Label-Rand (separat vom 40 mm Workspace-Bleed). Visueller Druck-Sicherheitsabstand laut Decision #3.
- **Ruler-Overlay** (mm-Skala an Canvas-Rändern, toggleable).
- **Snap-to-Grid + Smart Guides** (zeigen sich beim Drag in Nähe anderer Objekte).
- **Pan-Tool** — aktuell nur Tool-Switch ohne Funktion. Plan: Space+Drag, oder eigenes Pan-Mode.
- **Background Image** — neben Color auch Image (im `BackgroundPanel`).
- **Group / Ungroup** für Layer.
- **Re-Crop von ContextToolbar** — Image selektieren → "Crop"-Button → re-open `ImageCropperModal` mit aktueller Source.
- **Duplicate** (Layer / Selection).
- **Strg+A**, **Esc** und andere Standard-Shortcuts.

### Tech-Debt / Known Limitations

- Bg-Color nicht in Undo/Redo-History — User-Change überlebt Reload, aber kein Undo. Lösungswege: Sidecar in `pushHistory` (Tupel `[canvas, bg]`) ODER `setBackground` schiebt einen synthetischen `object:modified`-Snapshot.
- `cellar:property-changed` feuert teils mehrfach pro logischer Aktion (Stack-Op = `notifyStackChanged` + `update` via `object:added/removed` Trigger). React batched in der Regel, aber nicht garantiert wenn aus Fabric-Events. Mittelfristig konsolidieren.
- `ContextToolbar` mountet noch den Mirror-Textarea-Wegfall ohne Re-Crop-Button — Image-Selection zeigt aktuell nichts an im Context-Bereich.

---

## Bug Log

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

*Last updated: 2026-05-25*
