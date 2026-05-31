import { forwardRef } from 'react'
import { cn } from '../../../lib/utils'

export interface LabelBackdrop {
  /** Position + size in DOM pixels (already includes Fabric's zoom + pan). */
  left: number
  top: number
  width: number
  height: number
  /** Hex/rgb fill — the "label paper" colour. */
  color: string
}

export interface LabelCanvasProps {
  className?: string
  backdrop?: LabelBackdrop
  /** Label width in millimetres — required when rendering the bleed mask. */
  widthMm?: number
  /** Label height in millimetres — required when rendering the bleed mask. */
  heightMm?: number
  /** Symmetric bleed margin in millimetres around the label. */
  bleedMm?: number
  /**
   * Opacity (0–1) of the overlay that dims the bleed area around the label.
   * 0 disables the mask entirely. ~0.55 = design view (overflow stays
   * readable). 1 = preview (bleed disappears, only the label remains).
   */
  bleedMaskOpacity?: number
  /** Mask colour. Defaults to the surrounding viewport background. */
  bleedMaskColor?: string
  /**
   * Print-bleed safety zone in millimetres. The dimming mask extends this
   * far INTO the label edge, creating a translucent strip at the label
   * boundary that visualises the trim-risk zone — designers see at a
   * glance that content placed in this strip might get clipped off by
   * the cutter. `0` disables the inward extension (mask sits flush with
   * the label edge as before).
   */
  printBleedMm?: number
}

/**
 * Wraps the Fabric `<canvas>` and renders the visible "label card" as a
 * positioned `<div>` underneath it. Keeping the backdrop out of the Fabric
 * object stack means stack mutations (bring-to-front, send-to-back, layer
 * reorder) only touch user objects.
 *
 * Also renders an optional bleed mask: four absolute stripes that sit ON
 * TOP of the Fabric canvas and dim everything outside the printable label
 * area. The mask is purely a CSS overlay — Fabric still draws into the
 * larger bleed canvas, so dragging objects past the label edge keeps them
 * visible (just translucent). At opacity 1 the bleed is completely hidden,
 * giving a print-accurate preview.
 */
export const LabelCanvas = forwardRef<HTMLCanvasElement, LabelCanvasProps>(({
  className,
  backdrop,
  widthMm,
  heightMm,
  bleedMm,
  bleedMaskOpacity = 0,
  bleedMaskColor,
  printBleedMm = 0,
}, ref) => {
  const showMask =
    bleedMaskOpacity > 0 &&
    widthMm !== undefined &&
    heightMm !== undefined &&
    bleedMm !== undefined &&
    bleedMm > 0

  return (
    <div className={cn("relative", className)}>
      {backdrop && (
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            left:            backdrop.left,
            top:             backdrop.top,
            width:           backdrop.width,
            height:          backdrop.height,
            backgroundColor: backdrop.color,
            boxShadow:       '0 8px 24px rgba(0, 0, 0, 0.18)',
          }}
        />
      )}
      <canvas ref={ref} />
      {showMask && (
        <BleedMask
          widthMm={widthMm}
          heightMm={heightMm}
          bleedMm={bleedMm}
          opacity={bleedMaskOpacity}
          color={bleedMaskColor}
          printBleedMm={printBleedMm}
        />
      )}
    </div>
  )
})

LabelCanvas.displayName = 'LabelCanvas'

/**
 * Four absolute stripes (top / bottom / left / right) that cover the bleed
 * area around the label and let the label rectangle itself show through.
 * Sizes are pure percentages of the parent — the parent is the canvas
 * wrapper which Fabric sizes to `(widthMm + 2·bleedMm) × (heightMm + 2·bleedMm)`,
 * so the same ratios stay correct regardless of zoom.
 *
 * `printBleedMm > 0` extends each strip inward by that many millimetres,
 * so the dim overlay overlaps the label edge by the print-bleed safety
 * zone. The result is a translucent "danger" strip at the label boundary
 * — designers can spot at a glance that content placed there might get
 * trimmed off. Preview mode (`opacity = 1`) hides this strip too, since
 * the whole bleed area goes fully opaque.
 *
 * `pointer-events: none` keeps Fabric's selection / drag handlers working
 * underneath. `z-index` is set high enough to sit above Fabric's own
 * stacked lower/upper canvases but below floating UI (validator badge,
 * toolbars, etc.).
 */
function BleedMask({
  widthMm,
  heightMm,
  bleedMm,
  opacity,
  color,
  printBleedMm,
}: {
  widthMm: number
  heightMm: number
  bleedMm: number
  opacity: number
  color?: string
  printBleedMm: number
}) {
  const totalW = widthMm + 2 * bleedMm
  const totalH = heightMm + 2 * bleedMm
  // Mask reaches `bleedMm` outside the label plus `printBleedMm` inside it,
  // overlapping the label edge by the print-bleed safety zone.
  const stripMm = bleedMm + printBleedMm
  const leftPct = (stripMm / totalW) * 100
  const topPct  = (stripMm / totalH) * 100
  const midH    = 100 - 2 * topPct
  const fill = color ?? 'var(--background)'

  const base = {
    position: 'absolute' as const,
    backgroundColor: fill,
    opacity,
    pointerEvents: 'none' as const,
    zIndex: 40,
    transition: 'opacity 180ms ease-out',
  }

  return (
    <div aria-hidden>
      <div style={{ ...base, left: 0, top: 0,    width: '100%',         height: `${topPct}%` }} />
      <div style={{ ...base, left: 0, bottom: 0, width: '100%',         height: `${topPct}%` }} />
      <div style={{ ...base, left: 0, top: `${topPct}%`,  width: `${leftPct}%`, height: `${midH}%` }} />
      <div style={{ ...base, right: 0, top: `${topPct}%`, width: `${leftPct}%`, height: `${midH}%` }} />
    </div>
  )
}
