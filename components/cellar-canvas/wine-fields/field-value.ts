/**
 * Whether a wine-data value can go on the label: a finite number or a
 * non-blank string. `null` (common in GraphQL data), `undefined`, `''` and
 * whitespace are "no value" — inserting, templating and syncing wine fields
 * all use this one rule, so no placeholder or "null" text ever gets printed.
 */
export function hasFieldValue(value: unknown): value is string | number {
  if (typeof value === 'number') return Number.isFinite(value)
  return typeof value === 'string' && value.trim() !== ''
}
