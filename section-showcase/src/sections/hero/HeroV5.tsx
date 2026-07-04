import { BlurFade } from '@components/blur-fade/blur-fade'
import { AuroraText } from '@components/aurora-text/aurora-text'
import { Particles } from '@components/particles/particles'
import { MagneticButton } from '@components/magnetic-button/magnetic-button'

export function HeroV5() {
  return (
    <section className="relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden bg-zinc-950 px-6 py-24 text-white">
      {/* Background Particles */}
      <Particles
        className="absolute inset-0 z-0"
        particleCount={80}
        speed={0.5}
        particleColors={['#ffffff']}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <BlurFade delay={100}>
          <span className="mb-8 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-bold tracking-[0.3em] text-white/60 uppercase backdrop-blur-md">
            The Future of Fine Wine
          </span>
        </BlurFade>

        <BlurFade delay={200}>
          <h1 className="font-display mb-10 text-[clamp(3rem,12vw,8.5rem)] leading-[0.85] font-light tracking-tighter sm:mb-12">
            Experience <br />
            <AuroraText 
              variant="gradient" 
              colors={['#f43f5e', '#fb923c', '#d946ef', '#6366f1']}
              className="italic"
            >
              Excellence.
            </AuroraText>
          </h1>
        </BlurFade>

        <BlurFade delay={300}>
          <p className="mx-auto mb-16 max-w-xl text-lg leading-relaxed font-light text-zinc-400 sm:text-xl">
            Where tradition meets technology. Discover a curated selection of the world's most exceptional vintages, authenticated by the blockchain.
          </p>
        </BlurFade>

        <BlurFade delay={400} className="flex flex-col items-center justify-center gap-8 sm:flex-row">
          <MagneticButton 
            className="rounded-full! bg-white! px-12! py-5! text-base! font-bold! text-black! transition-transform hover:scale-105!"
          >
            Explore Collection
          </MagneticButton>
          
          <a 
            href="#how-it-works" 
            className="group flex min-h-11 items-center gap-3 text-sm font-bold tracking-widest text-white uppercase transition-colors hover:text-white/70"
          >
            How it works
            <span className="h-px w-8 bg-white/20 transition-all group-hover:w-12 group-hover:bg-white" />
          </a>
        </BlurFade>
      </div>

      {/* Decorative Grid Overlays */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20 mask-[radial-gradient(ellipse_at_center,black,transparent_80%)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>
    </section>
  )
}
