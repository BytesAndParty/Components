import type { ComponentMessages } from '../i18n';

export type SearchOverlayMessages = {
  placeholder: string;
  noResults: string;
  emptyState: string;
  navigationHelp: string;
  selectionHelp: string;
  shortcutLabel: string;
  ariaLabel: string;
  searchDescription: string;
};

export const MESSAGES = {
  de: {
    placeholder: 'Suche nach Produkten oder Seiten…',
    noResults: 'Keine Ergebnisse gefunden.',
    emptyState: 'Tippe etwas ein, um die Suche zu starten…',
    navigationHelp: 'navigieren',
    selectionHelp: 'auswählen',
    shortcutLabel: 'Suche öffnen',
    ariaLabel: 'Spotlight Suche',
    searchDescription: 'Öffnet die globale Spotlight-Suche',
  },
  en: {
    placeholder: 'Search for products or pages…',
    noResults: 'No results found.',
    emptyState: 'Start typing to search…',
    navigationHelp: 'navigate',
    selectionHelp: 'select',
    shortcutLabel: 'Open search',
    ariaLabel: 'Spotlight Search',
    searchDescription: 'Opens the global spotlight search',
  },
  // Machine draft like all pl texts, to be proofread by a Polish speaker (components/i18n/COMPONENT.md).
  pl: {
    placeholder: 'Szukaj produktów lub stron…',
    noResults: 'Nie znaleziono wyników.',
    emptyState: 'Zacznij pisać, aby wyszukać…',
    navigationHelp: 'nawiguj',
    selectionHelp: 'wybierz',
    shortcutLabel: 'Otwórz wyszukiwanie',
    ariaLabel: 'Wyszukiwanie Spotlight',
    searchDescription: 'Otwiera globalne wyszukiwanie Spotlight',
  },
} as const satisfies ComponentMessages<SearchOverlayMessages>;
