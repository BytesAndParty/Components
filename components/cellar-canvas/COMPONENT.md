# CellarCanvas

In-browser wine-label designer. A self-contained editor that drops into any storefront and lets customers compose a print-ready label — text, shapes, uploaded images, wine-data overlays, QR code — with live EU-compliance feedback.

Sub-modules and panels live alongside it (`LayerPanel`, `ValidatorBadge`, `ImageCropperModal`, `WineFieldsPanel`, `MainToolbar`, `ContextToolbar`). The high-level vision is tracked in `/CELLAR-CANVAS.md`; the running bug/decision log lives in `STATUS.md` next to this file.

## Features

- **Fabric v7 canvas** mounted in mm units, with px conversion via `engine/units.ts`. Origin pinned to `left/top` so the mm/px bounding-box math holds.
- **Tools**: select / pan / text / image (with crop) / rect / circle / line / QR-code.
- **Right panel**: properties for the active object (x/y/w/h/rotation/opacity in mm/°/%) + wine-data field inserter.
- **Layer panel** mirrors the canvas z-order (top of list = front of canvas). Drag-to-reorder, visibility, lock, rename, delete.
- **EU compliance validator** (Reg. 1308/2013, 2019/33, 1169/2011, 2023/2977): floating badge surfaces missing mandatory fields with the legal basis spelled out per warning. Toggleable via `enableValidator`.
- **Image crop pipeline**: file picker → `ImageCropperModal` (Ark UI / Zag) → cropped Blob → `addImage` on canvas. Initial zoom auto-fits the source.
- **Fullscreen mode** with `requestFullscreen` + `fullscreenchange` listener, re-fits the canvas on transition.

## How It Works

1. **Imperative bridge over Fabric**. `engine/fabric-bridge.ts` is the only place that touches the Fabric API. All add / update / z-order / layer-meta calls flow through it. v7 specifics (Canvas-side `bringObjectToFront` / `moveObjectTo`, `FabricObjectProps`, `await FabricImage.fromURL`) are encapsulated there.
2. **Zustand store for UI metadata**, Fabric as source of truth for geometry. `store/designer-store.ts` holds `activeTool`, `selectedIds`, `zoom`, `dirty`. The bridge mirrors Fabric selection into the store.
3. **State sync via events**: Fabric `object:added/removed/modified/moving/scaling/rotating` + `selection:*` events re-pull `getActiveObjectProperties()` + `getLayers()` + `validateCompliance()` into local React state.
4. **Explicit sync for stack mutations**: `moveObjectTo` and `obj.set('visible'/'lockMovementX')` do **not** fire events Fabric exposes, so `onReorder` / `onVisibilityToggle` / `onLockToggle` / `onRename` call `setLayers(bridge.getLayers())` directly to keep the panel from snapping back to a stale array.
5. **Validator** scans `_fieldKey` metadata on canvas objects against a mandatory-key list and emits `{ key, label, description, severity }` items. The popover renders each one verbatim — `description` carries the EU regulation citation.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `widthMm` / `heightMm` | `number` | `90` / `120` | Label size in millimetres |
| `initialWineFields` | `WineFieldValues` | demo data | Pre-fill for the wine-data inserter (name, vintage, alcoholPercent, volumeMl, region, grapes, producer, countryOfOrigin, sugarContent, energyKcal, allergenNote, nutritionalInfoUrl) |
| `initialState` | `object` | — | Fabric JSON to restore the canvas from |
| `enableValidator` | `boolean` | `true` | Toggle EU compliance check + floating badge. `false` for showcases, non-EU markets, tests |
| `exportDpi` | `number` | `300` | DPI for PNG/PDF export |
| `enablePdfExport` | `boolean` | `true` | Allow PDF format in export |
| `onChange` | `(state: object) => void` | — | Fired on every canvas mutation |
| `onSave` | `(state: object) => Promise<void>` | — | Manual save trigger; button shows loading/success |
| `onExport` | `(r: { format, blob }) => void` | — | Server-side upload hook for the export pipeline |
| `onValidationChange` | `(warnings: string[]) => void` | — | Fired whenever the compliance result changes |
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
