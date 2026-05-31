import { type RefObject } from 'react'
import { ColorSwatch } from '../../../color-swatch/color-swatch'
import { useCellarCanvasMessages } from '../../messages-context'
import type { FabricBridge } from '../../engine/fabric-bridge'

export interface BackgroundPanelProps {
  bridge: RefObject<FabricBridge | null>
  color:  string
}

/**
 * Canvas-background controls. Currently solid colour only — gradient + image
 * are tracked in STATUS.md but not yet wired up.
 */
export function BackgroundPanel({ bridge, color }: BackgroundPanelProps) {
  const m = useCellarCanvasMessages()
  return (
    <section className="space-y-3">
      <h4 className="text-muted-foreground/60 text-[10px] font-bold uppercase">{m.bgHeading}</h4>
      <div className="bg-card border-border flex h-9 items-center justify-between rounded-lg border px-1">
        <span className="text-muted-foreground pl-2 text-xs">{m.bgFill}</span>
        <ColorSwatch
          value={color}
          onChange={(v) => bridge.current?.setBackground(v)}
          label="■"
          title={m.bgFillTitle}
        />
      </div>
    </section>
  )
}
