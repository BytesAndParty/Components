import { useState } from 'react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'
import { ProductNachtblau } from '../showcase/ProductNachtblau'
import { SAMPLE_WINES } from './cards/sample-wines'

/**
 * Nachtblau — das Sortiment ohne Kachelraster. Eine Position bekommt den
 * halbseitigen Split, die übrigen liegen als Serif-Ledger mit Haarlinien
 * darunter: Nummer, Name, Lage, Preis — eine Zeile, ein Klick.
 * Sprachlich Zugehörigkeit statt Kommerz: Weinclub, Degustation, Concierge.
 * Abgrenzung zu StoreNocturne: kein Gold, keine Karten mit Glow, kein
 * Raster. Die Liste selbst ist das Gestaltungsmittel.
 */

const [FEATURED, ...LEDGER] = SAMPLE_WINES

export function StoreNachtblau() {
  const [detail, setDetail] = useState(false)

  if (detail) {
    return <ProductNachtblau onBack={() => setDetail(false)} />
  }

  return (
    <section className="w-full bg-[#0b1420]">
      {/* Kopf — Sans-Meta, Serif-Titel, rechts die Kennzahlen der Auswahl. */}
      <div className="px-6 py-20 sm:px-10 sm:py-28 lg:px-16">
        <BlurFade delay={0} direction="up">
          <span className="block text-[10px] font-semibold tracking-[0.4em] text-[#d9d9d9] uppercase">
            Der Weinclub — Ausgabe MMXXVI
          </span>
        </BlurFade>
        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <BlurFade delay={120} direction="up">
            <h2 className="font-display max-w-2xl text-[clamp(2.5rem,6.5vw,5rem)] leading-[1.0] font-light tracking-tight text-[#ffffff]">
              Die <span className="italic">Degustation.</span>
            </h2>
          </BlurFade>
          <BlurFade delay={240} direction="up">
            <p className="font-display max-w-xs text-lg leading-[1.6] font-light text-[#d9d9d9]">
              Sechs Positionen aus vier Lagen. Mehr füllen wir nicht ab,
              und weniger reicht nicht aus.
            </p>
          </BlurFade>
        </div>
        <BlurFade delay={360} className="mt-12 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t border-[#ffffff]/15 pt-6">
          <span className="text-[10px] font-semibold tracking-[0.28em] text-[#d9d9d9]/70 uppercase">
            Sechs Positionen
          </span>
          <span className="text-[10px] font-semibold tracking-[0.28em] text-[#d9d9d9]/70 uppercase">
            Jahrgänge 2020 – 2023
          </span>
          <span className="text-[10px] font-semibold tracking-[0.28em] text-[#d9d9d9]/70 uppercase">
            Versand innerhalb Österreichs frei
          </span>
        </BlurFade>
      </div>

      {/* Position I — halbseitiger Split statt Kachel. */}
      <div className="grid grid-cols-1 border-t border-[#ffffff]/10 lg:grid-cols-2">
        <div className="relative min-h-[56vh] overflow-hidden lg:min-h-[72vh]">
          <RevealImage
            src={FEATURED.wine.imageSrc}
            alt={`${FEATURED.wine.name} — Flasche im kühlen Streiflicht`}
            direction="up"
            duration={1600}
            className="absolute inset-0 h-full w-full"
            imgClassName="opacity-90 saturate-[0.5] brightness-[0.72] contrast-[1.06]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-[#002450]/35" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-[#0b1420]/80 via-[#0b1420]/10 to-transparent"
          />
          <BlurFade delay={520} className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10">
            <span className="text-[10px] font-semibold tracking-[0.32em] text-[#d9d9d9] uppercase">
              Position I — {FEATURED.wine.lage}
            </span>
          </BlurFade>
        </div>

        <div className="flex flex-col justify-center bg-[#002450] px-6 py-16 sm:px-10 sm:py-24 lg:px-14">
          <BlurFade delay={80} direction="up">
            <span className="block text-[10px] font-semibold tracking-[0.32em] text-[#c0392b] uppercase">
              Die Flasche des Jahrgangs
            </span>
          </BlurFade>
          <BlurFade delay={190} direction="up">
            <h3 className="font-display mt-6 text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] font-light tracking-tight text-[#ffffff]">
              {FEATURED.wine.name} <span className="italic">’{String(FEATURED.wine.vintage).slice(2)}</span>
            </h3>
          </BlurFade>
          <BlurFade delay={300} direction="up">
            <p className="font-display mt-7 max-w-md text-lg leading-[1.65] font-light text-[#d9d9d9]">
              {FEATURED.wine.description}
            </p>
          </BlurFade>
          <BlurFade
            delay={430}
            direction="up"
            className="mt-11 flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:gap-12"
          >
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-semibold tracking-[0.28em] text-[#d9d9d9]/70 uppercase">
                Ab Hof · 0,75 l
              </span>
              <span className="font-display text-3xl leading-none font-light text-[#ffffff]">
                {FEATURED.wine.price}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setDetail(true)}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#ffffff] px-9 py-3 text-[11px] font-semibold tracking-[0.2em] text-[#0b1420] uppercase transition-colors duration-300 hover:bg-[#c0392b] hover:text-[#ffffff] focus-visible:ring-2 focus-visible:ring-[#ffffff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#002450] focus-visible:outline-none motion-reduce:transition-none"
            >
              Die Flasche ansehen
            </button>
          </BlurFade>
        </div>
      </div>

      {/* Ledger — die übrigen Positionen als Haarlinien-Register. Der
          nachlaufende Strich rechts ist die einzige Bewegung pro Zeile. */}
      <div className="px-6 py-20 sm:px-10 sm:py-28 lg:px-16">
        <BlurFade delay={0} direction="up">
          <span className="block border-b border-[#ffffff]/15 pb-5 text-[10px] font-semibold tracking-[0.4em] text-[#d9d9d9] uppercase">
            Die weiteren Positionen
          </span>
        </BlurFade>

        <ul>
          {LEDGER.map((entry, i) => (
            <li key={entry.wine.name} className="border-b border-[#ffffff]/12">
              <BlurFade delay={60 + i * 90} direction="up">
                <button
                  type="button"
                  onClick={() => setDetail(true)}
                  className="group grid min-h-11 w-full grid-cols-[auto_1fr_auto] items-baseline gap-x-6 gap-y-2 rounded-xs py-7 text-left transition-colors duration-500 hover:bg-[#002450]/45 focus-visible:ring-2 focus-visible:ring-[#ffffff] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0b1420] focus-visible:outline-none motion-reduce:transition-none lg:grid-cols-[auto_1fr_auto_auto] lg:gap-x-10"
                >
                  <span className="text-[10px] font-semibold tracking-[0.28em] text-[#d9d9d9]/50 uppercase tabular-nums">
                    № {String(i + 2).padStart(2, '0')}
                  </span>

                  <span className="min-w-0">
                    <span className="font-display block text-[clamp(1.5rem,2.6vw,2.125rem)] leading-tight font-light text-[#ffffff]">
                      {entry.wine.name}{' '}
                      <span className="italic">’{String(entry.wine.vintage).slice(2)}</span>
                    </span>
                    <span className="mt-2 block text-[10px] font-semibold tracking-[0.28em] text-[#d9d9d9]/60 uppercase lg:hidden">
                      {entry.wine.lage}
                    </span>
                  </span>

                  <span className="hidden text-[10px] font-semibold tracking-[0.28em] whitespace-nowrap text-[#d9d9d9]/60 uppercase lg:block">
                    {entry.wine.lage}
                  </span>

                  <span className="flex items-center gap-6 justify-self-end">
                    <span className="font-display text-xl leading-none font-light whitespace-nowrap text-[#ffffff]">
                      {entry.wine.price}
                    </span>
                    <span
                      aria-hidden="true"
                      className="hidden h-px w-10 bg-[#ffffff]/40 transition-all duration-500 group-hover:w-16 group-hover:bg-[#c0392b] motion-reduce:transition-none sm:block"
                    />
                  </span>
                </button>
              </BlurFade>
            </li>
          ))}
        </ul>
      </div>

      {/* Zwischenplatte — hält die Liste davon ab, ein Katalog zu werden. */}
      <div className="relative h-[38vh] overflow-hidden border-t border-[#ffffff]/10">
        <RevealImage
          src="https://images.unsplash.com/photo-1474722883778-792e7990302f?w=1600&q=80"
          alt="Rebzeilen des Weinguts im kühlen Morgenlicht"
          direction="up"
          duration={1600}
          className="absolute inset-0 h-full w-full"
          imgClassName="opacity-85 saturate-[0.45] brightness-[0.66] contrast-[1.05]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[#002450]/40" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-[#0b1420]/85 via-transparent to-[#0b1420]/40"
        />
      </div>

      {/* Concierge — der eine primäre Weg am Ende der Liste. */}
      <div className="bg-[#002450] px-6 py-24 sm:py-32 lg:py-36">
        <div className="mx-auto max-w-2xl text-center">
          <BlurFade delay={0} direction="up">
            <span className="block text-[10px] font-semibold tracking-[0.4em] text-[#d9d9d9] uppercase">
              Der Concierge
            </span>
          </BlurFade>
          <BlurFade delay={120} direction="up">
            <h3 className="font-display mt-8 text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] font-light tracking-tight text-[#ffffff]">
              Sie wissen nicht, <span className="italic">womit anfangen?</span>
            </h3>
          </BlurFade>
          <BlurFade delay={240} direction="up">
            <p className="font-display mx-auto mt-7 max-w-lg text-lg leading-[1.6] font-light text-[#d9d9d9]">
              Schreiben Sie uns zwei Sätze über das, was Sie gerne trinken.
              Wir stellen die sechs Flaschen zusammen — und legen die Notizen dazu.
            </p>
          </BlurFade>
          <BlurFade delay={380} direction="up" className="mt-11 flex flex-col items-center gap-8 sm:flex-row sm:justify-center sm:gap-12">
            <a
              href="/concierge"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#ffffff] px-9 py-3 text-[11px] font-semibold tracking-[0.2em] text-[#0b1420] uppercase transition-colors duration-300 hover:bg-[#c0392b] hover:text-[#ffffff] focus-visible:ring-2 focus-visible:ring-[#ffffff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#002450] focus-visible:outline-none motion-reduce:transition-none"
            >
              Concierge schreiben
            </a>
            <a
              href="/degustation"
              className="group inline-flex min-h-11 items-center gap-4 rounded-xs text-[#ffffff] focus-visible:ring-2 focus-visible:ring-[#ffffff] focus-visible:ring-offset-4 focus-visible:ring-offset-[#002450] focus-visible:outline-none"
            >
              <span className="font-display text-xl leading-none font-light italic">
                Zur Degustation am Hof
              </span>
              <span
                aria-hidden="true"
                className="h-px w-10 bg-[#ffffff]/55 transition-all duration-500 group-hover:w-20 group-hover:bg-[#c0392b] motion-reduce:transition-none"
              />
            </a>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
