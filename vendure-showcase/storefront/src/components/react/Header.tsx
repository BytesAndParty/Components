import { useCart } from '@/lib/cart-context'
import { useT } from '@/lib/i18n'
import { Providers } from './Providers'
import { ThemeToggle } from './ThemeToggle'
import { LocaleToggle } from './LocaleToggle'
import { AccentPicker } from './AccentPicker'

function HeaderInner() {
  const { totalQuantity } = useCart()
  const t = useT()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <a href="/" className="text-xl font-bold tracking-tight shrink-0">
          🍷 {t.brandName}
        </a>

        <nav className="flex items-center gap-1 flex-1 px-4">
          <NavLink href="/">{t.navWines}</NavLink>
          <NavLink href="/cart">{t.navCart}</NavLink>
          <NavLink href="/admin-info">{t.navAdmin}</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="/cart"
            className="relative p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label={t.navCart}
          >
            <span className="text-xl" aria-hidden="true">🛒</span>
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </a>
          <AccentPicker />
          <LocaleToggle />
          <ThemeToggle />
        </div>
      </div>
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

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
    >
      {children}
    </a>
  )
}
