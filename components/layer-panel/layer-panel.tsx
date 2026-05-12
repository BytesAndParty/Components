import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Type, ImageIcon, Square, Circle, Minus, Layers, Tag, QrCode,
  Eye, EyeOff, Lock, Unlock, Trash2, GripVertical,
} from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import type { DraggableAttributes } from '@dnd-kit/core'
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { cn } from '../lib/utils'
import { useComponentMessages } from '../i18n'
import { MESSAGES, type LayerPanelMessages } from './messages'

// ── Types ─────────────────────────────────────────────────────────────────────

export type LayerType = 'text' | 'image' | 'rect' | 'circle' | 'line' | 'group' | 'wine-field' | 'qr-code'

export interface Layer {
  id: string
  name: string
  type: LayerType
  visible: boolean
  locked: boolean
}

export type LayerPanelMessages = {
  deleteLayer: string
  renameLayer: string
  dragHandle: string
  visibility: string
  lock: string
  layersHeader: string
  noObjects: string
}

export interface LayerPanelProps {
  layers: Layer[]
  selectedIds?: string[]
  onReorder?: (layers: Layer[]) => void
  onSelect?:  (id: string) => void
  onVisibilityToggle?: (id: string) => void
  onLockToggle?:       (id: string) => void
  onRename?:           (id: string, name: string) => void
  onDelete?:           (id: string) => void
  onMove?:             (id: string, dir: 1 | -1) => void
  className?: string
  messages?: Partial<LayerPanelMessages>
}

// ── Default messages ──────────────────────────────────────────────────────────

const LAYER_MESSAGES = {
  de: {
    deleteLayer: 'Ebene löschen',
    renameLayer: 'Ebene umbenennen',
    dragHandle:  'Zum Sortieren ziehen (Shift + ↑/↓)',
    visibility:  'Sichtbarkeit umschalten',
    lock:        'Sperre umschalten',
    layersHeader: 'Ebenen',
    noObjects: 'Noch keine Objekte. Füge Text, Bilder oder Formen hinzu.',
  },
  en: {
    deleteLayer: 'Delete layer',
    renameLayer: 'Rename layer',
    dragHandle:  'Drag to reorder (Shift + ↑/↓)',
    visibility:  'Toggle visibility',
    lock:        'Toggle lock',
    layersHeader: 'Layers',
    noObjects: 'No objects yet. Add text, images or shapes to the canvas.',
  },
} as const satisfies ComponentMessages<LayerPanelMessages>

// ── Icon map ──────────────────────────────────────────────────────────────────

const TYPE_ICON: Record<LayerType, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  text:       Type,
  image:      ImageIcon,
  rect:       Square,
  circle:     Circle,
  line:       Minus,
  group:      Layers,
  'wine-field': Tag,
  'qr-code':  QrCode,
}

// ── Panel ─────────────────────────────────────────────────────────────────────

export function LayerPanel({
  layers,
  selectedIds = [],
  onReorder,
  onSelect,
  onVisibilityToggle,
  onLockToggle,
  onRename,
  onDelete,
  onMove,
  className,
  messages,
}: LayerPanelProps) {
  const m = useComponentMessages(MESSAGES, messages)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = layers.findIndex((l) => l.id === active.id)
      const newIndex = layers.findIndex((l) => l.id === over.id)
      if (onReorder) onReorder(arrayMove(layers, oldIndex, newIndex))
    }
  }

  const handleMove = (id: string, dir: 1 | -1) => {
    if (onMove) {
      onMove(id, dir)
      return
    }
    
    if (!onReorder) return
    const idx = layers.findIndex(l => l.id === id)
    if (idx === -1) return
    const nextIdx = idx + dir
    if (nextIdx < 0 || nextIdx >= layers.length) return

    const nextLayers = [...layers]
    const [removed] = nextLayers.splice(idx, 1)
    nextLayers.splice(nextIdx, 0, removed)
    onReorder(nextLayers)
  }

  return (
    <div className={cn('flex flex-col bg-card border border-border rounded-xl overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {m.layersHeader}
        </span>
        <span className="text-xs text-muted-foreground">{layers.length}</span>
      </div>

      {/* Layer list */}
      {layers.length === 0 ? (
        <div className="flex items-center justify-center py-8 px-4 text-xs text-muted-foreground text-center">
          {m.noObjects}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={layers.map(l => l.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col divide-y divide-border" role="listbox" aria-label="Layer list">
              <AnimatePresence initial={false}>
                {layers.map((layer) => (
                  <SortableLayerRow
                    key={layer.id}
                    layer={layer}
                    selected={selectedIds.includes(layer.id)}
                    messages={m}
                    onSelect={() => onSelect?.(layer.id)}
                    onVisibilityToggle={() => onVisibilityToggle?.(layer.id)}
                    onLockToggle={() => onLockToggle?.(layer.id)}
                    onRename={(name) => onRename?.(layer.id, name)}
                    onDelete={() => onDelete?.(layer.id)}
                    onMove={(dir) => handleMove(layer.id, dir)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}

// ── Sortable Row ───────────────────────────────────────────────────────────────

function SortableLayerRow(props: {
  layer: Layer
  selected: boolean
  messages: LayerPanelMessages
  onSelect: () => void
  onVisibilityToggle: () => void
  onLockToggle: () => void
  onRename: (name: string) => void
  onDelete: () => void
  onMove: (dir: 1 | -1) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.layer.id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={cn(
        'relative z-0',
        isDragging && 'z-10 shadow-lg'
      )}
    >
      <LayerRow
        {...props}
        dragAttributes={attributes}
        dragListeners={listeners}
        isDragging={isDragging}
      />
    </motion.div>
  )
}

// ── Row Content ───────────────────────────────────────────────────────────────

function LayerRow({
  layer,
  selected,
  messages,
  onSelect,
  onVisibilityToggle,
  onLockToggle,
  onRename,
  onDelete,
  onMove,
  dragAttributes,
  dragListeners,
  isDragging,
}: {
  layer: Layer
  selected: boolean
  messages: LayerPanelMessages
  onSelect: () => void
  onVisibilityToggle: () => void
  onLockToggle: () => void
  onRename: (name: string) => void
  onDelete: () => void
  onMove: (dir: 1 | -1) => void
  dragAttributes: DraggableAttributes
  dragListeners: SyntheticListenerMap | undefined
  isDragging: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(layer.name)
  const TypeIcon = TYPE_ICON[layer.type]

  function commitRename() {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== layer.name) onRename(trimmed)
    else setDraft(layer.name)
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp' && e.shiftKey) {
      e.preventDefault()
      onMove(-1)
    } else if (e.key === 'ArrowDown' && e.shiftKey) {
      e.preventDefault()
      onMove(1)
    }
  }

  return (
    <div
      role="option"
      aria-selected={selected}
      className={cn(
        'group flex items-center gap-1.5 px-2 py-1.5 cursor-pointer transition-colors outline-none focus-visible:bg-accent/5',
        selected ? 'bg-accent/10' : 'hover:bg-muted/40',
        !layer.visible && 'opacity-40',
        isDragging && 'bg-accent/5 cursor-grabbing',
      )}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Drag handle */}
      <button
        type="button"
        aria-label={messages.dragHandle}
        title={messages.dragHandle}
        className="shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity touch-none focus-visible:opacity-100 focus-visible:text-accent focus:outline-none"
        {...dragAttributes}
        {...dragListeners}
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical size={12} strokeWidth={2} />
      </button>

      {/* Type icon */}
      <TypeIcon
        size={12}
        strokeWidth={1.75}
        className={cn('shrink-0', selected ? 'text-accent' : 'text-muted-foreground')}
      />

      {/* Name */}
      <div className="flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
        {editing ? (
          <input
            type="text"
            value={draft}
            autoFocus
            aria-label={messages.renameLayer}
            className="w-full text-xs bg-input border border-ring rounded px-1 py-0.5 text-foreground focus:outline-none"
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter')  commitRename()
              if (e.key === 'Escape') { setDraft(layer.name); setEditing(false) }
              e.stopPropagation()
            }}
          />
        ) : (
          <span
            className="block text-xs text-foreground truncate"
            onDoubleClick={() => { setDraft(layer.name); setEditing(true) }}
            title={layer.name}
          >
            {layer.name}
          </span>
        )}
      </div>

      {/* Controls — visible on hover or active */}
      <div
        className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <RowBtn onClick={onVisibilityToggle} title={messages.visibility}>
          {layer.visible ? <Eye size={11} /> : <EyeOff size={11} />}
        </RowBtn>
        <RowBtn onClick={onLockToggle} title={messages.lock}>
          {layer.locked ? <Lock size={11} /> : <Unlock size={11} />}
        </RowBtn>
        <RowBtn onClick={onDelete} title={messages.deleteLayer} danger>
          <Trash2 size={11} />
        </RowBtn>
      </div>
    </div>
  )
}

function RowBtn({
  onClick,
  title,
  danger,
  children,
}: {
  onClick: () => void
  title?: string
  danger?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        'flex items-center justify-center w-5 h-5 rounded transition-colors',
        danger
          ? 'text-muted-foreground hover:text-destructive hover:bg-destructive/10'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
      )}
    >
      {children}
    </button>
  )
}
