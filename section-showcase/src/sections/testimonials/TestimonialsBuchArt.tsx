import { BlurFade } from '@components/blur-fade/blur-fade'
import { BUCHART_FONTS } from '../family-fonts'
import { RunningHead, Stars } from '../buchart-kit'
import { RATING, REVIEWS } from '../buchart-data'

/**
 * Buch·Art — echte Google-Rezensionen (5,0 aus 66, Stand 2026-08) als
 * aufgeschlagenes Gästebuch: links die Bewertung, rechts die Einträge. Der Falz
 * in der Mitte nimmt das Signet wörtlich — ein offenes Buch. Die Namen stehen in
 * Handschrift, die Herkunft bleibt sichtbar („Google-Rezension“).
 */

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9e1919] focus-visible:ring-offset-2 focus-visible:ring-offset-[#efe8d6]'

export function TestimonialsBuchArt() {
  return (
    <section style={BUCHART_FONTS} className="bg-[#efe8d6] px-6 py-20 text-[#1c1a17] lining-nums lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <RunningHead chapter="V" title="Aus dem Gästebuch" />

        <BlurFade className="mt-14">
          <div className="relative grid bg-[#f7f3e8] shadow-[0_30px_60px_-30px_rgba(28,26,23,0.35)] lg:grid-cols-2">
            {/* Der Falz: Schatten zur Mitte hin, wie bei einem aufgeschlagenen Buch. */}
            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-24 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(28,26,23,0.07)_45%,rgba(28,26,23,0.14)_50%,rgba(28,26,23,0.07)_55%,transparent)] lg:block" />

            <div className="flex flex-col justify-between p-8 sm:p-12 lg:p-16">
              <div>
                <p className="text-[11px] font-medium tracking-[0.28em] text-[#7d6226] uppercase">Google-Bewertungen</p>
                <p className="font-display mt-8 text-[clamp(6rem,14vw,10rem)] leading-[0.8]">
                  {RATING.value.toFixed(1).replace('.', ',')}
                </p>
                <Stars value={RATING.value} className="mt-5 h-6 text-[#be9f55]" />
                <p className="mt-4 text-[15px] text-[#5e574b]">aus {RATING.count} Bewertungen</p>
              </div>
              <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-[14px]">
                <a href="https://www.google.com/search?q=buchart58" className={`group inline-flex min-h-11 items-center gap-3 ${FOCUS}`}>
                  Alle Rezensionen lesen
                  <span aria-hidden="true" className="h-px w-6 bg-[#be9f55] transition-all duration-500 group-hover:w-10 group-hover:bg-[#9e1919]" />
                </a>
                <a href="https://www.google.com/search?q=buchart58" className={`inline-flex min-h-11 items-center text-[#5e574b] underline-offset-4 hover:underline ${FOCUS}`}>
                  Wir freuen uns auch über Ihre Bewertung!
                </a>
              </div>
            </div>

            <ul className="divide-y divide-[#ddd3bc] border-t border-[#ddd3bc] p-8 sm:p-12 lg:border-t-0 lg:p-16">
              {REVIEWS.map((r, i) => (
                <li key={r.name} className="py-8 first:pt-0 last:pb-0">
                  <BlurFade delay={150 + i * 140}>
                    <figure>
                      <blockquote className="font-display text-[1.35rem] leading-[1.45]">„{r.quote}“</blockquote>
                      <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                        <span className="text-[1.6rem] leading-none text-[#15420c]" style={{ fontFamily: 'Caveat, cursive' }}>
                          {r.name}
                        </span>
                        <span className="text-[11px] tracking-[0.16em] text-[#5e574b] uppercase">Google-Rezension</span>
                      </figcaption>
                    </figure>
                  </BlurFade>
                </li>
              ))}
            </ul>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
