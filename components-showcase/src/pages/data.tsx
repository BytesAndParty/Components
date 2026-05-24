import { Section } from '../components/section'
import { DataTable } from '@components/data-table/data-table'
import type { ColumnDef, SortingState, PaginationState } from '@tanstack/react-table'
import { useSearchParams } from 'react-router'
import { useMemo } from 'react'

interface WineInventory {
  id: string
  name: string
  year: number
  type: 'Red' | 'White' | 'Rosé' | 'Sparkling'
  stock: number
  price: number
  status: 'In Stock' | 'Low Stock' | 'Out of Stock'
}

const inventoryData: WineInventory[] = [
  // Weißweine (~22)
  { id: 'w1', name: 'Grüner Veltliner Klassik', year: 2023, type: 'White', stock: 120, price: 8.50, status: 'In Stock' },
  { id: 'w2', name: 'Grüner Veltliner Selection', year: 2023, type: 'White', stock: 85, price: 10.50, status: 'In Stock' },
  { id: 'w3', name: 'Riesling Seeberg', year: 2023, type: 'White', stock: 45, price: 12.00, status: 'In Stock' },
  { id: 'w4', name: 'Riesling Reserve', year: 2022, type: 'White', stock: 12, price: 18.50, status: 'Low Stock' },
  { id: 'w5', name: 'Neuburger', year: 2023, type: 'White', stock: 30, price: 9.50, status: 'In Stock' },
  { id: 'w6', name: 'Chardonnay Barrique', year: 2021, type: 'White', stock: 24, price: 15.00, status: 'In Stock' },
  { id: 'w7', name: 'Müller Thurgau', year: 2023, type: 'White', stock: 150, price: 7.50, status: 'In Stock' },
  { id: 'w8', name: 'Rotgipfler', year: 2023, type: 'White', stock: 40, price: 11.50, status: 'In Stock' },
  { id: 'w9', name: 'Pinot Blanc', year: 2023, type: 'White', stock: 55, price: 10.00, status: 'In Stock' },
  { id: 'w10', name: 'Gemischter Satz', year: 2023, type: 'White', stock: 0, price: 8.90, status: 'Out of Stock' },
  { id: 'w11', name: 'Sauvignon Blanc', year: 2023, type: 'White', stock: 65, price: 13.00, status: 'In Stock' },
  { id: 'w12', name: 'Welschriesling', year: 2023, type: 'White', stock: 90, price: 7.90, status: 'In Stock' },
  { id: 'w13', name: 'Gelber Muskateller', year: 2023, type: 'White', stock: 35, price: 11.00, status: 'In Stock' },
  { id: 'w14', name: 'Traminer', year: 2022, type: 'White', stock: 15, price: 14.50, status: 'Low Stock' },
  { id: 'w15', name: 'Weißburgunder Alte Reben', year: 2021, type: 'White', stock: 18, price: 16.50, status: 'In Stock' },
  { id: 'w16', name: 'Grüner Veltliner Smaragd', year: 2022, type: 'White', stock: 10, price: 22.00, status: 'Low Stock' },
  { id: 'w17', name: 'Riesling Federspiel', year: 2023, type: 'White', stock: 50, price: 13.50, status: 'In Stock' },
  { id: 'w18', name: 'Zierfandler', year: 2022, type: 'White', stock: 5, price: 19.00, status: 'Low Stock' },
  { id: 'w19', name: 'Muskat Ottonel', year: 2023, type: 'White', stock: 40, price: 9.90, status: 'In Stock' },
  { id: 'w20', name: 'Chardonnay Klassik', year: 2023, type: 'White', stock: 100, price: 9.00, status: 'In Stock' },
  { id: 'w21', name: 'Rivaner', year: 2023, type: 'White', stock: 120, price: 7.00, status: 'In Stock' },
  { id: 'w22', name: 'Grauburgunder Reserve', year: 2021, type: 'White', stock: 0, price: 21.00, status: 'Out of Stock' },

  // Rotweine (~32)
  { id: 'r1', name: 'Zweigelt Klassik', year: 2022, type: 'Red', stock: 200, price: 8.90, status: 'In Stock' },
  { id: 'r2', name: 'Zweigelt Selection', year: 2021, type: 'Red', stock: 45, price: 12.50, status: 'In Stock' },
  { id: 'r3', name: 'Blauer Portugieser', year: 2022, type: 'Red', stock: 150, price: 7.50, status: 'In Stock' },
  { id: 'r4', name: 'St. Laurent', year: 2021, type: 'Red', stock: 35, price: 14.00, status: 'In Stock' },
  { id: 'r5', name: 'Cabernet Sauvignon', year: 2020, type: 'Red', stock: 22, price: 19.50, status: 'In Stock' },
  { id: 'r6', name: 'Merlot Reserve', year: 2019, type: 'Red', stock: 8, price: 28.00, status: 'Low Stock' },
  { id: 'r7', name: 'Blaufränkisch Ried', year: 2020, type: 'Red', stock: 30, price: 16.50, status: 'In Stock' },
  { id: 'r8', name: 'Blauburger', year: 2022, type: 'Red', stock: 60, price: 8.00, status: 'In Stock' },
  { id: 'r9', name: 'Pinot Noir', year: 2021, type: 'Red', stock: 15, price: 22.50, status: 'Low Stock' },
  { id: 'r10', name: 'Cuvee Barrique', year: 2019, type: 'Red', stock: 4, price: 35.00, status: 'Low Stock' },
  { id: 'r11', name: 'Zweigelt Rosé', year: 2023, type: 'Rosé', stock: 95, price: 8.50, status: 'In Stock' },
  { id: 'r12', name: 'Syrah Reserve', year: 2020, type: 'Red', stock: 10, price: 24.00, status: 'Low Stock' },
  { id: 'r13', name: 'Roesler', year: 2021, type: 'Red', stock: 25, price: 13.50, status: 'In Stock' },
  { id: 'r14', name: 'Zweigelt Alte Reben', year: 2018, type: 'Red', stock: 0, price: 26.00, status: 'Out of Stock' },
  { id: 'r15', name: 'Merlot Klassik', year: 2021, type: 'Red', stock: 40, price: 12.00, status: 'In Stock' },
  { id: 'r16', name: 'Cabernet Franc', year: 2020, type: 'Red', stock: 12, price: 21.00, status: 'Low Stock' },
  { id: 'r17', name: 'Blauer Wildbacher', year: 2022, type: 'Red', stock: 18, price: 11.00, status: 'In Stock' },
  { id: 'r18', name: 'St. Laurent Reserve', year: 2019, type: 'Red', stock: 6, price: 29.50, status: 'Low Stock' },
  { id: 'r19', name: 'Zweigelt Auslese', year: 2020, type: 'Red', stock: 20, price: 18.00, status: 'In Stock' },
  { id: 'r20', name: 'Cuvee Privat', year: 2018, type: 'Red', stock: 2, price: 45.00, status: 'Low Stock' },
  { id: 'r21', name: 'Blaufränkisch Klassik', year: 2021, type: 'Red', stock: 80, price: 10.50, status: 'In Stock' },
  { id: 'r22', name: 'Dornfelder', year: 2022, type: 'Red', stock: 45, price: 9.00, status: 'In Stock' },
  { id: 'r23', name: 'Regent', year: 2021, type: 'Red', stock: 30, price: 11.90, status: 'In Stock' },
  { id: 'r24', name: 'Shiraz', year: 2020, type: 'Red', stock: 15, price: 19.90, status: 'Low Stock' },
  { id: 'r25', name: 'Blauer Portugieser Holzfass', year: 2021, type: 'Red', stock: 40, price: 10.00, status: 'In Stock' },
  { id: 'r26', name: 'Cabernet Sauvignon Reserve', year: 2018, type: 'Red', stock: 0, price: 38.00, status: 'Out of Stock' },
  { id: 'r27', name: 'Merlot Selection', year: 2020, type: 'Red', stock: 25, price: 17.50, status: 'In Stock' },
  { id: 'r28', name: 'St. Laurent Selection', year: 2021, type: 'Red', stock: 30, price: 15.50, status: 'In Stock' },
  { id: 'r29', name: 'Zweigelt Rubin', year: 2021, type: 'Red', stock: 50, price: 13.90, status: 'In Stock' },
  { id: 'r30', name: 'Pinot Noir Reserve', year: 2019, type: 'Red', stock: 10, price: 31.00, status: 'Low Stock' },
  { id: 'r31', name: 'Cuvee Red Pearl', year: 2021, type: 'Red', stock: 65, price: 11.50, status: 'In Stock' },
  { id: 'r32', name: 'Zweigelt Grand Reserve', year: 2017, type: 'Red', stock: 4, price: 42.00, status: 'Low Stock' },

  // Frizzante & Andere (~6)
  { id: 'f1', name: 'Feenzauber Frizzante', year: 2023, type: 'Sparkling', stock: 120, price: 9.50, status: 'In Stock' },
  { id: 'f2', name: 'Red Pearl Frizzante', year: 2023, type: 'Sparkling', stock: 80, price: 9.50, status: 'In Stock' },
  { id: 'f3', name: 'Rosé Frizzante', year: 2023, type: 'Sparkling', stock: 45, price: 9.50, status: 'In Stock' },
  { id: 'f4', name: 'Traubensaft Weiß', year: 2023, type: 'White', stock: 300, price: 4.50, status: 'In Stock' },
  { id: 'f5', name: 'Traubensaft Rot', year: 2023, type: 'Red', stock: 250, price: 4.50, status: 'In Stock' },
  { id: 'f6', name: 'Aktion Weinpaket 6er', year: 2024, type: 'Red', stock: 20, price: 55.00, status: 'In Stock' },
]

export function DataPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Parse sorting from URL: ?sort=name:asc
  const sorting = useMemo<SortingState>(() => {
    const sort = searchParams.get('sort')
    if (!sort) return []
    const [id, desc] = sort.split(':')
    return [{ id, desc: desc === 'desc' }]
  }, [searchParams])

  // Parse pagination from URL: ?page=1
  const pagination = useMemo<PaginationState>(() => {
    const page = parseInt(searchParams.get('page') || '1', 10)
    return {
      pageIndex: Math.max(0, page - 1),
      pageSize: 15,
    }
  }, [searchParams])

  // Update URL when sorting/pagination changes
  const handleSortingChange = (newSorting: SortingState) => {
    const nextParams = new URLSearchParams(searchParams)
    if (newSorting.length > 0) {
      const { id, desc } = newSorting[0]
      nextParams.set('sort', `${id}:${desc ? 'desc' : 'asc'}`)
    } else {
      nextParams.delete('sort')
    }
    // Reset to page 1 on sort change
    nextParams.set('page', '1')
    setSearchParams(nextParams, { replace: true })
  }

  const handlePaginationChange = (newPagination: PaginationState) => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('page', String(newPagination.pageIndex + 1))
    setSearchParams(nextParams, { replace: true })
  }

  const columns: ColumnDef<WineInventory>[] = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
    },
    {
      accessorKey: 'year',
      header: 'Year',
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('type') as string
        const colors: Record<string, string> = {
          Red: 'bg-red-500/10 text-red-700 dark:text-red-300 ring-red-500/20',
          White: 'bg-amber-500/15 text-amber-800 dark:text-amber-200 ring-amber-500/25',
          Rosé: 'bg-pink-500/10 text-pink-700 dark:text-pink-300 ring-pink-500/20',
          Sparkling: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 ring-sky-500/20',
        }
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${colors[type]}`}>
            {type}
          </span>
        )
      },
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
      cell: ({ row }) => <span className="font-mono">{row.getValue('stock')}</span>,
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => {
        const price = parseFloat(row.getValue('price'))
        const formatted = new Intl.NumberFormat('de-DE', {
          style: 'currency',
          currency: 'EUR',
        }).format(price)
        return <span className="font-mono">{formatted}</span>
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        const dotColors: Record<string, string> = {
          'In Stock': 'bg-emerald-500',
          'Low Stock': 'bg-amber-500',
          'Out of Stock': 'bg-rose-500',
        }
        return (
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${dotColors[status]}`} />
            <span className="text-xs">{status}</span>
          </div>
        )
      },
    },
  ], [])

  return (
    <div className="space-y-12">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold -tracking-[0.04em]">Data & Tables</h1>
        <p className="text-muted-foreground">
          Powerful, sortable tables powered by TanStack Table with smooth spring animations and full URL synchronization (sort & page).
        </p>
      </header>

      <Section 
        title="Wine Inventory" 
        description="A comprehensive list of our current wine stock with status indicators, sorting, and pagination."
      >
        <DataTable 
          columns={columns} 
          data={inventoryData} 
          sorting={sorting} 
          onSortingChange={handleSortingChange}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
        />
      </Section>

      <Section 
        title="Empty State" 
        description="How the table looks when no results are found."
      >
        <DataTable columns={columns} data={[]} />
      </Section>
    </div>
  )
}
