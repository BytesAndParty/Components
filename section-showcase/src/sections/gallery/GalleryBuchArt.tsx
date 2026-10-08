import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'
import { BUCHART_FONTS } from '../family-fonts'
import { RunningHead } from '../buchart-kit'
import { ADDRESS } from '../buchart-data'

/**
 * Buch·Art — die Vinothek. Auf der Original-Seite steht, dass Anton Buchart
 * die Einrichtung über ein Jahr selbst geplant hat und dass dort Fundstücke aus
 * den Soosser Weingärten liegen: versteinerte Korallen, Muscheln aus dem Urmeer,
 * alte Münzen. Die Fotos sind Platzhalter, die Fundstücke werden als Goldlinien
 * in Rundbogen-Nischen gezeigt — wie die Ziegelbögen der echten Regale.
 */

function Shell() {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" aria-hidden="true" className="h-full w-full">
      <path d="M40 66 12 30c6-12 18-18 28-18s22 6 28 18Z" />
      {[-24, -16, -8, 0, 8, 16, 24].map(x => (
        <path key={x} d={`M40 66 ${40 + x} ${14 + Math.abs(x) * 0.55}`} />
      ))}
      <path d="M34 66h12l-2 6h-8Z" />
    </svg>
  )
}

function Coral() {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-full w-full">
      <path d="M40 72V46M40 46 28 32M28 32l-4-14M28 32l-10-6M40 46l12-16M52 30l-2-14M52 30l10-8M40 56l-14-4M26 52l-8 2M40 60l12-2M52 58l8-6" />
      <path d="M32 72h16" />
    </svg>
  )
}

function Coin() {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" className="h-full w-full">
      <circle cx="40" cy="40" r="26" />
      <circle cx="40" cy="40" r="21" strokeDasharray="1.2 2.4" />
      <path d="M40 27c4 5 4 21 0 26M40 27c-4 5-4 21 0 26M30 40h20" strokeLinecap="round" />
    </svg>
  )
}

const FINDS = [
  { title: 'Versteinerte Korallen', Icon: Coral },
  { title: 'Muscheln aus dem Urmeer', Icon: Shell },
  { title: 'Alte Münzen', Icon: Coin },
]

export function GalleryBuchArt() {
  return (
    <section style={BUCHART_FONTS} className="bg-[#1e1d1b] px-6 py-20 text-[#f0e8c3] lining-nums lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <RunningHead tone="dark" chapter="V" title="Die Vinothek" />

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <BlurFade className="lg:col-span-7 lg:row-span-2">
            <figure>
              <RevealImage
                src="https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=1600&q=80"
                alt="Weinflaschen im Regal"
                direction="up"
                duration={1500}
                className="aspect-4/3 w-full lg:aspect-auto lg:h-[34rem]"
                imgClassName="saturate-[.85] sepia-[.15]"
              />
              <figcaption className="font-display mt-3 text-[15px] italic text-[#d7c69f]">Abb. 2 — Die Vinothek, {ADDRESS.street}.</figcaption>
            </figure>
          </BlurFade>

          <BlurFade delay={160} className="lg:col-span-5">
            <h2 className="font-display text-[clamp(2.4rem,4.6vw,4rem)] leading-[1]">
              Über ein Jahr
              <br />
              <span className="italic text-[#be9f55]">geplant.</span>
            </h2>
            <p className="mt-6 max-w-md text-[1.0625rem] leading-[1.7] text-[#d7c69f]">
              Auf die selbst geplante Innenausstattung ist Anton Buchart besonders stolz. Bildpräsentation,
              Wandbrunnen und Kamin geben der Vinothek ihr besonderes Flair — hier verkosten Sie, hier wählen
              Sie in Ruhe aus.
            </p>
          </BlurFade>

          <BlurFade delay={260} className="grid grid-cols-2 gap-6 lg:col-span-5">
            <figure>
              <RevealImage
                src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&q=80"
                alt="Anstoßen mit Rotwein in geselliger Runde"
                direction="right"
                duration={1300}
                className="aspect-3/4 w-full"
                imgClassName="saturate-[.85] sepia-[.15]"
              />
              <figcaption className="font-display mt-2 text-[14px] italic text-[#d7c69f]">Abb. 3 — Verkostung.</figcaption>
            </figure>
            <figure>
              <RevealImage
                src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=900&q=80"
                alt="Rotweinflasche im Keller"
                direction="right"
                duration={1300}
                delay={150}
                className="aspect-3/4 w-full"
                imgClassName="saturate-[.85] sepia-[.15]"
              />
              <figcaption className="font-display mt-2 text-[14px] italic text-[#d7c69f]">Abb. 4 — Im Keller.</figcaption>
            </figure>
          </BlurFade>
        </div>

        <div className="mt-24">
          <p className="text-[11px] font-medium tracking-[0.28em] text-[#d7c69f] uppercase">Fundstücke aus den Soosser Weingärten</p>
          <ul className="mt-8 grid gap-6 sm:grid-cols-3">
            {FINDS.map(({ title, Icon }, i) => (
              <li key={title}>
                <BlurFade delay={i * 140}>
                  {/* Rundbogen-Nische wie die Ziegelbögen der Vinothek-Regale. */}
                  <div className="group flex aspect-[4/5] flex-col items-center justify-end rounded-t-full md:aspect-[6/5] border border-[#be9f55]/45 bg-[radial-gradient(ellipse_at_50%_80%,rgba(190,159,85,0.12),transparent_65%)] px-8 pb-10 transition-colors duration-500 hover:border-[#be9f55]">
                    <span className="block h-32 w-32 text-[#be9f55] lg:h-40 lg:w-40 transition-transform duration-700 group-hover:-translate-y-1.5 group-hover:scale-105">
                      <Icon />
                    </span>
                    <span className="font-display mt-8 text-center text-[1.35rem] leading-tight">{title}</span>
                  </div>
                </BlurFade>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-2xl text-[14.5px] leading-relaxed text-[#d7c69f]">
            Historische Funde aus den Weingärten zeigen einiges über die Vergangenheit des Ortes — zu sehen in der Vinothek,
            täglich von 8 bis 19 Uhr.
          </p>
        </div>
      </div>
    </section>
  )
}
