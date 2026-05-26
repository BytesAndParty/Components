import { useEffect, useRef } from 'react'
import * as fabric from 'fabric'
import { FabricBridge } from './fabric-bridge'
import { mmToPx } from './units'

/**
 * Extra space (in millimetres) added on every side of the label. Objects that
 * overflow the label stay visible inside this bleed zone instead of getting
 * clipped by the canvas edge. Symmetric so dragging an object out to the left
 * or top looks the same as out to the right or bottom.
 */
export const BLEED_MM = 40

export interface CanvasDimensions {
  widthMm: number
  heightMm: number
}

export function useFabricCanvas(initialDimensions: CanvasDimensions) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bridgeRef = useRef<FabricBridge | null>(null)
  const { widthMm, heightMm } = initialDimensions

  useEffect(() => {
    if (!canvasRef.current) return

    // Initialize Fabric Canvas — sized larger than the label so overflowing
    // text/images render in the bleed area instead of being clipped. The
    // canvas is transparent; the surrounding viewport background shines
    // through everywhere except the label-rect itself.
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: mmToPx(widthMm + 2 * BLEED_MM),
      height: mmToPx(heightMm + 2 * BLEED_MM),
      backgroundColor: 'transparent',
      preserveObjectStacking: true,
      // Styling the selection lasso (Canva-style)
      selectionColor: 'rgba(255, 0, 255, 0.1)',
      selectionBorderColor: '#ff00ff',
      selectionLineWidth: 1.5,
    })

    const bridge = new FabricBridge(canvas, { widthMm, heightMm, bleedMm: BLEED_MM })
    bridgeRef.current = bridge

    // Sync events to store
    const syncSelection = () => bridge.updateStoreSelection()
    
    canvas.on('selection:created', syncSelection)
    canvas.on('selection:updated', syncSelection)
    canvas.on('selection:cleared', syncSelection)

    return () => {
      bridge.dispose()
      bridgeRef.current = null
    }
  }, [widthMm, heightMm])

  return { canvasRef, bridge: bridgeRef }
}
