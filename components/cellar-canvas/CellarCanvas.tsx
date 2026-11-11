import { useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../lib/utils'
import { OverlayContainerProvider } from '../lib/overlay-container'
import { useComponentMessages } from '../i18n'
import { useFabricCanvas, BLEED_MM } from './engine/use-fabric-canvas'
import { prepareImageSource } from './engine/image-source'
import { useClipboardPaste } from './engine/use-clipboard-paste'
import { useCanvasSync } from './engine/use-canvas-sync'
import { useCanvasAutosave } from './engine/use-canvas-autosave'
import { useCanvasRestore } from './engine/use-canvas-restore'
import { useHotkey } from '@tanstack/react-hotkeys'
import { useDesignEngineHotkey } from '../hotkeys/hotkeys-context'
import { useDesignerStore, reportImageError } from './store/designer-store'
import { LabelCanvas, type LabelBackdrop } from './components/canvas/LabelCanvas'
import { Notices } from './components/canvas/Notices'
import { ZoomBar } from './components/canvas/ZoomBar'
import { MainToolbar } from './components/toolbar/MainToolbar'
import { ContextToolbar } from './components/toolbar/ContextToolbar'
import { CanvasHeader } from './components/header/CanvasHeader'
import { RightPanel } from './components/panels/RightPanel'
import { ImageCropperModal } from '../image-cropper-modal/image-cropper-modal'
import { ValidatorBadge, type ValidationWarning } from '../validator-badge/validator-badge'
import { mmToPx } from './engine/units'
// The export pipeline is dynamically imported on click. jsPDF (+ html2canvas)
// loads only on the PDF path, so a PNG export stays small too.
import { MESSAGES, type CellarCanvasMessages } from './messages'
import { MessagesProvider } from './messages-context'
import type { CellarCanvasState, DesignerState, LabelBackground } from './store/types'
import type { CanvasViewport } from './engine/use-canvas-sync'

// Dimming of the workspace around the label. Semi-transparent, so whatever
// hangs over the label edge stays readable while it is clearly "outside".
const BLEED_MASK_OPACITY = 0.55

// 3 mm safety margin at the label edge: the cutter may take it off. The
// dimming reaches this far into the label to mark the strip.
const PRINT_BLEED_MM = 3

export type { ValidationWarning }

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
  /**
   * Print bleed (mm) added around the PDF, with crop marks. Default 0: exact
   * trim size, no marks. Typical offset value: 3.
   */
  pdfBleedMm?:      number

  // Validation
  enableValidator?: boolean

  // i18n
  /** Override individual strings. Locale comes from the global I18nProvider. */
  messages?: Partial<CellarCanvasMessages>

  // Callbacks
  onChange?:           (state: CellarCanvasState) => void
  onSave?:             (state: CellarCanvasState) => Promise<void>
  onExport?:           (result: { format: 'png' | 'pdf'; blob: Blob }) => void
  onValidationChange?: (warnings: ValidationWarning[]) => void

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
  allergenNote:       'enthält Sulfite',
  countryOfOrigin:    'Österreich',
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
  viewport:   CanvasViewport,
  background: LabelBackground,
): LabelBackdrop {
  const bleedPx = mmToPx(BLEED_MM)
  return {
    left:   viewport.tx + bleedPx * viewport.zoom,
    top:    viewport.ty + bleedPx * viewport.zoom,
    width:  mmToPx(widthMm)  * viewport.zoom,
    height: mmToPx(heightMm) * viewport.zoom,
    background,
  }
}

const subscribeNever = () => () => {}

/**
 * Client-only: renders nothing on the server and during hydration, then
 * mounts the editor fresh. The editor portals its shell (fullscreen) and
 * initialises Fabric on its `<canvas>` once, at mount — rendering it on the
 * server could only mismatch, and switching to the portal after hydration
 * would hand Fabric a new, never-initialised canvas. Without SSR the
 * client snapshot applies from the first render, so nothing mounts twice.
 */
export function CellarCanvas(props: CellarCanvasProps) {
  const isClient = useSyncExternalStore(subscribeNever, () => true, () => false)
  return isClient ? <CellarCanvasEditor {...props} /> : null
}

function CellarCanvasEditor({
  widthMm           = 90,
  heightMm          = 120,
  initialWineFields = DEFAULT_WINE_FIELDS,
  initialState,
  storageKey        = 'cellar-canvas-draft',
  exportDpi         = 300,
  enablePdfExport   = true,
  pdfBleedMm        = 0,
  enableValidator   = true,
  messages,
  onChange,
  onSave,
  onExport,
  onValidationChange,
  className,
  style,
  height = '80vh',
}: CellarCanvasProps) {
  const m = useComponentMessages(MESSAGES, messages)
  const { canvasRef, bridge } = useFabricCanvas({ widthMm, heightMm })
  const selectedIds = useDesignerStore(s => s.selectedIds)

  const [isFullscreen, setIsFullscreen] = useState(false)
  // Narrow editors only (see the grid below): the settings panel lies over
  // the canvas and is closed until the header toggle opens it.
  const [panelOpen, setPanelOpen] = useState(false)
  const panelId = useId()

  // Fabric → React mirror. Selection, geometry, layers, validator warnings,
  // viewport transform, background colour. `setLayers` exists because some
  // bridge mutations (reorder/visibility/lock/rename) don't emit a Fabric
  // event the hook can subscribe to — the RightPanel mirrors locally.
  const { activeProps, layers, setLayers, warnings, background, viewport } =
    useCanvasSync(bridge, { enableValidator, widthMm, heightMm })

  const cropperOpen     = useDesignerStore(s => s.cropperOpen)
  const cropperSrc      = useDesignerStore(s => s.cropperSrc)
  const cropperTargetId = useDesignerStore(s => s.cropperTargetId)
  const setCropper      = useDesignerStore(s => s.setCropper)

  useCanvasRestore(bridge, initialState, storageKey, { widthMm, heightMm })
  useCanvasAutosave(bridge, storageKey, onChange, { widthMm, heightMm })

  // The Fabric canvas fills the canvas area and follows its size (window
  // resize, fullscreen toggle). This must never re-run the restore above
  // (that would reload initialState/the draft and silently discard the
  // user's edits). A new label size recreates the Fabric canvas at its
  // initial size, hence re-observing on widthMm/heightMm.
  const canvasAreaRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = canvasAreaRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      // Whole pixels — a fractional backstore renders blurry.
      const { width, height } = entry.contentRect
      bridge.current?.resize(Math.floor(width), Math.floor(height))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [bridge, widthMm, heightMm])

  // Wine-field text mirrors the incoming prop (e.g. the winemaker updated the
  // vintage in the DB while the editor was open). Fields whose value went
  // missing are hidden, not left with stale text — see `setWineFields`.
  useEffect(() => {
    bridge.current?.setWineFields(initialWineFields)
  }, [bridge, initialWineFields])

  async function handleCrop(blob: Blob) {
    // Data URL, not createObjectURL: Fabric serializes `src` into history and
    // autosave and re-fetches it on loadFromJSON — blob: URLs would die there.
    const url = await prepareImageSource(blob).catch(reportImageError)
    if (!url) return
    if (cropperTargetId) {
      await bridge.current?.updateImageSource(cropperTargetId, url)
    } else {
      await bridge.current?.addImage(url)
    }
  }

  // Renders the export for the header's download triggers (Ark UI saves the
  // file) and hands the same blob to `onExport` for a server upload.
  async function exportBlob(format: 'png' | 'pdf'): Promise<Blob> {
    const { setNotice } = useDesignerStore.getState()
    try {
      const b = bridge.current
      if (!b) throw new Error('Cellar Canvas is not mounted yet')
      const { exportLabelPng, exportLabelPdf } = await import('./engine/export-pipeline')
      const blob = format === 'pdf' ? await exportLabelPdf(b, exportDpi, pdfBleedMm) : await exportLabelPng(b, exportDpi)
      setNotice(null)
      onExport?.({ format, blob })
      return blob
    } catch (error) {
      // E.g. the PDF chunk did not load (offline) or the canvas is tainted by
      // an image without CORS headers. The user gets a notice.
      console.error('Cellar Canvas: export failed', error)
      setNotice('export')
      // Ark's DownloadTrigger saves whatever this resolves with and has no
      // error path; a promise that never settles is how to save nothing.
      return new Promise<Blob>(() => {})
    }
  }

  // Report compliance changes to the embedding app. Full syncs rebuild the
  // warnings array with identical content, so we fire only when the actual
  // set of missing fields changes.
  const lastWarningsSignature = useRef<string | null>(null)
  useEffect(() => {
    if (!onValidationChange) return
    const signature = warnings.map(w => w.key).join('|')
    if (signature === lastWarningsSignature.current) return
    lastWarningsSignature.current = signature
    onValidationChange(warnings)
  }, [warnings, onValidationChange])

  // In fullscreen the shell sits above the page (z-index 9999). Overlays that
  // portal to <body> — the cropper dialog, colour pickers, the font list —
  // would open behind it: invisible, and the modal dialog still blocked every
  // click. They mount into this element inside the shell instead.
  const overlayRef = useRef<HTMLDivElement>(null)

  // CSS fullscreen instead of the browser Fullscreen API: requestFullscreen
  // restricts focus to descendants of the fullscreen element, which Fabric's
  // hiddenTextarea cannot reliably satisfy across reparenting attempts —
  // typing into edited text silently drops. Escape exits the visual mode.
  useEffect(() => {
    if (!isFullscreen) return
    // An Escape that closes a dialog, popover or list must not also leave
    // fullscreen. Zag closes them on this same keydown without marking the
    // event, so the capture phase notes whether one was open beforehand.
    let overlayWasOpen = false
    const onKeyCapture = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      overlayWasOpen = !!overlayRef.current?.querySelector('[data-state="open"], [role="listbox"]')
    }
    const onKey = (e: KeyboardEvent) => {
      // The Escape hotkey below marks an Escape that cleared a selection.
      if (e.key === 'Escape' && !e.defaultPrevented && !overlayWasOpen) setIsFullscreen(false)
    }
    window.addEventListener('keydown', onKeyCapture, true)
    document.addEventListener('keydown', onKey)
    // The page behind must not scroll (its scrollbar showed through).
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyCapture, true)
      document.removeEventListener('keydown', onKey)
      root.style.overflow = previousOverflow
    }
  }, [isFullscreen])

  // Fullscreen must escape ancestor stacking contexts (host navbars, floating
  // carts), so the shell renders through a portal. The portal container stays
  // the SAME element for the component's lifetime and is only moved in the DOM
  // (inline placeholder ↔ document.body). Switching between inline render and
  // portal would remount the subtree — a fresh <canvas> that Fabric never
  // initialises, leaving the editor dead after the first toggle.
  // Client-only (see the CellarCanvas wrapper), so `document` exists here.
  const [portalHost] = useState(() => {
    const host = document.createElement('div')
    host.style.display = 'contents'
    return host
  })
  const placeholderRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    // Moving the node blurs whatever had focus inside it — the fullscreen
    // button, or Fabric's hidden textarea mid text-edit. Give focus back.
    const focused = document.activeElement
    const refocus = focused instanceof HTMLElement && portalHost.contains(focused) ? focused : null
    const target = isFullscreen ? document.body : placeholderRef.current
    target?.appendChild(portalHost)
    if (refocus && document.activeElement !== refocus) refocus.focus({ preventScroll: true })
    // Fabric caches the canvas offset for pointer + hidden-textarea maths.
    bridge.current?.canvas.calcOffset()
  }, [portalHost, isFullscreen, bridge])
  useLayoutEffect(() => () => portalHost.remove(), [portalHost])

  // Clipboard paste — image data on the clipboard lands as a Fabric image.
  useClipboardPaste(async (url) => {
    await bridge.current?.addImage(url)
  })

  useDesignEngineHotkey('Mod+Z', () => bridge.current?.undo(), {
    label:       m.hotkeyUndoLabel,
    category:    'Actions',
    description: m.hotkeyUndoDescription,
  })

  useDesignEngineHotkey('Mod+Shift+Z', () => bridge.current?.redo(), {
    label:       m.hotkeyRedoLabel,
    category:    'Actions',
    description: m.hotkeyRedoDescription,
  })

  // Registered as two separate hotkeys: the library matches one key per
  // registration — a comma list like 'delete, backspace' never fires.
  const deleteSelected = () => {
    // Don't steal Delete/Backspace from text inputs — the user is typing.
    const tag = document.activeElement?.tagName
    if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
      bridge.current?.deleteSelected()
    }
  }

  useDesignEngineHotkey('Delete', deleteSelected, {
    label:       m.hotkeyDeleteLabel,
    category:    'Actions',
    description: m.hotkeyDeleteDescription,
  })

  useDesignEngineHotkey('Backspace', deleteSelected, {
    label:       m.hotkeyDeleteLabel,
    category:    'Actions',
    description: m.hotkeyDeleteDescription,
  })

  // Zoom via keyboard: '=' zoom in, '-' zoom out — the adjacent unshifted keys,
  // both valid plain-string hotkeys on every layout.
  useDesignEngineHotkey('=', () => bridge.current?.zoomBy(1.2), {
    label:       m.hotkeyZoomInLabel,
    category:    'Actions',
    description: m.hotkeyZoomInDescription,
  })

  useDesignEngineHotkey('-', () => bridge.current?.zoomBy(1 / 1.2), {
    label:       m.hotkeyZoomOutLabel,
    category:    'Actions',
    description: m.hotkeyZoomOutDescription,
  })

  // Both skip inputs and textareas: Mod+A keeps its native select-all there,
  // and Fabric's text editing (a hidden textarea) handles Mod+A and Escape
  // itself.
  useDesignEngineHotkey('Mod+A', () => bridge.current?.selectAll(), {
    label:       m.hotkeySelectAllLabel,
    category:    'Actions',
    description: m.hotkeySelectAllDescription,
  }, { ignoreInputs: true })

  // Mod+D would open the browser's bookmark dialog; the hotkey's default
  // preventDefault keeps it on the canvas.
  useDesignEngineHotkey('Mod+D', () => void bridge.current?.duplicateSelected(), {
    label:       m.hotkeyDuplicateLabel,
    category:    'Actions',
    description: m.hotkeyDuplicateDescription,
  }, { ignoreInputs: true })

  // Space held = temporary Hand tool (Figma convention). Keydown switches to
  // pan, keyup restores the previous tool. Only with focus on the page or the
  // canvas: Space on a focused button must still click it, so no blanket
  // preventDefault. Every keydown — key repeats included — blocks the page
  // scroll, which is why the repeat check sits after preventDefault rather
  // than in a `requireReset` option (that skips the callback on repeats).
  const toolBeforeSpace = useRef<DesignerState['activeTool'] | null>(null)
  const restoreToolAfterSpace = () => {
    if (!toolBeforeSpace.current) return
    useDesignerStore.getState().setActiveTool(toolBeforeSpace.current)
    toolBeforeSpace.current = null
  }
  useDesignEngineHotkey('Space', (e) => {
    const focus = document.activeElement
    if (focus && focus !== document.body && !canvasAreaRef.current?.contains(focus)) return
    e.preventDefault() // no page scroll
    if (e.repeat) return
    const { activeTool, setActiveTool } = useDesignerStore.getState()
    if (activeTool === 'pan') return
    toolBeforeSpace.current = activeTool
    setActiveTool('pan')
  }, {
    label:       m.hotkeyPanLabel,
    category:    'Actions',
    description: m.hotkeyPanDescription,
  }, { preventDefault: false })

  // The keyup restores even with an input focused (the press may have
  // started on the canvas). Same key as above on purpose: 'allow' silences
  // the library's duplicate-registration warning, which ignores eventType.
  useHotkey('Space', restoreToolAfterSpace, {
    eventType: 'keyup',
    preventDefault: false,
    ignoreInputs: false,
    conflictBehavior: 'allow',
  })

  // Switching apps while Space is held never delivers its keyup.
  useEffect(() => {
    window.addEventListener('blur', restoreToolAfterSpace)
    return () => window.removeEventListener('blur', restoreToolAfterSpace)
  }, [])

  // No preventDefault by default: only an Escape that actually cleared a
  // selection is marked, so the fullscreen listener above leaves the others.
  useDesignEngineHotkey('Escape', (e) => {
    // An open popover, dialog or the tour already closed itself on this
    // Escape (Zag dismisses in the capture phase and prevents default).
    if (e.defaultPrevented) return
    if (bridge.current?.discardSelection()) e.preventDefault()
  }, {
    label:       m.hotkeyDeselectLabel,
    category:    'Actions',
    description: m.hotkeyDeselectDescription,
  }, { ignoreInputs: true, preventDefault: false })

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      void prepareImageSource(file).then(src => setCropper({ open: true, src })).catch(reportImageError)
    }
  }

  const shell = (
    <div
      className={cn('bg-background relative', className, isFullscreen && 'fixed inset-0')}
      style={{
        ...style,
        // Fullscreen takes its size from `inset-0`.
        height: isFullscreen ? undefined : height,
        ...(isFullscreen && { zIndex: 9999 }),
      }}
    >
      {/*
        The layout follows the width of the editor, not of the window (it may
        sit in a narrow column): from 56rem on the settings panel is a third
        column, below that it lies over the canvas and the header toggles it.
        minmax(0, …) on the last row: a tall panel must scroll, not grow the
        row — the canvas area would change size (and re-fit) on every selection.
      */}
      <div className="@container/editor h-full">
        <div className="grid h-full grid-cols-[auto_minmax(0,1fr)] grid-rows-[auto_3rem_minmax(0,1fr)] @4xl/editor:grid-cols-[auto_minmax(0,1fr)_300px]">
          <CanvasHeader
            bridge={bridge}
            widthMm={widthMm}
            heightMm={heightMm}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(p => !p)}
            panelId={panelId}
            panelOpen={panelOpen}
            onTogglePanel={() => setPanelOpen(p => !p)}
            onSave={onSave}
            exportPng={() => exportBlob('png')}
            exportPdf={enablePdfExport ? () => exportBlob('pdf') : undefined}
          />

          <MainToolbar bridge={bridge} />

          <div className="border-border bg-card col-start-2 -col-end-1 row-start-2 min-w-0 border-b">
            <ContextToolbar bridge={bridge} activeProps={activeProps} />
          </div>

          <main
            className="bg-muted/20 relative col-start-2 row-start-3 flex min-w-0 flex-col overflow-hidden"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div ref={canvasAreaRef} className="relative flex-1">
              <LabelCanvas
                ref={canvasRef}
                className="absolute inset-0"
                backdrop={computeBackdrop(widthMm, heightMm, viewport, background)}
                widthMm={widthMm}
                heightMm={heightMm}
                bleedMm={BLEED_MM}
                bleedMaskOpacity={BLEED_MASK_OPACITY}
                bleedMaskColor="var(--background)"
                printBleedMm={PRINT_BLEED_MM}
                canvasLabel={m.canvasLabel}
              />
            </div>

            <Notices />
            {/* Zoom left, validator right; on a narrow canvas the badge moves above the zoom bar. */}
            <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 flex flex-wrap-reverse items-end gap-2">
              <ZoomBar bridge={bridge} />
              {enableValidator && (
                <div className="pointer-events-auto ml-auto">
                  <ValidatorBadge warnings={warnings} />
                </div>
              )}
            </div>
          </main>

          <RightPanel
            id={panelId}
            open={panelOpen}
            bridge={bridge}
            activeProps={activeProps}
            layers={layers}
            setLayers={setLayers}
            selectedIds={selectedIds}
            background={background}
            wineFields={initialWineFields}
          />
        </div>
      </div>

      <ImageCropperModal
        open={cropperOpen}
        onOpenChange={(open) => setCropper({ open, src: cropperSrc, targetId: cropperTargetId })}
        imageSrc={cropperSrc}
        onCrop={handleCrop}
        // `prepareImageSource` passes undecodable files through; the cropper
        // is where they fail for the file picker and drag & drop.
        onError={() => {
          setCropper({ open: false })
          reportImageError()
        }}
      />

      {/* Mount point for overlays in fullscreen; out of the grid flow. */}
      <div ref={overlayRef} style={{ position: 'absolute', top: 0, left: 0 }} />
    </div>
  )

  return (
    <MessagesProvider value={m}>
      <OverlayContainerProvider value={isFullscreen ? overlayRef : undefined}>
        <div ref={placeholderRef} style={{ display: 'contents' }} />
        {createPortal(shell, portalHost)}
      </OverlayContainerProvider>
    </MessagesProvider>
  )
}
