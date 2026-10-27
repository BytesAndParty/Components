> Generiert aus der live-docs-collection (skills/live-docs-collection/tanstack-hotkeys/tanstack-hotkeys.md) am 2026-10-26. Master-Quelle ist dort gepflegt (`/live-docs-update`) — bei Zweifel an der Aktualität zuerst dort nachsehen und diese Datei danach neu generieren, nicht von Hand nachziehen.

# TanStack Hotkeys (React)

> **0.11 → 0.13 (2026-10-05):** gegengeprüft, **für den React-Adapter nichts Neues**. `@tanstack/react-hotkeys@0.13.0`
> ist ein Lockstep-Release aller Adapter (Hinweis im Changelog: „release all Hotkeys adapters and devtools packages
> together as minor versions"), der Inhalt betrifft Alpine/Ember/Octane-Adapter, Ember-Modifier
> (`onHotkey`/`onHotkeys`) und Angular-/Svelte-Devtools. Allgemein dazu: reaktive Option-Getter und „live recorder
> options". Ob letztere im React-Adapter etwas ändern, steht im Changelog nicht — vor Nutzung im Rebind-UI gegen die
> aktuelle Doku prüfen. `@tanstack/hotkeys` (Core) bleibt laut Release-Notes bei 0.11.0; 0.12.0 hat keinen eigenen
> sichtbaren Release-Eintrag. Alpha-Hinweis unten gilt unverändert.

**Status: Alpha — API laut offizieller Doku noch nicht stabil ("its API is still subject to change").** Vor Adoption in einem neuen Projekt bewusst abwägen, nicht blind als "Standard" ziehen — bei API-Brüchen zwischen Minor-Versionen rechnen.

## Quick Reference

- Zentraler `HotkeyManager` mit Per-Target-Listenern + Konflikterkennung.
- Hotkeys als typsichere Strings (`"Control+A"`, `"Mod+Shift+G"`) oder rohe `RawHotkey`-Objekte (seit 0.15 `RawHotkeyChord`).
- **`Mod`** = plattformübergreifend Cmd (macOS) / Control (Windows/Linux).
- Multi-Key-Sequenzen im Vim-Stil (`['G', 'G']`) mit konfigurierbarem Timeout.
- `ignoreInputs` hat einen **hotkey-abhängigen Default**: `true` für Einzeltasten und Shift/Alt-Kombis, `false` für Ctrl/Meta-Shortcuts und `Escape` (die feuern also auch im Textfeld). `preventDefault`/`stopPropagation` standardmäßig `true`.
- Key-Erkennung primär über `event.key`, Fallback `event.code` für Buchstaben/Ziffern bei Sonderzeichen-Layouts.
- State-Hooks: `useHeldKeys`, `useHeldKeyCodes`, `useKeyHold` für Live-Key-Monitoring.
- Framework-Adapter: React/Preact-Hooks, Solid-Primitives, Angular-Inject, Vue-Composables, Lit-Controller.
- Eingebaute Recording-Funktion (für Settings-UIs, in denen Nutzer eigene Shortcuts belegen) + Cheatsheet-Formatierung pro Plattform.

## Ohne Framework: `@tanstack/hotkeys` (Core)

Die React-Hooks sind nur ein Adapter; der Core (`@tanstack/hotkeys@0.9`, einzige Dependency `@tanstack/store`) läuft in reinem JS, z. B. in einem Astro-`<script>` ohne React-Insel. Auf dem Server liefert `register()` ein No-op-Handle (SSR-sicher).

```ts
import { getHotkeyManager, formatForDisplay } from '@tanstack/hotkeys'

const save = getHotkeyManager().register('Mod+S', () => saveDocument(), {
  meta: { name: 'Speichern', group: 'Datei' },
})
// Sequenz: seit 0.14 über denselben Manager, getSequenceManager() gibt es nicht mehr
const goTodo = getHotkeyManager().register(['G', 'T'], () => navigate('/todo'))

save.setOptions({ enabled: false }) // soft-disable, bleibt registriert
save.unregister()
formatForDisplay('Mod+S') // "⌘ S" auf macOS (mit Leerzeichen), "Ctrl+S" sonst
```

Selbst gegen Repo-Quellcode verifiziert 2026-09-23 (`packages/hotkeys/src/hotkey-manager.ts`, `sequence-manager.ts`), Anlass: Planung LevelMeUp.

Korrigiert 2026-10-26: Bis 0.13 lief die Sequenz über `getSequenceManager().register(['G', 'T'], …, { timeout: 1000 })`. Seit 0.14 ist der `SequenceManager` entfernt und die Sequenz wird über `getHotkeyManager().register([...])` registriert (siehe Abschnitt 0.12 → 0.17). Ob die `timeout`-Option dort gleich heißt, vor Nutzung prüfen.

## Praxis-Befunde

Selbst verifiziert 2026-09-23, Projekt LevelMeUp (Astro + ClientRouter, Core 0.9.0 in einem Astro-`<script>`, Playwright/Chromium):

- **Tasten aus dem DOM brauchen einen Cast.** `register()` erwartet den typisierten `Hotkey`, `formatForDisplay()` nimmt dagegen beliebige Strings. Liest man die Taste aus einem `data-*`-Attribut, bleibt nur `key as Hotkey`.
- **`register('?')` greift bei `Shift+/`**, man muss `Shift` nicht mit registrieren. **`Meta+1` löst `register('1')` nicht aus**, Modifier werden exakt gematcht, Browser-Tab-Kürzel bleiben also frei.
- **Ziffern in einem fokussierten `<input>` lösen nichts aus** (Default `ignoreInputs` für Einzeltasten), auch nicht in einem `showModal()`-Dialog.
- **Manager-Listener überleben ClientRouter-Seitenwechsel** (hängen an `document`). Seitenabhängige Kürzel deshalb bei `astro:page-load` über die gemerkten Handles abmelden und neu registrieren. Ohne Abmelden würde jeder Seitenwechsel dieselbe Taste noch einmal registrieren (Default `conflictBehavior: 'warn'`).

## 0.12 → 0.17 (Stand 2026-10-26)

Neueste Version: 0.17.0, weiterhin Alpha. Quelle: https://github.com/TanStack/hotkeys/releases

Neu:
- Scopes über `HotkeysProvider`.
- `defineAppHotkeys` und `useAppHotkeyList`: Hotkeys der App zentral definieren und als Liste abfragen.
- `formatForDisplay` (Cheatsheet-Formatierung, siehe auch 0.11 unten).

Breaking:
- 0.12: ESM-only, Node ≥ 20.
- 0.14: Typ `Hotkey` heißt `HotkeyChord`. Sequenzen laufen über `useHotkey` (React) bzw. `getHotkeyManager().register([...])` (Core), der `SequenceManager` ist entfernt. Der Cast aus den Praxis-Befunden lautet damit `key as HotkeyChord`.
- 0.15: `RawHotkey` → `RawHotkeyChord`, `parsedHotkey` → `parsedChord`.
- 0.17: Hints erscheinen nur noch für Hotkeys, die tatsächlich feuern würden.
- Zur Einordnung: 0.11 hatte `RawHotkey` bereits zur Union aus `key`- und `code`-Variante gemacht (siehe unten).

Capability-Überschneidung: Ark UI 5.39 bringt eine eigene `Hotkeys`-Komponente. Nach „eine Capability → eine Lib" ist zu entscheiden, welche der beiden ein Projekt nutzt; die Entscheidung ist noch offen.

## Neu in 0.11.0 — was tatsächlich Arbeit spart

- **`findHotkeyConflicts`** liefert eingebaute Kollisionserkennung inkl. Sequence-Prefix-Checks (z. B. `G` kollidiert mit `['G', 'G']`) — spart eine selbst geschriebene Registry-Prüfung für ein Settings-UI, in dem Nutzer eigene Shortcuts belegen.
- **Recorder-Optionen erweitert**: `recordBy` (`'code'` [Default] vs. `'key'`), `validate`, `detectConflicts`, `onReject` — ein Rebind-Feld mit Live-Validierung und Konfliktabweisung braucht keine eigene Wrapper-Logik mehr.
- **`formatForDisplay`** gibt jetzt `parts`, getrennte Modifier-/Key-Symbole, `keyLabels` und eine aufgelöste `layoutMap` zurück — Cheatsheet-Rendering (z. B. „⌘ + K" vs. „Ctrl + K" je Plattform) muss nicht mehr von Hand zusammengebaut werden.
- **Physische Bindings typisiert**: `Mod+[KeyS]` bzw. `{ code: 'KeyS', mod: true }` für layout-unabhängige Shortcuts (z. B. WASD-artige Positionsbindungen, die auf jedem Tastatur-Layout an derselben physischen Stelle sitzen).
- **`HotkeyMeta.group`** + `matchesHeldModifiers`/Shortcut-Hint-Helfer pro Framework-Adapter — Grundlage für eine gruppierte Shortcut-Übersicht („bei gehaltener Umschalttaste Hints einblenden") ohne eigene Held-Key-Logik.
- F1–F24, mehr benannte Tasten und Interpunktions-Shortcuts abgedeckt; diverse Fixes zu Tastatur-Layouts, macOS-Option-Taste, IME-Komposition und Numpad — weniger Edge-Case-Jagd bei internationalen Layouts.

**Breaking (nur relevant bei tatsächlichem Upgrade/Adoption):** `RawHotkey`/`ParsedHotkey` sind jetzt Unions aus `key`- oder `code`-Variante (Typ-Intersections statt `interface extends` nötig); Recorder nehmen standardmäßig physische Codes auf (`recordBy: 'key'` für logische Tasten explizit setzen); Clearing einer Aufnahme ruft nur noch `onClear`, nicht mehr `onRecord('')`.

## Gotchas

- **Alpha-Status ernst nehmen** — für ein kleines Projekt mit 1-2 einfachen Escape-Fällen ist die Komplexität (Manager + Registry + ggf. Provider) ohnehin meist unangemessen; die Instabilität kommt als zusätzliches Argument obendrauf, nicht als Ersatz für die Abwägung.
- Kein Basis-Usage-Beispiel auf der Übersichtsseite verfügbar — vor Einsatz die Framework-spezifische React-Doku-Unterseite konsultieren, nicht aus dieser Zusammenfassung ein Beispiel ableiten.
