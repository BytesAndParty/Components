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

import { useState, useEffect, useSyncExternalStore, ReactNode } from 'react'
import { I18nProvider } from '../i18n/provider'
import { en } from '../i18n/locales/en'
import { de } from '../i18n/locales/de'
import { interpolate } from '../i18n/types'
import type { Locale, GlobalMessages } from '../i18n/types'
import {
  AtelierContext,
  ATELIER_KEYS,
  type AtelierContextValue,
  type Theme,
} from './atelier-context'

const locales: Record<Locale, GlobalMessages> = { en, de }

// ── Helpers ───────────────────────────────────────────────────────────────────

function readStorage(key: string, fallback: string): string {
  try { return localStorage.getItem(key) ?? fallback } catch { return fallback }
}

function writeStorage(key: string, value: string) {
  // localStorage write may throw in private mode / Safari with strict
  // settings — silently swallow since persistence is best-effort.
  try { localStorage.setItem(key, value) } catch { /* noop */ }
}

// Nothing to subscribe to: the snapshot below is constant per environment.
const noopSubscribe = () => () => {}

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
  // False while hydrating, true on every other client render. The server has no
  // localStorage, so hydration must render the defaults; the stored values are
  // adopted only once this flips, which avoids a hydration mismatch.
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false)

  const [theme,  setThemeState]  = useState<Theme>(defaultTheme)
  const [accent, setAccentState] = useState<string>(defaultAccent)
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  // Adopt the stored values exactly once, right after hydration (or on the first client
  // render when there is none). Setting state while rendering is React's way to adjust
  // state to a changed value: it re-renders at once, so the defaults are never committed
  // on the client. From then on the state is the single source of truth.
  const [adopted, setAdopted] = useState(false)
  if (isClient && !adopted) {
    setAdopted(true)
    setThemeState(readStorage(ATELIER_KEYS.theme, defaultTheme) as Theme)
    setAccentState(readStorage(ATELIER_KEYS.accent, defaultAccent))
    setLocaleState(readStorage(ATELIER_KEYS.locale, defaultLocale) as Locale)
  }

  // Initial DOM sync once the client values are known (right after hydration, or
  // on the first render when there is none). Skipped while hydrating, otherwise the
  // defaults would overwrite what AtelierInitScript set before the first paint.
  // Subsequent updates flow through the setters below (setTheme/setAccent/setLocale),
  // so re-running this effect on every change would be redundant and would clobber
  // any imperative DOM tweaks made between renders.
  useEffect(() => {
    if (!isClient) return
    const d = document.documentElement
    d.setAttribute('data-theme',  theme)
    d.setAttribute('data-accent', accent)
    d.setAttribute('data-locale', locale)
    d.lang = locale
    d.classList.toggle('dark', theme === 'dark')
  }, [isClient]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const base = locales[locale]

  function t(key: keyof GlobalMessages, vars?: Record<string, string | number>): string {
    const str = overrides?.[key] ?? base[key] ?? en[key] ?? key
    return interpolate(str as string, vars)
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
