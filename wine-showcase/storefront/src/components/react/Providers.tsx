import { useState, useCallback, useEffect, useMemo, type ReactNode } from 'react'
import type { Order } from '@/lib/types'
import { createCartActions, CartContext } from '@/lib/cart-context'

export function Providers({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  // Stable actions object — createCartActions() returns a fresh object
  // each call, which would otherwise invalidate every callback below.
  const actions = useMemo(() => createCartActions(), [])

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const o = await actions.refresh()
      setOrder(o)
    } finally {
      setLoading(false)
    }
  }, [actions])

  const addToCart = useCallback(async (variantId: string, quantity = 1) => {
    setLoading(true)
    try {
      const o = await actions.addToCart(variantId, quantity)
      if (o) setOrder(o)
    } finally {
      setLoading(false)
    }
  }, [actions])

  const adjustLine = useCallback(async (lineId: string, quantity: number) => {
    const o = await actions.adjustLine(lineId, quantity)
    if (o) setOrder(o)
  }, [actions])

  const removeLine = useCallback(async (lineId: string) => {
    const o = await actions.removeLine(lineId)
    if (o) setOrder(o)
  }, [actions])

  // Fetch the active cart once on mount. `refresh()` is async and
  // updates state internally — the rule flags the call because the
  // resulting setState happens within the effect's lifecycle, but this
  // is a standard "load on mount" pattern with no synchronous cascade.
  // eslint-disable-next-line react-hooks/set-state-in-effect
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
