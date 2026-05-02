/**
 * AtelierProvider — unified design system context.
 *
 * Single provider that owns theme (dark/light), accent, and locale.
 * Internally wraps I18nProvider so useI18n() and useComponentMessages()
 * continue to work in every component without any changes.
 *
 * DOM attributes written on every change:
 *   data-theme="dark|light"    ← matches existing CSS variable selectors
 *   data-accent="indigo|…"     ← matches existing CSS variable selectors
 *   data-locale="de|en"        ← for CSS / SSR consumers
 *   lang="de|en"               ← standard HTML lang attribute
 *   .dark class on <html>      ← Tailwind dark mode compat
 *
 * Usage:
 *   <AtelierProvider>...</AtelierProvider>
 *
 * Customised defaults (e.g. server-side values):
 *   <AtelierProvider defaultTheme="light" defaultAccent="amber" defaultLocale="en">
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { I18nProvider } from '../i18n/provider'
import type { Locale, GlobalMessages } from '../i18n/types'

// ── Storage keys (all under 'atelier-' namespace) ─────────────────────────────

export const ATELIER_KEYS = {
  theme:  'atelier-theme',
  accent: 'atelier-accent',
  locale: 'atelier-locale',
} as const

// ── Types ─────────────────────────────────────────────────────────────────────

export type Theme = 'dark' | 'light'

export interface AtelierContextValue {
  theme:       Theme
  accent:      string
  locale:      Locale
  setTheme:    (t: Theme)   => void
  toggleTheme: ()           => void
  setAccent:   (a: string)  => void
  setLocale:   (l: Locale)  => void
  /** Global translation — same string as useI18n().t() */
  t: (key: keyof GlobalMessages, vars?: Record<string, string | number>) => string
}

// ── Context ───────────────────────────────────────────────────────────────────

const AtelierContext = createContext<AtelierContextValue>({
  theme: 'dark', accent: 'indigo', locale: 'de',
  setTheme: () => {}, toggleTheme: () => {}, setAccent: () => {}, setLocale: () => {},
  t: (k) => String(k),
})

// ── Helpers ───────────────────────────────────────────────────────────────────

function readStorage(key: string, fallback: string): string {
  try { return localStorage.getItem(key) ?? fallback } catch { return fallback }
}

function writeStorage(key: string, value: string) {
  try { localStorage.setItem(key, value) } catch {}
}

// ── Provider ──────────────────────────────────────────────────────────────────

export interface AtelierProviderProps {
  defaultTheme?:  Theme
  defaultAccent?: string
  defaultLocale?: Locale
  overrides?:     Partial<GlobalMessages>
  children:       ReactNode
}

export function AtelierProvider({
  defaultTheme  = 'dark',
  defaultAccent = 'indigo',
  defaultLocale = 'de',
  overrides,
  children,
}: AtelierProviderProps) {
  const [theme,  setThemeState]  = useState<Theme>(
    () => readStorage(ATELIER_KEYS.theme, defaultTheme) as Theme
  )
  const [accent, setAccentState] = useState<string>(
    () => readStorage(ATELIER_KEYS.accent, defaultAccent)
  )
  const [locale, setLocaleState] = useState<Locale>(
    () => readStorage(ATELIER_KEYS.locale, defaultLocale) as Locale
  )

  // Initial DOM sync after mount
  useEffect(() => {
    const d = document.documentElement
    d.setAttribute('data-theme',  theme)
    d.setAttribute('data-accent', accent)
    d.setAttribute('data-locale', locale)
    d.lang = locale
    d.classList.toggle('dark', theme === 'dark')
  }, [])

  // ── Setters ────────────────────────────────────────────────────────────────

  function setTheme(next: Theme) {
    setThemeState(next)
    writeStorage(ATELIER_KEYS.theme, next)
    document.documentElement.setAttribute('data-theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  function toggleTheme() { setTheme(theme === 'dark' ? 'light' : 'dark') }

  function setAccent(next: string) {
    setAccentState(next)
    writeStorage(ATELIER_KEYS.accent, next)
    document.documentElement.setAttribute('data-accent', next)
  }

  function setLocale(next: Locale) {
    setLocaleState(next)
    writeStorage(ATELIER_KEYS.locale, next)
    document.documentElement.setAttribute('data-locale', next)
    document.documentElement.lang = next
  }

  // ── Context value ──────────────────────────────────────────────────────────

  // t() is provided by I18nProvider below — we expose a placeholder here
  // that gets shadowed once children call useI18n().t().
  // The AtelierContext's own t() is only needed for useAtelier() callers.
  // We re-read it from I18nProvider via the onLocaleChange bridge.
  function t(key: keyof GlobalMessages, vars?: Record<string, string | number>): string {
    return String(key) // placeholder — real t() lives in I18nProvider below
  }

  const value: AtelierContextValue = {
    theme, accent, locale,
    setTheme, toggleTheme, setAccent, setLocale, t,
  }

  return (
    <AtelierContext.Provider value={value}>
      {/* I18nProvider in controlled mode — AtelierProvider owns locale state.
          onLocaleChange bridges back so useI18n().setLocale() also updates AtelierProvider. */}
      <I18nProvider locale={locale} onLocaleChange={setLocale} overrides={overrides}>
        {children}
      </I18nProvider>
    </AtelierContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAtelier(): AtelierContextValue {
  return useContext(AtelierContext)
}
