import { useState } from 'react'
import {
  Component, LayoutTemplate, ShoppingBag, ArrowUpRight, Moon, Sun,
  type LucideIcon,
} from 'lucide-react'

// Each showcase is a standalone app. In dev they run on their own ports; in
// the combined Netlify build they live under subpaths of one publish dir.
interface Target {
  id: string
  label: string
  tech: string
  description: string
  href: string
  icon: LucideIcon
  // local-only apps aren't part of the deploy — shown but disabled in prod.
  localOnly?: boolean
}

const DEV = import.meta.env.DEV

const TARGETS: Target[] = [
  {
    id: 'components',
    label: 'Components',
    tech: 'Vite · React',
    description: 'Die Bausteine — Buttons, Inputs, Color-Picker, Karten. Headless-Logik, A11y, Accent-Theming.',
    href: DEV ? 'http://localhost:5171' : '/components/',
    icon: Component,
  },
  {
    id: 'sections',
    label: 'Sections',
    tech: 'Vite · React',
    description: 'Ganze Seitenabschnitte in Varianten — Hero, Features, Footer, Timeline. Mit View-Transitions.',
    href: DEV ? 'http://localhost:5174' : '/sections/',
    icon: LayoutTemplate,
  },
  {
    id: 'vendure',
    label: 'Vendure Shop',
    tech: 'Astro · Storefront',
    description: 'Der Wein-Storefront auf Vendure — Katalog, Produktdetail, Checkout. Läuft nur lokal.',
    href: 'http://localhost:5173',
    icon: ShoppingBag,
    localOnly: true,
  },
]

function applyTheme(theme: 'dark' | 'light') {
  const d = document.documentElement
  d.setAttribute('data-theme', theme)
  d.classList.toggle('dark', theme === 'dark')
  try { localStorage.setItem('atelier-theme', theme) } catch { /* noop */ }
}

export function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(
    () => (document.documentElement.getAttribute('data-theme') as 'dark' | 'light') ?? 'dark'
  )

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyTheme(next)
  }

  return (
    <div className="min-h-screen">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Theme umschalten"
        title="Theme"
        className="border-border bg-background/80 text-muted-foreground hover:text-foreground focus-visible:ring-accent/60 fixed top-4 right-4 z-10 flex items-center justify-center rounded-full border p-2 backdrop-blur-sm transition-colors focus-visible:ring-2 focus-visible:outline-none max-sm:h-11 max-sm:w-11"
      >
        {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
      </button>

      <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-start px-6 py-16 sm:justify-center sm:py-20">
        <header className="mb-14">
          <p className="text-muted-foreground mb-3 text-[11px] tracking-[0.22em] uppercase">
            Enterprise Design Engine
          </p>
          <h1 className="font-display text-5xl font-medium tracking-tight sm:text-6xl">
            __Components__
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl text-sm leading-relaxed">
            Wähl die Bühne. Drei eigenständige Showcases — die Bausteine, die
            fertigen Sections und der echte Wein-Shop.
          </p>
        </header>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TARGETS.map(t => {
            const Icon = t.icon
            // local-only targets are reachable in dev but disabled once deployed.
            const disabled = t.localOnly && !DEV

            const inner = (
              <>
                <div className="mb-5 flex items-center justify-between">
                  <Icon size={22} className={disabled ? 'text-muted-foreground/50' : 'text-muted-foreground group-hover:text-accent transition-colors'} />
                  {disabled
                    ? <span className="border-border text-muted-foreground/60 rounded-full border px-2 py-0.5 text-[9px] tracking-[0.16em] uppercase">nur lokal</span>
                    : <ArrowUpRight size={16} className="text-muted-foreground/40 group-hover:text-foreground transition-colors" />}
                </div>
                <h2 className="font-display text-2xl font-medium tracking-tight">
                  {t.label}
                </h2>
                <p className="text-muted-foreground/70 mt-0.5 text-[10px] tracking-[0.18em] uppercase">
                  {t.tech}
                </p>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {t.description}
                </p>
              </>
            )

            return (
              <li key={t.id}>
                {disabled ? (
                  <div
                    aria-disabled="true"
                    className="border-border bg-card flex h-full cursor-not-allowed flex-col rounded-2xl border p-6 opacity-55"
                  >
                    {inner}
                  </div>
                ) : (
                  <a
                    href={t.href}
                    className="group border-border bg-card hover:border-accent/60 focus-visible:ring-accent/60 flex h-full flex-col rounded-2xl border p-6 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    {inner}
                  </a>
                )}
              </li>
            )
          })}
        </ul>

        <footer className="text-muted-foreground/50 mt-14 text-xs">
          {DEV
            ? 'Dev-Modus — jeder Showcase läuft auf eigenem Port (bun run dev im jeweiligen Workspace).'
            : 'buchart58 · Artisanal Minimalism'}
        </footer>
      </main>
    </div>
  )
}
