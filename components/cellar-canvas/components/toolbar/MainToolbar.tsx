import { Type, Square, Hand, MousePointer2, Trash2 } from 'lucide-react'
import { useDesignerStore } from '../../store/designer-store'
import { Tooltip } from '../shared'
import { cn } from '../../../lib/utils'
import type { FabricBridge } from '../../engine/fabric-bridge'

interface MainToolbarProps {
  bridge: React.MutableRefObject<FabricBridge | null>
}

export function MainToolbar({ bridge }: MainToolbarProps) {
  const activeTool = useDesignerStore(s => s.activeTool)
  const setActiveTool = useDesignerStore(s => s.setActiveTool)
  const selectedIds = useDesignerStore(s => s.selectedIds)

  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select (V)' },
    { id: 'pan',    icon: Hand,          label: 'Pan (Space)' },
    { id: 'text',   icon: Type,          label: 'Text (T)',   action: () => bridge.current?.addText() },
    { id: 'rect',   icon: Square,        label: 'Rect (R)',   action: () => bridge.current?.addRect() },
    // Circle and Line will be added in Phase 5
  ] as const

  return (
    <aside className="border-r border-border flex flex-col items-center py-4 gap-2 bg-card w-16">
      {tools.map((tool) => (
        <Tooltip key={tool.id} content={tool.label} position="right">
          <button
            onClick={() => {
              setActiveTool(tool.id as any)
              if ('action' in tool) tool.action()
            }}
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

      <Tooltip content="Delete Selected (Del)" position="right">
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
