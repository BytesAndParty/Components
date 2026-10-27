> Generiert aus der live-docs-collection (skills/live-docs-collection/astro/v7-upgrade.md, skills/live-docs-collection/astro-7/upgrade-and-react-compiler.md, skills/live-docs-collection/astro-view-transitions/astro-view-transitions.md) am 2026-10-26. Master-Quelle ist dort gepflegt (`/live-docs-update`) — bei Zweifel an der Aktualität zuerst dort nachsehen und diese Datei danach neu generieren, nicht von Hand nachziehen.

# Astro v7 Upgrade (6 → 7)

# Astro v7 — Upgrade Notes (6 → 7)

- **Source:** https://docs.astro.build/en/guides/upgrade-to/v7/
- **verified:** 2026-10-26
- **Astro latest:** 7.4.2 (Stand 2026-10-26, verlangt Node ≥ 22.23.4); vorher notiert 7.3.5 (7.0.0 released 2026-06-22) — Buchart58 hat auf 7.3.5 wegen einer kritischen Sicherheitslücke gehoben (Commit `09b923d`)
- **Requires:** Node >= 22.12.0, npm >= 9.6.5. Bundler is now **Vite 8**.
- **React integration:** `@astrojs/react` must be **>= 6**. **7.0.0 ist erschienen**, aktuell 7.1.1 (neuer Major, entfernt die `babel`-Option, React Compiler jetzt über `compiler: true`) — Details und Migrationsweg in [`astro-7/upgrade-and-react-compiler.md`](../astro-7/upgrade-and-react-compiler.md).

> ## ✅ Der 7.3.0-Bruch ist seit 7.3.1 gefixt — Pin aufheben
>
> **Verifiziert 2026-09-15** über [Issue #17898](https://github.com/withastro/astro/issues/17898)
> / [#17897](https://github.com/withastro/astro/issues/17897) und den Astro-Changelog. Root Cause
> war **nicht** `@astrojs/markdown-remark` selbst, sondern Astros eigene `astro:assets`/Font-Plugin-
> Pipeline (`vite-plugin-assets.ts`, eingeführt mit #17818): sie importierte
> `astro/_internal/logger`, ein Pfad, der laut `publishConfig.exports` nie öffentlich war — im
> Workspace-Monorepo unsichtbar (Symlink umgeht `exports`-Enforcement), bricht aber jeden Build
> mit dem **published** Package, der `astro:assets` berührt (auch `output: 'server'` ohne
> Assets-Nutzung, weil der Adapter die Pipeline mitzieht). Deshalb traf es auch Projekte mit
> `@astrojs/markdown-remark` + `unified()`-Prozessor, ohne dass die Lib selbst die Ursache war.
>
> **Fix in 7.3.1** ([PR, gemerged 2026-09-03](https://github.com/withastro/astro/issues/17898#issuecomment-5525794675)):
> der triviale `astroToRuntimeLogger`-Wrapper wird jetzt inline emittiert statt importiert —
> keine `_internal/*`-Abhängigkeit mehr im emittierten Code. `astro@7.3.1`/`7.3.2` + aktuelles
> `@astrojs/markdown-remark@7.3.1` bauen wieder normal.
>
> **Pin aufheben:** Projekte, die nach dem alten Workaround `"astro": "7.2.6"` /
> `"@astrojs/markdown-remark": "7.2.4"` exakt gepinnt hatten, können auf `^7.3.1`/`^7.3.2` bzw.
> `^7.3.1` gehen und danach normal `build` gegenprüfen.
>
> **Bekannte Fehldiagnose, kein neuer Bug:** [#17926](https://github.com/withastro/astro/issues/17926)
> sah nach einer Wiederkehr aus (gleiche `"./xyz" is not exported`-Fehlerklasse, diesmal
> `@astrojs/internal-helpers`), war aber eine veraltete `@astrojs/internal-helpers@0.10.x` in einem
> pnpm-Workspace (dedupte alte Version statt der benötigten `0.11.0`) — kein Astro-Bug. Bei ähnlicher
> Fehlermeldung zuerst `pnpm why <package>` prüfen, bevor erneut gepinnt wird.

## devalue 6: kein Override auf ^5 (Stand 2026-10-26)

`astro@7.4.2` deklariert `devalue ^6.0.2` und nutzt die Replacer-API von devalue 6 (tagged template `js`). Ein
Root-Override auf `devalue ^5` (z. B. aus einem alten Security-Workaround) erzeugt falsche Ausgabe bei
Content-Collection-Einträgen mit URL- oder Image-Assets. Vor bzw. nach dem Bump
`overrides`/`resolutions` in der Root-`package.json` auf `devalue` prüfen und einen Pin auf ^5 entfernen.
Quelle: https://github.com/sveltejs/devalue/blob/main/CHANGELOG.md

## Breaking changes

1. **Vite 8** — bundler/dev server bumped from Vite 7 → 8. Only affects code touching Vite internals/plugins. See https://vite.dev/guide/migration.
2. **Experimental flags stabilized & removed** from `experimental` block: `logger` → top-level `logger`; `queuedRendering`, `rustCompiler`, `advancedRouting` → now default (remove); `cache`/`routeRules` → move out of `experimental`.
3. **Rust compiler replaces Go compiler** (stricter): all non-void elements need matching closing tags; invalid HTML is no longer auto-corrected (e.g. `<div>` inside `<p>`). Fix markup; inspect layout.
4. **`src/fetch.ts` reserved** for advanced routing (like `src/middleware.ts`). Rename, or set `fetchFile` in config (`null` to disable).
5. **New default Markdown processor (Sätteri)** replaces remark/rehype; `@astrojs/markdown-remark` no longer installed by default. To keep remark/rehype plugins: reinstall it and set `processor: unified()`.
6. **`compressHTML` default `true` → `'jsx'`** (JSX-style whitespace stripping). Inline-element spacing may change; add `{" "}` where needed, or set `compressHTML: true` to restore v6 behavior.

## Deprecated / removed

- `getContainerRenderer()` root import deprecated → use `@astrojs/react/container-renderer`.
- `@astrojs/db` package removed (use `node:sqlite` / Drizzle).
- `astro:transitions` internal constants/helpers removed (`TRANSITION_*`, `isTransitionBefore*`, `createAnimationScope`). The `<ClientRouter />` component itself remains — use lifecycle event names directly (`'astro:before-preparation'` etc.).

## Patch 7.3.1 → 7.3.2 (2026-09-15 gegengeprüft)

Reine Bugfixes, keine neuen Fähigkeiten:

- 7.3.1: der `_internal/logger`-Fix oben, sonst nichts.
- 7.3.2: MDX-Script/Style-Escaping (dynamische Werte in `<script>`/`<style>` werden jetzt escaped
  statt roh gerendert — `set:html` nötig, um bewusst wieder raw zu rendern), Dev-Toolbar-504-Fix
  bei Workspace-Links, i18n-Fallback-Routing-Fix (verstümmelte Segmente wie `/energy/en` →
  `/esergy/en`), Cloudflare-Sessions im Dev-Modus mit Middleware.

## Minor 7.1.0 → 7.2.4 (Stack-Refresh 2026-08-21)

Additiv, keine neuen Breaking Changes ggü. 7.0. Relevant:

- **Incremental Static Builds** (7.2.0, `experimental.incrementalBuild: true`): überspringt Rebuild
  statischer Seiten, wenn Deps/Cache-Keys unverändert sind — Build-Zeit-Gewinn für große Sites.
- **Content-Collection-Digest** (7.2.0): Loader können einen opaken Digest-Wert liefern, der sich bei
  Content-Änderung ändert — Change-Detection ohne Re-Hash großer Bodies.
- **Feingranulare CSP-Direktiven** (7.1.0): `script-src-elem`/`style-src-attr` etc. über neue `kind`-Option.
- `astro dev --ignore-lock` + `astro dev stop/status/logs` Subcommands (7.1.0).
- Diverse Fixes: hängende Builds bei defekten Bildern, Base-Path-Stripping, `Astro.site` im Container
  API, CSS-/Middleware-HMR.

## Impact on vendure-showcase/storefront (checked 2026-07-04)

- No `experimental` block, no `src/fetch.ts`, no `.md/.mdx`, no `@astrojs/db`, no removed transition internals, no `getContainerRenderer`. **Only real risks:** stricter compiler on the 8 `.astro` files + `compressHTML` whitespace — both caught by `astro check`/build.
- `<ClientRouter />` is used in `Layout.astro` — unaffected (component stays).

---

# React Compiler Wiring in Astro

# Astro 7 — Upgrade Notes & React Compiler

> verified: 2026-10-26 (Astro 7.4.2, **@astrojs/react 7.1.1**; 7.0.0 war der neue Major, siehe nächster Abschnitt;
> der Rest gilt unverändert) · für Buchart58 Phase-1-Setup, seit 2026-09 auch LevelMeUp
> Sources:
> - https://docs.astro.build/en/guides/upgrade-to/v7/
> - https://docs.astro.build/en/guides/integrations-guide/react/
> - https://syntackle.com/blog/integrating-react-compiler-with-astro/
> - https://github.com/withastro/astro/blob/main/packages/integrations/react/CHANGELOG.md (7.0.0)

> **✅ Der 7.3.0-Bruch mit `@astrojs/markdown-remark` ist seit 7.3.1 gefixt** — alter Pin
> (`astro@7.2.6`) kann aufgehoben werden. Details in [`astro/v7-upgrade.md`](../astro/v7-upgrade.md).

> **Praxis-Notiz (LevelMeUp, 2026-09-03):** die Compiler-Verdrahtung unten ist verifiziert — aber
> `@astrojs/react` schickt nur `.jsx`/`.tsx` durch Babel. Bei **null React-Dateien im Projekt ist die
> ganze Konfiguration ein No-op**, und ein grüner Build beweist gar nichts. Nach dem Einrichten mit
> einer Wegwerf-Komponente (`useState` + `client:load`) gegenprüfen und im Client-Bundle nach
> `useMemoCache` bzw. `_c(` greppen — der Compiler legt dort einen Memo-Cache an
> (`let t = (0,o.c)(7)`) und memoisiert Callback und JSX. Danach löschen.

> **Ebenfalls nicht automatisch:** die `@astrojs/react`-Integration fasst `tsconfig.json` **nie** an —
> das macht nur der `astro add react`-CLI-Befehl. Wer per `bun add` installiert, muss `jsx` und
> `jsxImportSource` selbst setzen; `astro/tsconfigs/base` liefert `"jsx": "preserve"` und gar kein
> `jsxImportSource`. Ohne das kompiliert keine `.tsx`.
> ```json
> { "compilerOptions": { "jsx": "react-jsx", "jsxImportSource": "react" } }
> ```
> Aus demselben Preset wird `verbatimModuleSyntax: true` geerbt → jede `.tsx` braucht
> `import type { … } from 'react'`; ein normales `import { ReactNode }` ist ein Build-Fehler.

## Breaking Changes v6 → v7 (relevant für uns)

- **Vite 8** ist neu (Dev-Server + Bundler). Kein eigener `vite`-Pin nötig; falls doch, auf `^8`.
- **Rust-Compiler ist default & strenger**: alle Non-Void-Elemente brauchen schließendes Tag,
  kein Auto-Fix von invalidem HTML/Nesting (kein `<div>` in `<p>`). Unclosed Tag = Error.
- **`compressHTML` default `'jsx'`** (vorher `true`): Whitespace zwischen Inline-Elementen wird gestrippt
  (wie React). Bei Bedarf `{" "}` setzen oder `compressHTML: true` zurückstellen.
- **Markdown**: Sätteri ist default statt remark/rehype. Für remark/rehype-Plugins
  `@astrojs/markdown-remark` installieren + `markdown.processor` setzen. (Uns egal, kein MD-Pipeline nötig.)
- **Reservierter File `src/fetch.ts`** (Advanced Routing). Kollision → umbenennen oder `fetchFile` setzen.
- **Entfernte Experimental-Flags** aus Config raus: `logger`, `queuedRendering`, `rustCompiler`,
  `advancedRouting`; `cache`/`routeRules` auf Top-Level.
- **Entfernt**: `@astrojs/db`. `getContainerRenderer` → Import aus `@astrojs/react/container-renderer`.
- **i18n / prefetch / image.domains**: unverändert gegenüber v6 — bestehende Config-Shape gilt weiter.

## @astrojs/react 7.0.0 — React Compiler ohne Babel (Major, 2026-10)

> **⚠️ Betrifft unsere Projekte direkt:** Buchart58 (`storefront/astro.config.mjs`) und LevelMeUp
> (`astro.config.mjs`) verdrahten den Compiler heute über `react({ babel: { plugins: [...] } })`. Diese
> `babel`-Option **gibt es in 7 nicht mehr**. Beide stehen auf `^6.x`, ein Caret zieht nicht von selbst auf 7 —
> der Bruch passiert erst beim bewussten Bump. (Stand 2026-10-05. Buchart58 ist seit 2026-10-06 umgestellt, siehe
> Migrationsweg unten.)

**Was neu ist (spart Arbeit):** `@astrojs/react` 7 setzt auf `@vitejs/plugin-react` v6 mit **Oxc** für JSX und
Fast Refresh (statt Babel) und bringt den Compiler als eingebaute Option mit:

```js
// astro.config.mjs — @astrojs/react 7
import react from '@astrojs/react';

export default {
  integrations: [react({ compiler: true })],
};
```

- `bun add -D oxc-transform-react` — **Version an den Peer der Integration binden**, siehe Fallstrick unten.
- Ersetzt `babel-plugin-react-compiler` **und** die komplette `babel: { plugins: [[…, { target: '19' }]] }`-Zeile.
  Die Reihenfolge-Regel („Compiler muss zuerst stehen") entfällt damit.
- Der Compiler memoisiert Client-Komponenten und Hooks; **Server-Rendering wird nicht kompiliert** (wie bisher).
- `target` folgt der installierten React-Major-Version. Nur React 17/18 braucht zusätzlich
  `react-compiler-runtime` (wir: React 19 → nicht nötig).
- Optionen als Objekt: `compiler: { compilationMode: 'annotation' }`; `include`/`exclude` der Integration
  gelten, Dependencies und `.astro`-Dateien sind ausgenommen.

**Breaking:**
- `babel`-Option entfernt. Wer **andere** Babel-Transforms braucht (z. B. `babel-plugin-styled-components`),
  installiert `@rolldown/plugin-babel` + `@babel/core` und hängt `babel({ plugins: [...] })` unter
  `vite.plugins`. Das Plugin liest **keine** `babel.config.js`/`.babelrc`, der alte `babel`-Callback geht nicht;
  Optionen direkt übergeben. Funktioniert auch zusammen mit `compiler: true`.
- **Nicht beides gleichzeitig:** `babel-plugin-react-compiler` und `compiler: true` nicht auf denselben
  Komponenten aktivieren.
- Vite 8 vorausgesetzt (`@astrojs/react` zieht `vite ^8.3.0`; `@rolldown/plugin-babel` hat `vite ^8` als Peer) —
  mit Astro 7 ohnehin erfüllt.

**Fallstrick: widersprüchliche Peer-Ranges (Registry geprüft 2026-10-05, im Projekt verifiziert 2026-10-06
in Buchart58).** `@astrojs/react@7.0.0` verlangt `oxc-transform-react@^0.145.0`, `@vitejs/plugin-react@6.1.2` (wird
transitiv gezogen und lädt das Paket tatsächlich) dagegen `^0.152.0`; `latest` ist `0.153.0`. Bei 0.x schließt Caret die
nächste Minor aus — **keine Version erfüllt beide Ranges**. **Bun 1.4.2 warnt nicht** und verlinkt `0.145.0` still für
beide. Mit `^0.145.0` (Peer der Integration) liefen Build, Lint, Typecheck und Tests grün und der Compiler war im Bundle
nachweisbar aktiv. Beim nächsten Patch von `@astrojs/react` die `oxc-transform-react`-Version mitheben.

**Stand 2026-10-26 (`@astrojs/react` 7.1.1):** Der Peer-Konflikt besteht weiter. Die Integration verlangt nach wie vor
`oxc-transform-react ^0.145.0`, `@vitejs/plugin-react` 6.1.2 `^0.152.0`, neueste Version ist 0.155.0. Also weiter
auf `^0.145.0` bleiben. Sonst unverändert: `babel`-Option entfällt, Compiler über `react({ compiler: true })` mit
`oxc-transform-react`. Node-Floor: ≥ 22.23.4 (gilt ebenso für `astro` 7.4.2).

**Neue Compiler-Warnungen:** Der Oxc-Compiler meldet Stellen, die er nicht memoisiert (Babel hat sie still übersprungen),
in Buchart58 5 Stück: dynamisches `import()`, `eslint-disable` im Quelltext und `try`/`finally` ohne `catch`. Keine
Fehler, nur nicht optimierte Komponenten.

**fallow:** `oxc-transform-react` wird nirgends importiert und taucht daher als ungenutzte devDependency auf →
in `ignoreDependencies` der fallow-Config eintragen (ersetzt dort den alten `babel-plugin-react-compiler`-Eintrag).

**Migrationsweg für unsere Projekte** (Buchart58 umgesetzt 2026-10-06, LevelMeUp siehe dessen Config):
1. `@astrojs/react` auf 7 heben, `oxc-transform-react` in der vom Peer verlangten Version ergänzen.
2. `react({ babel: … })` → `react({ compiler: true })`; `babel-plugin-react-compiler` aus den devDependencies.
3. Smoke-Test: Wegwerf-Komponente mit `useState` + `client:load`, im Client-Bundle nach `_c(` bzw.
   `useMemoCache` greppen. Ohne Treffer ist der Compiler **nicht** aktiv, auch wenn der Build grün ist.

Der folgende Abschnitt bleibt als Stand für `@astrojs/react` 6 stehen.

## React Compiler mit @astrojs/react (v6.0.4)

React 19 → `target: '19'` (default), **kein** `react-compiler-runtime` nötig (das ist nur für React 17/18).
`babel-plugin-react-compiler` **zuerst** in der Plugin-Liste.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [
    react({
      babel: { plugins: [['babel-plugin-react-compiler', { target: '19' }]] },
    }),
  ],
});
```

`babel-plugin-react-compiler` als devDependency. Stable seit `1.0.0`.

## Routing & Co-Location (verifiziert Astro 7)

Source: https://docs.astro.build/en/guides/routing/

- **Nur `.astro`, `.md`, `.mdx`** in `src/pages/` werden zu Routen. **`.tsx`/`.jsx` werden NIE geroutet** —
  ein `components/`-Ordner mit `.tsx`-Dateien neben einer `index.astro` erzeugt keine ungewollten Routen.
- **Underscore-Prefix `_`** schließt Datei _oder_ Ordner komplett vom Routing aus (`_home/`, `_Header.astro`) —
  landet nicht in `dist/`. Der idiomatische Weg, seiten-lokale Partials zu co-locaten.
- **„Advanced Routing"** ist in v7 default, aber **opt-in** in der Nutzung — ändert das obige file-based
  Verhalten nicht.

---

# View Transitions (astro:transitions)

# Astro View Transitions — Cached Reference

> **Gegen Astro 7 gegengeprüft (2026-09-03): inhaltlich unverändert.** Die Komponente heißt weiterhin
> `<ClientRouter />`, der Astro-7-Upgrade-Guide führt keine Änderung an `astro:transitions`. Die
> jüngsten Ergänzungen der API stammen alle aus 3.x/4.x (`transition:persist-props` und
> `data-astro-rerun` seit 4.5, `astro:before-preparation`/`astro:after-preparation` seit 3.6,
> Formular-Support seit 4.0, Route-Announcer seit 3.2) — seitdem nur noch stabil.
> Achtung beim Upgrade selbst: siehe den **7.3.0-Bruch** in [`astro/v7-upgrade.md`](../astro/v7-upgrade.md).

SPA-artige Navigation + native View-Transition-API in einem MPA. Aktiviert über `<ClientRouter />`
im `<head>` des Layouts. Browser ohne VT-Support fallen automatisch auf klassische MPA-Navigation
zurück — VT ist **reine Progressive Enhancement**, nie Korrektheits-Abhängigkeit.

> **Naming-Hinweis:** Bis Astro 4 hieß die Komponente `<ViewTransitions />`. Ab Astro 5 ist sie in
> **`<ClientRouter />`** umbenannt (Import unverändert aus `astro:transitions`). Trainingsdaten
> referenzieren oft noch den alten Namen.

## Quick Reference

```astro
---
import { ClientRouter } from 'astro:transitions';
---
<head>
  <ClientRouter />
</head>
```

### Direktiven

| Direktive | Zweck | Use-Case |
|---|---|---|
| `transition:name="x"` | Überschreibt Astros Default-Matching — **zwei verschiedene** Knoten (alt/neu) morphen ineinander | Listen-Hero → Detail-Hero, Card-Titel → Page-Titel |
| `transition:animate` | Überschreibt die Default-Animation beim Austausch alt→neu | `fade` (default), `slide`, `none`, `initial`, oder custom |
| `transition:persist` | **Derselbe** Knoten überlebt die Navigation — kein Re-Mount, State bleibt | Header, Cart-Island, Audio-Player, Sidebar-Scrollpos |

### Built-in Animationen

```astro
---
import { fade, slide } from 'astro:transitions';
---
<div transition:animate="fade" />
<div transition:animate={fade({ duration: '0.4s' })} />   <!-- parametrisiert -->
<div transition:animate="slide" />
<div transition:animate="none" />     <!-- VT für dieses Element ausschalten -->
```

### Lifecycle-Events (auf `document`, in dieser Reihenfolge)

1. `astro:before-preparation` — Navigation startet, vor dem Laden des Ziels
2. `astro:after-preparation` — Zielseite geladen & geparst
3. `astro:before-swap` — vor dem DOM-Austausch
4. `astro:after-swap` — direkt nach dem Austausch (altes DOM ist weg)
5. `astro:page-load` — Ende der Navigation, neue Seite sichtbar (Ersatz für `DOMContentLoaded` bei SPA-Nav)

## Best Practices (für React-Islands-Setups)

### 1. Das `client:only`-Timing — die wichtigste Regel
Astro snapshottet das **alte DOM**, swappt, animiert dann zum **neuen DOM**. Bei `client:only`
mountet React aber **erst nach `astro:after-swap`** → das `transition:name`-Gegenstück existiert im
Snapshot-Moment noch nicht → Morph fällt aus oder flackert.
→ **Shared Elements (Hero-Box, Titel) server-seitig im `.astro`-File rendern** und `transition:name`
dort setzen, nicht tief in einer `client:only`-Insel verstecken. React reichert drumherum an.
(`client:load`/`client:visible` SSRn das initiale Markup mit und sind weniger betroffen als
`client:only`, das gar kein SSR-HTML erzeugt.)

### 2. `transition:name` vs. `transition:persist` sauber trennen
- **name** = zwei verschiedene Knoten morphen (Liste→Detail).
- **persist** = ein Knoten bleibt am Leben (Header/Cart-Island re-mountet sonst bei *jeder* Nav und
  verliert State). `transition:persist` erhält auch Astro-Islands inkl. ihrer `client:`-Direktive.

### 3. Namen deterministisch & global eindeutig
Pro Snapshot muss jeder `transition:name` **einmalig** sein. Wiederholte Elemente (12 Karten) per
stabiler ID eindeutig machen: `wine-hero-${slug}`, nicht `wine-hero`. Liste und Detail müssen
denselben Namen erzeugen → zentrale Helper-Funktion statt zweimal hartkodieren:

```ts
export const wineVT = (slug: string) => ({
  hero:  `wine-hero-${slug}`,
  title: `wine-title-${slug}`,
});
```

### 4. Sparsam benennen
Nur 1–3 Anker morphen (Hero, Titel, ggf. Preis). Alles zu benennen = ruckelig + visuelles Rauschen.

### 5. `prefers-reduced-motion`
Astro **deaktiviert seine eingebauten VT-Animationen automatisch**, wenn `prefers-reduced-motion`
gesetzt ist. **Custom** `::view-transition-*`-Keyframes deckt das aber *nicht* ab — dafür ein Guard:

```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) { animation: none !important; }
}
```

### 6. Brand-konforme Defaults
Kurz & erdig: ~250–350 ms, `ease-out`, dezenter Scale/Fade statt Slide-Spektakel.

### 7. SPA-Lifecycle statt `DOMContentLoaded`
Bei In-App-Navigation feuert kein klassisches Page-Load. Re-Init über `astro:page-load`
(läuft auch beim ersten Voll-Load) bzw. `astro:after-swap`. Module-Level-State in Inseln vorsichtig
behandeln: überlebt `persist`, nicht Re-Mount.

## Gotchas

- `view-transition-name` braucht eine **gerenderte Box** — nicht auf `display: contents` oder auf
  zwei sichtbare Elemente mit gleichem Namen im selben Snapshot (bricht stillschweigend).
- `client:only`-Ziel ⇒ Morph-Target fehlt im Snapshot (siehe §1). Häufigste Ursache für „VT tut nix".
- VT ist Enhancement: Layout/Funktion darf nie davon abhängen, dass der Morph greift.
- Alter Name `<ViewTransitions />` (≤ Astro 4) vs. `<ClientRouter />` (≥ Astro 5) nicht verwechseln.
