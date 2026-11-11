import { type RefObject } from 'react'
import { NumberInput } from '../../../number-input/number-input'
import { useCellarCanvasMessages } from '../../messages-context'
import type { FabricBridge } from '../../engine/fabric-bridge'
import type { FabricObjectProperties } from '../../store/types'

export interface PropertiesPanelProps {
  bridge:      RefObject<FabricBridge | null>
  activeProps: FabricObjectProperties | null
}

/**
 * Exact position and size of the selected element. Values mirror what the
 * bridge serializes — mm for position / size (relative to the label's top-left
 * corner), degrees for rotation, 0–100 % for opacity. A hint when nothing is
 * selected.
 */
export function PropertiesPanel({ bridge, activeProps }: PropertiesPanelProps) {
  const m = useCellarCanvasMessages()
  if (!activeProps) {
    return <p className="text-muted-foreground text-xs">{m.propsEmpty}</p>
  }

  const update = (patch: Parameters<FabricBridge['updateActiveObject']>[0]) =>
    bridge.current?.updateActiveObject(patch)

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
      <NumberInput label="X" value={activeProps.x} onChange={(v) => update({ x: v })} unit="mm" />
      <NumberInput label="Y" value={activeProps.y} onChange={(v) => update({ y: v })} unit="mm" />
      <NumberInput label={m.propsWidth}  value={activeProps.width}  onChange={(v) => update({ width: v })}  unit="mm" />
      <NumberInput label={m.propsHeight} value={activeProps.height} onChange={(v) => update({ height: v })} unit="mm" />
      <NumberInput
        className="col-span-2"
        label={m.propsRotation}
        value={Math.round(activeProps.rotation ?? 0)}
        onChange={(v) => update({ angle: v })}
        unit="°"
      />
      <NumberInput
        className="col-span-2"
        label={m.propsOpacity}
        value={Math.round((activeProps.opacity ?? 1) * 100)}
        onChange={(v) => update({ opacity: v / 100 })}
        unit="%"
        min={0}
        max={100}
      />
    </div>
  )
}
