import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'

/**
 * Schwarzweiß — ein einzelner Wein auf reinem Weiß. Entsättigte Reportage-
 * fotografie links, rechts der Name in großer Serif und die Verkostungsnotiz
 * als Fließtext mit Zeilenhöhe 1:2. Die technischen Daten liegen als schwarze
 * Haarlinien-Zeilen darunter; der einzige harte Kontrast der Seite ist der
 * schwarze Flächen-Button. Abgrenzung zu ProductV6: kein Cream, keine
 * überlappenden Tafeln, keine Fig.-Nummern — Mittelachse statt Schichtung.
 */

const DATA_ROWS: Array<[string, string]> = [
  ['Rebsorte', 'Grüner Veltliner'],
  ['Riede', 'Loibenberg · Urgestein, Südterrasse'],
  ['Ausbau', '18 Monate im großen Holzfass'],
  ['Alkohol', '13,0 % vol · 4,1 g/l Restzucker'],
  ['Füllung', '2.400 Flaschen, im März 2023'],
  ['Trinkreife', '2024 – 2038'],
]

export interface ProductSchwarzweissProps {
  onBack?: () => void
}

export function ProductSchwarzweiss({ onBack }: ProductSchwarzweissProps) {
  return (
    <section className="w-full bg-[#ffffff] px-6 py-10 sm:px-10 lg:px-16 lg:py-14">
      {/* Kopfleiste — dieselbe Rahmung wie im Hero. */}
      <BlurFade delay={0} direction="down">
        <div className="flex min-h-11 items-center justify-between border-b border-[#000101] pb-4">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="group inline-flex min-h-11 cursor-pointer items-center gap-4 rounded-xs text-[11px] font-semibold tracking-[0.28em] text-[#000101] uppercase focus-visible:ring-2 focus-visible:ring-[#000101] focus-visible:ring-offset-4 focus-visible:ring-offset-[#ffffff] focus-visible:outline-none"
            >
              <span
                aria-hidden="true"
                className="h-px w-10 bg-[#000101] transition-all duration-500 group-hover:w-16"
              />
              Sortiment
            </button>
          ) : (
            <span className="font-display text-xl leading-none font-light text-[#000101]">Buchart58</span>
          )}
          <span className="text-[10px] font-semibold tracking-[0.32em] text-[#5f5f5f] uppercase">
            Position 01 / 06
          </span>
        </div>
      </BlurFade>

      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-x-16 gap-y-14 pt-16 md:grid-cols-12 lg:pt-24">
          {/* Flasche — helle Reportagefotografie, entsättigt. */}
          <div className="md:col-span-5 md:col-start-1">
            <RevealImage
              src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=1400&q=80"
              alt="Flasche Loibenberg Smaragd vor heller Kellermauer"
              direction="up"
              duration={1500}
              className="aspect-4/5 w-full"
              imgClassName="grayscale"
            />
            <p className="mt-4 border-t border-[#000101]/20 pt-3 text-[10px] font-semibold tracking-[0.24em] text-[#5f5f5f] uppercase">
              Kellermauer, Vormittagslicht
            </p>
          </div>

          {/* Erzählung */}
          <div className="md:col-span-6 md:col-start-7">
            <BlurFade delay={100} direction="up">
              <span className="block text-[10px] font-semibold tracking-[0.4em] text-[#5f5f5f] uppercase">
                Weißwein trocken · Jahrgang 2021
              </span>
            </BlurFade>

            <BlurFade delay={200} direction="up">
              <h2 className="font-display mt-7 text-[clamp(2.75rem,6.5vw,4.75rem)] leading-[0.98] font-light tracking-tight text-[#000101]">
                Loibenberg
                <br />
                Smaragd
              </h2>
            </BlurFade>

            <BlurFade delay={330} direction="up">
              <p className="mt-9 max-w-lg text-[17px] leading-[2] text-[#5f5f5f]">
                In der Nase Rauch über nassem Stein, dahinter Quitte und weißer
                Pfeffer. Am Gaumen zuerst straff, fast streng — dann öffnet sich
                der Wein und wird breit, ohne weich zu werden. Der Nachhall
                bleibt salzig und lang. Ein Wein, der keine Speise braucht,
                aber gebratenen Fisch nicht verachtet.
              </p>
            </BlurFade>

            <BlurFade delay={460} direction="up">
              <div className="mt-12 flex flex-wrap items-end gap-x-12 gap-y-8 border-t border-[#000101] pt-8">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-semibold tracking-[0.3em] text-[#5f5f5f] uppercase">
                    Ab Hof, 0,75 l
                  </span>
                  <span className="font-display text-4xl leading-none font-light text-[#000101]">€ 38,—</span>
                </div>
                <a
                  href="/sortiment/loibenberg-smaragd"
                  className="inline-flex min-h-11 items-center justify-center border border-[#000101] bg-[#000101] px-10 py-3.5 text-[11px] font-semibold tracking-[0.28em] text-[#ffffff] uppercase transition-colors duration-300 hover:bg-[#ffffff] hover:text-[#000101] focus-visible:ring-2 focus-visible:ring-[#000101] focus-visible:ring-offset-2 focus-visible:ring-offset-[#ffffff] focus-visible:outline-none"
                >
                  In den Warenkorb
                </a>
              </div>
            </BlurFade>
          </div>
        </div>

        {/* Technische Daten — schwarze Haarlinien-Zeilen. */}
        <div className="mt-20 lg:mt-28">
          <BlurFade delay={0}>
            <span className="block border-b border-[#000101] pb-4 text-[10px] font-semibold tracking-[0.32em] text-[#5f5f5f] uppercase">
              Daten zum Wein
            </span>
          </BlurFade>
          <dl>
            {DATA_ROWS.map(([label, value], i) => (
              <BlurFade key={label} delay={80 + i * 70} direction="up">
                <div className="flex flex-col gap-1 border-b border-[#000101]/20 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                  <dt className="text-[10px] font-semibold tracking-[0.26em] text-[#5f5f5f] uppercase">
                    {label}
                  </dt>
                  <dd className="font-display text-xl leading-tight font-light text-[#000101] sm:text-right">
                    {value}
                  </dd>
                </div>
              </BlurFade>
            ))}
          </dl>
        </div>

        {/* Rhythmuswechsel — Serif-Zitat über die volle Breite. */}
        <div className="mt-20 border-t border-[#000101] pt-20 sm:mt-28 sm:pt-28">
          <BlurFade delay={0} direction="up">
            <blockquote className="mx-auto max-w-4xl text-center">
              <p className="font-display text-[clamp(1.75rem,4vw,3rem)] leading-[1.24] font-light tracking-tight text-[#000101]">
                „Der Loibenberg ist der einzige unserer Hänge, der nie
                freundlich schmeckt. Man muss ihn aushalten wollen.“
              </p>
              <footer className="mt-9 text-[10px] font-semibold tracking-[0.32em] text-[#5f5f5f] uppercase">
                Kellerbuch, Eintrag vom 12. März
              </footer>
            </blockquote>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
