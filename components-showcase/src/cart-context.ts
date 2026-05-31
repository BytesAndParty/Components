import { createContext, useContext } from 'react'
import type { FloatingCartItem } from '@components/floating-cart/floating-cart'

export interface CartContextValue {
  count: number
  items: FloatingCartItem[]
  add: (item?: { id: string; label?: string; image?: string }) => void
  remove: (id?: string) => void
  reset: () => void
}

export const CartContext = createContext<CartContextValue>({
  count: 0,
  items: [],
  add: () => {},
  remove: () => {},
  reset: () => {},
})

export function useCart() {
  return useContext(CartContext)
}
