// fallow-ignore-file unused-class-member
// Every public method on FabricBridge is invoked through a `bridge.current?.x()`
// React ref (CellarCanvas, toolbars, panels, hotkeys). fallow's static analysis
// cannot trace calls across the ref boundary and reports them all as unused —
// verified false: each flagged member has at least one external caller.
import * as fabric from 'fabric'
import { useDesignerStore } from '../store/designer-store'
import type { CellarCanvasState, FabricObjectMeta, FabricObjectProperties } from '../store/types'
import { pxToMm, mmToPx } from './units'
import { generateQRCodeDataURL } from './qr-generator'
import { SnapManager } from './snap-manager'

export interface FabricBridgeOptions {
  widthMm: number
  heightMm: number
  bleedMm: number
}

/**
 * The FabricBridge provides a set of imperative helpers to interact
 * with the Fabric.js canvas instance while keeping the Zustand store in sync.
 *
 * The HTML canvas is intentionally larger than the printed label so overflow
 * (text wider than the label, images bleeding past the edge) stays visible.
 * The visible "label card" is rendered by the React layer as a positioned
 * `<div>` outside the Fabric object stack — that way stack mutations
 * (bring-to-front, send-to-back, drag-reorder in the layer panel) only
 * touch user objects and never have to dance around a backdrop rect.
 * User-facing x/y is still reported relative to the label top-left corner
 * so it matches what a printer sees on the finished label.
 */
export class FabricBridge {
  canvas: fabric.Canvas
  widthMm: number
  heightMm: number
  bleedMm: number
  private labelColor = '#ffffff'
  private isRestoringHistory = false
  private snapManager: SnapManager

  constructor(canvas: fabric.Canvas, opts: FabricBridgeOptions) {
    this.canvas = canvas
    this.widthMm = opts.widthMm
    this.heightMm = opts.heightMm
    this.bleedMm = opts.bleedMm
    this.snapManager = new SnapManager(canvas, opts.widthMm, opts.heightMm, opts.bleedMm)

    // Click-without-drag on a text → enter edit mode + select-all. We measure
    // pointer travel between mouse:down and mouse:up so that a real drag
    // (move) is never hijacked. Fabric assigns the active object during
    // mouse:down, so hooking mouse:down directly would fire on the very first
    // click and break dragging entirely.
    let downAt: { x: number; y: number } | null = null
    canvas.on('mouse:down', (opt) => {
      const e = opt.e as MouseEvent | TouchEvent | undefined
      const point =
        e && 'clientX' in e
          ? { x: e.clientX, y: e.clientY }
          : e && 'touches' in e && e.touches[0]
            ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
            : null
      downAt = point
    })
    canvas.on('mouse:up', (opt) => {
      this.snapManager.clearGuides()
      const target = opt.target
      const e = opt.e as MouseEvent | TouchEvent | undefined
      const up =
        e && 'clientX' in e
          ? { x: e.clientX, y: e.clientY }
          : e && 'changedTouches' in e && e.changedTouches[0]
            ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
            : null
      if (
        target instanceof fabric.IText &&
        !target.isEditing &&
        downAt && up &&
        Math.hypot(up.x - downAt.x, up.y - downAt.y) < 4
      ) {
        // Defer one tick: calling enterEditing() synchronously inside Fabric's
        // own mouse:up pipeline lets the hidden textarea get created, but
        // Fabric's follow-up steps reclaim focus and the textarea ends up
        // unfocused — caret visible, typing dropped. A queueMicrotask hop
        // runs after Fabric is done and the hiddenTextarea.focus() sticks.
        const t = target
        queueMicrotask(() => {
          if (!t.isEditing) {
            t.enterEditing()
            t.selectAll()
            // Fabric appends `hiddenTextarea` to <body> by default. In
            // fullscreen mode the browser refuses focus on anything outside
            // the fullscreen subtree, so typing silently drops. Re-parenting
            // it under `canvas.wrapperEl` (which is inside the fullscreen
            // container) restores keyboard input. Harmless outside fullscreen.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const hidden = (t as any).hiddenTextarea as HTMLTextAreaElement | undefined
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const wrapper = (this.canvas as any).wrapperEl as HTMLElement | undefined
            if (hidden && wrapper && hidden.parentElement !== wrapper) {
              wrapper.appendChild(hidden)
            }
            hidden?.focus()
          }
        })
      }
      downAt = null
    })

    // Cursor-anchored zoom on wheel / pinch. Without preventDefault the
    // browser would scroll the page or pinch-zoom the whole document; we want
    // wheel-over-canvas to mean "zoom the canvas". `zoomToPoint` keeps the
    // pixel under the cursor stationary while the rest scales around it.
    canvas.on('mouse:wheel', (opt) => {
      const e = opt.e as WheelEvent
      const current = canvas.getZoom()
      // 0.999^delta gives a smooth multiplicative response; delta is roughly
      // -100..100 per wheel tick, ±10 per pinch frame.
      let next = current * 0.999 ** e.deltaY
      next = Math.max(0.05, Math.min(20, next))
      canvas.zoomToPoint(new fabric.Point(e.offsetX, e.offsetY), next)
      e.preventDefault()
      e.stopPropagation()
      useDesignerStore.getState().setZoom(next)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(canvas as any).fire('cellar:property-changed', { target: null })
    })

    canvas.on('object:moving', (opt) => {
      const { snappingEnabled } = useDesignerStore.getState()
      if (!snappingEnabled) return
      
      const e = opt.e as MouseEvent | TouchEvent | undefined
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isAltPressed = e && (e as any).altKey
      
      if (opt.target) {
        this.snapManager.handleMoving(opt.target, isAltPressed)
      }
    })

    canvas.on('selection:cleared', () => {
      this.snapManager.clearGuides()
    })

    // Initial history snapshot
    setTimeout(() => this.saveHistory(), 100)
  }

  get bleedPx(): number {
    return mmToPx(this.bleedMm)
  }

  /**
   * Captures the current state and pushes it to the store's history stack.
   * Snapshot is the same shape as `serializeState` (`{ canvas, bg }`) so the
   * label-paper colour participates in Undo/Redo. Old plain-canvas snapshots
   * from before this change are still accepted by `restoreHistory`.
   */
  saveHistory() {
    if (this.isRestoringHistory) return
    useDesignerStore.getState().pushHistory(JSON.stringify(this.serializeState()))
  }

  /**
   * Restores the state from the history stack based on the current index.
   * Label backdrop is rendered by React, so it doesn't need to be re-pinned.
   * Bg-colour is included in the snapshot since the introduction of full-
   * state history; older snapshots without a `bg` field leave the current
   * colour untouched.
   */
  async restoreHistory() {
    const { history, historyIndex } = useDesignerStore.getState()
    const state = history[historyIndex]
    if (!state) return

    const parsed = JSON.parse(state) as Partial<CellarCanvasState>
    const canvasState = parsed.canvas ?? parsed
    const nextBg      = parsed.bg

    this.isRestoringHistory = true
    await this.canvas.loadFromJSON(canvasState)
    if (typeof nextBg === 'string') this.labelColor = nextBg
    this.canvas.requestRenderAll()
    this.updateStoreSelection()
    this.isRestoringHistory = false
    // Bg-Color lives outside the Fabric object stack; React mirrors it from
    // `getBackground()` via the property-changed channel, so the backdrop
    // re-renders with the restored colour even though no Fabric event fired.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(this.canvas as any).fire('cellar:property-changed', { target: null })
  }

  undo() {
    useDesignerStore.getState().undo()
    this.restoreHistory()
  }

  redo() {
    useDesignerStore.getState().redo()
    this.restoreHistory()
  }

  /**
   * Full editor state for persistence. Wraps the Fabric scene plus anything
   * that lives outside the object stack (the label-paper colour).
   */
  serializeState(): CellarCanvasState {
    const canvas = this.canvas.toObject([
      'id', '_layerName', '_type', '_fieldKey',
      'lockMovementX', 'lockMovementY', 'lockScalingX', 'lockScalingY', 'lockRotation',
      'hasControls',
    ])
    return { canvas, bg: this.labelColor }
  }

  /**
   * Restore a previously serialized state. Accepts the wrapped `{ canvas, bg }`
   * shape; a plain Fabric JSON is treated as canvas-only (bg untouched) for
   * backward compatibility with older snapshots.
   */
  async restoreState(state: CellarCanvasState | object): Promise<void> {
    const wrapped = (state as CellarCanvasState).canvas !== undefined
      ? (state as CellarCanvasState)
      : { canvas: state as object, bg: this.labelColor }
    this.isRestoringHistory = true
    await this.canvas.loadFromJSON(wrapped.canvas)
    this.labelColor = wrapped.bg
    this.canvas.requestRenderAll()
    this.updateStoreSelection()
    this.isRestoringHistory = false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(this.canvas as any).fire('cellar:property-changed', { target: null })
  }

  /**
   * Syncs the store's selection state whenever Fabric's selection changes.
   */
  updateStoreSelection() {
    const activeObjects = this.canvas.getActiveObjects()
    const ids = activeObjects.map(obj => (obj as fabric.Object & FabricObjectMeta).id).filter(Boolean)
    useDesignerStore.getState().setSelectedIds(ids)
  }

  /**
   * Adds a basic rectangle to the center of the canvas.
   */
  addRect() {
    const rect = new fabric.Rect({
      // Fabric v7 changed the origin default to 'center'/'center'. Our mm/px
      // mapping treats left/top as the bounding-box corner, so pin v6 semantics.
      originX: 'left',
      originY: 'top',
      left: this.bleedPx + 100,
      top: this.bleedPx + 100,
      fill: '#722f37',
      width: mmToPx(20),
      height: mmToPx(20),
      cornerColor: '#ffffff',
      cornerStrokeColor: '#000000',
      transparentCorners: false,
      cornerSize: 8,
    })

    // Add metadata for Cellar Canvas
    const meta: FabricObjectMeta = {
      id: crypto.randomUUID(),
      _layerName: 'Rectangle',
      _type: 'rect'
    }
    Object.assign(rect, meta)

    this.canvas.add(rect)
    this.canvas.setActiveObject(rect)
    this.canvas.renderAll()
    this.saveHistory()
  }

  /**
   * Adds a basic circle to the center of the canvas.
   */
  addCircle() {
    const circle = new fabric.Circle({
      originX: 'left',
      originY: 'top',
      left: this.bleedPx + 100,
      top: this.bleedPx + 100,
      fill: '#722f37',
      radius: mmToPx(10),
      cornerColor: '#ffffff',
      cornerStrokeColor: '#000000',
      transparentCorners: false,
      cornerSize: 8,
    })

    const meta: FabricObjectMeta = {
      id: crypto.randomUUID(),
      _layerName: 'Circle',
      _type: 'circle',
    }
    Object.assign(circle, meta)

    this.canvas.add(circle)
    this.canvas.setActiveObject(circle)
    this.canvas.renderAll()
    this.saveHistory()
  }

  /**
   * Adds a basic line to the canvas.
   */
  addLine() {
    const x = this.bleedPx + 100
    const y = this.bleedPx + 100
    const length = mmToPx(30)
    const line = new fabric.Line([x, y, x + length, y], {
      originX: 'left',
      originY: 'top',
      stroke: '#722f37',
      strokeWidth: 2,
      cornerColor: '#ffffff',
      cornerStrokeColor: '#000000',
      transparentCorners: false,
      cornerSize: 8,
    })

    const meta: FabricObjectMeta = {
      id: crypto.randomUUID(),
      _layerName: 'Line',
      _type: 'line',
    }
    Object.assign(line, meta)

    this.canvas.add(line)
    this.canvas.setActiveObject(line)
    this.canvas.renderAll()
    this.saveHistory()
  }

  /**
   * Adds a text object. Uses `Textbox` (not `IText`) so word-wrap is on by
   * default at a fixed mm-width — wine labels routinely need multi-line
   * blocks like producer/region. Manual `\n` via Enter still works.
   */
  addText(text = 'New Text', fieldKey?: string) {
    const textbox = new fabric.Textbox(text, {
      originX: 'left',
      originY: 'top',
      left: this.bleedPx + 100,
      top: this.bleedPx + 100,
      width: mmToPx(50),
      fontSize: 24,
      fontFamily: 'sans-serif',
      fill: '#000000',
    })

    const meta: FabricObjectMeta = {
      id: crypto.randomUUID(),
      _layerName: text,
      _type: fieldKey ? 'wine-field' : 'text',
      _fieldKey: fieldKey
    }
    Object.assign(textbox, meta)

    this.canvas.add(textbox)
    this.canvas.setActiveObject(textbox)
    this.canvas.renderAll()
    this.saveHistory()
  }

  /**
   * Adds an emoji as a Fabric text object. Emojis are rendered by the
   * browser's emoji font so the result stays vector-clean at any zoom and
   * stores as a single Unicode codepoint instead of a binary blob. The
   * default font size is roughly double the regular text default — a
   * sensible label-sized emoji.
   */
  addEmoji(emoji: string) {
    const textbox = new fabric.Textbox(emoji, {
      originX: 'left',
      originY: 'top',
      left: this.bleedPx + 100,
      top: this.bleedPx + 100,
      width: mmToPx(20),
      fontSize: 48,
      fontFamily: 'sans-serif',
      fill: '#000000',
    })

    const meta: FabricObjectMeta = {
      id: crypto.randomUUID(),
      _layerName: `Emoji ${emoji}`,
      _type: 'text',
      _extras: true,
    }
    Object.assign(textbox, meta)

    this.canvas.add(textbox)
    this.canvas.setActiveObject(textbox)
    this.canvas.renderAll()
    this.saveHistory()
  }

  /**
   * Adds a user-supplied image to the canvas. Scales it to fit within
   * a 40mm bounding box so it never blows past the label dimensions.
   */
  async addImage(src: string) {
    const img = await fabric.FabricImage.fromURL(src)
    const maxPx = mmToPx(40)
    const scale = Math.min(maxPx / (img.width ?? maxPx), maxPx / (img.height ?? maxPx), 1)
    img.set({
      originX: 'left',
      originY: 'top',
      left: this.bleedPx + mmToPx(10),
      top: this.bleedPx + mmToPx(10),
      scaleX: scale,
      scaleY: scale,
      cornerColor: '#ffffff',
      cornerStrokeColor: '#000000',
      transparentCorners: false,
      cornerSize: 8,
    })

    const meta: FabricObjectMeta = {
      id: crypto.randomUUID(),
      _layerName: 'Image',
      _type: 'image',
    }
    Object.assign(img, meta)

    this.canvas.add(img)
    this.canvas.setActiveObject(img)
    this.canvas.renderAll()
    this.saveHistory()
  }

  /**
   * Updates an existing image object with a new source while preserving
   * its geometry and metadata.
   */
  async updateImageSource(id: string, src: string) {
    const obj = this.canvas
      .getObjects()
      .find((o) => (o as fabric.Object & FabricObjectMeta).id === id) as
        | (fabric.FabricImage & FabricObjectMeta)
        | undefined
    if (!obj || obj._type !== 'image') return

    await obj.setSrc(src)
    this.canvas.requestRenderAll()
    this.saveHistory()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(this.canvas as any).fire('cellar:property-changed', { target: obj })
  }

  /**
   * Returns the original source URL/DataURL of the currently selected image.
   */
  getSelectedImageSrc(): string | null {
    const obj = this.canvas.getActiveObject() as
      | (fabric.FabricImage & FabricObjectMeta)
      | undefined
    if (!obj || obj._type !== 'image') return null
    return obj.getSrc()
  }

  async addQRCode(url: string) {
    const dataUrl = await generateQRCodeDataURL(url)
    if (!dataUrl) return

    const img = await fabric.FabricImage.fromURL(dataUrl)
    img.set({
      originX: 'left',
      originY: 'top',
      left: this.bleedPx + 100,
      top: this.bleedPx + 100,
      scaleX: 0.2,
      scaleY: 0.2,
    })

    const meta: FabricObjectMeta = {
      id: crypto.randomUUID(),
      _layerName: 'QR Code',
      _type: 'qr-code',
      _fieldKey: 'qrCode',
    }
    Object.assign(img, meta)

    this.canvas.add(img)
    this.canvas.setActiveObject(img)
    this.canvas.requestRenderAll()
    this.saveHistory()
  }

  /**
   * Deletes selected objects.
   */
  deleteSelected() {
    const activeObjects = this.canvas.getActiveObjects()
    if (!activeObjects.length) return

    this.canvas.discardActiveObject()
    activeObjects.forEach(obj => this.canvas.remove(obj))
    this.canvas.renderAll()
    this.updateStoreSelection()
    this.saveHistory()
  }

  /**
   * Returns properties of the currently active object for the UI.
   */
  getActiveObjectProperties(): FabricObjectProperties | null {
    const obj = this.canvas.getActiveObject() as (fabric.Object & FabricObjectMeta) | null
    if (!obj) return null

    return {
      type: obj._type,
      fill: obj.fill as string,
      stroke: obj.stroke as string,
      strokeWidth: obj.strokeWidth,
      opacity: obj.opacity,
      // Geometry in mm — reported relative to the label top-left so users
      // see the same coordinate the printer will use.
      x: pxToMm((obj.left || 0) - this.bleedPx),
      y: pxToMm((obj.top || 0) - this.bleedPx),
      width: pxToMm(obj.width! * (obj.scaleX || 1)),
      height: pxToMm(obj.height! * (obj.scaleY || 1)),
      rotation: obj.angle,
      // Text specific
      ...(obj instanceof fabric.IText ? {
        text: obj.text,
        fontSize: obj.fontSize,
        fontFamily: obj.fontFamily,
        fontWeight: obj.fontWeight,
        fontStyle: obj.fontStyle,
        // Fabric stores textAlign as string; narrow to our literal union.
        textAlign: obj.textAlign as 'left' | 'center' | 'right' | 'justify',
        underline: obj.underline,
        charSpacing: obj.charSpacing,
        lineHeight: obj.lineHeight,
      } : {})
    }
  }

  /**
   * Updates properties on the active object.
   */
  updateActiveObject(props: Partial<FabricObjectProperties & fabric.FabricObjectProps>) {
    const obj = this.canvas.getActiveObject() as (fabric.Object & FabricObjectMeta) | null
    if (!obj) return

    // Wine-field text is bound to wineField data — don't let the UI override it.
    const cleanProps = { ...props }
    if (obj._type === 'wine-field' && cleanProps.text !== undefined) {
      delete cleanProps.text
    }

    // Build the Fabric prop bag from scratch. Don't spread `cleanProps` blindly:
    // it carries our mm-keyed virtual props (x, y, width, height) that Fabric
    // does not understand and would silently mis-set (e.g. obj.width = 20mm
    // when Fabric expects pixels). Map them through, then merge whatever's
    // left as native Fabric properties (fill, stroke, opacity, angle, fontSize, …).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { x, y, width, height, ...rest } = cleanProps as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fabricProps: Record<string, any> = { ...rest }

    if (x !== undefined) fabricProps.left = mmToPx(x) + this.bleedPx
    if (y !== undefined) fabricProps.top  = mmToPx(y) + this.bleedPx

    // Width / height are object-type specific. For shapes with intrinsic size
    // (Rect / Image / IText) we adjust their scale so the rendered bounding
    // box matches the requested mm value. For Circle we map width → 2*radius
    // (uniform scale, ignoring height). For Line we set x2 directly.
    if (width !== undefined) {
      const targetPx = mmToPx(width)
      if (obj instanceof fabric.Circle) {
        const radiusPx = targetPx / 2
        fabricProps.radius = radiusPx / (obj.scaleX || 1)
      } else if (obj instanceof fabric.Line) {
        // Line stores its geometry in x1/x2/y1/y2 — width is x2-x1 (pre-scale).
        const x1 = obj.get('x1') as number
        fabricProps.x2 = x1 + targetPx / (obj.scaleX || 1)
      } else if (obj instanceof fabric.Textbox) {
        // Textbox.width controls the wrap box. Setting scaleX would re-stretch
        // glyphs instead of re-flowing the text — adjust width directly.
        fabricProps.width = targetPx / (obj.scaleX || 1)
      } else if (obj.width && obj.width > 0) {
        fabricProps.scaleX = targetPx / obj.width
      }
    }
    if (
      height !== undefined &&
      !(obj instanceof fabric.Circle) &&
      !(obj instanceof fabric.Line) &&
      !(obj instanceof fabric.Textbox)
    ) {
      // Textbox height is derived from wrapped lines — ignore explicit height.
      if (obj.height && obj.height > 0) {
        fabricProps.scaleY = mmToPx(height) / obj.height
      }
    }

    obj.set(fabricProps)
    obj.setCoords()

    this.canvas.renderAll()
    useDesignerStore.getState().setDirty(true)
    // obj.set() fires no Fabric events. Notify React listeners so number-input
    // steppers see fresh values on the next click (otherwise they keep nudging
    // from a stale prop and silently stall after the first step).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(this.canvas as any).fire('cellar:property-changed', { target: obj })
    
    // Programmatic updates (Properties Panel) deserve a history entry.
    this.saveHistory()
  }

  bringToFront() {
    const obj = this.canvas.getActiveObject()
    if (obj) {
      this.canvas.bringObjectToFront(obj)
      this.canvas.requestRenderAll()
      this.saveHistory()
      this.notifyStackChanged(obj)
    }
  }

  bringForward() {
    const obj = this.canvas.getActiveObject()
    if (obj) {
      this.canvas.bringObjectForward(obj)
      this.canvas.requestRenderAll()
      this.saveHistory()
      this.notifyStackChanged(obj)
    }
  }

  sendBackward() {
    const obj = this.canvas.getActiveObject()
    if (obj) {
      this.canvas.sendObjectBackwards(obj)
      this.canvas.requestRenderAll()
      this.saveHistory()
      this.notifyStackChanged(obj)
    }
  }

  sendToBack() {
    const obj = this.canvas.getActiveObject()
    if (obj) {
      this.canvas.sendObjectToBack(obj)
      this.canvas.requestRenderAll()
      this.saveHistory()
      this.notifyStackChanged(obj)
    }
  }

  /**
   * Stack mutations don't fire any built-in Fabric event, so React listeners
   * never know to refresh `getLayers()`. We piggy-back on the same custom
   * event the property steppers use.
   */
  private notifyStackChanged(target: fabric.Object) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(this.canvas as any).fire('cellar:property-changed', { target })
  }

  /**
   * Aligns or distributes the currently selected objects relative to the
   * bounding box of the selection. Inside an ActiveSelection the children's
   * left/top are stored relative to the group's center — so we discard the
   * group first, mutate in absolute canvas coords, then rebuild the selection.
   * No-op below 2 selected objects (distribution needs at least 3).
   */
  alignSelected(action:
    | 'align-left' | 'align-center-h' | 'align-right'
    | 'align-top'  | 'align-center-v' | 'align-bottom'
    | 'distribute-h' | 'distribute-v'
  ) {
    const active = this.canvas.getActiveObject()
    if (!(active instanceof fabric.ActiveSelection)) return

    const objects = [...active.getObjects()]
    if (objects.length < 2) return
    this.canvas.discardActiveObject()

    type Box = { obj: fabric.Object; left: number; top: number; w: number; h: number; cx: number; cy: number }
    const boxes: Box[] = objects.map(obj => {
      const left = obj.left ?? 0
      const top = obj.top ?? 0
      const w = (obj.width ?? 0) * (obj.scaleX ?? 1)
      const h = (obj.height ?? 0) * (obj.scaleY ?? 1)
      return { obj, left, top, w, h, cx: left + w / 2, cy: top + h / 2 }
    })

    const bbLeft   = Math.min(...boxes.map(b => b.left))
    const bbTop    = Math.min(...boxes.map(b => b.top))
    const bbRight  = Math.max(...boxes.map(b => b.left + b.w))
    const bbBottom = Math.max(...boxes.map(b => b.top + b.h))
    const bbCenterX = (bbLeft + bbRight) / 2
    const bbCenterY = (bbTop + bbBottom) / 2

    boxes.forEach(b => {
      switch (action) {
        case 'align-left':     b.obj.set('left', bbLeft); break
        case 'align-center-h': b.obj.set('left', bbCenterX - b.w / 2); break
        case 'align-right':    b.obj.set('left', bbRight - b.w); break
        case 'align-top':      b.obj.set('top', bbTop); break
        case 'align-center-v': b.obj.set('top', bbCenterY - b.h / 2); break
        case 'align-bottom':   b.obj.set('top', bbBottom - b.h); break
      }
    })

    if (action === 'distribute-h' && boxes.length >= 3) {
      const sorted = [...boxes].sort((a, b) => a.cx - b.cx)
      const first = sorted[0].cx
      const last  = sorted[sorted.length - 1].cx
      const step  = (last - first) / (sorted.length - 1)
      sorted.forEach((b, i) => {
        if (i === 0 || i === sorted.length - 1) return
        b.obj.set('left', first + step * i - b.w / 2)
      })
    } else if (action === 'distribute-v' && boxes.length >= 3) {
      const sorted = [...boxes].sort((a, b) => a.cy - b.cy)
      const first = sorted[0].cy
      const last  = sorted[sorted.length - 1].cy
      const step  = (last - first) / (sorted.length - 1)
      sorted.forEach((b, i) => {
        if (i === 0 || i === sorted.length - 1) return
        b.obj.set('top', first + step * i - b.h / 2)
      })
    }

    objects.forEach(o => o.setCoords())

    // Restore the multi-selection so the user can keep manipulating.
    const restored = new fabric.ActiveSelection(objects, { canvas: this.canvas })
    this.canvas.setActiveObject(restored)
    this.canvas.requestRenderAll()
    this.saveHistory()
    this.notifyStackChanged(restored)
  }

  getBackground(): string {
    return this.labelColor
  }

  setBackground(color: string) {
    if (this.labelColor === color) return
    this.labelColor = color
    useDesignerStore.getState().setDirty(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(this.canvas as any).fire('cellar:property-changed', { target: null })
    // Bg-colour now participates in Undo/Redo (the snapshot includes it).
    // Without this call setBackground would mutate the live state but leave
    // the history untouched, so Undo couldn't reverse it.
    this.saveHistory()
  }

  /**
   * Fits the whole HTML-canvas content into the viewport with a small visual
   * padding. Because the canvas is larger than the label (bleed margin), this
   * keeps both the label and any overflowing objects visible at the same time.
   */
  zoomToFit() {
    const padding = 24
    const canvasWidth = this.canvas.getWidth()
    const canvasHeight = this.canvas.getHeight()

    const scale = Math.min(
      (canvasWidth - padding * 2) / canvasWidth,
      (canvasHeight - padding * 2) / canvasHeight,
      2.0,
    )

    this.canvas.setZoom(scale)
    const vpt = this.canvas.viewportTransform!
    vpt[4] = (canvasWidth - canvasWidth * scale) / 2
    vpt[5] = (canvasHeight - canvasHeight * scale) / 2

    this.canvas.requestRenderAll()
    useDesignerStore.getState().setZoom(scale)
    // Notify React so the CSS-rendered label backdrop tracks Fabric's view.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(this.canvas as any).fire('cellar:property-changed', { target: null })
  }

  /**
   * Returns all objects as a Layer array for the UI.
   * Fabric z-order is bottom-to-top, but Layer Panel is top-to-bottom.
   * We filter out internal helper objects (like snap guides) which don't carry
   * our custom `_type` metadata.
   */
  getLayers() {
    return this.canvas.getObjects()
      .filter(obj => (obj as unknown as FabricObjectMeta)._type !== undefined)
      .map((obj) => {
        const o = obj as fabric.Object & FabricObjectMeta & { text?: string }
        return {
          id: o.id,
          name: o._layerName || o.text || 'Unnamed Layer',
          type: o._type,
          fieldKey: o._fieldKey,
          visible: o.visible,
          locked: !!o.lockMovementX, // Basic lock check
        }
      }).reverse()
  }

  setLayerVisibility(id: string, visible: boolean) {
    const obj = this.canvas.getObjects().find((o) => (o as fabric.Object & FabricObjectMeta).id === id)
    if (obj) {
      obj.set('visible', visible)
      this.canvas.renderAll()
      this.saveHistory()
      this.notifyStackChanged(obj)
    }
  }

  setLayerLocked(id: string, locked: boolean) {
    const obj = this.canvas.getObjects().find((o) => (o as fabric.Object & FabricObjectMeta).id === id)
    if (obj) {
      obj.set({
        lockMovementX: locked,
        lockMovementY: locked,
        lockScalingX: locked,
        lockScalingY: locked,
        lockRotation: locked,
        hasControls: !locked,
      })
      this.canvas.renderAll()
      this.saveHistory()
      this.notifyStackChanged(obj)
    }
  }

  deleteLayer(id: string) {
    const obj = this.canvas.getObjects().find((o) => (o as fabric.Object & FabricObjectMeta).id === id)
    if (obj) {
      this.canvas.remove(obj)
      this.canvas.renderAll()
      this.updateStoreSelection()
      this.saveHistory()
      // No notifyStackChanged needed; canvas.remove fires object:removed
    }
  }

  renameLayer(id: string, name: string) {
    const obj = this.canvas.getObjects().find((o) => (o as fabric.Object & FabricObjectMeta).id === id)
    if (obj) {
      (obj as fabric.Object & FabricObjectMeta)._layerName = name
      this.canvas.renderAll()
      this.saveHistory()
      this.notifyStackChanged(obj)
    }
  }

  reorderLayers(ids: string[]) {
    // Panel: top-to-bottom (front first). Fabric stack: bottom-to-top.
    const reversedIds = [...ids].reverse()
    let lastObj: fabric.Object | null = null
    reversedIds.forEach((id, index) => {
      const obj = this.canvas.getObjects().find((o) => (o as fabric.Object & FabricObjectMeta).id === id)
      if (obj) {
        this.canvas.moveObjectTo(obj, index)
        lastObj = obj
      }
    })
    this.canvas.requestRenderAll()
    this.saveHistory()
    if (lastObj) this.notifyStackChanged(lastObj)
  }

  /**
   * Disposes the canvas.
   */
  dispose() {
    this.canvas.dispose()
  }
}
