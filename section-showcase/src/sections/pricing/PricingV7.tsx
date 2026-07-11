import { BlurFade } from '@components/blur-fade/blur-fade'
import { Particles } from '@components/particles/particles'
import { ShinyText } from '@components/shiny-text/shiny-text'

/**
 * Die Abendkarte (Nocturne / Cinematic) — die realen Verkostungs-Pakete von
 * buchart58.at/sooss-weinverkostung als Weinkarte im Kerzenlicht: Gold-Hairline-
 * Ledger auf warmem Schwarz, gedimmte Positionen glimmen im Hover auf, Ghost-
 * Ziffer „58" hinter der Karte. Kontrastfläche zur Maison-Rebstockmiete (V6).
 */

const PROBEN: Array<{
  numeral: string
  name: string
  data: string
  text: string
  price: string
  note: string
}> = [
  {
    numeral: 'I',
    name: 'Die kleine Probe',
    data: '4 Weine · im Stehen · eine Viertelstunde',
    text: 'Vier Gläser zwischen Tür und Fass — genug, um zu wissen, was Sie mitnehmen.',
    price: '6,–',
    note: 'entfällt ab 60,– Einkauf',
  },
  {
    numeral: 'II',
    name: 'Die große Probe',
    data: '8 Weine frei wählbar · Aufstrichbrote · eine Stunde',
    text: 'Mit Sitzplatz, Brot und Zeit. Dazu läuft der Film aus dem Keller.',
    price: '30,–',
    note: 'inkl. 10,– Weingutschein',
  },
  {
    numeral: 'III',
    name: 'Die große Probe, beim Einkauf',
    data: '8 Weine frei wählbar · Aufstrichbrote · eine Stunde',
    text: 'Dieselbe Stunde, derselbe Tisch — der Einkauf übernimmt die Rechnung.',
    price: '10,–',
    note: 'ab 90,– Einkauf · frei ab 150,–',
  },
]

export function PricingV7() {
  return (
    <section className="relative overflow-hidden bg-[#0d0a09] px-6 py-16 sm:py-28 lg:px-16 lg:py-36">
      {/* Dust in the candlelight */}
      <Particles
        particleColors={['#e8d5ae', '#c9a25e']}
        particleCount={60}
        speed={0.05}
        particleBaseSize={50}
        className="pointer-events-none absolute inset-0 z-0"
      />

      {/* Ghost numeral behind the card */}
      <span
        aria-hidden="true"
        className="font-display pointer-events-none absolute top-16 right-4 z-0 text-[clamp(10rem,26vw,22rem)] leading-none font-light tracking-tighter text-[#c9a25e]/[0.06] italic select-none lg:right-16"
      >
        58
      </span>

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-16 lg:mb-20">
          <BlurFade delay={100} direction="down">
            <span className="mb-5 block text-[10px] font-bold tracking-[0.4em] text-[#c9a25e] uppercase">
              Verkostung · Jederzeit, ohne Voranmeldung
            </span>
          </BlurFade>
          <BlurFade delay={250} direction="up">
            <h2 className="font-display text-[clamp(2.75rem,6.5vw,5.5rem)] leading-[0.92] font-light tracking-tighter text-[#f3ece0]">
              Die <ShinyText duration={12} shineColor="#e8d5ae" className="italic">Abendkarte.</ShinyText>
            </h2>
          </BlurFade>
          <BlurFade delay={400} direction="up">
            <p className="mt-6 max-w-md text-lg leading-relaxed font-light text-[#a89a85]">
              Während Ihres Einkaufs in Ruhe verkosten — im Stehen zwischen den
              Fässern oder mit Sitzplatz, Brot und einer Stunde Zeit.
            </p>
          </BlurFade>
        </div>

        {/* The card — three positions, dimmed until hovered */}
        <ul>
          {PROBEN.map((probe, i) => (
            <li key={probe.name}>
              <BlurFade delay={450 + i * 150} direction="up">
                <a
                  href="/verkostung"
                  className="group grid min-h-11 grid-cols-1 gap-3 border-t border-[#c9a25e]/15 py-8 opacity-70 transition-opacity duration-500 hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-[#c9a25e]/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0d0a09] focus-visible:outline-none sm:grid-cols-[3rem_1fr_auto] sm:gap-8"
                >
                  <span aria-hidden="true" className="font-display text-lg font-light text-[#c9a25e] italic">
                    {probe.numeral}
                  </span>

                  <span className="flex flex-col gap-2 transition-transform duration-500 group-hover:translate-x-2">
                    <span className="font-display text-2xl font-light tracking-tight text-[#f3ece0] sm:text-3xl">
                      {probe.name}
                    </span>
                    <span className="text-[10px] font-bold tracking-[0.25em] text-[#6b5f50] uppercase transition-colors duration-500 group-hover:text-[#c9a25e]">
                      {probe.data}
                    </span>
                    <span className="font-display max-w-sm text-sm leading-relaxed text-[#a89a85] italic">
                      {probe.text}
                    </span>
                  </span>

                  <span className="flex flex-col items-start gap-1 sm:items-end">
                    <span className="font-display text-4xl font-light tracking-tighter text-[#e8d5ae] italic sm:text-5xl">
                      {probe.price}
                    </span>
                    <span className="text-[9px] font-bold tracking-[0.25em] text-[#6b5f50] uppercase">
                      {probe.note}
                    </span>
                  </span>
                </a>
              </BlurFade>
            </li>
          ))}
        </ul>

        {/* Closing line + CTA */}
        <BlurFade delay={950} direction="up">
          <div className="flex flex-col gap-8 border-t border-[#c9a25e]/15 pt-8 lg:flex-row lg:items-baseline lg:justify-between">
            <p className="font-display max-w-md text-sm leading-relaxed text-[#6b5f50] italic">
              Pro Person, inklusive Leitungs- und Sodawasser. Die Familie ist im
              Haus — kommen Sie einfach vorbei.
            </p>
            <a
              href="/verkostung"
              className="group inline-flex min-h-11 items-center gap-4 text-xs font-bold tracking-[0.25em] text-[#e8d5ae] uppercase focus-visible:ring-2 focus-visible:ring-[#c9a25e]/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0d0a09] focus-visible:outline-none"
            >
              <span
                aria-hidden="true"
                className="h-px w-12 bg-[#c9a25e] transition-all duration-500 group-hover:w-20"
              />
              Tisch im Gewölbe
            </a>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
