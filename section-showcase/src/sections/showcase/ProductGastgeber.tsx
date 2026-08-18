import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'
import { GASTGEBER_FONTS } from '../family-fonts'

/**
 * Gastgeber — ein Wein auf der Mittelachse: roter Serif-Kicker über der
 * Versal-Headline, die Flasche groß und warm auf einem Creme-Feld, darunter die
 * Verkostungsnotiz als ruhige, mittige Spalte. Die technischen Daten stehen als
 * zwei exakt gleich schwere Spalten, der Warenkorb ist ein gestempelter Rahmen.
 * Abgrenzung zu ProductV6 (asymmetrischer Magazin-Held mit überlappenden Tafeln):
 * hier überlappt nichts — jede Zeile sitzt auf derselben Achse.
 */

/** Einheitliche Bildstimmung — alle Motive der Familie kommen aus derselben Welt. */
const WARM = 'sepia-[.18] saturate-90 contrast-[1.02]'

/**
 * Handgezeichneter Stempelrahmen. Liegt absolut hinter dem Label und wird über
 * `preserveAspectRatio="none"` auf die Buttonbreite gezogen — `vectorEffect`
 * hält die Strichstärke dabei konstant, damit die Linie nicht ausfranst.
 */
function StampFrame() {
  return (
    <svg
      viewBox="0 0 240 64"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-60 transition-opacity duration-300 group-hover:opacity-100"
    >
      <path
        d="M6.5 7.5C62 3.8 152 4.6 233 7.2c2.8 16.4 2.4 36.4.9 49.4C160 60 68 59.4 6.8 56.9 3.6 40.2 4.4 21.6 6.5 7.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/** Stempel-Kiste für „In den Warenkorb“ — Flaschenhälse über der Steige. */
function CrateStamp({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.15"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g transform="rotate(1.5 12 12)">
        <path d="M8.2 3.4c-.2 1.7-.2 3.3-.1 4.7" />
        <path d="M12 2.9c-.1 1.9-.1 3.7 0 5.2" />
        <path d="M15.8 3.6c.12 1.5.12 3 0 4.5" />
        <path d="M4.4 8.4c5.2-.45 10.4-.4 15.4.1.3 3.9.25 8-.05 11.9-5.2.4-10.6.35-15.6 0-.3-4-.2-8 .25-12Z" />
        <path d="M4.6 13.2c5.1-.35 10.2-.3 15 .05" />
      </g>
    </svg>
  )
}

/** Gestempelte Trennlinie — eine Handbewegung statt einer Hairline. */
function HandRule({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 6"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    >
      <path d="M1.5 3.4C24 1.6 47 1.9 70 3.1c16 .8 31 .9 48.5.2" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/** Die Verkostungsnotiz — mittig, drei Zeilen, keine Karte. */
const NOTIZEN: Array<[string, string]> = [
  ['Nase', 'Rauch über nassem Stein, Quitte, ein Hauch weißer Pfeffer'],
  ['Gaumen', 'Straff und salzig, mit einer Mitte aus reifem Apfel'],
  ['Abgang', 'Lang, kühl, mineralisch — kommt zweimal zurück'],
]

/** Zwei ausbalancierte Spalten mit exakt gleich vielen Zeilen. */
const DATEN_LINKS: Array<[string, string]> = [
  ['Riede', 'Loibenberg · Urgestein'],
  ['Rebsorte', 'Grüner Veltliner'],
  ['Ausbau', '18 Monate, großes Holz'],
]

const DATEN_RECHTS: Array<[string, string]> = [
  ['Füllung', '2.400 Flaschen'],
  ['Alkohol', '13,5 % vol.'],
  ['Trinkreife', '2026 – 2034'],
]

export interface ProductGastgeberProps {
  onBack?: () => void
}

export function ProductGastgeber({ onBack }: ProductGastgeberProps) {
  return (
    <section style={GASTGEBER_FONTS} className="relative w-full overflow-hidden bg-[#f5f1e2] px-6 py-14 sm:py-20 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-5xl">
        {/* Auch die Rückkehr steht auf der Achse — ein linksbündiger Zurück-Link
            würde die Symmetrie der Familie an der ersten Zeile brechen. */}
        {onBack && (
          <BlurFade delay={50} direction="down">
            <div className="flex justify-center">
              <button
                type="button"
                onClick={onBack}
                className="group inline-flex min-h-11 cursor-pointer items-center gap-3 px-2 text-[10px] font-semibold tracking-[0.24em] text-[#212529] uppercase transition-colors duration-300 hover:text-[#c03a2c] focus-visible:ring-2 focus-visible:ring-[#c03a2c]/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f5f1e2] focus-visible:outline-none"
              >
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>
                Zurück zum Sortiment
              </button>
            </div>
          </BlurFade>
        )}

        {/* Zentrierte Achse: roter Serif-Kicker über kräftiger Sans-Versal-Headline. */}
        <div className="mx-auto mt-10 max-w-3xl text-center lg:mt-14">
          <BlurFade delay={120} direction="up">
            <p className="font-display text-[clamp(0.9rem,1.5vw,1.15rem)] font-medium tracking-[0.19em] text-[#c03a2c] uppercase">
              Aus der Ried Loibenberg
            </p>
          </BlurFade>
          <BlurFade delay={240} direction="up">
            <h1 className="mt-5 text-[clamp(1.9rem,5.2vw,3.6rem)] leading-[1.06] font-semibold tracking-[0.005em] text-[#212529] uppercase">
              Loibenberg
              <br />
              Smaragd 2021
            </h1>
          </BlurFade>
        </div>

        {/* Die Flasche mittig auf dem zweiten Creme-Ton — das Farbfeld ersetzt
            den Rahmen und hält das Motiv exakt auf der Achse. */}
        <BlurFade delay={380} className="mx-auto mt-14 max-w-lg lg:mt-16">
          <div className="bg-[#fff1df] px-6 py-8 sm:px-12 sm:py-12">
            <RevealImage
              src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=1200&q=80"
              alt="Flasche Loibenberg Smaragd 2021 im warmen Streiflicht"
              direction="up"
              duration={1500}
              className="aspect-4/5 w-full"
              imgClassName={WARM}
            />
          </div>
          <div className="mt-5 flex flex-col items-center gap-1.5 text-center">
            <span className="font-display text-lg font-medium text-[#212529]">
              Jahrgang 2021, Handlese am 12. Oktober
            </span>
            <span className="text-[9px] font-semibold tracking-[0.3em] text-[#626262] uppercase">
              0,75 l · Ab Hof gefüllt
            </span>
          </div>
        </BlurFade>

        {/* Verkostungsnotiz: eine ruhige, schmale Spalte in der Mitte. */}
        <div className="mx-auto mt-20 max-w-xl text-center lg:mt-24">
          <BlurFade delay={520} direction="up">
            <p className="text-[1.0625rem] leading-[1.8] text-[#4a4a4a]">
              Alte Reben auf verwittertem Urgestein, dreißig Jahre Wurzeltiefe. Ein
              Wein, der erst streng wirkt und sich dann in aller Ruhe öffnet — wir
              schenken ihn im Keller als letzten aus, nie als ersten.
            </p>
          </BlurFade>

          <BlurFade delay={620} className="mt-12 flex justify-center">
            <HandRule className="h-1.5 w-24 text-[#c03a2c]" />
          </BlurFade>

          <BlurFade delay={700} direction="up">
            <dl className="mt-10 flex flex-col gap-8">
              {NOTIZEN.map(([label, value]) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <dt className="text-[9px] font-semibold tracking-[0.3em] text-[#626262] uppercase">{label}</dt>
                  <dd className="text-[1rem] leading-[1.8] text-[#4a4a4a]">{value}</dd>
                </div>
              ))}
            </dl>
          </BlurFade>
        </div>

        {/* Preis und Stempel-Button — beide auf der Achse, der Preis führt. */}
        <BlurFade delay={840} direction="up" className="mt-16">
          <div className="flex flex-col items-center gap-7">
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[9px] font-semibold tracking-[0.3em] text-[#626262] uppercase">Ab Hof</span>
              <span className="font-display text-4xl font-medium text-[#212529]">€ 38,—</span>
            </div>
            <button
              type="button"
              className="group relative inline-flex min-h-11 cursor-pointer items-center gap-3 px-7 py-3 text-[#212529] transition-colors duration-300 hover:text-[#c03a2c] focus-visible:ring-2 focus-visible:ring-[#c03a2c]/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f5f1e2] focus-visible:outline-none"
            >
              <StampFrame />
              <CrateStamp className="h-5 w-5 shrink-0" />
              <span className="text-[9.5px] font-semibold tracking-[0.16em] uppercase">In den Warenkorb</span>
            </button>
          </div>
        </BlurFade>

        {/* Technische Daten: zwei Spalten mit identischer Zeilenzahl, damit die
            Basis der Seite genauso ausbalanciert schließt, wie sie beginnt. */}
        <BlurFade delay={980} className="mt-24 lg:mt-32">
          <div className="border-t border-[#ddd4bd] pt-10">
            <p className="text-center text-[9px] font-semibold tracking-[0.34em] text-[#626262] uppercase">
              Aus dem Kellerbuch
            </p>
            <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-0 sm:divide-x sm:divide-[#ddd4bd]">
              {[DATEN_LINKS, DATEN_RECHTS].map((spalte, s) => (
                <dl key={spalte[0][0]} className={`flex flex-col gap-7 ${s === 0 ? 'sm:pr-10' : 'sm:pl-10'}`}>
                  {spalte.map(([label, value]) => (
                    <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                      <dt className="text-[9px] font-semibold tracking-[0.3em] text-[#626262] uppercase">{label}</dt>
                      <dd className="font-display text-xl font-medium text-[#212529]">{value}</dd>
                    </div>
                  ))}
                </dl>
              ))}
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
