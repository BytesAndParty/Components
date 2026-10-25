---
name: typescript-module-resolution
description: Cached reference for TypeScript `moduleResolution` — why `"bundler"` is correct for Vite/Bun/esbuild/Webpack-5+ projects and `"node"`/`"node10"` produces false `TS2307` errors on packages with subpath exports. Load before setting up or debugging a `tsconfig.json`, seeing red squiggles on subpath imports (`pkg/foo`) that build fine at runtime, or evaluating whether TypeScript 7 is safe to adopt yet.
---

## Was dieser Skill ist

Gecachte Referenz für `moduleResolution` in modernen Bundler-Setups, plus TypeScript-6.0- und -7.0-Migrationsnotizen. Der Kernfall: `tsc --noEmit` meldet `TS2307: Cannot find module` für Subpath-Exports (`@ark-ui/react/portal` etc.), obwohl der Bundler sie zur Laufzeit problemlos auflöst — Ursache ist fast immer `moduleResolution: "node"` statt `"bundler"`.

## References

- `reference.md` — Werte-Vergleichstabelle, Migrations-Diff, TS-6.0-Breaking-Changes (`classic` entfernt, `node10` deprecated), TS-7.0-Status (nativer Go-Port, noch nicht adoptierbar solange `typescript-eslint`/Astro-Tooling keine TS-7-kompatible Programmatic API haben).

## Notes

- Gecachter Snapshot, Stand siehe `reference.md`-Kopfzeile. Bei Verdacht auf Veraltung: neueste veröffentlichte Version per `bun info typescript version` und `bun info typescript-eslint peerDependencies` prüfen (letzteres bestimmt, ob TS 7 überhaupt schon nutzbar ist), die im Projekt installierte steht in `node_modules/typescript/package.json` (Feld `version`).
- Master-Quelle ist `__AI-Workflow__/skills/live-docs-collection/typescript-module-resolution/typescript-module-resolution.md`, gepflegt über `/live-docs-update`.
- TS 7 nicht adoptieren, nur weil die reine CLI-Geschwindigkeit lockt — die Tooling-Kompatibilität (ESLint, Astro/Vue/Svelte-Sprachserver) entscheidet, nicht der Speed-Gewinn.
