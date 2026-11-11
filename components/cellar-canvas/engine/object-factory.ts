import * as fabric from 'fabric'
import { mmToPxExact } from './units'
import { defaultTextFormat } from '../../text-tool-options/types'
import type { FabricObjectMeta } from '../store/types'

/**
 * Pure Fabric object factories for Cellar Canvas.
 *
 * Each `create*`/`configure*` returns a fully-configured object with metadata
 * attached but never touches the canvas — placing, activating, rendering and
 * history are the bridge's job (`FabricBridge.place`). Keeping construction
 * side-effect-free removes the ~30-line boilerplate each factory used to repeat
 * (corner style, origin pinning, meta assign) and makes the geometry testable
 * in isolation.
 */

/** Default fill for shapes — the wine-red brand tone. */
const SHAPE_FILL = '#722f37'

/** Default insertion offset from the label's top-left corner, in px. */
const INSET_PX = 100

/**
 * Shared selection-handle styling. Applied to resizable objects (rect, circle,
 * line, image) — text and QR objects intentionally keep Fabric's defaults.
 */
export const CORNER_STYLE = {
  cornerColor: '#ffffff',
  cornerStrokeColor: '#000000',
  transparentCorners: false,
  cornerSize: 8,
} as const

/**
 * Fabric v7 defaults the transform origin to center/center. Our mm/px mapping
 * treats left/top as the bounding-box corner, so every factory pins v6 semantics.
 */
const ORIGIN = { originX: 'left', originY: 'top' } as const

/**
 * Attaches Cellar Canvas metadata to a Fabric object, generating a stable UUID.
 * Centralises the `id` + meta assignment every factory needs.
 */
export function attach<T extends fabric.Object>(
  obj: T,
  meta: Omit<FabricObjectMeta, 'id'>,
): T & FabricObjectMeta {
  const full: FabricObjectMeta = { id: crypto.randomUUID(), ...meta }
  Object.assign(obj, full)
  return obj as T & FabricObjectMeta
}

export function createRect(bleedPx: number) {
  const rect = new fabric.Rect({
    ...ORIGIN,
    left: bleedPx + INSET_PX,
    top: bleedPx + INSET_PX,
    fill: SHAPE_FILL,
    width: mmToPxExact(20),
    height: mmToPxExact(20),
    ...CORNER_STYLE,
  })
  return attach(rect, { _layerName: 'Rectangle', _type: 'rect' })
}

export function createCircle(bleedPx: number) {
  const circle = new fabric.Circle({
    ...ORIGIN,
    left: bleedPx + INSET_PX,
    top: bleedPx + INSET_PX,
    fill: SHAPE_FILL,
    radius: mmToPxExact(10),
    ...CORNER_STYLE,
  })
  return attach(circle, { _layerName: 'Circle', _type: 'circle' })
}

export function createLine(bleedPx: number) {
  const x = bleedPx + INSET_PX
  const y = bleedPx + INSET_PX
  const length = mmToPxExact(30)
  const line = new fabric.Line([x, y, x + length, y], {
    ...ORIGIN,
    stroke: SHAPE_FILL,
    strokeWidth: 2,
    ...CORNER_STYLE,
  })
  return attach(line, { _layerName: 'Line', _type: 'line' })
}

/**
 * Text uses `Textbox` (not `IText`) so word-wrap is on by default at a fixed
 * mm-width — wine labels routinely need multi-line blocks like producer/region.
 * Manual `\n` via Enter still works. A `fieldKey` marks it as a wine-field:
 * its text is bound to the wine data, so it is not editable on the canvas.
 */
export function createText(bleedPx: number, text: string, fieldKey?: string) {
  const textbox = new fabric.Textbox(text, {
    ...ORIGIN,
    left: bleedPx + INSET_PX,
    top: bleedPx + INSET_PX,
    width: mmToPxExact(50),
    fontSize: 24,
    // The font the toolbar's picker starts with, so it shows what is set.
    fontFamily: defaultTextFormat.fontFamily,
    fill: '#000000',
    editable: !fieldKey,
  })
  return attach(textbox, {
    _layerName: text,
    _type: fieldKey ? 'wine-field' : 'text',
    _fieldKey: fieldKey,
  })
}

/**
 * Configures an already-loaded image: scales it to fit a 40mm bounding box so
 * it never blows past the label, pins origin/corner style and attaches meta.
 * Loading (`FabricImage.fromURL`) stays async in the bridge.
 */
export function configureImage(img: fabric.FabricImage, bleedPx: number) {
  const maxPx = mmToPxExact(40)
  const scale = Math.min(maxPx / (img.width ?? maxPx), maxPx / (img.height ?? maxPx), 1)
  img.set({
    ...ORIGIN,
    left: bleedPx + mmToPxExact(10),
    top: bleedPx + mmToPxExact(10),
    scaleX: scale,
    scaleY: scale,
    ...CORNER_STYLE,
  })
  return attach(img, { _layerName: 'Image', _type: 'image' })
}

/**
 * Configures an already-loaded QR image — fixed 0.2 scale, flagged as the
 * mandatory `qrCode` wine-field for the EU compliance validator.
 */
export function configureQRImage(img: fabric.FabricImage, bleedPx: number) {
  img.set({
    ...ORIGIN,
    left: bleedPx + INSET_PX,
    top: bleedPx + INSET_PX,
    scaleX: 0.2,
    scaleY: 0.2,
  })
  return attach(img, { _layerName: 'QR Code', _type: 'qr-code', _fieldKey: 'qrCode' })
}
