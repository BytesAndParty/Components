import { useState } from 'react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { Lens } from '@components/lens/lens'
import { ShinyText } from '@components/shiny-text/shiny-text'
import { AddToCartButton } from '@components/add-to-cart-button/add-to-cart-button'

/**
 * Grand Cru Detail — Domaine Privée product page. The bottle stands in an
 * arch window with a magnifier (Lens) for label inspection; the right column
 * is an engraved fiche: tasting profile as hairline gauges, format selector,
 * bordeaux cart action and a ledger of cellar facts.
 */

export interface ProductV4Props {
  onBack?: () => void
}

const PROFILE = [
  { label: 'Körper', value: 72 },
  { label: 'Frucht', value: 58 },
  { label: 'Mineralik', value: 90 },
  { label: 'Länge', value: 84 },
]

const FACTS = [
  ['Rebsorte', 'Riesling, wurzelecht'],
  ['Lage', 'Ried Steinriegl, Parzelle 7'],
  ['Ausbau', '14 Monate, großes Eichenfass'],
  ['Alkohol', '12,5 % Vol. · trocken'],
  ['Füllmenge', '0,75 l · Naturkork'],
  ['Lagerpotenzial', '2045 +'],
]

export function ProductV4({ onBack }: ProductV4Props) {
  const [selectedFormat, setSelectedFormat] = useState('0,75 l')

  return (
    <section className="relative overflow-hidden bg-[#f6f3ec] px-6 py-24 lg:px-16 lg:py-32">
      <div className="relative z-10 mx-auto max-w-7xl">
        {onBack && (
          <BlurFade delay={50} direction="down" className="mb-14">
            <button
              onClick={onBack}
              className="group inline-flex min-h-11 items-center gap-3 text-[10px] font-bold tracking-[0.25em] text-[#a89e8a] uppercase transition-colors hover:text-[#221b16] focus-visible:ring-2 focus-visible:ring-[#5c2331]/60 focus-visible:outline-none"
            >
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
              <span>Zurück in die Cave</span>
            </button>
          </BlurFade>
        )}

        <div className="grid grid-cols-1 gap-20 lg:grid-cols-[5fr_6fr] lg:gap-24">
          {/* Bottle in arch window, magnifier for the label */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <BlurFade delay={150} direction="up">
              <div className="relative mx-auto w-[min(78vw,380px)]">
                {/* Ghost vintage behind the arch */}
                <span
                  aria-hidden="true"
                  className="font-display pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 text-[9rem] leading-none font-light tracking-tighter text-[#221b16]/[0.05] italic select-none"
                >
                  ’21
                </span>
                <Lens zoom={2.2} lensSize={190} ringColor="#5c2331">
                  {/* Foto verglast den Bogen vollständig — object-contain ließe
                      das Rechteck des Fotos sichtbar im Rahmen schweben. */}
                  <div className="aspect-[3/4.4] w-full overflow-hidden rounded-t-full bg-gradient-to-b from-[#ece7db] to-[#e2dccc]">
                    <img
                      src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=1200&q=80"
                      alt="Riesling Steinriegl 2021 — Flasche mit handgeschöpftem Etikett"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </Lens>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-4 rounded-t-full border border-[#ddd5c4]"
                />
              </div>
              <p className="mt-8 text-center text-[9px] font-bold tracking-[0.3em] text-[#a89e8a] uppercase">
                Mit dem Zeiger über die Flasche — die Lupe zeigt das Etikett
              </p>
            </BlurFade>
          </div>

          {/* Engraved fiche */}
          <div className="flex flex-col gap-11">
            <div>
              <BlurFade delay={200} direction="up">
                <span className="mb-4 block text-[10px] font-bold tracking-[0.4em] text-[#8a8070] uppercase">
                  Grand Cru · Flasche № 0214 / 1800
                </span>
              </BlurFade>
              <BlurFade delay={300} direction="up">
                <h2 className="font-display text-5xl leading-[1.04] font-light tracking-tight text-[#221b16] sm:text-6xl">
                  Riesling <span className="italic text-[#5c2331]">Steinriegl</span>
                  <br />
                  <ShinyText
                    duration={10}
                    shineColor="oklch(0.78 0.08 85 / 0.5)"
                    className="inline-block! font-display italic"
                  >
                    Jahrgang 2021
                  </ShinyText>
                </h2>
              </BlurFade>
            </div>

            <BlurFade delay={400} direction="up">
              <p className="max-w-lg text-lg leading-relaxed font-light text-[#6f6657]">
                Von sechzig Jahre alten Reben über Schiefer. Weißer Pfirsich,
                nasser Stein, ein Zug Salz im Abgang — ein Wein, der nicht laut
                wird, weil er es nicht nötig hat.
              </p>
            </BlurFade>

            {/* Tasting profile — hairline gauges */}
            <BlurFade delay={500} direction="up">
              <div className="border-y border-[#ddd5c4] py-8">
                <span className="mb-6 block text-[10px] font-bold tracking-[0.3em] text-[#8a8070] uppercase">
                  Degustationsprofil
                </span>
                <ul className="flex flex-col gap-5">
                  {PROFILE.map(({ label, value }) => (
                    <li key={label} className="grid grid-cols-[6rem_1fr] items-center gap-6">
                      <span className="text-xs font-medium tracking-wide text-[#221b16]">{label}</span>
                      <div
                        role="meter"
                        aria-label={label}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={value}
                        className="relative h-px bg-[#ddd5c4]"
                      >
                        <div
                          className="absolute inset-y-0 left-0 -my-px h-[3px] bg-[#5c2331]"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </BlurFade>

            {/* Format */}
            <BlurFade delay={600} direction="up">
              <div className="flex flex-col gap-5">
                <span className="text-[10px] font-bold tracking-[0.3em] text-[#8a8070] uppercase">Format</span>
                <div className="flex gap-8" role="group" aria-label="Flaschenformat wählen">
                  {['0,375 l', '0,75 l', '1,5 l Magnum'].map(format => (
                    <button
                      key={format}
                      onClick={() => setSelectedFormat(format)}
                      aria-pressed={selectedFormat === format}
                      className={`min-h-11 border-b-2 pb-1 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-[#5c2331]/60 focus-visible:outline-none ${
                        selectedFormat === format
                          ? 'border-[#5c2331] text-[#221b16]'
                          : 'border-transparent text-[#b3a98f] hover:text-[#6f6657]'
                      }`}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>
            </BlurFade>

            {/* Price & cart */}
            <BlurFade delay={700} direction="up" className="flex flex-wrap items-end gap-12">
              <div className="flex flex-col">
                <span className="mb-1 text-[10px] font-bold tracking-[0.3em] text-[#8a8070] uppercase">Ab Hof</span>
                <span className="font-display text-5xl font-light tracking-tight text-[#221b16] tabular-nums">
                  64,00 €
                </span>
              </div>
              <AddToCartButton
                onClick={() => console.log(`Added to cart: ${selectedFormat}`)}
                bgColor="#5c2331"
                className="rounded-none! px-12! py-6! text-base!"
              />
            </BlurFade>

            {/* Cellar ledger */}
            <BlurFade delay={800} direction="up">
              <dl className="grid grid-cols-1 gap-x-12 border-t border-[#ddd5c4] pt-10 sm:grid-cols-2">
                {FACTS.map(([term, detail]) => (
                  <div key={term} className="flex items-baseline justify-between gap-6 border-b border-[#ddd5c4]/60 py-3.5">
                    <dt className="text-[10px] font-bold tracking-[0.2em] text-[#a89e8a] uppercase">{term}</dt>
                    <dd className="text-right text-sm font-medium text-[#4d4436]">{detail}</dd>
                  </div>
                ))}
              </dl>
            </BlurFade>

            <BlurFade delay={900} direction="up">
              <p className="font-display text-sm font-light text-[#8a8070] italic">
                Falstaff 96 · Wine Enthusiast 94 — versichert & temperiert geliefert, ab sechs Flaschen frei Haus.
              </p>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  )
}
