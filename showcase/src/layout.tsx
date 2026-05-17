import { createContext, useContext, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router'
import { ToastProvider } from '@components/toast/toast'
import { AnimatedThemeToggler } from '@components/animated-theme-toggler/animated-theme-toggler'
import { AccentSwitcher } from '@components/accent-switcher/accent-switcher'
import { ScrollProgress } from '@components/scroll-progress/scroll-progress'
import { CartIcon } from '@components/cart-icon/cart-icon'
import { FloatingCart, type FloatingCartItem } from '@components/floating-cart/floating-cart'
import {
  Navbar, NavbarSection, NavbarItem,
  NavbarDivider, NavbarMobileToggle, NavbarMobileMenu,
  NavbarDesktopOnly,
} from '@components/navbar/navbar'
import { SearchOverlay } from '@components/search-overlay/search-overlay'
import { Tooltip } from '@components/tooltip/tooltip'
import { BackToTop } from '@components/back-to-top/back-to-top'
import { ShortcutOverview } from '@components/hotkeys/shortcut-overview'
import { useAtelier } from '@components/atelier'
import { LanguageSwitcher } from '@components/language-switcher/language-switcher'
import { ErrorBoundary } from './components/error-boundary'
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

// ─── Mock Search Results ────────────────────────────────────────────────────────

const mockResults = [
  { id: '1', title: 'Riesling 2023', category: 'Wein', href: '/shop', description: 'Ein klassischer Weißwein aus der Pfalz.' },
  { id: '2', title: 'Spätburgunder', category: 'Wein', href: '/shop', description: 'Eleganter Rotwein mit feiner Note.' },
  { id: '3', title: 'Komponenten-Guide', category: 'Doku', href: '/', description: 'Erfahre mehr über unsere Design Engine.' },
  { id: '4', title: 'Checkout-Flow', category: 'Prozess', href: '/shop', description: 'Vom Warenkorb bis zur Bestellung.' },
]

// ─── Layout ─────────────────────────────────────────────────────────────────────

export function Layout() {
  const { t } = useAtelier()
  const location = useLocation()
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState<FloatingCartItem[]>([])

  const cartCount = cartItems.reduce((sum, item) => sum + (item.count ?? 1), 0)

  function addItem(item?: { id: string; label?: string; image?: string }) {
    const id = item?.id ?? `wine-${Date.now()}`
    setCartItems((prev: FloatingCartItem[]) => {
      const existing = prev.find(i => i.id === id)
      if (existing) {
        return prev.map(i => i.id === id ? { ...i, count: (i.count ?? 1) + 1 } : i)
      }
      return [...prev, { id, label: item?.label ?? 'Wein', image: item?.image, count: 1 }]
    })
  }

  function removeItem(id?: string) {
    if (!id) {
      setCartItems((prev: FloatingCartItem[]) => {
        if (prev.length === 0) return prev
        const last = prev[prev.length - 1]
        if ((last.count ?? 1) <= 1) return prev.slice(0, -1)
        return prev.map((item, i) =>
          i === prev.length - 1 ? { ...item, count: (item.count ?? 1) - 1 } : item
        )
      })
    } else {
      setCartItems((prev: FloatingCartItem[]) => {
        const existing = prev.find(i => i.id === id)
        if (!existing) return prev
        if ((existing.count ?? 1) <= 1) return prev.filter(i => i.id !== id)
        return prev.map(i => i.id === id ? { ...i, count: (i.count ?? 1) - 1 } : i)
      })
    }
  }

  function resetCart() { setCartItems([]) }

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
        {/* UI Essentials */}
        <SearchOverlay 
          fetchResults={async (q) => mockResults.filter(r => r.title.toLowerCase().includes(q.toLowerCase()))} 
          initialSuggestions={mockResults.slice(0, 2)}
        />
        <ShortcutOverview />
        <BackToTop threshold={300} />

        <Navbar sticky height={56} bgColor="var(--background)" borderColor="var(--border)" style={{ viewTransitionName: 'nav-bar' }}>
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
                  {t(g.titleKey as any)}
                </NavbarItem>
              ))}
            </NavbarSection>
          </NavbarDesktopOnly>

          <NavbarSection position="right">
            <Tooltip content="Warenkorb öffnen" position="bottom">
              <CartIcon
                count={cartCount}
                size={20}
                onClick={() => navigate('/shop')}
              />
            </Tooltip>
            <NavbarDivider />
            <LanguageSwitcher />
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
                {t(g.titleKey as any)}
              </NavbarItem>
            ))}
          </NavbarMobileMenu>
        </Navbar>
        <ScrollProgress top="56px" />

        <div className="max-w-3xl mx-auto pt-6 pb-12 px-6">
          <main className="[view-transition-name:page-content]">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
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
