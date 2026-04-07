import { Link, Outlet, useLocation } from 'react-router'
import { ToastProvider } from '@components/toast/toast'
import { AnimatedThemeToggler } from '@components/animated-theme-toggler/animated-theme-toggler'
import { AccentSwitcher } from '@components/accent-switcher/accent-switcher'
import { palettes, groups } from './data'

export function Layout() {
  const location = useLocation()
  const isIndex = location.pathname === '/'
  const currentGroup = groups.find(g => g.path === location.pathname)

  return (
    <ToastProvider placement="bottom-right">
      <div className="max-w-3xl mx-auto py-12 px-6">
        <header className="mb-12 flex justify-between items-start">
          <div>
            <Link to="/" viewTransition className="no-underline">
              <h1 className="text-3xl font-bold tracking-tight text-foreground hover:text-accent transition-colors">
                Components
              </h1>
            </Link>
            <p className="text-muted-foreground mt-2">
              {isIndex
                ? 'Interactive showcase of the component collection.'
                : currentGroup?.description}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <AnimatedThemeToggler />
            <AccentSwitcher palettes={palettes} defaultPalette="indigo" />
          </div>
        </header>

        {!isIndex && (
          <nav className="mb-8">
            <Link
              to="/"
              viewTransition
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              ← Back to overview
            </Link>
          </nav>
        )}

        <main style={{ viewTransitionName: 'page-content' }}>
          <Outlet />
        </main>
      </div>
    </ToastProvider>
  )
}
