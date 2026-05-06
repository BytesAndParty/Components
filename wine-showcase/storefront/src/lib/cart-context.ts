import { createContext, useContext } from 'react';
import type { Order } from './types';
import { vendureClient } from './vendure-client';
import { GET_ACTIVE_ORDER, ADD_TO_ORDER, ADJUST_ORDER_LINE, REMOVE_ORDER_LINE } from './queries';

interface CartContextValue {
  order: Order | null;
  loading: boolean;
  totalQuantity: number;
  totalPrice: number;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  adjustLine: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export { CartContext };

export function createCartActions() {
  const refresh = async (): Promise<Order | null> => {
    const result = await vendureClient.query(GET_ACTIVE_ORDER, {}).toPromise();
    return result.data?.activeOrder ?? null;
  };

  const addToCart = async (variantId: string, quantity = 1): Promise<Order | null> => {
    const result = await vendureClient.mutation(ADD_TO_ORDER, { variantId, quantity }).toPromise();
    const data = result.data?.addItemToOrder;
    if (data && 'id' in data) return data as Order;
    return null;
  };

  const adjustLine = async (lineId: string, quantity: number): Promise<Order | null> => {
    const result = await vendureClient.mutation(ADJUST_ORDER_LINE, { lineId, quantity }).toPromise();
    const data = result.data?.adjustOrderLine;
    if (data && 'id' in data) return data as Order;
    return null;
  };

  const removeLine = async (lineId: string): Promise<Order | null> => {
    const result = await vendureClient.mutation(REMOVE_ORDER_LINE, { lineId }).toPromise();
    const data = result.data?.removeOrderLine;
    if (data && 'id' in data) return data as Order;
    return null;
  };

  return { refresh, addToCart, adjustLine, removeLine };
}
