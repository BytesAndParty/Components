import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import * as fabric from 'fabric'
import {
  geometryKind,
  readGeometryMm,
  xToLeft,
  yToTop,
  widthToFabricProps,
  heightToFabricProps,
} from './object-properties'

// The write path is exact (mmToPxExact), the read path rounds to 0.1 mm (pxToMm): 76 px = 20.1 mm.
const PX_PER_MM = 3.7795275591

// jsdom ships no 2D canvas, but constructing a fabric Textbox measures its text
// on init. Stub a permissive 2D context (no-op methods, swallowed property sets,
// a non-zero measureText so wrapping terminates) so the classifier test can build
// a real Textbox. geometryKind stays instanceof-based — fabric's own source warns
// against driving logic off the instance `.type` value.
let originalGetContext: typeof HTMLCanvasElement.prototype.getContext
beforeAll(() => {
  originalGetContext = HTMLCanvasElement.prototype.getContext
  HTMLCanvasElement.prototype.getContext = (() =>
    new Proxy(
      { measureText: (t: string) => ({ width: String(t).length * 8 }) },
      {
        get: (target, prop) => (prop in target ? Reflect.get(target, prop) : () => {}),
        set: () => true,
      },
    )) as unknown as typeof HTMLCanvasElement.prototype.getContext
})
afterAll(() => {
  HTMLCanvasElement.prototype.getContext = originalGetContext
})

describe('geometryKind', () => {
  it('classifies each Fabric object type', () => {
    expect(geometryKind(new fabric.Circle({ radius: 10 }))).toBe('circle')
    expect(geometryKind(new fabric.Line([0, 0, 10, 0]))).toBe('line')
    expect(geometryKind(new fabric.Textbox('x'))).toBe('textbox')
    expect(geometryKind(new fabric.Rect({ width: 10, height: 10 }))).toBe('scalable')
  })
})

describe('readGeometryMm', () => {
  it('reports label-relative mm from scaled px geometry', () => {
    const geo = readGeometryMm(
      { left: 176, top: 176, width: 152, height: 76, scaleX: 0.5, scaleY: 1 },
      100,
    )
    expect(geo).toEqual({ x: 20.1, y: 20.1, width: 20.1, height: 20.1 })
  })
})

describe('xToLeft / yToTop', () => {
  it('offsets mm into the bleed margin', () => {
    expect(xToLeft(20, 100)).toBeCloseTo(100 + 20 * PX_PER_MM)
    expect(yToTop(20, 151)).toBeCloseTo(151 + 20 * PX_PER_MM)
  })
})

describe('widthToFabricProps', () => {
  it('circle: width → radius (half diameter, divided by scale)', () => {
    expect(widthToFabricProps(20, 'circle', { scaleX: 1 }).radius).toBeCloseTo(10 * PX_PER_MM)
    expect(widthToFabricProps(20, 'circle', { scaleX: 2 }).radius).toBeCloseTo(5 * PX_PER_MM)
  })

  it('line: width → x2 offset from x1 (pre-scale)', () => {
    expect(widthToFabricProps(20, 'line', { scaleX: 1, x1: 10 }).x2).toBeCloseTo(10 + 20 * PX_PER_MM)
    expect(widthToFabricProps(20, 'line', { scaleX: 1 }).x2).toBeCloseTo(20 * PX_PER_MM)
  })

  it('textbox: width → wrap box (divided by scale)', () => {
    expect(widthToFabricProps(20, 'textbox', { scaleX: 1 }).width).toBeCloseTo(20 * PX_PER_MM)
  })

  it('scalable: width → scaleX against intrinsic width', () => {
    expect(
      widthToFabricProps(20, 'scalable', { scaleX: 1, intrinsicWidth: 152 }).scaleX,
    ).toBeCloseTo((20 * PX_PER_MM) / 152)
  })

  it('scalable: returns {} when intrinsic width is missing or zero', () => {
    expect(widthToFabricProps(20, 'scalable', { scaleX: 1, intrinsicWidth: 0 })).toEqual({})
    expect(widthToFabricProps(20, 'scalable', { scaleX: 1 })).toEqual({})
  })
})

describe('heightToFabricProps', () => {
  it('scalable: height → scaleY against intrinsic height', () => {
    expect(heightToFabricProps(10, 'scalable', 76).scaleY).toBeCloseTo((10 * PX_PER_MM) / 76)
  })

  it('scalable: returns {} when intrinsic height is missing or zero', () => {
    expect(heightToFabricProps(10, 'scalable', 0)).toEqual({})
    expect(heightToFabricProps(10, 'scalable', undefined)).toEqual({})
  })

  it('non-scalable kinds ignore height', () => {
    expect(heightToFabricProps(10, 'circle', 76)).toEqual({})
    expect(heightToFabricProps(10, 'line', 76)).toEqual({})
    expect(heightToFabricProps(10, 'textbox', 76)).toEqual({})
  })
})
