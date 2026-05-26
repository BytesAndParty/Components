import { useState, type RefObject } from 'react'
import * as fabric from 'fabric'
import { cn } from '../../../lib/utils'
import { interpolate } from '../../../i18n'
import { LayerPanel, type Layer } from '../../../layer-panel/layer-panel'
import { PropertiesPanel } from './PropertiesPanel'
import { BackgroundPanel } from './BackgroundPanel'
import { WineFieldsPanel } from './WineFieldsPanel'
import { useCellarCanvasMessages } from '../../messages-context'
import type { FabricBridge } from '../../engine/fabric-bridge'
import type { FabricObjectMeta, FabricObjectProperties } from '../../store/types'
import type { CellarCanvasMessages } from '../../messages'
import type { WineFieldValues } from '../../CellarCanvas'

type Tab = 'props' | 'fields' | 'background'

function buildTabs(m: CellarCanvasMessages): { id: Tab; label: string }[] {
  return [
    { id: 'props',      label: m.tabProperties },
    { id: 'fields',     label: m.tabWineData },
    { id: 'background', label: m.tabBackground },
  ]
}

export interface RightPanelProps {
  bridge:           RefObject<FabricBridge | null>
  activeProps:      FabricObjectProperties | null
  layers:           Layer[]
  setLayers:        (layers: Layer[]) => void
  selectedIds:      string[]
  backgroundColor:  string
  wineFields:       WineFieldValues
}

/**
 * Right side-bar: tabbed inspector (Properties / Wine Data / Background) on
 * top, layer list at the bottom. Tab state is local — switching tabs is a
 * pure view concern.
 *
 * Layer mutations call back into the bridge and immediately mirror the new
 * list into `setLayers` because Fabric's stack-order mutations don't emit an
 * event our sync hook listens to.
 */
export function RightPanel({
  bridge,
  activeProps,
  layers,
  setLayers,
  selectedIds,
  backgroundColor,
  wineFields,
}: RightPanelProps) {
  const m = useCellarCanvasMessages()
  const tabs = buildTabs(m)
  const [tab, setTab] = useState<Tab>('props')

  const refreshLayers = () => setLayers(bridge.current?.getLayers() ?? [])

  return (
    <aside className="border-l border-border bg-card flex flex-col" style={{ gridRow: '3' }}>
      <div className="flex border-b border-border">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            data-tour={id === 'fields' ? 'wine-data-tab' : undefined}
            onClick={() => setTab(id)}
            className={cn(
              "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors border-b-2",
              tab === id
                ? "text-primary border-primary"
                : "text-muted-foreground hover:text-foreground border-transparent"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {tab === 'props'      && <PropertiesPanel bridge={bridge} activeProps={activeProps} />}
        {tab === 'fields'     && <WineFieldsPanel bridge={bridge} values={wineFields} />}
        {tab === 'background' && <BackgroundPanel bridge={bridge} color={backgroundColor} />}
      </div>

      <div data-tour="layers-section" className="p-4 border-t border-border bg-muted/10">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[10px] font-bold uppercase text-muted-foreground">{m.layersHeading}</span>
          <span className="text-[10px] font-mono text-muted-foreground">{interpolate(m.layersCount, { count: layers.length })}</span>
        </div>
        <LayerPanel
          layers={layers}
          selectedIds={selectedIds}
          onSelect={(id) => {
            const canvas = bridge.current?.canvas
            const obj = canvas?.getObjects().find((o) => (o as fabric.Object & FabricObjectMeta).id === id)
            if (canvas && obj) {
              canvas.setActiveObject(obj)
              canvas.requestRenderAll()
            }
          }}
          onReorder={(newLayers) => {
            bridge.current?.reorderLayers(newLayers.map(l => l.id))
            refreshLayers()
          }}
          onVisibilityToggle={(id) => {
            bridge.current?.setLayerVisibility(id, !layers.find(l => l.id === id)?.visible)
            refreshLayers()
          }}
          onLockToggle={(id) => {
            bridge.current?.setLayerLocked(id, !layers.find(l => l.id === id)?.locked)
            refreshLayers()
          }}
          onRename={(id, name) => {
            bridge.current?.renameLayer(id, name)
            refreshLayers()
          }}
          onDelete={(id) => bridge.current?.deleteLayer(id)}
        />
      </div>
    </aside>
  )
}
