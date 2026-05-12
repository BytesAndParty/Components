import type { ComponentMessages } from '../i18n';

export type SearchOverlayMessages = {
  placeholder: string;
  noResults: string;
  emptyState: string;
  navigationHelp: string;
  selectionHelp: string;
  shortcutLabel: string;
  closeLabel: string;
  ariaLabel: string;
  searchDescription: string;
  closeDescription: string;
};

export const MESSAGES = {
  de: {
    placeholder: 'Suche nach Produkten oder Seiten…',
    noResults: 'Keine Ergebnisse gefunden.',
    emptyState: 'Tippe etwas ein, um die Suche zu starten…',
    navigationHelp: 'navigieren',
    selectionHelp: 'auswählen',
    shortcutLabel: 'Suche öffnen',
    closeLabel: 'Suche schließen',
    ariaLabel: 'Spotlight Suche',
    searchDescription: 'Öffnet die globale Spotlight-Suche',
    closeDescription: 'Schließt das aktuelle Overlay',
  },
  en: {
    placeholder: 'Search for products or pages…',
    noResults: 'No results found.',
    emptyState: 'Start typing to search…',
    navigationHelp: 'navigate',
    selectionHelp: 'select',
    shortcutLabel: 'Open search',
    closeLabel: 'Close search',
    ariaLabel: 'Spotlight Search',
    searchDescription: 'Opens the global spotlight search',
    closeDescription: 'Closes the current overlay',
  },
} as const satisfies ComponentMessages<SearchOverlayMessages>;
