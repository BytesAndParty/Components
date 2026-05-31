export type Locale = 'de' | 'en'

export type { GlobalMessages } from './locales/en'

/** Shape that every component's messages object must satisfy.
 *  Constraint is `object` (not `Record<string, string>`) so that `interface`-defined
 *  message types are accepted — they don't carry an implicit index signature even when
 *  every field is `string`. Value-level safety still comes from the concrete `T`. */
export type ComponentMessages<T extends object> = {
  readonly [L in Locale]: T
}

/** Interpolates {placeholder} variables into a translated string. */
export function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str
  return str.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`))
}
