import { useState } from 'react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'
import { ProductV4 } from '../showcase/ProductV4'

/**
 * La Cave — Domaine Privée storefront. The shop is not a card grid but a
 * wine list: an engraved ledger with vintage numerals, category filters as
 * quiet underline tabs and a featured cuvée in an arch plate. Every row
 * opens the Grand Cru detail page (ProductV4).
 */

type Category = 'alle' | 'weiss' | 'rot'

interface Wine {
  no: string
  name: string
  vintage: string
  meta: string
  category: Exclude<Category, 'alle'>
  price: string
}

const WINES: Wine[] = [
  { no: '01', name: 'Grüner Veltliner Achleiten', vintage: '2023', meta: 'Urgestein · trocken · 12,5 %', category: 'weiss', price: '32,00 €' },
  { no: '02', name: 'Riesling Steinriegl', vintage: '2021', meta: 'Schiefer · trocken · 12,5 %', category: 'weiss', price: '64,00 €' },
  { no: '03', name: 'Riesling Loibenberg Smaragd', vintage: '2022', meta: 'Löss über Fels · trocken · 13,5 %', category: 'weiss', price: '48,00 €' },
  { no: '04', name: 'St. Laurent Reserve', vintage: '2020', meta: 'Großes Fass · 24 Monate · 13 %', category: 'rot', price: '54,00 €' },
  { no: '05', name: 'Pinot Noir Terrassen', vintage: '2021', meta: 'Ganztrauben · ungefiltert · 12,5 %', category: 'rot', price: '72,00 €' },
  { no: '06', name: 'Grüner Veltliner Federspiel', vintage: '2024', meta: 'Junge Reben · trocken · 12 %', category: 'weiss', price: '19,00 €' },
]

const FILTERS: { id: Category; label: string }[] = [
  { id: 'alle', label: 'Alle Weine' },
  { id: 'weiss', label: 'Weißweine' },
  { id: 'rot', label: 'Rotweine' },
]

export function StoreCave() {
  const [filter, setFilter] = useState<Category>('alle')
  const [detailOpen, setDetailOpen] = useState(false)

  if (detailOpen) {
    return <ProductV4 onBack={() => setDetailOpen(false)} />
  }

  const visible = filter === 'alle' ? WINES : WINES.filter(w => w.category === filter)

  return (
    <section className="bg-[#f6f3ec] px-6 py-24 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="border-b border-[#ddd5c4] pb-12">
          <BlurFade delay={100} direction="down">
            <span className="mb-5 block text-[10px] font-bold tracking-[0.4em] text-[#8a8070] uppercase">
              La Cave · Ab-Hof-Verkauf
            </span>
          </BlurFade>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <BlurFade delay={220} direction="up">
              <h1 className="font-display text-5xl leading-[1.02] font-light tracking-tight text-[#221b16] sm:text-6xl">
                Die <span className="italic text-[#5c2331]">Weinkarte.</span>
              </h1>
            </BlurFade>
            <BlurFade delay={340} direction="up">
              <p className="max-w-sm text-lg leading-relaxed font-light text-[#6f6657]">
                Kein Katalog — eine Karte. Was hier steht, liegt unten im
                Gewölbe und wartet auf Abholung oder temperierten Versand.
              </p>
            </BlurFade>
          </div>
        </div>

        {/* Featured cuvée — arch plate */}
        <BlurFade delay={400} direction="up">
          <article className="mt-16 grid grid-cols-1 items-center gap-10 border border-[#ddd5c4] bg-[#fbf9f3] p-8 sm:grid-cols-[minmax(11rem,14rem)_1fr] lg:gap-14 lg:p-12">
            <RevealImage
              src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80"
              alt="Riesling Steinriegl 2021 — Cuvée des Hauses"
              direction="up"
              duration={1400}
              className="mx-auto aspect-[3/4.2] w-full max-w-56 rounded-t-full"
            />
            <div>
              <span className="mb-3 block text-[10px] font-bold tracking-[0.35em] text-[#5c2331] uppercase">
                Cuvée des Hauses · Limitiert
              </span>
              <h2 className="font-display text-4xl font-light tracking-tight text-[#221b16]">
                Riesling <span className="italic">Steinriegl</span> 2021
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed font-light text-[#6f6657]">
                1.800 Flaschen, einzeln nummeriert. Sechzig Jahre alte, wurzelechte
                Reben — der Wein, an dem wir uns selbst messen.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-10">
                <div>
                  <span className="block text-[10px] font-bold tracking-[0.3em] text-[#a89e8a] uppercase">Ab Hof</span>
                  <span className="font-display text-3xl font-light text-[#221b16] tabular-nums">64,00 €</span>
                </div>
                <button
                  onClick={() => setDetailOpen(true)}
                  className="inline-flex min-h-11 items-center bg-[#5c2331] px-9 py-3 text-[11px] font-bold tracking-[0.25em] text-[#f6f3ec] uppercase transition-all duration-300 hover:bg-[#471a26] hover:shadow-[0_12px_32px_-12px_rgba(92,35,49,0.5)] focus-visible:ring-2 focus-visible:ring-[#5c2331]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbf9f3] focus-visible:outline-none"
                >
                  Zur Flasche
                </button>
              </div>
            </div>
          </article>
        </BlurFade>

        {/* Filter tabs */}
        <BlurFade delay={500} direction="up">
          <div className="mt-20 flex items-baseline justify-between border-b border-[#ddd5c4]">
            <div className="flex gap-9" role="group" aria-label="Weine filtern">
              {FILTERS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setFilter(id)}
                  aria-pressed={filter === id}
                  className={`min-h-11 border-b-2 pb-3 text-[11px] font-bold tracking-[0.25em] uppercase transition-all focus-visible:ring-2 focus-visible:ring-[#5c2331]/60 focus-visible:outline-none ${
                    filter === id
                      ? 'border-[#5c2331] text-[#221b16]'
                      : 'border-transparent text-[#a89e8a] hover:text-[#6f6657]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <span className="hidden pb-3 text-[9px] font-bold tracking-[0.3em] text-[#a89e8a] uppercase sm:block">
              {visible.length} Positionen
            </span>
          </div>
        </BlurFade>

        {/* Ledger rows */}
        <ul>
          {visible.map((wine, i) => (
            <BlurFade key={wine.no} delay={550 + i * 80} direction="up">
              <li className="border-b border-[#ddd5c4]/70">
                <button
                  onClick={() => setDetailOpen(true)}
                  className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-6 text-left transition-colors duration-300 hover:bg-[#5c2331]/[0.04] focus-visible:ring-2 focus-visible:ring-[#5c2331]/60 focus-visible:ring-inset focus-visible:outline-none sm:grid-cols-[3rem_1fr_minmax(0,14rem)_6rem_auto] sm:gap-6"
                  aria-label={`${wine.name} ${wine.vintage} — Detailseite öffnen`}
                >
                  <span className="font-display text-sm font-light text-[#a89e8a] italic">{wine.no}</span>
                  <span>
                    <span className="font-display block text-xl font-light tracking-tight text-[#221b16] transition-colors group-hover:text-[#5c2331] sm:text-2xl">
                      {wine.name} <span className="italic">{wine.vintage}</span>
                    </span>
                    <span className="mt-1 block text-[9px] font-bold tracking-[0.25em] text-[#a89e8a] uppercase sm:hidden">
                      {wine.meta}
                    </span>
                  </span>
                  <span className="hidden text-[9px] font-bold tracking-[0.25em] text-[#a89e8a] uppercase sm:block">
                    {wine.meta}
                  </span>
                  <span className="text-right text-base font-medium text-[#4d4436] tabular-nums">{wine.price}</span>
                  <span
                    aria-hidden="true"
                    className="hidden h-px w-6 self-center bg-[#221b16] transition-all duration-500 group-hover:w-12 group-hover:bg-[#5c2331] sm:block"
                  />
                </button>
              </li>
            </BlurFade>
          ))}
        </ul>

        <BlurFade delay={800}>
          <p className="mt-10 text-center font-display text-sm font-light text-[#8a8070] italic">
            Alle Preise ab Hof inkl. USt. — Verkostung nach Voranmeldung, samstags ab zehn Uhr.
          </p>
        </BlurFade>
      </div>
    </section>
  )
}
