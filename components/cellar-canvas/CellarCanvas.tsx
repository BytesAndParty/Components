import * as fabric from 'fabric'
import { useFabricCanvas } from './engine/use-fabric-canvas'
import { LabelCanvas } from './components/canvas/LabelCanvas'
import { useDesignerStore } from './store/designer-store'
import { MainToolbar } from './components/toolbar/MainToolbar'
import { ContextToolbar } from './components/toolbar/ContextToolbar'
import { NumberInput } from './components/shared'
import { LayerPanel, type Layer } from '../layer-panel/layer-panel'
import { WineFieldsPanel } from './components/panels/WineFieldsPanel'
import { ValidatorBadge, type ValidationWarning } from '../validator-badge/validator-badge'
import { validateCompliance } from './wine-fields/validator'
import { useEffect, useState, useRef } from 'react'
import { cn } from '../lib/utils'
import { Maximize2, Minimize2 } from 'lucide-react'
import type { FabricObjectProperties, FabricObjectMeta } from './store/types'

export interface WineFieldValues {
  name?:               string
  vintage?:            string | number
  alcoholPercent?:     string | number
  volumeMl?:           string | number
  region?:             string
  grapes?:             string
  producer?:           string
  countryOfOrigin?:    string
  sugarContent?:       string
  energyKcal?:         string | number
  allergenNote?:       string
  nutritionalInfoUrl?: string
}

export interface CellarCanvasProps {
  // Dimensions
  widthMm?:  number
  heightMm?: number

  // Pre-fill
  initialWineFields?:   WineFieldValues
  initialState?:        object // Fabric JSON

  // Export
  exportDpi?:           number
  enablePdfExport?:     boolean

  // Callbacks
  onChange?:            (state: object) => void
  onSave?:              (state: object) => Promise<void>
  onExport?:            (result: { format: 'png' | 'pdf'; blob: Blob }) => void
  onValidationChange?:  (warnings: string[]) => void

  // Styling
  height?:    string | number
  className?: string
  style?:     React.CSSProperties
}

export function CellarCanvas({
  widthMm = 90,
  heightMm = 120,
  initialWineFields = {
    name: 'Château des Vignes',
    vintage: '2021',
    alcoholPercent: '13.5%',
    volumeMl: '750ml',
    nutritionalInfoUrl: 'https://wine-info.eu/vignes-2021'
  },
  className,
  style,
  height = '80vh',
}: CellarCanvasProps) {
  const { canvasRef, bridge } = useFabricCanvas({ widthMm, heightMm })
  const selectedIds = useDesignerStore(s => s.selectedIds)
  const [activeProps, setActiveProps] = useState<FabricObjectProperties | null>(null)
  const [layers, setLayers] = useState<Layer[]>([])
  const [warnings, setWarnings] = useState<ValidationWarning[]>([])
  const [rightTab, setRightTab] = useState<'props' | 'fields'>('props')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Monitor fullscreen changes (e.g. via Escape key)
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  // Initial Zoom to Fit
  useEffect(() => {
    const timeout = setTimeout(() => {
      bridge.current?.zoomToFit()
    }, 100)
    return () => clearTimeout(timeout)
  }, [bridge, isFullscreen])

  // Sync properties, layers and validation
  useEffect(() => {
    const update = () => {
      setActiveProps(bridge.current?.getActiveObjectProperties())
      const currentLayers = bridge.current?.getLayers() || []
      setLayers(currentLayers)
      
      // For validation, we need the raw objects with _fieldKey
      const rawObjects = (bridge.current?.canvas.getObjects() ?? []) as unknown as FabricObjectMeta[]
      setWarnings(validateCompliance(rawObjects))
    }
    const canvas = bridge.current?.canvas
    if (canvas) {
      canvas.on('selection:created', update)
      canvas.on('selection:updated', update)
      canvas.on('selection:cleared', update)
      canvas.on('object:modified', update)
      canvas.on('object:moving', update)
      canvas.on('object:scaling', update)
      canvas.on('object:rotating', update)
      canvas.on('object:added', update)
      canvas.on('object:removed', update)
    }
    update() // Initial sync
    return () => {
      canvas?.off('selection:created', update)
      canvas?.off('selection:updated', update)
      canvas?.off('selection:cleared', update)
      canvas?.off('object:modified', update)
      canvas?.off('object:moving', update)
      canvas?.off('object:scaling', update)
      canvas?.off('object:rotating', update)
      canvas?.off('object:added', update)
      canvas?.off('object:removed', update)
    }
  }, [bridge, selectedIds])

  return (
    <div 
      ref={containerRef}
      className={cn("bg-background transition-all duration-300", className, isFullscreen && "p-4")}
      style={{ 
        ...style, 
        height: isFullscreen ? '100vh' : height,
        display: 'grid',
        gridTemplateColumns: 'auto 1fr 300px',
        gridTemplateRows: '48px 48px 1fr',
      }}
    >
      {/* Area Tabs (Top) - Simplified */}
      <div className="border-b border-border flex items-center px-4 h-12 bg-card/50" style={{ gridColumn: '1 / -1' }}>
        <h2 className="text-xs font-bold tracking-widest uppercase opacity-50">Cellar Canvas</h2>
        <div className="mx-6 h-4 w-px bg-border" />
        <div className="flex-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Standard Label ({widthMm}x{heightMm}mm)
        </div>
        <button 
          onClick={toggleFullscreen}
          className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      {/* Context Toolbar */}
      <div className="border-b border-border bg-card flex items-center justify-between pr-4" style={{ gridColumn: '2 / -1' }}>
        <ContextToolbar bridge={bridge} />
        <button 
          onClick={() => bridge.current?.zoomToFit()}
          className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 hover:bg-muted rounded border border-border transition-colors text-muted-foreground hover:text-foreground"
        >
          Fit to Screen
        </button>
      </div>

      {/* Main Toolbar (Left) */}
      <div style={{ gridRow: '2 / -1' }}>
        <MainToolbar bridge={bridge} />
      </div>

      {/* Canvas Area (Center) */}
      <main className="relative overflow-hidden bg-muted/20 flex flex-col" style={{ gridRow: '3' }}>
        {/* Canvas Centerer */}
        <div className="flex-1 flex items-center justify-center p-12 overflow-auto">
           <LabelCanvas ref={canvasRef} />
        </div>

        {/* Floating Validator Badge — bottom-right of canvas area (per spec) */}
        <div className="absolute bottom-4 right-4 z-10 pointer-events-auto">
          <ValidatorBadge warnings={warnings} />
        </div>
      </main>

      {/* Right Panel */}
      <aside className="border-l border-border bg-card flex flex-col" style={{ gridRow: '3' }}>
        <div className="flex border-b border-border">
          <button 
            onClick={() => setRightTab('props')}
            className={cn(
              "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors border-b-2",
              rightTab === 'props' ? "text-primary border-primary" : "text-muted-foreground hover:text-foreground border-transparent"
            )}
          >
            Properties
          </button>
          <button 
            onClick={() => setRightTab('fields')}
            className={cn(
              "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors border-b-2",
              rightTab === 'fields' ? "text-primary border-primary" : "text-muted-foreground hover:text-foreground border-transparent"
            )}
          >
            Wine Data
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {rightTab === 'props' ? (
            activeProps ? (
              <div className="space-y-6">
                <section className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase text-muted-foreground/60">Geometry</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <NumberInput label="X" value={activeProps.x} onChange={(v) => bridge.current?.updateActiveObject({ x: v })} unit="mm" />
                    <NumberInput label="Y" value={activeProps.y} onChange={(v) => bridge.current?.updateActiveObject({ y: v })} unit="mm" />
                    <NumberInput label="W" value={activeProps.width} onChange={(v) => bridge.current?.updateActiveObject({ width: v })} unit="mm" />
                    <NumberInput label="H" value={activeProps.height} onChange={(v) => bridge.current?.updateActiveObject({ height: v })} unit="mm" />
                  </div>
                  <div className="pt-2">
                     <NumberInput label="Rot" value={Math.round(activeProps.rotation || 0)} onChange={(v) => bridge.current?.updateActiveObject({ angle: v })} unit="°" />
                  </div>
                </section>

                <section className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase text-muted-foreground/60">Appearance</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Opacity</span>
                    <NumberInput value={Math.round((activeProps.opacity || 1) * 100)} onChange={(v) => bridge.current?.updateActiveObject({ opacity: v / 100 })} unit="%" min={0} max={100} />
                  </div>
                </section>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center p-8">
                <p className="text-xs text-muted-foreground italic">
                  Select an object on the canvas to edit its properties.
                </p>
              </div>
            )
          ) : (
            <WineFieldsPanel bridge={bridge} values={initialWineFields} />
          )}
        </div>

        <div className="p-4 border-t border-border bg-muted/10">
           <div className="flex items-center justify-between mb-2 px-1">
             <span className="text-[10px] font-bold uppercase text-muted-foreground">Layers</span>
             <span className="text-[10px] font-mono text-muted-foreground">{layers.length} total</span>
           </div>
           <LayerPanel 
             layers={layers}
             selectedIds={selectedIds}
             onSelect={(id) => {
               const obj = bridge.current?.canvas.getObjects().find((o) => (o as fabric.Object & FabricObjectMeta).id === id)
               if (obj) bridge.current?.canvas.setActiveObject(obj).renderAll()
             }}
             onReorder={(newLayers) => bridge.current?.reorderLayers(newLayers.map(l => l.id))}
             onVisibilityToggle={(id) => bridge.current?.setLayerVisibility(id, !layers.find(l => l.id === id)?.visible)}
             onLockToggle={(id) => bridge.current?.setLayerLocked(id, !layers.find(l => l.id === id)?.locked)}
             onRename={(id, name) => bridge.current?.renameLayer(id, name)}
             onDelete={(id) => bridge.current?.deleteLayer(id)}
           />
        </div>
      </aside>
    </div>
  )
}
