<!-- AUTO-GENERATED — edit shared/base/AGENTS.base.md or AGENTS.local.md, not this file -->

# Workspace Instructions

Always read and apply the following shared guidelines:

## Karpathy-Inspired Coding Guidelines

# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.
- Don't extract a condition into a named bool local used only once or twice - inline it (`if (x == null)` beats `bool isNull = x == null; if (isNull)`). Name it only when the condition is complex/long or reused 3+ times.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

Never edit auto-generated code (codegen output, `_Generated*` files, generator headers, etc.). If a task would require changing generated code, stop and describe what needs to change at the generator/source level instead - let the user decide, since manual edits get silently lost on the next generator run. Finish the rest of the task normally.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

**Never create new tests on your own initiative.** The examples above describe the verification loop for when tests are already part of the task or have been explicitly approved - don't add a test file or test project unilaterally just because it would be good verification. If you think tests are warranted, say so and ask; only write them after an explicit yes. Verify against existing tests, manual checks, or compilation/build success instead when tests haven't been approved.

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

## Container Runtime Preference

# Container Runtime Preference

**Podman > Docker** — projektübergreifend, ausnahmslos. Standard für lokale Container, Compose-Files,
Beispielbefehle, Anleitungen, neue Setups. Image-Refs voll qualifizieren (`docker.io/library/...`),
damit Podman ohne `unqualified-search-registries`-Konfig funktioniert. `docker-compose.yml` heißt
`compose.yaml`. Wenn ich „Docker" sage, ist trotzdem Podman gemeint — direkt umsetzen, nicht nachfragen.

## Artelier Guidelines

# Artelier Guidelines

## Linting & Code Quality
Jedes Frontend-Projekt verwendet ESLint (Flat Config, v9+) mit:

- **`eslint-plugin-react-hooks`** — Rules of Hooks + `react-compiler` Rule (deckt Code auf, den der React Compiler nicht optimieren kann: Mutationen im Render, Side-Effects außerhalb Effects, Ref-Zugriffe im Render).
- **`eslint-plugin-react-refresh`** — HMR-Safety: nur Components/Hooks aus Component-Dateien exportieren.
- **`typescript-eslint`** — TS-aware Rules (Type-Imports, ungenutzte Vars, `any`-Eskalation, exhaustive switch).

Standard: `eslint.config.js` mit diesen drei Plugins, `bun lint` Script, CI-Integration. Pre-commit über `lint-staged` empfohlen. Wenn TanStack Query im Projekt ist, zusätzlich `@tanstack/eslint-plugin-query` (exhaustive Query-Keys u. Ä.).

**Lint-clean als Gate:** 0 ESLint-Fehler vor jedem Commit. `exports`/`types`/`class-members`-Findings von Dead-Code-Tools (siehe `fallow` unten) dürfen >0 bleiben, solange jeder Fall bewusst als Library-API/WIP bestätigt ist — aber Lint-Fehler selbst sind kein akzeptierter Zustand.

## Type-Safety & React-Standards

- **Kein `any` ohne Begründung.** Typsicherheit ist der Grund, TypeScript überhaupt einzusetzen — ein unbegründetes `any` untergräbt genau das. Wenn ein Typ wirklich nicht sauber modellierbar ist, kurzer Kommentar warum, nicht stillschweigend `any`.
- **Kein manuelles `useMemo`/`useCallback` ohne nachgewiesenen Grund.** React Compiler übernimmt Memoization automatisch (siehe Dependency-Modernization-Tabelle unten). Manuelles Memoizing ist meist entweder ein Zeichen, dass der Compiler wegen eines Rules-of-React-Verstoßes nicht greift (den Verstoß fixen, nicht drumherum memoizen), oder schlicht unnötiger Code.
- **Eine Quelle der Wahrheit für Typen.** Keine doppelten Typdefinitionen für dieselbe Datenform (z. B. ein Zod-Schema *und* ein separat gepflegtes TS-Interface für dieselben Daten) — den abgeleiteten Typ referenzieren (`z.infer<...>` o. Ä.), nicht duplizieren. Divergiert sonst unbemerkt bei der nächsten Änderung.

## Standard-Tooling

Bei neuer Lib-Adoption zuerst prüfen, ob die Capability hier schon eine Antwort hat — „eine Capability → genau eine Lib", sonst wird Redundanz zum Wartungsproblem statt zur bewussten Wahl. Bun (Package-Manager) und Podman (Container-Runtime) haben eigene Guideline-Dateien und stehen deshalb nicht nochmal hier.

| Capability | Standard | Vermeiden |
|---|---|---|
| Headless UI | Ark UI (`@ark-ui/react`) | Radix UI, Headless UI, shadcn |
| Animation | `motion/react` (bzw. `motion` vanilla außerhalb React) | framer-motion, gsap |
| Memoization | React Compiler | manuelles `useMemo`/`useCallback` |
| Server-State + Caching | TanStack Query | urql, swr, apollo-client |
| Data Grid/Table | `@tanstack/react-table` | eigene Sortier-/Filter-Logik von Hand |
| Formulare | `@tanstack/react-form` | react-hook-form, Formik |
| Keyboard Shortcuts | `@tanstack/react-hotkeys` | eigene `keydown`-Listener für mehr als 1-2 einfache Fälle |
| Unit-/Component-Tests | Vitest + Testing Library | Jest |
| E2E-Tests | Playwright | Cypress |
| Dead-Code/Duplikate | fallow | knip + jscpd separat |
| CSS | Tailwind v4 (`@theme`-Block, oklch-Tokens) | — |

Default, kein Zwang — ein Projekt mit begründetem abweichenden Bedarf weicht ab, dokumentiert das Warum aber im Projekt-`CLAUDE.md` statt es stillschweigend anders zu machen.

## Documentation Lifecycle
- **live-docs-collection** = Single Source of Truth: `/Users/robert.stickler/Development/__AI-Workflow__/skills/live-docs-collection`
- Bei jeder Task: aktuelle Versionen aus `package.json` checken → Change-Notes der neuen Versionen fetchen → in live-docs-collection ablegen → von dort konsumieren.
- Fehlt Doku oder ist veraltet → erstellen / aktualisieren, nicht umgehen.

## Engineering Discipline
- **Surgical Changes** — keine ungefragten Drive-by-Refactorings.
- **Iterative Refactoring** — wenn ein Ansatz scheitert: sauber zurücksetzen oder refactoren, *nicht* drüber patchen.

## Personal Instructions

# Personal Instructions — flame007

## Package Manager

**Bun first** — `bun` für Installation, Scripts und Runtime. Kein `npm`, kein `yarn`, kein `pnpm` außer explizit anders angegeben.

## AI in Commit-Messages

**Keine AI-Spuren in Commit-Messages** — die Regel gilt ausschließlich für Commit-Messages (Titel + Body):
- Keine "Co-Authored-By"-Trailer, kein "Generated with Claude Code" o. Ä.
- Keine Erwähnung von AI-, Claude- oder Assistant-Beteiligung
- Die Message soll so klingen, als hätte der User sie selbst geschrieben

Der **Repo-Inhalt** ist davon nicht betroffen: AI-Tool-Dateien (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`,
`.claude/`, `.agents/`, `.gemini/` etc.) dürfen committet werden, wenn sie zur Aufgabe gehören.
Code, Kommentare, Doku und Testdaten unterliegen keiner AI-Einschränkung.
*(Geändert 2026-09-23 — vorher "Zero AI Footprint" für das gesamte Repo.)*

## Kein automatischer Push

**Nie von selbst `git push`** — unabhängig vom Tool und unabhängig davon, ob vorher schon committed wurde. Push nur nach expliziter Aufforderung durch den User (z. B. via `/commit-push` oder direkter Ansage). Ein freigegebener Plan oder ein freigegebener Commit ist keine Freigabe für den Push.

## Umlaute

# Umlaute

Umlaute (ä, ö, ü, ß) müssen immer normal verwendet werden. Keine ASCII-Ersatzschreibweisen wie "ae", "oe", "ue", "ss" erzwingen. Gilt für Commit-Messages, Kommentare, UI-Texte, Dokumentation und Chat-Antworten an den User.

Gilt ausdrücklich auch für Inhalte, die über Skripte/Tools erzeugt werden (z. B. Excel-/Office-Zellinhalte und -Kommentare via openpyxl, generierte Reports, CSV-Exporte) und für Text innerhalb von Heredocs/Skript-Strings – dort keine ASCII-Ersatzschreibweisen aus Vorsicht vor Encoding-Problemen verwenden, UTF-8 ist Standard und funktioniert.

**Was "ASCII-only" in Projektregeln praktisch bedeutet:** Fast immer sind damit *typografische Unicode-Sonderzeichen* gemeint – En-/Em-Dash (– —), Pfeile (→ ← ↔), Ellipse (…), typografische Anführungszeichen („ " ‚ ') und Emojis –, weil die in Logs, Konsolen und Diff-Ansichten Encoding-Probleme verursachen. Umlaute sind davon in aller Regel **nicht** betroffen. Bevor eine ASCII-only-Regel angewendet wird: die Projektregel tatsächlich lesen und prüfen, ob ä/ö/ü/ß dort ausdrücklich als verboten aufgeführt sind. Steht das nicht da, werden Umlaute normal geschrieben. Beispiel Avanade.Falstaff.Core – die Regel heißt dort wörtlich "Deutsche Umlaute verwenden - verboten sind nur typografische Sonderzeichen".

**Wichtig, falls ein Projekt eine ASCII-only-Regel hat:** Solche Regeln (z.B. "keine Sonderzeichen in Code und Kommentaren") beziehen sich ausschließlich auf Quellcode-Dateien (Strings, Code-Kommentare, Trace-/Log-Ausgaben) – niemals auf Chat-Antworten, Ticket-/PR-Texte oder eigenständige Markdown-Dokumentation (z.B. Progress-Dateien). Diese Regel hier hat dort immer Vorrang. Die Kurzformel "Code-Datei → ASCII, Chat/`.md` → Umlaute" ist **falsch** und darf nicht als Faustregel verwendet werden: auch in `.cs`-Dateien werden Umlaute normal geschrieben, solange die Projektregel sie nicht ausdrücklich verbietet – verzichtet wird dort nur auf die typografischen Sonderzeichen aus dem vorigen Absatz. Den bestehenden Code-Stil eines Projekts bei tatsächlichem Code trotzdem respektieren (Surgical Changes).

**Kein Ableiten aus Bestandscode:** Vorhandene ASCII-Ersatzschreibweisen in benachbarten Dateien sind *keine* Projektregel. "Bestehenden Code-Stil respektieren" greift ausschließlich, wenn eine ASCII-only-Vorgabe ausdrücklich dokumentiert ist (CLAUDE.md, AGENTS.md o. ä.). Fehlt eine solche Vorgabe, gilt der Standard aus dem ersten Absatz: selbst neu geschriebener deutscher Text bekommt echte Umlaute – auch in Code-Kommentaren und Strings. Im Zweifel Umlaute verwenden und kurz nachfragen, statt stillschweigend auf ASCII auszuweichen.

**Umgekehrter Fall – Projekt erlaubt/verlangt Umlaute explizit auch in Code:** Steht das explizit in den Projektinstruktionen (z.B. AGENTS.md: "Umlaute in Code, Strings und Kommentaren sind korrekt und erwünscht"), hat das Vorrang vor "bestehenden Code-Stil respektieren" – die explizite Projektregel schlägt eine nur implizit aus alten Dateien abgeleitete Konvention. Neue Kommentare/Strings/Exception-Messages, die man selbst schreibt, dann mit echten Umlauten schreiben, auch wenn benachbarte/bestehende Code-Stellen noch ASCII-Ersatzschreibweisen verwenden. Bestehende ASCII-Stellen nicht drive-by mitkorrigieren (Surgical Changes bleibt bestehen) – nur was man selbst neu schreibt.

## Git Worktrees pro Session

# Git Worktrees pro Session

**Neue Claude-Code-Session auf einem Projekt-Repo → eigener Git-Worktree**, sobald plausibel
mehrere Sessions/Chats parallel auf demselben Repo laufen könnten. Verhindert, dass sich
unfertige Änderungen aus verschiedenen Chats gegenseitig überschreiben oder denselben Branch
blockieren.

**Wann anwenden:**
- Zielverzeichnis ist ein Git-Repo (`git rev-parse --is-inside-work-tree`).
- Es ist plausibel, dass parallel eine weitere Session/ein weiterer Chat auf demselben Repo
  arbeitet (typisch bei mehreren offenen Claude-Code-Tabs/-Fenstern).

**Wie:**
- Vor dem Anlegen kurz beim User nachfragen (z. B. "Läuft parallel evtl. noch eine andere
  Session auf diesem Repo? Dann lege ich einen eigenen Worktree an.") — nicht stillschweigend
  anlegen, auch wenn die Bedingung oben plausibel erscheint.
- Nach Bestätigung einen dedizierten Worktree als Sibling-Ordner anlegen, z. B.
  `git worktree add ../<repo>-session-<kurzbeschreibung> -b session/<kurzbeschreibung>`.
- In diesem Worktree arbeiten, committen, pushen — das Haupt-Repo bleibt auf seinem Branch
  unberührt.
- Nach Abschluss: Branch mergen (PR oder direkt), dann `git worktree remove <pfad>` —
  Worktrees nicht anhäufen lassen.

**Nicht anwenden, wenn:**
- Nur eine Session gleichzeitig auf dem Repo aktiv ist (Single-Chat-Workflow) — dann ist der
  Worktree reiner Overhead ohne Nutzen.
- Das Zielverzeichnis noch kein Git-Repo ist — vorher klären, ob `git init` gewünscht ist.

---

<!-- Project-specific instructions are appended below by sync-agents -->


---

## Project-Specific Instructions

# __Components__ Project Context

Enterprise Design Engine — component library for BuchArt58 and related projects.

## Stack

- React 19 + React Compiler (no manual useMemo/useCallback)
- TanStack Query (server-state), TanStack Form, TanStack Table
- Ark UI for headless components (no Radix, no shadcn)
- motion/react for animations (no framer-motion)
- Astro for static pages, Vite for components

## Priorities

- A11y first — 100% keyboard navigable, correct ARIA, WAI-ARIA patterns
- Capability overlap forbidden — one responsibility, one library (see ARTELIER.md)
- Every component gets a COMPONENT.md

## Forbidden imports (enforced via eslint no-restricted-imports)

urql, @urql/*, swr, apollo-client, @radix-ui/*, @headlessui/*, framer-motion, gsap
