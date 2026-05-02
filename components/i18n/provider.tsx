import { createContext, useContext, ReactNode } from 'react'
import { en } from './locales/en'
import { de } from './locales/de'
import type { Locale, GlobalMessages } from './types'
import { interpolate } from './types'

// ── Context ───────────────────────────────────────────────────────────────────

interface I18nContextValue {
  locale: Locale
  t: (key: keyof GlobalMessages, vars?: Record<string, string | number>) => string
  setLocale?: (locale: Locale) => void
}

const locales: Record<Locale, GlobalMessages> = { en, de }

const I18nContext = createContext<I18nContextValue>({
  locale: 'de',
  t: (key, vars) => interpolate(de[key] ?? en[key] ?? key, vars),
})

// ── Provider ──────────────────────────────────────────────────────────────────

interface I18nProviderProps {
  locale: Locale
  /** Optional partial overrides — merged on top of the built-in locale strings. */
  overrides?: Partial<GlobalMessages>
  onLocaleChange?: (locale: Locale) => void
  children: ReactNode
}

export function I18nProvider({ locale, overrides, onLocaleChange, children }: I18nProviderProps) {
  const base = locales[locale]

  function t(key: keyof GlobalMessages, vars?: Record<string, string | number>): string {
    const str = overrides?.[key] ?? base[key] ?? en[key] ?? key
    return interpolate(str as string, vars)
  }

  return (
    <I18nContext value={{ locale, t, setLocale: onLocaleChange }}>
      {children}
    </I18nContext>
  )
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

/** Access global translations. Must be inside I18nProvider. */
export function useI18n() {
  return useContext(I18nContext)
}

/**
 * Hook for components with their own message shapes (Option C).
 * Merges component-level defaults with any consumer override from the `messages` prop.
 *
 * @example
 * const m = useComponentMessages(defaultMessages, props.messages)
 * // m.deleteLayer → 'Ebene löschen' (de) or consumer override
 */
export function useComponentMessages<T extends Record<string, string>>(
  defaults: Record<Locale, T>,
  override?: Partial<T>
): T {
  const { locale } = useI18n()
  const base = defaults[locale] ?? defaults['en']
  if (!override) return base
  return { ...base, ...override } as T
}
