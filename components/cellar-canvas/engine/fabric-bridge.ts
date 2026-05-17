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

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas
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
  }

  /**
   * Adds a basic circle to the center of the canvas.
   */
  addCircle() {
    const circle = new fabric.Circle({
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
  }

  /**
   * Adds a basic line to the canvas.
   */
  addLine() {
    const x = 100
    const y = 100
    const length = mmToPx(30)
    const line = new fabric.Line([x, y, x + length, y], {
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
  }

  /**
   * Adds a text object.
   */
  addText(text = 'New Text', fieldKey?: string) {
    const itext = new fabric.IText(text, {
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
  }

  async addQRCode(url: string) {
    const dataUrl = await generateQRCodeDataURL(url)
    if (!dataUrl) return

    fabric.Image.fromURL(dataUrl, (img) => {
      img.set({
        left: 100,
        top: 100,
        scaleX: 0.2,
        scaleY: 0.2,
      })

      const meta: FabricObjectMeta = {
        id: crypto.randomUUID(),
        _layerName: 'QR Code',
        _type: 'qr-code',
        _fieldKey: 'qrCode'
      }
      Object.assign(img, meta)

      this.canvas.add(img)
      this.canvas.setActiveObject(img)
      this.canvas.renderAll()
    })
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
  updateActiveObject(props: Partial<FabricObjectProperties & fabric.IObjectOptions>) {
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
  }

  bringToFront() {
    const obj = this.canvas.getActiveObject()
    if (obj) {
      obj.bringToFront()
      this.canvas.renderAll()
    }
  }

  sendToBack() {
    const obj = this.canvas.getActiveObject()
    if (obj) {
      obj.sendToBack()
      this.canvas.renderAll()
    }
  }

  /**
   * Zooms and pans the canvas so that the label area fits within the viewport.
   */
  zoomToFit() {
    const padding = 80
    const canvasWidth = this.canvas.getWidth()
    const canvasHeight = this.canvas.getHeight()
    
    // Default area for fitting (the workspace/label boundaries)
    // We assume the label is roughly in the center or we use the defined canvas size
    // For now, we fit based on the Fabric Canvas container size vs the viewport
    const contentWidth = 400 // TODO: Pass actual mmToPx dimensions
    const contentHeight = 600

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
    }
  }

  deleteLayer(id: string) {
    const obj = this.canvas.getObjects().find((o) => (o as fabric.Object & FabricObjectMeta).id === id)
    if (obj) {
      this.canvas.remove(obj)
      this.canvas.renderAll()
      this.updateStoreSelection()
    }
  }

  renameLayer(id: string, name: string) {
    const obj = this.canvas.getObjects().find((o) => (o as fabric.Object & FabricObjectMeta).id === id)
    if (obj) {
      (obj as fabric.Object & FabricObjectMeta)._layerName = name
      this.canvas.renderAll()
    }
  }

  reorderLayers(ids: string[]) {
    // ids are top-to-bottom
    const reversedIds = [...ids].reverse()
    reversedIds.forEach((id, index) => {
      const obj = this.canvas.getObjects().find((o) => (o as fabric.Object & FabricObjectMeta).id === id)
      if (obj) {
        obj.moveTo(index)
      }
    })
    this.canvas.renderAll()
  }

  /**
   * Disposes the canvas.
   */
  dispose() {
    this.canvas.dispose()
  }
}
