import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router'
import { Moon, Sun } from 'lucide-react'
import { sections } from './sections/registry'

const ACCENTS = ['indigo', 'amber', 'emerald', 'rose', 'bordeaux'] as const
type Accent = (typeof ACCENTS)[number]

export function Layout() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [accent, setAccent] = useState<Accent>('indigo')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    document.documentElement.dataset.accent = accent
  }, [accent])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-6">
          <Link to="/" className="font-display text-lg font-medium tracking-tight">
            Sections <span className="text-muted-foreground">/ Showcase</span>
          </Link>

          <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
            {sections.map(s => (
              <NavLink
                key={s.id}
                to={`/${s.id}`}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                {s.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full border border-border p-1">
              {ACCENTS.map(a => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAccent(a)}
                  aria-label={`Accent ${a}`}
                  aria-pressed={accent === a}
                  className={`h-4 w-4 rounded-full transition-transform ${
                    accent === a ? 'scale-110 ring-2 ring-offset-2 ring-offset-background ring-foreground/30' : ''
                  }`}
                  style={{ background: accentSwatch(a) }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
              aria-label="Theme umschalten"
              className="rounded-md border border-border p-2 text-muted-foreground hover:text-foreground"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}

function accentSwatch(a: Accent): string {
  switch (a) {
    case 'indigo':   return 'oklch(0.585 0.233 277)'
    case 'amber':    return 'oklch(0.555 0.146 49)'
    case 'emerald':  return 'oklch(0.511 0.086 186.4)'
    case 'rose':     return 'oklch(0.585 0.22 5)'
    case 'bordeaux': return 'oklch(0.42 0.15 18)'
  }
}
