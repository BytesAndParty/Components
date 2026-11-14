import { useState } from 'react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'
import { ProductSchwarzweiss } from '../showcase/ProductSchwarzweiss'
import { SAMPLE_WINES } from './cards/sample-wines'
import { SCHWARZWEISS_FONTS } from '../family-fonts'

/**
 * Schwarzweiß — das Sortiment als versetztes Raster statt gleichförmiger
 * Kacheln: jede Position sitzt auf eigener Höhe, die Bildformate wechseln
 * zwischen 4:5, 3:4 und Quadrat. Zwischen den beiden Bildstrecken steht ein
 * ganzseitiges Serif-Zitat als Rhythmuswechsel. Jede Position öffnet
 * ProductSchwarzweiss. Abgrenzung zu StoreMaison: reines Weiß statt Cream,
 * kein Karten-Raster, keine Fig.-Nummern, keine vertikale Schriftleiste.
 */

/** Position im versetzten Raster — feste Klassenstrings, damit Tailwind sie sieht. */
const PLACEMENT: Array<{ cell: string; ratio: string }> = [
  { cell: 'md:col-span-5 md:col-start-1', ratio: 'aspect-4/5' },
  { cell: 'md:col-span-4 md:col-start-7 md:mt-32', ratio: 'aspect-3/4' },
  { cell: 'md:col-span-4 md:col-start-2 md:mt-8', ratio: 'aspect-square' },
  { cell: 'md:col-span-4 md:col-start-2', ratio: 'aspect-3/4' },
  { cell: 'md:col-span-5 md:col-start-7 md:mt-24', ratio: 'aspect-4/5' },
  { cell: 'md:col-span-4 md:col-start-3 md:mt-10', ratio: 'aspect-square' },
]

function Position({
  index,
  onSelect,
}: {
  index: number
  onSelect: () => void
}) {
  const { wine } = SAMPLE_WINES[index]
  const { cell, ratio } = PLACEMENT[index]

  return (
    <div className={cell}>
      <BlurFade delay={80 + (index % 3) * 120} direction="up">
        <button
          type="button"
          onClick={onSelect}
          className="group block w-full min-h-11 cursor-pointer rounded-xs text-left focus-visible:ring-2 focus-visible:ring-[#000101] focus-visible:ring-offset-4 focus-visible:ring-offset-[#ffffff] focus-visible:outline-none"
        >
          {/* Der Wrapper trägt die physische Reaktion — RevealImage setzt am
              <img> eigene Transforms, die eine Hover-Skalierung überschreiben. */}
          <div className="transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
            <RevealImage
              src={wine.imageSrc}
              alt={`${wine.name} ${wine.vintage} — Flasche vor heller Wand`}
              direction="up"
              duration={1300}
              className={`${ratio} w-full`}
              imgClassName="grayscale"
            />
          </div>

          <div className="mt-5 flex items-baseline justify-between border-t border-[#000101] pt-4">
            <span className="text-[10px] font-semibold tracking-[0.26em] text-[#5f5f5f] uppercase">
              {wine.lage}
            </span>
            <span className="text-[10px] font-semibold tracking-[0.26em] text-[#5f5f5f] uppercase">
              {wine.vintage}
            </span>
          </div>

          <h3 className="font-display mt-4 text-[clamp(1.6rem,2.6vw,2.25rem)] leading-[1.05] font-light tracking-tight text-[#000101]">
            {wine.name}
          </h3>

          <p className="mt-4 max-w-sm text-base leading-[1.9] text-[#5f5f5f]">{wine.description}</p>

          <span className="mt-6 inline-flex items-center gap-4">
            <span className="font-display text-xl leading-none font-light text-[#000101]">{wine.price}</span>
            <span
              aria-hidden="true"
              className="h-px w-8 bg-[#000101] transition-all duration-500 group-hover:w-16"
            />
          </span>
        </button>
      </BlurFade>
    </div>
  )
}

export function StoreSchwarzweiss() {
  const [active, setActive] = useState(false)

  if (active) {
    return <ProductSchwarzweiss onBack={() => setActive(false)} />
  }

  return (
    <section style={SCHWARZWEISS_FONTS} className="w-full bg-[#ffffff] px-6 py-10 sm:px-10 lg:px-16 lg:py-14">
      {/* Kopfleiste — dieselbe Rahmung wie im Hero. */}
      <BlurFade delay={0} direction="down">
        <div className="flex items-baseline justify-between border-b border-[#000101] pb-4">
          <span className="font-display text-xl leading-none font-light text-[#000101]">Buchart58</span>
          <span className="text-[10px] font-semibold tracking-[0.32em] text-[#5f5f5f] uppercase">
            Sechs Positionen
          </span>
        </div>
      </BlurFade>

      {/* Erster Takt — schmale zentrierte Textspalte. */}
      <div className="mx-auto max-w-2xl pt-20 text-center sm:pt-28">
        <BlurFade delay={80} direction="up">
          <span className="block text-[10px] font-semibold tracking-[0.4em] text-[#5f5f5f] uppercase">
            Ab Hof & Versand
          </span>
        </BlurFade>
        <BlurFade delay={180} direction="up">
          <h2 className="font-display mt-7 text-[clamp(2.5rem,6.5vw,5rem)] leading-[1] font-light tracking-tight text-[#000101]">
            Das Sortiment
          </h2>
        </BlurFade>
        <BlurFade delay={300} direction="up">
          <p className="mx-auto mt-10 max-w-md text-[17px] leading-[2] text-[#5f5f5f]">
            Sechs Weine, jeder von einer Riede, keiner als Verschnitt. Die
            Reihenfolge unten folgt dem Hang, nicht dem Preis — von der obersten
            Terrasse hinunter in die Thermenregion.
          </p>
        </BlurFade>
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Zweiter Takt — versetztes Raster, erste Strecke. */}
        <div className="mt-20 grid grid-cols-1 gap-x-10 gap-y-20 sm:mt-28 md:grid-cols-12">
          {[0, 1, 2].map(i => (
            <Position key={SAMPLE_WINES[i].wine.name} index={i} onSelect={() => setActive(true)} />
          ))}
        </div>

        {/* Dritter Takt — ganzseitiges Serif-Zitat. */}
        <div className="mt-24 border-y border-[#000101] py-20 sm:mt-32 sm:py-28">
          <BlurFade delay={0} direction="up">
            <blockquote className="mx-auto max-w-4xl text-center">
              <p className="font-display text-[clamp(1.8rem,4.2vw,3.2rem)] leading-[1.22] font-light tracking-tight text-[#000101]">
                „Wir füllen sechs Weine, weil wir sieben nicht mehr
                auseinanderhalten könnten.“
              </p>
              <footer className="mt-10 text-[10px] font-semibold tracking-[0.32em] text-[#5f5f5f] uppercase">
                Buchart58 — Kellergasse, Niederösterreich
              </footer>
            </blockquote>
          </BlurFade>
        </div>

        {/* Zweite Strecke — anders versetzt als die erste. */}
        <div className="mt-24 grid grid-cols-1 gap-x-10 gap-y-20 sm:mt-32 md:grid-cols-12">
          {[3, 4, 5].map(i => (
            <Position key={SAMPLE_WINES[i].wine.name} index={i} onSelect={() => setActive(true)} />
          ))}
        </div>

        {/* Fußzeile — stiller Abschluss auf der Mittelachse. */}
        <BlurFade delay={0} className="mt-24 border-t border-[#000101] pt-6 sm:mt-32">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <span className="text-[10px] font-semibold tracking-[0.3em] text-[#5f5f5f] uppercase">
              Versand ab sechs Flaschen frei
            </span>
            <span className="text-[10px] font-semibold tracking-[0.3em] text-[#5f5f5f] uppercase">
              Jahrgänge 2020 – 2023
            </span>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
