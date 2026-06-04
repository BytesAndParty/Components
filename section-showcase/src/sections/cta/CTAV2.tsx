import { BlurFade } from '@components/blur-fade/blur-fade'
import { MagneticButton } from '@components/magnetic-button/magnetic-button'
import { AuroraText } from '@components/aurora-text/aurora-text'

export function CTAV2() {
  return (
    <section className="relative overflow-hidden bg-[#fdfcf9] px-6 py-40">
      {/* Subtle Aurora Watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]">
        <AuroraText 
          colors={['#000', '#222', '#444']} 
          speed={0.4} 
          className="text-[30rem] font-bold tracking-tighter"
        >
          JOIN US
        </AuroraText>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <BlurFade delay={100}>
          <span className="mb-8 block text-[11px] font-bold tracking-[0.4em] text-zinc-400 uppercase">
            Exklusiver Zugang
          </span>
        </BlurFade>
        
        <BlurFade delay={200}>
          <h2 className="font-display mb-12 text-7xl leading-none font-light tracking-tight text-zinc-900 lg:text-8xl">
            Werde Teil der <br />
            <span className="italic">Familie.</span>
          </h2>
        </BlurFade>

        <BlurFade delay={300}>
          <p className="mx-auto mb-16 max-w-xl text-xl leading-relaxed font-light text-zinc-500">
            Erhalten Sie Einladungen zu unseren privaten Keller-Tastings und sichern Sie sich Vorabzugriff auf limitierte Sonderfüllungen.
          </p>
        </BlurFade>

        <BlurFade delay={400} className="flex flex-col items-center justify-center gap-10 sm:flex-row">
          <MagneticButton 
            variant="default" 
            className="rounded-none! bg-zinc-900! px-16! py-6! text-lg! text-white! shadow-2xl transition-all hover:bg-zinc-800!"
          >
            Jetzt Registrieren
          </MagneticButton>
          <a href="/versprechen" className="border-b border-zinc-200 pb-1 text-sm font-bold tracking-[0.2em] uppercase transition-colors hover:border-zinc-900">
            Unser Versprechen
          </a>
        </BlurFade>
      </div>
    </section>
  )
}
