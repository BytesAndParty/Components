# Cellar Canvas — Status & Bug Log

> Lebendes Dokument zum aktuellen Stand des Minimal-Editors für Weinetiketten.
> Bugs, Entscheidungen, Workarounds werden hier kurz festgehalten.
> High-Level-Vision und Roadmap liegen in `/CELLAR-CANVAS.md` im Repo-Root.

---

## Aktueller Stand

| Bereich              | Stand                                                                 |
|----------------------|------------------------------------------------------------------------|
| Canvas               | Fabric v6 montiert via `use-fabric-canvas.ts`, mm/px Umrechnung steht. |
| Tools                | Rect / Circle / Line / Text / Image / QR-Code addbar.                  |
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

### #1 — Layer z-order Reorder + Bring/Send funktioniert nicht  *(2026-05-22 — gefixt)*

**Symptom:** Drag-Reorder im Layer-Panel ändert die Anzeigereihenfolge in der Liste, aber das tatsächliche Stacking auf der Canvas bleibt unverändert. Gleiches gilt für "Bring to Front" / "Send to Back" in der Context-Toolbar.

**Root Cause:** `fabric-bridge.ts` rief Fabric-v5-APIs auf den Objekten auf:
- `obj.bringToFront()`
- `obj.sendToBack()`
- `obj.moveTo(index)`

In Fabric v6 wurden diese Methoden auf die Canvas verschoben und umbenannt:
- `canvas.bringObjectToFront(obj)`
- `canvas.sendObjectToBack(obj)`
- `canvas.moveObjectTo(obj, index)`

Die alten Aufrufe schlugen daher still fehl (kein Throw, da JS-Property-Access auf `undefined` keine ReferenceError wirft beim Call — wenn überhaupt eine Stub existiert).

**Fix:** Bridge-Methoden auf v6-API umgestellt. Layer-Panel-Reihenfolge spiegelt jetzt wieder das Canvas-Stacking, und der Drag/Toolbar-Reorder schreibt es zurück.

**Layer-Konvention (bestätigt):** Oben in der Liste = vorne auf der Canvas (Photoshop/Figma-Konvention). `getLayers()` reversiert `canvas.getObjects()` (das von Fabric bottom-to-top kommt) genau dafür.

### #2 — ImageCropper crasht: "Invalid handlePosition: top-left"  *(2026-05-22 — gefixt)*

**Symptom:** Beim Öffnen des Image-Croppers Error-Boundary mit „Invalid handlePosition: top-left".

**Root Cause:** Ark UI / Zag (`@zag-js/image-cropper` 1.40.0) hat die `HandlePosition`-API von Edge-Strings (`top-left`, `top-right`, …) auf Compass-Kürzel umgestellt:
`"n" | "e" | "s" | "w" | "ne" | "se" | "sw" | "nw"`.

**Fix:** In `components/image-cropper-modal/image-cropper-modal.tsx` die vier `position`-Props angepasst (`top-left` → `nw` usw.).

### #3 — Image-Tool kickt aus Fullscreen + öffnet Picker zu früh  *(2026-05-22 — gefixt)*

**Symptom:** Klick auf das Image-Tool öffnet sofort den nativen File-Picker, was die Browser-Fullscreen-API verlässt (Browser-Sicherheitsverhalten — Native-File-Dialoge cancellen Fullscreen). Wirkt wie ein „Cellar Canvas minimiert sich".

**Fix:** Image-Tool ist jetzt eine 2-stufige Interaktion:
1. Erster Klick aktiviert das Tool (visuelles Aktiv-State).
2. Zweiter Klick (Tool bereits aktiv) öffnet den File-Picker.

Tooltip wechselt im aktiven Zustand auf „Click again to upload". Der Picker öffnet sich nur noch bewusst — Fullscreen bleibt erhalten, bis der User tatsächlich uploaden will.

### #6 — Layer-Reorder snappt nach dem Drop in alte Position zurück  *(2026-05-23 — gefixt)*

**Symptom:** Animation läuft sauber durch, aber sobald die Maus losgelassen wird, springt die Reihenfolge im LayerPanel zurück auf den Ausgangszustand. Canvas-Stacking ändert sich währenddessen tatsächlich (sichtbar an z-order), nur die Panel-Liste verharrt.

**Root Cause:** `canvas.moveObjectTo(obj, idx)` feuert in Fabric v7 **kein** Event, das wir im `update`-Effect abhören (`object:modified`, `object:added/removed` etc. greifen alle nicht für reine Stack-Umstellungen). Damit blieb der lokale `layers`-State in `CellarCanvas` veraltet — das `LayerPanel` bekam beim nächsten Render das alte Array übergeben und renderte die Vor-Drop-Reihenfolge.

Gleiches latentes Problem bei `setLayerVisibility` / `setLayerLocked` / `renameLayer`: `obj.set()` und reine Metadata-Mutationen lösen ebenfalls kein `object:modified` aus.

**Fix:** In `CellarCanvas` direkt nach jedem state-mutierenden Bridge-Call den `layers`-State via `setLayers(bridge.current?.getLayers() || [])` neu aus Fabric ziehen. `deleteLayer` bleibt unangetastet, weil dort `canvas.remove(obj)` `object:removed` feuert und der Effekt das bereits synchronisiert.

### #5 — ImageCropper liefert leeres weißes Bild  *(2026-05-23 — gefixt)*

**Symptom:** Nach dem Upload öffnet sich der Cropper, sieht aber leer aus. Auch das Ergebnis nach „Apply" landet auf der Canvas als weißes Bild.

**Root Cause 1:** Wir hatten `image={imageSrc}` auf `<ImageCropper.Root />` gesetzt — `@zag-js/image-cropper` 1.40 hat aber **kein** `image`-Prop. Die Quelle muss direkt am Image-Part als HTML-`src` hängen. Root ignorierte den Prop still, `<ImageCropper.Image />` rendert ein leeres `<img>` ohne `src`.

**Root Cause 2:** `api.getCroppedImage({ format: 'blob' })` — die Option heißt `output`, nicht `format`. Hat (zufällig) funktioniert, weil `output` per Default `'blob'` ist. Der Vollständigkeit halber jetzt korrekt benannt + Typ-Guard via `instanceof Blob`.

**Fix:**
- `src={imageSrc}` auf `<ImageCropper.Image />` durchgereicht; `image=`-Prop von `Root` entfernt.
- `crossOrigin="anonymous"` als defensives Tainting-Hedge, falls zukünftig externe URLs gecroppt werden.
- `getCroppedImage({ output: 'blob' })` + `instanceof Blob` Check.

### #4 — Layer-Panel Drag-Animation snappt / ruckelt  *(2026-05-22 — gefixt)*

**Symptom:** Drag-Reorder bewegt die Zeile, aber beim Drop „snappt" sie kurz zurück oder die Nachbarn rutschen ohne Animation. Layout wirkt zerrissen.

**Root Cause:** In `components/layer-panel/layer-panel.tsx` konkurrieren zwei Animationssysteme:
- `dnd-kit` setzt während Drag/Drop eigene `transform` + `transition` per `useSortable()`.
- Framer Motion `motion.div` hatte zusätzlich `layout` aktiv und versuchte den Positionswechsel selbst zu animieren.

Beide schreiben in dieselben CSS-Properties → Layout-Engine fightet, Drop-Übergang wirkt kaputt.

**Fix:** `layout`-Prop am `motion.div` entfernt. `dnd-kit` regelt die Reorder-Animation; Framer Motion macht nur noch enter/exit (Fade + Height-Collapse).

---

## Entscheidungs-Log

### 2026-05-22 — Validator Toggle per Prop

- Neue Prop `enableValidator?: boolean` (default `true`).
- `false` → keine Compliance-Checks, kein ValidatorBadge.
- Use case: Showcase, Non-EU Märkte, Test-Modus.

### 2026-05-22 — Validator zeigt Felder + Rechtsgrundlage

- Jeder fehlende Pflicht-Eintrag listet jetzt explizit *welches* Feld fehlt **und warum** (EU-Verordnung, Begründung).
- Beschreibungen kommen aus `wine-fields/validator.ts` und werden 1:1 im ValidatorBadge-Popover gerendert (`label` + `description`).

### 2026-05-22 — Image-Tool 2-Step (Activate → Upload)

- Native File-Dialoge brechen Browser-Fullscreen — daher kein Auto-Open mehr.
- Klick 1: Tool aktiv. Klick 2: Picker. Drag-&-Drop und Clipboard-Paste bleiben weiterhin als alternative Eingabewege auf der Roadmap.

### 2026-05-23 — Fabric v6.9.1 → v7.4.0

- Major-Bump nach `ARTELIER.md` §6 (Newest-First): Docs-Cache in
  `__AI-Workflow__/Skills/UpToDateDocs/fabric.md` angelegt, dann `bun add fabric@^7`.
- v7-Sicherheitsfixes mitgenommen (CVE-2026-27013 SVG-XSS in 7.2.0,
  CVE-2026-44311 in 7.4.0).
- Bridge-Anpassungen:
  - `originX/originY: 'left'/'top'` explizit auf jedem Rect / Circle / Line /
    IText / FabricImage gesetzt — v7-Default ist neuerdings `center/center`.
    Unsere mm/px-Mapping-Logik geht aber von der Bounding-Box-Ecke aus, daher
    v6-Semantik gepinnt (sauberer Schnitt später, wenn die Mapping-Logik selbst
    auf Center-Origin umgebaut wird).
  - `fabric.Image.fromURL(dataUrl, callback)` in `addQRCode` auf
    `await fabric.FabricImage.fromURL(dataUrl)` umgestellt (Callback-Signatur
    seit v6 entfernt — war ein latenter Bug).
  - `fabric.IObjectOptions` → `fabric.FabricObjectProps` (Typ wurde umbenannt).
  - `canvas.setActiveObject(obj).renderAll()` zerlegt — `setActiveObject`
    liefert in v7 `boolean` statt der Canvas zurück.

---

*Last updated: 2026-05-23*
