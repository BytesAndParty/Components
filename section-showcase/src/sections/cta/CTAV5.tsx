import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'

/**
 * Maison Finale — CTA as the closing page of the magazine, in the layered
 * HeroV6 language: the invitation headline overlaps a low-hanging plate,
 * the primary action is a growing hairline link, and a Fig. caption plus
 * colophon row close the chapter. Cream ground, zinc ink.
 */
export function CTAV5() {
  return (
    <section className="relative w-full overflow-hidden bg-[#fdfcf9] px-6 py-16 sm:py-24 lg:px-16 lg:py-32">
      <div className="relative mx-auto max-w-7xl">
        {/* Layered composition — plate hangs right-low, headline overlaps */}
        <div className="relative flex flex-col lg:block lg:min-h-176">
          {/* Plate */}
          <div className="lg:absolute lg:right-[6%] lg:bottom-0 lg:w-[38%]">
            <RevealImage
              src="https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=1200&q=80"
              alt="Zwei eingeschenkte Gläser im Abendlicht des Gewölbes"
              direction="up"
              duration={1500}
              className="aspect-3/4 w-full"
            />
            <BlurFade delay={1000} className="mt-4 flex items-baseline justify-between">
              <span className="font-display text-sm font-light text-zinc-400 italic">
                Das Gewölbe, kurz vor sechs
              </span>
              <span className="text-[9px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
                Fig. 12
              </span>
            </BlurFade>
          </div>

          {/* Invitation block — overlaps the plate */}
          <div className="relative z-10 order-first mt-0 mb-12 flex flex-col gap-10 lg:absolute lg:top-0 lg:left-0 lg:mb-0 lg:max-w-[62%]">
            <BlurFade delay={150} direction="up">
              <span className="text-[11px] font-bold tracking-[0.4em] text-zinc-400 uppercase">
                Letzte Seite · Die Einladung
              </span>
            </BlurFade>

            <BlurFade delay={300} direction="up">
              <h2 className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.9] font-light tracking-tighter text-zinc-900">
                Kommen Sie,
                <br />
                wenn der Nebel
                <br />
                <span className="italic">steht.</span>
              </h2>
            </BlurFade>

            <BlurFade delay={500} direction="up">
              <p className="max-w-sm text-lg leading-relaxed font-light text-zinc-500">
                Zwischen Oktober und März ist das Gewölbe am ehrlichsten.
                Sechs Weine, zwei Stunden, kein Verkaufsgespräch.
              </p>
            </BlurFade>

            <BlurFade delay={650} direction="up" className="flex flex-col gap-7 sm:flex-row sm:items-center sm:gap-12">
              <a
                href="/degustation"
                className="group inline-flex min-h-11 items-center gap-5 text-sm font-bold tracking-[0.25em] text-zinc-900 uppercase focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
              >
                <span aria-hidden="true" className="h-px w-12 bg-zinc-900 transition-all duration-500 group-hover:w-20" />
                Termin anfragen
              </a>
              <a
                href="tel:+43271158158"
                className="font-display min-h-11 text-lg font-light text-zinc-500 italic transition-colors hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
              >
                oder: +43 2711 58 158
              </a>
            </BlurFade>
          </div>
        </div>

        {/* Colophon row */}
        <BlurFade delay={1100}>
          <div className="mt-20 grid grid-cols-1 gap-6 border-t border-zinc-200 pt-8 sm:grid-cols-3 lg:mt-28">
            <span className="text-[9px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
              Domaine Buchart · Édition MMXXVI
            </span>
            <span className="font-display text-center text-sm font-light text-zinc-400 italic">
              Ende des Kapitels
            </span>
            <span className="text-[9px] font-bold tracking-[0.3em] text-zinc-400 uppercase sm:text-right">
              Samstags 10 – 17 Uhr · Kellergasse 7
            </span>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
