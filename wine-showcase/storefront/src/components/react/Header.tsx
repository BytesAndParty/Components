import { useCart } from '@/lib/cart-context'
import { Providers } from './Providers'
import { ThemeToggle } from './ThemeToggle'

function HeaderInner() {
  const { totalQuantity } = useCart()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <a href="/" className="text-xl font-bold tracking-tight shrink-0">
          🍷 Weingut
        </a>

        <nav className="flex items-center gap-1 flex-1 px-4">
          <NavLink href="/">Weine</NavLink>
          <NavLink href="/cart">Warenkorb</NavLink>
          <NavLink href="/admin-info">Admin</NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <a href="/cart" className="relative p-2 hover:bg-muted rounded-lg transition-colors">
            <span className="text-xl">🛒</span>
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </a>
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
