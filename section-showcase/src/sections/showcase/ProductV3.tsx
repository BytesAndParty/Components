import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'

/**
 * Editorial Spread — an opened magazine double page. Left page is
 * full-bleed photography with a vertical caption rail; right page is
 * the "fiche technique": oversized vintage numeral, hairline data rows
 * and a tasting note set like running text. A center fold line with
 * soft shading sells the print metaphor.
 */

const DATA_ROWS: Array<[string, string]> = [
  ['Riede', 'Loibenberg · Urgestein'],
  ['Rebsorte', 'Grüner Veltliner'],
  ['Ausbau', '18 Monate, großes Holz'],
  ['Alkohol', '12,5 % vol'],
  ['Füllung', '2.400 Flaschen'],
]

export interface ProductV3Props {
  onBack?: () => void
}

export function ProductV3({ onBack }: ProductV3Props) {
  return (
    <section className="bg-[#efece5] px-4 py-24 sm:px-8 lg:py-36">
      {onBack && (
        <BlurFade delay={50} direction="down" className="mx-auto mb-8 max-w-6xl px-2">
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-4 text-xs font-bold tracking-[0.25em] text-zinc-900 uppercase focus-visible:ring-zinc-500 focus-visible:ring-2 focus-visible:outline-none cursor-pointer"
          >
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            <span>Index</span>
          </button>
        </BlurFade>
      )}
      {/* The spread */}
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 bg-white shadow-[0_60px_120px_-40px_rgba(24,24,27,0.35)] lg:grid-cols-2">
        {/* Center fold — desktop only */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden w-16 -translate-x-1/2 lg:block"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(24,24,27,0.07) 46%, rgba(24,24,27,0.16) 50%, rgba(24,24,27,0.07) 54%, transparent)',
          }}
        />

        {/* Left page — photography */}
        <div className="relative">
          <RevealImage
            src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=1400&q=80"
            alt="Flasche Grüner Veltliner im Streiflicht auf Steinmauer"
            direction="up"
            duration={1500}
            className="h-full min-h-[60vh] w-full lg:min-h-[85vh]"
          />
          {/* Vertical caption rail on the photo */}
          <span className="absolute bottom-8 left-6 text-[9px] font-bold tracking-[0.4em] text-white/70 uppercase [writing-mode:vertical-rl]">
            Photographie · Hofarchiv, Tafel XII
          </span>
          {/* Page number, print-style */}
          <span className="absolute bottom-6 right-8 hidden text-[10px] font-medium tracking-[0.2em] text-white/60 lg:block">
            14
          </span>
        </div>

        {/* Right page — fiche technique */}
        <div className="relative flex flex-col justify-between gap-16 px-8 py-16 lg:px-16 lg:py-20">
          <div className="flex flex-col gap-12">
            {/* Masthead row */}
            <BlurFade delay={200} className="flex items-baseline justify-between border-b border-zinc-200 pb-5">
              <span className="text-[10px] font-bold tracking-[0.35em] text-zinc-400 uppercase">
                Fiche Technique
              </span>
              <span className="font-display text-sm font-light text-zinc-400 italic">№ 4 / 18</span>
            </BlurFade>

            {/* Vintage numeral + name */}
            <div>
              <BlurFade delay={350}>
                <span className="font-display block text-[clamp(6rem,14vw,11rem)] leading-[0.8] font-light tracking-tighter text-zinc-900">
                  ’21
                </span>
              </BlurFade>
              <BlurFade delay={500}>
                <h2 className="font-display mt-6 text-4xl leading-tight font-light tracking-tight text-zinc-900 lg:text-5xl">
                  Loibenberg <span className="italic">Smaragd</span>
                </h2>
              </BlurFade>
            </div>

            {/* Tasting note as running editorial text */}
            <BlurFade delay={650}>
              <p className="max-w-md text-base leading-relaxed font-light text-zinc-500">
                Rauch über nassem Stein, dahinter Quitte und weißer Pfeffer.
                Am Gaumen straff, fast streng — dann öffnet sich der Wein,
                wie es nur alte Reben können. Der Abgang bleibt Minuten.
              </p>
            </BlurFade>

            {/* Hairline data rows */}
            <div className="flex flex-col">
              {DATA_ROWS.map(([label, value], i) => (
                <BlurFade key={label} delay={750 + i * 90}>
                  <div className="flex items-baseline justify-between gap-6 border-b border-zinc-100 py-3.5">
                    <span className="text-[10px] font-bold tracking-[0.25em] text-zinc-400 uppercase">
                      {label}
                    </span>
                    <span className="font-display text-base font-light text-zinc-800 italic">
                      {value}
                    </span>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>

          {/* Footer of the page: price + quiet CTA + page number */}
          <BlurFade delay={1250} className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold tracking-[0.25em] text-zinc-400 uppercase">Ab Hof</span>
              <span className="font-display text-3xl font-light text-zinc-900">€ 38,—</span>
            </div>
            <a
              href="/sortiment/loibenberg-smaragd"
              className="group inline-flex min-h-11 items-center gap-4 pb-1 text-xs font-bold tracking-[0.25em] text-zinc-900 uppercase"
            >
              Anfragen
              <span aria-hidden="true" className="h-px w-10 bg-zinc-900 transition-all duration-500 group-hover:w-16" />
            </a>
          </BlurFade>

          <span className="absolute bottom-6 left-8 hidden text-[10px] font-medium tracking-[0.2em] text-zinc-300 lg:block">
            15
          </span>
        </div>
      </div>

      {/* Spread caption below, like a printed legend */}
      <BlurFade delay={1400} className="mx-auto mt-10 flex max-w-6xl items-center justify-between px-2">
        <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
          Aus dem Jahrgangsheft MMXXVI
        </span>
        <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
          Doppelseite 14–15
        </span>
      </BlurFade>
    </section>
  )
}
