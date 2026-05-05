import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import type { Order } from '@/lib/types'
import { createCartActions, CartContext } from '@/lib/cart-context'

// ─── Cart Provider ──────────────────────────────────────────────────────────────

function CartProvider({ children }: { children: ReactNode }) {
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

// ─── Theme Toggle ───────────────────────────────────────────────────────────────

function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  const toggle = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.setAttribute('data-theme', next ? '' : 'light')
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="w-10 h-10 border rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
      aria-label="Theme wechseln"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}

// ─── Nav Link ───────────────────────────────────────────────────────────────────

function NavLink({ to, children }: { to: string; children: ReactNode }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
    </Link>
  )
}

// ─── Layout ─────────────────────────────────────────────────────────────────────

export function Layout() {
  const { totalQuantity } = useContext(CartContext)!

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="text-xl font-bold tracking-tight shrink-0">
            🍷 Weingut
          </Link>

          <nav className="flex items-center gap-1 flex-1 px-4">
            <NavLink to="/">Weine</NavLink>
            <NavLink to="/cart">Warenkorb</NavLink>
            <NavLink to="/admin-info">Admin</NavLink>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <span className="text-xl">🛒</span>
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}

// ─── Layout Wrapper with Providers ──────────────────────────────────────────────

export function LayoutWithProviders() {
  return (
    <CartProvider>
      <Layout />
    </CartProvider>
  )
}
