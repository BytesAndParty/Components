import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Order } from './types';
import { shopApiRequest } from './vendure-client';
import {
  ADD_TO_ORDER,
  ADJUST_ORDER_LINE,
  GET_ACTIVE_ORDER,
  REMOVE_ORDER_LINE,
} from './queries';

export const CART_KEY = ['cart'] as const;

// addItemToOrder/adjustOrderLine/removeOrderLine sind Union-Results:
// Order bei Erfolg, sonst ein ErrorResult mit errorCode.
type OrderResult = Order | { errorCode: string };

async function fetchCart(): Promise<Order | null> {
  const data = await shopApiRequest<{ activeOrder: Order | null }>(GET_ACTIVE_ORDER);
  return data.activeOrder ?? null;
}

type AddVars = { variantId: string; quantity?: number };
async function addItem({ variantId, quantity = 1 }: AddVars): Promise<Order | null> {
  const data = await shopApiRequest<{ addItemToOrder: OrderResult }>(ADD_TO_ORDER, {
    variantId,
    quantity,
  });
  return 'id' in data.addItemToOrder ? data.addItemToOrder : null;
}

type AdjustVars = { lineId: string; quantity: number };
async function adjustOrderLine({ lineId, quantity }: AdjustVars): Promise<Order | null> {
  const data = await shopApiRequest<{ adjustOrderLine: OrderResult }>(ADJUST_ORDER_LINE, {
    lineId,
    quantity,
  });
  return 'id' in data.adjustOrderLine ? data.adjustOrderLine : null;
}

async function removeOrderLine(lineId: string): Promise<Order | null> {
  const data = await shopApiRequest<{ removeOrderLine: OrderResult }>(REMOVE_ORDER_LINE, {
    lineId,
  });
  return 'id' in data.removeOrderLine ? data.removeOrderLine : null;
}

function totalsOf(lines: Order['lines']) {
  const totalQuantity = lines.reduce((s, l) => s + l.quantity, 0);
  const totalWithTax = lines.reduce((s, l) => s + l.linePriceWithTax, 0);
  return { totalQuantity, totalWithTax };
}

export function useCart() {
  const q = useQuery({
    queryKey: CART_KEY,
    queryFn: fetchCart,
    staleTime: 0,
  });
  return {
    order: q.data ?? null,
    loading: q.isPending,
    totalQuantity: q.data?.totalQuantity ?? 0,
    totalPrice: q.data?.totalWithTax ?? 0,
  };
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addItem,
    onMutate: async ({ quantity = 1 }) => {
      await queryClient.cancelQueries({ queryKey: CART_KEY });
      const previous = queryClient.getQueryData<Order | null>(CART_KEY);
      // We don't have product details in the mutation vars, so only bump the
      // badge count optimistically — the cart-page list refills on invalidate.
      if (previous) {
        queryClient.setQueryData<Order>(CART_KEY, {
          ...previous,
          totalQuantity: previous.totalQuantity + quantity,
        });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context) queryClient.setQueryData(CART_KEY, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
  });
}

export function useAdjustLine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adjustOrderLine,
    onMutate: async ({ lineId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: CART_KEY });
      const previous = queryClient.getQueryData<Order | null>(CART_KEY);
      if (previous) {
        const lines = previous.lines.map((l) =>
          l.id === lineId
            ? { ...l, quantity, linePriceWithTax: l.productVariant.priceWithTax * quantity }
            : l,
        );
        queryClient.setQueryData<Order>(CART_KEY, { ...previous, lines, ...totalsOf(lines) });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context) queryClient.setQueryData(CART_KEY, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
  });
}

export function useRemoveLine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeOrderLine,
    onMutate: async (lineId) => {
      await queryClient.cancelQueries({ queryKey: CART_KEY });
      const previous = queryClient.getQueryData<Order | null>(CART_KEY);
      if (previous) {
        const lines = previous.lines.filter((l) => l.id !== lineId);
        queryClient.setQueryData<Order>(CART_KEY, { ...previous, lines, ...totalsOf(lines) });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context) queryClient.setQueryData(CART_KEY, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
  });
}

