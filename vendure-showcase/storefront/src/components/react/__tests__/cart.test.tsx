/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CartPage } from '../cart';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AtelierProvider } from '@components/atelier';
import * as vendureClient from '@/lib/vendure-client';
import { queryClient as globalQueryClient } from '@/lib/query-client';
import type { Order } from '@/lib/types';

// Mock the shopApiRequest
vi.mock('@/lib/vendure-client', () => ({
  shopApiRequest: vi.fn(),
}));

// We use a real QueryClient but clear it between tests
const testQueryClient = globalQueryClient;

const mockOrder: Order = {
  id: 'order_1',
  code: 'ABCDEF',
  state: 'AddingItems',
  totalQuantity: 2,
  totalWithTax: 4900,
  lines: [
    {
      id: 'line_1',
      quantity: 2,
      linePriceWithTax: 4900,
      productVariant: {
        id: 'variant_1',
        name: 'Blaufränkisch Reserve',
        sku: 'BF-RES-2021',
        priceWithTax: 2450,
        product: {
          slug: 'blaufränkisch-reserve',
          featuredAsset: null,
        },
      },
    },
  ],
};

describe('Cart Optimistic UI & Sync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    testQueryClient.clear();
    // Set initial state
    testQueryClient.setQueryData(['cart'], mockOrder);
  });

  it('updates quantity optimistically and rolls back on error', async () => {
    (vendureClient.shopApiRequest as any).mockImplementation(() => {
      return new Promise((_, reject) => setTimeout(() => reject(new Error('Fail')), 50));
    });

    render(<CartPage />);

    // Wait for cart to load from cache
    await waitFor(() => expect(screen.getByText('Blaufränkisch Reserve')).toBeDefined());
    expect(screen.getByText('2')).toBeDefined();

    const incrementButton = screen.getByLabelText(/Menge erhöhen/i);
    fireEvent.click(incrementButton);

    // Optimistic Update: Should show 3 immediately
    await waitFor(() => expect(screen.getByText('3')).toBeDefined(), { timeout: 100 });
    expect(screen.getAllByText('€ 73,50').length).toBeGreaterThan(0);

    // Rollback: After the error, it should revert to 2
    await waitFor(() => expect(screen.getByText('2')).toBeDefined(), { timeout: 1000 });
    expect(screen.getAllByText('€ 49,00').length).toBeGreaterThan(0);
  });

  it('removes item optimistically and rolls back on error', async () => {
    (vendureClient.shopApiRequest as any).mockImplementation(() => {
      return new Promise((_, reject) => setTimeout(() => reject(new Error('Fail')), 50));
    });

    render(<CartPage />);

    await waitFor(() => expect(screen.getByText('Blaufränkisch Reserve')).toBeDefined());

    const removeButton = screen.getByLabelText(/Position entfernen/i);
    fireEvent.click(removeButton);

    // Optimistic Update: Should show empty state immediately
    await waitFor(() => expect(screen.getByText(/Warenkorb ist leer/i)).toBeDefined(), { timeout: 100 });

    // Rollback: Should show the item again
    await waitFor(() => expect(screen.getByText('Blaufränkisch Reserve')).toBeDefined(), { timeout: 1000 });
  });
});
