---
name: fontsource
description: Cached reference for `@fontsource/*` — self-hosted Google-Fonts npm packages, no `<link>` to fonts.googleapis.com, no CSP hole, no external request. Load before adding a self-hosted web font, choosing between static and `-variable` packages, or setting up per-weight imports.
---

## Was dieser Skill ist

Gecachte Referenz für Fontsource — Google-Fonts-Distribution als npm-Pakete statt externer `<link>`-Tags. Relevant für jedes Projekt mit der Non-Goal-Regel „keine externen Requests zur Laufzeit" (self-contained Static-Sites), da Fontsource das Font-File direkt mitcommittet statt zur Laufzeit von Google zu laden.

## References

- `reference.md` — Naming Convention (statisch vs. `-variable`), Per-Gewicht-Import-Pattern, Installationsschritte.

## Notes

- Gecachter Snapshot, Stand siehe `reference.md`-Kopfzeile. Bei Verdacht auf Veraltung: `npm view @fontsource/<familie> version` prüfen.
- Master-Quelle ist `__AI-Workflow__/skills/live-docs-collection/fontsource/fontsource.md`, gepflegt über `/live-docs-update`.
