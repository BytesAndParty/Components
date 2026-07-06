import { useState } from 'react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { ProductV3 } from '../showcase/ProductV3'
import { WineCardEditorial } from './cards/WineCardEditorial'
import { SAMPLE_WINES } from './cards/sample-wines'

/**
 * Storefront in reinem „Editorial Spread"-Design (weiße Fiche-Technique-Karten mit
 * Platten-Signatur). Eines der drei aus der StorePage herausgelösten Einzeldesigns.
 */
export function StoreEditorial() {
  const [active, setActive] = useState(false)

  if (active) {
    return <ProductV3 onBack={() => setActive(false)} />
  }

  return (
    <section className="bg-[#efece5] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <BlurFade delay={100} direction="down">
            <span className="text-[11px] font-bold tracking-[0.4em] text-zinc-400 uppercase">Editorial Spread</span>
          </BlurFade>
          <BlurFade delay={200} direction="down">
            <h2 className="font-display mt-4 text-4xl font-light tracking-tight text-zinc-900 sm:text-5xl">
              Die Kollektion
            </h2>
          </BlurFade>
          <BlurFade delay={300}>
            <p className="mt-3 text-base font-light text-zinc-500">
              Sechs Weine, ein Design — jede Karte eine Fiche Technique mit Platten-Nummer.
            </p>
          </BlurFade>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_WINES.map((w, i) => (
            <BlurFade key={w.wine.name} delay={350 + i * 90} direction="up" className="flex flex-col">
              <WineCardEditorial wine={w.wine} plate={w.plate} fiche={w.fiche} onSelect={() => setActive(true)} />
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
