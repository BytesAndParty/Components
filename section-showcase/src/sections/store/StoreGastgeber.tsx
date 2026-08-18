import { useState } from 'react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'
import { ProductGastgeber } from '../showcase/ProductGastgeber'
import { SAMPLE_WINES } from './cards/sample-wines'

/**
 * Gastgeber — das Sortiment als symmetrisches Register auf Creme. Oben stehen
 * Weingut, Verkostung und Gästehaus wieder gleichrangig nebeneinander, darunter
 * sechs gleich große Positionen auf einer Mittelachse. Bewusst ohne jeden
 * Verkaufsstörer: keine Rabatte, keine Rosetten, keine Streichpreise, keine
 * Badges — der Preis ist eine Angabe, kein Argument. Abgrenzung zu StoreMaison
 * (Magazin-Register mit Platten und Fiche-Nummern) und zu allem Karten-Chrome.
 */

/** Einheitliche Bildstimmung — alle Motive der Familie kommen aus derselben Welt. */
const WARM = 'sepia-[.18] saturate-90 contrast-[1.02]'

/**
 * Handgezeichneter Stempelrahmen — dieselbe Linie wie im Hero, damit die
 * Buttons der Familie überall aus derselben Hand kommen.
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

/** Stempel-Kiste für „Ab Hof“ — Flaschenhälse über der handgezeichneten Steige. */
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

/** Die drei Geschäftsbereiche — gleichrangig, gleiche Fläche, gleiches Gewicht. */
const BEREICHE = [
  { label: 'Weingut', href: '/weingut' },
  { label: 'Verkostung', href: '/verkostung' },
  { label: 'Gästehaus', href: '/gaestehaus' },
]

export function StoreGastgeber() {
  const [active, setActive] = useState(false)

  if (active) {
    return <ProductGastgeber onBack={() => setActive(false)} />
  }

  return (
    <section className="relative w-full overflow-hidden bg-[#f5f1e2] px-6 py-16 sm:py-24 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Dieselbe Bereichsleiste wie im Hero: der Shop ist einer von drei
            Bereichen, nicht der Hauptdarsteller. */}
        <BlurFade delay={80} direction="down">
          <nav aria-label="Bereiche" className="grid grid-cols-3 border-y border-[#ddd4bd]">
            {BEREICHE.map((b) => (
              <a
                key={b.label}
                href={b.href}
                className="flex min-h-11 items-center justify-center py-3 text-[10px] font-semibold tracking-[0.24em] text-[#4a4a4a] uppercase transition-colors duration-300 hover:text-[#c03a2c] focus-visible:ring-2 focus-visible:ring-[#c03a2c]/60 focus-visible:ring-inset focus-visible:outline-none"
              >
                {b.label}
              </a>
            ))}
          </nav>
        </BlurFade>

        {/* Zentrierter Sektionskopf — dieselbe Achse wie Hero und Features. */}
        <div className="mx-auto mt-16 max-w-2xl text-center lg:mt-24">
          <BlurFade delay={200} direction="up">
            <p className="font-display text-[clamp(0.9rem,1.5vw,1.15rem)] font-medium tracking-[0.19em] text-[#c03a2c] uppercase">
              Ab Hof und im Versand
            </p>
          </BlurFade>
          <BlurFade delay={320} direction="up">
            <h2 className="mt-5 text-[clamp(1.75rem,4.6vw,3.1rem)] leading-[1.08] font-semibold tracking-[0.005em] text-[#212529] uppercase">
              Das Sortiment
            </h2>
          </BlurFade>
          <BlurFade delay={440} direction="up">
            <p className="mx-auto mt-7 max-w-xl text-[1.0625rem] leading-[1.8] text-[#4a4a4a]">
              Sechs Positionen aus sieben Rieden — mehr füllen wir nicht. Was hier
              steht, haben wir selbst gelesen, gepresst und ausgebaut. Preise ab
              Hof, Versand innerhalb Österreichs ab sechs Flaschen.
            </p>
          </BlurFade>
        </div>

        {/* Sechs gleich große Positionen, gleiches Bildformat, gleiche Achse.
            Kein Badge, kein Streichpreis, kein „nur noch 3 Stück“ — die einzige
            Handlung der Karte ist der Weg zum Wein. */}
        <div className="mt-20 grid grid-cols-1 gap-14 sm:mt-24 sm:grid-cols-2 sm:gap-12 lg:grid-cols-3 lg:gap-14">
          {SAMPLE_WINES.map((item, i) => (
            <BlurFade key={item.wine.name} delay={580 + i * 110} direction="up" className="h-full">
              <article className="group flex h-full flex-col items-center text-center">
                <div className="w-full bg-[#fff1df] px-6 py-8 sm:px-8 sm:py-10">
                  <RevealImage
                    src={item.wine.imageSrc}
                    alt={`Flasche ${item.wine.name} ${item.wine.vintage} aus der Lage ${item.wine.lage}`}
                    direction="up"
                    duration={1400}
                    delay={i * 110}
                    className="aspect-4/5 w-full"
                    imgClassName={WARM}
                  />
                </div>

                <p className="font-display mt-8 text-[0.9rem] font-medium tracking-[0.16em] text-[#c03a2c] uppercase">
                  {item.wine.lage}
                </p>
                <h3 className="mt-3 text-lg font-semibold tracking-[0.06em] text-[#212529] uppercase">
                  {item.wine.name} {item.wine.vintage}
                </h3>
                <p className="mt-4 text-[1rem] leading-[1.8] text-[#4a4a4a]">{item.wine.description}</p>

                <div className="mt-auto flex w-full flex-col items-center gap-4 pt-8">
                  <span className="font-display text-2xl font-medium text-[#212529]">{item.wine.price}</span>
                  <button
                    type="button"
                    onClick={() => setActive(true)}
                    aria-label={`${item.wine.name} ${item.wine.vintage} ansehen`}
                    className="inline-flex min-h-11 cursor-pointer flex-col items-center justify-center gap-3 px-3 text-[10px] font-semibold tracking-[0.24em] text-[#212529] uppercase transition-colors duration-300 hover:text-[#c03a2c] focus-visible:ring-2 focus-visible:ring-[#c03a2c]/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f5f1e2] focus-visible:outline-none"
                  >
                    <span
                      aria-hidden="true"
                      className="h-px w-10 bg-current transition-all duration-500 group-hover:w-20"
                    />
                    Zum Wein
                  </button>
                </div>
              </article>
            </BlurFade>
          ))}
        </div>

        {/* Abschluss: ruhige Angaben statt Verkaufsdruck, mittig ausbalanciert. */}
        <BlurFade delay={1240} className="mt-24 lg:mt-32">
          <div className="border-t border-[#ddd4bd] pt-10">
            <dl className="grid grid-cols-1 divide-y divide-[#ddd4bd] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {[
                ['Sortiment', 'Sechs Positionen'],
                ['Jahrgänge', '2020 – 2023'],
                ['Abholung', 'Fr & Sa, 14–19 Uhr'],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col items-center gap-1.5 px-4 py-7 text-center">
                  <dt className="text-[9px] font-semibold tracking-[0.3em] text-[#626262] uppercase">{label}</dt>
                  <dd className="font-display text-xl font-medium text-[#212529]">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex justify-center">
              <a
                href="/ab-hof"
                className="group relative inline-flex min-h-11 items-center gap-3 px-7 py-3 text-[#212529] transition-colors duration-300 hover:text-[#c03a2c] focus-visible:ring-2 focus-visible:ring-[#c03a2c]/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f5f1e2] focus-visible:outline-none"
              >
                <StampFrame />
                <CrateStamp className="h-5 w-5 shrink-0" />
                <span className="text-[9.5px] font-semibold tracking-[0.16em] uppercase">Ab Hof abholen</span>
              </a>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
