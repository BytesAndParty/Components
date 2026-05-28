import { BlurFade } from '@components/blur-fade/blur-fade'
import { MagneticButton } from '@components/magnetic-button/magnetic-button'
import { AuroraText } from '@components/aurora-text/aurora-text'

export function CTAV2() {
  return (
    <section className="relative bg-[#fdfcf9] py-40 px-6 overflow-hidden">
      {/* Subtle Aurora Watermark */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
        <AuroraText 
          colors={['#000', '#222', '#444']} 
          speed={0.4} 
          className="text-[30rem] font-bold tracking-tighter"
        >
          JOIN US
        </AuroraText>
      </div>

      <div className="mx-auto max-w-4xl relative z-10 text-center">
        <BlurFade delay={100}>
          <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-zinc-400 mb-8 block">
            Exklusiver Zugang
          </span>
        </BlurFade>
        
        <BlurFade delay={200}>
          <h2 className="font-display text-7xl lg:text-8xl font-light text-zinc-900 tracking-tight leading-[1] mb-12">
            Werde Teil der <br />
            <span className="italic">Familie.</span>
          </h2>
        </BlurFade>

        <BlurFade delay={300}>
          <p className="mx-auto max-w-xl text-xl text-zinc-500 font-light mb-16 leading-relaxed">
            Erhalten Sie Einladungen zu unseren privaten Keller-Tastings und sichern Sie sich Vorabzugriff auf limitierte Sonderfüllungen.
          </p>
        </BlurFade>

        <BlurFade delay={400} className="flex flex-col sm:flex-row items-center justify-center gap-10">
          <MagneticButton 
            variant="default" 
            className="!bg-zinc-900 !text-white !rounded-none !px-16 !py-6 !text-lg hover:!bg-zinc-800 transition-all shadow-2xl"
          >
            Jetzt Registrieren
          </MagneticButton>
          <a href="#" className="text-sm font-bold tracking-[0.2em] uppercase border-b border-zinc-200 pb-1 hover:border-zinc-900 transition-colors">
            Unser Versprechen
          </a>
        </BlurFade>
      </div>
    </section>
  )
}
