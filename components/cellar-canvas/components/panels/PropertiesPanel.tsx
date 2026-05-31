import { type RefObject } from 'react'
import { NumberInput } from '../shared'
import { useCellarCanvasMessages } from '../../messages-context'
import type { FabricBridge } from '../../engine/fabric-bridge'
import type { FabricObjectProperties } from '../../store/types'

export interface PropertiesPanelProps {
  bridge:      RefObject<FabricBridge | null>
  activeProps: FabricObjectProperties | null
}

/**
 * Geometry + appearance editor for the active Fabric object. Values mirror
 * what the bridge serializes — mm for position/size, degrees for rotation,
 * 0–100 % for opacity. Empty state when nothing is selected.
 */
export function PropertiesPanel({ bridge, activeProps }: PropertiesPanelProps) {
  const m = useCellarCanvasMessages()
  if (!activeProps) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <p className="text-muted-foreground text-xs italic">
          {m.propsEmpty}
        </p>
      </div>
    )
  }

  const update = (patch: Parameters<FabricBridge['updateActiveObject']>[0]) =>
    bridge.current?.updateActiveObject(patch)

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h4 className="text-muted-foreground/60 text-[10px] font-bold uppercase">{m.propsGeometry}</h4>
        <div className="grid grid-cols-2 gap-4">
          <NumberInput label="X" value={activeProps.x}      onChange={(v) => update({ x: v })}      unit="mm" />
          <NumberInput label="Y" value={activeProps.y}      onChange={(v) => update({ y: v })}      unit="mm" />
          <NumberInput label="W" value={activeProps.width}  onChange={(v) => update({ width: v })}  unit="mm" />
          <NumberInput label="H" value={activeProps.height} onChange={(v) => update({ height: v })} unit="mm" />
        </div>
        <div className="pt-2">
          <NumberInput
            label="Rot"
            value={Math.round(activeProps.rotation ?? 0)}
            onChange={(v) => update({ angle: v })}
            unit="°"
          />
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-muted-foreground/60 text-[10px] font-bold uppercase">{m.propsAppearance}</h4>
        <div className="flex items-center justify-between">
          <span className="text-xs">{m.propsOpacity}</span>
          <NumberInput
            value={Math.round((activeProps.opacity ?? 1) * 100)}
            onChange={(v) => update({ opacity: v / 100 })}
            unit="%"
            min={0}
            max={100}
          />
        </div>
      </section>
    </div>
  )
}
