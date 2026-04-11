import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import { useCart } from '@/lib/cart-context'
import { vendureClient } from '@/lib/vendure-client'
import { GET_PRODUCT } from '@/lib/queries'
import type { Product } from '@/lib/types'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { ProductTag, ProductTagGroup } from '@/components/product-tag'
import { Rating } from '@/components/rating'
import { MagneticButton } from '@/components/magnetic-button'
import { toast } from '@/components/toast'

function formatPrice(cents: number): string {
  return `€ ${(cents / 100).toFixed(2).replace('.', ',')}`
}

function getWineRating(slug: string): number {
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash + slug.charCodeAt(i)) | 0
  }
  return 3 + (Math.abs(hash) % 3)
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
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <p className="text-muted-foreground">Lade Produkt...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <h2 className="text-xl font-semibold text-foreground mb-2">Wein nicht gefunden</h2>
        <Link to="/" style={{ color: 'var(--accent)' }}>← Zurück zur Übersicht</Link>
      </div>
    )
  }

  const variant = product.variants[0]
  const cf = product.customFields
  const rating = getWineRating(product.slug)

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
    <div>
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link to="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Weine</Link>
        <span>›</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
        {/* Left: Image */}
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            height: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '96px',
          }}
        >
          {cf.rebsorte?.toLowerCase().includes('rosé') ? '🌸' :
           cf.rebsorte?.toLowerCase().includes('blaufränkisch') || cf.rebsorte?.toLowerCase().includes('zweigelt') ? '🍷' :
           cf.rebsorte?.toLowerCase().includes('cuvée') ? '🍷' :
           '🥂'}
        </div>

        {/* Right: Details */}
        <div>
          {/* Tags */}
          <ProductTagGroup className="mb-4">
            {cf.jahrgang && cf.jahrgang >= 2023 && <ProductTag variant="new" />}
            {cf.auszeichnungen && cf.auszeichnungen.length > 0 && <ProductTag variant="award" label="Prämiert" />}
            {variant && variant.priceWithTax >= 4000 && <ProductTag variant="limited" />}
          </ProductTagGroup>

          <h1 className="text-2xl font-bold text-foreground" style={{ marginBottom: '8px' }}>
            {product.name}
          </h1>

          <Rating value={rating} readOnly size={20} activeColor="var(--accent)" />

          <p className="text-muted-foreground mt-4" style={{ lineHeight: 1.7 }}>
            {product.description}
          </p>

          {/* Price */}
          <div className="mt-6" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="text-3xl font-bold text-foreground">
              {variant ? formatPrice(variant.priceWithTax) : '—'}
            </span>
            <span className="text-sm text-muted-foreground">inkl. MwSt.</span>
          </div>

          {/* Add to Cart */}
          <div className="mt-6" style={{ display: 'flex', gap: '12px' }}>
            <AddToCartButton
              bgColor="var(--accent)"
              style={{ flex: 1, padding: '12px 28px' }}
              onClick={() => {
                if (variant) {
                  addToCart(variant.id)
                  toast({
                    title: 'In den Warenkorb',
                    description: product.name,
                    variant: 'success',
                  })
                }
              }}
            >
              In den Warenkorb
            </AddToCartButton>
          </div>

          {/* Details Table */}
          <div
            className="mt-8"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <h3 className="text-sm font-semibold text-foreground" style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
              Weindetails
            </h3>
            <div>
              {details.map((d, i) => (
                <div
                  key={d.label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 16px',
                    borderBottom: i < details.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <span className="text-sm text-muted-foreground">{d.label}</span>
                  <span className="text-sm text-foreground font-medium">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Speiseempfehlung */}
          {cf.speiseempfehlung && (
            <div
              className="mt-4"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <h3 className="text-sm font-semibold text-foreground mb-2">🍽️ Speiseempfehlung</h3>
              <p className="text-sm text-muted-foreground">{cf.speiseempfehlung}</p>
            </div>
          )}

          {/* Auszeichnungen */}
          {cf.auszeichnungen && cf.auszeichnungen.length > 0 && (
            <div
              className="mt-4"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <h3 className="text-sm font-semibold text-foreground mb-2">🏆 Auszeichnungen</h3>
              <p className="text-sm text-muted-foreground">{cf.auszeichnungen}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
