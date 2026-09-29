/**
 * Build-time wine data for the Cellar Canvas designer showcase.
 *
 * Mirrors the pattern `vendure-showcase/storefront` already uses (Astro's
 * `getStaticPaths` queries Vendure at build time — see
 * `vendure-showcase/storefront/src/pages/wine/[slug].astro`). This showcase
 * is a plain Vite SPA with no equivalent build-time hook, so the fetch runs
 * as a script chained in front of `dev`/`build` instead (see package.json).
 *
 * Always writes `src/data/wines.json`: real Vendure product data when the
 * shop-api is reachable, a small fallback set otherwise (Netlify's build
 * never reaches localhost:3000, and the Vendure server isn't always running
 * locally either) — the showcase must never fail to build for lack of a
 * backend.
 */
import { GraphQLClient } from 'graphql-request'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const SHOP_API_URL = process.env.VENDURE_SHOP_API_URL ?? 'http://localhost:3000/shop-api'
const OUTPUT_PATH = fileURLToPath(new URL('../src/data/wines.json', import.meta.url))
const FETCH_TIMEOUT_MS = 3000

const GET_PRODUCTS = `
  query GetProducts {
    products {
      items {
        name
        slug
        customFields {
          jahrgang
          rebsorte
          region
          alkoholgehalt
        }
      }
    }
  }
`

interface VendureProduct {
  name: string
  slug: string
  customFields: {
    jahrgang: number | null
    rebsorte: string | null
    region: string | null
    alkoholgehalt: number | null
  }
}

interface WineFieldValues {
  name?: string
  vintage?: string | number
  alcoholPercent?: string | number
  volumeMl?: string | number
  region?: string
  grapes?: string
  producer?: string
  countryOfOrigin?: string
  allergenNote?: string
  nutritionalInfoUrl?: string
}

// EU-mandatory label fields the Vendure product schema doesn't carry (see
// WineCustomFields in vendure-showcase/storefront/src/lib/types.ts) — filled
// with defaults matching the brand rather than left blank on the label.
const PRODUCER = 'Weingut Buchart58'
const COUNTRY = 'Österreich'
const ALLERGEN_NOTE = 'enthält Sulfite'
const VOLUME_ML = 750

function mapProduct(p: VendureProduct): WineFieldValues {
  return {
    name: p.name,
    vintage: p.customFields.jahrgang ?? undefined,
    alcoholPercent: p.customFields.alkoholgehalt !== null ? `${p.customFields.alkoholgehalt}%` : undefined,
    region: p.customFields.region ?? undefined,
    grapes: p.customFields.rebsorte ?? undefined,
    volumeMl: VOLUME_ML,
    producer: PRODUCER,
    countryOfOrigin: COUNTRY,
    allergenNote: ALLERGEN_NOTE,
    nutritionalInfoUrl: `https://buchart58.at/wine/${p.slug}`,
  }
}

const FALLBACK_WINES: WineFieldValues[] = [
  {
    name: 'Grüner Veltliner Ried Loibenberg',
    vintage: 2022,
    alcoholPercent: '12.5%',
    volumeMl: VOLUME_ML,
    region: 'Wachau',
    grapes: 'Grüner Veltliner',
    producer: PRODUCER,
    countryOfOrigin: COUNTRY,
    allergenNote: ALLERGEN_NOTE,
    nutritionalInfoUrl: 'https://buchart58.at/wine/gruener-veltliner-loibenberg',
  },
  {
    name: 'Blaufränkisch Ried Gabarinza',
    vintage: 2021,
    alcoholPercent: '13.5%',
    volumeMl: VOLUME_ML,
    region: 'Mittelburgenland',
    grapes: 'Blaufränkisch',
    producer: PRODUCER,
    countryOfOrigin: COUNTRY,
    allergenNote: ALLERGEN_NOTE,
    nutritionalInfoUrl: 'https://buchart58.at/wine/blaufraenkisch-gabarinza',
  },
  {
    name: 'Riesling Ried Achleiten',
    vintage: 2023,
    alcoholPercent: '12%',
    volumeMl: VOLUME_ML,
    region: 'Wachau',
    grapes: 'Riesling',
    producer: PRODUCER,
    countryOfOrigin: COUNTRY,
    allergenNote: ALLERGEN_NOTE,
    nutritionalInfoUrl: 'https://buchart58.at/wine/riesling-achleiten',
  },
  {
    name: 'Zweigelt Klassik',
    vintage: 2023,
    alcoholPercent: '13%',
    volumeMl: VOLUME_ML,
    region: 'Niederösterreich',
    grapes: 'Zweigelt',
    producer: PRODUCER,
    countryOfOrigin: COUNTRY,
    allergenNote: ALLERGEN_NOTE,
    nutritionalInfoUrl: 'https://buchart58.at/wine/zweigelt-klassik',
  },
]

async function fetchFromVendure(): Promise<WineFieldValues[] | null> {
  const client = new GraphQLClient(SHOP_API_URL)
  const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), FETCH_TIMEOUT_MS))
  try {
    const result = await Promise.race([
      client.request<{ products: { items: VendureProduct[] } }>(GET_PRODUCTS),
      timeout,
    ])
    if (!result) return null
    const items = result.products.items
    return items.length ? items.map(mapProduct) : null
  } catch {
    return null
  }
}

const fetched = await fetchFromVendure()
const wines = fetched ?? FALLBACK_WINES

mkdirSync(dirname(OUTPUT_PATH), { recursive: true })
writeFileSync(OUTPUT_PATH, JSON.stringify(wines, null, 2) + '\n')
console.log(`[fetch-wines] wrote ${wines.length} wines to src/data/wines.json (source: ${fetched ? 'vendure' : 'fallback'})`)
