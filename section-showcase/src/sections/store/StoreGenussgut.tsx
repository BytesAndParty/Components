import { useState } from 'react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'
import { ProductGenussgut } from '../showcase/ProductGenussgut'
import { SAMPLE_WINES } from './cards/sample-wines'

/**
 * Genussgut — der shop ist ein bereich unter vieren, nicht der hauptdarsteller:
 * oben läuft die bereichsleiste als aprikose-band über die volle breite, erst
 * darunter kommt das sortiment. kacheln mit hover-zoom im aprikose-hell-rahmen,
 * preise in ruhiger sans, alles in kleinschreibung und ohne gefüllte buttons.
 * Abgrenzung zu StoreMaison (versal-register mit platten und fiche-nummern):
 * hier führt die grotesk, und die outline-linie ersetzt jede farbfläche.
 */

/** Die vier geschäftsbereiche — dieselbe reihenfolge und benennung wie im hero. */
const BEREICHE = [
  { label: 'wein', href: '/wein', current: true },
  { label: 'verkostung', href: '/verkostung', current: false },
  { label: 'heuriger', href: '/heuriger', current: false },
  { label: 'erlebnisse', href: '/erlebnisse', current: false },
]

export function StoreGenussgut() {
  const [active, setActive] = useState(false)

  if (active) {
    return <ProductGenussgut onBack={() => setActive(false)} />
  }

  return (
    <div className="w-full">
      {/* Bereichsleiste auf Aprikose — petrol auf aprikose liegt bei 5,6:1,
          deshalb steht die schrift hier in vollem petrol statt aufgehellt. */}
      <nav aria-label="bereiche" className="w-full bg-[#f9bc88] px-6 py-5 lg:px-12">
        <ul className="mx-auto flex max-w-[100rem] flex-wrap items-center gap-x-10 gap-y-2">
          {BEREICHE.map((b) => (
            <li key={b.label}>
              <a
                href={b.href}
                aria-current={b.current ? 'page' : undefined}
                className="group flex min-h-11 flex-col justify-center focus-visible:ring-2 focus-visible:ring-[#204c52] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f9bc88] focus-visible:outline-none"
              >
                <span
                  className={`text-lg tracking-[-0.01em] text-[#204c52] ${b.current ? 'font-medium' : 'font-normal'}`}
                >
                  {b.label}
                </span>
                {/* Orangerot markiert genau einen zustand: den aktiven bereich. */}
                <span
                  aria-hidden="true"
                  className={`mt-1 block h-[1.5px] bg-[#d04c20] transition-all duration-500 ${
                    b.current
                      ? 'w-full opacity-100'
                      : 'w-6 opacity-0 group-hover:w-full group-hover:opacity-60 group-focus-visible:w-full group-focus-visible:opacity-60'
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section className="relative w-full overflow-hidden bg-[#fff3e8] px-6 py-16 sm:py-20 lg:px-12 lg:py-24">
        {/* Wortmarken-Wasserzeichen — angeschnitten, rein dekorativ */}
        <span
          aria-hidden="true"
          className="font-display pointer-events-none absolute -bottom-[8vw] -left-[5vw] text-[28vw] leading-none font-light tracking-tighter whitespace-nowrap text-[#fee0c9] select-none"
        >
          keller
        </span>

        <div className="relative z-10 mx-auto max-w-[100rem]">
          <BlurFade delay={80} direction="down">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#204c52]/15 pb-5">
              <span className="text-[11px] tracking-[0.3em] text-[#204c52]/80">sortiment · sechs positionen</span>
              <span className="text-[11px] tracking-[0.3em] text-[#204c52]/80">jahrgänge 2020 – 2023</span>
            </div>
          </BlurFade>

          {/* Aussage-block: kursive serif sitzt direkt auf der grotesk, beide
              bilden einen satz — wie im hero und in den feldern. */}
          <div className="mt-14 grid grid-cols-1 gap-10 lg:mt-20 lg:grid-cols-[1.45fr_1fr] lg:items-end lg:gap-16">
            <div>
              <BlurFade delay={180} direction="up">
                <p className="font-display text-[clamp(1.6rem,3.6vw,2.75rem)] leading-[1.02] font-light text-[#204c52] italic">
                  unser keller
                </p>
              </BlurFade>
              <BlurFade delay={300} direction="up">
                <h2 className="mt-1 text-[clamp(2rem,5.4vw,4.25rem)] leading-[0.98] font-medium tracking-[-0.03em] text-[#204c52]">
                  hat sechs flaschen im
                  <br />
                  angebot und keine
                  <br />
                  davon in eile.
                </h2>
              </BlurFade>
            </div>

            <div className="flex flex-col gap-8">
              <BlurFade delay={440} direction="up">
                <p className="max-w-sm text-base leading-relaxed text-[#204c52]/80">
                  sieben rieden, ein jahrgang, sechs positionen. wir versenden
                  innerhalb österreichs ab sechs flaschen — oder sie holen ab,
                  bleiben auf ein glas und nehmen die kiste am abend mit.
                </p>
              </BlurFade>
              <BlurFade delay={560} direction="up">
                <a
                  href="/versand"
                  className="inline-flex min-h-11 items-center justify-center self-start rounded-full border-[1.5px] border-[#204c52] px-8 text-sm tracking-[0.14em] text-[#204c52] transition-colors duration-300 hover:bg-[#204c52] hover:text-[#fff3e8] focus-visible:ring-2 focus-visible:ring-[#204c52] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fff3e8] focus-visible:outline-none"
                >
                  versand & abholung
                </a>
              </BlurFade>
            </div>
          </div>

          {/* Sortiment: bild im aprikose-hell-rahmen, zoom nur im inneren
              container, damit der rahmen als ruhige fläche stehen bleibt.
              Zoom und orangerote linie hängen an `group-hover`/`group-focus-within`
              der kachel — die einzige interaktive stelle bleibt der outline-button. */}
          <div className="mt-20 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:mt-28 lg:grid-cols-3">
            {SAMPLE_WINES.map((item, i) => (
              <BlurFade key={item.wine.name} delay={680 + i * 100} direction="up" className="h-full">
                <article className="group flex h-full flex-col">
                  <div className="overflow-hidden bg-[#fee0c9] p-2">
                    <div className="overflow-hidden">
                      <div className="transition-transform duration-700 ease-out group-hover:scale-[1.06] group-focus-within:scale-[1.06]">
                        <RevealImage
                          src={item.wine.imageSrc}
                          alt={`Flasche ${item.wine.name} ${item.wine.vintage} aus der Lage ${item.wine.lage}`}
                          direction="up"
                          delay={i * 110}
                          duration={1300}
                          className="aspect-3/4 w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <span className="mt-6 block text-[11px] tracking-[0.22em] text-[#204c52]/80 lowercase">
                    {item.wine.lage} · {item.wine.vintage}
                  </span>
                  <h3 className="mt-3 text-[clamp(1.3rem,2.2vw,1.75rem)] leading-tight font-medium tracking-[-0.02em] text-[#204c52] lowercase">
                    {item.wine.name}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="mt-2 block h-[1.5px] w-8 bg-[#d04c20] opacity-0 transition-all duration-500 group-hover:w-full group-hover:opacity-100 group-focus-within:w-full group-focus-within:opacity-100"
                  />
                  <p className="mt-5 max-w-sm text-base leading-relaxed text-[#204c52]/80 lowercase">
                    {item.wine.description}
                  </p>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8">
                    <span className="text-xl font-medium tracking-[-0.02em] text-[#204c52]">{item.wine.price}</span>
                    <button
                      type="button"
                      onClick={() => setActive(true)}
                      aria-label={`${item.wine.name.toLowerCase()} ${item.wine.vintage} ansehen`}
                      className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-[#204c52] px-7 text-sm tracking-[0.14em] text-[#204c52] transition-colors duration-300 hover:bg-[#204c52] hover:text-[#fff3e8] focus-visible:ring-2 focus-visible:ring-[#204c52] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fff3e8] focus-visible:outline-none"
                    >
                      ansehen
                    </button>
                  </div>
                </article>
              </BlurFade>
            ))}
          </div>

          {/* Basiszeile: ruhige angaben, kein verkaufsdruck. */}
          <BlurFade delay={1300} className="mt-24 lg:mt-32">
            <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[#204c52]/15 pt-10 sm:grid-cols-4">
              {[
                ['versand', 'ab 6 flaschen, österreichweit'],
                ['abholung', 'fr – so, ab 15 uhr'],
                ['gebinde', '1er, 3er, 6er'],
                ['jahrgang', '2020 – 2023'],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <dt className="text-[10px] tracking-[0.24em] text-[#204c52]/80">{label}</dt>
                  <dd className="text-sm text-[#204c52]">{value}</dd>
                </div>
              ))}
            </dl>
          </BlurFade>
        </div>
      </section>
    </div>
  )
}
