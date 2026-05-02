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

---

Diese Richtlinien stellen sicher, dass jede Komponente "intelligent" wirkt und eine einheitliche, hochwertige User Experience über alle Projekte hinweg bietet.
