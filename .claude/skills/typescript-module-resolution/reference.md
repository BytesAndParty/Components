> Generiert aus der live-docs-collection (skills/live-docs-collection/typescript-module-resolution/typescript-module-resolution.md) am 2026-10-26. Master-Quelle ist dort gepflegt (`/live-docs-update`) — bei Zweifel an der Aktualität zuerst dort nachsehen und diese Datei danach neu generieren, nicht von Hand nachziehen.

# TypeScript `moduleResolution` — bundler ist der neue Default für Vite/Bun/esbuild

## TL;DR

Wenn der Code von einem **Bundler** (Vite, esbuild, Bun, Webpack 5+, Rollup mit Plugins) verarbeitet wird, gehört `"moduleResolution": "bundler"` in die `tsconfig.json`. Die alten Werte `"node"` und `"node16"` erzeugen **falsche** Type-Errors für moderne Packages mit `exports`-Map.

## Quick Reference

| Wert | Wofür | Subpath-Exports (`pkg/foo`) | Conditional Exports | Verwendung 2026 |
|---|---|---|---|---|
| `"node"` (= `"node10"`) | Legacy, vor Node.js `exports`-Map | nur via `main`/`module` | nein | **deprecated (TS 6.0, Entfernung in 7.0)** |
| `"node16"` / `"nodenext"` | Reines Node-Runtime-Verhalten | ja, aber `.js` in Imports Pflicht | ja | nur für Pure-Node-Pakete |
| `"bundler"` | TS 5.0+, gespiegelt zu Bundler-Auflösung | ja, ohne `.js`-Suffix | ja | **empfohlen für Vite/Bun/esbuild/Webpack** |
| `"classic"` | Alt-TS | — | — | **in TS 6.0 ersatzlos entfernt** |

## Warum Bundler statt Node

Moderne Packages deklarieren Subpath-Exports per `package.json#exports`:

```json
{
  "name": "@ark-ui/react",
  "exports": {
    ".":         "./dist/index.js",
    "./portal":  "./dist/components/portal/index.js",
    "./popover": "./dist/components/popover/index.js"
  }
}
```

Mit `moduleResolution: "node"` versteht TS diese Map **nicht** — Imports wie `import { Portal } from '@ark-ui/react/portal'` werfen `TS2307: Cannot find module ...`, obwohl Vite sie zur Laufzeit problemlos auflöst. Ergebnis: rote Schlangenlinien überall + `tsc --noEmit` ist kaputt, obwohl der Build grün ist.

`"bundler"` spiegelt das Verhalten der Bundler nach: `exports`-Map wird gelesen, Conditional Exports (`"import"` / `"require"` / `"types"`) werden respektiert, kein `.js`-Suffix in Imports nötig.

## Migration

`tsconfig.json`:

```diff
{
  "compilerOptions": {
    "module": "ESNext",
-   "moduleResolution": "node",
+   "moduleResolution": "bundler",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

**Voraussetzung (TS 5.x):** `module` muss `"esnext"`, `"es2020"` (oder neuer) oder `"preserve"` sein. `"commonjs"` war mit `"bundler"` **inkompatibel** und löste `TS5095` aus.

> **Geändert in TS 6.0:** `moduleResolution: "bundler"` ist jetzt **auch mit `module: "commonjs"`** erlaubt (siehe TS-6.0-Abschnitt unten). `TS5095` entfällt für diese Kombination. Für neue Projekte bleibt `module: "esnext"` trotzdem der Default.

## Gotchas

- **Pure-Node-Skripte:** Wenn TypeScript-Dateien direkt unter `node` (ohne Bundler) laufen, weiter `"nodenext"` verwenden — sonst stimmen Auflösung und Runtime nicht überein.
- **Monorepos / Mixed Targets:** Pro Package eigenes `tsconfig.json` mit dem passenden Resolver setzen. Nicht „eines für alles".
- **TS-Version:** `"bundler"` existiert erst ab TS **5.0** (März 2023). Bei älteren Stacks erst TS updaten.
- **Bundler-Verhalten variiert:** TS „bundler" ist eine **Approximation**. Edge-Cases (alias paths, virtual modules) bleiben Bundler-spezifisch und brauchen ggf. zusätzliche `paths`-Einträge in `tsconfig`.

## Konkreter Anwendungsfall in diesem Workspace

`__Components__/section-showcase/tsconfig.json` stand auf `"node"` — Folge: Ark UI Subpath-Imports (`@ark-ui/react/portal`, `/popover`) wurden von `tsc` nicht aufgelöst, obwohl Vite sie korrekt bundelte. Umstellung auf `"bundler"` am 2026-05-31 hat die Phantom-Errors entfernt, ohne dass eine einzige Komponente angepasst werden musste.

---

## TypeScript 6.0 (Major, verifiziert 2026-07-04)

TS 6.0 ist die letzte 5.x-Stil-Version vor dem nativen Go-Port (7.0). Es entfernt/deprecatet alte Module-Optionen — **für diesen Workspace ohne Bruch**, weil alle tsconfigs bereits `moduleResolution: "bundler"` + `module: "ESNext"` nutzen (Builds mit `tsc@6.0.3` grün).

### Für Module-Resolution relevant

- **`moduleResolution: "classic"` ersatzlos entfernt** (keine Deprecation-Phase). Migration → `bundler` oder `nodenext`.
- **`moduleResolution: "node"`/`"node10"` deprecated** (Entfernung in 7.0). Migration → `nodenext` (Node) bzw. `bundler` (Bundler/Bun).
- **`bundler` + `module: "commonjs"` jetzt erlaubt** — vorher nur mit `esnext`/`preserve`. Bevorzugter Upgrade-Pfad weg von `node10`.
- **`#/`-Subpath-Imports** (`"imports": { "#/*": "./dist/*" }`) werden unter `nodenext` und `bundler` unterstützt (vorher war ein Extra-Segment wie `#root/` nötig).

### Silent-Default-Änderungen (auch ohne Module-Bezug beachten)

- **`types` defaultet jetzt auf `[]`** statt automatisch alle `@types/*` zu laden. Wenn ambiente Typen (z. B. `@types/node`) ohne Import/`/// <reference>` gebraucht werden, explizit `"types": ["node", …]` setzen. (Unser Build ist grün — d. h. keine versteckte Ambient-Abhängigkeit.)
- **`baseUrl` als Resolution-Root deprecated** — Pfade direkt in `paths` einbauen (`"@app/*": ["./src/app/*"]`).
- **`module` defaultet auf `esnext`**, `rootDir` defaultet auf `.` (tsconfig-Verzeichnis).
- **`module: amd|umd|system|none` entfernt**; `dom`-lib enthält jetzt `dom.iterable`/`dom.asynciterable` implizit.
- Übergangs-Escape für Deprecation-Fehler: `"ignoreDeprecations": "6.0"`.

---

## TypeScript 7.0 (Major, neu entdeckt 2026-08-21 — **noch nicht adoptieren, nur beobachten**)

> **Gegengeprüft 2026-09-15:** Stand unverändert. Aktuell nur `7.0.2` (Patch von `7.0.0`/`7.0.1-rc`,
> keine funktionalen Notes dazu gefunden) plus Dev-Prereleases von `7.1.0` — **kein stabiles Minor**.
> `typescript-eslint@8.70.0` schreibt weiterhin explizit `typescript: '>=4.8.4 <6.1.0'` im
> `package.json` fest — der unten beschriebene Blocker gilt also unverändert, nicht nur als
> Vermutung, sondern als verifizierte Peer-Range.
>
> **Stand 2026-10-26:** `typescript-eslint@8.72.0` verlangt weiterhin `typescript >=4.8.4 <6.1.0`.
> `typescript@7.0.2` exportiert keine klassische Compiler-API: `exports["."]` zeigt nur auf
> `./lib/version.cjs`, die API liegt unter `unstable/*`. Damit ist der Blocker unten am Paket selbst
> belegt. Neu erschienen ist eine `7.1.0-beta`, weiterhin kein stabiles Minor. Das Alias-Paket
> `@typescript/typescript6` steht auf 6.0.2, nicht 6.0.3 (per `bun info @typescript/typescript6 version`
> geprüft). Quelle: npm-Registry.

TS 7 ist der **native Go-Port** des Compilers ("10x faster", 8–12x Speedup bei Full-Builds laut
Microsoft). Kein inkrementelles Update — eigener Release-Strang neben 6.x.

### Warum hier (noch) nicht relevant

**Embedded-Language-Tools (Vue, Astro, Svelte, MDX, Angular, und damit auch `typescript-eslint`)
können TS 7 noch nicht nutzen — es fehlt die stabile programmatische Compiler-API.** TS 6.0 bleibt
dafür zwingend nötig, solange dieser Workspace `typescript-eslint`/Astro-Tooling einsetzt. TS 6.0 ist
weiterhin über das Paket `@typescript/typescript6` verfügbar — beide Versionen können parallel
installiert sein (npm-Aliasing), sodass CLI-Speed (7.0) und Tooling-Kompatibilität (6.0) getrennt
adressiert werden können.

### Breaking Changes ggü. 6.x (falls/wenn relevant)

- **`strict` jetzt default `true`**.
- **`module` defaultet auf `esnext`** (statt `commonjs`).
- **`types` defaultet auf `[]`** (bereits seit 6.0 so — unverändert).
- **`rootDir` defaultet auf `./`**.
- **ES5-Target entfernt**, AMD/UMD/SystemJS entfernt (bereits in 6.0 als "entfernt" markiert).
- **`baseUrl` als Resolution-Root komplett entfernt** (in 6.0 nur deprecated) — `paths` ist jetzt
  Pflicht-Ersatz.
- Template-Literal-Types: Emojis wie „😀" zählen jetzt als **ein** Unicode-Grapheme-Unit statt als
  UTF-16-Surrogate-Paar.

### Migrationspfad (falls später relevant)

Empfehlung von Microsoft: **erst auf 6.0, dann auf 7.0** migrieren (nicht direkt von 5.x springen).
Für diesen Workspace: abwarten, bis `typescript-eslint` / Astro eine TS-7-kompatible Programmatic API
unterstützen — vorher ist ein Umstieg nicht möglich, unabhängig vom CLI-Speed-Vorteil.
