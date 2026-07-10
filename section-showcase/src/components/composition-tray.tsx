import { useNavigate } from 'react-router'
import { ArrowRight, GripVertical, Heart, Trash2, X } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { sections, findSection } from '../sections/registry'
import { useShowcase } from '../showcase-state'
import { encodeComposition } from '../composition-url'

interface CompositionTrayProps {
  onClose: () => void
}

/** Resolved favorite row: section + the chosen variant, in page order. */
interface TrayRow {
  sectionId: string
  sectionLabel: string
  variantLabel: string
}

export function CompositionTray({ onClose }: CompositionTrayProps) {
  const navigate = useNavigate()
  const { composition, reorderFavorites, toggleFavorite, clearFavorites } = useShowcase()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  // Resolve the ordered favorites into display rows, skipping any stale ids.
  const rows: TrayRow[] = composition.order.flatMap(sectionId => {
    const section = findSection(sectionId)
    const variantId = composition.favorites[sectionId]
    const variant = section?.variants.find(v => v.id === variantId)
    if (!section || !variant) return []
    return [{ sectionId, sectionLabel: section.label, variantLabel: variant.label }]
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = composition.order.indexOf(active.id as string)
    const newIndex = composition.order.indexOf(over.id as string)
    if (oldIndex < 0 || newIndex < 0) return
    reorderFavorites(arrayMove(composition.order, oldIndex, newIndex))
  }

  function confirm() {
    onClose()
    const s = encodeComposition(composition)
    navigate(s ? `/preview?s=${s}` : '/preview')
  }

  return (
    <div
      role="dialog"
      aria-label="Favorisierte Sections"
      className="border-border bg-elevated absolute right-0 bottom-full mb-2 flex w-[min(92vw,360px)] flex-col overflow-hidden rounded-xl border shadow-xl"
    >
      <div className="border-border flex items-center justify-between border-b px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <Heart size={13} className="text-accent fill-accent" />
          <span className="font-display text-sm tracking-tight">Deine Seite</span>
          <span className="text-muted-foreground text-xs tabular-nums">
            {rows.length}/{sections.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Schließen"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-accent/60 rounded-md p-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <X size={14} />
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="text-muted-foreground px-4 py-8 text-center text-sm">
          Noch keine Favoriten.
          <br />
          Markier eine Variante mit dem{' '}
          <Heart size={12} className="inline -translate-y-px" /> Herz.
        </div>
      ) : (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={composition.order} strategy={verticalListSortingStrategy}>
              <ul className="flex max-h-[46vh] flex-col gap-1 overflow-y-auto p-1.5">
                {rows.map((row, i) => (
                  <SortableTrayRow
                    key={row.sectionId}
                    row={row}
                    index={i}
                    onRemove={() => toggleFavorite(row.sectionId, composition.favorites[row.sectionId])}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>

          <div className="border-border flex items-center gap-2 border-t px-3 py-2.5">
            <button
              type="button"
              onClick={clearFavorites}
              className="text-muted-foreground hover:text-foreground focus-visible:ring-accent/60 flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <Trash2 size={13} />
              Leeren
            </button>
            <div className="flex-1" />
            <button
              type="button"
              onClick={confirm}
              className="bg-foreground text-background hover:bg-foreground/90 focus-visible:ring-accent/60 flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Vorschau
              <ArrowRight size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function SortableTrayRow({
  row,
  index,
  onRemove,
}: {
  row: TrayRow
  index: number
  onRemove: () => void
}) {
  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging,
  } = useSortable({ id: row.sectionId })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`border-border bg-background/60 flex items-center gap-2 rounded-lg border px-2 py-2 ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`${row.sectionLabel} verschieben`}
        className="text-muted-foreground/50 hover:text-foreground focus-visible:ring-accent/60 cursor-grab touch-none rounded p-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none active:cursor-grabbing"
      >
        <GripVertical size={15} />
      </button>

      <span className="text-muted-foreground/60 w-4 text-center text-xs tabular-nums">
        {index + 1}
      </span>

      <div className="min-w-0 flex-1">
        <p className="font-display truncate text-sm leading-tight tracking-tight">
          {row.sectionLabel}
        </p>
        <p className="text-muted-foreground truncate text-[11px] tracking-wide uppercase">
          {row.variantLabel}
        </p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        aria-label={`${row.sectionLabel} entfernen`}
        className="text-muted-foreground hover:text-foreground focus-visible:ring-accent/60 rounded-md p-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        <X size={14} />
      </button>
    </li>
  )
}
