---
name: vite
description: Cached reference for Vite 8 — Rolldown replaces Rollup, Oxc replaces esbuild, `build.rollupOptions`→`build.rolldownOptions` config-key migration. Load before upgrading Vite across a major version, debugging a build config that references old `rollupOptions`/`esbuild` keys, or checking what a new Vite minor added.
---

## Was dieser Skill ist

Gecachte Referenz für Vite 8 — der erste Release mit Rolldown (Rust-Bundler statt Rollup) und Oxc (statt esbuild). Deckt die Config-Key-Migration, den angehobenen Default-Browser-Target sowie die additiven Minor-Releases 8.1–8.3 ab.

## References

- `reference.md` — Breaking-Changes-Tabelle (7/6→8), Browser-Target-Anhebung, `manualChunks`→`codeSplitting`, CommonJS-Interop-Änderung, Minor-Historie bis 8.3 (top-level `tsconfig`-Option, `<style>`-Minifizierung).

## Notes

- Gecachter Snapshot, Stand siehe `reference.md`-Kopfzeile. Bei Verdacht auf Veraltung: `npm view vite version` prüfen.
- Master-Quelle ist `__AI-Workflow__/skills/live-docs-collection/vite/vite.md`, gepflegt über `/live-docs-update`.
- Vite auto-konvertiert die deprecateten `rollupOptions`/`esbuild`-Keys — ein Projekt mit alten Keys baut also weiter, aber neue Configs sollten direkt die `rolldownOptions`/`oxc`-Form nutzen.
