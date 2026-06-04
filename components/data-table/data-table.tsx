import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
  PaginationState,
  RowSelectionState,
  ColumnSizingState,
} from '@tanstack/react-table'
// eslint-disable-next-line no-restricted-imports -- useMemo is load-bearing for stable column defs/data refs that drive TanStack Table memo.
import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '../lib/utils'
import { useComponentMessages } from '../i18n'
import { Checkbox } from '../checkbox/checkbox'
import { MESSAGES, type DataTableMessages } from './messages'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  className?: string
  messages?: Partial<DataTableMessages>
  pageSize?: number
  // Controlled sorting
  sorting?: SortingState
  onSortingChange?: (sorting: SortingState) => void
  // Controlled pagination
  pagination?: PaginationState
  onPaginationChange?: (pagination: PaginationState) => void
  // Row selection (opt-in)
  enableRowSelection?: boolean
  rowSelection?: RowSelectionState
  onRowSelectionChange?: (selection: RowSelectionState) => void
  // Auto column sizing (opt-in)
  /**
   * Measure the widest accessor value across the *entire* dataset (not just
   * the visible page) and apply it as `min-width` to each column. Prevents
   * the table from jumping when sorting or paginating moves long values
   * in/out of view.
   */
  enableAutoColumnSize?: boolean
  // Column resizing (opt-in)
  /**
   * Allow users to drag the right edge of each column header to resize.
   * Enforces `table-layout: fixed` so dragged widths actually take effect.
   * Pairs well with `enableAutoColumnSize`: the measured widths seed the
   * initial column sizes so dragging starts from a sensible floor.
   */
  enableColumnResizing?: boolean
  columnSizing?: ColumnSizingState
  onColumnSizingChange?: (sizing: ColumnSizingState) => void
}

// ── Component ─────────────────────────────────────────────────────────────────

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
  messages,
  pageSize = 10,
  sorting: controlledSorting,
  onSortingChange,
  pagination: controlledPagination,
  onPaginationChange,
  enableRowSelection = false,
  rowSelection: controlledRowSelection,
  onRowSelectionChange,
  enableAutoColumnSize = false,
  enableColumnResizing = false,
  columnSizing: controlledColumnSizing,
  onColumnSizingChange,
}: DataTableProps<TData, TValue>) {
  const [internalSorting, setInternalSorting] = useState<SortingState>([])
  const [internalPagination, setInternalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  })
  const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>({})
  const [internalColumnSizing, setInternalColumnSizing] = useState<ColumnSizingState>({})
  const [[page, direction], setPage] = useState([0, 0])
  const m = useComponentMessages(MESSAGES, messages)
  const shouldReduceMotion = useReducedMotion()

  const sorting = controlledSorting ?? internalSorting
  const handleSortingChange = onSortingChange ?? setInternalSorting

  const pagination = controlledPagination ?? internalPagination
  const handlePaginationChange = (next: PaginationState) => {
    const dir = next.pageIndex > pagination.pageIndex ? 1 : -1
    setPage([next.pageIndex, dir])
    if (onPaginationChange) onPaginationChange(next)
    else setInternalPagination(next)
  }

  const rowSelection = controlledRowSelection ?? internalRowSelection
  const handleRowSelectionChange = onRowSelectionChange ?? setInternalRowSelection

  const columnSizing = controlledColumnSizing ?? internalColumnSizing
  const handleColumnSizingChange = onColumnSizingChange ?? setInternalColumnSizing

  const columnMinWidths = useColumnMinWidths(data, columns, enableAutoColumnSize)

  const tableColumns = useMemo(() => {
    const base = enableRowSelection
      ? [buildSelectionColumn<TData, TValue>(m), ...columns]
      : columns
    if (!enableAutoColumnSize) return base
    return base.map((col) => {
      const accessor = (col as { accessorKey?: string }).accessorKey
      const id = col.id ?? accessor
      const w = id ? columnMinWidths[id] : undefined
      return w ? { ...col, size: w, minSize: Math.max(40, Math.floor(w * 0.5)) } : col
    })
  }, [columns, columnMinWidths, enableAutoColumnSize, enableRowSelection, m])

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table's API is intentionally non-memoizable
  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection,
    enableColumnResizing,
    columnResizeMode: 'onChange',
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater
      handleSortingChange(next)
    },
    onPaginationChange: (updater) => {
      const next = typeof updater === 'function' ? updater(pagination) : updater
      handlePaginationChange(next)
    },
    onRowSelectionChange: (updater) => {
      const next = typeof updater === 'function' ? updater(rowSelection) : updater
      handleRowSelectionChange(next)
    },
    onColumnSizingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(columnSizing) : updater
      handleColumnSizingChange(next)
    },
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      pagination,
      rowSelection,
      columnSizing,
    },
  })

  // Sync internal page state if pagination prop changes from outside.
  // `page` is intentionally omitted: it is set inside this effect, so
  // including it would create a feedback loop.
  useEffect(() => {
    if (pagination.pageIndex !== page) {
      setPage([pagination.pageIndex, pagination.pageIndex > page ? 1 : -1])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex])

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 20 : -20,
      opacity: 0,
    }),
  }

  return (
    <div className={cn('flex flex-col gap-4 w-full', className)}>
      <div className="border-border bg-card overflow-hidden rounded-xl border">
        <div className="overflow-x-auto">
          <table
            className={cn(
              'w-full text-sm text-left border-collapse',
              enableColumnResizing && 'table-fixed'
            )}
            style={enableColumnResizing ? { width: table.getTotalSize() } : undefined}
          >
            {(enableAutoColumnSize || enableColumnResizing) && (
              <colgroup>
                {table.getAllLeafColumns().map((col) => {
                  if (enableColumnResizing) {
                    return <col key={col.id} style={{ width: `${col.getSize()}px` }} />
                  }
                  const w = columnMinWidths[col.id]
                  return <col key={col.id} style={w ? { minWidth: `${w}px` } : undefined} />
                })}
              </colgroup>
            )}
            <thead className="bg-muted/50 border-border border-b">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort()
                    const sorted = header.column.getIsSorted()
                    const ariaSort: 'ascending' | 'descending' | 'none' =
                      sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : 'none'
                    const nextSortLabel =
                      sorted === 'asc' ? m.sortDescending : sorted === 'desc' ? m.sortClear : m.sortAscending
                    const canResize = enableColumnResizing && header.column.getCanResize()
                    return (
                      <th
                        key={header.id}
                        scope="col"
                        aria-sort={canSort ? ariaSort : undefined}
                        className="text-muted-foreground relative px-4 py-3 font-semibold select-none"
                      >
                        {header.isPlaceholder ? null : canSort ? (
                          <button
                            type="button"
                            onClick={header.column.getToggleSortingHandler()}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                header.column.getToggleSortingHandler()?.(e)
                              }
                            }}
                            aria-label={nextSortLabel}
                            className="group text-muted-foreground hover:text-foreground focus-visible:ring-accent/60 focus-visible:ring-offset-card flex cursor-pointer items-center gap-2 rounded-sm border-0 bg-transparent p-0 font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            <span className="flex h-4 w-4 items-center justify-center" aria-hidden="true">
                              {sorted === 'asc' ? (
                                <ChevronUp size={14} />
                              ) : sorted === 'desc' ? (
                                <ChevronDown size={14} />
                              ) : (
                                <ChevronsUpDown size={14} className="opacity-40 transition-opacity group-hover:opacity-80" />
                              )}
                            </span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </div>
                        )}
                        {canResize && (
                          <ResizeHandle
                            label={m.resizeColumn}
                            isResizing={header.column.getIsResizing()}
                            onPointerDown={header.getResizeHandler()}
                            onKeyDown={(e) => {
                              const STEP = e.shiftKey ? 32 : 8
                              const current = header.column.getSize()
                              if (e.key === 'ArrowLeft') {
                                e.preventDefault()
                                handleColumnSizingChange({
                                  ...columnSizing,
                                  [header.column.id]: Math.max(40, current - STEP),
                                })
                              } else if (e.key === 'ArrowRight') {
                                e.preventDefault()
                                handleColumnSizingChange({
                                  ...columnSizing,
                                  [header.column.id]: current + STEP,
                                })
                              }
                            }}
                          />
                        )}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-border relative divide-y">
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, i) => (
                    <motion.tr
                      key={row.id}
                      layout={shouldReduceMotion ? false : true}
                      custom={direction}
                      variants={shouldReduceMotion ? undefined : variants}
                      initial={shouldReduceMotion ? false : 'enter'}
                      animate={shouldReduceMotion ? undefined : 'center'}
                      exit={shouldReduceMotion ? undefined : 'exit'}
                      transition={{
                        layout: { type: 'spring', stiffness: 180, damping: 24 },
                        opacity: { duration: 0.35, delay: i * 0.015 },
                        x: { type: 'spring', stiffness: 180, damping: 24, delay: i * 0.015 },
                      }}
                      className="hover:bg-muted/30 data-[state=selected]:bg-accent/5 transition-colors"
                      data-state={row.getIsSelected() ? 'selected' : undefined}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={cn(
                            'px-4 py-3 text-foreground whitespace-nowrap',
                            enableColumnResizing && 'overflow-hidden text-ellipsis'
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    key="empty"
                    initial={shouldReduceMotion ? false : { opacity: 0 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                  >
                    <td
                      colSpan={tableColumns.length}
                      className="text-muted-foreground h-24 text-center"
                    >
                      {m.noResults}
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 py-1">
        <div className="text-muted-foreground flex-1 text-xs">
          {m.pageOf
            .replace('{current}', String(table.getState().pagination.pageIndex + 1))
            .replace('{total}', String(table.getPageCount()))}
        </div>
        <div className="flex items-center gap-2">
          <PaginationBtn
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            title={m.firstPage}
          >
            <ChevronsLeft size={16} />
          </PaginationBtn>
          <PaginationBtn
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            title={m.prevPage}
          >
            <ChevronLeft size={16} />
          </PaginationBtn>
          <PaginationBtn
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            title={m.nextPage}
          >
            <ChevronRight size={16} />
          </PaginationBtn>
          <PaginationBtn
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            title={m.lastPage}
          >
            <ChevronsRight size={16} />
          </PaginationBtn>
        </div>
      </div>
    </div>
  )
}

function ResizeHandle({
  label,
  isResizing,
  onPointerDown,
  onKeyDown,
}: {
  label: string
  isResizing: boolean
  onPointerDown: (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void
}) {
  return (
    /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex --
       Column resize handle: role="separator" with tabIndex follows the
       WAI-ARIA splitter pattern. Arrow keys drive resize via onKeyDown. */
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      tabIndex={0}
      onMouseDown={(e) => {
        e.stopPropagation()
        onPointerDown(e)
      }}
      onTouchStart={(e) => {
        e.stopPropagation()
        onPointerDown(e)
      }}
      onKeyDown={onKeyDown}
      className={cn(
        'absolute right-0 top-0 h-full w-2 -mr-1 cursor-col-resize touch-none select-none',
        'after:absolute after:right-1 after:top-2 after:bottom-2 after:w-px',
        'after:bg-border hover:after:bg-accent focus-visible:after:bg-accent',
        'after:transition-colors focus-visible:outline-none',
        isResizing && 'after:bg-accent after:w-0.5'
      )}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    />
    /* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
  )
}

function PaginationBtn({
  onClick,
  disabled,
  title,
  children,
}: {
  onClick: () => void
  disabled: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className="border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 flex h-8 w-8 items-center justify-center rounded-lg border transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  )
}

/**
 * Measure the widest accessor value across the entire dataset (not just the
 * visible page) plus the header label, and return a px floor per column.
 *
 * Used as `min-width` on a `<colgroup>` so columns stay stable when long
 * values are sorted/paginated in or out of view. Uses canvas `measureText`
 * (cheap, no layout flush). Skipped when `enabled === false` or no DOM.
 */
function useColumnMinWidths<TData, TValue>(
  data: TData[],
  columns: ColumnDef<TData, TValue>[],
  enabled: boolean,
): Record<string, number> {
  return useMemo(() => {
    if (!enabled || typeof document === 'undefined') return {}
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return {}

    const FAMILY = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    const CELL_FONT = `400 14px ${FAMILY}`
    const HEADER_FONT = `600 14px ${FAMILY}`
    const CELL_PADDING_X = 32 // matches px-4 + px-4
    const SORT_ICON_BUFFER = 24 // chevron + gap

    const widths: Record<string, number> = {}

    for (const col of columns) {
      const accessor = (col as { accessorKey?: keyof TData }).accessorKey
      const id = col.id ?? (accessor as string | undefined)
      if (!id) continue

      ctx.font = HEADER_FONT
      const headerLabel = typeof col.header === 'string' ? col.header : id
      let max = ctx.measureText(headerLabel).width + SORT_ICON_BUFFER

      if (accessor) {
        ctx.font = CELL_FONT
        for (const row of data) {
          const v = row[accessor]
          const s = v == null ? '' : String(v)
          const w = ctx.measureText(s).width
          if (w > max) max = w
        }
      }

      widths[id] = Math.ceil(max + CELL_PADDING_X)
    }

    return widths
  }, [data, columns, enabled])
}

function buildSelectionColumn<TData, TValue>(m: DataTableMessages): ColumnDef<TData, TValue> {
  return {
    id: '__select__',
    enableSorting: false,
    header: ({ table }) => (
      <Checkbox
        size="sm"
        checked={table.getIsAllPageRowsSelected()}
        onChange={(checked) => table.toggleAllPageRowsSelected(checked)}
        aria-label={m.selectAllRows}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        size="sm"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={(checked) => row.toggleSelected(checked)}
        aria-label={m.selectRow}
      />
    ),
  }
}


