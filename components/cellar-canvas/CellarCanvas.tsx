import * as fabric from 'fabric'
import { useFabricCanvas, BLEED_MM } from './engine/use-fabric-canvas'
import { useClipboardPaste } from './engine/use-clipboard-paste'
import { LabelCanvas, type LabelBackdrop } from './components/canvas/LabelCanvas'
import { mmToPx } from './engine/units'
import { useDesignerStore } from './store/designer-store'
import { MainToolbar } from './components/toolbar/MainToolbar'
import { ContextToolbar } from './components/toolbar/ContextToolbar'
import { NumberInput } from './components/shared'
import { ColorSwatch } from '../color-swatch/color-swatch'
import { LayerPanel, type Layer } from '../layer-panel/layer-panel'
import { WineFieldsPanel } from './components/panels/WineFieldsPanel'
import { ValidatorBadge, type ValidationWarning } from '../validator-badge/validator-badge'
import { validateCompliance } from './wine-fields/validator'
import { useEffect, useState, useRef } from 'react'
import { cn } from '../lib/utils'
import { Maximize2, Minimize2, Check, Loader2, Eye, EyeOff } from 'lucide-react'
import { useDesignEngineHotkey } from '../hotkeys/hotkeys-provider'
import type { CellarCanvasState, FabricObjectProperties, FabricObjectMeta } from './store/types'

// Bleed dimming around the label. Design view stays semi-transparent so
// objects bleeding out are still readable; preview goes fully opaque to
// emulate the actual print result (everything outside the printable area
// is hidden, only the label itself shows through).
const BLEED_MASK_OPACITY_DESIGN = 0.55
const BLEED_MASK_OPACITY_PREVIEW = 1

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
  initialState?:        CellarCanvasState | object

  // Persistence
  /** localStorage key for the debounced autosave draft. Pass `null` to opt out. Default: `'cellar-canvas-draft'`. */
  storageKey?:          string | null

  // Export
  exportDpi?:           number
  enablePdfExport?:     boolean

  // Validation
  enableValidator?:     boolean // default: true

  // Callbacks
  onChange?:            (state: CellarCanvasState) => void
  onSave?:              (state: CellarCanvasState) => Promise<void>
  onExport?:            (result: { format: 'png' | 'pdf'; blob: Blob }) => void
  onValidationChange?:  (warnings: string[]) => void

  // Styling
  height?:    string | number
  className?: string
  style?:     React.CSSProperties
}

/**
 * Maps Fabric's current view (zoom + viewport translation) onto the DOM
 * coordinates of the CSS-rendered label backdrop. Keeps the white "label
 * card" pinned to where Fabric is drawing user content.
 */
function computeBackdrop({
  widthMm,
  heightMm,
  viewport,
  color,
}: {
  widthMm: number
  heightMm: number
  viewport: { zoom: number; tx: number; ty: number }
  color: string
}): LabelBackdrop {
  const bleedPx = mmToPx(BLEED_MM)
  const labelW  = mmToPx(widthMm)
  const labelH  = mmToPx(heightMm)
  return {
    left:   viewport.tx + bleedPx * viewport.zoom,
    top:    viewport.ty + bleedPx * viewport.zoom,
    width:  labelW * viewport.zoom,
    height: labelH * viewport.zoom,
    color,
  }
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
  initialState,
  storageKey = 'cellar-canvas-draft',
  enableValidator = true,
  onChange,
  onSave,
  className,
  style,
  height = '80vh',
}: CellarCanvasProps) {
  const { canvasRef, bridge } = useFabricCanvas({ widthMm, heightMm })
  const selectedIds = useDesignerStore(s => s.selectedIds)
  const [activeProps, setActiveProps] = useState<FabricObjectProperties | null>(null)
  const [layers, setLayers] = useState<Layer[]>([])
  const [warnings, setWarnings] = useState<ValidationWarning[]>([])
  const [rightTab, setRightTab] = useState<'props' | 'fields' | 'background'>('props')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [viewport, setViewport] = useState({ zoom: 1, tx: 0, ty: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const isDirty = useDesignerStore(s => s.isDirty)
  const containerRef = useRef<HTMLDivElement>(null)

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev)
  }

  // CSS fullscreen instead of the browser Fullscreen API: requestFullscreen
  // restricts focus to descendants of the fullscreen element, which Fabric's
  // hiddenTextarea cannot reliably satisfy across reparenting attempts —
  // typing into edited text silently drops. Escape exits the visual mode.
  useEffect(() => {
    if (!isFullscreen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isFullscreen])

  // Restore on mount: explicit initialState wins over the localStorage draft.
  // Then fit-to-viewport. Bridge construction is async-ish (next tick after
  // canvas mount), so we wait briefly before talking to it.
  useEffect(() => {
    const timeout = setTimeout(async () => {
      const b = bridge.current
      if (!b) return
      if (initialState) {
        await b.restoreState(initialState)
      } else if (storageKey) {
        const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(storageKey) : null
        if (stored) {
          try {
            await b.restoreState(JSON.parse(stored))
          } catch {
            // Corrupted draft — start fresh.
          }
        }
      }
      b.zoomToFit()
      // Restore is not a user edit — clear dirty flag.
      useDesignerStore.getState().setDirty(false)
    }, 100)
    return () => clearTimeout(timeout)
  }, [bridge, isFullscreen, widthMm, heightMm, initialState, storageKey])

  // Debounced autosave + onChange. localStorage holds the draft; onChange is
  // the embedding app's hook to mirror to its own store / backend.
  useEffect(() => {
    const bridgeInstance = bridge.current
    if (!bridgeInstance) return

    let timer: ReturnType<typeof setTimeout> | null = null
    const flush = () => {
      const state = bridgeInstance.serializeState()
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(state))
        } catch {
          // Quota / privacy mode — silent.
        }
      }
      onChange?.(state)
    }
    const debounced = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(flush, 1000)
    }

    const canvas = bridgeInstance.canvas
    canvas.on('object:added', debounced)
    canvas.on('object:removed', debounced)
    canvas.on('object:modified', debounced)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(canvas as any).on('cellar:property-changed', debounced)

    return () => {
      if (timer) clearTimeout(timer)
      canvas.off('object:added', debounced)
      canvas.off('object:removed', debounced)
      canvas.off('object:modified', debounced)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(canvas as any).off('cellar:property-changed', debounced)
    }
  }, [bridge, storageKey, onChange])

  async function handleSave() {
    if (!onSave || saveStatus === 'saving') return
    const state = bridge.current?.serializeState()
    if (!state) return
    setSaveStatus('saving')
    try {
      await onSave(state)
      useDesignerStore.getState().setDirty(false)
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 1500)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 2500)
    }
  }

  // Sync properties, layers and validation
  useEffect(() => {
    const bridgeInstance = bridge.current
    if (!bridgeInstance) return

    const update = () => {
      setActiveProps(bridgeInstance.getActiveObjectProperties())
      const currentLayers = bridgeInstance.getLayers() || []
      setLayers(currentLayers)
      setBackgroundColor(bridgeInstance.getBackground())
      const vpt = bridgeInstance.canvas.viewportTransform
      setViewport({
        zoom: bridgeInstance.canvas.getZoom(),
        tx: vpt?.[4] ?? 0,
        ty: vpt?.[5] ?? 0,
      })

      if (enableValidator) {
        const rawObjects = (bridgeInstance.canvas.getObjects() ?? []) as unknown as FabricObjectMeta[]
        setWarnings(validateCompliance(rawObjects))
      }
    }

    const onModified = () => {
      update()
      bridgeInstance.saveHistory()
    }

    const canvas = bridgeInstance.canvas
    canvas.on('selection:created', update)
    canvas.on('selection:updated', update)
    canvas.on('selection:cleared', update)
    canvas.on('object:modified', onModified)
    canvas.on('object:moving', update)
    canvas.on('object:scaling', update)
    canvas.on('object:rotating', update)
    canvas.on('object:added', update)
    canvas.on('object:removed', update)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(canvas as any).on('cellar:property-changed', update)

    update() // Initial sync

    return () => {
      canvas.off('selection:created', update)
      canvas.off('selection:updated', update)
      canvas.off('selection:cleared', update)
      canvas.off('object:modified', onModified)
      canvas.off('object:moving', update)
      canvas.off('object:scaling', update)
      canvas.off('object:rotating', update)
      canvas.off('object:added', update)
      canvas.off('object:removed', update)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(canvas as any).off('cellar:property-changed', update)
    }
  }, [bridge, enableValidator]) // No longer depends on selectedIds or layers

  // Clipboard paste — image data on the clipboard lands as a Fabric image.
  // We revoke the blob URL once Fabric has loaded the image into its cache.
  useClipboardPaste(async (url) => {
    try {
      await bridge.current?.addImage(url)
    } finally {
      URL.revokeObjectURL(url)
    }
  })

  // Keyboard Shortcuts via TanStack
  useDesignEngineHotkey('mod+z', () => bridge.current?.undo(), {
    label: 'Undo',
    category: 'Actions',
    description: 'Reverse the last change'
  })

  useDesignEngineHotkey('mod+shift+z', () => bridge.current?.redo(), {
    label: 'Redo',
    category: 'Actions',
    description: 'Reapply a reversed change'
  })

  useDesignEngineHotkey('delete, backspace', () => {
    const active = document.activeElement
    if (active?.tagName !== 'INPUT' && active?.tagName !== 'TEXTAREA') {
      bridge.current?.deleteSelected()
    }
  }, {
    label: 'Delete',
    category: 'Actions',
    description: 'Remove selected object'
  })

  return (
    <div
      ref={containerRef}
      className={cn(
        "bg-background transition-all duration-300",
        className,
        isFullscreen && "fixed inset-0 z-50 p-4"
      )}
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
        <div className="flex items-center gap-1 mr-4">
           <button
             onClick={() => bridge.current?.undo()}
             className="p-2 hover:bg-muted rounded-md text-muted-foreground transition-colors"
             title="Undo (Cmd+Z)"
           >
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
           </button>
           <button
             onClick={() => bridge.current?.redo()}
             className="p-2 hover:bg-muted rounded-md text-muted-foreground transition-colors"
             title="Redo (Cmd+Shift+Z)"
           >
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13"/></svg>
           </button>
           {onSave && (
             <button
               onClick={handleSave}
               disabled={saveStatus === 'saving' || (!isDirty && saveStatus === 'idle')}
               className={cn(
                 "ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-colors",
                 saveStatus === 'success'
                   ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600"
                   : saveStatus === 'error'
                     ? "border-destructive/40 bg-destructive/10 text-destructive"
                     : isDirty
                       ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                       : "border-border text-muted-foreground opacity-60",
               )}
               title={isDirty ? "Save changes" : "All changes saved"}
             >
               {saveStatus === 'saving'
                 ? (<><Loader2 size={12} className="animate-spin" /> Saving…</>)
                 : saveStatus === 'success'
                   ? (<><Check size={12} /> Saved</>)
                   : saveStatus === 'error'
                     ? 'Retry'
                     : isDirty ? 'Save' : 'Saved'}
             </button>
           )}
        </div>
        <button
          onClick={() => setPreviewMode(p => !p)}
          className={cn(
            "p-2 rounded-md transition-colors mr-1",
            previewMode
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
          title={previewMode ? "Exit Preview (show bleed)" : "Preview (hide bleed area)"}
          aria-pressed={previewMode}
        >
          {previewMode ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
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
           <LabelCanvas
             ref={canvasRef}
             backdrop={computeBackdrop({ widthMm, heightMm, viewport, color: backgroundColor })}
             widthMm={widthMm}
             heightMm={heightMm}
             bleedMm={BLEED_MM}
             bleedMaskOpacity={previewMode ? BLEED_MASK_OPACITY_PREVIEW : BLEED_MASK_OPACITY_DESIGN}
             bleedMaskColor="var(--background)"
           />
        </div>

        {/* Floating Validator Badge — bottom-right of canvas area (per spec) */}
        {enableValidator && (
          <div className="absolute bottom-4 right-4 z-10 pointer-events-auto">
            <ValidatorBadge warnings={warnings} />
          </div>
        )}
      </main>

      {/* Right Panel */}
      <aside className="border-l border-border bg-card flex flex-col" style={{ gridRow: '3' }}>
        <div className="flex border-b border-border">
          {(['props', 'fields', 'background'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setRightTab(tab)}
              className={cn(
                "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors border-b-2",
                rightTab === tab ? "text-primary border-primary" : "text-muted-foreground hover:text-foreground border-transparent"
              )}
            >
              {tab === 'props' ? 'Properties' : tab === 'fields' ? 'Wine Data' : 'Background'}
            </button>
          ))}
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {rightTab === 'background' ? (
            <section className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase text-muted-foreground/60">Canvas Background</h4>
              <div className="flex items-center justify-between bg-card border border-border rounded-lg h-9 px-1">
                <span className="text-xs pl-2 text-muted-foreground">Fill</span>
                <ColorSwatch
                  value={backgroundColor}
                  onChange={(v) => bridge.current?.setBackground(v)}
                  label="■"
                  title="Canvas background"
                />
              </div>
            </section>
          ) : rightTab === 'props' ? (
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
               const canvas = bridge.current?.canvas
               const obj = canvas?.getObjects().find((o) => (o as fabric.Object & FabricObjectMeta).id === id)
               if (canvas && obj) {
                 canvas.setActiveObject(obj)
                 canvas.requestRenderAll()
               }
             }}
             onReorder={(newLayers) => {
               // Fabric's moveObjectTo doesn't fire an event our sync-effect listens to,
               // so we must mirror the new stack into local state ourselves — otherwise
               // LayerPanel re-renders with the stale array and the row snaps back.
               bridge.current?.reorderLayers(newLayers.map(l => l.id))
               setLayers(bridge.current?.getLayers() || [])
             }}
             onVisibilityToggle={(id) => {
               bridge.current?.setLayerVisibility(id, !layers.find(l => l.id === id)?.visible)
               setLayers(bridge.current?.getLayers() || [])
             }}
             onLockToggle={(id) => {
               bridge.current?.setLayerLocked(id, !layers.find(l => l.id === id)?.locked)
               setLayers(bridge.current?.getLayers() || [])
             }}
             onRename={(id, name) => {
               bridge.current?.renameLayer(id, name)
               setLayers(bridge.current?.getLayers() || [])
             }}
             onDelete={(id) => bridge.current?.deleteLayer(id)}
           />
        </div>
      </aside>
    </div>
  )
}
