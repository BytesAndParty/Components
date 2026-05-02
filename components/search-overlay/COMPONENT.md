# Search Overlay

Ein Spotlight-inspiriertes Such-Overlay für eine immersive Navigations-Erfahrung.

## Features
- **Spotlight Design:** Zentriertes Modal mit starkem Backdrop-Blur (`backdrop-filter: blur(12px)`).
- **Keyboard-First:** Globaler Shortcut `CMD+K` (oder `CTRL+K`) zum Öffnen.
- **Kategorisierte Ergebnisse:** Unterstützung für verschiedene Ergebnistypen (Produkte, Kategorien, Seiten).
- **Keyboard Navigation:** Volle Unterstützung für Pfeiltasten und Enter.
- **Micro-Interactions:** Sanfte Feder-Animationen für das Öffnen und Auswählen von Elementen.

## Installation

Kopiere die Datei `search-overlay.tsx` in dein Projekt und installiere die Abhängigkeiten:

```bash
npm install framer-motion clsx tailwind-merge
```

## Verwendung

```tsx
import { SearchOverlay } from './components/search-overlay/search-overlay';

const results = [
  { id: '1', title: 'Riesling 2023', category: 'Wein', href: '/shop/riesling', description: 'Ein frischer Weißwein.' },
  // ...
];

function App() {
  return (
    <>
      <SearchOverlay results={results} />
      {/* ... rest of your app */}
    </>
  );
}
```

## Props

| Prop | Typ | Standard | Beschreibung |
| :--- | :--- | :--- | :--- |
| `results` | `SearchResult[]` | `[]` | Liste der anzuzeigenden Suchergebnisse. |
| `onSearch` | `(query: string) => void` | `-` | Callback, wenn sich die Suchanfrage ändert. |
| `className` | `string` | `-` | Zusätzliche CSS-Klassen. |
