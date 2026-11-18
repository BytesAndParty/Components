import { createContext, useContext } from 'react'
import type { Locale, GlobalMessages } from './types'
import { interpolate } from './types'

interface I18nContextValue {
  locale: Locale
  t: (key: keyof GlobalMessages, vars?: Record<string, string | number>) => string
  setLocale: (locale: Locale) => void
}

export const I18nContext = createContext<I18nContextValue>({
  locale: 'de',
  t: (key, vars) => interpolate(key, vars),
  setLocale: () => {},
})

export function useI18n() {
  return useContext(I18nContext)
}

export function useComponentMessages<T extends object>(
  defaults: Record<Locale, T>,
  override?: Partial<T>
): T {
  const { locale } = useI18n()
  const base = defaults[locale] ?? defaults['en']
  if (!override) return base
  return { ...base, ...override } as T
}
