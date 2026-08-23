import { Particles } from '@components/particles/particles'
import { ShinyText } from '@components/shiny-text/shiny-text'
import { MagneticButton } from '@components/magnetic-button/magnetic-button'
import { BlurFade } from '@components/blur-fade/blur-fade'

export function HeroV3() {
  return (
    <section className="relative flex h-screen min-h-[700px] w-full items-center justify-center overflow-hidden bg-zinc-950">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=1600&q=80"
          alt="Atmospheric Vineyard"
          className="h-full w-full object-cover opacity-65 saturate-[1.15]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-zinc-950/45 via-zinc-950/65 to-zinc-950" />
      </div>

      {/* Atmospheric Particles */}
      <Particles 
        particleColors={['#fff', 'var(--accent-lifted)']} 
        particleCount={150} 
        speed={0.15} 
        moveParticlesOnHover
        className="pointer-events-none absolute inset-0 z-10" 
      />

      <div className="relative z-20 mx-auto max-w-4xl px-6 text-center">
        <BlurFade delay={100}>
          <span className="text-accent-lifted mb-6 inline-block text-[10px] font-bold tracking-[0.4em] uppercase">
            Ethereal Wine Experience
          </span>
        </BlurFade>

        <BlurFade delay={200}>
          {/* text-white ist bewusst theme-unabhängig — die Section ist immer dunkel.
              Der Shine mischt den aktiven Akzent hell auf, damit er auf der weißen
              Basis in beiden Themes sichtbar bleibt. */}
          <h1 className="font-display text-[clamp(3rem,8vw,6rem)] leading-none font-medium tracking-tight text-white">
            <ShinyText duration={6} shineColor="color-mix(in oklch, var(--accent) 65%, white)">
              The Soul of the Grape
            </ShinyText>
          </h1>
        </BlurFade>

        <BlurFade delay={300}>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-zinc-400">
            Eintauchen in eine Welt, in der jeder Schluck eine Geschichte erzählt. Unsere Kollektion ist eine Hommage an die Natur und die Zeit.
          </p>
        </BlurFade>

        <BlurFade delay={400} className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <MagneticButton variant="primary" className="px-12! py-5! text-base!">
            Kollektion entdecken
          </MagneticButton>
          <MagneticButton variant="ghost" className="hover:text-accent-lifted! text-white!">
            Unsere Vision
          </MagneticButton>
        </BlurFade>
      </div>

      {/* Scroll indicator */}
      <BlurFade delay={1000} className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="text-[9px] font-bold tracking-[0.3em] text-zinc-400 uppercase">Scroll</span>
        <div className="from-accent-lifted h-12 w-px bg-linear-to-b to-transparent" />
      </BlurFade>
    </section>
  )
}
