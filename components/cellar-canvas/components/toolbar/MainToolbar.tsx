import { useRef, type ChangeEvent } from 'react'
import { Type, Square, Circle, Minus, Image as ImageIcon, Trash2, Copy } from 'lucide-react'
import { useDesignerStore, reportImageError } from '../../store/designer-store'
import { useCellarCanvasMessages } from '../../messages-context'
import { prepareImageSource } from '../../engine/image-source'
import { Tooltip } from '../shared'
import { cn } from '../../../lib/utils'
import { toolbarArrowKeys } from './toolbar-keys'
import type { FabricBridge } from '../../engine/fabric-bridge'
import type { CellarCanvasMessages } from '../../messages'

interface MainToolbarProps {
  bridge: React.MutableRefObject<FabricBridge | null>
}

type ToolId = 'text' | 'image' | 'rect' | 'circle' | 'line'

function buildTools(m: CellarCanvasMessages) {
  return [
    { id: 'text',   icon: Type,          label: m.toolText },
    { id: 'image',  icon: ImageIcon,     label: m.toolImage },
    { id: 'rect',   icon: Square,        label: m.toolRect },
    { id: 'circle', icon: Circle,        label: m.toolCircle },
    { id: 'line',   icon: Minus,         label: m.toolLine },
  ] as const
}

export function MainToolbar({ bridge }: MainToolbarProps) {
  const m = useCellarCanvasMessages()
  const tools = buildTools(m)
  const hasSelection = useDesignerStore(s => s.selectedIds.length > 0)
  const setCropper = useDesignerStore(s => s.setCropper)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Every button inserts one object, which gets selected. There are no
  // drawing modes; the view is moved with the wheel or with Space held.
  function handleToolClick(toolId: ToolId) {
    switch (toolId) {
      case 'text':   bridge.current?.addText(m.defaultText); break
      case 'image':  fileInputRef.current?.click(); break
      case 'rect':   bridge.current?.addRect();     break
      case 'circle': bridge.current?.addCircle();   break
      case 'line':   bridge.current?.addLine();     break
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    void prepareImageSource(file).then(src => setCropper({ open: true, src })).catch(reportImageError)
    // Reset so picking the same file twice in a row still fires change.
    e.target.value = ''
  }

  return (
    <div
      role="toolbar"
      aria-label={m.mainToolbarLabel}
      aria-orientation="vertical"
      onKeyDown={toolbarArrowKeys('vertical')}
      className="border-border bg-card flex w-16 flex-col items-center gap-2 border-r py-4"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        onChange={handleFileChange}
        className="sr-only"
        aria-hidden
        tabIndex={-1}
      />

      {tools.map((tool) => (
        <Tooltip key={tool.id} content={tool.label} position="right">
          <button
            onClick={() => handleToolClick(tool.id)}
            aria-label={tool.label}
            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl p-2.5 transition-all duration-200"
          >
            <tool.icon size={20} strokeWidth={2.5} />
          </button>
        </Tooltip>
      ))}

      <div className="flex-1" />

      <Tooltip content={m.toolDuplicate} position="right">
        {/* aria-disabled, not disabled: a disabled button fires no pointer or
            focus events, so its tooltip could never explain itself. */}
        <button
          onClick={() => { if (hasSelection) void bridge.current?.duplicateSelected() }}
          aria-disabled={!hasSelection}
          aria-label={m.toolDuplicate}
          className={cn(
            "p-2.5 rounded-xl transition-all duration-200",
            hasSelection
              ? "text-muted-foreground hover:bg-muted hover:text-foreground"
              : "text-muted-foreground/30 cursor-not-allowed"
          )}
        >
          <Copy size={20} />
        </button>
      </Tooltip>

      <Tooltip content={m.toolDelete} position="right">
        <button
          onClick={() => { if (hasSelection) bridge.current?.deleteSelected() }}
          aria-disabled={!hasSelection}
          aria-label={m.toolDelete}
          className={cn(
            "p-2.5 rounded-xl transition-all duration-200",
            hasSelection
              ? "text-destructive hover:bg-destructive/10"
              : "text-muted-foreground/30 cursor-not-allowed"
          )}
        >
          <Trash2 size={20} />
        </button>
      </Tooltip>
    </div>
  )
}
