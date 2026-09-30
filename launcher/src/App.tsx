import { useState } from 'react'
import {
  Component, LayoutTemplate, ShoppingBag, BookOpen, Moon, Sun,
  type LucideIcon,
} from 'lucide-react'
import { LauncherCard } from './components/LauncherCard'
import { ReferencePage } from './components/ReferencePage'

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

const REFERENCE_TARGET = {
  label: 'Referenz',
  tech: 'Links · Embed',
  description: 'Linksammlung, eingebettete Components und eine grobe Sections-Vorauswahl — für den Aufbau der offiziellen Seite.',
  icon: BookOpen,
}

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
  const [view, setView] = useState<'grid' | 'reference'>('grid')

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
        className="border-border bg-background/80 text-muted-foreground hover:text-foreground focus-visible:ring-ring fixed top-4 right-4 z-10 flex items-center justify-center rounded-full border p-2 backdrop-blur-sm transition-colors focus-visible:ring-2 focus-visible:outline-none max-sm:h-11 max-sm:w-11"
      >
        {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
      </button>

      {view === 'reference' ? (
        <ReferencePage onBack={() => setView('grid')} />
      ) : (
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-start px-6 py-16 sm:justify-center sm:py-20">
        <header className="mb-14">
          <p className="text-muted-foreground mb-3 text-[11px] tracking-[0.22em] uppercase">
            Enterprise Design Engine
          </p>
          <h1 className="font-display text-5xl font-medium tracking-tight sm:text-6xl">
            __Components__
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl text-sm leading-relaxed">
            Wähl die Bühne. Eigenständige Showcases für die Bausteine, die
            fertigen Sections und der echte Wein-Shop — plus eine Referenz für
            den Seitenaufbau.
          </p>
        </header>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TARGETS.map(t => (
            <li key={t.id}>
              {t.localOnly && !DEV ? (
                // local-only targets are reachable in dev but disabled once deployed.
                <LauncherCard title={t.label} tech={t.tech} description={t.description} icon={t.icon} disabled badge="nur lokal" />
              ) : (
                <LauncherCard title={t.label} tech={t.tech} description={t.description} icon={t.icon} href={t.href} />
              )}
            </li>
          ))}

          <li>
            <LauncherCard
              title={REFERENCE_TARGET.label}
              tech={REFERENCE_TARGET.tech}
              description={REFERENCE_TARGET.description}
              icon={REFERENCE_TARGET.icon}
              onClick={() => setView('reference')}
            />
          </li>
        </ul>

        <footer className="text-muted-foreground/50 mt-14 text-xs">
          {DEV
            ? 'Dev-Modus — jeder Showcase läuft auf eigenem Port (bun run dev im jeweiligen Workspace).'
            : 'buchart58 · Artisanal Minimalism'}
        </footer>
      </main>
      )}
    </div>
  )
}
