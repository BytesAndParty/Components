# Cellar Canvas — Wine Label Designer

> A headless-first, React 19 label design editor for winemakers.
> Customers design their own bottle labels directly in the browser — print-ready export included.

---

## Name

**Cellar Canvas** — `<CellarCanvas />`

*Artisanal + digital, alliterative, memorable. Cellar = wine heritage. Canvas = design freedom.*

Other considered names: Cuvée, Label Atelier, Pressmark, Vintner Studio.

---

## Vision

A self-contained React component that drops into any storefront (Vendure, Shopify, custom) and lets customers design wine labels end-to-end:
- Pick a template or start blank
- Place, style, and arrange text, images, and shapes
- Insert pre-filled wine data overlays (name, vintage, alcohol, QR code, etc.)
- Export a print-ready 300dpi PNG / PDF with crop marks
- Save progress to localStorage (auto) and to account DB (manual, via `onSave` callback)

---

## Decisions Log

| # | Question | Decision |
|---|---|---|
| 1 | Image upload | **File input only.** Clipboard paste (`Ctrl+V`) also supported — pastes image directly onto canvas. Showcase-Testing: **client-side only** — kein Server-Upload. |
| 2 | Autosave | **localStorage auto + `onSave` callback** for DB. Component handles localStorage, app wires `onSave` to Vendure account mutation. Manual "Save" button triggers `onSave(state)`. |
| 3 | Print bleed | **Yes, 3mm bleed indicator** on canvas — dashed overlay, non-interactive. Required for professional offset printing. |
| 4 | Signature Pad | **"Extras" insert panel** — low priority section alongside decorative dividers, ornaments, etc. Signature is one of several extras. Not a main toolbar tool. |
| 5 | i18n | **`i18n` prop object with English defaults.** Component ships English strings. App passes `i18n={cellarCanvasDE}` for German. No coupling to i18next/next-intl. Standard pattern (React DatePicker, TanStack Table). |
| 6 | Watermark | **Not needed.** |
| 7 | QR Code | **Mandatory overlay, generated client-side.** EU Reg. 2023/2977 requires nutritional info — QR is the allowed alternative. URL from `initialWineFields.nutritionalInfoUrl`. Generated via `qrcode` package, inserted as canvas image. Removing it triggers a strong EU validator warning. |
| 8 | Aspect ratio lock | **Locked by default on images, Shift to unlock.** Shapes unlocked by default. |

---

## Feature Inventory

### Canvas & Viewport
- [ ] Fabric.js canvas — 90×120mm default, configurable per area
- [ ] Zoom in/out + fit-to-screen (`+`/`-` keys and buttons)
- [ ] Pan (Spacebar + drag)
- [ ] Snap to grid + smart guide lines (show on drag near other objects)
- [ ] Ruler overlay (mm units, toggleable)
- [ ] Print bleed indicator (3mm dashed zone, non-interactive overlay)
- [ ] Multi-area tabs: Front / Back / Neck label (independent canvases)

### Image Input
- [ ] File input (click to upload) — JPEG, PNG, WebP, SVG, max 10MB
- [ ] **Clipboard paste** (`Ctrl/Cmd+V`) — reads `ClipboardEvent.clipboardData.items`, pastes image directly onto canvas at center
- [ ] Drag & drop file onto canvas area
- [ ] After upload: Ark UI `ImageCropper` modal before placement (aspect ratio, zoom, rotate)
- [ ] Re-crop: select image on canvas → "Crop" in ContextToolbar → re-open ImageCropper

### Tools (Main Toolbar)
- [ ] Select / Move / Transform
- [ ] Text tool → places `fabric.IText` on canvas
- [ ] Image tool → upload / paste → crop → place
- [ ] Shape tool → Rectangle / Circle / Line
- [ ] Pan mode
- [ ] Extras panel (signature, ornaments, decorative dividers) — *low priority*

### Context Toolbar (changes per selection)
- [ ] **Text:** font family, size, bold, italic, underline, letter spacing, line height, alignment, color
- [ ] **Shape:** fill color, stroke color, stroke width, corner radius (rect only)
- [ ] **Image:** opacity, replace, re-crop
- [ ] **Alignment bar:** align L/C/R/Top/Middle/Bottom, distribute evenly — shown when ≥ 2 objects selected

### Layer Panel
- [ ] Layer list — mirrors Fabric.js z-order, reversed (top = front)
- [ ] Drag-to-reorder (Framer Motion `Reorder.Group`) → updates canvas z-order
- [ ] Visibility toggle (eye icon) — hides object without deleting
- [ ] Lock/unlock — locks object against selection/move
- [ ] Inline rename (double-click on name)
- [ ] Delete (row button + `Delete`/`Backspace` key)
- [ ] Group / Ungroup selected objects
- [ ] Type icons per layer (text / image / shape / wine-field / group)

### Wine Data Overlays
- [ ] Insertable field blocks: Name, Vintage, Alcohol %, Volume (ml), Region, Grape Varieties, Producer, Country of Origin, Sugar Content, Energy (kcal), Allergen Note
- [ ] **QR Code** — generated from `initialWineFields.nutritionalInfoUrl`, inserted as image object, flagged as `_fieldKey: 'qrCode'`
- [ ] Pre-styled text presets per field (font, size, weight, position suggestion)
- [ ] Duplicate prevention (each field once per canvas)
- [ ] `initialWineFields` prop pre-populates text values
- [ ] Fields panel shows current value preview

### EU Compliance Validator (Regulation 2023/2977)
- [ ] Required fields: alcohol %, volume, allergen note, country of origin, QR code (or energy + sugar text)
- [ ] Scans canvas objects for `_fieldKey` metadata
- [ ] `ValidatorBadge` floats bottom-right — count of missing fields
- [ ] Popover lists each missing field with description
- [ ] Badge disappears when all required fields are placed
- [ ] `onValidationChange(warnings: string[])` callback
- [ ] Removing QR code → strong warning (red badge, not just yellow)

### Persistence & Save
- [ ] **Auto-save to localStorage** — debounced 1s after every change
- [ ] localStorage key: `cellar-canvas-draft-${sessionId}`
- [ ] Restore from localStorage on mount (if `initialState` not provided)
- [ ] **Manual save button** → triggers `onSave(state)` callback → app saves to DB
- [ ] Save button shows dirty state (unsaved changes indicator)
- [ ] `onSave` is async — button shows loading/success state

### Background Panel
- [ ] Solid color (via `ColorPickerPanel`)
- [ ] Linear gradient (2-stop, direction configurable)
- [ ] Image background (fills canvas, behind all objects, non-selectable)

### Templates
- [ ] 5 built-in: Classic, Modern, Rustic, Minimal, Bold
- [ ] Template thumbnails grid (generated from Fabric JSON on first render)
- [ ] Confirm prompt if canvas has unsaved content
- [ ] `customTemplates` prop for app-specific templates
- [ ] `hideBuiltInTemplates` prop

### Undo / Redo
- [ ] JSON snapshot per area (max 50 states)
- [ ] `Cmd/Ctrl+Z` / `Cmd/Ctrl+Shift+Z` keyboard shortcuts
- [ ] Undo/Redo buttons in toolbar
- [ ] History cleared on template apply or area switch (with confirm)

### Export Pipeline
- [ ] PNG at 300dpi via Fabric `toDataURL` (multiplier ≈ 3.125×)
- [ ] PDF with 3mm bleed crop marks via `jspdf`
- [ ] Area selector: front / back / neck / all (as zip for multi-area)
- [ ] Ark UI `DownloadTrigger` — handles file download natively
- [ ] `onExport({ area, format, blob })` callback (for server-side upload)
- [ ] `exportDpi` prop (default: 300)

### Onboarding Tour
- [ ] Ark UI `Tour` — 5 steps: Welcome → Canvas → Wine Fields → Layer Panel → Export
- [ ] Auto-starts on first open (localStorage flag)
- [ ] `disableTour` prop
- [ ] Skippable at any step

### i18n
- [ ] `i18n` prop — all UI strings overridable
- [ ] Default: English strings (`cellarCanvasEN`)
- [ ] German export: `cellarCanvasDE` object shipped alongside component
- [ ] No coupling to any i18n library

### Extras Panel (Low Priority — Phase 8)
- [ ] Ark UI `SignaturePad` → capture brush strokes → insert as SVG path on canvas
- [ ] Decorative dividers (thin horizontal line ornaments)
- [ ] Simple ornaments (leaf, grape cluster SVG shapes)
- [ ] All extras inserted as standard canvas objects (moveable, resizable)

### Accessibility
- [ ] Ark UI `FocusTrap` in all modals (ImageCropper, Template gallery, Export dialog, Extras panel)
- [ ] `role="toolbar"` + `aria-label` on toolbars
- [ ] `aria-label="Label canvas"` on `<canvas>` element
- [ ] Keyboard navigation in Layer Panel (`Tab`, `Enter` to rename, `Delete` to remove)

---

## Ark UI Components Used

| Component | Where |
|---|---|
| `ColorPicker` | Color picker panel — text color, fill, stroke, background ✅ built |
| `ImageCropper` | Crop modal after image upload + re-crop from ContextToolbar |
| `SignaturePad` | Extras panel → handwritten signature as canvas object |
| `Tour` | First-run guided walkthrough |
| `DownloadTrigger` | Export button — PNG/PDF download |
| `FocusTrap` | All modal panels and dialogs |

---

## Architecture

### State: Zustand v5 (`useDesignerStore`)
- `subscribeWithSelector` middleware — selector-based subscriptions
- Selectors prevent unnecessary re-renders at 60fps drag operations
- **Fabric.js** = source of truth for geometry (x, y, w, h, rotation, fill, stroke)
- **Zustand** = source of truth for UI metadata (layer names, visibility, lock, active tool, zoom, history, dirty flag)
- Sync **only** in `useEffect` and Fabric event callbacks — never during render

### React Compiler Compliance
- No `useMemo`, `useCallback`, `React.memo`
- `useRef` only for imperative handles (`fabricRef`) — never read during render
- Fabric `<canvas>` mounted once in `useEffect`, not in JSX
- `useDesignerStore.getState()` (synchronous, non-reactive) in all effects and event handlers

### Layout (CSS Grid)
```
┌──────────┬───────────────────────────┬──────────────┐
│          │  Context Toolbar          │              │
│  Main    ├───────────────────────────┤  Right       │
│  Toolbar │                           │  Panel       │
│ (left)   │      Canvas Area          │  (Layers /   │
│          │   [bleed indicator]       │  Wine Fields/│
│          │   [snap guides]           │  Templates / │
│          │   [ruler]                 │  Background) │
└──────────┴───────────────────────────┴──────────────┘
        [Front] [Back] [Neck]  ← Area Tabs (top)
        [💾 Save]  [ValidatorBadge]  ← floats bottom
```

### Folder Structure
```
components/cellar-canvas/
├── index.ts
├── CellarCanvas.tsx                   ← Root, public props API
├── i18n/
│   ├── en.ts                          ← Default English strings
│   └── de.ts                          ← German strings (shipped with component)
├── store/
│   ├── types.ts
│   └── designer-store.ts              ← Zustand store
├── engine/
│   ├── fabric-bridge.ts               ← Imperative Fabric helpers
│   ├── use-fabric-canvas.ts           ← useEffect mount/teardown + event sync
│   ├── use-clipboard-paste.ts         ← paste event → image on canvas
│   ├── snap-guide-manager.ts
│   ├── alignment-utils.ts
│   ├── qr-generator.ts                ← qrcode → data URL → fabric.Image
│   └── export-pipeline.ts             ← PNG + PDF
├── templates/
│   ├── classic.ts / modern.ts / rustic.ts / minimal.ts / bold.ts
│   └── index.ts
├── wine-fields/
│   ├── field-definitions.ts
│   ├── overlay-presets.ts
│   └── validator.ts
└── components/
    ├── canvas/
    │   ├── CanvasArea.tsx
    │   ├── LabelCanvas.tsx
    │   ├── BleedOverlay.tsx            ← 3mm dashed bleed indicator
    │   └── ZoomControls.tsx
    ├── toolbar/
    │   ├── MainToolbar.tsx
    │   ├── ContextToolbar.tsx
    │   ├── AlignmentBar.tsx
    │   ├── TextToolOptions.tsx
    │   ├── ShapeToolOptions.tsx
    │   └── ImageToolOptions.tsx
    ├── panels/
    │   ├── LayerPanel.tsx + LayerRow.tsx
    │   ├── WineFieldsPanel.tsx
    │   ├── TemplatesPanel.tsx
    │   ├── BackgroundPanel.tsx
    │   ├── ExportPanel.tsx
    │   ├── ExtrasPanel.tsx             ← signature, ornaments (Phase 8)
    │   └── ValidatorBadge.tsx
    ├── tabs/
    │   └── LabelAreaTabs.tsx
    └── shared/
        ├── ColorPickerPanel.tsx        ← re-export from ../color-picker
        ├── ImageCropperModal.tsx       ← Ark UI ImageCropper + FocusTrap
        ├── FontPicker.tsx
        ├── IconButton.tsx
        ├── NumberInput.tsx
        └── Tooltip.tsx
```

---

## Public Props API

```typescript
type LabelArea = 'front' | 'back' | 'neck'

interface WineFieldValues {
  name?:               string
  vintage?:            string | number
  alcoholPercent?:     string | number
  volumeMl?:           string | number
  region?:             string
  grapes?:             string
  producer?:           string
  countryOfOrigin?:    string
  sugarContent?:       string
  energyKcal?:         string | number
  allergenNote?:       string
  nutritionalInfoUrl?: string   // → QR code generation (e.g. Vendure product page URL)
}

interface CellarCanvasProps {
  // Dimensions
  dimensions?:          Partial<Record<LabelArea, { widthMm: number; heightMm: number }>>

  // Pre-fill
  initialWineFields?:   WineFieldValues
  initialState?:        Partial<Record<LabelArea, object>>  // Fabric JSON
  enabledAreas?:        LabelArea[]        // default: ['front', 'back', 'neck']
  defaultArea?:         LabelArea          // default: 'front'

  // Templates
  customTemplates?:     WineLabelTemplate[]
  hideBuiltInTemplates?: boolean

  // Export
  exportDpi?:           number             // default: 300
  enablePdfExport?:     boolean            // default: true

  // Validation
  euRegulationYear?:    2012 | 2023        // default: 2023
  mandatoryFields?:     Array<keyof WineFieldValues>

  // Tour
  disableTour?:         boolean

  // i18n
  i18n?:                Partial<CellarCanvasStrings>  // defaults to English

  // Callbacks
  onChange?:            (state: Partial<Record<LabelArea, object>>) => void
  onSave?:              (state: Partial<Record<LabelArea, object>>) => Promise<void>
  onExport?:            (result: { area: LabelArea; format: 'png' | 'pdf'; blob: Blob }) => void
  onValidationChange?:  (warnings: string[]) => void

  // Styling
  height?:    string | number
  className?: string
  style?:     React.CSSProperties
}
```

---

## Dependencies

| Package | Purpose | Status |
|---|---|---|
| `@ark-ui/react@^5.x` | Color Picker, ImageCropper, SignaturePad, Tour, DownloadTrigger, FocusTrap | ✅ installed |
| `fabric@^6.5.0` | Canvas engine | ⬜ to install |
| `zustand@^5.0.0` | Designer state store | ⬜ to install |
| `jspdf@^2.5.2` | PDF export with crop marks | ⬜ to install |
| `qrcode@^1.5.x` | QR code generation (EU nutritional info) | ⬜ to install |
| `framer-motion` | Layer drag-reorder, panel animations | ✅ present |
| `lucide-react` | Toolbar icons | ✅ present |
| `clsx` + `tailwind-merge` | `cn()` utility | ✅ present |

**4 packages to install: `fabric`, `zustand`, `jspdf`, `qrcode`**

---

## Implementation Phases

### Phase 1 — Atomic Sub-Components ← current
Priorität: Jede Komponente **inhaltlich vollständig + Styling perfektioniert** bevor Phase 2 beginnt.
Jede Komponente wird in `/designer` als eigene Section showcased.

| Component | Status |
|---|---|
| `ColorPickerPanel` — HEX/RGB/HSL, alpha, swatches | ✅ done |
| `TextToolOptions` — font, bold/italic/underline, letter-spacing, color | ✅ done |
| `ImageCropperModal` — Ark UI ImageCropper + FocusTrap | ✅ done |
| `LayerPanel` — Framer Motion Reorder (mock data, kein Fabric) | ✅ done |
| `FontPicker` — in TextToolOptions inline (kein standalone nötig) | ✅ done (inline) |
| `NumberInput` — inline stepper (px / deg / %) | ✅ built, ⬜ Showcase + Styling-Review |
| `AlignmentBar` — 6 align + 2 distribute buttons | ✅ done |
| `Tooltip` primitive | ✅ done |
| `ValidatorBadge` — badge + popover (mock warnings) | ✅ done |

### Phase 2 — Canvas Foundation
- Install `fabric`, `zustand`
- `store/types.ts` + `designer-store.ts`
- `engine/fabric-bridge.ts` + `use-fabric-canvas.ts`
- `CellarCanvas` shell — CSS grid layout
- `CanvasArea` + `LabelCanvas` — canvas mounts, zoom/pan
- `MainToolbar` with tool switching
- Text tool + Rect tool (add objects)
- `use-clipboard-paste.ts` — Ctrl+V → image on canvas

### Phase 3 — Layer Panel Integration
- Connect `LayerPanel` to Fabric events
- Drag reorder → `canvas.moveTo()`
- Visibility, lock, rename, delete
- `PropertiesPanel` — x/y/w/h/rotation `NumberInput` fields

### Phase 4 — Wine Fields + QR + Validator
- `wine-fields/field-definitions.ts` + `overlay-presets.ts`
- `WineFieldsPanel` — insert buttons, value preview
- `qr-generator.ts` — `qrcode` → data URL → `fabric.Image`
- `validator.ts` — scan `_fieldKey` on canvas objects
- `ValidatorBadge` with popover
- `initialWineFields` prop wiring

### Phase 5 — Image Tool + Shapes + Background
- Install `@types/qrcode`
- File upload + drag & drop → `ImageCropperModal` → canvas
- Re-crop from ContextToolbar
- Shape tools + `ShapeToolOptions`
- `BackgroundPanel` (solid, gradient, image)
- `BleedOverlay` (3mm dashed zone)
- Snap to grid + smart guides
- Group / Ungroup
- **Testing: client-side only** — kein Server-Upload, `onExport` callback wird im Showcase nur geloggt

### Phase 6 — Templates + Undo/Redo + Multi-Area
- Install `jspdf`
- 5 built-in templates as Fabric JSON
- `TemplatesPanel` with previews
- Undo/Redo — JSON snapshot history (50 states)
- `LabelAreaTabs` — Front / Back / Neck

### Phase 7 — Persistence + Export + Tour
- localStorage autosave + `onSave` callback wiring
- Save button with dirty state + loading/success
- `export-pipeline.ts` — PNG + PDF
- `ExportPanel` — area selector, format, dpi
- Ark UI `DownloadTrigger`
- `onExport` callback
- Ark UI `Tour` — 5-step first-run walkthrough
- i18n: `i18n/en.ts` + `i18n/de.ts`

### Phase 8 — Polish + Extras + Showcase
- `FocusTrap` audit across all modals
- Responsive: collapsible panels on narrow screens
- Dark/light mode + accent color audit
- `ExtrasPanel` — Ark UI `SignaturePad`, ornaments (low priority)
- Showcase page `/designer` expanded with full demo
- Accessibility pass

---

## Canvas Object Metadata Convention

Every Fabric.js object in Cellar Canvas carries these custom properties:

```typescript
interface FabricObjectMeta {
  id: string           // UUID — stable across history snapshots
  _layerName: string   // displayed name in Layer Panel
  _type: 'text' | 'wine-field' | 'image' | 'rect' | 'circle' | 'line' | 'group' | 'qr-code'
  _fieldKey?: string   // wine-field and qr-code objects: 'name' | 'vintage' | 'qrCode' | ...
  _locked?: boolean    // mirrors Layer Panel lock state
  _extras?: boolean    // marks objects added from Extras panel
}
```

---

*Last updated: 2026-04-28*
*Component location: `components/cellar-canvas/`*
*Showcase route: `/designer`*
