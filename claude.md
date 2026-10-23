# Project Philosophy: Enterprise Design Engine

Dieses Projekt folgt der Vision einer **Enterprise Design Engine**. Wir setzen auf tiefe Integration modernster Tools, um maximale Qualität in Performance, Barrierefreiheit und Entwickler-Experience zu garantieren.

## 0. Projekt-Kontext

Enterprise Design Engine — component library for BuchArt58 and related projects.

### Stack

- React 19 + React Compiler (no manual useMemo/useCallback)
- TanStack Query (server-state), TanStack Form, TanStack Table
- Ark UI for headless components (no Radix, no shadcn)
- motion/react for animations (no framer-motion)
- Astro for static pages, Vite for components

### Priorities

- A11y first — 100% keyboard navigable, correct ARIA, WAI-ARIA patterns
- Capability overlap forbidden — one responsibility, one library (see ARTELIER.md)
- Every component gets a COMPONENT.md

### Forbidden imports (enforced via eslint no-restricted-imports)

urql, @urql/*, swr, apollo-client, @radix-ui/*, @headlessui/*, framer-motion, gsap

## 1. Tooling & State of the Art
- **TanStack Ecosystem:** Wir nutzen konsequent **TanStack Query, Form, Table und Hotkeys**. Diese Bibliotheken bieten "Headless"-Logik auf höchstem Niveau.
- **React Compiler (React 19):** Der Code ist für den React Compiler optimiert. Manuelle Memoization (`useMemo`, `useCallback`) wird vermieden, es sei denn, es ist für externe Libs zwingend erforderlich.

## 2. Accessibility (A11y)
- Barrierefreiheit ist kein Feature, sondern das Fundament.
- **Tastaturbedienung:** Jede interaktive Komponente muss zu 100% per Tastatur steuerbar sein.
- **ARIA:** Korrekte Verwendung von Rollen und Attributen nach WAI-ARIA Standards.

## 3. Design Engine vs. Portabilität
- Wir priorisieren ein kohärentes Gesamtsystem gegenüber isolierter Portabilität.
- Komponenten sind "intelligent" (Shortcuts, i18n-Support, native Validierung).

## 4. Coding Standards (React Compiler)
- **Purity:** Keine Mutationen während des Renders.
- **Side Effects:** Gehören ausschließlich in `useEffect` oder Event-Handler.
- **Refs:** Zugriff auf `ref.current` nur in Effekten oder Event-Handlern.
- **Destructuring:** Props direkt in den Funktionsparametern destrukturieren.

## 5. Visual Reference & Brand Identity (Artisanal Minimalism)

Jede Komponente und jede Section muss die Ästhetik eines exklusiven, traditionsbewussten Familienweinguts widerspiegeln.
- **Leitbild:** **buchart58.at** (Österreichische Familien-Eleganz).
- **Prinzipien:**
  - **Whitespace:** Extrem viel "Raum zum Atmen". Layouts wirken nie gedrungen oder überladen.
  - **Produkt als Hero:** Das Produkt (die Flasche, das Etikett) steht absolut im Zentrum. UI-Elemente sind "unsichtbar" und unterstützen lediglich die Story.
  - **Typografie:** Große, selbstbewusste Serif-Headlines (Eleganz/Tradition) kombiniert mit präziser, kleiner Sans-Serif für funktionale Daten (Handwerk).
  - **Interaktionen:** Subtil und erdig. Vermeidung von "Tech-Noise" (zu viele Glows, Neon-Akzente oder Partikel), stattdessen Fokus auf sanfte Fades und physische Reaktionen (Scale, sanfte Schatten).

---

Diese Richtlinien stellen sicher, dass jede Komponente "intelligent" wirkt und eine einheitliche, hochwertige User Experience über alle Projekte hinweg bietet.

---

## 6. Verbindliche Zusatz-Instructions

Diese Dateien sind Teil der Instructions und in jeder Session aktiv:

@ARTELIER.md
@COMPONENT-GUIDELINES.md

## 7. On-Demand-Referenzen

Bei Arbeit am jeweiligen Thema heranziehen (nicht automatisch geladen):

- [CELLAR-CANVAS.md](./CELLAR-CANVAS.md) — Vision & Decisions Log des Wine-Label-Designers (Implementierungsstand in `components/cellar-canvas/COMPONENT.md` + `STATUS.md`).
- [README.md](./README.md) — Architektur-Überblick AtelierUI (Provider, TanStack, i18n, Komponenten-Inventar).
- [PROGRESS.md](./PROGRESS.md) — Sessionübergreifender Arbeitsstand: Erledigt, Warteschlange, offene User-Aufgaben, Hinweise für neue Sessions. Zu Sessionbeginn lesen, bei jedem Schritt nachführen.
