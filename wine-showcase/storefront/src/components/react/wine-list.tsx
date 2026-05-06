import { useState, useEffect } from 'react'
import { useCart } from '@/lib/cart-context'
import { vendureClient } from '@/lib/vendure-client'
import { GET_PRODUCTS } from '@/lib/queries'
import type { Product } from '@/lib/types'

function formatPrice(cents: number): string {
  return `€ ${(cents / 100).toFixed(2).replace('.', ',')}`
}

/**
 * Diese React-Komponente bekommt die 'initialProducts' direkt von Astro (Build-Time).
 * Wenn diese vorhanden sind, zeigt sie diese sofort an, ohne im Browser neu zu laden.
 */
export function WineListPage({ initialProducts }: { initialProducts?: Product[] }) {
  // State wird mit den statischen Daten von Astro vor-initialisiert
  const [products, setProducts] = useState<Product[]>(initialProducts ?? [])
  const [loading, setLoading] = useState(!initialProducts)
  const [error, setError] = useState<string | null>(null)
  const { addToCart } = useCart()

  useEffect(() => {
    // Wenn wir bereits Daten von Astro haben, müssen wir im Browser nichts mehr tun.
    if (initialProducts) return 
    
    // Fallback: Falls die Komponente ohne Daten geladen wird, laden wir sie hier nach.
    vendureClient.query(GET_PRODUCTS, {}).toPromise().then(result => {
      if (result.error) {
        setError('Vendure Server nicht erreichbar.')
        setLoading(false)
        return
      }
      setProducts(result.data?.products?.items ?? [])
      setLoading(false)
    })
  }, [initialProducts])

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground text-lg">Lade Weine...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-20 text-center max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">Fehler</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <div className="p-4 bg-muted rounded-lg text-left text-sm font-mono">
          cd wine-showcase/server && bun run dev
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <section className="text-center py-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Unsere Weine</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Handverlesen aus den besten Lagen Österreichs.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => {
          const variant = product.variants[0]
          const cf = product.customFields

          return (
            <div
              key={product.id}
              className="group relative bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[4/3] bg-muted flex items-center justify-center text-6xl">
                {cf.rebsorte?.toLowerCase().includes('rosé') ? '🌸' :
                 cf.rebsorte?.toLowerCase().includes('rot') || cf.rebsorte?.toLowerCase().includes('blaufränkisch') ? '🍷' :
                 '🥂'}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">
                    <a href={`/wine/${product.slug}`} className="hover:text-accent transition-colors">
                      {product.name}
                    </a>
                  </h3>
                  <span className="font-bold text-lg">
                    {variant ? formatPrice(variant.priceWithTax) : '—'}
                  </span>
                </div>

                <div className="text-sm text-muted-foreground space-x-2 mb-4">
                  {cf.rebsorte && <span>{cf.rebsorte}</span>}
                  {cf.jahrgang && <span>• {cf.jahrgang}</span>}
                  {cf.region && <span>• {cf.region}</span>}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-6">
                  {cf.geschmacksprofil || product.description}
                </p>

                <button
                  onClick={() => variant && addToCart(variant.id)}
                  disabled={!variant}
                  className="w-full py-2 px-4 bg-foreground text-background font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  In den Warenkorb
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
