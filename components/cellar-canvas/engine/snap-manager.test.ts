import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import * as fabric from 'fabric'
import { SnapManager } from './snap-manager'

// jsdom ships no 2D canvas. Stub a permissive context (no-op methods,
// swallowed property sets, `canvas` pointing back at its element) so a real
// fabric.Canvas can be built; snapping itself is plain geometry.
let originalGetContext: typeof HTMLCanvasElement.prototype.getContext
beforeAll(() => {
  originalGetContext = HTMLCanvasElement.prototype.getContext
  HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement) {
    return new Proxy(
      { canvas: this, measureText: (t: string) => ({ width: String(t).length * 8 }) },
      {
        get: (target, prop) => (prop in target ? Reflect.get(target, prop) : () => {}),
        set: () => true,
      },
    )
  } as unknown as typeof HTMLCanvasElement.prototype.getContext
})
afterAll(() => {
  HTMLCanvasElement.prototype.getContext = originalGetContext
})

// Scene coordinates of the label (90 × 120 mm, 40 mm bleed margin):
// x 151 … 491 (centre 321), y 151 … 605 (centre 378). The snap threshold is 5 px.
describe('SnapManager label snap points', () => {
  let canvas: fabric.Canvas
  let snap: SnapManager
  beforeEach(() => {
    canvas = new fabric.Canvas(document.createElement('canvas'), { width: 800, height: 800 })
    snap = new SnapManager(canvas, 90, 120, 40)
  })
  afterEach(() => {
    canvas.dispose()
  })

  /**
   * Drags an 80 × 60 px box to left/top and lets the manager snap it.
   * Like Fabric's drag handler, only left/top change, without setCoords.
   * Returns the box's bounding rect afterwards.
   */
  function drag(left: number, top: number) {
    const box = new fabric.Rect({ originX: 'left', originY: 'top', left: 0, top: 0, width: 80, height: 60, strokeWidth: 0 })
    canvas.add(box)
    box.set({ left, top })
    snap.handleMoving(box, false)
    return box.getBoundingRect()
  }

  // Each start position is 4 px off one label line and far from all others.
  it.each([
    { line: 'left edge', from: [147, 300], to: [151, 300] },
    { line: 'right edge', from: [415, 300], to: [411, 300] },
    { line: 'top edge', from: [200, 147], to: [200, 151] },
    { line: 'bottom edge', from: [200, 549], to: [200, 545] },
    { line: 'vertical centre line', from: [284, 300], to: [281, 300] },
    { line: 'horizontal centre line', from: [200, 351], to: [200, 348] },
  ])('snaps the box exactly onto the label $line within the threshold', ({ from, to }) => {
    const box = drag(from[0], from[1])
    expect(box.left).toBeCloseTo(to[0], 6)
    expect(box.top).toBeCloseTo(to[1], 6)
  })

  // Each start position is 6 px off one label line.
  it.each([
    { line: 'left edge', from: [145, 300] },
    { line: 'right edge', from: [417, 300] },
    { line: 'top edge', from: [200, 145] },
    { line: 'bottom edge', from: [200, 551] },
    { line: 'vertical centre line', from: [287, 300] },
    { line: 'horizontal centre line', from: [200, 354] },
  ])('leaves the box alone outside the threshold of the label $line', ({ from }) => {
    const box = drag(from[0], from[1])
    expect(box.left).toBeCloseTo(from[0], 6)
    expect(box.top).toBeCloseTo(from[1], 6)
  })
})
