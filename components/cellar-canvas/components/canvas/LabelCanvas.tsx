import { forwardRef } from 'react'
import { cn } from '../../../lib/utils'
import { mmToPx } from '../../engine/units'

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
  /** Label height in millimetres. Unused since the mask follows `backdrop`; kept for API stability. */
  heightMm?: number
  /** Symmetric bleed margin in millimetres. Unused since the mask follows `backdrop`; kept for API stability. */
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
  // heightMm / bleedMm stay in the props (API) but are no longer needed: the
  // mask positions itself on the backdrop rectangle, not on mm percentages.
  bleedMaskOpacity = 0,
  bleedMaskColor,
  printBleedMm = 0,
}, ref) => {
  const showMask =
    bleedMaskOpacity > 0 &&
    !!backdrop &&
    widthMm !== undefined

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
          backdrop={backdrop!}
          widthMm={widthMm!}
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
 * Four absolute stripes (top / bottom / left / right) that dim everything
 * EXCEPT the label rectangle. They are positioned on the `backdrop` rectangle
 * (DOM pixels, already zoom- and pan-aware from `computeBackdrop`), so the
 * dimmed area **scales with the label** while zooming instead of staying put
 * as a fixed percentage frame around the canvas element.
 *
 * `printBleedMm > 0` shrinks the "hole" inward by that many millimetres
 * (zoom-scaled), so the dim overlay overlaps the label edge by the
 * print-bleed safety zone — a translucent strip that marks the trim-risk
 * zone. Preview mode (`opacity = 1`) makes the whole area opaque, leaving
 * only the label visible.
 *
 * `pointer-events: none` keeps Fabric's selection / drag handlers working
 * underneath. `z-index` is set high enough to sit above Fabric's own
 * stacked lower/upper canvases but below floating UI (validator badge,
 * toolbars, etc.).
 */
function BleedMask({
  backdrop,
  widthMm,
  opacity,
  color,
  printBleedMm,
}: {
  backdrop: LabelBackdrop
  widthMm: number
  opacity: number
  color?: string
  printBleedMm: number
}) {
  const zoom = backdrop.width / mmToPx(widthMm)
  const inset = mmToPx(printBleedMm) * zoom

  const holeLeft = backdrop.left + inset
  const holeTop = backdrop.top + inset
  const holeW = Math.max(0, backdrop.width - 2 * inset)
  const holeH = Math.max(0, backdrop.height - 2 * inset)

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
      {/* top */}
      <div style={{ ...base, left: 0, right: 0, top: 0, height: holeTop }} />
      {/* bottom */}
      <div style={{ ...base, left: 0, right: 0, top: holeTop + holeH, bottom: 0 }} />
      {/* left */}
      <div style={{ ...base, left: 0, top: holeTop, width: holeLeft, height: holeH }} />
      {/* right */}
      <div style={{ ...base, left: holeLeft + holeW, right: 0, top: holeTop, height: holeH }} />
    </div>
  )
}
