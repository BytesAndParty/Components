import { useState, useCallback, useEffect, type ReactNode } from 'react'
import type { Order } from '@/lib/types'
import { createCartActions, CartContext } from '@/lib/cart-context'

export function Providers({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const actions = createCartActions()

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const o = await actions.refresh()
      setOrder(o)
    } finally {
      setLoading(false)
    }
  }, [])

  const addToCart = useCallback(async (variantId: string, quantity = 1) => {
    setLoading(true)
    try {
      const o = await actions.addToCart(variantId, quantity)
      if (o) setOrder(o)
    } finally {
      setLoading(false)
    }
  }, [])

  const adjustLine = useCallback(async (lineId: string, quantity: number) => {
    const o = await actions.adjustLine(lineId, quantity)
    if (o) setOrder(o)
  }, [])

  const removeLine = useCallback(async (lineId: string) => {
    const o = await actions.removeLine(lineId)
    if (o) setOrder(o)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  return (
    <CartContext.Provider value={{
      order,
      loading,
      totalQuantity: order?.totalQuantity ?? 0,
      totalPrice: order?.totalWithTax ?? 0,
      addToCart,
      adjustLine,
      removeLine,
      refresh,
    }}>
      {children}
    </CartContext.Provider>
  )
}
