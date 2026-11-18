> Generiert aus der live-docs-collection (skills/live-docs-collection/fallow/fallow.md) am 2026-11-18. Master-Quelle ist dort gepflegt (`/live-docs-update`) — bei Zweifel an der Aktualität zuerst dort nachsehen und diese Datei danach neu generieren, nicht von Hand nachziehen.

## Neu in 3.32 → 3.43 — was tatsächlich Arbeit spart

Zwölf Minors. Der Schwerpunkt wandert von Baselines (3.26–3.31) zu **„was prüft ein Agent vor und nach einer
Änderung?"**: `guard`, `architecture`, `audit --brief`, `mutation`. Die CLI-Oberfläche ist gegen 3.43.2
lokal verifiziert (`--help`, `explain`, JSON-Läufe, 2026-11-18); die **Versionszuordnung** der einzelnen
Features stammt aus den GitHub-Releases und wurde nicht pro Release gegengeprüft.

**`fallow architecture` + `fallow guard <files>`** (v3.33.0) — Import-Zyklen, Boundary-Verstöße und
Rule-Pack-Policy in einem Befehl (`--cycles`, `--boundaries`, `--policy`, `--shared-state`). Ersetzt das
Herausfiltern von Zyklen und Boundaries aus einem vollen `dead-code`-Lauf. `guard` zeigt **vor** dem Edit,
welche Architektur-Regeln für die Dateien gelten, `architecture` prüft danach. MCP-Tool: `check_architecture`.

**`fallow baselines prune`** (v3.33.0) — entfernt Baseline-Einträge, die auf keinen aktuellen Fund mehr
passen. Ersetzt Baseline-Neuerzeugung oder Ausdünnen von Hand; Gegenstück zu `--fail-on-stale-baseline`.

**`fallow audit` ist jetzt das PR-/Commit-Werkzeug** — nur im Changeset **neu eingeführte** Findings
entscheiden über das Verdict, geerbte stehen mit `introduced: false` im JSON (`--gate all` prüft alles).
- `fallow audit --staged` (v3.43.0) prüft den **Git-Index** statt des Working Trees. Pre-Commit-Hook ohne
  `git stash`-Tricks.
- `fallow review --base <ref> --brief` (= `audit --brief`) rendert eine Orientierungs-Übersicht, die **immer**
  mit Exit 0 endet — „wo schaue ich hin?" statt „blockt CI?". Geänderte Dateien werden nach Churn,
  Komplexität und Test-Erreichbarkeit gerankt (v3.43.0).
- Styling-Analytics und „Deep CSS" (projektweite Styling-Erreichbarkeit, auf geänderte Anker zurückgeschnitten)
  sind in `audit` **standardmäßig an** (`audit.cssDeep = false` bzw. Flag zum Abschalten). Laut Releases erfasst
  die Dead-Code-Analyse seit v3.37.0 außerdem CSS-Klassen aus Template-Dateien.
- Verschlechterte Komplexität erscheint als „worsened" Finding (v3.35.0).

**`fallow mutation`** (opt-in, seit v3.34.0) — Mutation-Testing: verändert Code in kleinen Schritten, lässt
die Projekt-Tests laufen; ein Mutant, bei dem kein Test rot wird, **überlebt** = Lücke in den Tests. Läuft mit
Vitest, `node:test` und Bun. Alternative zu einem separaten Tool samt eigener Config (z. B. Stryker).
- Default-Scope ist der **geänderte** Code gegen die Base-Ref, `--all` mutiert alles, `--plan` und `inspect`
  führen keinen Code aus.
- Unterbefehle `tasks` (offene Tasks eines Reports als Batch, v3.41.0), `export` (offenes
  `mutation-testing-report-schema`-Format, v3.42.0), `--compare`/`--recheck` (v3.41.0), `--runner-config`
  (eigene Vitest-Config, v3.34.0). MCP-Tool `mutation_tasks` (v3.42.0).
- v3.43.0: `--record-args` + `inspect --replay` (Funktionsargumente aufzeichnen und gegen beide Code-Stände
  abspielen), neun opt-in Operatoren (`mutation.operators`), `--time-budget`, `--mutants-per-line`.
- v3.42.0: `mutation: true` in GitHub Action und GitLab-Template; Vitest-Läufe 1,6–3× schneller.

**Neue Regeln** — per `fallow explain <rule>` lokal bestätigt:
- `unused-namespace-members` — Mitglieder eines `import * as ns`, die nie benutzt werden (v3.40.0).
- `duplicate-export-aliases` — ein Binding wird unter zwei Namen exportiert (v3.40.0).
- `unlisted-binaries` — CLI-Binary wird genutzt, aber von keinem installierten Package geliefert (v3.40.0).
- `constant-parameter` / `--constant-parameters` — Parameter, den **jeder** sichtbare Aufruf gleich übergibt
  (v3.43.0, mit `--type-aware` genauer). Ersetzt die manuelle Suche nach Parametern, die gar keine sind.

**Health** — `health.maxFileLines` / `--max-file-lines` (v3.38.0, Default 0 = aus) meldet zu lange Dateien als
Komplexitäts-Finding. `health --group-by` mit Trend pro Gruppe (v3.33.0). `health.cyclomaticPolicy:
"literal-membership"` zählt Literal-Vergleichsketten als eine Verzweigung (v3.36.0). `health` liefert
außerdem „hidden coupling"-Refactoring-Targets (Dateien, die über viele Commits **ohne Import** gemeinsam
geändert werden) — in 3.43.2 sichtbar, Einführungsversion nicht ermittelt.

**Config- und Output-Komfort:**
- `--lean` (v3.38.0) — JSON ohne leere Arrays, laut Releases ca. 90 % kleiner. Für Agent-Aufrufe und CI-Artefakte.
- `workspaces.settings` (v3.40.0) — workspace-spezifische Settings statt globaler Wiederholung;
  `ignoreDependencies` akzeptiert Globs (v3.31.0).
- Config-Redundanz-Diagnosen `entry-pattern-redundant`, `ignore-dependencies-entry-redundant`,
  `ignore-patterns-entry-redundant` (v3.36.0) — melden Einträge, die Fallow schon selbst erkennt.
- Stabile `stable_finding_id` für Security-Findings, überdauert Zeilenverschiebungen (v3.43.0).

**Neue Built-in-Plugins** (keine Config nötig): release-it, eve, ag-ui, nestjs-trpc, kibana (v3.32.0);
Vite+, Egg.js, JavaScript-GitHub-Actions (v3.35.0); dotenv (v3.36.0); graphql-config (v3.39.0); gulp, n8n,
unplugin-icons, vite-plugin-pages, SolidStart, dumi (v3.42.0). Dazu verschachtelte pnpm-Workspaces (v3.41.0),
Nuxt-`#layers/`-Imports (v3.43.1), Angular-Template-Inputs/-Outputs inkl. Basisklassen (v3.43.2).

**Performance:** musl-Binaries 4× schneller durch mimalloc (v3.33.0). Auf Linux installiert npm nur noch **ein**
Platform-Binary statt zwei, ca. 30 MB weniger (v3.43.0).

**Fallow Cloud / Runtime** (bezahlter Teil, nur relevant bei genutzter Runtime-Coverage): `fallow cloud login`
legt Keys im OS-Keychain ab, `coverage setup --cloud` plant das Setup in einem Schritt,
`inspect --file <path> --cloud` zeigt Produktionsdaten je Funktion (alle v3.38.0).

### Breaking / Verhaltensänderungen 3.32 → 3.43 (gegen bestehende Läufe prüfen)

- **v3.34.0 — Config-Globs:** ein einzelnes `*` bleibt in **einem** Pfadsegment, nur `**` kreuzt Verzeichnisse.
  `src/plugins/*/index.js` trifft keine verschachtelten Ordner mehr; `src/generated/*` → `src/generated/**`
  für das alte Verhalten. Betrifft `entry`, `dynamicallyLoaded`, `ignorePatterns`, `ignoreFindings`,
  `overrides[].files`. Fallow warnt auf stderr mit Umschreib-Vorschlag.
- **v3.33.0 — Kaskaden-Findings versteckt:** Unused Exports/Members **in ungenutzten Dateien** werden
  standardmäßig nicht mehr aufgelistet (`--show-cascade` bzw. `showCascade` holt sie zurück). Fund-Zahlen sinken
  ohne Code-Änderung.
- **v3.33.1 — Baselines pro Analyse:** bare `fallow --baseline` nimmt nur Dead-Code-Baselines; für Health und
  Dupes `--health-baseline` / `--dupes-baseline` (Action/Template: `health-baseline`, `dupes-baseline`).
  `audit` **lehnt** das globale `--baseline`/`--save-baseline` ab (lokal verifiziert).
- **v3.36.0:** extrem tiefe Verschachtelung heißt `source-nesting-too-deep` statt `source-parse-degraded` —
  Filter in Skripten auf beide Diagnosen erweitern.
- **v3.39.0 — Production-Modus:** User-„support"-Einträge sind dort keine Entry-Points mehr; Dependencies
  können neu als unused auftauchen.
- **v3.39.0–v3.43.2 — Sicherheitsfix:** Runtime-Coverage ruft keinen Package-Manager mehr auf, um das
  `fallow-cov`-Sidecar zu finden (Suche nur in `node_modules`, pnpm-/Bun-Stores, Yarn `unplugged`, `PATH`).
  Die Releases nennen den Fix an zwei Stellen (3.39.0 und 3.43.2).
- **v3.42.0:** Cache-Schreibzugriffe meiden Symlinks, die das Projekt verlassen; `health --save-snapshot` bricht
  dann mit Fehler ab.
- **v3.43.0:** `mutation`-JSON auf Schema-Version 2, Journal und Result-Cache im neuen Format.
- **v3.35.0:** GitHub-Action fordert das gebrandete Token nur noch beim Posten an (`branded-token: auto`).
- **Schema-Versionen** (selbst verifiziert an 3.43.2): kombiniert **15** (war 10), `audit` **14** (war 9),
  `health` **13**, `dead-code` **11**, `dupes` **10**, `security` **8**, `architecture` **2**. CI-Parser, die
  `schema_version` prüfen, müssen nachziehen.

Quelle der Auswertung: GitHub-Releases v3.32.0–v3.43.2 und `CHANGELOG.md` (nur 3.43.x), abgefragt 2026-11-18.

### Praxis-Befunde (selbst verifiziert 2026-11-18, Projekt CV, Astro 5.17)

- **Gate-Stolperfalle:** `bunx fallow dead-code` und `dupes` enden mit Exit 0 („No issues found"), das **bare**
  `bunx fallow` und `health` mit **Exit 1** („Failed: health (12 above threshold)", Maintainability 93,6).
  Ein Gate „0 tote Dateien/Exports" gehört auf `dead-code`, nicht auf den kombinierten Lauf — der scheitert am
  Health-Schwellwert, auch wenn nichts Totes da ist.
- **Parser-Warnung bei Astro-Redirect-Seiten:** `WARN Parsed 'src/pages/index.astro' with 1 error(s); the parser
  recovered and continued`. Auslöser ist vermutlich das top-level `return Astro.redirect(...)` im Frontmatter
  (in Astro erlaubt, für Fallows Parser ein Syntaxfehler). Nach dem Fehler stehende Imports/Referenzen können
  fälschlich als unused erscheinen; hier blieb `dead-code` bei 0, weil der Import davor steht.
- **Erster Lauf nach dem Upgrade:** `Cache file does not carry fallow's cache framing, rebuilding` — einmalig und
  harmlos, `.fallow/` baut sich neu auf.
- **`fallow migrate`** portiert Configs von **knip, jscpd und stylelint** nach Fallow, nicht von einer älteren
  Fallow-Version. Eine Release-Zusammenfassung behauptete das Gegenteil (v3.40.0, „alte Config migrieren") —
  `fallow migrate --help` widerlegt das.

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
bunx fallow --version       # 3.43.2
```

---

## Commands

| Command | Zweck |
|---|---|
| `dead-code` | Unused files/exports/types/class-members, dependency hygiene, import cycles |
| `dupes` | Copy-paste + strukturelle Code-Duplikation |
| `health` | Komplexität, Maintainability, Hotspots, Coverage-Gaps |
| `flags` | Feature-Flag-Nutzungsmuster |
| `audit` | Nur **geänderte** Dateien reviewen (gut für PRs / pre-commit); `--staged`, `--brief` (= `review`) |
| `architecture` / `guard <files>` | Zyklen, Boundaries, Policy nach dem Edit prüfen / Regeln vor dem Edit anzeigen |
| `mutation` | Mutation-Testing (opt-in, führt Tests aus): überlebende Mutanten = Test-Lücken |
| `baselines prune` | Baseline-Einträge entfernen, die keinen aktuellen Fund mehr treffen |
| `fix` | Auto-fix für **sichere** unused-code Findings (`--dry-run` zuerst!) |
| `watch` | Re-run bei File-Changes |
| `list` / `workspaces` | Discovery-Diagnose: entry points, plugins, boundaries, workspaces |
| `explain <issue>` | Erklärt einen Issue-Typ ohne Analyse-Run |
| `init` | Config (+ optional Git-Hook) anlegen |
| `migrate` | `knip`-, `jscpd`- oder `stylelint`-Config übernehmen |
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

JSON-Top-Keys (`dead-code`: schema_version 11 in 3.43.2; kombiniert 15, `health` 13, `audit` 14 — die 10
bzw. 9 aus älteren Abschnitten sind überholt): `unused_files`, `unused_exports`,
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
