# Search Overlay

Ein Spotlight-inspiriertes Such-Overlay für eine immersive Navigations-Erfahrung.

## Features
- **Spotlight Design:** Zentriertes Modal mit starkem Backdrop-Blur (`backdrop-filter: blur(12px)`), Body-Scroll gesperrt solange offen.
- **Keyboard-First:** `Mod+K` öffnet (über `useDesignEngineHotkey` registriert und damit in der `ShortcutOverview` sichtbar), `Escape` schließt (übernimmt der Dialog, kein eigener Hotkey).
- **Server-State via TanStack Query:** `fetchResults(query)` wird über `useQuery` aufgerufen (Query-Key `['search', query, fetchResults]`, `staleTime` 1 min). Keine eigenen Loading-/Error-States in der Komponente.
- **Vorschläge im Leerzustand:** Ohne Suchbegriff zeigt die Liste `initialSuggestions`.
- **Kategorisierte Ergebnisse:** Jeder Treffer mit Titel, Kategorie, optionaler Beschreibung und Icon.
- **Keyboard Navigation:** Pfeiltasten wandern durch die Treffer (am Ende geht es oben weiter), Home/End springen zum ersten/letzten Treffer, Enter wählt. Beim Öffnen und beim Tippen ist der erste Treffer hervorgehoben.
- **Auswahl:** Klick oder Enter schließt das Overlay und ruft `onSelect(result)` auf — ohne `onSelect` navigiert die Komponente per `window.location.assign(result.href)`.
- **Micro-Interactions:** Ein- und Ausblenden von Backdrop und Palette (Palette mit leichtem Überschwingen statt der früheren Feder), Hervorhebung mit Akzentfläche und Schatten.

## How It Works

- **Dialog (Ark UI):** `Dialog.Root` (modal) liefert Fokusfalle, Esc, Klick daneben zum Schließen, Scroll-Sperre der Seite und Fokus-Rückgabe an das Element, das vor `Mod+K` den Fokus hatte. Der erste Fokus liegt per `initialFocusEl` im Suchfeld. Backdrop und Palette hängen per `Portal` in `useOverlayContainer()` (ohne Provider am `<body>`) und werden nur gemountet, solange der Dialog offen ist (`lazyMount`, `unmountOnExit`).
- **Combobox (Ark UI):** Im Dialog sitzt ein `Combobox.Root`, das immer offen ist (`open`) und seine Liste inline rendert, ohne `Positioner`. `collection` sind die angezeigten Treffer (`fetchResults` bzw. `initialSuggestions`), die Combobox filtert nicht selbst. `disableLayer` ist gesetzt, damit Esc und Klicks daneben beim Dialog landen und nicht zuerst die Liste „schließen“. Freitext bleibt stehen (`allowCustomValue`, `selectionBehavior: 'preserve'`), es gibt keinen Auswahl-Zustand (`value: []`); die gewählte Zeile kommt über `onValueChange` und schließt das Overlay.
- **Label:** Ein `sr-only`-`Combobox.Label` mit `ariaLabel` benennt Suchfeld (`for`) und Trefferliste: Ark verweist mit `aria-labelledby` der Liste auf dieses Label.
- **Hervorhebung:** Pfeiltasten und Zeiger teilen sich eine Hervorhebung über `data-highlighted`, die Unterelemente reagieren über die Gruppe `group/option`.
- **Animation:** CSS-Keyframes, einmal per `STYLE_ID` in den `<head>` injiziert, an Arks `data-state` gebunden; Ark wartet beim Schließen auf das Ende der Ausblend-Animation. `prefers-reduced-motion` schaltet sie im selben Style-Block ab (einziger Weg).

## Props

| Prop | Typ | Standard | Beschreibung |
| :--- | :--- | :--- | :--- |
| `fetchResults` | `(query: string) => Promise<SearchResult[]>` | `-` | Liefert die Treffer zur Eingabe. Läuft erst ab einem Zeichen. |
| `initialSuggestions` | `SearchResult[]` | `[]` | Treffer für den Leerzustand (vor der ersten Eingabe). |
| `onSelect` | `(result: SearchResult) => void` | `-` | Wird bei Auswahl aufgerufen, z. B. für Client-Routing (`navigate(result.href)`). Ohne Callback: Seitenwechsel auf `href`. |
| `messages` | `Partial<SearchOverlayMessages>` | `-` | i18n-Overrides für Placeholder, Leer-/Kein-Treffer-Texte, Hilfetexte, Label von Dialog, Suchfeld und Liste sowie Shortcut-Label. |
| `className` | `string` | `-` | Zusätzliche CSS-Klassen am Overlay. |

```ts
export interface SearchResult {
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
  onSelect={(r) => navigate(r.href)}
/>
```

Benötigt einen `QueryClientProvider` und einen `HotkeysProvider` im Baum.

## Dependencies

- `@ark-ui/react` (`/dialog`, `/combobox`, `/collection`, `/portal`) — Dialog, Listbox-Tastatur, ARIA
- `@tanstack/react-query` — Abfrage und Cache
- `@components/hotkeys` — Shortcut-Registrierung
