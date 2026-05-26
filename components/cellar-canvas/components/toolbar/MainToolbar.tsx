import { useRef, type ChangeEvent } from 'react'
import { Type, Square, Circle, Minus, Image as ImageIcon, Hand, MousePointer2, Trash2 } from 'lucide-react'
import { useDesignerStore } from '../../store/designer-store'
import { useCellarCanvasMessages } from '../../messages-context'
import { Tooltip } from '../shared'
import { cn } from '../../../lib/utils'
import type { FabricBridge } from '../../engine/fabric-bridge'
import type { DesignerState } from '../../store/types'
import type { CellarCanvasMessages } from '../../messages'

interface MainToolbarProps {
  bridge: React.MutableRefObject<FabricBridge | null>
}

type ToolId = 'select' | 'pan' | 'text' | 'image' | 'rect' | 'circle' | 'line'

function buildTools(m: CellarCanvasMessages) {
  return [
    { id: 'select', icon: MousePointer2, label: m.toolSelect },
    { id: 'pan',    icon: Hand,          label: m.toolPan },
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
  const activeTool = useDesignerStore(s => s.activeTool)
  const setActiveTool = useDesignerStore(s => s.setActiveTool)
  const selectedIds = useDesignerStore(s => s.selectedIds)
  const setCropper = useDesignerStore(s => s.setCropper)

  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleToolClick(toolId: ToolId) {
    setActiveTool(toolId as DesignerState['activeTool'])
    switch (toolId) {
      case 'text':   bridge.current?.addText();   break
      case 'image':  fileInputRef.current?.click(); break
      case 'rect':   bridge.current?.addRect();   break
      case 'circle': bridge.current?.addCircle(); break
      case 'line':   bridge.current?.addLine();   break
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setCropper({ open: true, src: reader.result as string })
    }
    reader.readAsDataURL(file)
    // Reset so picking the same file twice in a row still fires change.
    e.target.value = ''
  }

  return (
    <aside className="border-r border-border flex flex-col items-center py-4 gap-2 bg-card w-16">
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
            className={cn(
              "p-2.5 rounded-xl transition-all duration-200",
              activeTool === tool.id
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <tool.icon size={20} strokeWidth={2.5} />
          </button>
        </Tooltip>
      ))}

      <div className="flex-1" />

      <Tooltip content={m.toolDelete} position="right">
        <button
          onClick={() => bridge.current?.deleteSelected()}
          disabled={selectedIds.length === 0}
          className={cn(
            "p-2.5 rounded-xl transition-all duration-200",
            selectedIds.length > 0
              ? "text-destructive hover:bg-destructive/10"
              : "text-muted-foreground/30 cursor-not-allowed"
          )}
        >
          <Trash2 size={20} />
        </button>
      </Tooltip>
    </aside>
  )
}
