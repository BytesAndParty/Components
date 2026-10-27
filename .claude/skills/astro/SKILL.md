---
name: astro
description: Cached reference for Astro 7 — Vite 8, Rust-Compiler-Breaking-Changes, Sätteri-Markdown-Default, React-Compiler-Wiring (`@astrojs/react`), `<ClientRouter />`/View-Transitions. Load before upgrading Astro 6→7, wiring the React Compiler into an Astro project, debugging `astro:transitions`/`<ClientRouter />` behavior, or hitting a build error mentioning `_internal/logger`, `compressHTML`, or unclosed tags.
---

## Was dieser Skill ist

Gecachte Referenz für Astro 7 in drei Teilen: der reine Upgrade-Guide (Breaking Changes 6→7, Minor-Historie bis 7.3), die React-Compiler-Verdrahtung (`@astrojs/react` 6 per `babel-plugin-react-compiler`, ab `@astrojs/react` 7 per `compiler: true` + `oxc-transform-react` inklusive Peer-Fallstrick) und `astro:transitions`/`<ClientRouter />`. Alle drei hängen oft zusammen — ein Astro-Upgrade betrifft meist auch die React-Integration.

Vor jeder Astro-Versionsänderung, jeder React-Compiler-Einrichtung oder jedem Debugging von View-Transition-Verhalten den passenden Abschnitt in `reference.md` lesen, statt aus dem Gedächtnis zu arbeiten — die Rust-Compiler-Strenge und die Sätteri/remark-Weiche haben in der Praxis mehrfach zu falschen Annahmen geführt.

## References

- `reference.md` — drei Abschnitte: „Astro v7 Upgrade (6 → 7)" (Breaking Changes, Minor-Historie, der `_internal/logger`-Bugfix-Verlauf), „React Compiler Wiring in Astro" (`tsconfig`-Fallen, Verifikations-Trick per `useMemoCache`-Grep), „View Transitions" (`astro:transitions`-API-Historie).

## Notes

- Gecachter Snapshot, Stand siehe `reference.md`-Kopfzeile. Bei Verdacht auf Veraltung: neueste veröffentlichte Version per `bun info astro version` prüfen (die im Projekt installierte steht in `node_modules/astro/package.json`, Feld `version`) und gegen den Astro-Changelog abgleichen.
- Master-Quelle sind drei Dateien in `__AI-Workflow__/skills/live-docs-collection/` (`astro/v7-upgrade.md`, `astro-7/upgrade-and-react-compiler.md`, `astro-view-transitions/astro-view-transitions.md`), gepflegt über `/live-docs-update`. Nach einem Update dort diese Datei neu generieren, nicht von Hand nachziehen.
- Enthält eine dokumentierte, seit Astro 7.3.1 gefixte Build-Falle (`astro:assets` importierte einen nicht öffentlichen `_internal/logger`-Pfad) — vor einem harten Astro-Pin in einem Projekt zuerst prüfen, ob der Pin noch nötig ist.
