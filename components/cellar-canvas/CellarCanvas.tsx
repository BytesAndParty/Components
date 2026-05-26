import { useEffect, useState } from 'react'
import { cn } from '../lib/utils'
import { useComponentMessages } from '../i18n'
import { useFabricCanvas, BLEED_MM } from './engine/use-fabric-canvas'
import { useClipboardPaste } from './engine/use-clipboard-paste'
import { useCanvasSync } from './engine/use-canvas-sync'
import { useCanvasAutosave } from './engine/use-canvas-autosave'
import { useCanvasRestore } from './engine/use-canvas-restore'
import { useDesignEngineHotkey } from '../hotkeys/hotkeys-provider'
import { useDesignerStore } from './store/designer-store'
import { LabelCanvas, type LabelBackdrop } from './components/canvas/LabelCanvas'
import { MainToolbar } from './components/toolbar/MainToolbar'
import { ContextToolbar } from './components/toolbar/ContextToolbar'
import { CanvasHeader } from './components/header/CanvasHeader'
import { RightPanel } from './components/panels/RightPanel'
import { OnboardingTour } from './components/tour/OnboardingTour'
import { ValidatorBadge } from '../validator-badge/validator-badge'
import { mmToPx } from './engine/units'
import { MESSAGES, type CellarCanvasMessages } from './messages'
import { MessagesProvider } from './messages-context'
import type { CellarCanvasState } from './store/types'
import type { CanvasViewport } from './engine/use-canvas-sync'

// Bleed dimming around the label. Design view stays semi-transparent so
// objects bleeding out are still readable; preview goes fully opaque to
// emulate the actual print result (everything outside the printable area
// is hidden, only the label itself shows through).
const BLEED_MASK_OPACITY_DESIGN  = 0.55
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

  useCanvasRestore(bridge, initialState, storageKey, { widthMm, heightMm, isFullscreen })
  useCanvasAutosave(bridge, storageKey, onChange)

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
  // We revoke the blob URL once Fabric has loaded the image into its cache.
  useClipboardPaste(async (url) => {
    try {
      await bridge.current?.addImage(url)
    } finally {
      URL.revokeObjectURL(url)
    }
  })

  useDesignEngineHotkey('mod+z', () => bridge.current?.undo(), {
    label:       m.hotkeyUndoLabel,
    category:    m.hotkeyCategory,
    description: m.hotkeyUndoDescription,
  })

  useDesignEngineHotkey('mod+shift+z', () => bridge.current?.redo(), {
    label:       m.hotkeyRedoLabel,
    category:    m.hotkeyCategory,
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
    category:    m.hotkeyCategory,
    description: m.hotkeyDeleteDescription,
  })

  return (
    <MessagesProvider value={m}>
    <div
      className={cn(
        "bg-background transition-all duration-300",
        className,
        isFullscreen && "fixed inset-0 z-50 p-4",
      )}
      style={{
        ...style,
        height: isFullscreen ? '100vh' : height,
        display: 'grid',
        gridTemplateColumns: 'auto 1fr 300px',
        gridTemplateRows:    '48px 48px 1fr',
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
      />

      <div
        className="border-b border-border bg-card flex items-center justify-between pr-4"
        style={{ gridColumn: '2 / -1' }}
      >
        <ContextToolbar bridge={bridge} />
        <button
          onClick={() => bridge.current?.zoomToFit()}
          className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 hover:bg-muted rounded border border-border transition-colors text-muted-foreground hover:text-foreground"
        >
          {m.fitToScreen}
        </button>
      </div>

      <div style={{ gridRow: '2 / -1' }}>
        <MainToolbar bridge={bridge} />
      </div>

      <main data-tour="canvas-area" className="relative overflow-hidden bg-muted/20 flex flex-col" style={{ gridRow: '3' }}>
        <div className="flex-1 flex items-center justify-center p-12 overflow-auto">
          <LabelCanvas
            ref={canvasRef}
            backdrop={computeBackdrop(widthMm, heightMm, viewport, backgroundColor)}
            widthMm={widthMm}
            heightMm={heightMm}
            bleedMm={BLEED_MM}
            bleedMaskOpacity={previewMode ? BLEED_MASK_OPACITY_PREVIEW : BLEED_MASK_OPACITY_DESIGN}
            bleedMaskColor="var(--background)"
          />
        </div>

        {enableValidator && (
          <div className="absolute bottom-4 right-4 z-10 pointer-events-auto">
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

      <OnboardingTour disabled={disableTour} storageKey={tourStorageKey} />
    </div>
    </MessagesProvider>
  )
}
