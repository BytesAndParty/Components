import { type RefObject } from 'react'
import { Maximize2, Minimize2, Download, Undo2, Redo2, SlidersHorizontal } from 'lucide-react'
import { DownloadTrigger } from '@ark-ui/react/download-trigger'
import { cn } from '../../../lib/utils'
import { interpolate } from '../../../i18n'
import { toolbarArrowKeys } from '../toolbar/toolbar-keys'
import { barButtonCls, barDividerCls } from '../shared/button-styles'
import { useShortcutTitle } from '../shared/use-shortcut-title'
import { useCellarCanvasMessages } from '../../messages-context'
import { useDesignerStore } from '../../store/designer-store'
import { SaveButton } from './SaveButton'
import type { FabricBridge } from '../../engine/fabric-bridge'
import type { CellarCanvasState } from '../../store/types'

export interface CanvasHeaderProps {
  bridge:             RefObject<FabricBridge | null>
  widthMm:            number
  heightMm:           number
  isFullscreen:       boolean
  onToggleFullscreen: () => void
  /** The settings panel: an overlay the header toggles while the editor is narrow. */
  panelId:            string
  panelOpen:          boolean
  onTogglePanel:      () => void
  onSave?:            (state: CellarCanvasState) => Promise<void>
  /** Renders the PNG export; the download trigger saves the result. */
  exportPng?:         () => Promise<Blob>
  /** Renders the PDF export; the download trigger saves the result. */
  exportPdf?:         () => Promise<Blob>
}

const exportButtonCls = cn(barButtonCls, 'border-border border px-3')

/**
 * Top bar: label size on the left, then undo / redo, save, the two downloads,
 * the settings toggle (narrow editors only) and fullscreen. All actions are
 * thin pass-throughs to the bridge; no business logic lives here. The row
 * wraps when the editor is narrower than its buttons.
 */
export function CanvasHeader({
  bridge,
  widthMm,
  heightMm,
  isFullscreen,
  onToggleFullscreen,
  panelId,
  panelOpen,
  onTogglePanel,
  onSave,
  exportPng,
  exportPdf,
}: CanvasHeaderProps) {
  const m = useCellarCanvasMessages()
  const shortcutTitle = useShortcutTitle()
  const canUndo = useDesignerStore(s => s.canUndo)
  const canRedo = useDesignerStore(s => s.canRedo)
  const undoTitle = shortcutTitle(m.hotkeyUndoLabel, 'Mod+Z')
  const redoTitle = shortcutTitle(m.hotkeyRedoLabel, 'Mod+Shift+Z')
  const fullscreenTitle = isFullscreen ? m.fullscreenExit : m.fullscreenEnter

  return (
    <div
      role="toolbar"
      aria-label={m.headerToolbarLabel}
      onKeyDown={toolbarArrowKeys('horizontal')}
      className="border-border bg-card col-span-full flex min-h-12 flex-wrap items-center gap-x-3 gap-y-1 border-b px-3 py-1.5"
    >
      <p className="text-muted-foreground hidden min-w-0 flex-1 truncate text-xs @2xl/editor:block">
        {interpolate(m.labelDimensions, { w: widthMm, h: heightMm })}
      </p>

      <div className="flex flex-1 flex-wrap items-center justify-end gap-1 @2xl/editor:flex-none">
        <button
          type="button"
          onClick={() => bridge.current?.undo()}
          disabled={!canUndo}
          title={undoTitle}
          aria-label={undoTitle}
          className={barButtonCls}
        >
          <Undo2 size={16} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => bridge.current?.redo()}
          disabled={!canRedo}
          title={redoTitle}
          aria-label={redoTitle}
          className={barButtonCls}
        >
          <Redo2 size={16} aria-hidden />
        </button>

        <span aria-hidden className={barDividerCls} />

        {onSave && <SaveButton bridge={bridge} onSave={onSave} />}
        {exportPng && (
          <DownloadTrigger
            data={exportPng}
            fileName={`${m.exportFilename}.png`}
            mimeType="image/png"
            className={exportButtonCls}
            title={m.exportPngTitle}
          >
            <Download size={14} aria-hidden />
            {m.exportPngLabel}
          </DownloadTrigger>
        )}
        {exportPdf && (
          <DownloadTrigger
            data={exportPdf}
            fileName={`${m.exportFilename}.pdf`}
            mimeType="application/pdf"
            className={exportButtonCls}
            title={m.exportPdfTitle}
          >
            <Download size={14} aria-hidden />
            {m.exportPdfLabel}
          </DownloadTrigger>
        )}

        <span aria-hidden className={barDividerCls} />

        <button
          type="button"
          onClick={onTogglePanel}
          aria-expanded={panelOpen}
          aria-controls={panelId}
          title={m.panelToggle}
          aria-label={m.panelToggle}
          className={cn(barButtonCls, '@4xl/editor:hidden', panelOpen && 'bg-muted text-foreground')}
        >
          <SlidersHorizontal size={16} aria-hidden />
        </button>
        <button
          type="button"
          onClick={onToggleFullscreen}
          aria-pressed={isFullscreen}
          title={fullscreenTitle}
          aria-label={fullscreenTitle}
          className={barButtonCls}
        >
          {isFullscreen ? <Minimize2 size={16} aria-hidden /> : <Maximize2 size={16} aria-hidden />}
        </button>
      </div>
    </div>
  )
}
