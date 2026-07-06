import { useState } from 'react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { ProductV2 } from '../showcase/ProductV2'
import { WineCardArtisanal } from './cards/WineCardArtisanal'
import { SAMPLE_WINES } from './cards/sample-wines'

/**
 * Storefront in reinem „Artisanal & Minimal"-Design (Cream, Serif, ShinyText,
 * Underline-CTA). Eines der drei aus der StorePage herausgelösten Einzeldesigns.
 */
export function StoreArtisanal() {
  const [active, setActive] = useState(false)

  if (active) {
    return <ProductV2 onBack={() => setActive(false)} />
  }

  return (
    <section className="bg-[#fdfcf9] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <BlurFade delay={100} direction="down">
            <span className="text-[11px] font-bold tracking-[0.4em] text-zinc-400 uppercase">Artisanal &amp; Minimal</span>
          </BlurFade>
          <BlurFade delay={200} direction="down">
            <h2 className="font-display mt-4 text-4xl font-light tracking-tight text-zinc-900 sm:text-5xl">
              Die Kollektion
            </h2>
          </BlurFade>
          <BlurFade delay={300}>
            <p className="mt-3 text-base font-light text-zinc-500">
              Sechs Weine, ein Design — Cream-Papier, Serif und stille Details.
            </p>
          </BlurFade>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_WINES.map((w, i) => (
            <BlurFade key={w.wine.name} delay={350 + i * 90} direction="up" className="flex flex-col">
              <WineCardArtisanal wine={w.wine} onSelect={() => setActive(true)} />
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
