/**
 * Conversion utility for physical units to screen pixels.
 * Standard Web DPI is 96.
 */
export const MM_TO_PX = 3.7795275591

export function mmToPx(mm: number): number {
  return Math.round(mm * MM_TO_PX)
}

export function pxToMm(px: number): number {
  return Math.round(px / MM_TO_PX)
}
