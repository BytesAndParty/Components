import type { FabricBridge } from './fabric-bridge'
import { mmToPx } from './units'

const DEFAULT_EXPORT_DPI = 300
const SCREEN_DPI = 96

export interface ExportOptions {
  /** Filename without extension. Default: `'label'`. */
  filename?: string
}

/**
 * Renders ONLY the label region (i.e. the inner widthMm × heightMm box,
 * excluding the surrounding workspace bleed) to a PNG data URL at `dpi`.
 * `mmToPx` works at 96 DPI; Fabric's `multiplier` upscales the rendered
 * raster to the target DPI while keeping the crop region in source pixels.
 *
 * The Fabric canvas is set to `backgroundColor: 'transparent'` at runtime —
 * the label paper colour lives in `bridge.labelColor` and is rendered as a
 * CSS backdrop. For the export we temporarily paint that colour into the
 * canvas so the PNG carries the same look the user sees; we restore the
 * transparent background immediately afterwards.
 *
 * `excludeFromExport: true` on the snap-manager's guide lines keeps them
 * out of the raster automatically — Fabric honours the flag in `toDataURL`.
 *
 * Fabric crops in viewport pixels and keeps the current zoom and pan, so the
 * crop box is the label as it sits on screen, and the multiplier divides the
 * zoom back out. The result is the same at any zoom level.
 */
function renderLabelPng(bridge: FabricBridge, dpi: number, printBleedMm = 0): string {
  const canvas    = bridge.canvas
  // `printBleedMm` widens the crop past the trim on every side (print bleed);
  // the paper colour and overflowing objects run into it.
  const bleedPx   = mmToPx(bridge.bleedMm - printBleedMm)
  const labelW    = mmToPx(bridge.widthMm + 2 * printBleedMm)
  const labelH    = mmToPx(bridge.heightMm + 2 * printBleedMm)
  const zoom      = canvas.getZoom()
  const vpt       = canvas.viewportTransform
  const prevBg    = canvas.backgroundColor
  canvas.backgroundColor = bridge.getBackground()
  try {
    return canvas.toDataURL({
      format:     'png',
      left:       vpt[4] + bleedPx * zoom,
      top:        vpt[5] + bleedPx * zoom,
      width:      labelW * zoom,
      height:     labelH * zoom,
      multiplier: dpi / SCREEN_DPI / zoom,
    })
  } finally {
    canvas.backgroundColor = prevBg
    canvas.requestRenderAll()
  }
}

/**
 * Renders the label region as a print-resolution PNG Blob — same raster the
 * PDF embeds, without the PDF wrapper. For shops/printers that want the
 * plain image.
 */
export function exportLabelPng(bridge: FabricBridge, dpi = DEFAULT_EXPORT_DPI): Blob {
  const dataUrl = renderLabelPng(bridge, dpi)
  const base64  = dataUrl.split(',')[1]
  const bytes   = atob(base64)
  const buf     = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; i++) buf[i] = bytes.charCodeAt(i)
  return new Blob([buf], { type: 'image/png' })
}

/** Crop marks start this far outside the bleed and run this long (mm). */
const MARK_GAP_MM = 1
const MARK_LENGTH_MM = 5

export interface PrintLayout {
  page:  { width: number; height: number }
  /** Where the rendered raster (trim + bleed) sits on the page. */
  image: { x: number; y: number; width: number; height: number }
  /** Crop marks as [x1, y1, x2, y2], on the trim lines, outside the bleed. */
  marks: [number, number, number, number][]
}

/**
 * Page layout in mm for a label of `width` × `height` with `bleed` on every
 * side. Without bleed the page is the trim size and carries no marks. With
 * bleed, two marks per corner extend the trim lines outward, starting past
 * the bleed so the cutter never prints them; 1 mm of paper stays beyond.
 */
export function printLayout(width: number, height: number, bleed: number): PrintLayout {
  if (bleed <= 0) {
    return { page: { width, height }, image: { x: 0, y: 0, width, height }, marks: [] }
  }
  const trim  = bleed + MARK_GAP_MM + MARK_LENGTH_MM + 1 // trim box offset from the page edge
  const start = bleed + MARK_GAP_MM                      // mark start, measured from the trim
  const marks: PrintLayout['marks'] = []
  for (const [x, dx] of [[trim, -1], [trim + width, 1]] as const) {
    for (const [y, dy] of [[trim, -1], [trim + height, 1]] as const) {
      marks.push([x + dx * start, y, x + dx * (start + MARK_LENGTH_MM), y]) // along the horizontal trim line
      marks.push([x, y + dy * start, x, y + dy * (start + MARK_LENGTH_MM)]) // along the vertical trim line
    }
  }
  return {
    page:  { width: width + 2 * trim, height: height + 2 * trim },
    image: { x: trim - bleed, y: trim - bleed, width: width + 2 * bleed, height: height + 2 * bleed },
    marks,
  }
}

/**
 * Produces a print-ready PDF, one page per label. Default (`bleedMm` 0): exact
 * trim size, no bleed, no crop marks — the print shop adds them if needed,
 * and what the user sees is what gets printed. With `bleedMm` > 0 the raster
 * extends that far past the trim (capped at the workspace margin) and the
 * page carries crop marks (see `printLayout`).
 *
 * Returns a Blob so callers can either trigger a download (default) or
 * upload it to a backend via `onExport`.
 *
 * jsPDF (plus its html2canvas dependency, ~175 KB gzip) is imported here,
 * on demand — the PNG path shares this module and must not pay for it.
 */
export async function exportLabelPdf(
  bridge: FabricBridge,
  dpi = DEFAULT_EXPORT_DPI,
  bleedMm = 0,
): Promise<Blob> {
  const { jsPDF } = await import('jspdf')
  const bleed  = Math.min(Math.max(0, bleedMm), bridge.bleedMm)
  const png    = renderLabelPng(bridge, dpi, bleed)
  const layout = printLayout(bridge.widthMm, bridge.heightMm, bleed)
  const { page, image } = layout
  const pdf  = new jsPDF({
    orientation: page.width > page.height ? 'landscape' : 'portrait',
    unit:        'mm',
    format:      [page.width, page.height],
    compress:    true,
  })
  pdf.addImage(png, 'PNG', image.x, image.y, image.width, image.height)
  // Hairline registration marks (0.1 mm ≈ 0.28 pt).
  pdf.setDrawColor(0)
  pdf.setLineWidth(0.1)
  for (const [x1, y1, x2, y2] of layout.marks) pdf.line(x1, y1, x2, y2)
  return pdf.output('blob')
}
