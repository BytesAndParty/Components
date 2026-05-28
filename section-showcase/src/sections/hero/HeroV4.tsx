import { BlurFade } from '@components/blur-fade/blur-fade'
import { MagneticButton } from '@components/magnetic-button/magnetic-button'
import { ShinyText } from '@components/shiny-text/shiny-text'
import { AmbientImage } from '@components/ambient-image/ambient-image'

export function HeroV4() {
  return (
    <section className="relative min-h-[90vh] w-full bg-[#fdfcf9] flex items-center justify-center overflow-hidden py-24 px-6">
      <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-20 items-center">
        
        {/* Text Side - Extreme Typography with subtle component polish */}
        <div className="flex flex-col gap-12">
          <BlurFade delay={100} direction="up">
            <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-zinc-400">
              Familientradition seit 1958
            </span>
          </BlurFade>

          <BlurFade delay={200} direction="up">
            <h1 className="font-display text-[clamp(3.5rem,10vw,7.5rem)] font-light leading-[0.9] tracking-tighter text-zinc-900">
              Charakter. <br />
              <span className="italic pl-[0.1em] text-zinc-800">Herkunft.</span> <br />
              <ShinyText 
                duration={12} 
                shineColor="oklch(0.85 0.03 90 / 0.5)" 
                className="!inline-block"
              >
                Hingabe.
              </ShinyText>
            </h1>
          </BlurFade>

          <BlurFade delay={300} direction="up">
            <p className="max-w-md text-xl leading-relaxed text-zinc-500 font-light">
              Weine, die die Sprache ihrer Böden sprechen. Unverfälscht, präzise und mit der Geduld von Generationen gekeltert.
            </p>
          </BlurFade>

          <BlurFade delay={400} direction="up" className="flex items-center gap-10">
            <MagneticButton variant="default" className="!bg-zinc-900 !text-white !rounded-none !px-12 !py-5 !text-base hover:!bg-zinc-800 transition-colors">
              Sortiment entdecken
            </MagneticButton>
            <a href="#" className="text-sm font-bold tracking-widest uppercase border-b border-zinc-200 pb-1 hover:border-zinc-900 transition-colors">
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
              className="w-full max-w-[500px] aspect-[4/5] shadow-[40px_40px_80px_-20px_rgba(0,0,0,0.1)]"
            />
          </BlurFade>
          
          {/* Subtle Float Detail */}
          <BlurFade delay={700} className="absolute -bottom-10 -left-10 hidden xl:block z-20">
            <div className="bg-white p-8 border border-zinc-100 shadow-xl max-w-[200px]">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 block mb-2">Auszeichnung</span>
              <p className="text-sm font-display text-zinc-800 italic">"Ein Monument der Wachau – präzise wie ein Uhrwerk."</p>
            </div>
          </BlurFade>
        </div>
      </div>

      {/* Minimal Scroll Indicator */}
      <div className="absolute bottom-10 left-6 flex flex-col items-start gap-4 opacity-30">
        <div className="h-20 w-px bg-zinc-900" />
        <span className="text-[9px] font-bold uppercase tracking-[0.3em] rotate-90 origin-left ml-px mt-2 text-zinc-900">Scroll</span>
      </div>
    </section>
  )
}
