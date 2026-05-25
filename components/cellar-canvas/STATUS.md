# Cellar Canvas — Status & Bug Log

> Lebendes Dokument zum aktuellen Stand des Minimal-Editors für Weinetiketten.
> Bugs, Entscheidungen, Workarounds werden hier kurz festgehalten.
> High-Level-Vision und Roadmap liegen in `/CELLAR-CANVAS.md` im Repo-Root.

---

## Aktueller Stand

| Bereich              | Stand                                                                 |
|----------------------|------------------------------------------------------------------------|
| Canvas               | Fabric v7 via `use-fabric-canvas.ts`, mm/px Umrechnung steht. Bleed-Margin (40 mm rechts/unten) damit überlaufende Elemente sichtbar bleiben; Label selbst ist ein nicht-interaktives Rect bei (0,0). |
| Tools                | Rect / Circle / Line / Text / Image / QR-Code addbar.                  |
| History              | ✅ Undo/Redo (50 Steps) via Zustand + Fabric JSON Serialization.        |
| Shortcuts            | ✅ TanStack Hotkeys (mod+z, mod+shift+z, del, backspace) inkl. Registry. |
| Zoom                 | ✅ Zoom-to-Fit nutzt echte mm-Maße (widthMm x heightMm).                |
| Properties Panel     | x / y / rotation / opacity verdrahtet; w / h pro Objekttyp (Rect via scale, Circle via radius, Line via x2). |
| Context Toolbar      | Text (Font/Size/Bold/Italic/Underline/Align/Color/Letter-Spacing/Line-Height) + StackOrderControls + AlignmentBar (live) + Shape Fill / Stroke ColorSwatch + Stroke-Width. |
| Background           | ✅ ColorSwatch im rechten Panel-Tab (`Background`), `bridge.setBackground` mit History-Snapshot. |
| Wine Fields          | 6 Felder + QR-Code, `_fieldKey` Metadata.                              |
| Validator            | EU-Reg. 2023/2977 — alcohol, volume, allergen, QR.                     |
| Layer Panel          | Listet alle Objekte, Rename / Visibility / Lock / Delete / Reorder.    |
| Clipboard Paste      | ✅ `Cmd/Ctrl+V` mit Bilddaten landet direkt auf der Canvas (kein Cropper). |
| Persistence          | ❌ noch nicht — kein localStorage, kein onSave.                         |
| Export               | ❌ noch nicht — kein PNG / PDF.                                         |
| Multi-Area           | ❌ noch nicht — eine Canvas (Front).                                    |

---

## Bug Log

### Open: ImageCropper schneidet den falschen Bereich aus

**Symptom:** Der ausgewählte Crop-Bereich im `ImageCropperModal` deckt sich nicht mit dem, was nach `addImage` auf der Canvas landet. Verschoben / falsch skaliert.

**Verdacht:** Zags `drawCroppedImageToCanvas` rechnet in Viewport-Pixeln, geht von 1 viewport-px = 1 natural-px bei zoom=1 aus (siehe Note in COMPONENT.md). Die `FitZoomOnLoad`-Helper-Logik im Modal könnte falsch initialisieren, oder `object-fit` auf dem Bild im Cropper-Viewport ist nicht 1:1.

**Nächster Schritt:** `image-cropper-modal/image-cropper-modal.tsx` plus `getCroppedImage`/`onCrop`-Pipeline in `MainToolbar.tsx` durchspielen, mit einem Test-Bild + bekannter Crop-Region und dem resultierenden Blob die Maße vergleichen.

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

*Last updated: 2026-05-24*
