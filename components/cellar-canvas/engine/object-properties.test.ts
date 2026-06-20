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

// mmToPx rounds: mmToPx(20) = 76, mmToPx(10) = 38. pxToMm(76) = 20.

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
    expect(geo).toEqual({ x: 20, y: 20, width: 20, height: 20 })
  })
})

describe('xToLeft / yToTop', () => {
  it('offsets mm into the bleed margin', () => {
    expect(xToLeft(20, 100)).toBe(176)
    expect(yToTop(20, 151)).toBe(227)
  })
})

describe('widthToFabricProps', () => {
  it('circle: width → radius (half diameter, divided by scale)', () => {
    expect(widthToFabricProps(20, 'circle', { scaleX: 1 })).toEqual({ radius: 38 })
    expect(widthToFabricProps(20, 'circle', { scaleX: 2 })).toEqual({ radius: 19 })
  })

  it('line: width → x2 offset from x1 (pre-scale)', () => {
    expect(widthToFabricProps(20, 'line', { scaleX: 1, x1: 10 })).toEqual({ x2: 86 })
    expect(widthToFabricProps(20, 'line', { scaleX: 1 })).toEqual({ x2: 76 })
  })

  it('textbox: width → wrap box (divided by scale)', () => {
    expect(widthToFabricProps(20, 'textbox', { scaleX: 1 })).toEqual({ width: 76 })
  })

  it('scalable: width → scaleX against intrinsic width', () => {
    expect(widthToFabricProps(20, 'scalable', { scaleX: 1, intrinsicWidth: 152 })).toEqual({
      scaleX: 0.5,
    })
  })

  it('scalable: returns {} when intrinsic width is missing or zero', () => {
    expect(widthToFabricProps(20, 'scalable', { scaleX: 1, intrinsicWidth: 0 })).toEqual({})
    expect(widthToFabricProps(20, 'scalable', { scaleX: 1 })).toEqual({})
  })
})

describe('heightToFabricProps', () => {
  it('scalable: height → scaleY against intrinsic height', () => {
    expect(heightToFabricProps(10, 'scalable', 76)).toEqual({ scaleY: 0.5 })
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
