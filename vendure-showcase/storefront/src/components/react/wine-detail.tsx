import { Grape, Loader2 } from 'lucide-react';
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
import { useT } from '@/lib/i18n';
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
          ? 'bg-accent text-primary-foreground inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold'
          : 'bg-muted text-foreground border-border inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium'
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
    <dl className="grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
      {rows.map((r) => (
        <div key={r.label} className="border-border flex justify-between gap-4 border-b py-2 last:border-b-0 sm:border-b">
          <dt className="text-muted-foreground">{r.label}</dt>
          <dd className="text-right font-medium">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function WineDetailInner({ slug, initialProduct }: { slug: string; initialProduct?: Product }) {
  const { data: product, isLoading } = useProduct(slug, initialProduct);
  const { mutate: addToCart } = useAddToCart();
  const t = useT();

  if (isLoading && !initialProduct) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-20 text-center">
        <div className="bg-muted text-muted-foreground mb-6 grid h-16 w-16 place-items-center rounded-full">
          <Loader2 size={28} className="animate-spin" aria-hidden="true" />
        </div>
        <p className="text-muted-foreground">{t.detailLoading}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-20 text-center">
        <div className="bg-muted text-muted-foreground mb-6 grid h-16 w-16 place-items-center rounded-full">
          <Grape size={28} aria-hidden="true" />
        </div>
        <h2 className="mb-3 text-2xl font-bold">{t.detailNotFoundTitle}</h2>
        <p className="text-muted-foreground mb-6">{t.detailNotFoundBody}</p>
        <a
          href="/"
          className="bg-foreground text-background hover:bg-accent hover:text-primary-foreground inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors"
        >
          {t.detailBackToStore}
        </a>
      </div>
    );
  }

  const variant = product.variants[0];
  const cf = product.customFields;

  const productionRows: DetailRow[] = [
    { label: t.fieldGrape, value: cf.rebsorte ?? '' },
    { label: t.fieldRegion, value: cf.region ?? '' },
    { label: t.fieldVintage, value: cf.jahrgang?.toString() ?? '' },
    { label: t.fieldAlcohol, value: cf.alkoholgehalt ? `${cf.alkoholgehalt} % vol.` : '' },
  ].filter((r) => r.value);

  const analyticRows: DetailRow[] = [
    { label: t.fieldResidualSugar, value: cf.restzucker ? `${cf.restzucker} g/l` : '' },
    { label: t.fieldAcidity, value: cf.saeure ? `${cf.saeure} g/l` : '' },
    { label: t.fieldServingTemp, value: cf.serviertemperatur ?? '' },
  ].filter((r) => r.value);

  return (
    <div className="space-y-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">{t.navWines}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <ShapeCard
          shape="round"
          radius={24}
          hoverLift={false}
          hoverAccent={false}
          className="bg-muted sticky top-24 grid aspect-square place-items-center text-[clamp(6rem,18vw,12rem)]"
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
            <h1 className="text-4xl leading-[1.05] font-extrabold tracking-tight md:text-5xl">
              {product.name}
            </h1>
          </header>

          <div className="flex items-baseline gap-3">
            <span className="text-accent text-3xl font-bold tabular-nums">
              {variant ? formatPrice(variant.priceWithTax) : '—'}
            </span>
            <span className="text-muted-foreground text-sm">{t.inclVat}</span>
          </div>

          <p className="text-muted-foreground max-w-prose text-lg leading-relaxed">
            <WineText>{product.description}</WineText>
          </p>

          <button
            type="button"
            onClick={() => variant && addToCart({ variantId: variant.id })}
            disabled={!variant}
            className="bg-foreground text-background hover:bg-accent hover:text-primary-foreground focus-visible:outline-ring w-full rounded-xl px-8 py-4 text-base font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {t.addToCart}
          </button>

          {cf.geschmacksprofil && (
            <section className="space-y-3">
              <h2 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                {t.detailSectionTaste}
              </h2>
              <p className="text-base leading-relaxed">
                <WineText>{cf.geschmacksprofil}</WineText>
              </p>
            </section>
          )}

          {productionRows.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                {t.detailSectionOrigin}
              </h2>
              <DetailGrid rows={productionRows} />
            </section>
          )}

          {analyticRows.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                {t.detailSectionAnalysis}
              </h2>
              <DetailGrid rows={analyticRows} />
            </section>
          )}

          {cf.speiseempfehlung?.trim() && (
            <section className="border-border bg-card space-y-2 rounded-xl border p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <span aria-hidden="true">🍽️</span>
                {t.detailSectionPairing}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                <WineText>{cf.speiseempfehlung}</WineText>
              </p>
            </section>
          )}

          {cf.auszeichnungen?.trim() && (
            <section className="border-border bg-card space-y-2 rounded-xl border p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <span aria-hidden="true">🏆</span>
                {t.detailSectionAwards}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
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
