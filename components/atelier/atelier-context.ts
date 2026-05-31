import { createContext, useContext } from 'react'
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

export const AtelierContext = createContext<AtelierContextValue>({
  theme: 'dark', accent: 'indigo', locale: 'de',
  setTheme: () => {}, toggleTheme: () => {}, setAccent: () => {}, setLocale: () => {},
  t: (k) => String(k),
})

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAtelier(): AtelierContextValue {
  return useContext(AtelierContext)
}
