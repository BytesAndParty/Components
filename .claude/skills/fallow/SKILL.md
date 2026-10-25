---
name: fallow
description: Cached reference for fallow (Rust CLI, dead-code/dupes/health analyzer, `knip`+`jscpd` replacement) — commands, config keys, JSON schema, MCP integration, monorepo gotchas. Load before running `fallow`/`bunx fallow` for the first time in a project, triaging findings, writing `.fallowrc` suppressions, or debugging monorepo-specific false positives (unlisted deps, unused-file floods from undeclared workspaces).
---

## Was dieser Skill ist

Gecachte Referenz für fallow — Dead-Code-, Duplikations- und Health-Analyse für TypeScript/JavaScript-Monorepos. Deckt Commands, globale Flags, Config-Keys, das JSON-Schema (inkl. der v2→v3-Restrukturierung) sowie real aufgetretene Monorepo-Fallen ab (nicht-deklarierte Workspaces, Deps die in Workspace A importiert und in B deklariert werden, Vite-Single-Instance-Pins, die wie unused deps aussehen).

Vor jedem `fallow`-Run in einem neuen Projekt und vor jeder Config-Änderung in `reference.md` nachsehen — insbesondere die Sektion „Findings richtig lesen", die erklärt, welche Finding-Kategorien in Library-/Monorepo-Kontext systematische False Positives sind.

## References

- `reference.md` — Commands-Tabelle, Config-Keys, JSON-Top-Keys je Schema-Version, Inline-Suppression-Syntax, vier real aufgetretene Monorepo-Gotchas mit Fix, Quality-Gate-Empfehlung.

## Notes

- Gecachter Snapshot, Stand siehe `reference.md`-Kopfzeile. Bei Verdacht auf Veraltung: `bunx fallow --version` gegen die dokumentierte Version prüfen.
- Master-Quelle ist `__AI-Workflow__/skills/live-docs-collection/fallow/fallow.md`, gepflegt über `/live-docs-update`.
- Nicht jedes Finding ist totes Code — vor dem Löschen immer erst die Triage-Regeln in `reference.md` anwenden, nicht blind `fallow fix` laufen lassen.
