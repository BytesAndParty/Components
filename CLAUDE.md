# Components (AtelierUI) - Claude Instructions

Komponentenbibliothek „AtelierUI" für Buchart58 und verwandte Projekte: React-19-Komponenten unter `components/`, dazu Showcases zum Ausprobieren und eine Vendure-Shop-Demo. Buchart58 kopiert Komponenten ins eigene Repo statt sie als Paket zu beziehen, Änderungen hier kommen dort also nicht von selbst an.

Hier stehen Regeln, nicht ihre Geschichte. Begründungen und Bug-Verlauf einer Komponente stehen in ihrer `COMPONENT.md` bzw. `STATUS.md`, die Entstehung im git log.

## Stack

- React 19 mit React Compiler, Tailwind v4, `motion/react`, Ark UI, TanStack (Query, Form, Table, Hotkeys), Vite 8, Bun-Workspaces. Astro nur in `vendure-showcase/storefront`.
- Welche Lib für welche Capability: Skill `artelier`. Zusätzlich gilt hier: Drag & Drop/Sortable mit `@dnd-kit` (nicht motion `Reorder.Group`, nicht `react-dnd`), GraphQL-Transport mit `graphql-request`, der Editor-State von `cellar-canvas` mit `zustand`.
- Verboten, weil die Capability schon besetzt ist: `urql`/`@urql/*`, `swr`, `apollo-client` (→ TanStack Query), `@radix-ui/*`, `@headlessui/*`, shadcn (→ Ark UI), `framer-motion`, `gsap` (→ `motion/react`), `react-dnd`, motion `Reorder.Group` (→ `@dnd-kit`). Ein Teil davon warnt zusätzlich über `no-restricted-imports` in `eslint.config.js`.
- Shop-Backend ist Vendure (GraphQL). Medusa ist abgelöst, dafür keine APIs oder Muster vorschlagen.

## Code-Landkarte

- **`components/<name>/`** — die Komponenten, je mit `COMPONENT.md`; Übersicht in `components/COMPONENTS-OVERVIEW.md`. Gemeinsames in `components/lib/` (`cn()`, `useDeviceCapabilities`), `components/i18n/` und `components/atelier/` (`AtelierProvider`). Import-Alias `@components/…`.
- **`components-showcase/`** — Vite-SPA mit Demos aller Komponenten. `src/styles.css` ist die Quelle der Theme-Tokens.
- **`section-showcase/`** — Vite-SPA für Seiten-Sections und ihre Komposition.
- **`launcher/`** — Einstiegsseite, verlinkt Showcases und Shop.
- **`vendure-showcase/`** — `server/` (Vendure 3.7, eigenständig, kein Bun-Workspace) und `storefront/` (Astro, Produkte build-time). Architektur und Styling in den `.md`-Dateien dort.
- **`e2e/`** — Playwright: `showcase` (`bun run test:e2e`), `mobile` (`bun run test:mobile`) und `vendure` (`bun run test:e2e:vendure`, braucht einen erreichbaren Vendure-Server).
- **`bun run build:all`** baut Launcher, beide Showcases und die Storefront nach `dist/` (Netlify). Die Storefront zieht dabei die Weine vom Vendure-Server auf dem VPS.
- **`CELLAR-CANVAS.md`** — Vision und Entscheidungs-Log des Etiketten-Designers; der Stand steht in `components/cellar-canvas/COMPONENT.md` und `STATUS.md`.

## Komponenten-Regeln

Die Regeln für Komponenten-Code stehen in `COMPONENT-GUIDELINES.md`. Sie laden über `.claude/rules/` automatisch, sobald React-Code in `components/`, den Showcases, dem Launcher oder der Storefront gelesen oder bearbeitet wird (Pfade im Frontmatter der Datei). Neue Komponente anlegen oder eine Vorlage aus einer fremden Lib übernehmen: Skill `new-component`.

## Arbeitsweise

- Mehrstufige Arbeiten (Migration, Phasen) bekommen einen Commit pro logischem Schritt, damit sich jeder einzeln reviewen und zurücknehmen lässt. Committet wird erst, wenn der User die Änderung gesehen und den Commit angestoßen hat.
- Vor jedem Commit den Skill `components-verify` durchlaufen; die CI (`.github/workflows/ci.yml`) prüft dasselbe und wird sonst rot.
- Den Dev-Server startet der User selbst. Braucht eine Prüfung einen laufenden Server (z. B. Storefront-Build gegen die Shop-API): ansagen, im Hintergrund starten, prüfen, sofort beenden (`pkill -f …`) und per `lsof -i :<port>` bestätigen, dass der Port frei ist. Visuelle Checks sonst als Liste an den User geben.
- Das Projekt hat keine eigene Design-Richtung. Den Skill `frontend-design` deshalb nur laden, wenn der User ausdrücklich eine Gestaltungsrichtung erarbeiten will.
