import * as fabric from 'fabric'
import { mmToPx, pxToMm } from './units'

/**
 * Pure geometry mapping between Fabric's px object model and the label-relative
 * mm values shown in the Properties Panel.
 *
 * Extracted from `FabricBridge.get/updateActiveObject` so the per-object-type
 * branching (the bridge's worst complexity hotspot) lives in small, unit-tested
 * functions. The bridge keeps only the imperative glue (read object, set props,
 * render, history).
 */

/**
 * Geometry "kind" decides how a target mm width/height maps to Fabric props.
 * Rect / Image / IText share the `scalable` path (adjust scaleX/scaleY); circle,
 * line and textbox each need a bespoke mapping.
 */
export type GeometryKind = 'circle' | 'line' | 'textbox' | 'scalable'

export function geometryKind(obj: fabric.Object): GeometryKind {
  if (obj instanceof fabric.Circle) return 'circle'
  if (obj instanceof fabric.Line) return 'line'
  if (obj instanceof fabric.Textbox) return 'textbox'
  return 'scalable'
}

/** Raw px geometry read off a Fabric object. */
export interface RawGeometry {
  left: number
  top: number
  width: number
  height: number
  scaleX: number
  scaleY: number
}

/** Label-relative geometry in mm, as shown in the Properties Panel. */
export interface MmGeometry {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Converts a Fabric object's raw px geometry into label-relative mm. The scaled
 * bounding box (size × scale) is reported so every object type reads uniformly —
 * only the write path below is type-specific.
 */
export function readGeometryMm(raw: RawGeometry, bleedPx: number): MmGeometry {
  return {
    x: pxToMm(raw.left - bleedPx),
    y: pxToMm(raw.top - bleedPx),
    width: pxToMm(raw.width * raw.scaleX),
    height: pxToMm(raw.height * raw.scaleY),
  }
}

/** Maps a label-relative x (mm) to Fabric `left` (px), offset into the bleed. */
export function xToLeft(xMm: number, bleedPx: number): number {
  return mmToPx(xMm) + bleedPx
}

/** Maps a label-relative y (mm) to Fabric `top` (px), offset into the bleed. */
export function yToTop(yMm: number, bleedPx: number): number {
  return mmToPx(yMm) + bleedPx
}

/** Extra inputs the per-kind width mapping needs. */
export interface WidthContext {
  scaleX: number
  /** Line only: current x1 — the fixed endpoint the width extends from. */
  x1?: number
  /** Scalable only: the object's intrinsic (pre-scale) width in px. */
  intrinsicWidth?: number
}

/**
 * Maps a target mm width to the Fabric prop fragment for the object's kind:
 * - circle:   width → diameter → radius (uniform, height ignored)
 * - line:     width → x2 offset from x1 (pre-scale)
 * - textbox:  width → wrap box (re-flows text instead of stretching glyphs)
 * - scalable: width → scaleX against intrinsic width
 *
 * Returns `{}` when a scalable object has no usable intrinsic width, so the
 * caller leaves the object untouched (matching the previous guard).
 */
export function widthToFabricProps(
  widthMm: number,
  kind: GeometryKind,
  ctx: WidthContext,
): Record<string, number> {
  const targetPx = mmToPx(widthMm)
  const s = ctx.scaleX || 1
  switch (kind) {
    case 'circle':
      return { radius: targetPx / 2 / s }
    case 'line':
      return { x2: (ctx.x1 ?? 0) + targetPx / s }
    case 'textbox':
      return { width: targetPx / s }
    case 'scalable':
      return ctx.intrinsicWidth && ctx.intrinsicWidth > 0
        ? { scaleX: targetPx / ctx.intrinsicWidth }
        : {}
  }
}

/**
 * Maps a target mm height. Only `scalable` objects have an independent height —
 * circle (uniform), line (zero-height) and textbox (derived from wrapped lines)
 * ignore it and return `{}`.
 */
export function heightToFabricProps(
  heightMm: number,
  kind: GeometryKind,
  intrinsicHeight: number | undefined,
): Record<string, number> {
  if (kind !== 'scalable') return {}
  return intrinsicHeight && intrinsicHeight > 0
    ? { scaleY: mmToPx(heightMm) / intrinsicHeight }
    : {}
}
