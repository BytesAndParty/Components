import { createContext, useContext, useState, useCallback } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router'
import { ToastProvider } from './components/toast'
import { AnimatedThemeToggler } from '@components/animated-theme-toggler/animated-theme-toggler'
import { AccentSwitcher } from '@components/accent-switcher/accent-switcher'
import { ScrollProgress } from '@components/scroll-progress/scroll-progress'
import { CartIcon } from './components/cart-icon'
import { FloatingCart, type FloatingCartItem } from '@components/floating-cart/floating-cart'
import {
  Navbar, NavbarSection, NavbarItem,
  NavbarDivider, NavbarMobileToggle, NavbarMobileMenu,
  NavbarDesktopOnly,
} from '@components/navbar/navbar'
import { palettes, groups } from './data'

// ─── Cart Context (showcase-only) ───────────────────────────────────────────────

interface CartContextValue {
  count: number
  items: FloatingCartItem[]
  add: (item?: { id: string; label?: string; image?: string }) => void
  remove: (id?: string) => void
  reset: () => void
}

const CartContext = createContext<CartContextValue>({
  count: 0,
  items: [],
  add: () => {},
  remove: () => {},
  reset: () => {},
})

export function useCart() {
  return useContext(CartContext)
}

// ─── Layout ─────────────────────────────────────────────────────────────────────

export function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState<FloatingCartItem[]>([])

  const cartCount = cartItems.reduce((sum, item) => sum + (item.count ?? 1), 0)

  const addItem = useCallback((item?: { id: string; label?: string; image?: string }) => {
    const id = item?.id ?? `wine-${Date.now()}`
    setCartItems(prev => {
      const existing = prev.find(i => i.id === id)
      if (existing) {
        return prev.map(i => i.id === id ? { ...i, count: (i.count ?? 1) + 1 } : i)
      }
      return [...prev, { id, label: item?.label ?? 'Wein', image: item?.image, count: 1 }]
    })
  }, [])

  const removeItem = useCallback((id?: string) => {
    if (!id) {
      // Remove last item's count by 1
      setCartItems(prev => {
        if (prev.length === 0) return prev
        const last = prev[prev.length - 1]
        if ((last.count ?? 1) <= 1) return prev.slice(0, -1)
        return prev.map((item, i) =>
          i === prev.length - 1 ? { ...item, count: (item.count ?? 1) - 1 } : item
        )
      })
    } else {
      setCartItems(prev => {
        const existing = prev.find(i => i.id === id)
        if (!existing) return prev
        if ((existing.count ?? 1) <= 1) return prev.filter(i => i.id !== id)
        return prev.map(i => i.id === id ? { ...i, count: (i.count ?? 1) - 1 } : i)
      })
    }
  }, [])

  const resetCart = useCallback(() => setCartItems([]), [])

  const cartValue: CartContextValue = {
    count: cartCount,
    items: cartItems,
    add: addItem,
    remove: removeItem,
    reset: resetCart,
  }

  return (
    <CartContext.Provider value={cartValue}>
      <ToastProvider placement="bottom-right">
        <Navbar sticky height={56} bgColor="var(--background)" borderColor="var(--border)">
          <NavbarSection position="left">
            <Link
              to="/"
              viewTransition
              className="no-underline text-foreground font-bold text-lg -tracking-[0.02em] py-2"
            >
              Components
            </Link>
          </NavbarSection>

          <NavbarDesktopOnly>
            <NavbarSection position="center">
              {groups.map(g => (
                <NavbarItem
                  key={g.path}
                  active={location.pathname === g.path}
                  onClick={() => navigate(g.path)}
                >
                  {g.title}
                </NavbarItem>
              ))}
            </NavbarSection>
          </NavbarDesktopOnly>

          <NavbarSection position="right">
            <CartIcon
              count={cartCount}
              size={20}
              onClick={() => navigate('/shop')}
            />
            <NavbarDivider />
            <AnimatedThemeToggler />
            <AccentSwitcher palettes={palettes} defaultPalette="indigo" />
            <NavbarMobileToggle />
          </NavbarSection>

          <NavbarMobileMenu>
            {groups.map(g => (
              <NavbarItem
                key={g.path}
                active={location.pathname === g.path}
                onClick={() => navigate(g.path)}
              >
                {g.title}
              </NavbarItem>
            ))}
          </NavbarMobileMenu>
        </Navbar>

        <div className="max-w-3xl mx-auto pt-6 pb-12 px-6">
          <main className="[view-transition-name:page-content]">
            <Outlet />
          </main>
        </div>

        <FloatingCart
          items={cartItems}
          onClick={() => navigate('/shop')}
          onItemRemove={(id) => removeItem(id)}
        />
      </ToastProvider>
    </CartContext.Provider>
  )
}
