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

    const update = () => {
      setActiveProps(b.getActiveObjectProperties())
      setLayers(b.getLayers() ?? [])
      setBackgroundColor(b.getBackground())
      const vpt = b.canvas.viewportTransform
      setViewport({
        zoom: b.canvas.getZoom(),
        tx:   vpt?.[4] ?? 0,
        ty:   vpt?.[5] ?? 0,
      })

      if (options.enableValidator) {
        const objects = (b.canvas.getObjects() ?? []) as unknown as FabricObjectMeta[]
        setWarnings(validateCompliance(objects))
      }
    }

    // Microtask-debounce: stack operations and complex bridge methods can fire
    // several events in the same synchronous tick (e.g. `bringToFront` triggers
    // `notifyStackChanged` via `cellar:property-changed` plus the implicit
    // `object:added`/`object:removed` from Fabric's reorder, and bulk paths
    // like `alignSelected` mutate every selected object in a row). Coalescing
    // them into a single `update()` per microtask keeps the React state
    // changes batched and avoids repeated `getLayers`/`validateCompliance`
    // work for one logical action.
    let scheduled = false
    let cancelled = false
    const scheduleUpdate = () => {
      if (scheduled) return
      scheduled = true
      queueMicrotask(() => {
        scheduled = false
        if (cancelled) return
        update()
      })
    }

    const onModified = () => {
      // saveHistory is per-logical-edit and must NOT debounce — each
      // `object:modified` is a discrete user action that earns its own
      // history entry. The view sync still rides the microtask queue.
      scheduleUpdate()
      b.saveHistory()
    }

    const canvas = b.canvas
    canvas.on('selection:created',  scheduleUpdate)
    canvas.on('selection:updated',  scheduleUpdate)
    canvas.on('selection:cleared',  scheduleUpdate)
    canvas.on('object:modified',    onModified)
    canvas.on('object:moving',      scheduleUpdate)
    canvas.on('object:scaling',     scheduleUpdate)
    canvas.on('object:rotating',    scheduleUpdate)
    canvas.on('object:added',       scheduleUpdate)
    canvas.on('object:removed',     scheduleUpdate)
    // Custom property channel — fired by the bridge for non-event-emitting
    // mutations like `obj.set(...)` from NumberInput steppers.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(canvas as any).on('cellar:property-changed', scheduleUpdate)

    // First paint stays synchronous — viewport transform is already laid
    // out by the time this effect runs, no batching needed.
    update()

    return () => {
      cancelled = true
      canvas.off('selection:created',  scheduleUpdate)
      canvas.off('selection:updated',  scheduleUpdate)
      canvas.off('selection:cleared',  scheduleUpdate)
      canvas.off('object:modified',    onModified)
      canvas.off('object:moving',      scheduleUpdate)
      canvas.off('object:scaling',     scheduleUpdate)
      canvas.off('object:rotating',    scheduleUpdate)
      canvas.off('object:added',       scheduleUpdate)
      canvas.off('object:removed',     scheduleUpdate)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(canvas as any).off('cellar:property-changed', scheduleUpdate)
    }
  }, [bridge, options.enableValidator])

  return { activeProps, layers, setLayers, warnings, backgroundColor, viewport }
}
