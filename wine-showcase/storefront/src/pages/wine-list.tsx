import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useCart } from '@/lib/cart-context'
import { vendureClient } from '@/lib/vendure-client'
import { GET_PRODUCTS } from '@/lib/queries'
import type { Product } from '@/lib/types'
import { GlowCard } from '@/components/glow-card'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { ProductTag, ProductTagGroup } from '@/components/product-tag'
import { Rating } from '@/components/rating'
import { AuroraText } from '@/components/aurora-text'
import { TextScramble } from '@/components/text-scramble'
import { toast } from '@/components/toast'

function formatPrice(cents: number): string {
  return `€ ${(cents / 100).toFixed(2).replace('.', ',')}`
}

function getWineTags(product: Product) {
  const tags: { variant: 'new' | 'sale' | 'bestseller' | 'limited' | 'organic' | 'award'; label?: string }[] = []
  const cf = product.customFields

  if (cf.jahrgang && cf.jahrgang >= 2023) tags.push({ variant: 'new' })
  if (cf.auszeichnungen && cf.auszeichnungen.length > 0) tags.push({ variant: 'award', label: 'Prämiert' })
  if (cf.rebsorte?.toLowerCase().includes('bio')) tags.push({ variant: 'organic' })

  // Simulate some tags based on price
  const price = product.variants[0]?.priceWithTax ?? 0
  if (price >= 4000) tags.push({ variant: 'limited' })
  if (price <= 1300) tags.push({ variant: 'bestseller' })

  return tags
}

// Simulate random review scores per product (deterministic from slug)
function getWineRating(slug: string): number {
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash + slug.charCodeAt(i)) | 0
  }
  return 3 + (Math.abs(hash) % 3) // 3-5
}

export function WineListPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addToCart } = useCart()

  useEffect(() => {
    vendureClient.query(GET_PRODUCTS, {}).toPromise().then(result => {
      if (result.error) {
        setError('Vendure Server nicht erreichbar. Bitte starte den Server mit: cd wine-showcase/server && bun run dev')
        setLoading(false)
        return
      }
      setProducts(result.data?.products?.items ?? [])
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{ fontSize: '32px', marginBottom: '16px' }}>🍷</div>
        <p className="text-muted-foreground">Weine werden geladen...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Vendure Server nicht erreichbar</h2>
        <p className="text-muted-foreground mb-6" style={{ maxWidth: '500px', margin: '0 auto 24px' }}>
          {error}
        </p>
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px',
            maxWidth: '500px',
            margin: '0 auto',
            textAlign: 'left',
          }}
        >
          <p className="text-sm text-foreground font-medium mb-2">Quick Start:</p>
          <code className="text-xs text-muted-foreground" style={{ display: 'block', whiteSpace: 'pre-wrap' }}>
{`cd wine-showcase/server
bun install
bun run dev          # Startet Vendure
bun run seed         # Erstellt Wein-Produkte

# In einem neuen Terminal:
cd wine-showcase/storefront
bun install
bun run dev          # Startet Storefront`}
          </code>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🍇</div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Keine Weine gefunden</h2>
        <p className="text-muted-foreground mb-4">
          Führe den Seed-Befehl aus, um Testdaten anzulegen:
        </p>
        <code className="text-sm text-accent">cd wine-showcase/server && bun run seed</code>
      </div>
    )
  }

  return (
    <div>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '40px 0 48px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '8px' }}>
          <AuroraText colors={['#d97706', '#b45309', '#92400e', '#f59e0b']}>
            Unsere Weine
          </AuroraText>
        </h1>
        <p className="text-muted-foreground" style={{ fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
          <TextScramble text="Handverlesen aus den besten Lagen Österreichs" speed={25} />
        </p>
      </div>

      {/* Product Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px',
        }}
      >
        {products.map((product) => {
          const variant = product.variants[0]
          const tags = getWineTags(product)
          const rating = getWineRating(product.slug)
          const cf = product.customFields

          return (
            <GlowCard
              key={product.id}
              glowColor="var(--accent)"
              style={{ cursor: 'default' }}
            >
              <div style={{ padding: '24px' }}>
                {/* Tags */}
                {tags.length > 0 && (
                  <ProductTagGroup className="mb-3">
                    {tags.map((tag, i) => (
                      <ProductTag key={i} variant={tag.variant} label={tag.label} />
                    ))}
                  </ProductTagGroup>
                )}

                {/* Wine emoji as placeholder */}
                <div
                  style={{
                    width: '100%',
                    height: '140px',
                    background: 'var(--muted)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    marginBottom: '16px',
                  }}
                >
                  {cf.rebsorte?.toLowerCase().includes('rosé') ? '🌸' :
                   cf.rebsorte?.toLowerCase().includes('blaufränkisch') || cf.rebsorte?.toLowerCase().includes('zweigelt') && !cf.rebsorte?.toLowerCase().includes('rosé') ? '🍷' :
                   cf.rebsorte?.toLowerCase().includes('cuvée') ? '🍷' :
                   '🥂'}
                </div>

                {/* Product Info */}
                <Link
                  to={`/wine/${product.slug}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <h3
                    className="text-foreground font-semibold"
                    style={{
                      fontSize: '1rem',
                      marginBottom: '4px',
                      transition: 'color 200ms',
                    }}
                  >
                    {product.name}
                  </h3>
                </Link>

                <div className="text-xs text-muted-foreground" style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                  {cf.rebsorte && <span>{cf.rebsorte}</span>}
                  {cf.region && <span>· {cf.region}</span>}
                  {cf.jahrgang && <span>· {cf.jahrgang}</span>}
                </div>

                {cf.geschmacksprofil && (
                  <p className="text-xs text-muted-foreground" style={{ marginBottom: '12px', lineHeight: 1.5 }}>
                    {cf.geschmacksprofil}
                  </p>
                )}

                {/* Rating */}
                <div style={{ marginBottom: '12px' }}>
                  <Rating
                    value={rating}
                    readOnly
                    size={16}
                    activeColor="var(--accent)"
                  />
                </div>

                {/* Price + Add to Cart */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <span className="text-foreground font-bold" style={{ fontSize: '1.25rem' }}>
                    {variant ? formatPrice(variant.priceWithTax) : '—'}
                  </span>
                  <AddToCartButton
                    bgColor="var(--accent)"
                    onClick={() => {
                      if (variant) {
                        addToCart(variant.id)
                        toast({
                          title: 'In den Warenkorb gelegt',
                          description: product.name,
                          variant: 'success',
                        })
                      }
                    }}
                  >
                    In den Korb
                  </AddToCartButton>
                </div>
              </div>
            </GlowCard>
          )
        })}
      </div>
    </div>
  )
}
