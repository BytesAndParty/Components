import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'
import { ShinyText } from '@components/shiny-text/shiny-text'

/**
 * Domaine Privée — symmetric estate composition around a single arch window.
 * The Rundbogen (arch) is the signature of the "Domaine Privée" premium line:
 * limestone cream ground, bordeaux ink, engraved hairlines, centered axis.
 * The headline tucks over the arch's crown; vertical meta rails flank it.
 */
export function HeroV7() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#f6f3ec] px-6 py-14 lg:px-16">
      <div className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-6xl flex-col">
        {/* Top meta row — engraved hairline */}
        <BlurFade delay={100} direction="down">
          <div className="flex items-baseline justify-between border-b border-[#ddd5c4] pb-5">
            <span className="text-[10px] font-bold tracking-[0.4em] text-[#8a8070] uppercase">
              Domaine Privée
            </span>
            <span className="hidden text-[10px] font-bold tracking-[0.4em] text-[#8a8070] uppercase sm:block">
              Wachau · Österreich
            </span>
            <span className="text-[10px] font-bold tracking-[0.4em] text-[#8a8070] uppercase">
              Anno 1958
            </span>
          </div>
        </BlurFade>

        {/* Center composition — headline crowns the arch */}
        <div className="relative flex flex-1 flex-col items-center justify-center pt-14 lg:pt-16">
          {/* Flanking rails — desktop only, perfectly symmetric */}
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden items-center lg:flex">
            <BlurFade delay={900} direction="right">
              <span className="block text-[9px] font-bold tracking-[0.45em] whitespace-nowrap text-[#a89e8a] uppercase [writing-mode:vertical-rl]">
                Grüner Veltliner · Riesling · St. Laurent
              </span>
            </BlurFade>
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden items-center lg:flex">
            <BlurFade delay={900} direction="left">
              <span className="block rotate-180 text-[9px] font-bold tracking-[0.45em] whitespace-nowrap text-[#a89e8a] uppercase [writing-mode:vertical-rl]">
                Handlese seit drei Generationen
              </span>
            </BlurFade>
          </div>

          <BlurFade delay={250} direction="up" className="relative z-10 text-center">
            <span className="mb-6 block">
              <ShinyText
                duration={9}
                shineColor="oklch(0.78 0.08 85 / 0.5)"
                className="font-display text-lg font-light text-[#8a8070]! italic"
              >
                Édition Automne MMXXVI
              </ShinyText>
            </span>
            <h1 className="font-display text-[clamp(3.25rem,9vw,7.5rem)] leading-[0.92] font-light tracking-tight text-[#221b16]">
              Wein aus
              <br />
              der <span className="italic text-[#5c2331]">Stille.</span>
            </h1>
          </BlurFade>

          {/* The arch — image tucks under the headline's baseline */}
          <div className="relative -mt-6 w-[min(72vw,340px)] sm:-mt-10 lg:-mt-14 lg:w-[380px]">
            <RevealImage
              src="https://images.unsplash.com/photo-1543418219-44e30b057fea?w=1600&q=80"
              alt="Steile Weinbergterrassen über der Donau im Abendlicht"
              direction="up"
              duration={1600}
              className="aspect-[3/4.4] w-full rounded-t-full"
            />
            {/* Hairline echo of the arch */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-4 rounded-t-full border border-[#ddd5c4]"
            />
          </div>

          <BlurFade delay={700} direction="up" className="mt-12">
            <p className="mx-auto max-w-md text-center text-lg leading-relaxed font-light text-[#6f6657]">
              Achtzehn Fässer je Jahrgang. Kein Fass mehr, keines weniger —
              so viel Wein, wie der Berg freiwillig hergibt.
            </p>
          </BlurFade>

          <BlurFade delay={850} direction="up" className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
            <a
              href="/kollektion"
              className="inline-flex min-h-11 items-center bg-[#5c2331] px-10 py-3.5 text-xs font-bold tracking-[0.25em] text-[#f6f3ec] uppercase transition-all duration-300 hover:bg-[#471a26] hover:shadow-[0_12px_32px_-12px_rgba(92,35,49,0.5)] focus-visible:ring-2 focus-visible:ring-[#5c2331]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f3ec] focus-visible:outline-none"
            >
              Die Kollektion
            </a>
            <a
              href="/geschichte"
              className="group inline-flex min-h-11 items-center gap-4 text-xs font-bold tracking-[0.25em] text-[#221b16] uppercase focus-visible:ring-2 focus-visible:ring-[#5c2331]/60 focus-visible:outline-none"
            >
              <span aria-hidden="true" className="h-px w-10 bg-[#221b16] transition-all duration-500 group-hover:w-16" />
              Unsere Geschichte
            </a>
          </BlurFade>
        </div>

        {/* Bottom caption row */}
        <BlurFade delay={1100}>
          <div className="mt-14 flex items-baseline justify-between border-t border-[#ddd5c4] pt-5">
            <span className="text-[9px] font-bold tracking-[0.3em] text-[#a89e8a] uppercase">
              Fig. 01
            </span>
            <span className="font-display text-sm font-light text-[#8a8070] italic">
              Ried Achleiten, letzte Oktoberwoche
            </span>
            <span className="text-[9px] font-bold tracking-[0.3em] text-[#a89e8a] uppercase">
              450 m
            </span>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
