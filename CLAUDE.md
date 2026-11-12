# Components (AtelierUI) - Claude Instructions

Komponentenbibliothek „AtelierUI" für Buchart58 und verwandte Projekte: React-19-Komponenten unter `components/`, dazu Showcases zum Ausprobieren und eine Vendure-Shop-Demo. Buchart58 kopiert Komponenten ins eigene Repo statt sie als Paket zu beziehen, Änderungen hier kommen dort also nicht von selbst an.

Hier stehen Regeln, nicht ihre Geschichte. Begründungen und Bug-Verlauf einer Komponente stehen in ihrer `COMPONENT.md` bzw. `STATUS.md`, die Entstehung im git log.

**Zuerst lesen:** [KNOWN-ISSUES.md](KNOWN-ISSUES.md). Entscheidungen, offene Fragen und Annahmen sofort dort eintragen (Subagenten: im Bericht melden, nicht selbst eintragen), Übergabe am Sessionende: Skill session-handoff.

## Ziel

Entscheidung (User, 2026-11-12): Das erste Ziel war die Komponentenbibliothek. **Das aktuelle Ziel sind die Sections im `section-showcase`.** Die Familie Buchart (Weingut Buchart 58, Sooss) bekommt dort eine Auswahl an Section-Varianten und stellt ihre Website selbst zusammen: je Section eine Variante per Herz wählen, die Reihenfolge festlegen, die fertige Seite unter `/preview?s=…` als Link teilen. Jede Variante muss deshalb als echte Option für ihre Website taugen, nicht nur als Technik-Demo.

- **Gestaltung:** hochwertig, entweder schlicht oder cinematisch (Beispiel für cinematisch: Hero „Flaschenbühne (3D)“). Bisheriger Favorit des Users ist der Hero „Maison Editorial“ (`section-showcase/src/sections/hero/HeroV6.tsx`), ergänzt um kleine Easter Eggs und sehr viele Microinteractions.
- **Texte** sind ein eigenes Thema und werden getrennt erarbeitet. Bekannte Platzhalter und die belegten Fakten zum Weingut: `KNOWN-ISSUES.md` #3.
- **Wozu die Website dient** (vier Säulen: Weinshop, Events, Rebstockmiete, Etiketten-Designer): `../Buchart58/vault/BIG-PICTURE.md`.

## Stack

- React 19 mit React Compiler, Tailwind v4, `motion/react`, Ark UI, TanStack (Query, Form, Table, Hotkeys), Vite 8, Bun-Workspaces. Astro nur in `vendure-showcase/storefront`.
- Welche Lib für welche Capability: Skill `artelier`. Zusätzlich gilt hier: Drag & Drop/Sortable mit `@dnd-kit` (nicht motion `Reorder.Group`, nicht `react-dnd`), GraphQL-Transport mit `graphql-request`, der Editor-State von `cellar-canvas` mit `zustand`, 3D-Szenen mit `three` + `@react-three/fiber` (immer per `lazy()` laden, Referenz: `components/bottle-stage/`; reine Shader-Flächen ohne Lib wie `shader-backdrop` und `light-rays`).
- Verboten, weil die Capability schon besetzt ist: `urql`/`@urql/*`, `swr`, `apollo-client` (→ TanStack Query), `@radix-ui/*`, `@headlessui/*`, shadcn (→ Ark UI), `framer-motion`, `gsap` (→ `motion/react`), `react-dnd`, motion `Reorder.Group` (→ `@dnd-kit`). Ein Teil davon warnt zusätzlich über `no-restricted-imports` in `eslint.config.js`.
- Shop-Backend ist Vendure (GraphQL). Medusa ist abgelöst, dafür keine APIs oder Muster vorschlagen.

## Code-Landkarte

- **`components/<name>/`** — die Komponenten, je mit `COMPONENT.md`; Übersicht in `components/COMPONENTS-OVERVIEW.md`. Gemeinsames in `components/lib/` (`cn()`, `useDeviceCapabilities`), `components/i18n/` und `components/atelier/` (`AtelierProvider`). Import-Alias `@components/…`.
- **`components-showcase/`** — Vite-SPA mit Demos aller Komponenten. `src/styles.css` ist die Quelle der Theme-Tokens.
- **`section-showcase/`** — Vite-SPA für Seiten-Sections und ihre Komposition.
- **`launcher/`** — Einstiegsseite, verlinkt Showcases und Shop.
- **`vendure-showcase/`** — `server/` (Vendure 3.8, eigenständig, kein Bun-Workspace) und `storefront/` (Astro, Produkte build-time). Architektur und Styling in den `.md`-Dateien dort.
- **`e2e/`** — Playwright: `showcase` (`bun run test:e2e`), `mobile` (`bun run test:mobile`) und `vendure` (`bun run test:e2e:vendure`, braucht einen erreichbaren Vendure-Server).
- **`bun run build:all`** baut Launcher, beide Showcases und die Storefront nach `dist/` (Netlify). Die Storefront zieht dabei die Weine vom Vendure-Server auf dem VPS.
- **`KNOWN-ISSUES.md`** — bekannte, bewusst offene Probleme mit Ursache und Lösungsvorschlag; Behobenes dort löschen.
- **`CELLAR-CANVAS.md`** — Vision und Entscheidungs-Log des Etiketten-Designers; der Stand steht in `components/cellar-canvas/COMPONENT.md` und `STATUS.md`.

## Komponenten-Regeln

Die Regeln für Komponenten-Code stehen in `COMPONENT-GUIDELINES.md`. Sie laden über `.claude/rules/` automatisch, sobald React-Code in `components/`, den Showcases, dem Launcher oder der Storefront gelesen oder bearbeitet wird (Pfade im Frontmatter der Datei). Neue Komponente anlegen oder eine Vorlage aus einer fremden Lib übernehmen: Skill `new-component`.

## Arbeitsweise

- Mehrstufige Arbeiten (Migration, Phasen) bekommen einen Commit pro logischem Schritt, damit sich jeder einzeln reviewen und zurücknehmen lässt. Committet wird erst, wenn der User die Änderung gesehen und den Commit angestoßen hat.
- Vor jedem Commit den Skill `components-verify` durchlaufen; die CI (`.github/workflows/ci.yml`) prüft dasselbe und wird sonst rot.
- Den Dev-Server startet der User selbst. Braucht eine Prüfung einen laufenden Server (z. B. Storefront-Build gegen die Shop-API): ansagen, als Hintergrund-Task starten, prüfen, genau diesen Task sofort wieder beenden und per `lsof -i :<port>` bestätigen, dass der Port frei ist. Kein `pkill -f vite` o. Ä.: Ein breites Muster trifft auch Server, die der User oder eine andere Session gestartet hat. Visuelle Checks sonst als Liste an den User geben.
- Die Design-Richtung steht unter „Ziel“. Den Skill `frontend-design` nur laden, wenn der User ausdrücklich eine neue Gestaltungsrichtung erarbeiten will.
