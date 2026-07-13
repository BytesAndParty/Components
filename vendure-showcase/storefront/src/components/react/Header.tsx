import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useT } from '@/lib/i18n'
import { useActiveCustomer } from '@/lib/use-auth'
import { Providers } from './Providers'
import { ThemeToggle } from './ThemeToggle'
import { LocaleToggle } from './LocaleToggle'
import { AccentPicker } from './AccentPicker'

function HeaderInner() {
  const { totalQuantity } = useCart()
  const { data: customer } = useActiveCustomer()
  const t = useT()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <a href="/" className="shrink-0 text-xl font-bold tracking-tight">
          🍷 {t.brandName}
        </a>

        <nav className="hidden flex-1 items-center gap-1 px-4 md:flex">
          <NavLink href="/">{t.navWines}</NavLink>
          <NavLink href="/cart">{t.navCart}</NavLink>
          <NavLink href="/admin-info">{t.navAdmin}</NavLink>
          {customer ? (
            <NavLink href="/profile">{t.navProfile}</NavLink>
          ) : (
            <NavLink href="/login">{t.navLogin}</NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="/cart"
            className="hover:bg-muted relative rounded-lg p-2 transition-colors"
            aria-label={t.navCart}
          >
            <span className="text-xl" aria-hidden="true">🛒</span>
            {totalQuantity > 0 && (
              <span className="bg-accent text-accent-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold">
                {totalQuantity}
              </span>
            )}
          </a>

          <div className="hidden items-center gap-2 md:flex">
            <AccentPicker />
            <LocaleToggle />
            <ThemeToggle />
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="border-border hover:bg-muted grid h-10 w-10 place-items-center rounded-lg border transition-colors md:hidden"
            aria-label={t.menuToggle}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="border-border border-t md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
            <NavLink href="/" onClick={closeMenu}>{t.navWines}</NavLink>
            <NavLink href="/cart" onClick={closeMenu}>{t.navCart}</NavLink>
            <NavLink href="/admin-info" onClick={closeMenu}>{t.navAdmin}</NavLink>
            {customer ? (
              <NavLink href="/profile" onClick={closeMenu}>{t.navProfile}</NavLink>
            ) : (
              <NavLink href="/login" onClick={closeMenu}>{t.navLogin}</NavLink>
            )}
            <div className="border-border mt-3 flex items-center gap-2 border-t pt-4">
              <AccentPicker />
              <LocaleToggle />
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export function Header() {
  return (
    <Providers>
      <HeaderInner />
    </Providers>
  )
}

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="text-muted-foreground hover:text-foreground rounded-lg px-4 py-2 text-sm font-medium transition-colors"
    >
      {children}
    </a>
  )
}
