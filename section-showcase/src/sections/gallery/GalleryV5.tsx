import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'

/**
 * Das Triptychon — Domaine Privée gallery as an altar of three arch
 * windows: the center plate stands taller, roman numerals and italic
 * captions sit beneath each arch like museum labels. Strict symmetry,
 * no grid noise.
 */

const PLATES = [
  {
    numeral: 'I',
    title: 'Die Lese',
    caption: 'Ried Achleiten, erste Oktoberwoche',
    image: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=1000&q=80',
    alt: 'Rebzeilen im Morgennebel während der Lese',
  },
  {
    numeral: 'II',
    title: 'Das Gewölbe',
    caption: 'Neun Grad, seit 1974',
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=1200&q=80',
    alt: 'Fassreihen im dunklen Kellergewölbe',
  },
  {
    numeral: 'III',
    title: 'Der Abend',
    caption: 'Terrassen über der Donau',
    image: 'https://images.unsplash.com/photo-1543418219-44e30b057fea?w=1000&q=80',
    alt: 'Weinbergterrassen im letzten Abendlicht',
  },
]

export function GalleryV5() {
  return (
    <section className="bg-[#f6f3ec] px-6 py-28 lg:px-16 lg:py-36">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <BlurFade delay={100} direction="down">
            <span className="mb-5 block text-[10px] font-bold tracking-[0.4em] text-[#8a8070] uppercase">
              Das Archiv · Drei Tafeln
            </span>
          </BlurFade>
          <BlurFade delay={220} direction="up">
            <h2 className="font-display text-5xl leading-[1.02] font-light tracking-tight text-[#221b16] sm:text-6xl">
              Ein Jahr, in drei
              <br />
              <span className="italic text-[#5c2331]">Fenstern.</span>
            </h2>
          </BlurFade>
        </div>

        {/* Triptych — center arch taller, all bottom-aligned */}
        <div className="mt-20 grid grid-cols-1 items-end gap-14 sm:grid-cols-3 sm:gap-8 lg:gap-12">
          {PLATES.map((plate, i) => {
            const center = i === 1
            return (
              <BlurFade key={plate.numeral} delay={300 + i * 150} direction="up">
                <figure className="group text-center">
                  <div className="relative transition-transform duration-500 group-hover:-translate-y-2">
                    <RevealImage
                      src={plate.image}
                      alt={plate.alt}
                      direction="up"
                      delay={i * 180}
                      duration={1500}
                      className={`w-full rounded-t-full ${center ? 'aspect-[3/4.6]' : 'aspect-[3/4]'}`}
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-3 rounded-t-full border border-[#ddd5c4] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />
                  </div>
                  <figcaption className="mt-8">
                    <span className="font-display block text-lg font-light text-[#5c2331] italic">
                      {plate.numeral}
                    </span>
                    <span className="mt-2 block text-[11px] font-bold tracking-[0.3em] text-[#221b16] uppercase">
                      {plate.title}
                    </span>
                    <span className="font-display mt-2 block text-sm font-light text-[#8a8070] italic">
                      {plate.caption}
                    </span>
                  </figcaption>
                </figure>
              </BlurFade>
            )
          })}
        </div>

        {/* Colophon line */}
        <BlurFade delay={850}>
          <div className="mt-20 flex items-center justify-center gap-8 border-t border-[#ddd5c4] pt-10">
            <a
              href="/archiv"
              className="group inline-flex min-h-11 items-center gap-4 text-[11px] font-bold tracking-[0.25em] text-[#221b16] uppercase transition-colors hover:text-[#5c2331] focus-visible:ring-2 focus-visible:ring-[#5c2331]/60 focus-visible:outline-none"
            >
              <span aria-hidden="true" className="h-px w-8 bg-current transition-all duration-500 group-hover:w-14" />
              <span>Das ganze Archiv</span>
              <span aria-hidden="true" className="h-px w-8 bg-current transition-all duration-500 group-hover:w-14" />
            </a>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
