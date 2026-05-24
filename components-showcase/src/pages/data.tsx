import { Section } from '../components/section'
import { DataTable } from '@components/data-table/data-table'
import type { ColumnDef } from '@tanstack/react-table'

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
  { id: '1', name: 'Riesling Classic', year: 2023, type: 'White', stock: 120, price: 12.50, status: 'In Stock' },
  { id: '2', name: 'Spätburgunder Reserve', year: 2021, type: 'Red', stock: 15, price: 24.90, status: 'Low Stock' },
  { id: '3', name: 'Chardonnay Barrique', year: 2022, type: 'White', stock: 45, price: 18.00, status: 'In Stock' },
  { id: '4', name: 'Grauburgunder', year: 2023, type: 'White', stock: 0, price: 11.20, status: 'Out of Stock' },
  { id: '5', name: 'Rosé de Provence', year: 2023, type: 'Rosé', stock: 85, price: 14.50, status: 'In Stock' },
  { id: '6', name: 'Cuvée Brut', year: 2020, type: 'Sparkling', stock: 30, price: 29.00, status: 'In Stock' },
  { id: '7', name: 'Merlot', year: 2021, type: 'Red', stock: 60, price: 16.80, status: 'In Stock' },
  { id: '8', name: 'Sauvignon Blanc', year: 2023, type: 'White', stock: 95, price: 13.90, status: 'In Stock' },
  { id: '9', name: 'Cabernet Sauvignon', year: 2020, type: 'Red', stock: 8, price: 32.00, status: 'Low Stock' },
  { id: '10', name: 'Pinot Grigio', year: 2023, type: 'White', stock: 150, price: 9.90, status: 'In Stock' },
  { id: '11', name: 'Syrah', year: 2019, type: 'Red', stock: 25, price: 27.50, status: 'In Stock' },
  { id: '12', name: 'Grüner Veltliner', year: 2023, type: 'White', stock: 200, price: 10.50, status: 'In Stock' },
]

const columns: ColumnDef<WineInventory>[] = [
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
        Red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        White: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        Rosé: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
        Sparkling: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      }
      return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${colors[type]}`}>
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
]

export function DataPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold -tracking-[0.04em]">Data & Tables</h1>
        <p className="text-muted-foreground">
          Powerful, sortable, and paginated tables powered by TanStack Table.
        </p>
      </header>

      <Section 
        title="Wine Inventory" 
        description="A comprehensive list of our current wine stock with status indicators and sorting."
      >
        <DataTable columns={columns} data={inventoryData} pageSize={5} />
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
