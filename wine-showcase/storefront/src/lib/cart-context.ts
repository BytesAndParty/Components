import { useMutation, useQuery } from '@tanstack/react-query';
import type { Order } from './types';
import { vendureClient } from './vendure-client';
import {
  ADD_TO_ORDER,
  ADJUST_ORDER_LINE,
  GET_ACTIVE_ORDER,
  REMOVE_ORDER_LINE,
} from './queries';

export const CART_KEY = ['cart'] as const;

async function fetchCart(): Promise<Order | null> {
  const result = await vendureClient.query(GET_ACTIVE_ORDER, {}).toPromise();
  return result.data?.activeOrder ?? null;
}

type AddVars = { variantId: string; quantity?: number };
async function addItem({ variantId, quantity = 1 }: AddVars): Promise<Order | null> {
  const result = await vendureClient
    .mutation(ADD_TO_ORDER, { variantId, quantity })
    .toPromise();
  const data = result.data?.addItemToOrder;
  return data && 'id' in data ? (data as Order) : null;
}

type AdjustVars = { lineId: string; quantity: number };
async function adjustOrderLine({ lineId, quantity }: AdjustVars): Promise<Order | null> {
  const result = await vendureClient
    .mutation(ADJUST_ORDER_LINE, { lineId, quantity })
    .toPromise();
  const data = result.data?.adjustOrderLine;
  return data && 'id' in data ? (data as Order) : null;
}

async function removeOrderLine(lineId: string): Promise<Order | null> {
  const result = await vendureClient
    .mutation(REMOVE_ORDER_LINE, { lineId })
    .toPromise();
  const data = result.data?.removeOrderLine;
  return data && 'id' in data ? (data as Order) : null;
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
  return useMutation({
    mutationFn: addItem,
    onMutate: async ({ quantity = 1 }, ctx) => {
      await ctx.client.cancelQueries({ queryKey: CART_KEY });
      const previous = ctx.client.getQueryData<Order | null>(CART_KEY);
      // We don't have product details in the mutation vars, so only bump the
      // badge count optimistically — the cart-page list refills on invalidate.
      if (previous) {
        ctx.client.setQueryData<Order>(CART_KEY, {
          ...previous,
          totalQuantity: previous.totalQuantity + quantity,
        });
      }
      return { previous };
    },
    onError: (_err, _vars, onMutateResult, ctx) => {
      if (onMutateResult) ctx.client.setQueryData(CART_KEY, onMutateResult.previous);
    },
    onSettled: (_d, _e, _v, _r, ctx) => {
      ctx.client.invalidateQueries({ queryKey: CART_KEY });
    },
  });
}

export function useAdjustLine() {
  return useMutation({
    mutationFn: adjustOrderLine,
    onMutate: async ({ lineId, quantity }, ctx) => {
      await ctx.client.cancelQueries({ queryKey: CART_KEY });
      const previous = ctx.client.getQueryData<Order | null>(CART_KEY);
      if (previous) {
        const lines = previous.lines.map((l) =>
          l.id === lineId
            ? { ...l, quantity, linePriceWithTax: l.productVariant.priceWithTax * quantity }
            : l,
        );
        ctx.client.setQueryData<Order>(CART_KEY, { ...previous, lines, ...totalsOf(lines) });
      }
      return { previous };
    },
    onError: (_err, _vars, onMutateResult, ctx) => {
      if (onMutateResult) ctx.client.setQueryData(CART_KEY, onMutateResult.previous);
    },
    onSettled: (_d, _e, _v, _r, ctx) => {
      ctx.client.invalidateQueries({ queryKey: CART_KEY });
    },
  });
}

export function useRemoveLine() {
  return useMutation({
    mutationFn: removeOrderLine,
    onMutate: async (lineId, ctx) => {
      await ctx.client.cancelQueries({ queryKey: CART_KEY });
      const previous = ctx.client.getQueryData<Order | null>(CART_KEY);
      if (previous) {
        const lines = previous.lines.filter((l) => l.id !== lineId);
        ctx.client.setQueryData<Order>(CART_KEY, { ...previous, lines, ...totalsOf(lines) });
      }
      return { previous };
    },
    onError: (_err, _vars, onMutateResult, ctx) => {
      if (onMutateResult) ctx.client.setQueryData(CART_KEY, onMutateResult.previous);
    },
    onSettled: (_d, _e, _v, _r, ctx) => {
      ctx.client.invalidateQueries({ queryKey: CART_KEY });
    },
  });
}
