# Project Health — Analyse & Handlungsaufträge (Erledigt)

> Stand: 2026-06-12 · Basis: Lint-/Test-/Audit-Läufe, fallow-Analyse, Doku-Abgleich gegen AGENTS.md / ARTELIER.md / COMPONENT-GUIDELINES.md / CELLAR-CANVAS.md

---

## Gesamteinschätzung

**Das Projekt ist in exzellentem Zustand.** Alle kritischen Handlungsaufträge aus dem letzten Audit wurden umgesetzt. Die CI ist nun vollständig (Lint + Audit + Tests), die Dokumentation ist konsistent mit der Realität, und die Workspace-Hygiene wurde deutlich verbessert.

| Bereich | Status |
|---|---|
| Lint (`bun run lint`) | ✅ 0 Errors, 0 Warnings (unused imports fixed) |
| Tests (`bun run test`) | ✅ 49/49 grün — CI integriert |
| Security (`bun audit`) | ✅ keine kritischen Findings |
| fallow Maintainability | ✅ 92.5 (good) · ⚠️ False-positive class-member issues ignored |
| Doku-Aktualität | ✅ README + CELLAR-CANVAS.md aktuell, alle COMPONENT.md vorhanden |
| Workspace-Hygiene | ✅ deps deklariert, configs entwirrt, .gitignore aktuell |

---

## Erledigte Handlungsaufträge

### Prio 1 — CI & Basis-Hygiene ✅

- **Vitest in die CI aufgenommen:** `ci.yml` führt nun `bun run test` als Pflicht-Gate aus.
- **README.md repariert:** Links korrigiert, Pfade aktualisiert, Komponenten-Anzahl korrigiert.
- **`.playwright-mcp/` ignoriert:** Tool-Artefakte via `.gitignore` ausgeschlossen.
- **Unused Imports fixet:** Lint-Warnings in Storefront-Tests behoben.

### Prio 2 — Dokumentations-Schulden ✅

- **CELLAR-CANVAS.md aktualisiert:** Abhängigkeiten (fabric v7, dnd-kit, motion) und Phasen-Status an Ist-Stand angepasst.
- **dnd-kit in Capability-Table:** `@dnd-kit` als Standard für Drag & Drop in `ARTELIER.md` hinterlegt.
- **Fehlende COMPONENT.md nachgezogen:** Doku für `atelier`, `color-swatch`, `hotkeys`, `i18n`, `language-switcher` und `stack-order-controls` erstellt.

### Prio 3 — Workspace-Hygiene & Tech-Debt ✅

- **FabricBridge-Analyse:** Ungenutzte Member verifiziert. Da Aufrufe über Refs erfolgen, wurden sie mit `// fallow-ignore-next-line` markiert, um False-Positives zu vermeiden.
- **Playwright-Entwirrung:** Tests in `e2e/showcase` und `e2e/vendure` separiert, eigene Configs erstellt und `test:e2e:vendure` Script ergänzt.
- **Unlisted Dependencies:** `embla-carousel-react` und `@testing-library/react` in die jeweiligen `package.json` aufgenommen.
- **Fallow-Suppressions:** Formatierung der Ignore-Kommentare korrigiert.
- **Compose-Konvention:** `docker-compose.yml` zu `compose.yaml` umbenannt.

---

## Verbleibende Beobachtungspunkte (kein Sofort-Handeln)

- **Version-Drift:** Beim nächsten großen Update-Zyklus die Vite/Tailwind-Versionen zwischen Workspaces angleichen.
- **Complexity-Hotspots:** `password-setup` und `jelly-button` bei zukünftigen Features ggf. modularisieren.
- **Uncommitted Work:** Vor dem Start neuer Features sicherstellen, dass alle lokalen Änderungen am `CellarCanvas` committet sind.
