import * as fabric from 'fabric'
import { useDesignerStore } from '../store/designer-store'
import type { FabricObjectMeta, FabricObjectProperties } from '../store/types'
import { pxToMm, mmToPx } from './units'
import { generateQRCodeDataURL } from './qr-generator'

/**
 * The FabricBridge provides a set of imperative helpers to interact 
 * with the Fabric.js canvas instance while keeping the Zustand store in sync.
 */
export class FabricBridge {
  canvas: fabric.Canvas
  private isRestoringHistory = false

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas
    
    // Initial history snapshot
    setTimeout(() => this.saveHistory(), 100)
  }

  /**
   * Captures the current state and pushes it to the store's history stack.
   */
  saveHistory() {
    if (this.isRestoringHistory) return
    const json = JSON.stringify(this.canvas.toJSON(['id', '_layerName', '_type', '_fieldKey', 'lockMovementX', 'lockMovementY', 'lockScalingX', 'lockScalingY', 'lockRotation', 'hasControls']))
    useDesignerStore.getState().pushHistory(json)
  }

  /**
   * Restores the state from the history stack based on the current index.
   */
  async restoreHistory() {
    const { history, historyIndex } = useDesignerStore.getState()
    const state = history[historyIndex]
    if (!state) return

    this.isRestoringHistory = true
    await this.canvas.loadFromJSON(state)
    this.canvas.requestRenderAll()
    this.updateStoreSelection()
    this.isRestoringHistory = false
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
      left: 100,
      top: 100,
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
      left: 100,
      top: 100,
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
    const x = 100
    const y = 100
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
   * Adds a text object.
   */
  addText(text = 'New Text', fieldKey?: string) {
    const itext = new fabric.IText(text, {
      originX: 'left',
      originY: 'top',
      left: 100,
      top: 100,
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
    Object.assign(itext, meta)

    this.canvas.add(itext)
    this.canvas.setActiveObject(itext)
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
      left: mmToPx(10),
      top: mmToPx(10),
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

  async addQRCode(url: string) {
    const dataUrl = await generateQRCodeDataURL(url)
    if (!dataUrl) return

    const img = await fabric.FabricImage.fromURL(dataUrl)
    img.set({
      originX: 'left',
      originY: 'top',
      left: 100,
      top: 100,
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
      // Geometry in mm
      x: pxToMm(obj.left || 0),
      y: pxToMm(obj.top || 0),
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
        textAlign: obj.textAlign,
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

    // If it's a wine field, don't allow changing the 'text' property
    const cleanProps = { ...props }
    if (obj._type === 'wine-field' && cleanProps.text !== undefined) {
      delete cleanProps.text
    }

    // Convert mm props back to px
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fabricProps: Record<string, any> = { ...cleanProps }
    if (cleanProps.x !== undefined) fabricProps.left = mmToPx(cleanProps.x)
    if (cleanProps.y !== undefined) fabricProps.top = mmToPx(cleanProps.y)
    
    // Width/Height scaling for non-text objects
    if (!(obj instanceof fabric.IText)) {
      if (cleanProps.width !== undefined) fabricProps.scaleX = mmToPx(cleanProps.width) / obj.width!
      if (cleanProps.height !== undefined) fabricProps.scaleY = mmToPx(cleanProps.height) / obj.height!
    }

    obj.set(fabricProps)

    if (obj instanceof fabric.IText) {
      obj.setCoords()
      if (cleanProps.text !== undefined) {
        this.canvas.fire('text:changed', { target: obj })
      }
    }

    this.canvas.renderAll()
    useDesignerStore.getState().setDirty(true)
    // We don't save history on EVERY prop change (e.g. while dragging), 
    // we do it when the change is committed.
  }

  bringToFront() {
    const obj = this.canvas.getActiveObject()
    if (obj) {
      this.canvas.bringObjectToFront(obj)
      this.canvas.requestRenderAll()
      this.saveHistory()
    }
  }

  bringForward() {
    const obj = this.canvas.getActiveObject()
    if (obj) {
      this.canvas.bringObjectForward(obj)
      this.canvas.requestRenderAll()
      this.saveHistory()
    }
  }

  sendBackward() {
    const obj = this.canvas.getActiveObject()
    if (obj) {
      this.canvas.sendObjectBackwards(obj)
      this.canvas.requestRenderAll()
      this.saveHistory()
    }
  }

  sendToBack() {
    const obj = this.canvas.getActiveObject()
    if (obj) {
      this.canvas.sendObjectToBack(obj)
      this.canvas.requestRenderAll()
      this.saveHistory()
    }
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
  }

  /**
   * Zooms and pans the canvas so that the label area fits within the viewport.
   */
  zoomToFit(widthMm = 90, heightMm = 120) {
    const padding = 80
    const canvasWidth = this.canvas.getWidth()
    const canvasHeight = this.canvas.getHeight()
    
    const contentWidth = mmToPx(widthMm)
    const contentHeight = mmToPx(heightMm)

    const scaleX = (canvasWidth - padding * 2) / contentWidth
    const scaleY = (canvasHeight - padding * 2) / contentHeight
    const zoom = Math.min(scaleX, scaleY, 2.0)

    this.canvas.setZoom(zoom)
    
    const vpt = this.canvas.viewportTransform!
    vpt[4] = (canvasWidth / 2) - (contentWidth * zoom / 2)
    vpt[5] = (canvasHeight / 2) - (contentHeight * zoom / 2)
    
    this.canvas.requestRenderAll()
    useDesignerStore.getState().setZoom(zoom)
  }

  /**
   * Returns all objects as a Layer array for the UI.
   * Fabric z-order is bottom-to-top, but Layer Panel is top-to-bottom.
   */
  getLayers() {
    return this.canvas.getObjects().map((obj) => {
      const o = obj as fabric.Object & FabricObjectMeta & { text?: string }
      return {
        id: o.id,
        name: o._layerName || o.text || 'Unnamed Layer',
        type: o._type,
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
    }
  }

  deleteLayer(id: string) {
    const obj = this.canvas.getObjects().find((o) => (o as fabric.Object & FabricObjectMeta).id === id)
    if (obj) {
      this.canvas.remove(obj)
      this.canvas.renderAll()
      this.updateStoreSelection()
      this.saveHistory()
    }
  }

  renameLayer(id: string, name: string) {
    const obj = this.canvas.getObjects().find((o) => (o as fabric.Object & FabricObjectMeta).id === id)
    if (obj) {
      (obj as fabric.Object & FabricObjectMeta)._layerName = name
      this.canvas.renderAll()
      this.saveHistory()
    }
  }

  reorderLayers(ids: string[]) {
    // Panel: top-to-bottom (front first). Fabric stack: bottom-to-top.
    const reversedIds = [...ids].reverse()
    reversedIds.forEach((id, index) => {
      const obj = this.canvas.getObjects().find((o) => (o as fabric.Object & FabricObjectMeta).id === id)
      if (obj) {
        this.canvas.moveObjectTo(obj, index)
      }
    })
    this.canvas.requestRenderAll()
    this.saveHistory()
  }

  /**
   * Disposes the canvas.
   */
  dispose() {
    this.canvas.dispose()
  }
}
