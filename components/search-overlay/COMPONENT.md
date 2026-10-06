# Search Overlay

Ein Spotlight-inspiriertes Such-Overlay für eine immersive Navigations-Erfahrung.

## Features
- **Spotlight Design:** Zentriertes Modal mit starkem Backdrop-Blur (`backdrop-filter: blur(12px)`), Body-Scroll gesperrt solange offen.
- **Keyboard-First:** `Mod+K` öffnet, `Escape` schließt — beide über `useDesignEngineHotkey` registriert und damit in der `ShortcutOverview` sichtbar.
- **Server-State via TanStack Query:** `fetchResults(query)` wird über `useQuery` aufgerufen (Query-Key `['search', query, fetchResults]`, `staleTime` 1 min). Keine eigenen Loading-/Error-States in der Komponente.
- **Vorschläge im Leerzustand:** Ohne Suchbegriff zeigt die Liste `initialSuggestions`.
- **Kategorisierte Ergebnisse:** Jeder Treffer mit Titel, Kategorie, optionaler Beschreibung und Icon.
- **Keyboard Navigation:** Pfeiltasten wandern durch die Treffer (`role="listbox"` / `role="option"` mit `aria-selected`), Enter wählt.
- **Micro-Interactions:** Sanfte Feder-Animationen für das Öffnen und Auswählen von Elementen.

## Props

| Prop | Typ | Standard | Beschreibung |
| :--- | :--- | :--- | :--- |
| `fetchResults` | `(query: string) => Promise<SearchResult[]>` | `-` | Liefert die Treffer zur Eingabe. Läuft erst ab einem Zeichen. |
| `initialSuggestions` | `SearchResult[]` | `[]` | Treffer für den Leerzustand (vor der ersten Eingabe). |
| `messages` | `Partial<SearchOverlayMessages>` | `-` | i18n-Overrides für Placeholder, Leer-/Kein-Treffer-Texte, Hilfetexte und Shortcut-Labels. |
| `className` | `string` | `-` | Zusätzliche CSS-Klassen am Overlay. |

```ts
interface SearchResult {
  id: string
  title: string
  category: string
  href: string
  description?: string
  icon?: ReactNode
}
```

## Verwendung

```tsx
import { SearchOverlay } from '@components/search-overlay/search-overlay';

const suggestions = [
  { id: '1', title: 'Riesling 2023', category: 'Wein', href: '/shop/riesling', description: 'Ein frischer Weißwein.' },
];

<SearchOverlay
  initialSuggestions={suggestions}
  fetchResults={(q) => api.search(q)}
/>
```

Benötigt einen `QueryClientProvider` und einen `HotkeysProvider` im Baum.

## Bekannte Lücken

- Auswahl (Klick oder Enter) schließt das Overlay nur — es gibt noch keinen `onSelect`-Callback und keine Navigation zu `href`.
- `SearchResult` und `SearchOverlayProps` sind nicht exportiert.

## Dependencies

- `motion` (`motion/react`) — Overlay- und Listen-Animationen
- `@tanstack/react-query` — Abfrage und Cache
- `@components/hotkeys` — Shortcut-Registrierung
