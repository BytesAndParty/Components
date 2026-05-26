export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

// Vendure slugs are admin-input. Reject anything that isn't lowercase kebab-case
// to keep them out of `href`/route params. Blocks `javascript:`, `data:`,
// path traversal, and unicode-shenanigans by allow-list rather than block-list.
const WINE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function isValidWineSlug(slug: unknown): slug is string {
  return typeof slug === 'string'
    && slug.length > 0
    && slug.length <= 100
    && WINE_SLUG_PATTERN.test(slug)
}

export function wineHref(slug: unknown): string {
  return isValidWineSlug(slug) ? `/wine/${slug}` : '/'
}
