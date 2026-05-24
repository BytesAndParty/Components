# DataTable

A feature-rich, accessible data table powered by TanStack Table. Designed for high-performance data display, it supports sorting, pagination, and flexible column rendering while maintaining a cohesive design engine aesthetic.

## Features

- **TanStack Table Core**: Leverages the gold standard for headless table logic (React Table v8).
- **Sorting**: Built-in support for column sorting with visual indicators and accessible toggles.
- **Pagination**: Client-side pagination with customizable page sizes and "First/Prev/Next/Last" controls.
- **Flexible Columns**: Uses `ColumnDef` for deep control over cell rendering, formatting, and alignment.
- **Responsive**: Horizontal overflow handling ensures data remains accessible on mobile and small viewports.
- **Empty States**: Integrated "No Results" messaging when data is filtered out or empty.
- **Row Selection (opt-in)**: Header + per-row checkboxes via the project `Checkbox`. Controllable or uncontrolled; emits `RowSelectionState`.
- **Accessibility**: Sort headers are real buttons with `aria-sort`, keyboard activation (Enter/Space), focus ring; `prefers-reduced-motion` disables row spring/stagger.
- **i18n Ready**: Localized pagination labels ("Page X of Y") and button titles.

## How It Works

1. **Headless Logic**: Uses the `useReactTable` hook to manage complex state (sorting, pagination indices) without dictating the DOM structure.
2. **UI Mapping**: Iterates through `getHeaderGroups()` and `getRowModel()` to render standard HTML `<table>` elements with design-system-compliant classes.
3. **Decoupled Rendering**: Utilizes `flexRender` to allow both simple strings and complex React components within column definitions.
4. **Themed Styling**: Uses Tailwind CSS for consistent borders, rounded corners (`xl`), and interactive hover states (`hover:bg-muted/30`).

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `ColumnDef<TData, TValue>[]` | — | TanStack Table column definitions. Defines data mapping and header labels. |
| `data` | `TData[]` | — | The array of objects to be displayed. |
| `pageSize` | `number` | `10` | Initial number of rows per page (used when `pagination` is uncontrolled). |
| `className` | `string` | — | Additional CSS classes for the outer wrapper. |
| `messages` | `Partial<DataTableMessages>` | — | Message overrides for pagination and empty states. |
| `sorting` | `SortingState` | — | Controlled sorting state. Omit for internal (uncontrolled) sorting. |
| `onSortingChange` | `(sorting: SortingState) => void` | — | Called when sorting changes. Required when `sorting` is controlled. |
| `pagination` | `PaginationState` | — | Controlled pagination state (`{ pageIndex, pageSize }`). Omit for internal state. |
| `onPaginationChange` | `(pagination: PaginationState) => void` | — | Called when pagination changes. Required when `pagination` is controlled. |
| `enableRowSelection` | `boolean` | `false` | Opt-in: prepends a checkbox column with select-all-on-page in the header. |
| `rowSelection` | `RowSelectionState` | — | Controlled selection map (`{ [rowId: string]: boolean }`). Omit for internal state. |
| `onRowSelectionChange` | `(selection: RowSelectionState) => void` | — | Called when selection changes. Required when `rowSelection` is controlled. |

## Usage

### Basic Example

```tsx
import { DataTable } from '@components/data-table'
import { ColumnDef } from '@tanstack/react-table'

interface User {
  id: string
  name: string
  role: string
}

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'role', header: 'Position' }
]

const users = [
  { id: '1', name: 'Robert', role: 'Architect' },
  { id: '2', name: 'Alice', role: 'Designer' }
]

<DataTable columns={columns} data={users} pageSize={5} />
```

### Controlled Sorting & Pagination (URL-driven)

```tsx
import { useState } from 'react'
import { DataTable } from '@components/data-table'
import type { SortingState, PaginationState } from '@tanstack/react-table'

const [sorting, setSorting] = useState<SortingState>([])
const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

<DataTable
  columns={columns}
  data={users}
  sorting={sorting}
  onSortingChange={setSorting}
  pagination={pagination}
  onPaginationChange={setPagination}
/>
```

### Row Selection (opt-in)

```tsx
import { useState } from 'react'
import { DataTable } from '@components/data-table'
import type { RowSelectionState } from '@tanstack/react-table'

const [selection, setSelection] = useState<RowSelectionState>({})
const selectedRows = users.filter((u) => selection[u.id])

<DataTable
  columns={columns}
  data={users}
  enableRowSelection
  rowSelection={selection}
  onRowSelectionChange={setSelection}
/>

{/* Bulk actions are rendered by the consumer based on the selection state. */}
{selectedRows.length > 0 && (
  <button onClick={() => deleteUsers(selectedRows)}>
    Delete {selectedRows.length} selected
  </button>
)}
```

> **Note:** Selection uses each row's React-Table-generated id. To make selection stable across re-renders, pass `getRowId={(row) => row.id}` via your column setup (TanStack docs).

### With Custom Cell Rendering

```tsx
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'role',
    header: 'Access Level',
    cell: ({ row }) => (
      <span className="px-2 py-0.5 rounded bg-accent/10 text-accent font-bold">
        {row.original.role.toUpperCase()}
      </span>
    )
  }
]
```

## Dependencies

- `@tanstack/react-table` — Table engine
- `motion` — Row spring/layout transitions; honors `prefers-reduced-motion` via `useReducedMotion`
- `lucide-react` — Navigation and sort icons
- `clsx` & `tailwind-merge` — Style utility (`cn`)
- `@components/i18n` — Internationalization hooks
- `@components/checkbox` — Used internally when `enableRowSelection` is true
