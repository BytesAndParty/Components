export type Locale = 'de' | 'en' | 'pl'

export type { GlobalMessages } from './locales/en'

/** Shape that every component's messages object must satisfy.
 *  Constraint is `object` (not `Record<string, string>`) so that `interface`-defined
 *  message types are accepted — they don't carry an implicit index signature even when
 *  every field is `string`. Value-level safety still comes from the concrete `T`.
 *  `de` and `en` are required; other locales are optional and fall back to `en`
 *  (see `useComponentMessages`), so a component without `pl` messages shows English. */
export type ComponentMessages<T extends object> = {
  readonly de: T
  readonly en: T
} & {
  readonly [L in Exclude<Locale, 'de' | 'en'>]?: T
}

/** Interpolates {placeholder} variables into a translated string. */
export function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str
  return str.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`))
}

/** Word forms per CLDR plural category. Only `one` and `other` are universal. */
export type PluralForms = { one: string; few?: string; many?: string; other: string }

/**
 * Picks the word form for `count` via `Intl.PluralRules(locale)`; a missing form falls back to `other`.
 * A plain string is returned as is, so a message stays a string where the count does not change
 * the wording (de, en) and only locales that need it carry plural forms.
 *
 * Polish uses four categories (CLDR): `one` = 1, `few` = 2–4, 22–24, 32–34 … (not 12–14),
 * `many` = 0, 5–21, 25–31 …, `other` = fractions. Example: 1 miejsce, 2 miejsca, 5 miejsc, 22 miejsca.
 */
export function pluralize(locale: Locale, count: number, forms: string | PluralForms): string {
  if (typeof forms === 'string') return forms
  const category = new Intl.PluralRules(locale).select(count)
  if (category === 'one' || category === 'few' || category === 'many') return forms[category] ?? forms.other
  return forms.other
}
