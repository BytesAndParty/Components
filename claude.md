# Project Philosophy: Enterprise Design Engine

Dieses Projekt folgt der Vision einer **Enterprise Design Engine**. Wir setzen auf tiefe Integration modernster Tools, um maximale Qualität in Performance, Barrierefreiheit und Entwickler-Experience zu garantieren.

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
@AGENTS.local.md

## 7. On-Demand-Referenzen

Bei Arbeit am jeweiligen Thema heranziehen (nicht automatisch geladen):

- [CELLAR-CANVAS.md](./CELLAR-CANVAS.md) — Vision & Decisions Log des Wine-Label-Designers (Implementierungsstand in `components/cellar-canvas/COMPONENT.md` + `STATUS.md`).
- [README.md](./README.md) — Architektur-Überblick AtelierUI (Provider, TanStack, i18n, Komponenten-Inventar).
- `AGENTS.md` ist auto-generiert (`shared/base/AGENTS.base.md` + `AGENTS.local.md`) — nicht von Hand editieren.
