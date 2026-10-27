---
name: tanstack-table
description: Cached reference for `@tanstack/react-table` v9 — headless table library, `useTable({ features, columns, data })` API (major departure from the v8 `useReactTable`+`getCoreRowModel()` pattern). Load before building a data table/grid, or upgrading from v8, since the v8→v9 API shape changed materially.
---

## Was dieser Skill ist

Gecachte Referenz für TanStack Table v9 — Artelier-Standard für Data-Grids/Tabellen (statt eigener Sortier-/Filter-Logik von Hand). Liefert Logik/State/APIs, kein Markup — Rendering bleibt komplett beim Verbraucher. Die v9-API (`useTable`) unterscheidet sich deutlich von v8 (`useReactTable`), im Netz kursierende v8-Snippets funktionieren nicht 1:1.

## References

- `reference.md` — Quick Reference (`useTable`, `getHeaderGroups()`, `getRowModel()`).

## Notes

- Gecachter Snapshot, Stand siehe `reference.md`-Kopfzeile. Bei Verdacht auf Veraltung: neueste veröffentlichte Version per `bun info @tanstack/react-table version` prüfen, die im Projekt installierte steht in `node_modules/@tanstack/react-table/package.json` (Feld `version`).
- Master-Quelle ist `__AI-Workflow__/skills/live-docs-collection/tanstack-table/tanstack-table.md`, gepflegt über `/live-docs-update`.
