import { type RefObject } from 'react'
import { Maximize2, Minimize2, Eye, EyeOff } from 'lucide-react'
import { cn } from '../../../lib/utils'
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
}: CanvasHeaderProps) {
  return (
    <div
      className="border-b border-border flex items-center px-4 h-12 bg-card/50"
      style={{ gridColumn: '1 / -1' }}
    >
      <h2 className="text-xs font-bold tracking-widest uppercase opacity-50">Cellar Canvas</h2>
      <div className="mx-6 h-4 w-px bg-border" />
      <div className="flex-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        Standard Label ({widthMm}x{heightMm}mm)
      </div>

      <div className="flex items-center gap-1 mr-4">
        <IconButton onClick={() => bridge.current?.undo()} title="Undo (Cmd+Z)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
        </IconButton>
        <IconButton onClick={() => bridge.current?.redo()} title="Redo (Cmd+Shift+Z)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13"/></svg>
        </IconButton>
        {onSave && <SaveButton bridge={bridge} onSave={onSave} />}
      </div>

      <button
        onClick={onTogglePreview}
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
        onClick={onToggleFullscreen}
        className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
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
}: {
  onClick: () => void
  title:   string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="p-2 hover:bg-muted rounded-md text-muted-foreground transition-colors"
      title={title}
    >
      {children}
    </button>
  )
}
