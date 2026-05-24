# DataTable

A feature-rich, accessible data table powered by TanStack Table. Designed for high-performance data display, it supports sorting, pagination, and flexible column rendering while maintaining a cohesive design engine aesthetic.

## Features

- **TanStack Table Core**: Leverages the gold standard for headless table logic (React Table v8).
- **Sorting**: Built-in support for column sorting with visual indicators and accessible toggles.
- **Pagination**: Client-side pagination with customizable page sizes and "First/Prev/Next/Last" controls.
- **Flexible Columns**: Uses `ColumnDef` for deep control over cell rendering, formatting, and alignment.
- **Responsive**: Horizontal overflow handling ensures data remains accessible on mobile and small viewports.
- **Empty States**: Integrated "No Results" messaging when data is filtered out or empty.
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
| `pageSize` | `number` | `10` | Number of items to display per page. |
| `className` | `string` | — | Additional CSS classes for the outer wrapper. |
| `messages` | `Partial<DataTableMessages>` | — | Message overrides for pagination and empty states. |

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
- `lucide-react` — Navigation and sort icons
- `clsx` & `tailwind-merge` — Style utility (`cn`)
- `@components/i18n` — Internationalization hooks
