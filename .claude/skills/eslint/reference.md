> Generiert aus der live-docs-collection (skills/live-docs-collection/eslint/eslint.md, skills/live-docs-collection/eslint/eslint-plugin-astro-v3.md) am 2026-10-26. Master-Quelle ist dort gepflegt (`/live-docs-update`) — bei Zweifel an der Aktualität zuerst dort nachsehen und diese Datei danach neu generieren, nicht von Hand nachziehen.

# ESLint 10 Core

# ESLint 10 — Flat-Config-only, Major-Migration von v9

> **10.10 → 10.12 (2026-10-05):** gegengeprüft, **keine Fähigkeit, die Handarbeit ersetzt**. Für Config-Nutzer nur
> Regel-Feinschliff: `no-unsafe-finally` meldet seit 10.11 auch unsicheres `continue` mit Label, `new-cap` nimmt
> seit 10.11 nur noch Built-ins aus, die auf das Global verweisen, und behandelt seit 10.12 astrale Unicode-Zeichen.
> Das sind die einzigen Stellen, an denen ein bisher grüner Lauf neue Meldungen bekommen kann (nach dem Bump
> `bun run lint` einmal laufen lassen). Neu für Plugin-Autoren: `SourceCode#getText()` akzeptiert seit 10.12
> Tokens und Kommentare direkt.

## TL;DR

ESLint 10 macht **Flat Config (`eslint.config.js`) verpflichtend** und entfernt das Legacy-`.eslintrc`-System komplett. Wer bereits auf v9 Flat Config war (wie dieses Repo), upgradet i. d. R. **ohne Änderung** — `eslint .` bleibt grün. Die Reibungspunkte sind Node-Version, geänderte Config-Auflösung und ein paar neue `recommended`-Regeln.

## Breaking Changes (Flat-Config-Nutzer)

| Thema | v9 | v10 |
|---|---|---|
| Config-Format | Flat **oder** `.eslintrc` | **nur** `eslint.config.*`; `.eslintrc.*` nicht mehr unterstützt |
| Config-Lookup | ab CWD | **ab dem Verzeichnis der gelinteten Datei** aufwärts → mehrere Configs pro Run (monorepo-freundlich). Altes Verhalten via explizitem `--config` |
| Node.js | breiter | **nur `^20.19.0 || ^22.13.0 || >=24`** (21.x/23.x raus) |
| `eslint-env`-Kommentare | Warnung | **Error, nicht mehr unterstützt** (stattdessen `languageOptions.globals`) |

### Entfernte APIs (nur relevant bei eigenen Rules/Integrationen)

- **`context`-Methoden weg:** `getCwd()`, `getFilename()`, `getPhysicalFilename()`, `getSourceCode()`, `parserOptions`, `parserPath` → nutze `context.cwd`, `context.filename`, `context.physicalFilename`, `context.sourceCode`, `context.languageOptions`.
- **`SourceCode`-Methoden weg:** `getTokenOrCommentBefore/After()`, `isSpaceBetweenTokens()`, `getJSDocComment()`.
- **`FlatESLint` / `LegacyESLint`** Klassen entfernt → nur noch `ESLint`.
- `RuleTester`: `type`-Property in Error-Objekten nicht mehr akzeptiert; `LintMessage.nodeType` entfernt.
- Fixer-Text muss **String** sein (sonst `TypeError`); Program-AST-Range umfasst jetzt führende/abschließende Kommentare + Whitespace; `ScopeManager` braucht `addGlobals()`.

## Neue Reports nach Upgrade (auf bestehendem Code möglich)

- **`eslint:recommended` erweitert** um `no-unassigned-vars`, `no-useless-assignment`, `preserve-caught-error`.
- **JSX-Reference-Tracking:** JSX-Identifier zählen jetzt als Variablen-Referenzen → Regeln mit Scope-Analyse (`no-unused-vars` etc.) können neue/korrigierte Ergebnisse liefern.
- **`no-shadow-restricted-names`** meldet jetzt `globalThis` per Default (`reportGlobalThis: false` zum Abschalten).
- **`radix`**: String-Optionen `"always"`/`"as-needed"` deprecated; `func-names`-Schema toleriert keine Extra-Array-Elemente mehr; `no-invalid-regexp` lehnt doppelte Flags in `allowConstructorFlags` ab.

## Gotchas

- Der **Config-Lookup-Wechsel** ist im Monorepo meist ein Vorteil (pro Package eigene `eslint.config.js` greift automatisch), kann aber Runs verändern, wenn man bisher auf CWD-Auflösung baute. Bei einer Root-Config, die alles abdecken soll, ggf. explizit `--config eslint.config.js` setzen.
- **Plugins mitziehen:** `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` müssen ESLint-10-kompatible Versionen sein (Peer-Range beachten), sonst Resolver-/Schema-Fehler.

## Patch 10.6.0 → 10.8.1 (Stack-Refresh 2026-08-21)

Reine Patch-Releases (Bugfixes), keine API-/Config-Änderung. `10.8.1` behebt u.a. ASI-Hazards in
`no-unused-labels`/`no-unused-vars`-Autofixes und False Positives in `getter-return`/`accessor-pairs`.

## 10.8.1 → 10.9.1 (2026-09-03)

Schmal: `no-unmodified-loop-condition` bekommt eine neue Option `checkConditionalExpressions`
(steuert, ob Ternaries in Loop-Bedingungen mitgeprüft werden), `no-loss-of-precision` erkennt jetzt
auch Underflow-Fälle. `10.9.1` selbst ist reiner Bugfix-Patch. Kein neuer Rule-Katalog, keine
Config-Änderung.

## 10.9.1 → 10.10.0 (2026-09-15 gegengeprüft)

Wieder schmal, keine Breaking Changes: `new-cap` prüft jetzt auch `Object.prototype`-Eigenschaftsnamen
(konsistentere Konstruktor-Benennung) und meldet keine False Positives mehr bei `UTC`-Aufrufen mehr;
`no-extra-bind` erkennt überflüssige `.bind()`-Aufrufe jetzt auch in Klassenfeldern und statischen
Blöcken; `no-unexpected-multiline` prüft zusätzlich Regex mit `d`-/`v`-Flags; `prefer-object-has-own`-
Autofix funktioniert jetzt korrekt, wenn `Object` im Scope überschrieben ist; `no-unreachable`
ignoriert statische Imports korrekt. Kein neuer Rule-Katalog, keine Config-Änderung nötig.

## Anwendungsfall in diesem Workspace

Repo war bereits auf **ESLint v9 Flat Config** (`eslint.config.js`, `typescript-eslint`, `react-hooks`, `react-refresh` — Standard laut Skill `artelier`). Upgrade auf **10.6.0** (2026-07-04, im Zuge eines `bun update`): `eslint .` sowie alle per-Workspace-Lints (`section-showcase`, `components-showcase`, `launcher`, `storefront`) liefen mit **0 Errors** durch — nur vorbestehende `@typescript-eslint/no-explicit-any`-Warnings. Node lokal v24.12.0 → erfüllt die neue Engine-Range. **Keine Config- oder Code-Anpassung nötig.**

---

# eslint-plugin-astro v3 + astro-eslint-parser v3

# eslint-plugin-astro v3 + astro-eslint-parser v3 — Upgrade Notes

> Quelle: https://github.com/ota-meshi/eslint-plugin-astro/releases (gefetcht 2026-08-04)
> Kontext: Buchart58 Bump 2.1.1 → 3.1.0 (zusammen mit astro-eslint-parser 2.1.0 → 3.0.0),
> im Zuge des Stack-Refresh 2026-08-04. `bun run lint` blieb 0 Errors, keine Config-/Code-Edits.
>
> **Gegengeprüft 2026-10-05:** `eslint-plugin-astro@3.2.1` und `astro-eslint-parser@3.2.0` sind die aktuellsten.
> **3.2.0 (2026-09-16):** einzige neue Fähigkeit ist Unterstützung für `eslint-plugin-jsx-a11y-x` (Accessibility-Regeln
> in `.astro`-Dateien mit einem ESLint-10-fähigen jsx-a11y-Fork). **3.2.1 (2026-09-17):** PostCSS-Integration für
> `<style lang="postcss">` optimiert, `postcss-load-config` v4+ läuft über einen Worker-Thread. Keine neuen Regeln,
> keine Breaking Changes — Inhalt unten weiterhin gültig. (Hinweis zu jsx-a11y-x: aus dem Plugin-Changelog
> abgeleitet, das Plugin selbst habe ich nicht gegengelesen.)

## Breaking Changes v3.0.0

- **astro-eslint-parser v3 Pflicht** — Parser wechselt auf Astros **Rust-Compiler** (`@astrojs/compiler-rs`, weg vom
  alten `@astrojs/compiler`-Pfad). Plugin v3 + Parser v2 **nicht mischen** → Parse-Fehler in .astro.
- **Regel-Deprecations** (jetzt No-op, aus `recommended` entfernt):
  - `astro/no-omitted-end-tags` — Astros Rust-Compiler lehnt weggelassene End-Tags ohnehin beim
    Parsen ab (deckt sich mit Astro-7-Breaking-Change: „Unclosed Tag = Error").
  - `astro/valid-compile` — stattdessen `astro check` für projektweite Diagnostik.
- **ESLint ≥ 10.0.0 Pflicht** (v8/v9 gestrichen) — unverändert ggü. v2.
- **ESM-only**, kein CommonJS-Entry — unverändert ggü. v2.
- **Node** `^22.22.3 || ^24.16.0 || >=26.3.0` (unter Bun irrelevant — engines nicht erzwungen).
- **typescript-eslint** optional-peer **≥ 8.61.0**.

## Wer von v1 kommt: Breaking Changes v2.0.0 (Stand 2026-10-26)

Quelle: https://github.com/ota-meshi/eslint-plugin-astro/releases. Für Projekte, die v2 überspringen, gilt zusätzlich zu v3:

- ESLint ≥ 10 Pflicht.
- ESM-only, kein CommonJS-Entry mehr.
- Mitgelieferte Configs überarbeitet: die eigene `eslint.config.js` nach dem Bump gegen die aktuelle Plugin-README prüfen.
- `astro/no-prerender-export-outside-pages` neu in `recommended`.

Danach v3 wie oben: Parser auf `@astrojs/compiler-rs`, `no-omitted-end-tags` und `valid-compile` deprecated. Die Engines von v3 verlangen Node `^22.22.3 || ^24.16.0 || >=26.3.0`.

## v3.1.0 (Minor)

- TS-Parser wird aus `typescript-eslint` aufgelöst, wenn `@typescript-eslint/parser` nicht direkt
  installiert ist. Für uns relevant: `typescript-eslint` (8.66.0) ist die einzige Quelle → greift
  automatisch, **kein** separater `@typescript-eslint/parser`-Dep nötig.

## Peers — unser Stack erfüllt alle (verifiziert 2026-08-04)

| Peer (v3.1.0 fordert) | Wir haben |
|---|---|
| eslint `>=10.0.0` | 10.8.0 ✅ |
| typescript-eslint `>=8.61.0` | 8.66.0 ✅ |
| @typescript-eslint/parser `>=8.61.0` | via typescript-eslint ✅ |
| eslint-plugin-jsx-a11y `>=6.10.2` | 6.10.2 ✅ |
| astro-eslint-parser | 3.1.0 (Plugin bündelt `^3.0.0`) ✅ |

## Config-Änderungen

- `astro/no-prerender-export-outside-pages` in `recommended` (bereits in v2 eingeführt).
- Flat-Config-API unverändert: `eslintPluginAstro.configs.recommended` weiter gültig — unsere
  `eslint.config.js` brauchte **keine** Änderung.

## Patch astro-eslint-parser 3.0.0 → 3.1.0 (Stack-Refresh 2026-08-21)

Keine Breaking Changes — reines Dependency-Update auf `@astrojs/compiler-rs@0.4.0`.

## Learnings

- Major v2 → v3 war für dieses Repo ein reiner Versions-Bump: `bun run lint` = 0 Errors. Die
  entfernten Regeln (`no-omitted-end-tags`, `valid-compile`) waren bei uns nicht aktiv relevant.
- Plugin + Parser immer im selben Major bumpen (v3 + v3). Historie v1→v2: siehe Git.
