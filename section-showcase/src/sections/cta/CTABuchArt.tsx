import { ArrowUpRight } from 'lucide-react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { BUCHART_FONTS } from '../family-fonts'
import { Medallion, Signet } from '../buchart-kit'
import { ADDRESS, CONTACTS, telHref } from '../buchart-data'

/**
 * Buch·Art — „Wir sind für Sie da!“ steht auf der Original-Seite unter jeder
 * Seite, mit drei Durchwahlen. Hier wird daraus das eine laute Farbfeld der
 * Familie: Etikettenrot über die volle Breite, die drei Menschen mit Monogramm
 * statt Foto, die Nummern groß genug zum Antippen.
 */

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0e8c3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#9e1919]'

export function CTABuchArt() {
  return (
    <section style={BUCHART_FONTS} className="relative overflow-hidden bg-[#9e1919] px-6 py-20 text-[#f0e8c3] lining-nums lg:px-16 lg:py-28">
      <Signet strokeWidth={0.35} className="pointer-events-none absolute -bottom-40 -left-24 w-[40rem] max-w-none text-[#d7c69f] opacity-[0.16]" />

      <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-12 lg:gap-10">
        <BlurFade className="lg:col-span-5">
          <p className="text-[11px] font-medium tracking-[0.28em] text-[#f0e8c3]/80 uppercase">Alles rund um den Soosser Wein</p>
          <h2 className="font-display mt-6 text-[clamp(3rem,6.4vw,5.6rem)] leading-[0.95]">
            Wir sind
            <br />
            <span className="italic">für Sie da!</span>
          </h2>
          <a href={`mailto:${ADDRESS.email}`} className={`group mt-10 inline-flex min-h-11 items-center gap-3 text-[1.15rem] ${FOCUS}`}>
            {ADDRESS.email}
            <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <p className="font-display mt-10 text-[1.5rem] italic text-[#f0e8c3]/90">Ihre Familie Buchart 58</p>
        </BlurFade>

        <ul className="divide-y divide-[#f0e8c3]/25 border-y border-[#f0e8c3]/25 lg:col-span-6 lg:col-start-7">
          {CONTACTS.map((c, i) => (
            <li key={c.name}>
              <BlurFade delay={150 + i * 120}>
                <a href={telHref(c.phone)} className={`group flex items-center gap-6 py-7 ${FOCUS}`}>
                  <Medallion initial={c.initial} tone="red" className="h-16 w-16 text-[1.7rem] transition-transform duration-500 group-hover:scale-105" />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <span className="font-display text-[1.8rem] leading-none">{c.name}</span>
                      <span className="text-[12px] tracking-[0.14em] text-[#f0e8c3]/80 uppercase">{c.role}</span>
                    </span>
                    <span className="mt-2 block text-[1.2rem] tracking-[0.02em] tabular-nums transition-transform duration-500 group-hover:translate-x-1">{c.phone}</span>
                  </span>
                </a>
              </BlurFade>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
