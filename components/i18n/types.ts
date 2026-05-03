export type Locale = 'de' | 'en'

export type { GlobalMessages } from './locales/en'

/** Shape that every component's messages object must satisfy. */
export type ComponentMessages<T extends Record<string, string>> = {
  readonly [L in Locale]: T
}

/** Interpolates {placeholder} variables into a translated string. */
export function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str
  return str.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`))
}
