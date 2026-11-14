import { useState } from 'react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { Backlight } from '@components/backlight/backlight'
import { ShinyText } from '@components/shiny-text/shiny-text'
import { AddToCartButton } from '@components/add-to-cart-button/add-to-cart-button'

/**
 * Chiaroscuro — cinematic product page. One bottle in a candle-gold
 * spotlight (Backlight) against warm black, everything else recedes:
 * gold hairlines, a glowing vintage ghost, tasting notes that read like
 * end credits. Counterpart to the cream Grand Cru page (ProductV4).
 */

export interface ProductV5Props {
  onBack?: () => void
}

const NOTES = [
  ['Auge', 'Dunkler Granat, schwarzer Kern'],
  ['Nase', 'Weichsel, Tabak, nasser Lehm'],
  ['Gaumen', 'Engmaschig, kühl, lange Salzspur'],
  ['Fass', '24 Monate, 500 l, drittbelegt'],
  ['Alkohol', '13,0 % Vol. · trocken'],
  ['Reife', 'Jetzt — 2042'],
]

export function ProductV5({ onBack }: ProductV5Props) {
  const [selectedFormat, setSelectedFormat] = useState('0,75 l')

  return (
    <section className="relative overflow-hidden bg-[#0d0a09] px-6 py-16 sm:py-24 lg:px-16 lg:py-32">
      {/* Ghost vintage behind everything */}
      <span
        aria-hidden="true"
        className="font-display pointer-events-none absolute top-16 left-1/2 -translate-x-1/2 text-[clamp(10rem,28vw,24rem)] leading-none font-light tracking-tighter text-[#c9a25e]/[0.05] italic select-none"
      >
        ’20
      </span>

      <div className="relative z-10 mx-auto max-w-7xl">
        {onBack && (
          <BlurFade delay={50} direction="down" className="mb-14">
            <button
              onClick={onBack}
              className="group inline-flex min-h-11 items-center gap-3 text-[10px] font-bold tracking-[0.25em] text-[#6b5f50] uppercase transition-colors hover:text-[#e8d5ae] focus-visible:ring-2 focus-visible:ring-[#c9a25e]/70 focus-visible:outline-none"
            >
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
              <span>Zurück ans Licht</span>
            </button>
          </BlurFade>
        )}

        <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2 lg:gap-24">
          {/* The bottle in the spotlight */}
          <BlurFade delay={150} direction="up">
            <div className="relative mx-auto w-full max-w-md">
              <Backlight color="#c9a25e" intensity={0.35} blur={90} blobs={2} speed={0.5}>
                <div className="flex aspect-3/4 items-end justify-center bg-radial from-[#2a2019] via-[#171210] to-transparent">
                  <img
                    src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=1200&q=80"
                    alt="St. Laurent Reserve 2020 — Flasche im Kerzenlicht"
                    className="h-[94%] object-contain drop-shadow-[0_36px_48px_rgba(0,0,0,0.7)]"
                  />
                </div>
              </Backlight>
              <p className="mt-6 text-center text-[9px] font-bold tracking-[0.3em] text-[#6b5f50] uppercase">
                Flasche № 0311 / 1200 · Handverkorkt
              </p>
            </div>
          </BlurFade>

          {/* End-credits fiche */}
          <div className="flex flex-col gap-11">
            <div>
              <BlurFade delay={250} direction="up">
                <span className="mb-4 block text-[10px] font-bold tracking-[0.4em] text-[#c9a25e] uppercase">
                  Reserve · Nur in dunklen Jahren
                </span>
              </BlurFade>
              <BlurFade delay={350} direction="up">
                <h2 className="font-display text-5xl leading-[1.04] font-light tracking-tight text-[#f3ece0] sm:text-6xl">
                  St. Laurent
                  <br />
                  <span className="italic">
                    <ShinyText duration={9} shineColor="#e8d5ae" className="inline-block!">
                      Reserve 2020
                    </ShinyText>
                  </span>
                </h2>
              </BlurFade>
            </div>

            <BlurFade delay={450} direction="up">
              <p className="max-w-lg text-lg leading-relaxed font-light text-[#a89a85]">
                Gelesen bei Vollmond, weil es sich so ergab. Vierundzwanzig
                Monate im Dunkeln — ein Rotwein wie ein Kellergang: kühl,
                gerade, und am Ende steht ein Licht.
              </p>
            </BlurFade>

            {/* Credits ledger */}
            <BlurFade delay={550} direction="up">
              <dl className="grid grid-cols-1 border-t border-[#c9a25e]/20 sm:grid-cols-2 sm:gap-x-12">
                {NOTES.map(([term, detail]) => (
                  <div key={term} className="flex items-baseline justify-between gap-6 border-b border-[#c9a25e]/15 py-3.5">
                    <dt className="text-[10px] font-bold tracking-[0.2em] text-[#6b5f50] uppercase">{term}</dt>
                    <dd className="text-right text-sm font-light text-[#d8cbb8]">{detail}</dd>
                  </div>
                ))}
              </dl>
            </BlurFade>

            {/* Format */}
            <BlurFade delay={650} direction="up">
              <div className="flex flex-col gap-5">
                <span className="text-[10px] font-bold tracking-[0.3em] text-[#6b5f50] uppercase">Format</span>
                <div className="flex gap-8" role="group" aria-label="Flaschenformat wählen">
                  {['0,75 l', '1,5 l Magnum'].map(format => (
                    <button
                      key={format}
                      onClick={() => setSelectedFormat(format)}
                      aria-pressed={selectedFormat === format}
                      className={`min-h-11 border-b pb-1 text-sm font-light transition-all focus-visible:ring-2 focus-visible:ring-[#c9a25e]/70 focus-visible:outline-none ${
                        selectedFormat === format
                          ? 'border-[#c9a25e] text-[#e8d5ae]'
                          : 'border-transparent text-[#6b5f50] hover:text-[#a89a85]'
                      }`}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>
            </BlurFade>

            {/* Price & cart */}
            <BlurFade delay={750} direction="up" className="flex flex-wrap items-end gap-12">
              <div className="flex flex-col">
                <span className="mb-1 text-[10px] font-bold tracking-[0.3em] text-[#6b5f50] uppercase">Ab Hof</span>
                <span className="font-display text-5xl font-light tracking-tight text-[#f3ece0] tabular-nums">
                  85,00 €
                </span>
              </div>
              <AddToCartButton
                onClick={() => console.log(`Added to cart: ${selectedFormat}`)}
                bgColor="#c9a25e"
                textColor="#0d0a09"
                className="rounded-none! px-12! py-6! text-base!"
              />
            </BlurFade>

            <BlurFade delay={850} direction="up">
              <p className="font-display text-sm font-light text-[#6b5f50] italic">
                Wird liegend, dunkel und temperiert verschickt — so, wie er gereift ist.
              </p>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  )
}
