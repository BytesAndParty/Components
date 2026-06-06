/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CartPage } from '../cart';
import * as vendureClient from '@/lib/vendure-client';
import { queryClient } from '@/lib/query-client';
import type { Order } from '@/lib/types';

// Mock the shopApiRequest
vi.mock('@/lib/vendure-client', () => ({
  shopApiRequest: vi.fn(),
}));

// Mock the global queryClient so Providers uses our test client
vi.mock('@/lib/query-client', async () => {
  const { QueryClient } = await import('@tanstack/react-query');
  return {
    queryClient: new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: Infinity },
        mutations: { retry: false },
      },
    }),
  };
});

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

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Cart Optimistic UI & Sync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('updates quantity optimistically and rolls back on error', async () => {
    // 1. Initial Load
    vi.mocked(vendureClient.shopApiRequest).mockResolvedValue({ activeOrder: mockOrder });

    render(<CartPage />);

    // Wait for cart to load
    await waitFor(() => expect(screen.getByText('Blaufränkisch Reserve')).toBeDefined());
    expect(screen.getByText('2')).toBeDefined(); // Quantity
    expect(screen.getAllByText('€ 49,00').length).toBeGreaterThan(0); // Line Total or Subtotal

    // 2. Trigger Adjustment (Increment)
    // We expect the UI to jump to 3 immediately
    // Mock the next request to fail after a small delay
    vi.mocked(vendureClient.shopApiRequest).mockImplementationOnce(async () => {
      await delay(50);
      throw new Error('Insufficient Stock');
    });

    const incrementButton = screen.getByLabelText(/Menge erhöhen/i);
    fireEvent.click(incrementButton);

    // Optimistic Update: Should show 3 immediately (before server response)
    await waitFor(() => {
      expect(screen.getByText('3')).toBeDefined();
      expect(screen.getAllByText('€ 73,50').length).toBeGreaterThan(0); // 3 * 24.50
    });

    // 3. Rollback: After the error, it should revert to 2
    await waitFor(() => {
      expect(screen.getByText('2')).toBeDefined();
      expect(screen.getAllByText('€ 49,00').length).toBeGreaterThan(0);
    });
  });

  it('removes item optimistically and rolls back on error', async () => {
    vi.mocked(vendureClient.shopApiRequest).mockResolvedValue({ activeOrder: mockOrder });

    render(<CartPage />);

    await waitFor(() => expect(screen.getByText('Blaufränkisch Reserve')).toBeDefined());

    // Mock delete failure after a small delay
    vi.mocked(vendureClient.shopApiRequest).mockImplementationOnce(async () => {
      await delay(50);
      throw new Error('Network Error');
    });

    const removeButton = screen.getByLabelText(/Position entfernen/i);
    fireEvent.click(removeButton);

    // Optimistic Update: Should show empty state immediately
    await waitFor(() => {
      expect(screen.getByText(/Warenkorb ist leer/i)).toBeDefined();
    });

    // Rollback: Should show the item again
    await waitFor(() => {
      expect(screen.getByText('Blaufränkisch Reserve')).toBeDefined();
    });
  });
});
