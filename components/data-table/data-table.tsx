import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
  PaginationState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '../lib/utils'
import { useComponentMessages } from '../i18n'
import { MESSAGES, type DataTableMessages } from './messages'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  className?: string
  messages?: Partial<DataTableMessages>
  // Controlled sorting
  sorting?: SortingState
  onSortingChange?: (sorting: SortingState) => void
  // Controlled pagination
  pagination?: PaginationState
  onPaginationChange?: (pagination: PaginationState) => void
}

// ── Component ─────────────────────────────────────────────────────────────────

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
  messages,
  sorting: controlledSorting,
  onSortingChange,
  pagination: controlledPagination,
  onPaginationChange,
}: DataTableProps<TData, TValue>) {
  const [internalSorting, setInternalSorting] = useState<SortingState>([])
  const [internalPagination, setInternalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [[page, direction], setPage] = useState([0, 0])
  const m = useComponentMessages(MESSAGES, messages)

  const sorting = controlledSorting ?? internalSorting
  const handleSortingChange = onSortingChange ?? setInternalSorting

  const pagination = controlledPagination ?? internalPagination
  const handlePaginationChange = (next: PaginationState) => {
    const dir = next.pageIndex > pagination.pageIndex ? 1 : -1
    setPage([next.pageIndex, dir])
    if (onPaginationChange) onPaginationChange(next)
    else setInternalPagination(next)
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater
      handleSortingChange(next)
    },
    onPaginationChange: (updater) => {
      const next = typeof updater === 'function' ? updater(pagination) : updater
      handlePaginationChange(next)
    },
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      pagination,
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
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 font-semibold text-muted-foreground select-none"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            'flex items-center gap-2',
                            header.column.getCanSort() && 'cursor-pointer hover:text-foreground transition-colors'
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <div className="w-4 h-4 flex items-center justify-center">
                              {{
                                asc: <ChevronUp size={14} />,
                                desc: <ChevronDown size={14} />,
                              }[header.column.getIsSorted() as string] ?? (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <ChevronUp size={14} />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border relative">
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, i) => (
                    <motion.tr
                      key={row.id}
                      layout
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ 
                        layout: { type: 'spring', stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                        x: { type: 'spring', stiffness: 300, damping: 30 },
                        delay: i * 0.01 // Subtle stagger
                      }}
                      className="hover:bg-muted/30 transition-colors data-[state=selected]:bg-accent/5"
                      data-state={row.getIsSelected() && 'selected'}
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td
                      colSpan={columns.length}
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


