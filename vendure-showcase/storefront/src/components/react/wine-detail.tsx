import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@components/breadcrumb/breadcrumb';
import { ShapeCard } from '@components/shape-card/shape-card';
import { useAddToCart } from '@/lib/cart-context';
import { useProduct } from '@/lib/store-filters';
import { WineText } from '@/lib/wine-text';
import type { Product, FacetValueRef } from '@/lib/types';
import { Providers } from './Providers';

function formatPrice(cents: number): string {
  return `€ ${(cents / 100).toFixed(2).replace('.', ',')}`;
}

function heroEmoji(rebsorte: string | null): string {
  const r = rebsorte?.toLowerCase() ?? '';
  if (r.includes('rosé')) return '🌸';
  if (r.includes('rot') || r.includes('blaufränkisch')) return '🍷';
  return '🥂';
}

function FacetTag({ value }: { value: FacetValueRef }) {
  const isAward = value.facet.code === 'auszeichnung';
  return (
    <span
      className={
        isAward
          ? 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent text-primary-foreground'
          : 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted text-foreground border border-border'
      }
    >
      {isAward && <span aria-hidden="true">🏆</span>}
      {value.name}
    </span>
  );
}

interface DetailRow {
  label: string;
  value: string;
}

function DetailGrid({ rows }: { rows: DetailRow[] }) {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
      {rows.map((r) => (
        <div key={r.label} className="flex justify-between gap-4 py-2 border-b border-border last:border-b-0 sm:border-b">
          <dt className="text-muted-foreground">{r.label}</dt>
          <dd className="font-medium text-right">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function WineDetailInner({ slug, initialProduct }: { slug: string; initialProduct?: Product }) {
  const { data: product, isLoading } = useProduct(slug, initialProduct);
  const { mutate: addToCart } = useAddToCart();

  if (isLoading && !initialProduct) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">Lade Produkt...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Wein nicht gefunden</h2>
        <a href="/" className="text-accent hover:underline">
          ← Zurück zur Übersicht
        </a>
      </div>
    );
  }

  const variant = product.variants[0];
  const cf = product.customFields;

  const productionRows: DetailRow[] = [
    { label: 'Rebsorte', value: cf.rebsorte ?? '' },
    { label: 'Region', value: cf.region ?? '' },
    { label: 'Jahrgang', value: cf.jahrgang?.toString() ?? '' },
    { label: 'Alkohol', value: cf.alkoholgehalt ? `${cf.alkoholgehalt} % vol.` : '' },
  ].filter((r) => r.value);

  const analyticRows: DetailRow[] = [
    { label: 'Restzucker', value: cf.restzucker ? `${cf.restzucker} g/l` : '' },
    { label: 'Säure', value: cf.saeure ? `${cf.saeure} g/l` : '' },
    { label: 'Serviertemperatur', value: cf.serviertemperatur ?? '' },
  ].filter((r) => r.value);

  return (
    <div className="space-y-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Weine</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start">
        <ShapeCard
          shape="round"
          radius={24}
          hoverLift={false}
          hoverAccent={false}
          className="bg-muted aspect-square grid place-items-center text-[clamp(6rem,18vw,12rem)] sticky top-24"
        >
          <span aria-hidden="true">{heroEmoji(cf.rebsorte)}</span>
        </ShapeCard>

        <div className="space-y-7">
          <header className="space-y-4">
            {product.facetValues.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.facetValues.map((fv) => (
                  <FacetTag key={fv.id} value={fv} />
                ))}
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05]">
              {product.name}
            </h1>
          </header>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold tabular-nums text-accent">
              {variant ? formatPrice(variant.priceWithTax) : '—'}
            </span>
            <span className="text-sm text-muted-foreground">inkl. MwSt.</span>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-prose">
            <WineText>{product.description}</WineText>
          </p>

          <button
            type="button"
            onClick={() => variant && addToCart({ variantId: variant.id })}
            disabled={!variant}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-foreground text-background font-bold text-base hover:bg-accent hover:text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            In den Warenkorb
          </button>

          {cf.geschmacksprofil && (
            <section className="space-y-3">
              <h2 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Geschmacksprofil
              </h2>
              <p className="text-base leading-relaxed">
                <WineText>{cf.geschmacksprofil}</WineText>
              </p>
            </section>
          )}

          {productionRows.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Herkunft & Produktion
              </h2>
              <DetailGrid rows={productionRows} />
            </section>
          )}

          {analyticRows.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Analyse & Service
              </h2>
              <DetailGrid rows={analyticRows} />
            </section>
          )}

          {cf.speiseempfehlung?.trim() && (
            <section className="rounded-xl border border-border bg-card p-5 space-y-2">
              <h2 className="font-semibold text-sm flex items-center gap-2">
                <span aria-hidden="true">🍽️</span>
                Speiseempfehlung
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <WineText>{cf.speiseempfehlung}</WineText>
              </p>
            </section>
          )}

          {cf.auszeichnungen?.trim() && (
            <section className="rounded-xl border border-border bg-card p-5 space-y-2">
              <h2 className="font-semibold text-sm flex items-center gap-2">
                <span aria-hidden="true">🏆</span>
                Auszeichnungen
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <WineText>{cf.auszeichnungen}</WineText>
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export function WineDetailPage(props: { slug: string; initialProduct?: Product }) {
  return (
    <Providers>
      <WineDetailInner {...props} />
    </Providers>
  );
}
