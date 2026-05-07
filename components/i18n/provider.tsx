import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { en } from './locales/en'
import { de } from './locales/de'
import type { Locale, GlobalMessages } from './types'
import { interpolate } from './types'

const STORAGE_KEY = 'design-engine-locale'

// ── Context ───────────────────────────────────────────────────────────────────

interface I18nContextValue {
  locale: Locale
  t: (key: keyof GlobalMessages, vars?: Record<string, string | number>) => string
  setLocale: (locale: Locale) => void
}

const locales: Record<Locale, GlobalMessages> = { en, de }

function readStoredLocale(): Locale {
  if (typeof localStorage === 'undefined') return 'de'
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'en' || stored === 'de' ? stored : 'de'
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'de',
  t: (key, vars) => interpolate(de[key] ?? en[key] ?? key, vars),
  setLocale: () => {},
})

// ── Provider ──────────────────────────────────────────────────────────────────

interface I18nProviderProps {
  /** Optional controlled locale — if provided, overrides localStorage. */
  locale?: Locale
  /** Optional partial string overrides merged on top of the built-in locale. */
  overrides?: Partial<GlobalMessages>
  /** Called when locale changes (useful in controlled mode). */
  onLocaleChange?: (locale: Locale) => void
  /** localStorage key. Default: 'design-engine-locale'. */
  storageKey?: string
  children: ReactNode
}

export function I18nProvider({
  locale: localeProp,
  overrides,
  onLocaleChange,
  storageKey = STORAGE_KEY,
  children,
}: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(
    localeProp ?? readStoredLocale()
  )

  // Sync internal state with the optional controlled `locale` prop
  // when it changes externally. This is the documented uncontrolled-
  // with-controlled-override pattern; React's recommendation to "make
  // it fully controlled" would break the uncontrolled-default API
  // contract that callers rely on.
  // Intentionally omits `locale` from deps: adding it would make the
  // effect re-run on every internal locale change, defeating the
  // controlled-prop guard (the if-check would still prevent loops, but
  // we'd run for nothing).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (localeProp && localeProp !== locale) setLocaleState(localeProp)
  }, [localeProp]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync DOM on every locale change
  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.setAttribute('data-locale', locale)
  }, [locale])

  function setLocale(next: Locale) {
    setLocaleState(next)
    // Skip own localStorage write when controlled by a parent (e.g. AtelierProvider)
    if (!localeProp) {
      try { localStorage.setItem(storageKey, next) } catch { /* noop — best-effort persistence */ }
    }
    onLocaleChange?.(next)
  }

  const base = locales[locale]

  function t(key: keyof GlobalMessages, vars?: Record<string, string | number>): string {
    const str = overrides?.[key] ?? base[key] ?? en[key] ?? key
    return interpolate(str as string, vars)
  }

  return (
    <I18nContext value={{ locale, t, setLocale }}>
      {children}
    </I18nContext>
  )
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useI18n() {
  return useContext(I18nContext)
}

export function useComponentMessages<T extends Record<string, string>>(
  defaults: Record<Locale, T>,
  override?: Partial<T>
): T {
  const { locale } = useI18n()
  const base = defaults[locale] ?? defaults['en']
  if (!override) return base
  return { ...base, ...override } as T
}
