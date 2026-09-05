# Cellar Canvas — Wine Label Designer

> A headless-first, React 19 label design editor for winemakers.
> Customers design their own bottle labels directly in the browser — print-ready export included.
>
> **Implementation status, architecture, props API:** [`components/cellar-canvas/COMPONENT.md`](./components/cellar-canvas/COMPONENT.md)
> **Bug/decision history + full open-items list:** [`components/cellar-canvas/STATUS.md`](./components/cellar-canvas/STATUS.md)
>
> This file keeps only the product vision, naming rationale, and decisions log — the sections that
> don't belong in a component-local doc. Feature checklists, architecture, and the props API used to
> live here too; they drifted out of sync with the actual implementation and are now owned by
> `COMPONENT.md`/`STATUS.md` instead.

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

*Last updated: 2026-08-28*
*Component location: `components/cellar-canvas/`*
*Showcase route: `/designer`*
