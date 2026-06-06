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

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

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

Standard: `eslint.config.js` mit diesen drei Plugins, `bun lint` Script, CI-Integration. Pre-commit über `lint-staged` empfohlen.

## Documentation Lifecycle
- **live-docs-collection** = Single Source of Truth: `/Users/robert.stickler/Development/__AI-Workflow__/Skills/live-docs-collection`
- Bei jeder Task: aktuelle Versionen aus `package.json` checken → Change-Notes der neuen Versionen fetchen → in live-docs-collection ablegen → von dort konsumieren.
- Fehlt Doku oder ist veraltet → erstellen / aktualisieren, nicht umgehen.

## Engineering Discipline
- **Surgical Changes** — keine ungefragten Drive-by-Refactorings.
- **Iterative Refactoring** — wenn ein Ansatz scheitert: sauber zurücksetzen oder refactoren, *nicht* drüber patchen.

## Personal Instructions

# Personal Instructions — flame007

## Package Manager

**Bun first** — `bun` für Installation, Scripts und Runtime. Kein `npm`, kein `yarn`, kein `pnpm` außer explizit anders angegeben.

## AI Anonymity

**Zero AI Footprint** — niemals Spuren von AI-Nutzung in Repos committen, außer explizit erwähnt:
- Keine "Co-Authored-By" Tags in Commit-Messages
- Keine AI-generierten Kommentare oder Signaturen im Code
- Keine Tool-Metadaten oder Prompt-Referenzen (`.agents/`, `.gemini/`, `.claude/`, etc.) committen
- Alle Änderungen sollen aussehen als wären sie direkt vom User geschrieben

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
