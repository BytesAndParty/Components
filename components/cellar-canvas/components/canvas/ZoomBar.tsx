import { type RefObject } from 'react'
import { ZoomIn, ZoomOut } from 'lucide-react'
import { interpolate } from '../../../i18n'
import { useCellarCanvasMessages } from '../../messages-context'
import { useDesignerStore } from '../../store/designer-store'
import { useShortcutTitle } from '../shared/use-shortcut-title'
import type { FabricBridge } from '../../engine/fabric-bridge'

const buttonCls =
  'text-muted-foreground hover:bg-muted/60 hover:text-foreground focus-visible:ring-accent/60 flex h-full min-w-9 items-center justify-center px-2 text-xs font-medium transition-colors first:rounded-l-lg last:rounded-r-lg focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset pointer-coarse:min-w-11'

/**
 * Zoom controls (the editor places them in the lower left corner of the
 * canvas): out, the current level, in, and "fit" to bring the whole label
 * back into view. 100 % is the label at its physical size on a 96 dpi screen.
 */
export function ZoomBar({ bridge }: { bridge: RefObject<FabricBridge | null> }) {
  const m = useCellarCanvasMessages()
  const shortcutTitle = useShortcutTitle()
  const percent = Math.round(useDesignerStore(s => s.zoom) * 100)
  const zoomOutTitle = shortcutTitle(m.hotkeyZoomOutLabel, '-')
  const zoomInTitle = shortcutTitle(m.hotkeyZoomInLabel, '=')

  return (
    <div
      role="group"
      aria-label={interpolate(m.zoomLevel, { percent })}
      className="bg-card border-border pointer-events-auto flex h-9 items-center rounded-lg border shadow-sm pointer-coarse:h-11"
    >
      <button
        type="button"
        onClick={() => bridge.current?.zoomBy(1 / 1.2)}
        title={zoomOutTitle}
        aria-label={zoomOutTitle}
        className={buttonCls}
      >
        <ZoomOut size={14} aria-hidden />
      </button>
      <span aria-hidden className="text-foreground w-12 text-center font-mono text-xs tabular-nums">
        {percent} %
      </span>
      <button
        type="button"
        onClick={() => bridge.current?.zoomBy(1.2)}
        title={zoomInTitle}
        aria-label={zoomInTitle}
        className={buttonCls}
      >
        <ZoomIn size={14} aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => bridge.current?.zoomToFit()}
        title={m.zoomFitTitle}
        className={`${buttonCls} border-border border-l px-3`}
      >
        {m.zoomFit}
      </button>
    </div>
  )
}
