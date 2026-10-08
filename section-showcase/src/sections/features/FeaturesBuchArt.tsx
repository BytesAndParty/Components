import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'
import { BUCHART_FONTS } from '../family-fonts'
import { RunningHead } from '../buchart-kit'
import { RIEDEN, VARIETIES } from '../buchart-data'

/**
 * Buch·Art — „Das Weingut“ als Kapitel im Farbcode der Weißwein-Etiketten:
 * Creme-Grund, Flaschengrün als Tinte. Trägt den stärksten Satz der Original-Seite
 * („… darf auch das (Un)kraut wachsen“) als großes Zitat, die drei Grundsätze als
 * nummerierte Spalten, darunter Rieden und Rebsorten als Register wie hinten im Buch.
 */

const PRINCIPLES = [
  {
    n: 'i',
    title: 'Ohne Unkrautvernichtungsmittel',
    text: 'Darauf verzichten wir freiwillig und aus Überzeugung. Insekten- und umweltschonend — einfach nachhaltig.',
  },
  {
    n: 'ii',
    title: 'Laubarbeit und Ausdünnen',
    text: 'Das Hauptaugenmerk im Weingarten. Es ist die Voraussetzung für Weine höchster Qualität und Bekömmlichkeit.',
  },
  {
    n: 'iii',
    title: 'Weniger Ertrag, mehr Wein',
    text: 'Naturnahe, nachhaltige Bewirtschaftung und Ertragsreduzierung sind für uns seit Jahren selbstverständlich. Unsere Kunden honorieren das.',
  },
]

export function FeaturesBuchArt() {
  return (
    <section style={BUCHART_FONTS} className="bg-[#f0e8c3] px-6 py-20 lining-nums text-[#15420c] lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <RunningHead chapter="V" title="Das Weingut" />

        <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-10">
          <BlurFade className="lg:col-span-8">
            <blockquote>
              <p className="font-display text-[clamp(2.3rem,5.2vw,4.6rem)] leading-[1.04] tracking-[-0.01em]">
                „In unseren Weingärten darf auch das{' '}
                <span className="italic">
                  <span className="text-[#7d6226]">(Un)</span>kraut
                </span>{' '}
                wachsen — der Natur und dem Wein zuliebe.“
              </p>
              <footer className="mt-8 text-[12px] font-medium tracking-[0.22em] text-[#15420c]/80 uppercase">
                Familie Buchart · Sooss
              </footer>
            </blockquote>
          </BlurFade>
          <BlurFade delay={200} className="lg:col-span-4 lg:pt-3">
            <RevealImage
              src="https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=1200&q=80"
              alt="Reife Trauben am Stock im Gegenlicht"
              direction="up"
              duration={1400}
              className="aspect-4/5 w-full"
              imgClassName="saturate-[.85] sepia-[.12]"
            />
            <p className="font-display mt-3 text-[15px] italic text-[#15420c]/85">Abb. 1 — Kurz vor der Lese.</p>
          </BlurFade>
        </div>

        <ol className="mt-20 grid gap-12 border-t border-[#15420c]/25 pt-12 md:grid-cols-3 md:gap-10">
          {PRINCIPLES.map((p, i) => (
            <li key={p.n}>
              <BlurFade delay={i * 140}>
                <span aria-hidden="true" className="font-display text-[2.4rem] leading-none italic text-[#7d6226]">
                  {p.n}.
                </span>
                <h3 className="font-display mt-4 text-[1.65rem] leading-tight">{p.title}</h3>
                <p className="mt-3 max-w-sm text-[15px] leading-[1.7] text-[#15420c]/85">{p.text}</p>
              </BlurFade>
            </li>
          ))}
        </ol>

        <div className="mt-24 grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h3 className="text-[11px] font-medium tracking-[0.26em] uppercase">Die Rieden</h3>
            <ul className="mt-6 divide-y divide-[#15420c]/20 border-y border-[#15420c]/20">
              {RIEDEN.map(r => (
                <li key={r.name} className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
                  <span className="font-display text-[1.45rem] transition-transform duration-500 group-hover:translate-x-1.5">{r.name}</span>
                  <span className="text-[13px] text-[#15420c]/80">{r.wines}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <h3 className="text-[11px] font-medium tracking-[0.26em] uppercase">Register der Rebsorten</h3>
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              {(
                [
                  ['Weiß', VARIETIES.weiss],
                  ['Rot', VARIETIES.rot],
                ] as const
              ).map(([title, list]) => (
                <div key={title}>
                  <p className="font-display text-[1.1rem] italic text-[#7d6226]">
                    {title} · {list.length}
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {list.map(v => (
                      <li key={v} className="flex items-baseline gap-2 text-[15px]">
                        <span>{v}</span>
                        <span aria-hidden="true" className="mb-1 flex-1 border-b border-dotted border-[#15420c]/35" />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
