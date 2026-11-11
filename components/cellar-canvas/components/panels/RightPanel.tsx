import { type ReactNode, type RefObject } from 'react'
import { Accordion } from '@ark-ui/react/accordion'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { LayerPanel, type Layer } from '../../../layer-panel/layer-panel'
import { PropertiesPanel } from './PropertiesPanel'
import { BackgroundPanel } from './BackgroundPanel'
import { WineFieldsPanel } from './WineFieldsPanel'
import { TemplatesPanel } from './TemplatesPanel'
import { useCellarCanvasMessages } from '../../messages-context'
import type { FabricBridge } from '../../engine/fabric-bridge'
import type { FabricObjectProperties, LabelBackground } from '../../store/types'
import type { WineFieldValues } from '../../CellarCanvas'

export interface RightPanelProps {
  /** Referenced by the header's settings toggle (`aria-controls`). */
  id:          string
  /** Narrow editors only: whether the panel is shown over the canvas. */
  open:        boolean
  bridge:      RefObject<FabricBridge | null>
  activeProps: FabricObjectProperties | null
  layers:      Layer[]
  setLayers:   (layers: Layer[]) => void
  selectedIds: string[]
  background:  LabelBackground
  wineFields:  WineFieldValues
}

/**
 * Settings on the right, one collapsible section each: wine data, background,
 * templates, position & size, layers. Several can be open at once. In a wide
 * editor the panel is its own column; in a narrow one it lies over the right
 * edge of the canvas and the header toggles it.
 *
 * Layer mutations call back into the bridge and immediately mirror the new
 * list into `setLayers` because Fabric's stack-order mutations don't emit an
 * event our sync hook listens to.
 */
export function RightPanel({
  id,
  open,
  bridge,
  activeProps,
  layers,
  setLayers,
  selectedIds,
  background,
  wineFields,
}: RightPanelProps) {
  const m = useCellarCanvasMessages()

  const refreshLayers = () => setLayers(bridge.current?.getLayers() ?? [])

  return (
    <aside
      id={id}
      aria-label={m.panelLabel}
      className={cn(
        'border-border bg-card z-20 col-start-2 row-start-3 min-h-0 w-[min(100%,20rem)] justify-self-end overflow-y-auto border-l shadow-2xl [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin]',
        '@4xl/editor:col-start-3 @4xl/editor:block @4xl/editor:w-auto @4xl/editor:justify-self-stretch @4xl/editor:shadow-none',
        open ? 'block' : 'hidden',
      )}
    >
      <Accordion.Root multiple defaultValue={['wine', 'layers']}>
        <Section value="wine" title={m.sectionWineData}>
          <WineFieldsPanel bridge={bridge} values={wineFields} layers={layers} />
        </Section>

        <Section value="background" title={m.sectionBackground}>
          <BackgroundPanel bridge={bridge} background={background} />
        </Section>

        <Section value="templates" title={m.sectionTemplates}>
          <TemplatesPanel bridge={bridge} wineFields={wineFields} hasObjects={layers.length > 0} />
        </Section>

        <Section value="geometry" title={m.sectionGeometry}>
          <PropertiesPanel bridge={bridge} activeProps={activeProps} />
        </Section>

        <Section value="layers" title={m.sectionLayers} count={layers.length}>
          <LayerPanel
            showHeader={false}
            className="rounded-lg"
            layers={layers}
            selectedIds={selectedIds}
            onSelect={(layerId) => bridge.current?.selectLayer(layerId)}
            onReorder={(newLayers) => {
              bridge.current?.reorderLayers(newLayers.map(l => l.id))
              refreshLayers()
            }}
            onVisibilityToggle={(layerId) => {
              bridge.current?.setLayerVisibility(layerId, !layers.find(l => l.id === layerId)?.visible)
              refreshLayers()
            }}
            onLockToggle={(layerId) => {
              bridge.current?.setLayerLocked(layerId, !layers.find(l => l.id === layerId)?.locked)
              refreshLayers()
            }}
            onRename={(layerId, name) => {
              bridge.current?.renameLayer(layerId, name)
              refreshLayers()
            }}
            onDelete={(layerId) => bridge.current?.deleteLayer(layerId)}
          />
        </Section>
      </Accordion.Root>
    </aside>
  )
}

function Section({
  value,
  title,
  count,
  children,
}: {
  value:    string
  title:    string
  /** Shown muted next to the title (number of layers). */
  count?:   number
  children: ReactNode
}) {
  return (
    <Accordion.Item value={value} className="border-border border-b">
      <h3>
        <Accordion.ItemTrigger className="text-foreground hover:bg-muted/40 focus-visible:ring-accent/60 flex min-h-11 w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset">
          <span>
            {title}
            {count !== undefined && <span className="text-muted-foreground ml-2 font-normal">{count}</span>}
          </span>
          <Accordion.ItemIndicator className="text-muted-foreground transition-transform data-[state=open]:rotate-180">
            <ChevronDown size={14} aria-hidden />
          </Accordion.ItemIndicator>
        </Accordion.ItemTrigger>
      </h3>
      <Accordion.ItemContent className="px-4 pb-4">{children}</Accordion.ItemContent>
    </Accordion.Item>
  )
}
