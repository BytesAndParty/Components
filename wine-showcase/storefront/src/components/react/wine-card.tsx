import type { Product } from '@/lib/types'

type CardVariant = 'premium' | 'label'

interface WineCardProps {
  product: Product
  variant?: CardVariant
  featuredLabel?: string
  onAddToCart: (variantId: string) => void
}

function formatPrice(cents: number): string {
  return `€ ${(cents / 100).toFixed(2).replace('.', ',')}`
}

function emoji(rebsorte: string | null): string {
  const r = rebsorte?.toLowerCase() ?? ''
  if (r.includes('rosé')) return '🌸'
  if (r.includes('rot') || r.includes('blaufränkisch')) return '🍷'
  return '🥂'
}

export function WineCard({
  product,
  variant = 'premium',
  featuredLabel,
  onAddToCart,
}: WineCardProps) {
  const v = product.variants[0]
  const cf = product.customFields
  const hasBadge = Boolean(featuredLabel)

  return (
    <article
      className="wine-card-shell group"
      data-variant={variant}
      data-badge={hasBadge ? '' : undefined}
    >
      <div className="wine-card">
        <div className="wine-card__media" aria-hidden="true">
          <span className="wine-card__emoji">{emoji(cf.rebsorte)}</span>
        </div>

        <div className="wine-card__body">
          <div className="wine-card__header">
            <h3 className="wine-card__title">
              <a href={`/wine/${product.slug}`}>{product.name}</a>
            </h3>
            <span className="wine-card__price">
              {v ? formatPrice(v.priceWithTax) : '—'}
            </span>
          </div>

          <p className="wine-card__meta">
            {[cf.rebsorte, cf.jahrgang, cf.region].filter(Boolean).join(' · ')}
          </p>

          <p className="wine-card__desc">
            {cf.geschmacksprofil || product.description}
          </p>

          <button
            type="button"
            onClick={() => v && onAddToCart(v.id)}
            disabled={!v}
            className="wine-card__cta"
          >
            In den Warenkorb
          </button>
        </div>
      </div>

      {hasBadge && (
        <span className="wine-card__seal" role="img" aria-label={featuredLabel}>
          <span className="wine-card__seal-text">{featuredLabel}</span>
        </span>
      )}
    </article>
  )
}
