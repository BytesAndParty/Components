import { useState } from 'react'
import { Reorder, useDragControls } from 'motion/react'
import {
  Type, ImageIcon, Square, Circle, Minus, Layers, Tag, QrCode,
  Eye, EyeOff, Lock, Unlock, Trash2, GripVertical,
} from 'lucide-react'
import { cn } from '../lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

export type LayerType = 'text' | 'image' | 'rect' | 'circle' | 'line' | 'group' | 'wine-field' | 'qr-code'

export interface Layer {
  id: string
  name: string
  type: LayerType
  visible: boolean
  locked: boolean
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
  className?: string
}

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
  className,
}: LayerPanelProps) {
  return (
    <div className={cn('flex flex-col bg-card border border-border rounded-xl overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Layers
        </span>
        <span className="text-xs text-muted-foreground">{layers.length}</span>
      </div>

      {/* Layer list */}
      {layers.length === 0 ? (
        <div className="flex items-center justify-center py-8 px-4 text-xs text-muted-foreground text-center">
          No objects yet. Add text, images or shapes to the canvas.
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={layers}
          onReorder={onReorder ?? (() => {})}
          className="flex flex-col divide-y divide-border"
          layoutScroll
        >
          {layers.map((layer) => (
            <LayerRow
              key={layer.id}
              layer={layer}
              selected={selectedIds.includes(layer.id)}
              onSelect={() => onSelect?.(layer.id)}
              onVisibilityToggle={() => onVisibilityToggle?.(layer.id)}
              onLockToggle={() => onLockToggle?.(layer.id)}
              onRename={(name) => onRename?.(layer.id, name)}
              onDelete={() => onDelete?.(layer.id)}
            />
          ))}
        </Reorder.Group>
      )}
    </div>
  )
}

// ── Row ───────────────────────────────────────────────────────────────────────

function LayerRow({
  layer,
  selected,
  onSelect,
  onVisibilityToggle,
  onLockToggle,
  onRename,
  onDelete,
}: {
  layer: Layer
  selected: boolean
  onSelect: () => void
  onVisibilityToggle: () => void
  onLockToggle: () => void
  onRename: (name: string) => void
  onDelete: () => void
}) {
  const controls = useDragControls()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(layer.name)
  const TypeIcon = TYPE_ICON[layer.type]

  function commitRename() {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== layer.name) onRename(trimmed)
    else setDraft(layer.name)
    setEditing(false)
  }

  return (
    <Reorder.Item
      value={layer}
      dragListener={false}
      dragControls={controls}
      className={cn(
        'group flex items-center gap-1.5 px-2 py-1.5 cursor-pointer transition-colors',
        selected ? 'bg-accent/10' : 'hover:bg-muted/40',
        !layer.visible && 'opacity-40',
      )}
      onClick={onSelect}
      layout
    >
      {/* Drag handle */}
      <button
        type="button"
        className="shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity touch-none"
        onPointerDown={(e) => { e.stopPropagation(); controls.start(e) }}
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
        className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <RowBtn onClick={onVisibilityToggle} title={layer.visible ? 'Hide' : 'Show'}>
          {layer.visible ? <Eye size={11} /> : <EyeOff size={11} />}
        </RowBtn>
        <RowBtn onClick={onLockToggle} title={layer.locked ? 'Unlock' : 'Lock'}>
          {layer.locked ? <Lock size={11} /> : <Unlock size={11} />}
        </RowBtn>
        <RowBtn onClick={onDelete} title="Delete" danger>
          <Trash2 size={11} />
        </RowBtn>
      </div>
    </Reorder.Item>
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
