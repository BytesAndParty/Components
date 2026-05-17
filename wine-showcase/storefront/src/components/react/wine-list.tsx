import { useState, useEffect } from 'react'
import { useAddToCart } from '@/lib/cart-context'
import { vendureClient } from '@/lib/vendure-client'
import { GET_PRODUCTS } from '@/lib/queries'
import type { Product } from '@/lib/types'
import { Providers } from './Providers'
import { WineCard } from './wine-card'

function WineListInner({ initialProducts }: { initialProducts?: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts ?? [])
  const [loading, setLoading] = useState(!initialProducts)
  const [error, setError] = useState<string | null>(null)
  const { mutate: addToCart } = useAddToCart()

  useEffect(() => {
    if (initialProducts) return

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
        {products.map((product, idx) => (
          <WineCard
            key={product.id}
            product={product}
            variant={idx % 2 === 0 ? 'premium' : 'label'}
            featuredLabel={idx === 0 ? 'Wein des Monats' : undefined}
            onAddToCart={(variantId) => addToCart({ variantId })}
          />
        ))}
      </div>
    </div>
  )
}

export function WineListPage(props: { initialProducts?: Product[] }) {
  return (
    <Providers>
      <WineListInner {...props} />
    </Providers>
  )
}
