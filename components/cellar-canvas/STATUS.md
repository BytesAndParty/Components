# Cellar Canvas — Status & Bug Log

> Lebendes Dokument zum aktuellen Stand des Minimal-Editors für Weinetiketten.
> Bugs, Entscheidungen, Workarounds werden hier kurz festgehalten.
> High-Level-Vision und Roadmap liegen in `/CELLAR-CANVAS.md` im Repo-Root.

---

## Aktueller Stand

| Bereich              | Stand                                                                 |
|----------------------|------------------------------------------------------------------------|
| Canvas               | Fabric v7 via `use-fabric-canvas.ts`, mm/px Umrechnung steht.          |
| Tools                | Rect / Circle / Line / Text / Image / QR-Code addbar.                  |
| History              | ✅ Undo/Redo (50 Steps) via Zustand + Fabric JSON Serialization.        |
| Shortcuts            | ✅ TanStack Hotkeys (mod+z, mod+shift+z, del, backspace) inkl. Registry. |
| Zoom                 | ✅ Zoom-to-Fit nutzt echte mm-Maße (widthMm x heightMm).                |
| Properties Panel     | x / y / w / h / rotation / opacity in mm bzw. % über `NumberInput`.    |
| Context Toolbar      | Text-Optionen + Bring-to-Front / Send-to-Back, Alignment-Stub.         |
| Wine Fields          | 6 Felder + QR-Code, `_fieldKey` Metadata.                              |
| Validator            | EU-Reg. 2023/2977 — alcohol, volume, allergen, QR.                     |
| Layer Panel          | Listet alle Objekte, Rename / Visibility / Lock / Delete / Reorder.    |
| Persistence          | ❌ noch nicht — kein localStorage, kein onSave.                         |
| Export               | ❌ noch nicht — kein PNG / PDF.                                         |
| Multi-Area           | ❌ noch nicht — eine Canvas (Front).                                    |

---

## Bug Log

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
