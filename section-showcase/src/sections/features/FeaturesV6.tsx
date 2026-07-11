import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'

/**
 * Maison Editorial — features as a layered magazine essay, derived from
 * HeroV6: the section headline physically overlaps the photography, a
 * second plate hangs offset, and the three claims read as numbered
 * figures (Fig. 02–04) along a hairline base. Cream ground, zinc ink.
 */

const FIGURES = [
  {
    fig: 'Fig. 02',
    title: 'Handlese, zweifach',
    text: 'Jede Traube geht zweimal durch Hände: am Stock und am Sortiertisch. Was zweifelt, fällt — ins Gras, nicht ins Fass.',
  },
  {
    fig: 'Fig. 03',
    title: 'Spontan vergoren',
    text: 'Keine Reinzuchthefe, kein Fahrplan. Der Most entscheidet über sein Tempo — wir stellen nur den Keller und die Geduld.',
  },
  {
    fig: 'Fig. 04',
    title: 'Ungeschminkt gefüllt',
    text: 'Nicht geschönt, grob filtriert, spät gefüllt. Der Jahrgang darf aussehen, riechen und altern, wie er wirklich war.',
  },
]

export function FeaturesV6() {
  return (
    <section className="relative w-full overflow-hidden bg-[#fdfcf9] px-6 py-16 sm:py-24 lg:px-16 lg:py-32">
      {/* Vertical meta rail — right edge this time, mirroring the hero */}
      <div className="absolute top-1/2 right-6 hidden -translate-y-1/2 lg:block">
        <BlurFade delay={900} direction="left">
          <span className="block rotate-180 text-[9px] font-bold tracking-[0.45em] whitespace-nowrap text-zinc-400 uppercase [writing-mode:vertical-rl]">
            Kapitel II — Vom Handwerk
          </span>
        </BlurFade>
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Layered composition — plate left, headline overlaps from the right */}
        <div className="relative flex flex-col lg:block lg:min-h-208">
          {/* Primary plate — anchored left */}
          <div className="lg:absolute lg:top-0 lg:left-0 lg:w-[48%]">
            <RevealImage
              src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1400&q=80"
              alt="Hände sortieren Trauben am Lesetisch"
              direction="up"
              duration={1500}
              className="aspect-4/5 w-full"
            />
            <BlurFade delay={1000} className="mt-4 flex items-baseline justify-between">
              <span className="font-display text-sm font-light text-zinc-400 italic">
                Sortiertisch, sechs Uhr früh
              </span>
              <span className="text-[9px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
                Fig. 01
              </span>
            </BlurFade>
          </div>

          {/* Secondary plate — hangs lower-right, overlapping the primary */}
          <div className="mt-10 ml-auto w-2/3 max-w-75 lg:absolute lg:right-[38%] lg:bottom-6 lg:z-20 lg:mt-0 lg:w-[20%] lg:max-w-none">
            <RevealImage
              src="https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=1200&q=80"
              alt="Weinglas im Gegenlicht des Kellers"
              direction="left"
              delay={400}
              duration={1500}
              className="aspect-3/4 w-full shadow-[-24px_32px_60px_-24px_rgba(24,24,27,0.25)]"
            />
          </div>

          {/* Headline block — overlaps the primary plate from the right */}
          <div className="relative z-30 order-first mt-0 mb-12 flex flex-col gap-8 lg:absolute lg:top-[10%] lg:right-0 lg:order-0 lg:mb-0 lg:max-w-[56%] lg:text-right">
            <BlurFade delay={150} direction="up">
              <span className="text-[11px] font-bold tracking-[0.4em] text-zinc-400 uppercase">
                Vom Handwerk · Drei Grundsätze
              </span>
            </BlurFade>

            <BlurFade delay={300} direction="up">
              <h2 className="font-display text-[clamp(3rem,7.5vw,6.5rem)] leading-[0.9] font-light tracking-tighter text-zinc-900">
                Nichts wird
                <br />
                gemacht. <span className="italic">Alles</span>
                <br />
                <span className="italic">wird gelassen.</span>
              </h2>
            </BlurFade>

            <BlurFade delay={500} direction="up">
              <p className="max-w-sm text-lg leading-relaxed font-light text-zinc-500 lg:ml-auto">
                Unser Beitrag ist das Unterlassen: kein Eingriff, der dem
                Jahrgang seine Handschrift nimmt.
              </p>
            </BlurFade>
          </div>
        </div>

        {/* Numbered figures — hairline base row */}
        <div className="mt-20 grid grid-cols-1 gap-10 border-t border-zinc-200 pt-10 sm:grid-cols-3 lg:mt-28">
          {FIGURES.map((figure, i) => (
            <BlurFade key={figure.fig} delay={600 + i * 150} direction="up">
              <article>
                <span className="text-[9px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
                  {figure.fig}
                </span>
                <h3 className="font-display mt-3 text-2xl font-light tracking-tight text-zinc-900">
                  {figure.title}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed font-light text-zinc-500">
                  {figure.text}
                </p>
              </article>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
