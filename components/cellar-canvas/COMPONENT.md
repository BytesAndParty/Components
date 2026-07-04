# CellarCanvas

In-browser wine-label designer. A self-contained editor that drops into any storefront and lets customers compose a print-ready label — text, shapes, uploaded images, wine-data overlays, QR code — with live EU-compliance feedback.

Sub-modules and panels live alongside it as standalone components that can be reused outside the canvas: `LayerPanel`, `ValidatorBadge`, `ImageCropperModal`, `StackOrderControls`, `AlignmentBar`, `ColorSwatch`, `TextToolOptions`. Internal-only pieces (`WineFieldsPanel`, `MainToolbar`, `ContextToolbar`) stay in `components/cellar-canvas/components/`. The high-level vision is tracked in `/CELLAR-CANVAS.md`; the running bug/decision log lives in `STATUS.md` next to this file.

## Features

- **Fabric v7 canvas** mounted in mm units, with px conversion via `engine/units.ts`. Origin pinned to `left/top` so the mm/px bounding-box math holds.
- **Tools**: select / pan (viewport drag) / text / image (with crop + replace) / rect / circle / line / QR-code. Text/image/shape buttons are stamp actions (insert once, back to select); only select and pan are persistent modes.
- **Undo/Redo System**: Linear history stack (max. 50 steps) using Fabric JSON serialization. Visual controls in the header + keyboard shortcuts.
- **TanStack Hotkeys**: Global shortcut support (`mod+z`, `mod+shift+z`, `Delete`, `Backspace`, `+`/`-` zoom, `s` snapping) integrated with the design engine's hotkey registry. Delete and Backspace are registered individually — the library matches one key per registration, comma lists never fire. Single-key hotkeys are input-guarded by the library itself.
- **Zoom**: cursor-anchored wheel/pinch zoom, `+`/`-` buttons and hotkeys (centre-anchored, same clamp range), one-click `Fit to Screen` based on the physical millimetre dimensions of the label.
- **Right panel**: properties for the active object (x/y/w/h/rotation/opacity in mm/°/%) + wine-data field inserter.
- **Layer panel** mirrors the canvas z-order (top of list = front of canvas). Drag-to-reorder, visibility, lock, rename, delete.
- **EU compliance validator** (Reg. 1308/2013, 2019/33, 1169/2011, 2023/2977): floating badge surfaces missing mandatory fields with the legal basis spelled out per warning. Toggleable via `enableValidator`.
- **Image crop pipeline**: file picker → `ImageCropperModal` (Ark UI / Zag) → cropped Blob → `addImage` on canvas. Initial zoom auto-fits the source. Selected images offer crop (re-opens the cropper) and replace (straight file swap, keeps id/position/layer meta) in the context toolbar.
- **Export**: PNG and PDF at `exportDpi` (default 300), rendered in exact trim size. PDF is gated behind `enablePdfExport`; both downloads also fire `onExport` for server-side upload.
- **Fullscreen mode** via CSS (`fixed inset-0`) — the browser Fullscreen API restricts focus and breaks Fabric's hidden textarea (see STATUS.md #23). Escape exits.

## How It Works

1. **Imperative bridge over Fabric**. `engine/fabric-bridge.ts` is the only place that touches the Fabric API. All add / update / z-order / layer-meta calls flow through it. v7 specifics (Canvas-side `bringObjectToFront` / `moveObjectTo`, `FabricObjectProps`, `await FabricImage.fromURL`) are encapsulated there.
2. **Zustand store for UI metadata**, Fabric as source of truth for geometry. `store/designer-store.ts` holds `activeTool`, `selectedIds`, `zoom`, `dirty`, and the linear `history` stack. The bridge mirrors Fabric selection into the store.
3. **History management via serialization**: The bridge captures `canvas.toJSON()` snapshots on every mutation (`saveHistory()`). Undo/Redo operations temporarily disable history-tracking via `isRestoringHistory` to prevent recursion.
4. **State sync via events**: Fabric `object:added/removed/modified/moving/scaling/rotating` + `selection:*` events re-pull `getActiveObjectProperties()` + `getLayers()` + `validateCompliance()` into local React state. `object:modified` additionally triggers a history snapshot.
5. **TanStack Hotkeys**: Shortcuts are registered via `useDesignEngineHotkey`, making them discoverable in the global `ShortcutOverview`. The `mod+z` (Undo) and `mod+shift+z` (Redo) mappings handle cross-platform command/control keys automatically.
6. **Explicit sync for stack mutations**: `moveObjectTo` and `obj.set('visible'/'lockMovementX')` do **not** fire events Fabric exposes, so `onReorder` / `onVisibilityToggle` / `onLockToggle` / `onRename` call `setLayers(bridge.getLayers())` directly to keep the panel from snapping back to a stale array.
7. **Validator** scans `_fieldKey` metadata on canvas objects against a mandatory-key list and emits `{ key, label, description, severity }` items. The popover renders each one verbatim — `description` carries the EU regulation citation.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `widthMm` / `heightMm` | `number` | `90` / `120` | Label size in millimetres |
| `initialWineFields` | `WineFieldValues` | demo data | Pre-fill for the wine-data inserter (name, vintage, alcoholPercent, volumeMl, region, grapes, producer, countryOfOrigin, sugarContent, energyKcal, allergenNote, nutritionalInfoUrl) |
| `initialState` | `object` | — | Fabric JSON to restore the canvas from |
| `enableValidator` | `boolean` | `true` | Toggle EU compliance check + floating badge. `false` for showcases, non-EU markets, tests |
| `exportDpi` | `number` | `300` | Raster resolution for PNG/PDF export |
| `enablePdfExport` | `boolean` | `true` | Show the PDF export button (PNG is always available) |
| `onChange` | `(state: object) => void` | — | Fired on every canvas mutation |
| `onSave` | `(state: object) => Promise<void>` | — | Manual save trigger; button shows loading/success. Also gates the tour's save step |
| `onExport` | `(r: { format: 'png' \| 'pdf', blob }) => void` | — | Server-side upload hook for the export pipeline |
| `onValidationChange` | `(warnings: ValidationWarning[]) => void` | — | Fired whenever the set of missing mandatory fields changes; each warning carries `key`, `label`, `description` (legal basis) and `severity` |
| `height` | `string \| number` | `'80vh'` | Editor outer height |
| `className` / `style` | — | — | Forwarded to the wrapper |

## Usage

### Minimal (showcase / non-EU)

```tsx
import { CellarCanvas } from '@components/cellar-canvas'

<CellarCanvas enableValidator={false} />
```

### Vendure storefront

```tsx
<CellarCanvas
  widthMm={90}
  heightMm={120}
  initialWineFields={{
    name:               product.name,
    vintage:            product.customFields.vintage,
    alcoholPercent:     product.customFields.alcoholPercent,
    volumeMl:           product.customFields.volumeMl,
    countryOfOrigin:    product.customFields.country,
    allergenNote:       'enthält Sulfite',
    nutritionalInfoUrl: `https://shop.example/p/${product.slug}/nutrition`,
  }}
  onSave={async (state) => {
    await vendureClient.mutation(UPDATE_LABEL, { id, state })
  }}
  onExport={({ format, blob }) => uploadToPrinter(blob, format)}
/>
```

## Dependencies

- `fabric@^7` — canvas engine (Canvas-API z-order, `FabricImage.fromURL`, `FabricObjectProps`)
- `zustand@^5` — designer store (`subscribeWithSelector` selectors)
- `@ark-ui/react@^5` — `ImageCropper`, `Dialog`, `Portal`, color picker
- `@dnd-kit/core` + `@dnd-kit/sortable` — layer-panel drag reorder
- `motion` — enter/exit fades on layer rows
- `lucide-react` — toolbar icons

## Notes

- Fabric v7 changed the origin default to `center/center`. The bridge pins `originX/originY: 'left'/'top'` on every new object so the existing mm/px-as-bounding-box-corner mapping stays correct. Switching the mapping to center-origin is a separate refactor (tracked in `STATUS.md`).
- `addQRCode` uses `await fabric.FabricImage.fromURL(dataUrl)` — the v5 callback signature was removed in v6.
- The image-cropper child must render at natural CSS size centred in the viewport (`flex items-center justify-center` on Viewport, `flexShrink: 0` on Image) — Zag's `drawCroppedImageToCanvas` assumes 1 viewport-pixel = 1 natural-pixel at zoom=1. Any `object-fit` scaling breaks the crop math. A small `FitZoomOnLoad` helper applies `setZoom(min(vp/nat))` once on first image load.
- Layer rows must keep their `z-elevation` while `transform !== null`, not just while `isDragging` — `useSortable` flips `isDragging` back on pointer-release but the drop-decay transition still runs for ~200 ms.
