> Generiert aus der live-docs-collection (skills/live-docs-collection/tanstack-table/tanstack-table.md) am 2026-10-27. Master-Quelle ist dort gepflegt (`/live-docs-update`) — bei Zweifel an der Aktualität zuerst dort nachsehen und diese Datei danach neu generieren, nicht von Hand nachziehen.

# TanStack Table (React)

Headless Table-Library — liefert Logik/State/APIs, keine Markup/Styles. Rendering bleibt komplett beim Verbraucher.

## Quick Reference

```ts
const table = useTable({ features, columns, data })
// table.getHeaderGroups(), table.getRowModel().rows, ...
```

- Framework-agnostischer Core (`@tanstack/table-core`) + React-Adapter.
- 17 modulare, tree-shakeable Features: Filtering (Column/Global), Sorting, Pagination, Row/Column-Selection, Pinning, Visibility, Ordering, Resizing, Expanding, Grouping, Aggregation, Cell-Spanning/-Selection, Faceting.
- Bundle-Start ~25 KB (min+brotli) bei minimaler Feature-Auswahl.
- Komponiert mit anderen TanStack-Libs (Virtual, Query, Form, Store) statt eigene State-Lösung vorzuschreiben.

## Migration Notes

**Major-Version-Sprung v8 → v9:** `__Components__` ist seit 2026-10-27 auf **9.3.1** migriert (`components/data-table/`, Tabelle per `'use no memo'` vom React Compiler ausgenommen). Die v8-API (`useReactTable({ columns, data, getCoreRowModel: getCoreRowModel() })`, einzelne `getXRowModel()`-Imports pro Feature) ist **nicht** identisch mit der oben gezeigten v9-API (`useTable({ features, columns, data })`). v8 hat seit rund 18 Monaten kein Release mehr bekommen. Mapping für den Umstieg siehe nächster Abschnitt.

### v8 → v9 (Stand 2026-10-26)

Quelle: https://tanstack.com/table/latest/docs/framework/react/guide/migrating

| v8 | v9 |
|---|---|
| `useReactTable({ columns, data, getCoreRowModel: getCoreRowModel(), … })` | `useTable({ features, columns, data })` mit `features = tableFeatures({ rowSortingFeature, rowPaginationFeature, rowSelectionFeature, columnSizingFeature, columnResizingFeature, sortedRowModel, paginatedRowModel })`, nur die tatsächlich genutzten Einträge |
| `table.getState()` | `table.state` |
| `ColumnDef<TData, TValue>` | `ColumnDef` mit `TFeatures` als zusätzlichem Typparameter; im Projekt einen Alias-Typ anlegen, statt die Parameter an jeder Spalte zu wiederholen |
| Sortier-Funktionen per Name, `sortingFn: 'auto'` | Sortier-Funktionen müssen registriert werden; auch `'auto'` löst nur registrierte auf |
| Shift-Bereichsauswahl bei Zeilen | nur noch über `getToggleSelectedHandler` |
| — | `useLegacyTable` existiert als Übergang, ist aber deprecated |

### React Compiler (Stand 2026-10-26)

Quelle: https://tanstack.com/table/latest/docs/framework/react/guide/react-compiler

v9 ist laut Doku die erste React-Compiler-taugliche Version. Offen sind noch https://github.com/TanStack/table/issues/6577 und #6524; #6601 ist erst in 9.3.1 gefixt. Mit Compiler deshalb mindestens 9.3.1 einsetzen und die beiden offenen Issues vor dem Umstieg gegenlesen.

## Gotchas

- Octane/Ember/Alpine-Adapter sind neu in v9 (kein Migrationsthema für die hier relevanten React-Projekte).
- Da headless: kein Default-Styling — Tailwind/eigenes CSS auf den zurückgegebenen State anwenden, wie bei den anderen Ark-UI-Primitives auch.
