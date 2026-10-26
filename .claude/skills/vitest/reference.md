> Generiert aus der live-docs-collection (skills/live-docs-collection/vitest/vitest.md) am 2026-10-26. Master-Quelle ist dort gepflegt (`/live-docs-update`) — bei Zweifel an der Aktualität zuerst dort nachsehen und diese Datei danach neu generieren, nicht von Hand nachziehen.

# Vitest

Test-Runner auf Vite-Basis. Nutzt die bestehende Vite-Config (Plugins, Aliases) automatisch mit — kein separates Bundler-Setup nötig.

## Requirements

- **Vite ≥ 6.4.0, Node ≥ 22.12.0** (seit v5 — vorher Vite ≥ 6.0, Node ≥ 20). Ältere Versionen sind nicht nur ungetestet, sondern ausdrücklich unsupported.
- Läuft auch ohne lokale Installation via `npx vitest` / `bunx vitest`.
- Stand 2026-10-26 (Quelle: https://github.com/vitest-dev/vitest/releases): neueste Version 5.0.5. Genau deklariert sind Peer `vite ^6.4 || ^7 || ^8` und Node `^22.12 || ^24 || >=26`, ungerade Node-Majors (23, 25) liegen also außerhalb. 4.1.x wird weiter gepatcht (4.1.12 am 2026-10-15), wer noch nicht auf 5 umsteigen kann, bleibt damit nicht ohne Fixes.

## Quick Reference

```bash
bun add -D vitest
```

Config: liest `vite.config.*` automatisch mit; für Test-spezifische Settings (Environment, Setup-Files, Coverage) separate `vitest.config.ts`.

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',        // oder 'happy-dom', Default: 'node'
    setupFiles: ['./vitest.setup.ts'],
  },
})
```

Testdatei (muss `.test.` oder `.spec.` im Namen tragen):

```ts
import { expect, test } from 'vitest'
import { sum } from './sum'

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})
```

**Scripts:**
```json
{ "scripts": { "test": "vitest", "test:run": "vitest run" } }
```

- `vitest` (bzw. `bun run test`) — Watch-Mode (Default).
- `vitest run` — Einmal-Durchlauf, kein Watch (für CI).
- `vitest --coverage` — Coverage-Report.
- `vitest --ui` — Browser-UI zum Debuggen.

## Neu in 5.0 — was tatsächlich Arbeit spart

**`vi.when()` — Mocks pro Argument, ohne Handgeschriebenes.** Der größte Gewinn. Statt im Mock selbst nach Argumenten zu verzweigen:

```ts
// vorher: Bedingungslogik von Hand im Mock
findById.mockImplementation((id) => id === 1 ? Promise.resolve({ id: 1, name: 'Ella' }) : undefined)

// jetzt
vi.when(findById).calledWith(1).thenResolve({ id: 1, name: 'Ella' })
```

Vergleicht per Deep Equality und akzeptiert asymmetrische Matcher (`expect.any(String)`). Nimmt genau die Fummelei raus, für die man sonst pro Testfall eine eigene `mockImplementation` schreibt.

**Trace View für Browser-Tests.** Eingebauter Viewer, der einen Browser-Test nach dem Lauf Schritt für Schritt zurückspielt — jede Interaktion, Assertion und `page.mark` als DOM-Snapshot. Läuft in Browser-UI, Vitest UI und HTML-Report. Vor allem für CI-Fehlschläge, die sich lokal nicht reproduzieren lassen.

**Bessere Locator-Fehler.** Schlägt ein Locator im Browser-Mode fehl, zeigt Vitest den **ARIA-Accessibility-Tree** neben dem HTML — man sieht direkt, wogegen `getByRole`/`getByLabelText` matcht. Deutlich brauchbarer als rohes HTML.

**8–25 % schneller**, je nach Setup (am meisten in VM-Pools und Browser-Mode): geteilte Vite-Server für Inline-Projects, persistenter Dateisystem-Modul-Cache, schnellere Worker-Kommunikation. Ohne Zutun.

**Benchmarks als Fixtures** statt als eigener Modus — damit stehen Lifecycle-Hooks, Retries und Assertions auch dort zur Verfügung, und `bench.from()` vergleicht gegen eine gespeicherte Baseline.

**`expect.poll()` nimmt ein `AbortSignal`** und lehnt bei Timeout korrekt ab (statt weiterzulaufen).

## Migration Notes — v4 → v5 (Major, 2026-09)

**Das Wichtigste zuerst:** `clearMocks` ist jetzt **standardmäßig an** — die Call-History jedes Mocks wird vor jedem Test geleert. Tests, die sich auf über Testgrenzen hinweg akkumulierte Calls verlassen, brechen still im Verhalten, nicht beim Start. Alte Semantik: `clearMocks: false`.

**Entfernt / umbenannt:**

| Alt | Neu |
|---|---|
| `test.sequential` / `describe.sequential` | `{ concurrent: false }` |
| `bench()` auf Modulebene | `test()` mit destrukturierter `bench`-Fixture |
| `bench.skip` / `.only` / `.todo` | die entsprechenden `test`-Modifier |
| `benchmark.reporters` / `.outputFile` | `test.reporters` auf oberster Ebene |
| `benchmark.compare` / `--compare` | `bench.from()` in `bench.compare()` |
| Entry-Points `vitest/coverage`, `vitest/reporters`, `vitest/environments`, `vitest/snapshot`, `vitest/runners`, `vitest/suite` | ersatzlos entfernt |

`@vitest/runner` und `@vitest/expect` sind ins Hauptpaket eingezogen und werden nicht mehr separat publiziert.

**Verhaltensänderungen, die still Tests kippen können:**

- **Nicht awaitete asynchrone Assertions lassen den Test jetzt fehlschlagen**, statt implizit awaited zu werden. Das deckt echte Fehler auf, kann aber in Bestandssuites schlagartig viele Tests rot färben.
- `vi.mock()` / `vi.unmock()` / `vi.hoisted()` **außerhalb** des Modul-Top-Levels werfen jetzt einen Fehler, statt still nicht zu hoisten.
- `expect.poll()` schlägt fehl, wenn die Funktion nicht rechtzeitig auflöst (vorher: lief weiter).
- `toThrow("")` matcht wieder **jede** Fehlermeldung (Rückkehr zum Verhalten vor v4).
- `toHaveTextContent` ist **strikt** (exakte String-Gleichheit) — für die alte Teilstring-Semantik `toMatchTextContent`.
- `-t` matcht gegen den vollen Testnamen, verbunden mit `' > '` (`math > adds`) statt mit Leerzeichen. Muster, die über Segmentgrenzen laufen, greifen anders.
- Test-Name-Variable `$` enthält bei Strings keine Anführungszeichen mehr.
- Klassen-Mocks erben jetzt korrekt Prototyp-Methoden und funktionieren mit `instanceof`.
- Fake Timers mocken zusätzlich die `Temporal`-API.
- **Die Config-Suche geht nicht mehr in übergeordnete Verzeichnisse** — in Monorepos muss die Config dort liegen, wo sie gilt.

**Projects/Server:** Inline-Projects erben die Root-Config jetzt per `extends: true` (inkl. Vite-Plugins und Resolve-Aliases) und teilen sich standardmäßig den Vite-Server der deklarierenden Config (`sharedViteServer`). Abschalten mit `extends: false`.

**Coverage:** `include`/`exclude` erben **nicht mehr** von `test.include` — wer sich darauf verlassen hat, misst plötzlich anderes. `thresholds.perFile` nimmt jetzt auch Objekte.

**Ausgabe-Pfade konsolidiert** unter `.vitest/` (vorher verstreut): Attachments `.vitest/attachments/`, Blob `.vitest/blob/`, JSON/JUnit/HTML jeweils darunter. `.gitignore` prüfen — `.vitest-attachements/` (mit dem Tippfehler im alten Namen) kann raus.

**Sonstiges:** WebdriverIO-Paket entfernt. Vitest UI verlangt jetzt Token-Auth (`/__vitest__/` zeigt bis dahin einen Fehler; das Token druckt Vitest beim Start). Locators sind Objekte statt Strings, `locators.exact` im Browser-Mode default an. Fenster-Mutationen in happy-dom/jsdom sind jetzt erlaubt.

## Gotchas

- **Environment explizit setzen**, wenn DOM gebraucht wird (`environment: 'jsdom'`) — Default ist `'node'`, ohne DOM-Globals.
- **`include` deckt ab, was es soll.** Ein zu enges Glob (`["src/**/*.test.js"]`) sammelt eine neue `.test.tsx` **stillschweigend nicht** ein — `vitest run` meldet einfach weiter „alle grün". Nach jeder Erweiterung des Globs mit einem absichtlich fehlschlagenden Test gegenprüfen, dass die Datei überhaupt gefunden wird.
- Browser Mode (echter Browser statt jsdom/happy-dom) existiert als eigener Modus, separates Setup — nicht verwechseln mit dem Standard-jsdom-Weg.
- Für React-Component-Tests zusätzlich `@vitejs/plugin-react` in der Vite-Config und `@testing-library/react` (siehe eigener Eintrag `testing-library/`).
