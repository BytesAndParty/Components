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

A self-contained React component that drops into any storefront (Vendure, Shopify, custom) and lets customers finish their own wine label.

**Focus since 2026-11-10: the basics.** Most customers who design a label already own an image editor. They arrive with finished artwork and only need small adjustments:
- Upload the label artwork (it fills the label), or start from a template
- Small adjustments: text, a few shapes, crop or replace the image, paper colour
- Switch pre-filled wine data overlays on and off (name, vintage, mandatory particulars, QR code)
- See the result on a 3D bottle that can be turned
- Export a print-ready 300dpi PNG / PDF with crop marks
- Save progress to localStorage (auto) and to account DB (manual, via `onSave` callback)

A full design tool (emoji, signature, ornaments, rulers, grouping, gradients) is out of scope, see decision 9.

---

## Decisions Log

| # | Question | Decision |
|---|---|---|
| 1 | Image upload | **File input only.** Clipboard paste (`Ctrl+V`) also supported — pastes image directly onto canvas. Showcase-Testing: **client-side only** — kein Server-Upload. *Since extended:* drag & drop and image replace use the same pipeline (`prepareImageSource`, STATUS.md #27). |
| 2 | Autosave | **localStorage auto + `onSave` callback** for DB. Component handles localStorage, app wires `onSave` to Vendure account mutation. Manual "Save" button triggers `onSave(state)`. |
| 3 | Print bleed | **Yes, 3mm bleed indicator** on canvas, non-interactive. Required for professional offset printing. *Implemented differently (2026-05-26):* no dashed line — the bleed mask reaches 3 mm into the label and darkens the trim-risk strip; preview mode hides it (STATUS.md, Entscheidungs-Log). |
| 4 | Signature Pad | **"Extras" insert panel** — low priority section alongside decorative dividers, ornaments, etc. Signature is one of several extras. Not a main toolbar tool. |
| 5 | i18n | ~~`i18n` prop object with English defaults~~ — *superseded (2026-05-26):* `messages.ts` ships `de` + `en`, the locale comes from the global `I18nProvider`, single strings are overridden via the `messages` prop (project-wide pattern, see COMPONENT-GUIDELINES §6). Still no coupling to i18next/next-intl. |
| 6 | Watermark | **Not needed.** |
| 7 | QR Code | **Mandatory overlay, generated client-side.** EU Reg. 2023/2977 requires nutritional info — QR is the allowed alternative. URL from `initialWineFields.nutritionalInfoUrl`. Generated via `qrcode` package, inserted as canvas image. Removing it turns the EU validator red (error) once a QR code had been placed — *done 2026-10-14* (STATUS.md, „QR-Removal-Warning“). |
| 8 | Aspect ratio lock | **Locked by default on images, Shift to unlock.** Shapes unlocked by default. |
| 9 | Scope *(2026-11-10)* | **Basics plus shapes and templates.** Stays: image upload (fills the label), crop / replace, text (font, size, colour, bold / italic, alignment), rect / circle / line, paper colour or image, templates, wine data overlays, a compact layer list, undo, zoom, save, PNG / PDF. Removed: emoji picker, signature pad, ornaments (decision 4), rulers, the hand tool button, grouping, gradient paper, the guided tour; the mm inputs move from their own tab into a collapsible section. |
| 10 | Wine data overlays *(2026-11-10)* | **Printed building blocks with a switch each** (name, vintage, region, producer, mandatory particulars, QR code). Switched on they sit ready-formatted at a sensible place, can be moved and are part of the print. |
| 11 | Bottle preview *(2026-11-10)* | **Yes, as a view switch "Label / Bottle"** above the canvas. `BottleStage` carries the current label and turns with the mouse. |

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

*Last updated: 2026-11-10*
*Component location: `components/cellar-canvas/`*
*Showcase route: `/designer`*
