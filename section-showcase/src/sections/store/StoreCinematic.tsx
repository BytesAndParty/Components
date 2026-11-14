import { useState } from 'react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { Particles } from '@components/particles/particles'
import { ShinyText } from '@components/shiny-text/shiny-text'
import { ProductCinematic } from '../showcase/ProductCinematic'

/**
 * Cinematic Atmosphere — das Regal als vertikales Reel. StoreNocturne stellt
 * drei Flaschen ins Spotlight und den Rest in ein Ledger darunter; hier läuft
 * die ganze Auswahl als eine Spalte von Einstellungen durch, links bleibt der
 * Vorspann stehen. Jede Zeile führt auf ProductCinematic.
 *
 * Partikel bewusst dünn (25, zusätzlich gedimmt) — das dichte Feld gehört
 * Hero, CTA und Footer, sonst addieren sich die Sections zu Rauschen.
 */

interface Wine {
  no: string
  name: string
  vintage: string
  meta: string
  price: string
  image: string
  alt: string
}

const WINES: Wine[] = [
  {
    no: '01',
    name: 'Riesling',
    vintage: 'Steinriegl 2021',
    meta: 'Nasser Stein · weißer Pfirsich',
    price: '64,00 €',
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=400&q=80',
    alt: 'Riesling Steinriegl 2021',
  },
  {
    no: '02',
    name: 'Grüner Veltliner',
    vintage: 'Sooßer Höhe 2022',
    meta: 'Pfeffer · gelber Apfel',
    price: '32,00 €',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80',
    alt: 'Grüner Veltliner Sooßer Höhe 2022',
  },
  {
    no: '03',
    name: 'Rotgipfler',
    vintage: 'Ried Kramer 2022',
    meta: 'Quitte · Walnuss · dicht',
    price: '38,00 €',
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&q=80',
    alt: 'Rotgipfler Ried Kramer 2022',
  },
  {
    no: '04',
    name: 'St. Laurent',
    vintage: 'Reserve 2020',
    meta: 'Weichsel · Tabak · kühl',
    price: '85,00 €',
    image: 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=400&q=80',
    alt: 'St. Laurent Reserve 2020',
  },
  {
    no: '05',
    name: 'Zweigelt',
    vintage: 'Lindkogel 2022',
    meta: 'Dunkle Kirsche · weich',
    price: '26,00 €',
    image: 'https://images.unsplash.com/photo-1543418219-44e30b057fea?w=400&q=80',
    alt: 'Zweigelt Lindkogel 2022',
  },
  {
    no: '06',
    name: 'Traminer',
    vintage: 'Kramer 2022',
    meta: 'Rosenblüte · Litschi',
    price: '26,00 €',
    image: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=400&q=80',
    alt: 'Gelber Traminer Ried Kramer 2022',
  },
]

export function StoreCinematic() {
  const [detailOpen, setDetailOpen] = useState(false)

  if (detailOpen) {
    return <ProductCinematic onBack={() => setDetailOpen(false)} />
  }

  return (
    <section className="relative overflow-hidden bg-zinc-950 px-6 py-16 sm:py-24 lg:px-16 lg:py-32">
      <Particles
        particleColors={['#fff', 'var(--accent-lifted)']}
        particleCount={25}
        speed={0.06}
        className="pointer-events-none absolute inset-0 z-0 opacity-60"
      />

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        {/* Vorspann — bleibt beim Scrollen stehen, während das Reel durchläuft */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <BlurFade delay={100} direction="down">
            <span className="mb-5 block text-[10px] font-bold tracking-[0.4em] text-accent-lifted uppercase">
              Die Auswahl · {WINES.length} Positionen
            </span>
          </BlurFade>
          <BlurFade delay={220} direction="up">
            <h1 className="font-display text-5xl leading-[1.02] font-medium tracking-tight text-white sm:text-6xl">
              Sechs Weine,
              <br />
              ein{' '}
              <ShinyText duration={9} shineColor="color-mix(in oklch, var(--accent) 65%, white)">
                Hang.
              </ShinyText>
            </h1>
          </BlurFade>
          <BlurFade delay={340} direction="up">
            <p className="mt-6 max-w-sm text-lg leading-relaxed text-zinc-400">
              Alles, was wir füllen, wächst innerhalb von zwanzig Gehminuten.
              Der Rest ist Reihenfolge.
            </p>
          </BlurFade>
          <BlurFade delay={440} direction="up">
            <span
              aria-hidden="true"
              className="mt-8 block h-px w-16 bg-accent-lifted/50"
            />
          </BlurFade>
        </div>

        {/* Das Reel */}
        <ul className="flex flex-col">
          {WINES.map((wine, i) => (
            <li key={wine.no} className="border-t border-white/10 last:border-b">
              <BlurFade delay={300 + i * 110} direction="up">
                <button
                  type="button"
                  onClick={() => setDetailOpen(true)}
                  aria-label={`${wine.name} ${wine.vintage} — Detailseite öffnen`}
                  className="group grid w-full grid-cols-[3.5rem_1fr_auto] items-center gap-5 py-5 text-left transition-colors duration-300 hover:bg-white/[0.03] focus-visible:ring-2 focus-visible:ring-accent-lifted focus-visible:ring-inset focus-visible:outline-none sm:grid-cols-[3.5rem_1fr_minmax(0,11rem)_6rem] sm:gap-6"
                >
                  {/* Kontaktabzug-Kader */}
                  <span className="relative block aspect-3/4 w-14 overflow-hidden bg-white/[0.04]">
                    <img
                      src={wine.image}
                      alt={wine.alt}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-60 saturate-[1.1] transition-all duration-500 group-hover:opacity-100"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-1 top-1 flex justify-between opacity-40"
                    >
                      {Array.from({ length: 3 }).map((_, tick) => (
                        <span key={tick} className="h-0.5 w-0.5 bg-white/70" />
                      ))}
                    </span>
                  </span>

                  <span className="flex flex-col gap-1">
                    <span className="font-display text-lg tracking-tight text-white sm:text-xl">
                      {wine.name} <span className="italic">{wine.vintage}</span>
                    </span>
                    <span className="text-[9px] font-bold tracking-[0.25em] text-zinc-400 uppercase sm:hidden">
                      {wine.meta}
                    </span>
                  </span>

                  <span className="hidden text-[9px] font-bold tracking-[0.25em] text-zinc-400 uppercase sm:block">
                    {wine.meta}
                  </span>

                  <span className="flex items-center justify-end gap-3 text-sm text-zinc-300 tabular-nums">
                    {wine.price}
                    <span
                      aria-hidden="true"
                      className="hidden h-px w-4 bg-accent-lifted/50 transition-all duration-500 group-hover:w-8 group-hover:bg-accent-lifted sm:block"
                    />
                  </span>
                </button>
              </BlurFade>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
