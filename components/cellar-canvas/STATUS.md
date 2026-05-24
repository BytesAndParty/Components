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
