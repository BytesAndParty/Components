import { useEffect, useState, type RefObject } from 'react'
import { validateCompliance } from '../wine-fields/validator'
import type { FabricBridge } from './fabric-bridge'
import type { FabricObjectMeta, FabricObjectProperties } from '../store/types'
import type { Layer } from '../../layer-panel/layer-panel'
import type { ValidationWarning } from '../../validator-badge/validator-badge'

export interface CanvasViewport {
  zoom: number
  tx: number
  ty: number
}

export interface CanvasSyncSnapshot {
  activeProps:     FabricObjectProperties | null
  layers:          Layer[]
  /**
   * Setter for `layers`. Some bridge mutations (stack reorder, visibility,
   * lock, rename) don't emit Fabric events the hook can listen to — callers
   * must mirror the new state in themselves to avoid panel snap-back.
   */
  setLayers:       (layers: Layer[]) => void
  warnings:        ValidationWarning[]
  backgroundColor: string
  viewport:        CanvasViewport
}

/**
 * Mirrors Fabric's mutable state into React. Listens to every relevant Fabric
 * event (selection, object mutations, viewport changes via the custom
 * `cellar:property-changed` channel) and pulls a fresh snapshot through the
 * bridge. The bridge itself is the source of truth — this hook only caches.
 *
 * History snapshots piggy-back on `object:modified` so a single user edit
 * produces exactly one history entry (the others are mid-drag fires).
 */
export function useCanvasSync(
  bridge: RefObject<FabricBridge | null>,
  options: { enableValidator: boolean }
): CanvasSyncSnapshot {
  const [activeProps,     setActiveProps]     = useState<FabricObjectProperties | null>(null)
  const [layers,          setLayers]          = useState<Layer[]>([])
  const [warnings,        setWarnings]        = useState<ValidationWarning[]>([])
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [viewport,        setViewport]        = useState<CanvasViewport>({ zoom: 1, tx: 0, ty: 0 })

  useEffect(() => {
    const b = bridge.current
    if (!b) return

    const update = (mode: 'full' | 'geometry' | 'viewport' = 'full') => {
      // Geometry updates (dragging/scaling) only need activeProps to refresh
      // the Properties Panel live. Everything else stays stable.
      if (mode === 'full' || mode === 'geometry') {
        setActiveProps(b.getActiveObjectProperties())
      }

      // Layers and warnings are expensive (DOM snapshots + iteration).
      // We skip them during smooth operations like drag or viewport pan.
      if (mode === 'full') {
        setLayers(b.getLayers() ?? [])
        if (options.enableValidator) {
          const objects = (b.canvas.getObjects() ?? []) as unknown as FabricObjectMeta[]
          setWarnings(validateCompliance(objects))
        }
      }

      if (mode === 'full' || mode === 'viewport') {
        setBackgroundColor(b.getBackground())
        const vpt = b.canvas.viewportTransform
        setViewport(prev => {
          const nextZoom = b.canvas.getZoom()
          const nextTx = vpt?.[4] ?? 0
          const nextTy = vpt?.[5] ?? 0
          if (prev.zoom === nextZoom && prev.tx === nextTx && prev.ty === nextTy) return prev
          return { zoom: nextZoom, tx: nextTx, ty: nextTy }
        })
      }
    }

    // Microtask-debounce: stack operations and complex bridge methods can fire
    // several events in the same synchronous tick. Coalescing them into a single
    // update per microtask keeps React state changes batched.
    let scheduledMode: 'full' | 'geometry' | 'viewport' | null = null
    let cancelled = false
    
    const scheduleUpdate = (mode: 'full' | 'geometry' | 'viewport' = 'full') => {
      // If a full update is already pending, it covers any partial update.
      if (scheduledMode === 'full') return
      if (scheduledMode === mode) return
      
      // Upgrade pending mode if a more comprehensive update arrives.
      if (mode === 'full') scheduledMode = 'full'
      else if (scheduledMode === null) scheduledMode = mode

      queueMicrotask(() => {
        if (cancelled || scheduledMode === null) return
        const currentMode = scheduledMode
        scheduledMode = null
        update(currentMode)
      })
    }

    const onModified = () => {
      scheduleUpdate('full')
      b.saveHistory()
    }

    const canvas = b.canvas
    canvas.on('selection:created',  () => scheduleUpdate('full'))
    canvas.on('selection:updated',  () => scheduleUpdate('full'))
    canvas.on('selection:cleared',  () => scheduleUpdate('full'))
    canvas.on('object:modified',    onModified)
    canvas.on('object:moving',      () => scheduleUpdate('geometry'))
    canvas.on('object:scaling',     () => scheduleUpdate('geometry'))
    canvas.on('object:rotating',    () => scheduleUpdate('geometry'))
    canvas.on('object:added',       () => scheduleUpdate('full'))
    canvas.on('object:removed',     () => scheduleUpdate('full'))
    
    // Custom property channel — fired by the bridge for non-event-emitting
    // mutations. Usually full because they might touch z-order or visibility.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(canvas as any).on('cellar:property-changed', () => scheduleUpdate('full'))

    // Pan/Zoom updates. The bridge fires `cellar:viewport-changed` for
    // programmatic viewport moves (pan drag) that emit no native event.
    canvas.on('mouse:wheel', () => scheduleUpdate('viewport'))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(canvas as any).on('cellar:viewport-changed', () => scheduleUpdate('viewport'))

    // First paint stays synchronous.
    update('full')

    return () => {
      cancelled = true
      canvas.off('selection:created')
      canvas.off('selection:updated')
      canvas.off('selection:cleared')
      canvas.off('object:modified',    onModified)
      canvas.off('object:moving')
      canvas.off('object:scaling')
      canvas.off('object:rotating')
      canvas.off('object:added')
      canvas.off('object:removed')
      canvas.off('mouse:wheel')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(canvas as any).off('cellar:property-changed')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(canvas as any).off('cellar:viewport-changed')
    }
  }, [bridge, options.enableValidator])

  return { activeProps, layers, setLayers, warnings, backgroundColor, viewport }
}
