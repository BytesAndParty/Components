> Generiert aus der live-docs-collection (skills/live-docs-collection/vite/vite.md) am 2026-09-16. Master-Quelle ist dort gepflegt (`/live-docs-update`) — bei Zweifel an der Aktualität zuerst dort nachsehen und diese Datei danach neu generieren, nicht von Hand nachziehen.

# Vite 8 — Cached Reference

Vite 8 is the first release where **Rolldown** (Rust bundler) replaces Rollup, and
**Oxc** replaces esbuild for JS transform/minify. This is the headline change and the
reason our build logs now mention `rolldown` and `build.rolldownOptions`.

> **8.1 (Minor, installiert 8.1.2):** additiv, **keine** Breaking Changes ggü. 8.0. Neu:
> externe CSS-Dateien dürfen aus CSS heraus importiert werden (`@import` auf echte
> Files), und Plugins können File-Dependencies registrieren. Alles unten Gültige gilt
> unverändert weiter.

> **8.2 (Minor, installiert 8.2.2, Stack-Refresh 2026-08-21):** additiv, **keine** Breaking
> Changes. Bundled-Dev erhält Lazy-Bundling + HMR für Worker-Files; bessere Fehlerbehandlung
> bei zirkulären Imports; Lightning-CSS-Integration verfeinert (externes CSS, `$`-Escaping in
> URLs korrekt); Dev-Server: Port-Konflikt-Erkennung + Zufalls-Port bei `port: 0`.

> **8.3 (Minor, installiert 8.3.0, 2026-09-15):** additiv, **keine** Breaking Changes. Neu:
> **top-level `tsconfig`-Option** — eine `tsconfig.json` gezielt für Vite vorgeben, statt sich auf
> die automatische Discovery zu verlassen (nützlich bei mehreren `tsconfig*.json` im Projekt);
> **CSS-`<style>`-Tags werden jetzt minifiziert** (vorher nur externe CSS-Dateien); Subpath-Imports
> (`#alias/...`) funktionieren jetzt auch in dynamischen `import()`-Statements; Such-Parameter an
> Worker-URLs bleiben erhalten; Warnung bei benannten Imports aus JSON-Modulen (`import { x } from
> './data.json'` — nur Default-Import ist korrekt); ungenutzte Worker-Chunks werden aus dem Build
> entfernt. Performance: Proxy-Kontext-Matcher werden bei Server-Start vorkompiliert statt pro
> Request neu geparst; Preload-Dependency-Tracking überspringt bereits gesehene Einträge.

## Quick Reference — Breaking Changes (7/6 → 8)

| Area | Before | After (Vite 8) |
|---|---|---|
| Bundler | Rollup | **Rolldown** |
| JS transform/minify | esbuild | **Oxc** |
| CSS minify | esbuild | **Lightning CSS** (revert: `build.cssMinify: 'esbuild'`) |
| Build config key | `build.rollupOptions` | `build.rolldownOptions` |
| Worker config | `worker.rollupOptions` | `worker.rolldownOptions` |
| Dep optimizer | `optimizeDeps.esbuildOptions` | `optimizeDeps.rolldownOptions` |
| Transform config | `esbuild: {...}` | `oxc: {...}` |
| `build.commonjsOptions` | supported | **removed (no-op)** |

Vite auto-converts the deprecated `rollupOptions`/`esbuild` keys, so existing configs
keep working — but they are deprecated. We currently still use
`build.rollupOptions.output.manualChunks` (function form) in
`components-showcase/vite.config.ts`; it builds via the compat layer.

## Default browser target raised (Baseline Widely Available, Jan 2026)

Chrome/Edge 107 → 111 · Firefox 104 → 114 · Safari 16.0 → 16.4.
Override via `build.target` if older browsers must be supported.

## manualChunks → codeSplitting

- The **object** form of `output.manualChunks` is removed.
- The **function** form still works (compat) but is deprecated.
- Rolldown's replacement is `build.rolldownOptions.output.codeSplitting`. The
  "chunks larger than 500 kB" warning now points here.

Our function-form `manualChunks(id)` vendor-split in
`components-showcase/vite.config.ts` still functions — migrate to `codeSplitting`
only when touching that config.

## CommonJS interop changed (potential silent breakage)

Default import from a CJS module now equals `module.exports` only when the importer is
ESM (`.mjs`/`.mts`, or nearest `package.json` has `type: "module"`) or
`__esModule` is unset; otherwise it resolves to `module.exports.default`.
Temporary escape hatch: `legacy.inconsistentCjsInterop: true`.

## Other removals to know

- Format sniffing between `browser`/`module` fields gone — `resolve.mainFields` order is
  now strict.
- Output formats `'system'` and `'amd'` unsupported.
- `import.meta.url` no longer polyfilled in UMD/IIFE.
- Oxc transformer does **not** lower native decorators yet → use Babel/SWC plugin.
- Removed plugin hooks: `shouldTransformCachedModule`, `resolveImportMeta`,
  `renderDynamicImport`, `resolveFileUrl`.

## Buchart58 split: Server hält Vite 7 (Vendure)

Buchart58 fährt Vite **gemischt** — bewusst, nicht versehentlich:

- **Storefront:** kein direkter `vite`-Dep. Astro 7.1.6 dependt `vite ^8.0.13` → Storefront
  reitet **transitiv auf Vite 8**.
- **Server (`server/`):** direkter `vite ^7.3.6` für den **Vendure-Dashboard-Build**
  (`dashboard` / `dashboard:build`). `@vendure/dashboard@3.7.2` dependt selbst `vite ^7.3.1` →
  Vite 8 am Server liefe Vendure voraus und riskiert den Dashboard-Build. **Kein Vendure-Release
  mit Vite-8-Support existiert** (latest 3.7.2, Stand 2026-08-04).

→ Server-Vite bleibt 7.x, bis Vendure-Dashboard Vite 8 deklariert. Dann Server auf `^8` heben und
`dashboard:build` verifizieren.

## Gotchas for this project

- `@vitejs/plugin-react` must be **v6+** (peer `vite ^8`). Already aligned across root +
  the three Vite apps.
- `@tailwindcss/vite` works with Lightning CSS minify; CSS bundle size may tick up
  slightly.
- `babel-plugin-react-compiler` runs inside `@vitejs/plugin-react`'s Babel pass — Oxc
  does not replace this; the React Compiler still goes through Babel.
- No code changes were needed in our `vite.config.ts` files for the 6→8 bump; the
  vanilla `react()` + `tailwindcss()` + `manualChunks` setup builds unmodified.
