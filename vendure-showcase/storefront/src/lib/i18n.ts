/**
 * Storefront-i18n.
 *
 * Atelier liefert über den I18nProvider locale state (`de` | `en`); hier hängen
 * wir lediglich unsere shop-spezifischen Strings dran. Komponenten verwenden
 * `useT()` und bekommen ein {key → string}-Objekt für die aktive Sprache zurück.
 */
import { useComponentMessages } from '@components/i18n';
import type { ComponentMessages } from '@components/i18n';

const messages = {
  de: {
    // Layout / brand
    brandName: 'Weingut',
    pageTitleSuffix: 'Weingut',
    metaDescription: 'Weingut Showcase – statisch geladen',

    // Header
    navWines: 'Weine',
    navCart: 'Warenkorb',
    navAdmin: 'Admin',
    themeToggle: 'Theme wechseln',
    localeToggle: 'Sprache wechseln',
    accentToggle: 'Akzentfarbe wechseln',

    // Store page
    storeTitle: 'Unsere Weine',
    storeSubtitle: 'Handverlesen aus den besten Lagen Österreichs.',
    storeLoading: 'Lade Weine…',
    storeErrorTitle: 'Server nicht erreichbar',
    storeErrorBody: 'Der Vendure-Shop kann gerade nicht antworten. Bitte später erneut versuchen oder den Server starten:',
    storeErrorCmd: 'cd vendure-showcase/server && bun run dev',
    storeNoResultsTitle: 'Keine Weine gefunden',
    storeNoResultsBody: 'Mit diesen Filtern haben wir keinen passenden Wein im Sortiment.',
    storeNoResultsReset: 'Filter zurücksetzen',

    // Toolbar / count
    sortLabel: 'Sortierung',
    sortNameAsc: 'Name A → Z',
    sortNameDesc: 'Name Z → A',
    sortPriceAsc: 'Preis aufsteigend',
    sortPriceDesc: 'Preis absteigend',
    countTotal: '{count} Weine',
    countFiltered: '{filtered} von {total} Weinen',

    // Filter drawer
    filterButton: 'Filtern',
    filterTitle: 'Filter',
    filterClose: 'Schließen',
    filterEmpty: 'Keine Filter verfügbar.',
    filterReset: 'Zurücksetzen',
    filterChipRemove: 'Filter „{name}" entfernen',

    // Card / CTA
    addToCart: 'In den Warenkorb',
    inclVat: 'inkl. MwSt.',

    // Wine detail
    detailLoading: 'Lade Wein…',
    detailNotFoundTitle: 'Wein nicht gefunden',
    detailNotFoundBody: 'Diesen Wein gibt es bei uns nicht (mehr).',
    detailBackToStore: '← Zurück zur Übersicht',
    detailSectionTaste: 'Geschmacksprofil',
    detailSectionOrigin: 'Herkunft & Produktion',
    detailSectionAnalysis: 'Analyse & Service',
    detailSectionPairing: 'Speiseempfehlung',
    detailSectionAwards: 'Auszeichnungen',

    // Detail field labels
    fieldGrape: 'Rebsorte',
    fieldRegion: 'Region',
    fieldVintage: 'Jahrgang',
    fieldAlcohol: 'Alkohol',
    fieldResidualSugar: 'Restzucker',
    fieldAcidity: 'Säure',
    fieldServingTemp: 'Serviertemperatur',
  },

  en: {
    brandName: 'Vineyard',
    pageTitleSuffix: 'Vineyard',
    metaDescription: 'Vineyard showcase – statically rendered',

    navWines: 'Wines',
    navCart: 'Cart',
    navAdmin: 'Admin',
    themeToggle: 'Toggle theme',
    localeToggle: 'Toggle language',
    accentToggle: 'Change accent colour',

    storeTitle: 'Our Wines',
    storeSubtitle: 'Hand-picked from Austria’s finest vineyards.',
    storeLoading: 'Loading wines…',
    storeErrorTitle: 'Server unreachable',
    storeErrorBody: 'The Vendure shop is not responding right now. Try again later or start the server:',
    storeErrorCmd: 'cd vendure-showcase/server && bun run dev',
    storeNoResultsTitle: 'No wines found',
    storeNoResultsBody: 'No wines match the selected filters.',
    storeNoResultsReset: 'Reset filters',

    sortLabel: 'Sort',
    sortNameAsc: 'Name A → Z',
    sortNameDesc: 'Name Z → A',
    sortPriceAsc: 'Price ascending',
    sortPriceDesc: 'Price descending',
    countTotal: '{count} wines',
    countFiltered: '{filtered} of {total} wines',

    filterButton: 'Filter',
    filterTitle: 'Filter',
    filterClose: 'Close',
    filterEmpty: 'No filters available.',
    filterReset: 'Reset',
    filterChipRemove: 'Remove filter “{name}”',

    addToCart: 'Add to cart',
    inclVat: 'incl. VAT',

    detailLoading: 'Loading wine…',
    detailNotFoundTitle: 'Wine not found',
    detailNotFoundBody: 'We don’t (or no longer) carry this wine.',
    detailBackToStore: '← Back to overview',
    detailSectionTaste: 'Tasting profile',
    detailSectionOrigin: 'Origin & production',
    detailSectionAnalysis: 'Analysis & service',
    detailSectionPairing: 'Food pairing',
    detailSectionAwards: 'Awards',

    fieldGrape: 'Grape',
    fieldRegion: 'Region',
    fieldVintage: 'Vintage',
    fieldAlcohol: 'Alcohol',
    fieldResidualSugar: 'Residual sugar',
    fieldAcidity: 'Acidity',
    fieldServingTemp: 'Serving temperature',
  },
} satisfies ComponentMessages<Record<string, string>>;

export type StorefrontMessages = typeof messages.de;
export type StorefrontMessageKey = keyof StorefrontMessages;

/** Hook returning the current locale's storefront message bag. */
export function useT(): StorefrontMessages {
  return useComponentMessages(messages);
}

/** Interpolate `{var}` placeholders. */
export function format(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`));
}
