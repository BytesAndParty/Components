/**
 * Conversion utility for physical units to screen pixels.
 * Standard Web DPI is 96.
 */
const MM_TO_PX = 3.7795275591

/**
 * Whole pixels, for sizes that must be integral: canvas dimensions, the label
 * rect, fixed element sizes. A canvas element cannot be fractional.
 */
export function mmToPx(mm: number): number {
  return Math.round(mm * MM_TO_PX)
}

/**
 * Exact pixels, for user-entered geometry (x / y / width / height in the
 * properties panel). Not rounded, so 12.5 mm survives a write/read round trip
 * with `pxToMm` instead of snapping to the pixel grid.
 */
export function mmToPxExact(mm: number): number {
  return mm * MM_TO_PX
}

/** Pixels to mm at 0.1 mm precision, the finest step the properties panel shows. */
export function pxToMm(px: number): number {
  return Math.round((px / MM_TO_PX) * 10) / 10
}
