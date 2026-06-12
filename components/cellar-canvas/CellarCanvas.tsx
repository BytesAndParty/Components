import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import * as fabric from 'fabric'
import { cn } from '../lib/utils'
import { useComponentMessages } from '../i18n'
import { useFabricCanvas, BLEED_MM } from './engine/use-fabric-canvas'
import { imageSourceFromBlob } from './engine/image-source'
import { useClipboardPaste } from './engine/use-clipboard-paste'
import { useCanvasSync } from './engine/use-canvas-sync'
import { useCanvasAutosave } from './engine/use-canvas-autosave'
import { useCanvasRestore } from './engine/use-canvas-restore'
import { useDesignEngineHotkey } from '../hotkeys/hotkeys-context'
import { useDesignerStore } from './store/designer-store'
import { LabelCanvas, type LabelBackdrop } from './components/canvas/LabelCanvas'
import { MainToolbar } from './components/toolbar/MainToolbar'
import { ContextToolbar } from './components/toolbar/ContextToolbar'
import { CanvasHeader } from './components/header/CanvasHeader'
import { RightPanel } from './components/panels/RightPanel'
import { OnboardingTour } from './components/tour/OnboardingTour'
import { ImageCropperModal } from '../image-cropper-modal/image-cropper-modal'
import { ValidatorBadge } from '../validator-badge/validator-badge'
import { mmToPx } from './engine/units'
// PDF export is dynamically imported on click — keeps jspdf + html2canvas
// out of the initial designer chunk (≈590 kB of vendor code).
import { MESSAGES, type CellarCanvasMessages } from './messages'
import { MessagesProvider } from './messages-context'
import type { CellarCanvasState, FabricObjectMeta } from './store/types'
import type { CanvasViewport } from './engine/use-canvas-sync'

// Bleed dimming around the label. Design view stays semi-transparent so
// objects bleeding out are still readable; preview goes fully opaque to
// emulate the actual print result (everything outside the printable area
// is hidden, only the label itself shows through).
const BLEED_MASK_OPACITY_DESIGN  = 0.55
const BLEED_MASK_OPACITY_PREVIEW = 1

// EU-standard 3mm print-bleed safety margin. Visualised as a translucent strip
// at the label boundary to warn designers that content placed here might be lost.
const PRINT_BLEED_MM = 3

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
  initialWineFields?: WineFieldValues
  initialState?:      CellarCanvasState | object

  // Persistence
  /** localStorage key for the debounced autosave draft. Pass `null` to opt out. Default: `'cellar-canvas-draft'`. */
  storageKey?: string | null

  // Export
  exportDpi?:       number
  enablePdfExport?: boolean

  // Validation
  enableValidator?: boolean

  // Onboarding
  /** Skip the first-run guided tour. Default: false (tour auto-starts once). */
  disableTour?:    boolean
  /** localStorage key for the "tour seen" flag. Pass `null` to opt out. Default: `'cellar-canvas-tour-completed'`. */
  tourStorageKey?: string | null

  // i18n
  /** Override individual strings. Locale comes from the global I18nProvider. */
  messages?: Partial<CellarCanvasMessages>

  // Callbacks
  onChange?:           (state: CellarCanvasState) => void
  onSave?:             (state: CellarCanvasState) => Promise<void>
  onExport?:           (result: { format: 'png' | 'pdf'; blob: Blob }) => void
  onValidationChange?: (warnings: string[]) => void

  // Styling
  height?:    string | number
  className?: string
  style?:     React.CSSProperties
}

const DEFAULT_WINE_FIELDS: WineFieldValues = {
  name:               'Château des Vignes',
  vintage:            '2021',
  alcoholPercent:     '13.5%',
  volumeMl:           '750ml',
  nutritionalInfoUrl: 'https://wine-info.eu/vignes-2021',
}

/**
 * Maps Fabric's current view (zoom + viewport translation) onto the DOM
 * coordinates of the CSS-rendered label backdrop. Keeps the white "label
 * card" pinned to where Fabric is drawing user content.
 */
function computeBackdrop(
  widthMm:  number,
  heightMm: number,
  viewport: CanvasViewport,
  color:    string,
): LabelBackdrop {
  const bleedPx = mmToPx(BLEED_MM)
  return {
    left:   viewport.tx + bleedPx * viewport.zoom,
    top:    viewport.ty + bleedPx * viewport.zoom,
    width:  mmToPx(widthMm)  * viewport.zoom,
    height: mmToPx(heightMm) * viewport.zoom,
    color,
  }
}

export function CellarCanvas({
  widthMm           = 90,
  heightMm          = 120,
  initialWineFields = DEFAULT_WINE_FIELDS,
  initialState,
  storageKey        = 'cellar-canvas-draft',
  enableValidator   = true,
  disableTour       = false,
  tourStorageKey    = 'cellar-canvas-tour-completed',
  messages,
  onChange,
  onSave,
  onExport,
  className,
  style,
  height = '80vh',
}: CellarCanvasProps) {
  const m = useComponentMessages(MESSAGES, messages)
  const { canvasRef, bridge } = useFabricCanvas({ widthMm, heightMm })
  const selectedIds = useDesignerStore(s => s.selectedIds)

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [previewMode,  setPreviewMode]  = useState(false)

  // Fabric → React mirror. Selection, geometry, layers, validator warnings,
  // viewport transform, background colour. `setLayers` exists because some
  // bridge mutations (reorder/visibility/lock/rename) don't emit a Fabric
  // event the hook can subscribe to — the RightPanel mirrors locally.
  const { activeProps, layers, setLayers, warnings, backgroundColor, viewport } =
    useCanvasSync(bridge, { enableValidator })

  const cropperOpen     = useDesignerStore(s => s.cropperOpen)
  const cropperSrc      = useDesignerStore(s => s.cropperSrc)
  const cropperTargetId = useDesignerStore(s => s.cropperTargetId)
  const setCropper      = useDesignerStore(s => s.setCropper)

  useCanvasRestore(bridge, initialState, storageKey, { widthMm, heightMm, isFullscreen })
  useCanvasAutosave(bridge, storageKey, onChange)

  // Sync wine field text on the canvas when the incoming prop changes (e.g.
  // winemaker updated the vintage in the DB while the editor was open).
  // This ensures the label doesn't go stale without manual deletion/re-insertion.
  useEffect(() => {
    const b = bridge.current
    if (!b || !initialWineFields) return

    const objects = b.canvas.getObjects()
    let changed = false

    objects.forEach(obj => {
      const meta = obj as fabric.Object & FabricObjectMeta
      if (meta._type === 'wine-field' && meta._fieldKey && obj instanceof fabric.Textbox) {
        const newValue = (initialWineFields as Record<string, unknown>)[meta._fieldKey]
        if (newValue !== undefined && obj.text !== String(newValue)) {
          obj.set('text', String(newValue))
          changed = true
        }
      }
    })

    if (changed) {
      b.canvas.requestRenderAll()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(b.canvas as any).fire('cellar:property-changed', { target: null })
    }
  }, [bridge, initialWineFields])

  async function handleCrop(blob: Blob) {
    // Data URL, not createObjectURL: Fabric serializes `src` into history and
    // autosave and re-fetches it on loadFromJSON — blob: URLs would die there.
    const url = await imageSourceFromBlob(blob)
    if (cropperTargetId) {
      await bridge.current?.updateImageSource(cropperTargetId, url)
    } else {
      await bridge.current?.addImage(url)
    }
  }

  async function handleExportPdf() {
    const b = bridge.current
    if (!b) return
    const { exportLabelPdf, downloadBlob } = await import('./engine/export-pipeline')
    const blob = exportLabelPdf(b)
    downloadBlob(blob, `${m.exportFilename}.pdf`)
    onExport?.({ format: 'pdf', blob })
  }

  // CSS fullscreen instead of the browser Fullscreen API: requestFullscreen
  // restricts focus to descendants of the fullscreen element, which Fabric's
  // hiddenTextarea cannot reliably satisfy across reparenting attempts —
  // typing into edited text silently drops. Escape exits the visual mode.
  useEffect(() => {
    if (!isFullscreen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isFullscreen])

  // Clipboard paste — image data on the clipboard lands as a Fabric image.
  useClipboardPaste(async (url) => {
    await bridge.current?.addImage(url)
  })

  useDesignEngineHotkey('mod+z', () => bridge.current?.undo(), {
    label:       m.hotkeyUndoLabel,
    category:    'Actions',
    description: m.hotkeyUndoDescription,
  })

  useDesignEngineHotkey('mod+shift+z', () => bridge.current?.redo(), {
    label:       m.hotkeyRedoLabel,
    category:    'Actions',
    description: m.hotkeyRedoDescription,
  })

  useDesignEngineHotkey('delete, backspace', () => {
    // Don't steal Delete/Backspace from text inputs — the user is typing.
    const tag = document.activeElement?.tagName
    if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
      bridge.current?.deleteSelected()
    }
  }, {
    label:       m.hotkeyDeleteLabel,
    category:    'Actions',
    description: m.hotkeyDeleteDescription,
  })

  useDesignEngineHotkey('s', () => {
    const { snappingEnabled, setSnappingEnabled } = useDesignerStore.getState()
    setSnappingEnabled(!snappingEnabled)
  }, {
    label:       m.hotkeySnappingLabel,
    category:    'Actions',
    description: m.hotkeySnappingDescription,
  })

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      void imageSourceFromBlob(file).then(src => setCropper({ open: true, src }))
    }
  }

  const shell = (
    <div
      className={cn(
        "bg-background transition-all duration-300",
        className,
        isFullscreen && "fixed inset-0 p-4",
      )}
      style={{
        ...style,
        height: isFullscreen ? '100vh' : height,
        display: 'grid',
        gridTemplateColumns: 'auto 1fr 300px',
        gridTemplateRows:    '48px 48px 1fr',
        ...(isFullscreen && { zIndex: 9999 }),
      }}
    >
      <CanvasHeader
        bridge={bridge}
        widthMm={widthMm}
        heightMm={heightMm}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(p => !p)}
        previewMode={previewMode}
        onTogglePreview={() => setPreviewMode(p => !p)}
        onSave={onSave}
        onExportPdf={handleExportPdf}
      />

      <div
        className="border-border bg-card flex items-center justify-between border-b pr-4"
        style={{ gridColumn: '2 / -1' }}
      >
        <ContextToolbar bridge={bridge} activeProps={activeProps} />
        <button
          onClick={() => bridge.current?.zoomToFit()}
          className="hover:bg-muted border-border text-muted-foreground hover:text-foreground rounded border px-3 py-1 text-[10px] font-bold tracking-wider uppercase transition-colors"
        >
          {m.fitToScreen}
        </button>
      </div>

      <div style={{ gridRow: '2 / -1' }}>
        <MainToolbar bridge={bridge} />
      </div>

      <main
        data-tour="canvas-area"
        className="bg-muted/20 relative flex flex-col overflow-hidden"
        style={{
          gridRow: '3',
          // Optical centring: RightPanel (300px) vs MainToolbar (64px) = 236px
          // asymmetry. Without compensation the label sits left of viewport
          // centre in fullscreen.
          ...(isFullscreen && { paddingLeft: 236 }),
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="relative flex-1">
          <LabelCanvas
            ref={canvasRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            backdrop={computeBackdrop(widthMm, heightMm, viewport, backgroundColor)}
            widthMm={widthMm}
            heightMm={heightMm}
            bleedMm={BLEED_MM}
            bleedMaskOpacity={previewMode ? BLEED_MASK_OPACITY_PREVIEW : BLEED_MASK_OPACITY_DESIGN}
            bleedMaskColor="var(--background)"
            // Preview-Mode versteckt die Safety-Zone, weil das echte Druck-
            // ergebnis sie nicht zeigt; im Design-Mode zeichnet sie den
            // 3mm Trim-Risiko-Streifen am Label-Rand.
            printBleedMm={previewMode ? 0 : PRINT_BLEED_MM}
          />
        </div>

        {enableValidator && (
          <div className="pointer-events-auto absolute right-4 bottom-4 z-10">
            <ValidatorBadge warnings={warnings} />
          </div>
        )}
      </main>

      <RightPanel
        bridge={bridge}
        activeProps={activeProps}
        layers={layers}
        setLayers={setLayers}
        selectedIds={selectedIds}
        backgroundColor={backgroundColor}
        wineFields={initialWineFields}
      />

      <ImageCropperModal
        open={cropperOpen}
        onOpenChange={(open) => setCropper({ open, src: cropperSrc, targetId: cropperTargetId })}
        imageSrc={cropperSrc}
        onCrop={handleCrop}
      />

      <OnboardingTour disabled={disableTour} storageKey={tourStorageKey} />
    </div>
  )

  return (
    <MessagesProvider value={m}>
      {isFullscreen && typeof document !== 'undefined'
        ? createPortal(shell, document.body)
        : shell}
    </MessagesProvider>
  )
}
