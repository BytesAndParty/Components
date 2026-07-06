import { useState } from 'react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'
import { cn } from '@components/lib/utils'
import { ProductV3 } from '../showcase/ProductV3'
import { SAMPLE_WINES } from './cards/sample-wines'

/**
 * Storefront in reinem „Editorial Spread"-Design: das Sortiment als aufgeschlagenes
 * Magazinheft — alternierende Bild/Text-Doppelseiten mit Fiche Technique, statt eines
 * Karten-Rasters. Eines der drei aus der StorePage herausgelösten Einzeldesigns.
 */
export function StoreEditorial() {
  const [active, setActive] = useState(false)

  if (active) {
    return <ProductV3 onBack={() => setActive(false)} />
  }

  return (
    <section className="bg-[#efece5] py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto mb-20 max-w-2xl text-center">
          <BlurFade delay={100} direction="down">
            <span className="text-[11px] font-bold tracking-[0.4em] text-zinc-400 uppercase">Editorial Spread</span>
          </BlurFade>
          <BlurFade delay={200} direction="down">
            <h2 className="font-display mt-4 text-4xl font-light tracking-tight text-zinc-900 sm:text-5xl">
              Das Jahrgangsheft
            </h2>
          </BlurFade>
          <BlurFade delay={300}>
            <p className="mt-3 text-base font-light text-zinc-500">
              Sechs Doppelseiten, ein Sortiment — jede Flasche ihre eigene Fiche Technique.
            </p>
          </BlurFade>
        </div>

        <div className="flex flex-col">
          {SAMPLE_WINES.map((w, i) => {
            const shortYear = String(w.wine.vintage).slice(-2)
            const reversed = i % 2 === 1

            return (
              <article
                key={w.wine.name}
                className="grid grid-cols-1 items-center gap-10 border-t border-zinc-300/70 py-14 first:border-t-0 lg:grid-cols-2 lg:gap-16"
              >
                <BlurFade
                  delay={150}
                  direction={reversed ? 'right' : 'left'}
                  className={cn('relative', reversed && 'lg:order-2')}
                >
                  <RevealImage
                    src={w.wine.imageSrc}
                    alt={w.wine.imageAlt}
                    direction={reversed ? 'right' : 'left'}
                    duration={1200}
                    className="aspect-4/3 w-full"
                  />
                  <span className="absolute bottom-3 left-4 text-[10px] font-bold tracking-[0.3em] text-white/80 uppercase [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
                    {w.plate}
                  </span>
                </BlurFade>

                <BlurFade delay={300} direction="up">
                  <div className="mb-4 flex items-center justify-between border-b border-zinc-300/70 pb-2">
                    <span className="text-[9px] font-bold tracking-[0.25em] text-zinc-400 uppercase">Fiche Technique</span>
                    <span className="font-display text-xs text-zinc-400 italic">{w.fiche}</span>
                  </div>

                  <span className="font-display mb-1 block text-6xl font-light tracking-tighter text-zinc-900">’{shortYear}</span>
                  <h3 className="font-display text-3xl leading-tight font-light tracking-tight text-zinc-900">{w.wine.name}</h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed font-light text-zinc-500">{w.wine.description}</p>

                  <div className="mt-8 flex items-center justify-between border-t border-zinc-300/70 pt-6">
                    <div>
                      <span className="block text-[9px] tracking-widest text-zinc-400 uppercase">Ab Hof</span>
                      <span className="text-xl font-light tracking-tight text-zinc-900">{w.wine.price}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActive(true)}
                      className="group inline-flex min-h-11 cursor-pointer items-center gap-3 pb-0.5 text-xs font-bold tracking-[0.2em] text-zinc-900 uppercase transition-colors hover:text-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
                    >
                      <span>Anfragen</span>
                      <span aria-hidden="true" className="h-px w-6 bg-zinc-900 transition-all duration-300 group-hover:w-10" />
                    </button>
                  </div>
                </BlurFade>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
