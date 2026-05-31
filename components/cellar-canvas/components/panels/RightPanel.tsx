import { useState, type RefObject } from 'react'
import * as fabric from 'fabric'
import { cn } from '../../../lib/utils'
import { interpolate } from '../../../i18n'
import { LayerPanel, type Layer } from '../../../layer-panel/layer-panel'
import { PropertiesPanel } from './PropertiesPanel'
import { BackgroundPanel } from './BackgroundPanel'
import { WineFieldsPanel } from './WineFieldsPanel'
import { ExtrasPanel } from './ExtrasPanel'
import { useCellarCanvasMessages } from '../../messages-context'
import type { FabricBridge } from '../../engine/fabric-bridge'
import type { FabricObjectMeta, FabricObjectProperties } from '../../store/types'
import type { CellarCanvasMessages } from '../../messages'
import type { WineFieldValues } from '../../CellarCanvas'

type Tab = 'props' | 'fields' | 'background' | 'extras'

function buildTabs(m: CellarCanvasMessages): { id: Tab; label: string }[] {
  return [
    { id: 'props',      label: m.tabProperties },
    { id: 'fields',     label: m.tabWineData },
    { id: 'background', label: m.tabBackground },
    { id: 'extras',     label: m.tabExtras },
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
    <aside className="border-border bg-card flex flex-col border-l" style={{ gridRow: '3' }}>
      <div className="border-border flex border-b">
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
        {tab === 'fields'     && <WineFieldsPanel bridge={bridge} values={wineFields} layers={layers} />}
        {tab === 'background' && <BackgroundPanel bridge={bridge} color={backgroundColor} />}
        {tab === 'extras'     && <ExtrasPanel bridge={bridge} />}
      </div>

      <div data-tour="layers-section" className="border-border bg-muted/10 border-t p-4">
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="text-muted-foreground text-[10px] font-bold uppercase">{m.layersHeading}</span>
          <span className="text-muted-foreground font-mono text-[10px]">{interpolate(m.layersCount, { count: layers.length })}</span>
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
