---
name: components-verify
description: Use after changing code, styles or dependencies in the __Components__ repo, before calling a change done, committing or pushing it. Covers lint, typecheck via the showcase, Vitest, the fallow dead-code check after dependency changes, the optional Playwright run, and the manual browser checklist handed to the user.
---

# components-verify

Prüfschritte nach Änderungen an Komponenten, Showcases, Launcher oder Storefront in `__Components__`. Die CI (`.github/workflows/ci.yml`) führt `bun audit`, `bun lint` und `bun run test` aus; §1 deckt alle drei ab.

## 1. Immer

- `bun run lint` (Repo-Root, `eslint .`): 0 Fehler. Warnungen „Compilation Skipped" vom React Compiler bei motion-Komponenten sind bekannt und in Ordnung.
- Typecheck über den Showcase, der `components/` mitprüft: `cd components-showcase && ./node_modules/.bin/tsc --noEmit`. `components/` hat keine eigene `tsconfig.json`, `bunx tsc -p components` scheitert deshalb. Bei Änderungen in `section-showcase/` bzw. `launcher/`: dort `bun run typecheck`.
- `bun run test` (Vitest, `components/**/*.test.*` und `vendure-showcase/**`). Gezielt: `bunx vitest run components/<name>`.
- Vor einem Push zusätzlich `bun run security:audit` (wie die CI).

## 2. Komponente geändert oder neu

- `COMPONENT.md` beschreibt den aktuellen Stand: Props mit Defaults, Usage, Dependencies (COMPONENT-GUIDELINES §3).
- Showcase-Eintrag mit Golden Path und Edge-Cases vorhanden (COMPONENT-GUIDELINES §10).
- UI-Strings stehen in `messages.ts` (`de` + `en`), kein ungenutzter Key (COMPONENT-GUIDELINES §6).

## 3. Abhängigkeiten geändert

- `bunx fallow dead-code` (Config `.fallowrc.jsonc`, Cache `.fallow/` bleibt liegen). Zu beheben sind `unused_files`, `duplicate_exports` und echte tote Dependencies. `unused_exports`/`unused_types` sind meist gewollte Deep-Import-API, `unused_class_members` in `cellar-canvas` sind Engine-API in Arbeit, die werden nicht massenhaft gelöscht. Unlisted Dependencies unterdrückt man mit `ignoreDependencies`, nicht mit `ignoreUnresolvedImports`.

## 4. Verhalten im Browser

- Playwright, wo es die Änderung abdeckt: `bun run test:e2e` (Smoke-Tests unter `e2e/showcase`) und `bun run test:mobile` (Touch-Targets und Layout der Section-Showcase-CTAs), bei Storefront-Änderungen `bun run test:e2e:vendure` (FOUC, Hydration). Alle starten ihren Dev-Server über `webServer` in der Config selbst und beenden ihn wieder. Die Vendure-Suite rendert gegen die Shop-API auf dem VPS (Override: `VENDURE_SHOP_API_URL`); antwortet die nicht, scheitert der Start mit einem Timeout.
- Alles Visuelle prüft der User. Am Ende eine kurze Liste der Checks geben, die zur Änderung passen:
  - Tab durch die Komponente: alles fokussierbar, sichtbarer Fokusring.
  - Dark ⇄ Light: keine Kontrastbrüche.
  - Akzent wechseln: wird sofort übernommen.
  - Reduced Motion (DevTools → Rendering): keine Springs.
  - Touch-Geräte: Ziele mindestens 44 × 44 px.

## Fallen

- Eine Klasse steht im Markup, wirkt aber nicht (Element fällt auf 0 px zusammen, keine Konsolenfehler): Der `@source`-Eintrag für `components/**` fehlt in der `styles.css` des Showcases (COMPONENT-GUIDELINES §2).

## Related skills

- **new-component** – legt eine Komponente an. Dieser Skill prüft sie danach.
- **vitest**, **fallow**, **playwright-test**, **testing-library**, **tailwindcss** – Lib-Referenzen, wenn ein Prüfschritt an einer API-Frage hängt.
