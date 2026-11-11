import { type RefObject } from 'react'
import { LayoutTemplate } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { useCellarCanvasMessages } from '../../messages-context'
import { WINE_LABEL_TEMPLATES, type TemplateContext, type WineLabelTemplate } from '../../templates/templates'
import type { FabricBridge } from '../../engine/fabric-bridge'
import type { WineFieldValues } from '../../CellarCanvas'
import type { CellarCanvasMessages } from '../../messages'

export interface TemplatesPanelProps {
  bridge:     RefObject<FabricBridge | null>
  wineFields: WineFieldValues
  hasObjects: boolean
}

function templateName(m: CellarCanvasMessages, id: string): string {
  if (id === 'classic') return m.templateClassicName
  if (id === 'modern')  return m.templateModernName
  if (id === 'rustic')  return m.templateRusticName
  if (id === 'bold')    return m.templateBoldName
  return m.templateMinimalName
}

/**
 * Five rudimentary starting layouts (Classic / Modern / Minimal / Rustic / Bold). Applying
 * one replaces the current canvas content in a single undo-able step — see
 * `FabricBridge.applyTemplate`. Wine-field text comes from the currently
 * selected wine and keeps updating afterwards through the same
 * `initialWineFields` sync every manually-inserted wine field uses.
 */
export function TemplatesPanel({ bridge, wineFields, hasObjects }: TemplatesPanelProps) {
  const m = useCellarCanvasMessages()

  function apply(id: WineLabelTemplate['id']) {
    const b = bridge.current
    if (!b) return

    const template = WINE_LABEL_TEMPLATES.find((t) => t.id === id)
    if (!template) return
    const ctx: TemplateContext = {
      widthMm: b.widthMm,
      heightMm: b.heightMm,
      bleedPx: b.bleedPx,
      wineFields,
    }
    const elements = template.build(ctx)
    // Templates leave out wine fields without a value; one made only of such
    // fields (Minimal without name + vintage) would just wipe the canvas.
    if (elements.length === 0) return
    if (hasObjects && !window.confirm(m.templatesConfirm)) return
    b.applyTemplate(elements)
  }

  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-xs">{m.templatesHint}</p>
      <div className="grid grid-cols-1 gap-2">
        {WINE_LABEL_TEMPLATES.map(({ id }) => (
          <button
            key={id}
            type="button"
            onClick={() => apply(id)}
            className={cn(
              "group flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all pointer-coarse:min-h-11",
              "bg-muted/50 hover:bg-muted border-transparent hover:border-border active:scale-[0.98]",
              "focus-visible:ring-accent/60 focus-visible:ring-2 focus-visible:outline-none",
            )}
          >
            <LayoutTemplate size={16} aria-hidden className="text-muted-foreground group-hover:text-foreground shrink-0 transition-colors" />
            <span className="text-foreground text-xs font-medium">{templateName(m, id)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
