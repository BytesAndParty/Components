import { useRef, useState, useEffect, type ChangeEvent } from 'react'
import { Type, Square, Circle, Minus, Image as ImageIcon, Hand, MousePointer2, Trash2 } from 'lucide-react'
import { useDesignerStore } from '../../store/designer-store'
import { Tooltip } from '../shared'
import { ImageCropperModal } from '../../../image-cropper-modal/image-cropper-modal'
import { cn } from '../../../lib/utils'
import type { FabricBridge } from '../../engine/fabric-bridge'
import type { DesignerState } from '../../store/types'

interface MainToolbarProps {
  bridge: React.MutableRefObject<FabricBridge | null>
}

const TOOLS = [
  { id: 'select', icon: MousePointer2, label: 'Select (V)' },
  { id: 'pan',    icon: Hand,          label: 'Pan (Space)' },
  { id: 'text',   icon: Type,          label: 'Text (T)' },
  { id: 'image',  icon: ImageIcon,     label: 'Image (I)' },
  { id: 'rect',   icon: Square,        label: 'Rect (R)' },
  { id: 'circle', icon: Circle,        label: 'Circle (C)' },
  { id: 'line',   icon: Minus,         label: 'Line (L)' },
] as const

type ToolId = typeof TOOLS[number]['id']

export function MainToolbar({ bridge }: MainToolbarProps) {
  const activeTool = useDesignerStore(s => s.activeTool)
  const setActiveTool = useDesignerStore(s => s.setActiveTool)
  const selectedIds = useDesignerStore(s => s.selectedIds)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [cropSrc, setCropSrc] = useState<string | undefined>()
  const [cropperOpen, setCropperOpen] = useState(false)

  useEffect(() => {
    return () => {
      if (cropSrc?.startsWith('blob:')) URL.revokeObjectURL(cropSrc)
    }
  }, [cropSrc])

  function handleToolClick(toolId: ToolId) {
    // Image tool is a 2-step interaction: first click activates, second click opens
    // the native file picker. This prevents the browser from exiting fullscreen on
    // accidental first-click and makes the upload deliberate.
    if (toolId === 'image') {
      if (activeTool === 'image') {
        fileInputRef.current?.click()
      } else {
        setActiveTool('image')
      }
      return
    }

    setActiveTool(toolId as DesignerState['activeTool'])
    switch (toolId) {
      case 'text':   bridge.current?.addText();   break
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
      setCropSrc(reader.result as string)
      setCropperOpen(true)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  async function handleCrop(blob: Blob) {
    const url = URL.createObjectURL(blob)
    await bridge.current?.addImage(url)
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

      {TOOLS.map((tool) => {
        const label =
          tool.id === 'image' && activeTool === 'image'
            ? 'Click again to upload'
            : tool.label
        return (
          <Tooltip key={tool.id} content={label} position="right">
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
        )
      })}

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

      <ImageCropperModal
        open={cropperOpen}
        onOpenChange={setCropperOpen}
        imageSrc={cropSrc}
        onCrop={handleCrop}
      />
    </aside>
  )
}
