import { ShapeCard } from '@components/shape-card/shape-card';
import type { Product } from '@/lib/types';
import { wineHref } from '@/lib/utils';
import { WineText } from '@/lib/wine-text';
import { useT } from '@/lib/i18n';

interface WineCardProps {
  product: Product;
  /** Reserved for future use (z.B. "Wein des Monats"). Wird derzeit ignoriert. */
  variant?: 'premium' | 'label';
  /** Reserved for future use. */
  featuredLabel?: string;
  onAddToCart: (variantId: string) => void;
}

function formatPrice(cents: number): string {
  return `€ ${(cents / 100).toFixed(2).replace('.', ',')}`;
}

function emoji(rebsorte: string | null): string {
  const r = rebsorte?.toLowerCase() ?? '';
  if (r.includes('rosé')) return '🌸';
  if (r.includes('rot') || r.includes('blaufränkisch')) return '🍷';
  return '🥂';
}

export function WineCard({ product, onAddToCart }: WineCardProps) {
  const v = product.variants[0];
  const cf = product.customFields;
  const t = useT();

  return (
    <ShapeCard
      shape="round"
      radius={16}
      className="bg-card border border-border text-card-foreground flex flex-col overflow-hidden"
    >
      <div
        className="aspect-4/3 grid place-items-center bg-muted text-6xl"
        aria-hidden="true"
      >
        <span>{emoji(cf.rebsorte)}</span>
      </div>

      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-lg font-bold leading-tight">
            <a
              href={wineHref(product.slug)}
              className="text-foreground hover:text-accent transition-colors underline-offset-4 hover:underline"
            >
              {product.name}
            </a>
          </h3>
          <span className="text-accent font-bold tabular-nums shrink-0">
            {v ? formatPrice(v.priceWithTax) : '—'}
          </span>
        </div>

        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {[cf.rebsorte, cf.jahrgang, cf.region].filter(Boolean).join(' · ')}
        </p>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          <WineText fallback={<WineText>{product.description}</WineText>}>
            {cf.geschmacksprofil}
          </WineText>
        </p>

        <button
          type="button"
          onClick={() => v && onAddToCart(v.id)}
          disabled={!v}
          className="mt-3 px-4 py-2.5 rounded-lg bg-foreground text-background font-semibold text-sm hover:bg-accent hover:text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {t.addToCart}
        </button>
      </div>
    </ShapeCard>
  );
}
