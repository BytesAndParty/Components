import jsPDF from 'jspdf'
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
 */
function renderLabelPng(bridge: FabricBridge, dpi: number): string {
  const canvas    = bridge.canvas
  const bleedPx   = mmToPx(bridge.bleedMm)
  const labelW    = mmToPx(bridge.widthMm)
  const labelH    = mmToPx(bridge.heightMm)
  const prevBg    = canvas.backgroundColor
  canvas.backgroundColor = bridge.getBackground()
  try {
    return canvas.toDataURL({
      format:     'png',
      left:       bleedPx,
      top:        bleedPx,
      width:      labelW,
      height:     labelH,
      multiplier: dpi / SCREEN_DPI,
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

/**
 * Produces a print-ready PDF in exact trim size — no outer bleed, no crop
 * marks. One page per label, page format matches the label dimensions in
 * millimetres. The print shop adds bleed and marks itself if needed.
 *
 * Returns a Blob so callers can either trigger a download (default) or
 * upload it to a backend via `onExport`.
 */
export function exportLabelPdf(bridge: FabricBridge, dpi = DEFAULT_EXPORT_DPI): Blob {
  const png  = renderLabelPng(bridge, dpi)
  const w    = bridge.widthMm
  const h    = bridge.heightMm
  const pdf  = new jsPDF({
    orientation: w > h ? 'landscape' : 'portrait',
    unit:        'mm',
    format:      [w, h],
    compress:    true,
  })
  pdf.addImage(png, 'PNG', 0, 0, w, h)
  return pdf.output('blob')
}

/**
 * Triggers a browser download for a Blob. Revokes the temporary object
 * URL on the next tick so the anchor click has time to start the
 * download before the URL is invalidated.
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a   = document.createElement('a')
  a.href     = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
