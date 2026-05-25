import { type RefObject } from 'react'
import { ColorSwatch } from '../../../color-swatch/color-swatch'
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
  return (
    <section className="space-y-3">
      <h4 className="text-[10px] font-bold uppercase text-muted-foreground/60">Canvas Background</h4>
      <div className="flex items-center justify-between bg-card border border-border rounded-lg h-9 px-1">
        <span className="text-xs pl-2 text-muted-foreground">Fill</span>
        <ColorSwatch
          value={color}
          onChange={(v) => bridge.current?.setBackground(v)}
          label="■"
          title="Canvas background"
        />
      </div>
    </section>
  )
}
