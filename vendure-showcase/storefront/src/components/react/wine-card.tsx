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
      className="bg-card border-border text-card-foreground flex flex-col overflow-hidden border"
    >
      <div
        className="bg-muted grid aspect-4/3 place-items-center text-6xl"
        aria-hidden="true"
      >
        <span>{emoji(cf.rebsorte)}</span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-lg leading-tight font-bold">
            <a
              href={wineHref(product.slug)}
              className="text-foreground hover:text-accent underline-offset-4 transition-colors hover:underline"
            >
              {product.name}
            </a>
          </h3>
          <span className="text-accent shrink-0 font-bold tabular-nums">
            {v ? formatPrice(v.priceWithTax) : '—'}
          </span>
        </div>

        <p className="text-muted-foreground text-xs tracking-wider uppercase">
          {[cf.rebsorte, cf.jahrgang, cf.region].filter(Boolean).join(' · ')}
        </p>

        <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
          <WineText fallback={<WineText>{product.description}</WineText>}>
            {cf.geschmacksprofil}
          </WineText>
        </p>

        <button
          type="button"
          onClick={() => v && onAddToCart(v.id)}
          disabled={!v}
          className="bg-foreground text-background hover:bg-accent hover:text-primary-foreground focus-visible:outline-ring mt-3 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t.addToCart}
        </button>
      </div>
    </ShapeCard>
  );
}
