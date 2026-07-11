import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'

/**
 * Die Chronik — Domaine Privée heritage as an engraved family register:
 * a single hairline spine down the center axis, diamond seals as markers,
 * entries alternating left/right, oval medallion photographs like plates
 * in an old estate book. Collapses to a left spine on mobile.
 */

const CHAPTERS = [
  {
    year: '1958',
    title: 'Der erste Stein',
    text: 'Josef Buchart kauft drei verwilderte Terrassen am Steinriegl — gegen den Rat aller. Die Mauern richtet er mit bloßen Händen.',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&q=80',
    alt: 'Alte Trockensteinmauern in den Weinbergterrassen',
  },
  {
    year: '1974',
    title: 'Das Gewölbe',
    text: 'Der Keller wird in den Berg getrieben. Zwölf Meter Urgestein über den Fässern — Temperatur seither: neun Grad, unverhandelbar.',
    image: null,
    alt: '',
  },
  {
    year: '1997',
    title: 'Die Bibliothek',
    text: 'Beginn des Flaschenarchivs: Von jedem Jahrgang bleiben dreihundert Flaschen im Haus. Verkauft wird daraus nie — verkostet selten.',
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=900&q=80',
    alt: 'Staubige Flaschen im Kellerarchiv',
  },
  {
    year: '2011',
    title: 'Die Übergabe',
    text: 'Die dritte Generation übernimmt — und ändert fast nichts. Nur die Lese beginnt seither eine Woche später. Der Berg hatte recht.',
    image: null,
    alt: '',
  },
  {
    year: 'Heute',
    title: 'Achtzehn Fässer',
    text: 'Keine Expansion, kein Zukauf. Achtzehn Fässer je Jahrgang, jede Flasche nummeriert — so viel Stille, wie der Markt erträgt.',
    image: 'https://images.unsplash.com/photo-1543418219-44e30b057fea?w=900&q=80',
    alt: 'Terrassen über der Donau im Abendlicht',
  },
]

export function TimelineV4() {
  return (
    <section className="bg-[#f6f3ec] px-6 py-16 sm:py-28 lg:px-16 lg:py-36">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <BlurFade delay={100} direction="down">
            <span className="mb-5 block text-[10px] font-bold tracking-[0.4em] text-[#8a8070] uppercase">
              Die Chronik · 1958 — Heute
            </span>
          </BlurFade>
          <BlurFade delay={220} direction="up">
            <h2 className="font-display text-5xl leading-[1.02] font-light tracking-tight text-[#221b16] sm:text-6xl">
              Ein Haus schreibt
              <br />
              <span className="italic text-[#5c2331]">langsam.</span>
            </h2>
          </BlurFade>
        </div>

        {/* Register — center spine, alternating entries */}
        <div className="relative mt-20">
          {/* Spine */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-[7px] w-px bg-[#ddd5c4] md:left-1/2 md:-translate-x-1/2"
          />

          <ol className="flex flex-col gap-16 md:gap-20">
            {CHAPTERS.map((chapter, i) => {
              const left = i % 2 === 0
              return (
                <li key={chapter.year} className="relative md:grid md:grid-cols-[1fr_4rem_1fr] md:items-center">
                  {/* Diamond seal on the spine */}
                  <span
                    aria-hidden="true"
                    className="absolute top-2 left-[7px] h-2.5 w-2.5 -translate-x-1/2 rotate-45 border border-[#5c2331] bg-[#f6f3ec] md:static md:col-start-2 md:row-start-1 md:mx-auto md:translate-x-0"
                  />

                  {/* Entry */}
                  <BlurFade
                    delay={200 + i * 120}
                    direction="up"
                    className={`pl-10 md:row-start-1 md:pl-0 ${
                      left ? 'md:col-start-1 md:text-right' : 'md:col-start-3'
                    }`}
                  >
                    <div>
                      <span className="font-display text-4xl font-light tracking-tight text-[#5c2331] italic sm:text-5xl">
                        {chapter.year}
                      </span>
                      <h3 className="mt-3 text-[11px] font-bold tracking-[0.3em] text-[#221b16] uppercase">
                        {chapter.title}
                      </h3>
                      <p
                        className={`mt-4 max-w-sm text-sm leading-relaxed font-light text-[#6f6657] ${
                          left ? 'md:ml-auto' : ''
                        }`}
                      >
                        {chapter.text}
                      </p>
                    </div>
                  </BlurFade>

                  {/* Oval medallion opposite the entry */}
                  {chapter.image && (
                    <BlurFade
                      delay={320 + i * 120}
                      direction="up"
                      className={`mt-8 pl-10 md:row-start-1 md:mt-0 md:pl-0 ${
                        left ? 'md:col-start-3' : 'md:col-start-1'
                      }`}
                    >
                      <div className={`w-40 sm:w-44 ${left ? '' : 'md:ml-auto'}`}>
                        <RevealImage
                          src={chapter.image}
                          alt={chapter.alt}
                          direction="up"
                          duration={1400}
                          className="aspect-[3/4] w-full rounded-[50%]"
                        />
                        <span className="mt-3 block text-center text-[9px] font-bold tracking-[0.3em] text-[#a89e8a] uppercase">
                          Tafel {['I', 'II', 'III', 'IV', 'V'][i]}
                        </span>
                      </div>
                    </BlurFade>
                  )}
                </li>
              )
            })}
          </ol>
        </div>

        <BlurFade delay={1000}>
          <p className="mt-20 text-center font-display text-sm font-light text-[#8a8070] italic">
            Fortsetzung folgt — im Tempo des Berges.
          </p>
        </BlurFade>
      </div>
    </section>
  )
}
