import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest'
import * as fabric from 'fabric'
import { FabricBridge } from './fabric-bridge'
import { useDesignerStore } from '../store/designer-store'
import { validateCompliance, type ValidatableObject } from '../wine-fields/validator'
import type { FabricObjectMeta } from '../store/types'

// jsdom ships no 2D canvas. Stub a permissive context (no-op methods,
// swallowed property sets, a non-zero measureText so Textbox wrapping
// terminates, `canvas` pointing back at its element for Fabric's text
// rendering) so a real fabric.Canvas — and with it the bridge — can be built.
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

function makeBridge(): FabricBridge {
  const canvas = new fabric.Canvas(document.createElement('canvas'), { width: 400, height: 400 })
  const bridge = new FabricBridge(canvas, { widthMm: 90, heightMm: 120, bleedMm: 40 })
  bridge.resetHistory()
  return bridge
}

/** Undo/Redo button state as the UI sees it. */
function buttons() {
  const { canUndo, canRedo } = useDesignerStore.getState()
  return { canUndo, canRedo }
}

// Private members, read for assertions only.
const stack = (b: FabricBridge) => b['history']
/** Resolves once every queued restore (undo/redo/restoreState) has finished. */
const settled = (b: FabricBridge) => stack(b).runExclusive(async () => {})

describe('FabricBridge history debounce', () => {
  let bridge: FabricBridge
  beforeEach(() => {
    vi.useFakeTimers()
    bridge = makeBridge()
  })
  afterEach(() => {
    bridge.dispose()
    vi.useRealTimers()
  })

  it('enables Undo at once but pushes the snapshot only after the debounce', () => {
    bridge.addRect()
    expect(buttons()).toEqual({ canUndo: true, canRedo: false })
    expect(stack(bridge).canUndo).toBe(false)

    vi.advanceTimersByTime(300)
    expect(stack(bridge).canUndo).toBe(true)
  })

  it('collapses a burst of changes into one undo step', () => {
    bridge.setBackground('#111111')
    bridge.setBackground('#222222')
    bridge.setBackground('#333333')
    vi.advanceTimersByTime(300)

    bridge.undo()
    expect(buttons()).toEqual({ canUndo: false, canRedo: true })
  })

  it('Undo right after a change still sees that change', () => {
    bridge.addRect()
    bridge.undo()
    expect(buttons()).toEqual({ canUndo: false, canRedo: true })
  })

  it('Redo right after a new change leaves no dead Redo button', async () => {
    bridge.addRect()
    vi.advanceTimersByTime(300)
    bridge.undo()
    await settled(bridge)
    expect(buttons().canRedo).toBe(true)

    bridge.addCircle()
    bridge.redo()
    expect(buttons()).toEqual({ canUndo: true, canRedo: false })
  })

  it('resetHistory drops a pending snapshot instead of stacking a duplicate', () => {
    bridge.addRect()
    bridge.resetHistory()
    vi.advanceTimersByTime(300)
    expect(buttons()).toEqual({ canUndo: false, canRedo: false })
  })

  it('a new pointer interaction commits the pending snapshot first', () => {
    bridge.setBackground('#123456')
    bridge.canvas.fire('mouse:down:before', { e: new MouseEvent('mousedown') } as never)
    expect(stack(bridge).canUndo).toBe(true)
  })

  it('undo marks the draft as unsaved', async () => {
    bridge.addRect()
    vi.advanceTimersByTime(300)
    useDesignerStore.getState().setDirty(false)

    bridge.undo()
    expect(useDesignerStore.getState().isDirty).toBe(true)
    await settled(bridge)
  })
})

describe('FabricBridge wine-field sync', () => {
  let bridge: FabricBridge
  beforeEach(() => {
    bridge = makeBridge()
  })
  afterEach(() => {
    bridge.dispose()
  })

  const field = () => bridge.canvas.getObjects()[0] as fabric.Textbox & FabricObjectMeta
  const alcoholMissing = () =>
    validateCompliance(bridge.canvas.getObjects() as unknown as ValidatableObject[])
      .some((w) => w.key === 'alcoholPercent')

  it('hides a field whose value goes missing and brings it back with the new value', () => {
    bridge.setWineFields({ alcoholPercent: '13,5 % vol' })
    bridge.addText('13,5 % vol', 'alcoholPercent')
    expect(alcoholMissing()).toBe(false)

    bridge.setWineFields({})
    expect(field().visible).toBe(false)
    expect(field().text).toBe('')
    expect(field()._valueMissing).toBe(true)
    expect(alcoholMissing()).toBe(true)

    bridge.setWineFields({ alcoholPercent: '12 % vol' })
    expect(field().visible).toBe(true)
    expect(field().text).toBe('12 % vol')
    expect(alcoholMissing()).toBe(false)
  })

  it('treats null and blank values as missing', () => {
    bridge.setWineFields({ alcoholPercent: '13 %' })
    bridge.addText('13 %', 'alcoholPercent')

    bridge.setWineFields({ alcoholPercent: null as unknown as string })
    expect(field().visible).toBe(false)

    bridge.setWineFields({ alcoholPercent: '13 %' })
    bridge.setWineFields({ alcoholPercent: '   ' })
    expect(field().visible).toBe(false)
  })

  it('keeps a field hidden that the user hid, while still updating its text', () => {
    bridge.setWineFields({ vintage: 2022 })
    bridge.addText('2022', 'vintage')
    field().set('visible', false)

    bridge.setWineFields({ vintage: 2023 })
    expect(field().visible).toBe(false)
    expect(field().text).toBe('2023')
  })

  it('re-applies the current wine after a restore brings back older text', async () => {
    bridge.setWineFields({ name: 'Zweigelt 2021' })
    bridge.addText('Zweigelt 2021', 'name')
    const saved = bridge.serializeState()

    bridge.setWineFields({ name: 'Zweigelt 2023' })
    await bridge.restoreState(saved)
    expect(field().text).toBe('Zweigelt 2023')
  })
})

// Scene coordinates of the default label (90 × 120 mm, 40 mm bleed margin):
// x 151 … 491, y 151 … 605, centre 321 / 378.

describe('FabricBridge addImage placement', () => {
  // jsdom decodes no images, so `fromURL` is stubbed; the src is never read.
  const SRC = 'data:image/png;base64,'
  let bridge: FabricBridge
  beforeEach(() => {
    vi.useFakeTimers()
    bridge = makeBridge()
  })
  afterEach(() => {
    bridge.dispose()
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  /** The next `fromURL` calls resolve with images of these pixel sizes, in order. */
  function imagesLoadAs(...sizes: [number, number][]) {
    const fromURL = vi.spyOn(fabric.FabricImage, 'fromURL')
    for (const [width, height] of sizes) {
      fromURL.mockResolvedValueOnce(
        new fabric.FabricImage(Object.assign(document.createElement('canvas'), { width, height })),
      )
    }
  }

  it('puts artwork in the label format behind everything, exactly on the label, selected', async () => {
    imagesLoadAs([1063, 1417])
    bridge.addRect()
    bridge.addCircle()
    await bridge.addImage(SRC)

    const objects = bridge.canvas.getObjects()
    expect(objects).toHaveLength(3)
    const img = objects[0]
    expect(img).toBeInstanceOf(fabric.FabricImage)
    expect(img.left).toBeCloseTo(150.7, 1)
    expect(img.top).toBeCloseTo(151, 1)
    expect(img.scaleX).toBeCloseTo(0.3204, 4)
    expect(img.scaleY).toBeCloseTo(0.3204, 4)
    expect(bridge.canvas.getActiveObject()).toBe(img)
  })

  it('puts a landscape photo on top, centred inside the label, not enlarged', async () => {
    imagesLoadAs([2400, 1800])
    bridge.addRect()
    await bridge.addImage(SRC)

    const objects = bridge.canvas.getObjects()
    expect(objects).toHaveLength(2)
    const img = objects[1]
    expect(img).toBeInstanceOf(fabric.FabricImage)
    expect(img.left).toBeCloseTo(151, 1)
    expect(img.top).toBeCloseTo(250.5, 1)
    expect(img.scaleX).toBeCloseTo(0.1417, 4)
    expect(img.scaleY).toBeCloseTo(0.1417, 4)
    expect(img.scaleX).toBeLessThanOrEqual(1)
    expect(bridge.canvas.getActiveObject()).toBe(img)
  })

  it('places a second label-format image exactly where the first sits, without the insert offset', async () => {
    imagesLoadAs([1063, 1417], [1063, 1417])
    await bridge.addImage(SRC)
    await bridge.addImage(SRC)

    const objects = bridge.canvas.getObjects()
    expect(objects).toHaveLength(2)
    for (const img of objects) {
      expect(img.left).toBeCloseTo(150.7, 1)
      expect(img.top).toBeCloseTo(151, 1)
    }
  })

  it('adds nothing and shows an image notice when the image fails to load', async () => {
    vi.spyOn(fabric.FabricImage, 'fromURL').mockRejectedValue(new Error('decode failed'))
    useDesignerStore.getState().setNotice(null)
    bridge.addRect()
    await bridge.addImage(SRC)

    expect(bridge.canvas.getObjects()).toHaveLength(1)
    expect(useDesignerStore.getState().notice?.kind).toBe('image')
  })
})

describe('FabricBridge centerOnLabel', () => {
  let bridge: FabricBridge
  beforeEach(() => {
    vi.useFakeTimers()
    bridge = makeBridge()
  })
  afterEach(() => {
    bridge.dispose()
    vi.useRealTimers()
  })

  const centreOf = (o: fabric.Object) => {
    const box = o.getBoundingRect()
    return { x: box.left + box.width / 2, y: box.top + box.height / 2 }
  }

  it('centres the selection horizontally and keeps its vertical position', () => {
    bridge.addRect()
    const rect = bridge.canvas.getActiveObject()!
    const { y } = centreOf(rect)

    bridge.centerOnLabel('h')
    expect(centreOf(rect).x).toBeCloseTo(321, 6)
    expect(centreOf(rect).y).toBeCloseTo(y, 6)
  })

  it('centres a rotated object vertically by its bounding box', () => {
    bridge.addRect()
    const rect = bridge.canvas.getActiveObject()!
    rect.set('angle', 30)
    rect.setCoords()
    const { x } = centreOf(rect)

    bridge.centerOnLabel('v')
    expect(centreOf(rect).y).toBeCloseTo(378, 6)
    expect(centreOf(rect).x).toBeCloseTo(x, 6)
  })

  it('centres a multi-selection as a whole', () => {
    bridge.addRect()
    bridge.addCircle()
    const [rect, circle] = bridge.canvas.getObjects()
    circle.set({ left: 400, top: 520 })
    circle.setCoords()
    bridge.selectAll()

    bridge.centerOnLabel('h')
    bridge.centerOnLabel('v')
    bridge.canvas.discardActiveObject()

    const boxes = [rect, circle].map(o => o.getBoundingRect())
    const left = Math.min(...boxes.map(b => b.left))
    const right = Math.max(...boxes.map(b => b.left + b.width))
    const top = Math.min(...boxes.map(b => b.top))
    const bottom = Math.max(...boxes.map(b => b.top + b.height))
    expect((left + right) / 2).toBeCloseTo(321, 6)
    expect((top + bottom) / 2).toBeCloseTo(378, 6)
  })
})
