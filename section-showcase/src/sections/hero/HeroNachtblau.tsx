import type { ReactNode } from 'react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'

/**
 * Nachtblau — ein durchgehender dunkler Markenraum statt dunkler Einzel-
 * sektionen. Halbseitiger Split: kühl gegradete Fotografie links, Navy-Feld
 * mit Serif-Typografie rechts. Darunter kippt die Komposition vom asym-
 * metrischen Split in eine strenge Mitte — dieser Wechsel ist der Rhythmus.
 * Ein weißer Pill-CTA, daneben ein kursiver Serif-Link mit nachlaufendem Strich.
 * Abgrenzung zu Nocturne: kühles Navy statt warmem Schwarz, ein Interaktionsrot
 * statt Kerzengold, und bewusst keine Rays, Partikel oder Glows — hier wird
 * nichts inszeniert, hier bleibt etwas stehen.
 */

/** Ring-Offset muss die Fläche treffen, auf der der Link liegt. */
const GROUND_RING = {
  night: 'focus-visible:ring-offset-[#0b1420]',
  navy: 'focus-visible:ring-offset-[#002450]',
}

function SerifLink({
  href,
  children,
  ground = 'night',
}: {
  href: string
  children: ReactNode
  ground?: keyof typeof GROUND_RING
}) {
  return (
    <a
      href={href}
      className={`group inline-flex min-h-11 items-center gap-4 rounded-xs text-[#ffffff] focus-visible:ring-2 focus-visible:ring-[#ffffff] focus-visible:ring-offset-4 focus-visible:outline-none ${GROUND_RING[ground]}`}
    >
      <span className="font-display text-xl leading-none font-light italic">{children}</span>
      <span
        aria-hidden="true"
        className="h-px w-10 bg-[#ffffff]/55 transition-all duration-500 group-hover:w-20 group-hover:bg-[#c0392b]"
      />
    </a>
  )
}

const REGISTER = ['Ried Kreutles', 'Ried Loibenberg', 'Ried Steinriegl', 'Leithaberg']

export function HeroNachtblau() {
  return (
    <section className="w-full bg-[#0b1420]">
      {/* Tafel I — halbseitiger Split. Die Fotografie läuft randlos bis zur
          Sektionskante, das Navy-Feld hält die Typografie; auf Mobil stapeln
          beide, das Bild behält aber Vollbild-Anmutung (58vh). */}
      <div className="grid grid-cols-1 lg:min-h-screen lg:grid-cols-2">
        <div className="relative min-h-[58vh] overflow-hidden lg:min-h-0">
          <RevealImage
            src="https://images.unsplash.com/photo-1543418219-44e30b057fea?w=1600&q=80"
            alt="Terrassierte Rebhänge über der Donau im späten Herbstlicht"
            direction="up"
            duration={1600}
            className="absolute inset-0 h-full w-full"
            imgClassName="opacity-90 saturate-[0.5] brightness-[0.72] contrast-[1.06]"
          />
          {/* Kühle Angleichung: alle Fotos dieser Familie werden in denselben
              Navy-Raum gezogen, damit keines aus der Lichtstimmung fällt. */}
          <div aria-hidden="true" className="absolute inset-0 bg-[#002450]/35" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-[#0b1420]/85 via-[#0b1420]/10 to-transparent"
          />

          <BlurFade delay={700} className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10">
            <span className="text-[10px] font-semibold tracking-[0.32em] text-[#d9d9d9] uppercase">
              Abb. 01 — Ried Loibenberg, Oktober
            </span>
          </BlurFade>
        </div>

        <div className="flex flex-col justify-center bg-[#002450] px-6 py-16 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
          <BlurFade delay={0} direction="up">
            <span className="block text-[10px] font-semibold tracking-[0.4em] text-[#d9d9d9] uppercase">
              Wachau · Österreich — Weingut seit 1958
            </span>
          </BlurFade>

          <BlurFade delay={120} direction="up">
            <h1 className="font-display mt-8 text-[clamp(3rem,7vw,5.5rem)] leading-[0.98] font-light tracking-tight text-[#ffffff]">
              Kühles Licht,
              <br />
              später Herbst,
              <br />
              <span className="italic">ein Hang.</span>
            </h1>
          </BlurFade>

          <BlurFade delay={260} direction="up">
            <p className="font-display mt-9 max-w-md text-[clamp(1.125rem,1.6vw,1.375rem)] leading-[1.6] font-light text-[#d9d9d9]">
              Die Donau hält die Nächte kalt. Was auf unseren Terrassen wächst,
              reift langsamer als anderswo — und behält dabei seine Kanten.
            </p>
          </BlurFade>

          <BlurFade
            delay={420}
            direction="up"
            className="mt-11 flex flex-col items-start gap-7 sm:flex-row sm:items-center sm:gap-10"
          >
            <a
              href="/weinclub"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#ffffff] px-9 py-3 text-[11px] font-semibold tracking-[0.2em] text-[#0b1420] uppercase transition-colors duration-300 hover:bg-[#c0392b] hover:text-[#ffffff] focus-visible:ring-2 focus-visible:ring-[#ffffff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#002450] focus-visible:outline-none"
            >
              Zum Weinclub
            </a>
            <SerifLink href="/rieden" ground="navy">
              Die Rieden entdecken
            </SerifLink>
          </BlurFade>

          {/* Register statt Kennzahlen-Raster: die Lagen als stille Sans-Zeile,
              damit die Serif oben allein die Stimme behält. */}
          <BlurFade delay={560} className="mt-14 border-t border-[#ffffff]/15 pt-6">
            <ul className="flex flex-wrap gap-x-7 gap-y-2">
              {REGISTER.map(riede => (
                <li
                  key={riede}
                  className="text-[10px] font-semibold tracking-[0.28em] text-[#d9d9d9]/70 uppercase"
                >
                  {riede}
                </li>
              ))}
            </ul>
          </BlurFade>
        </div>
      </div>

      {/* Tafel II — zentrierter Serif-Zwischenruf auf eigener Fläche. Nach dem
          asymmetrischen Split die strenge Mitte; keine Bilder, kein Rahmen. */}
      <div className="border-t border-[#ffffff]/10 px-6 py-24 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-2xl text-center">
          <BlurFade delay={60} direction="up">
            <h2 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] font-light tracking-tight text-[#ffffff]">
              Unsere Weine
            </h2>
          </BlurFade>
          <BlurFade delay={180} direction="up">
            <p className="font-display mx-auto mt-7 max-w-xl text-[clamp(1.125rem,2.2vw,1.5rem)] leading-[1.55] font-light text-[#d9d9d9]">
              Jede Flasche ist der Abdruck eines einzigen Hangs —
              nicht mehr, und nicht weniger.
            </p>
          </BlurFade>
          <BlurFade delay={300} direction="up" className="mt-10 flex justify-center">
            <SerifLink href="/sortiment">Das Sortiment ansehen</SerifLink>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
