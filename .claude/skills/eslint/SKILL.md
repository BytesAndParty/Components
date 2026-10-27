---
name: eslint
description: Cached reference for ESLint 10 (Flat-Config-only, `.eslintrc` removed) plus `eslint-plugin-astro`/`astro-eslint-parser` v3 (Rust-compiler-based Astro parsing). Load before upgrading ESLint across a major version, debugging why `.astro` files fail to parse, or hitting new `recommended`-rule reports after an upgrade (`no-unassigned-vars`, JSX-reference-tracking, `no-shadow-restricted-names`).
---

## Was dieser Skill ist

Gecachte Referenz in zwei Teilen: ESLint 10 selbst (Flat-Config-Pflicht, entfernte Legacy-APIs, neue `recommended`-Regeln) und `eslint-plugin-astro`/`astro-eslint-parser` v3 (Parser-Wechsel auf Astros Rust-Compiler, deprecatete Regeln). Beide hängen zusammen, sobald ein Projekt sowohl ESLint als auch `.astro`-Dateien lintet.

Vor jedem ESLint-Major-Upgrade oder jeder unerwarteten neuen Lint-Meldung nach einem `bun update` zuerst in `reference.md` nachsehen, ob es sich um eine bekannte, dokumentierte Verhaltensänderung handelt.

## References

- `reference.md` — zwei Abschnitte: „ESLint 10 Core" (Breaking Changes, entfernte APIs, neue Reports, Minor-Historie bis 10.12) und „eslint-plugin-astro v3 + astro-eslint-parser v3" (Breaking Changes, Peer-Anforderungen, Config-Änderungen).

## Notes

- Gecachter Snapshot, Stand siehe `reference.md`-Kopfzeile. Bei Verdacht auf Veraltung: neueste veröffentlichte Version per `bun info eslint version` bzw. `bun info eslint-plugin-astro version` prüfen, die im Projekt installierte steht in `node_modules/eslint/package.json` bzw. `node_modules/eslint-plugin-astro/package.json` (Feld `version`).
- Master-Quelle sind zwei Dateien in `__AI-Workflow__/skills/live-docs-collection/eslint/` (`eslint.md`, `eslint-plugin-astro-v3.md`), gepflegt über `/live-docs-update`.
