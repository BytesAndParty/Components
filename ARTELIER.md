# Artelier — Project-Specific Guidelines

> Global guidelines (bun, karpathy, AI stealth, ESLint stack) live in AI-Workflow/shared/guidelines/.
> This file contains only __Components__-specific rules.

## Documentation Lifecycle

- **Component Documentation (`COMPONENT.md`):** Jede Komponente im `components/` Verzeichnis führt eine eigene `COMPONENT.md`:
  - **Features:** Was kann die Komponente?
  - **How It Works:** Architektur-Entscheidungen (z.B. Fabric-Bridge, Zustand-Store).
  - **Props:** Tabellarische Übersicht aller Properties mit Default-Werten.
  - **Usage:** Code-Beispiele für verschiedene Use-Cases (Showcase vs. Integration).
  - **Dependencies:** Liste der benötigten npm-Pakete.
- **Status Log (`STATUS.md`):** Optional für komplexe Komponenten — laufende Bugs, Workarounds, technisches Entscheidungs-Log getrennt von stabiler Doku.

## Dependency Modernization

- **Newest-First:** Bei jeder Lib-Adoption die aktiv gepflegte Variante wählen (z.B. `motion` statt `framer-motion`, `@lottiefiles/dotlottie-react` statt `lottie-web`).
- **Replace, don't patch:** Stagnierende Libs mit Eval-Use, CSP-Inkompatibilität oder Single-Maintainer-Risk werden ersetzt.
- **Dead-Code-Audit:** Bei jedem Touch eines Workspaces `package.json` gegen `grep`-Imports prüfen — ungenutzte Deps entfernen.
- **Docs-Cache:** Vor einer Migration offizielle Doku der Ziel-Lib in `live-docs-collection/<lib>/` ablegen (mit `verified`-Datum + Source-URL). Beim Coden gegen diesen Cache arbeiten.
- **Capability-Overlap-Audit:** Zwei genutzte Deps dürfen nicht dieselbe Verantwortung doppelt besetzen. Regel: **eine Capability → genau eine Lib.**

### Capability Table

| Capability | Gewählt | Verboten |
|---|---|---|
| Server-State + Caching | TanStack Query | urql, @urql/*, swr, apollo-client |
| GraphQL-Transport | graphql-request | — |
| Headless UI | Ark UI (`@ark-ui/react`) | @radix-ui/*, @headlessui/*, shadcn |
| Animation | motion/react | framer-motion, gsap |
| Drag & Drop / Sortable | @dnd-kit | motion Reorder.Group, react-dnd |
| Memoization | React Compiler | manuelles `useMemo`/`useCallback` |

Die „verboten"-Spalte ist in `eslint.config.js` als `no-restricted-imports` hinterlegt.
