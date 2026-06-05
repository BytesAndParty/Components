import { useState, type CSSProperties } from 'react'
import { useParams, Link } from 'react-router'
import { ChevronLeft, Award, Grape, Thermometer, Wine } from 'lucide-react'

import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@components/breadcrumb/breadcrumb'
import { Backlight } from '@components/backlight/backlight'
import { Lens } from '@components/lens/lens'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { Rating } from '@components/rating/rating'
import { HeartLike } from '@components/heart-like/heart-like'
import { AddToCartButton } from '@components/add-to-cart-button/add-to-cart-button'
import { MagneticButton } from '@components/magnetic-button/magnetic-button'
import { PullQuote } from '@components/pull-quote/pull-quote'
import { Tooltip } from '@components/tooltip/tooltip'
import { Hover3DCard } from '@components/hover-3d-card/hover-3d-card'
import { useToast } from '@components/toast/toast-context'

import { useCart } from '../cart-context'

// ─── Daten ──────────────────────────────────────────────────────────────────────

type WineRecord = {
  slug: string
  name: string
  region: string
  country: string
  vintage: number
  price: string
  rating: number
  reviewCount: number
  variant: 'red' | 'white'
  tagline: string
  intro: string
  sommelierQuote: string
  sommelier: string
  sommelierRole: string
  pairings: string[]
  facts: {
    grape: string
    abv: string
    serve: string
    window: string
  }
  related: { slug: string; name: string; price: string; variant: 'red' | 'white' }[]
}

const wines: Record<string, WineRecord> = {
  'barolo-riserva-2016': {
    slug: 'barolo-riserva-2016',
    name: 'Barolo Riserva',
    region: 'Piemonte',
    country: 'Italien',
    vintage: 2016,
    price: '€ 92,00',
    rating: 4.8,
    reviewCount: 47,
    variant: 'red',
    tagline: 'Aus den Steillagen über Serralunga d’Alba — fünf Jahre Holz, zehn Jahre Geduld.',
    intro:
      'Ein Wein, der sich Zeit nimmt. In der Nase Rosenblüten, Teerblatt und Trüffel; am Gaumen samtig, mit einer Tanninstruktur, die nach Jahren noch trägt. Handlese, Spontangärung, Reifung im großen slawonischen Holzfass.',
    sommelierQuote:
      'Ein Barolo, der nicht überreden will. Er stellt sich neben das Essen und wartet, bis man hinhört.',
    sommelier: 'Margit Buchart',
    sommelierRole: 'Familienkellerei, vierte Generation',
    pairings: ['Wildragout', 'Reifer Bergkäse', 'Trüffelpasta', 'Geschmortes Rindfleisch'],
    facts: {
      grape: 'Nebbiolo · 100 %',
      abv: '14,5 % vol.',
      serve: '16 – 18 °C',
      window: 'Trinkreife bis 2042',
    },
    related: [
      { slug: 'brunello-di-montalcino-2018', name: 'Brunello di Montalcino', price: '€ 64,00', variant: 'red' },
      { slug: 'amarone-valpolicella-2017', name: 'Amarone Valpolicella', price: '€ 78,00', variant: 'red' },
      { slug: 'chianti-classico-2020', name: 'Chianti Classico', price: '€ 26,80', variant: 'red' },
    ],
  },
  'riesling-smaragd-2022': {
    slug: 'riesling-smaragd-2022',
    name: 'Riesling Smaragd',
    region: 'Wachau',
    country: 'Österreich',
    vintage: 2022,
    price: '€ 32,50',
    rating: 4.6,
    reviewCount: 32,
    variant: 'white',
    tagline: 'Vom Urgesteinsterrassen über der Donau — kristallin, mineralisch, kompromisslos.',
    intro:
      'Aprikosenblüte, weißer Pfirsich und ein Hauch Feuerstein. Am Gaumen straff, druckvoll, mit einer Säurespur, die den ganzen Nachmittag trägt. Handlese, Naturhefen, Stahltank.',
    sommelierQuote:
      'Wenn ein Wein nach Stein riecht und trotzdem nach Frühling schmeckt, dann ist es ein Smaragd.',
    sommelier: 'Margit Buchart',
    sommelierRole: 'Familienkellerei, vierte Generation',
    pairings: ['Saibling', 'Spargel', 'Hartkäse', 'Vorspeisen mit Gemüse'],
    facts: {
      grape: 'Riesling · 100 %',
      abv: '13,0 % vol.',
      serve: '8 – 10 °C',
      window: 'Trinkreife bis 2032',
    },
    related: [
      { slug: 'gruener-veltliner-2023', name: 'Grüner Veltliner', price: '€ 18,90', variant: 'white' },
      { slug: 'sauvignon-blanc-reserve-2022', name: 'Sauvignon Blanc Réserve', price: '€ 42,00', variant: 'white' },
      { slug: 'pinot-grigio-2023', name: 'Pinot Grigio Alto Adige', price: '€ 22,40', variant: 'white' },
    ],
  },
}

const fallback: WineRecord = wines['barolo-riserva-2016']

// ─── Helpers ────────────────────────────────────────────────────────────────────

const serif: CSSProperties = {
  fontFamily: 'Georgia, "Times New Roman", "Cormorant Garamond", serif',
  letterSpacing: '-0.02em',
}

function bottleSrc(variant: 'red' | 'white', extra = false) {
  if (variant === 'white') return extra ? '/white-wine-with-extra.png' : '/white-wine-default.png'
  return extra ? '/wine-with-extra.png' : '/wine-default.png'
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export function WineDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const wine = (slug && wines[slug]) || fallback
  const { add } = useToast()
  const cart = useCart()
  const [qty, setQty] = useState(1)

  function handleAddToCart() {
    for (let i = 0; i < qty; i++) cart.add({ id: wine.slug, label: wine.name })
    add({
      title: `${wine.name} im Warenkorb`,
      description: `${qty} × ${wine.price} · Jahrgang ${wine.vintage}`,
      variant: 'success',
    })
  }

  return (
    <div className="text-foreground -mt-2 flex flex-col gap-20">

      {/* ── Breadcrumb ───────────────────────────────────────────────── */}
      <BlurFade delay={0} duration={500}>
        <Breadcrumb>
          <BreadcrumbList style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <BreadcrumbItem>
              <Link to="/cards" viewTransition style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <ChevronLeft size={12} /> Sortiment
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/cards" viewTransition style={{ color: 'inherit', textDecoration: 'none' }}>{wine.country}</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{wine.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </BlurFade>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-12 md:grid-cols-[1.05fr_1fr] md:gap-16 md:items-center">

        {/* Bottle — no BlurFade wrapper: the View Transition morph IS the enter animation. */}
        <div className="relative">
          <Backlight intensity={0.42} blur={70} blobs={3} interactive>
            <div
              className="vt-wine border-border bg-card relative overflow-hidden"
              style={{
                borderRadius: '20px',
                border: '1px solid var(--border)',
                aspectRatio: '3 / 4',
                viewTransitionName: `wine-${wine.slug}`,
              }}
            >
              <Lens
                zoom={2.2}
                lensSize={180}
                ringWidth={1}
                ringColor="var(--accent)"
                style={{ borderRadius: 'inherit', width: '100%', height: '100%' }}
              >
                <img
                  src={bottleSrc(wine.variant)}
                  alt={`${wine.name} ${wine.vintage}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    padding: '10%',
                  }}
                  draggable={false}
                />
              </Lens>
            </div>
          </Backlight>

          <BlurFade delay={400} duration={400}>
            <p
              className="text-muted-foreground mt-4 text-center text-[0.625rem] tracking-[0.18em] uppercase"
            >
              Hover für Etikett-Zoom
            </p>
          </BlurFade>
        </div>

        {/* Info column */}
        <BlurFade delay={220} duration={700}>
          <div className="flex flex-col gap-6">

            {/* Region pill */}
            <div className="flex items-center gap-3">
              <span
                className="bg-accent inline-block"
                style={{ width: 28, height: 1, opacity: 0.7 }}
              />
              <p className="text-muted-foreground text-[0.6875rem] tracking-[0.22em] uppercase">
                {wine.region} · {wine.country}
              </p>
            </div>

            {/* Headline (serif) */}
            <h1
              className="text-foreground m-0"
              style={{
                ...serif,
                fontSize: 'clamp(2.25rem, 5vw, 3.25rem)',
                lineHeight: 1.05,
                fontWeight: 500,
              }}
            >
              {wine.name}
              <br />
              <span className="text-muted-foreground" style={{ fontStyle: 'italic', fontWeight: 400 }}>
                {wine.vintage}
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-muted-foreground m-0 text-[0.9375rem] leading-relaxed">
              {wine.tagline}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <Rating value={wine.rating} readOnly size={16} />
              <span className="text-muted-foreground text-xs">
                {wine.rating.toFixed(1)} · {wine.reviewCount} Bewertungen
              </span>
            </div>

            {/* Divider */}
            <div className="bg-border" style={{ height: 1, marginTop: 4, marginBottom: 4 }} />

            {/* Price + Quantity */}
            <div className="flex items-end justify-between gap-6">
              <div className="flex flex-col gap-1">
                <p className="text-muted-foreground text-[0.625rem] tracking-[0.18em] uppercase">Flaschenpreis</p>
                <p
                  className="m-0 font-semibold"
                  style={{ ...serif, fontSize: '2rem', lineHeight: 1, color: 'var(--accent)' }}
                >
                  {wine.price}
                </p>
                <p className="text-muted-foreground text-[0.6875rem]">0,75 ℓ · inkl. MwSt., zzgl. Versand</p>
              </div>

              <QuantityStepper value={qty} onChange={setQty} />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <AddToCartButton onClick={handleAddToCart}>
                In den Keller legen
              </AddToCartButton>

              <Tooltip content="Auf Wunschliste setzen" position="top">
                <span className="inline-flex">
                  <HeartLike size={40} />
                </span>
              </Tooltip>

              <MagneticButton variant="ghost" strength={0.25}>
                Direkt zum Winzer schreiben
              </MagneticButton>
            </div>
          </div>
        </BlurFade>
      </section>

      {/* ── Sommelier-Notiz ───────────────────────────────────────────── */}
      <BlurFade delay={0} duration={600}>
        <PullQuote
          variant="cellar"
          align="left"
          size="md"
          attribution={wine.sommelier}
          byline={wine.sommelierRole}
        >
          {wine.sommelierQuote}
        </PullQuote>
      </BlurFade>

      {/* ── Verkostung ────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.4fr]">
        <BlurFade delay={0} duration={600}>
          <div>
            <p className="text-muted-foreground text-[0.625rem] tracking-[0.22em] uppercase">Im Glas</p>
            <h2 className="text-foreground m-0 mt-2" style={{ ...serif, fontSize: '1.75rem', fontWeight: 500 }}>
              Verkostung
            </h2>
            <div className="bg-accent mt-4" style={{ width: 36, height: 1 }} />
          </div>
        </BlurFade>
        <BlurFade delay={120} duration={600}>
          <p className="text-foreground/85 m-0 text-[0.9375rem] leading-relaxed">
            {wine.intro}
          </p>
        </BlurFade>
      </section>

      {/* ── Fact strip ────────────────────────────────────────────────── */}
      <BlurFade delay={0} duration={600}>
        <div
          className="border-border grid grid-cols-2 overflow-hidden rounded-2xl border md:grid-cols-4"
        >
          <Fact icon={<Grape size={16} />} label="Rebsorte" value={wine.facts.grape} hint="Reinsortig vinifiziert, Handlese, Spontangärung." />
          <Fact icon={<Wine size={16} />} label="Alkohol" value={wine.facts.abv} hint="Natürlich vergoren, ohne Zugabe." />
          <Fact icon={<Thermometer size={16} />} label="Trinktemperatur" value={wine.facts.serve} hint="Ideal zur Karaffierung 30 Min. vor Genuss." />
          <Fact icon={<Award size={16} />} label="Trinkfenster" value={wine.facts.window} hint="Empfehlung der Familienkellerei." />
        </div>
      </BlurFade>

      {/* ── Pairings ──────────────────────────────────────────────────── */}
      <section>
        <BlurFade delay={0} duration={600}>
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="text-foreground m-0" style={{ ...serif, fontSize: '1.75rem', fontWeight: 500 }}>
              Passt zu
            </h2>
            <p className="text-muted-foreground text-[0.6875rem] tracking-[0.18em] uppercase">
              Speiseempfehlung
            </p>
          </div>
        </BlurFade>
        <BlurFade delay={120} duration={600}>
          <div className="flex flex-wrap gap-2">
            {wine.pairings.map(p => (
              <span
                key={p}
                className="border-border text-foreground/85 rounded-full border px-4 py-2 text-xs"
                style={{ background: 'color-mix(in oklch, var(--accent) 4%, transparent)' }}
              >
                {p}
              </span>
            ))}
          </div>
        </BlurFade>
      </section>

      {/* ── Cross-sell ────────────────────────────────────────────────── */}
      <section>
        <BlurFade delay={0} duration={600}>
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="text-foreground m-0" style={{ ...serif, fontSize: '1.75rem', fontWeight: 500 }}>
              Aus dem gleichen Keller
            </h2>
            <Link
              to="/cards"
              className="text-muted-foreground hover:text-foreground text-[0.6875rem] tracking-[0.18em] uppercase no-underline transition-colors"
            >
              Sortiment ansehen →
            </Link>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {wine.related.map((rel, i) => (
            <BlurFade key={rel.slug} delay={80 + i * 80} duration={600}>
              <Link
                to={`/wine/${rel.slug}`}
                viewTransition
                className="block no-underline"
                style={{ color: 'inherit' }}
              >
                <Hover3DCard
                  maxRotate={6}
                  glareIntensity={0.12}
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    aspectRatio: '3 / 4',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    className={rel.slug in wines ? 'vt-wine' : undefined}
                    style={{
                      flex: 1,
                      display: 'grid',
                      placeItems: 'center',
                      padding: '20px 16px 0',
                      background:
                        'radial-gradient(circle at 50% 25%, color-mix(in oklch, var(--accent) 10%, transparent), transparent 65%)',
                      ...(rel.slug in wines ? { viewTransitionName: `wine-${rel.slug}` } : null),
                    }}
                  >
                    <img
                      src={bottleSrc(rel.variant)}
                      alt={rel.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        padding: '10%',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                  <div style={{ padding: '0.75rem 1rem 1rem' }}>
                    <p
                      className="text-foreground m-0 truncate text-sm font-semibold"
                      style={{ letterSpacing: '-0.01em' }}
                    >
                      {rel.name}
                    </p>
                    <p
                      className="m-0 mt-1 text-xs font-bold"
                      style={{ color: 'var(--accent)' }}
                    >
                      {rel.price}
                    </p>
                  </div>
                </Hover3DCard>
              </Link>
            </BlurFade>
          ))}
        </div>
      </section>
    </div>
  )
}

// ─── Subcomponents ──────────────────────────────────────────────────────────────

function Fact({
  icon, label, value, hint,
}: {
  icon: React.ReactNode
  label: string
  value: string
  hint: string
}) {
  return (
    <Tooltip content={hint} position="top">
      <div
        className="border-border flex flex-col gap-2 border-r border-b p-5 last:border-r-0 md:border-b-0"
        style={{ background: 'color-mix(in oklch, var(--accent) 2%, transparent)' }}
      >
        <div className="text-muted-foreground flex items-center gap-2">
          {icon}
          <span className="text-[0.625rem] tracking-[0.18em] uppercase">{label}</span>
        </div>
        <p className="text-foreground m-0 text-sm font-medium">{value}</p>
      </div>
    </Tooltip>
  )
}

function QuantityStepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div
      className="border-border flex items-center overflow-hidden rounded-full border"
      style={{ background: 'var(--card)' }}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        aria-label="Anzahl verringern"
        className="text-foreground hover:bg-accent/8 flex h-10 w-10 cursor-pointer items-center justify-center border-none bg-transparent text-base transition-colors"
      >
        −
      </button>
      <span className="text-foreground min-w-7 text-center text-sm tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label="Anzahl erhöhen"
        className="text-foreground hover:bg-accent/8 flex h-10 w-10 cursor-pointer items-center justify-center border-none bg-transparent text-base transition-colors"
      >
        +
      </button>
    </div>
  )
}
