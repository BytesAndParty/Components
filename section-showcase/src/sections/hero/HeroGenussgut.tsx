import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'

/**
 * Genussgut — die erste Familie ohne Serif-Führung und ohne Versalien.
 * Große Grotesk in konsequenter Kleinschreibung trägt die Aussage, die kursive
 * Serif steht nur noch als Kicker darüber; Wortmarke „buchart" läuft als
 * angeschnittenes Wasserzeichen in Aprikose-hell durch den Creme-Grund.
 * Einstieg nach Geschäftsbereichen statt nach Produktkategorien.
 * Abgrenzung zu HeroV4/V6/V7/V8: dort führt die Serif und Labels stehen in
 * gesperrten Versalien — hier ist beides umgekehrt.
 */

/** Palette: Creme-Grund, Petrol als einzige Textfarbe, Aprikose ausschließlich Fläche.
 *  Orangerot (#d04c20) ist in dieser Familie reserviert für genau einen Zweck —
 *  den aktiven/angesteuerten Zustand — und nie Fließtext (Kontrast 4,06:1). */
const BEREICHE = [
  {
    label: 'wein',
    note: 'sieben rieden, ein jahrgang',
    href: '/wein',
    image: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=900&q=80',
    alt: 'Rebzeilen im Morgennebel auf der Ried Kreutles',
  },
  {
    label: 'verkostung',
    note: 'im gewölbe, nach anmeldung',
    href: '/verkostung',
    image: 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=900&q=80',
    alt: 'Weinglas im Gegenlicht während einer Verkostung',
  },
  {
    label: 'heuriger',
    note: 'freitag bis sonntag',
    href: '/heuriger',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=900&q=80',
    alt: 'Gedeckte Tafel bei Kerzenschein im Heurigenhof',
  },
  {
    label: 'erlebnisse',
    note: 'lese, kellerführung, tafel',
    href: '/erlebnisse',
    image: 'https://images.unsplash.com/photo-1543418219-44e30b057fea?w=900&q=80',
    alt: 'Steile Riedenterrassen über der Donau im Abendlicht',
  },
]

export function HeroGenussgut() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  // Parallax-Andeutung: Das Wasserzeichen läuft langsamer als der Scroll —
  // target/offset statt window-scroll, damit die Section auch in der
  // Showcase-Komposition (mehrere Sections untereinander) korrekt rechnet.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const markY = useTransform(scrollYProgress, [0, 1], ['6%', '-14%'])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#fff3e8] px-6 py-16 sm:py-20 lg:px-12 lg:py-24"
    >
      {/* Wortmarken-Wasserzeichen — angeschnitten links und rechts, rein dekorativ */}
      <motion.span
        aria-hidden="true"
        style={{ y: reduced ? 0 : markY }}
        className="font-display pointer-events-none absolute -bottom-[8vw] -left-[5vw] z-0 text-[30vw] leading-none font-light tracking-tighter whitespace-nowrap text-[#fee0c9] select-none"
      >
        buchart
      </motion.span>

      <div className="relative z-10 mx-auto max-w-[100rem]">
        {/* Meta-Zeile — Kleinschreibung mit weiter Laufweite ersetzt das Versalien-Label */}
        <BlurFade delay={80} direction="down">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#204c52]/15 pb-5">
            <span className="text-[11px] tracking-[0.3em] text-[#204c52]/80">
              buchart58 · wachau, österreich
            </span>
            <span className="text-[11px] tracking-[0.3em] text-[#204c52]/80">seit 1958</span>
          </div>
        </BlurFade>

        {/* Aussage-Block: Kicker und Grotesk-Zeile bilden EINEN Satz, deshalb sitzt
            die Serif direkt auf der Grotesk statt als abgesetztes Label darüber. */}
        <div className="mt-14 grid grid-cols-1 gap-10 lg:mt-20 lg:grid-cols-[1.55fr_1fr] lg:items-end lg:gap-16">
          <div>
            <BlurFade delay={180} direction="up">
              <p className="font-display text-[clamp(1.75rem,4.4vw,3.5rem)] leading-[1.02] font-light text-[#204c52] italic">
                unser genussgut
              </p>
            </BlurFade>
            <BlurFade delay={300} direction="up">
              <h1 className="mt-1 text-[clamp(2.5rem,7.2vw,6rem)] leading-[0.95] font-medium tracking-[-0.035em] text-[#204c52] lg:mt-2">
                ist wein, tisch
                <br />
                und zeit — seit 1958
                <br />
                über der donau.
              </h1>
            </BlurFade>
          </div>

          <div className="flex flex-col gap-8">
            <BlurFade delay={440} direction="up">
              <p className="max-w-sm text-base leading-relaxed text-[#204c52]/80">
                sieben rieden in steillage, ein heuriger mit langer tafel und
                verkostungen im gewölbe. bei uns hängt alles zusammen — der boden,
                das glas und der abend.
              </p>
            </BlurFade>
            <BlurFade delay={560} direction="up">
              <a
                href="/genussgut"
                className="inline-flex min-h-11 items-center justify-center rounded-full border-[1.5px] border-[#204c52] px-8 text-sm tracking-[0.14em] text-[#204c52] transition-colors duration-300 hover:bg-[#204c52] hover:text-[#fff3e8] focus-visible:ring-2 focus-visible:ring-[#204c52] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fff3e8] focus-visible:outline-none"
              >
                das gut kennenlernen
              </a>
            </BlurFade>
          </div>
        </div>

        {/* Vier Einstiegskacheln nach Geschäftsbereichen.
            Bewusst anders als die Vorlage: dort liegt ein Aprikose-Ton über Bild
            UND Beschriftung, was die Labels fast unlesbar macht. Hier bleiben die
            Bilder ungetönt, das Label steht in Petrol auf Creme (8,7:1) und
            Aprikose-hell dient nur noch als Rahmen. */}
        <div className="mt-20 grid grid-cols-2 gap-x-6 gap-y-12 lg:mt-28 lg:grid-cols-4 lg:gap-x-8">
          {BEREICHE.map((b, i) => (
            <BlurFade key={b.label} delay={680 + i * 110} direction="up">
              <a
                href={b.href}
                className="group block focus-visible:ring-2 focus-visible:ring-[#204c52] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fff3e8] focus-visible:outline-none"
              >
                <span className="block min-h-11 text-[clamp(1.35rem,2.4vw,2rem)] leading-tight font-medium tracking-[-0.02em] text-[#204c52]">
                  {b.label}
                </span>
                {/* Orangerot markiert die angesteuerte Kachel — als Linie, nicht als Text */}
                <span
                  aria-hidden="true"
                  className="mt-1 block h-[1.5px] w-8 bg-[#d04c20] opacity-0 transition-all duration-500 group-hover:w-full group-hover:opacity-100 group-focus-visible:w-full group-focus-visible:opacity-100"
                />
                <span className="mt-4 block text-[11px] tracking-[0.22em] text-[#204c52]/80">
                  {b.note}
                </span>
                <div className="mt-5 overflow-hidden bg-[#fee0c9] p-2">
                  <div className="overflow-hidden">
                    <div className="transition-transform duration-700 ease-out group-hover:scale-[1.06] group-focus-visible:scale-[1.06]">
                      <RevealImage
                        src={b.image}
                        alt={b.alt}
                        direction="up"
                        delay={i * 120}
                        duration={1300}
                        className="aspect-3/4 w-full"
                      />
                    </div>
                  </div>
                </div>
              </a>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
