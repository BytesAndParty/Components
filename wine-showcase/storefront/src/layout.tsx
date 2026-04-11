import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import { ToastProvider } from '@/components/toast'
import { CartIcon } from '@/components/cart-icon'
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
      style={{
        background: 'none',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        width: '36px',
        height: '36px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--foreground)',
        fontSize: '16px',
      }}
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
      style={{
        textDecoration: 'none',
        color: isActive ? 'var(--accent)' : 'var(--muted-foreground)',
        fontWeight: isActive ? 600 : 400,
        fontSize: '14px',
        padding: '8px 12px',
        borderRadius: '8px',
        transition: 'all 200ms ease',
        background: isActive ? 'color-mix(in oklch, var(--accent) 10%, transparent)' : 'transparent',
      }}
    >
      {children}
    </Link>
  )
}

// ─── Layout ─────────────────────────────────────────────────────────────────────

export function Layout() {
  const { totalQuantity } = useContext(CartContext)!

  return (
    <>
      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'var(--background)',
          borderBottom: '1px solid var(--border)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6" style={{ display: 'flex', alignItems: 'center', height: '56px', gap: '24px' }}>
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              color: 'var(--foreground)',
              fontWeight: 700,
              fontSize: '18px',
              letterSpacing: '-0.02em',
            }}
          >
            🍷 Weingut
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
            <NavLink to="/">Weine</NavLink>
            <NavLink to="/cart">Warenkorb</NavLink>
            <NavLink to="/admin-info">Vendure Admin</NavLink>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CartIcon
              count={totalQuantity ?? 0}
              size={20}
              badgeColor="var(--accent)"
            />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 pt-6 pb-16">
        <Outlet />
      </div>
    </>
  )
}

// ─── Layout Wrapper with Providers ──────────────────────────────────────────────

export function LayoutWithProviders() {
  return (
    <CartProvider>
      <ToastProvider placement="bottom-right">
        <Layout />
      </ToastProvider>
    </CartProvider>
  )
}
