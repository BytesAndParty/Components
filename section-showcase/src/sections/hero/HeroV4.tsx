import { BlurFade } from '@components/blur-fade/blur-fade'
import { MagneticButton } from '@components/magnetic-button/magnetic-button'
import { ShinyText } from '@components/shiny-text/shiny-text'
import { AmbientImage } from '@components/ambient-image/ambient-image'

export function HeroV4() {
  return (
    <section className="relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden bg-[#fdfcf9] px-6 py-16 sm:py-24">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-20 lg:grid-cols-[1fr_0.8fr]">
        
        {/* Text Side - Extreme Typography with subtle component polish */}
        <div className="flex flex-col gap-12">
          <BlurFade delay={100} direction="up">
            <span className="text-[11px] font-bold tracking-[0.4em] text-zinc-400 uppercase">
              Familientradition seit 1958
            </span>
          </BlurFade>

          <BlurFade delay={200} direction="up">
            <h1 className="font-display text-[clamp(3.5rem,10vw,7.5rem)] leading-[0.9] font-light tracking-tighter text-zinc-900">
              Charakter. <br />
              <span className="pl-[0.1em] text-zinc-800 italic">Herkunft.</span> <br />
              <ShinyText 
                duration={12} 
                shineColor="oklch(0.85 0.03 90 / 0.5)" 
                className="inline-block!"
              >
                Hingabe.
              </ShinyText>
            </h1>
          </BlurFade>

          <BlurFade delay={300} direction="up">
            <p className="max-w-md text-xl leading-relaxed font-light text-zinc-500">
              Weine, die die Sprache ihrer Böden sprechen. Unverfälscht, präzise und mit der Geduld von Generationen gekeltert.
            </p>
          </BlurFade>

          <BlurFade delay={400} direction="up" className="flex items-center gap-10">
            <MagneticButton variant="default" className="rounded-none! bg-zinc-900! px-12! py-5! text-base! text-white! transition-colors hover:bg-zinc-800!">
              Sortiment entdecken
            </MagneticButton>
            <a href="/weingut" className="border-b border-zinc-200 pb-1 text-sm font-bold tracking-widest uppercase transition-colors hover:border-zinc-900">
              Das Weingut
            </a>
          </BlurFade>
        </div>

        {/* Image Side - Ambient Image integration */}
        <div className="relative flex justify-center lg:justify-end">
          <BlurFade delay={500} direction="right">
            <AmbientImage 
              src="https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=1200&q=80" 
              alt="Bottles in a minimalist setting" 
              borderRadius="0"
              intensity={0.15}
              blur={80}
              className="aspect-4/5 w-full max-w-[500px] shadow-[40px_40px_80px_-20px_rgba(0,0,0,0.1)]"
            />
          </BlurFade>
          
          {/* Subtle Float Detail */}
          <BlurFade delay={700} className="absolute -bottom-10 -left-10 z-20 hidden xl:block">
            <div className="max-w-[200px] border border-zinc-100 bg-white p-8 shadow-xl">
              <span className="mb-2 block text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Auszeichnung</span>
              <p className="font-display text-sm text-zinc-800 italic">"Ein Monument der Wachau – präzise wie ein Uhrwerk."</p>
            </div>
          </BlurFade>
        </div>
      </div>

      {/* Minimal Scroll Indicator */}
      <div className="absolute bottom-10 left-6 flex flex-col items-start gap-4 opacity-30">
        <div className="h-20 w-px bg-zinc-900" />
        <span className="mt-2 ml-px origin-left rotate-90 text-[9px] font-bold tracking-[0.3em] text-zinc-900 uppercase">Scroll</span>
      </div>
    </section>
  )
}
