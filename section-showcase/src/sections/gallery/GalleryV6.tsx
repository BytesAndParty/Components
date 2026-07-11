import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'

/**
 * Maison Spread — gallery as a layered magazine double page, derived from
 * HeroV6: plates hang at staggered heights and overlap, the ghost word
 * "Herbst" runs behind them, captions carry Fig. numbers and italic notes.
 * Cream ground, zinc ink, curtain reveals.
 */

const PLATES = [
  {
    fig: 'Fig. 01',
    caption: 'Nebel steht in den Zeilen',
    image: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=1000&q=80',
    alt: 'Rebzeilen im dichten Morgennebel',
  },
  {
    fig: 'Fig. 02',
    caption: 'Die letzte Fuhre, Loibenberg',
    image: 'https://images.unsplash.com/photo-1543418219-44e30b057fea?w=1600&q=80',
    alt: 'Terrassen über der Donau im Abendlicht',
  },
  {
    fig: 'Fig. 03',
    caption: 'Neun Grad, seit 1974',
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=1200&q=80',
    alt: 'Fassreihen im dunklen Kellergewölbe',
  },
]

export function GalleryV6() {
  return (
    <section className="relative w-full overflow-hidden bg-[#fdfcf9] px-6 py-16 sm:py-24 lg:px-16 lg:py-32">
      <div className="relative mx-auto max-w-7xl">
        {/* Header row */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <BlurFade delay={100} direction="up">
              <span className="text-[11px] font-bold tracking-[0.4em] text-zinc-400 uppercase">
                Aus dem Lesejahr · MMXXV
              </span>
            </BlurFade>
            <BlurFade delay={250} direction="up">
              <h2 className="font-display mt-5 text-[clamp(2.75rem,6.5vw,5.5rem)] leading-[0.92] font-light tracking-tighter text-zinc-900">
                Drei Tage,
                <br />
                die <span className="italic">blieben.</span>
              </h2>
            </BlurFade>
          </div>
          <BlurFade delay={400} direction="up">
            <p className="max-w-sm text-lg leading-relaxed font-light text-zinc-500">
              Keine Inszenierung — nur, was die Kamera zufällig sah,
              während alle Hände voll zu tun hatten.
            </p>
          </BlurFade>
        </div>

        {/* Ghost word behind the plates */}
        <span
          aria-hidden="true"
          className="font-display pointer-events-none absolute top-[46%] left-1/2 -translate-x-1/2 text-[clamp(6rem,18vw,16rem)] leading-none font-light tracking-tighter text-zinc-900/[0.04] italic select-none"
        >
          Herbst
        </span>

        {/* Staggered spread — plates hang at different heights and overlap */}
        <div className="relative z-10 mt-16 flex flex-col gap-12 lg:mt-24 lg:grid lg:grid-cols-12 lg:items-start lg:gap-0">
          {/* Plate 1 — small, high, left */}
          <figure className="lg:col-span-3 lg:col-start-1 lg:mt-16">
            <RevealImage
              src={PLATES[0].image}
              alt={PLATES[0].alt}
              direction="up"
              duration={1500}
              className="aspect-3/4 w-full"
            />
            <BlurFade delay={800} className="mt-4 flex items-baseline justify-between">
              <figcaption className="font-display text-sm font-light text-zinc-400 italic">
                {PLATES[0].caption}
              </figcaption>
              <span className="text-[9px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
                {PLATES[0].fig}
              </span>
            </BlurFade>
          </figure>

          {/* Plate 2 — dominant, center, overlapped by plate 3 */}
          <figure className="lg:col-span-6 lg:col-start-5">
            <RevealImage
              src={PLATES[1].image}
              alt={PLATES[1].alt}
              direction="up"
              delay={250}
              duration={1500}
              className="aspect-4/3 w-full"
            />
            <BlurFade delay={950} className="mt-4 flex items-baseline justify-between">
              <figcaption className="font-display text-sm font-light text-zinc-400 italic">
                {PLATES[1].caption}
              </figcaption>
              <span className="text-[9px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
                {PLATES[1].fig}
              </span>
            </BlurFade>
          </figure>

          {/* Plate 3 — hangs low right, overlapping plate 2's corner */}
          <figure className="lg:col-span-3 lg:col-start-10 lg:z-20 lg:-ml-14 lg:mt-40">
            <RevealImage
              src={PLATES[2].image}
              alt={PLATES[2].alt}
              direction="left"
              delay={500}
              duration={1500}
              className="aspect-3/4 w-full shadow-[-24px_32px_60px_-24px_rgba(24,24,27,0.28)]"
            />
            <BlurFade delay={1100} className="mt-4 flex items-baseline justify-between">
              <figcaption className="font-display text-sm font-light text-zinc-400 italic">
                {PLATES[2].caption}
              </figcaption>
              <span className="text-[9px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
                {PLATES[2].fig}
              </span>
            </BlurFade>
          </figure>
        </div>

        {/* Hairline footer with archive link */}
        <BlurFade delay={1200}>
          <div className="mt-20 flex items-baseline justify-between border-t border-zinc-200 pt-8 lg:mt-28">
            <span className="text-[9px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
              Tafeln I — III
            </span>
            <a
              href="/archiv"
              className="group inline-flex min-h-11 items-center gap-5 text-sm font-bold tracking-[0.25em] text-zinc-900 uppercase focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
            >
              <span aria-hidden="true" className="h-px w-12 bg-zinc-900 transition-all duration-500 group-hover:w-20" />
              Das Lesejahr
            </a>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
