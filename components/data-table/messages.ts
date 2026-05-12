import type { ComponentMessages } from '../i18n'

export type DataTableMessages = {
  noResults: string
  nextPage: string
  prevPage: string
  firstPage: string
  lastPage: string
  pageOf: string // e.g. "Seite {current} von {total}"
  rowsPerPage: string
}

export const MESSAGES = {
  de: {
    noResults: 'Keine Ergebnisse gefunden.',
    nextPage: 'Nächste Seite',
    prevPage: 'Vorherige Seite',
    firstPage: 'Erste Seite',
    lastPage: 'Letzte Seite',
    pageOf: 'Seite {current} von {total}',
    rowsPerPage: 'Zeilen pro Seite',
  },
  en: {
    noResults: 'No results found.',
    nextPage: 'Next page',
    prevPage: 'Previous page',
    firstPage: 'First page',
    lastPage: 'Last page',
    pageOf: 'Page {current} of {total}',
    rowsPerPage: 'Rows per page',
  },
} as const satisfies ComponentMessages<DataTableMessages>
