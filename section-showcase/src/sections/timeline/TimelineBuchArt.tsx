import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'
import { BUCHART_FONTS } from '../family-fonts'
import { RibbonFill, RunningHead } from '../buchart-kit'

/**
 * Buch·Art — der Ablauf einer Riedenwanderung, so wie ihn die Original-Seite
 * beschreibt, als sechs Stationen an einem Weg. Die Goldlinie zeichnet sich mit
 * dem Scrollen, jede Station setzt ihre Ziffer wie eine Kapitelnummer. Der Satz,
 * dass sie „oft länger dauert als geplant“, steht im Original — er bleibt.
 */

const STEPS = [
  { title: 'Begrüßungsschluck', text: 'Für alle Teilnehmer, gleich bei der Ankunft im Weingut.' },
  { title: 'Hinaus in die Weingärten', text: 'Unterwegs erfahren Sie Wissenswertes rund um den Wein — informativ übermittelt von Weinbau- und Kellermeister Anton Buchart.' },
  { title: 'Ein Glas mitten im Weingarten', text: 'Zwischen den Rebzeilen genießen Sie einen unserer Weine.' },
  { title: 'Gestärkt zurück', text: 'Zur Verkostung reichen wir Aufstrichbrötchen, Vöslauer und Triestingtaler Wasser.' },
  { title: 'Sechs weitere Proben', text: 'In der Vinothek kredenzen wir sechs weitere Weinproben — auf Wunsch frei gewählt.' },
  { title: 'In Ruhe auswählen', text: 'Welchen Weinvorrat Sie für zu Hause mitnehmen, entscheiden Sie ganz ohne Eile.' },
]

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI']

export function TimelineBuchArt() {
  const listRef = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 75%', 'end 60%'] })
  const draw = useSpring(scrollYProgress, { stiffness: 150, damping: 20 })

  return (
    <section style={BUCHART_FONTS} className="bg-[#f7f3e8] px-6 py-20 text-[#1c1a17] lining-nums lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <RunningHead chapter="IV" title="Riedenwanderung" />

        <div className="mt-14 grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-12">
              <h2 className="font-display text-[clamp(2.6rem,5.2vw,4.6rem)] leading-[0.98]">
                Eine Wanderung,
                <br />
                <span className="italic text-[#15420c]">die oft länger dauert</span>
                <br />
                als geplant.
              </h2>
              <p className="mt-7 max-w-md text-[1.0625rem] leading-[1.7] text-[#5e574b]">
                Ihre ganz persönliche, geführte Riedenwanderung durch die Soosser Weingärten — nur mit Ihrer
                eigenen Gruppe, nie in Sammelgruppen.
              </p>
              <dl className="mt-10 grid max-w-md grid-cols-2 gap-x-6 gap-y-6 border-t border-[#ddd3bc] pt-6">
                {[
                  ['Dauer', 'meist weit über 2 Stunden'],
                  ['Gruppe', 'ab 4 Personen'],
                  ['Beitrag', '40 € p. P. inkl. 20 € Weingutschein'],
                  ['Wetter', 'nur bei Schönwetter, festes Schuhwerk'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[11px] font-medium tracking-[0.2em] text-[#7d6226] uppercase">{k}</dt>
                    <dd className="mt-1.5 text-[14.5px] leading-snug">{v}</dd>
                  </div>
                ))}
              </dl>
              <a href="/erlebnisse/riedenwanderung" className="group relative mt-10 inline-flex min-h-12 items-center py-3 pr-11 pl-7 text-[14px] font-medium text-[#f7f3e8] focus-visible:ring-2 focus-visible:ring-[#9e1919] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f3e8] focus-visible:outline-none">
                <RibbonFill />
                <span className="relative">Termin anfragen</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <RevealImage
              src="https://images.unsplash.com/photo-1543418219-44e30b057fea?w=1400&q=80"
              alt="Rebzeilen im Abendlicht"
              direction="left"
              duration={1400}
              className="aspect-16/10 w-full"
              imgClassName="saturate-[.9] sepia-[.1]"
            />

            <ol ref={listRef} className="relative mt-14 pl-16">
              {/* Der Weg: eine Hairline, die sich mit dem Scrollen in Gold nachzeichnet. */}
              <span aria-hidden="true" className="absolute top-2 bottom-2 left-[1.15rem] w-px bg-[#ddd3bc]" />
              <motion.span
                aria-hidden="true"
                className="absolute top-2 bottom-2 left-[1.15rem] w-px origin-top bg-[#be9f55]"
                style={reduce ? undefined : { scaleY: draw }}
              />
              {STEPS.map((s, i) => (
                <li key={s.title} className="relative pb-12 last:pb-0">
                  <BlurFade delay={80} direction="left">
                    <span aria-hidden="true" className="font-display absolute top-0 -left-16 flex h-10 w-10 items-center justify-center rounded-full border border-[#be9f55] bg-[#f7f3e8] text-[1rem] text-[#7d6226]">
                      {ROMAN[i]}
                    </span>
                    <h3 className="font-display text-[1.65rem] leading-tight">{s.title}</h3>
                    <p className="mt-2 max-w-lg text-[15px] leading-[1.7] text-[#5e574b]">{s.text}</p>
                  </BlurFade>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
