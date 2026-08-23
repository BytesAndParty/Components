import { Particles } from '@components/particles/particles'
import { ShinyText } from '@components/shiny-text/shiny-text'
import { MagneticButton } from '@components/magnetic-button/magnetic-button'
import { BlurFade } from '@components/blur-fade/blur-fade'

/**
 * Cinematic Atmosphere — closing full-bleed moment in HeroV3-Sprache:
 * dieselbe zentrierte Komposition, dieselbe atmosphärische Fotografie mit
 * Partikeln, aber als kurze Finale-Section statt Screen-Hero.
 */
export function CTACinematic() {
  return (
    <section className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1600&q=80"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-60 saturate-[1.15]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-zinc-950/50 via-zinc-950/70 to-zinc-950" />
      </div>

      <Particles
        particleColors={['#fff', 'var(--accent-lifted)']}
        particleCount={90}
        speed={0.1}
        moveParticlesOnHover
        className="pointer-events-none absolute inset-0 z-10"
      />

      <div className="relative z-20 mx-auto max-w-3xl px-6 text-center">
        <BlurFade delay={100}>
          <span className="mb-6 inline-block text-[10px] font-bold tracking-[0.4em] text-accent-lifted uppercase">
            Der letzte Schluck des Abends
          </span>
        </BlurFade>

        <BlurFade delay={200}>
          <h2 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none font-medium tracking-tight text-white">
            Bleiben Sie,
            <br />
            bis der{' '}
            <ShinyText duration={7} shineColor="color-mix(in oklch, var(--accent) 65%, white)">
              Nebel
            </ShinyText>{' '}
            kommt.
          </h2>
        </BlurFade>

        <BlurFade delay={300}>
          <p className="mx-auto mt-8 max-w-lg text-lg leading-relaxed text-zinc-400">
            Ein letztes Glas auf der Terrasse, während die Reben im Dunkel
            verschwinden. Reservieren Sie Ihren Platz für den Abend.
          </p>
        </BlurFade>

        <BlurFade delay={400} className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <MagneticButton variant="primary" className="px-12! py-5! text-base!">
            Tisch reservieren
          </MagneticButton>
          <MagneticButton variant="ghost" className="hover:text-accent-lifted! text-white!">
            Zur Kollektion
          </MagneticButton>
        </BlurFade>
      </div>
    </section>
  )
}
