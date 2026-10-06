export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

// Astro `base`: '/shop' im Netlify-Deploy (DEPLOY_SUBPATH), lokal '/'. Ohne
// `trailingSlash`-Option reicht Astro den Wert unverändert durch, BASE_URL kann
// also mit oder ohne Slash am Ende kommen. Deshalb hier normalisieren.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

/** Interner Pfad mit Astro-`base`: `withBase('/cart')` → `/shop/cart` bzw. lokal `/cart`. */
export function withBase(path: `/${string}`): string {
  return `${BASE}${path}`
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
  return withBase(isValidWineSlug(slug) ? `/wine/${slug}` : '/')
}
