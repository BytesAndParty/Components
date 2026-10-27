---
name: tanstack-hotkeys
description: Cached reference for `@tanstack/react-hotkeys` (Alpha) — typed hotkey strings (`"Mod+Shift+G"`), multi-key Vim-style sequences, input-focus auto-ignore. Load before wiring up more than 1–2 keyboard shortcuts, or when deciding between this Alpha package and Ark UI's built-in `Hotkeys` component.
---

## Was dieser Skill ist

Gecachte Referenz für TanStack Hotkeys — Status **Alpha**, API laut offizieller Doku noch nicht stabil. Vor Adoption in einem neuen Projekt bewusst abwägen: seit Ark UI 5.39 gibt es mit dessen `Hotkeys`-Komponente eine zweite Option ohne Zusatz-Dependency, wenn Ark UI ohnehin im Projekt ist.

## Related skills

- **`ark-ui`** — enthält seit v5.39 eine eigene `Hotkeys`-Komponente als Alternative ohne Zusatz-Dependency.

## References

- `reference.md` — `HotkeyManager`, typsichere Hotkey-Strings, `Mod`-Taste, Multi-Key-Sequenzen, Input-Focus-Ausnahme.

## Notes

- Gecachter Snapshot, Stand siehe `reference.md`-Kopfzeile. Bei Verdacht auf Veraltung: neueste veröffentlichte Version per `bun info @tanstack/react-hotkeys version` prüfen, die im Projekt installierte steht in `node_modules/@tanstack/react-hotkeys/package.json` (Feld `version`) — bei Alpha-Software besonders wichtig, da API-Brüche zwischen Minor-Versionen möglich sind.
- Master-Quelle ist `__AI-Workflow__/skills/live-docs-collection/tanstack-hotkeys/tanstack-hotkeys.md`, gepflegt über `/live-docs-update`.
