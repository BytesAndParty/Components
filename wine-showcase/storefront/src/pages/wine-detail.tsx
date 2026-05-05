import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import { useCart } from '@/lib/cart-context'
import { vendureClient } from '@/lib/vendure-client'
import { GET_PRODUCT } from '@/lib/queries'
import type { Product } from '@/lib/types'

function formatPrice(cents: number): string {
  return `€ ${(cents / 100).toFixed(2).replace('.', ',')}`
}

export function WineDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    if (!slug) return
    vendureClient.query(GET_PRODUCT, { slug }).toPromise().then(result => {
      setProduct(result.data?.product ?? null)
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">Lade Produkt...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Wein nicht gefunden</h2>
        <Link to="/" className="text-accent hover:underline">← Zurück zur Übersicht</Link>
      </div>
    )
  }

  const variant = product.variants[0]
  const cf = product.customFields

  const details = [
    { label: 'Rebsorte', value: cf.rebsorte },
    { label: 'Region', value: cf.region },
    { label: 'Jahrgang', value: cf.jahrgang?.toString() },
    { label: 'Alkohol', value: cf.alkoholgehalt ? `${cf.alkoholgehalt} % vol.` : null },
    { label: 'Restzucker', value: cf.restzucker ? `${cf.restzucker} g/l` : null },
    { label: 'Säure', value: cf.saeure ? `${cf.saeure} g/l` : null },
    { label: 'Serviertemp.', value: cf.serviertemperatur },
    { label: 'Geschmack', value: cf.geschmacksprofil },
  ].filter(d => d.value)

  return (
    <div className="max-w-4xl mx-auto">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground transition-colors">Weine</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-muted rounded-2xl aspect-square flex items-center justify-center text-[120px]">
          {cf.rebsorte?.toLowerCase().includes('rosé') ? '🌸' :
           cf.rebsorte?.toLowerCase().includes('rot') || cf.rebsorte?.toLowerCase().includes('blaufränkisch') ? '🍷' :
           '🥂'}
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          
          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-bold">
              {variant ? formatPrice(variant.priceWithTax) : '—'}
            </span>
            <span className="text-sm text-muted-foreground">inkl. MwSt.</span>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <button
            onClick={() => variant && addToCart(variant.id)}
            disabled={!variant}
            className="w-full py-4 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            In den Warenkorb
          </button>

          <div className="border rounded-xl divide-y">
            <div className="px-4 py-3 bg-muted/50 font-semibold text-sm rounded-t-xl">
              Produktdetails
            </div>
            {details.map((d) => (
              <div key={d.label} className="px-4 py-2 flex justify-between text-sm">
                <span className="text-muted-foreground">{d.label}</span>
                <span className="font-medium">{d.value}</span>
              </div>
            ))}
          </div>

          {cf.speiseempfehlung && (
            <div className="p-4 border rounded-xl space-y-2">
              <h3 className="font-semibold text-sm">🍽️ Speiseempfehlung</h3>
              <p className="text-sm text-muted-foreground">{cf.speiseempfehlung}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
