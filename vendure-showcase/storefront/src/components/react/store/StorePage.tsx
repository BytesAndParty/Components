import { useAddToCart } from '@/lib/cart-context';
import {
  useFacets,
  useProducts,
  useStoreFilters,
  applyFilters,
  useHydrateOnMount,
} from '@/lib/store-filters';
import { useT } from '@/lib/i18n';
import type { Facet, Product } from '@/lib/types';
import { Providers } from '../Providers';
import { WineCard } from '../wine-card';
import { StoreToolbar } from './StoreToolbar';
import { ActiveFilterChips } from './ActiveFilterChips';
import { StoreEmpty, StoreError, StoreLoading } from './StoreStates';

interface StorePageProps {
  initialProducts?: Product[];
  initialFacets?: Facet[];
}

function StoreInner({ initialProducts, initialFacets }: StorePageProps) {
  useHydrateOnMount();
  const { state, activeCount, clearAll } = useStoreFilters();
  const productsQuery = useProducts(initialProducts);
  const facetsQuery = useFacets(initialFacets);
  const { mutate: addToCart } = useAddToCart();
  const t = useT();

  const products = productsQuery.data ?? [];
  const facets = facetsQuery.data ?? [];
  const filtered = applyFilters(products, state);

  if (productsQuery.isLoading && !initialProducts) return <StoreLoading />;
  if (productsQuery.error) return <StoreError />;

  return (
    <div className="space-y-6">
      <section className="text-center py-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">{t.storeTitle}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t.storeSubtitle}</p>
      </section>

      <div className="border-b">
        <StoreToolbar facets={facets} totalCount={products.length} filteredCount={filtered.length} />
        <ActiveFilterChips facets={facets} />
      </div>

      {filtered.length === 0 ? (
        <StoreEmpty hasFilters={activeCount > 0} onReset={clearAll} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((product, idx) => (
            <WineCard
              key={product.id}
              product={product}
              variant={idx % 2 === 0 ? 'premium' : 'label'}
              featuredLabel={idx === 0 ? 'Wein des Monats' : undefined}
              onAddToCart={(variantId) => addToCart({ variantId })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function StorePage(props: StorePageProps) {
  return (
    <Providers>
      <StoreInner {...props} />
    </Providers>
  );
}
