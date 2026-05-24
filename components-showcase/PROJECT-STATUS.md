# Project Plan & Status: Component Showcase

Dieses Dokument dient als Übersicht über den aktuellen Stand der Entwicklung, die durchgeführten Optimierungen und die noch ausstehenden Aufgaben.

## 🎯 Vision
Ein hochperformantes, konsistentes und visuell ansprechendes Komponenten-Repository, das Best Practices in React 19, Tailwind CSS und Framer Motion vereint.

---

## ✅ Phase 1: Fundament & Kern-Komponenten (Abgeschlossen)
*   **Initialer Audit & Git-Struktur**: Repository bereinigt, Commits sinnvoll strukturiert.
*   **VelocityScroll Implementation**: Hinzufügen der scroll-reaktiven Testimonial-Rows.
*   **Showcase Integration**: Einbindung aller verfügbaren Komponenten in die `App.tsx` zur Live-Demo.
*   **Backlog Tracking**: Erstellung der `TODO-COMPONENTS.md` für zukünftige Features.

## ✅ Phase 2: Refactoring & Code-Qualität (Abgeschlossen)
*   **Tailwind Migration (Core)**: 
    *   `App.tsx` von Inline-Styles auf Tailwind umgestellt.
    *   *Begründung*: Inline-Styles erschweren das CSS-Management (z.B. Dark Mode, Hover-States) und blähen das DOM auf. Tailwind ermöglicht eine konsistente Design-Sprache über `tailwind.config.ts`.
*   **AccentSwitcher Optimierung**:
    *   Umstellung auf dynamische `<style>`-Tags für Farbübergänge.
    *   *Begründung*: Vermeidung von !important-Kriegen in Inline-Styles und sauberes Cleanup nach Animationen.
*   **Typisierung & Cleanup**:
    *   Striktere TypeScript-Interfaces für Props und Beschreibungen.
    *   Entfernung von `console.log` und Ersatz durch UI-Feedback (Toasts).
    *   *Begründung*: Bessere Developer Experience (DX) und sauberes Nutzer-Frontend.

## ✅ Phase 3: Komponenten-Standardisierung (Abgeschlossen)
*   **Tailwind 4 Integration**: Vollständige Installation von Tailwind 4 und dem Vite-Plugin.
    *   *Begründung*: Modernisierung des Tech-Stacks, Wegfall von manuellen CSS-Polyfills, bessere Performance durch Zero-Runtime CSS.
*   **Self-Contained Module**: Umstellung von `glow-card`, `magnetic-button`, `rotating-glow-card` und `autocomplete-cell` auf reine Tailwind-Klassen und Inline-Styles.
    *   *Begründung*: Maximale Portabilität. Komponenten können nun per Copy-Paste in andere Tailwind-Projekte übernommen werden, ohne externe `.css`-Dateien mitführen zu müssen.
*   **CSS Cleanup**: `styles.css` um 70% reduziert, Redundanzen entfernt und auf Tailwind 4 `@theme` umgestellt.

## 🚧 Phase 4: Dokumentation & Finishing (In Arbeit)
*   [ ] **Accessibility (A11y) Audit**:
    *   Hinzufügen von `aria-labels` und Keyboard-Support (Enter/Esc) für alle interaktiven Komponenten.
*   [ ] **README Update**: Erstellung/Update der `README.md` in den jeweiligen Komponenten-Ordnern mit Installationsanweisungen (Shadcn-Style).
*   [ ] **Vite-Build Optimierung**: Prüfung auf Tree-Shaking und Bundle-Größe.

---

## 💡 Architektur-Entscheidungen (ADR)

### 1. Tailwind vs. CSS-in-JS/Modules
Wir bevorzugen **Tailwind CSS**. 
*   *Vorteil*: Zero-Runtime Overhead, schnellere Entwicklung durch Utilities, einfache Konsistenz. 
*   *Entscheidung*: Komponenten werden so weit wie möglich ohne externe CSS-Dateien ausgeliefert, um die Portabilität (Copy-Paste in andere Projekte) zu maximieren.

### 2. Framer Motion für Animationen
Wir setzen auf **Framer Motion** für alle komplexen Animationen.
*   *Begründung*: Die API bietet die beste Integration für Layout-Animationen, Springs und Scroll-Tracking (wie in `VelocityScroll` genutzt).

### 3. React 19 & Compiler
Zukünftige Optimierungen via `useMemo` werden vernachlässigt, da der **React Compiler** diese Aufgabe übernimmt. Fokus liegt auf sauberer Komponenten-Logik.
