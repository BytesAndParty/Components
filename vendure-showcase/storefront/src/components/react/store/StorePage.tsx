import { useAddToCart } from '@/lib/cart-context';
import {
  useFacets,
  useProducts,
  useStoreFilters,
  applyFilters,
  useHydrateOnMount,
} from '@/lib/store-filters';
import type { Facet, Product } from '@/lib/types';
import { Providers } from '../Providers';
import { WineCard } from '../wine-card';
import { StoreToolbar } from './StoreToolbar';
import { ActiveFilterChips } from './ActiveFilterChips';

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

  const products = productsQuery.data ?? [];
  const facets = facetsQuery.data ?? [];
  const filtered = applyFilters(products, state);

  if (productsQuery.isLoading && !initialProducts) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground text-lg">Lade Weine...</p>
      </div>
    );
  }

  if (productsQuery.error) {
    return (
      <div className="py-20 text-center max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">Fehler</h2>
        <p className="text-muted-foreground mb-6">Vendure Server nicht erreichbar.</p>
        <div className="p-4 bg-muted rounded-lg text-left text-sm font-mono">
          cd vendure-showcase/server && bun run dev
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="text-center py-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Unsere Weine</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Handverlesen aus den besten Lagen Österreichs.
        </p>
      </section>

      <div className="border-b">
        <StoreToolbar facets={facets} totalCount={products.length} filteredCount={filtered.length} />
        <ActiveFilterChips facets={facets} />
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted-foreground mb-4">
            Keine Weine entsprechen den ausgewählten Filtern.
          </p>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-accent hover:underline underline-offset-4"
            >
              Filter zurücksetzen
            </button>
          )}
        </div>
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
