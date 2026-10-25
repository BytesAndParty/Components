> Generiert aus der live-docs-collection (skills/live-docs-collection/fallow/fallow.md) am 2026-10-06. Master-Quelle ist dort gepflegt (`/live-docs-update`) — bei Zweifel an der Aktualität zuerst dort nachsehen und diese Datei danach neu generieren, nicht von Hand nachziehen.

## Neu in 3.26 → 3.31 — was tatsächlich Arbeit spart

**Baselines, die nicht mehr still verrotten** — der Schwerpunkt dieses Fensters:
- `--fail-on-stale-baseline` (v3.26.0) bricht ab, wenn Baseline-Einträge nichts mehr treffen. Vorher blieben
  erledigte Findings für immer in der Baseline stehen.
- `--fail-on-baseline-growth` (v3.31.0, „shrink-only") verhindert, dass eine Baseline wächst. Neue Findings
  lassen sich also nicht mehr einfach per Baseline-Neuerzeugung „wegbügeln"; sie kann nur noch schrumpfen.
- Baselines merken sich, welcher Befehl sie erzeugt hat (v3.28.0); falscher Befehl → Warnung statt
  stillem No-op (siehe Breaking unten).
- Gate-Ergebnisse stehen als `gate_outcomes` im JSON (v3.27.0), Action und GitLab-Template prüfen
  veraltete Baselines selbst.

**`fallow list --entry-weight`** (v3.30.0) — misst den Import-Gewicht-Anteil beim Start (welche Module beim
Booten geladen werden). Ersetzt das Bundle-Analyzer-Rätselraten, warum ein Entry-Point schwer ist.

**`fallow flags --retirement`** (v3.30.0) — listet Feature-Flags, die entfernt werden können. Ersetzt
das manuelle Durchgrepen nach toten Flag-Zweigen.

**Package-Cycle-Erkennung im Monorepo** (v3.31.0) — findet zirkuläre Abhängigkeiten **zwischen
Workspace-Packages**, nicht nur zwischen Dateien. Relevant für Buchart58 (`storefront` ↔ `server` ↔ `shared`).
Dazu `changedSince` je Package (eigener Git-Ref pro Workspace) und stabile Finding-IDs über Zeilen-
und Formatierungsänderungen hinweg.

**`--explain-skipped`** (v3.26.0) — zeigt, welche Dateien warum von der Analyse ausgenommen wurden
(Built-in-Ignores). Beantwortet „warum meldet fallow zu meiner Datei nichts?" ohne Config-Archäologie.

**Weitere Gates/Optionen:** `--fail-on-parse-error` (v3.29.0), Komplexitäts-Regeln
(`complexity-cyclomatic`/`-cognitive`/`-crap`) mit Level `error`/`warn`/`off` (v3.29.0), rohe V8-Coverage als
Direkt-Input (v3.29.0), LSP behält die Session zwischen Speichervorgängen (v3.30.0).

### Breaking / Verhaltensänderungen 3.26 → 3.31 (gegen bestehende Läufe prüfen)

- **v3.27.0:** `fail-on-regression`, `threshold`, `min-severity` und Security-Gates **schlagen jetzt wirklich
  fehl**; Integrationen haben sie vorher still ignoriert. Ein bisher „grüner" CI-Lauf kann rot werden.
- **v3.26.0:** Built-in-Exclude `build/` → `**/build/**`. Handgeschriebener Quellcode in verschachtelten
  `build/`-Ordnern wird nicht mehr analysiert.
- **v3.26.0:** Duplikat-Findings lassen sich nicht mehr über alte numerische Collision-Handles
  (`dup:<16hex>-N`) unterdrücken → Report neu erzeugen, `ignoredClones`-Keys anpassen.
- **v3.28.0:** `--baseline` mit der Datei eines anderen Befehls → Warnung, unterdrückt **nichts**.
- **v3.29.0:** `--fail-on-issues` hebt `warn`-Komplexitäts-Findings auf Fehler an.
- **v3.26.0:** per-File-Rule-Overrides gelten überall → bisher versteckte Findings (z. B.
  `private-type-leaks`) können auftauchen.
- Die GitHub-Action hat keinen eigenen „Check threshold"-Step mehr (v3.27.0, jetzt im Analyze-Step über
  `gates-failed`).

Quelle der Auswertung: GitHub-Releases 3.26.0–3.31.0, abgefragt 2026-10-05.

## Neu in 3.22 → 3.25 — was tatsächlich Arbeit spart

**`fallow doctor`** (seit v3.23.0) — prüft Konfiguration, Workspace-Erkennung und externe Plugins
lokal, **ohne** einen Analyse-Lauf zu starten. Klärt die Frage, die ein leerer Report offen lässt:
„clean" oder „nicht konfiguriert"? v3.24.0 legt drei weitere Advisory-Checks nach.

**`fallow trace --path <FROM> <TO>`** (seit v3.24.0) — zeigt den kürzesten Import-Pfad zwischen zwei
Modulen. Ersetzt das manuelle Nachverfolgen einer Import-Kette per Hand/Editor-Suche, wenn unklar
ist, wieso Datei A überhaupt Datei B zieht.

**`fallow trace-error [FILE|-]`** (seit v3.24.0) — matched einen Runtime-Stack-Trace gegen den
Projekt-Graph. Ein Fehler aus Prod-Logs lässt sich damit direkt auf die verursachende Stelle im
Graph zurückführen, ohne den Trace von Hand gegen den Code abzugleichen.

**Reachability-Caveats** (seit v3.24.0) — Findings tragen jetzt `reachability_caveats`, wenn die
Analyse unvollständig war (unparsbare Dateien, Größenlimit überschritten). `fallow fix` **verweigert**
die Mutation unter solchen Caveats, statt still auf unvollständiger Basis zu löschen.

**Positionales Path-Argument für Bare Commands** (seit v3.25.0) — `fallow`, `check`, `dupes`,
`health`, `audit`, `security`, `fix`, `list`, `similar-code` akzeptieren jetzt einen optionalen
Pfad zur Eingrenzung der Findings, z. B. `bunx fallow check src/lib/` statt über `ignorePatterns`
den Rest des Repos auszuschließen.

**Runtime-Coverage-Matching erweitert** (seit v3.25.0) — erkennt jetzt Arrow-Callbacks,
Object-Literal-Methoden, Getter/Setter und funktionswertige Properties korrekt als benutzt; vorher
mussten solche Stellen manuell per `usedClassMembers`/Inline-Suppression ausgenommen werden, wenn
sie fälschlich als unused class member auftauchten.

**Schema:** keine weiteren Schema-Version-Bumps zwischen 3.22 und 3.25 über die unten dokumentierten
hinaus (`health`/kombiniert bleibt 10, `audit` bleibt 9). Keine Breaking Changes in diesem Fenster.

## Neu in 3.17 → 3.22 — was tatsächlich Arbeit spart

**MCP-Integration — fallow als Tool im Agent, nicht nur als CLI-Aufruf.** Registrierung für Claude Code:

```bash
claude mcp add fallow --scope user fallow-mcp
```

Legt `.mcp.json` im Repo-Root an (team-weit verfügbar). Exponierte Tools: `analyze` (Dead-Code),
`check_changed` (inkrementell, nur geänderte Dateien), `security_candidates`, `inspect_target`,
`find_dupes`, `fix_preview`/`fix_apply`, `check_health`, `audit`. **Praktische Konsequenz:** ein Agent
kann Findings direkt strukturiert abfragen statt `bunx fallow --format json` zu parsen und die
Ausgabe zu interpretieren. Ist `fallow` als Projekt-Dependency in `node_modules/.bin/` installiert
(nicht auf PATH), läuft es über den Package Manager: `{ "command": "npx", "args": ["fallow-mcp"] }`.

**`fallow agent install`** (seit v3.19.0) — Ein-Schritt-Setup, das Claude Code/Codex/Cursor erkennt,
Task-Maps schreibt, die MCP-Registrierung vornimmt und Commit-Gates einrichtet. Dazu `fallow agent
status` / `fallow agent uninstall` fürs Lifecycle-Management. Ersetzt die bisher manuelle
`.mcp.json`-Pflege pro Projekt.

**`fallow similar-code`** (seit v3.19.0) — semantische Code-Suche über ein lokales KI-Modell mit
persistentem Vector-Cache. Findet strukturell ähnlichen Code, den `dupes --near` (reiner Text-/AST-
Vergleich) nicht sieht — z. B. dieselbe Logik mit anderen Variablennamen.

**`fallow report`** (seit v3.17.0) — rendert ein bereits gelaufenes JSON-Ergebnis neu, **inklusive**
Audit-Entscheidungen und Diff-Positionen. Nützlich, um denselben Analyse-Lauf in mehreren Formaten
auszugeben, ohne ihn neu zu rechnen.

**Weitere Ergänzungen:** Yarn-PnP-Auflösung (v3.20.0, `.pnp.cjs` wird erkannt), sauberere
Monorepo-Grenzen über TypeScript Project References (v3.20.0), `skipped-source-dotdir`-Diagnose für
übersehene punkt-präfixte Source-Ordner (v3.21.0), `FALLOW_TYPE_AWARE_TIMEOUT_SECS` für die
Type-Aware-Analyse (v3.22.0).

**Schema:** Zwischen 3.17 und 3.22 keine weiteren Schema-Version-Bumps über die unten dokumentierten
hinaus (`health`/kombiniert bleibt 10, `audit` bleibt 9).

> **v3-Änderungen (gegenüber 2.89, lokal verifiziert 2026-07-08):**
> - **JSON-Output umstrukturiert:** Top-Level ist jetzt `{ kind, version, schema_version, check: {...}, dupes: {...}, health: {...}, next_steps, elapsed_ms }`.
>   Die Finding-Listen (`unused_files`, `unused_exports`, `unlisted_dependencies`, …) liegen **unter `check`**, nicht mehr flach. `schema_version` bleibt 7.
> - **Neue Kategorie** `test_only_dependencies` (unter `check`): Deps, die nur von Test-/Config-Dateien importiert werden → "move to devDependencies". Vorsicht: In Astro-Projekten werden `astro`/`@astrojs/*`/`@tailwindcss/vite` so geflaggt (Build-Deps, kein Runtime-Code) — Verschieben nach devDependencies ist ok, aber kein Muss.
> - **Neue Commands:** `security` (opt-in Security-Kandidaten), `inspect` (Datei/Symbol-Evidenz-Query), `guard <files>` (Arch-Rules vor Edit prüfen), `impact`, `trace`, `hooks` (ersetzt `setup-hooks`, das als "legacy" bleibt), `coverage`, `license`, `telemetry`.
> - Binary ist signiert + sentinel-verifiziert (`.fallow-verified`); npm-Paket heißt weiterhin `fallow`, Plattform-Binary `@fallow-cli/<platform>`.
> - Statische Analyse weiterhin frei; "Fallow Runtime" (Runtime-Coverage/Deletion-Confidence) ist der bezahlte Teil (`license`-Command).

> **v3.2 → v3.17 (Stack-Refresh 2026-08-21):** kein Major-Bump, aber 15 Minor-Releases mit
> Schema-Änderungen — vor dem nächsten CI-Parsing-Update `fallow config` neu laufen lassen:
> - **Schema-Versionen verschoben:** `health`/kombinierter Output jetzt `schema_version` **10**
>   (war 7, seit v3.15.0). `audit` bleibt bei **9**. Type-aware Wire-Protocol jetzt **v7**, Semantic
>   Schema **v3** (beide seit v3.17.0).
> - **Config-Strictness verschärft** (v3.15.0): ungültige `extends`-Werte und unbekannte Keys in
>   Override-Einträgen werden jetzt **abgelehnt** statt toleriert. Vor dem Upgrade `fallow config`
>   laufen lassen, um verworfene Config-Patterns sichtbar zu machen.
> - **`health.thresholdOverrides[]`** braucht jetzt zwingend ein `dimension`-Feld; neuer
>   `insufficient`-Status. Template-Units zählen nicht mehr in CRAP-Scoring-Dimensionen.
> - **Neue CI-Formate** für `check`/`audit`: `pr-comment-github`, `pr-comment-gitlab`,
>   `review-github`, `review-gitlab` (rendern direkt im jeweiligen CI-System).
> - **Neue Subcommands:** `audit-cache prune` (`--dry-run`, `--max-age-days`, v3.16.0), `impact
>   statusline` (kompakte Status-Zeile für Agents, v3.9.1).
> - `--type-aware`-Flag stabilisiert mit versioniertem Wire-Protocol (v3.10.0); Deno-Workspace-Support
>   mit nativer Discovery (v3.11.0); `doMock`-Awareness in Coverage-Analyse (v3.14.0); Near-Miss-Clone-
>   Detection über `--near`-Flag (v3.15.0).

# fallow — Codebase Analyzer (Dead Code · Dupes · Health)

Rust-CLI für TypeScript/JavaScript-Monorepos. Findet **unused code, circular
dependencies, code duplication, complexity hotspots und architecture boundary
violations**. Konkurrenz/Nachfolger zu `knip` (Dead-Code) + `jscpd` (Dupes) in
einem Tool, mit nativer Monorepo-/Workspace-Erkennung und Git-Hook-Integration.

Läuft hier **ohne lokale Installation** über `bunx fallow` (lädt `@fallow-cli/<platform>`).

```bash
bunx fallow                 # default: dead-code + dupes + health
bunx fallow dead-code       # nur unused code + dependency hygiene + cycles
bunx fallow --version       # 3.25.0
```

---

## Commands

| Command | Zweck |
|---|---|
| `dead-code` | Unused files/exports/types/class-members, dependency hygiene, import cycles |
| `dupes` | Copy-paste + strukturelle Code-Duplikation |
| `health` | Komplexität, Maintainability, Hotspots, Coverage-Gaps |
| `flags` | Feature-Flag-Nutzungsmuster |
| `audit` | Nur **geänderte** Dateien reviewen (gut für PRs / pre-commit) |
| `fix` | Auto-fix für **sichere** unused-code Findings (`--dry-run` zuerst!) |
| `watch` | Re-run bei File-Changes |
| `list` / `workspaces` | Discovery-Diagnose: entry points, plugins, boundaries, workspaces |
| `explain <issue>` | Erklärt einen Issue-Typ ohne Analyse-Run |
| `init` | Config (+ optional Git-Hook) anlegen |
| `migrate` | `knip`- oder `jscpd`-Config übernehmen |
| `config` / `config-schema` | Resolved Config bzw. JSON-Schema ausgeben |
| `ci` / `ci-template` | PR/MR-Feedback-Envelopes + CI-Templates |

### Nützliche globale Flags

```bash
-f, --format <fmt>     # human(default) json sarif compact markdown codeclimate
                       #   pr-comment-github review-github badge …
--changed-since <ref>  # nur Issues in Dateien seit git-ref (alias --base)
-r, --root <dir>       # Projekt-Root
-c, --config <file>    # explizite Config
--no-cache             # incremental cache aus (.fallow/ Cache sonst genutzt)
--only / --skip        # einzelne Analysen wählen
-q, --quiet
```

`--format json` ist Pflicht, sobald man die **vollständigen** Listen will — die
human-Ausgabe kürzt mit „… and N more".

```bash
bunx fallow dead-code --format json | python3 -c "import json,sys; d=json.load(sys.stdin); print([f for f in d['unused_files']])"
```

JSON-Top-Keys (schema_version 10 seit v3.15.0, war 7): `unused_files`, `unused_exports`,
`unused_types`, `unused_class_members`, `unused_dependencies`,
`unlisted_dependencies`, `duplicate_exports`, `circular_dependencies`,
`boundary_violations`, `workspace_diagnostics`, …

> **v3:** Gilt so nur für die Subcommands (`dead-code --format json` → Findings flach,
> plus neue Keys wie `test_only_dependencies`, `_meta`). Beim **Default-Run ohne
> Subcommand** (`fallow --format json`) sind die Findings unter `check`/`dupes`/`health`
> verschachtelt: `d['check']['unused_files']` statt `d['unused_files']`.

---

## Cache

`.fallow/` (cache.bin + churn.bin) wird automatisch angelegt — incremental cache
für schnelle Re-Runs. Hat eigene `.gitignore`. Nicht committen, nicht löschen
(außer Cache-Korruption vermutet → `--no-cache`).

---

## Config: `.fallowrc.{json,jsonc}` / `fallow.toml`

`.jsonc` erlaubt Kommentare (empfohlen — Suppressions **immer** begründen).
Schema: `bunx fallow config-schema`.

Wichtigste Keys:

| Key | Wirkung |
|---|---|
| `entry` | Zusätzliche Entry-Globs (Dateien, die als „Wurzel" gelten) |
| `workspaces.patterns` | Zusätzliche Workspace-Pfade über `package.json` hinaus |
| `ignorePatterns` | Dateien ganz aus der Analyse nehmen |
| `ignoreDependencies` | Package-Namen aus **unused- UND unlisted-deps** ausnehmen |
| `ignoreExports` / `usedClassMembers` | Export-/Member-Findings unterdrücken |
| `framework`, `boundaries`, `rules`, `production` | Framework-Presets, Arch-Boundaries, Rule-Tuning |

> **Gotcha:** Für **unlisted dependencies** ist der richtige Suppression-Key
> `ignoreDependencies` — **nicht** `ignoreUnresolvedImports` (das ist für die
> separate `unresolved_imports`-Kategorie). Fallows eigene `add-to-config`-Action
> im JSON-Output nennt den korrekten Key pro Finding.

### Inline-Suppression (statt Config)

```ts
// fallow-ignore-next-line unused-files
// fallow-ignore-next-line unused-exports
// fallow-ignore-next-line unlisted-dependencies
```

---

## Findings richtig lesen (Senior-Triage)

Nicht jedes Finding ist totes Code. In **Library-/Monorepo**-Kontext sind ganze
Kategorien systematische False Positives:

- **Unused exports/types in einer Component-Library** = oft die **öffentliche
  Deep-Import-API** (z. B. `FormInputProps`, Component-Varianten wie
  `NavbarMobileOnly`, imperatives `toast()`). Fallow sieht keinen *internen*
  Consumer → flaggt. Externe App-Consumer kennt es nicht. **Nicht löschen**, nur
  wenn wirklich nirgends (intern *und* extern) benutzt.
- **Unused class members** in einer **WIP-Domain-App** (hier: `cellar-canvas`
  `FabricBridge`) = Engine-API für noch nicht verdrahtete Roadmap-Phasen. Löschen
  setzt die Roadmap zurück.
- **Unused dependencies** in einem Workspace, die ein *anderer* Workspace
  importiert = Monorepo-Attribution, **kein** totes Dep (siehe unten).
- **Genuinely dead**: ungenutzte File-Insel ohne Consumer, Lib-Leftover nach
  Migration (z. B. `@astrojs/tailwind` nach Wechsel auf `@tailwindcss/vite`),
  Peer-Deps die *nicht* Peer sind. **Diese löschen.**

Faustregel: `unused_files` + `duplicate_exports` + echte dead deps zuerst
abräumen; `unused_exports/types/class_members` nur nach manueller Bestätigung,
dass kein externer/zukünftiger Consumer existiert.

---

## Monorepo-Gotchas (in diesem Repo real aufgetreten)

### 1. Nicht-deklarierter Workspace → ganzer Ordner als „dead"

`vendure-showcase/server` (separat betriebenes Vendure-Backend, **nicht** im
bun-Workspace-Install) wurde komplett als unused files **und** seine
`@vendure/*`-Imports als unlisted gemeldet. Fix per Config statt Monorepo-Umbau:

```jsonc
{
  "workspaces": { "patterns": ["vendure-showcase/server"] },
  "entry": [
    "vendure-showcase/server/src/index.ts",
    "vendure-showcase/server/src/seed.ts",
    // Admin-UI-Extensions werden per compileUiExtensions(pfad) geladen,
    // nicht über traceable imports → als entry deklarieren:
    "vendure-showcase/server/src/plugins/**/ui/**/*.{ts,tsx}"
  ],
  "ignoreDependencies": [
    "@vendure/core", "@vendure/admin-ui", "@vendure/admin-ui-plugin",
    "@vendure/asset-server-plugin", "@vendure/ui-devkit",
    "@nestjs/graphql", "@angular/core", "graphql-tag"
  ]
}
```

### 2. Dep importiert in Workspace A, deklariert in Workspace B

`components/` importiert third-party Libs, deklariert sie aber zum Teil gar nicht
selbst → **unlisted für components**, gleichzeitig **unused für components-showcase**.
Korrekt: Dep dort deklarieren, wo sie importiert wird. Hier: `fabric`, `qrcode`,
`zustand`, `@chenglou/pretext` wurden in `components/package.json` aufgenommen
(`@types/qrcode`, `@testing-library/react` in dessen devDependencies), aus
`root`/`showcase` entfernt. Bun-Hoisting macht das install-neutral.

### 3. Vite single-instance Pins sehen aus wie „unused deps"

`components-showcase/vite.config.ts` pinnt `clsx`, `tailwind-merge`,
`motion/react`, `@ark-ui/react/*`, `@number-flow/react`, `canvas-confetti`,
`@chenglou/pretext`, `@tanstack/*` via `nm()`-Alias auf **eine** Kopie
(React-Context-Libs dürfen nicht doppelt instanziiert werden). Sie sind daher
absichtlich in `package.json`, werden aber nur über den `@components`-Alias
konsumiert → fallow flaggt sie als unused. **Load-bearing, nicht löschen** →
`ignoreDependencies`.

### 4. Peer-Deps ohne direkten Import

`graphql` (urql/@urql/core Peer) wird nie direkt importiert → fallow flaggt es.
Entfernen bricht urql zur Laufzeit → `ignoreDependencies`.

---

## Quality-Gate-Empfehlung

```bash
bunx fallow dead-code            # vor PR; files/deps/dupes müssen 0 sein
bunx fallow audit --base main    # im PR nur geänderte Dateien
```

`exports/types/class-members` dürfen >0 bleiben, solange jeder Eintrag als
Library-API / WIP bewusst bestätigt ist. Für CI: `--format sarif` oder
`pr-comment-github`.
