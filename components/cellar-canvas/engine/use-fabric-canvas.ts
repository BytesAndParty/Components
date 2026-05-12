import { useEffect, useRef } from 'react'
import * as fabric from 'fabric'
import { FabricBridge } from './fabric-bridge'
import { mmToPx } from './units'

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

    // Initialize Fabric Canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: mmToPx(widthMm),
      height: mmToPx(heightMm),
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    })

    const bridge = new FabricBridge(canvas)
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
