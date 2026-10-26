---
name: vitest
description: Cached reference for Vitest 5 — Vite-native test runner, `vi.when()` for argument-specific mocks, `clearMocks` default changed, Vite ≥ 6.4/Node ≥ 22.12 requirement. Load before writing or upgrading Vitest tests, or before assuming a project's Vitest version matches this reference — check the installed major first.
---

## Was dieser Skill ist

Gecachte Referenz für Vitest 5 — Artelier-Standard für Unit-/Component-Tests. Nutzt die bestehende Vite-Config (Plugins, Aliases) automatisch mit, kein separates Bundler-Setup nötig.

**Vor Gebrauch prüfen:** diese Referenz beschreibt **Major 5**. Ein Projekt kann bewusst oder unbewusst auf Major 4 stehen (`package.json` prüfen) — die hier dokumentierten `clearMocks`-Default- und `vi.when()`-Neuerungen gelten dann nicht.

## References

- `reference.md` — Requirements, Breaking Changes v4→v5, `vi.when()`, Trace View für Browser-Tests.

## Notes

- Gecachter Snapshot, Stand siehe `reference.md`-Kopfzeile. Bei Verdacht auf Veraltung: neueste veröffentlichte Version per `bun info vitest version` prüfen — **und** immer zuerst die tatsächlich installierte Version im Zielprojekt (`node_modules/vitest/package.json`, Feld `version`), bevor Inhalte aus dieser Referenz angewendet werden.
- Master-Quelle ist `__AI-Workflow__/skills/live-docs-collection/vitest/vitest.md`, gepflegt über `/live-docs-update`.
