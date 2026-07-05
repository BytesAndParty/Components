import { BlurFade } from '@components/blur-fade/blur-fade'
import { LightRays } from '@components/light-rays/light-rays'
import { Particles } from '@components/particles/particles'
import { ShinyText } from '@components/shiny-text/shiny-text'

/**
 * Nocturne — cinematic cellar hero. Candle-gold light falls through the
 * hatch (LightRays), dust hangs in the beam (Particles), and the
 * typography sits low-left like a film title card instead of centered.
 * Warm black, chiaroscuro, a ghost vintage numeral glowing far right.
 */
export function HeroV8() {
  return (
    <section className="relative flex h-screen min-h-[720px] w-full items-end overflow-hidden bg-[#0d0a09]">
      {/* Background — cellar photography, heavily darkened */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=1600&q=80"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#0d0a09]/40 via-transparent to-[#0d0a09]" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0d0a09]/70 via-transparent to-[#0d0a09]/50" />
      </div>

      {/* Light through the cellar hatch */}
      <LightRays
        raysOrigin="top-center"
        raysColor="#c9a25e"
        raysSpeed={0.6}
        lightSpread={0.7}
        rayLength={2.4}
        pulsating
        className="pointer-events-none absolute inset-0 z-10 opacity-60"
      />

      {/* Dust in the beam */}
      <Particles
        particleColors={['#e8d5ae', '#c9a25e']}
        particleCount={90}
        speed={0.08}
        particleBaseSize={60}
        className="pointer-events-none absolute inset-0 z-10"
      />

      {/* Ghost vintage numeral — far right, barely lit */}
      <span
        aria-hidden="true"
        className="font-display pointer-events-none absolute right-4 bottom-24 z-10 hidden text-[16rem] leading-none font-light tracking-tighter text-[#c9a25e]/[0.07] italic select-none lg:block"
      >
        58
      </span>

      {/* Title card — low left */}
      <div className="relative z-20 w-full px-6 pb-20 lg:px-16 lg:pb-24">
        <div className="mx-auto max-w-7xl">
          <BlurFade delay={150} direction="up">
            <span className="mb-6 inline-block text-[10px] font-bold tracking-[0.45em] text-[#c9a25e] uppercase">
              Zwölf Meter unter dem Weinberg
            </span>
          </BlurFade>

          <BlurFade delay={300} direction="up">
            <h1 className="font-display max-w-4xl text-[clamp(3rem,8.5vw,7.5rem)] leading-[0.92] font-light tracking-tight text-[#f3ece0]">
              Hier unten zählt
              <br />
              nur die <span className="italic"><ShinyText duration={7} shineColor="#e8d5ae">Zeit.</ShinyText></span>
            </h1>
          </BlurFade>

          <BlurFade delay={500} direction="up">
            <p className="mt-8 max-w-xl text-lg leading-relaxed font-light text-[#a89a85]">
              Neun Grad, kein Tageslicht, achtzehn Fässer. Was hier reift,
              hat es nicht eilig — und wer hier absteigt, auch nicht mehr.
            </p>
          </BlurFade>

          <BlurFade delay={650} direction="up" className="mt-12 flex flex-col gap-7 sm:flex-row sm:items-center sm:gap-12">
            <a
              href="/kollektion"
              className="inline-flex min-h-11 items-center border border-[#c9a25e]/70 px-10 py-4 text-xs font-bold tracking-[0.25em] text-[#e8d5ae] uppercase transition-all duration-300 hover:border-[#c9a25e] hover:bg-[#c9a25e]/10 hover:shadow-[0_0_40px_-10px_rgba(201,162,94,0.45)] focus-visible:ring-2 focus-visible:ring-[#c9a25e]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0a09] focus-visible:outline-none"
            >
              In den Keller
            </a>
            <a
              href="/geschichte"
              className="group inline-flex min-h-11 items-center gap-4 text-xs font-bold tracking-[0.25em] text-[#a89a85] uppercase transition-colors hover:text-[#e8d5ae] focus-visible:ring-2 focus-visible:ring-[#c9a25e]/70 focus-visible:outline-none"
            >
              <span aria-hidden="true" className="h-px w-10 bg-current transition-all duration-500 group-hover:w-16" />
              Seit 1958
            </a>
          </BlurFade>
        </div>
      </div>

      {/* Scroll cue */}
      <BlurFade delay={1100} className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex">
        <span className="text-[9px] font-bold tracking-[0.3em] text-[#6b5f50] uppercase">Tiefer</span>
        <div aria-hidden="true" className="h-12 w-px bg-linear-to-b from-[#c9a25e] to-transparent" />
      </BlurFade>
    </section>
  )
}
