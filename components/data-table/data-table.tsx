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
} from '@tanstack/react-table'
import { useEffect, useState } from 'react'
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
}: DataTableProps<TData, TValue>) {
  const [internalSorting, setInternalSorting] = useState<SortingState>([])
  const [internalPagination, setInternalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  })
  const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>({})
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

  const tableColumns = enableRowSelection
    ? [buildSelectionColumn<TData, TValue>(m), ...columns]
    : columns

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection,
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
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      pagination,
      rowSelection,
    },
  })

  // Sync internal page state if pagination prop changes from outside
  useEffect(() => {
    if (pagination.pageIndex !== page) {
      setPage([pagination.pageIndex, pagination.pageIndex > page ? 1 : -1])
    }
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
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-muted/50 border-b border-border">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort()
                    const sorted = header.column.getIsSorted()
                    const ariaSort: 'ascending' | 'descending' | 'none' =
                      sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : 'none'
                    const nextSortLabel =
                      sorted === 'asc' ? m.sortDescending : sorted === 'desc' ? m.sortClear : m.sortAscending
                    return (
                      <th
                        key={header.id}
                        scope="col"
                        aria-sort={canSort ? ariaSort : undefined}
                        className="px-4 py-3 font-semibold text-muted-foreground select-none"
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
                            className="group flex items-center gap-2 bg-transparent border-0 p-0 font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-sm"
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            <span className="w-4 h-4 flex items-center justify-center" aria-hidden="true">
                              {sorted === 'asc' ? (
                                <ChevronUp size={14} />
                              ) : sorted === 'desc' ? (
                                <ChevronDown size={14} />
                              ) : (
                                <ChevronsUpDown size={14} className="opacity-40 group-hover:opacity-80 transition-opacity" />
                              )}
                            </span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </div>
                        )}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border relative">
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
                      className="hover:bg-muted/30 transition-colors data-[state=selected]:bg-accent/5"
                      data-state={row.getIsSelected() ? 'selected' : undefined}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 text-foreground whitespace-nowrap">
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
                      className="h-24 text-center text-muted-foreground"
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
        <div className="flex-1 text-xs text-muted-foreground">
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
      className="flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
    >
      {children}
    </button>
  )
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


