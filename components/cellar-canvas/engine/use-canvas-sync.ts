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

    const onModified = () => {
      update()
      b.saveHistory()
    }

    const canvas = b.canvas
    canvas.on('selection:created',  update)
    canvas.on('selection:updated',  update)
    canvas.on('selection:cleared',  update)
    canvas.on('object:modified',    onModified)
    canvas.on('object:moving',      update)
    canvas.on('object:scaling',     update)
    canvas.on('object:rotating',    update)
    canvas.on('object:added',       update)
    canvas.on('object:removed',     update)
    // Custom property channel — fired by the bridge for non-event-emitting
    // mutations like `obj.set(...)` from NumberInput steppers.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(canvas as any).on('cellar:property-changed', update)

    update()

    return () => {
      canvas.off('selection:created',  update)
      canvas.off('selection:updated',  update)
      canvas.off('selection:cleared',  update)
      canvas.off('object:modified',    onModified)
      canvas.off('object:moving',      update)
      canvas.off('object:scaling',     update)
      canvas.off('object:rotating',    update)
      canvas.off('object:added',       update)
      canvas.off('object:removed',     update)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(canvas as any).off('cellar:property-changed', update)
    }
  }, [bridge, options.enableValidator])

  return { activeProps, layers, setLayers, warnings, backgroundColor, viewport }
}
