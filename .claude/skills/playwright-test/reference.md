> Generiert aus der live-docs-collection (skills/live-docs-collection/playwright-test/playwright-test.md) am 2026-09-16. Master-Quelle ist dort gepflegt (`/live-docs-update`) — bei Zweifel an der Aktualität zuerst dort nachsehen und diese Datei danach neu generieren, nicht von Hand nachziehen.

# Playwright Test

## Quick Reference

```bash
bun create playwright   # interaktives Setup: TS/JS, Test-Ordner, GitHub-Actions-Workflow, Browser-Install
```

Erzeugt `playwright.config.ts` (Browser/Projects, Timeouts, Retries, Reporter) + `tests/`-Ordner.

```ts
import { test, expect } from '@playwright/test'

test('Startseite zeigt Titel', async ({ page }) => {
  await page.goto('https://example.com')
  await expect(page).toHaveTitle(/Example/)
})
```

**CLI:**
- `playwright test` — Headless, parallel über konfigurierte Browser.
- `playwright test --ui` — UI-Mode zum Debuggen/Watch.
- `playwright test --headed` — mit sichtbarem Browser-Fenster.
- `playwright show-report` — HTML-Report öffnen.

**Requirements:** Node 22.x/24.x/26.x.

## Neu in 1.63.0 — was tatsächlich Arbeit spart

- **Test Locks** — Tests können benannte Locks deklarieren (`test.describe.configure` o. Ä.); Tests mit
  demselben Lock laufen nie gleichzeitig, alles andere weiter parallel. Ersetzt das bisherige
  Grobwerkzeug `fullyParallel: false`/serielle Projects, wenn nur **eine** gemeinsame Ressource
  (z. B. eine Test-DB) geschützt werden muss, statt gleich die ganze Suite seriell zu fahren.
- **`locator.visible()`** — neue Methode als Ersatz für das `:visible`-CSS-Pseudo-Selektor-Pattern,
  direkt als Locator-Assertion nutzbar.
- **`page.frameLocator()` ohne Selector** — sucht jetzt über alle Frames der Seite, statt vorher
  jeden Frame einzeln adressieren zu müssen.
- **`locator.ariaSnapshotJSON()` / `page.ariaSnapshotJSON()`** — strukturierte JSON-Ausgabe statt
  der bisherigen YAML-Textform, einfacher programmatisch zu vergleichen.
- **Perfetto-Reporter** — eingebauter Reporter für Timeline-Visualisierung in der Perfetto-UI,
  kein externes Trace-Tooling mehr nötig für Timing-Analysen.
- **`--add-reporter`** — Reporter werden gestackt statt ersetzt; bisher musste `reporter` in der
  Config komplett überschrieben werden, um einen zusätzlichen Reporter für einen einzelnen Lauf
  reinzunehmen.
- `npx playwright install --no-remove` behält Browser anderer Playwright-Installationen, statt sie
  zu entfernen.

## Gotchas

- **`@playwright/test` (Test-Runner) ≠ `playwright` (bare Browser-Automation).** Das bare `playwright`-Paket liefert nur Browser-Steuerung ohne Test-Runner/Assertions/Parallelisierung — richtig für Skripte wie einen Screenshot-Task (`scripts/screenshot.mjs`), aber kein Ersatz für `@playwright/test`, sobald echte E2E-Test-Assertions/CI-Reports gebraucht werden. Beide können nebeneinander im selben Projekt existieren, sind aber unterschiedliche Capabilities.
- `page`-Fixture wird pro Test automatisch bereitgestellt (isolierter Browser-Context) — nicht manuell einen Browser starten.
