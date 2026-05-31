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
    <header className="bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <a href="/" className="shrink-0 text-xl font-bold tracking-tight">
          🍷 {t.brandName}
        </a>

        <nav className="flex flex-1 items-center gap-1 px-4">
          <NavLink href="/">{t.navWines}</NavLink>
          <NavLink href="/cart">{t.navCart}</NavLink>
          <NavLink href="/admin-info">{t.navAdmin}</NavLink>
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
      className="text-muted-foreground hover:text-foreground rounded-lg px-4 py-2 text-sm font-medium transition-colors"
    >
      {children}
    </a>
  )
}
