import { useState } from 'react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { ProductV1 } from '../showcase/ProductV1'
import { WineCardModern } from './cards/WineCardModern'
import { SAMPLE_WINES } from './cards/sample-wines'

/**
 * Storefront in reinem „Modern & Interactive"-Design (dunkel/semantisch, AmbientImage-
 * Glow, Accent-CTA). Eines der drei aus der StorePage herausgelösten Einzeldesigns.
 */
export function StoreModern() {
  const [active, setActive] = useState(false)

  if (active) {
    return <ProductV1 onBack={() => setActive(false)} />
  }

  return (
    <section className="bg-background py-16 sm:py-24 transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <BlurFade delay={100} direction="down">
            <span className="text-accent-readable text-[11px] font-bold tracking-[0.4em] uppercase">Modern &amp; Interaktiv</span>
          </BlurFade>
          <BlurFade delay={200} direction="down">
            <h2 className="font-display text-foreground mt-4 text-4xl font-light tracking-tight sm:text-5xl">
              Die Kollektion
            </h2>
          </BlurFade>
          <BlurFade delay={300}>
            <p className="text-muted-foreground mt-3 text-base font-light">
              Sechs Weine, ein Design — dunkel, mit Ambient-Glow und Accent-Aktion.
            </p>
          </BlurFade>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_WINES.map((w, i) => (
            <BlurFade key={w.wine.name} delay={350 + i * 90} direction="up" className="flex flex-col">
              <WineCardModern wine={w.wine} rating={w.rating} onSelect={() => setActive(true)} />
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
