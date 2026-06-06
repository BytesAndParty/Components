/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WineDetailPage } from '../wine-detail';
import type { Product } from '@/lib/types';

// Mocking dependencies to isolate the component
vi.mock('@/lib/cart-context', () => ({
  useAddToCart: () => ({ mutate: vi.fn() }),
}));

vi.mock('@/lib/store-filters', () => ({
  useProduct: (_slug: string, initialData?: Product) => ({
    data: initialData,
    isLoading: false,
  }),
}));

vi.mock('@/lib/i18n', () => ({
  useT: () => ({
    detailLoading: 'Lade Wein...',
    detailNotFoundTitle: 'Wein nicht gefunden',
    detailNotFoundBody: 'Der gesuchte Wein existiert leider nicht.',
    detailBackToStore: 'Zurück zum Shop',
    navWines: 'Weine',
    inclVat: 'inkl. MwSt.',
    addToCart: 'In den Warenkorb',
    detailSectionTaste: 'GESCHMACKSPROFIL',
    detailSectionOrigin: 'HERKUNFT & SORTIERUNG',
    detailSectionAnalysis: 'ANALYSE',
    detailSectionPairing: 'Speiseempfehlung',
    detailSectionAwards: 'Auszeichnungen',
    fieldGrape: 'Rebsorte',
    fieldRegion: 'Region',
    fieldVintage: 'Jahrgang',
    fieldAlcohol: 'Alkoholgehalt',
    fieldResidualSugar: 'Restzucker',
    fieldAcidity: 'Säure',
    fieldServingTemp: 'Serviertemperatur',
  }),
}));

// Mock QueryClientProvider and other context providers if necessary
// Since WineDetailPage wraps its content in <Providers />, we might need to mock Providers
// or ensure it works in a test environment.

const mockProduct: Product = {
  id: '1',
  name: 'Blaufränkisch Reserve',
  slug: 'blaufränkisch-reserve',
  description: 'Ein kräftiger Rotwein mit tiefen Beerennoten.',
  featuredAsset: null,
  facetValues: [],
  variants: [
    {
      id: 'v1',
      name: '750ml',
      sku: 'BF-RES-2021',
      priceWithTax: 2450,
      stockLevel: 'IN_STOCK',
    },
  ],
  customFields: {
    jahrgang: 2021,
    rebsorte: 'Blaufränkisch',
    region: 'Burgenland',
    alkoholgehalt: 13.5,
    geschmacksprofil: 'Kräftig, würzig, Brombeere',
    restzucker: 1.2,
    saeure: 5.8,
    serviertemperatur: '16-18°C',
    speiseempfehlung: 'Wildgerichte, dunkles Fleisch',
    auszeichnungen: '92 Punkte Falstaff',
  },
};

describe('WineDetail Integration', () => {
  it('correctly maps and renders all Vendure Custom Fields', () => {
    render(<WineDetailPage slug="blaufränkisch-reserve" initialProduct={mockProduct} />);

    // Check basic info
    expect(screen.getAllByText('Blaufränkisch Reserve').length).toBeGreaterThan(0);
    expect(screen.getByText('€ 24,50')).toBeDefined();

    // Check Custom Fields in "Herkunft" section
    expect(screen.getByText('Blaufränkisch')).toBeDefined();
    expect(screen.getByText('Burgenland')).toBeDefined();
    expect(screen.getByText('2021')).toBeDefined();
    expect(screen.getByText('13.5 % vol.')).toBeDefined();

    // Check Custom Fields in "Analyse" section
    expect(screen.getByText('1.2 g/l')).toBeDefined();
    expect(screen.getByText('5.8 g/l')).toBeDefined();
    expect(screen.getByText('16-18°C')).toBeDefined();

    // Check Taste and Pairing
    expect(screen.getByText('Kräftig, würzig, Brombeere')).toBeDefined();
    expect(screen.getByText('Wildgerichte, dunkles Fleisch')).toBeDefined();
    expect(screen.getByText('92 Punkte Falstaff')).toBeDefined();
  });

  it('filters out empty custom fields', () => {
    const minimalProduct: Product = {
      ...mockProduct,
      customFields: {
        ...mockProduct.customFields,
        restzucker: null,
        saeure: null,
        auszeichnungen: null,
      },
    };

    render(<WineDetailPage slug="blaufränkisch-reserve" initialProduct={minimalProduct} />);

    // Should not find the labels for sections that are now empty
    expect(screen.queryByText('92 Punkte Falstaff')).toBeNull();
    // Restzucker/Säure labels might still be in analyticRows but filtered out
    expect(screen.queryByText('1,2 g/l')).toBeNull();
  });
});
