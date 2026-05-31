import { type RefObject } from 'react'
import { Maximize2, Minimize2, Eye, EyeOff, Magnet, Download } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { interpolate } from '../../../i18n'
import { useCellarCanvasMessages } from '../../messages-context'
import { useDesignerStore } from '../../store/designer-store'
import { SaveButton } from './SaveButton'
import type { FabricBridge } from '../../engine/fabric-bridge'
import type { CellarCanvasState } from '../../store/types'

export interface CanvasHeaderProps {
  bridge:           RefObject<FabricBridge | null>
  widthMm:          number
  heightMm:         number
  isFullscreen:     boolean
  onToggleFullscreen: () => void
  previewMode:      boolean
  onTogglePreview:  () => void
  onSave?:          (state: CellarCanvasState) => Promise<void>
  onExportPdf?:     () => void
}

/**
 * Top bar above the canvas: brand + label dims + undo/redo + save + preview
 * toggle + fullscreen toggle. All actions thin pass-throughs to the bridge
 * (or local toggles for view modes); no business logic lives here.
 */
export function CanvasHeader({
  bridge,
  widthMm,
  heightMm,
  isFullscreen,
  onToggleFullscreen,
  previewMode,
  onTogglePreview,
  onSave,
  onExportPdf,
}: CanvasHeaderProps) {
  const m = useCellarCanvasMessages()
  const { snappingEnabled, setSnappingEnabled } = useDesignerStore()

  return (
    <div
      className="border-border bg-card/50 flex h-12 items-center border-b px-4"
      style={{ gridColumn: '1 / -1' }}
    >
      <h2 className="text-xs font-bold tracking-widest uppercase opacity-50">{m.brand}</h2>
      <div className="bg-border mx-6 h-4 w-px" />
      <div className="text-muted-foreground flex-1 text-[10px] font-bold tracking-wider uppercase">
        {interpolate(m.labelDimensions, { w: widthMm, h: heightMm })}
      </div>

      <div className="mr-4 flex items-center gap-1">
        <IconButton
          onClick={() => setSnappingEnabled(!snappingEnabled)}
          title={snappingEnabled ? m.snappingTitleEnabled : m.snappingTitleDisabled}
          className={cn(snappingEnabled && "text-primary")}
        >
          <Magnet size={14} className={cn(!snappingEnabled && "opacity-40")} />
        </IconButton>

        <div className="bg-border/50 mx-2 h-4 w-px" />

        <IconButton onClick={() => bridge.current?.undo()} title={m.undoTitle}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
        </IconButton>
        <IconButton onClick={() => bridge.current?.redo()} title={m.redoTitle}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13"/></svg>
        </IconButton>
        {onSave && <SaveButton bridge={bridge} onSave={onSave} />}
        {onExportPdf && (
          <button
            onClick={onExportPdf}
            className="border-border text-muted-foreground hover:text-foreground hover:bg-muted ml-2 inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-colors"
            title={m.exportTitle}
          >
            <Download size={12} />
            {m.exportLabel}
          </button>
        )}
      </div>

      <button
        onClick={onTogglePreview}
        className={cn(
          "p-2 rounded-md transition-colors mr-1",
          previewMode
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "hover:bg-muted text-muted-foreground hover:text-foreground"
        )}
        title={previewMode ? m.previewExit : m.previewEnter}
        aria-pressed={previewMode}
      >
        {previewMode ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>

      <button
        onClick={onToggleFullscreen}
        className="hover:bg-muted text-muted-foreground hover:text-foreground rounded-md p-2 transition-colors"
        title={isFullscreen ? m.fullscreenExit : m.fullscreenEnter}
      >
        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </button>
    </div>
  )
}

function IconButton({
  onClick,
  title,
  children,
  className,
}: {
  onClick: () => void
  title:   string
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-2 hover:bg-muted rounded-md text-muted-foreground transition-colors",
        className
      )}
      title={title}
    >
      {children}
    </button>
  )
}
