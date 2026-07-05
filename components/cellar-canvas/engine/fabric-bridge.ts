// fallow-ignore-file unused-class-member
// Every public method on FabricBridge is invoked through a `bridge.current?.x()`
// React ref (CellarCanvas, toolbars, panels, hotkeys). fallow's static analysis
// cannot trace calls across the ref boundary and reports them all as unused —
// verified false: each flagged member has at least one external caller.
import * as fabric from 'fabric'
import { useDesignerStore } from '../store/designer-store'
import type { CellarCanvasState, FabricObjectMeta, FabricObjectProperties } from '../store/types'
import { mmToPx } from './units'
import { generateQRCodeDataURL } from './qr-generator'
import { SnapManager } from './snap-manager'
import {
  createRect,
  createCircle,
  createLine,
  createText,
  createEmoji,
  configureImage,
  configureQRImage,
} from './object-factory'
import {
  geometryKind,
  readGeometryMm,
  xToLeft,
  yToTop,
  widthToFabricProps,
  heightToFabricProps,
} from './object-properties'
import { HistoryManager } from './history-manager'

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
  private readonly history = new HistoryManager()
  private snapManager: SnapManager
  /** Pointer position of the ongoing pan drag; null while not panning. */
  private panLast: { x: number; y: number } | null = null
  private unsubscribePanMode: () => void

  constructor(canvas: fabric.Canvas, opts: FabricBridgeOptions) {
    this.canvas = canvas
    this.widthMm = opts.widthMm
    this.heightMm = opts.heightMm
    this.bleedMm = opts.bleedMm
    this.snapManager = new SnapManager(canvas, opts.widthMm, opts.heightMm, opts.bleedMm)

    // Pan mode: while the Hand tool is active, pointer drags translate the
    // viewport instead of touching objects. `skipTargetFind` switches off
    // hit-testing entirely, so selection, text click-to-edit and snapping
    // stay untouched for the duration.
    this.unsubscribePanMode = useDesignerStore.subscribe(
      (s) => s.activeTool,
      (tool) => this.setPanMode(tool === 'pan'),
    )

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
      if (point && useDesignerStore.getState().activeTool === 'pan') {
        this.panLast = point
        canvas.setCursor('grabbing')
      }
    })
    canvas.on('mouse:move', (opt) => {
      if (!this.panLast) return
      const e = opt.e as MouseEvent | TouchEvent | undefined
      const point =
        e && 'clientX' in e
          ? { x: e.clientX, y: e.clientY }
          : e && 'touches' in e && e.touches[0]
            ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
            : null
      if (!point) return
      canvas.relativePan(new fabric.Point(point.x - this.panLast.x, point.y - this.panLast.y))
      this.panLast = point
      canvas.setCursor('grabbing')
      // Viewport-only sync — the React backdrop tracks the pan live without
      // recomputing layers/validation per frame.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(canvas as any).fire('cellar:viewport-changed')
    })
    canvas.on('mouse:up', (opt) => {
      this.panLast = null
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
   * Captures the current scene and pushes it onto the history stack. Snapshot
   * shape matches `serializeState` (`{ canvas, bg }`) so the label-paper colour
   * participates in Undo/Redo. Skipped while a restore is applying.
   */
  saveHistory() {
    if (this.history.isRestoring) return
    this.history.push(JSON.stringify(this.serializeState()))
    const store = useDesignerStore.getState()
    store.setDirty(true)
    store.setHistoryFlags(this.history.canUndo, this.history.canRedo)
  }

  private syncHistoryFlags() {
    useDesignerStore.getState().setHistoryFlags(this.history.canUndo, this.history.canRedo)
  }

  /**
   * Loads a serialized scene back onto the canvas. The label backdrop is
   * rendered by React (not a Fabric object) so it needs no re-pinning; the
   * restored bg-colour reaches React via the property-changed channel. Older
   * snapshots without a `bg` field leave the current colour untouched.
   */
  private async loadScene(canvasState: object, bg: string | undefined): Promise<void> {
    await this.canvas.loadFromJSON(canvasState)
    if (typeof bg === 'string') this.labelColor = bg
    this.canvas.requestRenderAll()
    this.updateStoreSelection()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(this.canvas as any).fire('cellar:property-changed', { target: null })
  }

  private applySnapshot(snapshot: string): Promise<void> {
    const parsed = JSON.parse(snapshot) as Partial<CellarCanvasState>
    return this.loadScene((parsed.canvas ?? parsed) as object, parsed.bg)
  }

  undo() {
    const snapshot = this.history.undo()
    if (snapshot === null) return
    this.syncHistoryFlags()
    void this.history.runExclusive(() => this.applySnapshot(snapshot))
  }

  redo() {
    const snapshot = this.history.redo()
    if (snapshot === null) return
    this.syncHistoryFlags()
    void this.history.runExclusive(() => this.applySnapshot(snapshot))
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
   * backward compatibility with older snapshots. Runs through the history lock
   * so it can't interleave with an in-flight undo/redo.
   */
  async restoreState(state: CellarCanvasState | object): Promise<void> {
    const wrapped = (state as CellarCanvasState).canvas !== undefined
      ? (state as CellarCanvasState)
      : { canvas: state as object, bg: this.labelColor }
    await this.history.runExclusive(() => this.loadScene(wrapped.canvas, wrapped.bg))
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
   * Shared insertion tail for every factory: add to the canvas, select, render
   * and snapshot history. Returns the placed object for callers needing its id.
   */
  private place<T extends fabric.Object>(obj: T): T {
    this.canvas.add(obj)
    this.canvas.setActiveObject(obj)
    this.canvas.renderAll()
    this.saveHistory()
    return obj
  }

  addRect() {
    this.place(createRect(this.bleedPx))
  }

  addCircle() {
    this.place(createCircle(this.bleedPx))
  }

  addLine() {
    this.place(createLine(this.bleedPx))
  }

  addText(text = 'New Text', fieldKey?: string) {
    this.place(createText(this.bleedPx, text, fieldKey))
  }

  addEmoji(emoji: string) {
    this.place(createEmoji(this.bleedPx, emoji))
  }

  /** Loads an image from a src (data URL — see `imageSourceFromBlob`) and places it. */
  async addImage(src: string) {
    const img = await fabric.FabricImage.fromURL(src)
    this.place(configureImage(img, this.bleedPx))
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
    this.place(configureQRImage(img, this.bleedPx))
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

    // Geometry in mm — reported relative to the label top-left so users see the
    // same coordinate the printer will use.
    const geo = readGeometryMm(
      {
        left: obj.left || 0,
        top: obj.top || 0,
        width: obj.width!,
        height: obj.height!,
        scaleX: obj.scaleX || 1,
        scaleY: obj.scaleY || 1,
      },
      this.bleedPx,
    )

    return {
      type: obj._type,
      fill: obj.fill as string,
      stroke: obj.stroke as string,
      strokeWidth: obj.strokeWidth,
      opacity: obj.opacity,
      x: geo.x,
      y: geo.y,
      width: geo.width,
      height: geo.height,
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

    if (x !== undefined) fabricProps.left = xToLeft(x, this.bleedPx)
    if (y !== undefined) fabricProps.top  = yToTop(y, this.bleedPx)

    // Width / height are object-type specific (circle → radius, line → x2,
    // textbox → wrap box, everything else → scale). The per-kind math lives in
    // object-properties.ts so each type is unit-tested in isolation.
    const kind = geometryKind(obj)
    if (width !== undefined) {
      Object.assign(
        fabricProps,
        widthToFabricProps(width, kind, {
          scaleX: obj.scaleX || 1,
          x1: kind === 'line' ? (obj.get('x1') as number) : undefined,
          intrinsicWidth: obj.width,
        }),
      )
    }
    if (height !== undefined) {
      Object.assign(fabricProps, heightToFabricProps(height, kind, obj.height))
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
   * Enters/leaves pan mode. Hit-testing and the selection lasso are disabled
   * while active so drags translate the viewport only; leaving restores the
   * normal select behaviour.
   */
  private setPanMode(active: boolean) {
    const c = this.canvas
    if (active) {
      c.discardActiveObject()
      this.updateStoreSelection()
      c.selection = false
      c.skipTargetFind = true
      c.defaultCursor = 'grab'
    } else {
      this.panLast = null
      c.selection = true
      c.skipTargetFind = false
      c.defaultCursor = 'default'
    }
    c.requestRenderAll()
  }

  /**
   * Multiplies the current zoom by `factor`, anchored to the canvas centre.
   * Same clamp range as the wheel handler so buttons/hotkeys and wheel zoom
   * can never diverge.
   */
  zoomBy(factor: number) {
    const current = this.canvas.getZoom()
    const next = Math.max(0.05, Math.min(20, current * factor))
    if (next === current) return
    const center = new fabric.Point(this.canvas.getWidth() / 2, this.canvas.getHeight() / 2)
    this.canvas.zoomToPoint(center, next)
    this.canvas.requestRenderAll()
    useDesignerStore.getState().setZoom(next)
    // Notify React so the CSS-rendered label backdrop tracks Fabric's view.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(this.canvas as any).fire('cellar:property-changed', { target: null })
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
    this.unsubscribePanMode()
    this.canvas.dispose()
  }
}
