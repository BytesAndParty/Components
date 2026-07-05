import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'

/**
 * Maison Editorial — ein einzelner Wein als geschichteter Magazin-Held. Aus HeroV6/
 * FeaturesV6 abgeleitet: der Name überlappt eine Flaschen-Tafel im Hochformat, ein
 * Etikett-Detail hängt versetzt darüber, die Fiche Technique liest sich als Hairline-
 * Zeilen an der Basis. Cream-Grund, Zink-Tinte. Bewusst asymmetrisch — anders als
 * ProductV3 (symmetrische Doppelseite).
 */

const DATA_ROWS: Array<[string, string]> = [
  ['Riede', 'Loibenberg · Urgestein'],
  ['Rebsorte', 'Grüner Veltliner'],
  ['Ausbau', '18 Monate, großes Holz'],
  ['Füllung', '2.400 Flaschen'],
]

export interface ProductV6Props {
  onBack?: () => void
}

export function ProductV6({ onBack }: ProductV6Props) {
  return (
    <section className="relative w-full overflow-hidden bg-[#fdfcf9] px-6 py-24 lg:px-16 lg:py-32">
      {/* Vertical meta rail — left edge */}
      <div className="absolute top-1/2 left-6 hidden -translate-y-1/2 lg:block">
        <BlurFade delay={900} direction="right">
          <span className="block text-[9px] font-bold tracking-[0.45em] whitespace-nowrap text-zinc-400 uppercase [writing-mode:vertical-rl]">
            Grand Cru · Édition MMXXVI
          </span>
        </BlurFade>
      </div>

      {onBack && (
        <BlurFade delay={50} direction="down" className="relative mx-auto mb-10 max-w-7xl">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex cursor-pointer items-center gap-4 text-xs font-bold tracking-[0.25em] text-zinc-900 uppercase focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:outline-none"
          >
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            <span>Index</span>
          </button>
        </BlurFade>
      )}

      <div className="relative mx-auto max-w-7xl">
        <div className="relative flex flex-col lg:block lg:min-h-[80vh]">
          {/* Primary plate — bottle, anchored right */}
          <div className="lg:absolute lg:top-0 lg:right-0 lg:w-[46%]">
            <RevealImage
              src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=1400&q=80"
              alt="Flasche Loibenberg Smaragd im Streiflicht"
              direction="up"
              duration={1500}
              className="aspect-4/5 w-full"
            />
            <BlurFade delay={1000} className="mt-4 flex items-baseline justify-between">
              <span className="font-display text-sm font-light text-zinc-400 italic">
                Streiflicht, Kellermauer
              </span>
              <span className="text-[9px] font-bold tracking-[0.3em] text-zinc-400 uppercase">Tafel XII</span>
            </BlurFade>
          </div>

          {/* Secondary plate — label close-up, hangs lower-left overlapping */}
          <div className="mt-10 w-2/3 max-w-72 lg:absolute lg:bottom-4 lg:left-[38%] lg:z-20 lg:mt-0 lg:w-[20%] lg:max-w-none">
            <RevealImage
              src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1000&q=80"
              alt="Etikett-Detail im Gegenlicht"
              direction="right"
              delay={400}
              duration={1500}
              className="aspect-3/4 w-full shadow-[24px_32px_60px_-24px_rgba(24,24,27,0.25)]"
            />
          </div>

          {/* Headline block — overlaps the bottle plate from the left */}
          <div className="relative z-30 order-first mt-0 mb-12 flex flex-col gap-8 lg:absolute lg:top-[8%] lg:left-0 lg:order-0 lg:mb-0 lg:max-w-[56%]">
            <BlurFade delay={150} direction="up">
              <span className="text-[11px] font-bold tracking-[0.4em] text-zinc-400 uppercase">
                Grand Cru · Einzellage
              </span>
            </BlurFade>

            <BlurFade delay={300} direction="up">
              <div>
                <span className="font-display block text-[clamp(4rem,11vw,9rem)] leading-[0.78] font-light tracking-tighter text-zinc-900">
                  ’21
                </span>
                <h2 className="font-display mt-4 text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] font-light tracking-tight text-zinc-900">
                  Loibenberg <span className="italic">Smaragd</span>
                </h2>
              </div>
            </BlurFade>

            <BlurFade delay={500} direction="up">
              <p className="max-w-sm text-lg leading-relaxed font-light text-zinc-500">
                Rauch über nassem Stein, dahinter Quitte und weißer Pfeffer.
                Straff, fast streng — dann öffnet sich der Wein, wie es nur
                alte Reben können.
              </p>
            </BlurFade>

            <BlurFade delay={650} direction="up" className="flex items-end gap-10">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold tracking-[0.25em] text-zinc-400 uppercase">Ab Hof</span>
                <span className="font-display text-3xl font-light text-zinc-900">€ 38,—</span>
              </div>
              <a
                href="/sortiment/loibenberg-smaragd"
                className="group inline-flex min-h-11 items-center gap-5 text-sm font-bold tracking-[0.25em] text-zinc-900 uppercase"
              >
                <span aria-hidden="true" className="h-px w-12 bg-zinc-900 transition-all duration-500 group-hover:w-20" />
                In den Keller
              </a>
            </BlurFade>
          </div>
        </div>

        {/* Fiche technique — hairline base row */}
        <div className="mt-20 grid grid-cols-1 gap-x-10 gap-y-4 border-t border-zinc-200 pt-10 sm:grid-cols-2 lg:mt-28 lg:grid-cols-4">
          {DATA_ROWS.map(([label, value], i) => (
            <BlurFade key={label} delay={1100 + i * 120} direction="up">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold tracking-[0.3em] text-zinc-400 uppercase">{label}</span>
                <span className="font-display text-lg font-light text-zinc-900 italic">{value}</span>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
