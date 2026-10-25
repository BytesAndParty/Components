---
name: playwright-test
description: Cached reference for `@playwright/test` — the E2E test-runner package (assertions, fixtures, parallelization), distinct from the bare `playwright` browser-automation package. Load before setting up Playwright E2E tests, writing `test()`/`expect()` assertions, or deciding whether a task needs `@playwright/test` vs. bare `playwright`.
---

## Was dieser Skill ist

Gecachte Referenz für den Playwright **Test-Runner** (`@playwright/test`) — nicht zu verwechseln mit dem bare `playwright`-Paket, das nur Browser-Steuerung ohne Test-Runner/Assertions liefert (richtig für Skripte wie Screenshot-Automatisierung, falsch für echte E2E-Test-Suiten mit CI-Reports).

Vor jeder Entscheidung „brauche ich hier einen Test oder nur Browser-Steuerung" den Gotchas-Abschnitt in `reference.md` lesen.

## References

- `reference.md` — Quick Reference (Setup, CLI), Requirements, Gotchas (`@playwright/test` vs. bare `playwright`), Minor-Historie bis 1.63 (Test Locks, `locator.visible()`, `ariaSnapshotJSON()`).

## Notes

- Gecachter Snapshot, Stand siehe `reference.md`-Kopfzeile. Bei Verdacht auf Veraltung: neueste veröffentlichte Version per `bun info @playwright/test version` prüfen, die im Projekt installierte steht in `node_modules/@playwright/test/package.json` (Feld `version`).
- Master-Quelle ist `__AI-Workflow__/skills/live-docs-collection/playwright-test/playwright-test.md`, gepflegt über `/live-docs-update`.
- Nutzt ein Projekt nur das bare `playwright`-Paket (kein `@playwright/test` in den Dependencies), ist dieser Skill nur für den Gotchas-Abschnitt relevant — nicht die volle Test-Runner-API adoptieren, ohne dass sie gebraucht wird.
