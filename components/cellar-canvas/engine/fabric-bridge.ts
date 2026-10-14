// fallow-ignore-file unused-class-member
// Every public method on FabricBridge is invoked through a `bridge.current?.x()`
// React ref (CellarCanvas, toolbars, panels, hotkeys). fallow's static analysis
// cannot trace calls across the ref boundary and reports them all as unused —
// verified false: each flagged member has at least one external caller.
import * as fabric from 'fabric'
import { useDesignerStore } from '../store/designer-store'
import type { CellarCanvasState, FabricObjectMeta, FabricObjectProperties, LabelBackground } from '../store/types'
import { gradientLine, isLabelBackground, sameBackground } from './label-background'
import { mmToPx, pxToMm } from './units'
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
  createGroup,
} from './object-factory'
import type { ValidatableObject } from '../wine-fields/validator'
import {
  geometryKind,
  originOffset,
  readGeometryMm,
  xToLeft,
  yToTop,
  widthToFabricProps,
  heightToFabricProps,
} from './object-properties'
import { HistoryManager } from './history-manager'
import { hasFieldValue } from '../wine-fields/field-value'
import type { WineFieldValues } from '../CellarCanvas'

/** Canvas objects plus the members of every group, depth-first. */
function withGroupMembers(objects: fabric.Object[]): fabric.Object[] {
  return objects.flatMap(o => (o instanceof fabric.Group ? [o, ...withGroupMembers(o.getObjects())] : [o]))
}

export interface FabricBridgeOptions {
  widthMm: number
  heightMm: number
  bleedMm: number
}

/**
 * Object props every serialized scene keeps (autosave, history,
 * `initialState`): our metadata plus Fabric props that `toObject` drops by
 * default. Embedders building a state by hand (e.g. from template objects)
 * serialize with this same list, so nothing gets lost on restore.
 */
export const SERIALIZED_OBJECT_PROPS = [
  'id', '_layerName', '_type', '_fieldKey', '_extras', '_valueMissing',
  'lockMovementX', 'lockMovementY', 'lockScalingX', 'lockScalingY', 'lockRotation',
  'hasControls',
  // Wine-fields are non-editable; without this they turn editable again
  // after every undo/redo and reload.
  'editable',
]

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
  private labelBackground: LabelBackground = '#ffffff'
  /** Decoded image of an image background — the export renders synchronously. */
  private paperImage: fabric.FabricImage | null = null
  /** Current wine data — wine-field text on the canvas always mirrors it. */
  private wineFields: WineFieldValues = {}
  private readonly history = new HistoryManager()
  private snapManager: SnapManager
  /** Pointer position of the ongoing pan drag; null while not panning. */
  private panLast: { x: number; y: number } | null = null
  /** True until the user zooms or pans; only a fitted view re-fits on resize. */
  private fitted = true
  /** Horizontal offset of the fitted label from the canvas centre, in px. */
  private fitShiftX = 0
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
      this.fitted = false
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
        target.editable &&
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

    // Wheel over the canvas: pinch (trackpads report it as a wheel event with
    // ctrlKey set) and Ctrl/Cmd + wheel zoom, anchored at the cursor; a plain
    // wheel or two-finger swipe pans — the Figma/Canva convention, and the
    // only way to pan with a trackpad. Without preventDefault the browser
    // would scroll or pinch-zoom the whole page instead.
    canvas.on('mouse:wheel', (opt) => {
      const e = opt.e as WheelEvent
      e.preventDefault()
      e.stopPropagation()
      // Firefox may report line deltas (deltaMode 1) — normalise to pixels.
      const unit = e.deltaMode === 1 ? 16 : 1
      this.fitted = false

      if (e.ctrlKey || e.metaKey) {
        const current = canvas.getZoom()
        // 0.999^delta gives a smooth multiplicative response; delta is roughly
        // -100..100 per wheel tick, ±10 per pinch frame. `zoomToPoint` keeps
        // the pixel under the cursor stationary while the rest scales.
        let next = current * 0.999 ** (e.deltaY * unit)
        next = Math.max(0.05, Math.min(20, next))
        canvas.zoomToPoint(new fabric.Point(e.offsetX, e.offsetY), next)
        useDesignerStore.getState().setZoom(next)
        // Viewport-only, like the pan below: a full sync per pinch frame
        // re-ran layers + validator and re-armed the autosave.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(canvas as any).fire('cellar:viewport-changed')
        return
      }

      canvas.relativePan(new fabric.Point(-e.deltaX * unit, -e.deltaY * unit))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(canvas as any).fire('cellar:viewport-changed')
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

    // A new pointer interaction (drag, transform, text edit) commits the
    // snapshot still pending from the previous action. Otherwise the debounce
    // timer could fire mid-drag and record a position the user never chose,
    // and the state between the two actions would be unreachable via Undo.
    canvas.on('mouse:down:before', () => this.flushHistoryDebounce())

    // No initial snapshot here — `resetHistory()` seeds the stack once
    // mount-time restoration (`useCanvasRestore`) has settled. An
    // eager snapshot here used to race that restore and could win, leaving
    // an empty canvas as the undo floor beneath the restored scene (the
    // first Cmd+Z after any edit would wipe the whole label).
  }

  get bleedPx(): number {
    return mmToPx(this.bleedMm)
  }

  /**
   * Captures the current scene and pushes it onto the history stack after a
   * short debounce. Snapshot shape matches `serializeState` (`{ canvas, bg }`)
   * so the label-paper colour participates in Undo/Redo. Skipped while a
   * restore is applying.
   *
   * Debounced because continuous-input controls (the colour picker's hue
   * slider fires on every pointermove) used to push a full snapshot per
   * event — a single drag could evict dozens of real edits off the 50-step
   * stack, and with an image on the canvas each snapshot serializes its
   * base64 data, stalling the tab. `undo()`/`redo()` flush any pending
   * snapshot first, so a quick Cmd+Z right after an action still sees it.
   */
  private static readonly HISTORY_DEBOUNCE_MS = 300
  private historyDebounceTimer: ReturnType<typeof setTimeout> | null = null

  saveHistory() {
    if (this.history.isRestoring) return
    const store = useDesignerStore.getState()
    store.setDirty(true)
    // The pending snapshot will land on push or flush, so Undo is possible
    // and any redo branch is gone already — the buttons reflect that now,
    // not 300 ms later.
    if (!store.canUndo || store.canRedo) store.setHistoryFlags(true, false)
    if (this.historyDebounceTimer) clearTimeout(this.historyDebounceTimer)
    this.historyDebounceTimer = setTimeout(() => {
      this.historyDebounceTimer = null
      this.history.push(JSON.stringify(this.serializeState()))
      this.syncHistoryFlags()
    }, FabricBridge.HISTORY_DEBOUNCE_MS)
  }

  private flushHistoryDebounce() {
    if (!this.historyDebounceTimer) return
    clearTimeout(this.historyDebounceTimer)
    this.historyDebounceTimer = null
    this.history.push(JSON.stringify(this.serializeState()))
    // The push may have dropped the redo branch; callers like redo() return
    // early when nothing is left, so the flags must be current here.
    this.syncHistoryFlags()
  }

  private syncHistoryFlags() {
    useDesignerStore.getState().setHistoryFlags(this.history.canUndo, this.history.canRedo)
  }

  /**
   * Clears the undo/redo stack and seeds it with one snapshot of the current
   * scene. Call once after mount-time restoration finishes (`useCanvasRestore`)
   * so the restored — or still-empty — canvas becomes the undo floor, instead
   * of whatever the canvas happened to look like before restoration ran.
   * A still-pending debounced snapshot is dropped: it would land on top of
   * the fresh baseline as a duplicate and make Undo a visible no-op.
   */
  resetHistory() {
    if (this.historyDebounceTimer) {
      clearTimeout(this.historyDebounceTimer)
      this.historyDebounceTimer = null
    }
    this.history.clear()
    this.history.push(JSON.stringify(this.serializeState()))
    this.syncHistoryFlags()
  }

  /**
   * Loads a serialized scene back onto the canvas. The label backdrop is
   * rendered by React (not a Fabric object) so it needs no re-pinning; the
   * restored background reaches React via the property-changed channel.
   * Older snapshots without a `bg` field (or an unknown shape) leave the
   * current background untouched.
   */
  private async loadScene(canvasState: object, bg: unknown): Promise<void> {
    await this.canvas.loadFromJSON(canvasState)
    if (isLabelBackground(bg)) {
      this.labelBackground = bg
      this.syncPaperImage()
    }
    // A draft or an undo snapshot may carry wine-field text of an older wine.
    this.applyWineFields()
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
    this.flushHistoryDebounce()
    const snapshot = this.history.undo()
    if (snapshot === null) return
    this.syncHistoryFlags()
    // The scene now differs from what was last saved (e.g. via onSave).
    useDesignerStore.getState().setDirty(true)
    void this.history.runExclusive(() => this.applySnapshot(snapshot))
  }

  redo() {
    this.flushHistoryDebounce()
    const snapshot = this.history.redo()
    if (snapshot === null) return
    this.syncHistoryFlags()
    useDesignerStore.getState().setDirty(true)
    void this.history.runExclusive(() => this.applySnapshot(snapshot))
  }

  /**
   * Full editor state for persistence. Wraps the Fabric scene plus anything
   * that lives outside the object stack (the label-paper colour).
   */
  serializeState(): CellarCanvasState {
    const canvas = this.canvas.toObject(SERIALIZED_OBJECT_PROPS)
    return { canvas, bg: this.labelBackground }
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
      : { canvas: state as object, bg: this.labelBackground }
    await this.history.runExclusive(() => this.loadScene(wrapped.canvas, wrapped.bg))
  }

  /**
   * Sets the wine data and applies it to every placed wine field. Scene loads
   * (restore, undo/redo) re-apply it too, so a field never shows text from an
   * older wine — not even right after mount, when the async restore lands
   * after the embedder's first `setWineFields` call.
   */
  setWineFields(values: WineFieldValues) {
    this.wineFields = values
    if (!this.applyWineFields()) return
    this.canvas.requestRenderAll()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(this.canvas as any).fire('cellar:property-changed', { target: null })
  }

  /**
   * With a value: text = value; a field hidden for a missing value shows
   * again. Without a value: emptied and hidden (`_valueMissing`), so neither
   * stale text nor an empty box gets printed and the validator reports the
   * field as missing. Position and style stay on the object for when a value
   * returns; a field the user hid via the layer panel stays hidden.
   * Returns whether anything changed.
   */
  private applyWineFields(): boolean {
    let changed = false
    // Wine fields may sit inside a group; its bounds follow the new text.
    const regroup = new Set<fabric.Group>()
    for (const obj of withGroupMembers(this.canvas.getObjects())) {
      const meta = obj as fabric.Object & FabricObjectMeta
      if (meta._type !== 'wine-field' || !meta._fieldKey || !(obj instanceof fabric.Textbox)) continue
      const value = (this.wineFields as Record<string, unknown>)[meta._fieldKey]
      const before: boolean = changed
      if (hasFieldValue(value)) {
        if (obj.text !== String(value)) {
          obj.set('text', String(value))
          changed = true
        }
        if (meta._valueMissing) {
          obj.set('visible', true)
          meta._valueMissing = false
          changed = true
        }
      } else if (!meta._valueMissing) {
        obj.set({ text: '', visible: false })
        meta._valueMissing = true
        changed = true
      }
      if (changed !== before && obj.parent) regroup.add(obj.parent)
    }
    regroup.forEach(group => group.triggerLayout())
    return changed
  }

  /**
   * What the validator reads: every object including group members (wine
   * fields and the QR code may sit inside a group). A hidden group hides its
   * members, so they don't count as printed.
   */
  getValidatableObjects(): ValidatableObject[] {
    const walk = (objects: fabric.Object[], parentVisible: boolean): ValidatableObject[] =>
      objects.flatMap(o => {
        const meta = o as fabric.Object & FabricObjectMeta & { text?: string }
        const visible = parentVisible && o.visible !== false
        const self: ValidatableObject = { _fieldKey: meta._fieldKey, text: meta.text, visible }
        return o instanceof fabric.Group ? [self, ...walk(o.getObjects(), visible)] : [self]
      })
    return walk(this.canvas.getObjects(), true)
  }

  /**
   * Mod+G: turns the multi-selection into one group (layer type 'group'), at
   * the stack position of its topmost member. Members keep their metadata;
   * wine fields inside still sync and count for the validator.
   */
  groupSelected() {
    const active = this.canvas.getActiveObject()
    if (!(active instanceof fabric.ActiveSelection)) return
    const members = [...active.getObjects()]
    if (members.length < 2) return
    const stack = this.canvas.getObjects()
    const top = Math.max(...members.map(o => stack.indexOf(o)))
    // Dissolve first: members of an ActiveSelection hold coordinates relative
    // to it, and the group must take them in canvas coordinates.
    this.canvas.discardActiveObject()
    this.canvas.remove(...members)
    const group = createGroup(members)
    // Every other member sat below the topmost one, so removing them all
    // shifts that slot down by members.length - 1.
    this.canvas.insertAt(top - (members.length - 1), group)
    this.canvas.setActiveObject(group)
    this.canvas.requestRenderAll()
    this.saveHistory()
  }

  /** Mod+Shift+G: dissolves the selected group into its members, selected together. */
  ungroupSelected() {
    const group = this.canvas.getActiveObject()
    if (!(group instanceof fabric.Group) || group instanceof fabric.ActiveSelection) return
    const index = this.canvas.getObjects().indexOf(group)
    this.canvas.discardActiveObject()
    // removeAll() hands the members back in canvas coordinates.
    const members = group.removeAll()
    this.canvas.remove(group)
    this.canvas.insertAt(index, ...members)
    this.canvas.setActiveObject(
      members.length === 1 ? members[0] : new fabric.ActiveSelection(members, { canvas: this.canvas }),
    )
    this.canvas.requestRenderAll()
    this.saveHistory()
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
   *
   * Every factory places new objects at the same fixed inset, so repeated
   * clicks on an insert tool (Text, Rect, …) used to stack objects on the
   * exact same pixel — the second click looked like a no-op. Each insert takes
   * the first free 8 px step of the cascade, which leaves the very first
   * insert in place. Counting objects instead let a new one land exactly on
   * an existing one after a delete.
   */
  private place<T extends fabric.Object>(obj: T): T {
    const objects = this.canvas.getObjects()
    let step = 0
    while (
      step < 9 &&
      objects.some(o =>
        Math.abs((o.left ?? 0) - ((obj.left ?? 0) + step * 8)) < 0.5 &&
        Math.abs((o.top ?? 0) - ((obj.top ?? 0) + step * 8)) < 0.5)
    ) step++
    const cascade = step * 8
    if (cascade > 0 && obj instanceof fabric.Line) {
      // A Line positions itself from x1/y1/x2/y2 whenever a point changes
      // (`_setWidthHeight`). Shifting only left/top would desync the points
      // and the line would jump back on the next width edit (sets x2).
      obj.set({ x1: obj.x1 + cascade, y1: obj.y1 + cascade, x2: obj.x2 + cascade, y2: obj.y2 + cascade })
    } else if (cascade > 0) {
      obj.set({ left: (obj.left ?? 0) + cascade, top: (obj.top ?? 0) + cascade })
    }
    this.canvas.add(obj)
    this.canvas.setActiveObject(obj)
    this.canvas.renderAll()
    this.saveHistory()
    return obj
  }

  /**
   * Replaces the entire scene with a template's pre-built elements in one
   * atomic step (single history entry, undo-able with one Cmd+Z). Unlike
   * `place()` this clears existing content first — templates are meant as a
   * starting layout, not an addition.
   */
  applyTemplate(elements: fabric.Object[]) {
    this.canvas.discardActiveObject()
    this.canvas.getObjects().slice().forEach((o) => this.canvas.remove(o))
    elements.forEach((el) => this.canvas.add(el))
    this.canvas.renderAll()
    this.updateStoreSelection()
    this.saveHistory()
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
    const img = await this.loadImage(src, 'image')
    if (img) this.place(configureImage(img, this.bleedPx))
  }

  /**
   * A file the browser can't decode used to end in an unhandled rejection,
   * with nothing visible on screen. The header shows a hint instead
   * (`insertError`); the next successful insert clears it.
   */
  private async loadImage(src: string, kind: 'image' | 'qr'): Promise<fabric.FabricImage | null> {
    const { setInsertError } = useDesignerStore.getState()
    try {
      const img = await fabric.FabricImage.fromURL(src)
      setInsertError(null)
      return img
    } catch {
      setInsertError(kind)
      return null
    }
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

    const { setInsertError } = useDesignerStore.getState()
    try {
      await obj.setSrc(src)
    } catch {
      // Same hint as `loadImage`; the old image stays in place.
      setInsertError('image')
      return
    }
    setInsertError(null)
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
    if (!dataUrl) {
      useDesignerStore.getState().setInsertError('qr')
      return
    }

    const img = await this.loadImage(dataUrl, 'qr')
    if (img) this.place(configureQRImage(img, this.bleedPx))
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
   * Mod+A: selects every user object as one ActiveSelection, so alignment and
   * the Properties Panel act on all of them at once. Hidden and locked
   * objects stay out — moving the selection would drag locked ones along.
   */
  selectAll() {
    const objects = this.canvas.getObjects().filter(o =>
      (o as fabric.Object & FabricObjectMeta)._type !== undefined && o.visible && !o.lockMovementX)
    if (!objects.length) return
    this.canvas.discardActiveObject()
    this.canvas.setActiveObject(
      objects.length === 1 ? objects[0] : new fabric.ActiveSelection(objects, { canvas: this.canvas }),
    )
    this.canvas.requestRenderAll()
  }

  /**
   * Mod+D / toolbar: copies the selection 8 px down-right and selects the
   * copies. Each copy gets a new id; layer name, type and wine-field binding
   * carry over, so a copied wine field keeps mirroring the wine data.
   *
   * The selection is dissolved first: children of an ActiveSelection carry
   * coordinates relative to it, and their clones would land off-canvas. The
   * copies move by left/top — clones hold their line points relative to the
   * centre, and the width edit re-applies the position last anyway.
   */
  async duplicateSelected() {
    const originals = this.canvas.getActiveObjects()
    if (!originals.length) return
    this.canvas.discardActiveObject()
    const copies = await Promise.all(originals.map(o => o.clone(SERIALIZED_OBJECT_PROPS)))
    for (const copy of copies) {
      ;(copy as fabric.Object & FabricObjectMeta).id = crypto.randomUUID()
      copy.set({ left: copy.left + 8, top: copy.top + 8 })
      this.canvas.add(copy)
    }
    this.canvas.setActiveObject(
      copies.length === 1 ? copies[0] : new fabric.ActiveSelection(copies, { canvas: this.canvas }),
    )
    this.canvas.requestRenderAll()
    this.saveHistory()
  }

  /**
   * Esc: drops the current selection. Returns false when nothing was
   * selected, so Escape can do something else (leave fullscreen). Text
   * editing never gets here: Fabric's hidden textarea handles Escape itself
   * (exitEditing) and stops the event.
   */
  discardSelection(): boolean {
    if (!this.canvas.getActiveObject()) return false
    this.canvas.discardActiveObject()
    this.canvas.requestRenderAll()
    return true
  }

  /**
   * Returns properties of the currently active object for the UI.
   */
  getActiveObjectProperties(): FabricObjectProperties | null {
    const obj = this.canvas.getActiveObject() as (fabric.Object & FabricObjectMeta) | null
    if (!obj) return null

    // Geometry in mm — reported relative to the label top-left so users see the
    // same coordinate the printer will use.
    const { dx, dy } = originOffset(obj)
    const geo = readGeometryMm(
      {
        left: (obj.left || 0) - dx,
        top: (obj.top || 0) - dy,
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
      cornerRadius: obj instanceof fabric.Rect ? pxToMm((obj.rx ?? 0) * (obj.scaleX || 1)) : undefined,
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
    const { x, y, width, height, cornerRadius, ...rest } = cleanProps as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fabricProps: Record<string, any> = { ...rest }

    const { dx, dy } = originOffset(obj)
    if (x !== undefined) fabricProps.left = xToLeft(x, this.bleedPx) + dx
    if (y !== undefined) fabricProps.top  = yToTop(y, this.bleedPx) + dy

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
    // rx/ry are pre-scale units: each axis divides its own scale out, so the
    // corners stay round on a rect stretched via scaleX/scaleY.
    if (cornerRadius !== undefined && obj instanceof fabric.Rect) {
      fabricProps.rx = mmToPx(cornerRadius) / (obj.scaleX || 1)
      fabricProps.ry = mmToPx(cornerRadius) / (obj.scaleY || 1)
    }
    // A Line repositions itself from its points whenever one changes, so a
    // dragged line (left/top moved, points not) jumped back on a width edit.
    // `set` applies keys in order — put the position last: the requested
    // x/y, otherwise where the line is now.
    if (kind === 'line' && width !== undefined) {
      const { left = obj.left, top = obj.top } = fabricProps
      delete fabricProps.left
      delete fabricProps.top
      Object.assign(fabricProps, { left, top })
    }

    // A centre-origin object (a multi-selection) scales around its centre,
    // which moved the top-left corner the panel shows. Keep that corner.
    const corner =
      (dx !== 0 || dy !== 0) && x === undefined && y === undefined &&
      (width !== undefined || height !== undefined)
        ? obj.getPositionByOrigin('left', 'top')
        : null

    obj.set(fabricProps)
    if (corner) obj.setPositionByOrigin(corner, 'left', 'top')
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

  getBackground(): LabelBackground {
    return this.labelBackground
  }

  setBackground(bg: LabelBackground) {
    if (sameBackground(this.labelBackground, bg)) return
    this.labelBackground = bg
    this.syncPaperImage()
    useDesignerStore.getState().setDirty(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(this.canvas as any).fire('cellar:property-changed', { target: null })
    // Bg-colour now participates in Undo/Redo (the snapshot includes it).
    // Without this call setBackground would mutate the live state but leave
    // the history untouched, so Undo couldn't reverse it.
    this.saveHistory()
  }

  /**
   * Keeps a decoded copy of an image background for `withPaper`. On screen the
   * image is CSS; the export paints it into the canvas and cannot wait for a
   * decode. A file that fails to decode gets the usual header hint.
   */
  private syncPaperImage() {
    const bg = this.labelBackground
    if (typeof bg === 'string' || bg.type !== 'image') {
      this.paperImage = null
      return
    }
    if (this.paperImage?.getSrc() === bg.src) return
    const { src } = bg
    fabric.FabricImage.fromURL(src)
      .then(img => {
        const current = this.labelBackground
        if (typeof current !== 'string' && current.type === 'image' && current.src === src) this.paperImage = img
      })
      .catch(() => useDesignerStore.getState().setInsertError('image'))
  }

  /**
   * Runs `render` with the label paper painted into the canvas. Normally the
   * paper is a CSS backdrop behind a transparent canvas. It covers the label
   * plus `printBleedMm` on every side, so colour, gradient or image run into
   * the print bleed; the previous canvas background comes back afterwards.
   */
  withPaper<T>(printBleedMm: number, render: () => T): T {
    const prevColor = this.canvas.backgroundColor
    const prevImage = this.canvas.backgroundImage
    const corner = mmToPx(this.bleedMm - printBleedMm)
    const box = {
      left: corner,
      top: corner,
      width: mmToPx(this.widthMm + 2 * printBleedMm),
      height: mmToPx(this.heightMm + 2 * printBleedMm),
    }
    const bg = this.labelBackground
    if (typeof bg === 'string') {
      this.canvas.backgroundColor = bg
    } else if (bg.type === 'gradient') {
      this.canvas.backgroundColor = new fabric.Gradient({
        type: 'linear',
        gradientUnits: 'pixels',
        coords: gradientLine(bg.angle, box),
        colorStops: [{ offset: 0, color: bg.from }, { offset: 1, color: bg.to }],
      })
    } else {
      this.canvas.backgroundColor = '#ffffff'
      const img = this.paperImage
      if (img) {
        // CSS `background-size: cover`, centred on the box.
        const scale = Math.max(box.width / img.width, box.height / img.height)
        img.set({
          originX: 'left',
          originY: 'top',
          scaleX: scale,
          scaleY: scale,
          left: box.left + (box.width - img.width * scale) / 2,
          top: box.top + (box.height - img.height * scale) / 2,
        })
        this.canvas.backgroundImage = img
      }
    }
    try {
      return render()
    } finally {
      this.canvas.backgroundColor = prevColor
      this.canvas.backgroundImage = prevImage
      this.canvas.requestRenderAll()
    }
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
    this.fitted = false
    useDesignerStore.getState().setZoom(next)
    // Viewport-only: the React backdrop tracks Fabric's view; layers,
    // validator and autosave stay untouched.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(this.canvas as any).fire('cellar:viewport-changed')
  }

  /**
   * Matches the canvas element to the visible canvas area (the React layer
   * observes its size). The element used to keep the label-plus-bleed size:
   * clipped in a small window, small in fullscreen.
   *
   * Re-fits only while the view is still fitted — a resize must not throw
   * away a zoom or pan the user chose. `shiftX` moves the fitted label off
   * the element centre (fullscreen optical centring, see CellarCanvas).
   */
  resize(width: number, height: number, shiftX = 0) {
    if (width <= 0 || height <= 0) return
    this.fitShiftX = shiftX
    this.canvas.setDimensions({ width, height })
    if (this.fitted) this.zoomToFit()
    // setDimensions clears the bitmap at once, and ResizeObserver callbacks
    // run after this frame's rAF — a requested render would leave one blank
    // frame per resize step (flicker while dragging the window edge).
    this.canvas.renderAll()
    // The rulers read the element size from the viewport snapshot.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(this.canvas as any).fire('cellar:viewport-changed')
  }

  /**
   * Fits the label plus its bleed margin into the canvas element with a small
   * visual padding, centred (plus `fitShiftX`). The element fills the visible
   * canvas area (see `resize`), so this keeps both the label and any
   * overflowing objects in view at the same time.
   */
  zoomToFit() {
    const padding = 24
    const shift = this.fitShiftX
    const sceneWidth  = mmToPx(this.widthMm + 2 * this.bleedMm)
    const sceneHeight = mmToPx(this.heightMm + 2 * this.bleedMm)
    const viewWidth   = this.canvas.getWidth()
    const viewHeight  = this.canvas.getHeight()

    const scale = Math.max(0.05, Math.min(
      (viewWidth - 2 * Math.abs(shift) - padding * 2) / sceneWidth,
      (viewHeight - padding * 2) / sceneHeight,
      2.0,
    ))

    this.canvas.setViewportTransform([
      scale, 0, 0, scale,
      (viewWidth - sceneWidth * scale) / 2 + shift,
      (viewHeight - sceneHeight * scale) / 2,
    ])

    this.canvas.requestRenderAll()
    this.fitted = true
    useDesignerStore.getState().setZoom(scale)
    // Viewport-only: the React backdrop tracks Fabric's view; layers,
    // validator and autosave stay untouched.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(this.canvas as any).fire('cellar:viewport-changed')
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
    if (this.historyDebounceTimer) clearTimeout(this.historyDebounceTimer)
    this.unsubscribePanMode()
    this.canvas.dispose()
  }
}
