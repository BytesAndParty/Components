import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'

/**
 * Nachtkeller Collage — true overlapping collage on a warm near-black
 * ground. Plates rotate a few degrees off-axis and physically overlap,
 * a ghost word in outlined serif floats behind, and the cellar master's
 * note sits tucked between the photographs. Antithesis of the grid:
 * placement reads as if pinned by hand.
 */

const NOTE = {
  quote: 'Unten ist es immer 1904. Gleiche Kühle, gleiches Schweigen.',
  author: 'M. Buchart, Kellermeister',
}

export function GalleryV4() {
  return (
    <section className="relative overflow-hidden bg-[#141110] px-6 py-32 lg:py-44">
      {/* Ghost word — outlined serif, drifts behind the collage */}
      <div aria-hidden="true" className="pointer-events-none absolute top-24 left-1/2 -translate-x-1/2 select-none">
        <span
          className="font-display text-[clamp(8rem,26vw,24rem)] leading-none font-light tracking-tight whitespace-nowrap text-transparent italic"
          style={{ WebkitTextStroke: '1px rgba(231,225,216,0.07)' }}
        >
          Keller
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header — asymmetric, pushed left */}
        <header className="mb-24 max-w-xl lg:mb-32">
          <BlurFade delay={100}>
            <span className="text-[11px] font-bold tracking-[0.4em] text-stone-500 uppercase">
              Aus dem Gewölbe · Est. 1904
            </span>
          </BlurFade>
          <BlurFade delay={250}>
            <h2 className="font-display mt-6 text-5xl leading-[0.95] font-light tracking-tight text-stone-100 lg:text-7xl">
              Zwölf Meter
              <br />
              <span className="italic">unter dem Hof.</span>
            </h2>
          </BlurFade>
        </header>

        {/* Collage field — absolute placements on desktop, flow on mobile */}
        <div className="relative flex flex-col gap-16 lg:block lg:min-h-[920px]">
          {/* Plate 1 — large, slightly rotated left */}
          <figure className="lg:absolute lg:top-0 lg:left-0 lg:w-[46%] lg:-rotate-2">
            <RevealImage
              src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1400&q=80"
              alt="Flaschenlager im Gewölbekeller"
              direction="up"
              duration={1500}
              className="aspect-4/5 w-full"
              imgClassName="brightness-90"
            />
            <figcaption className="mt-4 flex items-baseline justify-between">
              <span className="font-display text-sm font-light text-stone-400 italic">Das Archiv, Reihe III</span>
              <span className="text-[9px] font-bold tracking-[0.3em] text-stone-600 uppercase">No. 01</span>
            </figcaption>
          </figure>

          {/* Plate 2 — smaller, overlaps plate 1 from the right, rotated right */}
          <figure className="self-end lg:absolute lg:top-[18%] lg:left-[38%] lg:z-20 lg:w-[30%] lg:rotate-[1.5deg]">
            <RevealImage
              src="https://images.unsplash.com/photo-1474722883778-792e7990302f?w=1000&q=80"
              alt="Hand prüft ein Fass im Kerzenlicht"
              direction="right"
              delay={300}
              duration={1500}
              className="aspect-3/4 w-full shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
              imgClassName="brightness-90"
            />
            <figcaption className="mt-4 flex items-baseline justify-between">
              <span className="font-display text-sm font-light text-stone-400 italic">Drittbelegung, Fass 12</span>
              <span className="text-[9px] font-bold tracking-[0.3em] text-stone-600 uppercase">No. 02</span>
            </figcaption>
          </figure>

          {/* Cellar master's note — tucked into the empty right corner */}
          <BlurFade delay={600} className="max-w-xs lg:absolute lg:top-[6%] lg:right-0 lg:w-[24%]">
            <div className="border-l border-stone-700/60 pl-6">
              <p className="font-display text-xl leading-relaxed font-light text-stone-300 italic">
                „{NOTE.quote}"
              </p>
              <span className="mt-4 block text-[10px] font-bold tracking-[0.25em] text-stone-500 uppercase">
                {NOTE.author}
              </span>
            </div>
          </BlurFade>

          {/* Plate 3 — wide landscape, lower right, rotated subtly */}
          <figure className="lg:absolute lg:right-[4%] lg:bottom-0 lg:w-[42%] lg:rotate-[0.8deg]">
            <RevealImage
              src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1400&q=80"
              alt="Verkostung bei Kerzenschein auf altem Holztisch"
              direction="left"
              delay={500}
              duration={1500}
              className="aspect-16/10 w-full"
              imgClassName="brightness-90"
            />
            <figcaption className="mt-4 flex items-baseline justify-between">
              <span className="font-display text-sm font-light text-stone-400 italic">Erste Probe, März</span>
              <span className="text-[9px] font-bold tracking-[0.3em] text-stone-600 uppercase">No. 03</span>
            </figcaption>
          </figure>

          {/* Plate 4 — small portrait, far lower-left, deepest rotation */}
          <figure className="w-2/3 max-w-[260px] lg:absolute lg:bottom-[4%] lg:left-[16%] lg:z-20 lg:w-[20%] lg:max-w-none lg:-rotate-[2.5deg]">
            <RevealImage
              src="https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=900&q=80"
              alt="Staubige Flasche mit handgeschriebenem Etikett"
              direction="down"
              delay={700}
              duration={1500}
              className="aspect-3/4 w-full shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
              imgClassName="brightness-90"
            />
            <figcaption className="mt-4">
              <span className="font-display text-sm font-light text-stone-400 italic">Jahrgang 1979, ungeöffnet</span>
            </figcaption>
          </figure>
        </div>

        {/* Colophon */}
        <BlurFade delay={900} className="mt-24 flex items-center gap-6 lg:mt-32">
          <span aria-hidden="true" className="h-px w-16 bg-stone-700" />
          <p className="text-[10px] font-bold tracking-[0.3em] text-stone-500 uppercase">
            Fotografien aus dem Hausarchiv · Unretuschiert
          </p>
        </BlurFade>
      </div>
    </section>
  )
}
