import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'

/**
 * Nachtblau — eine einzelne Flasche im kühlen Streiflicht. Navy-Feld mit der
 * Serif links, die Flasche randlos rechts; darunter die Fiche Technique als
 * Sans-Haarlinien neben einer Kellertafel. Das einzige Rot der Seite sitzt auf
 * dem CTA — es markiert Interaktion, nie Dekoration.
 * Abgrenzung zu Nocturne (ProductV5): kein Kerzengold, kein Glow, keine
 * Inszenierung um die Flasche herum. Nur Licht, Stein und eine Zahl.
 */

const FICHE: Array<[string, string]> = [
  ['Riede', 'Loibenberg · Urgestein'],
  ['Rebsorte', 'Grüner Veltliner'],
  ['Jahrgang', '2021'],
  ['Lese', 'Handlese, 14. Oktober'],
  ['Ausbau', '18 Monate, großes Holz'],
  ['Alkohol', '13,5 % vol.'],
  ['Füllung', '2.400 Flaschen, nummeriert'],
  ['Trinkreife', '2026 – 2038'],
]

export interface ProductNachtblauProps {
  onBack?: () => void
}

export function ProductNachtblau({ onBack }: ProductNachtblauProps) {
  return (
    <section className="w-full bg-[#0b1420]">
      {/* Tafel I — Navy-Feld links, Flasche randlos rechts. Der Split spiegelt
          den Hero, ist aber gegenläufig gesetzt: dort Bild links, hier rechts. */}
      <div className="grid grid-cols-1 lg:min-h-screen lg:grid-cols-2">
        <div className="order-2 flex flex-col justify-center bg-[#002450] px-6 py-16 sm:px-10 sm:py-24 lg:order-1 lg:px-16 lg:py-28">
          {onBack && (
            <BlurFade delay={0} direction="down">
              <button
                type="button"
                onClick={onBack}
                className="group inline-flex min-h-11 items-center gap-4 rounded-xs text-[10px] font-semibold tracking-[0.32em] text-[#d9d9d9] uppercase focus-visible:ring-2 focus-visible:ring-[#ffffff] focus-visible:ring-offset-4 focus-visible:ring-offset-[#002450] focus-visible:outline-none"
              >
                <span
                  aria-hidden="true"
                  className="h-px w-8 bg-[#d9d9d9]/55 transition-all duration-500 group-hover:w-4 group-hover:bg-[#c0392b] motion-reduce:transition-none"
                />
                Zurück zur Degustation
              </button>
            </BlurFade>
          )}

          <BlurFade delay={90} direction="up">
            <span className="mt-10 block text-[10px] font-semibold tracking-[0.4em] text-[#d9d9d9] uppercase">
              Ried Loibenberg · Smaragd · Einzellage
            </span>
          </BlurFade>

          <BlurFade delay={200} direction="up">
            <h2 className="font-display mt-8 text-[clamp(2.75rem,6vw,4.75rem)] leading-[1.0] font-light tracking-tight text-[#ffffff]">
              Loibenberg
              <br />
              <span className="italic">Smaragd</span>
            </h2>
          </BlurFade>

          <BlurFade delay={320} direction="up">
            <p className="font-display mt-8 max-w-md text-[clamp(1.0625rem,1.6vw,1.3125rem)] leading-[1.65] font-light text-[#d9d9d9]">
              Rauch über nassem Stein, dahinter Quitte und weißer Pfeffer.
              Straff, fast streng — und dann öffnet sich der Wein, wie es nur
              alte Reben auf Urgestein können.
            </p>
          </BlurFade>

          <BlurFade
            delay={460}
            direction="up"
            className="mt-12 flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:gap-12"
          >
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-semibold tracking-[0.28em] text-[#d9d9d9]/70 uppercase">
                Ab Hof · 0,75 l
              </span>
              <span className="font-display text-4xl leading-none font-light text-[#ffffff]">€ 38,—</span>
            </div>
            <a
              href="/weinclub/loibenberg-smaragd"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#c0392b] px-9 py-3 text-[11px] font-semibold tracking-[0.2em] text-[#ffffff] uppercase transition-colors duration-300 hover:bg-[#ffffff] hover:text-[#0b1420] focus-visible:ring-2 focus-visible:ring-[#ffffff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#002450] focus-visible:outline-none motion-reduce:transition-none"
            >
              In den Weinclub
            </a>
          </BlurFade>

          <BlurFade delay={600} className="mt-14 border-t border-[#ffffff]/15 pt-6">
            <ul className="flex flex-wrap gap-x-7 gap-y-2">
              {['Handlese', '18 Monate Holz', '2.400 Flaschen'].map(mark => (
                <li
                  key={mark}
                  className="text-[10px] font-semibold tracking-[0.28em] text-[#d9d9d9]/70 uppercase"
                >
                  {mark}
                </li>
              ))}
            </ul>
          </BlurFade>
        </div>

        <div className="relative order-1 min-h-[60vh] overflow-hidden lg:order-2 lg:min-h-0">
          <RevealImage
            src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=1400&q=80"
            alt="Flasche Loibenberg Smaragd im Streiflicht auf einer Steinplatte"
            direction="up"
            duration={1600}
            className="absolute inset-0 h-full w-full"
            imgClassName="opacity-90 saturate-[0.5] brightness-[0.72] contrast-[1.06]"
          />
          {/* Dieselbe kühle Angleichung wie im Hero — kein Foto der Familie
              fällt aus dem Navy-Raum. */}
          <div aria-hidden="true" className="absolute inset-0 bg-[#002450]/35" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-[#0b1420]/85 via-[#0b1420]/10 to-transparent"
          />
          <BlurFade delay={700} className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10">
            <span className="text-[10px] font-semibold tracking-[0.32em] text-[#d9d9d9] uppercase">
              Abb. 03 — Streiflicht, Kellermauer
            </span>
          </BlurFade>
        </div>
      </div>

      {/* Tafel II — Fiche Technique als Haarlinien-Register, daneben der Keller,
          in dem die Zahlen entstanden sind. */}
      <div className="grid grid-cols-1 border-t border-[#ffffff]/10 lg:grid-cols-[1.15fr_1fr]">
        <div className="px-6 py-20 sm:px-10 sm:py-28 lg:px-16">
          <BlurFade delay={0} direction="up">
            <span className="block text-[10px] font-semibold tracking-[0.4em] text-[#d9d9d9] uppercase">
              Fiche Technique
            </span>
          </BlurFade>
          <BlurFade delay={110} direction="up">
            <h3 className="font-display mt-6 text-[clamp(1.75rem,3.2vw,2.5rem)] leading-[1.1] font-light tracking-tight text-[#ffffff]">
              Was im Glas <span className="italic">nachweisbar</span> ist.
            </h3>
          </BlurFade>

          <div className="mt-12 grid grid-cols-1 gap-x-14 sm:grid-cols-2">
            {FICHE.map(([label, value], i) => (
              <BlurFade key={label} delay={200 + i * 55} direction="up">
                <div className="flex flex-col gap-1.5 border-t border-[#ffffff]/12 py-4 sm:flex-row sm:items-baseline sm:gap-6">
                  <span className="text-[10px] font-semibold tracking-[0.28em] text-[#d9d9d9]/60 uppercase sm:w-24 sm:shrink-0">
                    {label}
                  </span>
                  <span className="font-display text-lg leading-snug font-light text-[#ffffff] italic">
                    {value}
                  </span>
                </div>
              </BlurFade>
            ))}
          </div>

          <BlurFade delay={700} direction="up" className="mt-12">
            <a
              href="/rieden/loibenberg"
              className="group inline-flex min-h-11 items-center gap-4 rounded-xs text-[#ffffff] focus-visible:ring-2 focus-visible:ring-[#ffffff] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0b1420] focus-visible:outline-none"
            >
              <span className="font-display text-xl leading-none font-light italic">
                Die Riede Loibenberg lesen
              </span>
              <span
                aria-hidden="true"
                className="h-px w-10 bg-[#ffffff]/55 transition-all duration-500 group-hover:w-20 group-hover:bg-[#c0392b] motion-reduce:transition-none"
              />
            </a>
          </BlurFade>
        </div>

        <div className="relative min-h-[52vh] overflow-hidden border-t border-[#ffffff]/10 lg:min-h-0 lg:border-t-0 lg:border-l">
          <RevealImage
            src="https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=1200&q=80"
            alt="Fasslager im Keller des Weinguts bei gedämpftem Licht"
            direction="up"
            delay={200}
            duration={1600}
            className="absolute inset-0 h-full w-full"
            imgClassName="opacity-85 saturate-[0.45] brightness-[0.68] contrast-[1.05]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-[#002450]/40" />
          <BlurFade delay={520} className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10">
            <span className="text-[10px] font-semibold tracking-[0.32em] text-[#d9d9d9] uppercase">
              Abb. 04 — Fasslager, Reifezeit
            </span>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
