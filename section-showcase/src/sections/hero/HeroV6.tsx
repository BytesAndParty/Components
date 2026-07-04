import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'

/**
 * Maison Editorial — layered magazine composition. The headline physically
 * overlaps the photography, a second plate hangs offset below the first,
 * and a vertical meta rail anchors the left edge. Deliberately breaks the
 * two-column hero convention: type and image share the same space.
 *
 * Cream ground (#fdfcf9) — "artisanal minimal" treatment from CLAUDE.md §5.
 */
export function HeroV6() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#fdfcf9] px-6 py-24 lg:px-16 lg:py-32">
      {/* Vertical meta rail — left edge, desktop only */}
      <div className="absolute top-1/2 left-6 hidden -translate-y-1/2 lg:block">
        <BlurFade delay={900} direction="right">
          <span className="block text-[9px] font-bold tracking-[0.45em] whitespace-nowrap text-zinc-400 uppercase [writing-mode:vertical-rl]">
            Wachau · Österreich — Maison seit 1958
          </span>
        </BlurFade>
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Layered composition. On desktop the three blocks are absolutely
            positioned and overlap; on mobile they collapse to a flex column,
            where `order` lifts the headline above the photos so the hero's
            message leads instead of sitting below the fold. */}
        <div className="relative flex flex-col lg:block lg:min-h-[78vh]">
          {/* Primary plate — anchored right, type will overlap it */}
          <div className="lg:absolute lg:top-0 lg:right-0 lg:w-[52%]">
            <RevealImage
              src="https://images.unsplash.com/photo-1543418219-44e30b057fea?w=1600&q=80"
              alt="Steile Riedenterrassen über der Donau im Abendlicht"
              direction="up"
              duration={1500}
              className="aspect-4/5 w-full"
            />
            <BlurFade delay={1000} className="mt-4 flex items-baseline justify-between">
              <span className="font-display text-sm font-light text-zinc-400 italic">
                Ried Loibenberg, Oktober
              </span>
              <span className="text-[9px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
                Fig. 01
              </span>
            </BlurFade>
          </div>

          {/* Secondary plate — hangs lower-left, overlapping the primary */}
          <div className="mt-10 w-2/3 max-w-75 lg:absolute lg:bottom-0 lg:left-[44%] lg:z-20 lg:mt-0 lg:w-[22%] lg:max-w-none">
            <RevealImage
              src="https://images.unsplash.com/photo-1474722883778-792e7990302f?w=900&q=80"
              alt="Rebzeilen im Morgennebel"
              direction="right"
              delay={400}
              duration={1500}
              className="aspect-3/4 w-full shadow-[24px_32px_60px_-24px_rgba(24,24,27,0.25)]"
            />
          </div>

          {/* Headline block — overlaps the primary plate from the left */}
          <div className="relative z-10 order-first mt-0 mb-12 flex flex-col gap-10 lg:absolute lg:top-[12%] lg:left-0 lg:order-0 lg:mt-0 lg:mb-0 lg:max-w-[58%]">
            <BlurFade delay={150} direction="up">
              <span className="text-[11px] font-bold tracking-[0.4em] text-zinc-400 uppercase">
                Domaine Buchart · Édition MMXXVI
              </span>
            </BlurFade>

            <BlurFade delay={300} direction="up">
              <h1 className="font-display text-[clamp(3.5rem,9.5vw,8.5rem)] leading-[0.88] font-light tracking-tighter text-zinc-900">
                Der Jahrgang
                <br />
                wohnt <span className="italic">im</span>
                <br />
                <span className="italic">Stein.</span>
              </h1>
            </BlurFade>

            <BlurFade delay={500} direction="up">
              <p className="max-w-sm text-lg leading-relaxed font-light text-zinc-500">
                Urgestein, Donaunebel und die Geduld von drei Generationen —
                abgefüllt in achtzehn Fässern, nicht mehr.
              </p>
            </BlurFade>

            <BlurFade delay={650} direction="up">
              <a
                href="/sortiment"
                className="group inline-flex min-h-11 items-center gap-5 text-sm font-bold tracking-[0.25em] text-zinc-900 uppercase"
              >
                <span aria-hidden="true" className="h-px w-12 bg-zinc-900 transition-all duration-500 group-hover:w-20" />
                Die Weine
              </a>
            </BlurFade>
          </div>
        </div>

        {/* Bottom meta row — quiet data, hairline above */}
        <BlurFade delay={1100} className="mt-20 lg:mt-28">
          <div className="grid grid-cols-1 gap-6 border-t border-zinc-200 pt-8 sm:grid-cols-3">
            {[
              ['07', 'Rieden in Steillage'],
              ['450 m', 'Über der Donau'],
              ['18', 'Fässer je Jahrgang'],
            ].map(([value, label]) => (
              <div key={label} className="flex items-baseline gap-4">
                <span className="font-display text-3xl font-light text-zinc-900 italic">{value}</span>
                <span className="text-[10px] font-bold tracking-[0.25em] text-zinc-400 uppercase">{label}</span>
              </div>
            ))}
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
