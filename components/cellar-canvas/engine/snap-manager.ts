import * as fabric from 'fabric'
import { mmToPx } from './units'

const SNAP_THRESHOLD = 5 // pixels
const GUIDE_COLOR = '#ff00ff' // Canva-style magenta

export interface SnapLine {
  type: 'h' | 'v'
  coordinate: number
  origin: 'canvas' | 'object'
}

/**
 * SnapManager handles "Smart Guides" during object dragging.
 * It identifies alignment points (canvas center, other object edges)
 * and "snaps" the moving object if it's within a threshold.
 */
export class SnapManager {
  private canvas: fabric.Canvas
  private bleedPx: number
  private labelWidthPx: number
  private labelHeightPx: number
  private guideLines: fabric.Line[] = []

  constructor(canvas: fabric.Canvas, widthMm: number, heightMm: number, bleedMm: number) {
    this.canvas = canvas
    this.bleedPx = mmToPx(bleedMm)
    this.labelWidthPx = mmToPx(widthMm)
    this.labelHeightPx = mmToPx(heightMm)
  }

  /**
   * Clears any visible guide lines from the canvas.
   */
  clearGuides() {
    this.guideLines.forEach(line => this.canvas.remove(line))
    this.guideLines = []
    this.canvas.requestRenderAll()
  }

  /**
   * Performs snapping for the currently moving object.
   * Returns true if snapping occurred.
   */
  handleMoving(target: fabric.Object, isAltPressed: boolean): boolean {
    this.clearGuides()
    if (isAltPressed) return false

    const activeObj = target
    const objBounds = activeObj.getBoundingRect()
    
    // Interesting points on the moving object
    const objH = [objBounds.left, objBounds.left + objBounds.width / 2, objBounds.left + objBounds.width]
    const objV = [objBounds.top, objBounds.top + objBounds.height / 2, objBounds.top + objBounds.height]

    const snapPointsH: SnapLine[] = []
    const snapPointsV: SnapLine[] = []

    // 1. Canvas Snap Points (Centers)
    snapPointsH.push({ type: 'v', coordinate: this.bleedPx + this.labelWidthPx / 2, origin: 'canvas' })
    snapPointsV.push({ type: 'h', coordinate: this.bleedPx + this.labelHeightPx / 2, origin: 'canvas' })
    
    // 2. Other Objects Snap Points
    this.canvas.getObjects().forEach(obj => {
      if (obj === activeObj || !obj.visible || obj.evented === false) return
      
      const b = obj.getBoundingRect()
      // Edges and Center
      snapPointsH.push({ type: 'v', coordinate: b.left, origin: 'object' })
      snapPointsH.push({ type: 'v', coordinate: b.left + b.width / 2, origin: 'object' })
      snapPointsH.push({ type: 'v', coordinate: b.left + b.width, origin: 'object' })
      
      snapPointsV.push({ type: 'h', coordinate: b.top, origin: 'object' })
      snapPointsV.push({ type: 'h', coordinate: b.top + b.height / 2, origin: 'object' })
      snapPointsV.push({ type: 'h', coordinate: b.top + b.height, origin: 'object' })
    })

    let snappedH = false
    let snappedV = false

    // Snap Horizontal (Vertical Lines)
    for (const point of snapPointsH) {
      for (const objX of objH) {
        if (Math.abs(objX - point.coordinate) < SNAP_THRESHOLD) {
          const delta = point.coordinate - objX
          activeObj.set('left', (activeObj.left || 0) + delta)
          this.drawGuide('v', point.coordinate)
          snappedH = true
          break
        }
      }
      if (snappedH) break
    }

    // Snap Vertical (Horizontal Lines)
    for (const point of snapPointsV) {
      for (const objY of objV) {
        if (Math.abs(objY - point.coordinate) < SNAP_THRESHOLD) {
          const delta = point.coordinate - objY
          activeObj.set('top', (activeObj.top || 0) + delta)
          this.drawGuide('h', point.coordinate)
          snappedV = true
          break
        }
      }
      if (snappedV) break
    }

    if (snappedH || snappedV) {
      activeObj.setCoords()
      this.canvas.requestRenderAll()
    }

    return snappedH || snappedV
  }

  private drawGuide(type: 'h' | 'v', coordinate: number) {
    const canvasWidth = this.canvas.width || 0
    const canvasHeight = this.canvas.height || 0
    
    const linePoints: [number, number, number, number] = type === 'h'
      ? [0, coordinate, canvasWidth, coordinate]
      : [coordinate, 0, coordinate, canvasHeight]

    const line = new fabric.Line(linePoints, {
      stroke: GUIDE_COLOR,
      strokeWidth: 1,
      selectable: false,
      evented: false,
      opacity: 0.8,
      // Ensure it's not serialized or counted as a user object
      excludeFromExport: true,
    })

    this.canvas.add(line)
    this.guideLines.push(line)
  }
}
