import { useState } from 'react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { AmbientImage } from '@components/ambient-image/ambient-image'
import { ShinyText } from '@components/shiny-text/shiny-text'
import { ProductV5 } from '../showcase/ProductV5'

/**
 * Cave Nocturne — cinematic storefront. The shop is a night walk through
 * the vault: three spotlit bottles up front (AmbientImage glow), below
 * them the rest of the list as a dim gold ledger. Every position opens
 * the Chiaroscuro detail page (ProductV5).
 */

interface Spot {
  name: string
  vintage: string
  note: string
  price: string
  image: string
  alt: string
}

const SPOTLIGHTS: Spot[] = [
  {
    name: 'St. Laurent',
    vintage: 'Reserve 2020',
    note: 'Weichsel, Tabak, kühle Salzspur',
    price: '85,00 €',
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80',
    alt: 'St. Laurent Reserve 2020 im Spotlight',
  },
  {
    name: 'Pinot Noir',
    vintage: 'Terrassen 2021',
    note: 'Ganztrauben, ungefiltert, leise',
    price: '72,00 €',
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80',
    alt: 'Pinot Noir Terrassen 2021 im Spotlight',
  },
  {
    name: 'Riesling',
    vintage: 'Steinriegl 2021',
    note: 'Nasser Stein, weißer Pfirsich',
    price: '64,00 €',
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80',
    alt: 'Riesling Steinriegl 2021 im Spotlight',
  },
]

const LEDGER = [
  { no: '04', name: 'Grüner Veltliner Achleiten 2023', meta: 'Urgestein · trocken', price: '32,00 €' },
  { no: '05', name: 'Riesling Loibenberg Smaragd 2022', meta: 'Löss über Fels · trocken', price: '48,00 €' },
  { no: '06', name: 'Grüner Veltliner Federspiel 2024', meta: 'Junge Reben · trocken', price: '19,00 €' },
]

export function StoreNocturne() {
  const [detailOpen, setDetailOpen] = useState(false)

  if (detailOpen) {
    return <ProductV5 onBack={() => setDetailOpen(false)} />
  }

  return (
    <section className="bg-[#0d0a09] px-6 py-16 sm:py-24 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <BlurFade delay={100} direction="down">
            <span className="mb-5 block text-[10px] font-bold tracking-[0.4em] text-[#c9a25e] uppercase">
              Cave Nocturne · Der Nachtverkauf
            </span>
          </BlurFade>
          <BlurFade delay={220} direction="up">
            <h1 className="font-display text-5xl leading-[1.02] font-light tracking-tight text-[#f3ece0] sm:text-6xl">
              Was im Dunkeln
              <br />
              <span className="italic"><ShinyText duration={8} shineColor="#e8d5ae">wartet.</ShinyText></span>
            </h1>
          </BlurFade>
          <BlurFade delay={340} direction="up">
            <p className="mt-6 text-lg leading-relaxed font-light text-[#a89a85]">
              Drei Flaschen stehen im Licht, der Rest liegt still im Regal.
              Treten Sie näher — jede Position führt tiefer in den Keller.
            </p>
          </BlurFade>
        </div>

        {/* Spotlit bottles */}
        <div className="mt-20 grid grid-cols-1 gap-14 sm:grid-cols-3 sm:gap-8 lg:gap-12">
          {SPOTLIGHTS.map((spot, i) => (
            <BlurFade key={spot.vintage} delay={400 + i * 150} direction="up">
              <button
                onClick={() => setDetailOpen(true)}
                aria-label={`${spot.name} ${spot.vintage} — Detailseite öffnen`}
                className="group flex w-full flex-col items-center text-center transition-transform duration-500 hover:-translate-y-2 focus-visible:ring-2 focus-visible:ring-[#c9a25e]/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0d0a09] focus-visible:outline-none"
              >
                <div className="relative flex aspect-3/4 w-full items-end justify-center overflow-hidden bg-radial from-[#2a2019] via-[#171210] to-transparent">
                  <AmbientImage
                    src={spot.image}
                    alt={spot.alt}
                    intensity={0.5}
                    blur={60}
                    borderRadius="0"
                    className="h-[88%] w-auto"
                  />
                </div>
                <span className="mt-7 block text-[9px] font-bold tracking-[0.3em] text-[#6b5f50] uppercase">
                  {spot.note}
                </span>
                <span className="font-display mt-2 block text-2xl font-light tracking-tight text-[#f3ece0] transition-colors group-hover:text-[#e8d5ae]">
                  {spot.name} <span className="italic">{spot.vintage}</span>
                </span>
                <span className="mt-2 block text-base font-light text-[#c9a25e] tabular-nums">{spot.price}</span>
                <span
                  aria-hidden="true"
                  className="mt-4 h-px w-8 bg-[#c9a25e]/60 transition-all duration-500 group-hover:w-16 group-hover:bg-[#c9a25e]"
                />
              </button>
            </BlurFade>
          ))}
        </div>

        {/* Dim ledger — the rest of the vault */}
        <BlurFade delay={800} direction="up">
          <div className="mt-24">
            <div className="flex items-baseline justify-between border-b border-[#c9a25e]/25 pb-4">
              <span className="text-[10px] font-bold tracking-[0.35em] text-[#c9a25e] uppercase">
                Weiter hinten im Regal
              </span>
              <span className="text-[9px] font-bold tracking-[0.3em] text-[#6b5f50] uppercase">
                {LEDGER.length} Positionen
              </span>
            </div>
            <ul>
              {LEDGER.map(wine => (
                <li key={wine.no} className="border-b border-[#c9a25e]/10">
                  <button
                    onClick={() => setDetailOpen(true)}
                    aria-label={`${wine.name} — Detailseite öffnen`}
                    className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-5 text-left transition-colors duration-300 hover:bg-[#c9a25e]/[0.05] focus-visible:ring-2 focus-visible:ring-[#c9a25e]/70 focus-visible:ring-inset focus-visible:outline-none sm:grid-cols-[3rem_1fr_minmax(0,12rem)_6rem] sm:gap-6"
                  >
                    <span className="font-display text-sm font-light text-[#6b5f50] italic">{wine.no}</span>
                    <span className="font-display text-lg font-light tracking-tight text-[#d8cbb8] transition-colors group-hover:text-[#e8d5ae] sm:text-xl">
                      {wine.name}
                    </span>
                    <span className="hidden text-[9px] font-bold tracking-[0.25em] text-[#6b5f50] uppercase sm:block">
                      {wine.meta}
                    </span>
                    <span className="text-right text-sm font-light text-[#a89a85] tabular-nums">{wine.price}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </BlurFade>

        <BlurFade delay={950}>
          <p className="mt-12 text-center font-display text-sm font-light text-[#6b5f50] italic">
            Der Keller öffnet nachts nur auf Klingelzeichen — online jederzeit.
          </p>
        </BlurFade>
      </div>
    </section>
  )
}
