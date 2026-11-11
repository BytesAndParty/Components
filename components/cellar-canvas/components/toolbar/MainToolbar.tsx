import { useRef, type ChangeEvent, type RefObject } from 'react'
import { Type, Square, Circle, Minus, ImageUp, type LucideIcon } from 'lucide-react'
import { useDesignerStore, reportImageError } from '../../store/designer-store'
import { useCellarCanvasMessages } from '../../messages-context'
import { prepareImageSource } from '../../engine/image-source'
import { interpolate } from '../../../i18n'
import { cn } from '../../../lib/utils'
import { toolbarArrowKeys } from './toolbar-keys'
import type { FabricBridge } from '../../engine/fabric-bridge'

interface MainToolbarProps {
  bridge: RefObject<FabricBridge | null>
}

/**
 * Insert bar on the left. Every button inserts one object, which gets
 * selected. There are no drawing modes; the view is moved with the wheel or
 * with Space held. Uploading comes first: most labels start from finished
 * artwork.
 */
export function MainToolbar({ bridge }: MainToolbarProps) {
  const m = useCellarCanvasMessages()
  const setCropper = useDesignerStore(s => s.setCropper)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const insertTitle = (name: string) => interpolate(m.toolInsertTitle, { name })

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
      className="border-border bg-card col-start-1 row-span-2 row-start-2 flex w-16 flex-col items-center gap-1 overflow-y-auto border-r px-1.5 py-2"
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

      <ToolButton icon={ImageUp} label={m.toolImage} title={m.toolImageTitle} primary onClick={() => fileInputRef.current?.click()} />
      <ToolButton icon={Type} label={m.toolText} title={insertTitle(m.toolText)} onClick={() => bridge.current?.addText(m.defaultText)} />
      <ToolButton icon={Square} label={m.toolRect} title={insertTitle(m.toolRect)} onClick={() => bridge.current?.addRect()} />
      <ToolButton icon={Circle} label={m.toolCircle} title={insertTitle(m.toolCircle)} onClick={() => bridge.current?.addCircle()} />
      <ToolButton icon={Minus} label={m.toolLine} title={insertTitle(m.toolLine)} onClick={() => bridge.current?.addLine()} />
    </div>
  )
}

function ToolButton({
  icon: Icon,
  label,
  title,
  primary = false,
  onClick,
}: {
  icon: LucideIcon
  label: string
  title: string
  primary?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        'focus-visible:ring-accent/60 flex min-h-12 w-full flex-col items-center justify-center gap-1 rounded-lg px-0.5 py-1.5 text-[10px] leading-none font-medium transition-[color,background-color,transform] focus-visible:ring-2 focus-visible:outline-none active:scale-95',
        primary
          ? 'bg-accent/10 text-accent hover:bg-accent/20'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      <Icon size={18} strokeWidth={2} aria-hidden />
      <span className="max-w-full truncate">{label}</span>
    </button>
  )
}
